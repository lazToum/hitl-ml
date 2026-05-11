# Chapter 14 Solutions Manual: Building Fair and Ethical Systems

*Model answers to all discussion questions and exercises, with instructor annotations*

---

## Solutions to Discussion Questions

### Q0: Opening Reflection

*This question does not have a single correct answer; it is designed to surface students' prior experience and intuitions. Model responses will vary.*

Strong responses will identify: (a) that the unfairness felt systemic because it affected not just the individual but appeared to affect a category of people; (b) that fixing it would have required changing a policy, a data source, or an incentive structure — not just correcting an individual's mistake; (c) a distinction between malicious intent (rare) and structural outcomes that disadvantage groups even without intent (more common and harder to fix).

---

### Q1: Which layer is hardest to detect / prevent?

**Model Answer:**

The layers vary in their detectability and preventability:

*Hardest to detect after the fact:* **Collection bias** is often the hardest to detect retrospectively because it is invisible in the data itself — you can only see what was collected, not what was omitted. If a facial recognition training dataset contains 80% light-skinned male faces, the dataset doesn't announce this as a problem; it simply doesn't include the missing cases. Detecting collection bias requires comparing the training distribution to the deployment population, which requires knowing the deployment population in advance.

*Hardest to prevent:* **Feedback loop amplification** is hardest to prevent because it requires active monitoring of how model outputs affect future training inputs — a feedback process that requires an ongoing commitment to monitoring systems that most organizations don't build proactively. The gap between initial deployment (when the feedback loop doesn't yet exist) and later harm (when the loop has been running long enough to cause measurable amplification) can span years.

These are not the same layer. Collection bias is detectable (with the right comparisons) but hard to prevent in retrospect; feedback amplification is preventable (with the right monitoring design) but hard to detect without proactive measurement.

---

### Q2: "Bias is a signal the model correctly learned"

**Model Answer:**

This reframe has several practical implications:

1. *Removing specific features is insufficient* because the model can learn proxies. The causal chain runs through the data, not through the features explicitly included.

2. *"Debiasing" is a misleading term* when applied to model parameters alone. You cannot debias a model trained on biased historical outcomes by adjusting its weights, because the bias is in the relationship between inputs and outputs, not in any single feature.

3. *Meaningful remediation requires changing what the model is trying to predict.* If the training labels reflect historical disparate outcomes (e.g., who was hired, who was arrested), the model will faithfully reproduce those disparities. Changing what the model is optimizing for — or using outcome labels that are less contaminated by historical discrimination — is more fundamental than feature engineering.

4. *Accountability cannot be discharged by claiming the model was "objective."* The model was accurate to its training data. Accuracy to biased training data is itself a form of encoded injustice.

---

### Q3: Amazon's proxy adaptation

**Model Answer:**

Amazon's recruiting AI exhibited what can be called *proxy displacement*: when direct proxies for a protected attribute are removed, the model learns indirect ones. This pattern is not a flaw in the model — it is a feature. The model is finding the information it needs to make accurate predictions within the training data, and that information is always available through some path if it is present in the underlying data structure.

The implications for fairness strategy:

- *Feature-level interventions are whack-a-mole.* Any approach that tries to remove bias by blocking specific features will face proxy adaptation.
- *The problem is structural, not architectural.* The model finds proxies because the training data genuinely encodes a world where gender correlated with hiring outcomes. Changing features doesn't change that correlation in the data.
- *The alternative is to intervene on the training objective or the labels,* not the input features. Approaches like adversarial debiasing (training a separate model to predict the sensitive attribute and penalizing the main model for making it predictable) attack the problem at the information level, not the feature level.

---

### Q4: The feedback loop and cognitive bias

**Model Answer:**

The primary cognitive bias among human reviewers is **confirmation bias** operating through a **measurement illusion**: the reviewers are seeing more arrests and interpreting arrests as evidence of underlying crime. They are not distinguishing between:
- *More crime occurring* (the thing they are trying to measure)
- *More policing intensity* (which directly causes more arrests regardless of underlying crime rates)

