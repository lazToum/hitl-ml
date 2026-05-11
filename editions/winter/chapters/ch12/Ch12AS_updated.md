# Chapter 12 Technical Exercise Solutions

*Worked solutions for Appendix 12A exercises*

---

## Exercise 12A.1 — Calibration Assessment

**Problem:** A model has predictions in 10 confidence bins. Bin boundaries: 0.0–0.1, 0.1–0.2, …, 0.9–1.0. Accuracy within each bin: {0.05, 0.11, 0.18, 0.30, 0.42, 0.55, 0.63, 0.74, 0.82, 0.90}. Assume equal numbers of predictions per bin (100 predictions each, n = 1,000 total).

### Part (a): Compute ECE

The ECE formula with $M = 10$ bins, each of size $n_m = 100$, $n = 1000$:

$$\text{ECE} = \sum_{m=1}^{10} \frac{n_m}{n} \left|\text{acc}(B_m) - \text{conf}(B_m)\right|$$

The midpoint of bin $m$ serves as $\text{conf}(B_m)$:

| Bin | conf (midpoint) | acc (given) | |acc − conf| | Weight | Contribution |
|-----|----------------|-------------|------------|--------|-------------|
| 1 | 0.05 | 0.05 | 0.00 | 0.10 | 0.000 |
| 2 | 0.15 | 0.11 | 0.04 | 0.10 | 0.004 |
| 3 | 0.25 | 0.18 | 0.07 | 0.10 | 0.007 |
| 4 | 0.35 | 0.30 | 0.05 | 0.10 | 0.005 |
| 5 | 0.45 | 0.42 | 0.03 | 0.10 | 0.003 |
| 6 | 0.55 | 0.55 | 0.00 | 0.10 | 0.000 |
| 7 | 0.65 | 0.63 | 0.02 | 0.10 | 0.002 |
| 8 | 0.75 | 0.74 | 0.01 | 0.10 | 0.001 |
| 9 | 0.85 | 0.82 | 0.03 | 0.10 | 0.003 |
| 10 | 0.95 | 0.90 | 0.05 | 0.10 | 0.005 |

$$\text{ECE} = 0.000 + 0.004 + 0.007 + 0.005 + 0.003 + 0.000 + 0.002 + 0.001 + 0.003 + 0.005 = \mathbf{0.030}$$

### Part (b): Reliability Diagram Shape

The reliability diagram plots conf (x-axis) against acc (y-axis).

- Bins 1–5 (low confidence range): the acc values fall below the diagonal (conf > acc). For example, at conf = 0.25, acc = 0.18.
- Bin 6 (conf = 0.55): acc = 0.55, exactly on the diagonal.
- Bins 7–10 (high confidence range): acc values fall below the diagonal again. At conf = 0.95, acc = 0.90.

Shape: a curve that generally tracks the diagonal but consistently falls slightly below it in both low- and high-confidence ranges. The gaps are small; the model is well-calibrated overall.

### Part (c): Overconfident, Underconfident, or Well-Calibrated?

The model is **slightly overconfident** across most bins — the stated confidence exceeds actual accuracy in most regions. This is the typical finding for large neural networks before calibration (Guo et al., 2017).

However, with ECE = 0.030, this model is actually reasonably well-calibrated by typical standards. ECE below 0.02 is excellent; 0.02–0.05 is acceptable; above 0.05 warrants intervention.

For a HITL routing system, the more important question is the MCE in the high-confidence bins (bins 9–10). In bin 10, conf = 0.95 but acc = 0.90: a 5-percentage-point gap. Cases the model thinks it handles with 95% accuracy are only handled correctly 90% of the time. Whether this warrants adjustment depends on the stakes of the downstream decisions.

### Part (d): Recommended Calibration Method

**Recommendation: Temperature Scaling**

Reasons:
1. The overconfidence is relatively uniform across bins (not heavily concentrated in one region), suggesting a global scaling correction is appropriate.
2. Temperature scaling requires only a single held-out validation set of moderate size.
3. It preserves the model's ranking of cases (important for routing decisions based on relative confidence).

**Implementation:**
1. Hold out a calibration set (separate from the test set used above).
2. Fit $T$ by minimizing negative log-likelihood: $T^* = \arg\min_T \sum_i -\log \sigma(z_i / T)$ where $z_i$ are pre-softmax logits.
3. With a typical overconfident model, expect $T^* > 1$ (approximately 1.1–1.4 for a 5–10% overconfidence level).
4. Re-evaluate ECE on the original test set using calibrated probabilities.

