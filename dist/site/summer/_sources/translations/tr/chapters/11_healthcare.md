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

# Sağlık ve Bilimde Döngüde İnsan

Sağlık ve bilim, HITL ML'nin en sonuçlu ve en tartışmalı olduğu iki alanı temsil etmektedir. Riskler yüksektir: kaçırılan bir kanser tanısı veya hatalı bir ilaç hedefinin gerçek bir insan maliyeti vardır. Açıklama, nadir ve pahalı uzmanlık gerektirir. Düzenleyici gereklilikler, modellerin neler yapabileceğini ve nasıl doğrulanmaları gerektiğini kısıtlar. Doğal dil işlemenin aksine, burada çoğunlukla gerçek bir zemin vardır — tümör ya var ya yok — hiçbir tekil gözlemci bunu güvenilir biçimde belirleyemese de.

Popüler haberlerdeki hâkim çerçeveleme "yapay zeka karşı insan"dır: yapay zeka radyologların yerini alacak mı? Bu çerçeveleme önem taşıyan bir biçimde yanlıştır. Gerçek soru şudur: hangi insan–yapay zeka işbirliği biçimi her birinden daha iyi sonuçlar üretir ve bu işbirliğini aksatmak yerine mümkün kılan sistemler nasıl inşa edilir.

---

## Tıbbi Görüntü Analizi

Tıbbi görüntüleme — radyoloji (X-ışını, BT, MRI), patoloji (doku kesitleri), dermatoloji, oftalmoloji — tıbbi yapay zekanın en hızlı ilerlediği alandır.

### Uzman Açıklayıcı Gereksinimleri

Tıbbi görüntü açıklaması genellikle belirli alt uzmanlık eğitimine sahip hekimler gerektirir. Bu durum açıklamayı şu hâle getirir:

- **Yavaş:** Uzmanların sınırlı zamanı vardır; açıklama klinik görevlerle rekabet eder
- **Pahalı:** Maliyetler, alt uzmanlık, modalite ve görev karmaşıklığına bağlı olarak açıklamalı vaka başına onlardan yüzlerce dolara uzanır
- **Değişken:** Uzmanlar bile özellikle sınır vakalarda anlaşmazlığa düşer — bu çoğunlukla bir sorun olarak ele alınır, ancak gerçekte bilgilendiricidir

### Radyologlar Arası Değişkenlik

Radyolojide okuyucu değişkenliği iyi belgelenmiştir. Akciğer grafisi yorumlamasında okuyucular arası anlaşmazlık önemlidir — CheXNet çalışmasında dört radyolog aynı pnömoni tespiti test kümesini yaklaşık 12 yüzde puanlık F1 aralığıyla etiketledi {cite}`rajpurkar2017chexnet`; bu, sınır vakalardaki gerçek tanısal belirsizliği yansıtmaktadır. Akciğer BT'deki nodül tespiti için okuyucu içi değişkenlik (aynı okuyucu, aynı vaka, farklı gün) okuyucular arası değişkenlik kadar büyük olabilir.

Bu değişkenlik yalnızca gürültü değildir — gerçek tanısal belirsizliği yansıtır. Tek bir radyologun açıklamalarıyla eğitilen modeller, altta yatan patoloji yerine o hekimin özel önyargılarını öğrenebilir.

:::{admonition} HITL Dersi Olarak CheXNet Tartışması
:class: note

Rajpurkar ve diğerleri, CheXNet modellerinin pnömoni tespitinde "radyolog performansını aştığını" iddia ettiğinde, bu iddia radyoloji topluluğu tarafından hemen itirazla karşılandı {cite}`yu2022assessing`. Tartışmanın bir bölümü belirli test kümesi ve radyolog karşılaştırmasıyla ilgiliydi. Ancak daha derin bir sorun metodolojikti: kullanılan "radyolog performansı" taban çizgisi, klinik radyolojinin genellikle içerdiği konsültasyon, önceki görüntülemelerle karşılaştırma ve klinik bağlama erişim olmaksızın zaman baskısı altında tekil okuyuculardan yararlandı — bunların hiçbiri modelde yoktu.

Ders, modelin iyi ya da kötü olduğu değil, **performans karşılaştırmalarının HITL kurulumunu belirtmesini gerektirdiğidir**. Tekil radyologu soğuk okuma yaptırarak geçen bir model, modelin çıktısını ikinci görüş olarak kullanan bir radyologdan hâlâ daha az doğru olabilir. Bunlar, farklı hata kiplerine sahip farklı sistemlerdir.
:::