A human reviewer would need to know: (1) that policing intensity in the flagged areas increased after the model's deployment; (2) that arrest rates in areas with equal patrol presence but without model flagging did not increase; and (3) that the model's training data includes historical policing intensity as a latent feature. Without this contextual knowledge, the measurement illusion is compelling and nearly undetectable by individual reviewers.

The structural fix is not better reviewers — it is measuring the right thing. A system designed to measure underlying crime rates (using victimization surveys rather than arrest rates, for example) would not have this feedback structure. But arrest rates are cheap and available; victimization survey data is expensive and slow. The feedback loop is partly a consequence of optimizing for measurable proxies.

---

### Q5: Feedback loops in other domains

*Sample model answer for credit scoring:*

In credit scoring: the model predicts credit risk based on credit history → higher-risk scores lead to higher interest rates or denials → higher cost of credit leads to higher default rates for the affected group, regardless of underlying creditworthiness → new defaults become training data → the model learns with higher confidence that the group is high-risk.

Breaking the loop requires: (a) using income and expense verification rather than credit history as primary signals (attacking the training data); (b) offering credit-building products to segments that have been under-served, generating new positive history (changing the causal structure); (c) monitoring approval rate trends over time by demographic segment and investigating increases in disparity (feedback loop detection).

---

### Q6: Which COMPAS claim is more important?

**Model Answer:**

The question of *which claim is more important* is a normative question that depends on which type of error you believe is more costly.

Northpointe's calibration claim says: when two people receive the same risk score (say, 7 out of 10), they have approximately the same probability of reoffending, regardless of race. This is a claim about the instrument's consistency across groups.

ProPublica's disparity claim says: among defendants who did *not* reoffend, Black defendants were incorrectly labeled high-risk at nearly twice the rate of white defendants. This is a claim about the instrument's accuracy for specific groups.

The impossibility theorem resolves the apparent contradiction: *because Black defendants have higher arrest rates* in Broward County (itself a consequence of unequal policing, prosecution, and sentencing), *a calibrated model necessarily has higher false positive rates for Black defendants*. The two claims are both true and mathematically consistent.

Which matters more depends on what you're optimizing for. If you believe that sentencing decisions should treat equally situated individuals equally (same score → same risk), calibration is paramount. If you believe that incarceration of innocent (non-reoffending) people is a primary injustice and should be minimized equally across races, equal FPR is paramount. Neither position is wrong. The choice is a value judgment about the relative costs of different types of errors.

---

### Q7: Who should make the fairness choice?

**Model Answer:**

The chapter argues this is a normative, political question — not a technical one. A legitimate answer should address the following dimensions:

*Case for judges:* They are responsible for the decision. If the tool influences sentencing, the person who sentences should understand and own the fairness tradeoffs embedded in the tool.

*Case for legislatures:* Systemic choices about which errors criminal justice systems should prioritize are policy questions with constitutional dimensions. The branch responsible for criminal justice policy should set these standards, not individual judges or private companies.

*Case for advocacy groups / affected communities:* The people most affected by the choice are defendants and their communities. Processes that affect people without meaningful representation of those people are democratically deficient.

*Case against the company:* The company building the tool has a conflict of interest in claiming that its tool is "fair" — and they lack democratic accountability.

A defensible answer: the choice should be made through a participatory process that includes affected communities, is ratified by democratic process (legislative or regulatory), and is made explicit and public so that it can be contested and revised. Any answer that places the choice entirely with the company or with technical experts should be scrutinized.

---

### Q8: Does making implicit choices explicit change moral responsibility?

**Model Answer:**

Making implicit social choices explicit through an algorithm does at minimum one important thing: it makes the choice legible and therefore contestable. Before COMPAS, judges made intuitive risk assessments that were influenced by the same historical data (court records, recidivism statistics) but without any formal documentation of how that information was used. The implicit biases in those judgments were real but invisible to scrutiny.

The algorithm makes the weighting explicit. This is a double-edged development:

*Positive:* It creates an object that can be audited, challenged, and improved. ProPublica's analysis was possible precisely because COMPAS's outputs could be measured and compared against actual recidivism data.

*Negative:* It creates an object that can serve as cover — as the chapter notes, a human decision laundered through an algorithm acquires a patina of objectivity it doesn't deserve. "The algorithm said so" is a more powerful deflection of individual accountability than "I judged so."

