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

# Koyo daga Misalai

Lokacin da aiki ya yi wuya ƙayyadewa amma sauƙi nuna, na iya zama mai inganci fiye da kima don koyar da misali maimakon bayyana ta ƙa'ida. Ƙwararren dan adam yana nuna hannun robot yadda za ya kama abu; shiryen programmer tare da IDE ɗinsu yana ba da jeri na gyarawa daidai; ƙwararren chess yana yin wasa. **Koyo daga misalai** yana fitar da manufa daga irin wannan bayanan ɗabi'a, yana kauce da buƙatar ayyukan lada da aka yi da hannu ko bayanan aikin a fili.

---

## Kwaikwayon Ɗabi'a

Mafi sauƙin hanya shine **kwaikwayon ɗabi'a (BC)**: ɗauki misalin a matsayin bayanai supervised kuma koyi zawa daga yanayi zuwa ayyuka.

Da saitin bayanai na nau'in yanayi-aiki $\mathcal{D} = \{(s_i, a_i)\}$ daga mai nuna ƙwararru, muna daidaita manufa $\pi_\theta(a \mid s)$ ta hanyar rage negative log-likelihood:

$$
\mathcal{L}_\text{BC}(\theta) = -\frac{1}{|\mathcal{D}|} \sum_{(s, a) \in \mathcal{D}} \log \pi_\theta(a \mid s)
$$

Wannan daidai koyon supervised na yau da kullum da ake amfani da shi ga bayanai mai jeri ne.

### Matsalar Canjin Covariate

BC yana da raunin asali: **canjin rarrabawa** tsakanin horarwa da aikawa. Misalai na ƙwararru suna rufe yanayin da ƙwararru ke ziyarta. Amma a lokacin aikawa, manufa da aka koyo na iya yanke shawara daban-daban kaɗan, yana jagorancinta zuwa yanayin da ƙwararru ba su taɓa ziyartar — yanayin da manufa ba shi da kulawa kuma na iya gazawa mara kyau.

Muhimmanci, kurakurai suna **haɗawa**: sauye-sauye ƙarami yana haifar da yanayi mara sani, inda aiki mara daidai kaɗan yana haifar da yanayi mara sani fiye da kima, da sauransu. Aiki yana ragewa a matsayin $O(T^2 \epsilon)$ inda $T$ shine tsawon ƙullun da $\epsilon$ shine yawan kuskure a kowane mataki — mafi muni sosai fiye da raguwar $O(T\epsilon)$ na manufa ta oracle {cite}`ross2010efficient`.

```{admonition} Misali: Tuka Kai Tsaye
:class: note

Samfurin kwaikwayon ɗabi'a don adana hanya da aka horar akan bayanin tuka dan adam yana aiki da kyau akan hanyoyi madaidaiciya (yanayi kusa da rarrabawar horarwa). Amma lokacin da ya kauce kaɗan — yanayi wanda babu mai tuka dan adam da zai kasancewa domin sun riga sun gyara — ba shi da bayanai don kula da shi kuma na iya tuka waje da hanya.
```

```text
Algorithm DAgger:
  Initialize: D <- {} (empty dataset)
  Train initial policy pi_1 on M expert demonstrations

  for iteration i = 1, 2, ..., N:
    1. Run pi_i in the environment to collect states {s_1, ..., s_t}
    2. Query expert for actions on each visited state: a_t = pi*(s_t)
    3. Aggregate: D <- D u {(s_1, a_1), ..., (s_t, a_t)}
    4. Train pi_{i+1} by supervised learning on D
```

DAgger yana cimma nadama ta $O(T\epsilon)$ — ɗaya da manufa ta oracle — saboda rarrabawar horarwa ta kusanya don dacewa da rarrabawar aikawa.

Buƙata ta muhimmanci ita ce ƙwararru za a iya tambayar su akan duk yanayi, gami da yanayin da ƙwararru ba za su taɓa ziyarta su ta halitta ba. Wannan yana yiwuwa a kwaikwayo (roƙa ƙwararru don gyara robot daga tsarin da ba na yau da kullum ba) amma na iya zama kalubale ko mara lafiya a cikin tsarin jiki na gaske.

---

## Koyon Ƙarfafawa Mai Juyawa

Wani lokaci ana fi fahimtar ɗabi'ar ƙwararru ba a matsayin jeri na ayyuka don kwaikwayo amma a matsayin sakamakon inganta ayyukan lada da ba a sani ba. **Koyon Ƙarfafawa Mai Juyawa (IRL)** {cite}`ng2000algorithms` yana dawo da wannan ayyukan lada da ke ɓoye daga misalai.

Da misalai $\tau = \{(s_1, a_1), \ldots, (s_T, a_T)\}$, IRL yana nemo ayyukan lada $R(s, a)$ inda manufar ƙwararru ta fi a ƙarƙashin $R$.