:::{admonition} Tıpta yumuşak etiketler
:class: important

Birçok tıbbi yapay zeka projesi, tek bir "altın standart" etiket yerine uzman görüşlerinin dağılımını yansıtan **yumuşak etiketler** kullanmaya geçmiştir. Bir radyolog paneli tarafından %60 pnömoni / %40 atelektazi olarak etiketlenen bir akciğer grafisi, zorla ikili seçimden daha fazla bilgi taşır. Bu tür dağılımlar üzerinde eğitilen modeller, daha iyi kalibrasyon ve daha uygun belirsizlik nicelemesi sergilemektedir — ve bu belirsizlik klinik açıdan anlamlıdır; çünkü klinisyene modelin ne düşündüğünü değil, ne zaman danışması gerektiğini söyler.
:::

### Nadir Hastalıklar için Aktif Öğrenme

Aktif öğrenme, büyük bir etiketsiz havuzun dahi yalnızca az sayıda pozitif vaka içerdiği nadir hastalıklar ve nadir patolojiler için özellikle değerlidir. Standart rastgele örnekleme, uzman zamanını çoğunlukla negatif vakaları etiketleyerek boşa harcar.

Belirsizlik tabanlı aktif öğrenme, doğal olarak modelin belirsiz olduğu sınır vakaları seçer — nadir hastalıklar için bunlar pozitif vakalar ve sınır negatifler olma eğilimindedir. Bu, uzman zamanını en değerli olduğu yerde yoğunlaştırır. Sınıf dengesizliği eğitiminin (`class_weight='balanced'` veya benzeri) ve belirsizlik tabanlı seçimin birleşimi, nadir patoloji tespiti görevleri için standart uygulamadır.

---

## Klinik Doğal Dil İşleme Açıklaması

Elektronik sağlık kayıtları (ESK), klinik anlatı metin açısından muazzam bir zenginlik barındırır: hekim notları, taburcu özetleri, radyoloji raporları, patoloji raporları. Bu metinden yapılandırılmış bilgi çıkarmak doğal dil işleme gerektirir — ve yüksek kaliteli doğal dil işleme, açıklamalı eğitim verisi gerektirir.

**Yaygın klinik doğal dil işleme açıklama görevleri:**
- **Klinik Adlandırılmış Varlık Tanıma:** Metindeki ilaçları, dozajları, tanıları, prosedürleri ve semptomları tanımlama
- **Olumsuzlama tespiti:** "Pnömoni kanıtı yok" ile "Pnömoni doğrulandı" — şaşırtıcı biçimde güç olan kritik bir ayrım
- **Zamansal akıl yürütme:** Mevcut durumları geçmişten ayırt etme ("MI öyküsü, göğüs ağrısıyla başvurdu")
- **Tanımlama kaldırma:** Veri paylaşımını mümkün kılmak için Korunan Sağlık Bilgilerini (KSB) kaldırma

**KSB tanımlama kaldırma**, hem bir açıklama görevi hem de bir veri yönetişimi gerekliliğidir. ABD'de HIPAA ve AB'de GDPR kapsamında sağlık verileri hasta tanımlayıcıları kaldırılmadan veya anonimleştirilmeden paylaşılamaz. Otomatik tanımlama kaldırma araçları mevcuttur, ancak kusurludur; otomatik çıktıların insan incelemesi standart uygulamadır. Risk profili asimetriktir: yanlış negatifler (kaçırılan KSB) hukuki tehlike yaratır; bu nedenle muhafazakâr eşikler zorunludur.

### Şablon Olarak i2b2 / n2c2

i2b2 (Biyoloji ve Yatak Başı için Bilişim Entegrasyonu) ve halef n2c2 (Ulusal Doğal Dil İşleme Klinik Zorlukları) paylaşılan görev girişimleri, bir dizi uzman açıklamalı klinik doğal dil işleme veri kümesi yayımlamıştır. Bunlar hem potansiyeli hem de maliyeti örneklemektedir: açıklama çabaları genellikle birkaç ay boyunca çalışan klinik alan uzmanı ekiplerini, zorluk başına yüzlerce belgeyi kapsar. n2c2 veri kümeleri, yalnızca açıklama sorununu değil, veri paylaşımı yönetişim sorununu (tanımlama kaldırma + kurumsal anlaşmalar) çözdükleri için hızlı ilerlemeyi katalize etti.

---

## Düzenleyici Değerlendirmeler

