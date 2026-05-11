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

# HITL in der natürlichen Sprachverarbeitung

Natürliche Sprache ist die Domäne, in der HITL ML wohl die größte Wirkung hatte — und wo seine tiefsten konzeptuellen Schwierigkeiten zutage treten. Sprache ist von Natur aus sozial: Ihre Bedeutung wird von menschlichen Gemeinschaften konstruiert, ihre Pragmatik hängt von Kontext und Absicht ab, und ihre Qualität kann nur von menschlichen Lesern beurteilt werden. Aber dies bedeutet auch, dass NLP-Annotation nicht nur ein Prozess der Beobachtungssammlung ist. Es ist ein Prozess der *Konstruktion* von Kategorien.

---

## Das konstitutive Problem bei der NLP-Annotation

In der medizinischen Bildgebung gibt es eine Grundwahrheit: Ein Tumor ist vorhanden oder nicht. Das Label des Radiologen mag unsicher sein, aber es versucht, etwas Reales zu erfassen. NLP-Annotation ist oft grundlegend anders. Wenn ein Annotator einen Tweet als „toxisch" markiert, gibt es kein toxisches Molekül im Tweet, das wir zu erkennen versuchen. **Das Label konstituiert die Kategorie.**

Dies hat tiefgreifende Konsequenzen, die häufig unterschätzt werden:

**Die Annotationsbelegschaft definiert das Phänomen.** Ein Label-Schema für „anstößige Sprache" kodiert die Sensibilitäten derjenigen, die es entworfen und angewendet haben. Ein Team englischsprachiger Annotatoren mit einheitlichem demografischem Hintergrund, das unter Richtlinien einer Unternehmensrichtlinien-Abteilung arbeitet, produziert einen Datensatz, der das Verständnis dieses Teams von Anstößigkeit widerspiegelt — keinen universellen menschlichen Standard. Auf solchen Daten trainierte Modelle werden dieselben impliziten Grenzen aufweisen.

**Richtlinien sind Theorie, ob sie es eingestehen oder nicht.** Jedes Annotationsschema macht ontologische Behauptungen. Zu entscheiden, dass „Ironie" und „Sarkasmus" dieselbe Klasse sind, ist eine theoretische Behauptung, keine neutrale Bequemlichkeit. Zu entscheiden, „Wut" als eine einzelne Klasse zu kennzeichnen, anstatt „rechtschaffene Wut" von „feindseliger Wut" zu unterscheiden, kollidiert eine Unterscheidung, die für die nachgelagerte Aufgabe wichtig sein kann. Diese Entscheidungen werden unter Produktionsdruck getroffen und selten überprüft.

**Label-Instabilität über die Zeit.** Soziale Sprache entwickelt sich. Ein auf 2018-Daten trainiertes Toxizitätsmodell wird Inhalte aus 2024 falsch klassifizieren, nicht weil es statistisch untertrainiert ist, sondern weil sich die soziale Bedeutung bestimmter Begriffe geändert hat. NLP-Annotation ist kein Sampling aus einer statischen Verteilung — es ist Sampling aus einem sich bewegenden Ziel, zu dessen Konstruktion der Annotationsakt teilweise beiträgt.

:::{admonition} Das Annotationsartefakt-Problem
:class: important

Geva et al. {cite}`geva2019annotator` demonstrierten, dass NLI-Datensätze (Natural Language Inference) systematische Artefakte enthalten, die durch den Annotationsprozess selbst eingeführt wurden. Annotatoren, die aufgefordert werden, „Schlussfolgerungs"-Hypothesen für eine gegebene Prämisse zu schreiben, neigen dazu, bestimmte syntaktische Muster zu verwenden; Annotatoren, die „Widerspruchs"-Hypothesen schreiben, verwenden andere. Modelle lernen, basierend auf diesen Artefakten zu klassifizieren, anstatt die beabsichtigte semantische Beziehung — sie lösen die Annotationsaufgabe, nicht die zugrunde liegende NLP-Aufgabe.

