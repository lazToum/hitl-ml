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

# Datenannotation und -kennzeichnung

Datenannotation ist die allgegenwärtigste Form menschlicher Beteiligung im maschinellen Lernen. Bevor ein Modell lernen kann, muss jemand ihm sagen, was die richtigen Antworten sind — und diese Person ist in der Regel ein Mensch. Dieses Kapitel behandelt die Theorie und Praxis der Annotation: was Annotation schwierig macht, wie man Annotationsaufgaben gestaltet, wie man die Qualität misst und wie man mit Uneinigkeit umgeht.

---

## Arten der Annotation

Annotationsaufgaben variieren enorm in ihrer Struktur, Schwierigkeit und Kosten. Die wichtigsten Typen umfassen:

### Klassifikation

Der Annotator weist jeder Instanz eine von $K$ vordefinierten Kategorien zu. Dies ist kognitiv die einfachste Annotationsaufgabe, aber das Entwerfen eines guten Kategorienschemas (einer *Taxonomie*) kann überraschend schwierig sein.

**Binäre Klassifikation** (Ist dieses Bild eine Katze?) ist der einfachste Fall. **Mehrklassen-Klassifikation** (Welche Tierart ist das?) verlangt von Annotatoren, eine Option aus einer Liste auszuwählen. **Mehrlabel-Annotation** (Welche Themen behandelt dieser Artikel?) erlaubt mehrere gleichzeitige Labels.

### Sequenzkennzeichnung

Jedes Token in einer Sequenz erhält ein Label. Named Entity Recognition (NER) ist das kanonische Beispiel — Annotatoren markieren Textspannen als PERSON, ORGANISATION, ORT usw. Die Annotation wird typischerweise mit dem BIO- (Beginning-Inside-Outside) oder BIOES-Tagging-Schema durchgeführt:

```text
  B-ORG    O           B-ORG    O     O      O
```

### Spannen- und Relationsannotation

Über die Kennzeichnung einzelner Token hinaus müssen Annotatoren möglicherweise:
- Spannen (Mehrtoken-Ausdrücke) identifizieren und Typen zuweisen
- *Relationen* zwischen Spannen markieren („Apple" ERWARB „Shazam")
- Koreferenzketten annotieren (alle Erwähnungen derselben Entität)

Diese Aufgaben sind kognitiv anspruchsvoll und haben eine niedrigere Annotatorenübereinstimmung.

### Begrenzungsrahmen und Objekterkennung

Annotatoren zeichnen Rechtecke um Objekte in Bildern und weisen jedem Rahmen ein Kategorie-Label zu. Die Lokalisierungspräzision ist wichtig: Ein zu kleiner Rahmen lässt Kontext aus; ein zu großer Rahmen enthält Hintergrund. Moderne Annotationswerkzeuge berechnen den Intersection-over-Union (IoU) mit Referenzannotationen, um Qualitätsprobleme zu kennzeichnen.

### Segmentierung

Annotation auf Pixelebene: Jedes Pixel wird einer Klasse (semantische Segmentierung) oder einer bestimmten Objektinstanz (Instanzsegmentierung) zugewiesen. Hochwertige Segmentierung gehört zu den teuersten Annotationstypen, mit Kosten von Dutzenden bis über hundert Dollar pro Bild für komplexe Szenen, abhängig von Domäne und Werkzeugunterstützung.

### Transkription und Übersetzung

Audio → Text (ASR-Trainingsdaten), Handschrift → Text (OCR-Daten) oder Quellsprache → Zielsprache (MT-Daten). Diese Aufgaben erfordern linguistische Expertise und können von untrainierten Annotatoren nicht zuverlässig durchgeführt werden.

---

## Annotationsrichtlinien

Der einzige wichtigste Bestimmungsfaktor für die Annotationsqualität ist die Qualität der **Annotationsrichtlinien**: die schriftlichen Anweisungen, denen Annotatoren folgen.

