# Chapter 15 Solutions Guide: Exercise Solutions and Answer Keys

*Complete solutions for all exercises, activities, and discussion questions*

---

## Discussion Question Solutions

### Introductory Level Solutions

#### Question 1: Taxonomy Application

**Prompt:** Apply the four failure modes to a described failure.

**Model Answer Framework:**

Instructors should evaluate student answers on three criteria:
1. Correct identification of the primary failure mode, with evidence
2. Acknowledgment that multiple failure modes may be present simultaneously
3. Correct linkage between failure mode and appropriate remediation

**Sample strong answer (for the hiring AI scenario):**
"The primary failure mode is **model failure** — specifically, a distributional artifact from training on historical data that reflects past discriminatory hiring practices. However, **annotation failure** is also present: the historical 'ground truth' labels (who was hired) were themselves the product of human bias, not objective job performance. A third contributing failure may be **design failure**: if the system was deployed without slice-based evaluation by gender, the disparity would not have been detected. The audit trail failure — not logging decisions in a way that allows retrospective analysis — compounds all three."

**Grade Bands:**
- **Excellent (A):** Identifies primary failure mode correctly, notes compounding factors, connects to remediation
- **Good (B):** Identifies primary failure mode correctly, some analysis of evidence
- **Satisfactory (C):** Identifies a failure mode but may confuse modes or provide thin evidence
- **Needs Work (D):** Misidentifies failure mode or provides no diagnostic reasoning

#### Question 2: Spot vs. Systematic

**Prompt:** "A credit card fraud detection system incorrectly blocked a purchase at a new restaurant."

**Model Answer:**

This could be either a spot failure or a systematic failure, and you cannot determine which from this description alone.

**If it is a spot failure:** The restaurant's merchant ID had a data quality issue; the transaction had an unusual amount for this customer; the system made a probabilistic error that is not expected to recur systematically.

**If it is a systematic failure:** The system systematically flags purchases at newly-opened restaurants because they lack transaction history; the system systematically flags purchases from customers who rarely try new establishments; the merchant category code for this type of restaurant is over-flagged.

**Information needed to determine which:**
1. Does the system over-flag purchases at new restaurants in general? (Requires slice-based analysis by merchant tenure)
2. Has this customer been over-flagged before on similar types of transactions?
3. What percentage of legitimate transactions at new establishments are flagged?

**The diagnostic lesson:** Always treat an individual error as a hypothesis about a potential systematic failure until you have enough data to rule that out.

#### Question 3: Audit Trail

**Model Answer:**

**Information needed to scope harm and implement remediation:**
- Which patients were diagnosed by the AI during the affected period
- What diagnosis the AI produced for each patient
- What diagnosis the human clinician confirmed or overrode
- What treatment decisions followed from the diagnosis
- Patient outcomes where available

**What needed to have been logged:**
- Every AI prediction with: patient ID (de-identified), prediction score, timestamp, image quality metrics, patient age, equipment type
- Every clinician decision with: clinician ID, decision (confirm/override), reasoning if override, timestamp
- Every system update with: model version, training data version, threshold values, date
- Every patient outcome that was later entered into the EHR

**Why not having this information is costly:** Without it, you cannot identify which patients were affected, cannot determine the severity of harm to each, cannot implement a targeted remediation, and cannot satisfy regulatory reporting requirements.

#### Question 4: Blameless Post-Mortem

**Model Answer:**

**Why Google advocates blameless post-mortems:**
1. People are more honest when they don't fear punishment, which produces better information
2. Individuals rarely cause failures on their own — they act within systems. Punishing individuals without fixing systems produces a new error next time
3. Fear of blame creates incentives to cover up failures, which delays detection and remediation
4. The goal is learning, not retribution

**When blameless might be inappropriate:**
- Deliberate malfeasance or fraud (intentional harm is different from systemic error)
- Regulatory or legal contexts where individual accountability is required
- Cases involving severe harm where affected parties have a right to know who made specific decisions

