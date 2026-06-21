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

# Crowdsourcing and Quality Control

When annotation tasks are simple enough to be performed by non-experts, crowdsourcing platforms offer access to large, on-demand annotation workforces at low per-item cost. Building high-quality labeled datasets from crowds requires careful task design, strategic redundancy, and rigorous quality control.

---

## Crowdsourcing Platforms

**Amazon Mechanical Turk (MTurk)** is the original crowdsourcing marketplace, launched in 2005. Workers ("Turkers") complete micro-tasks (HITs) posted by requesters. A 2018 study found median effective hourly earnings for Turkers of approximately $2/hr — well below minimum wage in many high-income countries {cite}`hara2018data` — an ethical concern addressed later in Chapter 15. MTurk is best for simple tasks with clear, verifiable criteria.

**Prolific** is an academic crowdsourcing platform that enforces a minimum pay standard (currently around £9/hr, roughly $11/hr, as stated in Prolific's published guidelines), screens participants by demographics, and maintains a panel of workers who have opted in to research participation. Preferred for social science research and tasks requiring representativeness.

**Appen** (and similar: Telus International, iMerit) provides managed annotation workforces with quality management, used for higher-complexity tasks and enterprise projects.

**Specialized communities.** For domain-specific tasks, communities of domain enthusiasts can provide high-quality annotations: Galaxy Zoo for astronomy, eBird for bird species, Chess Tempo for chess position annotation.

---

## Task Design for Crowdsourcing

### Decompose Complex Tasks

Complex tasks should be decomposed into simple, well-defined micro-tasks. Instead of asking workers to comprehensively annotate a document, ask them one focused question at a time: "Does this sentence contain a person's name?" or "Rate the clarity of this translation on a scale of 1–5."

**Benefits of decomposition:**
- Lower cognitive demand per task → less fatigue, higher quality
- Each micro-task can be separately quality-controlled
- Easier to audit and debug

### The Importance of Instructions

The single biggest predictor of crowdsourcing quality is instruction quality. Good task instructions:
- Explain the *purpose* of the task in one sentence
- Give a clear, unambiguous definition of each category
- Provide 3–5 worked examples (especially edge cases)
- Are no longer than workers will actually read (< 300 words for simple tasks)

Run a **pilot study** (10–50 workers, 20–100 tasks) before scaling. Analyze pilot disagreements; most point to instruction ambiguities that can be fixed.

### Gold Standard Questions

Embed **gold standard questions** — tasks with known correct answers — throughout the task batch. Workers who fail gold questions below a threshold are removed from the project.

```{code-cell} python
import numpy as np
from scipy.stats import binom

rng = np.random.default_rng(42)

def simulate_gold_screening(n_workers=100, gold_per_batch=5,
                             p_good_worker=0.7, good_acc=0.92,
                             bad_acc=0.55, threshold=0.70):
    """
    Simulate quality screening via gold questions.
    Returns: precision and recall of identifying bad workers.
    """
    worker_quality = rng.choice(['good', 'bad'], size=n_workers,
                                 p=[p_good_worker, 1 - p_good_worker])
    results = {'tp': 0, 'fp': 0, 'tn': 0, 'fn': 0}

    for q in worker_quality:
        acc = good_acc if q == 'good' else bad_acc
        n_correct = rng.binomial(gold_per_batch, acc)
        passed = (n_correct / gold_per_batch) >= threshold
        if q == 'bad' and not passed:  results['tp'] += 1
        if q == 'good' and not passed: results['fp'] += 1
        if q == 'bad' and passed:      results['fn'] += 1
        if q == 'good' and passed:     results['tn'] += 1

    tp, fp, fn = results['tp'], results['fp'], results['fn']
    precision = tp / (tp + fp + 1e-6)
    recall    = tp / (tp + fn + 1e-6)
    return precision, recall

# Vary gold question count
gold_counts = [3, 5, 8, 10, 15, 20]
precisions, recalls = [], []
for g in gold_counts:
    p_list, r_list = [], []
    for _ in range(50):
        p, r = simulate_gold_screening(gold_per_batch=g)
        p_list.append(p); r_list.append(r)
    precisions.append(np.mean(p_list))
    recalls.append(np.mean(r_list))

import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(gold_counts, precisions, 'o-', color='#2b3a8f', label='Precision', linewidth=2)
ax.plot(gold_counts, recalls,    's--', color='#0d9e8e', label='Recall',    linewidth=2)
ax.set_xlabel("Gold questions per batch", fontsize=12)
ax.set_ylabel("Screening performance", fontsize=12)
ax.set_title("Worker Screening via Gold Standard Questions", fontsize=13)
ax.legend(fontsize=11); ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('gold_screening.png', dpi=150)
plt.show()

p, r = simulate_gold_screening(gold_per_batch=5)
print(f"5 gold questions: Precision={p:.3f}, Recall={r:.3f}")
p, r = simulate_gold_screening(gold_per_batch=10)
print(f"10 gold questions: Precision={p:.3f}, Recall={r:.3f}")
```

---

## Statistical Models for Label Aggregation

Majority vote is a natural baseline but ignores differences in annotator accuracy. Statistical models can do better.

### The Dawid-Skene Model

The **Dawid-Skene (DS) model** {cite}`dawid1979maximum` jointly estimates:
- The **true label** $z_i$ for each item $i$
- The **confusion matrix** $\pi_j^{(k,l)}$ for each annotator $j$: the probability that annotator $j$ labels an item with true class $k$ as class $l$

The EM algorithm iterates:
- **E-step:** Given annotator confusion matrices, compute posterior probability of each true label
- **M-step:** Given item label estimates, update annotator confusion matrices

```{code-cell} python
import numpy as np
from scipy.special import softmax

def dawid_skene_em(annotations, n_classes, n_iter=20):
    """
    Simplified Dawid-Skene EM for binary classification.
    annotations: dict {item_idx: [(annotator_idx, label), ...]}
    Returns: estimated true labels and annotator accuracies.
    """
    items = sorted(annotations.keys())
    n_items = len(items)
    annotators = sorted({a for anns in annotations.values() for a, _ in anns})
    n_annotators = len(annotators)
    ann_idx = {a: i for i, a in enumerate(annotators)}

    # Initialize: majority vote
    T = np.zeros((n_items, n_classes))  # soft label estimates
    for i, item in enumerate(items):
        for _, label in annotations[item]:
            T[i, label] += 1
        T[i] /= T[i].sum()

    # Confusion matrices: shape (n_annotators, n_classes, n_classes)
    PI = np.ones((n_annotators, n_classes, n_classes)) * 0.5

    for _ in range(n_iter):
        # M-step: update confusion matrices
        PI = np.zeros((n_annotators, n_classes, n_classes)) + 1e-6
        for i, item in enumerate(items):
            for ann, label in annotations[item]:
                a = ann_idx[ann]
                for k in range(n_classes):
                    PI[a, k, label] += T[i, k]
        PI /= PI.sum(axis=2, keepdims=True)

        # E-step: update soft label estimates
        T = np.zeros((n_items, n_classes))
        for i, item in enumerate(items):
            log_p = np.zeros(n_classes)
            for ann, label in annotations[item]:
                a = ann_idx[ann]
                log_p += np.log(PI[a, :, label] + 1e-10)
            T[i] = softmax(log_p)

    return {item: T[i] for i, item in enumerate(items)}, PI

# Simulate crowdsourcing scenario
rng = np.random.default_rng(42)
N_ITEMS, N_ANNOTATORS, ANNS_PER_ITEM = 200, 10, 3
true_labels = rng.integers(0, 2, N_ITEMS)
# Annotator accuracies: 3 good (0.9), 4 medium (0.75), 3 noisy (0.6)
accuracies = [0.90]*3 + [0.75]*4 + [0.60]*3

annotations = {}
for i in range(N_ITEMS):
    anns_for_item = []
    chosen = rng.choice(N_ANNOTATORS, ANNS_PER_ITEM, replace=False)
    for a in chosen:
        acc = accuracies[a]
        label = true_labels[i] if rng.random() < acc else 1 - true_labels[i]
        anns_for_item.append((a, int(label)))
    annotations[i] = anns_for_item

# Run Dawid-Skene
soft_labels, confusion = dawid_skene_em(annotations, n_classes=2, n_iter=30)
ds_preds = {i: int(np.argmax(soft_labels[i])) for i in range(N_ITEMS)}

# Compare with majority vote
mv_preds = {}
for i in range(N_ITEMS):
    votes = [l for _, l in annotations[i]]
    mv_preds[i] = int(np.round(np.mean(votes)))

ds_acc = np.mean([ds_preds[i] == true_labels[i] for i in range(N_ITEMS)])
mv_acc = np.mean([mv_preds[i] == true_labels[i] for i in range(N_ITEMS)])

print(f"Majority vote accuracy:  {mv_acc:.3f}")
print(f"Dawid-Skene accuracy:    {ds_acc:.3f}")
print(f"\nEstimated annotator accuracies (diagonal of confusion matrix):")
for a in range(N_ANNOTATORS):
    est_acc = np.mean([confusion[a, k, k] for k in range(2)])
    print(f"  Annotator {a}: estimated={est_acc:.3f}, true={accuracies[a]:.2f}")
```

### MACE

**MACE (Multi-Annotator Competence Estimation)** {cite}`hovy2013learning` is an alternative probabilistic model that explicitly represents annotator spamming (random labeling) vs. competent annotation. An annotator either provides a meaningful label (with probability $1 - \text{spam}_j$) or a random label (with probability $\text{spam}_j$). This two-component model is often better calibrated than Dawid-Skene for crowdsourcing scenarios where some annotators are pure spammers.

---

## Redundancy and Aggregation Strategy

The optimal number of annotators per item depends on the task difficulty and annotator quality:

- **Easy tasks with skilled annotators:** 1–2 annotators per item is often sufficient
- **Moderate tasks with trained annotators:** 3 annotators + majority vote
- **Difficult/subjective tasks with crowdworkers:** 5–7 annotators + Dawid-Skene

The key insight: redundancy is most valuable when annotator accuracy is low. For annotators with accuracy $p$, majority vote accuracy with $n$ annotators is:

$$
P(\text{MV correct}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

For $p = 0.70$, adding a third annotator increases majority vote accuracy from 70% to 78%; for $p = 0.90$, the gain from a third annotator is negligible (from 90% to 97%).

```{seealso}
Dawid-Skene model: {cite}`dawid1979maximum`. MACE: {cite}`hovy2013learning`. For a comprehensive review of crowdsourcing for NLP: {cite}`snow2008cheap`. Crowd ethics and fair pay: see Chapter 15.
```
