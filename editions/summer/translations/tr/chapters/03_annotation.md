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

# Veri Açıklaması ve Etiketleme

Veri açıklaması, makine öğrenmesindeki insan katılımının en yaygın biçimidir. Bir model öğrenmeye başlamadan önce birinin doğru yanıtların ne olduğunu söylemesi gerekir — bu biri çoğunlukla bir insandır. Bu bölüm, açıklamanın teorisini ve pratiğini kapsar: açıklamayı güçleştiren nedir, açıklama görevleri nasıl tasarlanır, kalite nasıl ölçülür ve anlaşmazlıklar nasıl ele alınır.

---

## Açıklama Türleri

Açıklama görevleri yapıları, güçlükleri ve maliyetleri bakımından büyük ölçüde farklılaşır. Başlıca türler şunlardır:

### Sınıflandırma

Açıklayıcı her örneği önceden tanımlanmış $K$ kategoriden birine atar. Bu, bilişsel açıdan en basit açıklama görevidir; ancak iyi bir kategori şeması (*taksonomi*) tasarlamak şaşırtıcı ölçüde güç olabilir.

**İkili sınıflandırma** (bu görüntü bir kedi mi?) en basit durumdur. **Çok sınıflı sınıflandırma** (bu hayvan hangi türe ait?) açıklayıcının listeden tek seçenek yapmasını gerektirir. **Çok etiketli** açıklama (bu makale hangi konuları kapsar?) aynı anda birden fazla etiket atamasına olanak tanır.

### Dizi Etiketleme

Bir dizideki her belirteç bir etiket alır. Adlandırılmış Varlık Tanıma (NER) klasik örnektir — açıklayıcılar metin parçalarını KİŞİ, KURULUŞ, KONUM vb. olarak işaretler. Açıklama genellikle BIO (Başlangıç–İçinde–Dışında) veya BIOES etiketleme şeması kullanılarak gerçekleştirilir:

```text
  B-ORG    O           B-ORG    O     O      O
```

### Parça ve İlişki Açıklaması

Tek tek belirteçleri etiketlemenin ötesinde açıklayıcıların şunları yapması gerekebilir:
- Parçaları (çok belirteçli ifadeler) belirleyip türleri atamak
- Parçalar arasındaki *ilişkileri* işaretlemek ("Apple" EDİNDİ "Shazam")
- Eş-atıf zincirlerini açıklamak (aynı varlığın tüm anılması)

Bu görevler bilişsel açıdan zorlu olup açıklayıcılar arası anlaşma düzeyi daha düşüktür.

### Sınır Kutuları ve Nesne Algılama

Açıklayıcılar görüntülerdeki nesnelerin etrafına dikdörtgenler çizer ve her kutuya bir kategori etiketi atar. Konumlandırma hassasiyeti önem taşır: çok küçük bir kutu bağlamı kaçırır; çok büyük bir kutu arka planı içerir. Modern açıklama araçları, kalite sorunlarını işaretlemek için referans açıklamalarla kesişim/birleşim (IoU) değerini hesaplar.

### Segmentasyon

Piksel düzeyinde açıklama: her piksel bir sınıfa (anlamsal segmentasyon) ya da belirli bir nesne örneğine (örnek segmentasyonu) atanır. Yüksek kaliteli segmentasyon en pahalı açıklama türlerinden biridir; karmaşık sahnelerde alana ve araç desteğine bağlı olarak görüntü başına maliyetler onlardan yüz doların üzerine çıkabilir.

### Transkripsiyon ve Çeviri

Ses → metin (ASR eğitim verisi), el yazısı → metin (OCR verisi) veya kaynak dil → hedef dil (MT verisi). Bu görevler dilbilimsel uzmanlık gerektirir ve eğitimsiz açıklayıcılar tarafından güvenilir biçimde yapılamaz.

---

## Açıklama Kılavuzları

Açıklama kalitesinin en belirleyici etkeni, açıklayıcıların uyduğu yazılı talimatlar olan **açıklama kılavuzlarının** kalitesidir.

İyi kılavuzlar:
- Görev hedefini belirtir ve etiketin *neden* önem taşıdığını açıklar
- Olumlu ve olumsuz örneklerle birlikte her kategori için net bir tanım sunar
- Yaygın sınır durumlarını ve güç vakaları açıkça ele alır
- Belirsizlik durumunda ne yapılacağını belirtir (örneğin "atla" işaretlemek mi zorunlu seçim mi)
- Eksiksiz açıklama örnekleri içerir

Kötü kılavuzlar, açıklayıcıların sınır vakalar için "sağduyu kullanmasına" güvenir — bu durum, model kalitesini düşüren ve açıklayıcılar arası anlaşmazlığı artıran tutarsız kararlara yol açar.

