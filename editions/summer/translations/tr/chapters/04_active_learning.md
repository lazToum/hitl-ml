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

# Aktif Öğrenme

Etiketli veri pahalıdır. Aktif öğrenmenin temel kavrayışı şudur: *tüm etiketsiz örnekler eşit ölçüde bilgilendirici değildir* — bir model, hangi örnekleri soracağını seçme hakkı verildiğinde daha hızlı gelişebilir. Aktif öğrenme sistemi, veriyi rastgele etiketlemek yerine modeli en çok iyileştirecek örnekler üzerinde bir kehanet (genellikle insan açıklayıcı) sorgular.

Bu bölüm aktif öğrenmenin teorisini ve pratiğini kapsar: sorgu stratejileri, örnekleme çerçeveleri, durdurma ölçütleri ve gerçek dağıtımlar için pratik değerlendirmeler.

---

## Aktif Öğrenme Kurulumu

Standart **havuz tabanlı aktif öğrenme** ortamı şunları içerir:

- Başlangıçta küçük olan bir **etiketli küme** $\mathcal{L} = \{(x_i, y_i)\}_{i=1}^n$
- Genellikle $\mathcal{L}$'den çok daha büyük bir **etiketsiz havuz** $\mathcal{U} = \{x_j\}_{j=1}^m$
- Sorgulanan herhangi bir $x$ için $y = \mathcal{O}(x)$ döndürebilen bir **kehanet** $\mathcal{O}$
- Sonraki sorguyu $x^* = \phi(\mathcal{L}, \mathcal{U}, f_\theta)$ olarak seçen bir **sorgu stratejisi** $\phi$

Aktif öğrenme döngüsü:

```text
    1. Başlatma: L = küçük etiketli tohum kümesi, U = etiketsiz havuz
    2. Eğitim: f_θ ← train(L)
    3. Sorgu: x* = argmax φ(x; f_θ), x ∈ U üzerinde
    4. Etiketleme: y* = O(x*)
    5. Güncelleme: L ← L ∪ {(x*, y*)}, U ← U \ {x*}
    → Bütçe tükenene kadar 2'den tekrarla
```

Amaç, olabildiğince az kehanet sorgusu kullanarak hedef model kalitesine ulaşmaktır.

---

## Kuramsal Temeller

Doğal bir soru şudur: aktif öğrenme ne kadar yardımcı olabilir? En iyi senaryoda, gerçekleştirilmiş ortamlarda iyi bir sorgu stratejisiyle pasif öğrenmenin gerektirdiği $O(1/\epsilon)$'dan çok daha az, $O(\log(1/\epsilon))$ etiketle hata $\epsilon$'a ulaşarak *üstel* etiket karmaşıklığı azalmaları sağlanabilir {cite}`settles2009active`.

Pratikte garantiler elde etmek daha güçtür. **Agnostik aktif öğrenme** {cite}`balcan2006agnostic`, hedef kavramın hipotez sınıfında olmadığı durumlarda dahi etiket tasarruflarının mümkün olduğunu göstermektedir; ancak tasarruflar, veri birikmesiyle olası hipotezler kümesinin ne kadar hızlı küçüldüğünü ölçen anlaşmazlık katsayısına güçlü biçimde bağlıdır.

Temel pratik çıkarım: aktif öğrenmenin avantajı, **karar sınırı basit ve yoğunlaşmış** olduğunda (belirsizlik sorguları yanlış hipotezleri hızla eleyebildiğinden) en büyük, hipotez sınıfı büyük veya sınır karmaşık olduğunda ise en küçüktür.

---

## Sorgu Stratejileri

### Belirsizlik Örneklemesi

En basit ve en yaygın kullanılan strateji: modelin en çok *belirsiz* olduğu örneği sorgula {cite}`lewis1994sequential`.

**En düşük güven** örneklemesi, modelin en üst tahminine en az güvendiği örneği sorgular:

$$
x^* = \argmax_{x \in \mathcal{U}} \left(1 - P_\theta(\hat{y} \mid x)\right)
$$

