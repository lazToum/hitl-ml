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

# मानव प्रतिक्रिया से प्रबलन अधिगम

HITL ML को मुख्यधारा में लाने के लिए किसी तकनीक ने मानव प्रतिक्रिया से प्रबलन अधिगम (RLHF) से अधिक काम नहीं किया है। यह InstructGPT {cite}`ouyang2022training` के पीछे का तंत्र है और कई आधुनिक बड़े भाषा मॉडलों में निर्देश-अनुसरण पाइपलाइनों का एक मुख्य घटक है {cite}`stiennon2020learning`। RLHF को समझना — केवल पालन की जाने वाली एक रेसिपी के रूप में नहीं, बल्कि संरेखण के लिए एक सिद्धांतसम्मत दृष्टिकोण के रूप में — आधुनिक AI में काम करने वाले किसी भी व्यक्ति के लिए आवश्यक है।

---

## संरेखण समस्या

शुद्ध रूप से अगले-टोकन भविष्यवाणी पर प्रशिक्षित बड़े भाषा मॉडल (LLMs) एक प्रॉक्सी उद्देश्य के लिए अनुकूलन करते हैं: मानव-लिखित पाठ के एक कॉर्पस में आगे क्या आता है यह भविष्यवाणी करें। यह उद्देश्य उससे संबंधित है, लेकिन उससे अलग है, जो हम वास्तव में चाहते हैं: प्रतिक्रियाएँ जो सहायक, सटीक, सुरक्षित और मानव मूल्यों के साथ संरेखित हों।

प्रशिक्षण उद्देश्य और वांछित व्यवहार के बीच बेमेल को **संरेखण समस्या** {cite}`russell2019human` कहा जाता है। ठोस रूप से, इंटरनेट पाठ पर प्रशिक्षित एक भाषा मॉडल सीखता है:
- प्रशंसनीय-लगने वाली निरंतरताएँ उत्पन्न करना (जो तथ्यात्मक रूप से गलत हो सकती हैं)
- प्रशिक्षण डेटा में मौजूद पूर्वाग्रहों और नुकसानों को प्रतिबिंबित करना
- जब यह सांख्यिकीय रूप से प्रॉम्प्ट का अनुसरण करता हो तो टाल-मटोल या जोड़-तोड़ करना

RLHF मानव प्राथमिकताओं को *अनुकूलन उद्देश्य का हिस्सा* बनाकर संरेखण को संबोधित करता है।

---

## RLHF पाइपलाइन

RLHF तीन चरणों में आगे बढ़ता है:

```text
चरण 1: निर्देशित फाइन-ट्यूनिंग (SFT)
  --> प्रदर्शन डेटा एकत्र करें (मानव आदर्श प्रतिक्रियाएँ लिखते हैं)
  --> प्रदर्शनों पर बेस LLM को फाइन-ट्यून करें

चरण 2: पुरस्कार मॉडल प्रशिक्षण
  --> युगल प्राथमिकताएँ एकत्र करें (मानव A बनाम B रेट करता है)
  --> मानव प्राथमिकताओं का अनुमान लगाने के लिए पुरस्कार मॉडल R(x, y) प्रशिक्षित करें

चरण 3: RL फाइन-ट्यूनिंग
  --> R(x, y) को अधिकतम करने के लिए PPO/RL का उपयोग करके LLM को फाइन-ट्यून करें
  --> KL जुर्माना SFT मॉडल से अत्यधिक विचलन को रोकता है
```

### चरण 1: निर्देशित फाइन-ट्यूनिंग

पूर्व-प्रशिक्षित बेस मॉडल $\pi_0$ से शुरू करके, हम (प्रॉम्प्ट, आदर्श प्रतिक्रिया) जोड़ियों का डेटासेट एकत्र करते हैं, जो मानव ठेकेदारों द्वारा विस्तृत दिशानिर्देशों का पालन करते हुए लिखे या चुने जाते हैं। मॉडल को मानक cross-entropy का उपयोग करके इन प्रदर्शनों पर फाइन-ट्यून किया जाता है:

$$
\mathcal{L}_\text{SFT}(\theta) = -\mathbb{E}_{(x, y) \sim \mathcal{D}_\text{demo}} \left[ \log \pi_\theta(y \mid x) \right]
$$

### चरण 2: पुरस्कार मॉडल प्रशिक्षण

प्रॉम्प्ट के एक सेट $\{x_i\}$ के लिए, हम $\pi_\text{SFT}$ का उपयोग करके प्रति प्रॉम्प्ट $K$ प्रतिक्रियाएँ उत्पन्न करते हैं और उन्हें युगल तुलना के रूप में मानव लेबलर्स को प्रस्तुत करते हैं: "कौन सी प्रतिक्रिया बेहतर है, A या B?"

