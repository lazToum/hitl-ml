# Was ist Human-in-the-Loop ML?

```{epigraph}
Eine Maschine, die aus Erfahrung lernen kann... aber nur, wenn man ihr die richtigen Erfahrungen gibt.
-- in Anlehnung an Alan Turing
```

## Das Automatisierungsparadoxon

Jede neue Welle der Automatisierung erzeugt neue Anforderungen an die menschliche Aufmerksamkeit. Als die Luftfahrt den Autopiloten einführte, wurden Piloten zu Überwachern — verantwortlich nicht für die momentane Steuerung, sondern für die schwierigere Aufgabe, *wann* sie übernehmen sollten. Als Supermärkte Self-Checkout einführten, stellten sie fest, dass diese Systeme mehr menschliche Aufsicht pro Transaktion benötigen als traditionelle Kassiererinnen und Kassierer, nicht weniger. Und als das maschinelle Lernen begann, im großen Maßstab Entscheidungen zu treffen — in der Medizin, im Finanzwesen, bei der Personalauswahl und in der Inhaltsmoderation — erzeugte es einen enormen, anhaltenden Bedarf an menschlichem Urteilsvermögen.

Dies ist das **Automatisierungsparadoxon** {cite}`bainbridge1983ironies`: Je leistungsfähiger ein automatisiertes System wird, desto folgenreicher sind seine Fehler und desto notwendiger wird eine robuste menschliche Aufsicht. Maschinelles Lernen bildet da keine Ausnahme.

Human-in-the-Loop Machine Learning (HITL ML) ist das Feld, das dieses Paradoxon ernst nimmt und es von Beginn an in das Design von Systemen integriert. Anstatt menschliche Beteiligung als temporäres Gerüst zu behandeln, das schließlich entfernt werden soll, betrachtet HITL ML die Mensch-Maschine-Interaktion als *Merkmal* — eine Quelle von Signal, Korrektur und Lenkung, die Modelle genauer, besser an menschliche Werte angepasst und vertrauenswürdiger machen kann.

---

## Definition von Human-in-the-Loop ML

Es gibt keine einheitlich vereinbarte Definition von HITL ML, und der Begriff wird in der Literatur auf verschiedene, überlappende Weisen verwendet. Für dieses Handbuch übernehmen wir eine breite, aber präzise Definition:

:::{admonition} Definition
:class: important

**Human-in-the-Loop Machine Learning** bezeichnet jedes ML-System oder jede ML-Methodik, bei der menschliches Feedback auf eine *gezielte, strukturierte und fortlaufende* Weise in den Lernprozess einbezogen wird — nicht nur zum Zeitpunkt der Datensatzerstellung, sondern während des gesamten Trainings, der Evaluierung und des Einsatzes.

:::

Diese Definition hat drei Kernbestandteile:

**Gezielt.** HITL ist kein zufälliger menschlicher Einfluss (z. B. die Tatsache, dass Trainingsdaten ursprünglich von Menschen erstellt wurden). Es bezieht sich auf Systeme, die explizit dafür konzipiert sind, menschliches Feedback einzuholen, einzubeziehen und davon zu profitieren.

**Strukturiert.** Das Feedback hat eine definierte Form — ein Label, eine Korrektur, ein Präferenzurteil, eine Demonstration — und eine definierte Rolle im Lernalgorithmus.

**Fortlaufend.** Die Rückkopplungsschleife läuft über die Zeit weiter und ermöglicht es dem System, sich zu verbessern, wenn es auf neue Situationen trifft, Fehler macht und menschliche Lenkung erhält.

Diese Definition umfasst klassische Annotationspipelines, aktives Lernen, interaktives ML, RLHF und Imitationslernen. Sie schließt passive Datensammlung und rein offline-überwachtes Lernen aus (obwohl die Grenze unscharf ist, wie wir in Kapitel 2 erörtern werden).

---

## Ein kurzer historischer Überblick

### Expertensysteme und Wissenstechnik (1960er–1980er)

Die frühesten KI-Systeme waren fast vollständig human-in-the-loop: Wissenstechniker saßen monatelang mit Fachexperten zusammen und kodierten mühsam Regeln in Expertensysteme wie MYCIN und DENDRAL. Jedes Wissenselement wurde explizit von einem Menschen bereitgestellt. Die Maschine war der Ausführende; der Mensch war das Orakel.

Diese Systeme funktionierten in engen Domänen überraschend gut, waren aber spröde — unfähig zur Verallgemeinerung über ihre handgefertigten Regeln hinaus und teuer in der Wartung.

### Die statistische Wende (1980er–2000er)

