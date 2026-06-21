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

# Lernen aus Demonstrationen

Wenn eine Aufgabe schwer zu spezifizieren, aber leicht zu demonstrieren ist, kann es effizienter sein, durch Beispiele zu lehren als durch Regeln zu definieren. Ein menschlicher Experte zeigt einem Roboterarm, wie er ein Objekt greift; die Interaktion eines Programmierers mit seiner IDE liefert eine Folge korrekter Bearbeitungen; ein Schachgroßmeister spielt eine Partie. **Lernen aus Demonstrationen** extrahiert eine Policy aus solchen Verhaltensdaten, ohne die Notwendigkeit handkodierter Belohnungsfunktionen oder expliziter Aufgabenspezifikationen.

---

## Verhaltensklonen

Der einfachste Ansatz ist **Verhaltensklonen (Behavioral Cloning, BC)**: Die Demonstration als überwachte Daten behandeln und eine Abbildung von Zuständen auf Aktionen erlernen.

Gegeben einen Datensatz von Zustands-Aktions-Paaren $\mathcal{D} = \{(s_i, a_i)\}$ eines Experten, passen wir eine Policy $\pi_\theta(a \mid s)$ an, indem wir die negative Log-Likelihood minimieren:

$$
\mathcal{L}_\text{BC}(\theta) = -\frac{1}{|\mathcal{D}|} \sum_{(s, a) \in \mathcal{D}} \log \pi_\theta(a \mid s)
$$

Dies ist präzise Standard-Supervised-Learning auf sequenziellen Daten angewendet.

### Das Kovariaten-Shift-Problem

BC hat eine fundamentale Schwäche: **Verteilungsverschiebung** zwischen Training und Einsatz. Die Demonstrationen des Experten decken die vom Experten besuchten Zustände ab. Aber während des Einsatzes kann die erlernte Policy leicht andere Entscheidungen treffen, was sie zu Zuständen führt, die der Experte nie besucht hat — Zustände, für die die Policy keine Aufsicht hat und schlecht versagen kann.

Entscheidend ist, dass sich Fehler **zusammensetzen**: Eine kleine Abweichung führt zu einem unbekannten Zustand, wo eine leicht falsche Aktion zu einem noch unbekannteren Zustand führt, und so weiter. Die Leistung verschlechtert sich als $O(T^2 \epsilon)$, wobei $T$ die Episodenlänge und $\epsilon$ die Fehlerrate bei jedem Schritt ist — viel schlechter als die $O(T\epsilon)$-Verschlechterung einer Orakel-Policy {cite}`ross2010efficient`.

```{admonition} Beispiel: Autonomes Fahren
:class: note

Ein Verhaltenskloning-Modell für das Spurhalten, das auf menschlichen Fahrdaten trainiert wurde, funktioniert gut auf geraden Straßen (Zustände nahe der Trainingsverteilung). Aber in dem Moment, in dem es leicht abdriftet — ein Zustand, in dem kein menschlicher Fahrer wäre, weil er bereits korrigiert hätte — hat es keine Daten, die es führen, und kann von der Straße abkommen.
```

```text
Algorithmus DAgger:
  Initialisierung: D <- {} (leerer Datensatz)
  Anfangs-Policy pi_1 auf M Experten-Demonstrationen trainieren

  für Iteration i = 1, 2, ..., N:
    1. pi_i in der Umgebung ausführen, um Zustände {s_1, ..., s_t} zu sammeln
    2. Experten für Aktionen bei jedem besuchten Zustand befragen: a_t = pi*(s_t)
    3. Aggregieren: D <- D u {(s_1, a_1), ..., (s_t, a_t)}
    4. pi_{i+1} durch Supervised Learning auf D trainieren
```

DAgger erreicht $O(T\epsilon)$-Bedauern — dasselbe wie eine Orakel-Policy — weil die Trainingsverteilung konvergiert, um der Einsatzverteilung zu entsprechen.

Die Schlüsselanforderung ist, dass der Experte für jeden Zustand abgefragt werden kann, einschließlich Zustände, die der Experte natürlicherweise nie besuchen würde. Dies ist in der Simulation machbar (den Experten bitten, den Roboter aus einer ungewöhnlichen Konfiguration zu korrigieren), kann aber in realen physischen Systemen herausfordernd oder unsicher sein.

