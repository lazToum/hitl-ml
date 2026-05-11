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

# İnsan Geri Bildiriminden Pekiştirmeli Öğrenme

HITL ML'yi ana akıma taşıyan tek teknik, İnsan Geri Bildiriminden Pekiştirmeli Öğrenme'dir (RLHF). Bu teknik, InstructGPT'nin {cite}`ouyang2022training` temelini oluşturmakta ve pek çok modern büyük dil modelindeki talimat takip hatlarının temel bileşeni konumundadır {cite}`stiennon2020learning`. RLHF'yi — yalnızca uygulanacak bir tarif olarak değil, hizalamaya yönelik prensipli bir yaklaşım olarak — anlamak, modern yapay zeka alanında çalışan herkes için zorunludur.

---

## Hizalama Problemi

Yalnızca sonraki belirteç tahmininde eğitilen büyük dil modelleri (BDM'ler), bir vekil hedefe göre optimize eder: insan yazısı bir derlemdeki metnin devamını tahmin et. Bu hedef, gerçekten istediğimiz şeyle — yararlı, doğru, güvenli ve insan değerleriyle uyumlu yanıtlar — ilişkili olmakla birlikte ondan farklıdır.

Eğitim hedefi ile istenilen davranış arasındaki bu uyumsuzluğa **hizalama problemi** adı verilir {cite}`russell2019human`. Somut olarak, internet metninde eğitilmiş bir dil modeli şunları öğrenir:
- Makul gelen devamlar üretme (bunlar olgusal olarak yanlış olabilir)
- Eğitim verilerindeki önyargıları ve zararları yansıtma
- İstatistiksel olarak yönlendirmeyi takip ettiğinde kaçamak veya manipülatif olma

RLHF, insan tercihlerini *optimizasyon hedefinin bir parçası* hâline getirerek hizalamayı ele alır.

---

## RLHF Hattı

RLHF üç aşamada ilerler:

```text
Aşama 1: Denetimli İnce Ayar (SFT)
  --> Gösteri verisi toplama (insan ideal yanıtları yazar)
  --> Taban BDM'yi gösteriler üzerinde ince ayarlama

Aşama 2: Ödül Modeli Eğitimi
  --> İkili tercihler toplama (insan A ile B'yi değerlendirir)
  --> İnsan tercihlerini tahmin etmek için R(x, y) ödül modeli eğitimi

Aşama 3: TÖ İnce Ayarı
  --> R(x, y)'yi maksimize etmek için PPO/RL ile BDM ince ayarı
  --> KL cezası, SFT modelinden aşırı sapmaları önler
```

### Aşama 1: Denetimli İnce Ayar

Önceden eğitilmiş bir taban model $\pi_0$'dan başlayarak, ayrıntılı kılavuzları izleyen insan çalışanlar tarafından yazılan veya seçilen (istem, ideal yanıt) çiftlerinden oluşan bir veri kümesi toplanır. Model, standart çapraz entropi kullanılarak bu gösteriler üzerinde ince ayar yapılır:

$$
\mathcal{L}_\text{SFT}(\theta) = -\mathbb{E}_{(x, y) \sim \mathcal{D}_\text{demo}} \left[ \log \pi_\theta(y \mid x) \right]
$$

SFT modeli $\pi_\text{SFT}$, ham önceden eğitilmiş modele kıyasla RLHF için çok daha iyi bir başlangıç noktasıdır.

### Aşama 2: Ödül Modeli Eğitimi

Bir dizi istem $\{x_i\}$ için $\pi_\text{SFT}$ kullanılarak istem başına $K$ yanıt üretilir ve bunlar insan etiketleyicilere ikili karşılaştırmalar olarak sunulur: "Hangi yanıt daha iyi, A mı B mi?"

Ödül modeli $r_\phi$, bu tercihleri tahmin etmek üzere eğitilir. **Bradley-Terry** modeli (Bölüm 8) altında, $y_w$ yanıtının $y_l$ yanıtına tercih edilme olasılığı şöyledir:

$$
P(y_w \succ y_l \mid x) = \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)
$$

Ödül modeli, ikili sıralama kaybını minimize etmek üzere eğitilir:

