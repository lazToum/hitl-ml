# Chapter 17 Technical Appendix Solutions

*Worked solutions to exercises from Appendix 17A*

---

## Exercise 17A.1 Solution — Active Learning Sample Efficiency

**Task:** Implement uncertainty sampling (entropy), random sampling, and BADGE; compare accuracy vs. annotation budget curves.

### Full Implementation

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.cluster import kmeans_plusplus

# ─── Data Setup ───
X, y = make_classification(n_samples=5000, n_features=20, 
                             n_informative=10, random_state=42)

def run_active_learning_experiment(strategy='uncertainty', 
                                   initial=100, query_size=50, 
                                   n_rounds=10, n_trials=5):
    results = []
    X_test, y_test = X[4000:], y[4000:]
    X_pool = X[:4000]
    y_pool = y[:4000]
    
    for trial in range(n_trials):
        np.random.seed(trial)
        # Initialize with random seed
        labeled_idx = np.random.choice(len(X_pool), initial, replace=False)
        unlabeled_idx = np.setdiff1d(np.arange(len(X_pool)), labeled_idx)
        
        trial_accuracies = []
        trial_budgets = [initial]
        
        for round_num in range(n_rounds):
            # Train current model
            model = LogisticRegression(max_iter=1000)
            model.fit(X_pool[labeled_idx], y_pool[labeled_idx])
            
            # Evaluate
            acc = accuracy_score(y_test, model.predict(X_test))
            trial_accuracies.append(acc)
            
            if len(unlabeled_idx) == 0:
                break
            
            # Select next batch
            if strategy == 'random':
                selected = np.random.choice(unlabeled_idx, 
                                           min(query_size, len(unlabeled_idx)),
                                           replace=False)
            elif strategy == 'uncertainty':
                probs = model.predict_proba(X_pool[unlabeled_idx])
                entropy = -np.sum(probs * np.log(probs + 1e-10), axis=1)
                top_k = np.argsort(entropy)[-query_size:]
                selected = unlabeled_idx[top_k]
            elif strategy == 'badge':
                selected_local = badge_select(
                    model, X_pool[unlabeled_idx], 
                    min(query_size, len(unlabeled_idx))
                )
                selected = unlabeled_idx[selected_local]
            
            labeled_idx = np.append(labeled_idx, selected)
            unlabeled_idx = np.setdiff1d(unlabeled_idx, selected)
            trial_budgets.append(len(labeled_idx))
        
        results.append((trial_budgets[:len(trial_accuracies)], trial_accuracies))
    
    return results


def badge_select(model, X_unlabeled, batch_size):
    """BADGE selection via gradient embeddings + k-means++."""
    probs = model.predict_proba(X_unlabeled)
    n_samples, n_classes = probs.shape
    pseudo_labels = probs.argmax(axis=1)
    
    grad_embeddings = np.zeros((n_samples, n_classes))
    for i in range(n_samples):
        label = pseudo_labels[i]
        confidence = probs[i, label]
        grad_embeddings[i, label] = 1 - confidence
        for j in range(n_classes):
            if j != label:
                grad_embeddings[i, j] = -probs[i, j] * confidence
    
    _, indices = kmeans_plusplus(grad_embeddings, 
                                  n_clusters=batch_size, 
                                  random_state=42)
    return indices


# ─── Run experiments ───
strategies = ['random', 'uncertainty', 'badge']
all_results = {}
for strat in strategies:
    all_results[strat] = run_active_learning_experiment(strategy=strat)

# ─── Plot ───
fig, ax = plt.subplots(figsize=(10, 6))
colors = {'random': 'gray', 'uncertainty': 'steelblue', 'badge': 'darkgreen'}

for strat, results in all_results.items():
    # Average over trials
    max_len = min(len(r[0]) for r in results)
    mean_budgets = np.mean([r[0][:max_len] for r in results], axis=0)
    mean_accs = np.mean([r[1][:max_len] for r in results], axis=0)
    std_accs = np.std([r[1][:max_len] for r in results], axis=0)
    
    ax.plot(mean_budgets, mean_accs, label=strat, color=colors[strat], linewidth=2)
    ax.fill_between(mean_budgets, 
                    mean_accs - std_accs, 
                    mean_accs + std_accs,
                    alpha=0.2, color=colors[strat])

ax.axhline(y=0.85, color='red', linestyle='--', label='85% target')
ax.set_xlabel('Annotation Budget (labeled examples)')
ax.set_ylabel('Test Accuracy')
ax.set_title('Active Learning Sample Efficiency Comparison')
ax.legend()
plt.tight_layout()
plt.savefig('active_learning_curves.png', dpi=150)
plt.show()
```

**Expected results:**
- Uncertainty sampling outperforms random from round 3–5, achieving 85% target with ~30–40% fewer labels
- BADGE outperforms pure uncertainty sampling by round 5–8, especially when boundary-only sampling has saturated
- Annotation savings at 85% accuracy: typically 150–300 examples saved compared to random sampling

---

## Exercise 17A.2 Solution — Reward Model Simulation

```python
import numpy as np
from sklearn.linear_model import LogisticRegression
from scipy.stats import spearmanr

