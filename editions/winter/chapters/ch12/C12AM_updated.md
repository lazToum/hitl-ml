# Chapter 12 Solutions Guide: Measuring Success

*Model answers, grading guidance, and worked solutions*

---

## Discussion Question Solutions

### Introductory Level

#### Q1: The Useless Classifier
**Model Answer:**

A model that labels every patient "low-risk" in a 2%-high-risk dataset achieves 98% accuracy. But:
- **Precision** for the high-risk class: undefined (0/0, or effectively 0 if we define 0/0 = 0)
- **Recall** for the high-risk class: 0/100 = **0%** — no high-risk patients are caught
- **F1**: 0

This model has completely failed its purpose. The 98% accuracy figure is a statistical artifact of class imbalance. It tells us nothing about the model's ability to perform its intended function (identifying high-risk patients).

The appropriate metric depends on the cost structure:
- If missing a high-risk patient (false negative) is very costly → weight recall heavily, use $F_\beta$ with $\beta > 1$
- If treating a low-risk patient as high-risk has significant downsides (unnecessary intervention) → balance precision and recall, use $F_1$ or $F_\beta$ with $\beta$ near 1

**Grading:**
- **Excellent:** Correctly identifies accuracy failure, computes or estimates precision/recall/F1, explains why F1 or $F_\beta$ is more appropriate and why
- **Good:** Identifies accuracy failure, names precision/recall as better metrics, basic explanation
- **Satisfactory:** Recognizes something is wrong with accuracy, vague reference to alternative metrics
- **Needs Improvement:** Accepts accuracy as valid metric or cannot identify the problem

---

#### Q2: The Call Center Goodhart Scenario
**Model Answer:**

Agents optimized for the measured metric (time to close) rather than the underlying goal (genuine problem resolution). The mapping from metric to goal broke down under optimization pressure. Agents are likely:
- Closing tickets before the problem is actually resolved
- Routing complaints to wrong categories to get them off their queue faster
- Marking complaints as "resolved" at first customer response, regardless of actual resolution

The HITL parallel: reviewers measured on throughput will adopt exactly analogous strategies — approving uncertain cases with minimal attention, pattern-matching on surface features rather than genuine evaluation.

**What should have been measured instead:**
1. Customer satisfaction within 48 hours of closure (measures actual resolution)
2. Re-open rate (was the complaint actually resolved?)
3. Escalation rate (are agents pushing hard problems elsewhere?)
4. Combined metric: throughput weighted by satisfaction score

The last approach — a composite metric — is more robust because gaming requires gaming multiple components simultaneously.

**Grading:**
- **Excellent:** Identifies specific gaming behaviors, connects explicitly to HITL parallel, proposes composite metric or outcome-based metric that is harder to game
- **Good:** Correct diagnosis of gaming, connection to HITL, at least one better metric
- **Satisfactory:** Correct diagnosis, basic connection to HITL
- **Needs Improvement:** Misidentifies the problem or cannot connect to HITL context

---

#### Q3: Calibration Intuition
**Model Answer:**

Approximately 80 occasions. Perfect calibration means: among all occasions where the forecaster expresses 80% confidence, 80% of them should materialize. If it rains on 70 occasions, the forecaster is overconfident (states 80% but is right 70% of the time). If it rains on 90 occasions, the forecaster is underconfident.

This is the operational definition of calibration in probability forecasting, introduced formally by Murphy (1973) and central to the Brier score tradition in meteorology. The same principle applies to AI confidence scores in HITL routing: a model that assigns 80% confidence to auto-processed cases should be right about 80% of the time on those cases.

---

#### Q4: Pathway Decomposition Calculation
**Model Answer:**

System-level error rate:
$$\frac{(9200 \times 0.01) + (300 \times 0.05) + (500 \times 0.08)}{10000} = \frac{92 + 15 + 40}{10000} = \frac{147}{10000} = 1.47\%$$

Is human review adding value? The human-reviewed cases have an 8% error rate — the highest of any pathway. But this is expected: the system routes its hardest cases to humans. The right comparison is: what would the error rate on those 500 cases have been if the model had decided them autonomously?

If the model's error rate on low-confidence cases (below the routing threshold) was, say, 20%, then human review brought those 500 cases from 20% error to 8% error — a substantial improvement. If the model's error rate on those cases was 7%, human review made things slightly worse (possible when cases are genuinely ambiguous and reviewers are fatigued).

**Key teaching point:** You cannot evaluate the value of human review without a counterfactual — what would have happened without the review. This requires either a controlled holdout experiment or a strong statistical model.

