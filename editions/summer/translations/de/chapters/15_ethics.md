# Fairness, Bias und Ethik

Human-in-the-Loop-Systeme erben sowohl die Fähigkeiten als auch die Einschränkungen der Menschen in ihnen. Annotatoren bringen Wissen, Urteilsvermögen und Kreativität in ihre Arbeit — aber auch Vorurteile, Ermüdung und den sozialen Kontext ihrer Leben. Die Entscheidungen, die wir beim Design von HITL-Systemen treffen — wer annotiert, was gefragt wird, wie Vergütung erfolgt und wie die Arbeit genutzt wird — haben Konsequenzen, die weit über Modellgenauigkeitsmetriken hinausgehen.

Dieses Kapitel behandelt die ethischen Dimensionen von HITL ML.

---

## Quellen von Verzerrungen in HITL-Systemen

### Annotator-Demografie

Annotation ist kein neutraler Akt. Die Labels, die Annotatoren vergeben, spiegeln ihre Perspektiven, Erfahrungen und kulturellen Kontexte wider. Wenn die Annotationsbelegschaft demografisch homogen ist — wie es oft der Fall ist, wobei Crowdwork jung, männlich und westlich tendiert — kodiert der resultierende Datensatz die Perspektiven dieser Gruppe.

**Belege:** Studien von NLP-Annotationsdatensätzen haben gezeigt, dass demografische Merkmale von Annotatoren ihre Label-Entscheidungen bei subjektiven Aufgaben (Toxizität, Stimmung, Anstößigkeit) vorhersagen. Datensätze, die von überwiegend US-amerikanischen Crowdworkern annotiert wurden, kodieren US-kulturelle Normen, die nicht auf andere Regionen verallgemeinern {cite}`geva2019annotator`.

**Konsequenzen:** Auf solchen Daten trainierte Modelle funktionieren gut für Nutzer, die dem Annotatorenpool ähneln, und schlechter — oder auf voreingenommene Weise — für Nutzer, die das nicht tun.

**Milderung:** Bewusste Belegschaftsdiversifizierung; geschichtete Annotation (sicherstellen, dass Annotatoren aus relevanten demografischen Gruppen zu relevanten Aufgaben beitragen); Annotator-Demografie und ihre Auswirkungen auf Label-Verteilungen verfolgen.

### Aufgaben-Framing

Wie eine Frage gestellt wird, beeinflusst die Antworten, die sie hervorruft. Wenn Annotatoren gefragt werden „Ist dieser Text toxisch?" können sie anders antworten als wenn sie gefragt werden „Würde dieser Text jemandem schaden, der zur erwähnten Gruppe gehört?" Das Framing bettet Annahmen darüber ein, was zählt.

**Beispiel:** Die Annotation von „missbräuchlicher Sprache" in sozialen Medien variiert erheblich je nachdem, ob Annotatoren Kontextinformationen über die Identität des Autors gezeigt werden. Eine Aussage, die isoliert bedrohlich erscheint, kann als rückgeeigente Sprache oder Gruppenhumor erkannt werden, wenn Kontext geliefert wird.

### Plattformeffekte

Die Plattform und die Zahlungsstruktur beeinflussen die Annotationsqualität. Arbeiter, die pro Aufgabe statt pro Stunde bezahlt werden, haben einen Anreiz, schnell zu arbeiten; dies erhöht den Durchsatz, vermindert aber die Qualität. Arbeiter, die befürchten, wegen niedriger Genauigkeit von einer Plattform gesperrt zu werden, können vermeiden, „unsicher" zu markieren und stattdessen raten, was echte Ambiguität verdeckt.

### Bestätigungs- und Ankerungsverzerrungen

Annotatoren werden beeinflusst von:
- **Vorannotation:** Modelvorhersagen, die Annotatoren gezeigt werden, werden häufiger akzeptiert als abgelehnt, selbst wenn sie falsch sind
- **Reihenfolgeeffekte:** Dasselbe Element in verschiedenen Kontexten zu kennzeichnen liefert unterschiedliche Antworten
- **Priming:** Vorherige Elemente in einer Aufgabe beeinflussen, wie nachfolgende Elemente annotiert werden

---

## Fairness in HITL-Systemen

### Was ist Fairness?

Fairness im maschinellen Lernen ist ein umstrittenes Konzept mit mehreren formalen Definitionen, die oft wechselseitig unvereinbar sind {cite}`barocas2019fairness`. Für HITL-Zwecke sind die relevantesten Dimensionen:

