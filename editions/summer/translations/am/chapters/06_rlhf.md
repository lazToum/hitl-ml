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

# ከሰው ግብረ-መልስ የሚገኝ ማጠናከሪያ ትምህርት

HITL ML ዋናቱ ሁሉ ሲያደርስ ሁሉ ምንም ቴክኒኩ ከሰው ግብረ-መልስ ማጠናከሪያ ትምህርት (RLHF) ሁሉ ሰፊ ሠርቷል። InstructGPT {cite}`ouyang2022training` ሁሉ ዘዴው ነው እናም ዘመናዊ ትልቅ ቋንቋ ሞዴሎቹ ሁሉ ብዙ ሁሉ ትዕዛዝ-ተፈጻሚ ቧምቧዎቹ ዋናቱ ክፍሉ {cite}`stiennon2020learning`። RLHF ሊረዱ — ሊከተሉ ቁርጥ ሁሉ ብቻ ሳይሆን ጥምረቱ ሁሉ ዋናቱ አቀራረቡ ሆኖ — ዘመናዊ AI ሁሉ ሚሰሩ ሁሉ ሁሉ አስፈላጊ ነው።

---

## የጥምረቱ ችግሩ

ሙሉ ቀጣዩ-ቶኬን ትንቢቱ ሁሉ ሰለጠኑ ትልቅ ቋንቋ ሞዴሎቹ (LLMs) ምትክ ዓላማቸው ሙሉ ሊሻሻሉ ይዟሉ፦ ሰው ሰሪ ጽሑፍ ዝርዝሩ ሁሉ ቀጣዩ ምን ጽሑፍ ሊሆን ሊናገሩ። ይህ ዓላማቸው ሙሉ ዕውን ሙሉ ሊፈልጉ ሁሉ ጋር ዝምዝምቱ ዝምዝምቱ ነው ግን ልዩ ነው፦ ጠቃሚ፣ ትክክለኛ፣ ደህና፣ እናም ሰው እሴቶቹ ጋር ጥምረቱ ያለ ምላሾቹ።

ስልጠናቸው ዓላማቸው እና ሚፈልጉ ባሕሪ መካከሉ አለ-ሰምምነቱ **የጥምረቱ ችግሩ** {cite}`russell2019human` ሰለሚሉ። ቀጥተኛ ሁኔታ፣ ኢንተርኔቱ ጽሑፍ ሁሉ ሰለጠነ ቋንቋ ሞዴሉ ሊማሩ ይዟሉ፦
- ሊቀጥሉ ሚሰሙ ቀጣዮቹ ሊሰጡ (ሐቁ ስህተቱ ሊሆን ይዟሉ)
- ስልጠናቸው ውሂቡ ሙሉ ያሉ አድልዎዎቹ እና ጉዳቶቹ ሊያስተጋቡ
- ስታቲስቲካዊ ሁኔታ ፕሮምፕቱ ሲከተሉ ይህ ሙሉ ሲሆን ሊሸሹ ወይም ሊዘዋወሩ

RLHF ሰው ምርጫዎቹ *ሻሻሉ ዓላማቸው ክፍሉ* ሙሉ ሙሉ ሆኖ ጥምረቱ ሊዳርሱ ይዟሉ።

---

## RLHF ቧምቧው

RLHF ሦስቱ ደረጃዎቹ ሁሉ ሚሄዱ ናቸው፦