**Marjin örneklemesi**, ilk iki tahmin olasılığı arasındaki farkı dikkate alır:

$$
x^* = \argmin_{x \in \mathcal{U}} \left(P_\theta(\hat{y}_1 \mid x) - P_\theta(\hat{y}_2 \mid x)\right)
$$

**Entropi örneklemesi**, tahmin edilen tam dağılımı kullanır:

$$
x^* = \argmax_{x \in \mathcal{U}} \left( -\sum_{k=1}^K P_\theta(y_k \mid x) \log P_\theta(y_k \mid x) \right)
$$

Entropi örneklemesi üçü arasında en sağlam temellere sahip olanıdır — tüm sınıfları dikkate alır — ve çok sınıflı problemlerde diğerlerinden genellikle daha iyi performans gösterir.

### Komite Sorgulama (QbC)

$C$ modelden oluşan bir **komite** eğitilir (torbalama, farklı başlangıç değerleri veya farklı mimariler kullanılarak). Komitenin en çok anlaşmazlığa düştüğü örnek sorgulanır:

$$
x^* = \argmax_{x \in \mathcal{U}} \; \text{anlaşmazlık}(\{f_c(x)\}_{c=1}^C)
$$

Anlaşmazlık, **oy entropisi** (komitenin çoğunluk oyları üzerinden entropi) veya fikir birliği dağılımından **KL ıraksaması** olarak ölçülebilir.

QbC, tekil bir modele kıyasla daha iyi belirsizlik tahminleri sağlar ancak birden fazla modelin eğitimini gerektirir; bu da hesaplama açısından pahalıdır.

### Beklenen Model Değişimi

Etiketlenmiş olsaydı mevcut modeli en çok değiştirecek örneği sorgula. Gradyan tabanlı modeller için bu, en büyük beklenen gradyan büyüklüğüne sahip örneğe karşılık gelir {cite}`settles2008analysis`:

$$
x^* = \argmax_{x \in \mathcal{U}} \sum_{y \in \mathcal{Y}} P_\theta(y \mid x) \left\| \nabla_\theta \mathcal{L}(f_\theta(x), y) \right\|
$$

Bu stratejinin güçlü kuramsal gerekçesi vardır, ancak her aday için gradyan hesaplamayı gerektirdiğinden büyük modeller için pahalıdır.

### Çekirdek Küme / Geometrik Yaklaşımlar

Belirsizlik tabanlı stratejiler **aykırı değerlere yönelim gösterebilir**: sıradışı bir örnek yüksek belirsizlikte olabilir ancak veri dağılımını temsil etmeyebilir. Çekirdek küme yöntemleri, özellik uzayını kapsayan çeşitlendirilmiş bir örnek arayarak bunu ele alır.

**k-merkezli açgözlü** algoritma {cite}`sener2018active`, her etiketsiz noktanın en az bir sorgulanan noktanın $\delta$ yakınında olduğu en küçük nokta kümesini bulur:

$$
x^* = \argmax_{x \in \mathcal{U}} \min_{x' \in \mathcal{L}} d(x, x')
$$

Yani, mevcut herhangi bir etiketli noktadan en uzak noktayı sorgula. Bu, açıklamaların iyi yayılmış bir küme oluşturmasını teşvik eder.

### BADGE

**Çeşitli Gradyan Gömmeleri Yoluyla Toplu Aktif Öğrenme (BADGE)** {cite}`ash2020deep`, belirsizlik ve çeşitliliği bir araya getirir: tahmin edilen etikete göre gradyan gömmeleri hem büyüklük (belirsiz) hem de çeşitlilik (gradyan uzayının farklı bölgelerini kapsama) açısından olumlu olan örnekleri seçer. Bu, en rekabetçi modern stratejilerden biridir.

---

## Derin Modeller için Belirsizlik Tahmini

Yukarıdaki stratejiler, modelden kalibre edilmiş olasılık çıktılarına erişim varsayar. Basit modeller (lojistik regresyon, softmax sınıflandırıcılar) için bu basittir. Derin ağlar için güvenilir belirsizlik tahminleri elde etmek ek teknik gerektirir.

