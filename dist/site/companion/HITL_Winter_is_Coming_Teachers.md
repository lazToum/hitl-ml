# Human in the Loop: Winter is Coming Edition
## Instructor's Companion

*Answer keys, grading rubrics, additional questions, pedagogical notes, and hints for every section of the student edition*

---

> **How to use this file:** Read alongside the student edition (`HITL_Winter_is_Coming.md`). The sections mirror each other. This file adds what the student edition deliberately omits: full answers, grading criteria, notes on where students typically go wrong, and extra questions for exams, quizzes, or oral assessments.

---

## Instructor Notes: The Purpose of This Edition

The Winter is Coming edition is not another summary of HITL content. It is a **metacognitive study companion** — it prompts students to notice the difference between recognizing content they've seen before and being able to produce, apply, and defend it. The structure is intentional:

- **Part I (Cold Check):** Forces active recall before re-reading. Instructors can use these as an ungraded pre-class quiz to surface gaps. Students who cannot answer Part I questions have recognized they don't know the material (which is the goal of the exercise).
- **Parts II–IV:** Progressive depth, from framework to technical detail. Build in the right order.
- **Part V (Practice Questions):** Scaffolded by type. Start with short answer if students struggle; the essay question is appropriate for upper-level or exam conditions.
- **Part VII (Shaky Ground):** The hardest conceptual distinctions. These are the most common sources of partial-credit errors on exams.

---

## Part I: Cold Check — Instructor Notes and Full Answer Keys

These questions are designed to reveal the difference between familiarity and understanding. The notes below describe what a complete answer looks like, what partial credit looks like, and what a common wrong answer looks like.

---

**Q1. What is a human-in-the-loop system?**

**Full answer:** A human-in-the-loop (HITL) system is one in which a human is a required or anticipated participant in the process of decision-making or action — typically at moments when the automated component is uncertain, when stakes are high, or when the task requires judgment that the system cannot reliably provide. It sits between full automation (no human involvement) and full manual operation (no automated component). The human's involvement is structural, not just an override option.

**Partial credit:** Answers that describe HITL as "a system that can involve humans" or "a system with a stop button" are incomplete — they describe human-*on*-the-loop or human-*out*-of-the-loop systems with override capability. The distinction that matters: HITL systems *expect and incorporate* human input as a designed element.

**Common wrong answer:** "A system that still has a human doing the work." HITL is not low automation; it is *calibrated* automation where the human fills specific, designed roles.

**Grading note:** Award partial credit for answers that correctly identify the spectrum (full auto ↔ full manual) even if they cannot define HITL precisely. Deduct if the student conflates HITL with manual work.

---

**Q2. Give two real examples of HITL you encountered today.**

**What to look for:** Two genuinely distinct examples with different HITL modes. The strongest answers name:
- The automated component
- What triggers escalation to the human
- What the human contribution is
- Which HITL mode it represents

**Weak answer to watch for:** "My phone autocorrect" is not technically HITL unless the student describes the human's role in accepting/rejecting suggestions and the feedback loop. A student who lists two features of the same device has probably not grasped the diversity of the concept.

**Grading note:** This question is intentionally open. Any defensible, specific, analyzed example is acceptable. The goal is to show that HITL is pervasive — not to identify the "right" examples.

---

**Q3. What is the difference between a system that "asks for help" and a system that "fails"?**

**Full answer:** A system that asks for help is detecting its own uncertainty and routing appropriately — this is intelligent behavior, not failure. A system that fails is one that either (a) acts on high uncertainty without recognizing it (overconfident silence), (b) crashes or produces wrong output without any indication that it was uncertain, or (c) asks when it didn't need to (false alarm). Asking for help when you don't know is the correct behavior for a well-designed system; it is a form of calibrated self-awareness, not a limitation.

**The Air Canada case is the key reference here:** the chatbot didn't fail by being wrong — it failed by being confidently wrong and providing no escalation path. The failure was the absence of uncertainty expression, not the error itself.

**Common wrong answer:** "If it asks for help it's failed because it can't do the job." This is the core misconception the field argues against. Award no credit for this answer; use it as a teaching moment.

---

**Q4. Name the five dimensions of HITL design.**

**Answer:** Uncertainty Detection | Intervention Design | Timing | Stakes Calibration | Feedback Integration

**Grading note:** All five must be present for full credit. Order does not matter. Accept reasonable paraphrases (e.g., "learning from responses" for Feedback Integration). Deduct for invented dimensions that don't exist in the framework.

---

**Q5. Why is the Nest thermostat a failure of HITL, not a failure of smart home technology?**

**Full answer:** The failure is not in occupancy detection technology — the sensors and GPS location tracking work. The failure is in the *design decision* not to communicate uncertainty and not to involve the human in the decision. The system detects presence probability and then acts autonomously, as if it were certain, without telling the user what it inferred or asking for confirmation when uncertain. Compare: if the Nest sent a message "I haven't detected motion for 2 hours and your phone shows you're away — should I switch to energy-saving mode?", it would be a good HITL system using the same sensors. The hardware isn't the problem; the intervention design and the missing communication loop are.

**Key distinction students must make:** The failure is in Intervention Design and the missing communication loop — not in the sensing layer. A student who says "the sensors are bad" has misread the case.

**Grading note:** Full credit requires naming the design failure (not asking), not just describing the outcome (house gets cold). Partial credit for correct description of the outcome without identifying the design dimension that failed.

---

**Q6. What is alert fatigue?**

