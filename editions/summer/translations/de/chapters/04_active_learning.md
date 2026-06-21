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

# Aktives Lernen

Annotierte Daten sind teuer. Die zentrale Erkenntnis des aktiven Lernens ist, dass *nicht alle unanno­tierten Beispiele gleich informativ sind* — ein Modell kann sich schneller verbessern, wenn es wählen darf, welche Beispiele es abfragt. Anstatt Daten zufällig zu annotieren, fragt ein aktives Lernsystem ein Orakel (in der Regel einen menschlichen Annotator) bei den Beispielen an, die das Modell am wahrscheinlichsten verbessern werden.

Dieses Kapitel behandelt die Theorie und Praxis des aktiven Lernens: Anfrage­strategien, Stichprobenrahmen, Abbruchkriterien und praktische Überlegungen für reale Einsätze.

---

## Das aktive Lernsetup

Das Standard-**Pool-basierte aktive Lernsetup** umfasst:

- Eine **annotierte Menge** $\mathcal{L} = \{(x_i, y_i)\}_{i=1}^n$ — anfangs klein
- Einen **unannotierten Pool** $\mathcal{U} = \{x_j\}_{j=1}^m$ — typischerweise viel größer als $\mathcal{L}$
- Ein **Orakel** $\mathcal{O}$, das $y = \mathcal{O}(x)$ für beliebige abgefragte $x$ zurückgeben kann
- Eine **Anfragestrategie** $\phi$, die die nächste Anfrage $x^* = \phi(\mathcal{L}, \mathcal{U}, f_\theta)$ auswählt

Die aktive Lernschleife:

```text
    1. Initialisierung: L = kleine annotierte Startmenge, U = unannotierter Pool
    2. Training: f_θ ← train(L)
    3. Anfrage: x* = argmax φ(x; f_θ) über x ∈ U
    4. Kennzeichnung: y* = O(x*)
    5. Aktualisierung: L ← L ∪ {(x*, y*)}, U ← U \ {x*}
    → Wiederholen ab 2 bis Budget erschöpft
```

Das Ziel ist, eine Zielmodellqualität mit so wenigen Orakel-Anfragen wie möglich zu erreichen.

---

## Theoretische Grundlagen

Eine natürliche Frage ist: Wie viel kann aktives Lernen helfen? Im besten Fall kann aktives Lernen *exponentielle* Reduktionen in der Labelkomplexität erzielen — Fehler $\epsilon$ mit $O(\log(1/\epsilon))$ Labels statt der $O(1/\epsilon)$ passiven Lernens, zumindest in realisierbaren Szenarien mit einer guten Anfragestrategie {cite}`settles2009active`.

In der Praxis sind Garantien schwerer zu erhalten. **Agnostisches aktives Lernen** {cite}`balcan2006agnostic` zeigt, dass Label-Einsparungen möglich sind, selbst wenn das Zielkonzept nicht in der Hypothesenklasse liegt, aber die Einsparungen hängen stark vom Uneinigkeitskoeffizienten ab — einem Maß dafür, wie schnell sich die Menge plausibler Hypothesen verkleinert, wenn Daten gesammelt werden.

Die wesentliche praktische Implikation: Der Vorteil aktiven Lernens ist am größten, wenn die **Entscheidungsgrenze einfach und konzentriert** ist (sodass Unsicherheitsanfragen schnell falsche Hypothesen eliminieren), und am kleinsten, wenn die Hypothesenklasse groß oder die Grenze komplex ist.

---

## Anfrage­strategien

### Unsicherheits­stichproben

Die einfachste und am häufigsten verwendete Strategie: das Beispiel abfragen, bei dem das Modell am *unsichersten* ist {cite}`lewis1994sequential`.

**Geringste Konfidenz** fragt das Beispiel ab, bei dem das Modell am wenigsten in seiner besten Vorhersage sicher ist:

$$
x^* = \argmax_{x \in \mathcal{U}} \left(1 - P_\theta(\hat{y} \mid x)\right)
$$

**Randstichproben** betrachten die Lücke zwischen den beiden besten vorhergesagten Wahrscheinlichkeiten:

