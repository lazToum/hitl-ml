# Technical Appendix 7A: Annotation Metrics, Agreement Statistics, and Label Quality

*Formal treatment of inter-annotator agreement, framing effects, and annotation pipeline design*

---

## 1. Cohen's Kappa: Derivation and Properties

### 1.1 Basic Formula

For two annotators labeling $N$ items into $k$ categories:

Let $n_{ij}$ = number of items where annotator 1 assigned category $i$ and annotator 2 assigned category $j$.

$$P_o = \frac{\sum_i n_{ii}}{N} \quad \text{(observed agreement)}$$

$$P_e = \sum_i \frac{n_{i\cdot}}{N} \cdot \frac{n_{\cdot i}}{N} \quad \text{(expected chance agreement)}$$

$$\kappa = \frac{P_o - P_e}{1 - P_e}$$

where $n_{i\cdot} = \sum_j n_{ij}$ is the row marginal and $n_{\cdot i} = \sum_j n_{ji}$ is the column marginal.

**Properties:**
- $\kappa = 1$: Perfect agreement
- $\kappa = 0$: Agreement no better than chance
- $\kappa < 0$: Systematic disagreement (worse than chance)
- $\kappa$ is bounded by the marginal distributions; maximum $\kappa < 1$ when marginals are asymmetric

### 1.2 Variance and Confidence Intervals

$$\text{Var}(\kappa) \approx \frac{P_o(1-P_o)}{N(1-P_e)^2}$$

Approximate 95% confidence interval:

$$\kappa \pm 1.96 \sqrt{\text{Var}(\kappa)}$$

> **Note:** This is a simplified approximation that ignores variance from estimating $P_e$ itself. It will produce confidence intervals that are slightly too narrow, especially when $P_e$ is large or $N$ is small. For publication-quality intervals, use the exact formula from Fleiss (1971) or a bootstrap estimate.

For reliable kappa estimates, require $N \geq 30$ items per annotator pair.

### 1.3 Weighted Kappa (for Ordinal Categories)

When categories have a natural ordering (e.g., 1-5 severity ratings), disagreements of different magnitudes should be penalized differently.

Linear weights: $w_{ij} = 1 - \frac{|i - j|}{k - 1}$

Quadratic weights: $w_{ij} = 1 - \left(\frac{i-j}{k-1}\right)^2$

Define weighted observed and expected agreement:

$$P_o^w = \sum_{ij} \frac{w_{ij}\, n_{ij}}{N}, \qquad P_e^w = \sum_{ij} w_{ij}\, P_{e,ij}$$

Weighted kappa follows the same structure as unweighted kappa (Cohen, 1968):

$$\kappa_w = \frac{P_o^w - P_e^w}{1 - P_e^w}$$

Quadratic weights are standard for medical rating scales; linear weights are standard for quality assessments.

---

## 2. Fleiss' Kappa: Extension to Multiple Annotators

For $M$ annotators labeling $N$ items into $k$ categories:

Let $n_{ij}$ = number of annotators who assigned item $i$ to category $j$.

$$\bar{P} = \frac{1}{NM(M-1)} \sum_i \sum_j n_{ij}(n_{ij}-1)$$

$$\bar{P}_e = \sum_j \left(\frac{\sum_i n_{ij}}{NM}\right)^2$$

$$\kappa_F = \frac{\bar{P} - \bar{P}_e}{1 - \bar{P}_e}$$

**When to use Fleiss' vs. Cohen's kappa:**
- Cohen's kappa: exactly two annotators
- Fleiss' kappa: three or more annotators, subset of items labeled by each
- Intraclass correlation (ICC): continuous ratings, when you want to generalize to the population of raters

---

## 3. Annotation as a Bayesian Inference Problem

### 3.1 Dawid-Skene Model

The Dawid-Skene model (1979) treats annotator labels as noisy observations of a true latent label, and estimates both the true labels and the annotator error rates jointly.

For item $i$, annotator $j$, and observed label $y_{ij}$:

$$P(y_{ij} = l \mid z_i = k) = \pi_{jkl}$$

where $z_i$ is the true label for item $i$, and $\pi_{jkl}$ is annotator $j$'s probability of labeling as $l$ when the true label is $k$.

The model parameters are estimated via EM:

**E-step:** Compute posterior probability of true label given observed labels:

$$P(z_i = k \mid \mathbf{y}_i) \propto p_k \prod_j \prod_l \pi_{jkl}^{\mathbf{1}[y_{ij}=l]}$$

**M-step:** Update annotator error rates and class priors:

$$\hat{\pi}_{jkl} = \frac{\sum_i P(z_i=k) \cdot \mathbf{1}[y_{ij}=l]}{\sum_i P(z_i=k)}$$

