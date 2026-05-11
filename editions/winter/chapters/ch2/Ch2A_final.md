# Technical Appendix 2A: The Mathematics of AI Confusion

*Formal foundations for uncertainty types, calibration, and edge-case detection*

---

## Overview

Chapter 2 introduced two types of uncertainty — aleatoric and epistemic — and argued that confusion is a feature rather than a bug when properly surfaced. This appendix provides the mathematical framework underlying those concepts, including formal definitions, estimation methods, and calibration metrics relevant to HITL system design.

---

## 2A.1 Formal Definitions of Uncertainty Types

### 2A.1.1 Aleatoric Uncertainty

Aleatoric uncertainty captures the inherent randomness or noise in observed data. Given input $x$ and true label $y$, aleatoric uncertainty is:

$$\sigma^2_{\text{aleatoric}} = \mathbb{E}_{y \sim p(y|x)}[(y - f(x))^2]$$

This represents the expected squared deviation between the true output and the model prediction, averaged over the true output distribution. It cannot be reduced by collecting more data from the same process, because it reflects genuine ambiguity in the relationship between $x$ and $y$.

**Example (Ch. 2):** A blurry X-ray — the aleatoric uncertainty comes from image quality, not the model's training.

**Key property:**
$$\sigma^2_{\text{aleatoric}} \text{ does not decrease as } |\mathcal{D}| \to \infty$$

### 2A.1.2 Epistemic Uncertainty

Epistemic uncertainty captures uncertainty about the model parameters $\theta$ given observed data $\mathcal{D}$. Under the Bayesian framework:

$$p(\theta | \mathcal{D}) \propto p(\mathcal{D} | \theta) \cdot p(\theta)$$

The predictive distribution for a new input $x^*$ is:

$$p(y^* | x^*, \mathcal{D}) = \int p(y^* | x^*, \theta) \cdot p(\theta | \mathcal{D}) \, d\theta$$

Epistemic uncertainty is high when this integral shows high variance — when different plausible parameter settings produce very different predictions. It decreases as more training data is observed:

$$\sigma^2_{\text{epistemic}} \to 0 \text{ as } |\mathcal{D}| \to \infty$$

**Example (Ch. 2):** A classifier trained on domestic pets encountering a Patagonian mara — the image is crisp, but the model has no relevant training examples.

### 2A.1.3 Total Predictive Uncertainty

Following Kendall & Gal (2017), total predictive uncertainty decomposes as:

$$\underbrace{\text{Var}[y^*]}_{\text{total}} = \underbrace{\mathbb{E}_{\theta}[\text{Var}_{y^*}[y^* | \theta]]}_{\text{aleatoric}} + \underbrace{\text{Var}_{\theta}[\mathbb{E}_{y^*}[y^* | \theta]]}_{\text{epistemic}}$$

This decomposition is foundational for HITL design: the aleatoric component tells you how hard the case is intrinsically; the epistemic component tells you how much the model's own ignorance contributes.

---

## 2A.2 Measuring Calibration

### 2A.2.1 Definition

A model is **perfectly calibrated** if its expressed confidence exactly predicts its accuracy:

$$P(\hat{y} = y \,|\, \hat{p} = p) = p \quad \text{for all } p \in [0,1]$$

where $\hat{y}$ is the model's predicted class and $\hat{p}$ is the predicted probability. When the model says it is 70% confident, it should be correct 70% of the time.

### 2A.2.2 Reliability Diagrams

To assess calibration empirically:

1. Partition predictions into $M$ confidence bins $B_m = [m/M, (m+1)/M)$
2. For each bin, compute:
   - Average confidence: $\text{conf}(B_m) = \frac{1}{|B_m|} \sum_{i \in B_m} \hat{p}_i$
   - Accuracy: $\text{acc}(B_m) = \frac{1}{|B_m|} \sum_{i \in B_m} \mathbf{1}[\hat{y}_i = y_i]$
