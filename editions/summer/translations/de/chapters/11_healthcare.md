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

# HITL im Gesundheitswesen und in der Wissenschaft

Gesundheitswesen und Wissenschaft repräsentieren zwei der Domänen, in denen HITL ML am folgenreichsten und am meisten diskutiert wird. Die Einsätze sind hoch: Eine verfehlte Krebsdiagnose oder ein fehlerhaftes Arzneimittelziel hat echte menschliche Kosten. Annotation erfordert seltene und teure Expertise. Regulatorische Anforderungen schränken ein, was Modelle tun können und wie sie validiert werden müssen. Und im Gegensatz zu NLP, wo das Annotationsproblem teilweise ein soziales Konstruktionsproblem ist, gibt es hier oft echte Grundwahrheit — ein Tumor ist vorhanden oder nicht —, auch wenn kein individueller Beobachter sie zuverlässig bestimmen kann.

Das dominierende Rahmen in populären Berichten ist „KI vs. Mensch": Wird KI Radiologen ersetzen? Dieses Rahmen ist falsch auf eine Art, die zählt. Die eigentliche Frage ist, welche Form der Mensch-KI-Zusammenarbeit bessere Ergebnisse produziert als jedes allein, und wie man Systeme aufbaut, die diese Zusammenarbeit ermöglichen, anstatt sie zu stören.

---

## Medizinische Bildanalyse

Medizinische Bildgebung — Radiologie (Röntgen, CT, MRT), Pathologie (Gewebeschnitte), Dermatologie, Ophthalmologie — ist die Domäne, in der medizinische KI am schnellsten vorangeschritten ist.

### Anforderungen an Experten-Annotatoren

Medizinische Bildannotation erfordert typischerweise Ärzte mit spezifischer Facharztausbildung. Dies macht Annotation:

- **Langsam:** Spezialisten haben begrenzte Zeit; Annotation konkurriert mit klinischen Pflichten
- **Teuer:** Kosten reichen von Dutzenden bis Hunderten von Dollar pro annotiertem Fall, abhängig von Subspezialität, Modalität und Aufgabenkomplexität
- **Variabel:** Selbst Spezialisten sind uneinig, besonders bei Grenzfällen — eine Tatsache, die oft als Problem behandelt wird, aber tatsächlich informativ ist

### Inter-Radiologen-Variabilität

Leservariabilität ist in der Radiologie gut dokumentiert. Bei der Röntgenthorax-Interpretation ist die Leseruneinigkeit substanziell — in der CheXNet-Studie kennzeichneten vier Radiologen dasselbe Pneumonie-Erkennungstestset mit F1-Scores, die etwa 12 Prozentpunkte umspannten {cite}`rajpurkar2017chexnet`, was echte diagnostische Unsicherheit bei Grenzfällen widerspiegelt. Für die Nodulenerkennung auf Lungen-CT kann die Intra-Leservariabilität (selber Leser, selber Fall, anderer Tag) so groß sein wie die Inter-Leservariabilität.

Diese Variabilität ist nicht nur Rauschen — sie spiegelt echte diagnostische Unsicherheit wider. Auf den Annotationen eines einzelnen Radiologen trainierte Modelle können die spezifischen Verzerrungen dieses Arztes erlernen anstatt der zugrunde liegenden Pathologie.

:::{admonition} Die CheXNet-Kontroverse als HITL-Lektion
:class: note

Als Rajpurkar et al. behaupteten, ihr CheXNet-Modell habe bei der Pneumonieerkennung „die Radiologenleistung übertroffen", wurde die Behauptung sofort von der Radiologiegemeinschaft bestritten {cite}`yu2022assessing`. Ein Teil der Kontroverse betraf das spezifische Testset und den Radiologievergleich. Aber ein tieferes Problem war methodologisch: Die verwendete „Radiologenleistung"-Baseline verwendete Einzelleser unter Zeitdruck, während klinische Radiologie typischerweise Konsultation, Vergleich mit früherer Bildgebung und Zugang zu klinischem Kontext umfasst — nichts davon hatte das Modell.

Die Lektion ist nicht, dass das Modell gut oder schlecht war, sondern dass **Leistungsvergleiche die HITL-Konfiguration spezifizieren müssen**. Ein Modell, das einen einzelnen Radiologen bei kaltem Lesen übertrifft, kann immer noch weniger genau sein als ein Radiologe, der die Ausgabe des Modells als zweite Meinung verwendet. Dies sind verschiedene Systeme mit verschiedenen Fehlermodi, und ihre aggregierte Wirkung unterscheidet sich.
:::