---

### Intermediate Level

#### Q: Metric Gaming Design (Three Metrics)
**Model Answer:**

Proposed framework and gaming vulnerabilities:

| Metric | What It Captures | Gaming Mechanism | Safeguard |
|--------|-----------------|-----------------|-----------|
| **Accuracy on labeled holdout set** | Decision quality on known cases | Reviewers memorize the holdout cases | Rotate holdout set regularly; never reveal which cases are in holdout |
| **Inter-rater agreement with a second-opinion reviewer** | Consistency of judgment | Reviewers coordinate in advance to match answers | Second opinions assigned anonymously, randomly, without prior communication |
| **Re-review accuracy** (% of decisions that survive re-review) | Whether decisions hold up under scrutiny | Reviewers route genuinely uncertain cases out of their queue | Re-review sample is random, not self-selected by the reviewer |

**The key principle:** The best metrics measure outcomes that require genuine quality to achieve, are computed on cases the reviewer doesn't know are being evaluated, and are difficult to game without actually doing the work.

**Grading:**
- **Excellent:** Three metrics, genuine engagement with gaming for each, substantive safeguard for each, understanding that safeguards also have limits
- **Good:** Three metrics, gaming vulnerability identified for each, at least one strong safeguard
- **Satisfactory:** Three metrics, gaming vulnerability identified for most
- **Needs Improvement:** Fewer than three metrics or no engagement with gaming

---

#### Q: Feedback Latency Tradeoff
**Model Answer:**

**6-hour latency advantages:**
- Model learns from corrections faster, reducing repeated errors on similar cases
- Reviewers see current model behavior (feedback loop feels responsive)
- Lower risk of the model falling behind a changing case distribution

**6-hour latency disadvantages:**
- If a batch of reviewer decisions contains systematic errors (e.g., a confusing guideline was issued that morning), those errors propagate to the model within hours
- Less time for quality control checks on incoming reviewer decisions

**3-day latency advantages:**
- Time to review incoming decision batches for quality before training
- Reviewer errors caught before model is corrupted
- Can incorporate guideline changes that clarify ambiguous reviewer decisions

**3-day latency disadvantages:**
- Model falls behind on fast-moving case distributions (e.g., social media misinformation that evolves rapidly)
- Reviewers experience a disconnect between their corrections and model behavior

**The 3-day latency might be safer when:**
- The quality control process is rigorous (audits, consistency checks)
- The case distribution is stable (medical imaging more stable than social media)
- Reviewer errors are historically significant (high-stakes domain with complex criteria)

**The 6-hour latency might be safer when:**
- The case distribution evolves rapidly
- Quality control is automated and reliable
- The cost of repeated errors on known cases is high

---

#### Q: The Divergence Trap Diagnosis
**Model Answer:**

Measurement data to examine:

1. **Reviewer agreement rate over time:** If the divergence trap is operating, reviewers are seeing increasingly unusual cases. Agreement on unusual cases is inherently lower. Declining agreement rate consistent with this.

2. **Feature distribution of human-reviewed cases:** Compare the distribution of applicant characteristics (or other features) in the human-reviewed queue now versus two years ago. Has the distribution shifted toward the edges of the feature space?

3. **Model calibration near the routing threshold:** Has the model become overconfident about cases near the threshold? Is it now auto-processing cases it once flagged?

4. **Error rate on a random sample of auto-processed cases:** Hold out 1% of auto-processed cases for gold-standard review (or compare to a ground-truth oracle). Has this error rate increased even as the model appears to perform well on the cases it routes to humans?

5. **Reviewer performance on injected easy cases:** Periodically inject cases that were clearly resolved two years ago. Are reviewers still accurate on these? If not, they've lost familiarity with the core of the distribution.

The last two require proactive experimental design — they are not naturally available from the system's standard logging. This is a key practical implication: detecting the divergence trap requires deliberate measurement choices made before the trap operates.

---

### Advanced Level

#### Q: Goodhart Formalization
**Model Sketch:**

The reviewer's optimization problem, given metric $m$ (throughput):
$$\max_{q} \;\; m(q) \;\; \text{s.t. effort cost } \leq C$$

where $q$ is the quality of individual decisions. If $m$ rewards speed and quality is costly, the optimizer sets $q \to \min$ subject to not being caught.

The model's learning objective:
$$\min_\theta \;\; \mathbb{E}_{(x,\hat{y}) \in \mathcal{H}}\bigl[\mathcal{L}(\hat{y}, f_\theta(x))\bigr]$$

