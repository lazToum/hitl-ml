# Technical Appendix 12A: Measuring HITL System Performance

*Formal definitions, calibration metrics, statistical inference, and experimental design for human-in-the-loop evaluation*

---

## 1. Classification Metrics: Formal Definitions

### 1.1 The Confusion Matrix

For a binary classifier, all outcomes fall into one of four cells:

|                        | Predicted Positive | Predicted Negative |
|------------------------|-------------------|-------------------|
| **Actual Positive**    | True Positive (TP) | False Negative (FN) |
| **Actual Negative**    | False Positive (FP) | True Negative (TN) |

From these cells, all standard metrics derive.

### 1.2 Core Metrics

**Accuracy:**
$$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$

The proportion of correct predictions across all cases. Misleading when class frequencies are imbalanced.

**Precision (Positive Predictive Value):**
$$\text{Precision} = \frac{TP}{TP + FP}$$

Of all cases the model flagged as positive, how many were actually positive? A precision-focused system minimizes false alarms.

**Recall (Sensitivity, True Positive Rate):**
$$\text{Recall} = \frac{TP}{TP + FN}$$

Of all actually positive cases, how many did the model catch? A recall-focused system minimizes missed detections.

**F1 Score:**
$$F_1 = 2 \cdot \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}} = \frac{2 \cdot TP}{2 \cdot TP + FP + FN}$$

The harmonic mean of precision and recall. Appropriate when both false positives and false negatives carry costs. The harmonic mean penalizes extreme imbalances between precision and recall more severely than the arithmetic mean.

**Generalization — F-beta Score:**
$$F_\beta = (1 + \beta^2) \cdot \frac{\text{Precision} \times \text{Recall}}{(\beta^2 \cdot \text{Precision}) + \text{Recall}}$$

When $\beta > 1$, recall is weighted more heavily (missing a positive is more costly). When $\beta < 1$, precision is weighted more heavily (false alarms are more costly). Medical diagnosis often warrants $\beta > 1$; content recommendation systems may prefer $\beta < 1$.

### 1.3 HITL-Specific Metric Decomposition

In a HITL system, outcomes divide by pathway. Let:
- $\mathcal{A}$ = the set of auto-processed cases
- $\mathcal{H}$ = the set of human-reviewed cases
- $|\mathcal{A}| + |\mathcal{H}| = N$ = total cases

**Pathway Error Rates:**
$$\text{Error}_\mathcal{A} = \frac{FP_\mathcal{A} + FN_\mathcal{A}}{|\mathcal{A}|}, \qquad \text{Error}_\mathcal{H} = \frac{FP_\mathcal{H} + FN_\mathcal{H}}{|\mathcal{H}|}$$

**System-Level Error Rate:**
$$\text{Error}_{\text{system}} = \frac{|\mathcal{A}|}{N} \cdot \text{Error}_\mathcal{A} + \frac{|\mathcal{H}|}{N} \cdot \text{Error}_\mathcal{H}$$

Note that a system can show improving aggregate error while $\text{Error}_\mathcal{A}$ increases, if the routing threshold is being raised (more cases auto-processed as the model becomes more aggressive). Tracking pathway-specific error rates separately is essential for detecting this divergence.

**Human Value-Added:**
$$\Delta_H = \text{Error}_\mathcal{H}^{\text{(auto-only)}} - \text{Error}_\mathcal{H}^{\text{(human-reviewed)}}$$

Estimated counterfactual: how much higher would the error rate on human-reviewed cases have been if the model had decided them autonomously? This requires holding out a random sample and running both pathways simultaneously — an expensive but informative experimental design.

---

## 2. Calibration Metrics

### 2.1 Why Calibration Matters for HITL

A HITL system routes cases to humans based on model confidence. If that confidence is miscalibrated — if an 80% confidence score actually corresponds to 60% accuracy — the routing threshold is miscalibrated too. Cases the model incorrectly believes it handles well will be auto-processed without human review.

**Definition: Calibration.** A probabilistic classifier $f$ is perfectly calibrated if, for all confidence levels $p \in [0,1]$:
$$P(\hat{y} = y \mid f(x) = p) = p$$

In words: among all cases where the model assigns confidence $p$, the fraction that are actually correct should equal $p$.

