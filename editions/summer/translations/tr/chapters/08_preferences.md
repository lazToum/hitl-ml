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

# Karşılaştırma ve Sıralamalardan Öğrenme

İnsanlardan bir çıktıya mutlak bir kalite puanı ataması istemek güçtür. Bu makalenin sayısal kalitesi 1'den 10'a kadar bir ölçekte nedir? Soru kötü tanımlanmıştır: insanların kararlı bir iç ölçeği yoktur ve puanları çapalama, bağlam ve yorgunluktan büyük ölçüde etkilenir.

İnsanlardan iki çıktıyı *karşılaştırması* istemek çok daha kolaydır: hangi makale daha iyi, A mı B mi? Karşılaştırmalı yargılar daha tutarlı, daha güvenilir ve mutlak derecelendirmelerden çok insan tercihlerini daha doğrudan ortaya çıkarır. Bu bölüm, karşılaştırma ve sıralamalardan öğrenmenin matematiksel temellerini ve pratik uygulamalarını ele almaktadır.

---

## Karşılaştırmalar Neden Derecelendirmelerden Daha İyidir?

### Psikolojik Dayanak

Karşılaştırmalı yargıların üstünlüğü, psikometride uzun bir geçmişe sahiptir. Thurstone'un Karşılaştırmalı Yargı Yasası {cite}`thurstone1927law` (1927), insanlar tutarsız mutlak yargılara sahip olsa bile göreli yargılarının tutarlı bir olasılıksal yasayı izlediğini göstermiştir. Karşılaştırmalar, insanların mutlak kalibrasyondan çok *göreli* algıda çok daha iyi olduğu gerçeğinden yararlanır.

### İstatistiksel Verimlilik

Her ikili karşılaştırma, iki öğenin kalite ölçeğindeki *göreli* konumları hakkında bilgi sağlar. $K$ öğeyle $K-1$ karşılaştırma tüm öğeleri sıralayabilir; en üst öğeyi bulmak için yalnızca $O(\log K)$ karşılaştırma gerekir. Mutlak derecelendirmeler genellikle aynı kesinliğe ulaşmak için daha fazla yargı gerektirir.

### Ölçeklenebilirlik

Üretici modeller için farklı çıktıların sayısı pratikte sonsuzdur. Bir çıktıyı mutlak olarak derecelendirmek, tüm çıktılar genelinde paylaşılan bir ölçek oluşturmayı gerektirir; çıktıları karşılaştırmak yalnızca birbirlerine doğal olarak kalibre olan yerel, göreli yargılar gerektirir.

---

## Bradley-Terry Modeli

İkili karşılaştırmalar için baskın olasılıksal model, **Bradley-Terry (BT) modelidir** {cite}`bradley1952rank`. Her $i$ öğesinin gizli bir kalite puanı $\alpha_i \in \mathbb{R}$ vardır. Doğrudan bir karşılaştırmada $i$ öğesinin $j$ öğesine tercih edilme olasılığı şöyledir:

$$
P(i \succ j) = \frac{e^{\alpha_i}}{e^{\alpha_i} + e^{\alpha_j}} = \sigma(\alpha_i - \alpha_j)
$$

burada $\sigma$ lojistik sigmoid'dir. Bu, $i$ öğesinin algılanan kalitesinin $\alpha_i + \epsilon$ olduğunu varsaymaya eşdeğerdir; $\epsilon$ ise standart lojistik gürültü terimidir.

### Tanımlanabilirlik

BT modeli çeviri anlamında tanımlanabilirdir: $\alpha$ bir çözümse, herhangi bir $c$ sabiti için $\alpha + c$ de öyledir. Standart bir kural, bir puanı sabitlemek (örneğin $\alpha_0 = 0$) veya $\sum_i \alpha_i = 0$ kısıtlamaktır. Puanlar yalnızca **karşılaştırma grafiği** (düğümler = öğeler, kenarlar = gözlemlenen çiftler) **bağlantılı** olduğunda tanımlanabilir — grafik bağlantısız bileşenlere sahipse, bileşenler arasındaki göreli puanlar tanımsızdır.

### Parametre Tahmini

$y_{ij} = 1$ ise $i$'nin $j$'ye tercih edildiği ikili karşılaştırmalar veri kümesi $\mathcal{D} = \{(i, j, y_{ij})\}$ verildiğinde, log-olasılık şöyledir:

$$
\mathcal{L}(\alpha) = \sum_{(i, j, y_{ij}) \in \mathcal{D}} \left[ y_{ij} \log \sigma(\alpha_i - \alpha_j) + (1 - y_{ij}) \log \sigma(\alpha_j - \alpha_i) \right]
$$

Bu, $\alpha$'nın içbükey bir işlevidir ve gradyan çıkışı veya Newton yöntemiyle maksimize edilebilir.

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

## Thurstone Modeli

Thurstone modeli {cite}`thurstone1927law`, lojistik yerine Gaussian gürültü kullanan Bradley-Terry ile yakından ilişkilidir:

$$
P(i \succ j) = \Phi\left(\frac{\alpha_i - \alpha_j}{\sqrt{2}\sigma}\right)
$$

