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

# Ujifunzaji wa Kuimarisha kutoka kwa Maoni ya Binadamu

Hakuna mbinu iliyofanya zaidi kuleta HITL ML kwenye mkondo mkuu kuliko Ujifunzaji wa Kuimarisha kutoka kwa Maoni ya Binadamu (RLHF). Ndiyo njia nyuma ya InstructGPT {cite}`ouyang2022training` na sehemu kuu ya mifumo ya kufuata maelekezo katika mifano mingi ya kisasa ya lugha kubwa {cite}`stiennon2020learning`. Kuelewa RLHF — si kama njia ya kufuata tu, bali kama mbinu ya msingi ya upatanisho — ni muhimu kwa kila mtu anayefanya kazi katika AI ya kisasa.

---

## Tatizo la Upatanisho

Mifano mikubwa ya lugha (LLMs) iliyofunzwa peke yake kwenye utabiri wa tokeni inayofuata inaboresha kwa lengo la wakala: tabiri maandishi gani yanafuata katika mkusanyiko wa maandishi yaliyoandikwa na binadamu. Lengo hili linahusiana na, lakini linatofautiana na, tunachotaka kweli: majibu yanayosaidia, sahihi, salama, na yaliyopatanishwa na maadili ya binadamu.

Kutofautiana kati ya lengo la mafunzo na tabia inayotakiwa huitwa **tatizo la upatanisho** {cite}`russell2019human`. Kwa mwonekano halisi, mfano wa lugha uliofunzwa kwenye maandishi ya mtandao hujifunza:
- Kutoa matoleo yanayosikika yanayokubalika (ambayo yanaweza kuwa mabaya kiukweli)
- Kuakisi upendeleo na madhara yaliyopo katika data ya mafunzo
- Kuepuka au kudanganya wakati hii ndiyo kinachofuata maswali kwa takwimu

RLHF inashughulikia upatanisho kwa kufanya mapendeleo ya binadamu *sehemu ya lengo la uboreshaji*.

---

## Mfumo wa RLHF

RLHF inaendelea katika hatua tatu:

```text
Hatua ya 1: Kurekebisha Fini kwa Usimamizi (SFT)
  --> Kusanya data ya maonyesho (binadamu anaandika majibu bora)
  --> Kurekebisha fini LLM ya msingi kwenye maonyesho

Hatua ya 2: Mafunzo ya Mfano wa Zawadi
  --> Kusanya mapendeleo ya jozi (binadamu anipanga A dhidi ya B)
  --> Funza mfano wa zawadi R(x, y) kutabiri mapendeleo ya binadamu

Hatua ya 3: Kurekebisha Fini kwa RL
  --> Kurekebisha fini LLM kwa kutumia PPO/RL ili kuongeza juu R(x, y)
  --> Adhabu ya KL inazuia kupotoka kupita kiasi kutoka kwa mfano wa SFT
```

### Hatua ya 1: Kurekebisha Fini kwa Usimamizi

Kuanzia na mfano wa msingi uliofunzwa awali $\pi_0$, tunakusanya mkusanyiko wa jozi za (maswali, jibu bora), zilizoandikwa au kuchaguliwa na wakandarasi wa binadamu wanaofuata mwongozo wa kina. Mfano unaboreshwa fini kwenye maonyesho haya kwa kutumia entropy iliyovuka ya kawaida:

$$
\mathcal{L}_\text{SFT}(\theta) = -\mathbb{E}_{(x, y) \sim \mathcal{D}_\text{demo}} \left[ \log \pi_\theta(y \mid x) \right]
$$

Mfano wa SFT $\pi_\text{SFT}$ ni hatua bora zaidi ya kuanza kwa RLHF kuliko mfano ghafi uliofunzwa awali.

### Hatua ya 2: Mafunzo ya Mfano wa Zawadi

Kwa seti ya maswali $\{x_i\}$, tunazalisha majibu $K$ kwa swali kila moja kwa kutumia $\pi_\text{SFT}$ na kuwasilisha kwa wawekaji lebo wa binadamu kama ulinganisho wa jozi: "Jibu gani ni bora, A au B?"

Mfano wa zawadi $r_\phi$ unafunzwa kutabiri mapendeleo haya. Chini ya mfano wa **Bradley-Terry** (Sura ya 8), uwezekano kwamba jibu $y_w$ linapendelewa kuliko $y_l$ ni:

$$
P(y_w \succ y_l \mid x) = \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)
$$

Mfano wa zawadi unafunzwa kupunguza hasara ya upangaji wa jozi:

$$
\mathcal{L}_\text{RM}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_\text{pref}} \left[ \log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) \right]
$$

Mfano wa zawadi kawaida huanzishwa kutoka kwa mfano wa SFT na kichwa cha nambari kinachobadilisha safu ya mwisho.

### Hatua ya 3: Kurekebisha Fini kwa RL kwa PPO

Na mfano wa zawadi uliofunzwa, tunaweza kutumia ujifunzaji wa kuimarisha kurekebisha fini LLM. Kila swali $x$ ni hali; kila jibu $y$ ni mfululizo wa uchaguzi wa tokeni; na zawadi ni $r_\phi(x, y)$.

Lengo la uboreshaji linajumuisha **adhabu ya kupotoka kwa KL** kuzuia mfano usipotoke mbali sana kutoka kwa msingi wa SFT (ambao ungesababisha udanganyifu wa zawadi {cite}`krakovna2020specification,gao2023scaling`):

$$
\max_\theta \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot | x)} \left[ r_\phi(x, y) - \beta \cdot \text{KL}\left[\pi_\theta(\cdot \mid x) \| \pi_\text{SFT}(\cdot \mid x)\right] \right]
$$

Kigezo $\beta$ kinasimamia nguvu ya adhabu ya KL. $\beta$ ndogo inaruhusu uboreshaji zaidi lakini inaweza kusababisha udanganyifu wa zawadi; $\beta$ kubwa inaweka mfano karibu na SFT lakini inapunguza faida za upatanisho.

**Uboreshaji wa Sera ya Karibu (PPO)** {cite}`schulman2017proximal` ndiyo kanuni ya kawaida kwa hatua hii, iliyochaguliwa kwa uthabiti wake ukilinganishwa na mbinu ghafi za gradient ya sera.

---

## Onyesho Lililorahisishwa la RLHF

Mfumo kamili wa RLHF unahitaji miundombinu ya kiwango kikubwa. Mfano ufuatao unaonyesha mawazo muhimu kwa kiwango kidogo.

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.nn import functional as F

torch.manual_seed(42)
rng = np.random.default_rng(42)

# -----------------------------------------------
# Toy setup: responses are 4-dimensional vectors
# "Quality" is known analytically (sum of positive values)
# We simulate a reward model learning this from pairwise feedback
# -----------------------------------------------

class RewardModel(nn.Module):
    def __init__(self, d=4, hidden=32):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden), nn.ReLU(),
            nn.Linear(hidden, 1)
        )
    def forward(self, x):
        return self.net(x).squeeze(-1)

def true_quality(x):
    """The hidden ground-truth reward function."""
    return x.sum(dim=-1) + 0.5 * (x ** 2).mean(dim=-1)

# Generate pairwise preference data
N_PAIRS = 500
X1 = torch.randn(N_PAIRS, 4)
X2 = torch.randn(N_PAIRS, 4)
q1, q2 = true_quality(X1), true_quality(X2)
# Human prefers X1 when q1 > q2 (with some noise)
noise = torch.randn(N_PAIRS) * 0.5
preferred_1 = ((q1 - q2 + noise) > 0).float()

# Train reward model
rm = RewardModel(d=4, hidden=32)
optimizer = optim.Adam(rm.parameters(), lr=3e-3)

losses = []
for epoch in range(200):
    r1 = rm(X1)
    r2 = rm(X2)
    # Bradley-Terry loss
    logit = r1 - r2
    loss = F.binary_cross_entropy_with_logits(logit, preferred_1)
    optimizer.zero_grad(); loss.backward(); optimizer.step()
    losses.append(loss.item())

# Evaluate: does the reward model agree with true quality?
X_eval = torch.randn(1000, 4)
with torch.no_grad():
    r_pred = rm(X_eval).numpy()
    r_true = true_quality(X_eval).numpy()

corr = np.corrcoef(r_pred, r_true)[0, 1]
print(f"Reward model correlation with true quality: {corr:.4f}")
print(f"Final training loss: {losses[-1]:.4f}")

import matplotlib.pyplot as plt
plt.figure(figsize=(8, 3))
plt.subplot(1, 2, 1)
plt.plot(losses, color='#2b3a8f', linewidth=1.5)
plt.xlabel("Epoch"); plt.ylabel("Pairwise loss")
plt.title("Reward Model Training")

