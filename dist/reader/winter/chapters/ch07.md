# Chapter 7: Getting Good Information from People

*Why every label is an argument — and why that argument matters*

---

## The Photograph That Changed How We See Data

In 2010, a Stanford researcher named Fei-Fei Li stood in front of an audience at a TED conference in Long Beach and explained what she had spent four years building: ImageNet. The project, which she had started with a small team and completed using Amazon Mechanical Turk, had produced 15 million photographs organized into 22,000 categories. It was the largest labeled image dataset ever assembled, and it would become the training ground for the deep learning revolution that followed.

What Li described — with evident pride, and deserved — was the logistics of the thing. How they had started with WordNet, a lexical database developed at Princeton, and used it to organize categories. How they had asked workers on Mechanical Turk to review and label photographs, building in quality controls to catch random clicking. How they had verified categories using multiple workers and cross-checking. It was, by the standards of 2010, a remarkable feat of data engineering.

What the audience did not hear about — because the field had not yet confronted it — was the quiet variation embedded in the labels themselves.

By 2019, a series of studies had identified something troubling in the ImageNet data. The category "cheerleader" contained photographs that were overwhelmingly of women. The category "guard" was overwhelmingly men. The category "bridesmaid" contained no photographs of men. The annotations were accurate in a narrow sense — the photographs did show what they were labeled as — but the dataset had encoded cultural stereotypes so thoroughly that models trained on it would confidently predict "nurse" for women and "doctor" for men when given ambiguous inputs. The labels were not wrong. They were incomplete descriptions of a biased sample, faithfully transcribed into a format that the model interpreted as ground truth.

The ImageNet case illustrates something that the whole field of machine learning spent the 2010s slowly learning: labels are not neutral. Every label is an act of interpretation, shaped by who is doing the labeling, what instructions they were given, what cultural context they bring, and how tired they are. The data annotation problem is not a logistical problem that can be solved by deploying enough workers. It is an epistemological problem — a problem about how we know what we know, and what it means to reduce the complexity of a photograph, a sentence, or a human interaction to a single numerical label.

This chapter is about that problem.

## The Instruction Problem

Imagine you are about to annotate a set of online comments for toxicity. You have been given a single instruction: "Label each comment as TOXIC or NOT TOXIC."

You see this comment: *"I can't believe you people still think this is acceptable. You're all completely delusional."*

Is it toxic? Probably yes, you think. "You people" is dismissive, the language is contemptuous, "delusional" is an attack on someone's mental state.

Now imagine the same comment, but a second annotator is working with a slightly expanded instruction: "Label each comment as TOXIC or NOT TOXIC. Toxicity means explicit slurs, direct threats, or content that would make a member of a protected group feel physically unsafe."

The second annotator looks at the same comment. Contemptuous? Yes. Dismissive? Yes. An explicit slur, a direct threat, or content likely to make a protected group feel physically unsafe? Not exactly. They label it NOT TOXIC.

Same comment. Different instructions. Different labels.

This is what annotation researchers call the instruction problem, and it is pervasive. The precise wording of an annotation guideline shapes which features of an item annotators attend to, which they discount, and where they draw lines in genuinely ambiguous cases. A study by Daniel Cer and colleagues at Google examined how different framings of the same toxicity task produced dramatically different label distributions even when the underlying comments were identical. The framing "Is this comment hateful?" produced more toxic labels than the framing "Would a reasonable person find this comment toxic?" The second framing invokes a hypothetical external standard that moderates individual variation — it asks the annotator to model a composite person rather than report their own reaction.

The instruction problem compounds when guidelines are long. Professional annotation companies routinely produce annotation guidelines that run to 50, 80, even 120 pages for complex labeling tasks. The more detailed the guideline, the more interpretation it requires, and the more interpretive variation it introduces. Annotators working from a 100-page guideline do not read it each time they make a label decision — they develop a mental model of the guideline that is partly shared across annotators and partly individual. The shared part produces consistent labels. The individual part produces the kind of systematic variation that shows up in low inter-annotator agreement scores.

