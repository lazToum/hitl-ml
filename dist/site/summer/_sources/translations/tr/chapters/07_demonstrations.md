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

# Gösterilerden Öğrenme

Bir görev belirlemek güç ancak göstermek kolaysa, kural tanımlamak yerine örnekle öğretmek daha verimli olabilir. İnsan uzman, bir robot koluna bir nesneyi nasıl kavrayacağını gösterir; bir programcının IDE ile etkileşimi doğru düzenlemelerin bir dizisini sağlar; bir satranç büyükustası bir oyun oynar. **Gösterilerden öğrenme**, bu tür davranışsal verilerden bir politika çıkarır; elle hazırlanmış ödül işlevleri veya açık görev belirtimleri gerektirmez.

---

## Davranışsal Klonlama

En basit yaklaşım **davranışsal klonlamadır (BC)**: gösteriyi denetimli veri olarak ele al ve durumlardan eylemlere bir eşleme öğren.

Uzman bir göstericiden elde edilen durum-eylem çiftlerinden oluşan $\mathcal{D} = \{(s_i, a_i)\}$ veri kümesi göz önüne alındığında, negatif log-olasılığı minimize ederek bir politika $\pi_\theta(a \mid s)$ uyarlanır:

$$
\mathcal{L}_\text{BC}(\theta) = -\frac{1}{|\mathcal{D}|} \sum_{(s, a) \in \mathcal{D}} \log \pi_\theta(a \mid s)
$$

Bu tam anlamıyla sıralı veriye uygulanan standart denetimli öğrenmedir.

### Kovaryat Kayması Problemi

BC'nin temel bir zayıflığı vardır: eğitim ile dağıtım arasındaki **dağılım kayması**. Uzmanın gösterileri, uzman tarafından ziyaret edilen durumları kapsar. Ancak dağıtım sırasında öğrenilen politika biraz farklı kararlar alabilir ve uzmanın hiç ziyaret etmediği durumlara — politikanın herhangi bir denetimsiz kalacağı ve kötü performans sergileyebileceği durumlara — yol açabilir.

Önemli olan husus şudur: hatalar **birikerek büyür**. Küçük bir sapma alışılmadık bir duruma yol açar; biraz yanlış bir eylem çok daha alışılmadık bir duruma; bu böyle devam eder. Performans, bölüm uzunluğu $T$ ve adım başına hata oranı $\epsilon$ olmak üzere $O(T^2 \epsilon)$ oranında bozulur — bu, kehanet politikasının $O(T\epsilon)$ bozulmasından çok daha kötüdür {cite}`ross2010efficient`.

```{admonition} Örnek: Otonom Sürüş
:class: note

İnsan sürüş verisiyle eğitilen şerit takibine yönelik bir davranışsal klonlama modeli, düz yollarda (eğitim dağılımına yakın durumlar) iyi performans gösterir. Ancak model biraz saptığı anda — hiçbir insan sürücünün içinde bulunmayacağı bir durum, çünkü çoktan düzeltmiş olurlardı — onu yönlendirecek herhangi bir veri kalmaz ve araç yolun dışına çıkabilir.
```

```text
DAgger Algoritması:
  Başlatma: D <- {} (boş veri kümesi)
  M uzman gösterisi üzerinde başlangıç politikası pi_1'i eğit

  yineleme i = 1, 2, ..., N için:
    1. {s_1, ..., s_t} durumlarını toplamak için pi_i'yi ortamda çalıştır
    2. Her ziyaret edilen durum için uzmanı sorgula: a_t = pi*(s_t)
    3. Birleştir: D <- D u {(s_1, a_1), ..., (s_t, a_t)}
    4. D üzerinde denetimli öğrenmeyle pi_{i+1}'i eğit
```

DAgger, $O(T\epsilon)$ pişmanlık elde eder — kehanet politikasıyla aynı — çünkü eğitim dağılımı, dağıtım dağılımıyla eşleşecek şekilde yakınsarlar.

Temel gereklilik, uzmanın herhangi bir durumda sorgulanabilmesidir; uzmanın doğal olarak hiç ziyaret etmeyeceği durumlar dahil. Bu, simülasyonda uygulanabilirdir (robotun alışılmadık bir yapılandırmadan düzeltmesini uzmanın yapmasını istemek), ancak gerçek fiziksel sistemlerde zorlayıcı veya güvensiz olabilir.