:::{admonition} Soft-Labels in der Medizin
:class: important

Mehrere medizinische KI-Projekte sind zu **Soft-Labels** übergegangen, die die Verteilung von Expertenmeinungen widerspiegeln, anstatt eines einzelnen „Goldstandard"-Labels. Ein Röntgenthorax, der von einem Radiologenausschuss als 60 % Pneumonie / 40 % Atelektase gekennzeichnet wird, trägt mehr Information als eine erzwungene binäre Wahl. Auf solchen Verteilungen trainierte Modelle zeigen bessere Kalibrierung und angemessenere Unsicherheitsquantifizierung — und diese Unsicherheit ist klinisch bedeutsam, da sie dem Kliniker sagt, wann er konsultieren soll, nicht nur, was das Modell denkt.
:::

### Aktives Lernen für seltene Erkrankungen

Aktives Lernen ist besonders wertvoll für seltene Erkrankungen und seltene Pathologien, bei denen selbst ein großer unannotierter Pool nur wenige positive Fälle enthält. Standard-Zufalls-Sampling würde Expertenzeit verschwenden, indem meistens negative Fälle annotiert werden.

Unsicherheitsbasiertes aktives Lernen wählt natürlich die Grenzfälle, bei denen das Modell unsicher ist — die bei seltenen Erkrankungen tendenziell die positiven Fälle und Grenz-Negative sind. Dies konzentriert Spezialisten-Zeit dort, wo sie am wertvollsten ist. Die Kombination aus klassenunausgeglichenem Training (mit `class_weight='balanced'` oder ähnlichem) und unsicherheitsbasierter Auswahl ist eine Standardpraxis bei Selten-Pathologie-Erkennungsaufgaben.

---

## Klinische NLP-Annotation

Elektronische Krankenakten (EHRs) enthalten einen enormen Reichtum klinischer Erzähltexte: Arztnotizen, Entlassungszusammenfassungen, Radiologieberichte, Pathologieberichte. Die Extraktion strukturierter Information aus diesem Text erfordert NLP — und hochwertiges NLP erfordert annotierte Trainingsdaten.

