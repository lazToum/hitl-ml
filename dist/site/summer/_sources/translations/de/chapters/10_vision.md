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

# HITL in der Computer-Vision

Computer-Vision bietet einige der visuell intuitivsten Beispiele für HITL ML. Die ImageNet-Challenge, aufgebaut auf 14 Millionen von Menschen annotierten Bildern, leitete die Deep-Learning-Ära ein. Medizinische Bildannotation durch Radiologen treibt diagnostische KI an. Autonome Fahrzeuge sind auf Millionen von Menschen annotierten Frames angewiesen, um die Welt wahrzunehmen.

Was leicht zu übersehen ist: Dies sind nicht einfach Fälle, in denen Menschen Grundwahrheit liefern. Es sind Fälle, in denen Menschen Datensätze konstruieren, die spezifische wahrnehmungsbezogene, kulturelle und operative Entscheidungen einbetten — Entscheidungen, die erst später sichtbar werden, wenn Modelle auf vorhersehbare Weise versagen.

---

## Wie Annotationsentscheidungen zu Modellverzerrungen werden

Das Standardrahmen behandelt Annotation als Datensammlung: Menschen beobachten die Welt und zeichnen auf, was sie sehen. Das genauere Rahmen ist, dass Annotation *Datensatz-Design* ist: Menschen entscheiden, welche Kategorien zu verwenden sind, wo Grenzen zu ziehen sind, welche Randfälle einzuschließen sind und wie Ambiguität aufzulösen ist — und all diese Entscheidungen formen, was das trainierte Modell wahrnehmen wird.

### Der ImageNet-Fall

ImageNet {cite}`russakovsky2015imagenet` ist der folgenreichste Datensatz in der Geschichte der Computer-Vision. Sein Label-Set leitet sich von WordNet-Synsets ab, primär ausgewählt weil sie zahlreich und semantisch distinct sind. Mehrere Konsequenzen dieser Designentscheidung traten Jahre später zutage:

- **Personenkategorien kodierten demografische Assoziationen.** Frühe Versionen der Synset-Labels von ImageNet für Menschen enthielten viele, die heute als abwertend oder voreingenommen angesehen würden, und spiegelten sowohl die historische WordNet-Quelle als auch die impliziten Entscheidungen der Annotationsbelegschaft wider, welche Labels auf welche Bilder anzuwenden sind {cite}`yang2020towards`. Auf Personenbilder angewendete Labels kodierten Rassen-, Geschlechts- und Klassenassoziationen, die sich direkt in Modell-Einbettungen fortpflanzten.

- **Feinkörnige Artenklassifikation, grobe von fast allem anderen.** ImageNet kann 120 Hunderassen unterscheiden, fasst aber enorme Variation bei Werkzeugen, Fahrzeugen, Lebensmitteln und Möbeln zu einzelnen Kategorien zusammen. Dies war eine Konsequenz des Folgens der WordNet-Struktur, keine bewusste Entscheidung darüber, was zählt. Auf ImageNet trainierte Modelle zeigen dieselbe asymmetrische Präzision.

- **Westliche, englischsprachige visuelle Standards.** Die Bilder wurden hauptsächlich von Flickr und Internet-Suchen mit englischsprachigen Abfragen gesammelt. Die resultierende Verteilung ist stark auf die visuelle Umgebung und kulturellen Objekte wohlhabender, englischsprachiger Länder ausgerichtet.

Nichts davon waren Fehler. Es waren Annotationsdesign-Entscheidungen, die schnell im großen Maßstab getroffen wurden, oft von Personen, die nicht antizipierten, wie der Datensatz verwendet werden würde. Die Lektion ist nicht, dass ImageNet anders hätte aufgebaut werden sollen (obwohl dies der Fall hätte sein sollen), sondern dass **Annotationsdesign Modelldesign ist**, und es sollte mit derselben Sorgfalt behandelt werden.

