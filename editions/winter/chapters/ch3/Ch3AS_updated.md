# Chapter 3 Tech Exercise Solutions

*Worked solutions to Appendix 3A exercises*

---

## Exercise 3A.1: Spam Filter Distribution Shift Diagnosis

**Problem:** A spam filter achieves 99.2% accuracy on test set, 96.1% in deployment. The test set was drawn from the same email corpus as training.

**Solution:**

**(a) Most likely type of distribution shift:**

Primary: **Covariate shift** — P(x) has changed in deployment. New senders, new subjects, new phishing styles, new vocabulary (platform names, cultural references). The definition of spam (P(y|x)) is roughly constant — spam is still spam — but what email looks like has changed.

Secondary possibility: **Concept drift** — if spam techniques have evolved significantly, P(y|x) may also have changed. For example, if "invoice phishing" (professional-looking fake invoices) was rare in training data but common at deployment time, the model may have never learned to identify it as spam.

The 3.1 percentage point gap between test and deployment (both drawn from the same source) is unusually small if training and deployment data are truly from the same distribution. That the test/train gap is virtually zero (99.2% test vs. implicit ~99% train) while the deployment gap is larger suggests primarily deployment distribution shift rather than overfitting.

**(b) How to diagnose it:**

Step 1: **Confidence score analysis** — compute the distribution of confidence scores in deployment vs. training. If deployment emails cluster at mid-range confidence (0.4-0.7) more often than training emails, the model is encountering more uncertain cases.

Step 2: **Error pattern analysis** — collect false positives and false negatives from deployment. Are they systematically similar in some way? (New sender domains? New vocabulary? Specific formatting?)

Step 3: **Temporal analysis** — if you have timestamps, is accuracy declining over time? Rate of decline indicates drift speed.

Step 4: **Feature distribution comparison** — compare distributions of key features (word frequencies, domain types, email lengths) between training corpus and deployment corpus using MMD or KS tests.

```python
# Temporal accuracy monitoring
from scipy.stats import ks_2samp
import numpy as np

def monitor_deployment_drift(train_features, deploy_batches, threshold=0.05):
    """
    Detect distribution drift in deployment using KS test.
    
    Parameters:
    - train_features: numpy array, shape (n_train, n_features)
    - deploy_batches: list of numpy arrays, each batch is 1-week's data
    - threshold: p-value threshold for drift detection
    
    Returns: list of (batch_index, feature_index, p_value) drift alerts
    """
    alerts = []
    for batch_idx, batch in enumerate(deploy_batches):
        for feat_idx in range(train_features.shape[1]):
            stat, p_val = ks_2samp(
                train_features[:, feat_idx], 
                batch[:, feat_idx]
            )
            if p_val < threshold:
                alerts.append((batch_idx, feat_idx, p_val))
    return alerts
```

**(c) Best HITL intervention:**

Three-pronged approach:

**Immediate:** Lower the confidence threshold for routing emails to spam folder rather than inbox. Accept more false positives (legitimate email in spam) in exchange for fewer false negatives (spam in inbox) until the model can be retrained.

**Short-term HITL:** Add a "Report as spam" button that routes flagged emails directly into a labeled training batch — this is the existing Gmail approach but making it more prominent during a drift period.

**Systematic:** Deploy an active learning loop: emails the model is uncertain about (confidence 0.4-0.6) get sampled and sent to human reviewers weekly. Their labels are used in monthly model updates.

The HITL intervention targets the epistemic uncertainty introduced by distribution shift: new types of spam that the model hasn't seen are exactly the cases that benefit from human labels.

---

## Exercise 3A.2: Large Pre-trained Model vs. Simpler Domain-Specific Model

**Problem:** Explain why a large pre-trained LLM fine-tuned on a small domain-specific dataset might be riskier in HITL deployment than a simpler model trained on a larger domain-specific dataset.

**Solution:**

**Bias-Variance Analysis:**

