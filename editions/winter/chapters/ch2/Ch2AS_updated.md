# Chapter 2 Tech Exercise Solutions

*Worked solutions to exercises from Technical Appendix 2A*

---

## Exercise 2A.1 Solution — Calibration Measurement

**Task:** Implement ECE calculation and reliability diagrams; evaluate calibration by input subgroup.

### Full Implementation

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.calibration import calibration_curve

def compute_ece(confidences, correct, n_bins=15):
    """
    Compute Expected Calibration Error.
    
    Args:
        confidences: np.array, predicted probabilities in [0,1]
        correct: np.array, binary correctness {0,1}
        n_bins: int, number of equal-width bins
    
    Returns:
        ece: float
        bin_data: list of (bin_center, avg_conf, accuracy, count) tuples
    """
    bin_boundaries = np.linspace(0, 1, n_bins + 1)
    ece = 0.0
    n = len(confidences)
    bin_data = []
    
    for i in range(n_bins):
        in_bin = (confidences > bin_boundaries[i]) & (confidences <= bin_boundaries[i+1])
        n_in_bin = in_bin.sum()
        
        if n_in_bin > 0:
            avg_conf = confidences[in_bin].mean()
            accuracy = correct[in_bin].mean()
            prop = n_in_bin / n
            ece += prop * abs(avg_conf - accuracy)
            bin_center = (bin_boundaries[i] + bin_boundaries[i+1]) / 2
            bin_data.append((bin_center, avg_conf, accuracy, n_in_bin))
    
    return ece, bin_data


def plot_reliability_diagram(bin_data, title="Reliability Diagram"):
    """
    Plot reliability diagram from bin_data output of compute_ece.
    """
    bin_centers = [b[0] for b in bin_data]
    avg_confs = [b[1] for b in bin_data]
    accuracies = [b[2] for b in bin_data]
    counts = [b[3] for b in bin_data]
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
    
    # Reliability diagram
    ax1.plot([0, 1], [0, 1], 'k--', label='Perfect calibration', alpha=0.7)
    ax1.bar(avg_confs, accuracies, width=0.07, alpha=0.6, color='steelblue', label='Model')
    ax1.set_xlabel('Mean Predicted Confidence')
    ax1.set_ylabel('Fraction Correct')
    ax1.set_title(title)
    ax1.legend()
    ax1.set_xlim([0, 1])
    ax1.set_ylim([0, 1])
    
    # Histogram of confidence scores
    ax2.bar(bin_centers, counts, width=0.07, alpha=0.7, color='orange')
    ax2.set_xlabel('Confidence Score')
    ax2.set_ylabel('Count')
    ax2.set_title('Distribution of Confidence Scores')
    
    plt.tight_layout()
    return fig


def subgroup_calibration_analysis(confidences, correct, subgroup_labels, n_bins=10):
    """
    Compute ECE per subgroup to identify calibration disparities.
    
    Args:
        confidences: np.array of predicted probabilities
        correct: np.array of binary correctness
        subgroup_labels: np.array of subgroup identifiers
    
    Returns:
        dict mapping subgroup -> ECE
    """
    subgroups = np.unique(subgroup_labels)
    results = {}
    
    for sg in subgroups:
        mask = subgroup_labels == sg
        if mask.sum() > 0:
            ece, _ = compute_ece(confidences[mask], correct[mask], n_bins=n_bins)
            results[sg] = {
                'ece': ece,
                'n': mask.sum(),
                'mean_confidence': confidences[mask].mean(),
                'accuracy': correct[mask].mean()
            }
    
    return results
```

### Demonstration with Synthetic Data

```python
import numpy as np

# Simulate an overconfident model
np.random.seed(42)
n = 10000

# True probabilities (what the model should output)
true_probs = np.random.beta(2, 2, n)  # Spread across [0,1]

# Simulated overconfident outputs: squish toward extremes
overconfident = true_probs ** 0.5  # Pushes probabilities toward 1
overconfident = np.clip(overconfident, 0.001, 0.999)

# Generate correctness from true probabilities
correct = (np.random.uniform(size=n) < true_probs).astype(float)

# Compute ECE
ece_overconfident, bins = compute_ece(overconfident, correct)
print(f"ECE (overconfident model): {ece_overconfident:.4f}")  # ~0.08-0.12

