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

# Lernen aus Vergleichen und Rankings

Menschen um eine absolute Qualitätsbewertung einer Ausgabe zu bitten ist schwierig. Was ist die numerische Qualität dieses Aufsatzes auf einer Skala von 1 bis 10? Die Frage ist schlecht gestellt: Menschen fehlt eine stabile interne Skala, und ihre Bewertungen werden stark durch Ankerung, Kontext und Ermüdung beeinflusst.

Menschen zu bitten, zwei Ausgaben zu *vergleichen*, ist viel einfacher: Welcher Aufsatz ist besser, A oder B? Vergleichsurteile sind konsistenter, zuverlässiger und sprechen menschliche Präferenzen direkter an als absolute Bewertungen. Dieses Kapitel behandelt die mathematischen Grundlagen und praktischen Anwendungen des Lernens aus Vergleichen und Rankings.

---

## Warum Vergleiche besser sind als Bewertungen

### Psychologische Fundierung

Die Überlegenheit vergleichender Urteile hat eine lange Geschichte in der Psychometrie. Thurstons Gesetz des vergleichenden Urteils {cite}`thurstone1927law` (1927) zeigte, dass selbst wenn Menschen inkonsistente absolute Urteile haben, ihre relativen Urteile einem konsistenten probabilistischen Gesetz folgen. Vergleiche nutzen die Tatsache, dass Menschen viel besser in *relativer* Wahrnehmung als in absoluter Kalibrierung sind.

### Statistische Effizienz

Jeder paarweise Vergleich liefert Information über die *relativen* Positionen zweier Elemente auf der Qualitätsskala. Bei $K$ Elementen können $K-1$ Vergleiche alle Elemente ordnen; nur $O(\log K)$ Vergleiche werden benötigt, um das beste Element zu finden. Absolute Bewertungen erfordern typischerweise mehr Urteile, um dieselbe Präzision zu erreichen.

### Skalierbarkeit

Für generative Modelle ist die Anzahl unterschiedlicher Ausgaben effektiv unbegrenzt. Eine Ausgabe absolut zu bewerten erfordert die Festlegung einer gemeinsamen Skala über alle Ausgaben; Ausgaben zu vergleichen erfordert nur lokale, relative Urteile, die natürlich aneinander kalibriert sind.

---

## Das Bradley-Terry-Modell

Das dominante probabilistische Modell für paarweise Vergleiche ist das **Bradley-Terry-Modell (BT)** {cite}`bradley1952rank`. Jedes Element $i$ hat einen latenten Qualitätsscore $\alpha_i \in \mathbb{R}$. Die Wahrscheinlichkeit, dass Element $i$ in einem direkten Vergleich gegenüber Element $j$ bevorzugt wird, ist:

$$
P(i \succ j) = \frac{e^{\alpha_i}}{e^{\alpha_i} + e^{\alpha_j}} = \sigma(\alpha_i - \alpha_j)
$$

wobei $\sigma$ die logistische Sigmoidfunktion ist. Dies entspricht der Annahme, dass die wahrgenommene Qualität von Element $i$ gleich $\alpha_i + \epsilon$ ist, wobei $\epsilon$ ein standardlogistischer Rauschterm ist.

### Identifizierbarkeit

Das BT-Modell ist bis auf eine Translation identifizierbar: Wenn $\alpha$ eine Lösung ist, ist es auch $\alpha + c$ für eine beliebige Konstante $c$. Eine Standardkonvention ist, einen Score festzusetzen (z. B. $\alpha_0 = 0$) oder $\sum_i \alpha_i = 0$ zu verlangen. Die Scores sind nur identifizierbar, wenn der **Vergleichsgraph** (Knoten = Elemente, Kanten = beobachtete Paare) **zusammenhängend** ist — wenn der Graph unverbundene Komponenten hat, sind die relativen Scores über Komponenten hinweg undefiniert.

### Parameterschätzung

Gegeben einen Datensatz paarweiser Vergleiche $\mathcal{D} = \{(i, j, y_{ij})\}$, wobei $y_{ij} = 1$ wenn $i$ gegenüber $j$ bevorzugt wurde, ist die Log-Likelihood:

$$
\mathcal{L}(\alpha) = \sum_{(i, j, y_{ij}) \in \mathcal{D}} \left[ y_{ij} \log \sigma(\alpha_i - \alpha_j) + (1 - y_{ij}) \log \sigma(\alpha_j - \alpha_i) \right]
$$

Dies ist eine konkave Funktion von $\alpha$ und kann durch Gradientenaufstieg oder Newtons Methode maximiert werden.

```{code-cell} python
import numpy as np
from scipy.optimize import minimize
from scipy.special import expit  # sigmoid

rng = np.random.default_rng(42)

# -----------------------------------------------
# Simulate Bradley-Terry: 8 items with true quality scores
# Generate pairwise comparisons and recover the scores
# -----------------------------------------------

N_ITEMS = 8
true_alpha = rng.normal(0, 1, N_ITEMS)
print(f"True quality ranking: {np.argsort(true_alpha)[::-1]}")

# Generate comparisons: every pair compared 5 times
comparisons = []
for i in range(N_ITEMS):
    for j in range(i + 1, N_ITEMS):
        for _ in range(5):
            p_i_wins = expit(true_alpha[i] - true_alpha[j])
            winner = i if rng.random() < p_i_wins else j
            loser  = j if winner == i else i
            comparisons.append((winner, loser))

print(f"Total comparisons: {len(comparisons)}")

def neg_log_likelihood(alpha, comparisons):
    """Bradley-Terry negative log-likelihood."""
    alpha = np.array(alpha)
    loss = 0.0
    for winner, loser in comparisons:
        log_prob = np.log(expit(alpha[winner] - alpha[loser]) + 1e-10)
        loss -= log_prob
    return loss

def neg_grad(alpha, comparisons):
    alpha = np.array(alpha)
    grad = np.zeros(len(alpha))
    for winner, loser in comparisons:
        p = expit(alpha[winner] - alpha[loser])
        grad[winner] -= (1 - p)
        grad[loser]  -= (-p)
    return grad

# Fix alpha[0] = 0 to resolve scale ambiguity
result = minimize(
    lambda a: neg_log_likelihood(np.concatenate([[0.0], a]), comparisons),
    x0=np.zeros(N_ITEMS - 1),
    jac=lambda a: neg_grad(np.concatenate([[0.0], a]), comparisons)[1:],
    method='L-BFGS-B'
)
est_alpha = np.concatenate([[0.0], result.x])

# Compare true vs estimated ranking
true_rank = np.argsort(true_alpha)[::-1]
est_rank  = np.argsort(est_alpha)[::-1]

print(f"\nTrue ranking (item indices): {true_rank}")
print(f"Estimated ranking:           {est_rank}")
rank_corr = np.corrcoef(true_alpha, est_alpha)[0, 1]
print(f"Correlation with true scores: {rank_corr:.4f}")
```

---

## Thurstons Modell

Thurstons Modell {cite}`thurstone1927law` ist eng mit Bradley-Terry verwandt, verwendet aber ein Gauß'sches statt logistisches Rauschen:

$$
P(i \succ j) = \Phi\left(\frac{\alpha_i - \alpha_j}{\sqrt{2}\sigma}\right)
$$

wobei $\Phi$ die Standard-Normal-CDF ist. Für $\sigma = 1/\sqrt{2}$ wird dies äquivalent zu BT mit einem geringfügigen Skalierungsunterschied. In der Praxis liefern die beiden Modelle nahezu identische Ergebnisse.

---

## Rang-Aggregation

Wenn jeder Annotator ein vollständiges Ranking von $K$ Elementen liefert (statt paarweiser Vergleiche), besteht das Problem in der **Rang-Aggregation**: Mehrere gerankte Listen zu einem Konsensus-Ranking kombinieren.

**Borda-Zählung:** Jedes Element erhält einen Score gleich der Anzahl der Elemente, die im Ranking jedes Annotators unter ihm eingestuft sind. Scores werden über Annotatoren summiert. Einfach und robust.

