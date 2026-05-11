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

# ከምሳሌ ትርኢቶች መማር

ሥራ ሊወስኑ ቸር ሲሆን ግን ሊያሳዩ ቀላሉ ሲሆን፣ ደንቡ ሁሉ ሊዘረዝሩ ሳይሆን ምሳሌ ሁሉ ሊያስተምሩ ቀልጣፋ ሊሆን ይዟሉ። ሰው ሙያ ዕቃ ሊጨብጥ ሮቦቱ ዕጅ ሁኔታ ሊያሳዩ ይዟሉ፤ ፕሮግራመሩ IDE ሁሉ ቅናጅ ትክክለኛ ሁሉ ቅደም ሁሉ ሊሰጡ ይዟሉ፤ ቼዝ ታዋቂ ሹም ጨዋታ ሊጫወቱ ይዟሉ። **ምሳሌ ትርኢቶቹ ሁሉ ትምህርቱ** ከዚህ ባሕሪ ውሂቡ ሂደቱ ሊያወጡ ይዟሉ፣ ሰው ሰናፊ ዋጋ ዓይነቶቹ ወይም ሆን ብሎ ሥራ ዝርዝሮቹ ሳይፈልጉ።

---

## ባሕሪ ቅዳ

ቀላሉ አቀራረቡ **ባሕሪ ቅዳ (BC)** ነው፦ ምሳሌ ትርኢቱ ቁጥጥሩ ውሂቡ ሆኖ ሁኔታዎቹ ሁሉ ሥራዎቹ ሁሉ ሊሰጡ ትምህርቱ ሊሠሩ ይዟሉ።

ሙያ ምሳሌ ሰጪ ሁሉ ሁኔታ-ሥራ ቡድኖቹ $\mathcal{D} = \{(s_i, a_i)\}$ ሲሰጡ፣ ኔጋቲቭ ሎግ-ሊኬሊሁድ ሊቀንሱ ሂደቱ $\pi_\theta(a \mid s)$ ሊሰኙ ይዟሉ፦

$$
\mathcal{L}_\text{BC}(\theta) = -\frac{1}{|\mathcal{D}|} \sum_{(s, a) \in \mathcal{D}} \log \pi_\theta(a \mid s)
$$

ይህ ሙሉ ምናምን ቁጥጥሩ ትምህርቱ ቅደም ውሂቡ ሁሉ ሊጠቀሙ ነው።

### ኮቫርያቱ ሸረሪቱ ችግሩ

BC ዋናቱ ደካማነቱ አለ፦ ስልጠናቸው እና ሰፊ ሥራ መካከሉ **ስርጭቱ ሰዋሪ**። ሙያ ምሳሌዎቹ ሙያው ሞካሪ ሚጎበኙ ሁኔታዎቹ ሊሸፍኑ ይዟሉ። ሆኖም ሰፊ ሥራ ሁሉ፣ ሰለጠነ ሂደቱ ትንሽ ልዩ ወሳኔዎቹ ሊሰጡ ይዟሉ፣ ሙያው ፈጽሞ ሊጎበኝ ሁኔታዎቹ ሊወስዳቸው — ሂደቱ ምንም ቁጥጥሩ ሌለው እና ሰፊ ሊወድቁ ይዟሉ ሁኔታዎቹ።

ዋናቱ ሁኔታ ስህተቶቹ **ሲጸናቸው** ይዟሉ፦ አነስ ሊቀይሩ ያልተለምዶ ሁኔታ ሊወስዱ፣ ትንሽ ስህተቱ ሥራ ሁሉ ሰፊ ያልተለምዶ ሁኔታ ሊወስዱ ይዟሉ፣ ወዘተ። ቀልጣፋነቱ $O(T^2 \epsilon)$ ሆኖ ሊቀንሱ ይዟሉ ሲሆን $T$ ዙሩ ርዝማኔ ሲሆን $\epsilon$ እያንዳንዱ ደረጃ ሁሉ ስህተቱ ምጥጥን ነው — ዐዋቂ ሂደቱ $O(T\epsilon)$ ቀነሰ ሁሉ ሰፊ ይከፋሉ {cite}`ross2010efficient`።

```{admonition} ምሳሌ፦ ራስ-ሚሄዱ ማሽን ሽቅብ
:class: note

ሰው ሁሉ ላን-ኪፒንጉ ሁሉ ሰለጠነ ባሕሪ ቅዳ ሞዴሉ ቀጥ ያሉ መንገዶቹ (ስልጠናቸው ስርጭቱ ቅርቡ ሁኔታዎቹ) ጥሩ ሠረ። ነገር ግን ትንሽ ሊቀዘቅዙ ሲሄዱ — ሰው ሹፌሩ ዕውን ፈጽሞ ሊሆን ምክንያቱ ቀድሞ ሊያስተካክሉ ሁኔታ — ሊምሩ ምንም ውሂቡ ሌለው ሰፊ ቀዝቃዛ መንገዱ ሊሄዱ ይዟሉ።
```

