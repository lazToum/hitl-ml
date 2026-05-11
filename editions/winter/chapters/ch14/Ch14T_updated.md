# Chapter 14 Teacher's Manual: Building Fair and Ethical Systems

*Pedagogical guide for instructors: discussion questions, classroom activities, assessment rubrics, and facilitation notes*

---

## Instructor Overview

Chapter 14 is among the most sensitive chapters in the book. The subject matter — algorithmic bias, racial disparity in criminal justice algorithms, and the limits of human oversight as an ethics solution — can provoke strong emotional responses alongside intellectual ones. This is not a reason to avoid the material; it is a pedagogical opportunity. Students who feel personally invested in questions of fairness bring authentic engagement that moves discussion beyond the abstract.

**Key pedagogical goals:**
1. Help students distinguish *bias* (a value-neutral statistical term) from *prejudice* (an intentional moral failure) — the chapter's most important conceptual move
2. Develop comfort with mathematical impossibility results as legitimate intellectual conclusions, not defects in the argument
3. Build the capacity to evaluate competing fairness claims without assuming one is simply "right"
4. Identify the structural conditions under which human oversight becomes meaningful versus performative

**Prerequisites:** Students should have read Chapter 5 (annotation and labeling) and Chapter 7 (calibration and uncertainty). The technical appendix material on fairness metrics is optional for non-technical courses.

---

## Learning Objectives

By the end of this chapter, students should be able to:

1. Identify and distinguish the five layers where bias enters AI systems (collection, annotation, model, deployment, feedback loops)
2. State the fairness impossibility theorem and explain its normative implications
3. Evaluate competing fairness metrics claims using the COMPAS case as a test
4. Distinguish meaningful accountability structures (explainability, auditability, contestability) from accountability theater
5. Articulate why well-intentioned human oversight does not automatically produce fair outcomes
6. Apply a structured fairness audit framework to a real or hypothetical system

---

## Discussion Questions

### Opening Discussion (15 minutes, pre-lecture)

**Q0:** Before reading, think of a time when a system or institution treated you, or someone you know, unfairly — either through a deliberate policy or through an impersonal process. What made it feel like a systemic failure rather than an individual mistake? What would have needed to change to fix it?

*Instructor note:* This question frames the chapter's subject matter in terms of students' lived experience before introducing technical vocabulary. It often reveals that students' intuitions about fairness are already more sophisticated than they realize — and helps them see that the chapter is formalizing something they already care about, not introducing it from scratch.

---

### Discussion Questions — Section by Section

**On the Layers of Bias (Section 2):**

**Q1:** The chapter identifies five layers where bias enters AI systems: collection, annotation, model, deployment, and feedback loops. Which of these do you think is hardest to detect after the fact? Which is hardest to prevent? Are these the same layer?

**Q2:** "Bias is not a bug you remove — it is a signal the model correctly learned from biased data." What are the implications of this statement for how organizations should approach bias remediation? What does it suggest about "debiasing" as a concept?

**Q3:** Amazon's recruiting AI adapted when engineers removed gender-correlated features — it found new proxy variables. What does this pattern of proxy adaptation suggest about the limits of feature engineering as a fairness strategy?

---

**On Feedback Loops (Section 3):**

**Q4:** The predictive policing feedback loop shows arrests increasing in over-policed areas, which the model interprets as evidence that crime is higher there, generating more policing. The humans reviewing the system see more arrests and conclude the system is "working." What cognitive bias among the human reviewers contributes to this outcome? What would a human reviewer need to know to recognize they are watching a feedback loop rather than model validation?

**Q5:** Feedback loops where model predictions influence future training data appear in many domains beyond policing: credit scoring, hiring, content recommendation, healthcare resource allocation. Choose a domain you know well and trace a plausible feedback loop. What would "break the loop" in your domain?

---

**On the COMPAS Case and Fairness Impossibility (Sections 4–5):**

**Q6:** ProPublica found that COMPAS had disparate false positive rates; Northpointe found that COMPAS was calibrated. Both were mathematically correct. Before reading the explanation: which claim seems more important to you, and why? After reading the mathematical proof of impossibility: has your intuition changed, or been reinforced?

**Q7:** The fairness impossibility theorem says the choice between fairness definitions is normative, not technical. Who should make this choice for a recidivism prediction tool used in sentencing decisions? Judges? Legislatures? Advocacy groups representing affected communities? The company that built the tool? What process would be appropriate?

**Q8:** The chapter argues that the COMPAS algorithm "made the choice visible" rather than "making the choice." Is this defense satisfying? Does making an implicit social choice explicit (via an algorithm) change the moral responsibility of the people who deploy it?