**Alternative:** If calibration errors are concentrated in specific bins (which is not the case here, but is common in some domain-shifted models), isotonic regression is more flexible and should be preferred.

---

## Exercise 12A.2 — Sample Size Determination

**Problem:** Current error rate = 8%. Proposed design expected to reduce to 6%. Two-sided test, α = 0.05.

### 80% Power

Using:
$$n = \frac{(z_{\alpha/2} + z_\beta)^2 \cdot 2\bar{p}(1-\bar{p})}{\delta^2}$$

Parameters:
- $z_{\alpha/2} = z_{0.025} = 1.960$ (two-sided, $\alpha = 0.05$)
- $z_\beta = z_{0.20} = 0.842$ (80% power)
- $\bar{p} = (0.08 + 0.06)/2 = 0.07$ (pooled rate under null)
- $\delta = |0.08 - 0.06| = 0.02$

$$n = \frac{(1.960 + 0.842)^2 \times 2 \times 0.07 \times 0.93}{0.02^2}$$

$$= \frac{(2.802)^2 \times 0.1302}{0.0004}$$

$$= \frac{7.851 \times 0.1302}{0.0004} = \frac{1.022}{0.0004} = \mathbf{2{,}555 \text{ per arm}}$$

Total cases required: approximately **5,110**.

### 90% Power

- $z_\beta = z_{0.10} = 1.282$

$$n = \frac{(1.960 + 1.282)^2 \times 0.1302}{0.0004} = \frac{(3.242)^2 \times 0.1302}{0.0004} = \frac{10.511 \times 0.1302}{0.0004} = \frac{1.369}{0.0004} = \mathbf{3{,}421 \text{ per arm}}$$

Total cases at 90% power: approximately **6,842**.

**Practical note:** At a routing volume of 500 cases per day (human-reviewed), a 5,000-case experiment would take about 10 days per arm — feasible for most production systems. At 50 cases per day, it would take nearly 100 days — at which point you must account for model drift during the experiment (the model may not be the same system at day 100 as it was at day 1).

---

## Exercise 12A.3 — Goodhart's Law Simulation

**Setup:** 
- Model routes bottom 20% of confidence cases to human review
- Total volume: $N$ cases per day; $0.20N$ to human review, $0.80N$ auto-processed
- Original reviewer accuracy: 92% error rate = 8%
- Gamed reviewer accuracy: 65% error rate = 35%
- Model auto-processes at: error rate = 3% (the high-confidence cases)
- System-level calculation before gaming:

$$\text{Error}_{\text{before}} = 0.80 \times 0.03 + 0.20 \times 0.08 = 0.024 + 0.016 = 0.040 = 4.0\%$$

After gaming (reviewer throughput increases 300%, quality drops):

$$\text{Error}_{\text{after}} = 0.80 \times 0.03 + 0.20 \times 0.35 = 0.024 + 0.070 = 0.094 = 9.4\%$$

**But what is actually being reported?**

If the organization measures aggregate accuracy across all cases, they see 9.4% error — which they attribute to the hard cases being hard, not to reviewer gaming.

If they measure only reviewer agreement (not accuracy against ground truth), reviewers gaming throughput will have lower inter-rater agreement — but if the organization isn't monitoring agreement, this signal is invisible.

**The model's perspective:**

The model is now training on reviewer labels. With 35% error rate in the review labels, the model is learning:
- For 35% of the flagged cases it was uncertain about, the "correct" label is actually incorrect
- Over time, the model's confidence calibration for these cases shifts toward the wrong class
- In the next training cycle, the model becomes slightly worse on these cases
- After many cycles, what the model was uncertain about (and routed to humans) becomes what it's confident about (and processes automatically) — but now with baked-in label noise

**Why aggregate accuracy appears stable in the short term:**

The gamed labels affect only 20% of cases (those in the review queue). The auto-processed 80% are unchanged. In the short term, the weighted aggregate remains close to 4.0% (the original) plus noise — because the human-reviewed pathway's contribution to aggregate error only increases from 1.6% to 7.0%, adding about 5.4 percentage points to the aggregate. This shift *is* visible in the pathway-decomposed error rates, which is exactly why the seven-dimension framework requires tracking pathways separately.

**Key conclusion:** The Goodhart problem in this scenario is fully detectable — but only if you track pathway-specific error rates and reviewer accuracy against ground truth, not just throughput and aggregate accuracy.

---

## Exercise 12A.4 — Inter-Rater Reliability

