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

# Data Annotation and Labeling

Data annotation is the most ubiquitous form of human involvement in ML. Before a model can learn, someone must tell it what the correct answers are — and that someone is usually a human. This chapter covers the theory and practice of annotation: what makes annotation hard, how to design annotation tasks, how to measure quality, and how to handle disagreement.

---

## Types of Annotation

Annotation tasks vary enormously in their structure, difficulty, and cost. The major types include:

### Classification

The annotator assigns each instance to one of $K$ predefined categories. This is the simplest annotation task cognitively, but defining a good category scheme (a *taxonomy*) can be surprisingly difficult.

**Binary classification** (is this image a cat?) is the simplest case. **Multiclass** (what species is this animal?) requires annotators to choose one option from a list. **Multilabel** annotation (what topics does this article cover?) allows multiple simultaneous labels.

### Sequence Labeling

Each token in a sequence receives a label. Named Entity Recognition (NER) is the canonical example — annotators mark spans of text as PERSON, ORGANIZATION, LOCATION, etc. Annotation is typically performed using the BIO (Beginning-Inside-Outside) or BIOES tagging scheme:

```text
  B-ORG    O           B-ORG    O     O      O
```

### Span and Relation Annotation

Beyond labeling individual tokens, annotators may need to:
- Identify spans (multi-token expressions) and assign types
- Mark *relations* between spans ("Apple" ACQUIRED "Shazam")
- Annotate coreference chains (all mentions of the same entity)

These tasks are cognitively demanding and have lower inter-annotator agreement.

### Bounding Boxes and Object Detection

Annotators draw rectangles around objects in images and assign a category label to each box. Localization precision matters: a box that is too small misses context; a box that is too large includes background. Modern annotation tools compute intersection-over-union (IoU) with reference annotations to flag quality issues.

### Segmentation

Pixel-level annotation: each pixel is assigned to a class (semantic segmentation) or to a specific object instance (instance segmentation). High quality segmentation is among the most expensive annotation types, with costs ranging from tens to over a hundred dollars per image for complex scenes depending on domain and tool support.

### Transcription and Translation

Audio → text (ASR training data), handwriting → text (OCR data), or source language → target language (MT data). These tasks require linguistic expertise and cannot be done reliably by untrained annotators.

---

## Annotation Guidelines

The single most important determinant of annotation quality is the quality of the **annotation guidelines**: the written instructions annotators follow.

Good guidelines:
- State the task goal and explain *why* the label matters
- Provide a clear definition for each category with positive and negative examples
- Address common edge cases and hard cases explicitly
- Specify what to do when uncertain (e.g., mark "skip" vs. forced choice)
- Include worked examples of complete annotation

Poor guidelines rely on annotators to "use common sense" for edge cases — which leads to inconsistent decisions that degrade model quality and inflate inter-annotator disagreement.

```{admonition} Guideline development is iterative
:class: note

Do not expect to write perfect guidelines upfront. Run a small pilot annotation round, analyze disagreements, and update the guidelines. Repeat. Well-developed guidelines typically go through 3–5 revision cycles before they stabilize.
```

---

## Measuring Annotation Quality: Inter-Annotator Agreement

When multiple annotators label the same data, their agreement can be measured. High agreement suggests the task is well-defined and the annotators understood it. Low agreement suggests ambiguity in the task, the guidelines, or the data itself.

### Cohen's Kappa

For two annotators labeling data into $K$ categories, **Cohen's kappa** {cite}`cohen1960coefficient` corrects observed agreement for chance:

$$
\kappa = \frac{P_o - P_e}{1 - P_e}
$$

where $P_o$ is observed proportional agreement and $P_e$ is the probability of agreement by chance (computed from the marginal label distributions).

$\kappa = 1$ means perfect agreement; $\kappa = 0$ means agreement no better than chance; $\kappa < 0$ means systematic disagreement.

| $\kappa$ range | Interpretation      |
|----------------|---------------------|
| $< 0$          | Less than chance    |
| $0.0 - 0.20$   | Slight              |
| $0.21 - 0.40$  | Fair                |
| $0.41 - 0.60$  | Moderate            |
| $0.61 - 0.80$  | Substantial         |
| $0.81 - 1.00$  | Almost perfect      |

### Fleiss' Kappa

Extends Cohen's kappa to $M > 2$ annotators. Each annotator independently labels each item; the formula aggregates across annotators:

$$
\kappa_F = \frac{\bar{P} - \bar{P}_e}{1 - \bar{P}_e}
$$

where $\bar{P}$ is the mean pairwise agreement across all annotator pairs, and $\bar{P}_e$ is the expected agreement under random assignment.

### Krippendorff's Alpha

The most general metric, supporting any number of annotators, any scale type (nominal, ordinal, interval, ratio), and missing data {cite}`krippendorff2011computing`:

$$
\alpha = 1 - \frac{D_o}{D_e}
$$

where $D_o$ is observed disagreement and $D_e$ is expected disagreement. Krippendorff's alpha is generally preferred in academic work because of its flexibility.