```{admonition} Kılavuz geliştirme yinelemeli bir süreçtir
:class: note

Mükemmel kılavuzları baştan yazmayı beklemeyin. Küçük çaplı bir pilot açıklama turu yürütün, anlaşmazlıkları analiz edin ve kılavuzları güncelleyin. Tekrarlayın. İyi geliştirilmiş kılavuzlar genellikle kararlılık kazanmadan önce 3–5 revizyon döngüsünden geçer.
```

---

## Açıklama Kalitesini Ölçme: Açıklayıcılar Arası Anlaşma

Birden fazla açıklayıcı aynı veriyi etiketlediğinde anlaşmaları ölçülebilir. Yüksek anlaşma, görevin iyi tanımlandığını ve açıklayıcıların bunu anladığını gösterir. Düşük anlaşma, görevde, kılavuzlarda veya verinin kendisinde belirsizliğe işaret eder.

### Cohen'in Kappa Katsayısı

Veriyi $K$ kategoriye etiketleyen iki açıklayıcı için **Cohen'in kappa katsayısı** {cite}`cohen1960coefficient` gözlemlenen anlaşmayı rastlantı için düzeltir:

$$
\kappa = \frac{P_o - P_e}{1 - P_e}
$$

burada $P_o$ gözlemlenen orantısal anlaşmadır ve $P_e$ rastlantısal anlaşma olasılığıdır (marjinal etiket dağılımlarından hesaplanır).

$\kappa = 1$ mükemmel anlaşmayı; $\kappa = 0$ rastlantıdan iyi olmayan anlaşmayı; $\kappa < 0$ sistematik anlaşmazlığı ifade eder.

| $\kappa$ aralığı | Yorum               |
|------------------|---------------------|
| $< 0$            | Rastlantıdan az     |
| $0{,}0 - 0{,}20$ | Çok düşük           |
| $0{,}21 - 0{,}40$| Düşük               |
| $0{,}41 - 0{,}60$| Orta                |
| $0{,}61 - 0{,}80$| Yüksek              |
| $0{,}81 - 1{,}00$| Neredeyse mükemmel  |

### Fleiss'ın Kappa Katsayısı

Cohen'in kappa katsayısını $M > 2$ açıklayıcıya genişletir. Her açıklayıcı her öğeyi bağımsız olarak etiketler; formül açıklayıcılar genelinde toplar:

$$
\kappa_F = \frac{\bar{P} - \bar{P}_e}{1 - \bar{P}_e}
$$

burada $\bar{P}$ tüm açıklayıcı çiftlerindeki ortalama ikili anlaşmadır ve $\bar{P}_e$ rastgele atama altında beklenen anlaşmadır.

### Krippendorff'un Alfa Katsayısı

Herhangi sayıda açıklayıcıyı, herhangi bir ölçek türünü (nominal, sıralı, aralıklı, oransal) ve eksik veriyi destekleyen en genel ölçüttür {cite}`krippendorff2011computing`:

$$
\alpha = 1 - \frac{D_o}{D_e}
$$

burada $D_o$ gözlemlenen anlaşmazlık ve $D_e$ beklenen anlaşmazlıktır. Krippendorff'un alfa katsayısı, esnekliği nedeniyle akademik çalışmalarda genellikle tercih edilir.

```{code-cell} python
import numpy as np
from sklearn.metrics import cohen_kappa_score

# Simulate two annotators labeling 200 items into 3 categories
rng = np.random.default_rng(0)
true_labels = rng.integers(0, 3, size=200)

# Annotator 1: mostly agrees with ground truth
ann1 = true_labels.copy()
flip_mask = rng.random(200) < 0.15
ann1[flip_mask] = rng.integers(0, 3, size=flip_mask.sum())

# Annotator 2: less consistent
ann2 = true_labels.copy()
flip_mask2 = rng.random(200) < 0.30
ann2[flip_mask2] = rng.integers(0, 3, size=flip_mask2.sum())

kappa_12 = cohen_kappa_score(ann1, ann2)
kappa_1true = cohen_kappa_score(ann1, true_labels)
kappa_2true = cohen_kappa_score(ann2, true_labels)

print(f"Cohen's κ (ann1 vs ann2):   {kappa_12:.3f}")
print(f"Cohen's κ (ann1 vs truth):  {kappa_1true:.3f}")
print(f"Cohen's κ (ann2 vs truth):  {kappa_2true:.3f}")
```

---

## Anlaşmazlıkların Ele Alınması

Açıklayıcılar anlaşmazlığa düştüğünde birkaç strateji mevcuttur:

### Çoğunluk Oyu

En yaygın etiket altın standart olarak alınır. Öğe başına açıklayıcı sayısı tek olduğunda basit ve sağlamdır. Azınlık grubundaki açıklayıcıların sistematik olarak daha doğru olduğu durumlarda başarısız olur.

### Ağırlıklı Oylama

Açıklayıcılar, tahmini doğruluklarına göre ağırlıklandırılır (altın standart veya diğer açıklayıcılarla anlaşmadan türetilir). Daha doğru açıklayıcıların etkisi daha fazladır.

### Yumuşak Etiketler

