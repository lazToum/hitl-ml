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

# Evaluation and Metrics

Knowing whether your HITL system is working requires more than measuring model accuracy. You need to know whether you are getting value from your annotation budget, whether the model is actually better aligned with human intent, and whether additional human feedback will continue to improve things. This chapter covers the full landscape of evaluation in HITL settings.

---

## Model-Centric Metrics

Standard ML metrics apply directly to HITL systems, with some important nuances.

### Classification Metrics

**Accuracy** is appropriate when classes are balanced and all errors are equally costly. In HITL settings, however, the labeled test set may be biased by the query strategy (active learning queries non-random examples), making simple accuracy estimates unreliable.

**F1 score** is the harmonic mean of precision and recall, appropriate for imbalanced classes. In HITL contexts, both precision and recall may matter differently depending on the cost asymmetry between false positives and false negatives.

**AUROC** measures the model's ability to discriminate between classes regardless of threshold — important for calibration-sensitive tasks like medical screening.

**Calibration** measures how well predicted probabilities correspond to empirical frequencies. In HITL systems, models trained on biased labeled sets (from active learning) can be miscalibrated even when accurate.

### Generative Model Metrics

For language models and generative systems, evaluation is fundamentally harder. No single automatic metric captures quality:

- **BLEU / ROUGE / METEOR:** Reference-based metrics for translation and summarization. Correlate weakly with human quality judgments for long-form generation.
- **Perplexity:** Measures how well the model predicts held-out text. A necessary but not sufficient condition for quality.
- **BERTScore:** Embedding-based similarity to references. Better correlated with human judgments than n-gram metrics.
- **Human evaluation:** The gold standard. See Section 14.3.

---

## Annotation Efficiency Metrics

HITL evaluation should also measure whether human feedback is being used efficiently.

### Learning Curves

A **learning curve** plots model performance as a function of the number of labeled examples. A steep learning curve (rapid improvement with few labels) indicates that the annotation strategy is selecting informative examples. A flat learning curve indicates that additional labeling is providing diminishing returns.

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, roc_auc_score
from sklearn.model_selection import StratifiedShuffleSplit

rng = np.random.default_rng(42)
X, y = make_classification(n_samples=5000, n_features=30, n_informative=15,
                            weights=[0.8, 0.2], random_state=42)
X_test, y_test = X[4000:], y[4000:]
X_pool, y_pool = X[:4000], y[:4000]

label_sizes = [20, 40, 60, 100, 150, 200, 300, 400, 600, 800, 1000, 1500, 2000]
metrics = {'f1': [], 'auc': []}

for n in label_sizes:
    idx = rng.choice(len(X_pool), n, replace=False)
    clf = LogisticRegression(max_iter=500, class_weight='balanced')
    clf.fit(X_pool[idx], y_pool[idx])
    preds = clf.predict(X_test)
    probs = clf.predict_proba(X_test)[:, 1]
    metrics['f1'].append(f1_score(y_test, preds))
    metrics['auc'].append(roc_auc_score(y_test, probs))

# Fit learning curve: performance ≈ a - b/sqrt(n)
from scipy.optimize import curve_fit

def learning_curve_fn(n, a, b):
    return a - b / np.sqrt(n)

popt_f1, _ = curve_fit(learning_curve_fn, label_sizes, metrics['f1'], p0=[0.9, 2])
popt_auc, _ = curve_fit(learning_curve_fn, label_sizes, metrics['auc'], p0=[0.95, 1])

n_smooth = np.linspace(20, 3000, 200)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))

ax1.scatter(label_sizes, metrics['f1'], color='#2b3a8f', zorder=5, s=40)
ax1.plot(n_smooth, learning_curve_fn(n_smooth, *popt_f1), '--', color='#e05c5c',
         label=f'Fit: {popt_f1[0]:.3f} - {popt_f1[1]:.1f}/√n')
ax1.set_xlabel("Labeled examples"); ax1.set_ylabel("F1 score")
ax1.set_title("Learning Curve: F1"); ax1.legend(); ax1.grid(alpha=0.3)

ax2.scatter(label_sizes, metrics['auc'], color='#0d9e8e', zorder=5, s=40)
ax2.plot(n_smooth, learning_curve_fn(n_smooth, *popt_auc), '--', color='#e05c5c',
         label=f'Fit: {popt_auc[0]:.3f} - {popt_auc[1]:.2f}/√n')
ax2.set_xlabel("Labeled examples"); ax2.set_ylabel("AUROC")
ax2.set_title("Learning Curve: AUROC"); ax2.legend(); ax2.grid(alpha=0.3)

plt.tight_layout()
plt.savefig('learning_curves.png', dpi=150)
plt.show()

