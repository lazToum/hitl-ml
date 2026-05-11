# Chapter 6 Teacher's Manual: Interfaces That Make Humans Smarter

*Complete instructional guide for teaching HITL interface design and cognitive effects*

---

## Course Integration Guide

### Learning Objectives

By the end of this chapter, students will be able to:

**Knowledge (Remembering & Understanding):**
- Define automation bias and explain its cognitive mechanism
- Describe how information presentation sequence affects decision quality
- Identify the major types of Explainable AI (XAI) methods and their limitations
- Explain what cognitive load theory predicts about annotation interface design
- List at least four properties of interfaces that support (rather than replace) human judgment

**Application & Analysis:**
- Apply the five-dimension framework to analyze a HITL interface design
- Diagnose automation bias from behavioral data
- Evaluate the quality of an XAI explanation using faithfulness and stability criteria
- Analyze the trade-offs between AI-first and human-first interface sequencing

**Synthesis & Evaluation:**
- Design an interface that minimizes extraneous cognitive load for a specific review task
- Propose a presentation sequence that reduces automation bias for a given domain
- Critique a deployed HITL interface using evidence from the radiology studies
- Evaluate whether an XAI tool's explanations are likely to help or harm human decision quality

### Prerequisites
- Chapter 1 (HITL fundamentals, five-dimension framework)
- Chapter 4 or 5 (confidence and uncertainty, review queues) — Chapter 6 builds directly on these
- Basic HCI concepts helpful but not required
- No programming prerequisite for main chapter; Appendix 6A requires Python familiarity

### Course Positioning
- **HCI courses:** Core content on decision support design
- **AI/ML courses:** Bridge between model development and real-world deployment
- **Medical informatics:** Case studies (radiology, COMPAS) directly applicable
- **Ethics/policy courses:** COMPAS analysis is a primary case study

---

## Key Concepts for Instruction

### The Automation Bias Contrast Pair

Chapter 6 works well organized around a central contrast: interfaces that support human judgment vs. interfaces that replace it. Use the COMPAS (failure) and MGH stroke parallel reading (success) cases as your anchor pair.

| Dimension | COMPAS Interface | MGH Parallel Reading |
|-----------|-----------------|----------------------|
| Sequence | Score shown before/during judgment | Human reads first, AI second |
| Explanation | None (proprietary) | Plain-language rationale |
| Independent judgment preserved? | No | Yes |
| Override mechanism | Informal/cultural | Structured |
| Outcome | Racial bias amplified, judge's reasoning outsourced | Improved sensitivity, radiologist ownership maintained |

### The XAI Reality Check

Students often come to this topic with an idealized view of explainability — the idea that if you can just show the human why the AI made a decision, the problem is solved. Chapter 6 challenges this with three counter-examples:

1. **COMPAS**: No explanation was provided; the score was treated as a fact
2. **Zebra confidence bar**: An explanation was provided but systematically misinterpreted
3. **LIME stability problem**: Explanations can vary between runs for identical inputs

The key insight: explanation design is interface design, and explanations that are not comprehensible, actionable, and correctly interpreted provide no safety benefit — and can actively cause harm.

### Cognitive Load Vocabulary

Introduce these terms early and return to them throughout:

- **Intrinsic load**: The difficulty of the actual decision task
- **Extraneous load**: Cognitive overhead from interface mechanics (clicks, navigation, context switches)
- **Germane load**: Cognitive effort available for genuine judgment
- **Annotation fatigue**: Quality degradation over long annotation sessions

The practical punchline: every unnecessary click is a withdrawal from the germane load budget.

---

## Lecture Planning Guide

### 50-Minute Lecture Structure

#### Opening Hook (5 minutes)
**The Judge and the Number**
- Ask students: "If a judge receives a recidivism risk score in a pre-sentencing report, should they use it?"
- Take a quick vote before revealing the COMPAS story
- Reveal ProPublica's findings about accuracy and racial disparity
- Key reveal: the problem was not only the algorithm — it was the interface that presented the score without explanation or uncertainty bounds