---

## Ters Pekiştirmeli Öğrenme

Bazen uzmanın davranışı, taklit edilecek bir eylem dizisi olarak değil, bilinmeyen bir ödül işlevini optimize etmenin sonucu olarak daha iyi anlaşılır. **Ters Pekiştirmeli Öğrenme (IRL)** {cite}`ng2000algorithms`, bu gizli ödül işlevini gösterilerden kurtarır.

$\tau = \{(s_1, a_1), \ldots, (s_T, a_T)\}$ gösterileri göz önüne alındığında, IRL uzmanın politikasının $R$ altında optimal olduğu bir $R(s, a)$ ödül işlevi bulur.

IRL'nin BC'ye göre çekiciliği: gerçek ödül işlevini kurtarırsak, bunu yeni ortamlarda, farklı dinamiklerle veya iyileştirilmiş planlayıcılarla yeniden optimize edebiliriz — gösterilen senaryoların çok ötesine genelleşiriz.

### Maksimum Entropi IRL

**MaxEnt IRL** {cite}`ziebart2008maximum`, IRL belirsizlik problemini (herhangi bir gösteri kümesiyle tutarlı çok sayıda ödül işlevi vardır) ele alır: gösterilen davranışla tutarlı olmakla birlikte *maksimum entropi*ye sahip yörüngeler dağılımına yol açan ödül işlevini seçer. Yörüngeler şu şekilde dağılır:

$$
P(\tau \mid R) \propto \exp\left(\sum_t R(s_t, a_t)\right)
$$

Öğrenme hedefi, uzmanın gözlemlenen özellik beklentilerini $\mu_E = \mathbb{E}_{\tau \sim \pi^*}[\phi(\tau)]$, modelin özellik beklentileriyle $\mu_\theta = \mathbb{E}_{\tau \sim \pi_\theta}[\phi(\tau)]$ eşleştirir.

---

## GAIL: Üretici Çekişmeli Taklit Öğrenmesi

**GAIL** {cite}`ho2016generative`, ödül işlevi öğrenmeyi tamamen atlayarak uzmanın durum-eylem dağılımını doğrudan eşleştirmek için GAN benzeri bir formülasyon kullanır.

$D_\psi$ ayrımcısı, uzman durum-eylem çiftlerini $(s, a) \sim \pi^*$ ile politika durum-eylem çiftlerini $(s, a) \sim \pi_\theta$ ayırt etmek üzere eğitilir:

$$
\mathcal{L}_D = -\mathbb{E}_{\pi^*}[\log D_\psi(s,a)] - \mathbb{E}_{\pi_\theta}[\log(1 - D_\psi(s,a))]
$$

Üretici (politika $\pi_\theta$), ayrımcıyı kandırmak — yani uzmanınkine benzeyen durum-eylem çiftleri üretmek — üzere eğitilir. Ayrımcının çıktısı $\log D_\psi(s,a)$, politika için bir ödül sinyali olarak işlev görür.

GAIL, sürekli kontrol kıyaslamalarında BC'den çok daha az gösteriyle uzman düzeyinde performans elde eder ve karmaşık ortamlarda MaxEnt IRL'den daha iyi genelleşir.

---

## Doğal Dil İşlemede Davranışsal Klonlama: Pratik Bir Örnek

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

torch.manual_seed(42)

# -----------------------------------------------
# Toy NLP task: rewriting sentences to be more formal
# We simulate this as a simple sequence transformation
# In practice: fine-tuning a seq2seq model on expert rewrites
# -----------------------------------------------

class SimpleSeq2Seq(nn.Module):
    def __init__(self, vocab_size=100, embed_dim=32, hidden_dim=64):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.encoder = nn.GRU(embed_dim, hidden_dim, batch_first=True)
        self.decoder = nn.GRU(embed_dim, hidden_dim, batch_first=True)
        self.proj = nn.Linear(hidden_dim, vocab_size)
        self.hidden_dim = hidden_dim

    def forward(self, src, tgt):
        src_emb = self.embed(src)
        _, hidden = self.encoder(src_emb)
        tgt_emb = self.embed(tgt)
        out, _ = self.decoder(tgt_emb, hidden)
        return self.proj(out)