**Kemeny-Young:** Das Ranking finden, das die Summe paarweiser Uneinigkeiten (den Kendall-Tau-Abstand) mit dem Ranking jedes Annotators minimiert. Dies ist NP-schwer für großes $K$, aber für kleine Mengen handhabbar.

**RankNet / ListNet:** Neuronale Ansätze, die eine Bewertungsfunktion aus gerankte Listen erlernen und Generalisierung auf ungesehene Elemente ermöglichen.

---

## Duellier-Banditen

Beim **Online**-Präferenzlernen kommen Elemente in einem Strom an, und wir müssen entscheiden, welche Paare zu vergleichen sind, wobei Exploration (Lernen über unbekannte Elemente) und Exploitation (Präsentation hochwertiger Elemente) ausgewogen werden. Dies ist das **Duellier-Bandit**-Problem {cite}`yue2009interactively`.

Schlüsselalgorithmen:
- **Doubler:** Pflegt ein Champion-Element; fordert es mit zufälligen Konkurrenten heraus
- **RUCB (Relative Upper Confidence Bound):** Berechnet UCB-ähnliche Konfidenzintervalle für die Wahrscheinlichkeit jedes Elements, jedes andere zu schlagen
- **MergeRank:** Kombiniert turnierartigen Vergleich mit UCB

Duellier-Banditen werden in Online-Empfehlungssystemen (welchen Artikel als nächstes anzeigen, bei implizitem Feedback) und bei der interaktiven Präferenzerkennung für die RLHF-Datensammlung verwendet.

---

## Präferenzlernen für Sprachmodelle

Im Kontext von RLHF (Kapitel 6) wird das Bradley-Terry-Modell zum Training des Belohnungsmodells verwendet. Eine wichtige Variante ist **Direct Preference Optimization (DPO)** {cite}`rafailov2023direct`, die zeigt, dass das RLHF-Ziel direkt aus Präferenzdaten optimiert werden kann, ohne ein separates Belohnungsmodell zu trainieren:

$$
\mathcal{L}_\text{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_\text{ref}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_\text{ref}(y_l \mid x)} \right) \right]
$$

DPO ist einfacher als volles RLHF (keine PPO-Trainingsschleife, kein Belohnungsmodell), während es auf vielen Benchmarks vergleichbare oder bessere Ergebnisse erzielt {cite}`rafailov2023direct`. Es hat sich als weit verbreitete Alternative zu PPO-basiertem RLHF für Instruktionsfolge-Feinabstimmung etabliert, obwohl beide Ansätze aktiv genutzt werden und ihre relativen Stärken aufgabenabhängig sind.

---

## Hochwertige Präferenzdaten sammeln

Die Qualität der Präferenzdaten bestimmt die Qualität des Belohnungsmodells. Wichtige Überlegungen:

**Prompt-Vielfalt.** Präferenzdaten sollten die vollständige Verteilung der Prompts abdecken, denen das Modell beim Einsatz begegnen wird. Lücken in der Abdeckung führen zu unzuverlässigem Belohnungsmodellverhalten in diesen Bereichen.

**Antwort-Vielfalt.** Der Vergleich zweier sehr ähnlicher Antworten liefert wenig Information. Die verglichenen Antworten sollten sich genug unterscheiden, damit Annotatoren eine klare Präferenz haben.

**Annotatorenübereinstimmung.** Niedrige Annotatorenübereinstimmung deutet darauf hin, dass die Vergleichskriterien unklar sind. Übereinstimmung messen (Cohens κ) und Richtlinien überarbeiten, wenn sie unter akzeptable Schwellenwerte fällt.

**Kalibrierung.** Annotatoren sollten verstehen, *warum* eine Antwort besser ist: Nützlichkeit, Genauigkeit, Sicherheit, Stil? Aufgaben, die mehrere Kriterien bündeln, neigen dazu, inkonsistente Präferenzen zu erzeugen. Es ist oft besser, Präferenzen für jedes Kriterium separat zu sammeln.

```{seealso}
Bradley-Terry-Modell: {cite}`bradley1952rank`. Thurstone: {cite}`thurstone1927law`. Duellier-Banditen: {cite}`yue2009interactively`. Direct Preference Optimization (DPO): {cite}`rafailov2023direct`.
```