:::{admonition} Annotationsschema ist eine Theorie der Welt
:class: note

Jede Label-Taxonomie macht Behauptungen darüber, welche Unterscheidungen wichtig sind. „Auto" von „LKW" zu trennen, während alle Limousinen in eine Klasse zusammengefasst werden, ist eine theoretische Behauptung darüber, welche Unterscheidungen semantisch relevant sind. „Person" als eine einzelne Klasse unabhängig von Körperhaltung, Kleidung oder Aktivität zu annotieren ist eine andere theoretische Behauptung. Auf diesen Schemata trainierte Modelle werden dieselben Unterscheidungen machen und nicht mehr — sie werden nicht über die Kategorien verallgemeinern, die sie zu unterscheiden trainiert wurden.
:::

---

## Bildklassifikations-Annotation

Die einfachste CV-Annotationsaufgabe ist die Zuweisung eines oder mehrerer Labels an ein ganzes Bild.

**Label-Hierarchie.** Das Label „Hund" ist in einer semantischen Hierarchie ein Kind von „Tier". Auf flachen Taxonomien trainierte Modelle verallgemeinern möglicherweise nicht gut über Abstraktionsebenen hinweg. ImageNet verwendet eine Synset-basierte Hierarchie, die Evaluierung auf mehreren Spezifizitätsstufen ermöglicht.

**Mehrlabel-Ambiguität.** Eine Straßenszene kann gleichzeitig ein Auto, eine Person, ein Fahrrad und eine Ampel enthalten. Zu entscheiden, welche Labels einzuschließen sind, erfordert klare Richtlinien zu Relevanzsschwellen.

**Long-Tail-Verteilungen.** Natürliche Bilddatensätze folgen einem Potenzgesetz: Wenige Kategorien sind extrem häufig; die meisten sind selten. Aktives Lernen ist besonders wertvoll für Long-Tail-Kategorien, bei denen zufälliges Sampling nur eine Handvoll Beispiele liefert.

---

## Objekterkennung: Begrenzungsrahmen-Annotation

Die Objekterkennung erfordert, dass Annotatoren achsenausgerichtete Begrenzungsrahmen um Instanzen jeder Objektklasse zeichnen. Dies führt geometrische Präzisionsanforderungen und erhebliche Randfälle ein.

**Annotationsqualitätsmetriken:**

*IoU (Intersection over Union)* misst die Überlappung zwischen einem annotierten Rahmen und einem Referenzrahmen:

$$
\text{IoU}(A, B) = \frac{|A \cap B|}{|A \cup B|}
$$

$\text{IoU} \geq 0,5$ ist der Standardschwellenwert für eine „korrekte" Erkennung in PASCAL VOC; COCO {cite}`lin2014microsoft` verwendet einen Bereich von Schwellenwerten von 0,5 bis 0,95, was erheblich anspruchsvoller und informativer ist.

**Annotationsrandfälle, die in Richtlinien gelöst werden müssen:**
- Verdeckte Objekte: sichtbaren Anteil annotieren oder vollständigen Umfang extrapolieren?
- Abgeschnittene Objekte (teilweise außerhalb des Rahmens): einschließen oder ausschließen?
- Menschenmassen-Regionen: eine spezielle „Menge"-Annotation verwenden oder individuelle Instanzen annotieren?

Jede dieser Entscheidungen ändert, was „korrekte Erkennung" bedeutet — und ändert daher, was das Modell trainiert wird zu tun.

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def compute_iou(boxA, boxB):
    """Compute IoU between two boxes [x1, y1, x2, y2]."""
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    inter_area = max(0, xB - xA) * max(0, yB - yA)
    boxA_area = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxB_area = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
    union_area = boxA_area + boxB_area - inter_area
    return inter_area / (union_area + 1e-6)

