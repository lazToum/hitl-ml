# A Taxonomy of Human–Machine Interaction

A precise vocabulary is the prerequisite for clear thinking. The term "human-in-the-loop" is used loosely in practice — sometimes to mean that a human labels training data, sometimes that a human can override a model's decision, and sometimes that a human is actively directing the learning process in real time. These are meaningfully different things.

This chapter maps the landscape of human–machine interaction in ML, providing the conceptual vocabulary used throughout the rest of the handbook.

---

## Levels of Automation

The most fundamental distinction is how actively the human is involved in the system's decision-making. A well-known framework from automation theory {cite}`sheridan1992telerobotics` distinguishes ten levels, but for ML purposes three categories capture the important variation:

### Human-in-the-Loop (HITL)

The human is an *active participant in the learning process*. Decisions — or at least, consequential decisions — require human input before they are finalized. The system cannot operate without ongoing human engagement.

*Examples:* An active learning system that queries a clinician before adding a case to training data. A data annotator labeling examples that are immediately used for model updates. An RLHF labeler comparing model outputs.

### Human-on-the-Loop (HOTL)

The system operates autonomously but a human monitors it and can intervene. The human is a *supervisor*, not a participant. Feedback may or may not flow back into training.

*Examples:* A content moderation system that flags posts automatically; a human reviewer samples and corrects a fraction of decisions. An autopilot that flies the plane but alerts the pilot to anomalies.

### Human-in-Command (HIC)

The human makes all decisions; the system provides *recommendations or information* but has no autonomy. This is the weakest form of ML deployment.

*Examples:* A diagnostic support system that shows a doctor the model's probability estimate but leaves the final decision entirely to the physician.

```{admonition} Which level is right?
:class: tip

The appropriate level of automation depends on the cost of errors, the reliability of the model, the expertise of available humans, and the latency constraints of the task. These factors change as a model matures — most systems start HITL and migrate toward HOTL as confidence grows.
```

```text
Raw data --> Preprocessing --> Features --> Training --> Evaluation --> Deployment
    ^              ^                           ^              ^              ^
    |              |                           |              |              |
 Collection    Annotation                  Active          Testing       Monitoring
 feedback      & labeling                 learning        feedback      & correction
```

| Stage         | Human role                                            | Chapter |
|---------------|-------------------------------------------------------|---------|
| Collection    | Deciding what data to collect; sampling strategy      | 3, 4    |
| Annotation    | Assigning labels, structures, metadata                | 3, 13   |
| Training      | Active learning queries; online feedback              | 4, 5, 6 |
| Evaluation    | Human evaluation of model outputs                    | 14      |
| Deployment    | Monitoring, exception handling, corrections          | 12, 14  |

---

## Active vs. Passive Human Involvement

In *active* HITL, the system selects which data points to present to the human — asking questions strategically. In *passive* HITL, the human provides feedback on whatever data happens to arrive (e.g., data labeling batches assigned sequentially).

Active involvement is more efficient because feedback is directed where it will most improve the model. Passive involvement is simpler to implement and manage.

A related distinction is between **batch** and **online** feedback:

- **Batch:** Humans label a large pool of examples; the model retrains. Repeat.
- **Online (streaming):** Human feedback arrives continuously; the model updates incrementally.

Batch workflows are the norm in industry (annotation projects followed by training runs). Online workflows are more natural for interactive systems and reinforcement learning settings.

---

## Single vs. Multiple Annotators

Most formal presentations of HITL assume a single, consistent annotator. In practice, annotation involves many people, and their judgments differ.

**Aggregation** combines multiple annotations into a single label, typically by majority vote or a statistical model (Chapter 13).

**Disagreement as signal** — some researchers argue that annotator disagreement is valuable information that should not be collapsed into a single "gold" label. Perspectivist approaches to NLP, for instance, preserve multiple annotations as soft labels that reflect the genuine ambiguity of the data {cite}`uma2021learning`.

---

## A Unified Framework

We can represent any HITL configuration with a five-tuple:

$$
\text{HITL config} = (\text{level}, \text{modality}, \text{stage}, \text{frequency}, \text{annotators})
$$

where:

- **level** $\in$ {HITL, HOTL, HIC}
- **modality** $\in$ {label, correction, demonstration, preference, NL, implicit}
- **stage** $\in$ {collection, annotation, training, evaluation, deployment}
- **frequency** $\in$ {batch, online}
- **annotators** $\in \mathbb{N}^+$ (number of annotators per item)

This taxonomy lets us compare diverse HITL systems on the same axes and reason about the trade-offs between them. The rest of the handbook drills into specific cells of this space.

```{seealso}
For an empirical study of how annotation decisions affect downstream model behavior, see {cite}`bender2021stochastic`. For a survey of interactive ML systems, see {cite}`amershi2014power`.
```