Dies ist keine Nachlässigkeit. Es ist eine inhärente Konsequenz davon, dass Menschen Beispiele konstruieren, um ein Label zu passen. Der HITL-Prozess fügt ein systematisches Signal ein, das nie in den Daten sein sollte.
:::

---

## Textklassifikations-Annotation

Die einfachste NLP-Annotationsaufgabe ist die Zuweisung einer Kategorie zu einem Textdokument. Stimmungsanalyse, Themenklassifikation, Absichtserkennung und Spam-Filterung sind alles Klassifikationsaufgaben.

**Herausforderungen spezifisch für Textklassifikation:**

*Subjektivität.* Kategorien wie „toxisch" oder „anstößig" sind von Natur aus subjektiv und variieren über kulturelle Kontexte, Annotatorenhintergründe und Plattformkontext. Zwischen Annotatoren unterscheiden sich Wahrnehmungen von Anstößigkeit erheblich nach Demografie — eine Tatsache mit direkten Implikationen für Fairness {cite}`blodgett2020language`.

*Label-Ambiguität.* Viele Dokumente gehören zu mehreren Kategorien oder liegen auf einer Grenze. Eine Rezension, die zu 60 % positiv und zu 40 % negativ ist, ist genuinen ambig, nicht falsch annotiert. Das Erzwingen eines einzigen Labels verwirft echte Information (siehe Kapitel 13 über Soft-Labels und Annotatorenuneinigkeit).

*Label-Granularität.* Ein 2-Klassen-Stimmungsmodell kann für die Social-Media-Überwachung ausreichen; eine 7-Punkte-Skala kann für die Produktfeedback-Analyse benötigt werden. Die richtige Granularität hängt von der nachgelagerten Aufgabe ab, wird aber in der Regel vor der Annotation festgelegt — eine folgenreiche Designentscheidung, die mit unzureichenden Daten getroffen wird.

---

## Erkennung benannter Entitäten

NER-Annotation erfordert das Identifizieren von Textspannen und die Zuweisung eines Entitätstyps (PERSON, ORGANISATION, ORT usw.). Die Annotation ist aus mehreren Gründen komplexer als Dokumentklassifikation:

**Spannen-Grenzen sind ambig.** In „Apple CEO Tim Cook kündigte an..." umfasst die PERSON-Entität „Tim Cook" oder „Apple CEO Tim Cook"? Richtlinien müssen diese Fälle explizit behandeln, und die Annotatorenübereinstimmung bei Spannen ist konsistent niedriger als bei Typen.

**Typzuweisung erfordert Weltwissen.** „Apple" ist in einem Kontext ORG, in einem anderen PRODUKT, und in „Apfelkuchen" keines von beidem. Annotatoren benötigen ausreichendes Domänenwissen für korrekte Typzuweisungen.

**Verschachtelte Entitäten.** „Die Universität Bonn" enthält ORGANISATION innerhalb von ORT. Standard-BIO-Tagging kann keine verschachtelten Entitäten darstellen; komplexere Schemata (z. B. BIOES oder graphbasierte Formate) sind erforderlich.

**Annotationseffizienz.** Vorannotation mit einem Basis-NER-Modell beschleunigt die Annotation erheblich, indem Annotatoren Vorhersagen korrigieren anstatt von Grund auf zu annotieren. In einer Studie über klinisches NER wurden Durchsatzsteigerungen von 30–60 % beobachtet {cite}`lingren2014evaluating`; das Ausmaß solcher Gewinne hängt stark von der Qualität des Basismodells und der Domäne ab.

---

## Relationsextraktion und semantische Annotation

Über die Entitätserkennung hinaus erfordert die Relationsextraktion die Annotation von *Beziehungen* zwischen Entitäten:

- Annotatoren müssen sowohl Entitäten als auch das sie verbindende Prädikat verstehen
- Relationstypen haben komplexe semantische Unterscheidungen (ARBEITET_BEI vs. ANGESTELLT_VON vs. GRÜNDETE)
- Negative Beispiele (Entitätspaare ohne Relation) sind viel häufiger als positive

