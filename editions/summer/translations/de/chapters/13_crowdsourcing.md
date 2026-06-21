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

# Crowdsourcing und Qualitätssicherung

Wenn Annotationsaufgaben einfach genug sind, um von Nicht-Experten durchgeführt zu werden, bieten Crowdsourcing-Plattformen Zugang zu großen, on-demand Annotationsbelegschaften zu niedrigen Stückkosten. Der Aufbau hochwertiger annotierter Datensätze aus Menschenmassen erfordert sorgfältiges Aufgabendesign, strategische Redundanz und rigorose Qualitätskontrolle.

---

## Crowdsourcing-Plattformen

**Amazon Mechanical Turk (MTurk)** ist der originale Crowdsourcing-Marktplatz, der 2005 gestartet wurde. Arbeiter („Turker") erledigen Mikro-Aufgaben (HITs), die von Auftraggebern eingestellt werden. Eine Studie aus 2018 fand einen medianen effektiven Stundenlohn für Turker von ca. 2 $/Std. — weit unter dem Mindestlohn in vielen Hocheinkommensländern {cite}`hara2018data` — ein ethisches Anliegen, das in Kapitel 15 behandelt wird. MTurk eignet sich am besten für einfache Aufgaben mit klaren, verifizierbaren Kriterien.

**Prolific** ist eine akademische Crowdsourcing-Plattform, die einen Mindestlohnstandard durchsetzt (derzeit ca. 9 £/Std., ca. 11 $/Std., wie in den veröffentlichten Richtlinien von Prolific angegeben), Teilnehmer nach demografischen Merkmalen auswählt und ein Panel von Arbeitern pflegt, die sich für die Forschungsteilnahme angemeldet haben. Bevorzugt für sozialwissenschaftliche Forschung und Aufgaben, die Repräsentativität erfordern.

**Appen** (und ähnliche: Telus International, iMerit) bietet verwaltete Annotationsbelegschaften mit Qualitätsmanagement für komplexere Aufgaben und Unternehmensprojekte.

**Spezialisierte Gemeinschaften.** Für domänenspezifische Aufgaben können Gemeinschaften von Fachbegeisterten hochwertige Annotationen liefern: Galaxy Zoo für Astronomie, eBird für Vogelarten, Chess Tempo für Schachpositions-Annotation.

---

## Aufgabendesign für Crowdsourcing

### Komplexe Aufgaben zerlegen

Komplexe Aufgaben sollten in einfache, klar definierte Mikro-Aufgaben zerlegt werden. Anstatt Arbeiter zu bitten, ein Dokument umfassend zu annotieren, sollte man ihnen eine fokussierte Frage auf einmal stellen: „Enthält dieser Satz einen Personennamen?" oder „Bewerten Sie die Klarheit dieser Übersetzung auf einer Skala von 1–5."

**Vorteile der Zerlegung:**
- Geringere kognitive Anforderung pro Aufgabe → weniger Ermüdung, höhere Qualität
- Jede Mikro-Aufgabe kann separat qualitätskontrolliert werden
- Einfacher zu prüfen und zu debuggen

### Die Bedeutung von Anweisungen

Der einzige wichtigste Prädiktor für Crowdsourcing-Qualität ist die Qualität der Anweisungen. Gute Aufgabenanweisungen:
- Erklären den *Zweck* der Aufgabe in einem Satz
- Geben eine klare, eindeutige Definition jeder Kategorie
- Bieten 3–5 ausgearbeitete Beispiele (besonders Randfälle)
- Sind nicht länger, als Arbeiter tatsächlich lesen werden (< 300 Wörter für einfache Aufgaben)

Führen Sie eine **Pilotstudie** durch (10–50 Arbeiter, 20–100 Aufgaben), bevor Sie skalieren. Analysieren Sie Pilot-Uneinigkeiten; die meisten zeigen auf Anweisungs-Ambiguitäten, die behoben werden können.

### Goldstandard-Fragen

**Goldstandard-Fragen** — Aufgaben mit bekannten richtigen Antworten — in den Aufgabenstapel einbetten. Arbeiter, die Goldfragen unter einem Schwellenwert nicht bestehen, werden aus dem Projekt entfernt.

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

## Statistische Modelle für Label-Aggregation

Mehrheitsvoting ist eine natürliche Ausgangslinie, ignoriert aber Unterschiede in der Annotatorengenauigkeit. Statistische Modelle können besser abschneiden.

### Das Dawid-Skene-Modell

Das **Dawid-Skene-Modell (DS)** {cite}`dawid1979maximum` schätzt gemeinsam:
- Das **wahre Label** $z_i$ für jeden Eintrag $i$
- Die **Konfusionsmatrix** $\pi_j^{(k,l)}$ für jeden Annotator $j$: die Wahrscheinlichkeit, dass Annotator $j$ einen Eintrag mit wahrer Klasse $k$ als Klasse $l$ kennzeichnet

Der EM-Algorithmus iteriert:
- **E-Schritt:** Gegeben Annotator-Konfusionsmatrizen, berechne die posteriore Wahrscheinlichkeit jedes wahren Labels
- **M-Schritt:** Gegeben Item-Label-Schätzungen, aktualisiere Annotator-Konfusionsmatrizen

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

**MACE (Multi-Annotator Competence Estimation)** {cite}`hovy2013learning` ist ein alternatives probabilistisches Modell, das explizit Annotator-Spamming (zufällige Kennzeichnung) vs. kompetente Annotation darstellt. Ein Annotator gibt entweder ein bedeutungsvolles Label (mit Wahrscheinlichkeit $1 - \text{spam}_j$) oder ein zufälliges Label (mit Wahrscheinlichkeit $\text{spam}_j$). Dieses Zwei-Komponenten-Modell ist oft besser kalibriert als Dawid-Skene für Crowdsourcing-Szenarien, bei denen einige Annotatoren reine Spam-Absender sind.

---

## Redundanz- und Aggregationsstrategie

Die optimale Anzahl von Annotatoren pro Element hängt von der Aufgabenschwierigkeit und der Annotatorenqualität ab:

- **Einfache Aufgaben mit qualifizierten Annotatoren:** 1–2 Annotatoren pro Element ist oft ausreichend
- **Moderate Aufgaben mit trainierten Annotatoren:** 3 Annotatoren + Mehrheitsvoting
- **Schwierige/subjektive Aufgaben mit Crowdworkern:** 5–7 Annotatoren + Dawid-Skene

Die Schlüsselerkenntnis: Redundanz ist am wertvollsten, wenn die Annotatorengenauigkeit niedrig ist. Für Annotatoren mit Genauigkeit $p$ beträgt die Mehrheitsvoting-Genauigkeit mit $n$ Annotatoren:

$$
P(\text{MV korrekt}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

Für $p = 0,70$ steigert das Hinzufügen eines dritten Annotators die Mehrheitsvoting-Genauigkeit von 70 % auf 78 %; für $p = 0,90$ ist der Gewinn durch einen dritten Annotator vernachlässigbar (von 90 % auf 97 %).

```{seealso}
Dawid-Skene-Modell: {cite}`dawid1979maximum`. MACE: {cite}`hovy2013learning`. Für eine umfassende Übersicht des Crowdsourcing für NLP: {cite}`snow2008cheap`. Crowd-Ethik und fairer Lohn: siehe Kapitel 15.
```
