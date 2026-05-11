# Technical Appendix 4A: Threshold Optimization and Cost-Sensitive Learning

*The mathematics of decision boundaries and error cost tradeoffs*

---

## 4A.1 The ROC Curve and AUC

### 4A.1.1 Definition

For a binary classifier with scores s(x) ∈ [0,1], sweeping the threshold τ ∈ [0,1] traces the Receiver Operating Characteristic (ROC) curve:

```
TPR(τ) = P(s(x) ≥ τ | y = 1)   [True Positive Rate / Sensitivity]
FPR(τ) = P(s(x) ≥ τ | y = 0)   [False Positive Rate]
```

The Area Under the ROC Curve (AUC) equals the probability that a random positive is scored higher than a random negative:

```
AUC = P(s(x+) > s(x-))
```

AUC measures ranking quality, independent of threshold choice.

**Key insight:** AUC tells you how separable your classes are. The threshold tells you where to make the cut given your cost structure. These are separate questions.

### 4A.1.2 Optimal Threshold Selection

The optimal threshold τ* minimizes expected cost:

```
E[Cost(τ)] = C_FN · FNR(τ) · P(y=1) + C_FP · FPR(τ) · P(y=0)
```

Where:
- C_FN = cost of false negative (miss)
- C_FP = cost of false positive (false alarm)
- P(y=1) = base rate of positive class

Setting dE[Cost(τ)]/dτ = 0 gives optimal threshold:

```
τ* = C_FP · P(y=0) / (C_FP · P(y=0) + C_FN · P(y=1))
```

For equal costs (C_FN = C_FP) and balanced classes (P(y=0) = P(y=1) = 0.5): τ* = 0.5

For C_FN >> C_FP (missing positive is very costly, e.g., cancer screening): τ* << 0.5

---

## 4A.2 Precision-Recall Tradeoff

### 4A.2.1 When AUC is Misleading

AUC is dominated by performance on the majority class. For imbalanced problems (rare positive class), precision-recall analysis is more informative.

```
Precision(τ) = TP / (TP + FP) = P(y=1 | s(x) ≥ τ)
Recall(τ)    = TP / (TP + FN) = P(s(x) ≥ τ | y=1)
```

**F_β score** balances precision and recall with weight β:

```
F_β = (1 + β²) · Precision · Recall / (β² · Precision + Recall)
```

- β = 1: Equal weight on precision and recall (F1 score)
- β = 2: Recall twice as important (use when false negatives are more costly)
- β = 0.5: Precision twice as important (use when false positives are more costly)

### 4A.2.2 HITL Band as Precision-Recall Bridge

A two-threshold HITL system (τ_low, τ_high) with human review for scores in (τ_low, τ_high):

```
Automated True Positive Rate = P(s(x) ≥ τ_high | y=1)
Automated False Positive Rate = P(s(x) ≥ τ_high | y=0)
Human Review Rate = P(τ_low ≤ s(x) < τ_high)
```

This system achieves full precision (only reviews above τ_high are automated positive) at the cost of sending the uncertain band to humans. Optimizing the band width trades reviewer workload against precision/recall tradeoffs.

---

## 4A.3 Cost-Sensitive Learning

### 4A.3.1 Class Weighting

Most ML frameworks allow cost-sensitive training via class weights. For a binary classifier with C_FN ≠ C_FP:

```python
# PyTorch
weight = torch.tensor([C_FP, C_FN])
loss_fn = nn.CrossEntropyLoss(weight=weight)

# scikit-learn
from sklearn.linear_model import LogisticRegression
model = LogisticRegression(class_weight={0: C_FP, 1: C_FN})
```

This biases the model to minimize the more costly error during training, shifting the effective threshold.

### 4A.3.2 Calibrated Decision Rules

Given a well-calibrated model with output p(x) = P(y=1|x):