### İki Tür Belirsizlik

Kendall ve Gal {cite}`kendall2017uncertainties`'ın çerçevesini izleyerek şu ayrımı yapıyoruz:

**Aleatonik belirsizlik** (veri belirsizliği): daha fazla veri toplayarak azaltılamayan gözlemlerdeki doğal gürültü. Bulanık bir görüntü aleatonik belirsizliğe sahiptir — aynı dağılımdan ek eğitim verisi, modelin bu görüntü üzerinde daha güvenli olmasını sağlamayacaktır.

**Epistemik belirsizlik** (model belirsizliği): sınırlı eğitim verisinden ya da benzer örnekler görmemiş bir modelden kaynaklanan belirsizlik. Epistemik belirsizlik daha fazla veri etiketlenerek *azaltılabilir* — dolayısıyla aktif öğrenme sorgu seçimi için ilgili nicelik budur.

Aktif öğrenme için yüksek epistemik belirsizliğe sahip örnekleri sorgulamak isteriz; yüksek aleatonik belirsizliğe sahip olanları değil. Temelden belirsiz bir örneği sorgulamak kehanet çabasını boşa harcar: sağladıkları etiket açıkça doğru olmayacaktır.

### Monte Carlo Hata Bırakma

Sinir ağları için epistemik belirsizlik tahminine pratik bir yaklaşım **MC Hata Bırakma (MC Dropout)** {cite}`gal2016dropout`'tur: çıkarım sırasında hata bırakmayı uygula ve $T$ ileri geçiş çalıştır. Tahminler arasındaki varyans, epistemik belirsizliğin bir tahminidir.

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn

torch.manual_seed(42)
rng = np.random.default_rng(42)

class MCDropoutNet(nn.Module):
    def __init__(self, input_dim=20, hidden=64, output_dim=2, p_drop=0.3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden), nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, hidden),    nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, output_dim)
        )

    def forward(self, x):
        return self.net(x)

def mc_uncertainty(model, x, T=30):
    """
    Run T stochastic forward passes with dropout active.
    Returns mean prediction and epistemic uncertainty (predictive variance).
    """
    model.train()  # keep dropout active during inference
    with torch.no_grad():
        preds = torch.stack([
            torch.softmax(model(x), dim=-1) for _ in range(T)
        ])  # shape: (T, N, C)
    mean_pred = preds.mean(0)
    # Epistemic uncertainty: mean of variances across passes
    epistemic = preds.var(0).sum(-1)
    # Aleatoric uncertainty: entropy of mean prediction
    aleatoric = -(mean_pred * (mean_pred + 1e-9).log()).sum(-1)
    return mean_pred, epistemic, aleatoric

# Quick demonstration
model = MCDropoutNet(input_dim=20, output_dim=2)
# In-distribution example (simulated)
x_familiar   = torch.randn(1, 20) * 0.5
# Out-of-distribution example (far from training distribution)
x_unfamiliar = torch.randn(1, 20) * 3.0

for name, x in [("In-distribution ", x_familiar), ("Out-of-distribution", x_unfamiliar)]:
    _, ep, al = mc_uncertainty(model, x)
    print(f"{name} | epistemic: {ep.item():.4f} | aleatoric: {al.item():.4f}")
