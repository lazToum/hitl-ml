# Technical Appendix 3A: Machine Learning Foundations for HITL Design

*The mathematics of training, generalization, and distribution shift*

---

## 3A.1 Empirical Risk Minimization

The core framework for supervised machine learning is empirical risk minimization (ERM). Given training data D = {(x_i, y_i)}^n_{i=1}, we find parameters θ that minimize:

```
R̂(θ) = (1/n) Σ L(f_θ(x_i), y_i)
```

Where L is a loss function (e.g., cross-entropy for classification, mean squared error for regression) and f_θ is the model.

The **true risk** we care about is:

```
R(θ) = E_{(x,y)~P} [L(f_θ(x), y)]
```

The generalization gap is:

```
R(θ) - R̂(θ) ≥ 0
```

This gap is always non-negative (empirical risk is optimistically biased) and tends to grow with model complexity relative to dataset size.

---

## 3A.2 The Bias-Variance Tradeoff

For a regression model, the expected prediction error decomposes as:

```
E[(y - f̂(x))²] = Bias²(f̂(x)) + Var(f̂(x)) + σ²
                  ─────────────  ──────────────  ──
                  Systematic     Sensitivity      Irreducible
                  error          to training data noise
```

**Bias:** Error from model not capturing the true relationship (underfitting)
**Variance:** Error from sensitivity to fluctuations in training data (overfitting)
**σ²:** Aleatoric uncertainty — cannot be reduced

The bias-variance tradeoff: reducing bias (using a more complex model) typically increases variance (model fits noise), and vice versa.

**HITL design implication:** High-variance models benefit most from human-in-the-loop review because their errors are unpredictable — concentrated at unusual inputs with no systematic pattern. High-bias models benefit most from systematic data collection for the classes of inputs where bias is highest.

---

## 3A.3 Generalization Bounds

**VC Dimension Bound (Vapnik & Chervonenkis):**

For a hypothesis class H with VC dimension d_VC, with probability 1-δ:

```
R(θ) ≤ R̂(θ) + √(8/n · (d_VC · ln(2n/d_VC) + ln(4/δ)))
```

The generalization gap shrinks at rate O(√(d_VC/n)). More complex models (higher d_VC) need more data to close the gap.

**PAC-Bayes Bound:**

A tighter bound for stochastic classifiers:

```
E_{θ~Q}[R(θ)] ≤ E_{θ~Q}[R̂(θ)] + √(KL(Q||P) + ln(n/δ)) / 2n)
```

Where P is the prior and Q is the posterior distribution over parameters.

---

## 3A.4 Distribution Shift

### 3A.4.1 Types of Shift

**Covariate shift:** P(x) changes but P(y|x) stays the same.
```
P_train(x) ≠ P_test(x), but P_train(y|x) = P_test(y|x)
```
Example: spam filter trained on emails from 2020, deployed in 2025 — email styles changed but spam is still spam.

**Label shift:** P(y) changes but P(x|y) stays the same.
```
P_train(y) ≠ P_test(y), but P_train(x|y) = P_test(x|y)
```
Example: fraud rate changes seasonally; the appearance of fraud is similar but its base rate changes.

**Concept drift:** The relationship P(y|x) changes.
```
P_train(y|x) ≠ P_test(y|x)
```
Example: A hiring model trained before a policy change; the definition of "qualified" shifts.

**Wildcard:** Completely new feature space.
```
∃x ∈ X_test : p_train(x) ≈ 0
```
Example: a vision model encountering medical images after being trained on natural photographs.

### 3A.4.2 Detecting Distribution Shift

**Maximum Mean Discrepancy (MMD):**

```
MMD²(P, Q) = ||E_{x~P}[φ(x)] - E_{x~Q}[φ(x)]||²_H
```

For RBF kernel k(x, x') = exp(-||x-x'||² / 2σ²):

```python
def compute_mmd(X_train, X_test, sigma=1.0):
    """Estimate MMD between training and test distributions."""
    def rbf_kernel(X, Y):
        dists = cdist(X, Y, 'sqeuclidean')
        return np.exp(-dists / (2 * sigma**2))
    
    K_tt = rbf_kernel(X_train, X_train)
    K_ee = rbf_kernel(X_test, X_test)
    K_te = rbf_kernel(X_train, X_test)
    
    return K_tt.mean() - 2*K_te.mean() + K_ee.mean()
```

**Simple Monitoring Approach for Production HITL:**
```python
class DistributionMonitor:
    def __init__(self, reference_predictions, window_size=1000):
        self.reference = np.array(reference_predictions)
        self.window_size = window_size
        self.recent = deque(maxlen=window_size)
    
    def update(self, new_prediction):
        self.recent.append(new_prediction)
    
    def drift_score(self):
        if len(self.recent) < self.window_size:
            return None
        recent = np.array(self.recent)
        # KS test p-value (low p = significant drift)
        stat, p_value = ks_2samp(self.reference, recent)
        return stat, p_value
```

---

## 3A.5 The PAC Learning Framework

Probably Approximately Correct (PAC) learning formalizes when learning is feasible.

A concept class C is PAC learnable if there exists an algorithm A such that for any ε, δ > 0 and any distribution P over X×Y, given m ≥ poly(1/ε, 1/δ, n, size(c)) examples, with probability ≥ 1-δ:

```
R(A(D_m)) ≤ ε
```

**Key HITL implication from PAC theory:** Learning requires finite labeled examples proportional to 1/ε. For very rare categories (low prior probability), the sample required to learn them grows rapidly. Rare-category detection is a natural HITL application: human review of uncertain cases on rare categories is often the only practical way to achieve acceptable error rates.

---

## 3A.6 Exercises

**Exercise 3A.1:** A spam filter achieves 99.2% accuracy on its test set but 96.1% accuracy in deployment. The test set was drawn from the same email corpus as training. Identify: (a) what type of distribution shift is most likely; (b) how you would diagnose it; (c) what HITL intervention would help most.

**Exercise 3A.2:** Using the bias-variance decomposition, explain why a large pre-trained language model fine-tuned on a small domain-specific dataset might be riskier in HITL deployment than a simpler model trained on a larger domain-specific dataset. What monitoring would you add?

**Exercise 3A.3:** Implement a simple version of maximum mean discrepancy monitoring in Python. Use it to detect when a batch of new predictions has drifted from a reference batch. What threshold for MMD would you use to trigger a human review audit?

**Exercise 3A.4:** The irreducible error σ² in the bias-variance decomposition is analogous to aleatoric uncertainty. Explain in technical terms why human-in-the-loop intervention cannot reduce this component of error, and what a HITL system should do when it detects a case with high aleatoric uncertainty.

---

## References for Appendix 3A

- Vapnik, V. (1998). *Statistical Learning Theory*. Wiley.
- Shalev-Shwartz, S., & Ben-David, S. (2014). *Understanding Machine Learning: From Theory to Algorithms*. Cambridge University Press.
- Quinonero-Candela, J., et al. (Eds.). (2009). *Dataset Shift in Machine Learning*. MIT Press.
- Sugiyama, M., & Kawanabe, M. (2012). *Machine Learning in Non-Stationary Environments*. MIT Press.
- Gretton, A., et al. (2012). A kernel two-sample test. *Journal of Machine Learning Research*, 13, 723–773.
- McAllester, D. (1999). PAC-Bayesian model averaging. *COLT*.