$$\hat{p}_k = \frac{1}{N} \sum_i P(z_i = k)$$

The Dawid-Skene model recovers more accurate true labels than majority voting, especially when annotator quality varies substantially.

### 3.2 Implementation

```python
import numpy as np
from scipy.special import logsumexp

def dawid_skene_em(annotations, n_classes, n_iters=50):
    """
    annotations: dict {item_id: {annotator_id: label}}
    n_classes: number of label classes
    Returns: estimated true labels, annotator confusion matrices
    """
    items = list(annotations.keys())
    annotators = list(set(a for item in annotations.values() 
                         for a in item.keys()))
    N, K, M = len(items), n_classes, len(annotators)
    
    # Initialize with majority vote
    T = np.zeros((N, K))  # T[i,k] = P(z_i = k)
    for i, item in enumerate(items):
        votes = list(annotations[item].values())
        for v in votes:
            T[i, v] += 1
        T[i] /= T[i].sum()
    
    # Initialize annotator confusion matrices
    pi = np.ones((M, K, K)) / K
    
    for iteration in range(n_iters):
        # M-step: update pi and class priors
        for j, ann in enumerate(annotators):
            for k in range(K):
                for l in range(K):
                    numerator = sum(
                        T[i, k] for i, item in enumerate(items)
                        if ann in annotations[item] 
                        and annotations[item][ann] == l
                    )
                    denominator = sum(T[i, k] for i in range(N))
                    pi[j, k, l] = numerator / (denominator + 1e-10)
        
        class_prior = T.mean(axis=0)
        
        # E-step: update T
        log_T = np.zeros((N, K))
        for i, item in enumerate(items):
            for k in range(K):
                log_T[i, k] = np.log(class_prior[k] + 1e-10)
                for j, ann in enumerate(annotators):
                    if ann in annotations[item]:
                        l = annotations[item][ann]
                        log_T[i, k] += np.log(pi[j, k, l] + 1e-10)
        
        # Normalize
        log_T -= logsumexp(log_T, axis=1, keepdims=True)
        T = np.exp(log_T)
    
    return T, pi
```

---

## 4. Framing Effects: Formal Model

### 4.1 Signal Detection Theory Framework

Model annotation as a signal detection problem. The annotator observes an item $x$ with a latent "harmfulness" signal $s(x) \in \mathbb{R}$, and classifies it by comparing to a threshold $\theta$:

$$\hat{y} = \begin{cases} 1 & \text{if } s(x) > \theta \\ 0 & \text{if } s(x) \leq \theta \end{cases}$$

The annotation guideline framing shifts the threshold $\theta$ for individual annotators. Define:

$$\theta_A = \theta_0 + \Delta_A \quad \text{(framing A shifts threshold by } \Delta_A\text{)}$$

Higher $\theta$ (more conservative framing) → fewer positives labeled.
Lower $\theta$ (more liberal framing) → more positives labeled.

The inter-annotator agreement can be modeled as a function of the variance in individual thresholds:

$$\kappa \approx 1 - f(\sigma_\theta^2)$$

where $\sigma_\theta^2$ is the variance of individual annotator thresholds. Framing effects that reduce $\sigma_\theta^2$ (by more precisely specifying the threshold) directly increase $\kappa$.

### 4.2 The Reasonable Person Standard

The "reasonable person" framing in annotation is analogous to a legal standard of reasonableness — it asks annotators to model a hypothetical external agent rather than report their own internal threshold. This functions as a variance-reduction technique:

$$\text{Var}(\theta_{\text{reasonable person}}) < \text{Var}(\theta_{\text{personal reaction}})$$

The reasonable person standard reduces idiosyncratic threshold variation at the cost of introducing shared blind spots (the reasonable person is implicitly a member of a particular cultural majority).

---

## 5. Inter-Annotator Agreement Quality Benchmarks

| Domain | Typical Kappa Range | Target Kappa | Notes |
|--------|--------------------|--------------------|-------|
| Binary toxicity (general) | 0.45–0.65 | ≥ 0.60 | Context-dependent |
| Medical image (radiology) | 0.55–0.75 | ≥ 0.75 | Expert annotators |
| Sentiment analysis (clear cases) | 0.70–0.85 | ≥ 0.70 | |
| Named entity recognition | 0.80–0.95 | ≥ 0.85 | Well-defined |
| Legal document classification | 0.50–0.70 | ≥ 0.65 | Subjective |
| Instruction-following quality | 0.55–0.75 | ≥ 0.65 | RLHF tasks |
| AAVE toxicity (diverse pool) | 0.40–0.55 | ≥ 0.60 | Cultural context critical |