**Problem:** 100 cases, Reviewer A: 60 positive / 40 negative. Reviewer B: 55 positive / 45 negative. Agreement: 50 both-positive, 25 both-negative.

### Observed Agreement

$p_o = (50 + 25)/100 = 0.75$

### Expected Agreement

Under independence, the expected count of both-positive cases:
$$E[\text{both pos}] = \frac{n_{A+} \times n_{B+}}{n} = \frac{60 \times 55}{100} = 33.0$$

Expected both-negative:
$$E[\text{both neg}] = \frac{n_{A-} \times n_{B-}}{n} = \frac{40 \times 45}{100} = 18.0$$

Expected agreement by chance:
$$p_e = \frac{33.0 + 18.0}{100} = 0.510$$

### Cohen's Kappa

$$\kappa = \frac{p_o - p_e}{1 - p_e} = \frac{0.75 - 0.51}{1 - 0.51} = \frac{0.24}{0.49} = \mathbf{0.490}$$

### Interpretation

$\kappa = 0.490$ falls in the **moderate agreement** range (0.41–0.60).

**What this means for a HITL system:**

These are borderline cases — the model routed them to humans precisely because it was uncertain. Some level of human disagreement is expected on genuinely ambiguous cases; $\kappa = 0.49$ on the uncertain subset of a HITL system's caseload is not necessarily alarming.

The more important question is: what was this kappa three months ago? If it was 0.65 and has dropped to 0.49, that's a warning sign. If it has been stable at 0.49, the system is in a steady state that may be acceptable given the inherent difficulty of these cases.

**Action:** Investigate whether the 25% cases where reviewers disagree follow a pattern (specific case type, time of day, specific reviewers). If disagreement is random, it's inherent ambiguity. If it's systematic (e.g., one reviewer type disagrees with another, or disagreements concentrate in cases reviewed late in shifts), there's a structural problem.

---

## Exercise 12A.5 — Feedback Loop Quality Control Design

**Setup:** 10,000 cases/day, 1,500 human-reviewed, 24-hour target latency.

**Daily incoming batch:** ~1,500 reviewer decisions.

### Quality Control Procedure

**Step 1: Compute batch-level statistics**

For each daily batch before it enters the training pipeline, compute:

1. **Intra-batch agreement rate:** Randomly select 10% of cases (150 cases) for double-review within the same batch. Compute observed agreement rate $p_o^{\text{batch}}$.

2. **Historical comparison:** Compute $\Delta_{\text{agree}} = p_o^{\text{batch}} - \bar{p}_o^{\text{historical}}$ where $\bar{p}_o^{\text{historical}}$ is the 90-day rolling average.

3. **Label distribution shift:** Compare the proportion of positive labels in the current batch to the 30-day rolling average. Compute $\chi^2$ test statistic.

4. **Reviewer coverage check:** Verify that no single reviewer accounts for more than 25% of the batch (reviewing at unusual speeds) and that all reviewers contribute at least 5 cases (not abandoning the queue).

**Step 2: Apply alert thresholds**

| Statistic | Alert Threshold | Action |
|-----------|----------------|--------|
| Intra-batch agreement rate | $p_o^{\text{batch}} < \bar{p}_o - 2\sigma$ | Flag for human audit; delay training |
| Label distribution shift | $\chi^2$ p-value < 0.01 | Flag; check if genuine case distribution shift or reviewer guideline confusion |
| Single-reviewer concentration | Any reviewer > 35% of batch | Audit that reviewer's decisions; delay training |
| Batch size anomaly | $< 500$ or $> 2500$ cases | Investigate queue management; possible routing error |

**Step 3: Decision rule**

- **Proceed to training** if all statistics within thresholds
- **Hold for audit** (maximum 6 hours) if any single threshold exceeded; audit team reviews 50 random cases from the flagged batch
- **Reject batch** if audit confirms systematic error; root-cause investigation before next training cycle

**Rationale for the thresholds:**

The 24-hour latency target means each hold can delay training by up to 6 hours without missing the daily cycle. The intra-batch agreement check catches both guideline confusion (reviewers interpreting new criteria differently) and fatigue effects (agreement drops when reviewers rush). The label distribution check catches when reviewers suddenly classify cases very differently from baseline — which could indicate a genuine change in the incoming data, a policy change, or a guideline error.

**Additional recommendation:** Reserve 5% of each batch (75 cases/day) as a "gold standard" holdout that is evaluated by senior reviewers weekly. This provides a stable reference against which batch quality can be assessed independent of the rolling average (which will incorporate any gradual drift).
