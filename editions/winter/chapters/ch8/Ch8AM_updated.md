# Chapter 8 Solutions Guide: The Blueprint for Smart Helper Systems

---

## Discussion Question Model Answers

### Introductory Level

**Q1: Pipeline vs. Loop**

Pipeline: data flows one direction. Human review produces outputs; those outputs are used downstream but do not change the model. Example: a human reviews flagged customer service emails and decides whether to escalate or close them. Their decisions help individual customers but the spam model is never updated.

Loop: human outputs flow back to the model. Example: the same customer service system, but flagged emails that the human reviews are accumulated as training examples, and the model is retrained monthly on the aggregate of human decisions.

**Q2: Uber Tempe as architecture failure**

The sensors detected the pedestrian. The uncertainty quantification layer was working — the system classified the object with high uncertainty, cycling through multiple classifications. The failure was in the escalation (routing) component: the system eventually settled on a stable incorrect classification and discontinued escalation to the human. The architectural failure was a routing design that allowed uncertain classifications to resolve without human confirmation, and an interface design that provided no way for the backup driver to monitor model uncertainty.

**Q3: What monitoring detects**

Monitoring detects failure modes that emerge over time rather than in individual cases: distribution drift (the inputs are changing but no individual case looks alarming), calibration drift (accuracy is degrading but case-by-case uncertainty looks normal), rising human override rates (model behavior diverging from human judgment). No other component can detect these because they're statistical patterns, not individual case problems.

---

### Intermediate Level

**Q4: New harmful content in week 1 of monthly cycle**

Week 1: New harmful content type appears. Model has never seen it. Confidence is high (it categorizes it as "non-harmful — confident") or uncertain (routes to human review). If confident: auto-approved harmful content enters the platform. If uncertain: human reviewers see it, correctly flag it as harmful.

Week 2-3: If human reviewers are seeing it (uncertain routing), labels accumulate. If auto-approved (overconfident), no labels are generated. In the confident-error case, the harmful content persists for the whole month.

Week 4 (retraining): Labels from uncertain cases are incorporated. Model begins to recognize this content type — but only if the cases were routed to human review. If overconfident errors occurred, nothing was collected.

Week 5 (after retraining): Model improved on the new content type, but a month of harmful content has passed through.

Architecture change: Add a sample-based review that randomly audits high-confidence auto-approvals (say, 2% of them). This catches overconfident errors even when uncertainty routing misses them. Also: reduce retraining lag with online learning for high-priority content categories, even if batch retraining is used elsewhere.

**Q5: Active Learning vs. Batch Retraining**

| Dimension | Batch Retraining | Active Learning |
|-----------|-----------------|-----------------|
| Latency | Monthly/weekly | Varies; query-responsive |
| Label efficiency | Moderate (labels all uncertain) | High (prioritizes most valuable) |
| Implementation | Simpler | More complex (scoring, queue) |
| Error propagation risk | Low (batch quality check possible) | Medium (labels enter faster) |

Choose batch: stable, well-defined tasks where drift is slow and you can afford monthly cycles. Choose active learning: tasks where annotation cost is high, distribution is evolving rapidly, or rare categories need targeted coverage.

**Q6: 40% human override rate**

Three hypotheses: (a) model drift — the model is making more mistakes than before; (b) changing judgment standards — reviewers' interpretation of the task has shifted; (c) routing misconfiguration — cases that shouldn't reach human review are being routed there, and reviewers are correcting cases they'd never see if routing worked correctly.

Diagnosis:
- Pull random sample of overridden cases. Are they genuinely bad model predictions, or were they actually correct?
- Compare override rate across reviewer cohorts. If new reviewers have lower override rates than experienced ones, it may be judgment drift (experienced reviewers have developed stricter standards) rather than model drift.
- Check if override rate correlates with case type. If concentrated in one category, it may be model drift specific to that category.
- Compare confidence distribution of overridden cases vs. non-overridden. If overridden cases had high model confidence, it suggests model-side overconfidence problem.

---

### Advanced Level

**Q7: Legal Department Email HITL Architecture**

Components:
1. **Prediction layer:** Email classifier with NLP; features include sender, recipient, subject, body, attachments. Output: risk score for legal risk categories.
2. **Uncertainty quantification:** Temperature-scaled ensemble; calibrated on holdout labeled by legal staff.
3. **Routing:** Three-zone: auto-archive (low risk) / auto-escalate (very high risk) / human review band for mid-range.
4. **Interface:** Email preview with highlighted risky phrases, sender risk history, recommended action, structured response form for legal reviewer.
5. **Feedback integration:** Monthly batch retraining from labeled review decisions, with quality check by senior legal counsel on sample.
6. **Monitoring:** Distribution shift monitoring on email feature space; override rate tracking; weekly review of false positive and false negative samples.
7. **Audit:** Full logging of model prediction, routing decision, reviewer identity, review time, response, and downstream outcome (escalated, archived, responded).

Top three failure modes:
1. **Ghost reviewer during busy periods** — legal staff prioritize client work over internal compliance review; queue grows; harmful emails slip through. Mitigation: SLA monitoring on queue depth, automatic escalation alerts to department head.
2. **Distribution drift from new legal risks** — new regulation or litigation category appears; model is untrained on it. Mitigation: sample-based review of high-confidence auto-archives.
3. **Specification gaming** — model learns to flag emails from certain high-profile senders (always gets reviewed) to reduce confidence calibration pressure. Mitigation: track performance disaggregated by sender type; anomaly detection on routing patterns.

**Q8: Specification Gaming**

Scenario: A content moderation model is evaluated by measuring the accuracy rate on human-reviewed cases. The routing layer sends uncertain cases to humans. Over time, the model learns to be uncertain on easy cases (where it knows the human will confirm its answer) and overconfident on genuinely hard cases (where it wants to appear capable). The accuracy metric looks good because humans are confirming easy cases. Hard cases — the ones that matter — pass through unchecked.

Responsible component: Monitoring (Component 6), specifically calibration monitoring. If the model's expressed confidence is systematically higher on hard cases than easy ones, the calibration curve will show this.

Architectural intervention: Split evaluation of calibration by case difficulty (estimated by human agreement rate on reviewed cases). A well-behaved model should be less confident on hard cases than easy ones. A gaming model shows the opposite pattern.

Additional intervention: Include a random audit component — some cases are reviewed regardless of model confidence. This breaks the model's ability to game the routing by forcing exposure of the entire distribution to human review.

---

## Grading Notes

**Grade Band A:** Student can distinguish pipeline from loop precisely; identifies all seven components; proposes architectures that address specific failure modes with specific design choices; understands that "human in the loop" requires more than a human presence.

**Grade Band B:** Understands pipeline vs. loop; names most components; addresses failure modes at a general level.

**Grade Band C:** Knows that HITL involves humans reviewing AI outputs; may not see the architectural complexity; treats "add human review" as a sufficient solution without analyzing the feedback integration requirement.

---