**Teaching note:** This is a nuanced area. Help students distinguish between "blameless analysis" (the goal of post-mortems) and "no accountability" (which is neither the goal nor the outcome). Post-mortems can and should identify structural failures that include decisions made by specific individuals — the difference is that the focus is on why the decision was rational in context, not on whether the individual should be punished.

---

### Intermediate Level Solutions

#### Question: Flash Crash Analysis

**Model Answer:**

**Primary Dimension Failure: Timing**

The Flash Crash was primarily a Timing failure. The system was operating on timescales (milliseconds) that human reaction time (hundreds of milliseconds to seconds) cannot match. Even with humans present and watching, intervention was effectively impossible.

**Secondary Dimension Failures:**
- **Intervention Design**: Circuit breakers existed but were insufficient for the speed and scale of the cascade. The intervention design had not anticipated feedback loops across multiple trading systems simultaneously.
- **Feedback Integration**: The algorithms were each independently well-designed, but there was no mechanism for the collective system to detect that it was in a pathological feedback loop.
- **Stakes Calibration**: Individual algorithms were calibrated for their own risk, not for systemic risk. Each algorithm's behavior was locally rational; collectively, they were catastrophic.

**HITL Design Changes That Might Have Prevented It:**
1. Market-wide circuit breakers calibrated for cascade detection, not just price movement speed
2. Coordination protocols requiring algorithms to reduce activity when market-wide volatility exceeds a threshold
3. Mandatory human review of algorithm parameter changes that could increase feedback loop potential
4. Kill-switch protocols that are fast enough to engage at algorithmic timescales

**Key insight for students:** The Flash Crash demonstrates that Timing failures are often architectural, not operational. No human could have intervened faster. The solution requires designing the system so that human-speed intervention points exist before the cascade accelerates beyond them.

#### Question: The Credit Scoring Case

**Model Answer:**

**Failure Modes Present:**

1. **Model Failure (Primary):** The model was producing incorrect risk scores for applicants in specific ZIP codes, not because of actual credit risk, but because of ZIP code as a proxy for race.

2. **Annotation/Label Failure:** The historical training data — past lending decisions — was itself the product of discriminatory practices (redlining). The "correct" labels in the training data were not objectively correct; they reflected which populations had been approved or denied in a discriminatory system.

3. **Reviewer Failure:** Loan officers exhibited automation bias, deferring to model scores at very high rates even on uncertain cases, which meant they were not functioning as an independent check on model errors.

4. **Feedback Loop Amplification (Design Failure):** The model's predictions influenced who received loans, which affected repayment data, which influenced future model training. High-scored ZIP codes in the bad direction received fewer approvals, generating less repayment data, making the model even less certain about those populations.

**How They Interacted:**
- Label failure seeded the model failure (trained on biased history)
- Model failure was amplified by reviewer failure (humans deferred to biased scores)
- Reviewer failure was amplified by design failure (feedback loop reinforced the bias)
- All three compounded silently for three years because no one had built slice-based monitoring

**Key teaching point:** This is the typical pattern of severe HITL failures — they are almost never single-mode. The Five Whys, applied carefully, should identify the earliest failure in the causal chain.

#### Question: Reviewer Failure Analysis

**Model Answer:**

**94% agreement with the model is almost certainly a sign of automation bias, not system effectiveness.**

Here is why: If the model is uncertain enough about 100% of cases to send them all to human review, but humans agree with the model 94% of the time anyway, then the human review step is not functioning as an independent check. The humans are essentially rubber-stamping the model.

**How to determine which it is:**

1. **Measure human accuracy on cases where the model is wrong.** If reviewers catch model errors at a significantly higher rate than 6%, the 94% agreement may still reflect meaningful oversight. If reviewers catch model errors at 6% (same as their overall disagreement rate), they are not adding value.