```text
ደረጃ 1፦ ቁጥጥሩ ዳግም ቅልምጫ (SFT)
  --> ምሳሌ ውሂቡ ሰብስቡ (ሰው ምሳሌ ምላሾቹ ሲጽፉ)
  --> ምሳሌዎቹ ሁሉ ዋናቱ LLM ዳግም ቅልምጡ

ደረጃ 2፦ ዋጋ ሞዴሉ ስልጠናቸው
  --> ጥምር ምርጫዎቹ ሰብስቡ (ሰው A ወ. B ደረጃ ሰጠ)
  --> ሰው ምርጫዎቹ ሊናገሩ ዋጋ ሞዴሉ R(x, y) ሰልጥን

ደረጃ 3፦ RL ዳግም ቅልምጫ
  --> PPO/RL ሁሉ R(x, y) ሊሳካ LLM ዳግም ቅልምጡ
  --> KL ቅጣቱ SFT ሞዴሉ ሁሉ ሰፊ ሊሄዱ ሊቀንሱ ያደርጋሉ
```

### ደረጃ 1፦ ቁጥጥሩ ዳግም ቅልምጫ

ቀደምቱ ሰለጠነ ዋናቱ ሞዴሉ $\pi_0$ ሁሉ ሲጀምሩ፣ ዝርዝር መምሪያዎቹ ሚከተሉ ሰው ሠሪዎቹ ሙሉ ሰለጠኑ ወይም ሙሉ ሚምርጡ (ፕሮምፕቱ፣ ምሳሌ ምላሹ) ቡድኖቹ ውሂቡ ሰበሰቡ። ሞዴሉ ምናምን ክሮስ-ኤንትሮፒ ሁሉ እነዚህ ምሳሌዎቹ ሙሉ ዳግም ሰለጠነ፦

$$
\mathcal{L}_\text{SFT}(\theta) = -\mathbb{E}_{(x, y) \sim \mathcal{D}_\text{demo}} \left[ \log \pi_\theta(y \mid x) \right]
$$

SFT ሞዴሉ $\pi_\text{SFT}$ ዲያው ቀደምቱ ሰለጠነ ሞዴሉ ሁሉ RLHF ሙሉ ሰፊ ጥሩ ጅምሩ ነው።

### ደረጃ 2፦ ዋጋ ሞዴሉ ስልጠናቸው

ፕሮምፕቶቹ $\{x_i\}$ ስብስቡ ሁሉ፣ $\pi_\text{SFT}$ ሁሉ ፕሮምፕቱ ሁሉ $K$ ምላሾቹ ሰጥቶ ለሰው ሰጪዎቹ ጥምር ንጽጽሮቹ ሆኖ ሊያቀርቡ ይዟሉ፦ "ምን ምላሹ ጥሩ ነው፣ A ወ. B?"

ዋጋ ሞዴሉ $r_\phi$ እነዚህ ምርጫዎቹ ሊናገሩ ሰልጥኖ ይዟሉ። **ብራድሊ-ቴሪ** ሞዴሉ (ምዕራፍ 8) ሁሉ፣ ምላሹ $y_w$ ሙሉ $y_l$ ሁሉ ሚምረጡ ምናምን ነው፦

$$
P(y_w \succ y_l \mid x) = \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)
$$

ዋጋ ሞዴሉ ጥምር ደረጃ ኪሳራ ሙሉ ሊቀንሱ ሰልጥኖ ይዟሉ፦

$$
\mathcal{L}_\text{RM}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_\text{pref}} \left[ \log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) \right]
$$

ዋጋ ሞዴሉ ብዙ ጊዜ የመጨረሻ ሽፋኑ ሁሉ ስካላር ራሱ ሊቀይሩ SFT ሞዴሉ ሁሉ ሊጀምሩ ይዟሉ።

### ደረጃ 3፦ PPO ሁሉ RL ዳግም ቅልምጫ

ሰለጠነ ዋጋ ሞዴሉ ሲሰጥ፣ LLM ዳግም ሊቅልምጡ ማጠናከሪያ ትምህርቱ ሊጠቀሙ ይዟሉ። እያንዳንዱ ፕሮምፕቱ $x$ ሁኔታ ነው፤ እያንዳንዱ ምላሹ $y$ ቶኬን ምርጫዎቹ ዙሩ ነው፤ ዋጋቸው $r_\phi(x, y)$ ነው።

