# Fairness, Bias, and Ethics

Human-in-the-loop systems inherit both the capabilities and the limitations of the humans in them. Annotators bring knowledge, judgment, and creativity to their work — but also biases, fatigue, and the social context of their lives. The choices we make in designing HITL systems — who annotates, what they are asked, how they are compensated, and how their work is used — have consequences that extend far beyond model accuracy metrics.

This chapter addresses the ethical dimensions of HITL ML.

---

## Sources of Bias in HITL Systems

### Annotator Demographics

Annotation is not a neutral act. The labels annotators assign reflect their perspectives, experiences, and cultural contexts. When the annotation workforce is demographically homogeneous — as it often is, with crowdwork skewing young, male, and Western — the resulting dataset encodes the perspectives of that group.

**Evidence:** Studies of NLP annotation datasets have found that annotators' demographic characteristics predict their label choices for subjective tasks (toxicity, sentiment, offensiveness). Datasets annotated by predominantly U.S.-based crowdworkers encode U.S. cultural norms that do not generalize to other regions {cite}`geva2019annotator`.

**Consequences:** Models trained on such data perform well for users who resemble the annotator pool and less well — or in biased ways — for users who don't.

**Mitigation:** Deliberate workforce diversification; stratified annotation (ensure annotators from relevant demographic groups contribute to relevant tasks); track annotator demographics and their effect on label distributions.

### Task Framing

How a question is framed influences the answers it elicits. If annotators are asked "Is this text toxic?" they may answer differently than if asked "Would this text harm someone who belongs to the mentioned group?" The framing embeds assumptions about what matters.

**Example:** Annotation of "abusive language" on social media varies significantly depending on whether annotators are shown contextual information about the author's identity. A statement that appears threatening in isolation may be recognized as reclaimed language or in-group humor when context is provided.

### Platform Effects

The platform and payment structure affect annotation quality. Workers who are paid per task rather than per hour have an incentive to work quickly; this increases throughput but decreases quality. Workers who fear being blocked from a platform for low accuracy may avoid marking "uncertain" and instead make guesses, masking genuine ambiguity.

### Confirmation and Anchoring Biases

Annotators are influenced by:
- **Pre-annotation:** Model predictions shown to annotators are accepted more often than rejected, even when wrong
- **Order effects:** Labeling the same item in different contexts yields different answers
- **Priming:** Previous items in a task affect how subsequent items are labeled

---

## Fairness in HITL Systems

### What Is Fairness?

Fairness in ML is a contested concept with multiple formal definitions that are often mutually incompatible {cite}`barocas2019fairness`. For HITL purposes, the most relevant dimensions are:

**Representation:** Is the training data representative of the populations the model will affect?

**Performance parity:** Does the model perform equally well across different demographic groups?

**Labeling consistency:** Are the same behaviors labeled identically regardless of who is performing them? (Research has shown this is not always the case — identical content is sometimes labeled differently when attributed to different racial or gender groups.)

### Fairness-Aware Active Learning

Standard active learning queries focus on model uncertainty, which tends to concentrate on majority-class examples. This can exacerbate performance disparities for minority groups.

**Fairness-aware query strategies** augment the uncertainty criterion with diversity or representation constraints:

$$
x^* = \argmax_{x \in \mathcal{U}} \left[ \lambda \cdot \text{uncertainty}(x) + (1 - \lambda) \cdot \text{minority\_group\_bonus}(x) \right]
$$

Setting $\lambda < 1$ ensures the query strategy does not entirely ignore minority representation.

---

## Annotator Welfare

### The Ghost Work Problem

The annotation work that powers ML is largely invisible. Data workers — often in the Global South — label images, transcribe speech, and moderate content for low wages, without benefits, in gig-economy arrangements with no job security. Kate Crawford and Vladan Joler's "Anatomy of an AI System" {cite}`crawford2018anatomy` and Mary Gray and Siddharth Suri's "Ghost Work" {cite}`gray2019ghost` documented the scale and precarity of this labor.