3. Plot $\text{conf}(B_m)$ vs. $\text{acc}(B_m)$

A perfectly calibrated model produces a straight diagonal line. Points below the diagonal indicate overconfidence (confidence exceeds accuracy) — the most common failure mode in modern deep learning.

### 2A.2.3 Expected Calibration Error (ECE)

$$\text{ECE} = \sum_{m=1}^{M} \frac{|B_m|}{n} \left| \text{acc}(B_m) - \text{conf}(B_m) \right|$$

where $n$ is the total number of predictions. ECE is the weighted average absolute gap between confidence and accuracy across bins.

**HITL implication:** A high ECE means the model's confidence scores cannot be trusted to route cases correctly. A model with ECE = 0.20 that reports 90% confidence is actually accurate only 70% of the time — it will dramatically under-request human oversight on uncertain cases.

### 2A.2.4 Calibration Correction: Temperature Scaling

Guo et al. (2017) showed that dividing logits by a scalar temperature $T > 1$ before softmax reduces overconfidence without altering class predictions:

$$\hat{p}_i = \text{softmax}(\mathbf{z}_i / T)$$

$T$ is fitted on a held-out validation set by minimizing negative log-likelihood. It is the simplest effective post-hoc calibration method.

```python
class TemperatureScaler:
    def __init__(self, model):
        self.model = model
        self.temperature = torch.nn.Parameter(torch.ones(1) * 1.5)
    
    def calibrate(self, val_loader):
        """Fit temperature on validation set using NLL loss."""
        optimizer = torch.optim.LBFGS([self.temperature], lr=0.01, max_iter=50)
        logits_list, labels_list = [], []
        
        with torch.no_grad():
            for x, y in val_loader:
                logits_list.append(self.model(x))
                labels_list.append(y)
        
        logits = torch.cat(logits_list)
        labels = torch.cat(labels_list)
        
        def eval_nll():
            optimizer.zero_grad()
            loss = F.cross_entropy(logits / self.temperature, labels)
            loss.backward()
            return loss
        
        optimizer.step(eval_nll)
        return self
    
    def predict(self, x):
        logits = self.model(x)
        return torch.softmax(logits / self.temperature, dim=-1)
```

---

## 2A.3 Uncertainty Estimation Methods

### 2A.3.1 Monte Carlo Dropout (MC Dropout)

Gal & Ghahramani (2016) showed that applying dropout at inference time corresponds approximately to Bayesian inference over model weights.

```python
def mc_dropout_uncertainty(model, x, n_samples=100):
    """
    Estimate uncertainty via Monte Carlo Dropout.
    Requires model dropout layers to remain active during inference.
    """
    model.train()  # Enable dropout at inference
    predictions = []
    
    for _ in range(n_samples):
        with torch.no_grad():
            pred = model(x)
            predictions.append(torch.softmax(pred, dim=-1))
    
    predictions = torch.stack(predictions, dim=0)  # [n_samples, batch, classes]
    
    mean_pred = predictions.mean(dim=0)
    
    # Total uncertainty: predictive entropy
    entropy = -(mean_pred * torch.log(mean_pred + 1e-8)).sum(dim=-1)
    
    # Aleatoric: mean of per-sample entropies
    per_sample_entropy = -(predictions * torch.log(predictions + 1e-8)).sum(dim=-1)
    aleatoric = per_sample_entropy.mean(dim=0)
    
    # Epistemic: mutual information (total - aleatoric)
    epistemic = entropy - aleatoric
    
    return mean_pred, aleatoric, epistemic, entropy
```

**Cost:** $O(\text{n\_samples})$ forward passes per prediction. Typical values: $n = 30$–$100$.

### 2A.3.2 Deep Ensembles

Train $M$ separate models with different random initializations (Lakshminarayanan et al., 2017):

$$\mu_{\text{ens}} = \frac{1}{M}\sum_{i=1}^{M} \mu_i(x)$$