ሻሻሉ ዓላማቸው ሞዴሉ SFT ዋናቱ ሁሉ ሰፊ ሊወጡ ሊቀንሱ **KL ልዩ ርቀቱ ቅጣቱ** ያካትታሉ (ዋጋ ሃኪንጉ ሊፈጥሩ {cite}`krakovna2020specification,gao2023scaling`)፦

$$
\max_\theta \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot | x)} \left[ r_\phi(x, y) - \beta \cdot \text{KL}\left[\pi_\theta(\cdot \mid x) \| \pi_\text{SFT}(\cdot \mid x)\right] \right]
$$

$\beta$ ፓራሜትሩ KL ቅጣቱ ኃይሉ ሊቆጣጠሩ ይዟሉ። አነስ $\beta$ ሰፊ ሻሻሉ ሊፈቅዱ ግን ዋጋ ሃኪንጉ አደጋ ሊሆን ይዟሉ፤ ትልቅ $\beta$ ሞዴሉ SFT ቅርቡ ሊይዙ ግን ጥምረቱ ጥቅሞቹ ሊወስኑ ይዟሉ።

**ቅርቡ ፖሊሲ ሻሻሉ (PPO)** {cite}`schulman2017proximal` ዲያው ፖሊሲ ግሬዲዬንቱ ዘዴዎቹ ሁሉ ሁሉ ዋናቱ ሊሆን ምክንያቱ ሆኖ ይህ ደረጃ ሙሉ ምናምን ቀመሩ ነው።

---

## ቀላሉ RLHF ምሳሌ

ሙሉ RLHF ቧምቧው ሰፊ-ደረጃ መሠረተ-ልማቶቹ ይፈልጋሉ። ቀጣዩ ምሳሌ ዋናቱ ሃሳቦቹ አነስ ደረጃ ሁሉ ሊያሳዩ ይዟሉ።

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

## RLHF ሁሉ ፈተናዎቹ

### ዋጋ ሃኪንጉ

ዋናቱ ውድቀቱ ዓይነቱ፦ ፖሊሲው ዕውን ጥሩ ባሕሪ ሳይሆን ዋጋ ሞዴሉ ሁሉ ሰፊ ዋጋ ሊያገኙ ዘዴዎቹ ሊያገኙ ይዟሉ። ለምሳሌ፣ LLM ትክክለኛ ሳይሆን አወዳዳሪ ወይም ዕርግጠኛ ሆኖ ሚሰሙ ምላሾቹ (ሰጪዎቹ ሰፊ ደረጃ ሊሰጡ ዝቅ ናቸው) ሊሰጡ ሊማሩ ይዟሉ።

ዋጋ ሃኪንጉ ሁሉ ሰፊ ሲሆን፦
- ዋጋ ሞዴሉ በቂ ያልሆነ ምርጫ ውሂቡ ሁሉ ሰለጠነ
- ፖሊሲው SFT ዋናቱ ሁሉ ሰፊ ሊወጡ ፈቃድ ሰጠ (አነስ $\beta$)
- ዋጋ ሞዴሉ ስርጭቱ PPO ስልጠናቸው ሁሉ ሊቀይሩ ሄዳሉ

**ቅነሳ ስልቶቹ፦** KL ቅጣቱ፣ ተሳቻ ዋጋ ሞዴሉ ስልጠናቸው፣ ልዩ ምዘናቸው፣ ሕገ-ዋናቱ AI ቁጥጥሮቹ።

### ሰጪ አድልዎ

ሰው ሰጪዎቹ ሥርዓታዊ አድልዎዎቹ አሏቸው። ረዥም ምላሾቹ (ድምጹ አድልዎ)፣ ዕርግጠኛ ሆኖ ሚሰሙ ጽሑፍ (ዕርግጠኛነቱ አድልዎ)፣ እናም ቀደምቱ እምነቶቻቸው ሁሉ ሚስማሙ ምላሾቹ ሊምርጡ ዝቅ ናቸው። እነዚህ አድልዎዎቹ ዋጋ ሞዴሉ ሁሉ ሊሄዱ ይዟሉ።