# Apply temperature scaling
T = 1.5  # Temperature > 1 softens overconfidence
# For binary: p' = sigmoid(logit(p) / T)
logits = np.log(overconfident / (1 - overconfident))
calibrated_probs = 1 / (1 + np.exp(-logits / T))

ece_calibrated, bins_cal = compute_ece(calibrated_probs, correct)
print(f"ECE (after temperature scaling): {ece_calibrated:.4f}")  # Should be lower
```

### Expected Results Interpretation

**Overconfident model (typical deep learning):**
- Reliability diagram: bars fall *below* the diagonal
- ECE: typically 0.05–0.15 for common benchmarks
- Interpretation: Model says "90% confident" but is right only 80% of the time

**After temperature scaling:**
- Reliability diagram: bars closer to diagonal
- ECE: typically 0.02–0.05
- Note: Accuracy does not change — only the calibration of confidence scores

**Subgroup analysis:** If voice recognition system:
- American English speakers: ECE ≈ 0.03 (well calibrated)
- Scottish accent: ECE ≈ 0.25 (severely overconfident on wrong transcriptions)
- **Implication:** Flagging Scottish-accented inputs for lower-confidence output is both technically correct and ethically required for a fair system.

---

## Exercise 2A.2 Solution — Aleatoric vs. Epistemic Decomposition

**Task:** Demonstrate that aleatoric and epistemic uncertainty cluster in different regions.

### Setup and Implementation

```python
import torch
import torch.nn as nn
import numpy as np
import matplotlib.pyplot as plt

