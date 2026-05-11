# Technical Appendix 13A: Signal Detection Theory and Human Reviewer Behavior

*Formal model of human reviewer psychology in HITL systems: d-prime, criterion placement, automation bias, and vigilance decrement*

---

## 1. Signal Detection Theory: The Formal Framework

### 1.1 Why SDT?

Standard accuracy metrics treat human reviewer errors as random noise. Signal Detection Theory (SDT) provides a richer decomposition that separates two fundamentally different aspects of reviewer performance:

1. **Discriminability** ($d'$): How well can the reviewer distinguish positive (signal) cases from negative (noise) cases? This reflects genuine perceptual or cognitive ability.

2. **Response bias** ($c$ or $\beta$): Where has the reviewer set their threshold between "flag this" and "let it through"? This reflects the reviewer's implicit weighting of false alarms versus misses, shaped by instructions, incentives, and automation feedback.

A reviewer with high $d'$ and miscalibrated $c$ produces different errors from a reviewer with moderate $d'$ and well-calibrated $c$. Standard accuracy metrics cannot distinguish them. SDT can.

### 1.2 The Basic Model

In SDT, each reviewed case generates a decision variable $X$ — an internal strength of evidence. For positive (signal) cases, $X$ is drawn from a distribution centered at $\mu_S$. For negative (noise) cases, $X$ is drawn from a distribution centered at $\mu_N$.

In the standard Gaussian model:
$$X | \text{signal} \sim \mathcal{N}(\mu_S, \sigma^2)$$
$$X | \text{noise} \sim \mathcal{N}(\mu_N, \sigma^2)$$

By convention, $\mu_N = 0$, $\sigma = 1$, and $\mu_S = d' > 0$.

The reviewer compares $X$ to a criterion $c$:
- If $X > c$: respond "positive" (flag the case)
- If $X \leq c$: respond "negative" (let it through)

### 1.3 The Four Outcomes

| | Positive response | Negative response |
|---|---|---|
| **Signal present** | Hit (TP): $P(H) = P(X > c \mid \text{signal})$ | Miss (FN): $P(M) = 1 - P(H)$ |
| **Signal absent** | False Alarm (FP): $P(FA) = P(X > c \mid \text{noise})$ | Correct Rejection (TN): $P(CR) = 1 - P(FA)$ |

### 1.4 Computing $d'$

$$d' = z(P(H)) - z(P(FA))$$

where $z(\cdot) = \Phi^{-1}(\cdot)$ is the inverse standard normal CDF.

**Worked example:** A content moderation reviewer correctly flags 80% of policy violations (hit rate = 0.80) and incorrectly flags 15% of compliant cases (false alarm rate = 0.15).

$$d' = z(0.80) - z(0.15) = 0.842 - (-1.036) = 1.878$$

Interpretation:
- $d' = 0$: Reviewer cannot discriminate signal from noise
- $d' = 1$: Modest discriminability
- $d' \approx 1.9$: Good discriminability
- $d' > 3$: Near-perfect discriminability (rare in noisy real-world tasks)

### 1.5 Criterion ($c$)

$$c = -\frac{1}{2}[z(P(H)) + z(P(FA))]$$

Using the same example:
$$c = -\frac{1}{2}[0.842 + (-1.036)] = -\frac{1}{2}(-0.194) = 0.097$$

**Interpretation:**
- $c = 0$: Unbiased criterion — equidistant from signal and noise means
- $c > 0$: Conservative bias — reviewer requires strong evidence to flag (sets high bar; reduces false alarms but increases misses)
- $c < 0$: Liberal bias — reviewer flags at low evidence (reduces misses but increases false alarms)

### 1.6 Alternative Bias Measure: $\beta$

The likelihood ratio criterion:
$$\beta = \frac{f(c \mid \text{noise})}{f(c \mid \text{signal})} = \exp\left(-d' \cdot c + \frac{d'^2}{2} \cdot \text{sign}(c)\right)$$

$\beta = 1$ is unbiased; $\beta > 1$ is conservative; $\beta < 1$ is liberal. For most practical purposes, $c$ and $\beta$ are equivalent as bias measures.