### 2.2 Expected Calibration Error (ECE)

The standard empirical calibration metric partitions predictions into $M$ equally-spaced confidence bins and computes the weighted average gap between confidence and accuracy.

Let $B_m$ denote the set of cases whose predicted confidence falls in bin $m$, with $|B_m|$ elements. Define:

$$\text{acc}(B_m) = \frac{1}{|B_m|} \sum_{i \in B_m} \mathbf{1}[\hat{y}_i = y_i]$$

$$\text{conf}(B_m) = \frac{1}{|B_m|} \sum_{i \in B_m} \hat{p}_i$$

Then:
$$\text{ECE} = \sum_{m=1}^{M} \frac{|B_m|}{n} \left| \text{acc}(B_m) - \text{conf}(B_m) \right|$$

A perfectly calibrated model has $\text{ECE} = 0$. Typical values for uncalibrated deep neural networks range from 0.05 to 0.15; post-calibration values below 0.02 are considered good.

### 2.3 Maximum Calibration Error (MCE)

ECE is an average; a model can have low ECE while being severely miscalibrated in the high-confidence bins that matter most for HITL routing.

$$\text{MCE} = \max_m \left| \text{acc}(B_m) - \text{conf}(B_m) \right|$$

For HITL systems, MCE in the high-confidence bins (where routing decisions are made) should be tracked separately.

### 2.4 Reliability Diagrams

A reliability diagram plots $\text{conf}(B_m)$ on the x-axis against $\text{acc}(B_m)$ on the y-axis. A perfectly calibrated model traces the diagonal. Overconfident models curve below the diagonal; underconfident models curve above it.

For HITL routing, the critical region is the upper-right corner: cases the model assigns confidence above the routing threshold. Miscalibration in this region directly controls the false-confidence-in-auto-processing rate.

### 2.5 Calibration Methods

**Temperature Scaling** (Guo et al., 2017): A single learned parameter $T > 0$ scales the logits before the softmax:
$$\hat{p}_i = \text{softmax}(z_i / T)$$
where $z_i$ are the pre-softmax logits. When $T > 1$, confidence is reduced (model becomes less certain). When $T < 1$, confidence is increased. $T$ is optimized on a held-out validation set by minimizing negative log-likelihood.

**Platt Scaling**: Fits a logistic regression $P(y=1 \mid f) = \sigma(af + b)$ on a validation set, where $\sigma$ is the sigmoid function and $(a, b)$ are learned parameters.

**Isotonic Regression**: Non-parametric monotonic calibration. Fits a piecewise-constant monotone function mapping raw confidence scores to calibrated probabilities. More flexible than temperature scaling but requires a larger validation set to avoid overfitting.

---

## 3. Confidence Intervals for HITL Metrics

### 3.1 Why Confidence Intervals Matter

A system that reviews 200 cases and makes 10 errors has an estimated error rate of 5%. But the true error rate might plausibly be anywhere from 2.5% to 9%. Decisions made without confidence intervals confuse sampling noise for signal — a brief dip in error rate might be noise; a persistent upward trend almost certainly isn't.

### 3.2 Wilson Score Interval for Proportions

For an observed proportion $\hat{p} = k/n$ (e.g., error rate, agreement rate), the Wilson score interval provides better coverage than the naive Wald interval when $\hat{p}$ is near 0 or 1:

$$\left[ \frac{\hat{p} + z^2/2n \pm z\sqrt{\hat{p}(1-\hat{p})/n + z^2/(4n^2)}}{1 + z^2/n} \right]$$

where $z = 1.96$ for a 95% interval. For $n \geq 30$ and $\hat{p}$ not near the boundaries, the Wald interval $\hat{p} \pm z\sqrt{\hat{p}(1-\hat{p})/n}$ is adequate.

### 3.3 Bootstrap Confidence Intervals for Complex Metrics

F1, ECE, and inter-rater agreement are nonlinear functions of the data. Closed-form intervals are not available or are unreliable. The bootstrap provides a general solution:

1. From $n$ observations, draw $B = 10{,}000$ bootstrap samples (with replacement).
2. Compute the metric on each bootstrap sample: $\theta_1^*, \ldots, \theta_B^*$.
3. The 95% confidence interval is the 2.5th and 97.5th percentiles of $\{\theta_b^*\}$.