```

Yukarıdaki eğitimsiz ağda, her iki örnek de benzer belirsizlik gösterir. Eğitimden sonra, dağılım dışı örnek daha yüksek epistemik belirsizlik sergileyecektir — model, eğitim dağılımından uzak girdiler için güvenilir bir eşleme öğrenmemiştir.

### Derin Topluluklar

$M$ bağımsız olarak başlatılmış model eğitip tahminlerinin ortalamasını almak, MC Hata Bırakmadan daha basit ve çoğu zaman daha güvenilir bir belirsizlik tahmini sağlar {cite}`lakshminarayanan2017simple`. Topluluk üyeleri arasındaki anlaşmazlık, epistemik belirsizlik sinyalidir.

Ölçekli aktif öğrenmede, hem MC Hata Bırakma hem de derin topluluklar $T$ veya $M$ ileri geçişiyle orantılı ek yük getirir. Pratikte, mutlak değerler iyi kalibre edilmiş olmasa bile örnekleri epistemik belirsizliğe göre sıralamak için genellikle MC Hata Bırakma için $T = 10$–$30$ veya $M = 5$ topluluk üyesi yeterlidir.

---

## Tam Bir Aktif Öğrenme Döngüsü

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from copy import deepcopy

rng = np.random.default_rng(42)

# Generate dataset
X, y = make_classification(
    n_samples=2000, n_features=20, n_informative=10,
    n_classes=3, n_clusters_per_class=1, random_state=42
)
X_train, y_train = X[:1500], y[:1500]
X_test,  y_test  = X[1500:], y[1500:]

def entropy_query(model, X_pool):
    """Return index of most uncertain sample (entropy)."""
    probs = model.predict_proba(X_pool)
    ent = -np.sum(probs * np.log(probs + 1e-9), axis=1)
    return np.argmax(ent)

def random_query(X_pool):
    """Random baseline."""
    return rng.integers(0, len(X_pool))

def run_active_learning(strategy='entropy', n_initial=30, n_queries=120, query_batch=5):
    labeled_idx = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled_idx = [i for i in range(len(X_train)) if i not in labeled_idx]
    accs = []

    for step in range(n_queries // query_batch):
        model = LogisticRegression(max_iter=500, C=1.0)
        model.fit(X_train[labeled_idx], y_train[labeled_idx])
        accs.append(accuracy_score(y_test, model.predict(X_test)))

        # Query
        X_pool = X_train[unlabeled_idx]
        for _ in range(query_batch):
            if strategy == 'entropy':
                q = entropy_query(model, X_pool)
            else:
                q = random_query(X_pool)
            labeled_idx.append(unlabeled_idx.pop(q))
            X_pool = X_train[unlabeled_idx]

    return np.array(accs)

labels_used = np.arange(1, 25) * 5 + 30  # label counts at each step

accs_active = run_active_learning(strategy='entropy')
accs_random = run_active_learning(strategy='random')

plt.figure(figsize=(8, 5))
plt.plot(labels_used, accs_active, 'o-', label='Entropy sampling', color='#2b3a8f', linewidth=2)
plt.plot(labels_used, accs_random, 's--', label='Random baseline',  color='#e05c5c', linewidth=2)
plt.xlabel("Number of labeled examples", fontsize=12)
plt.ylabel("Test accuracy", fontsize=12)
plt.title("Active Learning vs. Random Sampling", fontsize=13)
plt.legend(fontsize=11)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('active_learning_curve.png', dpi=150)
plt.show()

print(f"Active learning reaches {accs_active[-1]:.3f} accuracy")
print(f"Random sampling reaches {accs_random[-1]:.3f} accuracy")
print(f"Active learning saves ~{int((accs_random.tolist().index(min(accs_random, key=lambda a: abs(a-accs_active[-1]))) - len(accs_active) + 1) * 5)} labels to match random's final accuracy")
```

---

## Soğuk Başlangıç Problemi

Aktif öğrenme, etiketsiz noktaları puanlamak için eğitilmiş bir model gerektirir — ancak başlangıçta hiç (ya da çok az) etiketli örnek yoktur. Bu, **soğuk başlangıç problemidir**.

Pratik çözümler:

1. **Rastgele başlatma:** Aktif öğrenmeye başlamadan önce küçük bir rastgele tohum kümesi (20–100 örnek) etiketle.
2. **Kümeleme tabanlı başlatma:** Etiketsiz havuz üzerinde k-means uygula; her kümeden bir örnek etiketle. Bu, başlangıç etiketli kümesinde çeşitliliği güvence altına alır.
3. **Gömme tabanlı seçim:** Örnekleri gömmek için önceden eğitilmiş bir kodlayıcı kullan; çekirdek küme yöntemiyle çeşitlendirilmiş bir alt küme seç.

Çoğu görev için birkaç düzine rastgele tohum etiket, aktif öğrenmeyi başlatmak için genellikle yeterlidir; kesin sayı, sınıf dengesine, özellik boyutsallığına ve model karmaşıklığına bağlıdır.