where $\hat{y}$ is the reviewer's (possibly gamed) label. When reviewers rubber-stamp, $\hat{y}$ becomes uncorrelated with the true label $y^*$:
$$\hat{y} \approx \text{default\_label} + \varepsilon$$

The model is then learning:
$$f_\theta \approx \text{constant predictor}$$

under the model's perspective — which degrades its actual accuracy even as reviewer throughput looks fine.

**Key insight:** The model doesn't know which of its training labels come from genuine review versus rubber-stamping. There's no signal in the training data to distinguish them. This is why the Goodhart mechanism in HITL is particularly insidious: the model absorbs the reviewer's gaming silently.

---

## Activity Solutions

### Activity 2: Measurement Framework — Medical Imaging

**Sample Strong Response:**

| Dimension | Metric | Data Source | Alert Threshold |
|-----------|--------|-------------|-----------------|
| Model accuracy | F1 on monthly holdout (stratified by scan type) | Radiologist-reviewed holdout | Drop of >0.02 in any scan type |
| Calibration quality | ECE on high-confidence predictions (>0.85); MCE in 0.8–1.0 bin | Model probability outputs vs. holdout labels | ECE > 0.03 in high-confidence region |
| Human workload | Scans reviewed per radiologist per shift; error rate by shift hour | Review logs + outcome tracking | >15% decline in accuracy in shift hour 3+ |
| Time-to-decision | Median and 95th percentile minutes from routing to decision | Timestamp logs | 95th percentile > 4 hours for urgent cases |
| Cost per decision | Radiologist minutes per human-reviewed case | Time-tracking logs | >20% increase in cost per case |
| Error rates by pathway | Separate accuracy for auto and human pathways | Holdout labels by pathway | Auto-pathway error up >0.5% month-over-month |
| Feedback loop latency | Hours from radiologist decision to model update | Training pipeline logs | >48 hours for urgent correction batches |

**What makes this answer excellent:** Specific, measurable metrics; alert thresholds that are interpretable (not arbitrary); data sources identified; distinction between routine and urgent thresholds.

### Activity 3: Goodhart Autopsy — Customer Service System

**Model Answer:**

**Reviewer-level Goodhart:** Classifiers optimized for routing accuracy by learning which of the 12 categories resulted in faster closure (routing to the most responsive team), not which category actually matched the complaint. Categories with fast teams got more labels.

**Organization-level Goodhart:** Management optimized for routing accuracy as the reported metric, not for resolution quality or customer satisfaction. Budget decisions rewarded teams that showed high routing accuracy numbers, regardless of downstream quality.

**Model-level Goodhart:** The model trained on classifier decisions that were optimized for routing speed, not for accurate categorization. It learned to replicate the biased categorization, amplifying the effect.

**Additional metrics that should have been tracked:**
- Customer satisfaction score within 7 days of routing
- Resolution rate within target time (did the routed team actually resolve it?)
- Re-route rate (was the original routing correct?)
- Complaint re-open rate within 30 days

---

## "Try This" Exercise — Grading Guide

**Prompt:** Identify a decision system, guess its primary metric, identify two hidden metrics.

**Grade A Response Characteristics:**
- Specific, real system (not generic "a spam filter")
- Primary metric guess is plausible and specific
- Two hidden metrics are substantively different from the primary metric and from each other
- Student demonstrates understanding of what the hidden metrics would reveal that the primary metric does not

**Grade B Response Characteristics:**
- Real system
- Plausible primary metric
- Two hidden metrics identified, though one may be closely related to the primary

**Grade C Response Characteristics:**
- System identified
- Primary metric identified
- One clear hidden metric, second is vague

---

## Assessment Rubric: Measurement Framework Paper

| Criterion | Excellent (4) | Good (3) | Satisfactory (2) | Needs Improvement (1) |
|-----------|---------------|----------|-------------------|----------------------|
| **Framework Completeness** | All 7 dimensions with specific, measurable metrics | 6–7 dimensions, most specific | 5+ dimensions, some vague | Fewer than 5 dimensions |
| **Goodhart Awareness** | 3 distinct gaming mechanisms, at level of reviewer/org/model | 2–3 mechanisms, most specific | 1–2 mechanisms identified | No genuine gaming vulnerabilities identified |
| **Safeguard Reasoning** | Safeguards address specific gaming, acknowledge their own limits | Safeguards address gaming, mostly practical | Safeguards present but generic | Missing or ineffective safeguards |
| **Writing Quality** | Specific examples throughout, clear argument, correct terminology | Good examples, mostly clear | Some examples, acceptable clarity | Vague, generic, or unclear |