burada $\Phi$ standart normal kümülatif dağılım fonksiyonudur. $\sigma = 1/\sqrt{2}$ olduğunda bu, küçük bir ölçekleme farkıyla BT'ye eşdeğer olur. Pratikte iki model neredeyse özdeş sonuçlar verir.

---

## Sıralama Birleştirme

Her açıklayıcı $K$ öğenin tam bir sıralamasını sağladığında (ikili karşılaştırmalar yerine) problem **sıralama birleştirmedir**: birden fazla sıralı listeyi bir uzlaşı sıralamasında birleştirmek.

**Borda sayımı:** Her öğe, her açıklayıcının sıralamasında kendisinin altında sıralanan öğe sayısına eşit bir puan alır. Puanlar açıklayıcılar genelinde toplanır. Basit ve sağlamdır.

**Kemeny–Young:** Her açıklayıcının sıralamasıyla ikili anlaşmazlıkların (Kendall tau mesafesi) toplamını minimize eden sıralamayı bul. Bu, büyük $K$ için NP-zordur ancak küçük kümeler için uygulanabilirdir.

**RankNet / ListNet:** Sıralı listelerden bir puanlama işlevi öğrenen ve görülmemiş öğelere genelleşmeyi sağlayan sinir ağı tabanlı yaklaşımlar.

---

## Düello Haydutları

**Çevrimiçi** tercih öğrenmesinde, öğeler bir akış hâlinde gelir ve hangi çiftlerin karşılaştırılacağına karar verilmesi gerekir; bu durumda keşfetme (bilinmeyen öğeler hakkında öğrenme) ile sömürme (yüksek kaliteli öğeleri sunma) arasında denge kurulması zorunludur. Bu, **düello haydut** problemidir {cite}`yue2009interactively`.

Temel algoritmalar:
- **Doublerlar:** Bir şampiyon öğe belirler; rastgele rakiplerle karşılaştırır
- **RUCB (Göreli Üst Güven Sınırı):** Her öğenin diğer her öğeyi yenme olasılığı için ÜGS tarzı güven aralıkları hesaplar
- **MergeRank:** Turnuva tarzı karşılaştırmayı ÜGS ile birleştirir

Düello haydutları, çevrimiçi öneri sistemlerinde (örtük geri bildirim göz önüne alındığında sonraki hangi makale gösterilmeli) ve RLHF veri toplama için etkileşimli tercih açımlamasında kullanılır.

---

## Dil Modelleri için Tercih Öğrenmesi

RLHF bağlamında (Bölüm 6), ödül modelini eğitmek için Bradley-Terry modeli kullanılır. Önemli bir varyant, RLHF hedefinin ayrı bir ödül modeli eğitilmeksizin tercih verilerinden doğrudan optimize edilebileceğini gösteren **Doğrudan Tercih Optimizasyonu (DPO)** {cite}`rafailov2023direct`'tur:

$$
\mathcal{L}_\text{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_\text{ref}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_\text{ref}(y_l \mid x)} \right) \right]
$$

DPO, tam RLHF'den daha basittir (PPO eğitim döngüsü yok, ödül modeli yok) ve pek çok kıyaslamada karşılaştırılabilir veya daha iyi sonuçlar elde eder {cite}`rafailov2023direct`. Talimat takibi ince ayarı için PPO tabanlı RLHF'ye yaygın biçimde benimsenen bir alternatif hâline gelmiştir; ancak her iki yaklaşım da aktif olarak kullanılmakta ve görece güçleri göreve bağlı olarak değişmektedir.

---

## Yüksek Kaliteli Tercih Verisi Toplamak

Tercih verisi kalitesi, ödül modeli kalitesini belirler. Temel değerlendirmeler:

**İstem çeşitliliği.** Tercih verisi, modelin dağıtımda karşılaşacağı istemlerin tam dağılımını kapsamalıdır. Kapsam boşlukları, bu bölgelerde güvenilmez ödül modeli davranışına yol açar.

**Yanıt çeşitliliği.** Çok benzer iki yanıtı karşılaştırmak az bilgi sağlar. Karşılaştırılan yanıtlar, açıklayıcıların net bir tercihe sahip olabilmesi için yeterince farklılaşmalıdır.

**Açıklayıcı anlaşması.** Düşük açıklayıcılar arası anlaşma, karşılaştırma ölçütlerinin belirsiz olduğuna işaret eder. Anlaşmayı (Cohen'in κ'sı) ölçün ve kabul edilebilir eşiklerin altında kaldığında kılavuzları revize edin.

**Kalibrasyon.** Açıklayıcılar, bir yanıtın neden daha iyi olduğunu *anlamalıdır*: yararlılık, doğruluk, güvenlik, üslup? Birden fazla ölçütü bir araya getiren görevler tutarsız tercihler üretme eğilimindedir. Her ölçüt için tercihleri ayrı ayrı toplamak çoğu zaman daha iyidir.

```{seealso}
Bradley-Terry modeli: {cite}`bradley1952rank`. Thurstone: {cite}`thurstone1927law`. Düello haydutları: {cite}`yue2009interactively`. Doğrudan Tercih Optimizasyonu (DPO): {cite}`rafailov2023direct`.
```
