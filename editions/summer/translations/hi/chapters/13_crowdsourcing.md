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

# क्राउडसोर्सिंग एवं गुणवत्ता नियंत्रण

जब अनुलेखन कार्य गैर-विशेषज्ञों द्वारा किए जाने के लिए पर्याप्त सरल हों, तो क्राउडसोर्सिंग प्लेटफ़ॉर्म कम प्रति-आइटम लागत पर बड़े, माँग पर अनुलेखन कार्यबल तक पहुँच प्रदान करते हैं। क्राउड से उच्च-गुणवत्ता लेबल किए गए डेटासेट बनाने के लिए सावधानीपूर्वक कार्य डिज़ाइन, रणनीतिक अतिरिक्तता, और कड़े गुणवत्ता नियंत्रण की आवश्यकता होती है।

---

## क्राउडसोर्सिंग प्लेटफ़ॉर्म

**Amazon Mechanical Turk (MTurk)** मूल क्राउडसोर्सिंग मार्केटप्लेस है, जो 2005 में लॉन्च हुआ। एक 2018 अध्ययन में Turkers के लिए औसत प्रभावी प्रति घंटा आय लगभग $2/घंटा पाई गई — कई उच्च-आय वाले देशों में न्यूनतम वेतन से काफी कम {cite}`hara2018data`।

**Prolific** एक शैक्षणिक क्राउडसोर्सिंग प्लेटफ़ॉर्म है जो न्यूनतम वेतन मानक (Prolific के प्रकाशित दिशानिर्देशों में उल्लिखित वर्तमान में लगभग £9/घंटा) लागू करता है।

**Appen** (और Telus International, iMerit) प्रबंधित अनुलेखन कार्यबल प्रदान करता है।

---

## क्राउडसोर्सिंग के लिए कार्य डिज़ाइन

### जटिल कार्यों को विघटित करें

जटिल कार्यों को सरल, अच्छी तरह परिभाषित माइक्रो-कार्यों में विघटित किया जाना चाहिए।

**विघटन के लाभ:**
- प्रति कार्य कम संज्ञानात्मक माँग → कम थकान, उच्च गुणवत्ता
- प्रत्येक माइक्रो-कार्य को अलग से गुणवत्ता-नियंत्रित किया जा सकता है

### स्वर्ण मानक प्रश्न

कार्य बैच में **स्वर्ण मानक प्रश्न** — ज्ञात सही उत्तरों वाले कार्य — एम्बेड करें।

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

## लेबल एकत्रीकरण के लिए सांख्यिकीय मॉडल

### Dawid-Skene मॉडल

**Dawid-Skene (DS) मॉडल** {cite}`dawid1979maximum` संयुक्त रूप से अनुमान लगाता है:
- प्रत्येक आइटम $i$ के लिए **सत्य लेबल** $z_i$
- प्रत्येक अनुलेखक $j$ के लिए **भ्रम मैट्रिक्स** $\pi_j^{(k,l)}$

EM एल्गोरिदम पुनरावृत्त करता है:
- **E-step:** अनुलेखक भ्रम मैट्रिक्स दिए जाने पर, प्रत्येक सत्य लेबल की पश्च प्रायिकता की गणना करें
- **M-step:** आइटम लेबल अनुमान दिए जाने पर, अनुलेखक भ्रम मैट्रिक्स अपडेट करें

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

**MACE (Multi-Annotator Competence Estimation)** {cite}`hovy2013learning` एक वैकल्पिक प्रायिकता मॉडल है जो स्पष्ट रूप से अनुलेखक स्पैमिंग (यादृच्छिक लेबलिंग) बनाम सक्षम अनुलेखन का प्रतिनिधित्व करता है।

---

## अतिरिक्तता और एकत्रीकरण रणनीति

प्रति आइटम अनुलेखकों की इष्टतम संख्या कार्य कठिनाई और अनुलेखक गुणवत्ता पर निर्भर करती है:

- **कुशल अनुलेखकों के साथ आसान कार्य:** 1–2 अनुलेखक प्रति आइटम अक्सर पर्याप्त होते हैं
- **प्रशिक्षित अनुलेखकों के साथ मध्यम कार्य:** 3 अनुलेखक + बहुमत वोट
- **क्राउडवर्कर के साथ कठिन/व्यक्तिपरक कार्य:** 5–7 अनुलेखक + Dawid-Skene

अनुलेखक सटीकता $p$ के साथ $n$ अनुलेखकों के साथ बहुमत वोट सटीकता:

$$
P(\text{MV correct}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

```{seealso}
Dawid-Skene मॉडल: {cite}`dawid1979maximum`। MACE: {cite}`hovy2013learning`। NLP के लिए क्राउडसोर्सिंग की व्यापक समीक्षा के लिए: {cite}`snow2008cheap`। भीड़ नैतिकता और उचित वेतन: अध्याय 15 देखें।
```
