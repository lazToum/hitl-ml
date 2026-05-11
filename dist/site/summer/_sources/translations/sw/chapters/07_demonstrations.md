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

# Kujifunza kutoka kwa Maonyesho

Kazi inapokuwa ngumu kufafanua lakini rahisi kuonyesha, inaweza kuwa ya ufanisi zaidi kufundisha kwa mfano kuliko kufafanua kwa sheria. Mtaalamu wa binadamu anaonyesha mkono wa roboti jinsi ya kushika kitu; mwingiliano wa mprogramu na IDE yake hutoa mfululizo wa mhariri sahihi; bingwa wa chess anacheza mchezo. **Kujifunza kutoka kwa maonyesho** huondoa sera kutoka kwa data kama hiyo ya kitabia, kuepuka haja ya vitendaji vya zawadi vilivyoundwa kwa mkono au maalum ya kazi waziwazi.

---

## Kuiga Kitabia

Mbinu rahisi zaidi ni **kuiga kitabia (BC)**: tibu onyesho kama data ya usimamizi na jifunza upangaji kutoka kwa hali hadi vitendo.

Ukitoa mkusanyiko wa jozi za hali-vitendo $\mathcal{D} = \{(s_i, a_i)\}$ kutoka kwa monyeshaji mtaalamu, tunafaa sera $\pi_\theta(a \mid s)$ kwa kupunguza uwezekano wa logarithm hasi:

$$
\mathcal{L}_\text{BC}(\theta) = -\frac{1}{|\mathcal{D}|} \sum_{(s, a) \in \mathcal{D}} \log \pi_\theta(a \mid s)
$$

Hii ni hasa ujifunzaji wa kawaida wa usimamizi uliotumika kwa data ya mfululizo.

### Tatizo la Mabadiliko ya Kibainishi

BC ina udhaifu wa kimsingi: **mabadiliko ya usambazaji** kati ya mafunzo na utekelezaji. Maonyesho ya mtaalamu yanashughulikia hali zilizofikiwa na mtaalamu. Lakini wakati wa utekelezaji, sera iliyojifunza inaweza kufanya maamuzi tofauti kidogo, ikiipelekea hali ambazo mtaalamu hakuwahi kutembelea — hali ambazo sera haina usimamizi na inaweza kushindwa vibaya.

Muhimu zaidi, makosa **yanakusanyika**: kupotoka kidogo kunasababisha hali isiyojulikana, ambapo hatua kidogo mbaya inasababisha hali isiyojulikana zaidi, na kadhalika. Utendaji hupungua kama $O(T^2 \epsilon)$ ambapo $T$ ni urefu wa kipindi na $\epsilon$ ni kiwango cha kosa katika kila hatua — mbaya zaidi kuliko upungufu wa $O(T\epsilon)$ wa sera ya chanzo {cite}`ross2010efficient`.

```{admonition} Mfano: Uendeshaji wa Uhuru
:class: note

Mfano wa kuiga kitabia kwa kuweka njia uliopewa mafunzo kwenye data ya uendeshaji wa binadamu hufanya kazi vizuri kwenye barabara za moja kwa moja (hali karibu na usambazaji wa mafunzo). Lakini dakika inapotoka kidogo — hali ambayo dereva yeyote wa binadamu asingekuwa nayo kwa sababu wangerekebisha tayari — hana data ya kuiongoza na anaweza kuendesha nje ya barabara.
```

```text
Kanuni ya DAgger:
  Anzisha: D <- {} (mkusanyiko tupu)
  Funza sera ya awali pi_1 kwenye maonyesho M ya wataalam

  kwa mzunguko i = 1, 2, ..., N:
    1. Endesha pi_i katika mazingira kukusanya hali {s_1, ..., s_t}
    2. Uliza mtaalamu vitendo kwenye kila hali iliyotembelewa: a_t = pi*(s_t)
    3. Jumuisha: D <- D u {(s_1, a_1), ..., (s_t, a_t)}
    4. Funza pi_{i+1} kwa ujifunzaji wa usimamizi kwenye D
```

DAgger inafikia toba ya $O(T\epsilon)$ — sawa na sera ya chanzo — kwa sababu usambazaji wa mafunzo unaungana kuoanishwa na usambazaji wa utekelezaji.

Mahitaji muhimu ni kwamba mtaalamu anaweza koulizwa hali yoyote, ikijumuisha hali ambazo mtaalamu hangekutembelea kwa asili. Hii inawezekana katika uigaji (muulize mtaalamu kurekebisha roboti kutoka kwa usanidi usio wa kawaida) lakini inaweza kuwa changamoto au si salama katika mifumo halisi ya kimwili.

---

## Ujifunzaji wa Kuimarisha wa Nyuma

Wakati mwingine tabia ya mtaalamu inaeleweka vizuri zaidi si kama mfululizo wa vitendo vya kuigwa bali kama matokeo ya uboreshaji wa vitendaji vya zawadi visivyojulikana. **Ujifunzaji wa Kuimarisha wa Nyuma (IRL)** {cite}`ng2000algorithms` hurudisha kitendaji hiki cha zawadi kilichofichwa kutoka kwa maonyesho.