#### Part 1: The Presentation Effect (12 minutes)
**Core claim:** Same AI, different interfaces, dramatically different human performance

Present the three CheXNet interface conditions:
1. Probability score alone → pneumonia accuracy up, other findings down
2. Highlighted region → better independent judgment, catches AI errors
3. Both → best outcomes when human reads first

**Discussion prompt:** "Which condition would you want your radiologist to use? Why?"

Introduce automation bias with the Vanderbilt mammography finding: AI assistance caused radiologists to miss cancers they had caught without AI. Let this land before moving on.

#### Part 2: The Annotation Mechanic Problem (10 minutes)
**The click budget**

Walk through the content moderation example:
- 400 reviews per day, 47 seconds each
- Significant fraction is interface mechanics, not judgment
- Quality degrades measurably across the session

Show the Appen annotation redesign result: 0.74 → 0.83 kappa from interface changes alone.

Ask: "What changed? The annotators were the same people, looking at the same content."

**Key insight:** Interface design determines how much of a human's cognitive capacity is available for judgment.

#### Part 3: XAI Reality Check (10 minutes)
Walk through the four XAI approaches:
1. LIME — intuitive, unstable (show the double-run problem)
2. SHAP — more stable, less intuitive to non-experts
3. Grad-CAM — visual, useful in radiology; can still mislead (Zebra bar example)
4. Plain-language rationale — best human utility in studies

Present the human utility table from Appendix 6A (or a simplified version):
- Probability score only: slightly negative utility
- Region + plain-language: highest utility

Pose the question: "What does it mean that showing a SHAP plot to a non-expert loan officer produces *negative* explanation utility?"

#### Part 4: Interface Design Principles (8 minutes)
Introduce the four properties of judgment-supporting interfaces:
1. Separate AI's job from human's job
2. Present uncertainty as information, not failure
3. Preserve independent judgment
4. Make disagreement easy

Use the disagree-facilitation point as a concrete takeaway: if agreeing with the AI is 1 click and disagreeing is 5 clicks, that asymmetry is a design decision that shapes outcomes.

#### Wrap-up (5 minutes)
Return to the JAMA Network Open study: same AI model, five hospitals, different interface designs, one hospital got *worse* accuracy.

**Closing claim:** "Interface design is a safety issue, not a cosmetic afterthought."

Assign the "Try This" exercise.

### 75-Minute Extended Session

**Add these components:**

#### Activity: Interface Audit (15 minutes)
Have students open a tool they use regularly that incorporates recommendations (streaming service, navigation app, academic search tool) and analyze:
- What do you see before you form your own view?
- How easy is it to disagree with the recommendation?
- Is uncertainty communicated? How?
- Apply the five-dimension framework

#### Technical Deep Dive (10 minutes)
Walk through the automation bias anchor-adjustment model from Appendix 6A.
Show how $\alpha$ degrades with fatigue and AI confidence display.
Discuss what interface interventions raise $\alpha$ (pre-commitment, disagree-facilitation).

---

## Discussion Questions by Level

### Introductory Level

1. **COMPAS basics:** "What information would a judge need to evaluate whether a COMPAS risk score is reliable? What would a good interface for this tool look like?"

2. **Automation bias recognition:** "The Vanderbilt study found that AI assistance caused radiologists to miss cancers they had caught without the AI. How is this possible? What does it tell you about how the AI's recommendations were being displayed?"

3. **Click economics:** "A content moderator reviews 400 posts per day. The current interface takes 14 seconds of mechanical overhead per post. A redesigned interface reduces this to 5 seconds. What is the effect on daily judgment capacity? Does this matter?"

4. **XAI intuition:** "A bank uses a loan approval AI. The interface shows applicants their SHAP score breakdown — a bar chart showing which features most influenced the decision. What would an applicant need to understand to act on this information? What barriers exist?"

### Intermediate Level

1. **Sequence design:** "Design the ideal information sequencing for an AI-assisted medical diagnosis tool. At what point does the clinician see the AI's recommendation? At what point do they see the explanation? Defend your sequencing using the evidence from the chapter."