$$
x^* = \argmin_{x \in \mathcal{U}} \left(P_\theta(\hat{y}_1 \mid x) - P_\theta(\hat{y}_2 \mid x)\right)
$$

**Entropiestichproben** verwenden die vollständige vorhergesagte Verteilung:

$$
x^* = \argmax_{x \in \mathcal{U}} \left( -\sum_{k=1}^K P_\theta(y_k \mid x) \log P_\theta(y_k \mid x) \right)
$$

Entropiestichproben sind die fundierteste der drei — sie berücksichtigen alle Klassen — und übertreffen die anderen in der Regel bei Mehrklassen-Problemen.

### Query by Committee (QbC)

Trainieren eines **Komitees** von $C$ Modellen (mittels Bagging, unterschiedlicher Initialisierungen oder unterschiedlicher Architekturen). Das Beispiel abfragen, bei dem das Komitee am meisten uneinig ist:

$$
x^* = \argmax_{x \in \mathcal{U}} \; \text{Uneinigkeit}(\{f_c(x)\}_{c=1}^C)
$$

Uneinigkeit kann als **Abstimmungs-Entropie** (Entropie über die Mehrheitsabstimmungen des Komitees) oder **KL-Divergenz** vom Konsensus gemessen werden.

QbC liefert bessere Unsicherheitsschätzungen als ein einzelnes Modell, erfordert aber das Training mehrerer Modelle, was rechenintensiv ist.

### Erwartete Modelländerung

Das Beispiel abfragen, das die größte Änderung am aktuellen Modell bewirken würde, wenn es annotiert würde. Für gradientenbasierte Modelle entspricht dies dem Beispiel mit der größten erwarteten Gradientengröße {cite}`settles2008analysis`:

$$
x^* = \argmax_{x \in \mathcal{U}} \sum_{y \in \mathcal{Y}} P_\theta(y \mid x) \left\| \nabla_\theta \mathcal{L}(f_\theta(x), y) \right\|
$$

Diese Strategie hat eine starke theoretische Motivation, erfordert aber die Berechnung von Gradienten für jeden Kandidaten, was sie für große Modelle teuer macht.

### Core-Set / Geometrische Ansätze

Unsicherheitsbasierte Strategien können **gegenüber Ausreißern voreingenommen** sein: Ein ungewöhnliches Beispiel kann sehr unsicher, aber nicht repräsentativ für die Datenverteilung sein. Core-Set-Methoden begegnen diesem Problem, indem sie eine vielfältige Stichprobe suchen, die den Merkmalsraum abdeckt.

Der **k-Center-Gierig-Algorithmus** {cite}`sener2018active` findet die kleinste Menge von Punkten, sodass jeder unannotierte Punkt innerhalb von $\delta$ mindestens eines abgefragten Punktes liegt:

$$
x^* = \argmax_{x \in \mathcal{U}} \min_{x' \in \mathcal{L}} d(x, x')
$$

d. h. den Punkt abfragen, der am weitesten von einem aktuell annotierten Punkt entfernt ist. Dies fördert eine gut verteilte Menge von Annotationen.

### BADGE

**Batch Active learning by Diverse Gradient Embeddings** {cite}`ash2020deep` kombiniert Unsicherheit und Vielfalt: Es wählt eine Charge von Beispielen aus, deren Gradienten-Einbettungen (bezüglich des vorhergesagten Labels) sowohl groß in der Größenordnung (unsicher) als auch vielfältig sind (verschiedene Regionen des Gradientenraums abdeckend). Dies ist eine der wettbewerbsfähigsten modernen Strategien.

---

## Unsicherheitsschätzung für tiefe Modelle

Die oben genannten Strategien setzen Zugang zu kalibrierten Wahrscheinlichkeitsausgaben des Modells voraus. Für einfache Modelle (logistische Regression, Softmax-Klassifikatoren) ist dies unkompliziert. Für tiefe Netze sind zusätzliche Techniken erforderlich, um zuverlässige Unsicherheitsschätzungen zu erhalten.

### Zwei Arten von Unsicherheit

