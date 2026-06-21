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

# Koyon Ta Karfafawa daga Ra'ayin Dan Adam

Babu wata dabara da ta fi kawo HITL ML cikin babbar hanya fiye da Koyon Ta Karfafawa daga Ra'ayin Dan Adam (RLHF). Shi ne hanyar da ke bayan InstructGPT {cite}`ouyang2022training` da wani ɓangare na farko na tsarin bin umarni a cikin manyan samfurin harshe na zamani da yawa {cite}`stiennon2020learning`. Fahimtar RLHF — ba kawai a matsayin mai jita-jita don bi ba, amma a matsayin hanyar ƙa'ida ga daidaitawa — yana da muhimmanci ga kowa da ke aiki a AI na zamani.

---

## Matsalar Daidaitawa

Manyan samfurin harshe (LLMs) da aka horar kawai akan hasashen alamar gaba suna inganta don manufar wakili: yi hasashe a abin da rubutu ke zuwa gaba a rukunin rubutu na dan adam. Wannan manufa ta alaƙa da, amma ta bambanta da, abin da muke nufin gaske: amsoshi masu taimako, daidai, amintacce, kuma dacewa da ƙimar dan adam.

Rashin daidaito tsakanin manufar horarwa da ɗabi'ar da ake so ana kiransa **matsalar daidaitawa** {cite}`russell2019human`. Musamman, samfuri na harshe da aka horar akan rubutu na yanar gizo yana koyon:
- Samar da ci gaba mai kama da gaskiya (wanda na iya kasancewa ba daidai ba ta gaskiya)
- Nuna nuna son zuciya da cutarwa da ke cikin bayanin horarwa
- Kasancewa mai sauƙin guduwa ko mai yaudarar lokacin da wannan shine abin da ya biyo bayan tambayar ta lissafi

RLHF yana magance daidaitawa ta sanya fifikon dan adam *wani ɓangare na manufar inganta*.

---

## Tsarin RLHF

RLHF yana gudana a matakai uku:

```text
Mataki na 1: Daidaita Supervised (SFT)
  --> Tattara bayanin misali (dan adam yana rubuta amsoshi mafi kyau)
  --> Daidaita LLM na tushe akan misalai

Mataki na 2: Horarwa ta Samfurin Lada
  --> Tattara fifiko biyu biyu (dan adam yana kimanta A da B)
  --> Horar da samfurin lada R(x, y) don hasashen fifikon dan adam

Mataki na 3: Daidaita RL
  --> Daidaita LLM ta amfani da PPO/RL don inganta R(x, y)
  --> Hukuncin KL yana hana tafiya mai nisa daga samfurin SFT
```

### Mataki na 1: Daidaita Supervised

Farawa daga samfuri na tushe da aka horar a baya $\pi_0$, muna tattara saitin bayanai na (tambaya, mafi kyau amsa) biyu, da masu kwangila na dan adam waɗanda suka bi jagoran cikakku. Ana daidaita samfuri akan waɗannan misalai ta amfani da cross-entropy na yau da kullum:

$$
\mathcal{L}_\text{SFT}(\theta) = -\mathbb{E}_{(x, y) \sim \mathcal{D}_\text{demo}} \left[ \log \pi_\theta(y \mid x) \right]
$$

Samfurin SFT $\pi_\text{SFT}$ farawa mafi kyau ce don RLHF fiye da samfuri na tushe mentah.

### Mataki na 2: Horarwa ta Samfurin Lada

Don saitin tambayoyi $\{x_i\}$, muna ƙirƙira $K$ amsoshi kowace tambaya ta amfani da $\pi_\text{SFT}$ kuma mun gabatar da su ga masu sanya lakabi dan adam a matsayin kwatancen biyu biyu: "Wane amsa ya fi, A ko B?"

Ana horar da samfurin lada $r_\phi$ don hasashen waɗannan fifiko. Ƙarƙashin tsarin **Bradley-Terry** (Babi na 8), iya yiwuwar cewa amsa $y_w$ an fi so da $y_l$ ita ce:

$$
P(y_w \succ y_l \mid x) = \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)
$$

Ana horar da samfurin lada don rage asarar jeri biyu biyu:

$$
\mathcal{L}_\text{RM}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_\text{pref}} \left[ \log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) \right]
$$

Ana farawa da samfurin lada daga samfurin SFT tare da kai scalar wanda ya maye gurbin saman ta ƙarshe.

### Mataki na 3: Daidaita RL tare da PPO

Tare da samfurin lada da aka horar, muna iya amfani da koyon ƙarfafawa don daidaita LLM. Kowane tambaya $x$ yanayi ne; kowane amsa $y$ hanya ce ta zaɓuɓɓukan alamar; kuma ladan shine $r_\phi(x, y)$.

Manufar inganta ta haɗa da **hukunci na KL divergence** don hana samfuri daga tafiya mai nisa daga tushen SFT (wanda zai haifar da hacking lada {cite}`krakovna2020specification,gao2023scaling`):

