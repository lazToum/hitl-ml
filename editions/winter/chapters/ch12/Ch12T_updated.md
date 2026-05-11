# Chapter 12 Teacher's Manual: Measuring Success

*Complete instructional guide for teaching HITL measurement and evaluation*

---

## Course Integration Guide

### Learning Objectives

By the end of this chapter, students will be able to:

**Knowledge (Remembering & Understanding):**
- Define precision, recall, F1, calibration error, and inter-rater agreement
- Explain why accuracy alone is insufficient for evaluating HITL systems
- Describe Goodhart's Law and its specific manifestations in human-AI systems
- List all seven dimensions of the HITL measurement framework from Chapter 12

**Application & Analysis:**
- Compute basic classification metrics (precision, recall, F1) from a confusion matrix
- Apply the seven-dimension framework to evaluate a real or hypothetical HITL deployment
- Identify which metric is most likely being gamed in a given scenario
- Distinguish between pathway-specific and aggregate error rates, and explain why the distinction matters

**Synthesis & Evaluation:**
- Design a complete measurement framework for a new HITL system
- Propose an A/B test to evaluate a proposed change to a routing threshold
- Identify conditions under which optimizing one metric degrades another
- Critique a proposed measurement approach for susceptibility to Goodhart effects

### Prerequisites
- **Chapter 1–4:** Understanding of HITL fundamentals, uncertainty quantification, the Five Dimensions framework
- **Statistics:** Basic probability, understanding of proportions and means; confidence intervals helpful but not required for the conceptual treatment
- **Optional:** Machine learning fundamentals helpful for calibration discussion

### Course Positioning
**Mid-Course (Weeks 8–10):** Pairs naturally with system design chapters; students now have enough HITL context to appreciate the measurement challenges
**Applied Concentration:** Excellent capstone topic for applied HITL courses

---

## Key Concepts for Instruction

### The Seven-Dimension Measurement Framework

| Dimension | Key Question | What It Misses If Omitted |
|-----------|-------------|--------------------------|
| **Model accuracy** | Is the model right? | Nothing — but insufficient alone |
| **Calibration quality** | Does confidence mean what we think? | Routing decisions based on bad confidence scores |
| **Human workload** | Can reviewers sustain quality? | Fatigue-induced error that looks like stable performance |
| **Time-to-decision** | How fast is the system? | Bottlenecks that accuracy data never reveals |
| **Cost per decision** | What does it cost? | Inefficient routing that wastes review capacity |
| **Error rates by pathway** | Are humans adding value? | Model improvement hiding reviewer degradation |
| **Feedback loop latency** | How fast does the model learn? | Lag between human corrections and model improvement |

**Teaching Tip:** Use this table as a diagnostic tool. Show students a scenario, ask which dimension is missing, and have them predict what goes wrong.

### The Goodhart Problem Taxonomy

Three distinct mechanisms operate simultaneously in HITL systems:

1. **Reviewer-level Goodhart:** Reviewers optimize for the metric they're evaluated on (throughput → rubber stamping)
2. **Organization-level Goodhart:** Organizations optimize for the metric they report upward (% auto-processed → lower routing threshold without quality controls)
3. **Model-level Goodhart:** The model trains on reviewer behavior, silently absorbing whatever biases or gaming that behavior contains

**Teaching Tip:** Have students identify which level of Goodhart is at work in each example you discuss. All three can operate simultaneously and compound.

### The Divergence Trap vs. The Goodhart Problem

These are related but distinct:
- **Goodhart:** Measure becomes a target, gaming degrades true quality
- **Divergence Trap:** Optimizing short-term accuracy narrows the model's effective learning domain over time

The divergence trap can happen even when everyone is acting in good faith and optimizing correctly on the right metrics. It's a structural problem with self-improving systems that selectively learn from edge cases.

---

## Lecture Planning Guide

### 50-Minute Lecture Structure

#### Opening Hook (5 minutes)
**The 400-reviews-per-hour story**
- Tell the story from the chapter's opening
- Ask: "What metric should this company have tracked instead of throughput?"
- Don't answer yet — return at the end

**Key pedagogical move:** This story makes Goodhart's Law concrete before you name it.