2. **Test blind versus non-blind review.** Present reviewers with the same cases, but in one condition show them the model score, and in another condition don't. If agreement rates drop significantly in the non-blind condition, automation bias is confirmed.

3. **Measure reviewer accuracy relative to gold labels** (not model predictions). If reviewers are 94% accurate against gold labels, the agreement with the model may be a coincidence of both being accurate. If reviewers are substantially less accurate against gold labels when they see the model score, automation bias is the mechanism.

**The deeper problem:** A HITL system where humans agree with the model 94% of the time provides only nominal oversight. The real human-in-the-loop value occurs in the 6% where humans disagree — and those cases may be the most important ones.

---

### Advanced Level Solutions

#### Question: Complete Remediation Plan for Credit Scoring Case

**Model Answer Framework:**

**Immediate (0–30 days):**
- Pause automated approvals for applications in affected ZIP codes; route to senior human reviewers not previously exposed to model scores
- Notify legal and compliance; retain external counsel
- Commission third-party audit of affected decisions
- Brief executive leadership and board

**Short-Term (30–90 days):**
- Re-run affected applications through a model without ZIP code or ZIP-code-correlated features
- Identify applicants whose outcomes would have been different under the corrected model
- Draft notification letters to affected applicants
- Create a remediation process: affected applicants may request reconsideration

**Medium-Term (90–180 days):**
- Retrain model on corrected feature set, with fairness constraints
- Implement slice-based monitoring for demographic parity on an ongoing basis
- Redesign human review process to reduce automation bias (blind review protocol for uncertain cases)
- Restructure reviewer incentives away from throughput and toward quality

**Long-Term (180+ days):**
- Implement feedback loop monitoring to detect self-reinforcing prediction patterns
- Commission annual third-party fairness audits
- Publish transparency report on HITL practices
- Engage community organizations in affected ZIP codes on loan access

**Stakeholder Communication:**
- Affected customers: written notification within 30 days, clear remediation path, no jargon
- Regulators: proactive disclosure, full cooperation with any examination
- Internal teams: blameless post-mortem findings, emphasis on systemic root causes

---

## Activity Solutions

### Activity 1: Failure Mode Diagnosis — Sample Strong Answers

**Scenario A (Hiring AI):**
Primary: Model failure (distributional artifact from biased training data) + Annotation failure (historical hiring decisions as labels)
First steps: (1) Slice analysis by gender. (2) Analyze training data composition — what years? (3) Measure automation bias: how often do human recruiters override the AI by gender?

**Scenario B (Content Moderation):**
Primary: Design failure (alert fatigue from excessive review rate) + Reviewer failure (12-second review time is insufficient for quality)
First steps: (1) Calculate review rate: 500/day for 20 reviewers = 25 per person, not inherently problematic if 12 seconds is adequate. Recalculate: 25 × 12 seconds = 5 minutes/day on reviews. That's not the problem. The 61% accuracy on test set IS the problem. (2) Re-read: 500 review requests per day with 20 reviewers = 25 per person. Re-check. The issue is accuracy (61%) and potentially automation bias.
First steps revised: (1) Measure accuracy without AI recommendation shown (blind review). (2) Analyze error patterns — what types of content are reviewers worst on? (3) Measure inter-reviewer agreement.

**Scenario C (Medical AI):**
Primary: Model failure (distributional shift after retraining — possibly the new training data didn't include sufficient portable X-ray examples, or the new data diluted the model's calibration on that subtype)
First steps: (1) Check composition of new training data — portable vs. standard X-ray ratio. (2) Slice-based comparison: performance before/after retraining, separately for portable and standard. (3) Calibration analysis — did confidence scores change after retraining?

**Scenario D (Fraud Detection):**
Primary: Design failure (threshold or feature design systematically disadvantages new customers) + possible Model failure (model has insufficient data on new customers and is over-flagging due to low confidence)
First steps: (1) Slice analysis: false positive rates by account tenure. (2) Check feature importance — is account tenure or a proxy directly penalizing new customers? (3) Examine confidence scores for new vs. established customers — is the model more uncertain about new customers, and should it be routing them to human review rather than blocking?