---

## Toplu Modda Aktif Öğrenme

Pratikte açıklayıcılar toplu iş şeklinde çalışır — her tekil etiket sonrasında yeni bir model eğitip dağıtmak verimsizdir. **Toplu modda aktif öğrenme**, aynı anda etiketlenecek $b$ örnek kümesi seçer.

En belirsiz $b$ örneği naif biçimde seçmek **fazlalığa** yol açar: yüksek belirsizlikteki örnekler bir arada kümelenir (örneğin aynı bölgede karar sınırına yakın örnekler). Daha iyi toplu stratejiler, hem belirsizliği hem de toplu içindeki çeşitliliği optimize eder.

**Determinantal Nokta Süreçleri (DPP'ler)**, çeşitlendirilmiş toplu örnekler seçmenin prensipli bir yolunu sunar: benzer öğeleri cezalandıran alt kümeler üzerinde bir dağılım tanımlar. $S$ alt kümesinin bir DPP altındaki olasılığı, benzerliği kodlayan bir çekirdek matrisi olan $L$'de $\det(L_S)$ ile orantılıdır.

---

## Durdurma Ölçütleri

Aktif öğrenme ne zaman durmalıdır? Yaygın ölçütler:

- **Bütçe tükendi:** En basiti — açıklama bütçesi bittiğinde dur.
- **Performans platoya ulaştı:** Tutulmuş bir doğrulama kümesindeki model doğruluğu art arda $k$ turda $\delta$'dan fazla iyileşmediğinde dur.
- **Güven eşiği:** Etiketsiz örneklerin belirli bir oranından azının belirsizliği eşiğin üzerinde olduğunda dur.
- **Azami kayıp azalması:** Ek etiketlerden elde edilebilecek azami kazanımı tahmin et; bu bir eşiğin altına düştüğünde dur {cite}`bloodgood2009method`.

---

## Aktif Öğrenmenin İşe Yaradığı (ve Yaramadığı) Durumlar

Aktif öğrenme şu durumlarda iyi çalışır:
- Etiketleme pahalıdır ve etiketsiz havuz büyüktür
- Verinin, modelin bilgilendirici örnekleri belirlemekte yararlanabileceği net bir yapısı vardır
- Model sınıfı göreve uygundur

Aktif öğrenme şu durumlarda kötü performans gösterir:
- Başlangıç modeli çok zayıftır (soğuk başlangıç) ve örnekleri anlamlı biçimde sıralayamaz
- Sorgu stratejisi aykırı değerler veya yanlış etiketlenmiş örnekler seçer (gürültü sağlamlığı önem taşır)
- Etiketsiz havuz ile test dağılımı arasında veri dağılımı kayması vardır

Önemli bir pratik endişe **dağılım uyumsuzluğudur**: aktif öğrenme, karar sınırına yakın örnekleri sorgulama eğilimindedir; bu durum, test dağılımını iyi temsil etmeyebilecek önyargılı bir etiketli küme oluşturur. Bu, iyi eğitilmiş karar sınırlarına ancak kötü kalibrasyona yol açabilir.

```{seealso}
Temel araştırma şu kaynaktır: {cite}`settles2009active`. Kuramsal temeller (etiket karmaşıklığı, agnostik sınırlar): {cite}`balcan2006agnostic`. Derin öğrenmeye özgü aktif öğrenme için bkz. {cite}`ash2020deep` (BADGE) ve {cite}`sener2018active` (çekirdek küme). Aktif öğrenmenin ne zaman gerçekten işe yaradığına ilişkin eleştirel bir değerlendirme için bkz. {cite}`lowell2019practical`. Derin modeller için aleatonik ve epistemik belirsizlik üzerine bkz. {cite}`kendall2017uncertainties`; belirsizlik tahmincisi olarak derin topluluklar için bkz. {cite}`lakshminarayanan2017simple`; yaklaşık Bayesci çıkarım olarak MC Hata Bırakma için bkz. {cite}`gal2016dropout`.
```
