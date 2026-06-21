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

# ሕዝባዊ ምንጭ አቅርቦትና የጥራት ቁጥጥር

የትርጓሜ ተግባራት ባለሙያ ሳይሆኑ ሊሠሩ በሚችሉ ሁኔታ ሕዝባዊ ምንጭ አቅርቦት መድረኮች ትልቅ፣ ፍላጎት ላይ ተመስርቶ ለሚሠሩ ትርጓሜ ኃይሎች ተሳቢ ዋጋ ያቀርባሉ። ከሕዝቡ ጥሩ-ጥራት ያለው ምልክቱ ውሂብ መሥራት ጥንቁቅ ተግባር ዲዛይን፣ ስልታዊ ድፍናዊነት፣ እና ጥብቅ የጥራት ቁጥጥር ያስፈልጋል።

---

## ሕዝባዊ ምንጭ አቅርቦት መድረኮች

**Amazon Mechanical Turk (MTurk)** እ.ኤ.አ. 2005 ተጀምሮ ዋናው የሕዝባዊ ምንጭ አቅርቦት ገበያ ነው። ሠራተኞቹ ("Turkers") ጠያቂዎቹ የሚለጥፏቸው ጥቃቅን-ተግባራት (HITs) ያከናውናሉ። እ.ኤ.አ. 2018 የተደረገ ጥናት ለ Turkers ያለ ውጤታማ ሰዓታዊ ደሞዝ ወደ 2 ዶላር እንደሆነ ደርሷል — ይህ ደሞዝ ብዙ ሀብታም ሀገሮች ውስጥ ከ ዝቅተኛ ደሞዝ ይቀሳቀሳል {cite}`hara2018data` — ይህ ሥነ-ምግባራዊ ጉዳይ ቀጣዩ ምዕራፍ 15 ላይ ሊፈታ ይሆናል። MTurk ለ ግልጽ፣ ሊረጋገጥ ለሚችሉ መስፈርቶቹ ያሉ ቀላል ተግባራት ጥሩ ነው።

**Prolific** ዝቅተኛ ደሞዝ (አሁን ወደ ፓውንድ 9/ሰዓት፣ ወደ ዶላር 11/ሰዓት፣ Prolific ባቀረበው ሰነድ ስፋ ያለ) ያስጠብቃል፣ ተሳታፊዎቻቸውን በ ሕዝብ-ቁጥጥር ይምርጣሉ፣ እና ለ ምርምር ተሳትፎ የተቀበሉ ሠራተኞቻቸውን ይጠብቃሉ። ለ ማኅበረ-ሳይንሳዊ ምርምር እና ተወካይነት ለሚያስፈልጋቸው ተግባራት ምርጫ ነው።

**Appen** (ተመሳሳዩ፦ Telus International፣ iMerit) ከ የጥራት አስተዳደር ጋር የሚተዳደር የትርጓሜ ኃይሎቻቸውን ለ ከፍተኛ-ውስብስብ ተግባራት እና ኢንተርፕራይዝ ፕሮጀክቶች ያቀርባሉ።

**ልዩ ማኅበረሰቦች።** ሙያ-ልዩ ተግባራት ለ፣ ሙያዊ ዕውቀት ያላቸው ማኅበረሰቦቻቸው ጥሩ-ጥራት ያለው ትርጓሜ ያቀርባሉ፦ Galaxy Zoo ለ ሥነ-ፈለክ፣ eBird ለ ወፍ ዝርያዎች፣ Chess Tempo ለ የቼስ ቦታ ትርጓሜ።

---

## ሕዝባዊ ምንጭ አቅርቦት ተግባር ዲዛይን

### ውስብስብ ተግባራትን መጋጠም

ውስብስብ ተግባራት ወደ ቀላል፣ ግልጽ-ተቀምጠው ወደ ጥቃቅን-ተግባራት መከፋፈል አለባቸው። ሰነድ ሁሉን ሊምሳሌሉ ከ ሠራተኞቹ ከ ሙሉ ማስጠቀሚያ ፋንታ፣ አንድ ጥያቄ ጊዜ አንድ ብቻ ይጠይቁ፦ "ይህ ዓረፍተ-ነገር የሰው ስም ይዟል?" ወይም "ይህ ትርጉም ግልጽነቱን ከ 1 እስከ 5 ደርጃ ስጠው።"