**Repräsentation:** Sind die Trainingsdaten repräsentativ für die Populationen, die das Modell beeinflussen wird?

**Leistungsparität:** Funktioniert das Modell gleich gut für verschiedene demografische Gruppen?

**Kennzeichnungskonsistenz:** Werden dieselben Verhaltensweisen unabhängig davon, wer sie ausführt, identisch gekennzeichnet? (Forschung hat gezeigt, dass dies nicht immer der Fall ist — identischer Inhalt wird manchmal unterschiedlich gekennzeichnet, wenn er verschiedenen Rassen- oder Geschlechtergruppen zugeordnet wird.)

### Fairness-bewusstes aktives Lernen

Standard-Aktive-Lern-Anfragen konzentrieren sich auf Modellunsicherheit, was dazu neigt, sich auf Mehrheitsklassenbeispiele zu konzentrieren. Dies kann Leistungsungleichheiten für Minderheitsgruppen verschlimmern.

**Fairness-bewusste Anfragen­strategien** ergänzen das Unsicherheitskriterium mit Vielfältigkeits- oder Repräsentationseinschränkungen:

$$
x^* = \argmax_{x \in \mathcal{U}} \left[ \lambda \cdot \text{Unsicherheit}(x) + (1 - \lambda) \cdot \text{Minderheitsgruppen-Bonus}(x) \right]
$$

Das Setzen von $\lambda < 1$ stellt sicher, dass die Anfragestrategie die Minderheitenrepräsentation nicht vollständig ignoriert.

---

## Annotator-Wohlbefinden

### Das Ghost-Work-Problem

Die Annotationsarbeit, die ML antreibt, ist größtenteils unsichtbar. Datenarbeiter — oft im Globalen Süden — kennzeichnen Bilder, transkribieren Sprache und moderieren Inhalte für niedrige Löhne, ohne Sozialleistungen, in Gig-Economy-Vereinbarungen ohne Arbeitsplatzsicherheit. Crawford und Jolers „Anatomy of an AI System" {cite}`crawford2018anatomy` und Gray und Suris „Ghost Work" {cite}`gray2019ghost` dokumentierten das Ausmaß und die Prekarität dieser Arbeit.

**Amazon-MTurk-Statistiken:** Eine systematische Analyse der MTurk-Einnahmen aus 2018 fand einen medianen effektiven Stundenlohn von ca. 2 $/Std. — unter dem Mindestlohn in den meisten US-Bundesstaaten und vielen Hocheinkommensländern {cite}`hara2018data`. Arbeiter außerhalb von Hocheinkommensländern stehen oft vor zusätzlichen Barrieren: Auftraggeber beschränken häufig hochbezahlte Aufgaben auf nur-US-Qualifikationen, und der Pool von Arbeitern, die für die verbleibenden offenen Aufgaben konkurrieren, ist global, was die effektiven Einnahmen weiter komprimiert.

**Inhaltsmoderation:** Eine besonders schädliche Form der Annotationsarbeit — Überprüfung von grafischen, gewalttätigen und verstörenden Inhalten — wurde mit PTSD, Depression und Angstzuständen bei Arbeitern in Verbindung gebracht {cite}`newton2019trauma`. Plattformen wurden wegen unzureichender psychischer Gesundheitsunterstützung und übermäßiger Expositionskontingente kritisiert.

### Ethische Praktiken

**Fairer Lohn:** Annotationsarbeiter mindestens zum lokalen Mindestlohn bezahlen. Forschung hat gezeigt, dass höherer Lohn qualitativ hochwertigere Arbeiter anzieht, ohne die Kosten pro korrektem Label proportional zu erhöhen.

**Sichtbarkeit der Arbeit:** Die Arbeit, die Trainingsdaten erstellt, in Veröffentlichungen und Produktdokumentation anerkennen.

**Psychische Gesundheitsunterstützung:** Für Arbeiter, die schädliche Inhalte überprüfen, psychologische Unterstützung, Rotationspläne und Expositionsgrenzen bereitstellen.

**Arbeiterrepräsentation:** Annotationsarbeitern ermöglichen, Bedenken zu melden, Richtlinienklarstellungen anzufordern und unfaire Qualitätsbewertungen anzufechten.

---

## Datenschutz bei der Annotation

### Geschützte Gesundheitsinformationen (PHI) und PII

Annotationsaufgaben umfassen oft sensible personenbezogene Daten. Ein medizinisches Annotationsprojekt kann Arbeitern Patientenakten zugänglich machen; ein NLP-Projekt kann Arbeitern private Kommunikation zugänglich machen; ein Inhaltsmoderierungsprojekt setzt Arbeiter persönlichen Offenbarungen von Nutzern aus.

