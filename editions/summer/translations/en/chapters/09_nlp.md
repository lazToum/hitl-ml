---
jupytext:
  formats: md:myst
  text_representation:
    extension: .md
    format_name: myst
kernelspec:
  display_name: Python 3
  language: python
  name: python3
---

# HITL in Natural Language Processing

Natural language is the domain where HITL ML has arguably had the greatest impact — and where its deepest conceptual difficulties surface. Language is inherently social: its meaning is constructed by human communities, its pragmatics depend on context and intent, and its quality can only be judged by human readers. But this also means that NLP annotation is not merely a process of collecting observations. It is a process of *constructing* categories.

---

## The Constitutive Problem in NLP Annotation

In medical imaging, there is a ground truth: a tumor is present or it is not. The radiologist's label may be uncertain, but it is attempting to track something real. NLP annotation is often fundamentally different. When an annotator marks a tweet as "toxic," there is no toxic-molecule in the tweet that we are attempting to detect. **The label constitutes the category.**

This has profound consequences that are frequently underappreciated:

**The annotation workforce defines the phenomenon.** A label schema for "offensive speech" encodes the sensibilities of whoever designed it and whoever applied it. A team of English-speaking annotators from a single demographic background, working under guidelines written by a corporate policy team, produces a dataset that reflects that team's understanding of offense — not some universal human standard. Models trained on such data will exhibit those same implicit boundaries.

**Guidelines are theory, whether or not they acknowledge it.** Every annotation schema makes claims about ontology. Deciding that "irony" and "sarcasm" are the same class is a theoretical claim, not a neutral convenience. Deciding to label "anger" as a single class rather than distinguishing "righteous anger" from "hostile anger" collapses a distinction that may matter for the downstream task. These decisions are made under production pressure and rarely revisited.

**Label instability over time.** Social language evolves. A toxicity model trained in 2018 will misclassify content from 2024 not because it is statistically undertrained, but because the social meaning of certain terms has changed. NLP annotation is not sampling from a static distribution — it is sampling from a moving target that the act of labeling partially helps to constitute.

:::{admonition} The Annotation Artifact Problem
:class: important

Geva et al. {cite}`geva2019annotator` demonstrated that NLI (Natural Language Inference) datasets contain systematic artifacts introduced by the annotation process itself. Annotators asked to write "entailment" hypotheses for a given premise tend to use certain syntactic patterns; annotators writing "contradiction" hypotheses use others. Models learn to classify based on these artifacts rather than the intended semantic relationship — they solve the annotation task, not the underlying NLP task.

This is not carelessness. It is an inherent consequence of having humans construct examples to fit a label. The HITL process inserts a systematic signal that was never intended to be in the data.
:::

---

## Text Classification Annotation

The simplest NLP annotation task is assigning a category to a text document. Sentiment analysis, topic classification, intent detection, and spam filtering are all classification tasks.

**Challenges specific to text classification:**

*Subjectivity.* Categories like "toxic" or "offensive" are inherently subjective and vary across cultural contexts, annotator backgrounds, and platform context. Across annotators, perceptions of offensiveness differ significantly by demographic — a fact with direct implications for fairness {cite}`blodgett2020language`.

*Label ambiguity.* Many documents belong to multiple categories or fall on a boundary. A review that is 60% positive and 40% negative is genuinely ambiguous, not mislabeled. Forcing a single label discards real information (see Chapter 13 on soft labels and annotator disagreement).

*Label granularity.* A 2-class sentiment model may be sufficient for social media monitoring; a 7-point scale may be needed for product feedback analysis. The right granularity depends on the downstream task, but is usually fixed before the annotation — a consequential design decision made with insufficient data.

---

## Named Entity Recognition

NER annotation requires identifying spans of text and assigning an entity type (PERSON, ORGANIZATION, LOCATION, etc.). The annotation is more complex than document classification for several reasons:

**Span boundaries are ambiguous.** In "Apple CEO Tim Cook announced...", does the PERSON entity span "Tim Cook" or "Apple CEO Tim Cook"? Guidelines must explicitly address these cases, and inter-annotator agreement on spans is consistently lower than on types.

**Type assignment requires world knowledge.** "Apple" is ORG in one context, PRODUCT in another, and arguably neither in "apple pie." Annotators need sufficient domain knowledge to make correct type assignments.

**Nested entities.** "The University of California, Berkeley" contains ORGANIZATION nested within LOCATION. Standard BIO tagging cannot represent nested entities; more complex schemes (e.g., BIOES, or graph-based formats) are required.