---

**On the Limits of Human Oversight (Section 6):**

**Q9:** The chapter identifies three reasons why adding human review doesn't automatically solve fairness problems: (1) humans absorb and legitimize AI bias, (2) humans carry their own biases, (3) humans can't track systemic effects while doing case review. Which of these three seems most practically tractable to address? What specific intervention would address each?

**Q10:** "Human oversight, in this case, was not a check on the algorithm's failures. It was cover for them." What organizational conditions make this outcome — humans providing legitimizing cover rather than genuine oversight — most likely? What conditions would make genuine oversight more likely?

---

**On Accountability Design (Section 7):**

**Q11:** The chapter distinguishes explainability (why did this prediction occur?), auditability (what patterns appear across many predictions?), and contestability (can individuals meaningfully challenge decisions?). Rate these in order of importance for each of the following applications: (a) a medical AI making cancer screening recommendations, (b) a hiring algorithm screening résumés, (c) a recidivism prediction tool used in sentencing, (d) a social media content moderation algorithm.

**Q12:** The EU GDPR establishes a "right to explanation" for automated decisions. Research has found that the legal content of this right remains contested — companies can satisfy it formally while providing explanations that are uninformative. What would a genuinely informative explanation look like for each of the applications in Q11? What would a formally compliant but practically useless explanation look like?

---

### Synthesis and Application Questions

**Q13:** Design a fairness audit for a specific high-stakes AI system you care about (healthcare, hiring, lending, criminal justice, benefits eligibility). Specify: (a) which fairness definition(s) you would prioritize and why, (b) what data you would need to conduct the audit, (c) who should conduct the audit (the deploying organization, an independent body, a government regulator?), and (d) what you would do if the audit found disparate impact.

**Q14:** The chapter concludes that "fairness is not a property a system achieves once — it is an ongoing relationship between a system, a deployment context, and an affected community." What institutional structures would be needed to operationalize this claim? What would it cost, and who would bear the cost?

---

## Classroom Activities

### Activity 1: The Hiring Algorithm Design Challenge (30 minutes)

**Setup:** Working in groups of 4–5, students are asked to design a hiring algorithm for a software engineering role at a hypothetical company with a historically homogeneous workforce.

**Task sequence:**
1. (5 min) List what data you would use to predict job performance. What proxies might encode demographic characteristics even if you don't include them explicitly?
2. (8 min) Choose a fairness definition for your system. What does it mean concretely? Who are you protecting from what type of error?
3. (8 min) A critic argues your chosen fairness definition ignores a competing valid concern. Respond. Can you satisfy both?
4. (9 min) What human review process would you build into your system? Who reviews what? What authority do reviewers have?

**Debrief questions:**
- Which fairness definition did your group choose, and why?
- Where did your group most sharply disagree?
- What would your system need that you couldn't provide?

---

### Activity 2: Role-Play Scenario — The Parole Board (25 minutes)

**Setup:** Students are assigned roles:
- Role A: Defendant's attorney
- Role B: Prosecutor
- Role C: Parole board member
- Role D: COMPAS system spokesperson
- Role E: Researcher (can be played by multiple students)

**Scenario:** The parole board is reviewing the case of a defendant who received a high COMPAS score (classified high-risk for recidivism) but has served three years without incident in prison, has family support, and has completed vocational training.

**Task:** Each role must argue for their interpretation of the COMPAS score's relevance and appropriate weight in the decision. The parole board member must decide.

**Debrief questions:**
- What information would have changed the decision?
- Was the COMPAS score more useful as a reason for the decision, or as a reason to scrutinize the decision?
- What does genuine contestability require in this scenario?

---

### Activity 3: The Audit Simulation (45 minutes, computer lab)

Using the Fairlearn library or a simplified spreadsheet version (provided as supplemental material), students work with a synthetic dataset of hiring decisions.

**Task:**
1. Compute overall accuracy, precision, and recall for a provided classifier
2. Compute demographic parity difference and equalized odds difference by race and gender
3. Identify which subgroups have the largest performance gaps
4. Choose a mitigation strategy and evaluate its effect on both fairness metrics and overall accuracy
5. Present findings: what is the tradeoff your mitigation created?

---

## Assessment Rubrics

### Short Essay Rubric (500–800 words): "Choose a Fairness Definition"

Prompt: *Select one high-stakes AI application (healthcare, criminal justice, hiring, lending). Argue for a specific fairness definition for that application. Acknowledge the strongest objection to your choice and respond to it.*