**Häufige klinische NLP-Annotationsaufgaben:**
- **Klinisches NER:** Identifizierung von Medikamenten, Dosierungen, Diagnosen, Verfahren und Symptomen in Text
- **Negationserkennung:** „Kein Anzeichen einer Pneumonie" vs. „Pneumonie bestätigt" — eine kritische Unterscheidung, die überraschend schwierig ist
- **Temporales Denken:** Unterscheidung aktueller Erkrankungen von der Vorgeschichte („Vorgeschichte eines MI, vorstellig mit Brustschmerzen")
- **De-Identifizierung:** Entfernung von geschützten Gesundheitsinformationen (PHI) zur Ermöglichung von Datenaustausch

**PHI-De-Identifizierung** ist sowohl eine Annotationsaufgabe als auch eine Datenverwaltungsanforderung. Unter HIPAA (USA) und DSGVO (EU) können Gesundheitsdaten nicht ohne Entfernung oder Anonymisierung von Patientenidentifikatoren geteilt werden. Automatisierte De-Identifizierungstools existieren, sind aber unvollkommen; menschliche Überprüfung automatisierter Ausgaben ist Standardpraxis, und das Risikoprofil ist asymmetrisch: Falsch-Negative (übersehene PHI) schaffen rechtliche Exposition, was konservative Schwellenwerte notwendig macht.

### i2b2 / n2c2 als Vorlage

Die i2b2 (Informatics for Integrating Biology and the Bedside) und die Nachfolge-n2c2 (National NLP Clinical Challenges) Shared-Task-Initiativen haben eine Reihe von experten-annotierten klinischen NLP-Datensätzen veröffentlicht. Diese illustrieren sowohl das Potenzial als auch die Kosten: Annotationsanstrengungen umfassen typischerweise Teams klinischer Fachexperten, die mehrere Monate lang an Hunderten von Dokumenten pro Challenge arbeiten. Die n2c2-Datensätze haben schnellen Fortschritt genau deshalb katalysiert, weil sie das Datenaustausch-Governance-Problem (De-Identifizierung + institutionelle Vereinbarungen) gelöst haben, nicht nur das Annotationsproblem.

---

## Regulatorische Überlegungen

Medizinische KI unterliegt in den meisten Rechtsordnungen regulatorischer Aufsicht.

**FDA (Vereinigte Staaten):** KI/ML-basierte Software als medizinisches Gerät (SaMD) erfordert Vormarktzulassung oder -genehmigung. Der KI/ML-Aktionsplan der FDA von 2021 betont **vorher festgelegte Änderungskontrollpläne** — die Dokumentierung, wie das Modell aktualisiert wird und wie diese Aktualisierungen vor dem Einsatz validiert werden. Ein Modell, das kontinuierlich aus klinischem Feedback lernt, ist unter diesem Rahmen nach jeder Aktualisierung ein anderes Gerät und kann eine Neuvalidierung erfordern.

**CE-Kennzeichnung (Europa):** Medizinische Geräte einschließlich KI-Systeme müssen der Medizinprodukteverordnung (MDR) entsprechen. Die MDR erfordert klinische Bewertung, Post-Market-Surveillance und Dokumentation der für Training und Validierung verwendeten Daten.

**Wichtige HITL-Implikation:** Regulatorische Rahmen erfordern eine klare Dokumentation von Annotationsprozessen, Annotatorenqualifikationen, Interrater-Reliabilität und etwaigen Änderungen der Trainingsdaten. Dies ist kein bürokratischer Overhead — es ist der Prüfpfad, der es einem Kliniker ermöglicht zu verstehen, welche Trainingsdaten das aktuelle Verhalten des Modells produziert haben, und er ist gesetzlich vorgeschrieben. HITL-Pipelines, die Annotation als informellen Unterprozess behandeln, schaffen regulatorisches Risiko, das typischerweise nur im schlimmsten Moment sichtbar wird.

---

## Wissenschaftliche Datenannotation

Über das Gesundheitswesen hinaus spielt HITL ML eine wachsende und unterschätzte Rolle in der wissenschaftlichen Forschung, wo die Annotationsherausforderung oft Domänenexpertise mit Skalierung verbindet.

### Astronomie: Galaxy Zoo

Galaxy Zoo {cite}`lintott2008galaxy` hat die morphologische Klassifikation von Galaxien aus dem Sloan Digital Sky Survey an Bürgerwissenschaftler vergeben. Das ursprüngliche Projekt sammelte über 40 Millionen Klassifikationen von mehr als 100.000 Freiwilligen und demonstrierte, dass Crowdsourcing wissenschaftlicher Bildklassifikation im großen Maßstab machbar ist, wenn die Aufgabe in einfache Fragen zerlegt werden kann, die ohne Spezialausbildung beantwortet werden können („Ist diese Galaxie glatt oder strukturiert?").

Das Galaxy-Zoo-Erlebnis produzierte zwei wichtige methodologische Erkenntnisse. Erstens war die Übereinstimmung zwischen Bürgerwissenschaftlern und professionellen Astronomen bei klaren Fällen hoch und wich systematisch bei Grenzfällen ab — genau den Fällen, bei denen die Unterscheidung wissenschaftlich wichtig ist. Die Lösung bestand nicht darin, Bürgerwissenschaftsdaten bei Grenzfällen zu verwerfen, sondern die Verteilung der Freiwilligenantworten als Soft-Label zu behandeln, das echte morphologische Ambiguität kodiert. Zweitens übertraf der auf Galaxy-Zoo-Labels trainierte Klassifikator Modelle, die trainiert wurden, die Annotationen eines einzelnen Experten zu reproduzieren, weil die Menge-Verteilung echte visuelle Unsicherheit erfasste, die eine erzwungene Wahl eines einzelnen Experten kollabierte.

### Genomik: Pathogenitätsklassifikation

Die Annotation genomischer Varianten — die Entscheidung, ob eine Variante pathogen, gutartig oder von unsicherer Bedeutung ist — ist ein hochriskantes NLP- und Expertenjudgment-Problem. Klinische Variantendatenbanken wie ClinVar aggregieren Experteninterpretationen von mehreren einsendenden Labors, und Uneinigkeiten zwischen Labs sind häufig. Aktives Lernen wird verwendet, um zu priorisieren, welche Varianten eine vollständige Expertenüberprüfung (Literatursuche, Bewertung funktionaler Evidenz) erfordern, gegenüber denen, die durch bestehende Evidenz automatisch klassifiziert werden können. Das Ergebnis ist eine Hybrid-Pipeline, bei der die meisten Varianten durch automatisierte Logik behandelt werden, eine Teilmenge eine Expertenüberprüfung erfordert und die schwierigsten Fälle für den Multi-Lab-Konsensus markiert werden.

### Klima- und Geowissenschaften

Die Kennzeichnung von Satellitenbildern für Landnutzungsänderungen, Entwaldung, Gletscherausdehnung und Sturmbahnen umfasst Fernerkundungsexperten und zunehmend Bürgerwissenschaftsplattformen. Die primäre HITL-Herausforderung in dieser Domäne ist zeitlich: Heute erstellte Labels können veralten, wenn sich die Welt ändert, und die Ground-Truth-Verifikation (Felderhebungen) ist teuer und logistisch eingeschränkt. Aktives Lernen, das Bilder priorisiert, bei denen die Modellvorhersage mit physikalischen Vorannahmen nicht übereinstimmt (z. B. Vorhersage von Entwaldung in einer bekanntermaßen geschützten Region), ist eine praktische Möglichkeit, knappe Feldverifikationsressourcen zu lenken.

### Neurowissenschaften: Konnektomik

Die Rekonstruktion neuronaler Schaltkreise aus Elektronenmikroskopie-Bildern — Konnektomik — erfordert pixelgenaue Annotation von Neuronenmembranen über riesige Bildstapel. Das Eyewire-Projekt hat diese Aufgabe gamifiziert und Zehntausende von Spielern in die Verfolgung von Neuronen durch 3D-Bildvolumina einbezogen. Das Gamification-Design löste ein spezifisches HITL-Problem: Die Aufgabe erfordert anhaltende Aufmerksamkeit und räumliches Denken über lange Sitzungen, was zu Qualitätsverschlechterung bei der traditionellen Annotation führt. Das Aufteilen der Aufgabe in Spielsegmente mit sozialen Mechaniken hielt das Annotator-Engagement und die Qualität in Maßstäben aufrecht, die professionelle Annotation nicht erreichen kann.

---

## Management von Experten-Annotatoren

Wenn Annotation seltene Expertise erfordert, gelten die üblichen Crowdsourcing-Ansätze (Kapitel 13) nicht.

**Die fundamentale Spannung** ist, dass die Menschen, die Annotationen höchster Qualität produzieren können, auch die Menschen sind, deren Zeit am wertvollsten und am stärksten beschränkt ist. Jede Designentscheidung in einer Experten-Annotationspipeline sollte gegen die Frage bewertet werden: Macht dies den besten Einsatz knapper Expertenzeit?

**Was dies in der Praxis bedeutet:**

- **Aggressiv vorannotieren.** Niedrig-qualifizierte Annotatoren, automatisierte Modelle oder regelbasierte Systeme verwenden, um Kandidaten zu generieren, die der Spezialist überprüft und korrigiert, anstatt von Grund auf zu erstellen. Das Urteil des Spezialisten ist der Engpass; ihm eine Vorannotation zur Korrektur zu geben ist schneller als ihn von einem leeren Bildschirm aus zu fragen, vorausgesetzt die Vorannotationsqualität ist ausreichend, dass Korrektur nicht langsamer ist als neu zu beginnen.

- **Auf Expertenaufmerksamkeit, nicht Durchsatz ausrichten.** Für hohen Durchsatz optimierte Annotationsinterfaces (schnelle binäre Entscheidungen, Tastaturkürzel, minimale Anzeige) sind für Crowdsourcing geeignet. Experten-Annotation profitiert oft von reichhaltigeren Interfaces: Seitenvergleich mit früheren Fällen, einfacher Zugang zu Referenzmaterialien, Annotationsvertrauensfelder und die Möglichkeit, einen Fall zur Diskussion zu markieren. Diese verlangsamen einzelne Annotationen, verbessern aber die Qualität und reduzieren den Bedarf an Neuan­notation.

- **Individuelle Annotatorenmuster explizit verfolgen.** Mit einem kleinen Pool von Spezialisten ist es machbar und wichtig, die Übereinstimmungsrate jedes Annotators mit dem Panel zu verfolgen, Fälle zu markieren, die mit ihrer eigenen Geschichte inkonsistent erscheinen, und sie in regelmäßigen Kalibrierungssitzungen zu besprechen. Dies ist keine Überwachung — es ist derselbe Qualitätsprozess, den die klinische Medizin für die Leistungsüberprüfung verwendet, und Spezialisten reagieren im Allgemeinen gut, wenn er als gemeinsame Qualitätsverbesserung und nicht als Bewertung gerahmt wird.

- **Sitzungsdesign ist wichtig.** Medizinische Annotation ist kognitiv anspruchsvoll. Belege aus Radiologie und Pathologie deuten darauf hin, dass Fehlerraten nach etwa 90 Minuten kontinuierlichen Lesens messbar steigen, und dass Pausen von wenigen Minuten die Aufmerksamkeit teilweise wiederherstellen können. Annotationsinterfaces, die Pausenaufforderungen durchsetzen (ohne dass sie abgebrochen werden können), sind eine einfache HITL-Designentscheidung mit echtem Qualitätseinfluss.

---

## Eine HITL-Aktive-Lern-Pipeline für medizinische Bildgebung

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.datasets import make_classification
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

# Simulate a rare-pathology detection task
# 8% positive class (e.g., rare pathology)
X, y = make_classification(
    n_samples=5000, n_features=100,
    n_informative=20, n_redundant=10,
    weights=[0.92, 0.08],
    random_state=42
)
X_train, y_train = X[:4000], y[:4000]
X_test,  y_test  = X[4000:], y[4000:]

print(f"Training set positive prevalence: {y_train.mean():.1%}")

def run_medical_al(strategy, n_initial=50, budget=300):
    labeled = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled = [i for i in range(len(X_train)) if i not in labeled]
    aucs = []

    while len(labeled) < n_initial + budget:
        model = LogisticRegression(max_iter=500, class_weight='balanced')
        model.fit(X_train[labeled], y_train[labeled])

        if len(labeled) % 30 == 0:
            preds = model.predict_proba(X_test)[:, 1]
            aucs.append(roc_auc_score(y_test, preds))

        X_pool = X_train[unlabeled]
        if strategy == 'uncertainty' and len(labeled) >= 10:
            probs = model.predict_proba(X_pool)
            entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
            q = int(np.argmax(entropy))
        else:
            q = rng.integers(0, len(unlabeled))

        labeled.append(unlabeled.pop(q))

    return np.array(aucs)

aucs_al  = run_medical_al('uncertainty')
aucs_rnd = run_medical_al('random')
label_counts = np.arange(len(aucs_al)) * 30 + 50

plt.figure(figsize=(7, 4))
plt.plot(label_counts, aucs_al,  'o-',  color='#2b3a8f', linewidth=2, label='Uncertainty AL')
plt.plot(label_counts, aucs_rnd, 's--', color='#e05c5c', linewidth=2, label='Random baseline')
plt.xlabel("Expert labels obtained", fontsize=12)
plt.ylabel("AUROC", fontsize=12)
plt.title("Active Learning for Rare Pathology Detection", fontsize=13)
plt.legend(); plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('medical_al.png', dpi=150)
plt.show()

# Show how AL preferentially selects positive examples
# by checking which class the queried examples belong to
n_init = 50
labeled_al  = list(rng.choice(len(X_train), n_init, replace=False))
labeled_rnd = labeled_al.copy()
unlabeled_al  = [i for i in range(len(X_train)) if i not in labeled_al]
unlabeled_rnd = unlabeled_al.copy()

model = LogisticRegression(max_iter=500, class_weight='balanced')
model.fit(X_train[labeled_al], y_train[labeled_al])
probs = model.predict_proba(X_train[unlabeled_al])
entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
top50_al  = [unlabeled_al[i] for i in np.argsort(entropy)[-50:]]
top50_rnd = list(rng.choice(unlabeled_rnd, 50, replace=False))

pos_rate_al  = y_train[top50_al].mean()
pos_rate_rnd = y_train[top50_rnd].mean()
print(f"\nPositive rate in next 50 queries:")
print(f"  Uncertainty AL: {pos_rate_al:.1%}  (base rate: {y_train.mean():.1%})")
print(f"  Random:         {pos_rate_rnd:.1%}")
print(f"  AL queries {pos_rate_al/y_train.mean():.1f}x more positives than random")
```

```{seealso}
Galaxy Zoo Crowdsourcing: {cite}`lintott2008galaxy`. CheXNet Radiologieleistung: {cite}`rajpurkar2017chexnet`. Röntgenqualität und KI-gestützte Diagnose: {cite}`yu2022assessing`. Klinische NLP-Annotationsmethodik: {cite}`pustejovsky2012natural`. Für FDA KI/ML-Aktionsplan-Leitlinien, siehe die veröffentlichte FDA-Dokumentation (2021).
```
