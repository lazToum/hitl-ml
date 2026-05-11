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

# ከንጽጽርና ደረጃ አሰጣጥ መማር

ሰዎቹ ለውጤቱ ፍጹም ጥራቱ ቁጥሩ ሊሰጡ ቸር ነው። ይህ ድርሰቱ፣ 1 ሁሉ 10 ሁሉ ሚዛን ሁሉ ቁጥራዊ ጥራቱ ምን ነው? ጥያቄው ትርጓሜ ሌለው ነው፦ ሰዎቹ ዋናቱ ውስጣዊ ሚዛን ሌላቸው፣ ቁጥሮቻቸው ምሰናኔ፣ ዓውደ-ንባቡ፣ እናም ድካም ሁሉ ሰፊ ሊተጽዕኑ ይዟሉ።

ሰዎቹ ሁለቱ ውጤቶቹ *ሊወዳደሩ* ቀላሉ ነው፦ ምን ድርሰቱ ጥሩ ነው፣ A ወ. B? ንጽጽር ፍርዶቹ ምናምን ናቸው፣ ሊታመኑ ናቸው፣ እናም ፍጹም ደረጃ ሰጡ ሁሉ ሰፊ ቀጥተኛ ሰው ምርጫዎቹ ሁሉ ሊደርሱ ይዟሉ። ይህ ምዕራፍ ንጽጽሮቹ እና ደረጃዎቹ ሁሉ ትምህርቱ ሒሳባዊ መሠረቶቹ እና ተጨባጭ ተጠቃሚ ዓይነቶቹ ሊሸፍናሉ ይዟሉ።

---

## ለምን ንጽጽሮቹ ደረጃ ሰጡ ሁሉ ይሻሉ

### ሳይኮሎጂካዊ ምሥረታ

ንጽጽር ፍርዶቹ ሙሉ ብልጫ ሳይኮሜትሪክስ ሁሉ ረዥም ታሪኩ አለ። ቱርስቶን ሕግ {cite}`thurstone1927law` (1927) ሰዎቹ ወጥ ያልሆነ ፍጹም ፍርዶቹ ሲኖሩ ሳይቀሩ ዝምዝምቱ ፍርዶቻቸው ምናምን ዋናቱ ሕጉ ሚከተሉ ሁሉ ሆነ ሊያሳዩ ይዟሉ። ንጽጽሮቹ ሰዎቹ ፍጹም ምደባ ሁሉ ሰፊ *ዝምዝምቱ* ምልከታ ሙሉ ሰፊ ጥሩ ሁሉ ሃቁ ሊጠቀሙ ናቸው።

### ስታቲስቲካዊ ቀልጣፋነቱ

እያንዳንዱ ጥምር ንጽጽሩ ሁሉ ጥራቱ ሚዛን ሁሉ ሁለቱ ዕቃዎቹ *ዝምዝምቱ* ሁኔታ ሁሉ መረጃ ሰጠ። $K$ ዕቃዎቹ ሲሆን፣ $K-1$ ንጽጽሮቹ ሁሉ ዕቃዎቹ ሁሉ ደረጃ ሊሰጡ ይዟሉ፤ ዋናቱ ዕቃ ሊያገኙ $O(\log K)$ ንጽጽሮቹ ብቻ ሊያስፈልጉ ይዟሉ። ፍጹም ደረጃ ሰጡ ብዙ ጊዜ ያው ትክክለኛነቱ ሊደርሱ ሰፊ ፍርዶቹ ሊፈልጋሉ።

### ሊሰፋፋ ሊሆን

ጀነሬቲቭ ሞዴሎቹ ሁሉ ልዩ ውጤቶቹ ቁጥሩ ሙሉ ዕጥፍ ነው። ውጤቱ ፍጹም ሲሰጡ ሁሉ ውጤቶቹ ሁሉ ሰፊ ሚዛን ሊያቋቁሙ ያስፈልጋሉ፤ ሲወዳደሩ ወጪ ሁሉ ሙሉ ፍርዶቹ ብቻ ሊፈልጉ ይዟሉ፣ ዕውን ሙሉ ሙሉ ሁሉ ሊጣጣሙ ናቸው።