# --- Data Generation ---
def generate_data(n=2000):
    # In-distribution: two overlapping Gaussian clusters (high aleatoric at boundary)
    cluster1 = np.random.multivariate_normal([0, 0], [[1, 0], [0, 1]], n // 2)
    cluster2 = np.random.multivariate_normal([2, 0], [[1, 0], [0, 1]], n // 2)
    
    X_in = np.vstack([cluster1, cluster2])
    y_in = np.array([0] * (n // 2) + [1] * (n // 2))
    
    # OOD: cluster far from training distribution (high epistemic)
    ood = np.random.multivariate_normal([6, 0], [[0.5, 0], [0, 0.5]], n // 4)
    X_ood = ood
    
    return X_in, y_in, X_ood


# --- Model with Dropout ---
class DropoutClassifier(nn.Module):
    def __init__(self, input_dim=2, hidden=64, p_dropout=0.3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden),
            nn.ReLU(),
            nn.Dropout(p=p_dropout),
            nn.Linear(hidden, hidden),
            nn.ReLU(),
            nn.Dropout(p=p_dropout),
            nn.Linear(hidden, 2)
        )
    
    def forward(self, x):
        return self.net(x)


# --- MC Dropout Uncertainty Estimation ---
def mc_dropout_predict(model, X, n_samples=100):
    model.train()  # Keep dropout active
    
    preds = []
    with torch.no_grad():
        x_tensor = torch.FloatTensor(X)
        for _ in range(n_samples):
            logits = model(x_tensor)
            probs = torch.softmax(logits, dim=-1)
            preds.append(probs.numpy())
    
    preds = np.array(preds)  # [n_samples, n_points, 2]
    
    mean_pred = preds.mean(axis=0)
    
    # Total uncertainty: predictive entropy
    entropy = -np.sum(mean_pred * np.log(mean_pred + 1e-8), axis=-1)
    
    # Aleatoric: mean of per-sample entropies
    per_sample_entropy = -np.sum(preds * np.log(preds + 1e-8), axis=-1)
    aleatoric = per_sample_entropy.mean(axis=0)
    
    # Epistemic: mutual information
    epistemic = entropy - aleatoric
    
    return mean_pred, aleatoric, epistemic, entropy
```

### Expected Results

**In-distribution decision boundary region (x ≈ 1.0, y ≈ 0):**
- Aleatoric uncertainty: HIGH (both classes are close; even perfect model would be 50/50)
- Epistemic uncertainty: LOW (model has seen many examples here)

**OOD region (x ≈ 6, y ≈ 0):**
- Aleatoric uncertainty: LOW-MEDIUM (model assigns the point to one class with moderate confidence)
- Epistemic uncertainty: HIGH (model is making extrapolations far from training data)

**Key visualization:**
```python
# Visualize the separation
fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Plot total, aleatoric, and epistemic uncertainty on a grid
x_range = np.linspace(-3, 9, 100)
y_range = np.linspace(-4, 4, 100)
xx, yy = np.meshgrid(x_range, y_range)
grid = np.c_[xx.ravel(), yy.ravel()]

_, alea, epis, total = mc_dropout_predict(model, grid)

for ax, values, title in zip(axes, 
                               [total, alea, epis], 
                               ['Total Uncertainty', 'Aleatoric', 'Epistemic']):
    ax.contourf(xx, yy, values.reshape(xx.shape), levels=20, cmap='hot_r')
    ax.scatter(X_in[:, 0], X_in[:, 1], c=y_in, cmap='RdBu', s=5, alpha=0.3)
    ax.scatter(X_ood[:, 0], X_ood[:, 1], c='green', s=5, alpha=0.3, label='OOD')
    ax.set_title(title)
    ax.legend(loc='upper left')
```

**Expected observation:** Aleatoric uncertainty peaks between the two in-distribution clusters. Epistemic uncertainty peaks in the OOD region. This confirms the theoretical prediction: aleatoric reflects irreducible class overlap; epistemic reflects model ignorance of the OOD region.

---

## Exercise 2A.3 Solution — HITL Routing Optimization

**Task:** Find optimal routing threshold $\theta^*$ given asymmetric error costs.

```python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import train_test_split

# --- Cost Parameters ---
C_FN = 100   # False negative cost
C_FP = 10    # False positive cost
C_human = 2  # Cost of human review

# --- Setup ---
X, y = make_classification(n_samples=5000, n_features=20, 
                            n_informative=10, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

# Train with calibration
base_clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf = CalibratedClassifierCV(base_clf, cv=5, method='sigmoid')
clf.fit(X_train, y_train)

probs = clf.predict_proba(X_test)[:, 1]  # P(positive)

# --- HITL Cost Analysis ---
def hitl_expected_cost(probs, y_true, threshold, C_FN, C_FP, C_human):
    """
    Compute expected cost per sample under HITL routing.
    
    Cases with confidence < threshold -> human review (cost = C_human)
    Cases with confidence >= threshold -> auto-decision (cost depends on error)
    """
    n = len(probs)
    total_cost = 0.0
    
    for prob, true_label in zip(probs, y_true):
        # Routing decision based on distance from 0.5 (uncertainty)
        confidence = max(prob, 1 - prob)  # Distance from coin-flip
        
        if confidence < threshold:
            # Route to human: assume human is perfect (worst case is C_human)
            total_cost += C_human
        else:
            # Auto-decide
            predicted = int(prob >= 0.5)
            if predicted != true_label:
                if true_label == 1:  # False negative
                    total_cost += C_FN
                else:  # False positive
                    total_cost += C_FP
    
    return total_cost / n  # Per-sample cost

# --- Sweep Thresholds ---
thresholds = np.linspace(0.5, 0.99, 100)
costs = []
review_rates = []

for theta in thresholds:
    confidence = np.maximum(probs, 1 - probs)
    review_rate = (confidence < theta).mean()
    cost = hitl_expected_cost(probs, y_test, theta, C_FN, C_FP, C_human)
    costs.append(cost)
    review_rates.append(review_rate)

# Find optimal threshold
optimal_idx = np.argmin(costs)
theta_star = thresholds[optimal_idx]

print(f"Optimal threshold: {theta_star:.3f}")
print(f"Minimum expected cost: {costs[optimal_idx]:.4f}")
print(f"Human review rate at optimal: {review_rates[optimal_idx]:.1%}")

# --- Baselines for Comparison ---
# Full automation: no human review
auto_cost = hitl_expected_cost(probs, y_test, 0.5, C_FN, C_FP, 0)
print(f"\nFull automation expected cost: {auto_cost:.4f}")

# Full human review: all cases reviewed
human_cost = C_human  # Every case costs C_human (assuming human is perfect)
print(f"Full human review expected cost: {human_cost:.4f}")
print(f"Optimal HITL cost: {costs[optimal_idx]:.4f} ({(1 - costs[optimal_idx]/auto_cost)*100:.1f}% savings vs full automation)")
```

### Expected Output Interpretation

With $C_{FN} = 100$, $C_{FP} = 10$, $C_{human} = 2$:

- **Full automation:** High cost because some high-confidence auto-decisions are wrong, and FN cost is high
- **Full human review:** Fixed cost of $2 per sample; safer but expensive
- **Optimal HITL:** Routes ~30–50% of cases to human review (the uncertain ones); catches most false negatives at lower overall cost than full review

**Key insight from the cost asymmetry:** Because $C_{FN} = 10 \times C_{FP}$, the optimal threshold is *lower* than you might expect — it's worth routing more cases to human review to avoid even rare false negatives. This mirrors the medical AI scenario: missing a cancer is far worse than unnecessary biopsy.

---

## Exercise 2A.4 Solution — OOD Detection Comparison

**Task:** Compare three OOD detection methods; report AUROC.

```python
from sklearn.metrics import roc_auc_score
import torch

def max_softmax_ood(model, X, threshold=None):
    """Baseline: max softmax probability as in-distribution score."""
    model.eval()
    with torch.no_grad():
        logits = model(torch.FloatTensor(X))
        probs = torch.softmax(logits, dim=-1)
        max_probs = probs.max(dim=-1).values.numpy()
    return max_probs  # Higher = more in-distribution

def mc_dropout_entropy_ood(model, X, n_samples=50):
    """MC Dropout entropy as OOD score."""
    _, _, _, entropy = mc_dropout_predict(model, X, n_samples=n_samples)
    return -entropy  # Higher score = more in-distribution (lower entropy)

def mahalanobis_ood(model, X_train, y_train, X_test):
    """
    Mahalanobis distance to nearest class centroid.
    """
    model.eval()
    
    # Extract features (penultimate layer)
    # [Implementation would use model.get_features() ]
    # Simplified: use logits as features
    with torch.no_grad():
        features_train = model.net[:-1](torch.FloatTensor(X_train)).numpy()
        features_test = model.net[:-1](torch.FloatTensor(X_test)).numpy()
    
    # Compute class means and shared covariance
    classes = np.unique(y_train)
    means = [features_train[y_train == c].mean(axis=0) for c in classes]
    
    # Tied covariance
    centered = np.vstack([features_train[y_train == c] - means[i] 
                          for i, c in enumerate(classes)])
    cov = np.cov(centered.T) + 1e-6 * np.eye(features_train.shape[1])
    precision = np.linalg.inv(cov)
    
    # Compute min Mahalanobis distance to any class
    scores = []
    for feat in features_test:
        dists = [float((feat - mu) @ precision @ (feat - mu)) 
                 for mu in means]
        scores.append(-min(dists))  # Negative because low distance = in-distribution
    
    return np.array(scores)

# --- Evaluation ---
# In-distribution = 1, OOD = 0
is_in_dist = np.concatenate([
    np.ones(len(X_in_test)), 
    np.zeros(len(X_ood))
])
X_all = np.vstack([X_in_test, X_ood])

methods = {
    'Max Softmax': max_softmax_ood(model, X_all),
    'MC Dropout (neg entropy)': mc_dropout_entropy_ood(model, X_all),
    'Mahalanobis': mahalanobis_ood(model, X_train, y_train, X_all)
}

print("OOD Detection AUROC:")
for name, scores in methods.items():
    auroc = roc_auc_score(is_in_dist, scores)
    print(f"  {name}: {auroc:.4f}")
```

### Expected Results

Typical AUROC on well-separated OOD data:
- Max Softmax: ~0.75–0.85 (known limitation: overconfident on OOD)
- MC Dropout Entropy: ~0.80–0.90 (better; epistemic uncertainty captures OOD)
- Mahalanobis Distance: ~0.85–0.95 (typically best; feature-space distance is more informative)

**Interpretation:** Mahalanobis distance works best because it operates in the model's learned feature space — OOD inputs produce features distant from any training class centroid, even when the softmax distribution looks confident. This is the practical fix for the "overconfident OOD" problem described in the appendix.

**Connection to Chapter 2:** The voice recognition system with high error rates on Scottish accents would benefit from Mahalanobis-style OOD detection: if the audio feature representation is far from the centroid of any trained accent cluster, flag for low confidence regardless of what the softmax says.