The moral responsibility implications: deploying a tool with known fairness tradeoffs, without disclosing those tradeoffs to affected parties or building contestability mechanisms, is a moral choice — even if the alternative (unsystematized judicial intuition) was also biased. Explicitness creates an opportunity for accountability; it doesn't automatically produce it.

---

### Q9: Which limit of human oversight is most tractable?

**Model Answer:**

Of the three identified limits:

1. *Humans absorb AI bias:* Tractable through process design — specifically, through blind review (preventing reviewers from seeing AI scores before making independent assessments) and structured checklists that force independent judgment before score exposure.

2. *Humans carry their own biases:* Partially tractable through demographic diversity of reviewer teams and structured decision processes (standardized rubrics, required justifications). Not fully solvable — no set of human reviewers is unbiased, and diversity reduces but doesn't eliminate systematic shared blind spots.

3. *Humans can't track systemic effects:* Tractable through statistical auditing at the organizational level — this is not a problem with individual reviewers but a problem with what reviewers are asked to look at. Systematic aggregate monitoring is a technical solution that doesn't require individual reviewers to see more; it requires an organization to build separate monitoring infrastructure.

Most practically tractable: blind review processes and statistical aggregate monitoring. Least tractable without structural redesign: the diversity limitation.

---

### Q10: Conditions for compliance theater vs. genuine oversight

**Model Answer:**

Conditions that produce compliance theater:
- Reviewers trust the system ("the algorithm is usually right")
- Reviewers are evaluated on throughput rather than quality of review
- No mechanism for reviewers to escalate disagreement with the algorithm's judgment
- No feedback to reviewers about when they were right vs. wrong
- Organizational culture treats algorithm disagreement as a sign of reviewer error

Conditions that produce genuine oversight:
- Reviewers make independent judgments before seeing algorithm outputs (blind review)
- Some fraction of cases are re-reviewed to measure reviewer quality
- Reviewers have access to historical patterns of algorithm error for the case type they're reviewing
- Reviewers who appropriately override incorrect algorithm outputs receive positive feedback
- The organization tracks the rate at which human review changes outcomes — and investigates if that rate drops to near zero

---

### Q11: Ranking explainability, auditability, contestability by application

**Model Answer:**

| Application | Priority Ranking | Rationale |
|-------------|-----------------|-----------|
| Medical screening (cancer) | Contestability > Auditability > Explainability | False negatives are catastrophic; patient must be able to seek second opinion; patterns of missed diagnoses must be caught early |
| Hiring algorithm | Auditability > Contestability > Explainability | Aggregate disparity across many candidates is primary concern; individual contestability matters but aggregate patterns are larger risk |
| Recidivism prediction / sentencing | Contestability > Explainability > Auditability | Individual liberty is at stake; the defendant must be able to challenge the score; explanation must be meaningful enough to contest |
| Content moderation | Auditability > Contestability > Explainability | Systemic political or demographic disparities are the primary risk; individual contestability also matters; per-decision explanation is least critical |

No ordering is uniquely correct; the reasoning is more important than the ranking. Strong answers will distinguish the *type* of harm being protected against in each application.

---

### Q12: Genuine vs. formal explanations

**Model Answer:**

*Genuinely informative explanation* (e.g., for a rejected loan application): "Your application was declined primarily because your current debt-to-income ratio of 42% exceeds our threshold of 36%. If your ratio were below 36%, you would likely qualify. The factors that contributed most to your score were: [specific factors, specific values, direction of contribution]."

*Formally compliant but uninformative explanation:* "Your application was declined due to information in your credit report. You may request a free copy of your credit report from the reporting agency."

The difference: an informative explanation gives the applicant actionable information about what would change the decision, what data was used, and what the decision boundary looks like for them. A formal explanation points to information sources without explaining how the information was used.

GDPR Article 22 requires "meaningful information about the logic involved" in automated decisions — but courts and regulators have not fully resolved what this requires. The gap between formal compliance and genuine informativeness is where most real-world explanations live.

---

## Solutions to Exercises from Chapter 14