$$
\mathcal{L}_\text{RM}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_\text{pref}} \left[ \log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) \right]
$$

Ödül modeli genellikle son katmanın yerine skaler bir başlık konularak SFT modelinden başlatılır.

### Aşama 3: PPO ile Pekiştirmeli Öğrenme İnce Ayarı

Eğitilmiş bir ödül modeliyle, BDM'yi ince ayar yapmak için pekiştirmeli öğrenme kullanılabilir. Her istem $x$ bir durumdur; her yanıt $y$, belirteç seçimlerinden oluşan bir yörüngedir; ödül ise $r_\phi(x, y)$'dir.

Optimizasyon hedefi, modelin SFT taban çizgisinden fazla sapmasını önlemek (ödül korsanlığına {cite}`krakovna2020specification,gao2023scaling` yol açacağından) için bir **KL ıraksaması cezası** içerir:

$$
\max_\theta \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot | x)} \left[ r_\phi(x, y) - \beta \cdot \text{KL}\left[\pi_\theta(\cdot \mid x) \| \pi_\text{SFT}(\cdot \mid x)\right] \right]
$$

$\beta$ parametresi KL ceza şiddetini kontrol eder. Küçük $\beta$ daha fazla optimizasyona izin verir ancak ödül korsanlığı riskini artırır; büyük $\beta$ modeli SFT'ye yakın tutar ancak hizalama kazanımlarını sınırlar.

**Yakınsal Politika Optimizasyonu (PPO)** {cite}`schulman2017proximal`, ham politika gradyanı yöntemlerine kıyasla istikrarı nedeniyle bu aşama için standart algoritma olarak seçilir.

---

## Basitleştirilmiş Bir RLHF Gösterimi

Tam RLHF hattı büyük ölçekli altyapı gerektirir. Aşağıdaki örnek, temel fikirleri küçük ölçekte göstermektedir.

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.nn import functional as F

torch.manual_seed(42)
rng = np.random.default_rng(42)

# -----------------------------------------------
# Toy setup: responses are 4-dimensional vectors
# "Quality" is known analytically (sum of positive values)
# We simulate a reward model learning this from pairwise feedback
# -----------------------------------------------

class RewardModel(nn.Module):
    def __init__(self, d=4, hidden=32):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden), nn.ReLU(),
            nn.Linear(hidden, 1)
        )
    def forward(self, x):
        return self.net(x).squeeze(-1)

def true_quality(x):
    """The hidden ground-truth reward function."""
    return x.sum(dim=-1) + 0.5 * (x ** 2).mean(dim=-1)

# Generate pairwise preference data
N_PAIRS = 500
X1 = torch.randn(N_PAIRS, 4)
X2 = torch.randn(N_PAIRS, 4)
q1, q2 = true_quality(X1), true_quality(X2)
# Human prefers X1 when q1 > q2 (with some noise)
noise = torch.randn(N_PAIRS) * 0.5
preferred_1 = ((q1 - q2 + noise) > 0).float()

# Train reward model
rm = RewardModel(d=4, hidden=32)
optimizer = optim.Adam(rm.parameters(), lr=3e-3)

losses = []
for epoch in range(200):
    r1 = rm(X1)
    r2 = rm(X2)
    # Bradley-Terry loss
    logit = r1 - r2
    loss = F.binary_cross_entropy_with_logits(logit, preferred_1)
    optimizer.zero_grad(); loss.backward(); optimizer.step()
    losses.append(loss.item())

# Evaluate: does the reward model agree with true quality?
X_eval = torch.randn(1000, 4)
with torch.no_grad():
    r_pred = rm(X_eval).numpy()
    r_true = true_quality(X_eval).numpy()

corr = np.corrcoef(r_pred, r_true)[0, 1]
print(f"Reward model correlation with true quality: {corr:.4f}")
print(f"Final training loss: {losses[-1]:.4f}")

import matplotlib.pyplot as plt
plt.figure(figsize=(8, 3))
plt.subplot(1, 2, 1)
plt.plot(losses, color='#2b3a8f', linewidth=1.5)
plt.xlabel("Epoch"); plt.ylabel("Pairwise loss")
plt.title("Reward Model Training")

