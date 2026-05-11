# Chapter 14: Building Fair and Ethical Systems

*Why human oversight does not automatically produce human fairness*

---

## The Hairstyle Problem

In 2018, Amazon quietly shut down a recruiting tool it had been developing for four years. The AI was supposed to screen résumés and surface the best candidates for software engineering positions. Amazon's machine learning team had trained it on ten years of hiring data — the résumés of everyone the company had actually hired.

The problem: Amazon's engineering workforce had historically been predominantly male. The model learned this pattern. It taught itself that women's résumés were less suitable, even though gender was not an explicit input variable. Somehow, it found proxies. The model learned to penalize résumés that included the word "women's" — as in "women's chess club" or "women's college." It downgraded graduates of two all-women's colleges.

Amazon tried to fix this. Engineers removed the gender-correlated terms. The model adapted. It found new proxies. It began penalizing applicants with hairstyles — visible in profile photos — that the training data associated with lower hiring rates. When the team realized the model was using hairstyle as a gender proxy, and then using other proxies as gender proxies, they concluded the problem was not fixable by removing specific features. They shut the system down.

The Amazon recruiting case is instructive not just as a cautionary tale about algorithmic bias, but because it illustrates a deeper structural problem: bias is not a bug you remove. It is a signal the model correctly learned from biased data. The model was doing exactly what it was trained to do. The data reflected a biased world. The model faithfully encoded it.

Here's the part that relates most directly to the theme of this book: Amazon had human reviewers throughout the process. People were checking outputs. People were approving hiring decisions. None of them caught the bias for four years.

The humans in the loop did not protect against the bias. In some ways, they legitimized it — each decision that passed through human review without challenge was, implicitly, a vote of confidence in the system. Human oversight, in this case, was not a check on the algorithm's failures. It was cover for them.

## The Layers Where Bias Enters

There is no single place where bias enters an AI system. It enters everywhere.

**Collection bias** is the most fundamental: whose data is collected? Early facial recognition datasets, used to train and evaluate models for decades, were overwhelmingly composed of light-skinned male faces. Models trained on these datasets were well-calibrated for some users and dramatically worse for others. A 2018 study by Joy Buolamwini and Timnit Gebru — the Gender Shades project — found commercial facial recognition systems from major technology companies had error rates up to 34 percentage points higher for darker-skinned women than for lighter-skinned men. The systems hadn't been designed to fail for these groups. They had simply been trained primarily on data that didn't include them.

**Annotation bias** is the next layer: whose judgment decides what's correct? Training data requires human labels — someone has to say which résumés were "good," which social media posts are "harmful," which recidivism predictions turned out to be accurate. Those labels reflect the values, biases, and social positions of the people who made them. Research on content moderation annotation has found that annotators from different demographic groups make systematically different judgments about the same content, particularly on questions involving race, political content, and hate speech. There is no neutral label. Every annotation embeds a perspective.

**Model bias** is what happens when a machine learning algorithm amplifies the patterns in the data. A model trained on historical criminal justice data will learn that certain neighborhoods, or certain demographic groups, have higher rates of conviction — because that is what the data shows. It will then apply this learned association to new cases, without encoding any understanding of whether the historical disparities were themselves the product of unequal policing, unequal prosecution, or unequal sentencing. The model reproduces structural inequities as if they were natural facts.

**Deployment bias** is the mismatch between the population on which a system was developed and the population on which it is used. A medical diagnostic AI trained on data from academic medical centers in the United States performs differently when deployed in rural clinics, in other countries, or on populations underrepresented in the training data. A fraud detection model calibrated for typical spending patterns in one economic context may generate systematically higher false positive rates for users from different economic contexts — essentially treating unfamiliar behavior as suspicious.

None of these biases are obscure edge cases. They are the normal condition of AI systems built from historical data about an unequal world. The question is not whether they exist but what to do about them.

## The Feedback Loop Problem

Perhaps the most insidious form of algorithmic bias is the one that makes itself worse over time.

Consider a predictive policing system that uses historical crime data to predict where future crimes are most likely to occur. The model says: "Deploy officers to these neighborhoods." Officers are deployed there. More arrests happen there — as a mathematical certainty, because there are more officers there to make arrests. The arrest data flows back into the training dataset. The model learns, with even higher confidence, that those neighborhoods are where crime happens. It directs even more police resources there. The cycle intensifies.