ref_box  = [1.0, 1.0, 4.0, 4.0]
ann1_box = [1.1, 0.9, 4.1, 4.2]   # close
ann2_box = [0.5, 0.5, 3.5, 3.8]   # less precise

print(f"IoU (ann1 vs ref):  {compute_iou(ann1_box, ref_box):.3f}")
print(f"IoU (ann2 vs ref):  {compute_iou(ann2_box, ref_box):.3f}")
print(f"IoU (ann1 vs ann2): {compute_iou(ann1_box, ann2_box):.3f}")

fig, ax = plt.subplots(figsize=(5, 5))
ax.set_xlim(0, 5); ax.set_ylim(0, 5); ax.set_aspect('equal')
ax.add_patch(patches.Rectangle(
    (ref_box[0], ref_box[1]), ref_box[2]-ref_box[0], ref_box[3]-ref_box[1],
    linewidth=2.5, edgecolor='#2b3a8f', facecolor='none', label='Reference'))
ax.add_patch(patches.Rectangle(
    (ann1_box[0], ann1_box[1]), ann1_box[2]-ann1_box[0], ann1_box[3]-ann1_box[1],
    linewidth=2, edgecolor='#0d9e8e', facecolor='none', linestyle='--',
    label=f'Ann1 (IoU={compute_iou(ann1_box, ref_box):.2f})'))
ax.add_patch(patches.Rectangle(
    (ann2_box[0], ann2_box[1]), ann2_box[2]-ann2_box[0], ann2_box[3]-ann2_box[1],
    linewidth=2, edgecolor='#e05c5c', facecolor='none', linestyle=':',
    label=f'Ann2 (IoU={compute_iou(ann2_box, ref_box):.2f})'))
ax.legend(fontsize=10)
ax.set_title("Bounding Box Agreement (IoU)", fontsize=12)
plt.tight_layout()
plt.savefig('bbox_iou.png', dpi=150)
plt.show()
```

---

## Semantische und Instanzsegmentierung

Segmentierungsannotation erfordert die Zuweisung eines Klassen-Labels zu jedem Pixel in einem Bild — unter den teuersten Annotationstypen.

**Semantische Segmentierung:** Jedes Pixel gehört zu einer semantischen Klasse (Straße, Himmel, Person, Auto). Alle Pixel derselben Klasse teilen dasselbe Label, unabhängig davon, zu welchem individuellen Objekt sie gehören.

**Instanzsegmentierung:** Jede einzelne Objektinstanz erhält ein eindeutiges Label. Eine Menschenmenge von 20 Personen wird zu 20 unterschiedlichen Masken.

**Panoptische Segmentierung:** Kombiniert beides: „Ding"-Klassen (zählbare Objekte) haben Instanzmasken; „Stoff"-Klassen (Straße, Himmel) haben semantische Masken.

**SAM-unterstützte Annotation:** Metas Segment Anything Model {cite}`kirillov2023segment` generiert aus einem einzelnen Punkt-Klick hochwertige Segmentierungsmasken. Annotatoren klicken auf die Mitte eines Objekts; SAM schlägt eine Maske vor; der Annotator akzeptiert oder korrigiert. Die SAM-Autoren berichten Beschleunigungen der Annotationseffizienz von etwa dem 6,5-fachen gegenüber polygonbasierter Kennzeichnung; die Gewinne variieren je nach Szenentyp und Annotationswerkzeugen.

SAM repräsentiert einen umfassenderen Wandel: **Die Rolle des Annotators ändert sich vom Zeichnen zum Überprüfen**. Dies hat über die Geschwindigkeit hinaus Implikationen für die Annotationsqualität. Wenn Annotatoren zeichnen, ist ihre Aufmerksamkeit während des gesamten Prozesses engagiert. Wenn Annotatoren überprüfen und „Akzeptieren" klicken, gibt es Belege dafür, dass sie Fehler leichter übersehen — eine Version des Automatisierungsbiases spezifisch für den Annotationskontext.

---

## Aktives Lernen für Computer-Vision

Aktives Lernen ist besonders wertvoll in CV, weil:
1. Bilder hochdimensional und merkmalreich sind — Einbettungen von vortrainierten Modellen tragen starke Signale für die Unsicherheitsschätzung
2. Große unannotierte Pools billig sind (Fotos, Video-Frames)
3. Annotation (insbesondere Segmentierung) teuer ist und für spezialisierte Domänen nicht einfach per Crowdsourcing durchgeführt werden kann

```{code-cell} python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

