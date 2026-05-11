# Chapter 4 Solutions Guide: From Confusion to Decision

*Model answers for discussion questions*

---

## Discussion Question Model Answers

### Introductory Level

**Q1: Smoke detector threshold for hospital vs. warehouse**

A smoke detector set to a low threshold will alarm on low concentrations of smoke — cooking smoke, candle smoke, dusty equipment. This means frequent false alarms. The consequence: people become habituated to alarms and stop responding (alert fatigue). The true fire alarm is ignored.

A warehouse with high ignition risk and slower evacuation time benefits from an early alarm — the cost of a false alarm (wasted evacuation time) is lower than the cost of a late alarm (serious fire before anyone responds). A lower threshold makes sense.

A hospital with high patient acuity and evacuation difficulty has different cost structure. False alarms cause staff burden, disoriented patients, and potential harm from evacuation. But the cost of missing a real fire is catastrophic. A hospital might use a two-stage system: early low-threshold alert to staff only, high-threshold full alarm. This is literally a HITL band — staff review the low-confidence signal before the system acts on it fully.

**Q2: Job screening threshold and hiring strategy change**

If the company changes strategy to be more selective, it needs to raise the threshold — fewer applicants pass the screen. But this is not a purely technical parameter: "what does 'more selective' mean?" requires domain judgment. More selective on what dimension? The algorithm may measure things that correlate with the trait the company values (interview performance) but don't predict it reliably.

Who makes this decision: ideally a deliberative process involving HR leadership, legal counsel (to check for disparate impact), and people familiar with what actually predicts job performance in this role. Not the data scientist alone.

**Q3: Probability vs. decision**

"70% likely to be spam" is a statement about uncertainty. "This email is spam" is a decision that has consequences: the email is moved to spam, the user may not see it, the user's friend may assume they received it.

The difference matters because the act of converting 70% to "is spam" requires a choice about what to do with that 30% of uncertainty. A threshold of 0.5 says "in this 30% uncertain case, we'll treat it as spam." A threshold of 0.8 says "in this 30% uncertain case, we'll treat it as not-spam." Both choices have defensible reasoning — and different consequences for different users.

---

### Intermediate Level

**Q4: Cancer screening thresholds at 0.3 vs. 0.6**

Hospital A (τ = 0.3, aggressive):
- Higher sensitivity: catches most cancers, including early-stage
- Higher false positive rate: significantly more patients referred for unnecessary biopsies
- Patient impact: anxiety, procedural risk, cost for biopsy patients who are actually healthy
- Downstream: radiologists at Hospital A perform more total biopsy reads; possible fatigue over time
- Where this makes sense: high-risk patient populations, populations with limited access to follow-up care

Hospital B (τ = 0.6, conservative):
- Lower sensitivity: catches fewer cancers, potentially misses early-stage findings
- Lower false positive rate: fewer unnecessary biopsies
- Patient impact: some cancers detected at later stage
- Where this makes sense: low-risk patient populations, populations with easy access to follow-up

Which to recommend: depends on patient population, follow-up care capacity, and the relative costs of missed detection vs. unnecessary procedure for the specific cancer type. There is no universal answer. The chapter's point: this is a values-laden decision, not a technical one.

**Q5: HITL band vs. single threshold**

Single threshold: every case is classified autonomously. Error rate is constant across the entire input space.

HITL band: cases in the uncertain zone (between τ_L and τ_H) go to human review, which has higher accuracy than the model on ambiguous inputs. The error rate for cases in the band drops (because humans are better on these cases); the error rate for cases outside the band stays the same as the single-threshold system.

The band is preferable because it concentrates human effort where it has the highest marginal value — cases near the decision boundary where the model is least reliable and where errors have highest consequence.

Optimal band width is determined by: the model's performance improvement from human review in the band, the cost of human review per case, and the error cost structure. Wider band = more cases reviewed = lower total error rate, but higher review cost. At some band width, the review cost exceeds the error cost savings — that's the optimal point.

**Q6: AFST threshold and stakeholder participation**

The argument that social workers with lived experience should set the threshold is well-grounded. The threshold embeds a value judgment about the acceptable tradeoff between: (a) missing a child at genuine risk of harm (false negative) and (b) conducting a traumatic, family-disrupting investigation of a family that didn't need it (false positive). Both sides of this tradeoff are experienced by the people involved, not by the data scientist.

Counterargument: social workers may also have biases — anchoring on certain family characteristics, being influenced by recent salient cases, inconsistently applying the threshold across investigators. These are real problems that algorithmic scoring systems were designed to address.

The resolution is not "data scientists" vs. "social workers" — it's a deliberative process involving multiple stakeholders, including families and community members from the populations most affected by algorithmic screening. The chapter's point: excluding this deliberative process by treating the threshold as a technical parameter is a design failure.

---

### Advanced Level

**Q7: Deriving optimal threshold**

We want to minimize expected cost:
```
E[Cost] = C_FN · P(y=1) · P(predict negative | y=1) + C_FP · P(y=0) · P(predict positive | y=0)
        = C_FN · P(y=1) · (1 - TPR(τ)) + C_FP · P(y=0) · FPR(τ)
```

For a single example x with score s = P(y=1|x):
- If we predict positive: cost = C_FP if y=0, probability = 1-s
- If we predict negative: cost = C_FN if y=1, probability = s

We predict positive when: s · 0 + (1-s) · C_FP < s · C_FN + (1-s) · 0
⟹ (1-s) · C_FP < s · C_FN
⟹ C_FP - s · C_FP < s · C_FN
⟹ C_FP < s · (C_FN + C_FP)
⟹ s > C_FP / (C_FN + C_FP) = τ*

As C_FN/C_FP → ∞: τ* → C_FP/(∞ + C_FP) → 0

Interpretation: when false negatives become infinitely more costly than false positives, the optimal threshold approaches 0 — flag everything as positive. In the limit, the system has 100% sensitivity (no false negatives) at the cost of 100% false positive rate — which makes sense when a miss is infinitely worse than a false alarm.

**Q8: HITL band for 3-class system**

For a 3-class system (classes A, B, C), each prediction is a probability vector (p_A, p_B, p_C) summing to 1 (the probability simplex). The model predicts the argmax class.

A HITL band for this system would route cases to human review when:
- The maximum class probability is below a threshold (overall uncertainty is high)
- The difference between the top-two class probabilities is below a margin (the top two classes are nearly tied)

Formally:
```
Route to review if: max(p_A, p_B, p_C) < τ_top
OR:                 max(p) - second_max(p) < τ_margin
```

The first condition catches cases where the model is uncertain about everything. The second catches cases where the model "knows" the answer is A or B but can't tell which — the human review can resolve the specific ambiguity.

This extends naturally to N classes by defining the review region as the band around each pairwise decision boundary in the simplex.

---

## Grading Notes

**Grade Band A:** Student correctly uses cost asymmetry to derive threshold direction; understands that the optimal threshold depends on domain values, not just model performance; proposes deliberative processes for threshold-setting that include affected stakeholders; correctly derives or applies the τ* formula.

**Grade Band B:** Student understands Type I/II tradeoff and gives correct directional reasoning (high C_FN → lower threshold); may not account for base rate in threshold calculation; proposes stakeholder involvement but without specificity about who or how.

**Grade Band C:** Student understands that thresholds exist and affect accuracy; frames the problem as purely technical; conflates AUC improvement with threshold optimization.

---