Açıklamaları tek bir etikette yoğunlaştırmak yerine dağılımı koruyun. 5 açıklayıcıdan 3'ü "pozitif" ve 2'si "nötr" dediyse bunu $(p_\text{pos}, p_\text{nötr}, p_\text{neg}) = (0{,}6, 0{,}4, 0{,}0)$ olarak temsil edin. Yumuşak etiketlerle eğitim, kalibrasyon kalitesini artırır.

### Tahkim

Kıdemli bir açıklayıcı veya alan uzmanı anlaşmazlıklara karar verir. Altın standart bir yaklaşımdır ancak pahalıdır; genellikle yüksek riskli alanlar için ayrılır.

### İstatistiksel Modeller

Daha sofistike yaklaşımlar, açıklayıcı yetkinliğini olasılıksal biçimde modeller. **Dawid-Skene** modeli {cite}`dawid1979maximum`, EM algoritması aracılığıyla hem açıklayıcı karışıklık matrislerini hem de öğe gerçek etiketlerini eş zamanlı olarak tahmin eder. Ayrıntılar için bkz. Bölüm 13.

---

## Etiket Gürültüsü ve Etkileri

Gerçek açıklamalar gürültülüdür. Etiket gürültüsünün model eğitimine etkileri, gürültü türüne bağlıdır:

- **Rastgele gürültü** (etiketlerin rastgele çevrilmesi) performansı düşürür, ancak modeller ılımlı düzeylere (birçok görev için ~%20'ye kadar) şaşırtıcı biçimde dayanıklıdır.
- **Sistematik/saldırgan gürültü** (etiketlerin belirli kalıplarda sürekli yanlış olması) çok daha zararlıdır ve tespit edilmesi güçtür.
- **Sınıf koşullu gürültü** (belirli sınıflar için daha fazla hata) modelin karar sınırını önyargılı hâle getirir.

Pratik bir kural: $n$ eğitim örneği ve $\epsilon$ bozuk etiket oranıyla model performansı, yaklaşık olarak $(1 - 2\epsilon)^2 n$ temiz örneğe eşdeğer biçimde bozulur {cite}`natarajan2013learning`. $\epsilon = 0{,}2$ için bu, verinizin %36'sını yitirmeye eşdeğerdir.

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(42)
X, y = make_classification(n_samples=2000, n_features=20, random_state=42)

noise_levels = np.linspace(0, 0.45, 15)
mean_accs = []

for eps in noise_levels:
    y_noisy = y.copy()
    flip = rng.random(len(y)) < eps
    y_noisy[flip] = 1 - y_noisy[flip]
    scores = cross_val_score(LogisticRegression(max_iter=500), X, y_noisy, cv=5)
    mean_accs.append(scores.mean())

plt.figure(figsize=(7, 4))
plt.plot(noise_levels, mean_accs, 'o-', color='#2b3a8f', linewidth=2)
plt.xlabel("Label noise rate (ε)", fontsize=12)
plt.ylabel("Cross-validated accuracy", fontsize=12)
plt.title("Effect of Label Noise on Model Performance", fontsize=13)
plt.axvline(0.2, color='#e05c5c', linestyle='--', alpha=0.7, label='20% noise')
plt.legend()
plt.tight_layout()
plt.savefig('label_noise_effect.png', dpi=150)
plt.show()
print(f"\nAccuracy at 0% noise:  {mean_accs[0]:.3f}")
print(f"Accuracy at 20% noise: {mean_accs[round(0.2 / 0.45 * 14)]:.3f}")
print(f"Accuracy at 40% noise: {mean_accs[-2]:.3f}")
```

---

## Açıklama Maliyeti ve Verimi

Açıklama ekonomisini anlamak, proje planlaması açısından önem taşır.

| Görev türü                          | Tipik verim          | Öğe başına maliyet (uzman) |
|-------------------------------------|---------------------|----------------------------|
| İkili görüntü sınıflandırması       | 200–500/sa          | 0,02–0,10 USD              |
| NER (kısa metin)                    | 50–150 öğe/sa       | 0,10–0,50 USD              |
| İlişki çıkarımı                     | 20–60 öğe/sa        | 0,30–1,50 USD              |
| Tıbbi görüntü segmentasyonu         | 5–30 öğe/sa         | 10–100 USD                 |
| Video açıklaması                    | 5–20 dk video/sa    | 20–200 USD                 |

Bu rakamlar yaklaşık büyüklük tahminleridir ve alana gereken uzmanlığa, açıklama aracının kalitesine, kılavuz netliğine ve açıklayıcı deneyimine göre büyük ölçüde değişir. Gösterge niteliği taşır; kesin değer olarak yorumlanmamalıdır.

```{seealso}
Açıklama aracı seçenekleri Bölüm 12'de ele alınmaktadır. Kitle kaynaklı açıklama için istatistiksel modeller (Dawid-Skene, MACE) Bölüm 13'te işlenmektedir.
```
