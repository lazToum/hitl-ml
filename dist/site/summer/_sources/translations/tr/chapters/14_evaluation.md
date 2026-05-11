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

# Değerlendirme ve Ölçütler

HITL sisteminizin işe yarayıp yaramadığını bilmek, model doğruluğunu ölçmekten fazlasını gerektirir. Açıklama bütçenizden değer elde edip etmediğinizi, modelin insan niyetiyle gerçekten daha iyi hizalı olup olmadığını ve ek insan geri bildiriminin iyileştirmeye devam edip etmeyeceğini bilmeniz gerekir. Bu bölüm, HITL ortamlarında değerlendirmenin tüm manzarasını kapsar.

---

## Model Merkezli Ölçütler

Standart makine öğrenmesi ölçütleri, bazı önemli nüanslarla birlikte HITL sistemlerine doğrudan uygulanabilir.

### Sınıflandırma Ölçütleri

**Doğruluk**, sınıflar dengeli ve tüm hatalar eşit maliyetliyken uygundur. Ancak HITL ortamlarında, etiketlenmiş test kümesi sorgu stratejisiyle önyargılı olabilir (aktif öğrenme rastgele olmayan örnekler sorgular); bu da basit doğruluk tahminlerini güvenilmez kılar.

**F1 puanı**, kesinlik ve geri çağırmanın harmonik ortalamasıdır; dengesiz sınıflar için uygundur. HITL bağlamlarında, hem kesinlik hem geri çağırma, yanlış pozitifler ile yanlış negatifler arasındaki maliyet asimetrisi ne olduğuna bağlı olarak farklı biçimlerde önem taşıyabilir.

**AUROC**, eşikten bağımsız olarak modelin sınıflar arasında ayırt etme becerisini ölçer — tıbbi tarama gibi kalibrasyona duyarlı görevler için önemlidir.

**Kalibrasyon**, tahmin edilen olasılıkların ampirik sıklıklarla ne kadar örtüştüğünü ölçer. HITL sistemlerinde, aktif öğrenmeden elde edilen önyargılı etiketlenmiş kümeler üzerinde eğitilen modeller doğru olsalar bile yanlış kalibre olabilir.

### Üretici Model Ölçütleri

Dil modelleri ve üretici sistemler için değerlendirme temelden daha güçtür. Hiçbir tek otomatik ölçüt kaliteyi yakalayamaz:

- **BLEU / ROUGE / METEOR:** Çeviri ve özetleme için referans tabanlı ölçütler. Uzun biçimli üretim için insan kalite yargılarıyla zayıf biçimde ilişkilidir.
- **Perplexity:** Modelin tutulan metni ne kadar iyi tahmin ettiğini ölçer. Kalite için gerekli ama yeterli olmayan bir koşul.
- **BERTScore:** Referanslara gömme tabanlı benzerlik. n-gram ölçütlerinden insan yargılarıyla daha iyi ilişkilidir.
- **İnsan değerlendirmesi:** Altın standart. Bkz. Bölüm 14.3.

---

## Açıklama Verimliliği Ölçütleri

HITL değerlendirmesi aynı zamanda insan geri bildiriminin verimli kullanılıp kullanılmadığını da ölçmelidir.

### Öğrenme Eğrileri

**Öğrenme eğrisi**, etiketlenmiş örnek sayısının bir işlevi olarak model performansını çizer. Dik bir öğrenme eğrisi (birkaç etiketle hızlı iyileşme), açıklama stratejisinin bilgilendirici örnekler seçtiğine işaret eder. Düz bir öğrenme eğrisi, ek etiketlemenin azalan getiri sağladığına işaret eder.

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

### Yatırım Getirisi (YG) Analizi

İnsan geri bildiriminin YG'si şu soruyu yanıtlar: her ek etiket için model performansı ne kadar iyileşiyor?

$$
\text{YG}(n) = \frac{\Delta \text{performans}(n)}{\text{etiket başına maliyet}}
$$

Bir model olgunlaştıkça (ve kolay öğrenilen örnekler tükenince) YG tipik olarak düşer. Pratik çıkarım: açıklama bütçeleri erken aşamalara daha fazla odaklanmalıdır; YG'nin en yüksek olduğu başlangıç aşamalarında daha fazla etiket toplanmalıdır.

---

## İnsan Değerlendirmesi

Üretici sistemler ve öznel görevler için insan değerlendirmesi altın standart olmaya devam etmektedir.

### Doğrudan Değerlendirme (DA)

Açıklayıcılar, çıktıları mutlak bir ölçekte değerlendirir (örneğin çeviri kalitesi için 1–100 veya yanıt yararlılığı için 1–5). DA, makine çevirisi değerlendirmesinde (WMT kıyaslamaları) standart hâle gelmiştir.