# Generate synthetic demonstration data
VOCAB = 100
rng = np.random.default_rng(42)
N, SEQ_LEN = 1000, 12

src_seqs = torch.tensor(rng.integers(1, VOCAB, (N, SEQ_LEN)), dtype=torch.long)
# "Expert" transformation: shift tokens by 1 (toy formalization)
tgt_seqs = torch.clamp(src_seqs + 1, 1, VOCAB - 1)
tgt_in  = torch.cat([torch.ones(N, 1, dtype=torch.long), tgt_seqs[:, :-1]], dim=1)

dataset = TensorDataset(src_seqs, tgt_in, tgt_seqs)
loader = DataLoader(dataset, batch_size=64, shuffle=True)

model = SimpleSeq2Seq(vocab_size=VOCAB)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss(ignore_index=0)

# Behavioral cloning training
train_losses = []
for epoch in range(20):
    epoch_loss = 0
    for src, tgt_i, tgt_o in loader:
        logits = model(src, tgt_i)
        loss = criterion(logits.reshape(-1, VOCAB), tgt_o.reshape(-1))
        optimizer.zero_grad(); loss.backward(); optimizer.step()
        epoch_loss += loss.item()
    train_losses.append(epoch_loss / len(loader))

print(f"Initial loss: {train_losses[0]:.3f}")
print(f"Final loss:   {train_losses[-1]:.3f}")

# Evaluate: check token accuracy on held-out examples
model.eval()
with torch.no_grad():
    src_test = src_seqs[-100:]
    tgt_test_in = tgt_in[-100:]
    tgt_test_out = tgt_seqs[-100:]
    logits = model(src_test, tgt_test_in)
    preds = logits.argmax(dim=-1)
    acc = (preds == tgt_test_out).float().mean().item()
    print(f"Token accuracy on held-out set: {acc:.3f}")
```

---

## Taklit Öğrenmesi Yöntemlerinin Karşılaştırması

| Yöntem              | Ödül gerektirir mi? | Uzman çevrimiçi sorgulanır mı? | Yeni dinamiklere genelleşir mi? | Karmaşıklık |
|---------------------|--------------------|---------------------------------|----------------------------------|-------------|
| Davranışsal Klonlama| Hayır              | Hayır                           | Zayıf (dağılım kayması)          | Düşük       |
| DAgger              | Hayır              | Evet                            | Orta                             | Orta        |
| MaxEnt IRL          | Kurtarır           | Hayır                           | İyi                              | Yüksek      |
| GAIL                | Hayır              | Hayır                           | İyi                              | Yüksek      |

---

## Uygulamalar

**Robotik.** Robotlara nesneleri tutmayı, ortamlarda gezinmeyi veya ev görevlerini gerçekleştirmeyi öğretme. Fiziksel gösteriler, uzaktan kumanda veya kinestetik öğretim yoluyla toplanır.

**Otonom sürüş.** ALVINN {cite}`pomerleau1989alvinn` ve NVIDIA'nın DAVE gibi erken otonom sürüş sistemleri, insan sürüş verisiyle davranışsal klonlamaya büyük ölçüde güvendi.

**Oyun yapay zekası.** Taklit öğrenmesi, RL ince ayarından önce ajanları önyüklemek amacıyla insan oynanışını kullanır. AlphaStar, pekiştirmeli öğrenmeden önce insan oyun tekrarları üzerinde eğitildi; bu yaklaşım, insan düzeyinde gösteriler mevcut olduğunda yaygındır.

**Kod üretimi.** Yüksek kaliteli kod gösterileri (GitHub Copilot, Codex) üzerinde dil modellerinin ince ayarlanması bir davranışsal klonlama biçimidir.

**Klinik karar desteği.** Karmaşık protokoller için uzman hekim karar dizilerinden öğrenme.

```{seealso}
Temel BC/DAgger analizi: {cite}`ross2011reduction`. MaxEnt IRL: {cite}`ziebart2008maximum`. GAIL: {cite}`ho2016generative`. Taklit öğrenmesinin kapsamlı bir araştırması için bkz. {cite}`osa2018algorithmic`.
```
