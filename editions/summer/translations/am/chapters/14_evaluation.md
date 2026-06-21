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

# ግምገማና መለኪያዎች

HITL ሥርዓትዎ እያሠራ ስለ ሆነ ለ መረዳት ከ ሞዴሉ ትክክለኛነቱ ደምቡ ማወቅ አይበቃም። ከ ትርጓሜ ወጪዎ ዋጋ ስለ ሚያገኙ፣ ሞዴሉ ከ ሰው ፈጣሪዎቻቸው ጋር ስለ ሚስማማ ዕውነትዎ፣ እና ተጨማሪ ሰው ግብረ-መልስ ነገሮቹን ማሻሻሉ ስለ ሚቀጥሉ ሁሉ ማወቅ ያስፈልጋል። ይህ ምዕራፍ በ HITL አካባቢዎቹ ሁሉን-አቀፍ ግምገማ ሁኔታዎቹን ይዳስሳል።

---

## ሞዴሉ-ተኮር መለኪያዎቹ

ደረጃ-ML መለኪያዎቹ ቀጥታ ወደ HITL ሥርዓቶቹ ይሠራሉ፣ ዋና ጠቀሜታዎቹን ጨምሮ።

### ምደባ መለኪያዎቹ

**ትክክለኛነቱ** ምድቦቹ ሚዛናዊ ሲሆኑ እና ሁሉም ስህተቶቹ ዋጋ ሲስተካከሉ ተስማሚ ነው። ነገር ግን HITL አካባቢዎቹ ውስጥ ምልክቱ የ ሙከራ ስብስቡ በ ጥያቄ ስልቱ ተዘናጋ ሊሆን ይችላል (Active Learning ያልዘፈቀደ ምሳሌዎቹን ይጠይቃል)፣ ይህ ቀላሉ ትክክለኛነቱ ትምናዎቹን ያልተዓማኝ ያደርጋቸዋል።

**F1 ውጤቱ** ትክክለኛነቱ እና ትዝብቱ ያለ ሃርሞኒካ ዘዴ ማካካሻ ሲሆን ያልሚዛናዊ ምድቦቹ ተስማሚ ነው። HITL አካባቢዎቹ ውስጥ ሁለቱ ትክክለኛነቱ እና ትዝብቱ ሐሰተኛ አዎንታዊ እና ሐሰተኛ አሉታዊ መካከሉ ዋጋ አዛሙነቱ ላይ ተመስርቶ ሊለያይ ይችላሉ።

**AUROC** ዐሰቀዮ ሳይወሰን የ ሞዴሉን ምድቦቹን ለ መለየት ችሎታ ይሄዳል — ለ ማርሽ ዋጋ-ቋሚ ተግባሮቹ ለ ሕክምና ምርምር ሁሉ አስፈላጊ ነው።

**ስምምነቱ** ትምናዎቹ ዕድሎቹ ከ ተጨባጭ ብዛቶቹ ጋር ምን ያህል ሚስማሙ ይሄዳል። HITL ሥርዓቶቹ ውስጥ ከ Active Learning ሳቢያ ባዕድ ምልክቱ ስብስቦቹ ላይ የሠለጠኑ ሞዴሎቹ ትክክለኛ ቢሆኑም ላይስማሙ ይችላሉ።

### ፈጠራ ሞዴሉ መለኪያዎቹ

ለ ቋንቋ ሞዴሎቹ እና ፈጠራ ሥርዓቶቹ ግምገማ ሙሉ ለሙሉ ከባድ ነው። ምንም ነጠላ ራስ-ሰር መለኪያ ጥራቱን ሙሉ አይይዝም፦