### Exercise 14.1: The Four Layers Identification

*Student is asked to identify which bias layer(s) affected a described scenario.*

**Scenario A** (hospital AI trained on academic medical center data, deployed in rural clinics): **Deployment bias** — the system was trained on a population different from the deployment population. Also potentially **collection bias** if the academic medical center population was not demographically representative.

**Scenario B** (content moderation system that over-removes political content after high-volume annotation period): **Annotation bias** — annotators working under time pressure with specific contextual framing. Potentially also **feedback loop amplification** if the biased labels fed into retraining.

**Scenario C** (credit scoring model that uses ZIP code as a feature): **Model bias** — the model amplifies historical patterns associated with ZIP code (which are themselves products of historical redlining). The ZIP code feature is a proxy for race through historical housing discrimination.

---

### Exercise 14.2: Evaluate the Fairness Claim

*Two companies are arguing about whether their hiring algorithm is fair. Company A says it satisfies demographic parity. Company B says it doesn't satisfy calibration. Evaluate.*

**Model Answer:**

Both claims can be true simultaneously. Satisfying demographic parity means the algorithm selects candidates at equal rates across demographic groups — but this does not require that it is equally accurate for each group. A system can achieve equal selection rates by selecting some candidates from each group who are less likely to succeed, which would produce miscalibration.

The normative question: for a hiring context, is demographic parity or calibration more important? 

Case for demographic parity: If the goal is to address historical underrepresentation, equal selection rates directly achieve that goal. Calibration in a historically biased labor market may simply reproduce the biases encoded in past "success" data.

Case for calibration: If "success" can be measured fairly (actual job performance, tenure), calibration ensures the algorithm isn't making false promises — candidates from any group selected by the algorithm should have similar likelihoods of success.

Strong answers will note that "success" labels in hiring are themselves potentially biased (who gets promoted, who gets good performance reviews, who is retained all depend on the organization's existing biases), making calibration a more complex standard than it appears.

---

### Exercise 14.3: Design a Contestability Mechanism

*Student is asked to design a contestability process for an automated benefits eligibility decision.*

**Model Answer (rubric for strong answers):**

A strong contestability mechanism for benefits eligibility must include:

1. **Notification:** Clear, timely notification of the automated decision, including the primary factors that drove the negative outcome (not just "the algorithm decided")

2. **Human review pathway:** A mechanism to request review by a human decision-maker who has actual authority to override the automated decision — not a process that simply re-runs the algorithm

3. **Informed reviewer:** The human reviewer must be provided with the applicant's specific circumstances, not just the score. The reviewer must be trained to evaluate whether the AI's factors were appropriate for this case.

4. **Response timeframe:** Benefits decisions affect people's basic needs; review timelines should be short (days, not months)

5. **Feedback to the system:** Successful overrides should be logged and reviewed quarterly for patterns — systematic overrides suggest the model is miscalibrated for a population segment

6. **Access support:** Many people who might benefit from contestability are least equipped to navigate complex appeals processes; meaningful contestability may require assistance (a plain-language explanation, translation, simplified procedures)

Weak answers will describe an "appeal button" that routes to a human who sees the AI score and doesn't have authority to override. This is the contestability theater the chapter describes.

---

## Key Formulas and Results to Know

**Fairness Impossibility (Chouldechova, 2017):**
When base rates $P(Y=1|A=0) \neq P(Y=1|A=1)$, no score $S$ can simultaneously satisfy:
- Calibration: $P(Y=1|S=s, A) = s$
- Equal FPR: $P(\hat{Y}=1|Y=0, A=0) = P(\hat{Y}=1|Y=0, A=1)$
- Equal FNR: $P(\hat{Y}=0|Y=1, A=0) = P(\hat{Y}=0|Y=1, A=1)$

**Demographic Parity Difference:** $|P(\hat{Y}=1|A=0) - P(\hat{Y}=1|A=1)|$ — acceptable threshold typically < 0.10

**Disparate Impact Ratio (4/5ths rule):** $\frac{P(\hat{Y}=1|A=\text{minority})}{P(\hat{Y}=1|A=\text{majority})} \geq 0.80$