Ukitoa maonyesho $\tau = \{(s_1, a_1), \ldots, (s_T, a_T)\}$, IRL inapata kitendaji cha zawadi $R(s, a)$ ambacho sera ya mtaalamu ni bora chini ya $R$.

Mvuto wa IRL dhidi ya BC: tukiiboresha kitendaji cha zawadi cha kweli, tunaweza kuirekebisha tena katika mazingira mapya, na mienendo tofauti, au na wapangaji walioimarishwa — ukijumlisha mbali zaidi ya matukio yaliyoonyeshwa.

### MaxEnt IRL

**MaxEnt IRL** {cite}`ziebart2008maximum` inatatua tatizo la utata wa IRL (kuna vitendaji vingi vya zawadi vinavyolingana na seti yoyote ya maonyesho) kwa kuchagua kitendaji cha zawadi ambacho, huku kikilingana na tabia iliyoonyeshwa, husababisha usambazaji wa njia zenye *entropi ya juu zaidi*. Njia zinasambazwa kama:

$$
P(\tau \mid R) \propto \exp\left(\sum_t R(s_t, a_t)\right)
$$

Lengo la kujifunza linaoanisha matarajio ya kipengele ya mtaalamu yanayoonekana $\mu_E = \mathbb{E}_{\tau \sim \pi^*}[\phi(\tau)]$ na matarajio ya kipengele ya mfano $\mu_\theta = \mathbb{E}_{\tau \sim \pi_\theta}[\phi(\tau)]$.

---

## GAIL: Kujifunza kwa Kuiga kwa Ushindani wa Uzalishaji

**GAIL** {cite}`ho2016generative` inapita kujifunza kitendaji cha zawadi kabisa, kwa kutumia uundaji kama wa GAN kuoanisha moja kwa moja usambazaji wa hali-vitendo wa mtaalamu.

Kijua $D_\psi$ kinafunzwa kutofautisha jozi za hali-vitendo za wataalam $(s, a) \sim \pi^*$ kutoka kwa jozi za hali-vitendo za sera $(s, a) \sim \pi_\theta$:

$$
\mathcal{L}_D = -\mathbb{E}_{\pi^*}[\log D_\psi(s,a)] - \mathbb{E}_{\pi_\theta}[\log(1 - D_\psi(s,a))]
$$

Kizalishaji (sera $\pi_\theta$) kinafunzwa kudanganya kijua — yaani, kutoa jozi za hali-vitendo zinazofanana na za mtaalamu. Tokeo la kijua $\log D_\psi(s,a)$ hutumika kama ishara ya zawadi kwa sera.

GAIL inafikia utendaji wa kiwango cha wataalam kwenye vipimo vya udhibiti wa kuendelea na maonyesho machache zaidi sana kuliko BC, na inajumlisha vizuri zaidi kuliko MaxEnt IRL katika mazingira magumu.

---

## Kuiga Kitabia katika NLP: Mfano wa Vitendo

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

## Ulinganisho wa Mbinu za Kujifunza kwa Kuiga

| Mbinu              | Inahitaji zawadi? | Mtaalamu aulizwa mtandaoni? | Inajumlisha kwa mienendo mipya? | Ugumu     |
|--------------------|-------------------|-----------------------------|---------------------------------|-----------|
| Kuiga Kitabia      | Hapana            | Hapana                      | Vibaya (mabadiliko ya usambazaji)| Chini    |
| DAgger             | Hapana            | Ndiyo                       | Kwa wastani                     | Wastani   |
| MaxEnt IRL         | Huirejesha        | Hapana                      | Vizuri                          | Juu       |
| GAIL               | Hapana            | Hapana                      | Vizuri                          | Juu       |

---

## Matumizi

**Roboti.** Kufundisha roboti kushughulikia vitu, kusogea katika mazingira, au kufanya kazi za nyumbani. Maonyesho ya kimwili yanakusanywa kupitia utendaji wa mbali au ufundishaji wa kinesthetic.

**Uendeshaji wa uhuru.** Mifumo ya mapema ya uendeshaji wa kujitegemea kama ALVINN {cite}`pomerleau1989alvinn` na DAVE ya NVIDIA ilitegemea sana kuiga kitabia kutoka kwa data ya uendeshaji wa binadamu.

**AI ya mchezo.** Kujifunza kwa kuiga kwenye mchezo wa binadamu huanzisha mawakala kabla ya kurekebisha fini kwa RL. AlphaStar ilifunzwa kwenye nakala za binadamu kabla ya RL; mbinu hii ni ya kawaida wakati maonyesho ya kiwango cha binadamu yanapatikana.

**Uzalishaji wa msimbo.** Kurekebisha fini kwa mfano wa lugha kwenye maonyesho ya msimbo wa ubora wa juu (GitHub Copilot, Codex) ni aina ya kuiga kitabia.

**Msaada wa maamuzi ya kliniki.** Kujifunza kutoka kwa mfululizo wa maamuzi wa daktari mtaalamu kwa itifaki ngumu.

```{seealso}
Uchambuzi wa msingi wa BC/DAgger upo katika {cite}`ross2011reduction`. MaxEnt IRL inatoka kwa {cite}`ziebart2008maximum`. GAIL inatoka kwa {cite}`ho2016generative`. Kwa mapitio ya kina ya kujifunza kwa kuiga, angalia {cite}`osa2018algorithmic`.
```
