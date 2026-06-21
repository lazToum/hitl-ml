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

# Interaktives maschinelles Lernen

Aktives Lernen stellt eine fokussierte Frage: Welche Beispiele soll ich bei gegebenem Budget annotieren? Interaktives maschinelles Lernen (IML) stellt eine umfassendere Frage: Wie gestalten wir die *gesamte Interaktion* zwischen einem Menschen und einem Lernsystem maximal produktiv, angenehm und korrekt?

IML zeichnet sich durch die **Unmittelbarkeit** und **Direktheit** der Mensch-Modell-Rückkopplungsschleife aus. Während traditionelles ML den Menschen dazu bringt, Daten zu übergeben und auf den Abschluss des Trainings zu warten, ermöglicht IML dem Menschen, das Modellverhalten zu beobachten, Feedback zu geben und zu sehen, wie das Modell reagiert — oft innerhalb von Sekunden.

---

## Prinzipien des interaktiven maschinellen Lernens

Amershi et al. {cite}`amershi2014power` identifizieren drei definierende Merkmale von IML:

**1. Schnelles Feedback:** Das Modell aktualisiert sich schnell genug, damit Menschen den Effekt ihres Feedbacks wahrnehmen können. Im Grenzfall erfolgen Modellaktualisierungen in Echtzeit.

**2. Direkte Manipulation:** Der Mensch interagiert mit dem Modell durch die Daten oder durch die Vorhersagen des Modells — nicht durch Konfigurationsdateien oder Hyperparameter-Tuning.

**3. Iterative Verfeinerung:** Der Prozess ist genuinen iterativer Natur: Die nächste Aktion des Menschen wird durch das aktuelle Verhalten des Modells informiert, das durch die vorherigen Aktionen des Menschen geformt wurde.

Dies schafft eine enge **ko-adaptive Schleife**: Sowohl der Mensch als auch das Modell verändern sich im Laufe der Zeit in Reaktion aufeinander. Der Mensch erlernt, was das Modell versteht; das Modell erlernt, was dem Menschen wichtig ist.

---

## Vergleich mit aktivem Lernen

IML und aktives Lernen überschneiden sich erheblich, sind aber nicht identisch:

| Eigenschaft                    | Aktives Lernen                | Interaktives ML                   |
|--------------------------------|-------------------------------|-----------------------------------|
| Primäre Frage                  | Was annotieren?               | Wie interagieren?                 |
| Feedback-Latenz                | Kann stapelweise sein (Tage)  | Typischerweise Echtzeit oder nah  |
| Modell-Aktualisierungsfrequenz | Pro Runde (Stapel)            | Pro Interaktion (online)          |
| Menschliche Handlungsmacht     | Beantwortet Fragen des Modells| Kann das Modell proaktiv lehren   |
| Interface-Design               | Nebensächlich                 | Zentrales Anliegen                |
| Kognitive Belastung des Menschen | Nicht explizit modelliert   | Explizit berücksichtigt           |

Beim aktiven Lernen leitet die Maschine die Interaktion. Bei IML kann auch der Mensch die Initiative ergreifen — indem er Beispiele, Korrekturen oder Feedback zu beliebigen Aspekten des Modellverhaltens liefert, die am problematischsten erscheinen.

---

## Mixed-Initiative-Interaktion

**Mixed-Initiative**-Systeme erlauben sowohl dem Menschen als auch der Maschine, zu verschiedenen Zeitpunkten die Führung zu übernehmen {cite}`allen1999mixed`. Ein rein maschinengesteuertes System stellt Fragen und der Mensch antwortet. Ein rein menschengesteuertes System überlässt dem Menschen alle Entscheidungen. Mixed-Initiative-Systeme balancieren beides.

In der Praxis kombinieren die besten IML-Systeme:
- **Maschineninitiative:** „Ich bin bei diesen Beispielen unsicher — können Sie sie kennzeichnen?"
- **Menscheninitiative:** „Ich bemerke, dass das Modell bei dieser Kategorie konsistent falsch liegt — lassen Sie mich weitere Beispiele bereitstellen"
- **Bestätigung:** Das Modell zeigt sein aktuelles Verständnis; der Mensch bestätigt oder korrigiert

Gute IML-Interfaces machen das aktuelle Verständnis des Modells sichtbar und korrigierbar. Dies ist die **Verständlichkeits-Anforderung**: Menschen können ein Modell nur lenken, das sie zumindest annäherungsweise verstehen.

---

## Menschliche Faktoren in IML

IML bringt menschliche Faktoren — kognitive Belastung, Ermüdung, Konsistenz und Vertrauen — direkt in die Lernschleife. Schlechtes IML-Design führt zu:

