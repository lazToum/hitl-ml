# Chapter 7 Teacher's Manual: Getting Good Information from People

*Complete instructional guide for teaching annotation science and label quality*

---

## Course Integration Guide

### Learning Objectives

By the end of this chapter, students will be able to:

**Knowledge (Remembering & Understanding):**
- Define inter-annotator agreement and explain why raw agreement is insufficient
- Compute and interpret Cohen's kappa and identify when to use Fleiss' kappa
- Describe at least three sources of systematic bias in annotation
- Explain what framing effects are and give two examples from annotation practice
- Distinguish between noise disagreement and genuine ambiguity in annotation data

**Application & Analysis:**
- Calculate Cohen's kappa for a given annotation matrix
- Design an annotation guideline that reduces framing-effect variance
- Identify the annotator demographic considerations relevant to a specific annotation task
- Compare crowdsourced vs. expert annotation trade-offs for a given use case

**Synthesis & Evaluation:**
- Design a complete annotation project including guideline, quality control, and calibration plan
- Evaluate an existing annotation dataset for potential sources of systematic bias
- Interpret low inter-annotator agreement and determine whether it signals quality failure or task ambiguity
- Propose appropriate label-handling strategies for tasks with irreducibly low agreement

### Prerequisites
- Chapter 1 (HITL fundamentals)
- Chapter 6 (interface design) recommended but not required
- Basic probability helpful; kappa formula requires algebra
- No programming prerequisite for main chapter; Appendix 7A requires Python for Dawid-Skene

---

## Key Concepts for Instruction

### The Core Insight: Labels Are Arguments

The chapter's central claim — that every label is an act of interpretation — is counter-intuitive to many students who come to machine learning with the assumption that training data is objective. Before introducing technical content, anchor this conceptually.

**Opening provocation:** Show students two photographs of the same protest. One photograph shows police in riot gear facing a crowd; the second shows the same moment from the other side, with protesters throwing objects. Ask: if these were social media posts, would you label them as "violent content"? What information do you need to decide? Whose perspective are you adopting?

The exercise reveals that the label is not a property of the image. It is a property of the relationship between the image and the labeling criteria, the context, and the worldview of the labeler.

### The Kappa Framework

Kappa is the chapter's central technical tool. Introduce it in three steps:

1. **Why raw agreement fails:** The spam filter example — if 95% of emails are legitimate and the classifier labels everything "legitimate," it achieves 95% accuracy while doing nothing useful.

2. **What kappa measures:** Agreement beyond chance. Show with a numerical example (see Activity 1).

3. **What kappa hides:** Kappa is an average across all annotators and all items. Low aggregate kappa can mask high agreement on easy items and systematic disagreement on hard items. Kappa does not reveal *where* disagreement occurs — only *how much*.

### The Four Sources of Label Variation

Use this organizing framework throughout the chapter:

| Source | Example | Mitigation |
|--------|---------|------------|
| **Instruction variation** | "Toxic" vs. "Would reasonable person find toxic" | Iterative guideline revision |
| **Annotator background** | AAVE toxicity labeling by non-AAVE speakers | Demographically matched annotator pool |
| **Sequence effects** | Items look milder after seeing extreme cases | Randomized item ordering |
| **Fatigue effects** | Quality degrades after ~150–200 items | Session length limits, breaks |

---

## Lecture Planning Guide

### 50-Minute Lecture Structure

#### Opening (5 minutes)
**The ImageNet story**

Show Li's 2010 TED Talk clip (available on TED.com) — the first 2–3 minutes describing what ImageNet is. Then fast-forward to 2019 and the gender stereotype findings. Ask: "What went wrong, and when?"

Key insight: nothing "went wrong" in the sense of a mistake. The labels were accurate. The problem was structural: the annotation process faithfully recorded the world as the annotator pool experienced it, and that experience was culturally specific.

#### Part 1: The Instruction Problem (12 minutes)

Present the toxicity framing comparison:
- "Is this toxic?"
- "Would a reasonable person find this toxic?"

Ask students to label the same 5 comments under each framing (on paper). Compare results in the room. Usually produces visible divergence on 2–3 of the 5 items.

Introduce the concept of the *calibration session* — the industry practice for working through these divergences systematically.

Key teaching point: guideline wording is not just communication. It specifies the cognitive task. Different wordings are different tasks.

#### Part 2: Measuring Agreement (12 minutes)

Walk through the kappa formula step by step, using the 2×2 confusion matrix from Activity 1.

Emphasize: $P_e$ is the tricky part. Many students confuse kappa with raw agreement. The chance-correction is the whole point.

Introduce the Landis-Koch scale. Note that the interpretation thresholds are conventional, not theoretically grounded — kappa of 0.60 in one domain may represent very good performance while kappa of 0.60 in another domain may be inadequate.

Preview Fleiss' kappa for multiple annotators — introduce the concept without the full formula (covered in Appendix 7A).

#### Part 3: The Annotator Is Not a Recording Device (13 minutes)