# Estimate the annotation budget needed to reach a target performance
target_f1 = 0.80
n_needed = (popt_f1[1] / (popt_f1[0] - target_f1)) ** 2
print(f"Estimated labels needed to reach F1={target_f1}: {n_needed:.0f}")
```

### Return on Investment (ROI) Analysis

The ROI of human feedback answers: for each additional label, how much does model performance improve?

$$
\text{ROI}(n) = \frac{\Delta \text{performance}(n)}{\text{cost per label}}
$$

As a model matures (and as the easy-to-learn examples are exhausted), ROI typically decreases. The practical implication: annotation budgets should be front-loaded, with more labels collected in early stages when ROI is highest.

---

## Human Evaluation

For generative systems and subjective tasks, human evaluation remains the gold standard.

### Direct Assessment (DA)

Annotators rate outputs on an absolute scale (e.g., 1–100 for translation quality, or 1–5 for response helpfulness). DA has been standardized in machine translation evaluation (WMT benchmarks).

**Best practices for DA:**
- Randomize the order of outputs to prevent anchoring
- Use a sufficient number of annotators per item (3–5 minimum)
- Include quality controls (obviously good and bad examples to catch inattentive raters)
- Report inter-annotator agreement alongside aggregate scores

### Comparative Evaluation

Annotators choose between two outputs: "Which is better?" Comparative judgments are faster and more consistent than absolute ratings (see Chapter 8). **ELO rating systems** (borrowed from chess) convert pairwise comparison outcomes into a continuous quality ranking.

```{code-cell} python
import numpy as np

def update_elo(rating_a, rating_b, outcome_a, k=32):
    """Update ELO ratings. outcome_a: 1=A wins, 0=B wins, 0.5=tie."""
    expected_a = 1 / (1 + 10 ** ((rating_b - rating_a) / 400))
    expected_b = 1 - expected_a
    new_a = rating_a + k * (outcome_a - expected_a)
    new_b = rating_b + k * ((1 - outcome_a) - expected_b)
    return new_a, new_b

# Simulate 5 model versions being compared pairwise
rng = np.random.default_rng(42)
true_quality = [0.60, 0.70, 0.75, 0.80, 0.85]  # underlying model quality
n_models = len(true_quality)
elo_ratings = {i: 1000.0 for i in range(n_models)}

for _ in range(500):  # 500 pairwise comparisons
    i, j = rng.choice(n_models, 2, replace=False)
    p_i_wins = true_quality[i] / (true_quality[i] + true_quality[j])
    outcome = 1.0 if rng.random() < p_i_wins else 0.0
    elo_ratings[i], elo_ratings[j] = update_elo(elo_ratings[i], elo_ratings[j], outcome)

print("ELO Rankings after 500 comparisons:")
sorted_models = sorted(elo_ratings.items(), key=lambda x: x[1], reverse=True)
for rank, (model_id, elo) in enumerate(sorted_models, 1):
    print(f"  Rank {rank}: Model {model_id}  ELO={elo:.1f}  True quality={true_quality[model_id]:.2f}")
```

### Behavioral Testing (CheckList)

**CheckList** {cite}`ribeiro2020beyond` is a methodology for systematic behavioral evaluation of NLP models. Instead of random test sets, it designs test cases that probe specific capabilities:

- **Minimum Functionality Tests (MFT):** Does the model handle simple, obvious cases?
- **Invariance Tests (INV):** Does the model's output change when it shouldn't (e.g., when paraphrasing)?
- **Directional Expectation Tests (DIR):** Does the model's output change in the expected direction when input changes?

CheckList makes human evaluation targeted and actionable: instead of a single accuracy number, it provides a capability profile.

---

## Measuring Alignment with Human Intent

For RLHF systems, measuring alignment is a central evaluation challenge.

**Reward model evaluation:** The reward model's accuracy on a held-out preference test set. Ouyang et al. {cite}`ouyang2022training` report approximately 72% pairwise accuracy for InstructGPT's reward model; as a rough point of reference, figures in this vicinity are commonly cited for similar RLHF pipelines, though results vary widely by task and data quality.

**Win rate:** Given two model versions (e.g., SFT baseline vs. RLHF fine-tuned), what fraction of responses does the RLHF model win in human pairwise comparisons?

**GPT-4 as evaluator:** Using a capable LLM to evaluate responses has become common for rapid iteration. Gilardi et al. {cite}`gilardi2023chatgpt` and Zheng et al. {cite}`zheng2023judging` find LLM evaluator agreement with human judgment ranging roughly from 0.7 to 0.9 depending on task — useful for rapid A/B comparison, but less reliable for detecting sycophancy, cultural nuance, or safety issues.

**Sycophancy detection:** Measure whether the model changes its answers based on implied user preference (e.g., "I think X is correct; what do you think?"). A well-aligned model should not be sycophantic.

---

## A/B Testing in Deployed Systems

For systems in production, the ultimate evaluation is **A/B testing**: route a fraction of users to the new model version and measure downstream outcomes.

A/B testing gives an unbiased estimate of model quality in the actual deployment context, capturing effects that laboratory evaluation misses (user behavior, population distribution, edge cases).

The challenge: appropriate downstream metrics. Engagement metrics (clicks, session length) may reward manipulative behavior. Task completion rates or user satisfaction surveys are better-aligned but noisier.

```{seealso}
CheckList behavioral testing: {cite}`ribeiro2020beyond`. For RLHF evaluation methodology, see {cite}`ouyang2022training`. For human evaluation best practices in MT: {cite}`graham2015accurate`. For learning curve theory: {cite}`mukherjee2003estimating`.
```
