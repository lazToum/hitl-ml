# Annotationsplattformen und Werkzeuge

Die Annotationsplattform ist die Umgebung, in der menschliches Feedback zu Daten wird. Eine gute Plattform erhöht den Durchsatz, reduziert Fehler, erhält Qualitätskontrollen aufrecht und macht die Annotationspipeline im großen Maßstab handhabbar. Die richtige Plattform zu wählen — und zu wissen, wann man baut vs. kauft — ist eine folgenreiche Entscheidung in jedem HITL-Projekt.

---

## Die Annotationsplattform-Landschaft

Der Markt für Annotationswerkzeuge ist in den letzten Jahren erheblich gewachsen und gereift, angetrieben durch die Unternehmensnachfrage nach ML-Trainingsdaten. Werkzeuge reichen von vollständig verwalteten Diensten bis zu Open-Source-Self-Hosted-Rahmenwerken.

### Open-Source-Plattformen

**Label Studio** ist die beliebteste Open-Source-Annotationsplattform und unterstützt Text-, Bild-, Audio-, Video- und Zeitreihendaten durch eine einheitliche XML-basierte Aufgabenkonfiguration. Es kann selbst gehostet werden und integriert sich mit ML-Backends für aktives Lernen. Hauptstärken: Flexibilität, Gemeinschaftsunterstützung und die Möglichkeit, benutzerdefinierte ML-Vorhersagen für Vorannotation einzubetten.

**Prodigy** (von den Machern von spaCy) ist ein hochgradig workflow-orientiertes Annotationswerkzeug für NLP-Aufgaben. Seine Streaming-Architektur sendet Beispiele einzeln und unterstützt aktives Lernen von Haus aus. Das Annotationsinterface ist minimal, aber schnell — konzipiert um den Annotationsdurchsatz zu maximieren. Prodigy ist bezahlte Software, aber in der NLP-Forschung weit verbreitet.

**CVAT (Computer Vision Annotation Tool)** ist das führende Open-Source-Werkzeug für CV-Annotation mit starker Unterstützung für Erkennung, Segmentierung und Videoannotation. Ursprünglich bei Intel entwickelt, unterstützt CVAT Tracking-Algorithmen, Skelett-Annotation und Drittanbieter-Algorithmus-Integrationen.

**Doccano** zielt auf Sequenzkennzeichnungsaufgaben (NER, Relationsextraktion, Textklassifikation) ab. Sein einfaches Web-Interface macht es für Teams ohne dedizierte Datentechnik-Ressourcen zugänglich.

### Kommerzielle Plattformen

**Scale AI** bietet End-to-End-verwaltete Annotationsdienste: menschliche Belegschaft, Qualitätsmanagement und API-Integration. Besonders stark bei autonomem Fahren, Robotik und komplexer 3D-Annotation. Die Preisgestaltung basiert auf Aufgabenkomplexität und Volumen.

**Labelbox** ist eine vollständige Plattform für Datenkuration, Annotation und ML-gestützte Kennzeichnung. Starke Enterprise-Funktionen: Projektmanagement, Qualitäts-Workflows, Modell-Feedback-Schleifen und Integrationen mit großen ML-Plattformen (SageMaker, Vertex AI, Azure ML).

**Appen** (ehemals Figure Eight / CrowdFlower) betreibt eine große globale Annotationsbelegschaft neben Werkzeugen. Eine gute Wahl, wenn Volumen und Belegschaftsmanagement primäre Anliegen sind.

**Surge AI** konzentriert sich auf Experten-Annotatoren und ist stark für Aufgaben, die Domänenwissen oder nuanciertes Urteil erfordern.

**Humanloop** ist spezialisiert auf LLM-Feedback-Sammlung — Präferenz-Annotation, RLHF-Datensammlung und Modellevaluierung.

---

## Vergleich der Annotationsplattform-Funktionen