**Full answer:** Alert fatigue occurs when a system generates so many alerts (especially low-quality or redundant ones) that human reviewers begin to dismiss or ignore them automatically — including alerts that are genuinely important. It is a failure of the Timing and Stakes Calibration dimensions: the system cannot distinguish between a situation that warrants interruption and one that does not, so it escalates everything; humans adapt by tuning out. This is well-documented in healthcare (clinical decision support systems) and cybersecurity (SIEM alert overload).

**Why it matters for HITL design:** Alert fatigue is the left-side failure of the Goldilocks problem. It is not neutral — it actively degrades system safety by eroding the human's reliability as a reviewer. A system that cries wolf 50 times causes the human to miss the real wolf.

**Common wrong answer:** Students sometimes confuse alert fatigue with annoyance or bad UX. It is worse than that: it degrades the entire feedback loop and makes the human component of the HITL system unreliable.

---

**Q7. What is calibration?**

**Full answer:** A model is well-calibrated if its expressed confidence correlates with its actual accuracy. If a model says "I am 80% confident" across a set of predictions, it should be correct about 80% of the time on those predictions. A model that says "90% confident" but is right only 60% of the time is overconfident and poorly calibrated. A model that says "50% confident" but is right 80% of the time is underconfident (also poorly calibrated). Calibration matters because HITL escalation thresholds are set based on confidence scores — if those scores don't mean what they claim to mean, the thresholds are meaningless.

**Grading note:** Must include the relationship between expressed confidence and actual accuracy rate. "Accurate" alone is not sufficient — a model can be highly accurate and poorly calibrated. This distinction should be tested explicitly (see Shaky Ground, Q7).

---

**Q8. What is DPO and what problem does it solve?**

**Full answer:** Direct Preference Optimization (DPO) is an LLM alignment method that converts human preference data (comparisons of model outputs) into a fine-tuning objective without requiring a separate reward model or reinforcement learning. It reparameterizes the RLHF objective so that human preferences can be used directly as a training signal. The problem it solves: traditional RLHF requires training a reward model and then using PPO-based RL to optimize against it, which is computationally expensive, memory-intensive, and unstable. DPO eliminates both steps, reducing training to a standard supervised loss. Still requires human comparison data — the human is not removed from the loop.

**Common wrong answer:** "DPO removes the need for human feedback." Wrong. DPO removes the reward model and RL step; it still requires humans to compare and rank model outputs. See Part VII of the student edition for this distinction.

---

## Part II: Frameworks — Additional Questions and Grading Notes

### Additional Questions: Five Dimensions

**AQ1.** A content moderation system flags posts for human review. Currently it reviews 35% of all posts — far more than the moderation team can handle, so reviewers are approving everything in the queue to clear it. Using the Five Dimensions, diagnose the failure and prescribe a fix.

**Answer key:**
- **Failure:** Timing and Stakes Calibration. The system escalates too broadly (high volume of low-certainty flags). Human reviewers are experiencing alert fatigue — their "approve" behavior reflects workload management, not genuine review.
- **Fix:** Raise the confidence threshold so only high-uncertainty cases or high-stakes content (potential harm, accounts with large reach) escalates. Introduce tiered review: automated for clear cases, fast-track for medium confidence, full review for high stakes. Use reviewer decisions to improve model calibration over time (Feedback Integration).
- **Note:** A student who says "hire more moderators" is solving the symptom, not the design failure. Give partial credit only.

---

**AQ2.** Rank the five dimensions in order of which, if failed, causes the most severe consequences. Defend your ranking.

**Note to instructors:** There is no single correct answer. This question assesses whether students understand the causal relationships between dimensions. Strong answers recognize that Uncertainty Detection is foundational — all other dimensions depend on the system knowing it's uncertain. A strong argument:

1. **Uncertainty Detection** — If the system can't recognize uncertainty, no other dimension can activate. This is the precondition.
2. **Stakes Calibration** — Getting this wrong means high-stakes errors are treated like low-stakes ones. The GPS-into-lake and Air Canada cases both involve stakes miscalibration.
3. **Intervention Design** — A system that knows it's uncertain and knows the stakes, but asks in an incomprehensible way, still fails.
4. **Timing** — Asking too late or too early can still cause harm, but this is recoverable more often than #1–3.
5. **Feedback Integration** — This affects long-term improvement, not immediate safety. Failure here causes gradual degradation rather than acute failure.

Award full credit for any well-defended ranking that acknowledges trade-offs. Deduct from answers that rank without reasoning.

---

**AQ3.** Can a system fail on Feedback Integration while succeeding on all other four dimensions? Give an example.

**Answer key:** Yes. A fraud detection system might have excellent uncertainty detection, well-designed interventions ("Did you make this purchase in Tokyo?"), appropriate timing (immediate SMS alert), and correctly calibrated stakes thresholds — but if users' "NO, wasn't me" responses don't improve the model's future detection (say, because the feedback loop is disconnected from the training pipeline), the system doesn't get better. It will continue to make the same errors, never learning from the human responses it collects. Long-term, this causes user trust erosion: the same transactions keep getting flagged even after the user has repeatedly confirmed their travel habits.

---

### Grading Rubric: Five Dimensions Application

Use this rubric when students apply the framework to a novel system (essay, oral exam, design challenge):

| Criterion | Full credit | Partial credit | No credit |
|-----------|-------------|----------------|-----------|
| **Completeness** | All five dimensions analyzed | 3–4 dimensions, gaps acknowledged | Fewer than 3 or no gaps flagged |
| **Accuracy** | Each dimension correctly defined and applied | Minor errors in 1 dimension | Fundamental misapplication |
| **Evidence** | Specific, observable behavior cited for each dimension | Some evidence, some assertions | All assertions, no evidence |
| **Critical judgment** | Identifies the weakest dimension and explains why | Identifies weakness without explaining mechanism | No critical evaluation |
| **Improvement** | Feasible, specific, dimension-targeted suggestion | Vague improvement suggestion | No improvement or changes unrelated to framework |