#### Part 1: Why Accuracy Fails (10 minutes)
**Class imbalance and the 99% useless model:**
- Show: 1% fraud rate, model that labels everything "legitimate" → 99% accurate
- Compute: precision = undefined (divide by zero), recall = 0, F1 = 0
- Ask: "Why is F1 = 0 the right answer here?"

**Confusion matrix walkthrough:**
- Draw a 2x2 confusion matrix on the board
- Fill in with numbers from a fraud detection example
- Derive precision, recall, F1 together as a class

#### Part 2: The Seven Dimensions (15 minutes)
**Brief tour of all seven:**
- For each, give a one-sentence example of what happens if you don't track it
- Spend more time on calibration (most unfamiliar to students)

**Calibration deep dive (7 minutes):**
- Draw a perfect calibration line (the diagonal)
- Show an overconfident model curving below
- Connect to HITL routing: "If the model is overconfident, what cases are being auto-processed that shouldn't be?"

#### Part 3: Goodhart's Law in HITL (10 minutes)
**Name the law, show the three mechanisms:**
- Reviewer level, organization level, model level
- Return to the 400-reviews-per-hour story: which level(s) were operating?

**The divergence trap:**
- Short explanation of how optimizing short-term accuracy narrows long-term learning
- Key insight: "The hardest cases are where the model learns the most, but they're also the cases most likely to be pushed to human review and forgotten."

#### Part 4: A/B Testing for HITL Design (5 minutes)
**One key point:** HITL design decisions (routing thresholds, reviewer team size, feedback latency) can be experimentally evaluated — they're not fixed architectural choices.

**Design question:** "What would you randomly assign in an A/B test of two routing thresholds?"

#### Wrap-up (5 minutes)
- Return to opening question: seven dimensions to track instead of just throughput
- Assign "Try This" exercise

### 75-Minute Extended Session

**Add:**
- 10 minutes: Calibration ECE computation worked example (accessible calculation, no calculus required)
- 10 minutes: "Design a measurement framework" small group activity (see below)
- 5 minutes: Debrief and share across groups

---

## Discussion Questions by Level

### Introductory Level

1. **The Useless Classifier:** "A hospital uses an AI to flag high-risk patients. In a dataset where 2% of patients are truly high-risk, the AI flags nobody as high-risk. It achieves 98% accuracy. Is this a good model? What's wrong with using accuracy as the sole metric here?"

   *Expected response:* Precision and recall are both 0 (or undefined) for the positive class. The model never raises an alert, so no high-risk patient is caught. Accuracy is useless as a metric when classes are imbalanced.

2. **The Goodhart Scenario:** "A manager at a call center tells agents that their performance will be evaluated by how quickly they resolve customer complaints. Three weeks later, complaints are being closed faster than ever. But customer satisfaction scores have plummeted. What happened? How does this relate to HITL measurement?"

   *Expected response:* Agents optimized for the metric (speed) rather than the underlying goal (resolution quality). The metric became a target and ceased to be a good measure. The parallel in HITL: reviewers optimizing for throughput rubber-stamp uncertain cases.

3. **Calibration Intuition:** "A weather forecaster says 'I'm 80% confident it will rain tomorrow' on 100 different occasions. On how many of those occasions should it actually rain, if the forecaster is perfectly calibrated?"

   *Expected response:* About 80. The forecaster's stated confidence should correspond to empirical frequency.

4. **Pathway Decomposition:** "A content moderation system processes 10,000 posts per day. It auto-approves 9,200, auto-rejects 300, and routes 500 to human review. If the error rate on auto-approved posts is 1%, the error rate on auto-rejected posts is 5%, and the error rate on human-reviewed posts is 8%, what is the system-level error rate? Is the human review adding value?"

   *Expected response:* System error = (9200 × 0.01 + 300 × 0.05 + 500 × 0.08) / 10000 = (92 + 15 + 40) / 10000 = 1.47%. The human-reviewed cases have the highest error rate — but this is expected: they're the hardest cases. To know if humans add value, you'd need to know what the auto-decision error rate would have been on those same 500 cases.

### Intermediate Level

