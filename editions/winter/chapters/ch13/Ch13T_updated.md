# Chapter 13 Teacher's Manual: The Psychology of Human-AI Teams

*Complete instructional guide for teaching human psychology in HITL systems*

---

## Course Integration Guide

### Learning Objectives

By the end of this chapter, students will be able to:

**Knowledge (Remembering & Understanding):**
- Define automation bias, automation complacency, overtrust, and undertrust
- Explain the paradox of reliable systems (Bainbridge's irony of automation)
- Describe the expertise effect on human-AI interaction — both benefits and vulnerabilities
- Identify time-of-day and fatigue effects on human reviewer performance

**Application & Analysis:**
- Apply Signal Detection Theory concepts to analyze reviewer behavior
- Distinguish between criterion shifts (automation bias) and discriminability changes (genuine performance)
- Identify which psychological vulnerability is most likely at play in a given HITL scenario
- Propose interface design changes that would counteract automation bias for a specific system

**Synthesis & Evaluation:**
- Design a HITL system that structurally accounts for automation bias, fatigue, and the expertise effect
- Evaluate the psychological assumptions built into an existing HITL design
- Propose a measurement plan to detect when automation bias or vigilance decrement is degrading reviewer performance
- Argue for or against "human in the loop" designs given specific psychological evidence

### Prerequisites
- **Chapter 1–11:** Full HITL fundamentals including the Five Dimensions framework
- **Chapter 12:** Measurement framework (SDT connects to precision/recall/F1; d' and c are new)
- **Psychology:** Basic familiarity with concepts like cognitive bias is helpful but not required

### Course Positioning
**Mid-to-Late Course (Weeks 10–12):** Best positioned after measurement (Ch12) so students can connect psychological vulnerabilities to measurable outcomes
**Standalone:** This chapter works as a standalone reading for psychology or HCI courses

---

## Key Concepts for Instruction

### The Three Failure Modes of Human-AI Psychology

| Failure Mode | Mechanism | Detection | Design Counter |
|-------------|-----------|-----------|----------------|
| **Automation bias** | Criterion shift toward AI recommendation | Blind review comparison | Sequential design; explicit uncertainty display |
| **Automation complacency** | Vigilance decrement; skill atrophy | d' decline over time; simulation testing | Regular manual practice; mandatory breaks |
| **Calibration mismatch** | Over- or under-trust relative to actual AI accuracy | Override accuracy tracking | Feedback on overrides; explicit performance feedback |

### Air France 447 as a Central Case

The opening story has multiple layers — use them carefully:

**Layer 1 (factual):** Pilots were present but unpracticed; when automation disengaged in an emergency, they made errors they might not have made had they been regularly flying manually.

**Layer 2 (psychological):** This illustrates automation complacency — not malice, not incompetence, but skill atrophy under reliable automation. The BEA report explicitly noted inadequate training in high-altitude manual flight.

**Layer 3 (systemic):** The same design philosophy that made the A330 autopilot excellent — reliable enough to handle the vast majority of situations without human intervention — made the human-automation handoff at the critical moment maximally dangerous.

**Teaching caution:** Do not present this as a story of pilot failure. The BEA did not. Frame it as a systems-level outcome: reliable automation + inadequate preparation for automation failure = catastrophic vulnerability.

### The Expertise Paradox

Students often assume "get better reviewers" is the solution to automation bias problems. Address this directly:

- Experts have higher $d'$ (better discriminability) — true advantage
- Experts have stronger priors and more resistance to AI recommendations that contradict intuition — specific vulnerability
- Experts have more to defend in conflicts with AI — psychological resistance, not cognitive inability
- The design implication: expert reviewers need different interface designs from novices, not simply more instructions

---

## Lecture Planning Guide

### 50-Minute Lecture

#### Opening (7 minutes): Air France 447
Present the story with full human context — emphasize the pilots' professionalism and training. Then reveal the structural problem.

**Key question to pose:** "If you were designing the training program for pilots who fly aircraft with autopilots, what would you change after reading the BEA report?"

Don't answer yet.

#### Part 1: The Paradox of Reliable Systems (8 minutes)

Draw the paradox on the board:
- High reliability → less practice → skill atrophy → worse performance when needed
- This is not a trade-off to be "solved"; it is a structural feature of automation

Introduce Bainbridge's (1983) "Ironies of Automation":
- Designers assume humans will oversee automation reliably
- But automation removes the practice that makes reliable oversight possible

Connect to Air France 447: the crew was in the loop by presence, not by practice.

#### Part 2: Automation Bias (12 minutes)

Define clearly: automation bias = tendency to rely on automated recommendations in ways that reduce independent processing.

Key research findings to present:
1. Skitka et al. (1999): pilots with automation were *less* likely to catch automation errors, even when explicitly told to apply independent judgment
2. Radiologist attention allocation studies: attention shifts toward AI-flagged areas, away from non-flagged areas
3. Judicial decision making: algorithmic risk scores shift sentencing toward the recommendation

**The SDT insight (accessible version, no math required here):**
"The key mechanism isn't that reviewers become less able to spot errors — it's that they set a higher bar for acting on what they see. The AI recommendation satisfies the brain's drive toward a decision. The reviewer then needs a stronger signal to override that settled feeling."

#### Part 3: Overtrust and Undertrust (8 minutes)

Important balance: automation bias is real and costly, but so is algorithm aversion.

Use Dietvorst et al. (2015) "algorithm aversion": people who see an algorithm err once become willing to pay to avoid using it in the future — even when the algorithm still outperforms human judgment.

**Discussion prompt:** "When is it rational to distrust an AI recommendation? When is it rational to defer to it? How do you know which situation you're in?"

Answer: calibrated trust, which requires feedback — and feedback is a design choice, not a natural consequence of using HITL.

#### Part 4: The Expertise Effect (8 minutes)

Draw the two-sided expertise table on the board:

| Experts vs. Novices | Advantage | Vulnerability |
|---------------------|-----------|---------------|
| Discriminability | Higher $d'$ | Stronger resistance to disconfirming evidence |
| Case recognition | Faster on familiar patterns | Overfit to past experience |
| AI interaction | Better audit of AI outputs | More defending of own prior |

Use a medical example: experienced radiologist has more pattern knowledge but also a stronger "this looks like X" prior that may conflict with AI suggestion.

#### Part 5: Fatigue and Time of Day (7 minutes)

Present vigilance decrement concisely:
- Sustained attention declines over time (robust finding, 75+ years of research)
- In SDT terms: $d'$ declines; reviewer becomes less able to discriminate signal from noise
- Danziger judicial decisions study as vivid illustration

**Design implication:** Time-of-day effects are predictable and should be designed around, not hoped away.

#### Wrap-up (5 minutes)
Return to opening question about pilot training. Answers should now include:
- Regular manual flight practice, not just simulation
- Training specifically for automation-to-manual transitions
- Crew resource management for recognizing when to question automation

Introduce design counter-measures briefly; Chapter applies these in detail.

### 75-Minute Extended Session

**Add:**
- 10 minutes: SDT walkthrough (gentle, no derivations) — draw the two distributions, move the criterion, show how hit rate and false alarm rate change
- 10 minutes: "Role play the reviewer" exercise — groups see the same case with and without an AI recommendation; debrief on their reasoning processes
- 5 minutes: Connect SDT to measurement from Chapter 12 — d' and c as what precision/recall are measuring at the reviewer level

---

## Discussion Questions by Level

### Introductory Level

1. **The Automation Paradox:** "The chapter describes a paradox: the better the automation, the more dangerous the moment when it fails. In your own life, is there any technology that you rely on so much that you would be less capable without it? How does this connect to Air France 447?"

   *Expected response:* Students will identify GPS navigation, autocorrect, calculators, etc. The connection to AF447 is that capability atrophied by disuse is not simply "forgotten" — it's not accessed when suddenly needed. Push them to explain *why* this creates risk beyond simple disuse.

2. **Automation Bias Self-Check:** "The chapter says that even when people are explicitly told to apply independent judgment, automation bias still operates. Why doesn't the instruction work? What would need to change for the instruction to be effective?"

   *Expected response:* Instructions target conscious intention; automation bias operates at the level of attention allocation (pre-conscious). The instruction to "apply independent judgment" assumes the reviewer is choosing to defer. But automation bias means they're not registering the need to actively question. Design changes — not instructions — are required.

3. **Overtrust vs. Undertrust:** "Give an example of a domain where you think people are more likely to overtrust AI recommendations, and an example where they are more likely to undertrust. What explains the difference?"

   *Expected response:* Overtrust: high-reliability domains where AI is usually right, high-volume review contexts (fatigue + high base rate of AI accuracy), areas where the human has less confidence than the AI. Undertrust: domains with high professional identity investment (medicine, law, creative fields), cases where AI errors are salient and memorable, domains with a cultural norm of skepticism toward automation.

4. **Fatigue Design:** "A content moderation team works 8-hour shifts reviewing AI-flagged social media posts. Difficult decisions requiring careful judgment make up about 15% of their caseload. Based on what you've learned about fatigue effects, how would you structure their shift?"

   *Expected response:* Front-load difficult cases; mandatory breaks every 60–90 minutes; randomize case difficulty rather than letting the routing system cluster hard cases; two-pass review for highest-stakes decisions that fall in the last hour of shift; consider shorter shifts for tasks requiring sustained attention.

### Intermediate Level

1. **SDT Application:** "A medical AI system for flagging suspicious tissue samples is used alongside pathologist review. In a study comparing pathologist performance with and without the AI recommendation, the following is observed: With AI, hit rate = 0.91, false alarm rate = 0.20. Without AI, hit rate = 0.78, false alarm rate = 0.12. Interpret these findings in SDT terms. Is automation bias operating? What kind?"

   *Model answer direction:* Compute or estimate d' and c for each condition. With AI: d' is higher (better discrimination) OR hit rate increase is primarily a criterion shift (more liberal). Without AI: more conservative criterion. The increase in hit rate AND false alarm rate together suggests criterion shift (liberal bias from automation), not pure discriminability improvement. Automation bias in the liberal direction on cases where AI says "flag."

2. **Interface Design Against Automation Bias:** "Propose three specific interface design changes for a loan approval HITL system that would reduce automation bias without significantly increasing review time. Justify each change in terms of the psychological mechanism it targets."

3. **The Expertise Tradeoff:** "Your organization is building a HITL system for diagnosing rare pediatric diseases. You have a choice between: (a) using highly experienced attending physicians as reviewers, or (b) using senior residents who have less experience but are more recently trained. Based on the psychological literature, what are the tradeoffs? What would your recommendation be?"

4. **Calibrated Trust Design:** "An AI system for screening job applications has 82% accuracy. Human HR reviewers have 74% accuracy on the same cases when they see the AI recommendation. Design a measurement protocol that would determine whether the reviewers' trust in the AI is well-calibrated, overtrusting, or undertrusting."

   *Expected elements:* Blind review comparison (reviewers see cases without AI recommendation), measure human accuracy alone, compare to AI accuracy, track override accuracy, look for systematic over- or under-deference in specific subdomains.

### Advanced Level

1. **Bainbridge's Irony Applied:** "Bainbridge (1983) argued that automation creates problems it ostensibly solves. For a specific modern AI system (choose one), trace through the ironies: What skills does automation remove? When does the automation disengage? What happens to the human in that moment? What training is currently provided, and is it sufficient?"

2. **SDT and Interface Design:** "Using the formal SDT framework from Appendix 13A, show mathematically how presenting an AI recommendation before versus after a human's initial assessment changes the effective criterion $c$. Under what conditions does sequential design (human-first) eliminate rather than merely reduce automation bias?"

3. **The Algorithm Aversion Problem:** "Dietvorst et al. (2015) found that algorithm aversion increases sharply after people see an algorithm err. In a HITL system, errors are visible — reviewers regularly see cases where the AI was wrong (that's why they're there). Design a system that exploits the psychological insight from that research to build appropriate (not excessive) trust in the AI component. What is the psychological mechanism your design targets?"

---

## Hands-On Activities

### Activity 1: Automation Bias Demonstration (15 minutes)

**Setup:** Two identical case packets. Packet A shows a binary decision case with an AI recommendation ("AI recommends: APPROVE"). Packet B shows the identical case with no AI recommendation.

**Task:** Half the class evaluates Packet A cases; half evaluates Packet B cases. Participants record their decision and confidence.

**Debrief:** Compare decisions across groups. How did the recommendation change decisions? Did confidence change? Were there cases where the AI-recommendation group was more confident in a wrong answer?

**Note for instructors:** This works best with genuinely ambiguous cases (e.g., text-based content moderation decisions, borderline credit applications) where the class will naturally show variance.

### Activity 2: SDT Intuition (20 minutes)

**Purpose:** Build intuition for d' and criterion without requiring formal calculation.

**Setup:** Show students a sequence of 40 brief visual cases — each is a low-resolution image that either contains or does not contain a target object. Students record "yes" or "no."

**Session 1:** No feedback.
**Session 2:** Same images (shuffled), with an AI recommendation displayed before each.

**Compute together:** Hit rate, false alarm rate for each session. Draw on the board: did hit rate increase? Did false alarm rate increase? Which changes more?

**Connect:** If both increased, that's criterion shift (automation bias). If hit rate increased without false alarm rate increase, that's genuine improvement.

### Activity 3: Interface Redesign Challenge (25 minutes)

**Prompt:** "Here is a content moderation interface [show a mock screenshot with AI recommendation prominently displayed before case content]. Based on everything you've learned about automation bias, fatigue, and the expertise effect, redesign this interface to support better human-AI collaboration."

**Groups present:** Each group explains their redesign choices and the psychological mechanisms each change targets.

**Common good changes students propose:**
- Hide AI recommendation until initial human assessment recorded
- Display AI confidence with uncertainty range rather than binary recommendation
- Mandatory 3-second case inspection before recommendation is displayed
- Separate "easy" and "hard" case queues with different interfaces

### Activity 4: Fatigue Protocol Design (20 minutes)

**Prompt:** "You manage a team of 12 HITL reviewers who work 8-hour shifts reviewing flagged insurance claims. Some claims require deep analysis (20+ minutes), others are quick. Based on the chapter's discussion of fatigue and time-of-day effects, design a shift structure and case routing protocol that minimizes quality degradation over the course of a shift."

**Deliverable:** A written shift structure (breaks, hard case timing, staffing) with one-sentence justification for each choice.

---

## Assessment Strategies

### Formative Assessment

**Quick Poll:**
- "Automation bias operates primarily through: (a) reduced ability to see signal; (b) changed threshold for responding to signal; (c) reduced motivation; (d) reduced time on task."
  (Answer: b — criterion shift, not discriminability change)

- "True or False: Expert reviewers are always better choices for HITL tasks than novices."
  (False — experts have both advantages and domain-specific vulnerabilities)

**Exit Ticket (3-2-1):**
- 3 psychological mechanisms that affect HITL reviewer performance
- 2 interface design changes that could counteract one of them
- 1 unresolved question about human-AI psychology you still have

### Summative Assessment Options

#### Option 1: System Psychology Audit (1,000 words)
**Prompt:** "Select a real HITL system (medical AI, content moderation, autonomous vehicle supervision, fraud detection, etc.). Identify the three most significant psychological vulnerabilities in its current design. For each, propose a design change, explain the mechanism you're targeting, and describe how you would measure whether the change worked."

**Rubric:**
- Psychological Accuracy (30%): Mechanisms correctly identified and characterized
- Design Specificity (25%): Changes are concrete, not just "train better" or "hire experts"
- Measurement Design (25%): Measurable outcomes specified with clear causal logic
- Writing and Evidence (20%): Grounded in research from the chapter

#### Option 2: Case Study Analysis
**Assignment:** Read the BEA's executive summary of the Air France 447 final report (provided by instructor). Analyze the accident through the lens of automation complacency, criterion placement, and situational awareness loss. Identify three design changes to the training program and cockpit interface that might have prevented the outcome.

#### Option 3: SDT Lab Report (advanced)
**Task:** Using a provided dataset of HITL reviewer decisions with ground truth labels, compute d', c, AUC for each reviewer and across sessions. Identify reviewers who show evidence of: (a) automation bias (criterion shift toward AI), (b) vigilance decrement (d' decline over session), (c) miscalibrated trust. Recommend targeted interventions for each.

---

## Common Student Misconceptions

### Misconception 1: "Automation bias = human laziness"
**Response:** Automation bias operates below the level of conscious choice. It's about attention allocation — the brain doesn't generate the need for active processing when a recommendation is already present. Address this by showing that the effect persists even under explicit instructions to apply independent judgment.

### Misconception 2: "Just tell reviewers to ignore the AI"
**Response:** The research consistently shows that verbal instructions do not counteract automation bias. Interface design is more powerful than instructions. Show: Skitka et al. (1999) explicitly instructed participants to apply independent judgment; automation bias persisted.

### Misconception 3: "Experts don't have automation bias"
**Response:** Expert domain knowledge reduces some vulnerabilities (higher d') while creating others (stronger priors, more resistance to AI recommendations conflicting with expertise). Expert reviewers are not immune to automation bias — the mechanism operates independently of expertise level.

### Misconception 4: "Fatigue effects only matter for long shifts"
**Response:** Meaningful vigilance decrement begins within 20–30 minutes for demanding tasks. This is relevant for any review session, not just multi-hour marathon shifts.

### Misconception 5: "Algorithm aversion and automation bias are the same problem"
**Response:** They are opposite problems. Automation bias is overtrust — following the AI when you shouldn't. Algorithm aversion is undertrust — rejecting the AI when you should defer. Both are problems of miscalibration. Both require feedback loops and evidence to correct.

---

## Connections to Other Chapters

### Backward Links
- **Chapter 1:** "The Thermostat That Cried Wolf" — human psychology shapes how users respond to HITL design
- **Chapter 12:** Measurement framework — fatigue and automation bias are detectable through d', kappa, and pathway error rates

### Forward Links
- **Chapter 14:** Fairness — human reviewer biases (racial, gender, etc.) interact with automation bias in complex ways; Chapter 14 builds on the psychology established here

---

*This chapter requires the most delicate pedagogical balance in the book: students need to understand that humans are psychologically vulnerable in HITL contexts without concluding that "remove humans and automate everything" is the right response. The AF447 story, handled carefully, actually supports the opposite conclusion: the problem wasn't too much human, it was the wrong kind of human involvement. The goal is better design, not less humanity.*
