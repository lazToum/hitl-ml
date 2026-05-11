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

# Ushirikiano wa Umma na Udhibiti wa Ubora

Kazi za uwekaji maelezo zinapokuwa rahisi za kutosha kufanywa na wasio wataalamu, majukwaa ya ushirikiano wa umma hutoa ufikiaji wa nguvu kazi kubwa za uwekaji maelezo zinazohitajika kwa gharama ndogo kwa kipengele. Kujenga mkusanyiko wa data wa ubora wa juu kutoka kwa umati kunahitaji muundo wa kazi uliozingatiwa, uziada wa kimkakati, na udhibiti wa ubora madhubuti.

---

## Majukwaa ya Ushirikiano wa Umma

**Amazon Mechanical Turk (MTurk)** ni soko la asili la ushirikiano wa umma, lililozinduliwa mwaka 2005. Wafanyakazi ("Turkers") wanakamilisha kazi ndogo ndogo (HITs) zilizowasilishwa na waombaji. Utafiti wa 2018 ulikuta mapato ya wastani ya kwa saa kwa Turkers ya takriban $2/saa — chini sana ya kiwango cha mshahara wa chini katika nchi nyingi zenye mapato ya juu {cite}`hara2018data` — wasiwasi wa kimaadili ulionzwa baadaye katika Sura ya 15. MTurk ni bora kwa kazi rahisi zenye vigezo wazi, vinavyoweza kuthibitishwa.

**Prolific** ni jukwaa la ushirikiano wa umma la kitaaluma linalolazimu kiwango cha malipo ya chini (kwa sasa karibu £9/saa, takriban $11/saa, kama ilivyoelezwa katika mwongozo uliochapishwa wa Prolific), linachunguza washiriki kwa kidemografia, na linadumisha jopo la wafanyakazi ambao wamekubali kushiriki katika utafiti. Linapendelewa kwa utafiti wa sayansi ya kijamii na kazi zinazohitaji uwakilishi.

**Appen** (na sawa: Telus International, iMerit) inatoa nguvu kazi za uwekaji maelezo zilizodhibitiwa na usimamizi wa ubora, zinazotumiwa kwa kazi za ugumu wa juu na miradi ya biashara.

**Jumuiya maalum.** Kwa kazi maalum za uwanja, jumuiya za washupavu wa uwanja zinaweza kutoa maelezo ya ubora wa juu: Galaxy Zoo kwa astronomia, eBird kwa spishi za ndege, Chess Tempo kwa uwekaji maelezo wa nafasi ya chess.

---

## Muundo wa Kazi kwa Ushirikiano wa Umma

### Gawanya Kazi Ngumu

Kazi ngumu zinapaswa kugawanywa katika kazi ndogo ndogo rahisi, zilizofafanuliwa vizuri. Badala ya kuomba wafanyakazi kuweka maelezo kikamilifu kwenye hati, waulize swali moja linalolenga kwa wakati mmoja: "Je, sentensi hii ina jina la mtu?" au "Panga uwazi wa tafsiri hii kwenye kipimo cha 1–5."

**Faida za kugawanya:**
- Mahitaji ya chini ya kiakili kwa kazi → uchovu mdogo, ubora wa juu zaidi
- Kila kazi ndogo inaweza kudhibitiwa ubora kwa kujitegemea
- Rahisi zaidi kukagua na kurekebisha

### Umuhimu wa Maelekezo

Kiashiria kimoja kikubwa zaidi cha ubora wa ushirikiano wa umma ni ubora wa maelekezo. Maelekezo mazuri ya kazi:
- Yanaeleza *lengo* la kazi katika sentensi moja
- Yanatoa ufafanuzi wazi, usio na utata wa kila kategoria
- Yanatoa mifano 3–5 iliyofanyiwa kazi (hasa hali za mipaka)
- Hayana zaidi ya wafanyakazi watakaosoma kweli (< maneno 300 kwa kazi rahisi)