**የመከፋፈሉ ጥቅሞች፦**
- ለ ተግባር ዝቅተኛ የአዕምሮ ጫና → ያነሰ ድካም፣ ከፍተኛ ጥራት
- እያንዳንዱ ጥቃቅን-ተግባር ለ ራሱ ጥራት ሊቆጣጠር ይችላል
- ለ ምርምርና ዲቡጋ ቀላል ነው

### ትዕዛዞቹ ጠቀሜታ

ሕዝባዊ ምንጭ አቅርቦት ጥራት ትልቁ ትንቢታዊ መለኪያ ትዕዛዝ ጥራቱ ነው። ጥሩ ተግባር ትዕዛዞቹ፦
- የ ተግባሩን *ዓላማ* በ አንድ ዓረፍተ-ነገር ያስረዳሉ
- ለ እያንዳንዱ ምድብ ግልጽ፣ ሁለ-ትርጉም የሌለው ፍቺ ይሰጣሉ
- 3–5 የሠለጡ ምሳሌዎች (ለ ጫፍ ጉዳዮቹ) ያቀርባሉ
- ሠራተኞቹ ሊያነቡ ከሚቻሉ (ቀላል ተግባሮቹ ከ 300 ቃላት ያነሰ) ያልረዘሙ ናቸው

ከ ማስፋፋትዎ በፊት **ፓይሎት ጥናት** (10–50 ሠራተኞቹ፣ 20–100 ተግባሮቹ) ያካሂዱ። ፓይሎቱ አለመስማማቶቹን ይቃኙ፤ አብዛኛዎቹ ሊስተካከሉ ወደሚቻሉ ምክር-ሁለት-ሊሆኑ-ትዕዛዛቶቹ ያቅጣጫሉ።

### ወርቅ-ደረጃ ጥያቄዎቹ

በ ተግባሩ ቁጥር ውስጥ **ወርቅ-ደረጃ ጥያቄዎቹ** — ትክክለኛ መልሶቹ ከ አስቀድሞ የሚታወቁ ተግባሮቹ — ያስቀምጡ። ዝቅተኛ ወሰን ሥር ወርቅ ጥያቄዎቹን ያካሄዱ ሠራተኞቹ ከ ፕሮጀክቱ ይወጣሉ።

```{code-cell} python
import numpy as np
from scipy.stats import binom

rng = np.random.default_rng(42)

def simulate_gold_screening(n_workers=100, gold_per_batch=5,
                             p_good_worker=0.7, good_acc=0.92,
                             bad_acc=0.55, threshold=0.70):
    """
    Simulate quality screening via gold questions.
    Returns: precision and recall of identifying bad workers.
    """
    worker_quality = rng.choice(['good', 'bad'], size=n_workers,
                                 p=[p_good_worker, 1 - p_good_worker])
    results = {'tp': 0, 'fp': 0, 'tn': 0, 'fn': 0}

    for q in worker_quality:
        acc = good_acc if q == 'good' else bad_acc
        n_correct = rng.binomial(gold_per_batch, acc)
        passed = (n_correct / gold_per_batch) >= threshold
        if q == 'bad' and not passed:  results['tp'] += 1
        if q == 'good' and not passed: results['fp'] += 1
        if q == 'bad' and passed:      results['fn'] += 1
        if q == 'good' and passed:     results['tn'] += 1

    tp, fp, fn = results['tp'], results['fp'], results['fn']
    precision = tp / (tp + fp + 1e-6)
    recall    = tp / (tp + fn + 1e-6)
    return precision, recall

# Vary gold question count
gold_counts = [3, 5, 8, 10, 15, 20]
precisions, recalls = [], []
for g in gold_counts:
    p_list, r_list = [], []
    for _ in range(50):
        p, r = simulate_gold_screening(gold_per_batch=g)
        p_list.append(p); r_list.append(r)
    precisions.append(np.mean(p_list))
    recalls.append(np.mean(r_list))

import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(gold_counts, precisions, 'o-', color='#2b3a8f', label='Precision', linewidth=2)
ax.plot(gold_counts, recalls,    's--', color='#0d9e8e', label='Recall',    linewidth=2)
ax.set_xlabel("Gold questions per batch", fontsize=12)
ax.set_ylabel("Screening performance", fontsize=12)
ax.set_title("Worker Screening via Gold Standard Questions", fontsize=13)
ax.legend(fontsize=11); ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('gold_screening.png', dpi=150)
plt.show()

p, r = simulate_gold_screening(gold_per_batch=5)
print(f"5 gold questions: Precision={p:.3f}, Recall={r:.3f}")
p, r = simulate_gold_screening(gold_per_batch=10)
print(f"10 gold questions: Precision={p:.3f}, Recall={r:.3f}")
```

