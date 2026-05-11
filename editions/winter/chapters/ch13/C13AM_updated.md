# Chapter 13 Solutions Guide: The Psychology of Human-AI Teams

*Model answers, grading guidance, and worked solutions*

---

## Discussion Question Solutions

### Introductory Level

#### Q1: The Automation Paradox — Personal Examples
**Model Answer:**

Strong student answers will identify a technology where reliance has eroded an underlying skill, and connect this structure to Air France 447. Examples and their connections:

**GPS navigation:** Many people can no longer navigate by landmarks or maps in cities they visit regularly. If GPS fails in an unfamiliar area (the equivalent of sensor failure in AF447), the driver has no backup capability. Connection: highly reliable automation + skill atrophy = vulnerability at the moment of failure.

**Calculators/spreadsheets:** Students who have relied on calculators since childhood may be unable to estimate whether a calculated answer is plausible. When the tool produces an error (formula error, wrong input), they lack the mental arithmetic to catch it. Connection: automation that handles the cognitive task reliably prevents development of the skill to audit its outputs.

**Autocorrect:** Writers who have relied heavily on spelling autocorrect have typically not maintained their proofreading attention to detail. When autocorrect makes a contextually correct but semantically wrong substitution, they miss it.

**The AF447 connection requires:**
- Identifying that the skill was present before automation deployment
- Understanding that the skill eroded specifically because the automation was so reliable
- Recognizing that the erosion was rational (why practice what you don't need?) but created brittleness

**Grading:**
- **Excellent:** Vivid personal example with clear mechanism (skill atrophy under high reliability), explicit structural connection to AF447
- **Good:** Relevant example, correct mechanism, basic AF447 connection
- **Satisfactory:** Example without mechanism, or mechanism without AF447 connection
- **Needs Improvement:** Only lists technology without identifying skill atrophy

---

#### Q2: Why Instructions Don't Work
**Model Answer:**

Instructions targeting conscious intention cannot counteract automation bias because the bias operates at the level of **attention allocation** — a process that largely occurs before conscious deliberation.

The sequence of events in reviewing a case:
1. Case is presented
2. AI recommendation is visible (or isn't)
3. Brain allocates attention to processing the case
4. Decision process runs
5. Response is made

When a recommendation is present, step 3 is altered: the recommendation satisfies the brain's drive toward decision completion, so less attentional resources are directed at active processing of the case itself. The reviewer doesn't consciously decide to defer — the cognitive work of active processing is simply initiated to a lesser degree.

An instruction to "apply independent judgment" targets step 4 (conscious deliberation). But the damage is done at step 3. By the time the instruction would have effect, the evidence accumulation is already shallower.

**What would work:**
- Preventing the recommendation from appearing until step 3–4 is substantially complete (sequential design — human decision first)
- Structurally requiring the reviewer to generate their own assessment (writing a brief reason) before the recommendation is displayed
- Making the recommendation harder to perceive (smaller font, require active uncovering) so it has less automatic impact on attention

The research evidence: Skitka et al. (1999) gave explicit independence instructions. Automation bias persisted. This is the experimental proof that instruction alone is insufficient.

---

#### Q3: Fatigue Design for Content Moderation
**Model Answer:**

A well-designed 8-hour shift for content moderation reviewers:

**Structure:**
- **Hours 1–2:** Most difficult, judgment-intensive cases (highest d', lowest fatigue)
- **Hour 2–2.5:** Mandatory 15-minute break with genuine cognitive disengagement (not a bathroom break while thinking about cases)
- **Hours 2.5–4:** Medium-difficulty cases; some judgment-intensive cases for experienced reviewers if queue demands
- **Hour 4–4.5:** Second mandatory break
- **Hours 4.5–6:** Routine/lower-difficulty cases; complex cases only with two-pass requirement
- **Hours 6–6.5:** Third break
- **Hours 6.5–8:** Routine cases; any high-stakes cases requiring fresh judgment are held or escalated to day-shift reviewers

**Case routing:**
- Randomize case order within difficulty tiers (prevent systematic clustering of hard cases late in shift)
- Flag any high-stakes category for priority routing to early-shift reviewers
- Build a "hard case queue" that is heavily weighted toward early-shift assignment
- Use intra-batch agreement rate (among cases reviewed in the same hour) as a fatigue proxy — alert supervisors when it drops

**Justifications:**
- Mandatory breaks: Mackworth (1948) and subsequent research show vigilance decrements are partially reversed by breaks
- Hard-case front-loading: d' is highest early in session; routing hard cases early uses human capability when it's highest
- Intra-batch monitoring: Agreement rate is a near-real-time signal that doesn't require waiting for ground truth

---

### Intermediate Level

#### SDT Application: Medical AI Case
**Model Answer:**

**Without AI:**
- Hit rate $P(H) = 0.78$, False alarm rate $P(FA) = 0.12$
- $d' = z(0.78) - z(0.12) = 0.772 - (-1.175) = 1.947$
- $c = -0.5(0.772 + (-1.175)) = -0.5(-0.403) = 0.202$ → Conservative bias

**With AI:**
- Hit rate $P(H) = 0.91$, False alarm rate $P(FA) = 0.20$
- $d' = z(0.91) - z(0.20) = 1.341 - (-0.842) = 2.183$
- $c = -0.5(1.341 + (-0.842)) = -0.5(0.499) = -0.250$ → Liberal bias

**Interpretation:**

Both $d'$ and hit rate increased. But the false alarm rate also increased substantially (0.12 → 0.20). This pattern — both hits and false alarms increasing together — is the signature of a criterion shift toward liberal (lower threshold), not a pure improvement in discriminability.

The $d'$ increase from 1.947 to 2.183 is modest (~12%). The criterion shift from $c = 0.202$ to $c = -0.250$ is large (moved 0.45 SD units toward liberal). This pattern is consistent with automation bias: when the AI says "flag," reviewers become more likely to flag — even cases they would previously have passed. This increases hits (true positives) but also false alarms.

**Is this a problem?** Depends on the cost structure. If false alarms (additional pathology workup for benign tissue) are low-cost and misses (overlooked malignancy) are high-cost, the criterion shift toward liberal may actually be beneficial — even if it's automation bias. The key diagnostic is: on cases where the AI said "pass," did the miss rate increase? That data is not provided here, but it is the critical measurement for detecting harmful automation bias.

---

#### Interface Design Against Automation Bias
**Model Answer:**

Three specific interface design changes for a loan approval HITL system:

**1. Sequential Revelation (targets: criterion shift mechanism)**
Design: Present the loan application and require the reviewer to make an initial "lean toward approve / lean toward decline" decision (not a final decision) and record a key factor before the AI recommendation is displayed.
Mechanism: Forces genuine evidence processing before the recommendation can anchor the criterion. The reviewer's internally-generated assessment competes with the AI recommendation rather than being bypassed.
Cost: Adds approximately 30–60 seconds per review.

**2. Calibrated Uncertainty Display (targets: overconfidence contagion)**
Design: Display the AI recommendation with a confidence range (e.g., "Recommends APPROVE — confidence 68%, in uncertain region") rather than a binary recommendation. Color-code by confidence tier.
Mechanism: Prevents the recommendation from feeling definitive. A recommendation with displayed uncertainty requires more active processing to resolve than a clean binary output.
Cost: Requires calibration work to ensure displayed confidence is accurate (connects to Chapter 12).

**3. Override Feedback Loop (targets: calibration mismatch)**
Design: For every decision where the reviewer overrides the AI recommendation, track the subsequent ground truth (loan performance after 12 months). Provide quarterly feedback reports showing reviewer override accuracy by case type.
Mechanism: Creates the learning signal necessary for calibrated trust. Without feedback, reviewers cannot adjust their trust level to match the AI's actual accuracy. With feedback, they learn which case types warrant deference and which warrant skepticism.
Cost: Requires 12-month ground truth tracking infrastructure; significant but implementable.

**Grading:**
- **Excellent:** Three changes, each with a clearly identified psychological mechanism, practical cost acknowledgment, and logical connection between mechanism and design
- **Good:** Three changes, mechanisms mostly correct, practical
- **Satisfactory:** Three changes, mechanisms vague or partially wrong
- **Needs Improvement:** Generic changes ("train better," "add more instructions") without psychological grounding

---

## Activity Solutions

### Activity 1: Automation Bias Demonstration Debrief

**Expected findings (if cases are well-calibrated):**
- Packet A (with AI recommendation) shows higher agreement with the AI recommendation
- On cases where AI is correct: Packet A group has higher accuracy
- On cases where AI is incorrect: Packet A group may have lower accuracy than Packet B group
- Packet A participants report higher confidence on cases that match the AI recommendation

**How to handle unexpected results:**
If automation bias doesn't show up clearly: this itself is pedagogically interesting. Ask: "Why didn't we replicate the research finding?" Possible answers: cases were too easy (high discriminability means criterion shift doesn't matter much), sample too small, selection effect (your students are reading about automation bias so they've been primed to resist it).

**Key teaching point:** Even in a class where students *know* they're being tested for automation bias, trace effects usually appear. This underlines the pre-conscious nature of the mechanism.

---

### Activity 2: SDT Intuition Debrief

**Discussion questions after activity:**
1. "Did your hit rate go up in the AI-assisted condition?" (Usually yes)
2. "Did your false alarm rate go up too?" (Usually yes — this is automation bias, criterion shift)
3. "Did you feel like you were making better decisions with the AI?" (Usually yes — subjective experience doesn't track objective accuracy on cases where AI was wrong)
4. "What would you need to see to know whether the AI actually helped you?"

Answer to Q4: You'd need to compare accuracy on cases where AI was wrong — the only cases where automation bias matters. Most people feel more confident with AI regardless of whether it helps.

---

### Activity 3: Interface Redesign Common Student Proposals

**Good proposals to validate:**
- Sequential design (human decision before AI revelation)
- Uncertainty display with confidence range
- Mandatory inspection time before decision
- Separate "hard cases" UI requiring additional documentation
- Override feedback mechanism

**Proposals to constructively challenge:**
- "Remove the AI recommendation entirely" — misses the point; AI recommendations do help when AI is right
- "Add a pop-up confirming the override" — confirmation dialogs are typically clicked through automatically (Nest thermostat parallel from Chapter 1)
- "Train reviewers to ignore automation" — this is the instruction problem; doesn't work

---

## "Try This" Exercise — Grading Guide

**Prompt:** Pay attention to your own psychology when encountering an AI recommendation.

**Grade A Response Characteristics:**
- Identifies a specific AI recommendation interaction
- Describes their actual cognitive process, not the ideal process
- Notes whether the recommendation changed their behavior and in what direction
- Connects to a specific mechanism from the chapter (criterion shift, skill atrophy, or calibration)

**Grade B:**
- Specific interaction
- Notes recommendation changed behavior
- Connects loosely to chapter

**Grade C:**
- Generic description, no specific interaction

---

## Assessment Rubric: System Psychology Audit

| Criterion | Excellent (4) | Good (3) | Satisfactory (2) | Needs Improvement (1) |
|-----------|---------------|----------|-------------------|----------------------|
| **Vulnerability Identification** | 3 distinct, accurately characterized vulnerabilities (automation bias, complacency, fatigue, expertise effect, etc.) with psychological mechanism | 3 vulnerabilities, mechanisms mostly correct | 2–3 vulnerabilities, mechanisms vague | <2 vulnerabilities or fundamental mechanism errors |
| **Design Specificity** | Changes are concrete, interface-level, address the mechanism (not "train better") | Changes are concrete, mostly address mechanism | Changes are present but generic | Only generic recommendations |
| **Measurement Design** | Clear outcome metric, timeline, comparison condition for each change | Metrics for most changes, mostly specific | Some metrics present | No measurement plan |
| **Evidence Grounding** | Multiple specific citations from chapter or appendix | Chapter concepts applied correctly | Some chapter connection | No connection to chapter content |