Tıbbi yapay zeka, çoğu yargı bölgesinde düzenleyici denetime tabidir.

**FDA (Amerika Birleşik Devletleri):** Yapay zeka/Makine Öğrenmesi tabanlı Tıbbi Cihaz Yazılımı (SaMD) piyasa öncesi onay veya lisans gerektirmektedir. FDA'nın 2021 YZ/MÖ Eylem Planı, **önceden belirlenmiş değişiklik kontrol planlarını** — modelin nasıl güncelleneceğinin ve bu güncellemelerin dağıtımdan önce nasıl doğrulanacağının belgelenmesini — ön plana çıkarmaktadır. Bu çerçeve altında, klinik geri bildirimden sürekli öğrenen bir model, her güncellemeden sonra farklı bir cihazdır ve yeniden doğrulama gerektirebilir.

**CE işaretlemesi (Avrupa):** Yapay zeka sistemleri dahil tıbbi cihazlar Tıbbi Cihaz Yönetmeliğine (MDY) uymak zorundadır. MDY klinik değerlendirme, piyasa sonrası gözetim ve eğitim ile doğrulama için kullanılan verilerin belgelenmesini gerektirir.

**Temel HITL çıkarımı:** Düzenleyici çerçeveler, açıklama süreçlerinin, açıklayıcı yeterliliklerinin, değerlendiriciler arası güvenilirliğin ve eğitim verilerindeki değişikliklerin açık biçimde belgelenmesini gerektirir. Bu bürokratik yük değildir — bir klinisyenin modelin mevcut davranışını hangi eğitim verisinin ürettiğini anlamasına olanak tanıyan denetim izi ve yasal olarak zorunludur. Açıklamayı gayri resmi bir alt süreç olarak ele alan HITL hatları, genellikle en kötü anda görünür hâle gelen düzenleyici risk yaratır.

---

## Bilimsel Veri Açıklaması

Sağlığın ötesinde, HITL ML bilimsel araştırmalarda giderek artan ve değeri yeterince anlaşılmayan bir rol oynamaktadır; buradaki açıklama güçlüğü çoğunlukla alan uzmanlığını ölçekle harmanlar.

### Astronomi: Galaxy Zoo

Galaxy Zoo {cite}`lintott2008galaxy`, Sloan Dijital Gökyüzü Araştırması'ndaki galaksilerin morfolojik sınıflandırmasını vatandaş bilimcilere kitle kaynaklı yöntemle dağıttı. Özgün proje, 100.000'den fazla gönüllüden 40 milyonun üzerinde sınıflandırma toladı; bu, uzman eğitimi gerektirmeden basit sorulara yanıt verebilmesi hâlinde bilimsel görüntü sınıflandırmasının büyük ölçekli kitle kaynaklı yapılabilirliğini kanıtladı ("Bu galaksi düzgün mü yoksa özellikli mi?").

Galaxy Zoo deneyimi, iki önemli metodolojik bulgu üretti. Birincisi, vatandaş bilimciler ile profesyonel astronomlar arasındaki anlaşma net vakalar için yüksek, sınır vakalarda sistematik olarak ayrışıyordu — tam da bilimsel olarak ayrımın önem taşıdığı vakalar. Çözüm, sınır vakalarda vatandaş bilimi verilerini atmak değil, gönüllü yanıtların dağılımını gerçek morfolojik belirsizliği kodlayan bir yumuşak etiket olarak ele almaktı. İkincisi, Galaxy Zoo etiketleri üzerinde eğitilen sınıflandırıcı, herhangi bir uzmanın etiketlerini yeniden üretmek için eğitilen modelleri geride bıraktı; çünkü kalabalık dağılımı, tek bir uzmanın zorla seçiminin kapattığı gerçek görsel belirsizliği yakaladı.

### Genomik: Patojenisite Sınıflandırması

Genomik varyantları açıklamak — bir varyantın patojenik, iyi huylu veya belirsiz öneme sahip olup olmadığına karar vermek — yüksek riskli bir doğal dil işleme ve uzman yargısı sorunudur. ClinVar gibi klinik varyant veri tabanları, birden fazla gönderen laboratuvardan uzman yorumlarını bir araya getirir ve laboratuvarlar arasında anlaşmazlık yaygındır. Aktif öğrenme, hangi varyantların tam uzman incelemesi (literatür araştırması, işlevsel kanıt değerlendirmesi) gerektirdiğini ve hangilerinin mevcut kanıtlarla otomatik sınıflandırılabileceğini önceliklendirmek için kullanılır. Sonuç, vakaların büyük bölümünün otomatik mantıkla ele alındığı, bir alt kümenin uzman incelemesi gerektirdiği ve en güç vakaların çok laboratuvarlı fikir birliği için işaretlendiği hibrit bir hattır.