---

## Inverses Bestärkendes Lernen

Manchmal wird das Verhalten des Experten besser nicht als Folge von nachzuahmenden Aktionen verstanden, sondern als Ergebnis der Optimierung einer unbekannten Belohnungsfunktion. **Inverses Bestärkendes Lernen (IRL)** {cite}`ng2000algorithms` erholt diese latente Belohnungsfunktion aus Demonstrationen.

Gegeben Demonstrationen $\tau = \{(s_1, a_1), \ldots, (s_T, a_T)\}$ findet IRL eine Belohnungsfunktion $R(s, a)$, sodass die Policy des Experten unter $R$ optimal ist.

Der Reiz von IRL gegenüber BC: Wenn wir die wahre Belohnungsfunktion erholen, können wir sie in neuen Umgebungen, mit unterschiedlicher Dynamik oder mit verbesserten Planern neu optimieren — weit über die demonstrierten Szenarien hinaus generalisierend.

### Maximum-Entropie-IRL

**MaxEnt IRL** {cite}`ziebart2008maximum` löst das IRL-Ambiguitätsproblem (es gibt viele Belohnungsfunktionen, die mit einer Menge von Demonstrationen konsistent sind), indem die Belohnungsfunktion gewählt wird, die zwar mit dem demonstrierten Verhalten konsistent ist, aber zu einer Verteilung über Trajektorien mit *maximaler Entropie* führt. Trajektorien sind verteilt als:

$$
P(\tau \mid R) \propto \exp\left(\sum_t R(s_t, a_t)\right)
$$

Das Lernziel stimmt die beobachteten Merkmals-Erwartungen des Experten $\mu_E = \mathbb{E}_{\tau \sim \pi^*}[\phi(\tau)]$ mit den Merkmals-Erwartungen des Modells $\mu_\theta = \mathbb{E}_{\tau \sim \pi_\theta}[\phi(\tau)]$ ab.

---

## GAIL: Generative Adversarial Imitation Learning

**GAIL** {cite}`ho2016generative` umgeht das Erlernen der Belohnungsfunktion vollständig, indem es eine GAN-ähnliche Formulierung verwendet, um die Zustands-Aktions-Verteilung des Experten direkt abzugleichen.

Ein Diskriminator $D_\psi$ wird trainiert, um Experten-Zustands-Aktions-Paare $(s, a) \sim \pi^*$ von Policy-Zustands-Aktions-Paaren $(s, a) \sim \pi_\theta$ zu unterscheiden:

$$
\mathcal{L}_D = -\mathbb{E}_{\pi^*}[\log D_\psi(s,a)] - \mathbb{E}_{\pi_\theta}[\log(1 - D_\psi(s,a))]
$$

Der Generator (die Policy $\pi_\theta$) wird trainiert, den Diskriminator zu täuschen — d. h. Zustands-Aktions-Paare zu produzieren, die wie die des Experten aussehen. Die Ausgabe des Diskriminators $\log D_\psi(s,a)$ dient als Belohnungssignal für die Policy.

GAIL erreicht Expert-Niveau auf Benchmarks für kontinuierliche Steuerung mit weit weniger Demonstrationen als BC und generalisiert besser als MaxEnt IRL in komplexen Umgebungen.

---

## Verhaltensklonen in NLP: Ein praktisches Beispiel

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

torch.manual_seed(42)

# -----------------------------------------------
# Toy NLP task: rewriting sentences to be more formal
# We simulate this as a simple sequence transformation
# In practice: fine-tuning a seq2seq model on expert rewrites
# -----------------------------------------------

class SimpleSeq2Seq(nn.Module):
    def __init__(self, vocab_size=100, embed_dim=32, hidden_dim=64):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.encoder = nn.GRU(embed_dim, hidden_dim, batch_first=True)
        self.decoder = nn.GRU(embed_dim, hidden_dim, batch_first=True)
        self.proj = nn.Linear(hidden_dim, vocab_size)
        self.hidden_dim = hidden_dim

    def forward(self, src, tgt):
        src_emb = self.embed(src)
        _, hidden = self.encoder(src_emb)
        tgt_emb = self.embed(tgt)
        out, _ = self.decoder(tgt_emb, hidden)
        return self.proj(out)