X, y = make_classification(n_samples=3000, n_features=50, n_informative=25,
                            n_classes=5, n_clusters_per_class=2, random_state=42)
X_train, y_train = X[:2500], y[:2500]
X_test,  y_test  = X[2500:], y[2500:]

def margin_uncertainty(model, X_pool):
    probs = model.predict_proba(X_pool)
    sorted_p = np.sort(probs, axis=1)
    return sorted_p[:, -2] - sorted_p[:, -1]  # most negative = most uncertain

n_init = 50
results = {'active': [], 'random': []}
label_counts = list(range(50, 401, 30))

for strategy in ['active', 'random']:
    labeled = list(rng.choice(len(X_train), n_init, replace=False))
    unlabeled = [i for i in range(len(X_train)) if i not in labeled]

    for target in label_counts:
        while len(labeled) < target and unlabeled:
            if strategy == 'active' and len(labeled) >= 10:
                model_temp = LogisticRegression(max_iter=300).fit(
                    X_train[labeled], y_train[labeled])
                margins = margin_uncertainty(model_temp, X_train[unlabeled])
                idx = int(np.argmin(margins))
            else:
                idx = rng.integers(0, len(unlabeled))
            labeled.append(unlabeled.pop(idx))

        clf = LogisticRegression(max_iter=300).fit(X_train[labeled], y_train[labeled])
        results[strategy].append(accuracy_score(y_test, clf.predict(X_test)))

plt.figure(figsize=(7, 4))
plt.plot(label_counts, results['active'], 'o-', color='#2b3a8f',
         linewidth=2, label='Active (margin sampling)')
plt.plot(label_counts, results['random'], 's--', color='#e05c5c',
         linewidth=2, label='Random baseline')
