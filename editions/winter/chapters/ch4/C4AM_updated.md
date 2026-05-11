# Chapter 4 Solutions Guide: From Confusion to Decision

*Model answers for all discussion questions and activities*

---

## Discussion Question Solutions

### Introductory Level

#### Question 1: Smoke Detector Threshold
**Prompt:** "A smoke detector is set to a low threshold — it alarms on very low smoke concentrations. What are the consequences? Would you set it differently for a hospital vs. a warehouse?"

**Model Answer:**

**Consequences of a low threshold:**
- *Benefit:* Very high sensitivity — it will almost never miss a real fire (low false negative rate)
- *Cost:* High false alarm rate — cooking smoke, dust, humidity can trigger it
- False alarms train occupants to ignore the alarm, which is itself dangerous (a form of alert fatigue)

**Hospital setting:**
- The cost of a false negative (missing a real fire) is very high — patients who cannot evacuate quickly
- The cost of a false positive is also elevated — hospital evacuations are disruptive and can harm fragile patients
- Recommendation: slightly lower threshold than a typical building, but invest heavily in HITL (staff trained to quickly verify alarms before triggering full evacuation)
- The "HITL band" here is the 30-second window where staff determine: real fire or false alarm before escalating

**Warehouse setting:**
- Fewer occupants; typically healthier, mobile people
- Cost of false negative: property damage, potential injuries
- Cost of false positive: evacuation disruption, productivity loss
- Recommendation: standard or slightly higher threshold; easier evacuation means false alarms are less costly

**Key learning:** The optimal threshold differs by context because the *cost structure* of the errors differs. This is a value judgment, not a technical one.

#### Question 2: Job Application Threshold Change
**Prompt:** "A job application screening algorithm is set to 'top 30%'. If the company becomes more selective, should the threshold change? Who decides?"

**Model Answer:**

**Should it change?** Yes. The threshold was set to route approximately 70% of applications to rejection. If hiring strategy changes to a higher standard, the probability scores haven't changed — but the human decision process behind them has.

**The deeper issue:** Changing from "top 30%" to "top 15%" isn't just adjusting a number. It changes who bears the cost of the two error types:
- False positives (sending a poor candidate to human review): now more costly — more reviewers needed per hire
- False negatives (rejecting a good candidate): now less acceptable for senior roles, more acceptable overall

**Who decides?** This is the chapter's core argument applied directly:
- Not the algorithm — the algorithm doesn't know what "qualified" means in the new strategy
- Not the data scientist alone — they don't know the business priorities
- The people who bear the consequences: hiring managers (know the job requirements), HR (know legal constraints), business leadership (know the strategy)

**Model answer should include:** Recognition that "adjusting the threshold" is equivalent to changing who gets included in the human-review pool, which has real distributional consequences — especially if the model's errors are not uniform across demographic groups.

#### Question 3: Probability Is Not Decision
**Prompt:** "What is the difference between 'the model thinks this email is 70% likely spam' and 'this email is spam'? Why does it matter?"

**Model Answer:**

**The difference:**
"70% likely spam" is a probability — an expression of uncertainty. It means: if you saw many emails with this pattern, about 70% of them would turn out to be spam. This particular email might be legitimate.

"This email is spam" is a decision — a binary commitment to action. Once the label is applied, the uncertainty disappears from the record.

**Why it matters:**

1. **Reversibility:** A probability can be acted upon at different thresholds depending on context. A label is applied uniformly and loses context.

2. **Accountability:** If the email is legitimate and important and you deleted it because it was "labeled spam," you cannot point to the probability and note you were uncertain. The label made the decision seem definitive.

3. **Threshold sensitivity:** The jump from 0.49 to 0.51 probability is tiny — barely distinguishable statistically. But it crosses the threshold and changes the decision entirely. This brittleness at the threshold is a structural feature of any threshold system.

4. **HITL opportunity:** A probability of 70% is not 95% — it's a signal that this case might benefit from human review. Treating it as "spam" and acting on it the same way as a 99% spam email discards useful information.

---

### Intermediate Level

#### Question 4: Hospital A vs. Hospital B Thresholds
**Prompt:** "A cancer screening AI has AUC = 0.95. Hospital A sets τ = 0.3 (aggressive), Hospital B sets τ = 0.6 (conservative). Describe expected outcomes."

**Model Answer:**

**Hospital A (τ = 0.3 — aggressive):**
- True Positive Rate (sensitivity): Very high — catches nearly all cancers
- False Positive Rate: High — flags many healthy patients for biopsy
- Typical ratio at AUC = 0.95, low threshold: perhaps 95% TPR, 30–40% FPR
- Consequences: Many unnecessary biopsies, patient anxiety, healthcare costs, but very few missed cancers

