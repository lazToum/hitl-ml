# Eine Taxonomie der Mensch-Maschine-Interaktion

Ein präzises Vokabular ist die Voraussetzung für klares Denken. Der Begriff „Human-in-the-Loop" wird in der Praxis locker verwendet — manchmal bedeutet er, dass ein Mensch Trainingsdaten kennzeichnet, manchmal dass ein Mensch die Entscheidung eines Modells außer Kraft setzen kann, und manchmal dass ein Mensch den Lernprozess in Echtzeit aktiv steuert. Dies sind bedeutsam unterschiedliche Dinge.

Dieses Kapitel kartiert die Landschaft der Mensch-Maschine-Interaktion im maschinellen Lernen und bietet das konzeptuelle Vokabular, das im Rest des Handbuchs verwendet wird.

---

## Automatisierungsebenen

Die grundlegendste Unterscheidung ist, wie aktiv der Mensch an der Entscheidungsfindung des Systems beteiligt ist. Ein bekanntes Rahmenwerk aus der Automatisierungstheorie {cite}`sheridan1992telerobotics` unterscheidet zehn Ebenen, aber für ML-Zwecke erfassen drei Kategorien die wichtige Variation:

### Human-in-the-Loop (HITL)

Der Mensch ist ein *aktiver Teilnehmer am Lernprozess*. Entscheidungen — oder zumindest folgenreiche Entscheidungen — erfordern menschliche Eingaben, bevor sie abgeschlossen werden. Das System kann ohne fortlaufende menschliche Beteiligung nicht funktionieren.

*Beispiele:* Ein aktives Lernsystem, das einen Kliniker befragt, bevor ein Fall zu den Trainingsdaten hinzugefügt wird. Ein Datenannotator, der Beispiele kennzeichnet, die sofort für Modellaktualisierungen verwendet werden. Ein RLHF-Annotator, der Modellausgaben vergleicht.

### Human-on-the-Loop (HOTL)

Das System arbeitet autonom, aber ein Mensch überwacht es und kann eingreifen. Der Mensch ist ein *Aufseher*, kein Teilnehmer. Feedback kann in das Training zurückfließen oder auch nicht.

*Beispiele:* Ein Inhaltsmoderierungssystem, das Beiträge automatisch kennzeichnet; ein menschlicher Prüfer stichprobenartig überprüft und korrigiert einen Bruchteil der Entscheidungen. Ein Autopilot, der das Flugzeug fliegt, aber den Piloten bei Anomalien alarmiert.

### Human-in-Command (HIC)

Der Mensch trifft alle Entscheidungen; das System liefert *Empfehlungen oder Informationen*, hat aber keine Autonomie. Dies ist die schwächste Form des ML-Einsatzes.

*Beispiele:* Ein diagnostisches Unterstützungssystem, das dem Arzt die Wahrscheinlichkeitsschätzung des Modells zeigt, aber die endgültige Entscheidung vollständig beim Arzt belässt.

```{admonition} Welche Ebene ist richtig?
:class: tip

Die angemessene Automatisierungsebene hängt von den Fehlerkosten, der Zuverlässigkeit des Modells, der Expertise verfügbarer Menschen und den Latenzanforderungen der Aufgabe ab. Diese Faktoren ändern sich mit der Reife eines Modells — die meisten Systeme starten mit HITL und migrieren in Richtung HOTL, wenn das Vertrauen wächst.
```

```text
Rohdaten --> Vorverarbeitung --> Merkmale --> Training --> Evaluierung --> Einsatz
    ^              ^                           ^              ^              ^
    |              |                           |              |              |
 Sammlung    Annotation               Aktives          Testen        Überwachung
 Feedback    & Kennzeichnung          Lernen           Feedback      & Korrektur
```

| Stufe         | Menschliche Rolle                                           | Kapitel |
|---------------|-------------------------------------------------------------|---------|
| Sammlung      | Entscheidung über zu sammelnde Daten; Stichprobenstrategie  | 3, 4    |
| Annotation    | Zuweisung von Labels, Strukturen, Metadaten                 | 3, 13   |
| Training      | Aktive Lernanfragen; Online-Feedback                        | 4, 5, 6 |
| Evaluierung   | Menschliche Bewertung von Modellausgaben                    | 14      |
| Einsatz       | Überwachung, Ausnahmebehandlung, Korrekturen                | 12, 14  |

---

## Aktive vs. passive menschliche Beteiligung

Bei *aktiver* HITL wählt das System aus, welche Datenpunkte dem Menschen präsentiert werden — es stellt Fragen strategisch. Bei *passiver* HITL gibt der Mensch Feedback zu beliebig eingehenden Daten (z. B. sequenziell zugewiesene Annotationsstapel).

Aktive Beteiligung ist effizienter, weil Feedback dort gelenkt wird, wo es das Modell am meisten verbessert. Passive Beteiligung ist einfacher zu implementieren und zu verwalten.

Eine verwandte Unterscheidung besteht zwischen **Stapel-** und **Online-Feedback**:

- **Stapel:** Menschen kennzeichnen einen großen Pool von Beispielen; das Modell wird neu trainiert. Wiederholen.
- **Online (Streaming):** Menschliches Feedback kommt kontinuierlich an; das Modell aktualisiert sich inkrementell.

Stapel-Workflows sind in der Industrie die Norm (Annotationsprojekte gefolgt von Trainingsläufen). Online-Workflows sind natürlicher für interaktive Systeme und Bestärkungslern-Szenarien.

---

## Einzelne vs. mehrere Annotatoren

Die meisten formalen Präsentationen von HITL gehen von einem einzigen, konsistenten Annotator aus. In der Praxis umfasst die Annotation viele Personen, und ihre Urteile unterscheiden sich.

**Aggregation** kombiniert mehrere Annotationen zu einem einzigen Label, typischerweise durch Mehrheitsvoting oder ein statistisches Modell (Kapitel 13).

**Uneinigkeit als Signal** — einige Forscher argumentieren, dass Annotatorenuneinigkeit wertvolle Information ist, die nicht auf ein einziges „Gold-Label" reduziert werden sollte. Perspektivistische Ansätze in der NLP beispielsweise bewahren mehrere Annotationen als Soft-Labels, die die echte Ambiguität der Daten widerspiegeln {cite}`uma2021learning`.

---

## Ein einheitliches Rahmenwerk

Wir können jede HITL-Konfiguration mit einem Fünf-Tupel darstellen:

$$
\text{HITL-Konfiguration} = (\text{Ebene}, \text{Modalität}, \text{Stufe}, \text{Häufigkeit}, \text{Annotatoren})
$$

wobei:

- **Ebene** $\in$ {HITL, HOTL, HIC}
- **Modalität** $\in$ {Label, Korrektur, Demonstration, Präferenz, NL, implizit}
- **Stufe** $\in$ {Sammlung, Annotation, Training, Evaluierung, Einsatz}
- **Häufigkeit** $\in$ {Stapel, Online}
- **Annotatoren** $\in \mathbb{N}^+$ (Anzahl der Annotatoren pro Element)

Diese Taxonomie ermöglicht es uns, verschiedene HITL-Systeme auf denselben Achsen zu vergleichen und über die Kompromisse zwischen ihnen nachzudenken. Der Rest des Handbuchs vertieft spezifische Zellen dieses Raums.

```{seealso}
Für eine empirische Studie darüber, wie Annotationsentscheidungen das nachgelagerte Modellverhalten beeinflussen, siehe {cite}`bender2021stochastic`. Für eine Übersicht über interaktive ML-Systeme, siehe {cite}`amershi2014power`.
```