## Measuring Agreement: Cohen's Kappa and What It Tells You

When two annotators label the same set of items, their agreement is measurable. The simplest measure is raw agreement — the proportion of items they label the same way. But raw agreement is inflated by chance agreement: if 90% of items are NOT TOXIC and both annotators are just labeling everything NOT TOXIC, they will agree 81% of the time by chance, even if they are making no genuine classification decisions.

The standard correction is Cohen's kappa, developed by psychologist Jacob Cohen in 1960:

$$\kappa = \frac{P_o - P_e}{1 - P_e}$$

where $P_o$ is the observed agreement and $P_e$ is the expected agreement by chance. A kappa of 1.0 means perfect agreement; 0 means agreement no better than chance; negative values mean agreement worse than chance (systematic disagreement).

Landis and Koch (1977) proposed an interpretive scale that became widely used:
- $\kappa < 0.20$: Slight agreement
- $0.20 \leq \kappa < 0.40$: Fair agreement
- $0.40 \leq \kappa < 0.60$: Moderate agreement
- $0.60 \leq \kappa < 0.80$: Substantial agreement
- $\kappa \geq 0.80$: Almost perfect agreement

For most applied annotation tasks, researchers are pleased if they achieve kappa above 0.60. Kappa above 0.80 is the standard for medical annotation tasks, and achieving it typically requires months of guideline development, annotator training, and iterative calibration sessions.

When the toxicity detection field began systematically measuring annotator agreement, the results were sobering. A comprehensive study by Zampieri and colleagues in 2019 found that annotation kappa for English-language toxicity tasks varied between 0.45 and 0.72 depending on the task framing and annotator pool. The lower end — "moderate agreement" by the Landis-Koch scale — meant that two annotators looking at the same comment would disagree about a quarter of the time. A model trained on such data is not learning to detect toxicity; it is learning to predict the label distribution of a specific group of annotators working under specific conditions, and generalizing that distribution as if it were a fact about language.

## The Annotator Is Not a Recording Device

There is a useful fantasy in machine learning that annotators are passive transcribers — that they observe some objective feature of the data and record it, and that the label accurately reflects something real in the world. The fantasy is comfortable because it preserves the idea that labels are ground truth.

It is false.

An annotator is a person with a history, a worldview, a cultural context, and a present state that varies by hour of day, level of fatigue, number of items reviewed, and recent sequence of items seen. Each of these factors shapes what the annotator perceives, how they classify what they perceive, and how much uncertainty they bring to the classification.

Consider the sequence effect. Annotation tasks typically present items in a stream, and the stream creates context. An annotator who has just reviewed 20 highly toxic comments will have a different calibration threshold for the next borderline comment than an annotator who has just reviewed 20 benign ones. This is not a bug in the annotation process — it is an inescapable property of human sequential cognition. The first annotator has just established a mental anchor that makes the next comment look mild by comparison. The second annotator has established an anchor that makes the same comment look alarming.

Studies by Chris Callison-Burch at the University of Pennsylvania, examining annotation work on machine translation quality, showed that annotators systematically rated the same translations differently depending on the quality of the surrounding translations in their queue. A translation rated 4/5 stars when surrounded by poor translations might be rated 3/5 stars when surrounded by excellent ones. The translation had not changed. The annotator's reference point had.

The demographic composition of the annotator pool also shapes labels in systematic ways. Research by Maarten Sap and colleagues at Carnegie Mellon found that Black annotators and white annotators differed substantially in their labeling of tweets containing African American Vernacular English (AAVE). Content in AAVE — including language that was neutral or positive in context — was more likely to be labeled as toxic when the annotator pool was predominantly white. This was not a deliberate choice by the annotators. It was an artifact of cultural familiarity: annotators tend to be more sensitive to toxic language in registers and dialects they know well, and less sensitive in registers and dialects they are less familiar with.

