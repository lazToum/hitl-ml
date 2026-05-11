# Chapter 15 Teacher's Manual: When Things Go Wrong (And How to Fix Them)

*Complete instructional guide for teaching HITL failure analysis and remediation*

---

## Course Integration Guide

### Learning Objectives

By the end of this chapter, students will be able to:

**Knowledge (Remembering & Understanding):**
- Name and define the four HITL failure modes: model failure, annotation failure, design failure, and reviewer failure
- Explain the difference between spot failures and systematic failures
- Describe the role of the audit trail in HITL failure diagnosis
- Define the purpose and structure of a blameless post-mortem
- Identify the HITL Five Whys technique and explain its purpose

**Application & Analysis:**
- Apply the four-failure-mode taxonomy to diagnose a described HITL system failure
- Use the Five Dimensions framework to map failures to their root dimension
- Analyze a case study to identify whether a failure is a spot or systematic failure
- Evaluate an organization's audit trail practices against best-practice standards

**Synthesis & Evaluation:**
- Design a post-mortem process for a specific HITL system failure
- Propose a remediation strategy that addresses the root cause of a described failure
- Critique the organizational and technical factors that allowed a described failure to persist
- Evaluate the ethical implications of systematic HITL failures in high-stakes domains

### Prerequisites

Students should have working familiarity with:
- Basic ML metrics: accuracy, precision, recall, F1, AUC
- The Five Dimensions framework (introduced in Chapter 1)
- The three failure modes from Chapter 1 (alert fatigue, overconfident silence, silent asking)
- Concepts from earlier chapters: RLHF, annotation, confidence thresholds

### Course Positioning

**Penultimate cluster (Chapters 15–18):** This chapter synthesizes the book's diagnostic and analytical tools before looking forward (Chapters 16–18). It is best taught after students have encountered the case studies and technical material of the earlier chapters.

---

## Key Concepts for Instruction

### The Four Failure Mode Taxonomy

| Failure Mode | Root Cause | Key Signal | Typical Remedy |
|---|---|---|---|
| **Model Failure** | Model predictions wrong | Slice-based performance gaps | Retrain on corrected/augmented data |
| **Annotation Failure** | Labels wrong | Low inter-annotator agreement, annotation drift | Re-annotate affected set, revise guidelines |
| **Design Failure** | Threshold/routing wrong | Review rate stats, override analysis | Recalibrate thresholds, redesign routing |
| **Reviewer Failure** | Human decisions poor | Automation bias indicators, reviewer consistency | Process redesign, incentive alignment |

**Teaching Tip:** Emphasize that these failure modes are not mutually exclusive — the credit scoring case involved model failure, annotation failure (biased historical data), and reviewer failure (automation bias) simultaneously. The diagnostic task is to identify which failures are present and which is primary.

### Spot vs. Systematic Failures

This distinction is conceptually simple but diagnostically important. Use the following teaching heuristic:

> A spot failure says "the system was wrong once." A systematic failure says "the system is wrong about a category of things." Only systematic failures demand systematic responses — and they are far harder to detect because they hide behind acceptable aggregate metrics.

**Teaching Tip:** Challenge students to name examples of each. Spot failure: a navigation app gives wrong directions to a specific address due to a map error. Systematic failure: the same navigation app systematically underestimates travel time in low-income neighborhoods because road quality proxies are missing from the map data.

### The Audit Trail as Infrastructure

Emphasize that the audit trail is not primarily about blame assignment — it is about *capability*. Organizations with good audit trails can do things that organizations without them cannot:
- Detect systematic failures retrospectively when new analytical methods or new hypotheses emerge
- Scope the harm when a failure is identified
- Implement targeted remediation rather than blanket responses
- Demonstrate accountability to regulators, customers, and affected parties

### The Blameless Post-Mortem

This concept may be counterintuitive to students, especially those from cultures with strong accountability norms. Clarify the distinction:
- **Blameless** does not mean **consequence-free**. Organizations can still hold individuals accountable for deliberate misconduct.
- Blameless means: we assume people were acting rationally within their information environment and incentive structures. The goal is to change the environment and incentives, not to punish the person.
- Google's SRE Handbook is a good reference: blameless post-mortems produce better outcomes because people are more honest when they don't fear punishment.

---

## Lecture Planning Guide