**Annotationsmüdigkeit:** Menschen treffen in längeren Sitzungen schnellere, unachtsame Entscheidungen. Fehler, die in die Trainingsdaten gelangen.

**Ankerungsverzerrung:** Menschen verlassen sich zu sehr auf die aktuellen Vorschläge des Modells. Wenn ein Interface die Vorhersage des Modells voranzeigt, sind Annotatoren weniger geneigt, sie zu korrigieren, selbst wenn sie falsch ist — eine systematische Quelle von Label-Rauschen, die sich über Annotationsrunden hinweg verstärkt {cite}`geva2019annotator`. Vorannotation kann den Durchsatz steigern {cite}`lingren2014evaluating`, während sie gleichzeitig die Rate verringert, mit der Annotatoren Modellfehler erkennen; diese beiden Effekte müssen beim IML-Interface-Design gegeneinander abgewogen werden.

**Fehlkalibriertes Vertrauen:** Menschen vertrauen dem Modell entweder zu sehr (akzeptieren falsche Modellausgaben) oder zu wenig (ignorieren korrekte Vorschläge). Beide Muster verringern den Wert der Mensch-Modell-Zusammenarbeit.

**Sitzungskonsistenz:** Menschen können bei demselben Beispiel zu verschiedenen Zeitpunkten, besonders nach langen Sitzungen, unterschiedliche Entscheidungen treffen. Konsistenzprüfungen (erneutes Präsentieren früherer Beispiele) können dies erkennen und korrigieren.

Gutes IML-Design mindert diese Probleme durch Interface-Entscheidungen: explizite Darstellung der Modellkonfidenz, Randomisierung der Anzeigereihenfolge, Begrenzung der Sitzungsdauer und Einbau von Konsistenzprüfungen.

---

## Die IML-Feedbacktypen in der Praxis

### Feedback auf Beispielebene

Der Mensch stellt ein Label oder eine Korrektur für ein bestimmtes Beispiel bereit. Dies ist die häufigste Form und direkt kompatibel mit überwachtem Lernen.

### Feedback auf Merkmalsebene

Der Mensch gibt an, welche Merkmale relevant oder irrelevant sind. „Das Modell sollte auf die Wörter 'dringend' und 'Frist' für diese Kategorie achten." Dies ist ausdrucksvoller als Feedback auf Beispielebene und kann für bestimmte Aufgaben effizienter sein.

**TFIDF Interactive** und ähnliche Systeme erlauben Annotatoren, relevante Wörter in Textdokumenten hervorzuheben. Diese Hervorhebungen werden in Einschränkungen oder zusätzliche Aufsicht über die Aufmerksamkeit des Modells umgewandelt.

### Feedback auf Modellebene

Der Mensch korrigiert das Verhalten des Modells für eine Klasse von Eingaben direkt: „Immer wenn die Eingabe [X] enthält, sollte die Ausgabe [Y] sein." Dies entspricht logischen Regeln oder Einschränkungen in Ansätzen wie Posterior Regularization {cite}`ganchev2010posterior` oder einschränkungsgesteuertem Lernen.

---

## Fallstudie: Google Teachable Machine

Teachable Machine ist ein zugängliches webbasiertes IML-System, das nicht-technischen Nutzern ermöglicht, im Browser Bildklassifikatoren zu trainieren. Der Nutzer:

1. Nimmt Beispiele jeder Klasse mit der Webcam auf
2. Trainiert das Modell mit einem einzigen Klick (Fine-Tuning eines MobileNet im Browser)
3. Sieht sofort die Vorhersagen des Modells auf Live-Video
4. Fügt weitere Beispiele für Klassen hinzu, bei denen das Modell falsch liegt

Dies veranschaulicht die zentrale IML-Schleife: Beispiele bereitstellen → Modell beobachten → Fehler identifizieren → gezieltere Beispiele bereitstellen. Das Echtzeit-Feedback (Modellausgaben aktualisieren sich in Echtzeit, typischerweise mit interaktiven Bildraten auf moderner Hardware) macht die ko-adaptive Schleife unmittelbar spürbar.

---

## Implementierung einer einfachen IML-Schleife

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

## Der Großmutter-Test

Eine nützliche Heuristik zur Bewertung des IML-Interface-Designs — und des HITL-Systemdesigns im Allgemeinen — ist das, was wir den **Großmutter-Test** nennen werden (eine hier eingeführte Originalprägung als Designbeschränkung, nicht als Verweis auf frühere Arbeit):

> *Eine 1930 geborene Frau sollte dieses Gerät per Stimme bedienen können, und bei Frustration graceful auf eine Tastatur- oder Textoberfläche zurückfallen können.*