---

## ብራድሊ-ቴሪ ሞዴሉ

ጥምር ንጽጽሮቹ ሙሉ ምናምን ምናምን ሞዴሉ **ብራድሊ-ቴሪ (BT) ሞዴሉ** {cite}`bradley1952rank` ነው። እያንዳንዱ ዕቃ $i$ ምናምን ጥራቱ ቁጥሩ $\alpha_i \in \mathbb{R}$ አለ። ቀጥተኛ ንጽጽሩ ሁሉ ዕቃ $i$ ዕቃ $j$ ሁሉ ሚምረጡ ምናምን ነው፦

$$
P(i \succ j) = \frac{e^{\alpha_i}}{e^{\alpha_i} + e^{\alpha_j}} = \sigma(\alpha_i - \alpha_j)
$$

$\sigma$ ሎጂስቲካዊ ሲጅሞይዱ ሲሆን። ይህ ዕቃ $i$ ምናምን ጥራቱ $\alpha_i + \epsilon$ ሲሆን $\epsilon$ ምናምን ሎጂስቲካዊ ሁኔታ ምሳሌ ነው ሙሉ ሙሉ ሊቀቡ ነው።

### ሊወስኑ ሊሆን

BT ሞዴሉ ትርጉሙ ሁሉ ሊወስኑ ሊሆን ይዟሉ፦ $\alpha$ ፍቱ ሲሆን፣ ምንም ቋሚ $c$ ሁሉ $\alpha + c$ ሙሉ ፍቱ ነው። ምናምን ስምምነቱ አንዱ ቁጥሩ ሊሰጥ (ሰለምሳሌ $\alpha_0 = 0$) ወይም $\sum_i \alpha_i = 0$ ሊቆጣጠሩ ነው። ቁጥሮቹ **ንጽጽሩ ግራፉ** (ኖዶቹ = ዕቃዎቹ፣ ጫፎቹ = ምናምን ቡድኖቹ) **ዘምዶ** ሲሆን ብቻ ሊወስኑ ይዟሉ — ግራፉ ያልዘምዶ ክፍሎቹ ሲኖሩ ክፍሎቹ ሁሉ ዝምዝምቱ ቁጥሮቹ ትርጓሜ ሌላቸው።

### ፓራሜትሩ ምናምን

ጥምር ንጽጽሮቹ $\mathcal{D} = \{(i, j, y_{ij})\}$ ሲሰጡ $y_{ij} = 1$ $i$ ሙሉ $j$ ሁሉ ምርጫቸው ሆነ ሲሆን፣ ሎግ-ሊኬሊሁዱ ነው፦

$$
\mathcal{L}(\alpha) = \sum_{(i, j, y_{ij}) \in \mathcal{D}} \left[ y_{ij} \log \sigma(\alpha_i - \alpha_j) + (1 - y_{ij}) \log \sigma(\alpha_j - \alpha_i) \right]
$$

ይህ $\alpha$ ሁሉ ኮንኬቭ ዓይነቱ ነው እናም ግሬዲዬንቱ ሁሉ ወይም ኒውተን ዘዴ ሁሉ ሊሻሻሉ ይዟሉ።

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

## ቱርስቶን ሞዴሉ

ቱርስቶን ሞዴሉ {cite}`thurstone1927law` ብራድሊ-ቴሪ ሁሉ ቅርቡ ዝምዝምቱ አለ ግን ሎጂስቲካዊ ሳይሆን ጋዩሲያን ሁኔታ ሊጠቀሙ ይዟሉ፦

$$
P(i \succ j) = \Phi\left(\frac{\alpha_i - \alpha_j}{\sqrt{2}\sigma}\right)
$$

$\Phi$ ምናምን ኖርማሉ CDF ሲሆን። $\sigma = 1/\sqrt{2}$ ሲሆን ይህ ትንሽ ሚዛን ልዩነቱ ሁሉ BT ሙሉ ሊቀቡ ይዟሉ። ሥራ ላይ ሁለቱ ሞዴሎቹ ሙሉ ዝምዝምቱ ውጤቶቹ ሊሰጡ ናቸው።

