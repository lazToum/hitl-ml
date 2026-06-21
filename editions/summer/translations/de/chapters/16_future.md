# Zukünftige Entwicklungen

Das Feld des Human-in-the-Loop maschinellen Lernens verändert sich rapide. Basismodelle, LLMs als Annotatoren und neue Paradigmen der Mensch-KI-Zusammenarbeit formen die Ökonomie und Praxis von HITL auf Weisen um, die noch vor fünf Jahren unvorstellbar waren. Dieses abschließende Kapitel kartiert die Landschaft der aufkommenden Richtungen und offenen Probleme.

---

## Basismodelle und die veränderte Rolle der Annotation

Basismodelle — große Modelle, die auf breiten Daten vortrainiert werden und für nachgelagerte Aufgaben angepasst werden können — verändern die Ökonomie von HITL fundamental.

### Reduzierung der Annotationslast

Eine Aufgabe, die früher Tausende annotierter Beispiele für das Training von Grund auf erforderte, kann nur Dutzende beim Fine-Tuning eines Basismodells benötigen. Few-Shot-Prompting kann die Notwendigkeit des Fine-Tunings für einige Aufgaben ganz eliminieren.

**Implikation:** Der ROI der Annotation ändert sich. Annotationsaufwand wird nun besser gelenkt auf:
- Hochwertige Evaluierungsmengen (um zu messen, ob das angepasste Modell tatsächlich funktioniert)
- Schwierige Fälle und Randfälle, die das Basismodell falsch behandelt
- Aufgabenspezifische Beispiele, die dem Modell etwas lehren, das es nicht aus dem Vortraining ableiten kann

### Neue Formen der Spezifikation

Wenn das Basismodell bereits Sprache, Code und gesunden Menschenverstand versteht, können Nutzer in natürlicher Sprache mit ihm kommunizieren, statt durch annotierte Beispiele. Ein Nutzer, der einen Textklassifikator möchte, muss nicht mehr 500 Beispiele annotieren — er kann eine Beschreibung der Klassifikationsaufgabe schreiben und die Zero-Shot-Leistung evaluieren.

Dies verlagert die HITL-Herausforderung von *Beispielsammlung* zu *Aufgabenspezifikation*: Nutzern helfen, präzise zu artikulieren, was sie wollen, in einer Form, auf die das Modell reagieren kann. Dies ist schwieriger als es klingt — natürlichsprachliche Aufgabenbeschreibungen sind oft auf Weisen ambig, die annotierte Beispiele es nicht sind.

---

## LLMs als Annotatoren

Eine der bedeutendsten Entwicklungen von 2023–2025 ist die Verwendung von **LLMs als Annotations-Orakel**. Anstatt einen Menschen zu fragen „Ist diese Rezension positiv oder negativ?" fragen wir GPT-4 oder Claude. Für gut definierte Klassifikationsaufgaben stimmen LLM-Annotationen oft mit Crowdworker-Genauigkeit überein oder kommen ihr nahe {cite}`gilardi2023chatgpt`, und die Kosten pro Annotation für API-Aufrufe sind typischerweise um Größenordnungen niedriger als menschliche Arbeitslöhne.

### Wo LLM-Annotation gut funktioniert

- Einfache, gut definierte Klassifikationsaufgaben (Stimmung, Thema, Absicht)
- Aufgaben, bei denen menschliche Labels kulturellen Konsens kodieren, den das LLM aufgenommen hat
- Aufgaben, bei denen Annotation über Kontexte hinweg konsistent ist (nicht stark subjektiv)
- Generierung von Erstannotationen zur menschlichen Überprüfung

### Wo LLM-Annotation versagt

- Hochspezialisierte Domänenaufgaben, die seltene Expertise erfordern (medizinisch, rechtlich, wissenschaftlich)
- Aufgaben, die lokales Kulturwissen oder Sprachvariation erfordern
- Sicherheits- und Schadensaufgaben, bei denen das LLM in dieselbe Richtung fehlkalibriert sein kann wie die Daten, auf denen es trainiert wurde
- Neuartige Aufgabentypen, die im Vortraining wenig vertreten sind

### RLAIF und Constitutional AI

Wie in Kapitel 6 besprochen, kann KI-generiertes Feedback verwendet werden, um Belohnungsmodelle zu trainieren und das RL-Fine-Tuning zu leiten. Dies schafft eine Rückkopplungsschleife: LLMs generieren Daten, Modelle werden darauf trainiert, und bessere Modelle generieren bessere Daten. Die Frage, wie man diese Schleife bootstrapt, ohne systematische Fehler des Ausgangsmodells zu kodieren, ist ein zentrales offenes Problem in der Forschung zur skalierbaren Aufsicht.