---

## ምልክቱ ስምምነት ስታቲስቲካዊ ሞዴሎቹ

አብላጫ ድምጽ ተፈጥሯዊ መነሻ ነው ነገር ግን ምሳሌ ሰጪዎቹ ትክክለኛነት ልዩነቶቻቸውን ይሸሸጋል። ስታቲስቲካዊ ሞዴሎቹ የተሻለ ሊሠሩ ይችላሉ።

### Dawid-Skene ሞዴሉ

**Dawid-Skene (DS) ሞዴሉ** {cite}`dawid1979maximum` በጋርዮሽ ሚከተለውን ይገምታል፦
- ለ እያንዳንዱ ነጥብ $i$ **ትክክለኛ ምልክቱ** $z_i$
- ለ እያንዳንዱ ምሳሌ ሰጪ $j$ **ድርቅ ማትሪክሱ** $\pi_j^{(k,l)}$፦ ምሳሌ ሰጪ $j$ ትክክለኛ ምድብ $k$ ያለ ነጥብ ምድብ $l$ ሆኖ የሚምሳሌሉ ዕድሉ

EM ስልቱ ሚዘዋወር፦
- **E-ደረጃ፦** ምሳሌ ሰጪዎቹ ድርቅ ማትሪክሶቹ ካሉ፣ ለ እያንዳንዱ ትክክለኛ ምልክቱ ተዘዋዋሪ ዕድሉን አሰሉ
- **M-ደረጃ፦** ነጥቡ ምልክቱ ትመናዎቹ ካሉ፣ ምሳሌ ሰጪዎቹ ድርቅ ማትሪክሶቹን አዘምኑ

```{code-cell} python
import numpy as np
from scipy.special import softmax

def dawid_skene_em(annotations, n_classes, n_iter=20):
    """
    Simplified Dawid-Skene EM for binary classification.
    annotations: dict {item_idx: [(annotator_idx, label), ...]}
    Returns: estimated true labels and annotator accuracies.
    """
    items = sorted(annotations.keys())
    n_items = len(items)
    annotators = sorted({a for anns in annotations.values() for a, _ in anns})
    n_annotators = len(annotators)
    ann_idx = {a: i for i, a in enumerate(annotators)}

    # Initialize: majority vote
    T = np.zeros((n_items, n_classes))  # soft label estimates
    for i, item in enumerate(items):
        for _, label in annotations[item]:
            T[i, label] += 1
        T[i] /= T[i].sum()

    # Confusion matrices: shape (n_annotators, n_classes, n_classes)
    PI = np.ones((n_annotators, n_classes, n_classes)) * 0.5

    for _ in range(n_iter):
        # M-step: update confusion matrices
        PI = np.zeros((n_annotators, n_classes, n_classes)) + 1e-6
        for i, item in enumerate(items):
            for ann, label in annotations[item]:
                a = ann_idx[ann]
                for k in range(n_classes):
                    PI[a, k, label] += T[i, k]
        PI /= PI.sum(axis=2, keepdims=True)

        # E-step: update soft label estimates
        T = np.zeros((n_items, n_classes))
        for i, item in enumerate(items):
            log_p = np.zeros(n_classes)
            for ann, label in annotations[item]:
                a = ann_idx[ann]
                log_p += np.log(PI[a, :, label] + 1e-10)
            T[i] = softmax(log_p)

    return {item: T[i] for i, item in enumerate(items)}, PI

# Simulate crowdsourcing scenario
rng = np.random.default_rng(42)
N_ITEMS, N_ANNOTATORS, ANNS_PER_ITEM = 200, 10, 3
true_labels = rng.integers(0, 2, N_ITEMS)
# Annotator accuracies: 3 good (0.9), 4 medium (0.75), 3 noisy (0.6)
accuracies = [0.90]*3 + [0.75]*4 + [0.60]*3

annotations = {}
for i in range(N_ITEMS):
    anns_for_item = []
    chosen = rng.choice(N_ANNOTATORS, ANNS_PER_ITEM, replace=False)
    for a in chosen:
        acc = accuracies[a]
        label = true_labels[i] if rng.random() < acc else 1 - true_labels[i]
        anns_for_item.append((a, int(label)))
    annotations[i] = anns_for_item

# Run Dawid-Skene
soft_labels, confusion = dawid_skene_em(annotations, n_classes=2, n_iter=30)
ds_preds = {i: int(np.argmax(soft_labels[i])) for i in range(N_ITEMS)}

# Compare with majority vote
mv_preds = {}
for i in range(N_ITEMS):
    votes = [l for _, l in annotations[i]]
    mv_preds[i] = int(np.round(np.mean(votes)))

ds_acc = np.mean([ds_preds[i] == true_labels[i] for i in range(N_ITEMS)])
mv_acc = np.mean([mv_preds[i] == true_labels[i] for i in range(N_ITEMS)])

print(f"Majority vote accuracy:  {mv_acc:.3f}")
print(f"Dawid-Skene accuracy:    {ds_acc:.3f}")
print(f"\nEstimated annotator accuracies (diagonal of confusion matrix):")
for a in range(N_ANNOTATORS):
    est_acc = np.mean([confusion[a, k, k] for k in range(2)])
    print(f"  Annotator {a}: estimated={est_acc:.3f}, true={accuracies[a]:.2f}")
```