```{code-cell} python
import numpy as np
from sklearn.metrics import cohen_kappa_score

# Simulate two annotators labeling 200 items into 3 categories
rng = np.random.default_rng(0)
true_labels = rng.integers(0, 3, size=200)

# Annotator 1: mostly agrees with ground truth
ann1 = true_labels.copy()
flip_mask = rng.random(200) < 0.15
ann1[flip_mask] = rng.integers(0, 3, size=flip_mask.sum())

# Annotator 2: less consistent
ann2 = true_labels.copy()
flip_mask2 = rng.random(200) < 0.30
ann2[flip_mask2] = rng.integers(0, 3, size=flip_mask2.sum())

kappa_12 = cohen_kappa_score(ann1, ann2)
kappa_1true = cohen_kappa_score(ann1, true_labels)
kappa_2true = cohen_kappa_score(ann2, true_labels)

print(f"Cohen's κ (ann1 vs ann2):   {kappa_12:.3f}")
print(f"Cohen's κ (ann1 vs truth):  {kappa_1true:.3f}")
print(f"Cohen's κ (ann2 vs truth):  {kappa_2true:.3f}")
```

---

## Handling Disagreements

When annotators disagree, there are several strategies:

### Majority Vote

The most common label is taken as the gold standard. Simple and robust when the number of annotators per item is odd. Fails when a minority group of annotators is systematically more accurate.

### Weighted Voting

Annotators are weighted by their estimated accuracy (derived from agreement with a gold standard or other annotators). More accurate annotators have more influence.

### Soft Labels

Rather than collapsing annotations to a single label, preserve the distribution. If 3 of 5 annotators said "positive" and 2 said "neutral," represent this as $(p_\text{pos}, p_\text{neutral}, p_\text{neg}) = (0.6, 0.4, 0.0)$. Training on soft labels improves calibration.

### Arbitration

A senior annotator or domain expert adjudicates disagreements. Gold standard but expensive; typically reserved for high-stakes domains.

### Statistical Models

More sophisticated approaches model annotator competence probabilistically. The **Dawid-Skene** model {cite}`dawid1979maximum` simultaneously estimates annotator confusion matrices and item true labels via EM. See Chapter 13 for details.

---

## Label Noise and Its Effects

Real annotation is noisy. The effects of label noise on model training depend on the noise type:

- **Random noise** (labels randomly flipped) degrades performance but models are surprisingly robust to moderate levels (up to ~20% for many tasks).
- **Systematic/adversarial noise** (labels consistently wrong in specific patterns) is far more damaging and harder to detect.
- **Class-conditional noise** (errors more likely for certain classes) biases the model's decision boundary.

A practical rule of thumb: with $n$ training examples and $\epsilon$ fraction of corrupted labels, model performance degrades roughly as if you had $(1 - 2\epsilon)^2 n$ clean examples {cite}`natarajan2013learning`. For $\epsilon = 0.2$, this is equivalent to losing 36% of your data.

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(42)
X, y = make_classification(n_samples=2000, n_features=20, random_state=42)

noise_levels = np.linspace(0, 0.45, 15)
mean_accs = []

for eps in noise_levels:
    y_noisy = y.copy()
    flip = rng.random(len(y)) < eps
    y_noisy[flip] = 1 - y_noisy[flip]
    scores = cross_val_score(LogisticRegression(max_iter=500), X, y_noisy, cv=5)
    mean_accs.append(scores.mean())

plt.figure(figsize=(7, 4))
plt.plot(noise_levels, mean_accs, 'o-', color='#2b3a8f', linewidth=2)
plt.xlabel("Label noise rate (ε)", fontsize=12)
plt.ylabel("Cross-validated accuracy", fontsize=12)
plt.title("Effect of Label Noise on Model Performance", fontsize=13)
plt.axvline(0.2, color='#e05c5c', linestyle='--', alpha=0.7, label='20% noise')
plt.legend()
plt.tight_layout()
plt.savefig('label_noise_effect.png', dpi=150)
plt.show()
print(f"\nAccuracy at 0% noise:  {mean_accs[0]:.3f}")
print(f"Accuracy at 20% noise: {mean_accs[round(0.2 / 0.45 * 14)]:.3f}")
print(f"Accuracy at 40% noise: {mean_accs[-2]:.3f}")
```

---

## Annotation Cost and Throughput

Understanding annotation economics is essential for project planning.

| Task type               | Typical throughput | Cost per item (specialist) |
|-------------------------|-------------------|---------------------------|
| Binary image classification | 200–500/hr   | $0.02–0.10                |
| NER (short text)        | 50–150 items/hr   | $0.10–0.50                |
| Relation extraction     | 20–60 items/hr    | $0.30–1.50                |
| Medical image segmentation | 5–30 items/hr | $10–100                   |
| Video annotation        | 5–20 min video/hr | $20–200                   |

These figures are approximate order-of-magnitude estimates and vary enormously by domain expertise required, annotation tool quality, guideline clarity, and annotator experience. They should be treated as illustrative, not prescriptive.

```{seealso}
Annotation tool options are covered in Chapter 12. Statistical models for crowdsourced annotation (Dawid-Skene, MACE) are covered in Chapter 13.
```