- **BLEU / ROUGE / METEOR፦** ለ ትርጉምና ማጠቃለያ ዋቢ-ላይ-ተደረጉ መለኪያዎቹ። ለ ረዥም-ቅርጽ ፈጠራ ሰው ጥራቱ ፍርዶቹን አቅልሰው ያስቀምጣሉ።
- **ቅድሚያ-ዕድሉ (Perplexity)፦** ሞዴሉ ያልተያዘ ጽሑፍ ምን ያህል ሚተነብዩ ይሄዳል። ለ ጥራቱ አስፈላጊ ሁኔታ ነው ነገር ግን ሙሉ ሁኔታ አይደለም።
- **BERTScore፦** ወደ ዋቢዎቹ ቅርጽ-ላይ-ተደረጉ ተመሳሳይነቱ። ከ n-gram መለኪያዎቹ ይልቅ ከ ሰው ፍርዶቹ ጋር ተሻለ ይስማማሉ።
- **ሰው ግምገማ፦** ወርቅ-ደረጃ ደረጃ። ክፍል 14.3 ይመልከቱ።

---

## ትርጓሜ ቁጠባ መለኪያዎቹ

HITL ግምገማ ሰው ግብረ-መልስ ቁጠባ ሁኔታ ጥቅም ስለ ሚገኝ ሊሄድ ያስፈልጋል።

### ትምህርቱ ዕድሎቹ

**ትምህርቱ ዕድሉ** ምልክቱ ምሳሌዎቹ ቁጥሩ ሚወሰን ሞዴሉ ምርታማነቱ ሞገዱ ያሳያሉ። ቀጥ ያለ ትምህርቱ ዕድሉ (ጥቂት ምልክቶቹ ጋር ፈጣን ማሻሻያ) የ ትርጓሜ ስልቱ ምሳሌ-ሞቻቸውን ምሳሌዎቹ ሚመርጥ ዕርዝምና ያሳያሉ። ጠፍጣፋ ትምህርቱ ዕድሉ ምልከታዎቹ ምርቶቻቸው ቀኑ ዳሰሳ ዕርዱ ምርቶቻቸው ያሳያሉ።

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, roc_auc_score
from sklearn.model_selection import StratifiedShuffleSplit

rng = np.random.default_rng(42)
X, y = make_classification(n_samples=5000, n_features=30, n_informative=15,
                            weights=[0.8, 0.2], random_state=42)
X_test, y_test = X[4000:], y[4000:]
X_pool, y_pool = X[:4000], y[:4000]

label_sizes = [20, 40, 60, 100, 150, 200, 300, 400, 600, 800, 1000, 1500, 2000]
metrics = {'f1': [], 'auc': []}

for n in label_sizes:
    idx = rng.choice(len(X_pool), n, replace=False)
    clf = LogisticRegression(max_iter=500, class_weight='balanced')
    clf.fit(X_pool[idx], y_pool[idx])
    preds = clf.predict(X_test)
    probs = clf.predict_proba(X_test)[:, 1]
    metrics['f1'].append(f1_score(y_test, preds))
    metrics['auc'].append(roc_auc_score(y_test, probs))

# Fit learning curve: performance ≈ a - b/sqrt(n)
from scipy.optimize import curve_fit

def learning_curve_fn(n, a, b):
    return a - b / np.sqrt(n)

popt_f1, _ = curve_fit(learning_curve_fn, label_sizes, metrics['f1'], p0=[0.9, 2])
popt_auc, _ = curve_fit(learning_curve_fn, label_sizes, metrics['auc'], p0=[0.95, 1])

n_smooth = np.linspace(20, 3000, 200)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))

ax1.scatter(label_sizes, metrics['f1'], color='#2b3a8f', zorder=5, s=40)
ax1.plot(n_smooth, learning_curve_fn(n_smooth, *popt_f1), '--', color='#e05c5c',
         label=f'Fit: {popt_f1[0]:.3f} - {popt_f1[1]:.1f}/√n')
ax1.set_xlabel("Labeled examples"); ax1.set_ylabel("F1 score")
ax1.set_title("Learning Curve: F1"); ax1.legend(); ax1.grid(alpha=0.3)