**Annotatorenübereinstimmung bei der Relationsextraktion** ist tendenziell niedriger als bei Klassifikationsaufgaben. Für gut definierte Schemata werden $\kappa$-Werte im Bereich von 0,65–0,80 häufig berichtet {cite}`pustejovsky2012natural`; für komplexe semantische Relationen (Ereigniskausalität, temporale Relationen) kann die Übereinstimmung je nach Schema-Design und Annotatorentraining erheblich niedriger ausfallen.

---

## Maschinelle Übersetzungspost-Editierung (MTPE)

Maschinelle Übersetzungspost-Editierung ist eine ausgereifte Form von HITL-NLP. Ein menschlicher Übersetzer korrigiert die Ausgabe eines MT-Systems, anstatt von Grund auf zu übersetzen:

**Leichte Post-Editierung (LPE):** Nur kritische Fehler werden korrigiert. Geeignet, wenn die Übersetzungsqualitätsanforderungen moderat sind.

**Vollständige Post-Editierung (FPE):** Die Ausgabe wird auf Publikationsqualität korrigiert. Die bearbeitete Ausgabe wird typischerweise zu Trainingsdaten für weitere MT-Verbesserung — ein echter Human-in-the-Loop-Verfeinerungszyklus.

**HTER (Human-targeted Translation Edit Rate):** Eine Metrik, die den Editierabstand zwischen der MT-Ausgabe und der post-editierten Übersetzung misst, normalisiert nach Satzlänge {cite}`graham2015accurate`. Als grobe Faustformel gilt HTER unter etwa 0,3 oft als gute MT-Ausgabe; über 0,5 kann Übersetzung von Grund auf schneller sein — obwohl diese Schwellenwerte nach Domäne und Sprachpaar variieren.

---

## Konversations-KI und Dialog-Annotation

Die Annotation von Dialog führt zeitliche Struktur ein:

- **Turn-Ebenen-Annotation:** Jeden Turn kennzeichnen (Absicht, Stimmung, Qualität)
- **Dialog-Ebenen-Annotation:** Gesamtkohärenz, Aufgabenerfolg, Nutzerzufriedenheit bewerten
- **Interaktionstrace-Annotation:** Spezifische Fehlerpunkte in einer Konversation identifizieren

HITL ist bei Dialog besonders wichtig, weil Modellversagen oft subtil und kumulativ ist: Ein sachlicher Fehler in Turn 3 mag erst in Turn 7 offensichtlich werden. Menschliche Annotatoren, die Konversationen verfolgen, können diese Langstrecken-Fehlermuster identifizieren, die automatisierte Metriken vollständig übersehen.

---

## Programmatische Kennzeichnung und schwache Überwachung

Wenn annotierte Daten knapp sind, ermöglicht **schwache Überwachung** die Verwendung mehrerer verrauschter, überlappender Kennzeichnungsfunktionen, um im großen Maßstab probabilistische Labels zu generieren. **Snorkel** {cite}`ratner2017snorkel` ist das kanonische Rahmenwerk:

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score

rng = np.random.default_rng(42)

# -------------------------------------------------------
# Toy weak supervision: sentiment classification
# 5 labeling functions (LFs) with different coverage/accuracy
# Label: +1 (positive), -1 (negative), 0 (abstain)
# -------------------------------------------------------

N = 1000
true_labels = rng.choice([-1, 1], size=N)
X_features = np.column_stack([
    true_labels * 0.8 + rng.normal(0, 0.5, N),
    rng.normal(0, 1, N),
    rng.normal(0, 1, N),
])

def make_lf(accuracy, coverage, seed):
    rng_lf = np.random.default_rng(seed)
    votes = np.zeros(N, dtype=int)
    active = rng_lf.random(N) < coverage
    correct = rng_lf.random(N) < accuracy
    votes[active & correct]  = true_labels[active & correct]
    votes[active & ~correct] = -true_labels[active & ~correct]
    return votes

