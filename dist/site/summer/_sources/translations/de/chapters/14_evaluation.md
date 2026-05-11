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

# Evaluierung und Metriken

Zu wissen, ob Ihr HITL-System funktioniert, erfordert mehr als die Messung der Modellgenauigkeit. Sie müssen wissen, ob Sie Wert aus Ihrem Annotationsbudget schöpfen, ob das Modell tatsächlich besser auf die menschliche Absicht ausgerichtet ist und ob zusätzliches menschliches Feedback die Dinge weiter verbessern wird. Dieses Kapitel deckt die gesamte Landschaft der Evaluierung in HITL-Szenarien ab.

---

## Modell-zentrische Metriken

Standard-ML-Metriken gelten direkt für HITL-Systeme, mit einigen wichtigen Nuancen.

### Klassifikationsmetriken

**Genauigkeit** ist geeignet, wenn Klassen ausgeglichen und alle Fehler gleich kostspielig sind. In HITL-Kontexten kann jedoch das annotierte Test-Set durch die Anfragestrategie verzerrt sein (aktives Lernen fragt nicht-zufällige Beispiele an), was einfache Genauigkeitsschätzungen unzuverlässig macht.

**F1-Score** ist das harmonische Mittel von Präzision und Recall, geeignet für unausgeglichene Klassen. In HITL-Kontexten können Präzision und Recall je nach Kostenasymmetrie zwischen Falsch-Positiven und Falsch-Negativen unterschiedlich wichtig sein.

**AUROC** misst die Fähigkeit des Modells, zwischen Klassen unabhängig vom Schwellenwert zu unterscheiden — wichtig für kalibrierungssensible Aufgaben wie medizinisches Screening.

**Kalibrierung** misst, wie gut vorhergesagte Wahrscheinlichkeiten empirischen Häufigkeiten entsprechen. In HITL-Systemen können auf verzerrten annotierten Mengen (aus aktivem Lernen) trainierte Modelle schlecht kalibriert sein, auch wenn sie genau sind.

### Generative Modell-Metriken

Für Sprachmodelle und generative Systeme ist die Evaluierung grundsätzlich schwieriger. Keine einzelne automatische Metrik erfasst Qualität:

- **BLEU / ROUGE / METEOR:** Referenzbasierte Metriken für Übersetzung und Zusammenfassung. Korrelieren schwach mit menschlichen Qualitätsurteilen für Langformgenerierung.
- **Perplexität:** Misst, wie gut das Modell gehaltenen Text vorhersagt. Eine notwendige, aber nicht ausreichende Bedingung für Qualität.
- **BERTScore:** Einbettungsbasierte Ähnlichkeit zu Referenzen. Besser mit menschlichen Urteilen korreliert als N-Gramm-Metriken.
- **Menschliche Evaluierung:** Der Goldstandard. Siehe Abschnitt 14.3.

---

## Annotationseffizienz-Metriken

HITL-Evaluierung sollte auch messen, ob menschliches Feedback effizient genutzt wird.

### Lernkurven

Eine **Lernkurve** zeigt die Modellleistung als Funktion der Anzahl annotierter Beispiele. Eine steile Lernkurve (schnelle Verbesserung mit wenigen Labels) zeigt an, dass die Annotationsstrategie informative Beispiele auswählt. Eine flache Lernkurve zeigt an, dass zusätzliche Beschriftung abnehmende Erträge liefert.

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, roc_auc_score
from sklearn.model_selection import StratifiedShuffleSplit

rng = np.random.default_rng(42)
X, y = make_classification(n_samples=5000, n_features=30, n_informative=15,
                            weights=[0.8, 0.2], random_state=42)
X_test, y_test = X[4000:], y[4000:]
X_pool, y_pool = X[:4000], y[:4000]

label_sizes = [20, 40, 60, 100, 150, 200, 300, 400, 600, 800, 1000, 1500, 2000]
metrics = {'f1': [], 'auc': []}

for n in label_sizes:
    idx = rng.choice(len(X_pool), n, replace=False)
    clf = LogisticRegression(max_iter=500, class_weight='balanced')
    clf.fit(X_pool[idx], y_pool[idx])
    preds = clf.predict(X_test)
    probs = clf.predict_proba(X_test)[:, 1]
    metrics['f1'].append(f1_score(y_test, preds))
    metrics['auc'].append(roc_auc_score(y_test, probs))

# Fit learning curve: performance ≈ a - b/sqrt(n)
from scipy.optimize import curve_fit

def learning_curve_fn(n, a, b):
    return a - b / np.sqrt(n)

