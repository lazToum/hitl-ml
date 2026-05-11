# Appendix 17A: Active Learning Theory and Advanced Alignment Techniques

*Mathematical foundations for active learning, RLHF, and meta-uncertainty*

---

## 17A.1 Active Learning: Formal Framework

### Query Complexity

Standard supervised learning requires $m = O(d / \varepsilon^2)$ labeled examples to achieve error $\varepsilon$ in $d$-dimensional space. Active learning's key theoretical result: for many problem classes, the query complexity is $O(d / \varepsilon)$ — a quadratic improvement.

This speedup arises because active learning concentrates queries near the decision boundary, where labels provide the most information about $f^*$.

### Version Space Active Learning

The **version space** $V_n$ is the set of hypotheses consistent with all $n$ observed labels. Active learning strategies can be viewed as minimizing the expected version space volume after each query:

$$x^* = \arg\min_{x \in \mathcal{U}} \mathbb{E}_{y \sim p(y|x)}[\text{Vol}(V_{n+1}(x, y))]$$

Selecting the query that maximally shrinks the version space is equivalent to selecting the most informative query under the information-theoretic criterion.

### BADGE: Batch Active Learning by Diverse Gradient Embeddings

BADGE (Ash et al., 2020) combines uncertainty and diversity in a principled way:

1. For each unlabeled point $x_i$, compute the gradient of the loss w.r.t. the predicted label: $g_i = \nabla_\theta L(f_\theta(x_i), \hat{y}_i)$
2. Select a batch $S$ by $k$-means++ initialization on the $\{g_i\}$ vectors

The gradient magnitude captures uncertainty (larger gradients near decision boundary); $k$-means++ selection enforces diversity.

```python
import numpy as np
from sklearn.cluster import kmeans_plusplus

def badge_select(model, unlabeled_X, batch_size: int) -> np.ndarray:
    """
    Select batch using BADGE: gradient embeddings + k-means++ init.
    Returns indices of selected examples.
    """
    probs = model.predict_proba(unlabeled_X)
    n_classes = probs.shape[1]
    n_samples = unlabeled_X.shape[0]

    pseudo_labels = probs.argmax(axis=1)
    gradient_embeddings = np.zeros((n_samples, n_classes))
    for i in range(n_samples):
        label = pseudo_labels[i]
        confidence = probs[i, label]
        gradient_embeddings[i, label] = 1 - confidence
        for j in range(n_classes):
            if j != label:
                gradient_embeddings[i, j] = -probs[i, j] * confidence

    _, indices = kmeans_plusplus(gradient_embeddings, n_clusters=batch_size,
                                  random_state=42)
    return indices
```

---

## 17A.2 RLHF: Mathematical Formulation

### The Reward Model

Given preference pairs $\mathcal{D} = \{(x, y_w, y_l)\}$, the reward model $r_\phi$ is trained to maximize:

$$\mathcal{L}_{RM}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[\log \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))\right]$$

This is a Bradley-Terry model of preference:

$$P(y_w \succ y_l \mid x) = \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))$$

### PPO Fine-Tuning

With a trained reward model, the policy $\pi_\theta$ is fine-tuned to maximize:

$$\mathcal{L}_{RLHF}(\theta) = \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(y|x)} \left[r_\phi(x, y) - \beta \cdot \text{KL}(\pi_\theta(\cdot|x) \| \pi_{\text{ref}}(\cdot|x))\right]$$

The KL divergence penalty $\beta$ prevents the fine-tuned model from drifting too far from $\pi_{\text{ref}}$, preserving capabilities while aligning with human preferences.

### Direct Preference Optimization (DPO)

DPO eliminates the explicit reward model:

$$\mathcal{L}_{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l)} \left[\log \sigma\left(\beta \log \frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta \log \frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\right)\right]$$

DPO is mathematically equivalent to RLHF (under certain assumptions) but simpler to train — no reward model, no PPO loop.

---

## 17A.3 Meta-Uncertainty: Out-of-Distribution Detection

### Energy-Based OOD Detection (Liu et al., 2020)

$$E(x; f) = -T \cdot \log \sum_c e^{f_c(x)/T}$$

where $f_c(x)$ is the logit for class $c$. In-distribution inputs have lower energy; OOD inputs have higher energy.

### Calibration Under Distribution Shift

Standard ECE is computed on the test set drawn from the same distribution as training. Under distribution shift, ECE typically degrades. A meta-calibration measure:

$$\text{ECE-shift} = \mathbb{E}_{P' \neq P}\left[\text{ECE}(f, P')\right]$$

Models with lower ECE-shift are more reliably calibrated across deployment contexts.

---

## 17A.4 Exercises

**Exercise 17A.1:** On a binary classification dataset, implement uncertainty sampling, random sampling, and BADGE. Start with 100 labeled examples, query 50 per iteration for 10 iterations. Plot accuracy vs. annotation budget. What are the annotation savings at 85% accuracy?

**Exercise 17A.2:** Create a simple RLHF simulation: 1,000 synthetic text summaries with a known reward function (conciseness). Simulate human preferences with 10% noise. Train a reward model. Compare learned rankings to ground truth (Spearman ρ).

**Exercise 17A.3:** Train an image classifier on CIFAR-10. Evaluate OOD detection on SVHN: compute softmax confidence and energy scores for both. Which better separates in-distribution from OOD? At what threshold would you route to human review? What are the precision/recall tradeoffs?