### İklim ve Yer Bilimleri

Uydu görüntüsünü arazi kullanımı değişikliği, ormansızlaşma, buzul genişliği ve fırtına izleri için etiketlemek, uzaktan algılama uzmanlarını ve giderek artan biçimde vatandaş bilimi platformlarını içerir. Bu alandaki birincil HITL güçlüğü zamansal olandır: bugün yapılan etiketler dünya değiştikçe eskiyebilir ve gerçek zemin doğrulaması (arazi araştırmaları) pahalı ve lojistik açıdan kısıtlıdır. Modelin tahmininin fiziksel ön bilgilerle çeliştiği görüntülere (örneğin korunan olduğu bilinen bir bölgede ormansızlaşma tahmini) öncelik veren aktif öğrenme, kıt arazi doğrulama kaynaklarını yönlendirmenin pratik bir yoludur.

### Nörobilim: Konnektomik

Elektron mikroskop görüntülerinden sinir devrelerini yeniden oluşturmak — konnektomik — büyük görüntü yığınları arasında nöron zarlarının piksel düzeyinde açıklanmasını gerektirir. Eyewire projesi bu görevi oyunlaştırarak on binlerce oyuncuyu 3B görüntü hacimlerindeki nöronları izlemeye yöneltti. Oyunlaştırma tasarımı belirli bir HITL sorununu çözdü: görev uzun oturumlar boyunca sürekli dikkat ve mekânsal akıl yürütme gerektirmekte, bu da geleneksel açıklamada kalite bozulmasına yol açmaktadır. Görevi sosyal mekaniklerle oyun bölümlerine ayırmak, profesyonel açıklamanın ulaşamayacağı ölçeklerde açıklayıcı katılımını ve kalitesini korudu.

---

## Uzman Açıklayıcıları Yönetmek

Açıklama nadir uzmanlık gerektirdiğinde, olağan kitle kaynaklı yaklaşımlar (Bölüm 13) geçerli değildir.

**Temel gerilim**, en yüksek kaliteli açıklamalar üretebilecek kişilerin aynı zamanda zamanı en değerli ve en kısıtlı olan kişiler olmasıdır. Uzman açıklama hattındaki her tasarım kararı şu soruya göre değerlendirilmelidir: bu, kıt uzman zamanının en iyi kullanımını sağlıyor mu?

**Pratikte ne anlama geldiği:**

- **Ön açıklamayı agresif biçimde kullanın.** Uzmanın gözden geçirip düzelttiği adayları, daha düşük kademeli açıklayıcıları, otomatik modelleri veya kural tabanlı sistemleri kullanarak oluşturun. Uzmanın yargısı darboğazdır; düzeltecekleri ön açıklamayla beslemek, ön açıklama kalitesi düzeltmenin sıfırdan başlamaktan daha hızlı olduğunu garanti edecek kadar yüksek ise boş ekrandan daha hızlıdır.

- **Verim yerine uzman dikkatine göre tasarlayın.** Yüksek verim için optimize edilmiş açıklama arayüzleri (hızlı ikili kararlar, klavye kısayolları, minimal ekran) kitle kaynaklı çalışma için uygundur. Uzman açıklaması çoğunlukla daha zengin arayüzlerden yararlanır: önceki vakalarla yan yana karşılaştırma, referans materyallere kolay erişim, açıklama güven alanları ve bir vakayı tartışmak üzere işaretleme olanağı. Bunlar bireysel açıklamaları yavaşlatır, ancak kaliteyi artırır ve yeniden açıklama ihtiyacını azaltır.

- **Bireysel açıklayıcı örüntülerini açıkça izleyin.** Küçük bir uzman havuzuyla, her açıklayıcının panelle anlaşma oranını izlemek, kendi geçmişleriyle tutarsız görünen vakaları işaretlemek ve bunları düzenli kalibrasyon oturumlarında tartışmak uygulanabilir ve önemlidir. Bu gözetleme değildir — klinik tıbbın performans değerlendirmesi için kullandığı kalite süreciyle aynıdır ve uzmanlar değerlendirme yerine paylaşılan kalite iyileştirmesi olarak çerçevelendiğinde genellikle olumlu yanıt verir.