```text
DAgger ቀመሩ፦
  ጀምሩ: D <- {} (ባዶ ውሂቡ)
  M ምሳሌ ትርኢቶቹ ሁሉ ዋናቱ ሂደቱ pi_1 ሰልጥን

  ለ ዙሩ i = 1, 2, ..., N:
    1. ሁኔታዎቹ {s_1, ..., s_t} ሊሰበስቡ አካባቢ pi_i ሮጥ
    2. እያንዳንዱ ጎብኙ ሁኔታ ሁሉ ሙያ ሥራዎቹ ጠይቅ: a_t = pi*(s_t)
    3. አዋህድ: D <- D u {(s_1, a_1), ..., (s_t, a_t)}
    4. D ሁሉ ቁጥጥሩ ትምህርቱ ሁሉ pi_{i+1} ሰልጥን
```

DAgger $O(T\epsilon)$ ቆጣሪ ሊደርሱ ይዟሉ — ዐዋቂ ሂደቱ ያህሉ — ምክንያቱም ስልጠናቸው ስርጭቱ ሰፊ ሥራ ስርጭቱ ሊዋሃዱ ሄደ።

ዋናቱ ፍላጎቱ ሙያ ሙያ ሚሄዱ ሁሉ ሳይሆን ሁሉ ሁኔታዎቹ ሁሉ ሊጠይቁ ይቻላሉ። ይህ ምሳሌ ሲሙሌሽን ሁሉ ሊደርሱ ይዟሉ (ያልተለምዶ አዋቅሩ ሁሉ ሮቦቱ ሊያስተካክሉ ሙያ ጠይቅ) ግን ዕውን አካላዊ ሥርዓቶቹ ሁሉ ቸር ወይም ደህና ሳይሆን ሊሆን ይዟሉ።

---

## ተቃዋሚ ማጠናከሪያ ትምህርቱ

አንዳንዴ ሙያ ባሕሪ ሁሉ ሚሄዱ ሁሉ ዝርዝሮቹ ቅደም ሁሉ ሊሆን ሳይሆን ምናምን ዋጋ ዓይነቱ ሁሉ ሙሉ ሙሉ ቀልጣፋ ሊረዱ ይዟሉ። **ተቃዋሚ ማጠናከሪያ ትምህርቱ (IRL)** {cite}`ng2000algorithms` ምሳሌዎቹ ሁሉ ምናምን ዋጋ ዓይነቱ ሊያወጡ ይዟሉ።

ምሳሌዎቹ $\tau = \{(s_1, a_1), \ldots, (s_T, a_T)\}$ ሲሰጡ፣ IRL ሙያ ሂደቱ $R$ ሁሉ ሙሉ ሁሉ ዋናቱ ዋጋ ዓይነቱ $R(s, a)$ ሊያገኙ ይዟሉ።

BC ሁሉ IRL ሁሉ ጥቅሙ፦ ዕውን ዋጋ ዓይነቱ ሊያወጡ ቢቻሉ፣ አዲስ አካባቢዎቹ ሁሉ ሊዳዩ ሊሻሻሉ ይዟሉ፣ ልዩ ሂደቶቹ ሁሉ ወይም ሻሻሉ ዕቅዱ ሁሉ — ምሳሌ ሁኔታዎቹ ሙሉ ሊሰፋፋ ሊሄዱ።

### ሙሉ ኤንትሮፒ IRL

**MaxEnt IRL** {cite}`ziebart2008maximum` IRL ብዥታ ችግሩ (ምሳሌዎቹ ስብስቡ ሁሉ ቅናጅ ብዙ ዋጋ ዓይነቶቹ አሉ) ሁሉ ምሳሌ ባሕሪ ሁሉ ሙሉ ቅናጅ ሲሆን ዙሮቹ ሁሉ *ሙሉ ኤንትሮፒ* ያለ ስርጭቱ ሊፈጥሩ ዋጋ ዓይነቱ ሙሉ ሙሉ ሊምርጡ ሊፈቱ ይዟሉ። ዙሮቹ ሁሉ ሚከፋፈሉ ናቸው፦

$$
P(\tau \mid R) \propto \exp\left(\sum_t R(s_t, a_t)\right)
$$

ትምህርቱ ዓላማቸው ሙያ ምናምን ባሕሪ ምናምን $\mu_E = \mathbb{E}_{\tau \sim \pi^*}[\phi(\tau)]$ ሁሉ ሞዴሉ ምናምን ምናምን $\mu_\theta = \mathbb{E}_{\tau \sim \pi_\theta}[\phi(\tau)]$ ሁሉ ሊያዛምዱ ይዟሉ።

---

## GAIL፦ ምሳሌ ትምህርቱ ሁሉ ጀነሬቲቭ ተቃዋሚ

**GAIL** {cite}`ho2016generative` ዋጋ ዓይነቱ ትምህርቱ ሙሉ ሊቀይሩ ይዟሉ፣ GAN-ሰለሚሉ ቅርጸቱ ሙሉ ሙሉ ሙያ ሁኔታ-ሥራ ስርጭቱ ሊያዛምዱ ሁሉ ቀጥተኛ ሙሉ ሊጠቀሙ ይዟሉ።