---

### Additional Questions: HITL Modes

**AQ4.** A self-driving car operates autonomously but alerts the driver to take control when it encounters situations outside its operational design domain. Which HITL mode(s) is this? What happens if the driver is not paying attention?

**Answer key:** This is primarily **Human as Exception Handler** — the system handles routine driving autonomously and escalates uncertain or edge-case situations to the human. However, effective exception handling requires the human to be *ready* to handle exceptions — a driver who has been disengaged for 20 minutes of autonomous highway driving may not be in a cognitively ready state to handle a sudden emergency. This is the "automation complacency" problem: the more reliable the automation, the less prepared the human is for the moments when they are needed. Good HITL design in this context includes the human as a **Supervisor/Monitor** simultaneously — ensuring the driver remains engaged enough to be an effective exception handler.

**Teaching moment:** The Tesla "phantom braking" incidents are a real example of this — the system's false positives create alert fatigue, drivers learn to trust the car's decisions and stop monitoring. One real emergency is then handled by an inattentive human.

---

**AQ5.** "Creative Collaborator mode is not real HITL — it is just human use of a tool." Agree or disagree. Defend your position.

**Note to instructors:** This is a deliberate provocateur question. Both positions are defensible; the goal is for students to articulate what makes HITL different from tool use.

**Strong "disagree" argument:** In Creative Collaborator mode, the system is not passive; it generates proposals, alternatives, and variations based on learned models, and the human's selections feed back into the model's understanding. The system has agency — it is not just responding to explicit commands but actively shaping possibilities. The human's judgment drives direction; the system's generation expands the possibility space. This is structurally different from using a word processor or brush.

**Strong "agree" argument:** If the system generates outputs and the human selects from them without any feedback integration, this is tool use — the human is in control and the system is a very sophisticated instrument. True Creative Collaborator mode requires that the human's choices influence future generation. Without feedback integration, it is a powerful tool, not a collaborator.

**Grading note:** Award full credit for either position if the student's argument identifies what distinguishes HITL from tool use (feedback integration, system agency, mutual influence). Deduct from answers that don't engage with the distinction.

---

## Part III: Case Studies — Additional Questions

### Additional Case Study Questions

**AQ6.** The Air Canada tribunal rejected the defense that the chatbot was "a separate legal entity." What would have had to be true about the chatbot's design for that defense to have been reasonable?

**Answer key:** The defense would only be reasonable if the chatbot had been designed as a genuinely autonomous agent — with its own legal existence, contractual authority, audit trail, and accountability mechanisms. In practice, this doesn't exist. The chatbot was a software component on Air Canada's website, trained on (or supposed to be trained on) Air Canada's policies, deployed by Air Canada, and branded as an Air Canada service. The "separate entity" argument was an attempt to use the novelty of AI to escape product liability that applies to any website information. For the argument to hold, the chatbot would need something like: its own legal personhood, its own insurance, the ability to be sued independently, and the ability to be held to commitments it makes — none of which existed. The ruling correctly applied the same standard as any other company communication.

**Why this matters for HITL design:** The ruling implies an affirmative obligation: if companies cannot disclaim liability for AI output, they must ensure the AI either (a) is reliably accurate or (b) knows when to escalate and says so.

---

**AQ7.** The GPS-into-lake cases all involved following navigation onto boat launch ramps. Why is this the kind of edge case that requires human judgment, and what would "graceful degradation" look like here?

**Answer key:** The GPS algorithm's operational domain is road navigation. A boat launch is not a road — it terminates in water and is designed for vehicles that float. The algorithm has no representation of this distinction; from its data model, it's just a path that connects to another road (on the far side of the water). The algorithm is confident because it is doing exactly what it was trained to do: follow the network graph. But the physical reality is outside its training distribution.

Human judgment would recognize: the path slopes toward water, there are no guard rails, there is a sign that says "Boat Launch," other cars are stopping. These are signals the algorithm either lacks sensors for or has no representation of.

**Graceful degradation:** The system should have said "Recalculating — I've lost confidence in this route" when the path terminated unusually, or flagged "unusual road type — proceed with caution" when the road type in the map data matched "boat ramp." Alternatively, a hard safety rule: "This path leads to water within X meters — confirm navigation." The cost of asking (2-second delay) vs. the cost of not asking (submerged car) is an extreme Stakes Calibration argument for asking.

---

**AQ8.** Compare the Amazon Echo dollhouse incident and the Google Home Super Bowl incident. Both are activation failures, but they fail in different ways. What is the key structural difference?

**Answer key:** Both involve false activations, but:

- **Amazon Echo:** The failure is in **intent recognition** — a 6-year-old's play conversation ("can you get me a dollhouse?") was classified as a purchase intent. The system could not distinguish between a casual conversational mention and an actionable command from an authorized adult. Failure mode: context blindness (who is speaking? what is the communicative register?).

- **Google Home Super Bowl:** The failure is in **source recognition** — the device responded to audio from a television broadcast as if it were a direct user command. The system could not distinguish "someone is speaking to me" from "I am hearing speech in my environment that is not directed at me." Failure mode: spatial/intentional context blindness (who is the intended recipient of this speech?).

**The structural difference:** Alexa's failure is about understanding user intent within a direct interaction. Google Home's failure is about determining whether an interaction is happening at all. These require different solutions: Alexa needs better intent classification; Google Home needs better speaker/source discrimination and context awareness.