---

## Schwache Überwachung im großen Maßstab

**Programmatische Kennzeichnung** via Kennzeichnungsfunktionen (Kapitel 9) erlaubt Fachexperten, ihr Wissen als Code statt als annotierte Beispiele auszudrücken. Systeme wie Snorkel {cite}`ratner2017snorkel` und seine Nachfolger haben sich erheblich weiterentwickelt und werden nun bei großen Technologieunternehmen in der Produktion eingesetzt.

**Frontier-Richtungen:**
- **LLM-augmentierte Kennzeichnungsfunktionen:** LLMs verwenden, um Kennzeichnungsfunktionen aus natürlichsprachlichen Beschreibungen zu generieren
- **Slice-basiertes Lernen:** Kritische Teilmengen der Daten (Slices) identifizieren, bei denen Kennzeichnungsfunktionen uneinig sind, und menschliche Annotation dort lenken
- **Unsicherheitsbewusste Aggregation:** Bessere statistische Modelle für das Kombinieren von Kennzeichnungsfunktionen mit unterschiedlichen Genauigkeiten und Korrelationen

---

## Kontinuierliches Lernen mit menschlicher Aufsicht

Die meisten ML-Systeme werden offline trainiert und als statische Modelle eingesetzt. Die reale Welt verändert sich; Modelle, die zum Zeitpunkt des Einsatzes akkurat waren, verschlechtern sich, wenn sich die Datenverteilung verschiebt.

**Kontinuierliches Lernen** — die Fähigkeit, aus neuen Daten zu lernen, während altes Wissen beibehalten wird — ist ein aktives Forschungsgebiet. Menschliche Aufsicht ist kritisch: Automatisiertes kontinuierliches Lernen ohne menschliche Überprüfung kann schnell Verteilungsverschiebungen kodieren, die Fehler statt echter Weltveränderungen sind.

**HITL-kontinuierliches Lernen** umfasst:
- Überwachung auf Verteilungsverschiebung (automatisiert) und Routing verschobener Beispiele zur menschlichen Überprüfung
- Selektives Neutraining: Vom Menschen genehmigte Beispiele aus der neuen Verteilung werden zu Trainingsdaten hinzugefügt
- Menschliche Überprüfung von Modellverhaltensänderungen nach jeder Aktualisierung

---

## Multi-Modales HITL

Da KI-Systeme multimodal werden — Text, Bilder, Audio und Video gleichzeitig verarbeitend und generierend — wird Annotation komplexer. Ein einzelnes Inhaltselement kann Annotation über Modalitäten hinweg erfordern, mit Abhängigkeiten zwischen ihnen.

**Aufkommende Aufgabentypen:**
- Video + Transkript-Annotation (was passiert, wer spricht, was beschreibt der Text visuell?)
- Medizinisches Bild + klinischer Berichtannotation
- Robotische Trajektorie-Annotation (Sensordaten mit Aktionssequenzen verknüpfen)

Multimodale Basismodelle (GPT-4V, Gemini, Claude) verändern auch hier die Annotationslandschaft — Modelle können nun Bilder interpretieren und Kandidatennotationen generieren, die Menschen überprüfen.

---

## Skalierbare Aufsicht

Ein fundamentales offenes Problem in HITL ML ist **skalierbare Aufsicht** {cite}`irving2018ai,bowman2022measuring`: Wenn KI-Systeme in spezifischen Domänen leistungsfähiger werden als Menschen, wie behalten wir dann sinnvolle menschliche Aufsicht?

Für Aufgaben wie Proteinstrukturvorhersage, Rechtsanalyse oder mathematische Beweisverifikation sind selbst Experten-Annotatoren möglicherweise nicht in der Lage zu beurteilen, welche KI-Ausgabe korrekt ist. Aktuelle HITL-Methoden versagen, wenn das menschliche Urteil weniger zuverlässig ist als das zu bewertende Modell.

**Vorgeschlagene Ansätze {cite}`bowman2022measuring`:**

**Debatte:** Zwei KI-Systeme argumentieren für verschiedene Schlussfolgerungen; ein menschlicher Richter bewertet die Argumente statt die Schlussfolgerungen direkt. Die korrekte Schlussfolgerung sollte besser vertretbar sein.

**Amplifikation:** Menschliche Richter konsultieren KI-Assistenten (das Modell selbst), um komplexe Ausgaben zu evaluieren. Dies nutzt KI-Fähigkeiten, um menschliche Aufsicht zu erweitern, anstatt sie zu ersetzen.