**Annotation efficiency.** Pre-annotation with a baseline NER model significantly speeds up annotation by allowing annotators to correct predictions rather than annotate from scratch. In one study of clinical NER, throughput increases of 30–60% were observed {cite}`lingren2014evaluating`; the magnitude of such gains depends heavily on baseline model quality and domain.

---

## Relation Extraction and Semantic Annotation

Beyond identifying entities, relation extraction requires annotating *relationships* between entities:

- Annotators must understand both entities and the predicate connecting them
- Relation types have complex semantic distinctions (WORKS\_AT vs. EMPLOYED\_BY vs. FOUNDED)
- Negative examples (entity pairs with no relation) are far more common than positive ones

**Inter-annotator agreement for relation extraction** tends to be lower than for classification tasks. For well-defined schemas, $\kappa$ values in the range 0.65–0.80 are commonly reported {cite}`pustejovsky2012natural`; for complex semantic relations (event causality, temporal relations), agreement can fall considerably lower, depending on schema design and annotator training.

---

## Machine Translation Post-Editing (MTPE)

Machine translation post-editing is a mature form of HITL NLP. A human translator corrects the output of an MT system rather than translating from scratch:

**Light post-editing (LPE):** Only critical errors are corrected. Suitable when translation quality requirements are moderate.

**Full post-editing (FPE):** The output is corrected to publication quality. The edited output typically becomes training data for further MT improvement — a genuine human-in-the-loop refinement cycle.

**HTER (Human-targeted Translation Edit Rate):** A metric that measures the edit distance between the MT output and the post-edited translation, normalized by sentence length {cite}`graham2015accurate`. As a rough practitioner rule of thumb, HTER below roughly 0.3 is often considered good MT output; above 0.5, translation from scratch may be faster — though these thresholds vary by domain and language pair.

---

## Conversational AI and Dialogue Annotation

Annotating dialogue introduces temporal structure:

- **Turn-level annotation:** label each turn (intent, sentiment, quality)
- **Dialogue-level annotation:** assess overall coherence, task success, user satisfaction
- **Interaction trace annotation:** identify specific failure moments in a conversation

HITL is especially important in dialogue because model failures are often subtle and cumulative: a factual error in turn 3 may not become apparent until turn 7. Human annotators tracing conversations can identify these long-range failure patterns that automated metrics entirely miss.

---

## Programmatic Labeling and Weak Supervision

When labeled data is scarce, **weak supervision** allows using multiple noisy, overlapping labeling functions to generate probabilistic labels at scale. **Snorkel** {cite}`ratner2017snorkel` is the canonical framework:

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score

rng = np.random.default_rng(42)

# -------------------------------------------------------
# Toy weak supervision: sentiment classification
# 5 labeling functions (LFs) with different coverage/accuracy
# Label: +1 (positive), -1 (negative), 0 (abstain)
# -------------------------------------------------------

N = 1000
true_labels = rng.choice([-1, 1], size=N)
X_features = np.column_stack([
    true_labels * 0.8 + rng.normal(0, 0.5, N),
    rng.normal(0, 1, N),
    rng.normal(0, 1, N),
])

def make_lf(accuracy, coverage, seed):
    rng_lf = np.random.default_rng(seed)
    votes = np.zeros(N, dtype=int)
    active = rng_lf.random(N) < coverage
    correct = rng_lf.random(N) < accuracy
    votes[active & correct]  = true_labels[active & correct]
    votes[active & ~correct] = -true_labels[active & ~correct]
    return votes

LFs = np.column_stack([
    make_lf(accuracy=0.85, coverage=0.60, seed=1),
    make_lf(accuracy=0.78, coverage=0.45, seed=2),
    make_lf(accuracy=0.70, coverage=0.80, seed=3),
    make_lf(accuracy=0.90, coverage=0.30, seed=4),
    make_lf(accuracy=0.60, coverage=0.90, seed=5),
])

def majority_vote(LF_matrix):
    labels = []
    for i in range(LF_matrix.shape[0]):
        votes = LF_matrix[i][LF_matrix[i] != 0]
        labels.append(0 if len(votes) == 0 else int(np.sign(votes.sum())))
    return np.array(labels)

mv_labels = majority_vote(LFs)
covered = mv_labels != 0

