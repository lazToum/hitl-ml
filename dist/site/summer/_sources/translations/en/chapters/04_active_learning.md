---
jupytext:
  formats: md:myst
  text_representation:
    extension: .md
    format_name: myst
kernelspec:
  display_name: Python 3
  language: python
  name: python3
---

# Active Learning

Labeled data is expensive. The core insight of active learning is that *not all unlabeled examples are equally informative* — a model can improve faster if it gets to choose which examples to ask about. Rather than labeling data randomly, an active learning system queries an oracle (usually a human annotator) on the examples most likely to improve the model.

This chapter covers the theory and practice of active learning: query strategies, sampling frameworks, stopping criteria, and practical considerations for real deployments.

---

## The Active Learning Setup

The standard **pool-based active learning** setting involves:

- A **labeled set** $\mathcal{L} = \{(x_i, y_i)\}_{i=1}^n$ — initially small
- An **unlabeled pool** $\mathcal{U} = \{x_j\}_{j=1}^m$ — typically much larger than $\mathcal{L}$
- An **oracle** $\mathcal{O}$ that can return $y = \mathcal{O}(x)$ for any queried $x$
- A **query strategy** $\phi$ that selects the next query $x^* = \phi(\mathcal{L}, \mathcal{U}, f_\theta)$

The active learning loop:

```text
    1. Initialize: L = small labeled seed set, U = unlabeled pool
    2. Train: f_θ ← train(L)
    3. Query: x* = argmax φ(x; f_θ) over x ∈ U
    4. Label: y* = O(x*)
    5. Update: L ← L ∪ {(x*, y*)}, U ← U \ {x*}
    → Repeat from 2 until budget exhausted
```

The goal is to reach a target model quality using as few oracle queries as possible.

---

## Theoretical Foundations

A natural question is: how much can active learning help? In the best case, active learning can achieve *exponential* reductions in label complexity — reaching error $\epsilon$ with $O(\log(1/\epsilon))$ labels rather than the $O(1/\epsilon)$ needed by passive learning, at least in realizable settings with a good query strategy {cite}`settles2009active`.

In practice, guarantees are harder to obtain. **Agnostic active learning** {cite}`balcan2006agnostic` shows that label savings are possible even when the target concept is not in the hypothesis class, but the savings depend strongly on the disagreement coefficient — a measure of how quickly the set of plausible hypotheses shrinks as data accumulates.

The key practical implication: active learning's advantage is largest when the **decision boundary is simple and concentrated** (so uncertainty queries quickly eliminate wrong hypotheses), and smallest when the hypothesis class is large or the boundary is complex.

---

## Query Strategies

### Uncertainty Sampling

The simplest and most widely used strategy: query the example on which the model is *most uncertain* {cite}`lewis1994sequential`.

**Least confidence** queries the example for which the model is least confident in its top prediction:

$$
x^* = \argmax_{x \in \mathcal{U}} \left(1 - P_\theta(\hat{y} \mid x)\right)
$$

**Margin sampling** considers the gap between the top two predicted probabilities:

$$
x^* = \argmin_{x \in \mathcal{U}} \left(P_\theta(\hat{y}_1 \mid x) - P_\theta(\hat{y}_2 \mid x)\right)
$$

**Entropy sampling** uses the full predicted distribution:

$$
x^* = \argmax_{x \in \mathcal{U}} \left( -\sum_{k=1}^K P_\theta(y_k \mid x) \log P_\theta(y_k \mid x) \right)
$$

Entropy sampling is the most principled of the three — it considers all classes — and generally outperforms the others on multiclass problems.

### Query by Committee (QbC)

Train a **committee** of $C$ models (using bagging, different initializations, or different architectures). Query the example on which the committee disagrees most:

$$
x^* = \argmax_{x \in \mathcal{U}} \; \text{disagreement}(\{f_c(x)\}_{c=1}^C)
$$