The humans reviewing the system's outputs see increased arrests and interpret them as validation of the model's predictions. The model, in their experience, is "working." But what the system is actually measuring is not underlying crime; it is the combination of underlying crime plus policing intensity plus historical data artifacts — and it is making policing intensity more unequal over time.

This feedback loop problem is not unique to predictive policing. It applies wherever an AI system's outputs become the inputs for future training data, and where the system's deployment affects the phenomenon it is trying to measure. Credit scoring systems that affect access to credit affect future creditworthiness. Hiring algorithms that affect who gets interviews affect who has professional experience. Recidivism prediction tools that affect sentencing affect post-release conditions that themselves influence recidivism.

In each case, HITL oversight does not break the loop. Human reviewers validate individual decisions, not the systemic effect of those decisions aggregated over time. The loop runs beneath the level where individual human review operates.

## COMPAS: A Case Study in Algorithmic Justice

In May 2016, ProPublica published an investigation that changed the conversation about AI in criminal justice. Julia Angwin, Jeff Larson, and colleagues had obtained two years of COMPAS recidivism scores for defendants in Broward County, Florida, and compared those scores to actual re-arrest data over the following two years.

COMPAS — Correctional Offender Management Profiling for Alternative Sanctions — is a proprietary risk assessment tool widely used in American courts to predict the likelihood that a defendant will reoffend. Its scores influence pretrial detention decisions, sentencing recommendations, and parole determinations. It is, in short, an algorithm that affects how much time people spend incarcerated.

ProPublica's analysis found that the system's errors were not distributed equally. Black defendants who did not actually reoffend were nearly twice as likely as white defendants who did not reoffend to be labeled as high-risk — a false positive rate disparity. White defendants who did reoffend were more likely to have been labeled low-risk — a false negative rate disparity.

The company behind COMPAS, Northpointe, responded that their tool was calibrated — that among people assigned a given risk score, the proportion who actually reoffended was approximately equal for Black and white defendants. They were right about this. And ProPublica was also right about the disparate false positive and false negative rates. Both claims were mathematically true simultaneously.

This is not a contradiction. It is the fairness impossibility theorem.

## When Fairness Definitions Conflict

Researchers have formally identified at least three distinct mathematical definitions of algorithmic fairness, and in 2017, Alexandra Chouldechova published a proof that they cannot all be satisfied simultaneously when base rates differ across groups.

**Demographic parity** (also called statistical parity): The proportion of individuals receiving a positive prediction is equal across groups. A hiring algorithm satisfies demographic parity if it recommends candidates for interviews at the same rate regardless of race.

**Calibration** (predictive rate parity): Among people assigned a given risk score, the actual outcome rate is the same across groups. A recidivism tool satisfies calibration if, among everyone scored 7/10, the same percentage of Black and white defendants actually reoffend.

**Equalized odds** (equal opportunity in its weaker form): False positive rates and false negative rates are equal across groups. A recidivism tool satisfies equalized odds if the rate of falsely labeling a non-reoffending person as high-risk is the same for all demographic groups.

Chouldechova proved that when the base rate of the predicted outcome differs across groups — when, for example, Black defendants in a jurisdiction are arrested at higher rates than white defendants due to differential policing — it is mathematically impossible for a model to simultaneously satisfy calibration and equal false positive rates.

This is not a solvable engineering problem. It is a logical impossibility. When base rates differ, satisfying one fairness criterion necessarily violates another. The choice between fairness definitions is a normative, political question about whose errors we are most concerned about, whose false positives are most costly, what justice requires — not a technical question with a correct answer.

The COMPAS case was not, at bottom, a story about a poorly built algorithm. It was a story about a society choosing, perhaps without realizing it was choosing, which fairness definition it preferred to apply to decisions about human liberty. The algorithm made that choice visible. It didn't make the choice.

## The Limits of Human Oversight as an Ethics Solution

There is a tempting but inadequate response to all of this: "Add more human review." If the model is biased, have humans check more decisions. If the algorithm is unfair, make sure people are looking over its shoulder.

This response fails for three reasons.

First, as the Amazon recruiting case illustrates, humans reviewing AI outputs can absorb and launder the AI's biases rather than catching them. When reviewers trust the system, when the system appears to be working, when the organizational culture treats the algorithm as a tool rather than as an autonomous agent, human review provides compliance theater rather than genuine oversight.