**Hospital B (τ = 0.6 — conservative):**
- True Positive Rate: Moderate — misses some cancers
- False Positive Rate: Low — rarely flags healthy patients
- Typical ratio at AUC = 0.95, higher threshold: perhaps 75% TPR, 8% FPR
- Consequences: Fewer unnecessary biopsies, but some cancers detected late

**Recommendation:**
For cancer screening, the evidence strongly supports a lower threshold (Hospital A approach). The asymmetry is: delayed cancer detection has irreversible, potentially fatal consequences. Unnecessary biopsy is harmful but recoverable. The medical literature consistently supports high-sensitivity screening (accepting false alarms) for life-threatening conditions.

**Nuance:** The optimal threshold also depends on the cancer type. For aggressive, rapidly-progressing cancers, Hospital A's approach is strongly preferred. For slow-growing conditions where overtreatment itself causes harm (certain prostate cancers), Hospital B's more conservative approach may be justified.

**The HITL design implication:** Neither hospital should rely on a single automated threshold. The "middle zone" (0.3 to 0.6) should be routed to radiologist review. The hospitals' choice is really about which side of the middle zone gets auto-approved and which gets auto-rejected.

#### Question 5: Two-Threshold HITL System Advantages
**Prompt:** "Explain why a HITL band (two thresholds) is generally preferable to single-threshold for high-stakes applications."

**Model Answer:**

A single-threshold system makes a binary commitment at every point on the score scale. An email with score 0.51 goes to spam; an email with score 0.49 goes to inbox. The threshold is a hard line with no middle ground.

A two-threshold HITL band system:
- Above τ_H: high confidence positive → automated action
- Below τ_L: high confidence negative → automated action
- Between τ_L and τ_H: uncertain → human review

**Why this is better for high-stakes applications:**

1. **Captures the important uncertainty zone:** The cases near a single threshold are the ones where errors are most likely. The HITL band routes exactly these cases to human review, rather than making automated decisions on them.

2. **Separates the two error types:** By choosing τ_L and τ_H independently, the system designer can optimize against two error types separately, rather than being forced into a single tradeoff.

3. **Preserves precision at the extremes:** The auto-positive zone (above τ_H) achieves high precision — only high-confidence positives are acted on autonomously. The auto-negative zone achieves high precision in the other direction. Both extremes benefit from confident autonomous action.

4. **Scales error cost appropriately:** High-stakes applications typically have asymmetric error costs. The band can be placed asymmetrically around the optimal threshold: a larger margin on the costly-error side.

**Optimal band width:** Determined by:
- Cost of human review per case ($C_H$)
- Cost asymmetry ($C_{FN}/C_{FP}$)
- Human reviewer accuracy advantage over model
- Human reviewer capacity

The band should widen when human review is cheap, errors are costly, and humans significantly outperform the model in the uncertain zone.

#### Question 6: Allegheny Family Screening Tool
**Prompt:** "Critics argue threshold for AFST should be set by social workers with lived experience, not data scientists. Evaluate."

**Model Answer:**

**The critics are largely correct, and this chapter explains why.**

The AFST assigns risk scores to children in the child welfare system. The threshold at which a score triggers a family investigation is exactly the kind of value-laden decision Chapter 4 describes.

**Why data scientists shouldn't set the threshold alone:**
- The threshold setting embeds a value judgment about the acceptable rate of traumatic false investigations vs. the acceptable rate of missed abuse
- That tradeoff is not answerable by the data — it requires knowing what kind of society we want, what values we hold about family integrity vs. child safety, and who bears the cost of each error type
- Low-income families and families of color are disproportionately represented in the child welfare system; they bear asymmetric costs of false positives; data scientists are typically not from these communities

**Why social workers with lived experience should be involved:**
- They understand the real cost of a false positive investigation (not just inconvenience — potentially traumatic, with lasting consequences)
- They understand the heterogeneity in what a given risk score means for different family contexts
- They will be the ones implementing the decisions; their buy-in and calibration affect the system's real-world performance

**The appropriate process:**
- Data scientists define the technical performance of the tool (how accurately it predicts risk at various thresholds)
- Domain experts (social workers, child welfare advocates, affected community representatives) deliberate on threshold placement given those technical tradeoffs
- The decision is made explicit, documented, and subject to review — not embedded silently in a technical parameter

**Grade Note:** The strongest answers will recognize that this is not simply "social workers are right, data scientists are wrong" — it's about the process of threshold-setting, who participates, and how value judgments are made explicit and accountable.

---

### Advanced Level

#### Question 7: Optimal Threshold Formula Derivation
**Prompt:** "Derive τ* = C_FP · P(y=0) / (C_FP · P(y=0) + C_FN · P(y=1)) from expected cost minimization."

