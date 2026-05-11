# Chapter 6 Solutions Guide: Exercise Solutions and Answer Keys

*Complete solutions for all discussion questions, activities, and appendix exercises*

---

## Discussion Question Solutions

### Introductory Level Solutions

#### Question 1: COMPAS Interface Design
**Prompt:** "What information would a judge need to evaluate whether a COMPAS risk score is reliable? What would a good interface look like?"

**Model Answer:**

To evaluate reliability, a judge would need:
1. **Feature transparency:** Which inputs drove the score? Age, prior record, neighborhood, demographics?
2. **Uncertainty bounds:** Not a single score but a confidence interval — is this 67 ± 5 or 67 ± 25?
3. **Base rate context:** What does this score mean? "High risk" relative to what baseline population?
4. **Model validation data:** How accurate is this model on the specific demographic group and offense type before the judge?
5. **Documented failure modes:** Known situations where the model performs poorly

**Good interface elements:**
- Present score as a range, not a point: "This defendant's risk score falls in the 60–75 range (upper third)"
- Show the top three features that drove the score
- Provide a plain-language statement of uncertainty: "This score correctly predicted recidivism in 65% of similar cases in the validation dataset"
- Require a structured acknowledgment: "This score is one input, not a recommendation"
- Make it easy to document if the judge gives the score little weight (one click, not an essay)

**Grading criteria:**
- **Excellent:** Addresses both transparency and uncertainty; proposes specific interface elements; considers the judge's workflow and cognitive load
- **Good:** Covers either transparency or uncertainty thoroughly; some interface elements proposed
- **Satisfactory:** Names information needs without translating to interface design
- **Needs improvement:** Simply argues against algorithmic scoring without engaging with design

**Common student errors:**
- Proposing to eliminate the tool entirely (misses the design question)
- Proposing a wall of text explanation (misses cognitive load constraints)

---

#### Question 2: Automation Bias Mechanism
**Prompt:** "The Vanderbilt study found AI assistance caused radiologists to miss cancers they caught without AI. How is this possible?"

**Model Answer:**

The mechanism is automation bias through the anchor-adjustment process:

When a radiologist sees the AI recommendation before or while reviewing the scan, it functions as a cognitive anchor. The radiologist's judgment then adjusts from that anchor rather than reasoning from first principles. If the AI's false-negative recommendation is plausible — if the image is genuinely ambiguous and the AI's "low malignancy" reading could be correct — the radiologist's adjustment away from the anchor is insufficient.

In the Vanderbilt study, the radiologists were not being careless. They were responding to a confident-seeming authoritative recommendation (the AI output) in the same way humans respond to expert second opinions. When we hear "this looks normal" from a credible source, we look for evidence that confirms this reading and process disconfirming evidence less thoroughly.

The key conditions that make this more likely:
- **AI presents high confidence** — a "8% malignancy" score in green text is persuasive
- **Reviewer is fatigued** — the adjustment coefficient $\alpha$ degrades with fatigue
- **The AI error is plausible** — easy to miss errors are easy to confirm

**What a better interface would have done:**
- Required the radiologist to record their independent finding before showing AI output
- Flagged uncertain cases visually as requiring independent judgment
- Presented the AI as a second opinion, not a prior assessment

**Grading criteria:**
- **Excellent:** Names anchoring mechanism specifically; explains why it applies to expert reviewers; proposes specific design fix
- **Good:** Explains the general mechanism; identifies some design implications
- **Satisfactory:** Identifies that the AI recommendation interfered with independent judgment
- **Needs improvement:** Attributes the finding to "laziness" or "low-quality radiologists"

---

#### Question 3: Click Economics
**Prompt:** "400 posts per day, 14 seconds mechanical overhead vs. 5 seconds. What is the effect? Does it matter?"

**Model Answer:**

**Quantitative analysis:**

Time saved per post: 14 − 5 = 9 seconds
Total mechanical time saved per session: 400 × 9 = 3,600 seconds = 60 minutes

At 47 seconds per post with 14-second overhead:
- Judgment time per post: 47 − 14 = 33 seconds
- Total judgment time per session: 400 × 33 = 13,200 seconds

At 47 seconds per post with 5-second overhead (same total time):
- Judgment time per post: 47 − 5 = 42 seconds (+27%)
- **OR** same judgment quality per post, complete 540 posts in the same time (+35% throughput)

**Does it matter?**

Yes, for three reasons:

1. **Throughput:** The platform's moderation backlog is directly affected by throughput. A 35% increase in review capacity is significant.

2. **Quality degradation timing:** Using the cognitive fatigue model from Appendix 6A, with $\lambda_q = 0.005$:
   - At 14-second overhead: quality drops below 0.85 threshold at approximately item 139
   - At 5-second overhead: the drop occurs later, because germane cognitive load is higher per item and fatigue accumulates more slowly

