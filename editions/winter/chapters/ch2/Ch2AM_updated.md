# Chapter 2 Solutions Guide: When Smart Systems Get Confused

*Model answers for discussion questions and activities*

---

## Discussion Question Model Answers

### Introductory Level

**Q1: Give three real examples of AI systems you use that signal confidence or uncertainty.**

Strong answers will include specific examples with specific signals:
- *Gmail spam filter*: High-confidence spam goes directly to spam folder, deleted after 30 days; lower-confidence borderline email appears in spam folder but with "This might not be spam" prompt and prominent "Not spam" button
- *iPhone Face ID*: When uncertain (unusual angle, low light), prompts for passcode rather than attempting to unlock; does not guess
- *Google Search autocomplete*: Shows multiple suggestions rather than one, implicitly signaling that several completions are plausible
- *Autocorrect*: Underlines uncertain corrections rather than auto-applying them

Award credit for any example that correctly identifies *how* the system signals uncertainty (not just that it sometimes gets things wrong).

**Q2: What is the difference between an AI making an error and an AI being confused?**

Key distinction: an error is a wrong output; confusion is a wrong output that the system has some ability to detect and signal. A system can:
- Make errors without confusion (overconfident wrong answer) — the Air Canada chatbot
- Be confused without making errors (uncertain right answer) — a well-calibrated system flags a borderline case that happens to be easy for a human reviewer

The distinction matters because HITL design can only catch errors that produce confusion signals. Silent errors — confident wrong answers — require different detection mechanisms (audit, adversarial testing, post-hoc analysis).

**Q3: Why would a well-calibrated AI be more useful for HITL than a more accurate but poorly calibrated one?**

Strong answer: calibration determines the reliability of the routing signal. If the system is well-calibrated, routing cases below 70% confidence to human review will reliably send cases that are likely to be wrong. If the system is poorly calibrated (overconfident), cases below 70% expressed confidence may actually have 90% true accuracy — the routing rule sends cases that don't need review — while cases with expressed confidence above 70% may be systematically wrong in ways the routing rule misses.

Analogy: a contractor who says "I'm 90% sure" and is right 90% of the time is more useful than one who says "I'm 90% sure" and is right 70% of the time, even if the second contractor produces better work on average. The first contractor's stated confidence is informative; the second's is not.

---

### Intermediate Level

**Q4: Translation system failing on idioms — aleatoric or epistemic?**

Primary answer: epistemic. Human translators who are familiar with the idioms can handle these correctly, indicating the information is present and the problem is the model's knowledge gap, not data absence. The model simply wasn't trained on enough idiomatic examples.

Recommended intervention: collect human-translated examples of idiomatic phrases and add them to training data. In the interim, flag idiomatic phrases for human review — this is precisely the epistemic-uncertainty HITL use case.

Nuance: if the idiom is culturally highly specific and no training translators are available who know it, there may be an aleatoric component. But this is unusual.

**Q5: Fraud detection system with ECE = 0.15 — practical meaning and HITL design implications.**

ECE of 0.15 means: on average, the model's expressed confidence is 15 percentage points off from its true accuracy in that confidence bin. For example, cases where the system says "80% confident this is fraudulent" are actually fraudulent only about 65% of the time (if the system is overconfident).

Practical implication for HITL design:
- If using a fixed threshold (e.g., flag transactions with fraud probability > 0.5), the threshold is miscalibrated — transactions flagged at "55% fraud probability" may actually have much lower true fraud probability
- False positive rate will be higher than expected
- Should recalibrate using temperature scaling or isotonic regression before setting thresholds
- Or: apply more conservative threshold to account for known overconfidence

**Q6: System routing bottom 20% confidence to review, but these cases are mostly low-risk.**

The system's uncertainty is miscalibrated relative to stakes. The model is uncertain about easy cases (low-risk patients) and confident about hard cases (high-risk patients). This is a failure of both calibration and stakes alignment.

Diagnosis: the model may be overfitting to surface features that are "unusual" relative to training data — unusual doesn't mean high-risk in this domain.

Fix: retrain with high-risk cases better represented; or use a different uncertainty signal that correlates with clinical risk rather than statistical novelty; or implement a two-stage filter — first flag clinically concerning features, then apply uncertainty routing.

