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

# Kitle Kaynaklı Çalışma ve Kalite Kontrolü

Açıklama görevleri uzman olmayan kişiler tarafından yapılabilecek kadar basit olduğunda, kitle kaynaklı platformlar düşük öğe başına maliyette büyük, talep üzerine açıklama işgücüne erişim sağlar. Kalabalıktan yüksek kaliteli etiketlenmiş veri kümeleri oluşturmak, dikkatli görev tasarımı, stratejik yedeklilik ve titiz kalite kontrolü gerektirir.

---

## Kitle Kaynaklı Platformlar

**Amazon Mechanical Turk (MTurk)**, 2005 yılında başlatılan özgün kitle kaynaklı pazar yeridir. Çalışanlar ("Turkerlar"), talep sahiplerinin yayımladığı mikro görevleri (HIT'leri) tamamlar. 2018 tarihli bir çalışma, Turkerlar için medyan etkin saatlik kazancı yaklaşık 2 ABD doları olarak buldu — pek çok yüksek gelirli ülkede asgari ücretin çok altında {cite}`hara2018data` — Bölüm 15'te ele alınan etik bir endişe. MTurk, net ve doğrulanabilir ölçütlere sahip basit görevler için en uygundur.

**Prolific**, asgari ücret standardı uygulayan (Prolific'in yayımlanmış kılavuzlarında belirtildiği üzere şu an yaklaşık 9 GBP/saat, yaklaşık 11 ABD doları/saat), katılımcıları demografiğe göre taradığı ve araştırmaya katılmayı kabul eden çalışanlardan oluşan bir panel sürdürdüğü akademik kitle kaynaklı platformdur. Sosyal bilim araştırmaları ve temsiliyet gerektiren görevler için tercih edilir.

**Appen** (ve benzerleri: Telus International, iMerit), daha karmaşık görevler ve kurumsal projeler için kullanılan kalite yönetimiyle yönetilen açıklama işgücü sağlar.

**Özelleşmiş topluluklar.** Alana özgü görevler için alan meraklılarından oluşan topluluklar yüksek kaliteli açıklamalar sağlayabilir: astronomi için Galaxy Zoo, kuş türleri için eBird, satranç pozisyonu açıklaması için Chess Tempo.

---

## Kitle Kaynaklı Çalışma için Görev Tasarımı

### Karmaşık Görevleri Parçalara Ayırın

Karmaşık görevler basit, iyi tanımlanmış mikro görevlere ayrıştırılmalıdır. Çalışanlardan bir belgeyi kapsamlı biçimde açıklamasını istemek yerine, her seferinde odaklı bir soru sorun: "Bu cümle bir kişinin adını içeriyor mu?" veya "Bu çevirinin anlaşılırlığını 1–5 ölçeğinde değerlendirin."

**Ayrıştırmanın faydaları:**
- Görev başına daha az bilişsel talep → daha az yorgunluk, daha yüksek kalite
- Her mikro görev ayrı ayrı kalite kontrol edilebilir
- Denetlenmesi ve hata ayıklaması daha kolay

### Talimatların Önemi

Kitle kaynaklı çalışma kalitesinin en büyük tek belirleyicisi, talimat kalitesidir. İyi görev talimatları:
- Görevi tek bir cümlede açıklar
- Her kategori için açık ve net bir tanım sağlar
- 3–5 çalışılmış örnek verir (özellikle sınır vakalar)
- Çalışanların gerçekten okuyacağı uzunlukta olur (basit görevler için 300 kelimenin altında)

Ölçeklendirmeden önce bir **pilot çalışma** yürütün (10–50 çalışan, 20–100 görev). Pilot anlaşmazlıklarını analiz edin; çoğu düzeltilebilecek talimat belirsizliklerine işaret eder.

### Altın Standart Sorular

Görev grubuna **altın standart soruları** — bilinen doğru yanıtlara sahip görevler — yerleştirin. Altın soruları eşiğin altında başaramayan çalışanlar, projeden çıkarılır.

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

## Etiket Birleştirme için İstatistiksel Modeller

Çoğunluk oyu, doğal bir taban çizgisidir ancak açıklayıcı doğruluğundaki farklılıkları görmezden gelir. İstatistiksel modeller daha iyi sonuç verebilir.

### Dawid-Skene Modeli

**Dawid-Skene (DS) modeli** {cite}`dawid1979maximum` şunları birlikte tahmin eder:
- Her $i$ öğesi için **gerçek etiket** $z_i$
- Her $j$ açıklayıcısı için **karışıklık matrisi** $\pi_j^{(k,l)}$: $j$ açıklayıcısının gerçek sınıfı $k$ olan bir öğeyi $l$ sınıfı olarak etiketleme olasılığı

EM algoritması şunlar arasında yinelenir:
- **E adımı:** Açıklayıcı karışıklık matrisleri göz önüne alındığında, her gerçek etiketin arka plan olasılığını hesapla
- **M adımı:** Öğe etiket tahminleri göz önüne alındığında, açıklayıcı karışıklık matrislerini güncelle

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

**MACE (Çok Açıklayıcılı Yeterlik Tahmini)** {cite}`hovy2013learning`, açıklayıcı spam göndermeyi (rastgele etiketleme) ile yetkin açıklamayı açıkça temsil eden alternatif bir olasılıksal modeldir. Bir açıklayıcı ya anlamlı bir etiket sağlar ($1 - \text{spam}_j$ olasılığıyla) ya da rastgele bir etiket sağlar ($\text{spam}_j$ olasılığıyla). Bu iki bileşenli model, bazı açıklayıcıların tamamen spam gönderdiği kitle kaynaklı çalışma senaryoları için çoğunlukla Dawid-Skene'den daha iyi kalibre edilmiştir.

---

## Yedeklilik ve Birleştirme Stratejisi

Öğe başına en uygun açıklayıcı sayısı, görev güçlüğüne ve açıklayıcı kalitesine bağlıdır:

- **Yetenekli açıklayıcılarla kolay görevler:** Öğe başına 1–2 açıklayıcı çoğunlukla yeterlidir
- **Eğitimli açıklayıcılarla orta görevler:** 3 açıklayıcı + çoğunluk oyu
- **Kitle çalışanlarıyla güç/öznel görevler:** 5–7 açıklayıcı + Dawid-Skene

Temel kavrayış: yedeklilik, açıklayıcı doğruluğu düşük olduğunda en değerlidir. $p$ doğruluklu açıklayıcılarla $n$ açıklayıcıyla çoğunluk oyu doğruluğu şöyledir:

$$
P(\text{ÇO doğru}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

$p = 0{,}70$ için üçüncü bir açıklayıcı eklemek çoğunluk oyu doğruluğunu %70'ten %78'e çıkarır; $p = 0{,}90$ için üçüncü bir açırlayıcıdan elde edilen kazanım ihmal edilebilir düzeydedir (%90'dan %97'ye).

```{seealso}
Dawid-Skene modeli: {cite}`dawid1979maximum`. MACE: {cite}`hovy2013learning`. Doğal dil işleme için kitle kaynaklı çalışmanın kapsamlı incelemesi için bkz. {cite}`snow2008cheap`. Kalabalık etiği ve adil ücret: bkz. Bölüm 15.
```
