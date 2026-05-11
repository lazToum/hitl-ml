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

# Tarin Aiki da Kula da Inganci

Lokacin da ayyukan lakabi suka yi sauƙi sosai har masu amfani da ba ƙwararru ba za su iya yi, dandamali na tarin aiki suna ba da damar samun babbar ƙungiyar aiki ta lakabi mai buƙata a buƙata a kuɗi ƙarami kowace item. Gina saitin bayanai masu inganci daga taron aiki yana buƙatar zanen aiki mai hankali, waddattaccen tsattsauran maimaitawa, da sarrafa inganci mai ƙarfi.

---

## Dandamali na Tarin Aiki

**Amazon Mechanical Turk (MTurk)** shine kasuwar tarin aiki ta asali, wanda aka ƙaddamar a 2005. Masu aiki ("Turkers") suna cika ƙananan ayyuka (HITs) da masu buƙata suka wallafa. Bincike na 2018 ya sami matsakaicin albashi na sa'a na gaske don Turkers na kusan $2/hr — ƙasa da ƙarancin albashi a ƙasashe da yawa masu samun kuɗi sosai {cite}`hara2018data` — damuwa ta da'a da aka magance daga baya a Babi na 15. MTurk yana mafi kyau don ayyuka masu sauƙi tare da ma'aunin bayyananne, mai iya tabbatarwa.

**Prolific** dandamali ne na tarin aiki na ilimi wanda ke tilasta ma'aunin biyan kuɗi na ƙaranci (a halin yanzu kusan £9/hr, kusan $11/hr, kamar yadda aka bayyana a cikin jagoran wallafa na Prolific), yana tattara mahalarta ta halaye na dimokra'iyya, kuma yana kiyaye kwamitin masu aiki waɗanda suka yarda su shiga bincike. Ana son shi don binciken kimiyyar zamantakewa da ayyuka waɗanda ke buƙatar wakilci.

**Appen** (da makamancin su: Telus International, iMerit) yana ba da ƙungiyar aiki na lakabi masu sarrafa tare da sarrafa inganci, ana amfani da su don ayyuka masu rikitarwa fiye da kima da ayyukan kamfanin.

**Al'ummu na musamman.** Don ayyuka musamman na yanki, al'ummu na sha'awa na yanki na iya ba da lakabi mai inganci: Galaxy Zoo don taurari, eBird don nau'in tsuntsu, Chess Tempo don lakabi na matsayi na chess.

---

## Zanen Aiki don Tarin Aiki

### Rushe Ayyuka Masu Rikitarwa

Ya kamata a rushe ayyuka masu rikitarwa zuwa ƙananan ayyuka masu sauƙi, ma'anar bayyananne. Maimakon roƙa masu aiki su yi cikakken lakabi na takarda, tambaya musu tambaya ɗaya mai mai da hankali a lokaci guda: "Shin wannan jumla ta ƙunshi sunan mutumin?" ko "Ƙididdiga bayyanar wannan fassara a sikeli na 1–5."

**Fa'idodin rushe aiki:**
- Ƙarancin buƙata ta kwamitin tunani kowace aiki → ƙarancin gajiya, inganci mafi ƙari
- Za a iya sarrafa ingancin kowane ƙaramin aiki daban
- Mafi sauƙin bincike da gyarawa

### Mahimmancin Umarni

Mafi yawan hasashen ingancin tarin aiki shine ingancin umarni. Umarni masu kyau na aiki:
- Bayyana *manufar* aikin a cikin jumla ɗaya
- Ba da ma'ana mai bayyana, mara rikitarwa na kowane rukuni
- Ba da misalai 3–5 masu aiki (musamman lokuta na iyaka)
- Ba su fi tsawo fiye da masu aiki za su karanta ta gaske ba (kalmomi < 300 don ayyuka masu sauƙi)