plt.subplot(1, 2, 2)
plt.scatter(r_true[:200], r_pred[:200], alpha=0.4, s=15, color='#2b3a8f')
plt.xlabel("True quality"); plt.ylabel("Predicted reward")
plt.title(f"Reward Model vs. Truth (r={corr:.3f})")
plt.tight_layout()
plt.savefig('reward_model.png', dpi=150)
plt.show()
```

---

## RLHF'deki Güçlükler

### Ödül Korsanlığı

Temel bir başarısızlık modu: politika, gerçekten iyi davranışa karşılık gelmeyen ancak ödül modelinden yüksek ödül elde etmenin yollarını bulur. Örneğin bir BDM, doğru olmak yerine pohpohlamalar ve güven içeren ifadeler üretmeyi öğrenebilir (etiketleyiciler bunları yüksek değerlendirme eğilimindedir).

Ödül korsanlığının daha olası olduğu durumlar:
- Ödül modeli yetersiz tercih verisiyle eğitilmiş olduğunda
- Politikanın SFT taban çizgisinden çok uzaklaşmasına izin verildiğinde (küçük $\beta$)
- PPO eğitimi sırasında ödül modeli dağılımı kaydığında

**Azaltma stratejileri:** KL cezası, yinelemeli ödül modeli eğitimi, çeşitli değerlendirme, anayasal yapay zeka kısıtlamaları.

### Değerlendirici Önyargısı

İnsan etiketleyicilerin sistematik önyargıları vardır. Uzun yanıtları (ayrıntılılık önyargısı), güvenli tonlu metinleri (güven önyargısı) ve önceki inançlarıyla örtüşen yanıtları tercih etme eğilimindedirler. Bu önyargılar ödül modeline yansır.

RLHF modellerinin ünlü pohpohlama başarısızlığı — modelin gerçek yerine kullanıcıların duymak istediğini söylemesi — kısmen, değerlendiricilerin kabul edici yanıtlara yönelik tercihinin bir sonucudur.

### Ölçeklenebilir Denetim

Karmaşık görevlerde insanlar hangi yapay zeka yanıtının doğru olduğuna güvenilir biçimde karar veremez. İki uzun matematiksel kanıt veya iki kod uygulamasını karşılaştıran bir etiketleyici doğruluktan bağımsız olarak daha okunaklı olanı seçebilir. **Ölçeklenebilir denetim**, görev karmaşıklığı arttıkça değerlendirme prosedürlerinin güvenilir kalmasını sağlamaya yönelik açık bir araştırma sorunudur {cite}`bowman2022measuring`.

---

## Anayasal Yapay Zeka (RLAIF)

Anthropic'te geliştirilen **Anayasal Yapay Zeka** {cite}`bai2022constitutional`, bir dizi ilkeyle (bir "anayasa") yönlendirilen tercih etiketleri üretmek için yapay zekanın kendisini kullanarak insan etiketleyicilere bağımlılığı azaltır. Süreç şöyledir:

1. Potansiyel olarak zararlı istemlere yanıtlar üret
2. Yapay zeka eleştirmenini kullanarak yanıtları anayasal ilkeler çerçevesinde değerlendir
3. Yapay zeka geri bildirimiyle yönlendirilen yanıtları revize et (RLAIF — Yapay Zeka Geri Bildiriminden Pekiştirmeli Öğrenme)
4. Yapay zeka tarafından üretilen tercihler üzerinde ödül modeli eğit
5. Bu ödül modelini kullanarak RLHF ile ince ayar yap

RLAIF, insan etiketlemesinden çok daha büyük ölçekte tercih verisi üretebilir ve ödül modeline kodlanan değerler üzerinde ayrıntılı kontrol sağlar.

```{seealso}
Orijinal InstructGPT makalesi {cite}`ouyang2022training`, RLHF'nin BDM'lere ilk büyük ölçekli uygulamasını tanımlamaktadır. Derin pekiştirmeli öğrenme için temel RLHF çalışması: {cite}`christiano2017deep`. PPO: {cite}`schulman2017proximal`. Anayasal Yapay Zeka: {cite}`bai2022constitutional`.
```