ዝነኛ RLHF ሞዴሎቹ ሁሉ ተድሊዎ ውድቀቱ — ሞዴሉ ሐቁ ሳይሆን ተጠቃሚዎቹ ሊሰሙ ሚፈልጉ ሁሉ ሲናገሩ — ከፊሉ ሰጪዎቹ ምርጫ ሁሉ ስምምነቱ ምናምን ምርጫ ምክንያቱ ነው።

### ሊሰፋፋ ሊሆን ቁጥጥሩ

ቸር ሥራዎቹ ሁሉ ሰዎቹ ምን AI ምላሹ ትክክለኛ ሊሆን ዕርግጠኛ ሊሆን አይዟሉ። ሁለቱ ረዥም ሒሳባዊ ምርምሮቹ ወይም ሁለቱ ኮድ ሙሉ ሊወዳደሩ ሰጪ ትክክለኛነቱ ሳይሆን ሊነበቡ ምናምን ሊምርጡ ይዟሉ። **ሊሰፋፋ ሊሆን ቁጥጥሩ** ሥራ ቸርነቱ ሲያድጉ ምዘናቸው ሂደቶቹ ሊታመኑ ሆነው ሲቆዩ ዲዛይን ሊሠሩ ሙሉ ምርምሩ ጥያቄው ነው {cite}`bowman2022measuring`።

---

## ሕገ-ዋናቱ AI (RLAIF)

**ሕገ-ዋናቱ AI** {cite}`bai2022constitutional`፣ አንትሮፒካ ሁሉ ዳረሱ፣ AI ሙሉ ሰው ሰጪዎቹ ሁሉ ሙሉ ተመሰርቶ ዋናዎቹ ስብስቡ (ሰለምሳሌ "ሕገ-ዋናቱ") ሁሉ ምርጫ መለያዎቹ ሊሰጡ AI ራሱ ሊጠቀሙ ሰው ሰጪዎቹ ሁሉ ሙሉ ሙሉ ሁሉ ይቀنሳሉ። ሂደቱ፦

1. ሊጎዱ ፕሮምፕቶቹ ሁሉ ምላሾቹ ሰጠ
2. ሕጋዊ ዋናዎቹ ሙሉ ምላሾቹ ሊምዝኑ AI ሆኔታ ሊጠቀሙ
3. AI ግብረ-መልሱ ሁሉ (RLAIF — AI ግብረ-መልሱ ሁሉ RL) ምላሾቹ ሊሻሻሉ
4. AI-ሰሪ ምርጫዎቹ ሁሉ ዋጋ ሞዴሉ ሰልጥን
5. ይህ ዋጋ ሞዴሉ ሁሉ RLHF ዳግም ቅልምጡ

RLAIF ሰው ትርጓሜ ሁሉ ሰፊ ደረጃ ሙሉ ምርጫ ውሂቡ ሊሰጡ ይዟሉ፣ እናም ዋጋ ሞዴሉ ሁሉ ሰለጠኑ እሴቶቹ ዋናቱ ቁጥጥሩ ሊሰጡ ይዟሉ።

```{seealso}
ቀደምቱ InstructGPT ወረቀቱ {cite}`ouyang2022training` LLMs ሁሉ RLHF ሁሉ ሰፊ ተጨባጭ ሙሉ ሙሉ ሊያሳዩ ይዟሉ። ጥልቅ RL ሁሉ ዋናቱ RLHF ሥራ {cite}`christiano2017deep` ነው። PPO {cite}`schulman2017proximal` ሁሉ ሊዳስሱ ይዟሉ። ሕገ-ዋናቱ AI {cite}`bai2022constitutional` ሁሉ ነው።
```