Gudanar da **bincike na gwaji** (masu aiki 10–50, ayyuka 20–100) kafin sikeli. Bincika rashin jituwa na gwaji; mafi yawansu suna nuna rikitarwa a cikin umarni waɗanda za a iya gyara.

### Tambayoyin Ma'aunin Zinariya

Saka **tambayoyin ma'aunin zinariya** — ayyuka tare da amoshin daidai da aka sani — cikin duk jerin aiki. Ana cire masu aiki waɗanda suka gaza tambayoyin zinariya ƙasa da iyaka daga aikin.

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

## Samfurin Lissafi don Haɗawa ta Lakabi

Zaɓin rinjaye asali ne amma yana watsi da bambancin daidaito na mai sanya lakabi. Samfurin lissafi na iya yin mafi kyau.

### Tsarin Dawid-Skene

**Tsarin Dawid-Skene (DS)** {cite}`dawid1979maximum` yana haɗa ƙiyasin:
- **Lakabi na gaskiya** $z_i$ don kowane item $i$
- **Matrix na rikicewa** $\pi_j^{(k,l)}$ don kowane mai sanya lakabi $j$: iya yiwuwar cewa mai sanya lakabi $j$ yana yin lakabi ga item mai ajin gaskiya $k$ a matsayin aji $l$

Algorithm EM yana maimaita:
- **E-mataki:** Da matrices na rikicewa na mai sanya lakabi da aka ba, ƙididdiga iya yiwuwar bayar da kowane lakabi na gaskiya
- **M-mataki:** Da ƙiyasin lakabi na item da aka ba, sabunta matrices na rikicewa na mai sanya lakabi

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

**MACE (Ƙiyasin Cancantar Masu Sanya Lakabi Da Yawa)** {cite}`hovy2013learning` tsari ne na iya yiwuwar mai sabani wanda ke wakilta ta fili mai sanya lakabi ya zama spammer (sanya lakabi ta damari) da lakabi mai cancantar aiki. Mai sanya lakabi ko yana ba da lakabi mai ma'ana (da iya yiwuwar $1 - \text{spam}_j$) ko lakabi ta damari (da iya yiwuwar $\text{spam}_j$). Wannan tsarin mai sassa biyu galibi yana da daidaitar ƙididdigan mafi kyau fiye da Dawid-Skene don yanayin tarin aiki inda wasu masu sanya lakabi sune masu spamming kawai.

---

## Tsattsauran Maimaitawa da Dabarun Haɗawa

Adadin mafi kyau na masu sanya lakabi kowace item yana dogara akan wahalar aiki da ingancin mai sanya lakabi:

- **Ayyuka masu sauƙi tare da masu sanya lakabi ƙwararru:** Masu sanya lakabi 1–2 kowace item galibi ya isa
- **Ayyuka matsakaici tare da masu sanya lakabi masu horo:** Masu sanya lakabi 3 + zaɓin rinjaye
- **Ayyuka masu wuya/na son zuciya tare da masu aiki na taron aiki:** Masu sanya lakabi 5–7 + Dawid-Skene

Ra'ayin muhimmanci: tsattsauran maimaitawa yana da ƙima sosai lokacin da daidaito na mai sanya lakabi ya kasance ƙarami. Don masu sanya lakabi masu daidaito $p$, daidaito na zaɓin rinjaye tare da $n$ masu sanya lakabi shine:

$$
P(\text{MV correct}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

Don $p = 0.70$, ƙara mai sanya lakabi na uku yana ƙara daidaito na zaɓin rinjaye daga 70% zuwa 78%; don $p = 0.90$, riba daga mai sanya lakabi na uku yana da ƙarami (daga 90% zuwa 97%).

```{seealso}
Tsarin Dawid-Skene: {cite}`dawid1979maximum`. MACE: {cite}`hovy2013learning`. Don duba cikakke na tarin aiki don NLP: {cite}`snow2008cheap`. Da'a da biyan kuɗi mai gaskiya: duba Babi na 15.
```