2. **Five-dimension interface analysis:** "Apply the five-dimension framework to the COMPAS sentencing tool. Identify the weakest dimension. Then propose a specific interface change that would strengthen that dimension."

3. **Framework application — annotation tools:** "You are designing an annotation interface for classifying satellite images as 'safe' or 'unsafe' for drone operations. The task is high-stakes and requires specialized judgment. Apply the principles from the chapter to design the interface. Specifically: what information appears on screen, in what order, and what cognitive task are you asking the annotator to perform?"

4. **XAI limits:** "A company deploys a recidivism prediction model with SHAP explanations for judges. A civil rights organization argues that SHAP explanations don't actually make the system fair. Construct the strongest version of this argument. Then construct the strongest rebuttal."

### Advanced Level

1. **Formal automation bias:** "Using the anchor-adjustment model from Appendix 6A, model the effect of a 4-hour annotation session on effective judgment quality. At what session length does the quality drop below an acceptable threshold? How does this calculation change if you reduce interface mechanics from 14 seconds to 5 seconds per item?"

2. **Explanation utility measurement:** "Propose an experimental design to measure the Human Utility of a Grad-CAM explanation in a dermatology AI system. What are your control conditions? How do you handle the fact that Grad-CAM may show different outputs for the same image depending on implementation parameters?"

3. **Safety case analysis:** "The JAMA Network Open study found one hospital's diagnostic accuracy declined after AI deployment, while others improved. Write a technical post-mortem for the declining hospital. What interface design decisions likely caused the decline? What metrics should the hospital have been monitoring in the first months of deployment?"

4. **Design challenge:** "Redesign the COMPAS sentencing interface from scratch. Your design must (a) communicate model uncertainty, (b) preserve judicial independence, (c) provide an explanation that a judge with no data science background can act on, and (d) make disagreement easy to record and route. Sketch the interface and justify every design decision against the principles in this chapter."

---

## Activities

### Activity 1: AI-First vs. Human-First (25 minutes)

**Setup:** Students work in pairs. Each pair receives a set of 10 ambiguous images (satellite images of land cover, or blurry text snippets, or ambiguous audio transcripts — anything requiring judgment).

**Condition A:** Students classify all 10 images independently first. Then they see the AI's classification and confidence for each. They may revise. Record both judgments.

**Condition B:** Students see the AI's classification and confidence first. Then they classify. Record both judgments.

**Analysis:** Compare agreement rates between initial and final judgment in each condition. Is the revision rate higher in Condition A or B? What is the direction of revisions in each condition?

**Debrief:** This is a direct demonstration of automation bias. Students who revise away from their independent judgment after seeing the AI are exhibiting the pattern documented in the radiology studies.

### Activity 2: The Interface Audit (20 minutes)

**Task:** Students audit a real interface (annotation tool, recommendation system, or medical decision support) against the four judgment-support principles:
1. Are the AI's job and the human's job clearly separated?
2. Is uncertainty presented as information?
3. Is independent judgment preserved?
4. Is disagreement easy?

Rate each dimension 1–5 with evidence. Identify the one weakest dimension and propose a specific, implementable fix.

**Deliverable:** A one-page audit report with a mockup of the proposed fix.

### Activity 3: XAI Comprehension Test (15 minutes)

**Setup:** Show students three explanations for the same AI decision:
- A probability score ("87% likely to be X")
- A SHAP feature importance bar chart
- A plain-language rationale ("The model rated this high due to high word-count variance and three negation markers in the first sentence")

**Task:** For each explanation format, ask students:
1. Can you tell what the AI was paying attention to?
2. Can you tell where the AI might be wrong?
3. Can you act on this explanation to verify the AI's reasoning?

**Debrief:** The plain-language rationale typically scores highest on questions 1 and 3. The SHAP chart scores highest on 2 if students have training, lowest if they do not. This exercise demonstrates that explanation utility is context-dependent.

---

## Assessment Strategies

### Formative

**Exit ticket (5 minutes):** "Name one interface design decision that could increase automation bias, and one that could decrease it. Give a specific example for each."