The consequence is that a model trained on annotations from a predominantly white annotator pool will have a systematically higher false toxicity rate for AAVE — it will flag more legitimate speech by Black users as harmful. This is not a problem that better annotation guidelines can fully fix, because it is embedded in who the annotators are and what cultural context they bring to the task.

## The Economics of Getting Labels

The ImageNet dataset was completed with the help of Amazon Mechanical Turk, a crowdsourcing platform that allows requesters to post small tasks — called Human Intelligence Tasks, or HITs — and have them completed by a globally distributed workforce for small payments per task. A typical toxicity labeling task on Mechanical Turk pays $0.02 to $0.05 per item. Annotators who work quickly can earn a few dollars per hour. Most workers on Mechanical Turk are in the United States, followed by India and other English-speaking countries, but the platform is available globally.

The economic logic of crowdsourcing annotation is compelling. A dataset that would cost hundreds of thousands of dollars to label through professional linguists can be labeled for tens of thousands of dollars through Mechanical Turk, at higher speed. For many tasks — image labeling, sentiment analysis, simple text classification — crowdsourced annotations are adequate and the cost reduction is real.

The quality control problem is also real. Without oversight, crowdsourced annotation produces noise: workers who click randomly to complete tasks faster, workers who misread or ignore instructions, workers whose cultural context does not match the task requirements, workers who are simply having a bad day. The standard approach to quality control is multiple annotators per item plus majority voting — if three annotators agree, their collective judgment is probably more reliable than any individual annotation. But majority voting on disagreement can enshrine the biases of the majority as ground truth.

The alternative — expert annotation by trained specialists — produces higher quality labels but at dramatically higher cost and lower speed. Medical annotation typically requires board-certified physicians or experienced clinicians. Legal annotation requires lawyers. Linguistic annotation for complex pragmatic tasks requires trained linguists. Expert annotators disagree less often, but they still disagree, and their disagreements often reflect genuine ambiguity in the data rather than noise.

The distinction between noise and genuine ambiguity matters enormously for how you treat annotation disagreement. If two annotators disagree because one was not paying attention, the disagreement is noise and should be resolved by averaging or majority vote. If two annotators disagree because the item is genuinely ambiguous — a comment that could reasonably be interpreted as either hostile or sarcastic, depending on context the annotators cannot see — the disagreement is information. Collapsing it to a single label loses the information.

Some modern machine learning practice has begun to work with label distributions rather than single labels — training on the full distribution of annotator judgments rather than the majority vote. Research by Bhatt and colleagues at the University of Warwick demonstrated that models trained on distribution of annotations rather than collapsed labels were better calibrated — they expressed more uncertainty on genuinely ambiguous items, and more confidence on items where annotators had agreed. This is a more honest representation of what the data actually contains.

## Framing Effects: How the Question Changes the Answer

The instruction problem is a specific instance of a broader phenomenon: framing effects. How a question is posed shapes the answer, independently of what the answer "truly" is, if such a thing can even be said to exist for subjective annotation tasks.

The classic demonstration of framing effects comes from behavioral economics. Amos Tversky and Daniel Kahneman showed in the 1970s and 1980s that people evaluate the same outcome differently depending on whether it is framed as a gain or a loss. A medical treatment described as having a "90% survival rate" was viewed more favorably than the same treatment described as having a "10% mortality rate." Same statistic. Very different responses.

The same dynamic appears in annotation. Consider the difference between these two annotation instructions:

*Version A:* "Rate each response on a scale of 1-5 for helpfulness."

*Version B:* "Consider: would a patient receiving this information be better equipped to make decisions about their health? Rate 1-5."