For HITL systems, bootstrap resampling should be done at the *case* level, not at the prediction level, to preserve dependence structure when multiple reviewers evaluate the same case.

### 3.4 Minimum Detectable Effect

For a controlled experiment comparing two routing thresholds, the required sample size to detect a difference $\delta$ in error rates with power $1-\beta$ at significance level $\alpha$:

$$n = \frac{(z_{\alpha/2} + z_\beta)^2 \cdot 2\bar{p}(1-\bar{p})}{\delta^2}$$

where $\bar{p}$ is the pooled error rate under the null hypothesis. For a 5% baseline error rate, detecting a 1 percentage point improvement at 80% power requires roughly $n = 2{,}600$ cases per arm.

---

## 4. Inter-Rater Reliability

### 4.1 Cohen's Kappa

When two reviewers independently label the same cases, raw agreement is inflated by chance. Cohen's kappa corrects for this:

$$\kappa = \frac{p_o - p_e}{1 - p_e}$$

where $p_o$ is the observed agreement rate and $p_e$ is the expected agreement rate under independence:

$$p_e = \sum_k \left(\frac{n_{k\cdot}}{n}\right)\left(\frac{n_{\cdot k}}{n}\right)$$

Interpretation: $\kappa < 0.20$ indicates slight agreement; $0.21–0.40$ fair; $0.41–0.60$ moderate; $0.61–0.80$ substantial; $> 0.80$ nearly perfect.

For HITL systems, kappa should be monitored over time. A declining kappa can signal reviewer fatigue, diverging interpretations of the decision criteria, or cases that are becoming genuinely harder (distribution shift in the incoming data).

### 4.2 Fleiss' Kappa for Multiple Reviewers

When each case is reviewed by $k > 2$ reviewers:

$$\kappa_F = \frac{\bar{P} - \bar{P}_e}{1 - \bar{P}_e}$$

where $\bar{P}$ is the mean observed agreement across all cases and $\bar{P}_e$ is the expected agreement by chance, computed analogously to Cohen's kappa.

### 4.3 Intraclass Correlation Coefficient (ICC)

For continuous annotations (e.g., severity scores on a 0–100 scale rather than binary labels), ICC is more appropriate:

$$\text{ICC}(2,1) = \frac{MS_R - MS_E}{MS_R + (k-1)MS_E + k(MS_C - MS_E)/n}$$

where $MS_R$, $MS_C$, and $MS_E$ are the mean squares for rows (cases), columns (reviewers), and error from a two-way ANOVA decomposition.

---

## 5. Statistical Significance in A/B Tests of HITL Systems

### 5.1 The Standard Two-Proportion Z-Test

To test whether routing threshold $A$ produces a different error rate than threshold $B$:

Let $\hat{p}_A = k_A / n_A$ and $\hat{p}_B = k_B / n_B$ be the observed error rates.

**Null hypothesis:** $H_0: p_A = p_B$

**Test statistic:**
$$z = \frac{\hat{p}_A - \hat{p}_B}{\sqrt{\hat{p}(1-\hat{p})(1/n_A + 1/n_B)}}$$

where $\hat{p} = (k_A + k_B)/(n_A + n_B)$ is the pooled proportion.

Reject $H_0$ at level $\alpha = 0.05$ when $|z| > 1.96$.

### 5.2 Complications in HITL Experiments

**Non-independence:** Cases reviewed by the same reviewer are not independent. Standard errors should use cluster-robust variance estimation with reviewers as clusters.

**SUTVA violations:** Stable Unit Treatment Value Assumption — the potential outcome for one case does not depend on the treatment assignment of another. In HITL experiments, this can be violated if reviewers adjust their decision speed (and quality) based on queue length, which is affected by the arm assignment of other cases.

**The learning effect:** If the model is actively learning during the experiment, cases late in arm A may see a slightly different model than cases early in arm A. Pre-registering the experiment and freezing model weights during the experimental period addresses this.