**Amazon MTurk statistics:** A 2018 systematic analysis of MTurk earnings found median effective hourly pay of approximately $2/hr — below minimum wage in most U.S. states and many high-income countries {cite}`hara2018data`. Workers outside high-income countries often face additional barriers: requesters frequently restrict high-paying tasks to US-only qualifications, and the pool of workers competing for the remaining open tasks is global, compressing effective earnings further.

**Content moderation:** A particularly harmful form of annotation work — reviewing graphic, violent, and disturbing content — has been linked to PTSD, depression, and anxiety among workers {cite}`newton2019trauma`. Platforms have faced criticism for inadequate mental health support and excessive exposure quotas.

### Ethical Practices

**Fair pay:** Pay annotation workers at or above the local minimum wage. Research has shown that higher pay attracts higher-quality workers without proportionally increasing costs per correct label.

**Work visibility:** Acknowledge the labor that creates training data in publications and product documentation.

**Mental health support:** For workers who review harmful content, provide psychological support, rotation schedules, and exposure limits.

**Worker representation:** Enable annotation workers to report concerns, request guideline clarifications, and challenge unfair quality assessments.

---

## Privacy in Annotation

### Protected Health Information (PHI) and PII

Annotation tasks often involve sensitive personal data. A medical annotation project may expose workers to patient records; an NLP project may expose workers to private communications; a content moderation project exposes workers to users' personal disclosures.

Regulatory frameworks (HIPAA, GDPR) restrict how personal data can be shared with annotation workforces. Key principles:

- **Data minimization:** Share only the information annotators need to complete the task
- **De-identification:** Remove PHI and PII before annotation where possible
- **Consent:** Where real user data is annotated, ensure appropriate consent or lawful basis
- **Access controls:** Limit which annotators can access sensitive data based on role and clearance

### Synthetic Data as an Alternative

For tasks where real data carries privacy risks, synthetic data generation can create annotation-ready datasets without exposing sensitive information. For clinical NLP, for example, synthetic EHR text can provide realistic training data for de-identification models without exposing actual patient records.

---

## Adversarial Annotation and Data Poisoning

HITL systems create an attack surface: if an adversary can influence the annotation process, they can influence the model's behavior.

**Data poisoning via annotation:** An attacker with access to the annotation workforce (e.g., a compromised crowdworker account) can inject systematically mislabeled examples. This is particularly effective in active learning settings, where the model preferentially queries uncertain examples — which may be the adversary's target.

**Reward hacking via feedback:** In RLHF, annotators (or AI-generated annotations) that consistently rate certain types of content highly can steer the model toward that content, regardless of its true quality.

**Mitigation:** Multiple independent annotators per item; outlier detection on annotation patterns; monitoring for anomalous agreement or disagreement; maintaining evaluation sets that cannot be influenced by the annotation workforce.

---

## Institutional Ethics

### IRB and Ethical Review

Research projects involving human subjects — including annotation workers — often require Institutional Review Board (IRB) approval. Annotation projects that collect data about workers' beliefs, responses to sensitive content, or demographic information should be reviewed under the same ethical framework as other human subjects research.

### Data Governance

Organizations should have clear policies for:
- What data can be sent for external annotation vs. annotated internally
- How long annotation data is retained and by whom
- Who has access to annotations and the models trained on them
- How to handle requests to delete annotated data (GDPR right of erasure)

### Transparency and Accountability

Users affected by ML systems have a legitimate interest in understanding how those systems were built. Documenting annotation methodology — who labeled the data, under what conditions, with what guidelines — is a form of accountability that benefits users, regulators, and the field as a whole.

**Datasheets for Datasets** {cite}`gebru2021datasheets` provides a structured template for documenting dataset provenance, annotation procedures, and known limitations.

```{seealso}
Algorithmic fairness framework: {cite}`barocas2019fairness`. Ghost work and platform labor: Gray & Suri (2019). Datasheets for Datasets: {cite}`gebru2021datasheets`. Content moderation worker welfare: {cite}`newton2019trauma`. Annotator demographics and NLP datasets: {cite}`geva2019annotator`.
```