---

### Advanced Level

**Q7: Conformal prediction vs. threshold confidence for medical triage.**

Conformal prediction provides a formal coverage guarantee: for a user-specified error rate α, the system guarantees that the true label falls in the prediction set at least (1 - α) of the time, regardless of the underlying distribution and without distributional assumptions.

A threshold-based confidence system provides no such guarantee. Its performance on a held-out test set may not generalize to deployment conditions, especially if the deployment distribution differs from the test distribution.

Operational costs of conformal prediction:
- Prediction sets may be large (multiple possible diagnoses) when uncertainty is high, requiring more clinical judgment
- Requires a calibration set to set the quantile threshold — must be updated when distribution shifts
- The coverage guarantee assumes exchangeability; distribution shift violates this

For medical triage, conformal prediction's formal guarantees are valuable precisely because the stakes are high and overconfidence is dangerous. The operational complexity is justified.

**Q8: Showing AI confidence to annotators before labeling — study design.**

Hypothesis: showing AI confidence before annotation creates anchoring bias — annotators adjust their labels toward the AI's confidence estimate, reducing the independence of the human signal.

Study design:
- Randomized controlled trial: annotate same cases with/without AI confidence displayed
- Measure: inter-annotator agreement (does showing confidence increase agreement?), annotation accuracy vs. held-out gold standard, time per annotation
- Controlled variable: show confidence to half the annotators for each case (within-item design to control for case difficulty)
- Also measure: how often annotators agree with the AI's *classification* (not just confidence level) as a function of displayed confidence

Expected finding: annotators shown high AI confidence will agree more with the AI's label, reducing sensitivity to AI errors. This is automation bias — a major concern in HITL quality.

Design implication: in some annotation scenarios, hiding the AI's prediction (while using its routing decision) may produce higher-quality independent human signal. This is sometimes called "blind review" or "pre-annotation blindfolding."

---

## Activity Answer Keys

### Activity 1: Calibration Diagnosis

A reliability diagram showing moderate overconfidence will typically show the calibration curve below the diagonal (actual accuracy lower than predicted confidence) especially in the 70-90% confidence range.

At what confidence level is overconfidence worst? Students should identify the region with the largest vertical gap between the calibration curve and the diagonal.

If threshold = 0.7: catching all cases below 0.7 confidence. The cases the model IS overconfident about (high confidence, low accuracy) are in the 0.8-0.9 range — these would NOT be routed to humans. The routing rule misses the worst overconfidence.

Better threshold design: lower the threshold to 0.85 to catch the overconfidence region, accepting more human review volume.

### Activity 2: Redesign Examples

No single correct answer. Evaluate on:
- Does the redesign match the stakes of the domain?
- Is the uncertainty communication actionable rather than just informative?
- Does the design avoid showing raw probability scores to domain experts who can't interpret them?
- Medical tool: should flag "uncertain — verify with specialist" rather than showing a number
- Legal chatbot: should flag "legal information may not apply to your jurisdiction — consult an attorney" on uncertain cases
- Spam filter: tiered labels + prominent "not spam" option for borderline cases

### Activity 3: Confusion Pattern Classification

Example cases and classifications:
- "System struggles to classify photos of dogs vs. cats at unusual angles" → Epistemic (with enough angle-varied training data, this improves)
- "Photo taken in complete darkness misclassified" → Aleatoric
- "Medical AI 95% confident on misdiagnosis" → Overconfidence failure (not detected by uncertainty routing)
- "Spam filter's expressed accuracy is 85% but actual accuracy on high-confidence predictions is 72%" → Calibration mismatch

---

## Grading Notes

**Grade Band A:** Student distinguishes aleatoric/epistemic consistently; correctly explains calibration and its HITL implications; designs interventions that target epistemic uncertainty specifically; identifies overconfidence as more dangerous than underconfidence for HITL.

**Grade Band B:** Student uses aleatoric/epistemic distinction but conflates occasionally; understands calibration qualitatively but struggles with quantitative implications; designs reasonable interventions without fully justifying threshold choices.

**Grade Band C:** Student understands that AI can be uncertain and that humans can help, but does not distinguish types of uncertainty; uses "accuracy" and "calibration" interchangeably; interventions are generic ("add more human review").

---