Der Übergang zum statistischen maschinellen Lernen in den 1980er und 1990er Jahren veränderte die Art der menschlichen Beteiligung. Anstatt Wissen als Regeln zu kodieren, lieferten Menschen nun *Beispiele* — annotierte Datensätze, die es Modellen ermöglichten, Muster zu erschließen. Die menschliche Rolle wurde die des Annotators: Dokumente kennzeichnen, Bilder taggen, Sprache transkribieren.

Dies war ein großer Schritt nach vorne, schuf aber einen neuen Engpass: **Annotierte Daten sind teuer**. Forscher begannen zu fragen, wie man den menschlichen Annotationsaufwand am effizientesten nutzen kann. Diese Frage gab dem **aktiven Lernen** seinen Anstoß, das Anfang der 1990er Jahre erstmals formalisiert wurde {cite}`cohn1994improving`.

### Die Ära des tiefen Lernens (2010er–heute)

Die Revolution des tiefen Lernens schuf ein neues Regime: Modelle mit Milliarden von Parametern, die außerordentlich komplexe Funktionen aus Daten erlernen können — aber entsprechend riesige annotierte Datensätze erfordern. ImageNet (14 Millionen annotierte Bilder) und nachfolgende Annotationsprojekte im großen Maßstab zeigten sowohl die Leistungsfähigkeit als auch die Kosten der Skalierung.

Gleichzeitig legte der großflächige Einsatz von ML neue Probleme offen: Modelle, die im Durchschnitt akkurat waren, aber für bestimmte Gruppen systematisch falsch lagen, Fakten selbstsicher halluzinierten und messbare Proxys anstelle menschlicher Werte optimierten. Diese Fehler motivierten neue Formen menschlicher Beteiligung: nicht nur Kennzeichnung, sondern *Ausrichtung* — das Bestreben, Modelle so zu verhalten, wie Menschen es tatsächlich wollen.

Der klarste Ausdruck dieser ausrichtungsorientierten HITL-Arbeit ist das **Bestärkende Lernen aus menschlichem Feedback (RLHF)** {cite}`christiano2017deep`, das zur Grundlage von Systemen wie InstructGPT {cite}`ouyang2022training` und den Instruktionsfolge-Fähigkeiten moderner Sprachmodelle wurde.

---

## Warum HITL? Das Argument für menschliches Urteilsvermögen

Was macht menschliches Urteilsvermögen wertvoll genug, um es in maschinelle Lernsysteme einzubeziehen? Mehrere Eigenschaften:

### 1. Gesunder Menschenverstand und Weltwissen

Menschen bringen bei jeder Aufgabe umfangreiches Hintergrundwissen mit. Wenn eine Radiologin ein Röntgenbild kennzeichnet, schöpft sie aus jahrelanger Ausbildung, einem Verständnis der Anatomie und implizitem Wissen darüber, wie Krankheiten aussehen — Wissen, das außerordentlich schwer vollständig zu spezifizieren oder allein aus Daten zu erwerben ist.

### 2. Semantische Verankerung

Labels sind bedeutungsvoll, weil Menschen verstehen, was sie bedeuten. Die Klasse „Katze" in ImageNet bezieht sich auf ein unscharfes Konzept, das Menschen intuitiv erkennen, das aber keine formale Definition vollständig erfasst. Modelle erlernen die Extension des Labels (welche Bilder ihm zugeordnet werden), aber nicht unbedingt das Konzept selbst, was zu Fehlern bei Grenzfällen führt, die jeder Mensch korrekt behandeln würde.

### 3. Werteausrichtung

Menschen haben Präferenzen, Werte und ethische Urteile, die ML-Modelle nicht allein aus Daten ableiten können. Ob ein Text „hilfreich" oder „schädlich" ist, ist keine rein empirische Frage — es hängt von menschlichen Werten ab, die je nach Person und Kontext variieren. HITL ist der primäre Mechanismus, durch den diese Werte an ML-Systeme kommuniziert werden können.

### 4. Anpassungsfähigkeit

Menschliches Urteilsvermögen kann sich ohne Neutraining an neue Situationen anpassen. Ein auf historischen Daten trainiertes Modell kann katastrophal versagen, wenn sich die Welt verändert; ein Mensch kann die Neuartigkeit erkennen und angemessen reagieren.

### 5. Verantwortlichkeit

In hochriskanten Domänen — Medizin, Recht, Finanzwesen — müssen Entscheidungen gegenüber Menschen verantwortbar sein. HITL-Systeme machen diese Verantwortbarkeit handhabbar, indem sie Menschen in einer Position halten, das Maschinenverhalten zu verstehen, zu überprüfen und außer Kraft zu setzen.

---

## Die Rückkopplungsschleife

Die zentrale Struktur von HITL ML ist eine Rückkopplungsschleife zwischen einem Modell und einem oder mehreren Menschen:

```text
+---------------------------------------------+
|                                             |
|   Modell trifft Vorhersagen / stellt        |
|   Anfragen                                  |
|   ---------------------------------->       |
|                                   Mensch   |
|   Mensch gibt Feedback           <-------- |
|   ----------------------------------        |
|                                             |
|   Modell aktualisiert sich auf Feedback     |
|                                             |
+---------------------------------------------+
```

Die Art des Feedbacks variiert enorm zwischen den HITL-Paradigmen:

| Feedbacktyp        | Beispiel                                          | Primäres Paradigma       |
|--------------------|---------------------------------------------------|--------------------------|
| Klassenbezeichnung | „Diese E-Mail ist Spam"                           | Überwachtes Lernen       |
| Korrektur          | „Die Entität sollte ORG sein, nicht PER"          | Aktives / interaktives ML|
| Präferenz          | „Antwort A ist besser als B"                      | RLHF / Ranking           |
| Demonstration      | Dem Roboter zeigen, wie er ein Objekt greift      | Imitationslernen         |
| Natürliche Sprache | „Sei knapper in deinen Antworten"                 | Instruktions-Feinabstimmung |
| Implizites Signal  | Nutzer hat geklickt / nicht geklickt             | Implizites Feedback      |

---

## Was HITL nicht ist

Es lohnt sich, präzise zu sein, was *außerhalb* unserer Definition liegt.

**HITL ist nicht dasselbe wie Human-in-the-Loop-Einsatz** (manchmal als „Human on the Loop" bezeichnet), bei dem Menschen automatisierte Entscheidungen überwachen und außer Kraft setzen können, aber keine Korrekturen in das Training zurückleiten. Wir werden diese Unterscheidung in Kapitel 2 erörtern.

**HITL ist nicht allein schwache Überwachung.** Programmatische Kennzeichnungssysteme wie Snorkel verwenden Kennzeichnungsfunktionen (oft von Menschen verfasste Regeln), um im großen Maßstab verrauschte Labels zu erzeugen. Dies ist eine Form strukturierter menschlicher Eingabe, aber das Feedback ist nicht iterativ in der Art, wie HITL es typischerweise impliziert.

**HITL ist nicht einfach die Verwendung annotierter Daten.** Jedes überwachte Lernmodell verwendet von Menschen annotierte Daten. HITL bezieht sich speziell auf Systeme, bei denen das menschliche Feedback ein *aktiver, iterativer* Teil des Lernprozesses ist.

---

## Die Ökonomie menschlichen Feedbacks

Menschliches Feedback ist wertvoll, aber kostspielig. Eine medizinische Bildannotation kann bei Durchführung durch einen Spezialisten zwischen einigen Zehn bis zu Hunderten von Dollar pro Bild kosten, abhängig von der Subspezialität und der Aufgabenkomplexität {cite}`monarch2021human`. Crowdworker-Labels auf Plattformen wie Amazon Mechanical Turk können $0,01–$0,10 pro Element kosten {cite}`hara2018data`, bei deutlich niedrigerer Qualität. Die grundlegende Herausforderung von HITL ML besteht darin, **den Wert jeder Einheit menschlichen Feedbacks zu maximieren**.

Dies führt zu einer zentralen Frage, die sich durch den Großteil dieses Handbuchs zieht:

:::{admonition} Die zentrale Frage von HITL ML
:class: tip

*Wie sollte man bei einem festen Budget an menschlicher Zeit und Aufmerksamkeit entscheiden, was man Menschen fragt, wann man fragt und wie man ihre Antworten in das Modelltraining einbezieht?*

:::

Die Antwort auf diese Frage hängt von der Domäne, der Form des Feedbacks, den Annotationskosten, dem Fehlerrisiko und dem aktuellen Zustand des Modells ab — weshalb HITL ML eine reichhaltige und sich noch entwickelnde Disziplin ist.

---

## Überblick über das Handbuch

Der Rest dieses Handbuchs ist wie folgt strukturiert. **Teil II** behandelt die drei klassischen Säulen von HITL: Annotation, aktives Lernen und interaktives ML. **Teil III** behandelt die neueren Paradigmen des Lernens aus Feedback — RLHF, Imitationslernen und Präferenzlernen —, die für die moderne KI zentral geworden sind. **Teil IV** untersucht HITL durch die Linse spezifischer Anwendungsdomänen. **Teil V** nimmt eine Praktikerperspektive auf Plattformen, Crowdsourcing und Evaluierung ein. **Teil VI** befasst sich mit Ethik und blickt voraus.

```{seealso}
Für einen praxisorientierten Überblick über das Feld, siehe {cite}`monarch2021human`. Für den grundlegenden Artikel zum aktiven Lernen, der den Großteil der formalen Behandlung von HITL ausgelöst hat, siehe {cite}`settles2009active`.
```