Disagreement can be measured as **vote entropy** (entropy over the committee's majority votes) or **KL divergence** from the consensus distribution.

QbC provides better uncertainty estimates than a single model but requires training multiple models, which is computationally expensive.

### Expected Model Change

Query the example that would cause the greatest change to the current model if labeled. For gradient-based models, this corresponds to the example with the greatest expected gradient magnitude {cite}`settles2008analysis`:

$$
x^* = \argmax_{x \in \mathcal{U}} \sum_{y \in \mathcal{Y}} P_\theta(y \mid x) \left\| \nabla_\theta \mathcal{L}(f_\theta(x), y) \right\|
$$

This strategy has strong theoretical motivation but requires computing gradients for each candidate, making it expensive for large models.

### Core-Set / Geometric Approaches

Uncertainty-based strategies can be **biased toward outliers**: an unusual example may be highly uncertain but not representative of the data distribution. Core-set methods address this by seeking a diverse sample that covers the feature space.

The **k-center greedy** algorithm {cite}`sener2018active` finds the smallest set of points such that every unlabeled point is within $\delta$ of at least one queried point:

$$
x^* = \argmax_{x \in \mathcal{U}} \min_{x' \in \mathcal{L}} d(x, x')
$$

i.e., query the point farthest from any currently labeled point. This encourages a well-spread set of annotations.

### BADGE

**Batch Active learning by Diverse Gradient Embeddings** {cite}`ash2020deep` combines uncertainty and diversity: it selects a batch of examples whose gradient embeddings (with respect to the predicted label) are both large in magnitude (uncertain) and diverse (covering different regions of the gradient space). This is one of the most competitive modern strategies.

---

## Uncertainty Estimation for Deep Models

The strategies above assume access to calibrated probability outputs from the model. For simple models (logistic regression, softmax classifiers), this is straightforward. For deep networks, getting reliable uncertainty estimates requires additional technique.

### Two Kinds of Uncertainty

Following Kendall and Gal {cite}`kendall2017uncertainties`, we distinguish:

**Aleatoric uncertainty** (data uncertainty): inherent noise in the observations that cannot be reduced by collecting more data. A blurry image is aleatorically uncertain — no amount of additional training data from the same distribution will make the model more confident on it.

**Epistemic uncertainty** (model uncertainty): uncertainty due to limited training data or a model that has not seen similar examples. Epistemic uncertainty *can* be reduced by labeling more data — and is therefore the relevant quantity for active learning query selection.

For active learning, we want to query examples with high epistemic uncertainty, not high aleatoric uncertainty. Querying a fundamentally ambiguous example wastes the oracle's effort: no label they provide will be clearly correct.

### Monte Carlo Dropout

A practical approach to epistemic uncertainty estimation for neural networks is **MC Dropout** {cite}`gal2016dropout`: apply dropout at inference time and run $T$ forward passes. The variance across predictions is an estimate of epistemic uncertainty.

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn

torch.manual_seed(42)
rng = np.random.default_rng(42)

class MCDropoutNet(nn.Module):
    def __init__(self, input_dim=20, hidden=64, output_dim=2, p_drop=0.3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden), nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, hidden),    nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, output_dim)
        )

    def forward(self, x):
        return self.net(x)

def mc_uncertainty(model, x, T=30):
    """
    Run T stochastic forward passes with dropout active.
    Returns mean prediction and epistemic uncertainty (predictive variance).
    """
    model.train()  # keep dropout active during inference
    with torch.no_grad():
        preds = torch.stack([
            torch.softmax(model(x), dim=-1) for _ in range(T)
        ])  # shape: (T, N, C)
    mean_pred = preds.mean(0)
    # Epistemic uncertainty: mean of variances across passes
    epistemic = preds.var(0).sum(-1)
    # Aleatoric uncertainty: entropy of mean prediction
    aleatoric = -(mean_pred * (mean_pred + 1e-9).log()).sum(-1)
    return mean_pred, epistemic, aleatoric

# Quick demonstration
model = MCDropoutNet(input_dim=20, output_dim=2)
# In-distribution example (simulated)
x_familiar   = torch.randn(1, 20) * 0.5
# Out-of-distribution example (far from training distribution)
x_unfamiliar = torch.randn(1, 20) * 3.0

for name, x in [("In-distribution ", x_familiar), ("Out-of-distribution", x_unfamiliar)]:
    _, ep, al = mc_uncertainty(model, x)
    print(f"{name} | epistemic: {ep.item():.4f} | aleatoric: {al.item():.4f}")