**Model Answer:**

Expected cost at threshold τ:

$$E[C(\tau)] = C_{FN} \cdot P(\hat{y}=0 \mid y=1) \cdot P(y=1) + C_{FP} \cdot P(\hat{y}=1 \mid y=0) \cdot P(y=0)$$

For a calibrated classifier with score $s(x) = P(y=1 \mid x)$, the decision rule $\hat{y} = \mathbf{1}[s(x) \geq \tau]$ gives:

$$E[C(\tau)] = C_{FN} \cdot P(s(x) < \tau \mid y=1) \cdot P(y=1) + C_{FP} \cdot P(s(x) \geq \tau \mid y=0) \cdot P(y=0)$$

At the boundary score $\tau$, choosing positive costs $C_{FP} \cdot P(y=0 \mid s=\tau)$ in expected terms; choosing negative costs $C_{FN} \cdot P(y=1 \mid s=\tau)$.

The optimal threshold is where these costs are equal:

$$C_{FP} \cdot P(y=0 \mid s=\tau^*) = C_{FN} \cdot P(y=1 \mid s=\tau^*)$$

Using Bayes theorem and the calibrated classifier assumption $P(y=1 \mid s=\tau) = \tau$:

$$C_{FP} \cdot (1 - \tau^*) = C_{FN} \cdot \tau^*$$

Solving for $\tau^*$:

$$\tau^* = \frac{C_{FP}}{C_{FP} + C_{FN}}$$

This is the optimal threshold when classes are balanced. For unbalanced classes, the prior modifies this to:

$$\tau^* = \frac{C_{FP} \cdot P(y=0)}{C_{FP} \cdot P(y=0) + C_{FN} \cdot P(y=1)}$$

**As $C_{FN}/C_{FP} \to \infty$:** The denominator is dominated by $C_{FN} \cdot P(y=1)$, and $\tau^* \to 0$. This means: flag every case as positive, regardless of score. When missing a positive is infinitely more costly than a false alarm, the optimal strategy is to never miss — accept all false positives.

**Medical implication:** For a test where a missed cancer is infinitely costly relative to unnecessary biopsy, the system should flag everything. In practice, $C_{FN}/C_{FP}$ is large but finite, pushing $\tau^*$ to a very low but nonzero value.

---

## Activity Solutions

### Activity: Cost Asymmetry Classification

*Domain where false positives are more costly:*
- Antivirus software blocking legitimate software (FP: disabled critical application vs. FN: malware runs)
- Voice authentication access control where legitimate users can re-authenticate (FP: denied access vs. FN: wait for more evidence)
- Parole recommendation system (FP: denying parole to someone safe vs. FN: releasing someone who reoffends)

*Domain where false negatives are more costly:*
- Cancer screening (FP: unnecessary biopsy vs. FN: missed cancer)
- Bridge safety inspection (FP: unnecessary inspection vs. FN: missed structural failure)
- Financial fraud detection on wire transfers (FP: delayed transfer vs. FN: money lost permanently)

*These reflect values, not just technical preferences:* The parole recommendation is a particularly rich example — the answer depends on your values about criminal justice (rehabilitation vs. public safety) and is contested among thoughtful people.

### Confusion Matrix Exercise

Given: 1000 emails, 100 are spam (10% base rate). Threshold τ = 0.5.
- TP = 80, FP = 50, FN = 20, TN = 850

**Accuracy** = (80+850)/1000 = 93%

**Precision** = 80/(80+50) = 61.5%

**Recall (TPR)** = 80/100 = 80%

**FPR** = 50/900 = 5.6%

If the company says "we want 95% spam detection rate" (recall = 0.95): they must lower τ until TPR = 0.95, which will increase FPR substantially. This is the tradeoff made explicit.

---

## Common Wrong Answers

**"Just set the threshold to maximize accuracy."**
Wrong: Accuracy is an average that masks the tradeoff. On an imbalanced problem (0.1% fraud rate), a model that predicts "not fraud" for everything achieves 99.9% accuracy while catching 0% of fraud. Chapter 4's lesson is precisely that accuracy is the wrong metric whenever error costs are asymmetric.

**"The threshold doesn't matter much — the model handles it."**
Wrong: The threshold translates the model's probability into an action. Two systems with identical models but different thresholds have dramatically different false positive and false negative rates. This is entirely a design choice.

**"Higher threshold is always safer."**
Wrong: "Safer" depends on which error you're trying to avoid. For cancer screening, a higher threshold (more conservative) means more missed cancers. That is less safe, not more.

**"Setting the threshold is a purely technical decision."**
Wrong: This is the chapter's central corrective. The threshold embeds a value judgment about which error costs more. Calling it "technical" obscures the value judgment and removes it from deliberative accountability.