**Prozessaufsicht:** Anstatt die endgültige Ausgabe zu evaluieren, bewerten Menschen den *Denkprozess* — fehlerhafte Schritte in einer Gedankenkette markieren, unabhängig davon, ob die endgültige Antwort zufällig korrekt ist.

---

## Die sich entwickelnde Arbeitsteilung

Die langfristige Trajektorie von HITL ML geht in Richtung einer flüssigeren Zusammenarbeit zwischen Menschen und KI, bei der keiner einfach der „Annotierende" und der andere der „Lernende" ist, sondern beide zu einem gemeinsamen kognitiven Prozess beitragen.

**Zu beobachtende Trends:**
- **KI-gestützte Annotation:** KI schlägt vor; Menschen entscheiden. Qualität verbessert sich, wenn KI bessere Optionen vorschlägt.
- **Menschlich gelenkte Exploration:** Menschen setzen Ziele und Einschränkungen; KI erkundet den Lösungsraum.
- **Kollaborative Evaluierung:** Menschen und KI evaluieren gemeinsam komplexe Ausgaben durch Dialog.
- **Präferenzlernen im großen Maßstab:** Implizite Signale (wie Nutzer mit KI-Ausgaben interagieren) speisen kontinuierliches Präferenzlernen, ohne explizite Annotationssitzungen zu erfordern.

Die Frage, wie viel KI-Urteil vs. menschlichem Urteil zu vertrauen ist — und in welchen Domänen, bei welchen Fähigkeitsniveaus, mit welchen Sicherheitsvorkehrungen — ist letztlich eine gesellschaftliche, nicht nur eine technische Frage. HITL ML liefert die technische Infrastruktur, um sie sorgfältig zu beantworten, anstatt standardmäßig.

---

## Offene Forschungsprobleme

Wir schließen mit einer Liste wichtiger offener Probleme, an denen das Feld aktiv arbeitet:

1. **Optimales Stoppen beim aktiven Lernen:** Wann liegt der Grenznutzen der nächsten Annotation unter den Kosten? Prinzipielle Abbruchregeln bleiben schwer fassbar.

2. **Annotationsbudget-Zuteilung über Aufgaben hinweg:** In Multi-Aufgaben-Szenarien, wie sollte ein festes Annotationsbudget über Aufgaben aufgeteilt werden?

3. **Verteilungsverschiebung beim aktiven Lernen:** Aktives Lernen erzeugt voreingenommene annotierte Mengen. Wie können auf diese Weise trainierte Modelle korrekt kalibriert werden?

4. **Belohnungsmodell-Generalisierung:** RLHF-Belohnungsmodelle können möglicherweise nicht auf neuartige Prompt-Antwort-Paare verallgemeinern. Wie können robustere Präferenzmodelle entwickelt werden?

5. **Skalierbare Aufsicht:** Wie behalten wir menschliche Aufsicht aufrecht, wenn KI-Systeme Menschen in spezifischen Domänen übertreffen?

6. **Annotatorenmodellierung:** Bessere statistische Modelle für Annotatorenverhalten, die nicht nur Kompetenz, sondern auch systematische Vorurteile, thematische Expertise und Ermüdung erfassen.

7. **Evaluierung der Ausrichtung:** Uns fehlen Ground-Truth-Tests dafür, ob ein Modell an menschliche Werte ausgerichtet ist. Die Entwicklung solcher Tests — analog zu adversarialen Beispielen für Robustheit — ist ein offenes Problem.

8. **Faire Datenlabor:** Ökonomische und institutionelle Strukturen, die sicherstellen, dass Annotationsarbeiter fair vergütet und geschützt werden, während die Kosteneffektivität großskaliger Annotation erhalten bleibt.

---

```{epigraph}
Das Ziel ist nicht, menschliches Urteil durch maschinelles Urteil zu ersetzen,
sondern Systeme aufzubauen, bei denen die Kombination beider besser ist als jedes allein.
```

Die Werkzeuge und Techniken in diesem Handbuch — Annotation, aktives Lernen, RLHF, Präferenzlernen und all das Übrige — sind Mittel zu diesem Zweck. Wenn das Feld sich entwickelt, werden sich die spezifischen Techniken ändern. Das zugrunde liegende Bestreben — Systeme zu bauen, die sowohl fähig als auch genuinen an die menschliche Absicht ausgerichtet sind — wird bleiben.

```{seealso}
Skalierbare Aufsicht und Debatte: {cite}`bowman2022measuring`. Snorkel schwache Überwachung: {cite}`ratner2017snorkel`. Für die breite Zukunft der Mensch-KI-Zusammenarbeit, siehe {cite}`amershi2019software`.
```
