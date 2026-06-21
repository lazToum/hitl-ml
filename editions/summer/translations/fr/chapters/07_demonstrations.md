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

# Apprentissage par démonstration

Quand une tâche est difficile à spécifier mais facile à démontrer, il peut être plus efficace d'enseigner par l'exemple que de définir par règle. Un expert humain montre à un bras robotique comment saisir un objet ; les interactions d'un programmeur avec son environnement de développement fournissent une séquence d'éditions correctes ; un grand maître d'échecs joue une partie. **L'apprentissage par démonstration** extrait une politique à partir de telles données comportementales, évitant la nécessité de fonctions de récompense artisanales ou de spécifications explicites de tâches.

---

## Le clonage comportemental

L'approche la plus simple est le **clonage comportemental (BC)** : traiter la démonstration comme des données supervisées et apprendre une correspondance entre états et actions.

Étant donné un ensemble de données de paires état-action $\mathcal{D} = \{(s_i, a_i)\}$ provenant d'un démonstrateur expert, nous ajustons une politique $\pi_\theta(a \mid s)$ en minimisant la log-vraisemblance négative :

$$
\mathcal{L}_\text{BC}(\theta) = -\frac{1}{|\mathcal{D}|} \sum_{(s, a) \in \mathcal{D}} \log \pi_\theta(a \mid s)
$$

C'est précisément l'apprentissage supervisé standard appliqué à des données séquentielles.

### Le problème du décalage de covariables

Le BC présente une faiblesse fondamentale : le **décalage de distribution** entre l'entraînement et le déploiement. Les démonstrations de l'expert couvrent les états visités par l'expert. Mais lors du déploiement, la politique apprise peut prendre des décisions légèrement différentes, la conduisant dans des états que l'expert n'a jamais visités — des états où la politique n'a aucune supervision et peut échouer gravement.

Crucialement, les erreurs **se cumulent** : une petite déviation conduit à un état inconnu, où une action légèrement erronée conduit à un état encore plus inconnu, et ainsi de suite. Les performances se dégradent en $O(T^2 \epsilon)$ où $T$ est la longueur de l'épisode et $\epsilon$ est le taux d'erreur à chaque étape — bien pire que la dégradation en $O(T\epsilon)$ d'une politique oracle {cite}`ross2010efficient`.

```{admonition} Exemple : Conduite autonome
:class: note

Un modèle de clonage comportemental pour le maintien de voie entraîné sur des données de conduite humaine fonctionne bien sur des routes droites (états proches de la distribution d'entraînement). Mais au moment où il dérive légèrement — un état dans lequel aucun conducteur humain ne se trouverait parce qu'il aurait déjà corrigé — il n'a pas de données pour le guider et peut sortir de la route.
```

```text
Algorithme DAgger :
  Initialiser : D <- {} (ensemble vide)
  Entraîner la politique initiale pi_1 sur M démonstrations expert

  pour l'itération i = 1, 2, ..., N :
    1. Exécuter pi_i dans l'environnement pour collecter les états {s_1, ..., s_t}
    2. Interroger l'expert pour les actions sur chaque état visité : a_t = pi*(s_t)
    3. Agréger : D <- D u {(s_1, a_1), ..., (s_t, a_t)}
    4. Entraîner pi_{i+1} par apprentissage supervisé sur D
```

DAgger atteint un regret en $O(T\epsilon)$ — identique à une politique oracle — parce que la distribution d'entraînement converge pour correspondre à la distribution de déploiement.

L'exigence clé est que l'expert puisse être interrogé sur n'importe quel état, y compris des états que l'expert ne visiterait jamais naturellement. C'est faisable en simulation (demander à l'expert de corriger le robot depuis une configuration inhabituelle) mais peut être difficile ou dangereux dans des systèmes physiques réels.

---

## L'apprentissage par renforcement inverse

Parfois, le comportement de l'expert est mieux compris non comme une séquence d'actions à imiter, mais comme le résultat de l'optimisation d'une fonction de récompense inconnue. **L'apprentissage par renforcement inverse (IRL)** {cite}`ng2000algorithms` récupère cette fonction de récompense latente à partir des démonstrations.

Étant donné des démonstrations $\tau = \{(s_1, a_1), \ldots, (s_T, a_T)\}$, l'IRL trouve une fonction de récompense $R(s, a)$ telle que la politique de l'expert est optimale sous $R$.

