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

# HITL in Healthcare and Science

Healthcare and science represent two of the domains where HITL ML is most consequential and most debated. The stakes are high: a missed cancer diagnosis or a flawed drug target has real human cost. Annotation requires rare and expensive expertise. Regulatory requirements constrain what models can do and how they must be validated. And unlike NLP, where the annotation problem is partially one of social construction, here there is often genuine ground truth — a tumor is present or it is not — even if no individual observer can reliably determine it.

The dominant framing in popular coverage is "AI vs. human": will AI replace radiologists? This framing is wrong in a way that matters. The real question is what form of human-AI collaboration produces better outcomes than either alone, and how to build systems that enable that collaboration rather than disrupting it.

---

## Medical Image Analysis

Medical imaging — radiology (X-ray, CT, MRI), pathology (tissue slides), dermatology, ophthalmology — is the domain where medical AI has advanced most rapidly.

### Expert Annotator Requirements

Medical image annotation typically requires physicians with specific subspecialty training. This makes annotation:

- **Slow:** Specialists have limited time; annotation competes with clinical duties
- **Expensive:** Costs range from tens to hundreds of dollars per annotated case, depending on subspecialty, modality, and task complexity
- **Variable:** Even specialists disagree, especially on borderline cases — a fact that is often treated as a problem but is actually informative

### Inter-Radiologist Variability

Reader variability is well-documented in radiology. For chest X-ray interpretation, inter-reader disagreement is substantial — in the CheXNet study, four radiologists labelled the same pneumonia detection test set with F1 scores spanning a range of several percentage points {cite}`rajpurkar2017chexnet`, reflecting genuine diagnostic uncertainty on borderline cases. For nodule detection on lung CT, intra-reader variability (same reader, same case, different day) can be as large as inter-reader variability.

This variability is not just noise — it reflects genuine diagnostic uncertainty. Models trained on a single radiologist's annotations may learn that physician's specific biases rather than the underlying pathology.

:::{admonition} The CheXNet Controversy as a HITL Lesson
:class: note

When Rajpurkar et al. claimed that their CheXNet model "exceeded radiologist performance" on pneumonia detection, the claim was immediately contested by the radiology community {cite}`yu2022assessing`. Part of the controversy was about the specific test set and radiologist comparison. But a deeper issue was methodological: the "radiologist performance" baseline used solo readers under time pressure, while clinical radiology typically involves consultation, comparison to prior imaging, and access to clinical context — none of which the model had.

The lesson is not that the model was good or bad, but that **performance comparisons require specifying the HITL setup**. A model that outperforms a solo radiologist reading cold may still be less accurate than a radiologist using the model's output as a second opinion. These are different systems with different error modes, and aggregating them differently.
:::

:::{admonition} Soft labels in medicine
:class: important

Several medical AI projects have moved to using **soft labels** that reflect the distribution of expert opinions rather than a single "gold standard" label. A chest X-ray labeled as 60% pneumonia / 40% atelectasis by a panel of radiologists carries more information than a forced binary choice. Models trained on such distributions show better calibration and more appropriate uncertainty quantification — and that uncertainty is clinically meaningful, since it tells the clinician when to consult, not just what the model thinks.
:::

### Active Learning for Rare Conditions

Active learning is especially valuable for rare diseases and rare pathologies, where even a large unlabeled pool contains only a small number of positive cases. Standard random sampling would waste expert time labeling mostly negative cases.

Uncertainty-based active learning naturally selects the borderline cases where the model is uncertain — which, for rare conditions, tend to be the positive cases and borderline negatives. This concentrates specialist time where it is most valuable. The combination of class-imbalanced training (with `class_weight='balanced'` or similar) and uncertainty-based selection is standard practice for rare-pathology detection tasks.

---

## Clinical NLP Annotation

Electronic health records (EHRs) contain an enormous wealth of clinical narrative text: physician notes, discharge summaries, radiology reports, pathology reports. Extracting structured information from this text requires NLP — and high-quality NLP requires annotated training data.

**Common clinical NLP annotation tasks:**
- **Clinical NER:** Identifying medications, dosages, diagnoses, procedures, and symptoms in text
- **Negation detection:** "No evidence of pneumonia" vs. "Pneumonia confirmed" — a critical distinction that is surprisingly difficult
- **Temporal reasoning:** Distinguishing current conditions from history ("history of MI, presented with chest pain")
- **De-identification:** Removing Protected Health Information (PHI) to enable data sharing

**PHI de-identification** is both an annotation task and a data governance requirement. Under HIPAA (US) and GDPR (EU), health data cannot be shared without removing or anonymizing patient identifiers. Automated de-identification tools exist but are imperfect; human review of automated outputs is standard practice, and the risk profile is asymmetric: false negatives (missed PHI) create legal exposure, making conservative thresholds necessary.

### i2b2 / n2c2 as a Template