# Generate synthetic responses
np.random.seed(42)
n = 1000

# Ground truth reward: conciseness (inverse of length)
response_lengths = np.random.uniform(50, 500, n)
true_reward = 1 / (response_lengths / 100)

# Generate preference pairs
pairs = []
noise_rate = 0.10

for _ in range(n):
    i, j = np.random.choice(n, 2, replace=False)
    # True preference: shorter = better
    true_pref = 1 if true_reward[i] > true_reward[j] else 0
    # Add noise
    if np.random.random() < noise_rate:
        noisy_pref = 1 - true_pref
    else:
        noisy_pref = true_pref
    pairs.append((i, j, noisy_pref))

# Train reward model (simplified: predict preference from length difference)
X_train = np.array([[response_lengths[i], response_lengths[j]] 
                     for i, j, _ in pairs])
y_train = np.array([pref for _, _, pref in pairs])

# Reward model: learn to predict which is better from features
reward_features = np.column_stack([
    response_lengths,
    response_lengths ** 2,
    np.ones(n)  # intercept
])

# Use logistic regression on feature differences as reward model
feature_diffs = np.array([
    reward_features[i] - reward_features[j] 
    for i, j, _ in pairs
])
rm = LogisticRegression()
rm.fit(feature_diffs, y_train)

# Extract learned rewards
learned_rewards = reward_features @ rm.coef_[0]

# Compare learned vs. ground truth
rho, p = spearmanr(true_reward, learned_rewards)
print(f"Spearman correlation: {rho:.3f} (p={p:.4f})")
```

**Expected results:** With 1,000 preference pairs and 10% noise, Spearman correlation ρ ≈ 0.80–0.92. The reward model struggles most on near-boundary cases (similar lengths). Increasing training set from 1,000 to 2,000 pairs typically improves ρ more than reducing noise from 10% to 5%.

---

## Exercise 17A.3 Solution — OOD Detection

```python
import torch
import torchvision
import torchvision.transforms as transforms
import numpy as np
from sklearn.metrics import roc_auc_score

# Load CIFAR-10 and SVHN
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

cifar_test = torchvision.datasets.CIFAR10('./data', train=False, 
                                           transform=transform, download=True)
svhn_test = torchvision.datasets.SVHN('./data', split='test',
                                       transform=transform, download=True)

# Assume trained model `model` is available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def get_softmax_and_energy(loader, model, T=1.0):
    """Compute softmax confidence and energy scores."""
    model.eval()
    all_softmax = []
    all_energy = []
    
    with torch.no_grad():
        for inputs, _ in loader:
            inputs = inputs.to(device)
            logits = model(inputs)
            
            # Softmax confidence (maximum)
            probs = torch.softmax(logits, dim=1)
            max_conf = probs.max(dim=1).values
            all_softmax.append(max_conf.cpu().numpy())
            
            # Energy score (lower = more in-distribution)
            energy = -T * torch.logsumexp(logits / T, dim=1)
            all_energy.append(energy.cpu().numpy())
    
    return np.concatenate(all_softmax), np.concatenate(all_energy)

cifar_loader = torch.utils.data.DataLoader(cifar_test, batch_size=256)
svhn_loader = torch.utils.data.DataLoader(svhn_test, batch_size=256)

cifar_softmax, cifar_energy = get_softmax_and_energy(cifar_loader, model)
svhn_softmax, svhn_energy = get_softmax_and_energy(svhn_loader, model)

# AUROC: in-distribution = 0, OOD = 1
labels = np.concatenate([
    np.zeros(len(cifar_softmax)),  # in-distribution
    np.ones(len(svhn_softmax))     # OOD
])

# For softmax: higher = more in-distribution → negate for AUROC
softmax_scores = np.concatenate([-cifar_softmax, -svhn_softmax])
# For energy: higher = more OOD → use directly
energy_scores = np.concatenate([cifar_energy, svhn_energy])

auroc_softmax = roc_auc_score(labels, softmax_scores)
auroc_energy = roc_auc_score(labels, energy_scores)

print(f"AUROC (softmax): {auroc_softmax:.3f}")
print(f"AUROC (energy):  {auroc_energy:.3f}")
```

**Expected results:**
- Softmax confidence AUROC: 0.65–0.75 (weak separation, many SVHN inputs receive high softmax confidence)
- Energy AUROC: 0.85–0.93 (better separation, energy correctly assigns lower values to CIFAR-10)

**For routing threshold (90% TPR):** At 90% TPR, false positive rate (legitimate CIFAR-10 inputs sent for human review) is typically 15–25%. The tradeoff: tightening threshold reduces FPR but increases missed OOD items sent through automatic processing.