1. **Metric Gaming Design:** "You are designing a performance measurement system for a team of HITL reviewers. You want to incentivize quality without penalizing appropriate caution. Propose three metrics, explain what each captures, and explain how each could potentially be gamed."

2. **Feedback Latency Tradeoff:** "A medical imaging HITL system has a feedback loop latency of 3 days. A competing design has a 6-hour latency. What are the advantages and disadvantages of each? Under what conditions would the 3-day latency actually be safer?"

   *Expected response:* Shorter latency is generally better for model improvement, but accelerates the propagation of bad reviewer decisions. 3-day latency gives time to catch guideline errors or reviewer fatigue before they corrupt the model. The answer depends on the quality control processes in place.

3. **A/B Test Design:** "You want to test whether lowering the routing threshold (sending more cases to human review) improves system accuracy. Design an A/B test. What are the two arms? What outcome metric are you optimizing? What confounds must you control for? How will you determine the required sample size?"

4. **The Divergence Trap:** "A recruitment HITL system has been running for three years. The model handles 95% of applications automatically. The human review team reports that the cases they see are 'much harder' than they were two years ago. They suspect their own judgment is being used less reliably. What measurement data would you look at to diagnose whether the divergence trap is operating?"

   *Expected response:* Look at: reviewer agreement rate over time (declining?), calibration of the model on cases near the routing threshold, error rate on a random sample of auto-processed cases compared to three years ago, and whether the distribution of features in the human-reviewed caseload has shifted.

### Advanced Level

1. **Goodhart Formalization:** "Can you construct a formal model of the Goodhart mechanism in a HITL system? Define the reviewer's optimization problem, the model's learning objective, and show how optimizing one can degrade the other."

2. **Calibration and Fairness Intersection:** "A HITL system for loan approval has low ECE overall (0.03) but high ECE in the high-confidence bins for loan applications from minority applicants (0.18). What are the practical implications for the HITL routing design? What does this suggest about what the system is doing to these applicants?"

3. **Sequential Testing Design:** "You are running a live A/B test of two routing thresholds. Your legal team wants to stop the test as soon as significance is reached (to minimize exposure to the worse arm). Your statistician says this inflates the false positive rate. Design a stopping rule that satisfies both parties. What framework would you use?"

---

## Hands-On Activities

### Activity 1: Confusion Matrix Clinic (20 minutes)
**Setup:** Small groups, each receives a scenario card with classification task description and a confusion matrix

**Scenarios:**
- Spam filter (n=10,000, 40% base rate)
- Fraud detection (n=100,000, 0.1% base rate)
- Cancer screening (n=5,000, 3% base rate)
- Content moderation (n=50,000, 8% base rate)

**Task:** For each scenario, compute precision, recall, F1. Then answer: Is F1 the right metric here, or should it be $F_\beta$ with $\beta > 1$ or $\beta < 1$? Why?

**Debrief:** Focus on how the right metric depends on the cost asymmetry between false positives and false negatives.

### Activity 2: Design a Measurement Framework (25 minutes)
**Setup:** Groups of 3–4 students

**Assignment:** You are the data science lead for one of the following HITL systems:
- A resume screening system for a large employer
- A medical imaging triage system routing scans to radiologists
- A social media misinformation detection system
- A consumer loan approval system

**Deliverable:** Complete the seven-dimension measurement table for your system. For each dimension, specify: what you would measure, how you would collect the data, what threshold would trigger an alert.

| Dimension | Metric | Data Source | Alert Threshold |
|-----------|--------|-------------|-----------------|
| Model accuracy | | | |
| Calibration quality | | | |
| Human workload | | | |
| Time-to-decision | | | |
| Cost per decision | | | |
| Error rates by pathway | | | |
| Feedback loop latency | | | |

### Activity 3: Goodhart Autopsy (15 minutes)
**Setup:** Individual or pairs

**Prompt:** "A customer service AI system was deployed to classify customer complaints into 12 categories for routing to the right team. The system was evaluated on 'routing accuracy' (was the complaint sent to the right team?). After six months, routing accuracy was 91% — up from 82% at launch. But customer satisfaction scores declined, and average resolution time increased.