**Think-pair-share:** "The Vanderbilt mammography study found that AI made radiologists worse. Does this mean we should not use AI in radiology? What would a better-designed system look like?"

### Summative Options

#### Option 1: Interface Critique Paper (800 words)
Choose a real AI-assisted decision support tool (medical, legal, or content moderation). Analyze its interface using the four judgment-support principles and the five-dimension framework. Identify the highest-risk design failure. Propose a specific redesign.

**Rubric:**
- Framework accuracy (30%)
- Evidence-based diagnosis (25%)
- Quality of redesign proposal (25%)
- Writing clarity (20%)

#### Option 2: Interface Redesign Project
Redesign a specified HITL interface (instructor provides screenshots/description). Deliverables: annotated wireframe, decision rationale document, cognitive load analysis, expected change in kappa for annotation tasks.

#### Option 3: Research Summary
Read and summarize two empirical studies on automation bias or XAI explanation utility. Identify what interface variable was manipulated, what outcome was measured, and what the finding implies for HITL design practice.

---

## Common Misconceptions

### "Explainability solves the problem"
**Student thinking:** "If you just show people why the AI made a decision, the bias problem is solved."
**Correction:** The chapter documents multiple cases where explanations were provided but were misinterpreted (Zebra bar), were unstable (LIME), or produced negative human utility. Explanation design is a distinct problem from model interpretability. A technically correct explanation is not necessarily a useful one.

### "More information is always better"
**Student thinking:** "You should show the human everything the AI knows."
**Correction:** Working memory is finite. Flooding the interface with feature contributions, uncertainty bounds, alternative hypotheses, and audit trails increases extraneous cognitive load and reduces judgment quality. The goal is the right information, not all information.

### "The AI made the radiologist worse, so AI is bad for radiology"
**Student thinking:** "If AI assistance can decrease diagnostic accuracy, we should not use it."
**Correction:** The five departments study showed that three out of five implementations improved accuracy. The variable was interface design, not AI presence. The correct conclusion is that bad interface design can make AI harmful — and that interface design therefore deserves serious investment.

### "Automation bias is about laziness or low intelligence"
**Student thinking:** "Smart, careful people won't fall for automation bias."
**Correction:** Automation bias has been documented among trained pilots, experienced radiologists, air traffic controllers, and military operators — among the most expert practitioners in their domains. It is a cognitive architecture response to the presence of an authoritative-seeming recommendation, not a character flaw.

---

## Connections to Other Chapters

### Backward Links
- **Chapter 1:** The five-dimension framework; Netflix (low-stakes, graceful ask) vs. Nest (silent action) — both are interface design choices
- **Chapter 5:** Uncertainty detection and calibration — Chapter 6 addresses how calibrated uncertainty gets displayed to humans
- **Chapter 4:** Stakes calibration — visual weight of recommendations should reflect stakes

### Forward Links
- **Chapter 7:** Annotation quality — Chapter 6 shows how interface affects annotator performance; Chapter 7 develops the measurement framework (kappa, agreement metrics)
- **Chapter 8:** Full HITL pipeline — interface is the human-facing surface of the pipeline; logging disagreements enables retraining
- **Chapter 9:** Tool landscape — Label Studio, Argilla, and other tools differ in their interface quality; Chapter 6 provides criteria for evaluation

---

## Sample 50-Minute Lesson Plan

| Time | Activity | Materials |
|------|----------|-----------|
| 0:00–0:05 | Opening hook: COMPAS story, vote | Slide with score display mockup |
| 0:05–0:17 | CheXNet three conditions, automation bias intro | Slides with interface comparison |
| 0:17–0:27 | Click budget, Appen result, cognitive load | Slides, cognitive load diagram |
| 0:27–0:37 | XAI reality check: LIME/SHAP/Grad-CAM | Human utility table |
| 0:37–0:45 | Four judgment-support principles + JAMA study | Design principles slide |
| 0:45–0:50 | Wrap-up, assign Try This | Chapter handout |
