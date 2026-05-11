# Chapter 5 Solutions Manual: The Art of Asking for Help (Without Being Annoying)

*Model answers to all discussion questions and exercises*

---

## Discussion Question Model Answers

### Introductory Level

**Q1: Recognition — How question wording changed your answer**

Strong responses identify specific episodes where the phrasing of a question changed what the respondent searched for or reported. For example: being asked "Do you have any questions?" versus "What's one thing that's still unclear?" — the latter produces genuine reflection, the former invites "no." Or a doctor asking "Are you in pain?" versus "On a scale of 1–10, how much does this hurt today compared to yesterday?" The more specific, grounded question activates episodic memory rather than general judgment, producing more useful information. Students should articulate *why* the phrasing mattered, not just describe the experience.

**Q2: Analysis — Banking app notification**

The notification "Unusual activity detected. Open the app to review" performs poorly on all three T-F-F dimensions.

- *Timing*: Likely sent at unpredictable times; gives no indication of when the "unusual activity" occurred, so context may be stale.
- *Frequency*: If the app sends many such notifications, users learn to dismiss them. The generic phrasing gives no signal of urgency.
- *Format*: The message provides no actionable specifics. The user cannot evaluate whether action is needed without opening the app and navigating to the flagged item. This requires 3–4 steps before the user can even assess whether a response is needed, let alone provide one.

The trust-attention-response triangle: trust is eroded by generic phrasing (this alert looks like every other alert); attention is split between the app-opening task and the underlying question; response is low-quality because the user has no information with which to respond.

**Q3: Application — Redesigned banking notification**

A well-redesigned notification might read: "Did you make a $127.43 purchase at GameStop on Friday at 6:15 PM? Reply YES to confirm or NO to freeze your card."

- *Timing*: Sent within 60 seconds of the transaction, while the user still has context.
- *Frequency*: Only triggered by statistically anomalous transactions (unusual merchant category, unusual time, unusual amount relative to user history), not every purchase.
- *Format*: Merchant name + exact amount + day/time anchors episodic memory. Binary YES/NO response requires one action. Consequence of "NO" is stated (card freeze), giving the user confidence that their response matters.

Trust: specific content signals careful system monitoring, not generic surveillance. Attention: sent while user is likely still in a spending mindset. Response: one-tap reply with clear stakes.

**Q4: Comparison — Push 2FA vs. number matching**

Push notifications (tap to approve) fail on the response dimension of the trust-attention-response triangle: the approval action requires no information from the user that couldn't be provided by an attacker who just sends the push and waits for a reflexive tap. The MFA fatigue attack exploits exactly this — sending many push notifications until a frustrated user approves one.