A large pre-trained model fine-tuned on small domain data:
- Has very low bias (capable of representing complex functions)
- Has high variance with respect to the fine-tuning data (it overfits to the small dataset's patterns and noise)
- Has a large, complex internal representation that is difficult to interpret

A simpler model trained on a larger domain-specific dataset:
- Has higher bias (limited capacity)
- Has lower variance (the larger dataset regularizes the learning)
- Has more predictable failure modes

**The HITL-Specific Risk:**

The large pre-trained model has learned general language patterns from a massive corpus that may not match the domain. During fine-tuning on small domain data, it:
1. Retains general knowledge (good)
2. Also retains biases and patterns from pre-training that conflict with domain specifics (risky)
3. May appear highly confident on domain-specific queries where its actual accuracy is poor

This creates exactly the "confident but wrong" failure mode that is hardest for HITL systems to catch: the model's expressed confidence is high (from the large pre-training base), but its domain-specific accuracy is lower than that confidence implies.

The simpler model, by contrast, will be uncertain about the same things it's bad at — a better alignment between expressed uncertainty and actual error that makes uncertainty-based HITL routing more effective.

**Monitoring Recommendations:**

```python
class DomainDriftMonitor:
    """
    Monitor a fine-tuned model for signs of pre-training influence dominating.
    """
    def __init__(self, domain_keywords, model_tokenizer):
        self.domain_keywords = set(domain_keywords)
        self.tokenizer = model_tokenizer
        self.confidence_by_domain_density = defaultdict(list)
    
    def compute_domain_density(self, text):
        """Fraction of tokens that are domain-specific keywords."""
        tokens = self.tokenizer.tokenize(text.lower())
        domain_tokens = sum(1 for t in tokens if t in self.domain_keywords)
        return domain_tokens / len(tokens) if tokens else 0
    
    def log_prediction(self, text, confidence, correct):
        density = self.compute_domain_density(text)
        bucket = round(density * 10) / 10  # Bin to nearest 0.1
        self.confidence_by_domain_density[bucket].append((confidence, correct))
    
    def check_calibration_by_density(self):
        """
        A well-behaved fine-tuned model should be more confident and more accurate
        on high-density domain text. If confidence doesn't track accuracy by density,
        the model is miscalibrated on domain content.
        """
        for density, records in sorted(self.confidence_by_domain_density.items()):
            confidences = [r[0] for r in records]
            accuracies = [r[1] for r in records]
            print(f"Domain density {density:.1f}: "
                  f"mean confidence={np.mean(confidences):.3f}, "
                  f"actual accuracy={np.mean(accuracies):.3f}")
```

**Additional monitoring:** Track ECE separately on domain-core queries vs. peripheral queries; compare confidence scores on domain-specific phrasing vs. general language; run monthly audits of random high-confidence samples.

---

## Exercise 3A.3: MMD Monitoring Implementation and Threshold

**Problem:** Implement MMD monitoring for distribution drift detection. What threshold would you use?

**Solution:**

```python
import numpy as np
from scipy.spatial.distance import cdist
from scipy.stats import permutation_test

def compute_mmd(X_ref, X_new, sigma=None):
    """
    Compute Maximum Mean Discrepancy between reference and new data distributions.
    Uses RBF (Gaussian) kernel.
    
    Parameters:
    - X_ref: reference distribution samples, shape (n_ref, d)
    - X_new: new distribution samples, shape (n_new, d)
    - sigma: RBF bandwidth; if None, uses median heuristic
    
    Returns: MMD² statistic (non-negative; 0 = identical distributions)
    """
    if sigma is None:
        # Median heuristic for bandwidth selection
        all_data = np.vstack([X_ref, X_new])
        dists = cdist(all_data, all_data, 'euclidean')
        sigma = np.median(dists[dists > 0])
    
    def rbf(X, Y):
        dists_sq = cdist(X, Y, 'sqeuclidean')
        return np.exp(-dists_sq / (2 * sigma**2))
    
    K_rr = rbf(X_ref, X_ref)
    K_nn = rbf(X_new, X_new)
    K_rn = rbf(X_ref, X_new)
    
    n_r, n_n = len(X_ref), len(X_new)
    
    # Unbiased estimator
    mmd2 = (K_rr.sum() - np.trace(K_rr)) / (n_r * (n_r - 1))
    mmd2 += (K_nn.sum() - np.trace(K_nn)) / (n_n * (n_n - 1))
    mmd2 -= 2 * K_rn.mean()
    
    return max(0, mmd2)

def mmd_threshold_via_permutation(X_ref, X_new, n_permutations=500, alpha=0.05):
    """
    Compute a data-driven threshold using permutation testing.
    Returns the MMD value at the (1-alpha) quantile under the null hypothesis.
    """
    combined = np.vstack([X_ref, X_new])
    n_ref = len(X_ref)
    
    null_mmds = []
    for _ in range(n_permutations):
        perm = np.random.permutation(len(combined))
        perm_ref = combined[perm[:n_ref]]
        perm_new = combined[perm[n_ref:]]
        null_mmds.append(compute_mmd(perm_ref, perm_new))
    
    threshold = np.quantile(null_mmds, 1 - alpha)
    return threshold

# Production monitoring class
class MMDProductionMonitor:
    def __init__(self, reference_embeddings, window_size=500, alpha=0.05):
        self.reference = reference_embeddings
        self.window = []
        self.window_size = window_size
        self.threshold = mmd_threshold_via_permutation(
            reference_embeddings[:200],  # Sample for speed
            reference_embeddings[200:400],  # Bootstrap
            alpha=alpha
        )
        print(f"Drift threshold set to: {self.threshold:.4f}")
    
    def add_sample(self, embedding):
        self.window.append(embedding)
        if len(self.window) >= self.window_size:
            window_array = np.array(self.window)
            mmd = compute_mmd(self.reference[:500], window_array)
            
            if mmd > self.threshold:
                print(f"DRIFT ALERT: MMD={mmd:.4f} > threshold={self.threshold:.4f}")
                print(f"Recommend human audit of recent {self.window_size} cases")
            
            self.window = self.window[self.window_size // 2:]  # Sliding window
```

**Threshold Selection Guidance:**

There is no universally correct threshold. Practical guidance:

- **Permutation test (α=0.05):** The most principled approach. Generates a threshold under the null hypothesis of "same distribution." Use this when you have sufficient reference data (>200 samples).

- **Simple heuristic for high-stakes applications:** Use the 95th percentile of MMD values observed during a known-stable period. Alert if current MMD exceeds this.

- **Operational consideration:** A lower threshold (more sensitive) triggers more human audits; a higher threshold (less sensitive) catches only large shifts. For medical and safety-critical applications, err toward lower thresholds. For content moderation, balance sensitivity with review workload.

**What triggers a human review audit:**
When MMD drift is detected, the appropriate HITL intervention is:
1. Sample 50-100 recent cases and have human experts review them
2. Check for systematic errors in those cases
3. Determine if the model needs retraining on the new distribution
4. Temporarily lower the confidence threshold for human routing until retraining is complete

---

## Exercise 3A.4: Aleatoric Uncertainty and Irreducible Error

**Problem:** Explain technically why HITL cannot reduce aleatoric uncertainty. What should a HITL system do when it detects high aleatoric uncertainty?

**Solution:**

**Technical Explanation:**

Aleatoric uncertainty arises from irreducible noise in the data generating process. Formally, even with infinite training data and an optimal Bayesian estimator, the expected error equals the aleatoric component:

```
lim_{|D|→∞} E[L(f*(x), y)] = σ²_aleatoric(x)
```

Where f* is the Bayes-optimal predictor. This irreducible error persists because:

1. The true relationship between x and y is probabilistic: P(y|x) has intrinsic variance
2. No amount of additional training examples changes P(y|x)
3. No additional model capacity helps because the function is already learned optimally
4. A human expert, given the same input x, faces the same P(y|x) distribution

**Example:** A speech recognizer on a recording made in a thunderstorm. The acoustic information is physically corrupted. A human transcriptionist given the same recording would have the same accuracy ceiling. Sending this case to a human reviewer adds cost, latency, and reviewer frustration without improving outcomes.

**What a HITL System Should Do:**

Rather than routing to human review, the appropriate responses to high aleatoric uncertainty are:

**Option 1: Request better data**
If the data quality is the source of uncertainty, the correct response is to acquire better data:
```
if aleatoric_uncertainty(x) > threshold_aleatoric:
    return Response.REQUEST_NEW_SAMPLE(reason="Input quality insufficient for reliable classification")
```

**Option 2: Acknowledge uncertainty to end user**
Communicate the ambiguity honestly without routing to a human who cannot resolve it:
```
if aleatoric_uncertainty(x) > threshold_aleatoric:
    return Response.COMMUNICATE_UNCERTAINTY(
        message="This case is genuinely ambiguous. Here are the most likely interpretations: [A, B, C]",
        confidence_interval=True
    )
```

**Option 3: Return multiple predictions with probabilities**
Rather than forcing a single label, return the full predictive distribution:
```
P(y="positive" | x) = 0.47
P(y="negative" | x) = 0.53
```

**Distinguishing Aleatoric from Epistemic in Practice:**

A practical heuristic: if multiple human annotators also disagree significantly on the same case, it is likely primarily aleatoric. If they agree strongly, the uncertainty is likely epistemic (the model doesn't know what they know). 

Inter-annotator agreement rate on model-uncertain cases is therefore a useful diagnostic: low agreement → likely aleatoric; high agreement → likely epistemic → high HITL value.

---