Nach Kendall und Gal {cite}`kendall2017uncertainties` unterscheiden wir:

**Aleatorische Unsicherheit** (Datenunsicherheit): Inhärentes Rauschen in den Beobachtungen, das durch das Sammeln weiterer Daten nicht reduziert werden kann. Ein unscharfes Bild ist aleatorisch unsicher — keine Menge zusätzlicher Trainingsdaten aus derselben Verteilung wird das Modell darin sicherer machen.

**Epistemische Unsicherheit** (Modellunsicherheit): Unsicherheit aufgrund begrenzter Trainingsdaten oder eines Modells, das ähnliche Beispiele nicht gesehen hat. Epistemische Unsicherheit *kann* durch die Annotation weiterer Daten reduziert werden — und ist daher die relevante Größe für die Auswahl der aktiven Lernanfragen.

Für aktives Lernen wollen wir Beispiele mit hoher epistemischer Unsicherheit abfragen, nicht mit hoher aleatorischer Unsicherheit. Das Abfragen eines grundlegend ambiguem Beispiels verschwendet den Aufwand des Orakels: Kein Label, das es bereitstellt, wird eindeutig korrekt sein.

### Monte-Carlo-Dropout

Ein praktischer Ansatz zur epistemischen Unsicherheitsschätzung für neuronale Netze ist **MC-Dropout** {cite}`gal2016dropout`: Dropout zur Inferenzzeit anwenden und $T$ Forward-Passes ausführen. Die Varianz über die Vorhersagen ist eine Schätzung der epistemischen Unsicherheit.

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn

torch.manual_seed(42)
rng = np.random.default_rng(42)

class MCDropoutNet(nn.Module):
    def __init__(self, input_dim=20, hidden=64, output_dim=2, p_drop=0.3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden), nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, hidden),    nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, output_dim)
        )

    def forward(self, x):
        return self.net(x)

def mc_uncertainty(model, x, T=30):
    """
    Run T stochastic forward passes with dropout active.
    Returns mean prediction and epistemic uncertainty (predictive variance).
    """
    model.train()  # keep dropout active during inference
    with torch.no_grad():
        preds = torch.stack([
            torch.softmax(model(x), dim=-1) for _ in range(T)
        ])  # shape: (T, N, C)
    mean_pred = preds.mean(0)
    # Epistemic uncertainty: mean of variances across passes
    epistemic = preds.var(0).sum(-1)
    # Aleatoric uncertainty: entropy of mean prediction
    aleatoric = -(mean_pred * (mean_pred + 1e-9).log()).sum(-1)
    return mean_pred, epistemic, aleatoric

# Quick demonstration
model = MCDropoutNet(input_dim=20, output_dim=2)
# In-distribution example (simulated)
x_familiar   = torch.randn(1, 20) * 0.5
# Out-of-distribution example (far from training distribution)
x_unfamiliar = torch.randn(1, 20) * 3.0

for name, x in [("In-distribution ", x_familiar), ("Out-of-distribution", x_unfamiliar)]:
    _, ep, al = mc_uncertainty(model, x)
    print(f"{name} | epistemic: {ep.item():.4f} | aleatoric: {al.item():.4f}")