Der Test dreht sich nicht primär um Barrierefreiheit, auch wenn er das auch ist. Es geht um **Design für Reibung**. Wenn ein System ein mentales Modell neuronaler Netze, Trainingsschleifen oder Wahrscheinlichkeitsverteilungen erfordert, um es effektiv zu nutzen, hat es den Großmutter-Test nicht bestanden. Der Mensch im Loop sollte teilnehmen können, ohne die Maschinenseite der Schleife zu verstehen.

Die Implikationen für das IML-Design sind konkret:

**Stimme-zuerst-Fallback:** Die primäre Interaktionsmodalität sollte natürliche Sprache oder Geste sein — keine Parameter-Schieberegler oder Konfidenz-Schwellenwerte. Experten mögen Schieberegler wollen; jeder sollte „das ist falsch" sagen können.

**Graceful Degradation:** Wenn die bevorzugte Modalität des Nutzers versagt oder frustriert, sollte das System eine Alternative anbieten — keinen leeren Bildschirm oder eine Fehlermeldung. Das Interface ist Teil des Lernsystems; ein Nutzer, der nicht interagieren kann, kann nicht lehren.

**Lesbarer Modellzustand:** Das aktuelle Verständnis des Modells sollte in menschlichen Begriffen sichtbar sein. Nicht „Konfidenz: 0,73", sondern „Ich bin ziemlich sicher, dass dies [X] ist, aber ich habe Beispiele wie dieses in beide Richtungen gehen gesehen." Unsicherheit sollte in einer Sprache kommuniziert werden, die zur Korrektur einlädt.

**Toleranz gegenüber Ambiguität:** Ein 93-jähriger Nutzer und ein 23-jähriger ML-Ingenieur werden unterschiedlich mit demselben System interagieren. Der Großmutter-Test fragt, ob das System beide aufnehmen kann — nicht indem es das Alter des Nutzers erkennt, sondern indem es Interaktionen gestaltet, die über ein Spektrum von Expertise und Komfort funktionieren.

Der Test gewinnt besondere Bedeutung, da ML-Systeme von Forschungswerkzeugen zu alltäglicher Infrastruktur werden. Ein medizinisches Bildanalyse-Assistenzsystem für Radiologen, ein juristischer Dokumentenklassifikator für Justizkaufleute, ein Bildungsfeedbacksystem für Lehrkräfte — jedes umfasst Menschen-im-Loop, die sich nicht als KI-Trainer angemeldet haben. Für sie zu entwerfen ist kein Zugeständnis; es ist der Punkt.

:::{admonition} Designprinzip
:class: tip
Der Großmutter-Test ist eine Designbeschränkung, kein Zielpublikum. Systeme, die ihn bestehen, sind robuster gegenüber Nutzervielfalt, toleranter gegenüber Expertise-Lücken und ehrlicher darüber, was sie von Menschen-im-Loop erwarten. Wenn ein System vor der Nutzung eine Erklärung erfordert, bittet es den Menschen, zusätzliche Arbeit zu leisten. Diese Arbeit sollte durch proportionalen Nutzen gerechtfertigt sein.
:::

---

## IML und Basismodelle

Modernes IML nutzt zunehmend **vortrainierte Basismodelle** {cite}`bommasani2021opportunities` als Grundlage. Anstatt von Grund auf zu trainieren, verfeinern Nutzer ein großes vortrainiertes Modell mit einer kleinen Anzahl interaktiver Beispiele. Dies kann die Anzahl der benötigten Beispiele erheblich reduzieren — in günstigen Fällen nur 5–50 Beispiele statt Tausender, abhängig davon, wie gut die vortrainierten Repräsentationen zur Zielaufgabe passen {cite}`bommasani2021opportunities`.

Techniken, die dies ermöglichen:
- **Few-Shot-Prompting:** Beispiele im Kontextfenster des LLM bereitstellen
- **Adapter-Fine-Tuning:** Kleine Adaptermodule aktualisieren, während das Basismodell eingefroren bleibt
- **Parameter-effizientes Fine-Tuning (PEFT):** LoRA, Prefix-Tuning und ähnliche Methoden, die schnelle, ressourcenarme Aktualisierungen ermöglichen

Basismodelle ändern die IML-Dynamik: Menschen lehren nicht mehr ein leeres Modell von Grund auf, sondern *steuern* ein Modell, das bereits sehr viel weiß. Die Herausforderung verlagert sich von „wie genug Beispiele bereitstellen" zu „wie genau spezifizieren, was wir anders wollen als das, was das Modell bereits tut."

```{seealso}
Die Übersicht von {cite}`amershi2014power` bleibt die beste Einführung in IML-Prinzipien. Für Mixed-Initiative-Systeme im Besonderen, siehe {cite}`allen1999mixed`. Zu Ankerungseffekten bei der Annotation, siehe {cite}`geva2019annotator` und {cite}`lingren2014evaluating`.
```