---

## ደረጃ አጠቃለለ

እያንዳንዱ ትርጓሜ ሰጪ $K$ ዕቃዎቹ ሙሉ ደረጃ (ጥምር ንጽጽሮቹ ሳይሆን) ሲሰጡ፣ ችግሩ **ደረጃ አጠቃለለ** ነው፦ ብዙ ደረጃ ዝርዝሮቹ ሙሉ ምሳሌ ደረጃ አጠቃለሉ።

**ቦርዳ ቁጥሩ፦** እያንዳንዱ ዕቃ ሁሉ ትርጓሜ ሰጪ ደረጃ ሁሉ ዝቅ ደረጃ ሚሰጡ ዕቃዎቹ ቁጥሩ ሙሉ ቁጥሩ ሊቀበሉ ይዟሉ። ቁጥሮቹ ሁሉ ሙሉ ትርጓሜ ሰጪዎቹ ሊሰበሰቡ ይዟሉ። ቀላሉ እና ጠንካራ ነው።

**ኬሜኒ–ያንጉ፦** እያንዳንዱ ትርጓሜ ሰጪ ደረጃ ሙሉ ጥምር አለ-ሰምምነቶቹ (ኬንዳሉ ቱ ርቀቱ) ድምሩ ሊቀንሱ ደረጃ ሊያገኙ ይዟሉ። ትልቅ $K$ ሁሉ NP-ቸር ነው ግን አነስ ስብስቦቹ ሁሉ ሊፈቱ ይዟሉ።

**RankNet / ListNet፦** ደረጃ ዝርዝሮቹ ሁሉ ቁጥሩ ዓይነቱ ሊማሩ ኒውራሉ አቀራረቦቹ፣ ሳያዩ ዕቃዎቹ ሁሉ ሊሰፋፋ ይዟሉ።

---

## ሁለቱ ሽቅብ ባንዲቶቹ

**ኦንላይን** ምርጫ ትምህርቱ ሁሉ ዕቃዎቹ ስትሪሙ ሁሉ ሊደርሱ ይዟሉ እናም ምን ቡድኖቹ ሊወዳደሩ ሊወስዱ ሊሆን ይዟሉ፣ ምርምሩ ሊያዛዝኑ (ሳያዩ ዕቃዎቹ ሙሉ ትምህርቱ) እና ሊጠቀሙ (ሰፊ-ጥሩ ዕቃዎቹ ሊቀርቡ)። ይህ **ሁለቱ ሽቅብ ባንዲቱ** ችግሩ {cite}`yue2009interactively` ነው።

ዋናቱ ቀመሮቹ ናቸው፦
- **ዳብሌር፦** ቻምፒዮን ዕቃ ሊይዙ፤ ምናምን ተፎካካሪዎቹ ሁሉ ሊፈትኑ
- **RUCB (ዝምዝምቱ ሁሉ ሰፊ እምነቱ ወሰን)፦** እያንዳንዱ ዕቃ ሌሎቹ ዕቃዎቹ ሁሉ ሊሸነፉ ምናምን ሁሉ UCB-ሰለሚሉ እምነቱ ድርሳዎቹ ሊሰሉ
- **MergeRank፦** ጉባኤ-ሰለሚሉ ንጽጽሩ ሙሉ UCB ሙሉ አዋህዱ

ሁለቱ ሽቅብ ባንዲቶቹ ኦንላይን ምክር ሥርዓቶቹ ሙሉ ጥቅም ሊውሉ ይዟሉ (ቀጣዩ ምን ጽሑፍ ሊያሳዩ፣ ምናምን ግብረ-መልሱ ሲሰጥ) እናም RLHF ውሂቡ ስብሰባ ሙሉ ቅናጅ ምርጫ ሁሉ።

---

## ቋንቋ ሞዴሎቹ ሙሉ ምርጫ ትምህርቱ

