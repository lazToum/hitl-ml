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

# तुलना एवं क्रम-निर्धारण से अधिगम

मनुष्यों को किसी आउटपुट को एक पूर्ण गुणवत्ता स्कोर असाइन करने के लिए कहना कठिन है। इस निबंध की 1 से 10 के पैमाने पर संख्यात्मक गुणवत्ता क्या है? प्रश्न ही गलत है: मनुष्यों के पास एक स्थिर आंतरिक पैमाना नहीं है, और उनके स्कोर एंकरिंग, संदर्भ, और थकान से बहुत प्रभावित होते हैं।

मनुष्यों को दो आउटपुट की *तुलना* करने के लिए कहना बहुत आसान है: कौन सा निबंध बेहतर है, A या B? तुलनात्मक निर्णय अधिक सुसंगत, अधिक विश्वसनीय हैं, और पूर्ण रेटिंग की तुलना में मानव प्राथमिकताओं में अधिक सीधे टैप करते हैं। यह अध्याय तुलना और रैंकिंग से अधिगम के गणितीय आधार और व्यावहारिक अनुप्रयोगों को शामिल करता है।

---

## रेटिंग की तुलना में तुलनाएँ बेहतर क्यों हैं

### मनोवैज्ञानिक आधार

तुलनात्मक निर्णयों की श्रेष्ठता का मनोमिति में एक लंबा इतिहास है। Thurstone का तुलनात्मक निर्णय का नियम {cite}`thurstone1927law` (1927) ने दर्शाया कि भले ही मनुष्यों के पूर्ण निर्णय असंगत हों, उनके सापेक्ष निर्णय एक सुसंगत प्रायिकता नियम का पालन करते हैं।

### सांख्यिकीय दक्षता

$K$ आइटम के साथ, $K-1$ तुलनाएँ सभी आइटम को रैंक कर सकती हैं; शीर्ष आइटम खोजने के लिए केवल $O(\log K)$ तुलनाओं की आवश्यकता है।

### स्केलेबिलिटी

जेनरेटिव मॉडलों के लिए, विशिष्ट आउटपुट की संख्या प्रभावी रूप से अनंत है। तुलना आउटपुट के लिए केवल स्थानीय, सापेक्ष निर्णयों की आवश्यकता है।

---

## Bradley-Terry मॉडल

युगल तुलनाओं के लिए प्रमुख प्रायिकता मॉडल **Bradley-Terry (BT) मॉडल** {cite}`bradley1952rank` है। प्रत्येक आइटम $i$ में एक अव्यक्त गुणवत्ता स्कोर $\alpha_i \in \mathbb{R}$ है। एक सीधी तुलना में आइटम $i$ के आइटम $j$ से अधिक पसंद किए जाने की प्रायिकता है:

$$
P(i \succ j) = \frac{e^{\alpha_i}}{e^{\alpha_i} + e^{\alpha_j}} = \sigma(\alpha_i - \alpha_j)
$$

### पैरामीटर अनुमान

युगल तुलनाओं के डेटासेट $\mathcal{D} = \{(i, j, y_{ij})\}$ को देखते हुए जहाँ $y_{ij} = 1$ यदि $i$ को $j$ से अधिक पसंद किया गया, लॉग-संभावना है:

$$
\mathcal{L}(\alpha) = \sum_{(i, j, y_{ij}) \in \mathcal{D}} \left[ y_{ij} \log \sigma(\alpha_i - \alpha_j) + (1 - y_{ij}) \log \sigma(\alpha_j - \alpha_i) \right]
$$

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

## Thurstone का मॉडल

Thurstone का मॉडल {cite}`thurstone1927law` Bradley-Terry से निकटता से संबंधित है लेकिन logistic के बजाय Gaussian शोर का उपयोग करता है:

$$
P(i \succ j) = \Phi\left(\frac{\alpha_i - \alpha_j}{\sqrt{2}\sigma}\right)
$$

जहाँ $\Phi$ मानक सामान्य CDF है। व्यवहार में, दोनों मॉडल लगभग समान परिणाम देते हैं।

---

## रैंक एकत्रीकरण

**Borda count:** प्रत्येक आइटम को प्रत्येक अनुलेखक की रैंकिंग में उससे नीचे रैंक किए गए आइटम की संख्या के बराबर स्कोर मिलता है।

**Kemeny–Young:** वह रैंकिंग खोजें जो प्रत्येक अनुलेखक की रैंकिंग (Kendall tau दूरी) के साथ युगल असहमतियों के योग को न्यूनतम करती है।

---

## द्वंद्वयुद्ध बैंडिट्स

**ऑनलाइन** वरीयता अधिगम में, आइटम एक धारा में आते हैं और हमें यह तय करना है कि किन जोड़ियों की तुलना करनी है। यह **द्वंद्वयुद्ध बैंडिट** समस्या है {cite}`yue2009interactively`।

---

## भाषा मॉडलों के लिए वरीयता अधिगम

RLHF (अध्याय 6) के संदर्भ में, Bradley-Terry मॉडल का उपयोग पुरस्कार मॉडल प्रशिक्षित करने के लिए किया जाता है। एक महत्त्वपूर्ण प्रकार है **Direct Preference Optimization (DPO)** {cite}`rafailov2023direct`, जो दर्शाता है कि RLHF उद्देश्य को एक अलग पुरस्कार मॉडल प्रशिक्षित किए बिना सीधे वरीयता डेटा से अनुकूलित किया जा सकता है:

$$
\mathcal{L}_\text{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_\text{ref}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_\text{ref}(y_l \mid x)} \right) \right]
$$

DPO पूर्ण RLHF की तुलना में सरल है (कोई PPO प्रशिक्षण लूप नहीं, कोई पुरस्कार मॉडल नहीं) {cite}`rafailov2023direct`।

---

## उच्च-गुणवत्ता वरीयता डेटा एकत्र करना

**प्रॉम्प्ट विविधता।** वरीयता डेटा परिनियोजन में मॉडल के सामने आने वाले प्रॉम्प्ट के पूर्ण वितरण को कवर करना चाहिए।

**प्रतिक्रिया विविधता।** दो बहुत समान प्रतिक्रियाओं की तुलना बहुत कम जानकारी प्रदान करती है।

**अनुलेखक सहमति।** कम अंतर-अनुलेखक सहमति यह सुझाती है कि तुलना मानदंड अस्पष्ट हैं। Cohen's κ मापें और जब यह स्वीकार्य सीमा से नीचे हो तो दिशानिर्देशों को संशोधित करें।

**अंशांकन।** अनुलेखकों को समझना चाहिए कि एक प्रतिक्रिया बेहतर *क्यों* है: सहायकता, सटीकता, सुरक्षा, शैली?

```{seealso}
Bradley-Terry मॉडल: {cite}`bradley1952rank`। Thurstone: {cite}`thurstone1927law`। द्वंद्वयुद्ध बैंडिट्स: {cite}`yue2009interactively`। Direct Preference Optimization (DPO): {cite}`rafailov2023direct`।
```
