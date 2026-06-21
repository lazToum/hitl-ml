# Human in the Loop: Winter is Coming Edition
## Solutions Manual

*Full worked answers, sample responses at each grade level, and common wrong answers for all questions in the student edition*

---

> **For instructors and TAs:** This manual covers every question in the student edition in grading order. Full model answers are written at the level expected from a student who has read and understood the material. Grade-band examples show what distinguishes A/B/C work. The instructor's companion (`HITL_Winter_is_Coming_Teachers.md`) contains additional questions not in the student edition; their answer keys are there.

---

## Part I: Cold Check — Solutions

### Q1. What is a human-in-the-loop system?

**Model answer (full credit):**
A human-in-the-loop system is one in which human judgment is a designed, structural component of a decision or action process — not merely an optional override. The human is expected to participate at specific points, typically when the automated component is uncertain, when the stakes are high, or when the task requires judgment the system cannot reliably provide. HITL sits between full automation (no human involvement) and fully manual work (no automated component). The defining characteristic is that human involvement is architectural: the system is designed around it, not just capable of it.

**Grade A — adds:**
- Distinguishes HITL from human-on-the-loop (human can intervene but system doesn't expect it)
- Notes that HITL evolves: what a human does changes as system capabilities change
- May reference feedback integration: human input often improves the system over time

**Grade B:**
- Correct definition with at least one example
- May conflate "can involve humans" with "requires humans" but definition is otherwise sound

**Grade C:**
- Describes examples correctly but cannot articulate the structural distinction
- "A system where humans and computers work together" — too vague, but shows some understanding

**No credit:**
- "A system where a human does the work" (confuses HITL with manual work)
- "A system with a safety button" (confuses HITL with an emergency stop)

---

### Q2. Two real examples of HITL you encountered today

**What a full-credit answer looks like:**

*Example 1 — Bank fraud alert (SMS): The bank's algorithm detected an unusual transaction and sent me a text asking "Did you make this purchase?" My yes/no response was a required step in the decision process — a "yes" unlocks the transaction; a "no" flags it for review. This is Human as Exception Handler mode: routine transactions are automated; uncertain or unusual ones escalate to me.*

*Example 2 — Google Maps "Faster route found": The navigation system found an alternate route and presented it for my acceptance. I could decline. My choice was used to update route predictions for other users. This is Human as Decision Authority for routing choices that affect me personally, with Feedback Integration feeding aggregate choices back into the model.*

**Partial credit:** Any correctly identified system where the human's involvement is described — even without naming the HITL mode.

**No credit:** Listing features without explaining the human's role (e.g., "my phone's autocorrect" without noting that accepting/rejecting suggestions is the HITL interaction).

---

### Q3. "Asking for help" vs. "failing"

**Model answer:**
A system that asks for help is expressing calibrated uncertainty — it knows the limits of its confidence and routes the decision to a human rather than guessing wrong. This is intelligent design. A system that fails either acts on high uncertainty without recognizing it (overconfident silence), crashes or produces wrong output without any signal that it was uncertain, or triggers false alarms so often that the human component becomes unreliable. Asking for help when uncertain is the correct behavior; the failure cases are asking wrongly, asking too much, or not asking when you should.

The Air Canada chatbot illustrates the distinction: the chatbot didn't fail by being wrong — systems can be wrong. It failed by being wrong *with the same confidence* it used for correct answers, with no mechanism to say "I'm not certain." That's the failure. A well-designed system in the same situation would have said "I believe the policy is X, but please confirm with our support team" — same underlying error, completely different outcome.

**Common wrong answer:** "If it asks for help it's failed at its job." Zero credit. This is the core misconception the field argues against.

---

### Q4. The five dimensions

**Full credit:** All five, in any order:
1. Uncertainty Detection
2. Intervention Design
3. Timing
4. Stakes Calibration
5. Feedback Integration

**Partial credit (3 points for 3 correct, 4 for 4 correct).**

**No credit for invented dimensions** (e.g., "Accuracy Monitoring," "Human Availability"). Even if the concept is real, inventing framework elements demonstrates non-mastery.

---

### Q5. Nest thermostat — why it's a HITL failure, not a hardware failure

**Model answer:**
The failure is in the design of the decision loop, not in the sensors. The Nest's motion detectors and GPS location tracking work as designed. The problem is that when these signals give an uncertain or conflicting reading — phone away but motion absent, or morning quiet hours — the system makes a decision (switches to Away mode) without communicating its uncertainty or asking for confirmation. The same hardware, redesigned with a message "I haven't detected activity for 2 hours — should I switch to energy-saving mode?", would be a good HITL system. The thermostat fails because Intervention Design and the communication loop are missing. It "asks" (in the sense that it uses sensor data as a proxy for asking "are you home?") but never tells you what it concluded, never gives you a chance to correct it, and never learns that its inferences are wrong except through manual overrides.

**Grade A — adds:**
- Names the specific dimension(s) that failed (Intervention Design, missing communication loop)
- Notes the design fix would not require different hardware — same sensors, different software decisions
- May connect to the "silent asking" failure type from Part II

**Grade B:**
- Correctly identifies the design problem without naming the framework dimension
- "It should ask before changing the temperature" — correct direction, incomplete analysis

**Grade C:**
- "The sensors are inaccurate" — misidentifies the failure layer. Partial credit only.

---

### Q6. Alert fatigue

**Model answer:**
Alert fatigue is the phenomenon in which a system generates enough alerts — especially low-quality, redundant, or low-stakes ones — that human reviewers begin to dismiss or ignore them automatically, including alerts that are genuinely important. It is not merely annoyance; it actively degrades the reliability of the human component of the HITL system. Extensively documented in healthcare (clinical drug-drug interaction alerts, ICU alarms) and cybersecurity (SIEM platforms generating thousands of daily alerts). The result: the human who was supposed to be the intelligent exception handler becomes a reflexive "approve" machine who rubber-stamps everything.

This is the left-side failure of the Goldilocks problem — asking too much — and it is directionally opposite to overconfident silence but equally dangerous. A hospital alarm that cries wolf on every minor fluctuation will eventually cause nurses to miss the real emergency.

**Partial credit:** Answers that describe "too many alerts" without naming the degradation of the human reviewer as a component. The key mechanism is not just annoyance — it's that the human's reliability in the loop drops to near zero.

---

### Q7. Calibration

**Model answer:**
A model is well-calibrated if its expressed confidence corresponds to its actual accuracy: when it says "I'm 80% confident," it should be correct approximately 80% of the time on those predictions. Calibration is a property of the relationship between confidence scores and accuracy rates, not just of accuracy alone. A model that is correct 94% of the time overall but outputs "99% confident" for every prediction is poorly calibrated (overconfident), even though it is highly accurate. Conversely, a model that always outputs "50% confident" but is right 90% of the time is also poorly calibrated (underconfident).

Calibration matters for HITL because escalation thresholds are set on confidence scores. If a "95% confidence" score actually predicts 70% accuracy, the threshold at which human review is triggered is meaningless — the model will pass cases to auto-processing that should be reviewed.

**The key sentence every graded answer must contain:** "Calibration measures whether expressed confidence matches actual accuracy, not just whether the model is accurate."

---

### Q8. DPO

**Model answer:**
Direct Preference Optimization (DPO) is an LLM alignment method that converts human preference comparisons (which of two outputs is better?) directly into a fine-tuning loss, without needing an intermediate reward model or reinforcement learning. Technically: it reparameterizes the RLHF objective so that the optimal policy can be expressed in terms of the original language model, allowing preference data to optimize the model directly via supervised learning.

The problem it solves: traditional RLHF requires (1) training a reward model on human preferences, then (2) using PPO (an RL algorithm) to optimize the LLM against that reward model. This is computationally expensive (two large networks in memory), unstable (RL training instabilities), and complex to implement. DPO eliminates both steps, reducing alignment to a supervised loss that standard training infrastructure can handle.

**Critical point for grading:** DPO does NOT eliminate human feedback. Humans still provide preference comparisons. DPO eliminates the reward model and RL training step — not the humans.

**Common wrong answer:** "DPO removes humans from the loop." Zero credit. The human comparison data is the input to DPO; the method changes the computational pipeline, not the human role.

---

## Part II: Framework Questions — Solutions

### Five Dimensions Application: Worked Example

**System analyzed:** Banking fraud detection (used as a model for student practice)

| Dimension | Analysis | Rating |
|-----------|----------|--------|
| **Uncertainty Detection** | Transaction risk score computed in real-time; high-confidence legitimate → auto-approve; high-confidence fraud → block; middle range → escalate | 5/5 |
| **Intervention Design** | "Did you spend $400 at [Merchant] in [City]? Reply YES or NO" — clear, specific, low-friction response format | 5/5 |
| **Timing** | Alert sent while transaction is in pending state, before it clears. Human response determines outcome | 5/5 |
| **Stakes Calibration** | Financial fraud → high stakes → aggressive escalation. System does not escalate $3 coffee purchases | 4/5 |
| **Feedback Integration** | YES/NO responses update user transaction profile; repeated false alarms in one category → threshold adjustment | 4/5 |

**Improvement suggestion (Stakes Calibration gap):** The system treats all users with the same threshold. A user who travels frequently internationally will receive more false alerts than a user with a stable routine — the system doesn't calibrate stakes to individual user profiles quickly enough. Personalized thresholds would reduce false positive rate without reducing detection.

---

### Three Failure Types — Quick Reference for Grading

When students analyze a case, they should identify the failure type by name. Use this table to check:

| Failure type | Mechanism | Canonical example | Student misidentifies as |
|-------------|-----------|------------------|--------------------------|
| **Overconfident silence** | System acts without asking despite uncertainty | GPS into lake, Air Canada chatbot | "Technical failure" or "the AI was broken" |
| **Alert fatigue** | System asks too often; human reviewer becomes unreliable | Hospital alarm systems, cookie banners | "Too many alerts" (correct but incomplete — must note human reliability degrades) |
| **Silent asking** | System infers an answer without telling the human or giving them a chance to respond | Nest thermostat | "The sensors were bad" (wrong — the sensors work; the design is the failure) |

---

## Part III: Case Studies — Grade Band Examples

### Netflix: Grade Band Examples

**Grade A response:**
Netflix "Are you still watching?" is a well-designed HITL intervention. On the Uncertainty Detection dimension: the system infers engagement probability from behavioral signals — absence of playback interaction, time elapsed. After 3 episodes or ~90 minutes without interaction, engagement probability drops below a threshold. On Intervention Design: the question is clear, binary, and requires minimal cognitive effort to answer. Timing: the question appears at a natural pause (episode credits) rather than mid-scene — low disruptive cost. Stakes Calibration: the stakes of being wrong are asymmetric but manageable: an engaged viewer is briefly interrupted; a disengaged viewer avoids wasted bandwidth and loses no progress. Feedback Integration: the user's response (or non-response) updates the model's understanding of their viewing patterns. The Netflix case illustrates that good HITL design is not about minimizing AI capability but about identifying the specific decision — "is anyone watching?" — where human input adds more value than AI assumption.

**Grade B response:**
Netflix asks "Are you still watching?" after a while of no interaction. It doesn't just keep playing forever because this would waste bandwidth and might annoy users who fell asleep. The five-dimension framework applies: it detects uncertainty (are you watching?), asks clearly (the button), at a reasonable time (between episodes), with appropriate stakes (low — just a pause), and it learns from answers. It's a good example of HITL because it's not invasive but it's useful.

**Grade C response:**
Netflix asks if you're still watching so it doesn't waste internet. This is human in the loop because a human has to answer. The system learned to ask after 3 episodes. It's a good design.

**No credit / incorrect response:**
"Netflix is not HITL because you don't have to answer — it will just pause." Wrong: the user's response (or timeout-based auto-pause) is the human component. The system cannot determine occupancy with certainty; the "Are you still watching?" is the uncertainty expression.

---

### Nest Thermostat: Grade Band Examples

**Grade A response:**
The Nest thermostat represents a failure of HITL at the Intervention Design level. The hardware — motion sensors, GPS geofencing — functions as designed. The system correctly formulates the question "Is anyone home?" and even attempts to answer it using sensor fusion. The failure is that when the answer is uncertain — conflicting signals, motion sensor blind spots, working-from-home patterns that violate learned schedules — the system acts on its best guess without communicating the uncertainty or providing a correction pathway. Users report returning to cold houses, finding the system switched to Away mode while they were quietly working. Many ultimately disable Home/Away Assist entirely, turning a $250 smart thermostat into a $30 programmable one. This is the "silent asking" failure: the system makes a decision that looks like asking but never actually involves the human. The fix requires no new sensors — only adding a notification ("I haven't detected activity for 2 hours in freezing weather — are you home?") that gives the user a chance to respond before the temperature changes.

**Grade B response:**
The Nest thermostat fails because it makes decisions without asking the user. It uses sensors to guess whether anyone is home, and when it guesses wrong, the house gets too cold or hot. The HITL failure is that it doesn't communicate its uncertainty — it just changes the temperature. If it sent a message saying "are you home?" before switching modes, users would trust it more. The problem isn't the sensors; it's the missing communication loop.

**Grade C response:**
The Nest thermostat has problems with its Home/Away feature because the sensors don't always detect people correctly. It's a HITL failure because it should ask the human before changing the temperature. Many users turn it off because it's unreliable.

---

### Air Canada Chatbot: Grade Band Examples

**Grade A response:**
The Air Canada case (Moffatt v. Air Canada, 2024 BCCRT 149) establishes three precedents beyond the immediate legal outcome. First: companies cannot disclaim liability for AI-generated content by treating the system as a separate entity. The "chatbot is a separate legal entity responsible for its own actions" defense was explicitly rejected — all information on a company's website is the company's responsibility. Second: the specific failure demonstrated is "confident wrongness" — the chatbot presented incorrect policy information with the same certainty it used for correct information, with no differentiation. The failure was not in being wrong (all systems err) but in lacking any mechanism to express uncertainty or escalate to a human. Third: this creates an affirmative design obligation for HITL in customer-facing information systems. A single sentence — "I believe the policy is X, but please confirm with our support team before booking" — would have changed the outcome. For HITL designers, the lesson is that Uncertainty Detection and the escalation pathway (Intervention Design) are not optional quality improvements in high-stakes information delivery — they are legally necessary elements.

**Grade B response:**
The Air Canada chatbot gave wrong information about bereavement fares and the customer relied on it, booking tickets at full price expecting a refund that the policy didn't allow. Air Canada tried to say the chatbot was a separate entity, but the tribunal ruled that companies are responsible for all information on their websites, including chatbots. For HITL, this means systems should say when they're uncertain and offer to connect with a human. The chatbot's failure wasn't being wrong — it was being confidently wrong with no way to recognize the uncertainty.

**Grade C response:**
Air Canada's chatbot gave a customer wrong information about flight refunds. The customer sued and won. The ruling said AI can't be blamed as a separate entity. This shows HITL matters because systems should tell users when they might be wrong.

---

### GPS Into Water: Grade Band Examples

**Grade A response:**
The GPS navigation failures (Buffumville Lake 2021, Honokohau Harbor 2023, Georgian Bay 2016) share a structural failure: the navigation algorithm lacks any representation of the distinction between a road and a boat launch ramp. From the graph data model, a boat ramp is a path node connected to other nodes. The algorithm follows the optimal path to destination; the physical implication — that continuing forward means entering water — is outside its operational model. The failure mode is overconfident silence: the system expresses no uncertainty, provides no sanity check, never says "this path terminates unusually." The driver, having no signal of uncertainty from the system, trusts it. The correction for graceful degradation is not sophisticated: a hard rule checking "does this route's next waypoint have coordinates over water?" with a "confirm navigation — this path may lead to water" prompt would have prevented every incident. The cost of asking (2 seconds) is comically asymmetric with the cost of not asking (submerged vehicle, potential drowning). This is the clearest possible demonstration of Stakes Calibration failure combined with absent Uncertainty Detection.

**Grade B response:**
GPS systems drove people into water because the navigation algorithm had no way to know that a boat ramp leads to water, not a road. It followed its map data confidently with no uncertainty signal. The drivers trusted the system because it expressed no doubt. HITL fix: the system should flag when a route ends at an unusual location (waterfront, dead end) and ask for confirmation. The stakes are extremely high (drowning), which makes this one of the strongest arguments for building uncertainty expression into navigation systems.

**Grade C response:**
GPS put people in danger by directing them into lakes because it followed map data without knowing about physical reality. People followed it because it sounded confident. It should have asked for confirmation.

---

## Part V: Practice Questions — Full Model Answers

### Q1 — Alert Fatigue: Full Model Answer

The phenomenon is **alert fatigue**. When a system generates more alerts than the human reviewer can meaningfully process, or generates frequent alerts for conditions that are not genuinely urgent, reviewers develop adaptive behaviors: they scan and dismiss, approve without reading, or filter by pattern rather than by content. Research in clinical decision support (CDS) systems shows that physician override rates for drug-drug interaction alerts can exceed 96% — including overrides of alerts that do indicate real clinical risk. The system has not "failed" in the mechanical sense; it is generating alerts as designed. But the human component has become unreliable. The HITL loop is broken because the "H" is no longer functioning as intended.

**Design fixes for this specific scenario (clinical CDS):**

1. **Threshold calibration:** Raise the confidence threshold so only alerts with high probability of clinical significance escalate. If 40% of records are being flagged, the threshold is far too low.

2. **Alert tiering:** Introduce severity levels. A "critical — action required" alert is visually and functionally distinct from "informational — review when possible." Physicians can triage high-severity alerts without dismissing all alerts.

3. **Actionability filter:** Research shows physicians respond better to alerts when a specific, easy action is suggested ("Consider dose reduction to X mg"). Vague alerts ("potential interaction detected") produce more overrides than actionable ones.

4. **Calibration feedback to reviewers:** Show physicians their override history and the outcome data. "You've overridden 47 alerts of this type in the past month. Of those, 3 were associated with adverse events." This converts alert fatigue back into meaningful engagement.

5. **Suppress known patterns:** If Physician A consistently overrides alerts for Drug Combination X with Patient Profile Y, the system has learned that this physician's judgment is reliable for this case type. Suppress that alert for this physician; flag it only for other physicians seeing this combination.

**Framework connection:** This is a failure of Timing (too frequent escalation) and Stakes Calibration (failure to distinguish high-stakes alerts from informational noise). Feedback Integration (dimension 5) is also broken — if reviewer behavior were being monitored, the override rate would have triggered a redesign.

---

### Q2 — Calibration vs. Accuracy: Full Model Answer

**Accuracy** is the proportion of correct predictions. A model with 90% accuracy is correct in 9 out of 10 cases on the test set.

**Calibration** is the correspondence between a model's expressed confidence levels and its observed accuracy at each confidence level. A perfectly calibrated model's predictions at the 70% confidence level are correct exactly 70% of the time; at 90% confidence, correct 90% of the time; and so on. Evaluated graphically, a well-calibrated model's calibration curve (confidence vs. accuracy) lies on the diagonal.

**Can a model be accurate but poorly calibrated?** Yes.

**Worked example:**
- Model A classifies medical images for a condition with 12% prevalence
- Overall accuracy: 94% (mainly because it correctly identifies the 88% of negative cases)
- But: when it outputs "99% confident: positive," actual accuracy is 71%
- And: when it outputs "51% confident: positive," actual accuracy is 53%
- Model A is highly accurate in aggregate; it is overconfident for its positive predictions

**Why calibration matters for HITL specifically:**
Escalation thresholds are set on confidence scores. If "95% confident" actually predicts 71% accuracy in positive predictions, a HITL system that routes cases with >95% confidence to auto-processing will auto-process cases with a 29% error rate — far above acceptable for medical use. The human reviewer is not activated for cases where they're most needed, because the model doesn't "know" it's uncertain. Calibration is not just a statistical nicety; it is the technical foundation for meaningful threshold-setting in HITL design.

---

### Q3 — Air Canada Significance: Full Model Answer

The Air Canada ruling (Moffatt v. Air Canada, 2024 BCCRT 149) is significant on three levels:

**1. Legal accountability framework:**
The ruling closes a potential loophole in AI product liability. Air Canada's defense — that the chatbot was "a separate legal entity responsible for its own actions" — would, if accepted, allow companies to deploy AI systems that make binding representations and then dislaim responsibility by attributing those representations to "the AI." The tribunal's rejection of this argument ("it should be obvious to Air Canada that it is responsible for all information on its website") establishes that AI outputs from company-deployed systems are company communications, subject to the same liability standards as any other information channel.

**2. HITL design implication — the affirmative obligation:**
If companies are liable for AI outputs, the risk calculus of deploying a system without uncertainty detection changes. The chatbot could not say "I'm not certain about this — let me connect you with a human who knows the policy." This capability would have cost almost nothing to implement (an escalation button or phrase-pattern trigger) and would have resolved the legal dispute entirely. The ruling implicitly requires that customer-facing AI systems operating in high-stakes domains (policies, legal terms, medical information, financial advice) include uncertainty expression and escalation pathways. This is not just good UX — it is a legal risk mitigation requirement.

**3. The "confidently wrong" failure mode:**
The chatbot's specific error was not that it was wrong — all systems produce errors. The error was that the wrong answer was delivered with exactly the same confidence, tone, and format as a correct answer. A customer has no way to distinguish "this chatbot is certain" from "this chatbot is guessing." The hallucination rate for AI systems in legal and policy domains is documented at 58–82% — far above any threshold at which confident delivery of information is appropriate. The chatbot's design did not reflect this limitation.

**Key quote for grading reference:** "While a chatbot has an interactive component, it is still just a part of Air Canada's website. It makes no difference whether the information comes from a static page or a chatbot." — Tribunal Member Christopher Rivers

---

### Q4 — GRPO Memory Reduction: Full Model Answer

PPO-based RLHF requires two large neural networks trained in tandem during the RL phase:

1. **The policy network** — the LLM being fine-tuned, which generates responses
2. **The critic/value network** — a separate network of comparable size that estimates V(s), the expected future reward from each state. This value function is needed to compute the advantage estimate: A(s,a) = Q(s,a) − V(s)

Both networks must reside in GPU memory simultaneously. For modern large language models, this effectively doubles the memory footprint during RL training, often requiring model parallelism and specialized infrastructure.

**GRPO's architectural change:**
GRPO eliminates the critic/value network entirely. For each training prompt, GRPO generates a *group* of K responses (typically K = 8–16). The advantage for each response is computed as:

A_i = (r_i − mean(r_1...r_K)) / std(r_1...r_K)

where r_i is the reward for response i. The group mean serves as the baseline instead of a learned value function.

This group-relative advantage estimation:
- Requires no second network (40–60% memory reduction)
- Requires no sampling from a value function (reduced computational overhead)
- Is more stable than learned value estimates because the baseline updates with each group

**Conditions:** GRPO works because it uses verifiable rewards (math, code, logic), which are deterministic and do not require a neural reward model. For tasks without verifiable rewards, GRPO's advantage calculation would need to be adapted.

**What GRPO does NOT eliminate:** The human signal. For tasks that use human preferences rather than rule-based rewards, human preference data is still needed. GRPO shifts the reward signal from a learned neural network to rule-based computation; it does not replace the normative judgment about what constitutes a good response.

---

### Q5 — Full Automation as Correct Choice: Full Model Answer

Full automation is not the absence of HITL — it is a *HITL design decision* that the task conditions favor no human involvement in individual decisions. It is the correct choice when:

**Conditions:**
1. **Volume:** Too high for per-decision human review to be feasible
2. **Stakes:** Per-decision error cost is low and errors are detectable and recoverable
3. **AI reliability:** System is well-calibrated and accurate within its operational domain
4. **Human value:** Human judgment adds little marginal value on the individual decision; human attention is better directed elsewhere (oversight, exception handling, model improvement)

**Examples:**

*Spam filtering:* Gmail processes billions of emails daily. Per-email human review is impossible. Spam moved to the spam folder has marginal cost (user checks occasionally). A missed spam has low cost (user deletes it). The auto-filter handles 99.9% of cases automatically; the user remains in the loop at the aggregate level (checking the spam folder, which trains the model) and for individual edge cases.

*Auto-formatting / linting code:* A code formatter applies deterministic formatting rules. The output is immediately visible to the developer; any error is apparent and trivially corrected with a single undo. There is no ambiguity, no uncertainty about what the correct output is, and no stakes asymmetry that would favor human review.

*ATM transaction authorization for routine amounts:* A $20 ATM withdrawal from your own bank at a location in your normal area is automatically authorized. Human review at this scale, for this risk level, adds no value. The human is in the loop for the exceptions (fraud alert, unusual amount), not the routine.

**The key conceptual point:**
Full automation within a domain is always combined with HITL at the boundaries: monitoring for model degradation, reviewing the exceptions that the system flags, updating thresholds when false positive/negative rates shift, and redesigning when the operational domain changes. "Full automation" means no human in the individual decision loop, not no human in the system at all.

**Grade A adds:** Notes that full automation requires ongoing monitoring (someone watches the false positive/negative rates over time), that the conditions are falsifiable (if any condition changes, full automation may no longer be correct), and that the human's role shifts from decision-maker to system designer and monitor.

---

### Q6 — Loan Pre-Screening (Five Dimensions): Full Model Answer

**Uncertainty Detection:**
The system outputs a credit risk score plus a confidence indicator. Applications fall into three zones: (1) high-confidence approve (score >750, confidence >90%) → auto-approve pending document verification; (2) high-confidence decline (score <580, confidence >85%) → auto-decline with regulatory-compliant explanation; (3) review zone → all applications between 580–750, all applications where confidence <70% regardless of score, and any application where the top 3 risk factors include high-variance signals (self-employment, recent major credit event, thin file). The review zone is the HITL layer.

**Intervention Design:**
The loan officer's review dashboard presents: (a) the model's recommendation and confidence score, (b) the top 3 factors driving the score with their weights, (c) the specific signals that triggered low confidence highlighted in orange, (d) 3–5 comparison cases (similar profiles that were approved/declined and their outcomes), and (e) two action buttons: "Confirm model decision" and "Override" with a required free-text reason field. The interface is designed for a 3-minute review, not a full underwriting re-evaluation.

**Timing:**
The model runs at application submission. Applications landing in the review zone are immediately queued for officer review with a 4-hour SLA. Auto-approve and auto-decline decisions complete within seconds. Officers review the queue in batches during scheduled windows. No application remains in the review queue for more than one business day.

**Stakes Calibration:**
Stakes are asymmetric and regulatory. Wrongful denials to applicants in protected classes (race, gender, religion, national origin — ECOA protected categories) carry legal and reputational risk. The system applies a secondary escalation trigger: any application where the decision outcome is statistically unusual relative to the applicant's protected-class profile is flagged for mandatory human review, regardless of confidence score. This is not a lower bar for approval — it is a lower bar for *escalation*. Additionally, application amounts above $500k trigger automatic review regardless of model confidence.

**Feedback Integration:**
Every officer override is logged with the required override reason. Monthly review identifies patterns: (a) Categories where officer override rate exceeds 15% indicate model recalibration needs; (b) Categories where override rate is <2% are candidates for raising the auto-approve threshold; (c) Outcome tracking — approved applications' repayment performance is monitored and fed back into model training annually. The system includes a "disagreement dashboard" for the model team: if officers are consistently overriding in one segment, the team investigates.

**Grading note:** The strongest answers on this question engage with the regulatory dimension (ECOA) — this demonstrates understanding that stakes calibration is not purely statistical; it includes legal, social, and ethical stakes. Award 3 bonus points for substantive engagement with regulatory requirements (credit toward the stakes dimension).

---

### Q7 — DPO vs. Constitutional AI Comparison: Full Model Answer

| Dimension | DPO | Constitutional AI (CAI) |
|-----------|-----|------------------------|
| **What human provides** | Pairwise comparisons: "Response A is better than Response B" | Principles list (the "constitution"): normative statements about what good/harmless behavior looks like |
| **When human labors** | Throughout training: thousands to millions of comparisons needed | Early (writing/refining constitution) and periodically (auditing outputs against constitutional intent) |
| **Cost per training signal** | ~$1–10/comparison (human time + annotator management) | ~$0.01/comparison (AI self-generates and evaluates against principles) |
| **What is automated** | Reward model training and RL (both replaced by DPO's supervised loss) | Per-example labeling (AI critiques its own output against principles) |
| **What is NOT automated** | The human preference comparisons themselves | Writing the constitution; reviewing systematic failures |
| **Scales well for** | Preference alignment on specific task types; moderate annotation budgets | Harmlessness training at scale; reducing annotation bottleneck |
| **Key failure mode** | Annotator inconsistency; cultural variation in "better"; label noise in subjective comparisons | Vague or conflicting principles; principles that don't transfer to edge cases; inability to audit whether principles are being correctly applied |
| **Human role type** | Evaluative (judging individual outputs) | Normative (defining values and standards) |

**Key synthesis point:**
Both methods are HITL. The human is not eliminated from either pipeline. DPO shifts human effort to individual evaluation; Constitutional AI shifts it to normative design. Constitutional AI is not "less human involvement" — it is different human involvement. Writing a good constitution is a high-skill, high-stakes task: a poorly constructed constitution will produce a model that perfectly satisfies bad principles at scale. The cost reduction ($10/sample to $0.01/sample) is real; the human responsibility is not reduced, it is concentrated earlier and at a more influential point.

**For which tasks would you choose each?**
- DPO: When you have specific preference data for a concrete task (code style, summarization quality, response helpfulness) and a budget for comparison labeling
- Constitutional AI: When harmlessness training needs to scale far beyond what human labeling can support, and when you can invest in writing high-quality principles

---

### Q8 — Essay: Confidently Wrong AI: Grade Band Examples

**Grade A sample essay:**

*The most dangerous AI system is not one that makes frequent errors — all probabilistic systems make errors. The most dangerous AI is one that cannot represent its own uncertainty, because it removes the human from the loop at exactly the moments when human judgment is most needed.*

*The GPS navigation incidents illustrate this mechanism most clearly. In Buffumville Lake (2021), Honokohau Harbor (2023), and Georgian Bay (2016), drivers followed navigation systems into water. The algorithm was doing exactly what it was designed to do: compute the optimal path through a network graph. The failure was that the graph had no representation of the physical difference between a road and a boat ramp, and the algorithm had no mechanism to say "I'm not confident in this path" as the waypoints led toward water. The system expressed certainty. The driver expressed trust. The outcomes were submerged vehicles and, in some cases, risk to life. A single sanity check — "this path terminates unusually; confirm navigation" — would have prevented every incident.*

*The Air Canada chatbot (Moffatt v. Air Canada, 2024 BCCRT 149) illustrates the same failure in an information domain. The chatbot provided incorrect bereavement fare policy information with the same confident, conversational tone it used for correct information. The failure was not the error — hallucination rates for AI systems on legal and policy questions range from 58–82%. The failure was the absence of an escalation pathway. A system with even minimal uncertainty detection would have said "I believe the policy is X, but please confirm with our support team before booking." The ruling that followed established that companies cannot disclaim responsibility for AI-generated content — implicitly requiring that customer-facing AI in high-stakes information domains include uncertainty expression and escalation design.*

*The positive contrast is medical AI in radiology. Well-designed systems don't just output a diagnosis — they output a confidence-rated diagnosis. "95% confident: fracture present" routes differently than "60% confident: possible early infiltrate." The human radiologist is activated not when the AI fails, but when the AI accurately represents its own uncertainty. The AI's uncertainty detection is the mechanism that keeps the human in the loop at exactly the right moments. The AI is more useful because it knows when it doesn't know.*

*Reward hacking in RLHF training offers a fourth illustration at the system level: a model trained on a proxy reward becomes "confident" it is behaving correctly while systematically drifting from human intent. The model cannot represent that its understanding of "good" may be gameable. The solution — RLVR, verifiable rewards, Constitutional AI — all share a common structure: replacing unchecked confidence with auditable, grounded signals.*

*The pattern across these cases is consistent: the failure is not error, but the absence of calibrated uncertainty. A system that can say "I might be wrong here" keeps the human meaningfully in the loop. A system that cannot say this removes the human from the loop precisely when the human is most needed. Calibrated uncertainty is not a limitation of AI design — it is the technical foundation of meaningful human-AI collaboration.*

---

**Grade B sample essay:**

Good AI systems should not just be accurate — they need to know when they're uncertain and tell the human. The GPS-into-lake cases show what happens when a system acts confident even when it's about to make a very dangerous mistake. The drivers trusted the GPS because nothing suggested they shouldn't. If the GPS had flagged "unusual route — please confirm," the drivers would have looked up and noticed the water.

The Air Canada case is similar: the chatbot gave wrong information about a flight refund policy. The problem wasn't being wrong — it was being confidently wrong with no way for the customer to tell. The tribunal ruled that Air Canada was responsible, which means companies now have a legal reason to build uncertainty expression into chatbots.

Medical AI shows the right approach: when the system doesn't know, it says so with a number ("60% confident"), and that number activates human review. The AI isn't failing when it expresses uncertainty — it's doing its most important job.

The claim in the essay prompt is right: confident wrongness is more dangerous than uncertain correctness. A system that admits uncertainty keeps humans in the loop. A system that doesn't removes them exactly when they're most needed.

---

**Grade C sample essay:**

The essay claim is correct. AI that doesn't know it's wrong is dangerous because humans trust it. The GPS cases show that people follow computers even into water because they seem confident. Air Canada's chatbot gave wrong information and the customer lost money. These are both examples of AI being confident when it shouldn't be. Good HITL design would make systems say when they are uncertain so humans can check. Medical AI does this by showing confidence percentages.

---

**What distinguishes grade levels:**
- **A:** Mechanism not just examples; each case connected to a HITL dimension; the positive contrast (medical AI) is used to articulate what good looks like; conclusion restates the thesis with development from the cases; precise technical vocabulary
- **B:** Correct cases and correct direction; may describe mechanism partially; conclusion present but less developed; uses some technical vocabulary
- **C:** Correct cases, correct general direction; mostly descriptive; technical vocabulary absent or imprecise; connection to HITL framework weak

---

## Part VII: Shaky Ground — Common Wrong Answers Reference

### "Human-in-the-loop vs. human-on-the-loop"

| Wrong answer | What's wrong | Correct point |
|-------------|-------------|---------------|
| "HITL means a human can intervene" | This describes on-the-loop | HITL: human is *expected* to participate; it's structural |
| "Tesla Autopilot is HITL because the driver can take over" | The driver is on-the-loop, not in-the-loop | The system operates autonomously by design; human involvement is not a designed step in each decision |
| "Any AI system with a human user is HITL" | A user and a loop participant are different things | Using Netflix to watch a show is not HITL; answering "are you still watching?" is |

---

### "Uncertainty vs. confidence"

| Wrong answer | What's wrong | Correct point |
|-------------|-------------|---------------|
| "High confidence = reliable" | Overconfident models are poorly calibrated | High confidence is only reliable if the model is well-calibrated |
| "Uncertainty sampling labels the most uncertain examples because those are the worst ones" | Not "worst" — "most informative" | The model can improve fastest by labeling cases at its decision boundary; these are not necessarily the hardest cases, just the ones where more data helps most |
| "We should never make a decision when uncertain" | This would halt most real systems | The goal is not to eliminate uncertainty but to handle it appropriately: ask for help when uncertainty is high and stakes are high; act autonomously when uncertainty is low or stakes are low |

---

### "DPO still requires human feedback"

| Wrong answer | What's wrong |
|-------------|-------------|
| "DPO removes the need for human feedback" | DPO removes the reward model and RL; it still requires pairwise human comparisons as training data |
| "DPO is unsupervised" | DPO is supervised; the supervision signal is human preference data |
| "Constitutional AI and DPO are the same thing" | DPO: supervised learning on human preferences; no RL, no reward model. CAI: two-phase process (SL + RLAIF); AI self-labels against human-written principles. Different architectures, different data, different scale properties |

---

### "Calibration ≠ accuracy" worked counterexample

**Setup for students who conflate them:**

Imagine two models evaluating whether an email is spam (30% of emails are spam):

**Model Alpha:**
- Overall accuracy: 96%
- For all predictions, outputs: confidence = 98%
- For its positive (spam) predictions: actual accuracy = 64%
- Result: Alpha is accurate on average but wildly overconfident for spam predictions; useless for threshold-setting

**Model Beta:**
- Overall accuracy: 91%
- Calibration curve follows the diagonal: 80% confidence → correct 80% of the time; 95% confidence → correct 95% of the time
- Result: Beta is less accurate overall, but you can set an escalation threshold at "confidence < 85%" and know that roughly 15% of the flagged emails are misclassified. You can reason about the system's behavior.

**For a HITL escalation system:** Beta is more useful despite lower accuracy. Calibration enables threshold reasoning; accuracy alone does not.

---

### "Constitutional AI does not eliminate human oversight"

| Wrong answer | What's wrong |
|-------------|-------------|
| "CAI means AI oversees itself" | The AI applies principles *written by humans*; the oversight is normative, not autonomous |
| "CAI means humans aren't needed" | Writing the constitution is high-stakes human work; its quality determines the quality of all downstream training |
| "CAI is cheaper so it must be worse" | Cost reduction comes from automating per-example labeling; the *normative* work (writing principles) becomes more important, not less |

---

## Quick Reference: Grading Shortcuts

### Point values by question type (suggested)

| Type | Points | Minimum for full credit |
|------|--------|------------------------|
| Cold Check Q (1–2 sentences) | 5 | Correct definition + one example with explanation |
| Short answer (2–4 sentences) | 10 | Correct phenomenon named + mechanism + design fix |
| Case analysis (single case) | 10 | 3+ dimensions applied correctly with evidence |
| Five-dimension framework application | 20 | All five dimensions + improvement suggestion |
| Compare-and-contrast | 15 | Accurate characterization of both + meaningful distinction |
| Essay (400+ words) | 20 | Thesis + 3 cases + mechanism in each + conclusion |

### The five phrases that indicate student misunderstanding

1. "The AI was just wrong" — no engagement with the design failure that allowed it to be wrong without detection
2. "Humans should always check AI output" — misses the point of calibrated automation; if humans check everything, there's no HITL design
3. "Better sensors would fix the Nest" — misidentifies hardware as the failure when the design decision is the problem
4. "DPO removes the human" — confuses architectural simplification with removal of human feedback
5. "Constitutional AI is less safe because humans aren't labeling" — misunderstands where human labor goes; writing principles is human oversight, concentrated upstream

---

*Part of the "Human in the Loop" series — Solutions Manual*
*Mirrors: HITL_Winter_is_Coming.md (student edition)*
*Instructor's notes: HITL_Winter_is_Coming_Teachers.md*
*Previous chapters: Ch1_final.md, Ch1T_updated.md, C1AM_updated.md*