### 50-Minute Lecture Structure

#### Opening Hook (8 minutes)
**The Flash Crash Story**
- Tell the Flash Crash story with emphasis on *why* humans couldn't intervene: not that they weren't there, but that the system operated faster than human reaction time
- Key question for students: "If someone had wanted to stop the crash at 2:34 PM, what would they have needed to do, and what would have prevented them?"
- Bridge to taxonomy: "The Flash Crash is a Timing failure. But most HITL failures are subtler. Let's build a map."

#### Part 1: The Four Failure Modes (15 minutes)
- Walk through each failure mode with examples
- Emphasize the diagnostic logic: each mode has a different fingerprint
- Use the table from the Key Concepts section as a visual anchor
- **Discussion question**: "Which failure mode do you think is most common? Which is hardest to detect?"

#### Part 2: Spot vs. Systematic (8 minutes)
- Use concrete examples
- Emphasize that aggregate metrics can mask systematic failures
- Preview: "Slice-based evaluation is how you see the systematic failures that aggregate metrics hide."

#### Part 3: Case Studies (12 minutes)
- Walk through either the credit scoring or political speech case
- Use the Five Whys to trace root causes live
- **Key teaching point**: Notice that the fifth "why" always reveals an organizational or structural cause, not a technical one

#### Part 4: Post-Mortem Structure + Audit Trail (7 minutes)
- What makes a good post-mortem: timeline reconstruction, contributing factors, action items, blameless framing
- The audit trail as prerequisite: "You can't post-mortem what you didn't log."
- **Close**: "The organizations that handle failures best are not the ones that avoid failures. They're the ones that built the infrastructure to find them."

### 75-Minute Extended Session

**Add these components:**

#### Technical Deep Dive (15 minutes)
- Walk through slice-based evaluation conceptually
- Show the confusion matrix and cost-asymmetry formula
- Brief introduction to CheckList methodology
- **Exercise**: "Apply CheckList invariance testing to the political speech case — what invariance test would have detected the annotation artifact?"

#### Group Activity (10 minutes)
- Groups apply the Five Whys to a new described failure
- Each group presents their root cause and proposed remediation
- Debrief: how often does the fifth why reveal an organizational rather than technical cause?

---

## Discussion Questions by Level

### Introductory Level

1. **Taxonomy Application**: "Read the following description of a HITL failure. Which of the four failure modes is most prominent? What evidence supports your diagnosis?"

2. **Spot vs. Systematic**: "A credit card fraud detection system incorrectly blocked a purchase at a new restaurant. Is this a spot failure or a systematic failure? What additional information would you need to determine which it is?"

3. **Audit Trail**: "A hospital discovers that its diagnostic AI has been systematically under-diagnosing a condition in elderly patients for the past two years. What information would the hospital need to scope the harm and implement a remediation? What would need to have been logged to have that information available?"

4. **Post-Mortem Purpose**: "Why does Google advocate for blameless post-mortems? Can you think of situations where a blameless approach might be inappropriate?"

### Intermediate Level

1. **Flash Crash Analysis**: "Apply the Five Dimensions framework to the Flash Crash. Which dimension failed? Were there other dimensions that also contributed? What HITL design changes might have prevented it?"

2. **The Credit Scoring Case**: "The credit scoring case involved multiple failure modes simultaneously. Identify each failure mode present and explain how they interacted to amplify the harm."

3. **Reviewer Failure**: "A HITL system for reviewing loan applications shows that human reviewers agree with the model's recommendation 94% of the time, even in cases the model is uncertain about. Is this a sign of system effectiveness or system failure? How would you determine which?"

4. **Systematic vs. Spot**: "A content moderation system is removing posts from one political topic at 3x the rate of equivalent posts from other topics, even though actual violation rates are equal across topics. What diagnosis does this suggest? What would you check first?"

5. **Design Failure**: "A hospital's clinical decision support system generates 120 alerts per physician per day. Physicians override 95% of them. Analyze this as a HITL failure: which failure mode is it? What are the consequences?"

### Advanced Level

1. **Remediation Design**: "Design a complete remediation plan for the credit scoring case. Include: immediate harm reduction, root cause fix, monitoring to detect recurrence, and stakeholder communication strategy."