The i2b2 (Informatics for Integrating Biology and the Bedside) and successor n2c2 (National NLP Clinical Challenges) shared-task initiatives have released a series of expert-annotated clinical NLP datasets. These illustrate both the potential and the cost: annotation efforts typically involve teams of clinical domain experts working over several months, annotating hundreds of documents per challenge. The n2c2 datasets have catalyzed rapid progress precisely because they solved the data-sharing governance problem (de-identification + institutional agreements), not just the annotation problem.

---

## Regulatory Considerations

Medical AI is subject to regulatory oversight in most jurisdictions.

**FDA (United States):** AI/ML-based Software as a Medical Device (SaMD) requires premarket approval or clearance. The FDA's 2021 AI/ML Action Plan emphasizes **predetermined change control plans** — documenting how the model will be updated and how those updates will be validated before deployment. A model that continuously learns from clinical feedback is, under this framework, a different device after each update and may require re-validation.

**CE marking (Europe):** Medical devices including AI systems must comply with the Medical Device Regulation (MDR). MDR requires clinical evaluation, post-market surveillance, and documentation of the data used for training and validation.

**Key HITL implication:** Regulatory frameworks require clear documentation of annotation processes, annotator qualifications, inter-rater reliability, and any changes to training data. This is not bureaucratic overhead — it is the audit trail that allows a clinician to understand what training data produced the model's current behavior, and it is legally required. HITL pipelines that treat annotation as an informal subprocess create regulatory risk that typically becomes visible only at the worst moment.

---

## Scientific Data Annotation

Beyond healthcare, HITL ML plays a growing and underappreciated role in scientific research, where the annotation challenge often blends domain expertise with scale.

### Astronomy: Galaxy Zoo

Galaxy Zoo {cite}`lintott2008galaxy` crowdsourced the morphological classification of galaxies from the Sloan Digital Sky Survey to citizen scientists. The original project collected over 40 million classifications from more than 100,000 volunteers, demonstrating that large-scale crowdsourcing of scientific image classification is feasible when the task can be decomposed into simple questions answerable without specialist training ("Is this galaxy smooth or featured?").

The Galaxy Zoo experience produced two important methodological findings. First, agreement between citizen scientists and professional astronomers was high for clear cases and systematically diverged on edge cases — precisely the cases where the distinction matters scientifically. The solution was not to discard citizen science data on edge cases but to treat the distribution of volunteer responses as a soft label encoding genuine morphological ambiguity. Second, the classifier trained on Galaxy Zoo labels outperformed models trained to reproduce any single expert's labels, because the crowd distribution captured real visual uncertainty that a single expert's forced choice collapsed.

### Genomics: Pathogenicity Classification

Annotating genomic variants — deciding whether a variant is pathogenic, benign, or of uncertain significance — is a high-stakes NLP and expert judgment problem. Clinical variant databases like ClinVar aggregate expert interpretations from multiple submitting labs, and disagreement between labs is common. Active learning is used to prioritize which variants require full expert review (literature search, functional evidence evaluation) versus which can be auto-classified by existing evidence. The result is a hybrid pipeline where most variants are handled by automated logic, a subset requires expert review, and the hardest cases are flagged for multi-lab consensus.

### Climate and Earth Science

Labeling satellite imagery for land use change, deforestation, glacier extent, and storm tracks involves remote sensing experts and increasingly, citizen science platforms. The primary HITL challenge in this domain is temporal: labels made today may become stale as the world changes, and ground-truth verification (field surveys) is expensive and logistically constrained. Active learning that prioritizes images where the model's prediction disagrees with physical priors (e.g., predicting deforestation in a region known to be protected) is a practical way to direct scarce field verification resources.

### Neuroscience: Connectomics

Reconstructing neural circuits from electron microscope images — connectomics — requires pixel-level annotation of neuron membranes across enormous image stacks. The Eyewire project gamified this task, engaging tens of thousands of players in tracing neurons through 3D image volumes. The gamification design solved a specific HITL problem: the task requires sustained attention and spatial reasoning over long sessions, which causes quality degradation in traditional annotation. Breaking the task into game segments with social mechanics maintained annotator engagement and quality at scales that professional annotation cannot achieve.

---

## Managing Specialist Annotators

When annotation requires rare expertise, the usual crowdsourcing approaches (Chapter 13) do not apply.

**The fundamental tension** is that the people who can produce the highest-quality annotations are also the people whose time is most valuable and most constrained. Every design decision in a specialist annotation pipeline should be evaluated against the question: does this make the best use of scarce expert time?

**What this means in practice:**

- **Pre-annotate aggressively.** Use lower-tier annotators, automated models, or rule-based systems to generate candidates that the specialist reviews and corrects rather than creating from scratch. The specialist's judgment is the bottleneck; feeding them a pre-annotation to correct is faster than asking them to annotate from a blank screen, provided the pre-annotation quality is sufficient that correction is not slower than starting over.