### MACE

**MACE (ብዙ-ምሳሌ ሰጪ ብቃት ትመና)** {cite}`hovy2013learning` ምሳሌ ሰጪዎቹ ዘፈቀደ ምድብ (spam) ስለ ሚሰጡ ወይም ዕውነተኛ ትርጓሜ ሰጪ ስለ ሆኑ ሁለቱን በ ግልጽ የሚወክል አማናዊ ስታቲስቲካዊ ሞዴሉ ነው። ምሳሌ ሰጪ ሁሉም-ዘፈቀደ ሠሪ (ዕድሉ $\text{spam}_j$) ወይም ዕውነተኛ ትርጓሜ ሰጪ (ዕድሉ $1 - \text{spam}_j$) ነው። ይህ ሁለት-አካሉ ሞዴሉ ለ ሕዝባዊ ምንጭ አቅርቦት ሁኔታዎቹ ብዙ ጊዜ ከ Dawid-Skene ይልቅ የተሻለ ስምምነት አለው።

---

## ድፍናዊነት እና ስምምነት ስልት

ለ ተግባሩ አስቸጋሪነት እና ምሳሌ ሰጪ ጥራቱ ላይ ተመስርቶ ለ ነጥብ ምሳሌ ሰጪዎቹ ጥሩ ቁጥር ይወሰናል፦

- **ቀላል ተግባሮቹ ካለ ሠልጥኑ ምሳሌ ሰጪዎቹ፦** 1–2 ምሳሌ ሰጪዎቹ ብዙ ጊዜ በቂ ናቸው
- **ልዩ ተግባሮቹ ካለ ሠልጥኑ ምሳሌ ሰጪዎቹ፦** 3 ምሳሌ ሰጪዎቹ + አብላጫ ድምጽ
- **ከባድ/ርዕሰ-ጉዳዮቹ ካለ ሕዝባዊ ሠራተኞቹ፦** 5–7 ምሳሌ ሰጪዎቹ + Dawid-Skene

ዋናው ሀሳብ፦ ድፍናዊነት ምሳሌ ሰጪ ትክክለኛነቱ ዝቅ ሲሆን ትልቅ ዋጋ አለው። ትክክለኛነቱ $p$ ለ ምሳሌ ሰጪ፣ $n$ ምሳሌ ሰጪዎቹ ካሉ አብላጫ ድምጽ ትክክለኛነቱ፦

$$
P(\text{MV correct}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

$p = 0.70$ ሲሆን፣ ሦስተኛ ምሳሌ ሰጪ ማከሉ አብላጫ ድምጽ ትክክለኛነቱን ከ 70% ወደ 78% ይጨምረዋል፤ $p = 0.90$ ሲሆን ሦስተኛ ምሳሌ ሰጪ ማምጣቱ ጥቅም ያነሰ ነው (ከ 90% ወደ 97%)።

```{seealso}
Dawid-Skene ሞዴሉ፦ {cite}`dawid1979maximum`። MACE፦ {cite}`hovy2013learning`። ለ NLP ሕዝባዊ ምንጭ አቅርቦት ሁሉን-አቀፍ ዳሰሳ፦ {cite}`snow2008cheap`። ሕዝባዊ ምንጭ ሥነ-ምግባርና ትክክለኛ ደሞዝ፦ ምዕራፍ 15 ይመልከቱ።
```