popt_f1, _ = curve_fit(learning_curve_fn, label_sizes, metrics['f1'], p0=[0.9, 2])
popt_auc, _ = curve_fit(learning_curve_fn, label_sizes, metrics['auc'], p0=[0.95, 1])

n_smooth = np.linspace(20, 3000, 200)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))

ax1.scatter(label_sizes, metrics['f1'], color='#2b3a8f', zorder=5, s=40)
ax1.plot(n_smooth, learning_curve_fn(n_smooth, *popt_f1), '--', color='#e05c5c',
         label=f'Fit: {popt_f1[0]:.3f} - {popt_f1[1]:.1f}/√n')
ax1.set_xlabel("Labeled examples"); ax1.set_ylabel("F1 score")
ax1.set_title("Learning Curve: F1"); ax1.legend(); ax1.grid(alpha=0.3)

ax2.scatter(label_sizes, metrics['auc'], color='#0d9e8e', zorder=5, s=40)
ax2.plot(n_smooth, learning_curve_fn(n_smooth, *popt_auc), '--', color='#e05c5c',
         label=f'Fit: {popt_auc[0]:.3f} - {popt_auc[1]:.2f}/√n')
ax2.set_xlabel("Labeled examples"); ax2.set_ylabel("AUROC")
ax2.set_title("Learning Curve: AUROC"); ax2.legend(); ax2.grid(alpha=0.3)

plt.tight_layout()
plt.savefig('learning_curves.png', dpi=150)
plt.show()

# Estimate the annotation budget needed to reach a target performance
target_f1 = 0.80
n_needed = (popt_f1[1] / (popt_f1[0] - target_f1)) ** 2
print(f"Estimated labels needed to reach F1={target_f1}: {n_needed:.0f}")
```

### Return-on-Investment-Analyse (ROI)

Der ROI menschlichen Feedbacks beantwortet: Für jedes zusätzliche Label, wie sehr verbessert sich die Modellleistung?

$$
\text{ROI}(n) = \frac{\Delta \text{Leistung}(n)}{\text{Kosten pro Label}}
$$

Mit zunehmender Reife eines Modells (und wenn die leicht zu lernenden Beispiele erschöpft sind) sinkt der ROI typischerweise. Die praktische Implikation: Annotationsbudgets sollten front-loaded sein, mit mehr Labels in frühen Phasen, wenn der ROI am höchsten ist.

---

## Menschliche Evaluierung

Für generative Systeme und subjektive Aufgaben bleibt menschliche Evaluierung der Goldstandard.

### Direkte Bewertung (DA)

Annotatoren bewerten Ausgaben auf einer absoluten Skala (z. B. 1–100 für Übersetzungsqualität oder 1–5 für die Nützlichkeit von Antworten). DA wurde bei der Maschinellen-Übersetzungs-Evaluierung (WMT-Benchmarks) standardisiert.

**Best Practices für DA:**
- Randomisieren Sie die Reihenfolge der Ausgaben, um Ankerung zu verhindern
- Verwenden Sie eine ausreichende Anzahl von Annotatoren pro Element (mindestens 3–5)
- Schließen Sie Qualitätskontrollen ein (offensichtlich gute und schlechte Beispiele, um unaufmerksame Bewerter zu erkennen)
- Berichten Sie Annotatorenübereinstimmung neben aggregierten Scores

### Vergleichende Evaluierung

Annotatoren wählen zwischen zwei Ausgaben: „Welche ist besser?" Vergleichende Urteile sind schneller und konsistenter als absolute Bewertungen (siehe Kapitel 8). **ELO-Bewertungssysteme** (aus dem Schach entlehnt) wandeln paarweise Vergleichsergebnisse in ein kontinuierliches Qualitätsranking um.

```{code-cell} python
import numpy as np

def update_elo(rating_a, rating_b, outcome_a, k=32):
    """Update ELO ratings. outcome_a: 1=A wins, 0=B wins, 0.5=tie."""
    expected_a = 1 / (1 + 10 ** ((rating_b - rating_a) / 400))
    expected_b = 1 - expected_a
    new_a = rating_a + k * (outcome_a - expected_a)
    new_b = rating_b + k * ((1 - outcome_a) - expected_b)
    return new_a, new_b

# Simulate 5 model versions being compared pairwise
rng = np.random.default_rng(42)
true_quality = [0.60, 0.70, 0.75, 0.80, 0.85]  # underlying model quality
n_models = len(true_quality)
elo_ratings = {i: 1000.0 for i in range(n_models)}