---

### Additional Case Study: Medical AI Radiology

**AQ9.** A radiology AI system reports confidence scores with each diagnosis. A study finds that the system's reported confidence of 95% corresponds to 78% actual accuracy. What is this phenomenon called, what are its consequences for HITL design, and how would you fix it?

**Answer key:** This is **overconfidence** — the system is poorly calibrated, specifically systematically overestimating its confidence. The reported 95% is not a reliable trigger for high-confidence auto-processing.

**Consequences for HITL:** Escalation thresholds that should route cases to specialist review are not triggering when they should. Cases where the system "knows" it's right at 95% are actually wrong 22% of the time — far above the threshold at which a radiologist would want to review. Patients are receiving incorrect diagnoses that were considered high-confidence automated outputs.

**Fix:**
1. **Calibration post-processing:** Apply temperature scaling or Platt scaling to re-calibrate the confidence scores. This doesn't change the model's predictions — it rescales confidence outputs to match observed accuracy.
2. **Calibration evaluation:** Routinely plot confidence vs. accuracy on a held-out dataset. A well-calibrated model's calibration curve follows the diagonal.
3. **Conservative threshold adjustment:** Until recalibrated, set escalation threshold at 85% reported confidence instead of 95% (compensating for observed overconfidence).
4. **Feedback integration:** Use radiologist review decisions to continuously monitor and update calibration.

**Grading note:** Full credit requires defining the problem (overconfidence/miscalibration), connecting it to HITL consequences (wrong thresholds), and proposing a specific fix. "Make the model more accurate" is not a calibration fix.

---

## Part IV: Technical Layer — Additional Questions and Grading Notes

### Active Learning — Additional Questions

**AQ10.** You are building an active learning pipeline for a medical image classification task. Your oracle (the human labeler) is an expensive specialist ($200/hour, annotating 10 images/hour). Your unlabeled pool has 10,000 images. Your current model has 82% accuracy with 500 labeled examples. Design the querying strategy and justify your choices.

**Answer key:** This is an open-ended design question. A strong answer addresses:

1. **Query strategy:** BADGE (gradient embedding diversity + uncertainty) is state-of-the-art for deep learning on medical images. Alternatively, uncertainty sampling is computationally cheaper and often competitive. Given the high oracle cost, the argument for BADGE is strong: each label costs ~$20 ($200/hr ÷ 10/hr), so maximizing information per label is critical.

2. **Batch size:** Select batches of ~20 images per round (1 hour of specialist time). Diverse batches (BADGE/k-means++) reduce redundancy within the batch.

3. **Stopping criteria:** Define accuracy target (e.g., 95%) and confidence interval. Include a plateau check: if accuracy improvement from one round to the next drops below 0.5%, stop labeling.

4. **Calibration:** After each round, check calibration — not just accuracy. A well-calibrated model's escalation thresholds will be meaningful.

5. **Stakes consideration:** For medical imaging, the asymmetry of false negatives (missed diagnosis) vs. false positives (unnecessary follow-up) may favor selecting cases where the model is most uncertain AND where the cost of being wrong is highest.

**Grading note:** Award full credit for any strategy that addresses: query strategy choice and justification, batch size, stopping criteria, and stakes consideration. Deduct from answers that simply say "use uncertainty sampling" without engaging with the cost structure.

---

**AQ11.** "Active learning assumes the oracle is always right. What happens when the oracle is wrong, and how should the pipeline handle it?"

**Answer key:** Active learning typically assumes oracle correctness. When this fails:

- **Noisy labels:** If the oracle is wrong some percentage of the time, the model learns from corrupted data. This is especially harmful for uncertain cases (the ones active learning prioritizes) — these are often the hardest for the oracle too, so oracle errors cluster in exactly the most-queried region.

- **Mitigation strategies:**
  1. **Multiple oracles:** For uncertain cases, ask multiple labelers and take the majority. Disagreement = flag for expert review.
  2. **Confidence-weighted learning:** Downweight labels from queries where oracle agreement was low.
  3. **Learning with label noise:** Methods like SEAL or co-learning can estimate and compensate for systematic oracle errors.
  4. **Escalation within the oracle:** Have a tiered oracle — general annotators handle clear cases, domain specialists handle uncertain ones. High disagreement triggers specialist review.

- **HITL implication:** The quality of the human component limits the quality of the active learning pipeline. "Human in the loop" doesn't mean "human is correct" — it means "human judgment is the best available signal, used where it adds most value."

---

### LLM Alignment — Additional Questions

**AQ12.** Constitutional AI claims to reduce annotation cost from ~$1–10/sample to <$0.01. Where does the human labor go, and where does it disappear?

**Answer key:**

**Where it goes:**
- Writing the constitution (the list of principles). This is high-skill, high-stakes work — the principles must be clear, comprehensive, non-contradictory, and culturally appropriate. A single principle ("don't be harmful") is too vague; principles must be specific enough for an AI to apply them as a self-critique rubric. This work requires expert human judgment and is not eliminated.
- Reviewing constitutional outputs for systematic failures. If the AI self-critique produces bad revisions, this reflects a gap in the constitution — humans must identify and patch it.
- Validating that the constitution matches intended values at deployment.

**Where it disappears:**
- The large-scale annotation of individual model outputs. Instead of having humans label thousands of (better/worse) pairs, the AI generates its own comparisons by applying constitutional principles. This is the $0.01 part.