| Funktion | Label Studio | Prodigy | CVAT | Labelbox | Scale AI |
|---|---|---|---|---|---|
| Lizenz | Open Source | Kommerziell | Open Source | Kommerziell | Kommerziell |
| Hosting | Selbst / Cloud | Selbst | Selbst / Cloud | Cloud | Verwaltet |
| Textannotation | ✓ | ✓ | — | ✓ | ✓ |
| Bildannotation | ✓ | Begrenzt | ✓ | ✓ | ✓ |
| Videoannotation | ✓ | — | ✓ | ✓ | ✓ |
| Integration aktives Lernen | ✓ | ✓ | Begrenzt | ✓ | ✓ |
| ML-gestützte Vorannotation | ✓ | ✓ | ✓ | ✓ | ✓ |
| Qualitätskontroll-Workflows | Grundlegend | Grundlegend | Grundlegend | Erweitert | Erweitert |
| API / Programmatischer Zugang | ✓ | ✓ | ✓ | ✓ | ✓ |
| Belegschaftsmanagement | — | — | — | Begrenzt | ✓ |

---

## Annotation als Code

Ein kritischer, aber oft übersehener Aspekt der Annotationsinfrastruktur ist **Versionskontrolle für Annotationen und Annotationsschemata**. Annotation als Code zu behandeln bedeutet:

**Schema-first-Design.** Die Label-Taxonomie und Annotationsregeln werden in einer versionierten Konfigurationsdatei (YAML oder JSON) definiert, bevor die Annotation beginnt. Änderungen am Schema erzeugen eine neue Version.

**Annotationsversionierung.** Annotationen werden mit einem Link zur Schema-Version gespeichert, unter der sie erstellt wurden. Dies ermöglicht Prüfung, Rollback und Vergleich von Annotationen über Schema-Versionen hinweg.

**Reproduzierbare Pipelines.** Die Annotationspipeline — von Rohdaten zu trainingsfertigen Labels — sollte aus Code reproduzierbar sein. Vorannotationsmodelle, Qualitätsfilter, Aggregationslogik und Datenteilungen sollten alle aufgezeichnet werden.

```yaml
# Example: Label Studio annotation schema (text classification)
label_config: |
  <View>
    <Text name="text" value="$text"/>
    <Choices name="sentiment" toName="text" choice="single">
      <Choice value="positive"/>
      <Choice value="negative"/>
      <Choice value="neutral"/>
      <Choice value="mixed"/>
    </Choices>
  </View>
schema_version: "2.1.0"
task_type: text_classification
guidelines_version: "guidelines_v3.pdf"
```text
Datenquelle
    |
    v
Unannotierter Pool -->  Annotationsplattform --> Annotierter Datensatz
    ^                    |                              |
    |                    | (ML-gestützt)                v
Aktives Lernen <---------+                         Trainings­lauf
Anfrage­strategie                                       |
    ^                                                   v
    +------------ Trainiertes Modell <---------- Evaluierung
                                                       |
                                               Einsatz &
                                               Überwachung
```

Wichtige Integrationspunkte:
1. **Datenerfassung:** Unannotierte Daten fließen automatisch aus dem Data Warehouse in die Annotationsplattform
2. **Modell-Serving:** Das aktuelle beste Modell wird in der Annotationsplattform für Vorannotation und aktives Lern-Scoring bereitgestellt
3. **Export:** Abgeschlossene Annotationen werden in einem Format exportiert, das mit dem Trainings-Rahmenwerk kompatibel ist (COCO JSON, Hugging Face Datasets usw.)
4. **Feedback-Schleife:** Produktionsmodellfehler werden zur Korrektur an die Annotationsplattform zurückgeleitet

```{seealso}
Zur Label Studio-Dokumentation und aktiven Lern-Integration: https://labelstud.io. Zu Prodigy: https://prodi.gy. CVAT: https://cvat.ai. Für einen umfassenden Vergleich von Annotationswerkzeugen, siehe {cite}`monarch2021human`, Kapitel 7.
```