पुरस्कार मॉडल $r_\phi$ इन प्राथमिकताओं की भविष्यवाणी करने के लिए प्रशिक्षित है। **Bradley-Terry** मॉडल (अध्याय 8) के तहत, प्रतिक्रिया $y_w$ की $y_l$ से अधिक पसंद किए जाने की प्रायिकता है:

$$
P(y_w \succ y_l \mid x) = \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)
$$

### चरण 3: PPO के साथ RL फाइन-ट्यूनिंग

प्रशिक्षित पुरस्कार मॉडल के साथ, हम LLM को फाइन-ट्यून करने के लिए प्रबलन अधिगम का उपयोग कर सकते हैं। अनुकूलन उद्देश्य में एक **KL विचलन जुर्माना** शामिल है {cite}`krakovna2020specification,gao2023scaling`:

$$
\max_\theta \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot | x)} \left[ r_\phi(x, y) - \beta \cdot \text{KL}\left[\pi_\theta(\cdot \mid x) \| \pi_\text{SFT}(\cdot \mid x)\right] \right]
$$

**Proximal Policy Optimization (PPO)** {cite}`schulman2017proximal` इस चरण के लिए मानक एल्गोरिदम है।

---

## एक सरलीकृत RLHF प्रदर्शन

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

## RLHF में चुनौतियाँ

### पुरस्कार हैकिंग

एक प्रमुख विफलता मोड: नीति पुरस्कार मॉडल से उच्च पुरस्कार प्राप्त करने के तरीके खोजती है जो वास्तव में अच्छे व्यवहार के अनुरूप नहीं होते।

**शमन रणनीतियाँ:** KL जुर्माना, पुनरावृत्त पुरस्कार मॉडल प्रशिक्षण, विविध मूल्यांकन, संवैधानिक AI बाधाएँ।

### मूल्यांकक पूर्वाग्रह

मानव लेबलर्स के व्यवस्थित पूर्वाग्रह होते हैं। वे लंबी प्रतिक्रियाएँ (वाचालता पूर्वाग्रह), अधिक आत्मविश्वास से लगने वाला पाठ, और उनकी पूर्व मान्यताओं से सहमत प्रतिक्रियाएँ पसंद करते हैं। RLHF मॉडलों की प्रसिद्ध चापलूसी विफलता — जहाँ मॉडल उपयोगकर्ताओं को वह बताता है जो वे सुनना चाहते हैं — आंशिक रूप से सहमत प्रतिक्रियाओं के लिए मूल्यांकक की प्राथमिकता का परिणाम है।

### स्केलेबल निगरानी

जटिल कार्यों के लिए, मनुष्य विश्वसनीय रूप से नहीं बता सकते कि कौन सी AI प्रतिक्रिया सही है। **स्केलेबल निगरानी** {cite}`bowman2022measuring` उन मूल्यांकन प्रक्रियाओं को डिज़ाइन करने की खुली अनुसंधान समस्या है जो कार्य जटिलता बढ़ने के साथ विश्वसनीय रहें।

---

## Constitutional AI (RLAIF)

**Constitutional AI** {cite}`bai2022constitutional`, Anthropic में विकसित, मानव लेबलर्स पर निर्भरता को कम करने के लिए एक सेट ऑफ सिद्धांतों (एक "constitution") द्वारा निर्देशित AI का उपयोग प्राथमिकता लेबल उत्पन्न करने के लिए करता है। प्रक्रिया:

1. संभावित रूप से हानिकारक प्रॉम्प्ट के लिए प्रतिक्रियाएँ उत्पन्न करें
2. संवैधानिक सिद्धांतों के विरुद्ध प्रतिक्रियाओं का मूल्यांकन करने के लिए AI आलोचक का उपयोग करें
3. AI प्रतिक्रिया द्वारा निर्देशित प्रतिक्रियाओं को संशोधित करें (RLAIF — AI प्रतिक्रिया से RL)
4. AI-जनित प्राथमिकताओं पर पुरस्कार मॉडल प्रशिक्षित करें
5. इस पुरस्कार मॉडल का उपयोग करके RLHF से फाइन-ट्यून करें

```{seealso}
मूल InstructGPT शोधपत्र {cite}`ouyang2022training` LLMs पर RLHF के पहले बड़े पैमाने के अनुप्रयोग का वर्णन करता है। गहन RL के लिए मूलभूत RLHF कार्य {cite}`christiano2017deep` है। PPO {cite}`schulman2017proximal` में वर्णित है। Constitutional AI {cite}`bai2022constitutional` से है।
```