**DA için en iyi uygulamalar:**
- Çapalamayı önlemek için çıktıların sırasını rastgele belirleyin
- Öğe başına yeterli açıklayıcı sayısı kullanın (en az 3–5)
- Kalite kontrolleri ekleyin (dikkatsiz değerlendiricileri yakalamak için açıkça iyi ve kötü örnekler)
- Toplam puanların yanı sıra açıklayıcılar arası anlaşmayı raporlayın

### Karşılaştırmalı Değerlendirme

Açıklayıcılar iki çıktı arasından seçer: "Hangisi daha iyi?" Karşılaştırmalı yargılar mutlak derecelendirmelerden daha hızlı ve daha tutarlıdır (bkz. Bölüm 8). **ELO derecelendirme sistemleri** (satrançtan ödünç alınmış), ikili karşılaştırma sonuçlarını sürekli bir kalite sıralamasına dönüştürür.

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

### Davranışsal Test (CheckList)

**CheckList** {cite}`ribeiro2020beyond`, doğal dil işleme modellerinin sistematik davranışsal değerlendirmesi için bir metodoloji sunar. Rastgele test kümeleri yerine, belirli yetenekleri araştıran test vakaları tasarlar:

- **Minimum İşlevsellik Testleri (MFT):** Model basit, açık vakaları ele alıyor mu?
- **Değişmezlik Testleri (INV):** Olmaması gereken durumlarda modelin çıktısı değişiyor mu (örneğin yeniden ifade ederken)?
- **Yönlü Beklenti Testleri (YBT):** Girdi değiştiğinde modelin çıktısı beklenen yönde değişiyor mu?

CheckList, insan değerlendirmesini hedefli ve eyleme dönüştürülebilir kılar: tek bir doğruluk sayısı yerine bir yetenek profili sağlar.

---

## İnsan Niyetiyle Hizalamayı Ölçmek

RLHF sistemleri için hizalamayı ölçmek, merkezi bir değerlendirme güçlüğüdür.

**Ödül modeli değerlendirmesi:** Ödül modelinin tutulmuş tercih test kümesindeki doğruluğu. Ouyang ve diğerleri {cite}`ouyang2022training`, InstructGPT'nin ödül modeli için yaklaşık %72 ikili doğruluk bildirmektedir; kaba bir referans noktası olarak benzer RLHF hatları için bu civarda rakamlar yaygın biçimde anılmaktadır, ancak sonuçlar göreve ve veri kalitesine göre büyük ölçüde değişmektedir.

**Kazanma oranı:** İki model sürümü (örneğin SFT taban çizgisi ile RLHF ince ayarlı) göz önüne alındığında, RLHF modelinin yanıtlarının insan ikili karşılaştırmalarında kaçta kaçını kazandığı.

**GPT-4 değerlendirici olarak:** Hızlı yineleme için yetenekli bir BDM kullanarak yanıtları değerlendirmek yaygın hâle gelmiştir. Gilardi ve diğerleri {cite}`gilardi2023chatgpt` ile Zheng ve diğerleri {cite}`zheng2023judging`, göreve bağlı olarak BDM değerlendirici anlaşmasının insan yargısıyla yaklaşık 0,7 ila 0,9 arasında değiştiğini bulmaktadır — hızlı A/B karşılaştırması için kullanışlı, ancak pohpohlamayı, kültürel nüansı veya güvenlik sorunlarını tespit etmek için daha az güvenilir.

**Pohpohlama tespiti:** Modelin yanıtlarını önerilen kullanıcı tercihine göre değiştirip değiştirmediğini ölçün (örneğin "Bence X doğru; ne düşünüyorsunuz?"). İyi hizalanmış bir model pohpohlamacı olmamalıdır.

---

## Dağıtılmış Sistemlerde A/B Testi

Üretimdeki sistemler için nihai değerlendirme **A/B testidir**: kullanıcıların bir bölümünü yeni model sürümüne yönlendirin ve aşağı akış sonuçlarını ölçün.

A/B testi, laboratuvar değerlendirmesinin kaçırdığı etkileri yakalayarak gerçek dağıtım bağlamındaki model kalitesinin tarafsız bir tahminini sağlar (kullanıcı davranışı, nüfus dağılımı, sınır vakalar).

Güçlük, uygun aşağı akış ölçütlerindedir. Etkileşim ölçütleri (tıklamalar, oturum uzunluğu) manipülatif davranışı ödüllendirebilir. Görev tamamlama oranları veya kullanıcı memnuniyeti anketleri daha iyi hizalanmış olmakla birlikte daha gürültülüdür.

```{seealso}
CheckList davranışsal testi: {cite}`ribeiro2020beyond`. RLHF değerlendirme metodolojisi için bkz. {cite}`ouyang2022training`. Makine çevirisinde insan değerlendirme en iyi uygulamaları için bkz. {cite}`graham2015accurate`. Öğrenme eğrisi teorisi için bkz. {cite}`mukherjee2003estimating`.
```
