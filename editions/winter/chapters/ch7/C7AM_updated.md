# Chapter 7 Solutions Guide: Exercise Solutions and Answer Keys

*Complete solutions for all discussion questions, activities, and appendix exercises*

---

## Discussion Question Solutions

### Introductory Level Solutions

#### Question 1: Framing Comparison
**Prompt:** "Team A: 'Is this offensive?' vs. Team B: 'Would a reasonable person find this unsafe?' How do label distributions differ? Which framing produces higher kappa?"

**Model Answer:**

**Predicted label distribution differences:**

Team A ("offensive") anchors annotators on their personal reaction. This produces:
- Higher variance in thresholds (everyone has different sensitivity)
- More positive labels (individual offense thresholds are typically lower than "reasonable person" thresholds)
- Label rates track annotator demographics more strongly

Team B ("reasonable person") anchors annotators on a shared hypothetical standard. This produces:
- Lower variance in thresholds (the hypothetical standard moderates individual variation)
- Fewer positive labels (the reasonable person standard invokes a social consensus rather than individual reaction)
- More consistent labels across annotator demographics

**Which produces higher kappa?**

Team B, for most annotation tasks. The "reasonable person" standard reduces $\sigma_\theta^2$ (threshold variance across annotators), which directly reduces disagreement and increases kappa. Published studies consistently find kappa gains of 0.05–0.15 when moving from personal-reaction to reasonable-person framings.

**Caveat:** The "reasonable person" standard has its own limitation — it implicitly represents the perspective of whoever is imagined as the "reasonable person," which is often a member of a cultural majority. For tasks where the "reasonable person" is culturally specific (e.g., labeling content for a specific cultural community), a more effective framing is "would a member of [specific group] find this harmful."

**Grading:**
- **Excellent:** Predicts both distribution direction and kappa direction with reasoning grounded in threshold variance
- **Good:** Correct direction for kappa; basic reasoning
- **Satisfactory:** Recognizes the framings differ without specifying direction
- **Needs improvement:** No substantive comparison

---

#### Question 2: Spam Filter Accuracy vs. Kappa
**Prompt:** Compare two spam filters for accuracy.

**Worked computation:**

**Filter 1 (label everything legitimate):**
- 90 legitimate emails, all correctly labeled
- 10 spam emails, all incorrectly labeled as legitimate
- Accuracy: 90/100 = 90%

**Filter 2 (more careful):**
- 80/90 legitimate emails correctly labeled as legitimate
- 8/10 spam emails correctly labeled as spam
- Total correct: 80 + 8 = 88
- Accuracy: 88/100 = 88%

**Filter 2 is better despite lower accuracy** because it is doing something useful (catching spam), while Filter 1 is doing nothing useful (just saying "everything is fine").

**Why accuracy doesn't tell you:** Filter 1's 90% accuracy is almost entirely from the base rate (90% legitimate emails). Kappa corrects for this:

For Filter 1: $\kappa = 0$ (agreement no better than chance — it's not making any real classifications)

For Filter 2: Computing $P_o$, $P_e$, $\kappa > 0$ (it's making genuine discriminations)

**Teaching moment:** This is the exact problem that Cohen's kappa was designed to solve. Accuracy is misleading when class distributions are imbalanced.

---

### Intermediate Level Solutions

#### Kappa Computation Problem
**Given annotation matrix (from Activity 1):**

|  | Ann 2: T | Ann 2: N |
|--|----------|----------|
| **Ann 1: T** | 12 | 8 |
| **Ann 1: N** | 5 | 25 |

**Complete solution:**

$N = 50$

$P_o = (12 + 25)/50 = 37/50 = 0.74$

Row marginals (Annotator 1): 
- T: 20/50 = 0.40
- N: 30/50 = 0.60

Column marginals (Annotator 2):
- T: 17/50 = 0.34
- N: 33/50 = 0.66

$P_e = (0.40 \times 0.34) + (0.60 \times 0.66) = 0.136 + 0.396 = 0.532$

$\kappa = (0.74 - 0.532)/(1 - 0.532) = 0.208/0.468 = 0.444$

**Interpretation:** Moderate agreement (Landis-Koch scale). Approximately 44% of the non-chance agreement was achieved.

**95% Confidence Interval:**

$\text{Var}(\kappa) = \frac{0.74(1-0.74)}{50(1-0.532)^2} = \frac{0.1924}{50 \times 0.219} = \frac{0.1924}{10.95} = 0.01758$

$\text{SE}(\kappa) = \sqrt{0.01758} = 0.133$

CI: $0.444 \pm 1.96 \times 0.133 = [0.183, 0.705]$

**Decision:** The kappa of 0.44 is moderate, and the confidence interval is wide. Before proceeding to model training:
1. Conduct a calibration session to identify *where* the disagreements occur
2. Determine if disagreement is on genuinely ambiguous items (task ambiguity) or on items that should be clear (quality failure)
3. For a high-stakes task (e.g., content moderation affecting user accounts), this kappa is likely insufficient; target ≥ 0.60
4. For an exploratory analysis, it may be acceptable with documented limitations

---

#### Annotation Project Design Solution
**Task:** Fake vs. authentic product review annotation.

**Sample Strong Guideline Structure:**

**POSITIVE (Authentic) indicators:**
1. Specific product details that only a real user would know ("the third button from the left is hard to press")
2. Temporal references consistent with purchase timing ("bought this for Christmas, used it every day since")
3. Mixed sentiment — real users typically find both pros and cons
4. Plausible use case described in detail

**NEGATIVE (Fake) indicators:**
1. Excessive generic praise with no specific details
2. Language inconsistent with the product category's typical buyer
3. Account with only 5-star reviews, all posted in short windows
4. Identical or near-identical language to other reviews for the same product

**Borderline cases (with resolution rules):**
1. *Brief but specific review:* "Works great. Batteries last 3 weeks." → Classify as AUTHENTIC (specificity present even if brief)
2. *Detailed but suspicious timing:* Very detailed review posted day of purchase → Classify as UNCERTAIN, flag for secondary review

**Expected kappa:** Target ≥ 0.65 for this task. After calibration, 0.70 is achievable for clear cases; borderline rate of ~15% will pull aggregate kappa to 0.62–0.68.

**Key framing issue addressed:** "Fake" is ambiguous — it could mean (a) paid by manufacturer, (b) written by the seller, or (c) not based on real product experience. The guideline must choose one definition or create multiple labels.

---

### Advanced Level Solutions

#### Label Distribution Training
**When would distribution training outperform majority vote?**

**Better:**
- When items with high annotator disagreement appear at inference time (calibration benefit: model correctly uncertain on uncertain inputs)
- When downstream use cases require uncertainty estimates (medical, legal applications)
- When annotator pool is diverse and disagreements reflect genuine ambiguity rather than noise
- When the tail of the label distribution contains information (e.g., 1/5 annotators flagging an item might indicate a legitimate minority concern)

**Worse:**
- When annotator pool is small and disagreements are dominated by individual noise
- When the task has a single correct answer (NER, factual QA) and disagreements are errors
- When the downstream model must output a single binary decision and soft labels produce calibration artifacts

**Empirical test design:**
- Hold-out set with 500 items and gold standard labels (e.g., from expert review of resolved disagreements)
- Train two models: one on majority vote labels, one on label distributions (e.g., via soft-label cross-entropy loss)
- Compare on gold standard accuracy AND calibration (ECE) for the high-disagreement subset
- The distribution model should show better ECE on high-disagreement items even if aggregate accuracy is similar

---

## Activity Solutions

### Activity 1: Kappa Calculation — Grading Guide

**Correct computation:**
- $P_o = 0.74$ ✓
- $P_e$: Students frequently miscalculate this. Check that they use marginal proportions, not counts.
- $\kappa = 0.444$ ✓
- CI: $[0.183, 0.705]$ ✓ (accept small rounding errors)

**Common errors:**
1. Using raw counts rather than proportions for $P_e$ — produces $P_e$ > 1.0 (impossible)
2. Using row marginals from both annotators as if they are the same annotator
3. Interpreting $\kappa = 0.44$ as "44% agreement" (it is "44% of possible non-chance agreement achieved")

**Grading:**
- Full credit: Correct $P_o$, $P_e$, $\kappa$, correct interpretation, meaningful decision recommendation
- Partial credit: Correct formula application with one arithmetic error; correct interpretation
- No credit: Confuses kappa with raw agreement; cannot apply formula

---

### Activity 2: Guideline Exchange — Evaluation Criteria

**Strong guideline characteristics:**
- Categories are defined with necessary and sufficient conditions, not just examples
- Borderline cases are anticipated and resolved explicitly
- The framing question specifies whose perspective the annotator should adopt
- Instructions are achievable without additional background knowledge

**Common quality issues:**
- Guidelines that only give positive examples (annotators have no guidance on negative space)
- Guidelines that assume cultural knowledge ("you'll know it when you see it")
- Overly prescriptive guidelines that create artificial agreement on genuinely ambiguous items

**Kappa benchmark for exchange activity:**
- Expect kappa of 0.40–0.65 for most student-written guidelines on the 10-item test
- Kappa below 0.40 on 10 items usually indicates a fundamental ambiguity in the guideline definition
- Have each pair identify one change to their guideline that they believe would have prevented the top disagreement

---

## Quick Reference: Common Student Questions

### "Couldn't we just have AI annotate the data?"
Using AI to generate labels for AI training creates a closed loop that amplifies whatever biases and errors are in the original model. This is specifically the concern about "model collapse" — when models are trained on AI-generated data, performance degrades over generations. For initial training data, human annotation from real human judgments is required. AI can assist annotation (e.g., by pre-labeling for human review) but cannot replace the human foundation.

### "If annotators always disagree, why bother?"
Low agreement is not uniform across items. Annotators typically agree strongly on easy, clear cases and disagree on genuinely difficult ones. The goal is not to achieve perfect agreement overall, but to (a) reach sufficient agreement on clear cases to train on them, (b) identify the hard cases that need special treatment (more annotators, expert review, or explicit treatment as uncertain), and (c) document the disagreement so downstream model consumers understand the limits of the training data.

### "Is it unethical to pay annotators $0.05/label on Mechanical Turk?"
This is a genuine ethical issue in the field that the chapter does not fully resolve. Mechanical Turk piece rates often translate to below-minimum-wage earnings when annotation time is properly accounted for. Many researchers and companies are moving toward minimum-wage-floor payment models. The ethical dimension of annotation labor — who does it, under what conditions, for what pay — is increasingly recognized as part of responsible AI development practice.