RLHF (ምዕራፍ 6) ሁሉ፣ ብራድሊ-ቴሪ ሞዴሉ ዋጋ ሞዴሉ ሙሉ ሰልጥኖ ሊጠቀሙ ይዟሉ። ዋናቱ ምሳሌ **ቀጥተኛ ምርጫ ሻሻሉ (DPO)** {cite}`rafailov2023direct` ሲሆን RLHF ዓላማቸው ልዩ ዋጋ ሞዴሉ ሳሰለጥኑ ቀጥተኛ ምርጫ ውሂቡ ሙሉ ሊሻሻሉ ሊያሳዩ ይዟሉ፦

$$
\mathcal{L}_\text{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_\text{ref}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_\text{ref}(y_l \mid x)} \right) \right]
$$

DPO ሙሉ RLHF ሁሉ ቀላሉ ነው (PPO ስልጠናቸው ቀለበቱ ሌለ፣ ዋጋ ሞዴሉ ሌለ) ብዙ ቤንቺማርኮቹ ሁሉ ምናምን ወይም ሰፊ ውጤቶቹ ሊደርሱ ሲሆን {cite}`rafailov2023direct`። ትዕዛዝ-ተፈጻሚ ዳግም ቅልምጫ ሙሉ PPO-ሁሉ RLHF ሙሉ ሰፊ ምርጫ ሆነ ምንም ሆኖ ሁለቱ አቀራረቦቹ ንቁ ሥራ ሁሉ ቀርተዋሉ፣ ዝምዝምቱ ብልጫዎቻቸው ሥራ-ሙሉ ናቸው።

---

## ሰፊ-ጥሩ ምርጫ ውሂቡ ስብሰባ

ምርጫ ውሂቱ ጥራቱ ዋጋ ሞዴሉ ጥራቱ ሊወስዱ ይዟሉ። ዋናቱ ሁኔታዎቹ ናቸው፦

**ፕሮምፕቱ ልዩነቱ።** ምርጫ ውሂቡ ሰፊ ሥራ ሁሉ ሞዴሉ ሙሉ ሊደርሱ ፕሮምፕቶቹ ሙሉ ስርጭቱ ሊሸፍኑ ይዟሉ። ሽፋን ሁሉ ክፍተቶቹ ያ ቦታ ሁሉ ዋጋ ሞዴሉ ሊታመን ሊሆን ባሕሪ ሊፈጥሩ ይዟሉ።

**ምላሹ ልዩነቱ።** ሁለቱ ሙሉ ዝምዝምቱ ምላሾቹ ሲወዳደሩ ትንሽ መረጃ ሰጠ። ምናምን ምላሾቹ ሁሉ ሙሉ ትርጓሜ ሰጪዎቹ ዋናቱ ምርጫ ሊኖራቸው ሰፊ ሊለዩ ይዟሉ።

**ትርጓሜ ሰጪ ስምምነቱ።** ዝቅ ያለ ትርጓሜ-ሰጪዎቹ-ሙሉ ስምምነቱ ንጽጽሩ ምልክቶቹ ብዥ ናቸው ሊያሳዩ ይዟሉ። ስምምነቱ ሊለኩ (ኮሄን κ) እናም ዝቅ ያሉ ምርጫ ሁሉ መምሪያዎቹ ሊሻሻሉ ይዟሉ።

**ምደባ።** ትርጓሜ ሰጪዎቹ *ለምን* አንዱ ምላሹ ጥሩ ሊሆን ሊያውቁ ይዟሉ፦ ጠቃሚነቱ፣ ትክክለኛነቱ፣ ደህናነቱ፣ ዘዬ? ብዙ ምልክቶቹ ሊዋሃዱ ሥራዎቹ ምናምን ምርጫዎቹ ሊሰጡ ዝቅ ናቸው። ብዙ ጊዜ ምርጫዎቹ ምልክቱ ሁሉ ልዩ ሆኖ ሊሰበስቡ ጥሩ ነው።

```{seealso}
ብራድሊ-ቴሪ ሞዴሉ፦ {cite}`bradley1952rank`። ቱርስቶን፦ {cite}`thurstone1927law`። ሁለቱ ሽቅብ ባንዲቶቹ፦ {cite}`yue2009interactively`። ቀጥተኛ ምርጫ ሻሻሉ (DPO)፦ {cite}`rafailov2023direct`።
```