plt.subplot(1, 2, 2)
plt.scatter(r_true[:200], r_pred[:200], alpha=0.4, s=15, color='#2b3a8f')
plt.xlabel("True quality"); plt.ylabel("Predicted reward")
plt.title(f"Reward Model vs. Truth (r={corr:.3f})")
plt.tight_layout()
plt.savefig('reward_model.png', dpi=150)
plt.show()
```

---

## Changamoto katika RLHF

### Udanganyifu wa Zawadi

Hali muhimu ya kushindwa: sera inapata njia za kupata zawadi kubwa kutoka kwa mfano wa zawadi ambazo hazilingani na tabia nzuri kweli. Kwa mfano, LLM inaweza kujifunza kutoa majibu yanayopendeza au yaliyosemwa kwa ujasiri (ambayo wawekaji lebo huwa huyapanga vizuri) badala ya sahihi.

Udanganyifu wa zawadi una uwezekano zaidi wakati:
- Mfano wa zawadi unafunzwa kwa data haba ya mapendeleo
- Sera inaruhusiwa kupotoka mbali kutoka kwa msingi wa SFT ($\beta$ ndogo)
- Usambazaji wa mfano wa zawadi unahamia wakati wa mafunzo ya PPO

**Mikakati ya kupunguza:** Adhabu ya KL, mafunzo ya mzunguko wa mfano wa zawadi, tathmini mbalimbali, vikwazo vya AI ya kikatiba.

### Upendeleo wa Tathmini

Wawekaji lebo wa binadamu wana upendeleo wa kimfumo. Huwa wanapendelea majibu marefu (upendeleo wa maneno mengi), maandishi yanayosikika ya ujasiri zaidi (upendeleo wa ujasiri), na majibu yanayokubaliana na imani zao za awali. Upendeleo huu unaenea katika mfano wa zawadi.

Kushindwa kwa umaarufu wa sycophancy kwa mifano ya RLHF — ambapo mfano humwambia mtumiaji anachotaka kusikia badala ya kinachoukweli — ni kwa sehemu matokeo ya upendeleo wa tathmini wa majibu ya kukubaliana.

### Usimamizi unaoweza Kupanuka

Kwa kazi ngumu, binadamu hawawezi kupanga ipasavyo jibu gani la AI ni sahihi. Mweka lebo anayelinganisha uthibitisho mrefu wa hisabati au utekelezaji mbili za msimbo anaweza kuchagua rahisi zaidi kusomeka, bila kujali usahihi. **Usimamizi unaoweza kupanuka** ni tatizo la utafiti wazi la kubuni taratibu za tathmini ambazo zinabaki za kutegemewa kadri ugumu wa kazi unavyoongezeka {cite}`bowman2022measuring`.

---

## AI ya Kikatiba (RLAIF)

**AI ya Kikatiba** {cite}`bai2022constitutional`, iliyotengenezwa katika Anthropic, inapunguza kutegemea wawekaji lebo wa binadamu kwa kutumia AI yenyewe kuzalisha lebo za mapendeleo zilizoongozwa na seti ya kanuni ("katiba"). Mchakato:

1. Zalisha majibu kwa maswali yanayoweza kudhuru
2. Tumia msomaji wa AI tathmini majibu dhidi ya kanuni za kikatiba
3. Rekebisha majibu yaliyoongozwa na maoni ya AI (RLAIF — RL kutoka kwa Maoni ya AI)
4. Funza mfano wa zawadi kwenye mapendeleo yaliyozalishwa na AI
5. Rekebisha fini kwa RLHF kwa kutumia mfano huu wa zawadi

RLAIF inaweza kuzalisha data ya mapendeleo kwa kiwango kikubwa zaidi sana kuliko uwekaji lebo wa binadamu, na inaruhusu udhibiti wa kina wa maadili yaliyowekwa katika mfano wa zawadi.

```{seealso}
Makala asili ya InstructGPT {cite}`ouyang2022training` inaelezea utumiaji wa kwanza wa kiwango kikubwa wa RLHF kwa LLMs. Kazi ya msingi ya RLHF kwa RL ya kina ni {cite}`christiano2017deep`. PPO imeelezwa katika {cite}`schulman2017proximal`. AI ya Kikatiba inatoka kwa {cite}`bai2022constitutional`.
```