```

Im untrainierten Netzwerk oben zeigen beide Beispiele ähnliche Unsicherheit. Nach dem Training wird das Out-of-Distribution-Beispiel höhere epistemische Unsicherheit zeigen — das Modell hat keine zuverlässige Abbildung für Eingaben weit entfernt von der Trainingsverteilung gelernt.

### Tiefe Ensemble-Modelle

Das Training von $M$ unabhängig initialisierten Modellen und die Mittelung ihrer Vorhersagen liefert eine einfachere und oft zuverlässigere Unsicherheitsschätzung als MC-Dropout {cite}`lakshminarayanan2017simple`. Die Uneinigkeit zwischen Ensemble-Mitgliedern ist das epistemische Unsicherheitssignal.

Für aktives Lernen im großen Maßstab fügen sowohl MC-Dropout als auch tiefe Ensembles einen Overhead proportional zu $T$ bzw. $M$ Forward-Passes hinzu. In der Praxis sind $T = 10$–$30$ für MC-Dropout oder $M = 5$ Ensemble-Mitglieder oft ausreichend, um Beispiele nach epistemischer Unsicherheit zu ordnen, auch wenn die absoluten Werte nicht gut kalibriert sind.

---

## Eine vollständige aktive Lernschleife

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from copy import deepcopy

rng = np.random.default_rng(42)

# Generate dataset
X, y = make_classification(
    n_samples=2000, n_features=20, n_informative=10,
    n_classes=3, n_clusters_per_class=1, random_state=42
)
X_train, y_train = X[:1500], y[:1500]
X_test,  y_test  = X[1500:], y[1500:]

def entropy_query(model, X_pool):
    """Return index of most uncertain sample (entropy)."""
    probs = model.predict_proba(X_pool)
    ent = -np.sum(probs * np.log(probs + 1e-9), axis=1)
    return np.argmax(ent)

def random_query(X_pool):
    """Random baseline."""
    return rng.integers(0, len(X_pool))

def run_active_learning(strategy='entropy', n_initial=30, n_queries=120, query_batch=5):
    labeled_idx = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled_idx = [i for i in range(len(X_train)) if i not in labeled_idx]
    accs = []

    for step in range(n_queries // query_batch):
        model = LogisticRegression(max_iter=500, C=1.0)
        model.fit(X_train[labeled_idx], y_train[labeled_idx])
        accs.append(accuracy_score(y_test, model.predict(X_test)))

        # Query
        X_pool = X_train[unlabeled_idx]
        for _ in range(query_batch):
            if strategy == 'entropy':
                q = entropy_query(model, X_pool)
            else:
                q = random_query(X_pool)
            labeled_idx.append(unlabeled_idx.pop(q))
            X_pool = X_train[unlabeled_idx]

    return np.array(accs)

labels_used = np.arange(1, 25) * 5 + 30  # label counts at each step

accs_active = run_active_learning(strategy='entropy')
accs_random = run_active_learning(strategy='random')

plt.figure(figsize=(8, 5))
plt.plot(labels_used, accs_active, 'o-', label='Entropy sampling', color='#2b3a8f', linewidth=2)
plt.plot(labels_used, accs_random, 's--', label='Random baseline',  color='#e05c5c', linewidth=2)
plt.xlabel("Number of labeled examples", fontsize=12)
plt.ylabel("Test accuracy", fontsize=12)
plt.title("Active Learning vs. Random Sampling", fontsize=13)
plt.legend(fontsize=11)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('active_learning_curve.png', dpi=150)
plt.show()

print(f"Active learning reaches {accs_active[-1]:.3f} accuracy")
print(f"Random sampling reaches {accs_random[-1]:.3f} accuracy")
print(f"Active learning saves ~{int((accs_random.tolist().index(min(accs_random, key=lambda a: abs(a-accs_active[-1]))) - len(accs_active) + 1) * 5)} labels to match random's final accuracy")
```

---

## Das Kaltstart-Problem

Aktives Lernen erfordert ein trainiertes Modell, um unannotierte Punkte zu bewerten — aber am Anfang gibt es keine (oder sehr wenige) annotierten Beispiele. Dies ist das **Kaltstart-Problem**.

Praktische Lösungen:

1. **Zufällige Initialisierung:** Eine kleine zufällige Startmenge annotieren (20–100 Beispiele), bevor aktives Lernen beginnt.
2. **Clustering-basierte Initialisierung:** K-Means auf dem unannotierten Pool anwenden; ein Beispiel aus jedem Cluster annotieren. Dies gewährleistet Vielfalt in der anfänglichen annotierten Menge.
3. **Embedding-basierte Auswahl:** Einen vortrainierten Encoder verwenden, um Beispiele einzubetten; eine vielfältige Teilmenge über Core-Set auswählen.

Für die meisten Aufgaben sind einige Dutzend zufällige Start-Labels typischerweise ausreichend, um aktives Lernen zu starten; die genaue Anzahl hängt von Klassenbalance, Merkmalsdimensionalität und Modellkomplexität ab.

---