**Key insight:** Constitutional AI shifts human labor from repetitive labeling to normative design. The cost reduction is real, but the human responsibility doesn't disappear — it shifts to a different kind of work (writing good principles rather than judging individual outputs). Errors in the constitution propagate at scale.

---

**AQ13.** GRPO uses "verifiable rewards." What kinds of tasks can use verifiable rewards, and what kinds cannot? What does this mean for human oversight?

**Answer key:**

**Can use verifiable rewards (correctness is deterministic or rule-based):**
- Mathematical reasoning (answer is correct or incorrect)
- Code generation (code compiles and passes unit tests or doesn't)
- Formal logic puzzles (provably correct)
- Structured output format compliance (valid JSON, correct schema)
- Game playing (win/loss)

**Cannot use verifiable rewards (correctness requires judgment):**
- Writing quality, style, creativity
- Ethical judgment in ambiguous situations
- Helpfulness in subjective contexts
- Nuanced factual claims with no ground truth
- Open-ended generation where multiple answers are valid

**Implications for human oversight:** GRPO reduces human involvement for verifiable tasks — the reward signal is deterministic, so human preference labeling is less necessary. But it is *only* applicable to tasks with objective ground truth. For the majority of production LLM tasks (conversational helpfulness, creative writing, nuanced assistance), human feedback remains necessary. GRPO is a powerful tool for a specific subset of alignment; it does not generalize to eliminating human oversight.

**Common wrong answer:** "GRPO removes the need for human feedback entirely." Award no credit. GRPO replaces learned reward models with rule-based signals — this requires that the task have verifiable outcomes, which is a strong precondition.

---

## Part V: Practice Questions — Full Answer Keys and Grading Notes

### Q1 — Alert Fatigue

**Full model answer:**

The phenomenon is **alert fatigue** — when overexposure to alerts causes reviewers to stop processing them meaningfully. This has been extensively documented in clinical settings; studies on hospital alarm systems found that physicians override up to 96% of drug-drug interaction alerts, which means meaningful alerts are ignored at the same rate as noise.

**Design fixes (any two of the following for full credit):**
1. **Raise the confidence threshold:** Only escalate cases above a higher confidence-of-risk threshold. Reduces volume; each alert is more likely to be meaningful.
2. **Tier alerts by severity:** A "flag for review" is different from "urgent: block and review now." Humans should be able to triage without opening each case.
3. **Show calibration data to reviewers:** If reviewers can see "alerts at this confidence level are real 60% of the time," they can prioritize accordingly.
4. **Track and show reviewer override rates:** If 95% of alerts in a category are being approved without change, the model needs recalibration for that category.
5. **Reduce alert volume by improving model quality:** Better uncertainty detection reduces false escalations.

**Grading rubric:**
| Component | Points |
|-----------|--------|
| Correct naming of phenomenon | 2 |
| Accurate description of mechanism (not just "too many alerts" but also "degrades reliability of human responses") | 3 |
| At least two specific, actionable design changes | 3 |
| Connection to HITL framework (which dimension failed) | 2 |
| **Total** | **10** |

---

### Q2 — Calibration vs. Accuracy

**Full model answer:**

**Accuracy** measures the proportion of predictions that are correct. A model with 90% accuracy is right 9 times out of 10 on average.

**Calibration** measures whether the model's expressed confidence level matches its actual accuracy at that confidence level. A well-calibrated model where 80% of predictions are labeled "80% confident" should be correct exactly 80% of the time on those predictions.

**Can a model be accurate but poorly calibrated? Yes.**

Example: A model that classifies medical images is correct 93% of the time overall. But for every prediction, it outputs "99% confident." On cases where it says 99%, it is actually correct only 85% of the time. The model is accurate, but overconfident — poorly calibrated.

**Why calibration matters for HITL:** Escalation thresholds are set on confidence scores. If "90% confident" actually means "correct 70% of the time," then cases above the threshold will have many more errors than expected, and the threshold no longer serves its purpose. Human reviewers will be presented with cases the model thought were clear that are in fact uncertain — or, conversely, uncertain cases will not be escalated because the model's expressed uncertainty is systematically too low.

**Grading rubric:**
| Component | Points |
|-----------|--------|
| Correct definition of accuracy | 2 |
| Correct definition of calibration (must include "expressed confidence vs. actual accuracy") | 3 |
| Correct yes + valid example | 3 |
| Explanation of why it matters for HITL (threshold implications) | 2 |
| **Total** | **10** |

---

### Q3 — Air Canada Significance

**Full model answer:**

Beyond the specific legal outcome ($812 for one passenger), the ruling has three broader implications:

1. **Legal accountability:** Companies cannot use the novelty of AI to escape standard product liability. The ruling closes a potential loophole where organizations might deploy chatbots that make binding representations and then disclaim responsibility by attributing them to "the AI." Any information on a company's customer-facing systems, human or AI-generated, is the company's responsibility.

2. **HITL design implication:** The ruling creates an affirmative obligation for uncertainty detection and escalation design. A system that cannot say "I'm not certain — let me connect you with a human who knows the policy" is now legally problematic in high-stakes information delivery contexts (insurance, legal, medical, financial, policy). This shifts the incentive: it is no longer just good UX to build escalation paths — it is potentially a legal requirement.

3. **The "confident wrong" failure mode:** The chatbot's actual error was not the wrong answer per se — it was that the wrong answer was delivered with the same confidence and tone as a correct one. A system with calibrated uncertainty would have said "I believe the policy is X, but please confirm with our support team before booking." That one sentence would have defeated the entire lawsuit.

**Grading rubric:**
| Component | Points |
|-----------|--------|
| Legal accountability principle | 3 |
| HITL design implication (what it requires of designers) | 3 |
| The specific failure mode illustrated (confident wrong, no escalation) | 3 |
| Quality of writing and argument | 1 |
| **Total** | **10** |

---

### Q4 — GRPO Memory Reduction

**Full model answer:**

PPO-based RLHF requires two large neural networks during training: (1) the policy network (the LLM being trained) and (2) a critic/value network of comparable size that estimates the expected future reward from each state. Both must reside in GPU memory simultaneously during training. For large LLMs, this doubles the memory footprint during the RL phase.

GRPO eliminates the critic/value network entirely. Instead of learning a value function to estimate baseline reward, GRPO generates multiple responses (a "group") to the same prompt and uses the mean reward of the group as the baseline. The advantage for each response is its reward minus the group mean — a relative comparison that requires no trained critic.

Without the value network, memory requirements drop by approximately 40–60% depending on model size and implementation, enabling GRPO to train larger models on the same hardware or train existing model sizes more efficiently.

**Grading note:** Full credit requires identifying *what* is eliminated (the critic/value network) and *how* the baseline is computed instead (group-relative mean reward). Award partial credit for "removes the reward model" — this confuses GRPO with DPO; GRPO still uses a reward signal (verifiable or otherwise), it eliminates the *value function estimator*, not the reward signal.

---

### Q5 — Full Automation as Correct Choice

**Full model answer:**

Full automation is the correct HITL design choice when:
1. Volume is too high for meaningful human review of individual cases
2. Stakes per individual error are low and errors are detectable/recoverable
3. Human judgment adds marginal value beyond what the automated system provides
4. The system's accuracy is high and well-calibrated in its operational domain
5. Human attention is more valuable applied elsewhere

**Example 1:** ATM cash dispensing. Routine withdrawals are fully automated. The human is in the loop only in exception cases (suspected fraud, unusual amount, card skimmer detection). Automating routine transactions lets human oversight concentrate on the edge cases where it matters.

**Example 2:** Auto-formatting code (linters, formatters). The output is immediately visible to the developer; any error is immediately apparent and trivially corrected. Stakes per decision are minimal. Human judgment adds nothing — the developer can see the result.

**The key insight:** Full automation is a HITL design choice, not the absence of HITL. Deciding where automation ends and human involvement begins is itself the HITL design decision. A well-designed system may automate 99.9% of transactions and route the 0.1% edge cases to humans — this is better HITL design than routing 20% to humans (alert fatigue) or 0% (no oversight).

**Common wrong answer:** "When the AI is perfect." This misunderstands both AI capabilities and HITL. No system is perfect; full automation means the error rate and consequences are acceptable without human review, not that errors don't exist.

---

### Q6 — Loan Pre-Screening Case Analysis

**Full model answer (structured by dimension):**

**Uncertainty Detection:** The system outputs a credit risk score AND a confidence score. Score ranges: clear approve (>750, high confidence), clear deny (<580, high confidence), review zone (580–750, or any score with low confidence). Applications with competing signals (high income + short credit history + unusual employment type) are flagged regardless of score.

**Intervention Design:** The escalation dashboard presents: (1) the model's recommendation and confidence, (2) the top 3 factors driving the score and their weights, (3) the specific data points that triggered low confidence (e.g., "self-employed income — high variability"), (4) comparison to similar approved/denied applications. Loan officer sees a decision support interface, not a binary flag. Interface includes "defer to model" vs. "override" with required override reason (captured for feedback integration).

**Timing:** Pre-screening runs at application submission. Human review is triggered at submission — officer has a 4-hour SLA to review escalated applications. The system does not wait for human input on clear cases; it waits on escalated cases before proceeding.

**Stakes Calibration:** Regulatory compliance (Equal Credit Opportunity Act, ECOA) introduces asymmetric stakes: wrongful denials on protected class grounds carry high legal and reputational risk. The escalation threshold is set lower for applicants in regulated categories (not lower qualification standards — lower confidence threshold for escalation). The system explicitly flags "this decision is statistically unusual for applicants with this demographic profile" as a secondary escalation trigger.

**Feedback Integration:** Officer override decisions are logged with reasons. Monthly calibration review: which officer reasons most commonly contradict the model? Model is retrained quarterly on accumulated officer decisions. Persistent override patterns in specific loan categories trigger model retraining on those categories.

**Grading rubric:**
| Component | Points |
|-----------|--------|
| All five dimensions addressed | 10 (2 per dimension) |
| Correct application (not just named, but accurately described for this context) | 5 |
| Legal/regulatory consideration (ECOA, stakes asymmetry) | 3 |
| Feasibility and specificity of design choices | 2 |
| **Total** | **20** |

---

### Q7 — DPO vs. Constitutional AI

**Full model answer:**

| | DPO | Constitutional AI |
|-|-----|------------------|
| **Human role** | Comparison labeling: which output is better? Requires direct human evaluation of model outputs | Writing principles: defining what "better" means. Requires normative judgment, not output evaluation |
| **When human labors** | At scale, throughout training (thousands of comparisons) | Early, in design phase (writing the constitution); later, in error correction (patching gaps) |
| **Cost per data point** | ~$1–10/comparison (human time) | ~$0.01/comparison (AI self-labels against principles) |
| **What scales** | Preference data collection (bottleneck: human labelers) | Harmlessness training (AI can generate millions of self-critiques) |
| **Key dependency** | Quality of human comparisons; human annotators must be consistent | Quality of the constitution; weak principles produce weak training |
| **Can fail by** | Annotator disagreement, cultural variation in what "better" means | Bad principles, principles that are too vague to apply, principles that conflict |
| **Human oversight level** | High per-example, lower normative | Low per-example, higher normative |

**Key distinction:** In DPO, humans evaluate individual outputs. In Constitutional AI, humans define values. Both require humans; they require different *kinds* of human involvement. Constitutional AI doesn't "automate" alignment — it automates a step (generating preference pairs) that was previously done by humans, while shifting human effort to the normative design layer. For a course focused on HITL, both are HITL systems; they differ in how and when the loop closes.

---

### Q8 — Essay: "The Most Dangerous AI..."

**Instructor grading guide:**

**What a full-credit essay includes:**

*Thesis:* States clearly that the claim is about calibration and self-knowledge, not error rate. Dangerous AI is AI that cannot represent its own uncertainty — not AI that makes errors. (All AI makes errors.)

*Case 1 — Minimum requirement:* GPS navigation. Describes the mechanism (no contextual sanity check, no uncertainty expression) and the consequence (driver defers to expressed certainty, drives into water). Connects to HITL: no uncertainty detection → no escalation → no human in the loop when human is most needed.

*Case 2 — Minimum requirement:* Air Canada chatbot. Describes the "confidently wrong" failure. Connects to legal consequence. Notes the design fix (escalation path with expressed uncertainty) and why it wasn't present.

*Case 3 — Minimum requirement:* One of: medical AI (positive example of calibrated uncertainty), reward hacking (AI confident it's maximizing a proxy objective), or Nest thermostat ("silent asking" — acts on certainty it hasn't expressed). Strong essays use the medical AI as a contrast case showing what good looks like.

*Conclusion:* Returns to the thesis with a sharper restatement: calibrated uncertainty is the technical foundation for meaningful human collaboration. The claim in the essay title is not just rhetorical — it is a design principle.

**Grading rubric (20 points):**

| Component | Points |
|-----------|--------|
| Clear thesis that goes beyond "errors are bad" | 3 |
| Case 1: GPS — mechanism, consequence, HITL connection | 3 |
| Case 2: Air Canada — mechanism, consequence, HITL connection | 3 |
| Case 3: Any third case, correctly analyzed | 3 |
| Cases are connected to each other, not just listed | 2 |
| Technical language used correctly (calibration, uncertainty detection, escalation) | 2 |
| Conclusion restates claim with development from the cases | 2 |
| Writing quality and structure | 2 |
| **Total** | **20** |

**Common failure modes:**
- Essay describes three failures without connecting them to the mechanism (confident wrongness, no uncertainty detection). Treat as descriptive, not analytical.
- Essay uses cases from pop culture not covered in the course without connecting to HITL framework. Award case points only if HITL analysis is present.
- Essay misidentifies GPS-into-lake as "user error." Partial credit only — the design failure is in stakes calibration (no sanity check) and uncertainty detection (no expression of doubt).

---

## Part VI: Night Before — Instructor Notes

**How to use this in class:** The Night Before sheet is a single-page condensed reference. Use it as:
- A 5-minute quiz prompt: Cover the right column; students complete from memory
- A lecture warm-up: "Before I start, who can reconstruct the failure taxonomy without looking?"
- A calibration check: What does each student struggle to produce without looking?

**What to add for your course:**
If your course covers topics not in the student edition (e.g., specific regulatory frameworks, additional alignment methods, domain-specific HITL applications), add them to the Night Before sheet for your course. The student edition covers the core of the book's first chapter and the state-of-the-art summary; course-specific content needs course-specific additions.

---

## Part VII: Shaky Ground — Teaching Notes

These are the distinctions most likely to produce partial-credit errors on exams. They appear simple but reliably trip up students who have read the material without deeply processing it.

### "Human-in-the-loop vs. human-on-the-loop vs. human-out-of-the-loop"

**Where students go wrong:** Conflating "human can intervene" with "human is in the loop." Many systems allow human intervention as an override but are designed to operate without it — this is human-on-the-loop. In true HITL, the human's input is a designed, expected, structural part of the process.

**Classroom exercise:** Ask students to classify:
- ATM transaction (out — fully automated, human is a user not a decision-maker)
- Fraud alert SMS requiring response (in — human response is a required step)
- Tesla Autopilot with driver available (on — driver can intervene but system doesn't require it)
- Nest thermostat with manual override app (on — human can change it but this isn't designed into the decision loop)

---

### "Uncertainty vs. Confidence"

**Where students go wrong:** Using the terms interchangeably, or treating high confidence as "good" without asking whether it's calibrated. The exam will test whether students understand that a system can be confidently wrong.

**Teaching prompt:** "A model outputs 'confidence: 97%.' What two things do you need to know to decide whether to trust this number?" (1) What does 97% mean in this model's output space? (2) Is the model calibrated — does 97% confidence correspond to ~97% actual accuracy?)

---

### "DPO still requires human feedback"

**Where students go wrong:** Reading "DPO eliminates the reward model and RL" as "DPO eliminates the human." This is incorrect. DPO requires human comparison data; it eliminates the intermediate computational step (reward model training + PPO). The human loop is intact; the architecture of the pipeline changes.

**Mnemonic:** DPO = Direct Preference Optimization. "Preference" = human comparison. Still there.

---

### "Constitutional AI shifts, not eliminates, human oversight"

**Where students go wrong:** "AI labels itself so no human needed." Incorrect. The constitution is human-authored. Its quality determines the quality of all downstream self-labeling. A poorly written constitution produces a model that is good at satisfying the letter of bad principles. The human's role is concentrated at the normative design stage; this is higher-stakes than per-example labeling, not lower.

**Discussion prompt:** "If Constitutional AI produces training at $0.01/sample instead of $5/sample, where do the savings come from, and what does this imply about where errors will concentrate?"

---

### "Calibration ≠ Accuracy"

**Where students go wrong:** Assuming accuracy implies calibration, or confusing "the model is usually right" with "the model knows when it's right."

**Quick test question:** "Model A is correct 94% of the time and outputs confidence: 99% for all predictions. Model B is correct 89% of the time but its 90%-confidence predictions are correct 90% of the time, 70%-confidence predictions correct 70% of the time, etc. Which model would you rather use for a HITL escalation system, and why?"

**Answer:** Model B, because its confidence scores are meaningful — you can set a threshold and know what it predicts. Model A's 99% confidence is uninformative; you cannot distinguish cases where it's certain from cases where it's guessing.

---

## Additional Exam Questions Bank

*These questions do not appear in the student edition. Use for in-class quizzes, oral exams, or additional exam questions.*

### Short Answer

**E1.** What is the difference between aleatoric uncertainty and epistemic uncertainty? Give one HITL example of each.

*Answer hint:* Aleatoric = irreducible uncertainty from randomness in the world (e.g., image is too blurry to read regardless of model quality). Epistemic = uncertainty from lack of model knowledge (e.g., model hasn't seen this type of image before; more data could fix it). HITL relevance: epistemic uncertainty can be resolved by querying the human and adding their label to training data. Aleatoric uncertainty cannot — the human should be routed the case, but more data won't eliminate the noise source.

---

**E2.** A healthcare company argues: "Our AI diagnostic tool is more accurate than the average radiologist, so human review is redundant." What is wrong with this argument? What would make it correct?

*Answer hint:* Accuracy is not the only dimension. Even a more accurate system can (1) have different error patterns than humans, meaning combined human+AI outperforms either alone; (2) be poorly calibrated, making escalation thresholds meaningless; (3) lack uncertainty detection, meaning errors cannot be surfaced; (4) face distribution shift (deployed in contexts different from training). The argument becomes defensible only if: accuracy is higher, errors don't correlate with the cases humans would catch, calibration is demonstrated, and the deployment context matches training distribution — which is a very high bar.

---

**E3.** What is the "automation complacency" problem, and why is it a HITL design problem, not just a user behavior problem?

*Answer hint:* Automation complacency: as systems become more reliable, human operators disengage from monitoring, becoming less capable of handling exceptions. The framing of "user behavior" is incomplete — the system design created the conditions for complacency. Good HITL design maintains human engagement through monitoring requirements, periodic checkpoints, occasional simulated exceptions, or interface design that requires active confirmation rather than passive observation. Exception Handler mode only works if the human is ready to handle exceptions; the system design must keep them ready.

---

**E4.** "Feedback integration means storing user responses." Agree or disagree.

*Answer hint:* Disagree. Storing is a prerequisite, not feedback integration. Feedback integration means using stored responses to update the system's behavior — retraining models, adjusting thresholds, improving calibration. A system that logs "user said NO to this fraud alert" but never uses those logs to improve future fraud detection has data, not feedback integration. The integration is the closing of the loop.

---

### Design Question

**E5.** Design a HITL system for automated driving license exam evaluation (scoring practical driving tests via AI-analyzed dashcam footage). Address all five dimensions.

*Answer hint for instructors:* Strong answers note the asymmetric stakes (falsely passing an unsafe driver > falsely failing a safe one), the legal/regulatory requirements for human sign-off on official decisions, the need for explainable escalation ("camera angle unclear at minute 2:34"), and the specific challenge that human examiners may overweight first impressions — so feedback integration must compensate for systematic evaluator biases, not just incorporate them.

---

### Essay

**E6.** "Human-in-the-loop is not a safety net for bad AI — it is a design philosophy for good AI." Evaluate this claim.

*Answer hint:* The "safety net" framing implies: (1) AI is the primary system, (2) human involvement is a backup for AI failure, (3) as AI improves, HITL becomes less necessary. The "design philosophy" framing implies: (1) human and AI are co-designed together, (2) humans are not a fallback but a designed component for specific tasks they do better, (3) HITL evolves as the system evolves (humans do different things as AI capabilities change). Strong essays draw on the Feedback Integration dimension (human responses improve the AI over time, making the human not just a corrector but a trainer), the difference between oversight and collaboration, and the Air Canada case (which shows that even highly capable AI systems have failure modes where human judgment is structurally irreplaceable).

---

## Using This Edition in Different Contexts

### Seminar setting
Run Part I as a 10-minute cold-write at the start of class. Have students exchange papers and try to improve each other's answers before discussion. Surface the gaps publicly.

### Large lecture
Use the "Shaky Ground" distinctions as clicker/poll questions. "Model A is 90% accurate. Model B is 85% accurate but well-calibrated. For a HITL escalation system, which do you choose?" — Use the poll results to drive the explanation.

### Oral examination
Part VII is the best source of oral exam questions. Ask: "Explain the distinction between alert fatigue and overconfident silence as if the examiner has never heard of HITL." Look for: ability to give original examples (not just the ones in the book), ability to describe the mechanism, ability to connect to a HITL dimension.

### Capstone/project assessment
Use Question Q6 (loan pre-screening) as a design prompt with a different domain (hospital triage, visa processing, content moderation). The structure of the answer should transfer even with a different domain.

---

*Part of the "Human in the Loop" series — Instructor's Edition*
*Mirrors: HITL_Winter_is_Coming.md (student edition)*
*Previous chapters: Ch1T_updated.md, C1AM_updated.md*