Gute Richtlinien:
- Legen das Aufgabenziel fest und erläutern, *warum* das Label wichtig ist
- Bieten eine klare Definition für jede Kategorie mit positiven und negativen Beispielen
- Behandeln häufige Grenz- und Sonderfälle explizit
- Geben an, was bei Unsicherheit zu tun ist (z. B. „überspringen" vs. erzwungene Wahl)
- Enthalten ausgearbeitete Beispiele vollständiger Annotation

Schlechte Richtlinien verlassen sich darauf, dass Annotatoren bei Grenzfällen „gesunden Menschenverstand anwenden" — was zu inkonsistenten Entscheidungen führt, die die Modellqualität beeinträchtigen und die Annotatorenuneinigkeit erhöhen.

```{admonition} Die Entwicklung von Richtlinien ist iterativ
:class: note

Erwarten Sie nicht, von Anfang an perfekte Richtlinien zu schreiben. Führen Sie eine kleine Pilot-Annotationsrunde durch, analysieren Sie die Uneinigkeiten und aktualisieren Sie die Richtlinien. Wiederholen. Gut entwickelte Richtlinien durchlaufen typischerweise 3–5 Überarbeitungszyklen, bevor sie sich stabilisieren.
```

---

## Messung der Annotationsqualität: Annotatorenübereinstimmung

Wenn mehrere Annotatoren dieselben Daten kennzeichnen, kann ihre Übereinstimmung gemessen werden. Hohe Übereinstimmung deutet darauf hin, dass die Aufgabe gut definiert ist und die Annotatoren sie verstanden haben. Niedrige Übereinstimmung deutet auf Ambiguität in der Aufgabe, den Richtlinien oder den Daten selbst hin.

### Cohens Kappa

Für zwei Annotatoren, die Daten in $K$ Kategorien kennzeichnen, korrigiert **Cohens Kappa** {cite}`cohen1960coefficient` die beobachtete Übereinstimmung um den Zufall:

$$
\kappa = \frac{P_o - P_e}{1 - P_e}
$$

wobei $P_o$ die beobachtete proportionale Übereinstimmung und $P_e$ die Wahrscheinlichkeit zufälliger Übereinstimmung ist (berechnet aus den marginalen Label-Verteilungen).

$\kappa = 1$ bedeutet vollständige Übereinstimmung; $\kappa = 0$ bedeutet Übereinstimmung nicht besser als der Zufall; $\kappa < 0$ bedeutet systematische Uneinigkeit.

| $\kappa$-Bereich | Interpretation       |
|------------------|----------------------|
| $< 0$            | Schlechter als Zufall|
| $0,0 - 0,20$     | Gering               |
| $0,21 - 0,40$    | Mäßig                |
| $0,41 - 0,60$    | Mittel               |
| $0,61 - 0,80$    | Substanziell         |
| $0,81 - 1,00$    | Fast perfekt         |

### Fleiss' Kappa

Erweitert Cohens Kappa auf $M > 2$ Annotatoren. Jeder Annotator kennzeichnet jeden Eintrag unabhängig; die Formel aggregiert über Annotatoren hinweg:

$$
\kappa_F = \frac{\bar{P} - \bar{P}_e}{1 - \bar{P}_e}
$$

wobei $\bar{P}$ die mittlere paarweise Übereinstimmung über alle Annotatorenpaare ist und $\bar{P}_e$ die erwartete Übereinstimmung bei zufälliger Zuweisung.

### Krippendorffs Alpha

Die allgemeinste Metrik, die eine beliebige Anzahl von Annotatoren, jeden Skalentyp (nominal, ordinal, intervall, rational) und fehlende Daten unterstützt {cite}`krippendorff2011computing`:

$$
\alpha = 1 - \frac{D_o}{D_e}
$$

wobei $D_o$ die beobachtete Uneinigkeit und $D_e$ die erwartete Uneinigkeit ist. Krippendorffs Alpha wird in der akademischen Arbeit im Allgemeinen bevorzugt, wegen seiner Flexibilität.

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

## Umgang mit Uneinigkeiten

Wenn sich Annotatoren nicht einig sind, gibt es mehrere Strategien:

### Mehrheitsvoting

Das häufigste Label wird als Goldstandard genommen. Einfach und robust, wenn die Anzahl der Annotatoren pro Element ungerade ist. Scheitert, wenn eine Minderheitsgruppe von Annotatoren systematisch genauer ist.

### Gewichtetes Voting

Annotatoren werden nach ihrer geschätzten Genauigkeit gewichtet (abgeleitet aus der Übereinstimmung mit einem Goldstandard oder anderen Annotatoren). Genauere Annotatoren haben mehr Einfluss.

### Soft-Labels

Anstatt Annotationen auf ein einziges Label zu reduzieren, wird die Verteilung beibehalten. Wenn 3 von 5 Annotatoren „positiv" und 2 „neutral" sagten, wird dies als $(p_\text{pos}, p_\text{neutral}, p_\text{neg}) = (0,6; 0,4; 0,0)$ dargestellt. Das Training auf Soft-Labels verbessert die Kalibrierung.

### Schiedsverfahren

Ein leitender Annotator oder Fachexperte entscheidet über Uneinigkeiten. Goldstandard, aber teuer; typischerweise für hochriskante Domänen reserviert.

### Statistische Modelle

Anspruchsvollere Ansätze modellieren probabilistisch die Kompetenz der Annotatoren. Das **Dawid-Skene-Modell** {cite}`dawid1979maximum` schätzt gleichzeitig die Konfusionsmatrizen der Annotatoren und die wahren Item-Labels über EM. Einzelheiten in Kapitel 13.

---

## Label-Rauschen und seine Auswirkungen

Echte Annotation ist verrauscht. Die Auswirkungen von Label-Rauschen auf das Modelltraining hängen vom Rauschtyp ab:

- **Zufälliges Rauschen** (Labels zufällig vertauscht) verschlechtert die Leistung, aber Modelle sind überraschend robust gegenüber moderaten Niveaus (bis zu ~20 % bei vielen Aufgaben).
- **Systematisches/adversariales Rauschen** (Labels konsistent in bestimmten Mustern falsch) ist weit schädlicher und schwerer zu erkennen.
- **Klassenabhängiges Rauschen** (Fehler wahrscheinlicher für bestimmte Klassen) verzerrt die Entscheidungsgrenze des Modells.

Eine praktische Faustregel: Bei $n$ Trainingsbeispielen und einem Bruchteil $\epsilon$ korrupter Labels verschlechtert sich die Modellleistung ungefähr so, als ob man $(1 - 2\epsilon)^2 n$ saubere Beispiele hätte {cite}`natarajan2013learning`. Für $\epsilon = 0,2$ entspricht dies dem Verlust von 36 % der Daten.

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

## Annotationskosten und Durchsatz

Das Verständnis der Annotationsökonomie ist für die Projektplanung unerlässlich.

| Aufgabentyp                      | Typischer Durchsatz  | Kosten pro Element (Spezialist) |
|----------------------------------|----------------------|----------------------------------|
| Binäre Bildklassifikation        | 200–500/Std.         | $0,02–0,10                      |
| NER (Kurztext)                   | 50–150 Elemente/Std. | $0,10–0,50                      |
| Relationsextraktion              | 20–60 Elemente/Std.  | $0,30–1,50                      |
| Medizinische Bildsegmentierung   | 5–30 Elemente/Std.   | $10–100                         |
| Videoannotation                  | 5–20 Min. Video/Std. | $20–200                         |

Diese Zahlen sind ungefähre Größenordnungsschätzungen und variieren je nach erforderlicher Domänenexpertise, Qualität der Annotationswerkzeuge, Klarheit der Richtlinien und Erfahrung der Annotatoren erheblich. Sie sollten als illustrativ, nicht als verbindlich betrachtet werden.

```{seealso}
Annotationswerkzeuge werden in Kapitel 12 behandelt. Statistische Modelle für Crowdsourcing-Annotation (Dawid-Skene, MACE) werden in Kapitel 13 behandelt.
```