LFs = np.column_stack([
    make_lf(accuracy=0.85, coverage=0.60, seed=1),
    make_lf(accuracy=0.78, coverage=0.45, seed=2),
    make_lf(accuracy=0.70, coverage=0.80, seed=3),
    make_lf(accuracy=0.90, coverage=0.30, seed=4),
    make_lf(accuracy=0.60, coverage=0.90, seed=5),
])

def majority_vote(LF_matrix):
    labels = []
    for i in range(LF_matrix.shape[0]):
        votes = LF_matrix[i][LF_matrix[i] != 0]
        labels.append(0 if len(votes) == 0 else int(np.sign(votes.sum())))
    return np.array(labels)

mv_labels = majority_vote(LFs)
covered = mv_labels != 0

print(f"Coverage:                    {covered.mean():.1%}")
print(f"MV accuracy (covered):       {(mv_labels[covered] == true_labels[covered]).mean():.3f}")

X_train, y_train = X_features[covered], mv_labels[covered]
X_test,  y_test  = X_features[~covered], true_labels[~covered]

if len(X_train) > 10 and len(X_test) > 10:
    clf = LogisticRegression().fit(X_train, y_train)
    preds = clf.predict(X_test)
    print(f"F1 on uncovered test set:    {f1_score(y_test, preds):.3f}")