3. **Legal and regulatory exposure:** Content moderation errors have real-world consequences. Platforms are increasingly subject to regulatory audits. Interface-driven quality degradation produces evidence of systemic failure.

**Grading criteria:**
- **Excellent:** Quantitative calculation + cognitive load argument + real-world consequences
- **Good:** Calculation correct; at least one non-quantitative argument
- **Satisfactory:** Recognizes the time saving is significant without full calculation
- **Needs improvement:** "Yes it matters" without reasoning

---

### Intermediate Level Solutions

#### Framework Application: COMPAS Five-Dimension Analysis
**Prompt:** "Apply the five-dimension framework to the COMPAS sentencing tool. Identify the weakest dimension."

**Complete Framework Analysis:**

| Dimension | Rating | Analysis |
|-----------|--------|---------|
| **Uncertainty Detection** | 1/5 | No uncertainty is communicated. Score is a point estimate with no confidence interval or validation accuracy displayed. |
| **Intervention Design** | 1/5 | No intervention mechanism. The score is presented as information, not as a prompt for judgment. No structured way to document reliance or disagreement. |
| **Timing** | 3/5 | Score is provided at pre-sentencing, which is an appropriate moment. The judge does have time to consult other information. |
| **Stakes Calibration** | 2/5 | The stakes are explicitly high (liberty), but the interface treats the score as routine information rather than a high-stakes recommendation requiring special scrutiny. |
| **Feedback Integration** | 1/5 | No feedback mechanism. Judicial outcomes are not systematically fed back to the model developer. No mechanism for the judge to report model error. |

**Weakest dimension:** Uncertainty Detection and Feedback Integration are tied. Both receive 1/5.

**Highest-impact improvement:** Uncertainty Detection. Adding a confidence interval and validation accuracy for the specific demographic group would immediately change how judges interpret the score. A judge who knows the model is 65% accurate on cases like this one will weight it differently than a judge who sees a clean integer score.

**One specific interface change:** Replace "Risk Score: 7" with:

```
Estimated Recidivism Risk: Moderate-High
Score range for this case: 63–74 (percentile of similar defendants)
Model accuracy for this demographic/offense type: 64% (validation data, 2019–2022)
This score is one input among many. Document your weighting below.
[ ] Relied heavily  [ ] Weighted equally with other information  
[ ] Gave little weight  [ ] Disregarded
```

**Grading criteria:**
- **Excellent:** All five dimensions analyzed with specific evidence; weakest dimension identified with justification; proposed improvement is specific and actionable
- **Good:** All five dimensions addressed; weakness identified; improvement proposed
- **Satisfactory:** Most dimensions covered; weakness identified without strong justification
- **Needs improvement:** Framework applied superficially; no specific improvement proposed

---

### Advanced Level Solutions

#### Safety Case Analysis
**Prompt:** "Write a technical post-mortem for the hospital whose diagnostic accuracy declined after AI deployment."

**Sample Strong Answer:**

**Post-Mortem Report: AI Deployment — Declining Hospital**

**What happened:**
Diagnostic accuracy for non-flagged cases declined by a statistically significant margin after AI deployment. Flagged case accuracy improved, consistent with the AI correctly identifying high-priority cases.

**Root cause analysis:**

*Primary cause: AI-first interface with high-confidence displays*

The interface showed AI flags before radiologists began their independent review. When the AI did not flag a case, radiologists treated this as a negative second opinion and allocated less review time and attention. Cases the AI missed therefore received reduced human scrutiny — a compounding failure.

*Contributing cause: No parallel reading workflow*

Unlike the MGH stroke protocol (parallel reading, human judgment recorded first), this hospital deployed the AI as a primary triage tool. Radiologists were effectively reviewing the AI's work rather than the scan itself.

*Contributing cause: No monitoring during deployment*

The decline became apparent only in a research study. The hospital had no ongoing metrics for performance on non-flagged cases, only overall accuracy. This is a logging gap (see Chapter 8): when the system did not flag, nothing was logged that could reveal the performance degradation.

**What should have been monitored:**
- Sensitivity separately for AI-flagged and AI-not-flagged cases
- Review time per case (AI-flagged vs. not)
- Radiologist override rate (divergence from AI recommendation)
- Quality on non-flagged cases over time (comparison to pre-deployment baseline)

**Remediation:**
1. Implement parallel reading protocol (human assessment recorded before AI display)
2. Add monitoring for non-flagged case accuracy
3. Require independent assessment for all cases, not just AI-flagged ones
4. Set up quarterly review of flagged vs. non-flagged accuracy trends

**Grading criteria:**
- **Excellent:** Identifies AI-first interface as root cause; names compounding factors; proposes specific monitoring metrics and remediation
- **Good:** Correct root cause; some monitoring metrics
- **Satisfactory:** Identifies that the interface was likely the problem without mechanistic explanation
- **Needs improvement:** Blames the AI model rather than the interface design