Second, human reviewers carry their own biases. Research on human hiring decisions, judicial sentencing, medical diagnosis, and loan approval has repeatedly found that unaided human judgment is also racially disparate, gender-disparate, and socioeconomically disparate. Adding more humans to a biased process does not neutralize the bias; it may entrench the majority view of what "normal" looks like. A room full of human reviewers who share demographic characteristics and professional backgrounds will tend to converge on shared biases rather than averaging them away.

Third, human oversight is most valuable for individual case review and largely blind to systemic effects. A human can evaluate whether the reasoning for a specific decision sounds right. A human cannot, while reviewing individual decisions at production speed, track whether the system is producing disparate outcomes across protected groups at the aggregate level. That requires statistical auditing, not case review.

This is not an argument that human oversight is worthless. It is an argument that human oversight, without intentional fairness design, statistical auditing, diverse reviewer teams, and explicit contestability mechanisms, does not constitute meaningful ethical accountability.

## The Accountability Gap

When a HITL system makes a harmful decision, who is responsible?

This question has no clean answer in current legal frameworks, and the ethical answers are contested. Consider a sequence: a defendant is scored high-risk by COMPAS; a judge who knows the score sends the defendant to prison rather than probation; the score was the product of a model trained on racially disparate historical data; the model was built by a private company; the score was used by a public agency; the algorithm is proprietary and cannot be reviewed in open court.

Who bears moral and legal responsibility? The model's developers? The company that sold it? The judge who used it? The agency that deployed it? The political system that produced the racially disparate data?

Current frameworks tend to locate responsibility with the human decision-maker who used the AI output — the judge, the loan officer, the hiring manager. This is not unreasonable: humans should remain accountable for consequential decisions. But it creates a perverse incentive structure when those decision-makers are given little ability to interrogate the AI's reasoning, little visibility into its aggregate effects, and institutional pressure to trust its outputs.

**Explainability** — understanding why a system made a specific prediction — is one response. If a loan application is rejected and the applicant asks why, they should receive an explanation that is genuinely informative. "The algorithm decided" is not an explanation; it is an evasion. The EU's General Data Protection Regulation establishes a right to explanation for automated decisions affecting individuals, though the legal content of that right remains contested.

**Auditability** — the ability to independently review a system's behavior at scale — is complementary. Individual explanations reveal specific decisions; audits reveal patterns across many decisions. Audits can detect disparate impact that no individual case review would ever uncover. Mandatory independent auditing of high-stakes AI systems is an increasingly common policy proposal across jurisdictions.

**Contestability** — the ability to meaningfully challenge a decision — is perhaps the most important and most neglected. A person who receives an unfavorable algorithmic decision and is told they can "appeal" to a process that simply re-runs the same algorithm has not been given meaningful contestability. True contestability requires human review by a decision-maker who has both the authority and the information to override the algorithm, and who is trained to consider whether the algorithmic input was appropriate in the specific case.

## Designing for Fairness: What It Actually Requires

Building a fair HITL system requires more than good intentions and diverse training data, though both help.

It requires deciding, explicitly and transparently, which fairness definition matters most for the specific application — and being honest about the tradeoffs that choice entails. Different applications warrant different choices. A hiring algorithm and a medical screening tool and a recidivism prediction model involve different cost structures around false positives and false negatives, different legal frameworks, and different stakeholder communities.

It requires auditing at the aggregate level, on an ongoing basis, across protected characteristics relevant to the deployment context. Not a one-time pre-launch fairness assessment, but regular monitoring that tracks whether disparate impacts are appearing as the model's outputs change and as deployment context shifts.

It requires diverse teams — not diversity as a compliance gesture, but because the failure modes of AI systems are often visible to people with relevant lived experience and invisible to those without it. The facial recognition systems that failed for darker-skinned faces were built and tested primarily by teams that did not include many people with darker skin. This is not coincidence. Homogeneous teams have systematic blind spots.

It requires authentic contestability: clear pathways for people to challenge unfavorable decisions, implemented by people who understand those pathways are meant to be used, not minimized.

And it requires honest acknowledgment that fairness is not a property a system achieves once and possesses permanently. It is a relationship between a system, a deployment context, and a society — one that requires ongoing attention, ongoing audit, and ongoing willingness to change.

---