print(f"Coverage:                    {covered.mean():.1%}")
print(f"MV accuracy (covered):       {(mv_labels[covered] == true_labels[covered]).mean():.3f}")

X_train, y_train = X_features[covered], mv_labels[covered]
X_test,  y_test  = X_features[~covered], true_labels[~covered]

if len(X_train) > 10 and len(X_test) > 10:
    clf = LogisticRegression().fit(X_train, y_train)
    preds = clf.predict(X_test)
    print(f"F1 on uncovered test set:    {f1_score(y_test, preds):.3f}")
```

---

## RLHF for Language Models: The Annotation Reality

Chapter 6 covered RLHF technically. From an NLP perspective, the annotation task is harder than it appears from the outside.

**What annotators are actually asked to do** — compare two model outputs and indicate which is "better" — sounds simple. In practice, "better" is an underspecified construct that annotators resolve using personal heuristics. Some weight fluency heavily; others weight factual accuracy; others penalize verbosity. Without tight guidelines, the resulting preference dataset reflects not human values in the abstract but the particular resolution strategies of the annotation workforce employed.

**The key annotation dimensions are:**

- *Helpfulness:* Does the response answer the question well? Is it informative, clear, and appropriately detailed?
- *Factuality:* Is the response factually accurate? This requires evaluators to have domain knowledge — a requirement that creates serious quality problems at scale, since generalist annotators cannot verify specialist claims.
- *Harmlessness:* Does the response avoid toxic, biased, harmful, or inappropriate content? These judgments require detailed guidelines because "harmful" is highly context-dependent and shifts across cultures, time, and platform context.
- *Calibration:* Does the response express appropriate uncertainty? Annotators systematically prefer responses that sound confident, which creates a reward signal against appropriate epistemic humility.

The interaction between criteria is complex: a maximally helpful response to a dangerous question may be maximally harmful. Guidelines must specify how to trade off competing criteria — and those trade-offs are effectively policy decisions, not annotation decisions. The annotation workforce is making policy.

**Scale concentrates demographic influence.** RLHF for large models involves relatively small annotation workforces (hundreds to low thousands) making billions of downstream decisions. The demographic and cultural biases of that workforce propagate into the model's behavior at scale in a way that would not happen if annotation were more distributed. This is one of the least-discussed structural problems in the current RLHF pipeline.

---

## The Annotation–Model Feedback Loop

In NLP more than in any other domain, the annotation and model development processes become entangled over time:

1. Annotators are calibrated using a model's existing outputs as reference (often implicitly).
2. The reward model learns what annotations tend to prefer.
3. The generator is fine-tuned to produce outputs that get high reward.
4. Those outputs influence what "good" looks like in subsequent annotation rounds.

This feedback loop is not inherently pathological — it is what allows RLHF to converge — but it means that the model's behavior is shaped by a moving target that the annotation process itself helps to move. Distinguishing what the model learned because it reflects human preferences from what the model learned because it learned to pattern-match annotator heuristics is empirically difficult.

There is no clean solution. The best current practice is to monitor for drift using held-out preference judgments collected at regular intervals, and to treat annotation guideline version as an experimental variable.

---

## Evaluation of Generative NLP Models

Unlike classification models with a clear accuracy metric, evaluating generation quality requires human judgment:

| Evaluation method | Description | Cost |
|---|---|---|
| Direct assessment (DA) | Annotators rate quality on a scale | Medium |
| Comparative judgment | Annotators compare two outputs | Low |
| MQM (Multidimensional Quality Metrics) | Structured error taxonomy | High |
| RLHF preference | Preference labels used for training | Medium |
| LLM-as-judge | LLM scores outputs (correlates moderately with human) | Very low |
| BERTScore, BLEU | Automatic metrics (imperfect correlation with human judgment) | Very low |

Automatic metrics (BLEU for MT, ROUGE for summarization) are cheap but imperfectly correlated with human quality judgments {cite}`reiter2018structured`. LLM-as-judge approaches show moderate agreement with human annotators {cite}`zheng2023judging` and are increasingly used for rapid iteration, but should not replace human evaluation for final assessments. For decisions with real stakes, human assessment remains necessary.

```{seealso}
Snorkel weak supervision: {cite}`ratner2017snorkel`. NLP annotation guidelines: {cite}`pustejovsky2012natural`. Annotation artifacts in NLI: {cite}`geva2019annotator`. Annotator bias and NLP datasets: {cite}`blodgett2020language`. For evaluation of generative models: {cite}`reiter2018structured`.
```