---

## 2. SDT Formally Predicts Automation Bias

### 2.1 The Effect of an Automated Recommendation on Criterion Placement

The key insight: when a reviewer is shown an automated recommendation, it shifts their effective criterion $c$.

Let $c_0$ be the reviewer's criterion in the absence of automation. When automation recommends "positive" (flag), the reviewer updates:
$$c_{\text{with-auto}} = c_0 - \delta_{\text{auto}}$$

where $\delta_{\text{auto}} > 0$ is the criterion shift induced by the recommendation. The reviewer becomes more liberal (more likely to flag) when automation says flag, and more conservative when automation says pass.

This criterion shift produces automation bias in the following sense:

**Hit rate increases** when automation correctly recommends "flag" (good outcome)
**Miss rate increases** when automation incorrectly recommends "pass" on a true positive (this is automation bias — the reviewer follows the wrong recommendation)

The SDT framework shows that automation bias is primarily a criterion effect, not a discriminability effect. The reviewer's underlying ability to distinguish signal from noise ($d'$) may not change much. What changes is where they set their threshold — they anchor to the automated recommendation.

### 2.2 Empirical Evidence

Studies by Skitka et al. (1999) and later Goddard et al. (2012) found that hit rates for signals the automation correctly flagged increased substantially with automation, while miss rates for signals the automation incorrectly passed also increased substantially. The $d'$ estimates from these studies showed more modest changes — consistent with criterion shift, not discriminability loss, as the primary mechanism.

This is crucial for HITL design: automation bias is largely a **response strategy problem**, not a **perceptual ability problem**. The reviewer can still perceive the signal; they are just less likely to respond to it when the automation has effectively told them there is nothing to respond to.

### 2.3 The Signal Threshold Problem for HITL Designers

Let $p^*$ be the prior probability of a positive case in the HITL queue. Under SDT, the optimal unbiased criterion (minimizing expected error weighted by costs) is:

$$c^* = \frac{d'}{2} - \frac{1}{d'} \ln\left(\frac{p^* \cdot C_{FN}}{(1-p^*) \cdot C_{FP}}\right)$$

where $C_{FN}$ and $C_{FP}$ are the costs of misses and false alarms respectively.

In a well-designed HITL system, the routing decision has already changed $p^*$ relative to the base rate. Cases routed to human review are enriched for positives — if the model routes the bottom 20% confidence, and the base rate of positives in the general population is 5%, the prevalence in the human review queue might be 20–40%. Reviewers who are not told this will implicitly use the wrong prior, leading to miscalibrated criteria.

**Recommendation:** Inform reviewers of the base rate in their review queue. Explicitly. Tell them: "Approximately 30% of the cases you see have been flagged for X." This allows them to set better-calibrated criteria.

---

## 3. The ROC Curve and HITL Design

### 3.1 The Receiver Operating Characteristic

The ROC curve traces the locus of (false alarm rate, hit rate) pairs achievable by a reviewer as criterion $c$ varies from very conservative ($c \to +\infty$, bottom-left of the curve) to very liberal ($c \to -\infty$, top-right).