ax2.scatter(label_sizes, metrics['auc'], color='#0d9e8e', zorder=5, s=40)
ax2.plot(n_smooth, learning_curve_fn(n_smooth, *popt_auc), '--', color='#e05c5c',
         label=f'Fit: {popt_auc[0]:.3f} - {popt_auc[1]:.2f}/√n')
ax2.set_xlabel("Labeled examples"); ax2.set_ylabel("AUROC")
ax2.set_title("Learning Curve: AUROC"); ax2.legend(); ax2.grid(alpha=0.3)

plt.tight_layout()
plt.savefig('learning_curves.png', dpi=150)
plt.show()

# Estimate the annotation budget needed to reach a target performance
target_f1 = 0.80
n_needed = (popt_f1[1] / (popt_f1[0] - target_f1)) ** 2
print(f"Estimated labels needed to reach F1={target_f1}: {n_needed:.0f}")
```

### ኢንቨስትመንቱ ተቀምጦ (ROI) ትንተና

ሰው ግብረ-መልስ ROI ምላሽ ሰጪ ነው፦ ለ እያንዳንዱ ተጨማሪ ምልክቱ፣ ሞዴሉ ምርታማነቱ ምን ያህል ይሻሻላሉ?

$$
\text{ROI}(n) = \frac{\Delta \text{performance}(n)}{\text{cost per label}}
$$

ሞዴሉ ሲዘምን (እና ቀላሉ-ለ-ትምህርቱ ምሳሌዎቹ ሲሟጠጡ)፣ ROI ብዙ ጊዜ ይቀንሳሉ። ተግባራዊ ፍቺው፦ የ ትርጓሜ ወጪዎቹ ቀደምት ደረጃዎቹ ላይ ROI ከፍተኛ ሲሆን በ ቀዳሚ ደረጃዎቹ ላይ ብዙ ምልክቶቹ ሊሰበሰቡ ይህ ቅድሚያ ሊሰጣቸው ይችላሉ።

---

## ሰው ግምገማ

ፈጠራ ሥርዓቶቹና ርዕሰ-ጉዳዮቹ ተግባሮቹ ለ ሰው ግምገማ ወርቅ-ደረጃ ሆኖ ይቀጥሉ።

### ቀጥታ ምዘና (DA)

ምሳሌ ሰጪዎቹ ሥርዓቱ ምርቶቹን ፍጹም ሚዛን ላይ ይሚዘን (ለ ምሳሌ፣ ለ ትርጉም ጥራቱ 1–100፣ ወይም ለ ምላሽ ጠቃሚነቱ 1–5)። DA በ ማሽን ትርጉም ግምገማ (WMT ቤንች-ማርኮቹ) ደረጃ ተቀምጧል።

**ለ DA ምርጥ ስርዓቶቹ፦**
- የ ምርቶቹን ቅደም ተከተሉ ቀደምት-ቦታ-አፍነትን ለ ማስቀረት ዘፈቀደ ያድርጉ
- ለ ነጥብ ምሳሌ ሰጪዎቹ (3–5 ቢያንስ) ቂልሙ ቁጥሩ ይጠቀሙ
- ጥራቱ ቁጥጥሮቹ ያካትቱ (ኩርፊያ ምሳሌ ሰጪዎቹን ለ መያዝ ግልጽ ጥሩ እና ጥፍ ምሳሌዎቹ)
- ጠቅላላ ውጤቶቹ ጎን ምሳሌ ሰጪዎቹ ስምምነቱ ሪፖርት ያድርጉ

### ንጽጽር ግምገማ

ምሳሌ ሰጪዎቹ ሁለቱ ምርቶቹ መካከሉ ይምርጣሉ፦ "የትኛው ሻለ?" ንጽጽር ፍርዶቹ ከ ፍጹም ዋጋ አሰጣጡ ፈጣን እና ወጥ ናቸው (ምዕራፍ 8 ይምልከቱ)። **ELO ዋጋ አሰጣጥ ሥርዓቶቹ** (ከ ቼስ ተዋሰ) ጥንዱ ንጽጽሩ ውጤቶቹን ቀጣይ ጥራቱ ደረጃ አሰጣጥ ወደ ይቀይሩ።

```{code-cell} python
import numpy as np