Version B anchors the annotator on a concrete downstream beneficiary — the patient — and asks them to simulate that person's experience. This produces more consistent labels across annotators and labels that better predict actual user satisfaction, as demonstrated by a study from Anthropic on the annotation of AI assistant responses. The question is not whether Version B is more "correct." It is that Version B more precisely specifies what the annotation is supposed to measure, and that precision reduces the variation that otherwise arises from annotators constructing their own private definition of "helpfulness."

The most consequential framing decisions in annotation are often invisible because they are embedded in what is not included in the instructions. Consider medical image annotation: annotators are typically asked to identify the presence or absence of a finding, not to classify its significance to the patient. This means a model trained on such annotations learns to detect findings, not to assess their clinical relevance. When such a model is deployed to assist diagnosis, it flags findings that would not change clinical management — creating work for radiologists without creating value, and potentially training radiologists to dismiss AI flags as noise (alert fatigue, as discussed in Chapter 1).

## Calibration Sessions and the Iterative Guideline

The annotation community has developed practices to address the instruction problem and its consequences, the most important of which is the calibration session.

In a calibration session, a group of annotators — typically a small sample of the full annotator pool — review and discuss a set of carefully selected items together. The items are chosen to cover the range of cases that arise in the task, including clear cases, borderline cases, and cases that expose ambiguities in the annotation guidelines. Annotators record their labels independently, then compare and discuss disagreements.

The output of a calibration session is twofold: an updated annotation guideline that addresses the ambiguities exposed by disagreement, and a shared mental model that enables more consistent application of the guideline going forward. Companies like Scale AI and Appen conduct formal calibration sessions at the start of annotation projects and regularly thereafter, particularly when the task involves subjective judgment or cultural nuance.

The iterative nature of guideline development is important. A guideline that looks clear and precise before annotation begins will develop holes and ambiguities the moment annotators begin applying it to real data. The real data always contains items the guideline writers did not anticipate. A process that treats the guideline as fixed from the outset will produce lower-quality labels than a process that treats the guideline as a living document updated by the evidence of annotator disagreement.

OpenAI's work on RLHF (Reinforcement Learning from Human Feedback) — the technique used to train systems like ChatGPT to follow human instructions — is explicit about this iterative process. The human feedback that shapes RLHF training is not collected once and used permanently; it is continuously re-evaluated, guidelines are updated, and new annotation rounds are conducted to capture changing standards. The annotation is not a solved problem but an ongoing conversation between the model's behavior and human preferences.

## The Cultural Context Problem

Any annotation task that involves language, cultural artifacts, or human behavior is susceptible to cultural context effects: the label applied to an item depends, in part, on the cultural knowledge and context of the person applying it.

This is not a problem that can be solved by diversifying the annotator pool, although that helps. It is a structural feature of the fact that many annotation tasks ask annotators to apply community standards — what is "reasonable," what is "harmful," what is "appropriate" — that vary substantially across cultures, communities, and demographic groups.

The studies on AAVE toxicity labeling are one example. Another is sentiment analysis across languages and cultures. A positive sentiment label applied to a Japanese business email that uses elaborate forms of indirect courtesy may require cultural knowledge about Japanese business norms that is unavailable to an annotator without that background. A study by Mohammad and Kiritchenko examining multilingual sentiment annotation found systematic differences in how annotators from different cultural backgrounds labeled the same text translated into their native languages, even when the factual content of the text was the same.

The practical implication is that annotation for a specific language, community, or cultural context should involve annotators who are members of or deeply familiar with that context. This is both an ethical imperative — affected communities should have representation in the annotation process that shapes models that will be deployed to them — and a practical quality consideration. Annotations by outsiders will systematically misrepresent the standards of the community whose content is being labeled.

This principle has been most forcefully articulated by researchers working on Indigenous language AI systems, where the absence of native speakers in the annotation process produced models that encoded outsider misinterpretations of language use as ground truth. The resulting models, when deployed to assist Indigenous language learners, taught incorrect usage patterns — a particularly damaging outcome in contexts where language preservation is itself at stake.