Burgeshi na IRL akan BC: idan muka dawo da ayyukan lada na gaskiya, za mu iya sake inganta shi a sabbin muhalli, tare da motsin daban-daban, ko tare da masu tsara aiki ingantattun — yana yaɗuwa fiye da yanayin da aka nuna sosai.

### MaxEnt IRL

**MaxEnt IRL** {cite}`ziebart2008maximum` yana warware matsalar rikitarwa na IRL (akwai ayyukan lada da yawa masu dacewa da kowane saitin misalai) ta hanyar zaɓar ayyukan lada wanda, yayin da yake dacewa da ɗabi'ar da aka nuna, yana haifar da rarrabawar akan hanyoyi masu *entropy mafi girma*. An rarraba hanyoyi a matsayin:

$$
P(\tau \mid R) \propto \exp\left(\sum_t R(s_t, a_t)\right)
$$

Manufar koyo tana dacewa da tsammani na fasali na ƙwararru da aka ga $\mu_E = \mathbb{E}_{\tau \sim \pi^*}[\phi(\tau)]$ ga tsammani na fasali na samfuri $\mu_\theta = \mathbb{E}_{\tau \sim \pi_\theta}[\phi(\tau)]$.

---

## GAIL: Koyon Kwaikwayo ta Adawa ta Generative

**GAIL** {cite}`ho2016generative` yana tsallake koyon ayyukan lada gaba ɗaya, ta amfani da tsarin kama GAN don kai tsaye dacewa da rarrabawar yanayi-aiki ta ƙwararru.

Ana horar da mai nuna bambanci $D_\psi$ don bambanta nau'i na yanayi-aiki na ƙwararru $(s, a) \sim \pi^*$ daga nau'i na manufa $(s, a) \sim \pi_\theta$:

$$
\mathcal{L}_D = -\mathbb{E}_{\pi^*}[\log D_\psi(s,a)] - \mathbb{E}_{\pi_\theta}[\log(1 - D_\psi(s,a))]
$$

Ana horar da mai ƙirƙira (manufar $\pi_\theta$) don yaudarar mai nuna bambanci — watau, don samar da nau'i na yanayi-aiki waɗanda suke kama da na ƙwararru. Sakamakon mai nuna bambanci $\log D_\psi(s,a)$ yana zama alaman lada don manufar.

GAIL yana cimma aikin matakin ƙwararru akan gwajin sarrafa ci gaba da ƙarancin misalai fiye da BC, kuma yana faɗaɗawa mafi kyau fiye da MaxEnt IRL a muhalli masu rikitarwa.

---

## Kwaikwayon Ɗabi'a a NLP: Misali na Aiki

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

## Kwatancen Hanyoyin Koyon Kwaikwayo

| Hanya           | Yana buƙatar lada? | An tambaya ƙwararru akan yanar gizo? | Yana yaɗuwa zuwa sabon motsi? | Rikitarwa  |
|-----------------|-------------------|--------------------------------------|-------------------------------|------------|
| Kwaikwayon ɗabi'a | A'a              | A'a                                  | Mai muni (canjin rarrabawa)   | Ƙarami     |
| DAgger          | A'a               | Eh                                   | Matsakaici                    | Matsakaici |
| MaxEnt IRL      | Yana dawo da shi  | A'a                                  | Mai kyau                      | Babba      |
| GAIL            | A'a               | A'a                                  | Mai kyau                      | Babba      |

---

## Aikace-aikace

**Robots.** Koyar da robots don sarrafa abubuwa, kewayawa muhalli, ko yin ayyukan gida. Ana tattara misalai na jiki ta teleoperation ko koyar da kinesthetic.

**Tuka kai tsaye.** Tsarin motoci na farko da ke tuka da kansu kamar ALVINN {cite}`pomerleau1989alvinn` da NVIDIA DAVE sun dogara sosai akan kwaikwayon ɗabi'a daga bayanin tuka dan adam.

**AI na wasa.** Koyon kwaikwayo akan wasannin dan adam yana dawo da wakilan kafin daidaita RL. AlphaStar ya horar akan kwaikwayon dan adam kafin RL; wannan hanya ta zama yau da kullum lokacin da misalai matakin dan adam suke samuwa.

**Ƙirƙira lambar.** Daidaita samfuri na harshe akan misalai mafi kyau na lambar (GitHub Copilot, Codex) wata nau'i ce ta kwaikwayon ɗabi'a.

**Tallafi na yanke shawara na asibiti.** Koyo daga jeri na yanke shawara na likita ƙwararru don tsarin ma'aunan rikitarwa.

```{seealso}
Bincike na asali na BC/DAgger yana a {cite}`ross2011reduction`. MaxEnt IRL daga {cite}`ziebart2008maximum`. GAIL daga {cite}`ho2016generative`. Don bita cikakke na koyon kwaikwayo, duba {cite}`osa2018algorithmic`.
```