ምደቡ $D_\psi$ ሙያ ሁኔታ-ሥራ ቡድኖቹ $(s, a) \sim \pi^*$ ሁሉ ሂደቱ ሁኔታ-ሥራ ቡድኖቹ $(s, a) \sim \pi_\theta$ ሁሉ ሊለዩ ሰልጥኖ ይዟሉ፦

$$
\mathcal{L}_D = -\mathbb{E}_{\pi^*}[\log D_\psi(s,a)] - \mathbb{E}_{\pi_\theta}[\log(1 - D_\psi(s,a))]
$$

ሰጪው (ሂደቱ $\pi_\theta$) ምደቡ ሊያወናብዱ ሰልጥኖ ይዟሉ — ማለት ሙያ ሁሉ ሚሰሙ ሁኔታ-ሥራ ቡድኖቹ ሊሰጡ ይዟሉ። ምደቡ ውጤቱ $\log D_\psi(s,a)$ ሂደቱ ሁሉ ዋጋ ምልክቱ ሆኖ ሊሠራ ይዟሉ።

GAIL BC ሁሉ ሰፊ ዝቅ ያሉ ምሳሌዎቹ ሙሉ ቀጣዩ ቁጥጥሩ ቤንቺማርኮቹ ሁሉ ሙያ ደረጃ ቀልጣፋነቱ ሊደርሱ ይዟሉ፣ ቸር አካባቢዎቹ ሁሉ MaxEnt IRL ሁሉ ሰፊ ሊሰፋፋ ሊሄዱ ይዟሉ።

---

## NLP ሁሉ ባሕሪ ቅዳ፦ ተጨባጭ ምሳሌ

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

## ምሳሌ ትምህርቱ ዘዴዎቹ ማወዳደሩ

| ዘዴ                | ዋጋ ፈልጎ? | ሙያ ኦንላይን ጠይቆ? | አዲስ ሂደቶቹ ሊሰፋፋ? | ቸርነቱ     |
|-------------------|----------|----------------|-----------------|-----------|
| ባሕሪ ቅዳ           | አይ       | አይ             | ጥሩ ያልሆነ (ስርጭቱ ሰዋሪ) | ዝቅ     |
| DAgger            | አይ       | አዎ             | ምናምን            | መካከለኛ  |
| MaxEnt IRL        | ሊያወጡ    | አይ             | ጥሩ              | ሰፊ      |
| GAIL              | አይ       | አይ             | ጥሩ              | ሰፊ      |

---

## ተጠቃሚ ዓይነቶቹ

**ሮቦቲክስ።** ሮቦቶቹ ዕቃዎቹ ሊቃዙ፣ አካባቢዎቹ ሊዳሰሱ፣ ወይም ቤታቸው ሥራዎቹ ሊሠሩ ሊያስተምሩ። አካላዊ ምሳሌዎቹ ቴሌኦፐሬሽን ወይም ኪነስቲቲካዊ ትምህርቱ ሁሉ ሰበሰቡ ይዟሉ።

**ራስ-ሚሄዱ ማሽን ሽቅብ።** ALVINN {cite}`pomerleau1989alvinn` እና NVIDIA DAVE ሰለሚሉ ቀደምቱ ራስ-ሚሄዱ ሥርዓቶቹ ሰው ሹፌሩ ምሳሌ ሁሉ ባሕሪ ቅዳ ሙሉ ሰፊ ሊተማመኑ ይዟሉ።

**ጨዋታ AI።** ሰው ጨዋታ ሁሉ ምሳሌ ትምህርቱ RL ዳግም ቅልምጫ ሲጀምሩ ኤጄንቶቹ ሊያደርጋቸው ይዟሉ። AlphaStar RL ሲጀምሩ ሰው ዳግም-ምልከታዎቹ ሁሉ ሰልጥኗ ይዟሉ፤ ይህ አቀራረቡ ሰው ደረጃ ምሳሌዎቹ ሲኖሩ ብዙ ጊዜ ጥቅም ላይ ሊውሉ ይዟሉ።

**ኮድ ሰሪ።** ሁሉ-ጥሩ ኮድ ምሳሌዎቹ ሁሉ ቋንቋ ሞዴሉ ዳግም ቅልምጫ (GitHub Copilot፣ Codex) ባሕሪ ቅዳ ዓይነቱ ነው።

**ሕክምናዊ ወሳኔ ርዳቱ።** ቸር ፕሮቶኮሎቹ ሁሉ ሙያ ሐኪሙ ወሳኔ ቅደሞቹ ሁሉ ትምህርቱ።

```{seealso}
ዋናቱ BC/DAgger ዳሰሳ {cite}`ross2011reduction` ሙሉ ነው። MaxEnt IRL {cite}`ziebart2008maximum` ሁሉ ነው። GAIL {cite}`ho2016generative` ሁሉ ነው። ምሳሌ ትምህርቱ አጠቃላይ ዳሰሳ ሁሉ {cite}`osa2018algorithmic` ይመልከቱ።
```