plt.xlabel("Labeled training images", fontsize=12)
plt.ylabel("Test accuracy", fontsize=12)
plt.title("Active Learning for 5-Class Image Classification", fontsize=13)
plt.legend(fontsize=11); plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('cv_active_learning.png', dpi=150)
plt.show()
```

---

## Semi-Supervised Learning mit menschlicher Lenkung

Die große Menge verfügbarer unannotierter visueller Daten macht semi-supervised learning besonders attraktiv für CV.

**Self-Training / Pseudo-Kennzeichnung:** Ein Modell auf annotierten Daten trainieren; hochkonfidente Vorhersagen auf unannotierten Daten als Pseudo-Labels verwenden; neu trainieren. Die kritische Designfrage ist der Konfidenz-Schwellenwert. Ein niedrigerer Schwellenwert bringt mehr Beispiele ein, aber führt Rauschen ein; ein hoher Schwellenwert lässt den Großteil des unannotierten Pools ungenutzt. Menschliche Beteiligung kann diesen Schwellenwert leiten — Annotatoren überprüfen stichprobenartig pseudo-annotierte Beispiele, um ihn zu kalibrieren.

**FixMatch und Konsistenz-Regularisierung:** Diese Methoden trainieren Modelle, um konsistente Vorhersagen unter Augmentierung zu produzieren. Die wichtigste HITL-Erkenntnis: Menschen werden nicht nur für Labels konsultiert, sondern für **Augmentierungsdesign** — welche Invarianzen soll das Modell lernen? Ein Modell für medizinische Bildgebung sollte gegenüber Rotation und Helligkeit invariant sein, nicht aber gegenüber Skalierung; ein Modell für Texterkennung sollte nicht gegenüber perspektivischer Verzerrung invariant gemacht werden. Diese domänenspezifischen Entscheidungen erfordern menschliche Expertise, und ihr Fehler beeinträchtigt das semi-supervised learning erheblich.

**Aktives semi-supervised learning:** Die effizienteste Kombination: Aktives Lernen konzentriert menschliche Labels dort, wo die Modellunsicherheit am höchsten ist; Self-Training annotiert automatisch den Hochkonfidenz-Schwanz. Der menschliche Aufwand konzentriert sich dort, wo er am wertvollsten ist, und das Modell bootstrapt sich auf den Rest. In jedem Zyklus liefert ein menschliches Audit einer Zufallsstichprobe von Pseudo-Labels eine Qualitätsprüfung, ohne vollständige Überprüfung zu erfordern.

---

## Videoannotation

Videoannotation multipliziert die Herausforderungen der Bildannotation um die Zeit:

- **Tracking:** Objekte müssen über Frames hinweg identifiziert werden. Annotatoren beschriften Schlüsselframes; Tracking-Algorithmen interpolieren dazwischen. Tracking-Versagen — Verdeckung, Wiedereintritt, schnelle Bewegung — erfordern höhere Raten menschlicher Neubeschriftung als stabiles Tracking.
- **Zeitliche Konsistenz:** Im Frame $t$ gezeichnete Grenzen sollten räumlich konsistent mit Frame $t+1$ sein. Inkonsistente Annotationen sind ein Trainingssignal, das dem Modell sagt, dass Objekte diskontinuierlich springen — eine Form von Annotationsrauschen, die besonders schädlich für Erkennungsmodelle ist.
- **Skalierbarkeit:** Ein 1-stündiges Video bei 30fps umfasst 108.000 Frames. Vollständige Annotation ist nicht praktikabel; Stichprobenstrategien müssen sorgfältig entworfen werden, um sicherzustellen, dass seltene Ereignisse (Randfälle, Beinahe-Fehler, Fehlerszenarien) nicht systematisch ausgeschlossen werden.

Moderne Videoannotationswerkzeuge unterstützen **intelligentes Tracking**, das Annotationen über Frames propagiert und Frames markiert, bei denen die Tracking-Konfidenz unter einen Schwellenwert fällt, und den Annotator auffordert, neu zu prüfen. Dies ist eine direkte Anwendung der aktiven Lernidee auf die Annotationspipeline selbst: Das Werkzeug fragt den Annotator genau dort, wo seine Interpolation unsicher ist.

**Das Seltene-Ereignisse-Problem in autonomen Systemen.** Bei Anwendungen, bei denen die Konsequenzen seltener Ereignisse katastrophal sind — autonomes Fahren, UAV-Navigation — ist die Verteilung der im normalen Betrieb gesehenen Frames schlecht mit der Verteilung der tatsächlich wichtigsten Frames abgestimmt. Ein Datensatz, der durch gleichmäßiges Sampling von Fahrvideo erstellt wird, enthält Millionen von „nichts Interessantes passiert"-Frames und eine Handvoll der Beinahe-Unfall-, Ungewöhnlich-Beleuchtungs- und Sensor-Degradierungs-Frames, die tatsächlich für die Sicherheit wichtig sind. HITL-Aktives Lernen, das solche Frames identifiziert und priorisiert, ist kein Effizienz-Hack — es ist eine Sicherheitsanforderung.

```{seealso}
ImageNet-Datensatz: {cite}`russakovsky2015imagenet`. Label-Verzerrung in ImageNet: {cite}`yang2020towards`. COCO-Benchmark: {cite}`lin2014microsoft`. SAM (Segment Anything): {cite}`kirillov2023segment`. Core-Set aktives Lernen für CV: {cite}`sener2018active`.
```