2. **Post-Mortem Exercise**: "Apply the Five Whys to the political speech artifact case. Continue until you reach what you believe is the structural root cause. What organizational change would address that root cause?"

3. **Audit Trail Design**: "Design an audit trail specification for a HITL medical imaging system. What data should be logged? At what granularity? For how long? Who should have access? How should it be used?"

4. **The Feedback Loop Problem**: "The credit scoring case involved a self-reinforcing feedback loop: biased predictions led to biased outcomes, which reinforced biased training data. Design a monitoring system that would detect this kind of feedback loop amplification."

5. **Cross-Dimensional Failure**: "Choose a HITL system you're familiar with. Hypothesize a failure scenario for each of the Four Failure Modes. Then: for each, identify which of the Five Dimensions would be the primary failure, and propose a monitoring approach that would detect each failure type within 30 days of onset."

---

## Hands-On Activities and Exercises

### Activity 1: Failure Mode Diagnosis Workshop (20 minutes)

**Setup:** Groups of 3–4. Each group receives a written failure description.

**Failure descriptions** (instructor selects 1–2):

*Scenario A*: A hiring AI is rejecting significantly more applications from women for engineering roles than applications from men with equivalent qualifications. The system was trained on 10 years of historical hiring data.

*Scenario B*: A content moderation system is generating 500 review requests per day for a team of 20 reviewers, who are processing cases in an average of 12 seconds each. The team's accuracy on a held-out test set is 61%.

*Scenario C*: A medical AI for chest X-ray analysis was retrained 8 months ago after adding new training data. Since then, performance on portable X-rays has declined from 87% accuracy to 74% accuracy, while performance on standard X-rays has remained stable.

*Scenario D*: A fraud detection system has excellent aggregate metrics but is blocking 8x more transactions from customers who opened accounts within the last 90 days compared to established customers with identical transaction patterns.

**Task:** For each scenario:
1. Identify the primary failure mode(s)
2. List the evidence supporting your diagnosis
3. Propose the first three diagnostic steps you would take
4. Identify which of the Five Dimensions has failed

**Debrief:** Compare diagnoses across groups. Where do groups disagree? What additional information would resolve the disagreement?

### Activity 2: Five Whys Exercise (25 minutes)

**Setup:** Individual or pairs. Provide the credit scoring case description from the chapter (simplified, one paragraph).

**Task:** Apply the Five Whys. For each "why," identify:
- The proximate cause at this level
- The evidence you would need to confirm it
- The type of cause (technical, organizational, cultural)

**Deliverable:** A "why chain" with at least 5 levels, ending in what students believe is the structural root cause.

**Discussion question after activity:** "If your organization hired a new ML engineer, would the root cause you identified prevent the same failure from happening again? If not, what would?"

### Activity 3: Post-Mortem Simulation (30 minutes)

**Setup:** Groups of 4–5. One person plays each role:
- ML engineer (built the model)
- Data scientist (built the labels)
- Product manager (set the timeline)
- Legal counsel (representing the organization)
- Affected customer (advocate)

**Scenario:** Your organization's loan approval AI has been found to systematically disadvantage applicants from two ZIP codes. You are conducting a post-mortem one week after discovery.

**Task:** Conduct a 20-minute blameless post-mortem. The ML engineer leads. The goal is to:
1. Reconstruct the timeline of the failure
2. Identify contributing factors (not blame)
3. Generate at least 5 specific action items that would prevent recurrence

**Debrief:** What was hard about staying blameless? What action items emerged that surprised you?

### Activity 4: Audit Trail Design (20 minutes)

**Setup:** Individual.

**Scenario:** You are building a HITL system for reviewing medical insurance prior authorization requests (requests for approval to receive a specific medical procedure). The AI makes a preliminary recommendation (approve/deny/request more info), which a human reviewer can confirm or override.

**Task:** Design the audit trail specification. Answer:
1. What data should be logged for each AI prediction?
2. What data should be logged for each human decision?
3. What data should be logged for each system update (model retraining, threshold change)?
4. How long should data be retained?
5. Who should have access to the audit trail, and under what conditions?
6. What automated alerts would you build on top of the audit trail?

---

## Assessment Strategies

### Formative Assessment