L'attrait de l'IRL par rapport au BC : si nous récupérons la vraie fonction de récompense, nous pouvons la ré-optimiser dans de nouveaux environnements, avec des dynamiques différentes, ou avec des planificateurs améliorés — généralisant bien au-delà des scénarios démontrés.

### IRL à entropie maximale

**L'IRL MaxEnt** {cite}`ziebart2008maximum` résout le problème d'ambiguïté de l'IRL (il existe de nombreuses fonctions de récompense cohérentes avec n'importe quel ensemble de démonstrations) en choisissant la fonction de récompense qui, tout en étant cohérente avec le comportement démontré, conduit à une distribution sur les trajectoires avec *entropie maximale*. Les trajectoires sont distribuées selon :

$$
P(\tau \mid R) \propto \exp\left(\sum_t R(s_t, a_t)\right)
$$

L'objectif d'apprentissage fait correspondre les espérances de caractéristiques observées de l'expert $\mu_E = \mathbb{E}_{\tau \sim \pi^*}[\phi(\tau)]$ aux espérances de caractéristiques du modèle $\mu_\theta = \mathbb{E}_{\tau \sim \pi_\theta}[\phi(\tau)]$.

---

## GAIL : Apprentissage par imitation adversariale générative

**GAIL** {cite}`ho2016generative` contourne entièrement l'apprentissage de la fonction de récompense, utilisant une formulation de type GAN pour faire correspondre directement la distribution état-action de l'expert.

Un discriminateur $D_\psi$ est entraîné à distinguer les paires état-action expertes $(s, a) \sim \pi^*$ des paires état-action de la politique $(s, a) \sim \pi_\theta$ :

$$
\mathcal{L}_D = -\mathbb{E}_{\pi^*}[\log D_\psi(s,a)] - \mathbb{E}_{\pi_\theta}[\log(1 - D_\psi(s,a))]
$$

Le générateur (la politique $\pi_\theta$) est entraîné à tromper le discriminateur — c'est-à-dire à produire des paires état-action qui ressemblent à celles de l'expert. La sortie du discriminateur $\log D_\psi(s,a)$ sert de signal de récompense pour la politique.

GAIL atteint des performances de niveau expert sur des références de contrôle continu avec bien moins de démonstrations que le BC, et généralise mieux que l'IRL MaxEnt dans des environnements complexes.

---

## Clonage comportemental en TAL : un exemple pratique

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

## Comparaison des méthodes d'apprentissage par imitation

| Méthode        | Nécessite une récompense ? | Expert interrogé en ligne ? | Généralise à de nouvelles dynamiques ? | Complexité |
|----------------|----------------------------|-----------------------------|----------------------------------------|------------|
| Clonage comportemental | Non          | Non                         | Mal (décalage de distribution)         | Faible     |
| DAgger         | Non              | Oui                         | Modérément                             | Moyenne    |
| IRL MaxEnt     | La récupère     | Non                         | Bien                                   | Élevée     |
| GAIL           | Non              | Non                         | Bien                                   | Élevée     |

---

## Applications

**Robotique.** Enseigner aux robots à manipuler des objets, naviguer dans des environnements ou réaliser des tâches ménagères. Les démonstrations physiques sont collectées via la téléopération ou l'enseignement kinesthésique.

**Conduite autonome.** Les premiers systèmes de véhicules autonomes tels qu'ALVINN {cite}`pomerleau1989alvinn` et DAVE de NVIDIA s'appuyaient fortement sur le clonage comportemental à partir de données de conduite humaine.

**IA pour les jeux.** L'apprentissage par imitation sur le jeu humain amorce les agents avant l'affinement par RL. AlphaStar s'est entraîné sur des replays humains avant le RL ; cette approche est courante quand des démonstrations de niveau humain sont disponibles.

**Génération de code.** L'affinement de modèles de langage sur des démonstrations de code de haute qualité (GitHub Copilot, Codex) est une forme de clonage comportemental.

**Aide à la décision clinique.** Apprentissage à partir de séquences de décisions de médecins experts pour des protocoles complexes.

```{seealso}
L'analyse fondatrice du BC/DAgger se trouve dans {cite}`ross2011reduction`. L'IRL MaxEnt est issu de {cite}`ziebart2008maximum`. GAIL est issu de {cite}`ho2016generative`. Pour une revue complète de l'apprentissage par imitation, voir {cite}`osa2018algorithmic`.
```