```

In the untrained network above, both examples show similar uncertainty. After training, the out-of-distribution example will show higher epistemic uncertainty — the model has not learned a reliable mapping for inputs far from the training distribution.

### Deep Ensembles

Training $M$ independently initialized models and averaging their predictions provides a simpler and often more reliable uncertainty estimate than MC Dropout {cite}`lakshminarayanan2017simple`. The disagreement between ensemble members is the epistemic uncertainty signal.

For active learning at scale, both MC Dropout and deep ensembles add overhead proportional to $T$ or $M$ forward passes. In practice, $T = 10$–$30$ for MC Dropout or $M = 5$ ensemble members is often sufficient to rank examples by epistemic uncertainty, even if the absolute values are not well-calibrated.

---

## A Full Active Learning Loop

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from copy import deepcopy

rng = np.random.default_rng(42)

# Generate dataset
X, y = make_classification(
    n_samples=2000, n_features=20, n_informative=10,
    n_classes=3, n_clusters_per_class=1, random_state=42
)
X_train, y_train = X[:1500], y[:1500]
X_test,  y_test  = X[1500:], y[1500:]

def entropy_query(model, X_pool):
    """Return index of most uncertain sample (entropy)."""
    probs = model.predict_proba(X_pool)
    ent = -np.sum(probs * np.log(probs + 1e-9), axis=1)
    return np.argmax(ent)

def random_query(X_pool):
    """Random baseline."""
    return rng.integers(0, len(X_pool))

def run_active_learning(strategy='entropy', n_initial=30, n_queries=120, query_batch=5):
    labeled_idx = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled_idx = [i for i in range(len(X_train)) if i not in labeled_idx]
    accs = []

    for step in range(n_queries // query_batch):
        model = LogisticRegression(max_iter=500, C=1.0)
        model.fit(X_train[labeled_idx], y_train[labeled_idx])
        accs.append(accuracy_score(y_test, model.predict(X_test)))

        # Query
        X_pool = X_train[unlabeled_idx]
        for _ in range(query_batch):
            if strategy == 'entropy':
                q = entropy_query(model, X_pool)
            else:
                q = random_query(X_pool)
            labeled_idx.append(unlabeled_idx.pop(q))
            X_pool = X_train[unlabeled_idx]

    return np.array(accs)

labels_used = np.arange(1, 25) * 5 + 30  # label counts at each step

accs_active = run_active_learning(strategy='entropy')
accs_random = run_active_learning(strategy='random')

plt.figure(figsize=(8, 5))
plt.plot(labels_used, accs_active, 'o-', label='Entropy sampling', color='#2b3a8f', linewidth=2)
plt.plot(labels_used, accs_random, 's--', label='Random baseline',  color='#e05c5c', linewidth=2)
plt.xlabel("Number of labeled examples", fontsize=12)
plt.ylabel("Test accuracy", fontsize=12)
plt.title("Active Learning vs. Random Sampling", fontsize=13)
plt.legend(fontsize=11)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('active_learning_curve.png', dpi=150)
plt.show()

print(f"Active learning reaches {accs_active[-1]:.3f} accuracy")
print(f"Random sampling reaches {accs_random[-1]:.3f} accuracy")
print(f"Active learning saves ~{int((accs_random.tolist().index(min(accs_random, key=lambda a: abs(a-accs_active[-1]))) - len(accs_active) + 1) * 5)} labels to match random's final accuracy")
```

---

## The Cold Start Problem

Active learning requires a trained model to score unlabeled points — but at the beginning, you have no (or very few) labeled examples. This is the **cold start problem**.

Practical solutions:

1. **Random initialization:** Label a small random seed set (20–100 examples) before starting active learning.
2. **Clustering-based initialization:** Use k-means on the unlabeled pool; label one example from each cluster. This ensures diversity in the initial labeled set.
3. **Embedding-based selection:** Use a pre-trained encoder to embed examples; select a diverse subset via core-set.

For most tasks, a few dozen random seed labels are typically sufficient to get active learning started; the exact number depends on class balance, feature dimensionality, and model complexity.

---

## Batch-Mode Active Learning

In practice, annotators work in batches — it is inefficient to train and deploy a new model after each single label. **Batch-mode active learning** selects a set of $b$ examples to label simultaneously.

Naively selecting the top-$b$ most uncertain examples leads to **redundancy**: highly uncertain examples tend to cluster together (e.g., examples near the decision boundary in the same region). Better batch strategies optimize for both uncertainty *and* diversity within the batch.

**Determinantal Point Processes (DPPs)** provide a principled way to sample diverse batches: they define a distribution over subsets that penalizes similar items. The probability of a subset $S$ under a DPP is proportional to $\det(L_S)$ where $L$ is a kernel matrix encoding similarity.

---

## Stopping Criteria

When should active learning stop? Common criteria:

- **Budget exhausted:** Simplest — stop when the annotation budget runs out.
- **Performance plateau:** Stop when model accuracy on a held-out validation set has not improved by more than $\delta$ for $k$ consecutive rounds.
- **Confidence threshold:** Stop when fewer than some fraction of unlabeled examples have uncertainty above a threshold.
- **Maximum loss reduction:** Estimate the maximum possible gain from additional labels; stop when this falls below a threshold {cite}`bloodgood2009method`.

---

## When Active Learning Works (and When It Doesn't)

Active learning tends to work well when:
- Labeling is expensive and the unlabeled pool is large
- The data has clear structure the model can exploit to identify informative examples
- The model class is appropriate for the task

Active learning performs poorly when:
- The initial model is very poor (cold start) and cannot meaningfully rank examples
- The query strategy selects outliers or mislabeled examples (noise robustness matters)
- The data distribution shifts between the unlabeled pool and the test distribution

A key practical concern is **distribution mismatch**: active learning tends to query examples near the decision boundary, creating a biased labeled set that may not represent the test distribution well. This can lead to well-trained decision boundaries but poor calibration.

```{seealso}
The foundational survey is {cite}`settles2009active`. Theoretical foundations (label complexity, agnostic bounds): {cite}`balcan2006agnostic`. For deep learning-specific active learning, see {cite}`ash2020deep` (BADGE) and {cite}`sener2018active` (core-set). For a critical evaluation of when active learning actually helps, see {cite}`lowell2019practical`. On aleatoric vs. epistemic uncertainty for deep models, see {cite}`kendall2017uncertainties`; for deep ensembles as uncertainty estimators, see {cite}`lakshminarayanan2017simple`; for MC Dropout as approximate Bayesian inference, see {cite}`gal2016dropout`.
```