**Sequential testing:** Running the experiment until a significant result appears inflates the false positive rate. Use pre-specified stopping rules: either a fixed sample size determined by power analysis, or a sequential testing framework (e.g., the alpha-spending approach of O'Brien and Fleming) if early stopping is needed.

### 5.3 CUPED: Controlling for Pre-Experiment Covariates

HITL experiments can be underpowered when error rates are low and variance is high. CUPED (Controlled-experiment Using Pre-Experiment Data) reduces variance by regressing out baseline covariates:

$$Y_{\text{CUPED}} = Y - \theta(X - \mathbb{E}[X])$$

where $X$ is a pre-experiment covariate correlated with the outcome (e.g., the reviewer's historical error rate), and $\theta = \text{Cov}(Y,X)/\text{Var}(X)$ is estimated from pre-experiment data. This can reduce variance by 30–50% in practice, roughly halving the required sample size.

---

## 6. Feedback Loop Latency Measurement

### 6.1 Defining Latency

Let $t_{\text{decision}}$ be the time a human reviewer finalizes a decision on case $i$. Let $t_{\text{incorporated}}$ be the time when that decision is reflected in the model's predictions.

$$L_i = t_{\text{incorporated},i} - t_{\text{decision},i}$$

Average latency: $\bar{L} = \frac{1}{|\mathcal{H}|} \sum_{i \in \mathcal{H}} L_i$

### 6.2 The Latency-Quality Tradeoff

Shorter latency means the model learns from corrections faster — but also means a batch of bad reviewer decisions (due to a poorly-worded guideline or a reviewer who is fatigued) propagates to the model faster.

A practical control: before incorporating a new batch of reviewer decisions, run them through a consistency check. Flag batches where the agreement rate within the batch is significantly lower than historical norms (suggesting guidelines ambiguity or reviewer fatigue) for human audit before model training.

### 6.3 Measuring Model Improvement from Feedback

The value of a feedback loop is the improvement in model accuracy attributable to human corrections. Define the *feedback value* as:

$$V_{\text{feedback}} = \text{Error}_t^{\text{(without feedback)}} - \text{Error}_{t+\Delta}^{\text{(with feedback)}}$$

where $\text{Error}_t^{\text{(without feedback)}}$ is estimated by periodically evaluating a frozen model snapshot against new ground truth. This counterfactual requires freezing model versions at multiple time points — operationally complex but the only rigorous way to measure feedback value.

---

## Exercises

**Exercise 12A.1 — Calibration Assessment**
Given a model with 1,000 test predictions grouped into 10 confidence bins (0.0–0.1, 0.1–0.2, …, 0.9–1.0), with the following accuracy within each bin: {0.05, 0.11, 0.18, 0.30, 0.42, 0.55, 0.63, 0.74, 0.82, 0.90}:
(a) Compute the ECE, assuming equal numbers of predictions per bin.
(b) Draw the reliability diagram (or describe its shape).
(c) Assess whether this model is overconfident, underconfident, or well-calibrated.
(d) Recommend a calibration method and explain your choice.

**Exercise 12A.2 — Sample Size Determination**
A content moderation HITL system has a current error rate of 8%. A proposed redesign is expected to reduce the error rate to 6%. How many cases per arm are needed for a two-sided A/B test at 80% power and α = 0.05? What changes if you require 90% power?

**Exercise 12A.3 — Goodhart's Law Simulation**
A model routes the bottom 20% of confidence cases to human review. Reviewers are measured on throughput (cases per hour). Show mathematically, using the pathway error decomposition from Section 1.3, how an increase in reviewer throughput by 300% (due to gaming) that degrades human accuracy from 92% to 65% would affect the system-level error rate — even as the reported aggregate accuracy appears stable.

**Exercise 12A.4 — Inter-Rater Reliability**
Two reviewers independently label 100 borderline cases. Reviewer A labels 60 positive, 40 negative. Reviewer B labels 55 positive, 45 negative. They agree on 75 cases (50 both-positive, 25 both-negative). Compute Cohen's kappa and interpret the level of agreement.

**Exercise 12A.5 — Feedback Loop Design**
You are designing a feedback loop for a medical imaging HITL system with 10,000 cases per day, 15% routed to human review, and a target feedback latency of 24 hours. The system retains labeled cases for model fine-tuning. Propose a quality control procedure for the incoming batch of human labels before they are incorporated into training. What statistics would you compute? What thresholds would trigger a pause?