```python
def optimal_decision(score, c_fp, c_fn, base_rate):
    """
    Make optimal decision given cost structure.
    
    Returns: 'positive', 'negative', or 'uncertain' (for HITL routing)
    """
    # Expected cost of predicting positive at this score
    # (P(y=0|x) * C_FP vs P(y=1|x) * C_FN)
    p_positive = score  # Calibrated score = P(y=1|x)
    p_negative = 1 - score
    
    cost_predict_positive = p_negative * c_fp
    cost_predict_negative = p_positive * c_fn
    
    # Optimal threshold: score where cost_positive = cost_negative
    tau_optimal = c_fp / (c_fp + c_fn)
    
    # HITL band: add uncertainty margin around optimal threshold
    margin = 0.1  # Adjustable
    
    if score >= tau_optimal + margin:
        return 'positive'
    elif score <= tau_optimal - margin:
        return 'negative'
    else:
        return 'uncertain'  # Route to human review
```

---

## 4A.4 Multi-Threshold HITL Systems

### 4A.4.1 Three-Way Classification

A HITL band system partitions the score space into three regions:

```
[0, τ_L)        → Automatic NEGATIVE (high confidence negative)
[τ_L, τ_H]      → HUMAN REVIEW (uncertain)
(τ_H, 1]        → Automatic POSITIVE (high confidence positive)
```

**Optimization:** Find τ_L and τ_H to minimize total system cost:

```
Cost(τ_L, τ_H) = 
    C_FN · P(s(x) < τ_L | y=1) · P(y=1)           [missed positives]
  + C_FP · P(s(x) > τ_H | y=0) · P(y=0)           [false alarms (automated)]
  + C_H  · P(τ_L ≤ s(x) ≤ τ_H)                    [human review cost]
  + C_H_FN · P(human misses y=1 in band)           [human miss rate in band]
  + C_H_FP · P(human false alarms in band)          [human FP rate in band]
```

Where C_H is the per-case review cost and C_H_FN, C_H_FP account for human errors.

### 4A.4.2 Capacity Constraints

When human review has a capacity constraint (max reviews per unit time = R_max):

```
P(τ_L ≤ s(x) ≤ τ_H) · arrival_rate ≤ R_max
```

This adds a constraint to the optimization. As arrival_rate increases (busy periods), the band (τ_H - τ_L) must narrow — fewer cases go to human review, more are handled autonomously. This is the mathematical basis for the observation in Chapter 4 that threshold settings must adapt to reviewer capacity.

---

## 4A.5 Exercises

**Exercise 4A.1:** A fraud detection system achieves AUC = 0.94. The base rate of fraud is 0.2%, C_FN = $500 (average fraud amount), C_FP = $2 (customer service cost of false decline). Compute the optimal threshold τ* using the formula from Section 4A.1.2. At this threshold, what is the expected false positive rate? Is this operationally feasible?

**Exercise 4A.2:** A content moderation system has a human review capacity of 1000 cases/hour. The arrival rate of flagged content is 800/hour normally, but spikes to 2000/hour during breaking news events. Design a dynamic threshold system that adjusts τ_L and τ_H based on current review queue length. What are the consequences for each error type during a high-traffic period?

**Exercise 4A.3:** Implement the three-way classification system from Section 4A.4.1 in Python. Create a simulation where you vary the margin parameter and observe how the review rate, false negative rate, and false positive rate change. Find the margin that minimizes total cost for a given cost structure.

**Exercise 4A.4:** Draw the ROC curve and precision-recall curve for the same model on an imbalanced dataset (1% positive class). Identify the operating point on each curve that corresponds to the optimal threshold from 4A.1.2. Why does the ROC curve look more favorable than the PR curve for this scenario?

---

## References for Appendix 4A

- Elkan, C. (2001). The foundations of cost-sensitive learning. *IJCAI*, 17(1), 973–978.
- Fawcett, T. (2006). An introduction to ROC analysis. *Pattern Recognition Letters*, 27(8), 861–874.
- Zadrozny, B., & Elkan, C. (2001). Obtaining calibrated probability estimates from decision trees and naive Bayesian classifiers. *ICML*.
- Davis, J., & Goadrich, M. (2006). The relationship between Precision-Recall and ROC curves. *ICML*.
- Hernández-Orallo, J., Flach, P., & Ferri, C. (2012). A unified view of performance metrics: Translating threshold choice into expected classification loss. *Journal of Machine Learning Research*, 13, 2813–2869.