> **Try This:** Find a decision that affected you recently and was, in whole or in part, made or influenced by an algorithm — a credit decision, a job application screening, a content moderation decision, a recommendation, a price quoted to you. Ask: Do you know why the decision was made? Do you have any mechanism to challenge it? Would you even know if the algorithm systematically disadvantaged people like you? The gap between what you can answer and what would constitute genuine accountability is the space this chapter has tried to describe.

---

## Chapter Summary

**Key Concepts:**
- Bias enters AI systems at multiple stages: collection bias (whose data?), annotation bias (whose judgment?), model bias (what patterns did it amplify?), deployment bias (who does it affect?), and feedback loop amplification
- HITL does not automatically produce fair systems: human reviewers can absorb and legitimize bias rather than catching it; aggregate effects are invisible to individual case review
- The COMPAS case illustrates that different mathematical definitions of fairness can simultaneously be true and contradict each other
- The fairness impossibility theorem (Chouldechova, 2017): when base rates differ across groups, calibration and equal false positive rates cannot both be satisfied — the choice is normative, not technical
- Explainability, auditability, and authentic contestability are the structural elements of accountable AI deployment

**Key Examples:**
- **Amazon recruiting AI (2018):** Model learned gender proxies; when proxies were removed, it learned new ones; four years of human review without detecting the bias
- **Gender Shades (Buolamwini & Gebru, 2018):** Commercial facial recognition error rates up to 34 percentage points higher for darker-skinned women; collection bias in training datasets
- **COMPAS (ProPublica, 2016):** Both Northpointe's calibration defense and ProPublica's disparate error rate finding were mathematically true; the fairness impossibility theorem in a real case
- **Predictive policing feedback loops:** Arrests in over-policed neighborhoods increase, feeding back into the model, intensifying predictions, requiring more resources to the same neighborhoods

**Key Principles:**
- Choose fairness definitions explicitly and transparently, knowing that the choice involves normative tradeoffs
- Audit at the aggregate level, regularly, across protected characteristics
- Design for explainability, auditability, and authentic contestability
- Recognize that human oversight without intentional fairness infrastructure provides accountability theater, not accountability
- Fairness is not a property achieved once — it is an ongoing relationship between a system, a deployment context, and an affected community

---

## References

### Algorithmic Bias — Foundational Cases
- Angwin, J., Larson, J., Mattu, S., & Kirchner, L. (2016, May 23). Machine bias. *ProPublica*.
- Buolamwini, J., & Gebru, T. (2018). Gender shades: Intersectional accuracy disparities in commercial gender classification. *Proceedings of Machine Learning Research, 81*, 77–91.
- Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019). Dissecting racial bias in an algorithm used to manage the health of populations. *Science, 366*(6464), 447–453.

### Fairness Impossibility Theorem
- Chouldechova, A. (2017). Fair prediction with disparate impact: A study of bias in recidivism prediction instruments. *Big Data, 5*(2), 153–163.
- Kleinberg, J., Mullainathan, S., & Raghavan, M. (2016). Inherent trade-offs in the fair determination of risk scores. arXiv:1609.05807.

### Formal Fairness Definitions
- Hardt, M., Price, E., & Srebro, N. (2016). Equality of opportunity in supervised learning. *NeurIPS 29*.
- Dwork, C., Hardt, M., Pitassi, T., Reingold, O., & Zemel, R. (2012). Fairness through awareness. *ITCS*, 214–226.

### Annotation Bias
- Bender, E. M., Gebru, T., McMillan-Major, A., & Shmitchell, S. (2021). On the dangers of stochastic parrots. *FAccT*, 610–623.
- Sap, M., Card, D., Gabriel, S., Choi, Y., & Smith, N. A. (2019). The risk of racial bias in hate speech detection. *ACL*, 1668–1678.

### Predictive Policing Feedback Loops
- Ensign, D., Friedler, S. A., Neville, S., Scheidegger, C., & Venkatasubramanian, S. (2018). Runaway feedback loops in predictive policing. *FAT*\**, 160–171.

### Accountability and Explainability
- Wachter, S., Mittelstadt, B., & Russell, C. (2017). Counterfactual explanations without opening the black box. *Harvard Journal of Law and Technology, 31*(2), 841–887.
- Raji, I. D., & Buolamwini, J. (2019). Actionable auditing. *AIES*, 429–435.
