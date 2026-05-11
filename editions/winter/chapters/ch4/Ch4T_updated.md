# Chapter 4 Teacher's Manual: From Confusion to Decision

*Complete instructional guide*

---

## Learning Objectives

By the end of this chapter, students will be able to:
- Explain the distinction between a probability and a decision, and why a threshold is required
- Describe Type I and Type II errors and the inherent tradeoff between them
- Apply cost asymmetry reasoning to justify threshold settings in real domains
- Identify when threshold-setting is a value judgment and when it is a technical question
- Design HITL bands appropriate for a given error cost structure

## Suggested 50-Minute Lecture Structure

### Minutes 0-8: Opening — The Paramedic
Open with the paramedic/surgery contrast. Ask: "Why do paramedics start CPR without a definitive diagnosis, but surgeons require extensive workup before operating?" Draw out the cost asymmetry: missing a true arrest is fatal; unnecessary CPR on someone who recovers on their own carries lower cost. The threshold is set differently in each case — deliberately.

### Minutes 8-18: Probability Is Not Decision
Draw the distinction clearly: the model produces a number. A human (or human-designed rule) turns that number into an action. The threshold is that rule. Demonstrate with the spam filter: if the threshold is 0.5, an email with P(spam) = 0.49 goes to inbox. An email with P(spam) = 0.51 goes to spam. One point of probability separates them. Is that the right line?

Walk through what happens when you lower or raise the threshold systematically. Use a concrete confusion matrix on the board.

### Minutes 18-30: The Two Mistakes and the Dial
Introduce Type I / Type II with real examples that make the cost asymmetry vivid:
- Medical screening: missing cancer vs. unnecessary biopsy
- CPS algorithms: missing abuse vs. traumatic false investigation
- Email spam: blocking legitimate email vs. missing phishing

Key argument: the dial (threshold) trades one type of error for the other. You cannot minimize both. The question of where to set the dial requires knowing which error costs more. That knowledge comes from domain expertise and value judgment, not from the data.

### Minutes 30-40: The HITL Band
Introduce the two-threshold system: the band between "clearly yes" and "clearly no." Cases in the band go to human review. Demonstrate how adjusting the band width changes: review volume, false negative rate, false positive rate. The trade-off is reviewer workload vs. autonomous error rate.

Use the banking fraud example: the band is calibrated to the fraud analyst team's capacity. When capacity drops (holiday staffing), the band narrows. When a new attack pattern appears, the band expands. The threshold is not static.

### Minutes 40-48: Hidden Value Judgments
The chapter's ethical argument: threshold setting embeds value judgments. Work through the credit scoring example. Who decides the acceptable rate of denying legitimate applicants? That choice has real distributional consequences. The pretense that it's a "technical parameter" obscures this.

Class discussion (5 min): "Name a domain where you think false positives are more costly than false negatives. Name one where the reverse is true. Do these cost judgments reflect values? Whose values?"

### Minutes 48-50: Close and Try This

---

## Discussion Questions by Level

### Introductory
1. A smoke detector is set to a low threshold — it alarms on very low smoke concentrations. What are the consequences of this setting? Would you set it differently for a hospital vs. a warehouse?
2. A job application screening algorithm is set to a threshold of "top 30% of applicants." If the company changes its hiring strategy to be more selective, should the threshold change? Who makes that decision?
3. What is the difference between "the model thinks this email is 70% likely to be spam" and "this email is spam"? Why does that difference matter?

### Intermediate
4. A cancer screening AI has AUC = 0.95. Two hospitals set different thresholds: Hospital A sets τ = 0.3 (aggressive), Hospital B sets τ = 0.6 (conservative). Describe the expected outcomes for each hospital in terms of detection rates and unnecessary biopsies. Which threshold would you recommend? On what basis?
5. Explain why a HITL band system (two thresholds) is generally preferable to a single-threshold system for high-stakes applications. What determines the optimal width of the band?
6. The Allegheny Family Screening Tool (AFST) assigns risk scores to children in the child welfare system. Critics argue that the threshold at which a child is flagged for investigation should be set by social workers with lived experience of family disruption, not by data scientists. Evaluate this argument using the concepts from this chapter.

### Advanced
7. Derive the optimal threshold formula τ* = C_FP · P(y=0) / (C_FP · P(y=0) + C_FN · P(y=1)) from first principles using expected cost minimization. Explain what happens to τ* as C_FN/C_FP → ∞.
8. In a multi-class classification system (not binary), the concept of a threshold becomes a threshold surface in probability simplex space. How would you design a HITL band for a 3-class system? What cases would go to human review?

---

## Common Misconceptions

**"Setting the threshold at 0.5 is the default correct answer."**
0.5 is optimal only when the classes are balanced and the costs of each error type are equal. For most real applications, neither condition holds. Emphasize that 0.5 is a choice with consequences, not a natural starting point.

**"Higher accuracy = better threshold."**
Accuracy is a single number that averages across both error types. A system optimized for accuracy on an imbalanced dataset may achieve 99% accuracy by always predicting the majority class — and catching 0% of the rare events that matter. Use precision, recall, and F-score appropriate to the cost structure.

**"The threshold is a technical decision."**
This is the chapter's core corrective. The threshold embeds a value judgment about which error costs more. This judgment is often political, ethical, and distributional. It belongs in a deliberative process, not in an engineer's code commit.

---

## Assessment

**Short answer:** "Explain the tradeoff between Type I and Type II errors using a real example. How does cost asymmetry determine the optimal threshold setting?"

**Case analysis:** "You are designing the content moderation system for a social media platform. The platform serves users in 50 countries with different legal standards for hate speech. Describe: (a) why a single global threshold is problematic; (b) the considerations that would go into setting country-specific thresholds; (c) who should be involved in those threshold decisions."

---