For a Gaussian equal-variance model with discriminability $d'$:
$$P(H) = \Phi(d' - c), \qquad P(FA) = \Phi(-c)$$

Substituting:
$$P(H) = \Phi\bigl(d' + \Phi^{-1}(P(FA))\bigr)$$

The area under the ROC curve (AUC) is a summary discriminability measure independent of criterion:
$$\text{AUC} = \Phi(d'/\sqrt{2})$$

### 3.2 Operating Point Selection in HITL

The operating point — where on the ROC curve the human reviewer actually operates — is determined by criterion $c$. Automation bias shifts the operating point toward the recommended response.

For HITL design, the key question is: given the cost structure $C_{FN}/C_{FP}$, where should the operating point be? The optimal point maximizes:
$$\text{Benefit} = p^* \cdot C_{FN} \cdot P(H) - (1-p^*) \cdot C_{FP} \cdot P(FA)$$

The slope of the ROC curve at the optimal point equals $[(1-p^*) \cdot C_{FP}] / [p^* \cdot C_{FN}]$.

For medical diagnosis where $C_{FN} \gg C_{FP}$ (missing a disease is much worse than a false alarm), the optimal operating point is high on the ROC curve — accept high false alarm rates to minimize misses. The reviewer should be liberal.

For content moderation where $C_{FP}$ may be significant (incorrectly removing legitimate content damages trust), the operating point shifts toward lower false alarm rates.

---

## 4. Vigilance Decrement Models

### 4.1 The Vigilance Problem

Vigilance — sustained attention to detect infrequent signals — declines over time. This is among the most robust findings in human performance psychology, replicated in thousands of experiments since Mackworth's foundational work in 1948.

Three parameters govern vigilance decrement:
1. **Event rate:** More frequent signals maintain vigilance better
2. **Signal-noise ratio:** Harder discriminations decrement faster  
3. **Knowledge of results:** Feedback maintains vigilance

In HITL context: a reviewer examining flagged cases where positive examples are rare (low base rate in queue) is essentially performing a vigilance task. SDT provides the framework to detect vigilance decrement.

### 4.2 SDT Representation of Vigilance Decrement

Vigilance decrement manifests in SDT as a decline in $d'$ over time — not a shift in criterion $c$. This is the opposite of automation bias, which is primarily a criterion effect.

Let $d'(t)$ be discriminability at time $t$ since session start. A simple model:
$$d'(t) = d'_0 \cdot e^{-\lambda t}$$

where $d'_0$ is initial discriminability and $\lambda$ is the decay rate.

Empirical estimates from vigilance research suggest $\lambda$ ranges from 0.01 to 0.05 per minute for demanding tasks, implying meaningful discriminability loss within 20–40 minutes.

### 4.3 Combined Automation Bias + Vigilance Decrement

The two effects compound. A reviewer 90 minutes into a shift, reviewing AI-recommended decisions:

1. **Reduced $d'$** (vigilance decrement): The reviewer is less capable of distinguishing signal from noise
2. **Criterion shift toward automation** (automation bias): The reviewer relies more heavily on the AI recommendation

Both effects reduce the probability of catching errors the automation makes. Their joint effect is multiplicative on miss rate.

**Practical implication:** The highest-stakes cases should be allocated early in reviewer shifts, and should be presented with explicit uncertainty communication that forces active processing (counteracting criterion shift from automation bias).

---

## 5. Formal Model of Calibrated Trust

### 5.1 The Optimal Trust Model

Define $\tau \in [0,1]$ as the reviewer's trust in the automation, where $\tau = 0$ is complete distrust (reviewer ignores automation completely) and $\tau = 1$ is complete trust (reviewer accepts automation output without question).

The reviewer's effective decision is a weighted combination:
$$D_{\text{reviewer}} = (1-\tau) D_{\text{human}} + \tau D_{\text{automation}}$$

The expected accuracy of the human-AI team:
$$P(\text{correct}) = \tau \cdot P(\text{auto correct}) + (1-\tau) \cdot P(\text{human correct}) + \tau(1-\tau) \cdot P(\text{complementary})$$

where $P(\text{complementary})$ captures the cases where one is correct and the other is wrong — the synergistic potential of the team.

### 5.2 Optimal Trust Level

The optimal trust level $\tau^*$ maximizes expected accuracy:
$$\tau^* = \frac{P(\text{auto correct}) - P(\text{complementary})/2}{P(\text{auto correct}) + P(\text{human correct}) - P(\text{complementary})}$$

When $P(\text{auto correct}) > P(\text{human correct})$, the optimal trust level exceeds 0.5 (lean toward automation). When human accuracy exceeds automated accuracy, lean toward human judgment.

**Key finding:** In most HITL applications where automation is deployed specifically because it performs well, $\tau^* > 0.5$. Some level of automation bias is *optimal* given the cost structure. The problem is not deference per se, but deference that is not calibrated to the actual relative accuracy of human versus automated systems.

---

## 6. Measurement Implications for HITL Practitioners

### 6.1 Extracting SDT Parameters from Production Data

For a HITL system that logs reviewer decisions and eventual ground truth:

```
Given:
  - Positive decisions on true positives = hit count
  - Total true positives = TP_total
  - Positive decisions on true negatives = FA count
  - Total true negatives = TN_total

Compute:
  P(H) = hit_count / TP_total
  P(FA) = FA_count / TN_total
  
  d' = z(P(H)) - z(P(FA))
  c  = -0.5 * (z(P(H)) + z(P(FA)))
```

**Track $d'$ and $c$ over time** rather than only accuracy metrics. A reviewer whose $c$ is shifting toward conservative (increasing $c$) under automation pressure may show stable accuracy (both hits and false alarms decrease together) while their operating point moves suboptimally on the ROC curve.

### 6.2 Detecting Automation Bias via SDT

Compare $c$ estimates:
- Reviewer in condition A: AI recommendation visible
- Reviewer in condition B: AI recommendation hidden (blind review)

Automation bias is operationally defined as:
$$c_A \neq c_B$$

Specifically, when automation says "positive," $c_A < c_B$ (more liberal). When automation says "negative," $c_A > c_B$ (more conservative). Both are criterion effects.

### 6.3 Designing to Counteract Automation Bias

SDT provides a prescription: if automation bias is a criterion effect, interventions that anchor criterion independently from the automation recommendation will counteract it.

**Sequential design:** Present cases for initial human assessment, record decision, then reveal AI recommendation. Allow override. This anchors $c$ at $c_0$ before the automation induces a shift.

**Blind review sampling:** For a random sample of cases (say, 10%), hide the AI recommendation and collect blind human decisions. Compare the d' and c estimates against standard (AI-visible) reviews. The gap estimates the magnitude of automation bias in your specific system.

---

## Exercises

**Exercise 13A.1 — Computing d' and c**
A medical AI review system records that reviewers correctly flag 88% of true anomalies (hit rate = 0.88) and incorrectly flag 22% of normal scans (false alarm rate = 0.22).
(a) Compute $d'$.
(b) Compute $c$.
(c) Is the reviewer biased conservative or liberal? Interpret in the context of medical imaging.
(d) If the cost of a missed anomaly is 10× the cost of a false alarm, compute the optimal $c^*$ (assume base rate = 5% anomalies in the review queue).

**Exercise 13A.2 — Automation Bias via SDT**
In a baseline condition (no AI), a content moderator has hit rate = 0.75, false alarm rate = 0.18. In an AI-assisted condition, the moderator's hit rate = 0.85 (when AI says "flag") but overall miss rate increases to 0.32 (when AI says "pass" but the post is actually violating).
(a) Compute $d'$ and $c$ for the baseline condition.
(b) Characterize how criterion $c$ has shifted in the AI-assisted condition.
(c) Is this evidence of automation bias? What specific mechanism does SDT implicate?

**Exercise 13A.3 — Vigilance Decrement**
A reviewer begins a 4-hour shift with $d'_0 = 2.1$ and decay rate $\lambda = 0.012$ per minute.
(a) Compute $d'$ at t = 30, 60, 90, and 120 minutes.
(b) Compute the corresponding AUC at each time point.
(c) If the review queue has 12% base rate of positives and misses cost 5× more than false alarms, compute the optimal $c^*$ at each time point and describe how the optimal operating point shifts.
(d) Design a monitoring protocol that would detect this decay in production.

**Exercise 13A.4 — Optimal Trust Level**
A loan review system has: automation accuracy = 87%, human accuracy = 78%, and in cases where they disagree, the human is correct 60% of the time.
(a) Compute $P(\text{complementary})$ — the probability that exactly one of human/automation is correct on a given case.
(b) Compute $\tau^*$, the optimal trust level.
(c) Interpret: should the human reviewer defer to automation, rely on their own judgment, or use a mixed strategy? At what level?
(d) What interventions would help a human reviewer achieve trust level $\tau^*$ in practice?