```

---

## RLHF für Sprachmodelle: Die Annotationsrealität

Kapitel 6 hat RLHF technisch behandelt. Aus einer NLP-Perspektive ist die Annotationsaufgabe schwieriger als sie von außen erscheint.

**Was Annotatoren tatsächlich gefragt werden** — zwei Modellausgaben zu vergleichen und anzugeben, welche „besser" ist — klingt einfach. In der Praxis ist „besser" ein unterspezifiziertes Konstrukt, das Annotatoren mit persönlichen Heuristiken auflösen. Manche gewichten Flüssigkeit stark; andere Sachgenauigkeit; andere bestrafen Ausführlichkeit. Ohne strenge Richtlinien spiegelt der resultierende Präferenzdatensatz nicht abstrakte menschliche Werte wider, sondern die spezifischen Auflösungsstrategien der eingesetzten Annotationsbelegschaft.

**Die wichtigsten Annotationsdimensionen sind:**

- *Nützlichkeit:* Beantwortet die Antwort die Frage gut? Ist sie informativ, klar und angemessen detailliert?
- *Faktentreue:* Ist die Antwort sachlich korrekt? Dies erfordert, dass Evaluierende Domänenwissen haben — eine Anforderung, die im großen Maßstab ernsthafte Qualitätsprobleme schafft, da generalistische Annotatoren keine Spezialbehauptungen verifizieren können.
- *Harmlosigkeit:* Vermeidet die Antwort toxische, voreingenommene, schädliche oder unangemessene Inhalte? Diese Urteile erfordern detaillierte Richtlinien, weil „schädlich" stark vom Kontext abhängt und sich über Kulturen, Zeit und Plattformkontext verschiebt.
- *Kalibrierung:* Drückt die Antwort angemessene Unsicherheit aus? Annotatoren bevorzugen systematisch Antworten, die sicher klingen, was ein Belohnungssignal gegen angemessene epistemische Bescheidenheit erzeugt.

Die Wechselwirkung zwischen Kriterien ist komplex: Eine maximal hilfreiche Antwort auf eine gefährliche Frage kann maximal schädlich sein. Richtlinien müssen spezifizieren, wie konkurrierende Kriterien abgewogen werden — und diese Abwägungen sind effektiv politische Entscheidungen, keine Annotationsentscheidungen. Die Annotationsbelegschaft trifft Politik.

**Skalierung konzentriert demografischen Einfluss.** RLHF für große Modelle umfasst relativ kleine Annotationsbelegschaften (Hunderte bis niedrige Tausende), die Milliarden von nachgelagerten Entscheidungen treffen. Die demografischen und kulturellen Vorurteile dieser Belegschaft pflanzen sich im großen Maßstab in das Modellverhalten fort — auf eine Weise, die nicht geschehen würde, wenn die Annotation stärker verteilt wäre. Dies ist eines der am wenigsten diskutierten strukturellen Probleme in der aktuellen RLHF-Pipeline.

---

## Die Annotation-Modell-Rückkopplungsschleife

In NLP mehr als in jeder anderen Domäne werden Annotations- und Modellentwicklungsprozesse über die Zeit verflochten:

1. Annotatoren werden mit den bestehenden Ausgaben eines Modells als Referenz kalibriert (oft implizit).
2. Das Belohnungsmodell lernt, was Annotationen tendieren zu bevorzugen.
3. Der Generator wird feinabgestimmt, um Ausgaben zu produzieren, die hohe Belohnung erhalten.
4. Diese Ausgaben beeinflussen, wie „gut" in nachfolgenden Annotationsrunden aussieht.

Diese Rückkopplungsschleife ist nicht von Natur aus pathologisch — sie ermöglicht RLHF zu konvergieren — aber es bedeutet, dass das Verhalten des Modells von einem sich bewegenden Ziel geformt wird, zu dessen Bewegung der Annotationsprozess selbst beiträgt. Empirisch ist es schwierig zu unterscheiden, was das Modell gelernt hat, weil es menschliche Präferenzen widerspiegelt, von dem, was es gelernt hat, weil es gelernt hat, Annotatorenheuristiken zu mustergleichen.

Es gibt keine saubere Lösung. Die beste aktuelle Praxis ist, Drift zu überwachen mittels gehaltener Präferenzurteile, die in regelmäßigen Abständen gesammelt werden, und die Annotationsrichtlinien-Version als experimentelle Variable zu behandeln.

---

## Evaluierung generativer NLP-Modelle

Im Gegensatz zu Klassifikationsmodellen mit einer klaren Genauigkeitsmetrik erfordert die Bewertung der Generierungsqualität menschliches Urteilsvermögen:

| Evaluierungsmethode | Beschreibung | Kosten |
|---|---|---|
| Direkte Bewertung (DA) | Annotatoren bewerten Qualität auf einer Skala | Mittel |
| Vergleichendes Urteil | Annotatoren vergleichen zwei Ausgaben | Niedrig |
| MQM (Multidimensionale Qualitätsmetriken) | Strukturierte Fehlertaxonomie | Hoch |
| RLHF-Präferenz | Präferenz-Labels für Training verwendet | Mittel |
| LLM als Richter | LLM bewertet Ausgaben (korreliert mäßig mit Mensch) | Sehr niedrig |
| BERTScore, BLEU | Automatische Metriken (unvollkommene Korrelation mit menschlichem Urteil) | Sehr niedrig |

Automatische Metriken (BLEU für MT, ROUGE für Zusammenfassung) sind billig, aber unvollkommen mit menschlichen Qualitätsurteilen korreliert {cite}`reiter2018structured`. LLM-als-Richter-Ansätze zeigen moderate Übereinstimmung mit menschlichen Annotatoren {cite}`zheng2023judging` und werden zunehmend für schnelle Iteration verwendet, sollten aber keine menschliche Evaluierung für abschließende Bewertungen ersetzen. Für Entscheidungen mit echten Einsätzen bleibt menschliche Beurteilung notwendig.

```{seealso}
Snorkel schwache Überwachung: {cite}`ratner2017snorkel`. NLP-Annotationsrichtlinien: {cite}`pustejovsky2012natural`. Annotationsartefakte in NLI: {cite}`geva2019annotator`. Annotatorenverzerrung und NLP-Datensätze: {cite}`blodgett2020language`. Zur Evaluierung generativer Modelle: {cite}`reiter2018structured`.
```