| Criterion | Excellent (4) | Proficient (3) | Developing (2) | Beginning (1) |
|-----------|---------------|----------------|----------------|---------------|
| **Fairness definition accuracy** | Correctly states mathematical meaning; connects to application | Mostly correct; minor imprecision | Some confusion between definitions | Conflates definitions |
| **Normative argument** | Clear, grounded argument for why this definition matches the application's moral priorities | Reasonable argument, some gaps | Argument partially developed | No clear normative argument |
| **Engagement with impossibility** | Explicitly addresses what is sacrificed; explains tradeoff | Acknowledges tradeoff exists | Mentions but doesn't engage | Ignores impossibility |
| **Counterargument** | Steelmans opposing view; responds substantively | Identifies opposing view; partial response | Weak or strawman counterargument | No counterargument |
| **Clarity and precision** | Clear, concise; technical terms used accurately | Mostly clear; occasional imprecision | Some clarity issues | Significant clarity problems |

---

### Discussion Participation Rubric

| Level | Description |
|-------|-------------|
| **Distinguished** | Advances discussion with novel connections; builds on others' arguments; uses technical vocabulary precisely; distinguishes normative from technical questions |
| **Proficient** | Engages with chapter content accurately; responds to others; raises substantive questions |
| **Developing** | Participates; sometimes summarizes rather than advances; occasionally imprecise with technical terms |
| **Beginning** | Minimal participation or significant technical/conceptual errors |

---

## Common Misconceptions to Address

**Misconception 1:** "Bias in AI is just prejudice by programmers."

*Correction:* Bias in the statistical sense means a systematic deviation from an unbiased standard. It is not primarily caused by prejudiced programmers. It enters through historical data that reflects past and present social inequalities — data that a model correctly learns from. The model is not prejudiced; the world it was trained on was.

**Misconception 2:** "You can fix bias by removing sensitive attributes from the model."

*Correction:* The Amazon recruiting case illustrates the problem: models learn to use proxy variables. Removing race from a model trained on historical US residential data does not prevent the model from learning neighborhood characteristics that correlate with race due to historical housing discrimination. Feature engineering alone cannot solve structural data bias.

**Misconception 3:** "Adding more human review solves the fairness problem."

*Correction:* The chapter's core argument is that this intuitive response is inadequate. Human reviewers carry their own biases, can be affected by automation bias, and cannot detect aggregate patterns while reviewing individual cases. Human oversight is necessary but not sufficient; it requires specific design (diverse reviewers, statistical auditing, genuine contestability) to constitute real accountability.

**Misconception 4:** "The fairness impossibility theorem means we can't have fair AI."

*Correction:* It means we can't simultaneously satisfy all possible definitions of fairness. This is a result about the structure of the problem, not a counsel of despair. It means we have to choose which type of fairness matters most for a given application — and be honest about what we're giving up. That choice is important and valuable, even if it's difficult.

---

## Connections to Other Chapters

- **Chapter 2 (Uncertainty Detection):** Calibration by demographic group extends the calibration concepts from Chapter 2 — a model can be well-calibrated overall but poorly calibrated for a minority subgroup, creating exactly the patterns COMPAS exhibited.
- **Chapter 5 (Annotation):** Annotation bias is a direct extension of the human judgment issues in annotation discussed in Chapter 5; demographic homogeneity of annotator pools is a fairness issue as well as a quality issue.
- **Chapter 15 (When Things Go Wrong):** The feedback loop amplification discussed in Chapter 14 is a variant of the systematic failure modes in Chapter 15; the audit trail requirements in Chapter 15 are prerequisites for the fairness monitoring discussed here.
- **Chapter 18 (Your Role):** The civic participation theme in Chapter 18 connects directly to the question of who should make normative choices about fairness definitions — this chapter is preparation for that conversation.

---

## Instructor Notes

**On discussing the COMPAS case with diverse students:** Some students may have personal experience with the criminal justice system — as defendants, family members of incarcerated people, or in professional or advocacy roles. The COMPAS case should be presented as a mathematical result with serious human consequences, not as an abstract puzzle. Acknowledge that the stakes are real before discussing the mathematics.

**On the impossibility theorem:** Many students initially experience the impossibility result as a "gotcha" — a trick that means fairness discussions are pointless. The most important reframe: impossibility results are clarifying. They tell us we cannot avoid making a normative choice, which means we should make it deliberately and transparently, with accountability for the choice. This is actually more demanding of us, not less.

**On industry examples:** The landscape of AI bias cases is evolving rapidly. Supplement the Amazon and COMPAS examples with more recent cases relevant to students' contexts. The chapter's analytical framework applies across all of them; the specific examples are illustrations, not the argument itself.