---

### Activity 2: Five Whys — Sample Strong Chain (Credit Scoring)

**Why were applicants from specific ZIP codes systematically over-scored?**
Because the model used ZIP code as a feature, and ZIP code correlated with race due to historical residential segregation.

**Why did the model use ZIP code?**
Because the data scientists did not identify ZIP code as a proxy for protected attributes during feature engineering review.

**Why did they not identify it?**
Because no fairness review process existed as part of the model development workflow.

**Why did no fairness review process exist?**
Because when the model was built (2016), the organization's ML governance policies did not require fairness evaluation for lending models.

**Why did the policies not require it?**
Because ML governance policies were drafted primarily by engineers without legal, ethics, or community input, and no regulator had yet mandated fairness evaluation for ML lending models in this jurisdiction.

**Root Cause:** The organizational policy structure did not include the expertise (legal, ethics, community relations) needed to anticipate and require fairness evaluation in a high-stakes ML deployment.

**Structural fix:** Mandatory cross-functional review (including legal and ethics) for any ML model affecting credit, employment, housing, or healthcare decisions, with explicit fairness evaluation requirements.

---

## "Try This" Exercise — Sample Strong Response

**Prompt:** "Think of a HITL system that has done something systematically wrong."

**Sample Strong Response:**

"I use a popular job board that sends me recommendations for jobs that match my profile. Over several months, I noticed it consistently recommended senior-level jobs in one field and entry-level jobs in another, even though my experience in both fields is equivalent. 

On the surface this might be a spot failure — just a bad recommendation day. But when I tested it by adding the second field more prominently to my profile and removing it, the senior recommendations came back, then went away again.

This looks like a **model failure** — specifically, the system appears to have learned that people with my combination of fields are more likely to apply to senior roles in the first field. But this could be a historical artifact of who used the platform: if the platform was adopted earlier in my first field, it would have more senior-role users from that field in its training data.

It's also possibly an **annotation failure**: if the 'successful application' signal (clicking apply, getting interviews) correlates with field and seniority in biased ways, the system is training on a measure that reflects who was historically hired, not who could do the job.

What I'd need to diagnose it further: platform-wide data on recommendation-to-application-to-hire rates by field and seniority, broken out by user demographics. That data I don't have access to — which is itself a point about audit trail transparency."

**What makes this strong:** The student moves from a personal observation to a systematic hypothesis, correctly distinguishes spot vs. systematic failure, applies multiple failure mode hypotheses, and identifies what data would resolve the ambiguity — even while acknowledging they don't have access to it.

---

## Assessment Solution Keys

### Failure Analysis Report — A-Grade Framework

An A-grade failure analysis report should:

1. Correctly identify the primary failure mode with specific evidence (not just assertion)
2. Apply the Five Whys to a depth where the structural/organizational root cause is reached (typically 4–6 levels)
3. Note explicitly what audit trail data would have been needed to detect the failure earlier
4. Propose a remediation plan that addresses each level of the root cause chain, not just the immediate symptom
5. Discuss the ethical dimensions: who was harmed, what was the harm, what was owed to affected parties

**Common gaps in B-grade responses:**
- Five Whys stops at technical root cause, doesn't reach organizational level
- Remediation addresses only the model/label fix, not the monitoring or process changes
- Audit trail discussion is generic ("log everything") rather than specific to the domain and failure mode

**Common gaps in C-grade responses:**
- Failure mode identification is correct but thin on evidence
- Five Whys is shallow (2–3 levels)
- Remediation is vague or consists only of "retrain the model"

**Common gaps in D-grade responses:**
- Failure mode misidentified or confused
- No systematic diagnosis — just narrative description of what went wrong
- Remediation absent or implausible
