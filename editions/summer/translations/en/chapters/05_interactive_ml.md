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

# Interactive Machine Learning

Active learning asks a focused question: given a budget, which examples should I label? Interactive Machine Learning (IML) asks a broader question: how can we design the *entire interaction* between a human and a learning system to be maximally productive, enjoyable, and correct?

IML is distinguished by the **immediacy** and **directness** of the human–model feedback loop. Where traditional ML involves a human handing off data and waiting for training to complete, IML enables humans to observe model behavior, provide feedback, and see the model respond — often within seconds.

---

## Principles of Interactive Machine Learning

Amershi et al. {cite}`amershi2014power` identify three defining characteristics of IML:

**1. Rapid Feedback:** The model updates quickly enough for humans to perceive the effect of their feedback. In the limit, model updates happen in real time.

**2. Direct Manipulation:** The human interacts with the model through the data or through the model's predictions — not through configuration files or hyperparameter tuning.

**3. Iterative Refinement:** The process is genuinely iterative: the human's next action is informed by the model's current behavior, which was shaped by the human's previous actions.

This creates a tight **co-adaptive loop**: both the human and the model change over time in response to each other. The human learns what the model understands; the model learns what the human cares about.

---

## Comparison with Active Learning

IML and active learning overlap considerably but are not identical:

| Property                    | Active Learning               | Interactive ML                  |
|-----------------------------|-------------------------------|----------------------------------|
| Primary question            | What to label?               | How to interact?                |
| Feedback latency            | Can be batch (days)          | Typically real-time or near-real |
| Model update frequency      | Per round (batch)             | Per interaction (online)         |
| Human agency                | Answers model's questions     | Can proactively teach model      |
| Interface design            | Secondary concern             | Central concern                  |
| Cognitive load of human     | Not explicitly modeled        | Explicitly considered            |

In active learning, the machine directs the interaction. In IML, the human can also take the initiative — providing examples, corrections, or feedback on whatever aspect of model behavior seems most problematic.

---

## Mixed-Initiative Interaction

**Mixed-initiative** systems allow both the human and the machine to take the lead at different moments {cite}`allen1999mixed`. A purely machine-directed system asks questions and the human answers. A purely human-directed system lets the human decide everything. Mixed-initiative systems balance both.

In practice, the best IML systems combine:
- **Machine initiative:** "I'm unsure about these examples — can you label them?"
- **Human initiative:** "I notice the model is consistently wrong about this category — let me provide more examples"
- **Confirmation:** The model surfaces its current understanding; the human confirms or corrects

Good IML interfaces make the model's current understanding visible and correctable. This is the **intelligibility** requirement: humans can only guide a model they understand, at least approximately.

---

## Human Factors in IML

IML brings human factors — cognitive load, fatigue, consistency, and trust — directly into the learning loop. Poor IML design leads to:

**Annotation fatigue:** Humans making faster, sloppier decisions as sessions lengthen. Errors that enter the training data.

**Anchoring bias:** Humans over-relying on the model's current suggestions. If an interface pre-fills the model's prediction, annotators are less likely to correct it even when it is wrong — a systematic source of label noise that compounds across annotation rounds {cite}`geva2019annotator`. Pre-annotation can speed throughput {cite}`lingren2014evaluating` while simultaneously reducing the rate at which annotators catch model errors; these two effects must be weighed against each other in IML interface design.

**Trust miscalibration:** Humans either over-trust (accepting wrong model outputs) or under-trust (ignoring correct suggestions). Both patterns reduce the value of the human–model collaboration.

**Session consistency:** Humans may make different decisions on the same example at different times, especially after long sessions. Consistency checks (re-presenting earlier examples) can detect and correct this.

Good IML design mitigates these issues through interface choices: presenting model confidence explicitly, randomizing display order, limiting session length, and building in consistency checks.

---

## The IML Feedback Types in Practice

### Example-Level Feedback

The human provides a label or correction for a specific example. This is the most common form and is directly compatible with supervised learning.

### Feature-Level Feedback

The human indicates which features are relevant or irrelevant. "The model should pay attention to the words 'urgent' and 'deadline' for this category." This is more expressive than example-level feedback and can be more efficient for certain tasks.

**TFIDF Interactive** and similar systems allow annotators to highlight relevant words in text documents. These highlights are converted into constraints or additional supervision on the model's attention.

### Model-Level Feedback

The human directly corrects the model's behavior on a class of inputs: "Whenever the input contains [X], the output should be [Y]." This maps to logic rules or constraints in approaches like Posterior Regularization {cite}`ganchev2010posterior` or constraint-driven learning.

---

## Case Study: Google Teachable Machine

Teachable Machine is an accessible web-based IML system that lets non-technical users train image classifiers in the browser. The user:

1. Records examples of each class using their webcam
2. Trains the model with a single click (fine-tuning a MobileNet in the browser)
3. Immediately sees the model's predictions on live video
4. Adds more examples for classes where the model is wrong

This illustrates the core IML loop: provide examples → observe model → identify failure → provide more targeted examples. The real-time feedback (model outputs update in real time, typically at interactive frame rates on modern hardware) makes the co-adaptation loop viscerally immediate.

---

## Implementing a Simple IML Loop