**Interpretation note:** Low kappa relative to target does not always mean quality failure. For tasks where target kappa is genuinely unachievable (cultural context tasks, subjective quality tasks), the right response is to use label distributions rather than forcing agreement.

---

## 6. Sample Size Planning for Annotation Projects

### 6.1 Statistical Power for Kappa Estimation

To estimate kappa with margin of error $e$ at confidence level $\alpha$:

$$N \geq \frac{z_{\alpha/2}^2 \cdot P_o(1-P_o)}{e^2 (1-P_e)^2}$$

For typical annotation settings ($P_o \approx 0.80$, $P_e \approx 0.50$, $e = 0.05$, $\alpha = 0.05$):

$$N \geq \frac{3.84 \times 0.16}{0.0025 \times 0.25} \approx 983 \text{ items}$$

For a quick calibration check (acceptable precision $e = 0.10$): $N \approx 246$ items.

### 6.2 Budget Allocation: Annotators per Item

Given a total annotation budget $B$ and cost per annotation $c$:

Define $n_r$ = number of annotations per item (redundancy).

Total annotatable items: $M = B / (c \cdot n_r)$

Expected kappa improvement from redundancy, under majority-vote aggregation:

$$\kappa(n_r) \approx \kappa_1 + (1 - \kappa_1) \cdot \left(1 - e^{-\lambda (n_r - 1)}\right)$$

where $\kappa_1$ is single-annotator kappa and $\lambda$ is an empirical constant (approximately 0.3 for most annotation tasks).

**Trade-off:** More redundancy per item → higher per-item quality, fewer items annotated per budget dollar. For high-stakes tasks, allocate $n_r \geq 5$; for routine tasks, $n_r = 3$ is usually sufficient.

---

## 7. Exercises

### Exercise 7.1 — Computing Kappa

Two annotators classify 100 social media posts as TOXIC (T) or NOT TOXIC (N):

|  | Ann. 2: T | Ann. 2: N |
|--|----------|----------|
| **Ann. 1: T** | 20 | 15 |
| **Ann. 1: N** | 10 | 55 |

Compute $P_o$, $P_e$, and $\kappa$. Interpret the result using the Landis-Koch scale. Compute a 95% confidence interval for $\kappa$.

### Exercise 7.2 — Fleiss' Kappa

Three annotators each label 50 documents. Compute Fleiss' kappa using the formula in Section 2. Under what conditions would Cohen's kappa (applied pairwise to each pair of annotators) give a misleading picture of overall agreement?

### Exercise 7.3 — Dawid-Skene vs. Majority Vote

Simulate annotation data for 100 items using the Dawid-Skene generative model with two annotator types: expert (error rate 5%) and novice (error rate 30%). Compare the accuracy of (a) majority voting, (b) Dawid-Skene EM, and (c) expert-only labels. How much does including novice annotators help or hurt under each method?

### Exercise 7.4 — Framing Effect Experiment

Design an annotation experiment to measure framing effects. You have two guideline versions for a toxicity task (Version A: "Is this toxic?"; Version B: "Would a reasonable member of the target community find this harmful?"). Describe your experimental design: how many items, how many annotators per condition, how you would test for a significant difference in kappa and positive label rate between conditions.

### Exercise 7.5 — Annotation Budget Optimization

You have a budget of $5,000 for an annotation project. The task is binary (POSITIVE/NOT). Options:
- Expert annotators: $2.00/label, expected single-annotator kappa = 0.75
- Crowdworkers: $0.05/label, expected single-annotator kappa = 0.50

You need at least 2,000 items labeled. Design three possible annotation strategies and compare their expected quality (using the redundancy formula in Section 6.2) and coverage. Which strategy would you recommend, and under what conditions?

---

## References

- Cohen, J. (1960). A coefficient of agreement for nominal scales. *Educational and Psychological Measurement*, 20(1), 37–46.
- Fleiss, J. L. (1971). Measuring nominal scale agreement among many raters. *Psychological Bulletin*, 76(5), 378–382.
- Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. *Biometrics*, 33(1), 159–174.
- Dawid, A. P., & Skene, A. M. (1979). Maximum likelihood estimation of observer error-rates using the EM algorithm. *Journal of the Royal Statistical Society: Series C*, 28(1), 20–28.
- Passonneau, R. J., & Carpenter, B. (2014). The benefits of a model of annotation. *TACL*, 2, 311–326.
- Davani, A. M., Díaz, M., & Prabhakaran, V. (2022). Dealing with disagreements. *TACL*, 10, 92–110.
- Kahneman, D., & Tversky, A. (1979). Prospect theory. *Econometrica*, 47(2), 263–291.