def update_elo(rating_a, rating_b, outcome_a, k=32):
    """Update ELO ratings. outcome_a: 1=A wins, 0=B wins, 0.5=tie."""
    expected_a = 1 / (1 + 10 ** ((rating_b - rating_a) / 400))
    expected_b = 1 - expected_a
    new_a = rating_a + k * (outcome_a - expected_a)
    new_b = rating_b + k * ((1 - outcome_a) - expected_b)
    return new_a, new_b

# Simulate 5 model versions being compared pairwise
rng = np.random.default_rng(42)
true_quality = [0.60, 0.70, 0.75, 0.80, 0.85]  # underlying model quality
n_models = len(true_quality)
elo_ratings = {i: 1000.0 for i in range(n_models)}

for _ in range(500):  # 500 pairwise comparisons
    i, j = rng.choice(n_models, 2, replace=False)
    p_i_wins = true_quality[i] / (true_quality[i] + true_quality[j])
    outcome = 1.0 if rng.random() < p_i_wins else 0.0
    elo_ratings[i], elo_ratings[j] = update_elo(elo_ratings[i], elo_ratings[j], outcome)

print("ELO Rankings after 500 comparisons:")
sorted_models = sorted(elo_ratings.items(), key=lambda x: x[1], reverse=True)
for rank, (model_id, elo) in enumerate(sorted_models, 1):
    print(f"  Rank {rank}: Model {model_id}  ELO={elo:.1f}  True quality={true_quality[model_id]:.2f}")