Endesha **utafiti wa majaribio** (wafanyakazi 10–50, kazi 20–100) kabla ya kupanua. Changanua kutokubaliana kwa majaribio; nyingi zinaonyesha utata wa maelekezo ambao unaweza kurekebishwa.

### Maswali ya Kiwango cha Dhahabu

Weka **maswali ya kiwango cha dhahabu** — kazi zenye majibu sahihi yanayojulikana — katika mfululizo wote wa kazi. Wafanyakazi wanaoshindwa maswali ya dhahabu chini ya kizingiti wanaondolewa kutoka kwa mradi.

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

## Mifano ya Takwimu ya Ujumuishaji wa Lebo

Kura ya wingi ni msingi wa asili lakini inapuuza tofauti katika usahihi wa wawekaji maelezo. Mifano ya takwimu inaweza kufanya vizuri zaidi.

### Mfano wa Dawid-Skene

**Mfano wa Dawid-Skene (DS)** {cite}`dawid1979maximum` unakadiri pamoja:
- **Lebo ya kweli** $z_i$ kwa kila kipengele $i$
- **Matrix ya mkanganyiko** $\pi_j^{(k,l)}$ kwa kila mweka maelezo $j$: uwezekano kwamba mweka maelezo $j$ anapanga kipengele chenye darasa la kweli $k$ kama darasa $l$

Kanuni ya EM inarudia:
- **Hatua ya E:** Kwa matrices za mkanganyiko za wawekaji maelezo, hesabu uwezekano wa nyuma wa kila lebo ya kweli
- **Hatua ya M:** Kwa makadirio ya lebo ya kipengele, sasisha matrices za mkanganyiko za wawekaji maelezo

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

**MACE (Makadirio ya Uwezo wa Wawekaji Maelezo Wengi)** {cite}`hovy2013learning` ni mfano mbadala wa uwezekano ambao unawakilisha waziwazi kutuma taka kwa wawekaji maelezo (uwekaji lebo wa nasibu) dhidi ya uwekaji maelezo wa uwezo. Mweka maelezo ama hutoa lebo yenye maana (kwa uwezekano $1 - \text{taka}_j$) au lebo ya nasibu (kwa uwezekano $\text{taka}_j$). Mfano huu wa vipande viwili mara nyingi umewekwa vizuri zaidi kuliko Dawid-Skene kwa hali za ushirikiano wa umma ambapo wawekaji maelezo wengine ni watumaji taka tu.

---

## Mkakati wa Uziada na Ujumuishaji

Idadi bora ya wawekaji maelezo kwa kipengele inategemea ugumu wa kazi na ubora wa wawekaji maelezo:

- **Kazi rahisi na wawekaji maelezo wenye ujuzi:** Wawekaji maelezo 1–2 kwa kipengele mara nyingi vinatosha
- **Kazi za wastani na wawekaji maelezo waliofunzwa:** Wawekaji maelezo 3 + kura ya wingi
- **Kazi ngumu/za udhati na wafanyakazi wa umma:** Wawekaji maelezo 5–7 + Dawid-Skene

Ufahamu muhimu: uziada una thamani zaidi wakati usahihi wa wawekaji maelezo ni mdogo. Kwa wawekaji maelezo wenye usahihi $p$, usahihi wa kura ya wingi na wawekaji maelezo $n$ ni:

$$
P(\text{kura ya wingi sahihi}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

Kwa $p = 0.70$, kuongeza mweka maelezo wa tatu huongeza usahihi wa kura ya wingi kutoka 70% hadi 78%; kwa $p = 0.90$, faida kutoka kwa mweka maelezo wa tatu ni ndogo sana (kutoka 90% hadi 97%).

```{seealso}
Mfano wa Dawid-Skene: {cite}`dawid1979maximum`. MACE: {cite}`hovy2013learning`. Kwa mapitio ya kina ya ushirikiano wa umma kwa NLP: {cite}`snow2008cheap`. Maadili ya umati na malipo ya haki: angalia Sura ya 15.
```