Regulatorische Rahmen (HIPAA, DSGVO) schränken ein, wie persönliche Daten mit Annotationsbelegschaften geteilt werden können. Grundprinzipien:

- **Datensparsamkeit:** Nur die Information teilen, die Annotatoren für die Aufgabe benötigen
- **De-Identifizierung:** PHI und PII vor der Annotation entfernen, wo möglich
- **Einwilligung:** Wo echte Nutzerdaten annotiert werden, geeignete Einwilligung oder rechtliche Grundlage sicherstellen
- **Zugangskontrolle:** Einschränken, welche Annotatoren auf sensible Daten zugreifen können, basierend auf Rolle und Sicherheitsfreigabe

### Synthetische Daten als Alternative

Für Aufgaben, bei denen echte Daten Datenschutzrisiken tragen, kann synthetische Datengenerierung annotierungsfertige Datensätze erstellen, ohne sensible Informationen preiszugeben. Für klinisches NLP beispielsweise kann synthetischer EHR-Text realistische Trainingsdaten für De-Identifizierungsmodelle liefern, ohne tatsächliche Patientenakten preiszugeben.

---

## Adversariale Annotation und Datenvergiftung

HITL-Systeme schaffen eine Angriffsfläche: Wenn ein Angreifer den Annotationsprozess beeinflussen kann, kann er das Verhalten des Modells beeinflussen.

**Datenvergiftung via Annotation:** Ein Angreifer mit Zugang zur Annotationsbelegschaft (z. B. ein kompromittiertes Crowdworker-Konto) kann systematisch falsch annotierte Beispiele einschleusen. Dies ist besonders effektiv in aktiven Lernszenarien, bei denen das Modell bevorzugt unsichere Beispiele abfragt — die das Ziel des Angreifers sein könnten.

**Reward-Hacking via Feedback:** Bei RLHF können Annotatoren (oder KI-generierte Annotationen), die bestimmte Arten von Inhalten konsequent hoch bewerten, das Modell zu diesem Inhalt lenken, unabhängig von seiner wahren Qualität.

**Minderung:** Mehrere unabhängige Annotatoren pro Element; Ausreißererkennung bei Annotationsmustern; Überwachung auf abnormale Übereinstimmung oder Uneinigkeit; Aufrechterhaltung von Evaluierungsmengen, die nicht von der Annotationsbelegschaft beeinflusst werden können.

---

## Institutionelle Ethik

### IRB und Ethikprüfung

Forschungsprojekte mit menschlichen Probanden — einschließlich Annotationsarbeiter — erfordern oft Genehmigung des Institutional Review Board (IRB). Annotationsprojekte, die Daten über die Überzeugungen der Arbeiter, Reaktionen auf sensible Inhalte oder demografische Informationen sammeln, sollten unter demselben ethischen Rahmen wie andere Humanforschung überprüft werden.

### Datenverwaltung

Organisationen sollten klare Richtlinien haben für:
- Welche Daten für externe Annotation vs. interne Annotation gesendet werden können
- Wie lange Annotationsdaten gespeichert werden und von wem
- Wer Zugang zu Annotationen und den darauf trainierten Modellen hat
- Wie mit Anfragen zur Löschung annotierter Daten umzugehen ist (DSGVO-Recht auf Löschung)

### Transparenz und Verantwortlichkeit

Von ML-Systemen betroffene Nutzer haben ein berechtigtes Interesse daran zu verstehen, wie diese Systeme aufgebaut wurden. Das Dokumentieren der Annotationsmethodik — wer die Daten annotiert hat, unter welchen Bedingungen, mit welchen Richtlinien — ist eine Form der Verantwortlichkeit, die Nutzern, Regulatoren und dem Feld als Ganzes zugute kommt.

**Datasheets for Datasets** {cite}`gebru2021datasheets` bietet eine strukturierte Vorlage zur Dokumentation der Datensatzherkunft, Annotationsverfahren und bekannter Einschränkungen.

```{seealso}
Algorithmisches Fairness-Rahmenwerk: {cite}`barocas2019fairness`. Ghost Work und Plattformarbeit: Gray & Suri (2019). Datasheets for Datasets: {cite}`gebru2021datasheets`. Wohlbefinden von Inhaltsmoderierungsarbeitern: {cite}`newton2019trauma`. Annotator-Demografie und NLP-Datensätze: {cite}`geva2019annotator`.
```
