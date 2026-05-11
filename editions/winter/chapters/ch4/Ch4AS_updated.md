# Chapter 4 Tech Exercise Solutions

*Worked solutions to Appendix 4A exercises*

---

## Exercise 4A.1: Optimal Fraud Detection Threshold

**Given:** AUC = 0.94, fraud base rate P(y=1) = 0.002, C_FN = $500, C_FP = $2

**Solution:**

Using the optimal threshold formula:
```
τ* = C_FP · P(y=0) / (C_FP · P(y=0) + C_FN · P(y=1))
   = 2 · 0.998 / (2 · 0.998 + 500 · 0.002)
   = 1.996 / (1.996 + 1.0)
   = 1.996 / 2.996
   ≈ 0.0067
```

At threshold τ* ≈ 0.0067, we flag a transaction as potentially fraudulent whenever the model gives it a fraud probability above 0.67%.

**Expected False Positive Rate Analysis:**

```python
import numpy as np
from sklearn.metrics import roc_curve

# Estimate FPR at the optimal threshold using the ROC curve
# With AUC = 0.94, approximate the ROC curve
# At high sensitivity (low threshold), FPR will be substantial

# Using empirical ROC curve (conceptual):
# tau = 0.0067 is extremely low -> very high sensitivity
# With AUC = 0.94, at ~99% TPR (required by this low threshold),
# FPR is typically around 20-35% for AUC=0.94

# Approximate calculation:
# If tau = 0.0067 catches 99% of fraud (TPR = 0.99)
# With 0.2% fraud rate in 1M daily transactions:
#   True positives: 0.002 * 1M * 0.99 = 1,980 fraud flagged
#   False positives: FPR * 0.998 * 1M

# At AUC 0.94, empirically FPR ≈ 0.25 at TPR ≈ 0.99
estimated_fpr = 0.25
false_positives_per_million = estimated_fpr * 0.998 * 1_000_000
print(f"Estimated false positives per million transactions: {false_positives_per_million:,.0f}")
# Output: ~249,500 false positives per million transactions
```

**Operational Feasibility Assessment:**

249,500 false declines per million transactions = 24.95% of legitimate transactions flagged. This is operationally catastrophic — roughly 1 in 4 legitimate purchases gets declined or requires customer confirmation.

**What to do:**

1. **Option A: Accept the math but use a HITL band.** Set τ_L = 0.0067 (optimal) and τ_H = 0.10. Cases with fraud probability 0.0067-0.10 go to human review. Only highly confident fraud (>10%) gets auto-declined. This routes approximately 20% of transactions to human review — still high.

2. **Option B: Reconsider C_FP.** The $2 customer service cost is only the direct cost. Include customer churn, brand damage, and regulatory exposure. A realistic C_FP might be $20-50, which would raise τ* to 0.04-0.09.

3. **Option C: Use a two-stage system.** First stage: identify transactions that warrant any scrutiny (broad catch). Second stage: among those, determine auto-decline vs. customer verification vs. human review.

**Key lesson:** The optimal threshold from the formula can be operationally infeasible when base rates are very low and the model's discriminative power (AUC) is insufficient. This is a real situation — fraud detection routinely faces this tension between mathematical optimality and operational capacity.

---

## Exercise 4A.2: Dynamic Threshold for Content Moderation

**Given:** Normal capacity = 1000/hour, normal arrival = 800/hour (surplus), spike arrival = 2000/hour (2x overload)

**Solution:**

```python
import numpy as np
from collections import deque
import time

class DynamicThresholdManager:
    """
    Dynamically adjusts the HITL band based on review queue capacity.
    
    Operates on the principle: when the queue is overloaded,
    narrow the band (fewer cases go to human review, accepting higher autonomous error rate).
    When the queue has capacity, widen the band (more review, lower autonomous error rate).
    """
    
    def __init__(
        self,
        base_tau_l=0.3,    # Lower threshold in normal conditions
        base_tau_h=0.7,    # Upper threshold in normal conditions
        max_capacity=1000,  # Max human reviews per hour
        adjustment_rate=0.05,  # How much to shift thresholds per update
        update_interval_minutes=5
    ):
        self.tau_l = base_tau_l
        self.tau_h = base_tau_h
        self.base_tau_l = base_tau_l
        self.base_tau_h = base_tau_h
        self.max_capacity = max_capacity
        self.adjustment_rate = adjustment_rate
        self.queue_depth = 0
        self.recent_arrivals = deque(maxlen=60)  # Last 60 minutes
    
    def update_queue(self, arrivals_last_minute, reviews_completed_last_minute):
        """Update queue depth based on throughput."""
        self.queue_depth += arrivals_last_minute - reviews_completed_last_minute
        self.queue_depth = max(0, self.queue_depth)
        self.recent_arrivals.append(arrivals_last_minute)
    
    def adjust_thresholds(self):
        """
        Adjust thresholds based on queue depth.
        
        Strategy:
        - Queue growing: narrow the band (fewer reviews)
        - Queue shrinking / comfortable: widen the band (more reviews)
        """
        projected_hourly_rate = sum(self.recent_arrivals) if self.recent_arrivals else 0
        
        # Utilization ratio: how much of capacity is being used
        utilization = projected_hourly_rate / self.max_capacity
        
        if utilization > 1.2:  # Significantly overloaded
            # Narrow the band aggressively: raise lower threshold, lower upper threshold
            self.tau_l = min(self.tau_l + self.adjustment_rate * 2, 0.45)
            self.tau_h = max(self.tau_h - self.adjustment_rate * 2, 0.55)
            return "OVERLOADED: narrowed band"
        elif utilization > 0.9:  # Slightly stressed
            self.tau_l = min(self.tau_l + self.adjustment_rate, 0.4)
            self.tau_h = max(self.tau_h - self.adjustment_rate, 0.6)
            return "STRESSED: slightly narrowed"
        elif utilization < 0.5:  # Underutilized: can handle more
            self.tau_l = max(self.tau_l - self.adjustment_rate, 0.1)
            self.tau_h = min(self.tau_h + self.adjustment_rate, 0.9)
            return "UNDERUTILIZED: widened band"
        else:
            return "STABLE: no change"
    
    def classify(self, score):
        """Classify a case given current thresholds."""
        if score >= self.tau_h:
            return 'auto_positive'
        elif score <= self.tau_l:
            return 'auto_negative'
        else:
            return 'human_review'
    
    def get_status(self):
        return {
            'tau_l': self.tau_l,
            'tau_h': self.tau_h,
            'band_width': self.tau_h - self.tau_l,
            'queue_depth': self.queue_depth
        }


# Simulation
manager = DynamicThresholdManager()

# Normal conditions (800/hour, 1000 capacity)
print("--- Normal conditions ---")
for _ in range(10):
    manager.update_queue(arrivals_last_minute=13, reviews_completed_last_minute=16)
    status = manager.adjust_thresholds()
    print(f"  {status}: tau_l={manager.tau_l:.2f}, tau_h={manager.tau_h:.2f}")

print("\n--- Breaking news spike (2000/hour) ---")
for _ in range(10):
    manager.update_queue(arrivals_last_minute=33, reviews_completed_last_minute=16)
    status = manager.adjust_thresholds()
    print(f"  {status}: tau_l={manager.tau_l:.2f}, tau_h={manager.tau_h:.2f}")
```