```

### ስነ-ምግባር ፈተና (CheckList)

**CheckList** {cite}`ribeiro2020beyond` NLP ሞዴሎቹ ሥርዓታዊ ስነ-ምግባር ግምገማ ዘዴ ነው። ዘፈቀደ ሙከራ ስብስቦቹ ፋንታ ልዩ ችሎታዎቹን የሚሄዱ ሙከራ ጉዳዮቹ ይዘጋጁ፦

- **ዝቅተኛ ሙሉ ሙከራዎቹ (MFT)፦** ሞዴሉ ቀላሉ፣ ግልጽ ጉዳዮቹን ሊሸፍን ይቻላሉ?
- **ቋሚነት ሙከራዎቹ (INV)፦** ሞዴሉ ምርቱ ሲቀር (ለ ምሳሌ፣ ሲደምሩ) ሊቀይር ያልሚፈልገው ሊቀይር ይቻላሉ?
- **ቅጣት ፍቺ ሙከራዎቹ (DIR)፦** ሞዴሉ ምርቱ ምናልባት ሲቀር ሊቀይር ሚፈልጉ ቅጣቱ ሚቀይር ይቻላሉ?

CheckList ሰው ግምገማ ታቅዶ እና ሊሠራ-የሚቻሉ ያደርጋሉ፦ ነጠላ ትክክለኛነቱ ቁጥሩ ፋንታ ችሎታ-ፕሮፋይሉ ያቀርባሉ።

---

## ሰው ፈጣሪዎቻቸው ጋር ስምምነቱ ሚሄዱ

RLHF ሥርዓቶቹ ለ ስምምነቱ ሚሄዱ ዋና ግምገማ ፈተና ነው።

**ዋጋ ሞዴሉ ግምገማ፦** ዋጋ ሞዴሉ ትክክለኛነቱ ላይ ሙከራ ስምምነቱ ዋቢ ስብስቡ። Ouyang et al. {cite}`ouyang2022training` ለ InstructGPT ዋጋ ሞዴሉ ወደ 72% ጥንዱ ትክክለኛነቱ ሪፖርት ያደርጋሉ፤ ተመሳሳዩ RLHF ቧንቧ መስመሮቹ ለ ሰፊ ዋቢ ነጥብ ቁጥሮቹ ብዙ ጊዜ ይጠቀሱ ቢሆንም ውጤቶቹ ሰፊ ልዩነት አለቸው።

**ሽልማቱ ዕድሉ፦** ሁለቱ ሞዴሉ ስሪቶቹ (ለ ምሳሌ፣ SFT ቤዝ-ላይን vs. RLHF ዳቆ)፣ ሰው ጥንዱ ንጽጽሮቹ ውስጥ RLHF ሞዴሉ ምላሾቹ ምን ያህሉ ይሸነፋሉ?

**GPT-4 ግምጋሚ ሆኖ፦** ፈጣን ድጋሚ ለ ምላሾቹ ምርምር ሊቻሉ LLM ለ ምርምር ዘዴ ፓፑ ሆኗል። Gilardi et al. {cite}`gilardi2023chatgpt` እና Zheng et al. {cite}`zheng2023judging` LLM ምርምር ሰው ፍርዱ ጋር ስምምነቱ ከ 0.7 ወደ 0.9 ተፈጥሯዊ ለ ተግባሩ ሊደርሱ ያሳያሉ — ፈጣን A/B ንጽጽሩ ሁሉ ጥቅም አለ፣ ነገር ግን ቅደም ተከተሉ ስሜቱ፣ ባህላዊ ዝርዝሩ፣ ወይም ደህንነቱ ጉዳዮቹ ለ መያዝ ሊጠፋ ይቻላሉ።

**ቅደም ተከተሉ ስሜቱ ምርምር፦** ሞዴሉ ተዘዋዋሪ ተጠቃሚ ምርጫ ላይ ተደርጎ ምላሾቹ ሊቀይር ዕድሉ ሚሄዱ (ለ ምሳሌ፣ "X ትክክለኛ ነው ብዬ አስባለሁ፤ ምን ታስባለህ?")። ሚስማሙ ሞዴሉ ቅደም ተከተሉ ስሜቱ ሊሆን አይፈለግም።

---

## ሰፊ-ሆነው ሥርዓቶቹ ውስጥ A/B ምርምር

ለ ምርቱ ሥርዓቶቹ ዋናው ግምገማ **A/B ምርምር** ነው፦ ተጠቃሚዎቹ አንድ ልክ ወደ አዲሱ ሞዴሉ ስሪቱ ይልኳቸው እና ዝቅተኛ ውጤቶቹ ይሄዱ።

A/B ምርምር ሞዴሉ ጥራቱ ያልተሳሳተ ትምና ትምናዎቹ ሰፊ ሙከራ አካባቢዎቹ ውስጥ ይሰጣሉ፣ ቤተ ሙከራ ግምገማ ሚፈፀቱ ዕርዶቹ ይሸፍናሉ (ተጠቃሚ ምቾቱ፣ ሕዝቡ ስርጭቱ፣ ጫፍ ጉዳዮቹ)።

ፈተናው፦ ተስማሚ ዝቅተኛ ውጤቶቹ። ተሳትፎ መለኪያዎቹ (ጠቅ ማድረጉ፣ ስብሰባ ርዝማኔ) ተንኮለኛ ምቾቱ ሊሸልሙ ይቻላሉ። ተግባሩ ማጠናቀቂያ ዕድሎቹ ወይም ተጠቃሚ ደስታ ዳሰሳዎቹ ለ ስምምነቱ ይሻሉ ነገር ግን ዶሞ ናቸው።

```{seealso}
CheckList ስነ-ምግባር ምርምር፦ {cite}`ribeiro2020beyond`። ለ RLHF ግምገማ ዘዴ፣ {cite}`ouyang2022training` ይምልከቱ። ለ MT ሰው ግምገማ ምርጥ ስርዓቶቹ፦ {cite}`graham2015accurate`። ለ ትምህርቱ ዕድሉ ቲዎሪ፦ {cite}`mukherjee2003estimating`።
```