$$\sigma^2_{\text{ens}} = \frac{1}{M}\sum_{i=1}^{M} \left[\sigma^2_i(x) + \mu^2_i(x)\right] - \mu^2_{\text{ens}}$$

**Advantages over MC Dropout:** Better calibration; captures diversity across function space, not just weight space; parallelizable. **Disadvantage:** Requires training and storing $M$ full models.

### 2A.3.3 Conformal Prediction

A distribution-free framework providing prediction sets with guaranteed coverage:

$$P(y_{\text{true}} \in C_\alpha(x)) \geq 1 - \alpha$$

Given a calibration set $\{(x_i, y_i)\}_{i=1}^n$, compute nonconformity scores $s_i$. For new input $x^*$:

$$C_\alpha(x^*) = \{y : s(x^*, y) \leq \hat{q}_{1-\alpha}\}$$

where $\hat{q}_{1-\alpha}$ is the $(1-\alpha)$ empirical quantile of calibration scores.

**HITL value:** Conformal prediction sets provide formally guaranteed uncertainty coverage without distributional assumptions. A prediction set of size 1 indicates high confidence; a set containing multiple classes indicates genuine ambiguity warranting human review.

---

## 2A.4 Out-of-Distribution Detection

OOD detection addresses a critical HITL problem: systems encounter inputs unlike their training data and must recognize this fact.

### 2A.4.1 Maximum Softmax Probability (Baseline)

$$\text{OOD flag}(x) = \mathbf{1}\left[\max_c p(c|x) < \tau\right]$$

**Known limitation:** Deep networks can produce high-confidence outputs for OOD inputs. A model trained on cats and dogs may classify a fox as a dog with 99% confidence. The softmax does not reliably reflect OOD-ness.

### 2A.4.2 Mahalanobis Distance

Lee et al. (2018) use class-conditional Gaussian distributions fit to intermediate feature representations:

$$M(x) = \min_c \, (f(x) - \mu_c)^\top \Sigma^{-1}(f(x) - \mu_c)$$

High distance to all class centroids → likely OOD. This is particularly useful for diagnosing *why* a model is uncertain: is the input far from all training classes, or is it near the boundary between two well-known classes?

```python
def mahalanobis_ood_score(model, x, class_means, precision_matrix):
    """
    Compute Mahalanobis distance to nearest class centroid.
    Lower score = more likely in-distribution.
    """
    with torch.no_grad():
        features = model.get_features(x)  # Intermediate representation
    
    distances = []
    for mu_c in class_means:
        diff = features - mu_c
        dist = (diff @ precision_matrix @ diff.T).diag()
        distances.append(dist)
    
    # Minimum distance to any class
    min_distance = torch.stack(distances, dim=0).min(dim=0).values
    return min_distance
```

---

## 2A.5 The Radiology Case: Mathematical Analysis

The 51% confidence case from Chapter 2 maps directly to the calibration framework:

**Optimal routing threshold:**

Let $\theta$ be the confidence threshold. The system auto-diagnoses if confidence $\geq \theta$, otherwise routes to human review. Define:

- $\alpha(\theta)$: error rate on auto-routed cases (decreasing in $\theta$)
- $\beta(\theta) = 1 - F(\theta)$: fraction routed to human review (decreasing in $\theta$)
- $C_E$: cost of a missed diagnosis
- $C_R$: cost of human review

Optimal threshold:

$$\theta^* = \arg\min_\theta \left[ C_E \cdot \alpha(\theta) \cdot (1 - \beta(\theta)) + C_R \cdot \beta(\theta) \right]$$

In medical imaging, $C_E \gg C_R$, so $\theta^*$ is high — most cases go to human review. The AI at 51% correctly placed the case in the review queue, since any $\theta^* > 0.51$ (virtually any medically reasonable threshold) would route it to the radiologist.