## What Low Agreement Tells You

When inter-annotator agreement on a task is low — say, kappa below 0.40 — the conventional response is to interpret this as a quality problem: the annotators are not doing their job properly, the guidelines are unclear, the training was insufficient. The solution is to revise the guidelines and improve the training.

This interpretation is sometimes correct. Genuine quality problems — annotators who do not understand the task, guidelines that are truly unclear — produce low agreement, and they should be addressed.

But low agreement can also be a signal about the nature of the task itself. Some annotation tasks ask annotators to make distinctions that are genuinely difficult, genuinely subjective, or genuinely contested. A task asking annotators to distinguish between "mildly offensive" and "moderately offensive" is asking for a discrimination that may not be reliably present in human judgment, not because the annotators are failing but because the categories do not map onto stable psychological reality.

When low agreement persists despite careful guidelines, calibrated training, and expert annotators, the right response is often not to force agreement but to interrogate the task. Is the distinction the annotation is trying to capture actually important for the downstream use case? Could the model perform adequately with coarser categories where agreement is higher? Is the genuine ambiguity in the data — the items where annotators disagree — actually carrying information that should be preserved rather than collapsed?

In the most honest framing: a low kappa score is telling you something real about the data, about the task, and about the limits of reducing human judgment to a scalar label. The answer to that signal is not always to try harder. Sometimes it is to listen.

## The Five Dimensions of Getting Good Labels

The five-dimension framework applies to annotation just as it applies to other HITL contexts, but with a different vocabulary.

**Uncertainty Detection**: Low inter-annotator agreement is the signal that uncertainty is high. Items with high disagreement are the ones where human judgment is genuinely uncertain — either because the items are ambiguous or because the annotation categories do not cleanly accommodate them. Identifying these items enables targeted intervention: more annotators, a calibration session, or a review of whether the annotation task is correctly specified.

**Intervention Design**: The annotation guideline is the intervention design. It specifies what cognitive task the annotator is being asked to perform and with what level of precision. The framing studies demonstrate that guideline wording is not just communication — it shapes the cognitive task itself. "Is this harmful?" and "Would a reasonable person find this harmful?" are different cognitive tasks, and they produce different labels.

**Timing**: When in the annotation project do calibration sessions occur? When is disagreement reviewed? When are guidelines updated? Many annotation projects treat calibration as a one-time event at the start, when it should be iterative. High-disagreement batches are a signal that something has changed — in the data distribution, in the annotators' understanding, or in the evolving context of the world — and that a calibration check is warranted.

**Stakes Calibration**: Some annotation errors matter much more than others. A false negative in medical image annotation — missing a tumor — has higher stakes than a false negative in sentiment analysis. Stakes calibration in annotation means allocating more annotators, more expert annotators, and more guideline investment to the high-stakes categories.

**Feedback Integration**: Labels should feed back into the annotation process. When a trained model makes a prediction that conflicts with the annotation, that conflict is potentially information — either the model is wrong, or the annotation is wrong, and distinguishing between them requires a feedback loop from model predictions to annotation review.

## Chapter Summary

**Key Concepts:**
- Labels are not neutral — every annotation is an act of interpretation shaped by who is labeling, what instructions they received, and what cultural context they bring
- The instruction problem: even small differences in guideline wording produce systematically different label distributions
- Cohen's kappa measures inter-annotator agreement corrected for chance; low kappa can signal poor guidelines, genuine task ambiguity, or both
- Framing effects show that the question shape changes the answer, independently of what is being classified
- The annotator is not a recording device — sequence effects, demographic background, and fatigue all systematically shape labels