# Generate synthetic demonstration data
VOCAB = 100
rng = np.random.default_rng(42)
N, SEQ_LEN = 1000, 12

src_seqs = torch.tensor(rng.integers(1, VOCAB, (N, SEQ_LEN)), dtype=torch.long)
# "Expert" transformation: shift tokens by 1 (toy formalization)
tgt_seqs = torch.clamp(src_seqs + 1, 1, VOCAB - 1)
tgt_in  = torch.cat([torch.ones(N, 1, dtype=torch.long), tgt_seqs[:, :-1]], dim=1)

dataset = TensorDataset(src_seqs, tgt_in, tgt_seqs)
loader = DataLoader(dataset, batch_size=64, shuffle=True)

model = SimpleSeq2Seq(vocab_size=VOCAB)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss(ignore_index=0)

# Behavioral cloning training
train_losses = []
for epoch in range(20):
    epoch_loss = 0
    for src, tgt_i, tgt_o in loader:
        logits = model(src, tgt_i)
        loss = criterion(logits.reshape(-1, VOCAB), tgt_o.reshape(-1))
        optimizer.zero_grad(); loss.backward(); optimizer.step()
        epoch_loss += loss.item()
    train_losses.append(epoch_loss / len(loader))

print(f"Initial loss: {train_losses[0]:.3f}")
print(f"Final loss:   {train_losses[-1]:.3f}")

# Evaluate: check token accuracy on held-out examples
model.eval()
with torch.no_grad():
    src_test = src_seqs[-100:]
    tgt_test_in = tgt_in[-100:]
    tgt_test_out = tgt_seqs[-100:]
    logits = model(src_test, tgt_test_in)
    preds = logits.argmax(dim=-1)
    acc = (preds == tgt_test_out).float().mean().item()
    print(f"Token accuracy on held-out set: {acc:.3f}")
```

---

## Vergleich der Imitationslernmethoden

| Methode             | Belohnung erforderlich? | Experte online abgefragt? | Generalisiert zu neuer Dynamik? | Komplexität |
|---------------------|------------------------|---------------------------|----------------------------------|-------------|
| Verhaltensklonen    | Nein                   | Nein                      | Schlecht (Verteilungsverschiebung)| Niedrig     |
| DAgger              | Nein                   | Ja                        | Mäßig                            | Mittel      |
| MaxEnt IRL          | Erholt sie             | Nein                      | Gut                              | Hoch        |
| GAIL                | Nein                   | Nein                      | Gut                              | Hoch        |

---

## Anwendungen

**Robotik.** Roboter lehren, Objekte zu manipulieren, Umgebungen zu navigieren oder Haushaltsaufgaben durchzuführen. Physische Demonstrationen werden durch Teleoperation oder kinästhetisches Lehren gesammelt.

**Autonomes Fahren.** Frühe selbstfahrende Systeme wie ALVINN {cite}`pomerleau1989alvinn` und NVIDIAs DAVE basierten stark auf Verhaltensklonen aus menschlichen Fahrdaten.

**Spiel-KI.** Imitationslernen aus menschlichem Spielverhalten startet Agenten, bevor RL-Feinabstimmung erfolgt. AlphaStar trainierte auf menschlichen Replays vor RL; dieser Ansatz ist üblich, wenn Demonstrationen auf menschlichem Niveau verfügbar sind.

**Code-Generierung.** Sprachmodell-Feinabstimmung auf qualitativ hochwertigen Code-Demonstrationen (GitHub Copilot, Codex) ist eine Form des Verhaltensklonens.

**Klinische Entscheidungsunterstützung.** Lernen aus Entscheidungssequenzen erfahrener Ärzte für komplexe Protokolle.

```{seealso}
Die grundlegende BC/DAgger-Analyse findet sich in {cite}`ross2011reduction`. MaxEnt IRL stammt aus {cite}`ziebart2008maximum`. GAIL stammt aus {cite}`ho2016generative`. Für eine umfassende Übersicht des Imitationslernens, siehe {cite}`osa2018algorithmic`.
```