```{code-cell} python
import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

class SimpleIMLSystem:
    """
    Minimal IML system that allows online feedback and displays
    model state after each annotation.
    """

    def __init__(self, n_features=10, n_classes=2):
        self.model = SGDClassifier(loss='log_loss', max_iter=1, warm_start=True,
                                   random_state=42)
        self.scaler = StandardScaler()
        self.X_seen = []
        self.y_seen = []
        self.n_classes = n_classes
        self.initialized = False

    def update(self, x, y_true):
        """Receive a single labeled example and update the model."""
        self.X_seen.append(x)
        self.y_seen.append(y_true)

        if len(self.X_seen) >= 2 * self.n_classes:
            X_arr = np.array(self.X_seen)
            y_arr = np.array(self.y_seen)
            X_scaled = self.scaler.fit_transform(X_arr)
            self.model.partial_fit(X_scaled[-1:], y_arr[-1:],
                                   classes=list(range(self.n_classes)))
            self.initialized = True

        return self

    def predict_with_confidence(self, x):
        """Predict label and return confidence."""
        if not self.initialized:
            return None, 0.0
        x_scaled = self.scaler.transform(x.reshape(1, -1))
        probs = self.model.predict_proba(x_scaled)[0]
        return self.model.predict(x_scaled)[0], probs.max()

    def current_accuracy(self, X_val, y_val):
        if not self.initialized:
            return None
        X_scaled = self.scaler.transform(X_val)
        return (self.model.predict(X_scaled) == y_val).mean()


# Simulate an IML session
rng = np.random.default_rng(42)
X_all, y_all = np.random.default_rng(0).random((500, 10)), np.random.default_rng(0).integers(0,2,500)
X_val, y_val = X_all[400:], y_all[400:]

system = SimpleIMLSystem(n_features=10, n_classes=2)
accs, confidences = [], []

print("Step | Labels | Accuracy | Example confidence")
print("-" * 50)

for step in range(100):
    x, y = X_all[step], y_all[step]
    pred, conf = system.predict_with_confidence(x)
    system.update(x, y)

    if (step + 1) % 10 == 0:
        acc = system.current_accuracy(X_val, y_val)
        if acc is not None:
            accs.append(acc)
            print(f"  {step+1:3d} |  {step+1:4d}  |  {acc:.3f}   | {conf:.3f}")
```

---

## The Grandmother Test

One useful heuristic for evaluating IML interface design — and HITL system design more broadly — is what we will call the **Grandmother Test** (an original coinage introduced here as a design constraint, not as a reference to prior work):

> *A woman born in 1930 should be able to use this device by voice, and if frustrated, gracefully fall back to keyboard or text interface.*

The test is not primarily about accessibility, though it is that too. It is about **designing for friction**. If a system requires a mental model of neural networks, training loops, or probability distributions to use effectively, it has failed the Grandmother Test. The human in the loop should be able to participate without understanding the machine side of the loop.

The implications for IML design are concrete:

**Voice-first fallback:** The primary interaction modality should be natural language or gesture — not parameter sliders or confidence thresholds. Experts may want sliders; everyone should be able to say "that's wrong."

**Graceful degradation:** When the user's preferred modality fails or frustrates, the system should offer an alternative — not a blank screen or an error message. The interface is part of the learning system; a user who cannot interact cannot teach.

**Legible model state:** The model's current understanding should be visible in human terms. Not "confidence: 0.73" but "I'm fairly sure this is [X], but I've seen examples like this go both ways." Uncertainty should be communicated in language that invites correction.

**Tolerance for ambiguity:** A 93-year-old user and a 23-year-old ML engineer will interact differently with the same system. The Grandmother Test asks whether the system can accommodate both — not by detecting the user's age, but by designing interactions that work across a range of expertise and comfort.

The test takes on special importance as ML systems move from research tools to everyday infrastructure. A medical imaging assistant used by radiologists, a legal document classifier used by clerks, an educational feedback system used by teachers — each involves humans-in-the-loop who did not sign up to be AI trainers. Designing for them is not a concession; it is the point.

:::{admonition} Design Principle
:class: tip
The Grandmother Test is a design constraint, not a target demographic. Systems that pass it are more robust to user diversity, more forgiving of expertise gaps, and more honest about what they expect from humans-in-the-loop. If a system requires explanation before use, it is asking the human to do extra work. That work should be justified by proportionate benefit.
:::

---

## IML and Foundation Models

Modern IML increasingly leverages **pre-trained foundation models** {cite}`bommasani2021opportunities` as the base. Instead of training from scratch, users fine-tune a large pre-trained model with a small number of interactive examples. This can dramatically reduce the number of examples needed to reach useful performance — in favourable cases, as few as 5–50 examples rather than thousands, depending on how well the pre-trained representations match the target task {cite}`bommasani2021opportunities`.

Techniques enabling this include:
- **Few-shot prompting:** Providing examples in the LLM's context window
- **Adapter fine-tuning:** Updating small adapter modules while freezing the base model
- **Parameter-efficient fine-tuning (PEFT):** LoRA, prefix tuning, and similar methods that allow fast, low-resource updates

Foundation models change the IML dynamic: humans are no longer teaching a blank-slate model from scratch but *steering* a model that already knows a great deal. The challenge shifts from "how to provide enough examples" to "how to specify exactly what we want differently from what the model already does."

```{seealso}
The survey by {cite}`amershi2014power` remains the best overview of IML principles. For mixed-initiative systems specifically, see {cite}`allen1999mixed`. For anchoring effects in annotation, see {cite}`geva2019annotator` and {cite}`lingren2014evaluating`.
```