**Key Examples:**
- **ImageNet (2010–2019)**: Cultural stereotypes baked into labels by an annotation process that did not account for the worldview of the annotator pool
- **AAVE toxicity labeling**: Demographically homogeneous annotator pools produce systematically biased labels for minority language registers
- **RLHF human feedback**: Iterative guideline revision as a necessary feature of annotation for AI training
- **Calibration sessions at Scale AI and Appen**: The standard industry practice for reducing annotation inconsistency
- **Label distribution training**: Training on the full annotation distribution rather than majority-vote labels produces better-calibrated models

**Key Principles:**
- Low inter-annotator agreement is information, not just failure — sometimes the right response is to interrogate the task, not the annotators
- Annotation for a specific community should involve members of that community
- Framing the annotation question more precisely (e.g., anchoring on a specific downstream beneficiary) typically reduces variance
- Annotation is not a solved problem but an ongoing conversation between label quality and model behavior

---

> **Try This:** Take any three subjective opinions you hold — about a film, a piece of writing, a public figure's behavior. For each one, write down the implicit criteria you are using to form the opinion. Now try to write those criteria as annotation guidelines, clearly enough that a stranger could apply them reliably. Notice how quickly "good" requires unpacking, how "harmful" requires definition, and how much of your judgment is tacit knowledge that resists specification. This is the annotation problem, and it does not have a clean solution.

---

*In the next chapter, we zoom out from individual interactions — interfaces, labels, human judgments — and look at the HITL pipeline as a whole: the data flows, the engineering challenges, and what happens when a system that worked beautifully in the lab breaks down in production.*

---

## References

### ImageNet and Dataset Bias
- Li, F.-F., et al. (2009). ImageNet: A large-scale hierarchical image database. *IEEE CVPR 2009*.
- Yang, K., et al. (2020). Towards fairer datasets: Filtering and balancing the distribution of the people subtree in the ImageNet hierarchy. *FAccT 2020*.
- Crawford, K., & Paglen, T. (2019). Excavating AI: The politics of images in machine learning training sets. *excavating.ai*.

### Annotation and Inter-Annotator Agreement
- Cohen, J. (1960). A coefficient of agreement for nominal scales. *Educational and Psychological Measurement*, 20(1), 37–46.
- Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. *Biometrics*, 33(1), 159–174.
- Zampieri, M., et al. (2019). Predicting the type and target of offensive posts in social media. *NAACL 2019*.

### Framing Effects and Annotation
- Kahneman, D., & Tversky, A. (1979). Prospect theory: An analysis of decision under risk. *Econometrica*, 47(2), 263–291.
- Cer, D., et al. (2017). SemEval-2017 task 1: Semantic textual similarity. *SemEval-2017*.
- Ouyang, L., et al. (2022). Training language models to follow instructions with human feedback. *NeurIPS 2022*.

### Annotator Demographics and Bias
- Sap, M., et al. (2019). The risk of racial bias in hate speech detection. *ACL 2019*.
- Callison-Burch, C., et al. (2010). Creating speech and language data with Amazon's Mechanical Turk. *NAACL 2010 Workshop*.

### Crowdsourcing and Quality Control
- Ipeirotis, P. G., Provost, F., & Wang, J. (2010). Quality management on Amazon Mechanical Turk. *HCOMP 2010*.
- Snow, R., et al. (2008). Cheap and fast — but is it good? Evaluating non-expert annotations for natural language tasks. *EMNLP 2008*.

### Label Distribution and Calibration
- Davani, A. M., Díaz, M., & Prabhakaran, V. (2022). Dealing with disagreements: Looking beyond the majority vote in subjective annotations. *TACL*, 10, 92–110.
- Fornaciari, T., et al. (2021). Beyond black & white: Leveraging annotator disagreement via soft-label multi-task learning. *NAACL 2021*.

### Multilingual and Cultural Annotation
- Mohammad, S., & Kiritchenko, S. (2018). Understanding emotions: A dataset of tweets to detect their causes. *LREC 2018*.
- Bird, S. (2020). Decolonising speech and language technology. *COLING 2020*.