---

## Activity Solutions

### Activity 1: AI-First vs. Human-First — Analysis Guide

**Expected patterns in student data:**

In the AI-first condition:
- High agreement between initial AI recommendation and student final judgment (80–95%)
- When AI is wrong, students follow it at high rates (60–75%)
- Revision direction: strongly toward AI recommendation

In the human-first condition:
- Lower agreement between student initial judgment and AI (reflects genuine uncertainty)
- When AI and student disagree, students are more likely to investigate than simply accept AI
- Revision direction: mixed; AI-first students revise toward AI; human-first students revise toward whichever assessment is better supported

**Calculating automation bias coefficient $\alpha$:**

$$\alpha = \frac{|\text{Final judgment} - \text{AI recommendation}|}{|\text{Independent judgment} - \text{AI recommendation}|}$$

Values near 0: followed AI completely
Values near 1: maintained independent judgment

Expect $\alpha \approx 0.3$–$0.5$ in the AI-first condition, $\alpha \approx 0.7$–$0.9$ in the human-first condition.

**Debrief key points:**
- The magnitude of the difference between conditions is typically surprising to students
- Emphasize: both groups had equal intelligence and equal access to the images
- The variable was information sequencing, not capability

---

### Activity 2: Interface Audit — Scoring Guide

**Strong audit characteristics:**
- Specific evidence for each dimension rating (not just opinion)
- Recognition that 1-click agree / 5-click disagree is a design choice with measurable consequences
- Proposed fix is genuinely implementable (not "make it better")
- Considers cognitive load implications of the fix

**Common student mistakes:**
- Rating all dimensions 3/5 without differentiation
- Proposing fixes that add complexity rather than reducing it
- Missing the disagree-facilitation issue (this is rarely noticed without prompting)

**Sample model audit:**

**Tool:** [Streaming service recommendation interface]

| Principle | Rating | Evidence |
|-----------|--------|---------|
| AI/human job separation | 2/5 | AI recommendation appears immediately when browsing; no opportunity to form independent preference |
| Uncertainty as information | 1/5 | Recommendations show no confidence or reasoning |
| Independent judgment preserved | 2/5 | Recommendations dominate the interface; original content catalog requires deliberate navigation |
| Disagreement easy | 3/5 | "Not interested" button is one click; "Don't recommend from this source" requires 2 clicks |

**Weakest dimension:** Uncertainty communication

**Proposed fix:** Show recommendation confidence and the top reason ("Based on 3 films you rated highly in this director's catalog"). One sentence. Does not require a new screen.

---

### Activity 3: XAI Comprehension — Expected Results

**Probability score ("87% likely"):**
- Q1 (What was AI paying attention to?): Low comprehension — score gives no feature information
- Q2 (Where might AI be wrong?): Very low — no reasoning visible
- Q3 (Can you verify?): Very low — nothing actionable

**SHAP bar chart:**
- Q1: High (if student has data literacy), low (if not)
- Q2: Moderate — feature importance visible but not directionality of impact
- Q3: Moderate-high for experts, low for non-experts

**Plain-language rationale:**
- Q1: High across all literacy levels
- Q2: High — specific features named enable verification
- Q3: High — actionable ("I can check whether the word-count variance claim is correct by re-reading the text")

**Discussion point:** The SHAP chart requires data literacy as a prerequisite for utility. In most deployed HITL systems, reviewers will not have this literacy. Interface designers must design for actual reviewers, not ideal reviewers.

---

## Quick Reference for Common Student Questions

### "Shouldn't AI just handle all the easy cases and only send hard ones to humans?"
This is essentially correct and describes a well-designed HITL system. The chapter's point is that the *interface* for the hard cases that reach the human matters enormously. Even if you route correctly, the human reviewer can be made worse or better by the design of what they see. Correct routing + bad interface ≠ good HITL system.

### "Isn't automation bias just a risk of AI? Humans are biased too."
Yes, humans have biases independent of AI. The automation bias concern is specific: AI can *amplify* existing biases or introduce new systematic errors when the interface is designed to suppress independent judgment. A radiologist who is biased about a patient's demographic might be corrected by careful independent review of the scan. If the AI also has this bias (trained on biased data), and the interface suppresses independent review, the bias is not corrected. HITL with a bad interface can make bias *worse* than either the human or the AI alone.

### "What if the AI is so accurate that we should just follow it?"
The chapter's answer: accuracy figures are averages. No AI is equally accurate across all subgroups, case types, and edge conditions. The cases where AI accuracy is highest are exactly the cases where human review is least necessary. The cases where human review adds the most value are where AI accuracy is uncertain — and those are precisely the cases where automation bias is most dangerous. An interface designed to suppress independent judgment is most harmful in the cases where independent judgment matters most.