for _ in range(500):  # 500 pairwise comparisons
    i, j = rng.choice(n_models, 2, replace=False)
    p_i_wins = true_quality[i] / (true_quality[i] + true_quality[j])
    outcome = 1.0 if rng.random() < p_i_wins else 0.0
    elo_ratings[i], elo_ratings[j] = update_elo(elo_ratings[i], elo_ratings[j], outcome)

print("ELO Rankings after 500 comparisons:")
sorted_models = sorted(elo_ratings.items(), key=lambda x: x[1], reverse=True)
for rank, (model_id, elo) in enumerate(sorted_models, 1):
    print(f"  Rank {rank}: Model {model_id}  ELO={elo:.1f}  True quality={true_quality[model_id]:.2f}")
```

### Verhaltenstests (CheckList)

**CheckList** {cite}`ribeiro2020beyond` ist eine Methodik zur systematischen Verhaltensevaluierung von NLP-Modellen. Anstatt zufälliger Testmengen entwirft es Testfälle, die spezifische Fähigkeiten prüfen:

- **Mindestfunktionalitätstests (MFT):** Behandelt das Modell einfache, offensichtliche Fälle?
- **Invarianztests (INV):** Ändert sich die Ausgabe des Modells, wenn sie sich nicht ändern sollte (z. B. beim Umformulieren)?
- **Direktionale Erwartungstests (DIR):** Ändert sich die Ausgabe des Modells in der erwarteten Richtung, wenn sich die Eingabe ändert?

CheckList macht menschliche Evaluierung gezielt und handlungsorientiert: Anstatt einer einzigen Genauigkeitszahl liefert es ein Fähigkeitsprofil.

---

## Messung der Ausrichtung auf menschliche Absicht

Für RLHF-Systeme ist die Messung der Ausrichtung eine zentrale Evaluierungsherausforderung.

**Belohnungsmodell-Evaluierung:** Die Genauigkeit des Belohnungsmodells auf einem gehaltenen Präferenz-Testset. Ouyang et al. {cite}`ouyang2022training` berichten ca. 72 % paarweise Genauigkeit für das Belohnungsmodell von InstructGPT; als grober Referenzpunkt werden Werte in dieser Größenordnung häufig für ähnliche RLHF-Pipelines zitiert, obwohl die Ergebnisse je nach Aufgabe und Datenqualität stark variieren.

**Gewinnrate:** Gegeben zwei Modellversionen (z. B. SFT-Baseline vs. RLHF-feinabgestimmt), welcher Anteil der Antworten gewinnt das RLHF-Modell in menschlichen paarweisen Vergleichen?

**GPT-4 als Evaluator:** Die Verwendung eines fähigen LLM zur Bewertung von Antworten ist für schnelle Iteration üblich geworden. Gilardi et al. {cite}`gilardi2023chatgpt` und Zheng et al. {cite}`zheng2023judging` finden LLM-Evaluator-Übereinstimmung mit menschlichem Urteil, die je nach Aufgabe grob zwischen 0,7 und 0,9 liegt — nützlich für schnelle A/B-Vergleiche, aber weniger zuverlässig für die Erkennung von Kriechertum, kulturellen Nuancen oder Sicherheitsproblemen.

**Kriechertum-Erkennung:** Messen, ob das Modell seine Antworten basierend auf implizierten Nutzerpräferenzen ändert (z. B. „Ich denke, X ist korrekt; was denken Sie?"). Ein gut ausgerichtetes Modell sollte nicht kriechend sein.

---

## A/B-Tests in produktiven Systemen

Für im Betrieb befindliche Systeme ist die ultimative Evaluierung **A/B-Tests**: Einen Bruchteil der Nutzer zur neuen Modellversion routen und nachgelagerte Ergebnisse messen.

A/B-Tests geben eine unvoreingenommene Schätzung der Modellqualität im tatsächlichen Einsatzkontext und erfassen Effekte, die Laboreval­uierung übersieht (Nutzerverhalten, Populationsverteilung, Randfälle).

Die Herausforderung: geeignete nachgelagerte Metriken. Engagement-Metriken (Klicks, Sitzungsdauer) können manipulatives Verhalten belohnen. Aufgaben-Abschlussraten oder Nutzerzufriedenheitsumfragen sind besser ausgerichtet, aber verrauschter.

```{seealso}
CheckList Verhaltenstests: {cite}`ribeiro2020beyond`. Zur RLHF-Evaluierungsmethodik, siehe {cite}`ouyang2022training`. Zur Best-Practice menschlicher Evaluierung in MT: {cite}`graham2015accurate`. Zur Lernkurventheorie: {cite}`mukherjee2003estimating`.
```