What went wrong? Diagnose the Goodhart problem at each of the three levels (reviewer, organization, model). What additional metrics should have been tracked?"

### Activity 4: A/B Test Design Challenge (20 minutes)
**Setup:** Pairs

**Prompt:** "A fraud detection HITL system currently routes the bottom 10% confidence transactions to human review. You want to test whether routing the bottom 15% improves overall accuracy without unacceptably increasing human workload.

Design the experiment: specify both arms, outcome metrics (primary and secondary), power analysis inputs, confound controls, and stopping rule. What result would make you recommend switching to 15%? What result would make you stick with 10%?"

---

## Assessment Strategies

### Formative Assessment

**Quick Polls:**
- "Which metric should you use for a cancer screening model: precision, recall, or F1? Why?"
- "A model's ECE is 0.02. Is this good or bad?"
- "True or False: Low ECE guarantees the HITL routing threshold is well-calibrated."
  (False — ECE can be low overall but high in the bins near the routing threshold)

**Exit Ticket:**
- "Name three metrics you would track for a HITL system at your company. For each, explain what it would tell you that accuracy alone would not."

### Summative Assessment Options

#### Option 1: Measurement Framework Paper (1,000 words)
**Prompt:** "Design a complete measurement framework for a HITL system of your choice. Your framework should address all seven dimensions, explain the rationale for each metric, identify three ways the measurements could be gamed, and propose safeguards."

**Rubric:**
- Framework Completeness (30%): All seven dimensions addressed with specific metrics
- Goodhart Awareness (25%): Genuine engagement with gaming vulnerabilities
- Safeguard Reasoning (25%): Practical, well-reasoned defenses against gaming
- Writing Quality (20%): Clear argument, specific examples

#### Option 2: Audit Report
**Prompt:** "You are auditing the measurement practices of a fictional HITL system described in [case study provided by instructor]. Identify the metrics currently tracked, identify which dimensions are missing, diagnose any Goodhart effects visible in the data, and recommend a revised measurement framework."

#### Option 3: Technical Implementation (advanced)
**Task:** Implement ECE computation and reliability diagram generation for a provided model output file. Assess calibration quality, apply temperature scaling, and evaluate improvement. Submit code and a 500-word analysis.

---

## Common Student Misconceptions

### Misconception 1: "High accuracy means the system is working"
**Response:** Walk through the class-imbalance example. A model predicting "all legitimate" on 99:1 fraud data achieves 99% accuracy and catches zero fraud.

### Misconception 2: "Human review always improves quality"
**Response:** Human reviewers add noise, have biases, and are subject to fatigue. The question is whether human review *net of these effects* improves quality compared to the model acting alone. This must be measured, not assumed.

### Misconception 3: "Goodhart's Law is about dishonest actors"
**Response:** Reviewers don't need to be dishonest to optimize for throughput — they're doing exactly what the incentive structure rewards. Goodhart operates through entirely rational behavior. The fault is in the measurement design, not the reviewers.

### Misconception 4: "Feedback loop latency should always be minimized"
**Response:** Short latency is generally better, but it accelerates propagation of errors. The tradeoff depends on the quality control processes applied before incorporating feedback. A fast feedback loop without quality controls can be worse than a slow one with them.

### Misconception 5: "A/B testing in HITL systems is like any other A/B test"
**Response:** Three complications: non-independence (same reviewers, correlated decisions), SUTVA violations (cases interact through shared review queues), and learning effects (model changes during the experiment). These require adaptations to standard methodology.

---

## Connections to Other Chapters

### Backward Links
- **Chapter 1:** Alert fatigue and the failure modes of HITL design (what we're now measuring)
- **Chapter 3:** Calibration connects to uncertainty quantification from the opening chapters
- **Chapter 11:** System design decisions that measurement now evaluates

### Forward Links
- **Chapter 13:** Human psychology affects the quality of feedback; measurement without psychology is incomplete
- **Chapter 14:** Fairness metrics are a specialized extension of the measurement framework introduced here

---

*This teacher's manual should be read alongside the Technical Appendix (12A), which provides the mathematical foundations for calibration metrics, confidence interval estimation, and A/B testing statistics referenced in the discussion questions.*