## Stapelmodus-Aktives-Lernen

In der Praxis arbeiten Annotatoren in Stapeln — es ist ineffizient, nach jedem einzelnen Label ein neues Modell zu trainieren und einzusetzen. **Stapelmodus-Aktives-Lernen** wählt eine Menge von $b$ Beispielen aus, die gleichzeitig annotiert werden sollen.

Die naive Auswahl der Top-$b$ unsichersten Beispiele führt zu **Redundanz**: Hochunsichere Beispiele tendieren dazu, sich zu gruppieren (z. B. Beispiele nahe der Entscheidungsgrenze im selben Bereich). Bessere Stapelstrategien optimieren sowohl für Unsicherheit *als auch* für Vielfalt innerhalb des Stapels.

**Deterministische Punktprozesse (DPPs)** bieten eine prinzipielle Möglichkeit, vielfältige Stapel abzutasten: Sie definieren eine Verteilung über Teilmengen, die ähnliche Elemente bestraft. Die Wahrscheinlichkeit einer Teilmenge $S$ unter einem DPP ist proportional zu $\det(L_S)$, wobei $L$ eine Kernmatrix ist, die Ähnlichkeit kodiert.

---

## Abbruchkriterien

Wann sollte aktives Lernen aufhören? Häufige Kriterien:

- **Budget erschöpft:** Am einfachsten — aufhören, wenn das Annotationsbudget aufgebraucht ist.
- **Leistungsplateau:** Aufhören, wenn die Modellgenauigkeit auf einem gehaltenen Validierungssatz sich in $k$ aufeinanderfolgenden Runden um nicht mehr als $\delta$ verbessert hat.
- **Konfidenz-Schwellenwert:** Aufhören, wenn weniger als ein bestimmter Anteil unannotierter Beispiele eine Unsicherheit über einem Schwellenwert aufweist.
- **Maximale Verlust-Reduktion:** Den maximal möglichen Gewinn aus zusätzlichen Labels schätzen; aufhören, wenn dieser unter einen Schwellenwert fällt {cite}`bloodgood2009method`.

---

## Wann aktives Lernen funktioniert (und wann nicht)

Aktives Lernen funktioniert tendenziell gut, wenn:
- Annotation teuer ist und der unannotierte Pool groß ist
- Die Daten eine klare Struktur haben, die das Modell nutzen kann, um informative Beispiele zu identifizieren
- Die Modellklasse für die Aufgabe geeignet ist

Aktives Lernen funktioniert schlecht, wenn:
- Das anfängliche Modell sehr schwach ist (Kaltstart) und Beispiele nicht sinnvoll ordnen kann
- Die Anfragestrategie Ausreißer oder falsch annotierte Beispiele auswählt (Rauschrobustheit ist wichtig)
- Die Datenverteilung zwischen dem unannotierten Pool und der Testverteilung abweicht

Ein wichtiges praktisches Problem ist **Verteilungsabweichung**: Aktives Lernen tendiert dazu, Beispiele nahe der Entscheidungsgrenze abzufragen, was eine voreingenommene annotierte Menge erzeugt, die die Testverteilung möglicherweise nicht gut repräsentiert. Dies kann zu gut trainierten Entscheidungsgrenzen, aber schlechter Kalibrierung führen.

```{seealso}
Die grundlegende Übersicht ist {cite}`settles2009active`. Theoretische Grundlagen (Labelkomplexität, agnostische Grenzen): {cite}`balcan2006agnostic`. Für Deep-Learning-spezifisches aktives Lernen, siehe {cite}`ash2020deep` (BADGE) und {cite}`sener2018active` (Core-Set). Für eine kritische Bewertung, wann aktives Lernen tatsächlich hilft, siehe {cite}`lowell2019practical`. Zu aleatorischer vs. epistemischer Unsicherheit für tiefe Modelle, siehe {cite}`kendall2017uncertainties`; für tiefe Ensembles als Unsicherheitsschätzer, siehe {cite}`lakshminarayanan2017simple`; für MC-Dropout als approximative bayesianische Inferenz, siehe {cite}`gal2016dropout`.
```