**Quick Diagnostic Exercises**
- "A model with 97% accuracy is flagged by a regulator as discriminatory. How is this possible?"
- "Which failure mode produces the most subtle signal? Why?"
- "Name one reason why a blameless post-mortem produces better outcomes than a blame-based one."

**Exit Ticket (3-2-1 Format)**
- 3 conditions under which a systematic failure could hide behind good aggregate metrics
- 2 things an organization needs to have logged to conduct a meaningful post-mortem
- 1 structural change that would reduce the likelihood of HITL reviewer failure

### Summative Assessment Options

**Option 1: Failure Analysis Report (1,000 words)**
Students select a real HITL system failure from the provided list (or propose their own with instructor approval). They:
1. Identify the primary failure mode(s)
2. Apply the Five Whys to identify root cause
3. Evaluate what audit trail data would have been needed to diagnose the failure earlier
4. Propose a remediation plan with immediate, medium-term, and long-term components

**Rubric:**
- Failure mode identification and diagnosis (30%)
- Root cause analysis depth (25%)
- Audit trail analysis (20%)
- Remediation plan quality (25%)

**Option 2: Post-Mortem Document**
Students write a complete blameless post-mortem for a described or real HITL failure. Document should include: timeline, contributing factors, impact assessment, action items, and a section explicitly distinguishing individual actions from structural causes.

**Option 3: Technical Exercise (Advanced)**
Students implement slice-based evaluation on a provided dataset. They:
1. Define appropriate slices for the domain
2. Implement slice-based evaluation
3. Identify the slice(s) with the largest performance gap
4. Hypothesize the failure mode and propose a diagnostic investigation plan

---

## Common Student Misconceptions

### Misconception 1: "Fixing the model fixes the failure"

**Student thinking**: "If the model is wrong, we retrain it. Problem solved."

**Correction**: Retraining on the same biased data produces another biased model. The feedback loop — where model predictions affect outcomes which become training data — means technical fixes without structural fixes simply reproduce the same failure.

### Misconception 2: "Post-mortems are about fixing blame"

**Student thinking**: "Someone made a mistake. The post-mortem is how we find out who."

**Correction**: Human error is almost always a symptom, not a root cause. The question is: why did a rational person make that error in that context? The answer usually involves an incentive structure, an information deficit, or a process design that made the error likely.

### Misconception 3: "High accuracy means the system is safe"

**Student thinking**: "97% accuracy is excellent. If the regulator has a problem, they're being unreasonable."

**Correction**: Aggregate accuracy can mask severe systematic failures in subpopulations. A 97%-accurate hiring system may be 85% accurate on women and 99% accurate on men — which is both a performance failure and an ethical one.

### Misconception 4: "Audit trails are for lawyers"

**Student thinking**: "Logging everything is legal overhead, not engineering value."

**Correction**: Without audit trails, you cannot detect systematic failures, cannot diagnose them, and cannot scope the harm. Every significant remediation in HITL history was enabled by logs. Organizations that treat logging as overhead rather than infrastructure pay for that decision when failures occur.

### Misconception 5: "Reviewer failure means the reviewers are bad at their jobs"

**Student thinking**: "If reviewers are making poor decisions, they need better training."

**Correction**: Reviewer failure is almost always a process failure, not a people failure. Reviewers are responding rationally to the incentives and information environments they operate in. Measuring reviewers on throughput produces fast, low-quality reviewing. Showing reviewers model scores before their own assessment produces automation bias. Fix the process, not the people.

---

## Capstone Connection

Chapter 15 is the analytical foundation for Chapters 16–18. The diagnostic tools developed here — failure mode taxonomy, slice-based evaluation, post-mortem methodology — apply directly to the new domains covered in Chapter 16 (audio, time-series, scientific discovery, robotics). Chapter 17 revisits the question of what happens when systems become good enough that failures become rarer but harder. Chapter 18 asks: what is the human's role in a world where these systems are ubiquitous?

**Synthesis discussion question for after completing the book:**
"Chapter 15 argues that the most dangerous HITL failures are the ones that hide behind good aggregate metrics. Chapter 18 argues that everyone is already a human in the loop. What responsibility do non-expert participants — users, annotators, reviewers — have for preventing systematic HITL failures? What responsibility do organizations have toward those participants?"

---

*Next: Chapter 16 extends HITL analysis beyond text and images — into audio, time-series data, scientific discovery, and physical systems.*