- **Oturum tasarımı önem taşır.** Tıbbi açıklama bilişsel açıdan yoğundur. Radyoloji ve patolojiden elde edilen kanıtlar, hata oranlarının yaklaşık 90 dakika sürekli okumadan sonra ölçülebilir biçimde arttığını ve birkaç dakikalık araların bile dikkati kısmen yenileyebildiğini göstermektedir. Mola istemlerini zorunlu kılan açıklama arayüzleri (bunları kapatılamaz hâle getirerek), gerçek kalite etkisi olan basit bir HITL tasarım kararıdır.

---

## Tıbbi Görüntüleme için Bir HITL Aktif Öğrenme Hattı

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.datasets import make_classification
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

# Simulate a rare-pathology detection task
# 8% positive class (e.g., rare pathology)
X, y = make_classification(
    n_samples=5000, n_features=100,
    n_informative=20, n_redundant=10,
    weights=[0.92, 0.08],
    random_state=42
)
X_train, y_train = X[:4000], y[:4000]
X_test,  y_test  = X[4000:], y[4000:]

print(f"Training set positive prevalence: {y_train.mean():.1%}")

def run_medical_al(strategy, n_initial=50, budget=300):
    labeled = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled = [i for i in range(len(X_train)) if i not in labeled]
    aucs = []

    while len(labeled) < n_initial + budget:
        model = LogisticRegression(max_iter=500, class_weight='balanced')
        model.fit(X_train[labeled], y_train[labeled])

        if len(labeled) % 30 == 0:
            preds = model.predict_proba(X_test)[:, 1]
            aucs.append(roc_auc_score(y_test, preds))

        X_pool = X_train[unlabeled]
        if strategy == 'uncertainty' and len(labeled) >= 10:
            probs = model.predict_proba(X_pool)
            entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
            q = int(np.argmax(entropy))
        else:
            q = rng.integers(0, len(unlabeled))

        labeled.append(unlabeled.pop(q))

    return np.array(aucs)

aucs_al  = run_medical_al('uncertainty')
aucs_rnd = run_medical_al('random')
label_counts = np.arange(len(aucs_al)) * 30 + 50

plt.figure(figsize=(7, 4))
plt.plot(label_counts, aucs_al,  'o-',  color='#2b3a8f', linewidth=2, label='Uncertainty AL')
plt.plot(label_counts, aucs_rnd, 's--', color='#e05c5c', linewidth=2, label='Random baseline')
plt.xlabel("Expert labels obtained", fontsize=12)
plt.ylabel("AUROC", fontsize=12)
plt.title("Active Learning for Rare Pathology Detection", fontsize=13)
plt.legend(); plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('medical_al.png', dpi=150)
plt.show()

# Show how AL preferentially selects positive examples
# by checking which class the queried examples belong to
n_init = 50
labeled_al  = list(rng.choice(len(X_train), n_init, replace=False))
labeled_rnd = labeled_al.copy()
unlabeled_al  = [i for i in range(len(X_train)) if i not in labeled_al]
unlabeled_rnd = unlabeled_al.copy()

model = LogisticRegression(max_iter=500, class_weight='balanced')
model.fit(X_train[labeled_al], y_train[labeled_al])
probs = model.predict_proba(X_train[unlabeled_al])
entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
top50_al  = [unlabeled_al[i] for i in np.argsort(entropy)[-50:]]
top50_rnd = list(rng.choice(unlabeled_rnd, 50, replace=False))

pos_rate_al  = y_train[top50_al].mean()
pos_rate_rnd = y_train[top50_rnd].mean()
print(f"\nPositive rate in next 50 queries:")
print(f"  Uncertainty AL: {pos_rate_al:.1%}  (base rate: {y_train.mean():.1%})")
print(f"  Random:         {pos_rate_rnd:.1%}")
print(f"  AL queries {pos_rate_al/y_train.mean():.1f}x more positives than random")
```

```{seealso}
Galaxy Zoo kitle kaynaklı çalışma: {cite}`lintott2008galaxy`. CheXNet radyolog performansı: {cite}`rajpurkar2017chexnet`. Radyografi kalitesi ve yapay zeka destekli tanı: {cite}`yu2022assessing`. Klinik doğal dil işleme açıklama metodolojisi: {cite}`pustejovsky2012natural`. FDA YZ/MÖ eylem planı rehberliği için FDA'nın yayımlanmış belgelerine (2021) bakınız.
```