Number matching improves response quality dramatically: the user must read a number displayed on their screen and confirm that the number shown in the push notification matches. This requires active engagement with information the attacker cannot have (the number on the user's legitimate login screen). It also forces a moment of genuine cognition that interrupts reflexive approval.

On timing: both are sent at the moment of login (good — context is high). On frequency: both fire only at login (good, not fatiguing). The difference is entirely in format — and the format difference is functionally decisive.

---

### Intermediate Level

**Q5: Alert Fatigue in Clinical Settings**

A system generating 500 alerts per doctor per day, with 95% overridden, is a classic trust failure.

Trust failure diagnosis: The override rate tells us that doctors have learned the system's precision is very low — roughly 5% of alerts are actionable. A 5% precision system has an effective signal value near zero; the effort of evaluating each alert exceeds the expected information gain from doing so. The rational response for a busy clinician is to develop a heuristic of dismissal.

Attention failure: 500 alerts is approximately one alert every 57 seconds of an 8-hour shift. This is not an interruption pattern — it is a continuous noise floor. Sustained interruption at this frequency degrades all cognitive work, not just the alert-handling task.

Response failure: For 95% of alerts, any response is equally correct (override or comply). The format of alerts that carry low information doesn't distinguish itself from the 5% that matter.

Three interventions:
1. *Precision triage*: Audit all fired alerts. Eliminate categories with < 20% actionability rate. Even cutting the alert rate in half at constant precision increases effective signal value.
2. *Adaptive thresholds*: Raise alert thresholds for common low-risk interactions; lower them for rare high-risk combinations. Use historical override data to recalibrate.
3. *Batching + contextual presentation*: Deferred, non-urgent alerts batched to natural workflow breaks (post-patient, pre-documentation). Present them in context (patient history, current medications, why this specific interaction is flagged) so the physician can evaluate efficiently.

**Q6: Information Value of Specific vs. Generic Fraud Alerts**

From Appendix 5A, the information value of a human response depends on the entropy reduction: $\text{IG}(H; Y \mid X) = H(Y \mid X) - H(Y \mid H, X)$.

For the generic alert ("A transaction may need your review"): the human has no new information to bring. Their response $H$ is a coin flip — they have no basis for a more informed answer. Information gain approaches zero. The system learns nothing useful.

For the specific alert ("Did you make this $23.45 purchase at Starbucks at 9:14 AM?"): the human can directly check their episodic memory of that morning. Their response $H$ is based on genuine knowledge. If they say YES, the system gains strong evidence that the transaction was legitimate. If NO, the system gains strong evidence of fraud. Information gain is high.

The precision of the specific question activates the right memory at the right level of specificity. The generic question fails to activate any specific memory, defaulting to general assessment.

---

### Advanced Level

**Q7: Content Moderation Platform Design**

*Full system using Five Dimensions:*

**Uncertainty Detection (Dimension 1):** Train a multi-label classifier returning calibrated probability scores across violation categories. Route cases with maximum label score in [0.35, 0.75] to human review. Use separate OOD detection for content types unseen in training.

**Intervention Design (Dimension 2):** Interface presents content in full context (thread, account history, prior violations). Category schema is granular (12 categories with sub-labels) but presented progressively — reviewer sees broad category first, then refines. Explanation field for all non-obvious decisions. Time display (elapsed, not countdown) to prevent throughput pressure.

**Timing (Dimension 3):** High-stakes categories (CSAM, incitement) routed immediately regardless of confidence. Other categories batched into reviewer queues respecting daily case limits per reviewer.

**Stakes Calibration (Dimension 4):** Case severity score routes high-stakes uncertain cases to senior reviewers or two-reviewer panels. High-confidence auto-removes are sampled for audit (2% random, plus any appealed items).

**Feedback Integration (Dimension 5):** Reviewer decisions accumulate as training labels. Weekly batch retraining on agreed-upon cases (inter-annotator agreement > 0.7). Monthly calibration check. Reviewer feedback (flagging cases they found ambiguous or that they think the guidelines don't cover) routed to policy team.

Cognitive load management: 150 cases/reviewer/day hard limit, with breaks at 50-case intervals. Rotations across content categories to prevent habituation. Peer review panel for highest-difficulty ambiguous cases.

**Q8: Experiment Design — Measuring Information Value of Alert Formats**

Experiment design:

*Participants*: 200 bank account holders, randomly assigned to one of four alert format conditions.

*Conditions*:
- A: Generic ("Unusual activity detected")
- B: Semi-specific ("A $127 purchase may need review")
- C: Full specific ("Did you make this $127.43 purchase at GameStop on Friday at 6:15 PM?")
- D: Full specific + consequence ("... Reply YES to confirm or NO to freeze your card")

*Procedure*: All participants receive 20 alerts over 4 weeks — 10 for real transactions (positive ground truth), 10 for simulated fraudulent transactions (negative ground truth). Measure:
1. Response rate (attention)
2. Accuracy of YES/NO response vs. ground truth (response quality)
3. Response time (cognitive load proxy)
4. Trust calibration — post-study survey asking "How much do you trust fraud alerts from your bank?" (trust)

*Quantifying information quality*: For each response, compute whether it matches ground truth. Information quality = $\sum_i \text{IG}(H_i; Y_i)$ approximated as accuracy above chance.

*Confounds to control*: Time of day (attention availability); amount of transaction (salience effect); prior fraud experience (trust prior); device type (mobile vs. desktop affects ease of response).

*Expected results*: Conditions C and D should show substantially higher accuracy and response rates. The marginal gain from D over C tests whether stating consequences matters beyond the informational content.

---

## Grading Notes

**Grade Band A:** Students apply T-F-F and trust-attention-response consistently and specifically; their system designs include all three levers with justification; they connect question format to information value explicitly; they understand that feedback integration is not optional. Redesigned alerts are specific, actionable, and timely.

**Grade Band B:** Students apply T-F-F correctly; identify trust failures vs. attention failures; propose reasonable improvements. May miss the information-theoretic dimension of format design. System designs are coherent but may lack detail on feedback integration.

**Grade Band C:** Students can name the three levers and apply them loosely; may treat all alert failures as "confusing" without distinguishing the specific failure type; may propose improvements that address format but not timing or frequency. Likely treat feedback integration as a UX feature rather than a core ML pipeline requirement.

---

## Exercise Solutions

### Exercise 5.1 — Alert Audit

*Model protocol for the "Try This" exercise*

Each alert logged should note:
1. **Timing assessment**: Was the alert sent at a moment when the reviewer could respond effectively? (Binary: yes/no + brief justification)
2. **Framing assessment**: Does the alert provide all information needed to answer accurately? (Scale 1–5: 1 = no useful information, 5 = perfect information)
3. **Consequentiality assessment**: Does the alert indicate that the reviewer's response will change anything? (Binary + evidence)

Pattern recognition: Students typically find that email/push notifications score poorly on timing and format but variably on consequentiality. Security-related alerts tend to score better on format than service/update alerts. Alerts from financial institutions tend to be better-designed than alerts from consumer apps.

### Exercise 5.2 — HITL Intervention Design

*Rubric for design documents*

Full credit requires:
- Clear trigger specification (what uncertainty level triggers the ask)
- Notification design with exact phrasing proposed
- Timing specification (when sent, synchronous or asynchronous)
- Frequency controls (rate limiting, adaptive suppression)
- Response format with all options specified
- Explicit feedback integration mechanism (what happens to the response)

Partial credit: designs that address 3–4 of the 6 components. No credit: designs that specify only the visual format without trigger or feedback components.
