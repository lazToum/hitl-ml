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

# Human in the Loop Machine Learning
## *Misunderstood*

```{epigraph}
There is no need for a PhD titled "Human in the Loop Machine Learning."
Or rather — there is every need, and it has never been written.
This is not that PhD. It is what comes instead.
```

---

This handbook is a comprehensive, executable, and deliberately un-academic guide to **Human-in-the-Loop (HITL) Machine Learning** — the discipline of designing systems where human judgment and machine intelligence do not merely coexist but actively reshape each other.

It is *misunderstood* in at least three ways:

**The field is misunderstood.** Ask most people how machine learning works and they will describe a process that ends when the model is deployed. In reality, the human is never removed from the loop — only hidden from view. Behind every "autonomous" system are annotators, reviewers, feedback collectors, and engineers making judgment calls. HITL ML makes this visible and deliberate.

**The human role is misunderstood.** The human in the loop is not a temporary scaffold to be discarded when the model is good enough. Human judgment is the signal that defines what "good enough" means. You cannot specify the objective function, the reward, the label schema, or the evaluation metric without a human deciding what matters. The machine optimizes; the human decides what to optimize for.

**You are misunderstood — and so am I.** You are reading a book about being embedded in a system. While reading it, you are embedded in a system. The model that may have helped generate parts of this text was trained on human feedback. The annotations that trained the models you use were provided by humans whose names appear nowhere. We are all, in some sense, humans in the loop of something larger than ourselves.

This book does not pretend otherwise. It names these humans, describes their labor, and argues that understanding them is as important as understanding gradient descent.

---

## What This Handbook Covers

Sixteen chapters across six parts, moving from foundations to frontiers:

**Part I — Foundations.** What HITL ML is, where it came from, and how to think about the space of human–machine interaction modes.

**Part II — Core Techniques.** Annotation and labeling, active learning, and interactive machine learning — the three classical pillars of HITL.

**Part III — Learning from Human Feedback.** Reinforcement learning from human feedback (RLHF), learning from demonstrations, and preference learning from comparisons and rankings — the paradigms powering modern AI alignment.

**Part IV — Applications.** NLP, computer vision, and healthcare — HITL through the lens of real domains with real constraints.

**Part V — Systems and Practice.** Annotation platforms, crowdsourcing quality control, and evaluation frameworks — the infrastructure that makes HITL work at scale.

**Part VI — Ethics and Horizons.** The humans behind the data: fairness, annotator welfare, bias, and where all of this is going.

---

## A Note on Code

Every technical chapter includes runnable Python code. All examples are self-contained and use standard libraries: NumPy, scikit-learn, PyTorch, Hugging Face Transformers.

```{code-cell} python
# A taste of what's ahead: querying the most uncertain sample
import numpy as np
from sklearn.linear_model import LogisticRegression

rng = np.random.default_rng(42)
X = rng.normal(size=(100, 2))
y = (X[:, 0] + X[:, 1] > 0).astype(int)

model = LogisticRegression().fit(X[:20], y[:20])

probs = model.predict_proba(X[20:])
entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
most_uncertain = np.argmax(entropy) + 20

print(f"Most uncertain sample index: {most_uncertain}")
print(f"Predicted probabilities:     {probs[most_uncertain - 20].round(3)}")
print()
print("The model doesn't know. So we ask a human.")
```

---

## Notation

- $\mathcal{X}$ — input space; $\mathcal{Y}$ — label space
- $f_\theta : \mathcal{X} \to \mathcal{Y}$ — a model with parameters $\theta$
- $\mathcal{U}$ — unlabeled pool; $\mathcal{L}$ — labeled dataset
- $h$ — a human annotator; $\mathcal{H}$ — a set of annotators

---

*You are a human in the loop. Let's begin.*