**Key insight:** The model was not "almost right" — it was maximally uncertain (0.51 ≈ coin flip). This is exactly the correct output when the model genuinely cannot distinguish two diagnoses that look similar on the input representation. Perfect calibration under epistemic uncertainty.

---

## 2A.6 Exercises

**Exercise 2A.1 — Calibration Measurement**

Implement ECE calculation and reliability diagrams for a pretrained classifier. Compare calibration before and after temperature scaling.

```python
def compute_ece(confidences, correct, n_bins=15):
    """
    Args:
        confidences: np.array of predicted probabilities [0,1]
        correct: np.array of binary correctness indicators {0,1}
        n_bins: number of equal-width bins
    Returns:
        ece: float
    """
    bin_boundaries = np.linspace(0, 1, n_bins + 1)
    ece = 0.0
    n = len(confidences)
    
    for i in range(n_bins):
        in_bin = (confidences > bin_boundaries[i]) & (confidences <= bin_boundaries[i+1])
        prop_in_bin = in_bin.mean()
        if prop_in_bin > 0:
            accuracy_in_bin = correct[in_bin].mean()
            avg_confidence_in_bin = confidences[in_bin].mean()
            ece += np.abs(avg_confidence_in_bin - accuracy_in_bin) * prop_in_bin
    
    return ece
```

**Task:** Evaluate ECE on a dataset split by input subgroup (e.g., by image brightness, accent type, or demographic). Where is calibration worst?

**Exercise 2A.2 — Aleatoric vs. Epistemic Decomposition**

Using MC Dropout:

1. Generate two overlapping Gaussian clusters (in-distribution; high aleatoric at boundary) and one separated Gaussian cluster (OOD; high epistemic).
2. Train a dropout classifier.
3. Run MC Dropout. Plot aleatoric and epistemic uncertainty separately.
4. Show that aleatoric uncertainty peaks at the in-distribution decision boundary; epistemic uncertainty peaks for OOD inputs.

**Exercise 2A.3 — HITL Routing Optimization**

Given a binary classifier with calibrated confidence scores, implement optimal HITL routing:

1. Set costs: $C_{\text{FN}} = 100$, $C_{\text{FP}} = 10$, $C_{\text{human}} = 2$.
2. Sweep threshold $\theta \in [0.5, 0.99]$.
3. For each $\theta$: compute expected total cost.
4. Find $\theta^*$.
5. Compare: system accuracy at $\theta^*$ vs. full automation vs. full human review.

**Exercise 2A.4 — OOD Detection Comparison**

Compare three OOD detection methods (max softmax, MC Dropout entropy, Mahalanobis distance) on a held-out test set with both in-distribution and OOD samples. Report AUROC for each method.

---

## 2A.7 Recommended Reading

### Foundational
- Kendall, A., & Gal, Y. (2017). What uncertainties do we need in Bayesian deep learning for computer vision? *NeurIPS*.
- Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). On calibration of modern neural networks. *ICML*.
- Lakshminarayanan, B., Pritzel, A., & Blundell, C. (2017). Simple and scalable predictive uncertainty estimation using deep ensembles. *NeurIPS*.

### Methods
- Gal, Y., & Ghahramani, Z. (2016). Dropout as a Bayesian approximation. *ICML*.
- Lee, K., Lee, K., Lee, H., & Shin, J. (2018). A simple unified framework for detecting out-of-distribution samples. *NeurIPS*.

### Conformal Prediction
- Angelopoulos, A. N., & Bates, S. (2021). A gentle introduction to conformal prediction and distribution-free uncertainty quantification. *arXiv:2107.07511*.

### Applications
- Begoli, E., Bhattacharya, T., & Kusnezov, D. (2019). The need for uncertainty quantification in machine-assisted medical decision making. *Nature Machine Intelligence*, 1, 20–23.
- Koenecke, A., et al. (2020). Racial disparities in automated speech recognition. *PNAS*, 117(14), 7684–7689.