$$
\max_\theta \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot | x)} \left[ r_\phi(x, y) - \beta \cdot \text{KL}\left[\pi_\theta(\cdot \mid x) \| \pi_\text{SFT}(\cdot \mid x)\right] \right]
$$

Sinadarin $\beta$ yana sarrafa ƙarfin hukuncin KL. Ƙaramin $\beta$ yana ba da damar inganta fiye da kima amma yana hadari hacking lada; babban $\beta$ yana sanya samfuri kusa da SFT amma yana iyakance riba ta daidaitawa.

**Inganta Manufar Kusan (PPO)** {cite}`schulman2017proximal` shine algorithm na yau da kullum don wannan mataki, an zaɓa don daidaitarsa dangane da hanyoyin gradient na manufa mentah.

---

## Nuni na Sauƙi na RLHF

Tsarin cikakke na RLHF yana buƙatar ababen more rayuwar mafi sikeli. Misali mai zuwa yana nuna ra'ayoyin muhimmanci a ƙaramin sikeli.

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

## Kalubale a RLHF

### Hacking Lada

Gazawar muhimmanci: manufar yana nemo hanyoyin samun lada mai ƙari daga samfurin lada waɗanda ba su dace da ɗabi'ar mai kyau gaske ba. Misali, LLM na iya koyon samar da amsoshi masu yabo ko masu haƙiƙa (waɗanda masu sanya lakabi galibi suna ƙididdiga mafi ƙari) maimakon daidai.

Hacking lada yana yiwuwa fiye da kima lokacin da:
- Ana horar da samfurin lada akan bayanin fifiko ƙasa da isa
- Ana ba da damar manufa ta tafiya mai nisa daga tushen SFT (ƙaramin $\beta$)
- Rarrabawar samfurin lada tana canzawa a lokacin horarwar PPO

**Dabarun rage:** Hukunci KL, horarwar samfurin lada mai sake zagaye, kimantawa iri-iri, ƙuntatawa na AI na tsarin mulki.

### Nuna Son Zuciya na Mai Kimantawa

Masu sanya lakabi dan adam suna da nuna son zuciya ta tsari. Suna fifiko da amsoshi mafi tsawo (nuna son zuciya ga yawa), rubutu mai kama amincewar (nuna son zuciya ga amincewar), da amsoshi waɗanda suka yarda da imaninsu na baya. Waɗannan nuna son zuciya suna yada cikin samfurin lada.

Gazawar sycophancy da aka fi sani na samfurin RLHF — inda samfuri ke gaya wa masu amfani abin da suke son ji maimakon abin da ya kasance gaskiya — a wani ɓangare sakamakon fifikon mai kimantawa don amsoshi masu jituwa ne.

### Kulawa Mai Sikeli

Don ayyuka masu rikitarwa, dan adam ba zai iya kimanta da aminci wane amsa AI ya fi daidai ba. Mai sanya lakabi da ke kwatanta shaidun lissafi mafi tsawo biyu ko aiwatarwa biyu na lambar na iya kawai zaɓar mai ƙarin karatu, ba tare da la'akari da daidaito ba. **Kulawa mai sikeli** ita ce matsalar bincike buɗaɗɗe na tsara hanyoyin kimantawa waɗanda suke zama amintacce yayin da rikitarwar aiki ke ƙaruwa {cite}`bowman2022measuring`.

---

## AI na Tsarin Mulki (RLAIF)

**AI na Tsarin Mulki** {cite}`bai2022constitutional`, da aka haɓaka a Anthropic, yana rage dogaro akan masu sanya lakabi dan adam ta amfani da AI kansa don ƙirƙira lakabin fifiko mai jagora ta saitin ƙa'idoji (wani "tsarin mulki"). Tsari:

1. Ƙirƙira amsoshi ga tambayoyin masu iya cutar
2. Yi amfani da mai sukar AI don kimanta amsoshi ƙarƙashin ƙa'idojin tsarin mulki
3. Gyara amsoshi mai jagora ta ra'ayin AI (RLAIF — RL daga Ra'ayin AI)
4. Horar da samfurin lada akan fifikon da AI ya ƙirƙira
5. Daidaita tare da RLHF ta amfani da wannan samfurin lada

RLAIF zai iya ƙirƙira bayanin fifiko a sikeli mafi girma fiye da sanya lakabi dan adam, kuma yana ba da damar sarrafa ɗan ƙarami akan ƙimomi da aka ɓoye a cikin samfurin lada.

```{seealso}
Takarda ta asali ta InstructGPT {cite}`ouyang2022training` tana bayyana amfani na farko na mafi sikeli na RLHF ga LLMs. Aikin RLHF na asali don RL mai zurfi shine {cite}`christiano2017deep`. An bayyana PPO a cikin {cite}`schulman2017proximal`. AI na tsarin mulki daga {cite}`bai2022constitutional`.
```