- **Design for expert attention, not throughput.** Annotation interfaces optimized for high throughput (rapid binary decisions, keyboard shortcuts, minimal display) are appropriate for crowdsourcing. Specialist annotation often benefits from richer interfaces: side-by-side comparison with prior cases, easy access to reference materials, annotation confidence fields, and the ability to flag a case for discussion. These slow individual annotations but improve quality and reduce the need for re-annotation.

- **Track individual annotator patterns explicitly.** With a small pool of specialists, it is feasible and important to track each annotator's agreement rate with the panel, flag cases that seem inconsistent with their own history, and discuss them in regular calibration sessions. This is not surveillance — it is the same quality process that clinical medicine uses for performance review, and specialists generally respond well when it is framed as shared quality improvement rather than assessment.

- **Session design matters.** Medical annotation is cognitively demanding. Evidence from radiology and pathology suggests that error rates increase measurably after roughly 90 minutes of continuous reading, and that breaks of even a few minutes can partially restore attention. Annotation interfaces that enforce break prompts (without making them dismissable) are a simple HITL design decision with real quality impact.

---

## A HITL Active Learning Pipeline for Medical Imaging

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.datasets import make_classification
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

# Simulate a rare-pathology detection task
# 8% positive class (e.g., rare pathology)
X, y = make_classification(
    n_samples=5000, n_features=100,
    n_informative=20, n_redundant=10,
    weights=[0.92, 0.08],
    random_state=42
)
X_train, y_train = X[:4000], y[:4000]
X_test,  y_test  = X[4000:], y[4000:]

print(f"Training set positive prevalence: {y_train.mean():.1%}")

def run_medical_al(strategy, n_initial=50, budget=300):
    labeled = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled = [i for i in range(len(X_train)) if i not in labeled]
    aucs = []

    while len(labeled) < n_initial + budget:
        model = LogisticRegression(max_iter=500, class_weight='balanced')
        model.fit(X_train[labeled], y_train[labeled])

        if len(labeled) % 30 == 0:
            preds = model.predict_proba(X_test)[:, 1]
            aucs.append(roc_auc_score(y_test, preds))

        X_pool = X_train[unlabeled]
        if strategy == 'uncertainty' and len(labeled) >= 10:
            probs = model.predict_proba(X_pool)
            entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
            q = int(np.argmax(entropy))
        else:
            q = rng.integers(0, len(unlabeled))

        labeled.append(unlabeled.pop(q))

    return np.array(aucs)

aucs_al  = run_medical_al('uncertainty')
aucs_rnd = run_medical_al('random')
label_counts = np.arange(len(aucs_al)) * 30 + 50

plt.figure(figsize=(7, 4))
plt.plot(label_counts, aucs_al,  'o-',  color='#2b3a8f', linewidth=2, label='Uncertainty AL')
plt.plot(label_counts, aucs_rnd, 's--', color='#e05c5c', linewidth=2, label='Random baseline')
plt.xlabel("Expert labels obtained", fontsize=12)
plt.ylabel("AUROC", fontsize=12)
plt.title("Active Learning for Rare Pathology Detection", fontsize=13)
plt.legend(); plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('medical_al.png', dpi=150)
plt.show()

# Show how AL preferentially selects positive examples
# by checking which class the queried examples belong to
n_init = 50
labeled_al  = list(rng.choice(len(X_train), n_init, replace=False))
labeled_rnd = labeled_al.copy()
unlabeled_al  = [i for i in range(len(X_train)) if i not in labeled_al]
unlabeled_rnd = unlabeled_al.copy()

model = LogisticRegression(max_iter=500, class_weight='balanced')
model.fit(X_train[labeled_al], y_train[labeled_al])
probs = model.predict_proba(X_train[unlabeled_al])
entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
top50_al  = [unlabeled_al[i] for i in np.argsort(entropy)[-50:]]
top50_rnd = list(rng.choice(unlabeled_rnd, 50, replace=False))

pos_rate_al  = y_train[top50_al].mean()
pos_rate_rnd = y_train[top50_rnd].mean()
print(f"\nPositive rate in next 50 queries:")
print(f"  Uncertainty AL: {pos_rate_al:.1%}  (base rate: {y_train.mean():.1%})")
print(f"  Random:         {pos_rate_rnd:.1%}")
print(f"  AL queries {pos_rate_al/y_train.mean():.1f}x more positives than random")
```

```{seealso}
Galaxy Zoo crowdsourcing: {cite}`lintott2008galaxy`. CheXNet radiologist performance: {cite}`rajpurkar2017chexnet`. Radiograph quality and AI-assisted diagnosis: {cite}`yu2022assessing`. Clinical NLP annotation methodology: {cite}`pustejovsky2012natural`. For FDA AI/ML action plan guidance, see the FDA's published documentation (2021).
```