Three examples of systematic annotator-induced variation:

1. **Sequence effects** — the Callison-Burch machine translation quality study. Same translation, different rating depending on what surrounds it. Ask: "What does this mean for how we should design annotation task queues?"

2. **Demographics** — the AAVE toxicity study by Sap et al. Ask: "If you were building a toxicity classifier for a platform used by a large AAVE-speaking community, what would you want the annotator pool to look like?"

3. **Fatigue** — quality degradation curve. Introduce the idea of session length limits (connects to Chapter 6's cognitive load discussion).

#### Wrap-up (8 minutes)

Return to the central question: what is low kappa telling you?

Two interpretations:
1. Quality failure — annotators are not applying the guidelines consistently
2. Task ambiguity — the categories don't cleanly accommodate the data

Discuss how you would distinguish between these. (Answer: bring annotators together for calibration sessions; if calibration improves agreement, it was quality failure. If calibration reveals genuine conceptual disagreement, it's task ambiguity.)

Assign the "Try This" exercise.

### 75-Minute Extended Session

**Add:**

#### Dawid-Skene vs. Majority Vote (10 minutes)
Walk through the intuition of the Dawid-Skene model: some annotators are more reliable than others; we can estimate annotator quality from the data itself. Show how majority voting ignores this information.

#### Hands-On Kappa Calculation (5 minutes)
Students compute kappa from a provided confusion matrix (see Activity 1). This is the single most important technical skill from this chapter.

---

## Discussion Questions by Level

### Introductory Level

1. **Framing recognition:** "Two annotation teams are labeling the same social media posts. Team A is asked: 'Is this post offensive?' Team B is asked: 'Would this post make a member of the target group feel unsafe?' How might their label distributions differ? Which framing do you think would produce higher inter-annotator agreement, and why?"

2. **Kappa intuition:** "A spam filter labels 100 emails. 90 are legitimately not spam; the filter labels them all as not spam. It gets 90% accuracy. A more careful filter labels 80 of the 90 correctly as not spam, and 8 of the 10 spam emails correctly. What is the accuracy of the second filter? Which filter is actually better? Why does accuracy alone not tell you the answer?"

3. **Demographics and annotation:** "A large tech company is building a content moderation system for its global platform. The annotation team is based in San Francisco and consists predominantly of 25–35 year old Americans. What categories of content might this team systematically over- or under-label as harmful? How would you design a more representative annotation process?"

4. **ImageNet critique:** "The ImageNet dataset was built with great care and was, by any standard, a technical achievement. Yet it encoded cultural stereotypes into its labels. Was this a failure of the annotation process? How could it have been done differently?"

### Intermediate Level

1. **Kappa computation:** (Provide a 3×3 annotation matrix for three categories.) "Compute Cohen's kappa. Interpret the result. What additional information would you want before deciding whether to proceed with model training?"

2. **Annotation project design:** "You have been asked to build an annotation dataset for classifying online reviews as 'authentic' or 'fake.' Design the annotation guideline, quality control process, and calibration plan. What kappa would you require before releasing the dataset?"

3. **Disagreement analysis:** "Your annotation team achieves kappa = 0.42 on a hate speech classification task after two rounds of guideline revision. Calibration sessions have already been conducted. What are the possible explanations? How would you determine which explanation is correct? What would you do in each case?"

4. **Crowdsourcing trade-off:** "You have a budget of $10,000 to annotate 50,000 comments for toxicity. Expert annotators cost $5/comment but achieve kappa = 0.78. Crowdworkers cost $0.05/comment but achieve kappa = 0.52. Using a 3-annotator majority vote, what is the effective quality of each approach? What is the maximum coverage of each within budget?"

### Advanced Level

1. **Dawid-Skene properties:** "Under what conditions does majority voting converge to the same result as Dawid-Skene? Under what conditions do they diverge most significantly? What empirical evidence would you need to decide which method to use?"

2. **Label distribution training:** "A recent research direction uses the full distribution of annotator labels for training rather than majority-vote labels. Under what conditions would this produce better-calibrated models? Under what conditions might it produce worse models? Design an experiment to test this."

3. **Cultural annotation ethics:** "An AI company is building a hate speech classifier for deployment in 40 countries. The annotation budget allows for annotators in 5 countries. Propose a framework for deciding which 5 countries to include in the annotator pool, and what quality tradeoffs you are making. Consider both practical and ethical dimensions."

---

## Activities

### Activity 1: Kappa Calculation Workshop (20 minutes)

**Provide students with this annotation table:**

50 social media posts labeled by two annotators:

| | Ann 2: TOXIC | Ann 2: NOT TOXIC |
|--|-------------|-----------------|
| **Ann 1: TOXIC** | 12 | 8 |
| **Ann 1: NOT TOXIC** | 5 | 25 |

**Tasks:**
1. Compute $P_o$ (observed agreement)
2. Compute $P_e$ (expected chance agreement)
3. Compute $\kappa$
4. Interpret using Landis-Koch scale
5. Compute a 95% confidence interval
6. Is this kappa sufficient to proceed with model training? (Answer: depends on task and stakes)

**Solution:** $P_o = 0.74$, $P_e = 0.49$, $\kappa = 0.49$, CI = [0.32, 0.66]. Moderate agreement.

### Activity 2: Annotation Guideline Design (25 minutes)

**Setup:** Students work in pairs.

**Task:** Write a 1-page annotation guideline for the following task: "Label whether a product review on an e-commerce site was written by a real customer or is fake/planted."

**Requirements:**
- Define the categories clearly
- Provide at least 3 positive examples with explanations
- Provide at least 3 negative examples with explanations
- Identify at least 2 borderline cases and explain how to handle them
- Anticipate and address one major framing effect

**Swap and cross-label:** Each pair exchanges their guideline with another pair. Both pairs label the same 10 sample reviews using the other pair's guideline.

**Compute kappa** between the two pairs for the 10-item test.

**Debrief:** Where did disagreement occur? Was it predicted by the guideline's anticipated borderline cases?

### Activity 3: Demographic Blind Spot Analysis (15 minutes)

**Setup:** Provide students with 10 short text snippets (tweets, comments, forum posts) that mix:
- Standard English offensive content
- AAVE-language content that appears offensive out of context but is positive/neutral in context
- Formal English content that is harmful but politely phrased

**Task:** Label each as TOXIC or NOT TOXIC, without discussion.

**Debrief:** Compare labels across the room. Identify systematic patterns. Which items produced the most disagreement? Were the AAVE items disproportionately flagged? What does this tell us about annotator pool composition requirements?

---

## Assessment Strategies

### Formative

**Quick kappa problem:** Give students a 2×2 annotation matrix in the last 5 minutes. Ask them to compute kappa and interpret it. This is the core technical skill.

**Exit ticket:** "Name one source of systematic bias in annotation that cannot be fixed by better guidelines. How would you address it?"

### Summative Options

#### Option 1: Annotation Audit Paper (800 words)
Choose a publicly available labeled dataset (e.g., a Kaggle competition dataset, a HuggingFace dataset). Research how it was annotated. Identify two potential sources of systematic bias in the annotation process. Propose specific changes to the annotation methodology that would reduce each bias.

**Rubric:**
- Dataset research quality (25%)
- Bias identification with evidence (35%)
- Quality of proposed improvements (25%)
- Writing clarity (15%)

#### Option 2: Annotation Project Design
Design an annotation project for a specified task. Deliverables: complete annotation guideline (1–2 pages), quality control plan (including kappa targets), calibration session design, and annotator pool specification (demographics, expertise, size, selection rationale).

#### Option 3: Kappa Analysis
Given a real annotation dataset with per-annotator labels (available from the ACL Anthology or other sources), compute per-pair kappa, identify which annotators are outliers, propose which items should be re-annotated, and estimate what the aggregate kappa would be after removing the 10% most contested items.

---

## Common Misconceptions

### "More annotators always gives better labels"
**Correction:** More annotators reduces noise from individual annotator errors, but it amplifies systematic biases shared by the annotator pool. If all annotators are demographically similar, doubling the pool reinforces the pool's shared blind spots. Quality and diversity both matter.

### "Kappa below 0.60 means the annotation is useless"
**Correction:** Kappa thresholds are domain-specific. A kappa of 0.50 for a fine-grained emotion classification task with 8 categories may be perfectly acceptable. A kappa of 0.70 for a binary medical diagnosis task may be dangerously insufficient. Always interpret kappa in the context of the task and its downstream use.

### "Label noise can always be reduced with better guidelines"
**Correction:** Some tasks have irreducible ambiguity because the categories don't map onto stable psychological distinctions. Forcing higher agreement by making the guideline prescriptive can push annotators into artificial agreement that masks genuine uncertainty — and produces models that are overconfident on genuinely ambiguous inputs.

### "Crowdworkers are less reliable than experts"
**Correction:** For well-defined, objective tasks (image classification, named entity tagging, transcription), crowdworkers with multiple-annotator quality control can match expert accuracy. For subjective, domain-specific tasks (medical diagnosis, legal classification, cultural nuance), expert annotators are genuinely superior. The task determines the appropriate annotator type.

---

## Sample 50-Minute Lesson Plan

| Time | Activity | Materials |
|------|----------|-----------|
| 0:00–0:05 | ImageNet story + opening question | Li TED Talk clip |
| 0:05–0:17 | Instruction problem demo + framing comparison | 5 sample comments, paper |
| 0:17–0:29 | Kappa formula + worked example | Kappa worksheet |
| 0:29–0:42 | Annotator variation examples: sequence, demographics, fatigue | Slides with AAVE study data |
| 0:42–0:47 | Low kappa = quality failure OR task ambiguity? | Discussion |
| 0:47–0:50 | Assign Try This, preview Ch. 8 | Chapter handout |