**Consequences During High-Traffic Period:**

| Error Type | Normal conditions | Breaking-news spike |
|-----------|------------------|---------------------|
| False Positive Rate (auto) | Low (wide band sends ambiguous to humans) | Higher (band narrows, more auto-decisions) |
| False Negative Rate (auto) | Low | Higher |
| Human Review Volume | ~25% of traffic | ~10% of traffic |
| Human Review Quality | Good (manageable load) | Risk of fatigue (high volume per reviewer) |

**Key design insight:** Even after threshold adjustment, if the arrival rate far exceeds capacity (2000 vs 1000), you cannot fully compensate by adjusting thresholds. At some point, the system must acknowledge that review quality will suffer and alert operators to scale human capacity, not just adjust thresholds.

---

## Exercise 4A.3: Band Width Optimization

```python
import numpy as np
from scipy.optimize import minimize_scalar

def simulate_three_way_system(scores, true_labels, tau_l, tau_h,
                                c_fn=500, c_fp=50, c_human=2,
                                human_accuracy=0.95):
    """
    Simulate a three-way classification system and compute total cost.
    
    Parameters:
    - scores: array of model confidence scores
    - true_labels: array of true labels {0,1}
    - tau_l, tau_h: lower/upper thresholds
    - c_fn: cost of false negative (missed positive)
    - c_fp: cost of false positive (incorrect positive)
    - c_human: cost per human review
    - human_accuracy: fraction of human reviews with correct outcome
    """
    n = len(scores)
    
    # Three zones
    auto_neg = scores < tau_l
    auto_pos = scores > tau_h
    human_zone = (scores >= tau_l) & (scores <= tau_h)
    
    # Auto-negative errors (false negatives)
    fn_auto = (auto_neg & (true_labels == 1)).sum()
    fp_auto = (auto_pos & (true_labels == 0)).sum()
    
    # Human zone: assume human accuracy
    human_fn = human_zone.sum() * (true_labels[human_zone] == 1).mean() * (1 - human_accuracy)
    human_fp = human_zone.sum() * (true_labels[human_zone] == 0).mean() * (1 - human_accuracy)
    
    # Compute costs
    total_fn = fn_auto + human_fn
    total_fp = fp_auto + human_fp
    total_human_cost = human_zone.sum() * c_human
    
    total_cost = total_fn * c_fn + total_fp * c_fp + total_human_cost
    
    return {
        'total_cost': total_cost,
        'review_rate': human_zone.mean(),
        'fn_rate': total_fn / max(true_labels.sum(), 1),
        'fp_rate': total_fp / max((true_labels == 0).sum(), 1),
    }

# Example: sweep band width around optimal threshold
np.random.seed(42)
n_samples = 10000
true_labels = (np.random.random(n_samples) < 0.1).astype(int)  # 10% positive rate
scores = np.random.beta(2 if l == 1 else 1, 1 if l == 1 else 2, 1)[0]
# ... generate realistic scores

# In practice: vary tau_l from 0.2 to 0.4, tau_h from 0.6 to 0.8
# Find minimum total cost
results = []
for tau_l in np.arange(0.2, 0.5, 0.05):
    for tau_h in np.arange(0.5, 0.85, 0.05):
        if tau_h > tau_l:
            r = simulate_three_way_system(scores, true_labels, tau_l, tau_h)
            results.append({'tau_l': tau_l, 'tau_h': tau_h, **r})

# Optimal: min total cost
optimal = min(results, key=lambda x: x['total_cost'])
print(f"Optimal: tau_l={optimal['tau_l']:.2f}, tau_h={optimal['tau_h']:.2f}")
print(f"Review rate: {optimal['review_rate']:.1%}")
print(f"Total cost: ${optimal['total_cost']:,.0f}")
```

**Key Finding:** The optimal band width increases as:
- C_FN/C_FP increases (human review is worth more when machine errors are costly)
- Human accuracy advantage over the model increases
- C_human decreases (cheaper review)

The band narrows to zero when human accuracy equals model accuracy (no benefit to review), or when C_human is very high relative to error costs.

---
