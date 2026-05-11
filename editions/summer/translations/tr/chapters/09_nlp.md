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

# Doğal Dil İşlemede Döngüde İnsan

Doğal dil, HITL ML'nin tartışmasız en büyük etkiyi yarattığı alan — ve en derin kavramsal güçlüklerin ortaya çıktığı yerdir. Dil özünde toplumsal bir nitelik taşır: anlamı insan toplulukları inşa eder, edimbilimi bağlam ve amaca bağlıdır ve kalitesi yalnızca insan okuyucular tarafından değerlendirilebilir. Ancak bu durum aynı zamanda şu anlama gelir: doğal dil işleme açıklaması yalnızca gözlemleri toplamak değildir. Kategorileri *inşa etmektir*.

---

## Doğal Dil İşleme Açıklamasındaki Kurucu Problem

Tıbbi görüntülemede bir gerçek zemin vardır: tümör var ya da yok. Radyologun etiketi belirsiz olabilir, ancak gerçek bir şeyi yansıtmaya çalışır. Doğal dil işleme açıklaması çoğunlukla temelden farklıdır. Bir açıklayıcı bir twiTi "toksik" olarak işaretlediğinde, tweet'te tespit etmeye çalıştığımız toksik bir molekül yoktur. **Etiket kategoriyi inşa eder.**

Bunun çoğunlukla yeterince anlaşılmayan derin sonuçları vardır:

**Açıklama işgücü olguyu tanımlar.** "Saldırgan dil" için bir etiket şeması, onu tasarlayanların ve uygulayanların duyarlılıklarını kodlar. Tek bir demografik arka plandan İngilizce konuşan açıklayıcılardan oluşan ve kurumsal politika ekibinin hazırladığı kılavuzlar doğrultusunda çalışan bir ekip, o ekibin saldırganlık anlayışını yansıtan bir veri kümesi üretir — evrensel bir insan standardı değil. Bu tür verilerle eğitilen modeller aynı örtük sınırlara sahip olacaktır.

**Kılavuzlar, bunu kabul edip etmeseler de teoriktir.** Her açıklama şeması, ontoloji hakkında iddialar içerir. "İroni" ve "alaycılığın" aynı sınıf olduğuna karar vermek teorik bir iddiadır; tarafsız bir kolaylık değil. "Öfkeyi" "haklı öfke" ile "düşmanca öfkeyi" ayırt etmek yerine tek bir sınıf olarak etiketlemeye karar vermek, aşağı akış görevi için önem taşıyan bir ayrımı ortadan kaldırır. Bu kararlar üretim baskısı altında alınır ve nadiren yeniden gözden geçirilir.

**Zaman içinde etiket istikrarsızlığı.** Toplumsal dil gelişir. 2018'de eğitilmiş bir toksisite modeli, 2024 içeriğini yanlış sınıflandıracaktır; istatistiksel olarak yetersiz eğitildiği için değil, belirli terimlerin toplumsal anlamı değiştiği için. Doğal dil işleme açıklaması statik bir dağılımdan örnekleme değildir — etiketleme eyleminin kısmen oluşturmaya katkıda bulunduğu hareketli bir hedeften örneklemektir.

:::{admonition} Açıklama Yapay Ürün Problemi
:class: important

Geva ve diğerleri {cite}`geva2019annotator`, Doğal Dil Çıkarımı (NLI) veri kümelerinin açıklama sürecinin kendisi tarafından öğretilen sistematik yapay ürünler içerdiğini gösterdi. Verilen bir öncülü için "çıkarım" hipotezleri yazmakla görevlendirilen açıklayıcılar belirli sözdizimsel kalıplar kullanma eğilimindedir; "çelişki" hipotezleri yazanlar başkalarını kullanır. Modeller, amaçlanan anlamsal ilişki yerine bu yapay ürünlere dayanarak sınıflandırmayı öğrenir — altta yatan doğal dil işleme görevini değil, açıklama görevini çözerler.

Bu özensizlik değildir. İnsanların bir etikete uyacak örnekler oluşturmasının doğasında bulunan bir sonuçtur. HITL süreci, veriye hiçbir zaman amaçlanmamış sistematik bir sinyal enjekte eder.
:::

---

## Metin Sınıflandırması Açıklaması

En basit doğal dil işleme açıklama görevi, bir metin belgesine kategori atamaktır. Duygu analizi, konu sınıflandırması, niyet tespiti ve spam filtreleme sınıflandırma görevleridir.

**Metin sınıflandırmasına özgü güçlükler:**

*Öznellik.* "Toksik" veya "saldırgan" gibi kategoriler özünde özneldir ve kültürel bağlamlar, açıklayıcı arka planları ve platform bağlamına göre farklılık gösterir. Açıklayıcılar arasında saldırganlık algıları demografiye göre önemli ölçüde farklılaşır — doğruluk için doğrudan çıkarımları olan bir gerçek {cite}`blodgett2020language`.

*Etiket belirsizliği.* Pek çok belge birden fazla kategoriye girer ya da sınırda yer alır. %60 olumlu ve %40 olumsuz olan bir yorum gerçek anlamda belirsizdir; yanlış etiketlenmemiştir. Tek bir etiketi zorlamak gerçek bilgiyi atar (yumuşak etiketler ve açıklayıcı anlaşmazlığı üzerine bkz. Bölüm 13).

*Etiket ayrıntısı.* 2 sınıflı bir duygu modeli sosyal medya izleme için yeterli olabilir; 7 puanlı bir ölçek ürün geri bildirimi analizi için gerekli olabilir. Doğru ayrıntı düzeyi aşağı akış görevine bağlıdır, ancak genellikle açıklamadan önce sabitlenir — yetersiz veriyle alınan sonuçlu bir tasarım kararı.

---

## Adlandırılmış Varlık Tanıma

Adlandırılmış Varlık Tanıma (NER) açıklaması, metin parçalarını tanımlamayı ve bir varlık türü (KİŞİ, KURULUŞ, KONUM vb.) atamayı gerektirir. Birkaç nedenle belge sınıflandırmasından daha karmaşıktır:

**Parça sınırları belirsizdir.** "Apple CEO Tim Cook açıkladı..." ifadesinde KİŞİ varlığı "Tim Cook" mu yoksa "Apple CEO Tim Cook" mu kapsar? Kılavuzlar bu vakaları açıkça ele almalıdır ve parçalar üzerindeki açıklayıcılar arası anlaşma tutarlı olarak türler üzerindeki anlaşmadan düşüktür.

**Tür ataması dünya bilgisi gerektirir.** "Apple" bir bağlamda KURULUŞ, diğerinde ÜRÜN ve "elmalı pasta"da muhtemelen hiçbiridir. Açıklayıcıların doğru tür atamaları yapabilmesi için yeterli alan bilgisi gerekir.

**İç içe geçmiş varlıklar.** "University of California, Berkeley" ifadesi KONUM içinde iç içe geçmiş KURULUŞ içerir. Standart BIO etiketlemesi iç içe geçmiş varlıkları temsil edemez; daha karmaşık şemalar (örneğin BIOES veya grafik tabanlı biçimler) gerekir.

**Açıklama verimliliği.** Bir taban Adlandırılmış Varlık Tanıma modeli ile ön açıklama, açıklayıcıların sıfırdan açıklama yerine tahminleri düzeltmesine olanak tanıyarak açıklamayı önemli ölçüde hızlandırır. Klinik Adlandırılmış Varlık Tanıma üzerine yapılan bir çalışmada %30–60 verim artışları gözlemlenmiştir {cite}`lingren2014evaluating`; bu tür kazanımların büyüklüğü taban model kalitesine ve alana göre önemli ölçüde değişir.

---

## İlişki Çıkarımı ve Anlamsal Açıklama

Varlıkları tanımlamanın ötesinde, ilişki çıkarımı varlıklar arasındaki *ilişkileri* açıklamayı gerektirir:

- Açıklayıcıların her iki varlığı ve bunları birbirine bağlayan yüklemi anlaması gerekir
- İlişki türlerinin karmaşık anlamsal ayrımları vardır (ÇALIŞIYOR_AT ile İSTİHDAM_EDİLEN ile KURDU)
- Negatif örnekler (ilişkisi olmayan varlık çiftleri) pozitif örneklerden çok daha yaygındır

**İlişki çıkarımı için açıklayıcılar arası anlaşma**, sınıflandırma görevlerinden düşük olma eğilimindedir. İyi tanımlanmış şemalar için $\kappa$ değerleri 0,65–0,80 aralığında rapor edilmektedir {cite}`pustejovsky2012natural`; karmaşık anlamsal ilişkiler (olay nedenselliği, zamansal ilişkiler) için anlaşma şema tasarımına ve açıklayıcı eğitimine bağlı olarak önemli ölçüde düşebilir.

---

## Makine Çevirisi Sonrası Düzenleme (MCSD)

Makine çevirisi sonrası düzenleme, HITL doğal dil işlemenin olgun bir biçimidir. İnsan çevirmen, sıfırdan çevirmek yerine bir makine çevirisi sisteminin çıktısını düzeltir:

**Hafif sonrası düzenleme (HSD):** Yalnızca kritik hatalar düzeltilir. Çeviri kalitesi gereksinimlerinin ılımlı olduğu durumlara uygundur.

**Tam sonrası düzenleme (TSD):** Çıktı yayın kalitesine getirilir. Düzenlenen çıktı genellikle sonraki makine çevirisi iyileştirmesi için eğitim verisi hâline gelir — gerçek bir döngüde insan iyileştirme döngüsü.

**HTER (İnsan Hedefli Çeviri Düzenleme Oranı):** Makine çevirisi çıktısı ile sonrası düzenlenmiş çeviri arasındaki düzenleme mesafesini cümle uzunluğuna göre normalleştirilmiş olarak ölçen bir ölçüt {cite}`graham2015accurate`. Pratik bir kural olarak, yaklaşık 0,3'ün altındaki HTER genellikle iyi makine çevirisi çıktısı olarak değerlendirilir; 0,5'in üzerinde sıfırdan çeviri daha hızlı olabilir — ancak bu eşikler alana ve dil çiftine göre değişir.

---

## Konuşma Yapay Zekası ve Diyalog Açıklaması

Diyalog açıklaması zamansal yapıyı beraberinde getirir:

- **Tur düzeyinde açıklama:** her turu etiketle (niyet, duygu, kalite)
- **Diyalog düzeyinde açıklama:** genel tutarlılığı, görev başarısını, kullanıcı memnuniyetini değerlendir
- **Etkileşim izi açıklaması:** konuşmadaki belirli başarısızlık anlarını belirle

HITL, özellikle diyalogda önem taşır; çünkü model başarısızlıkları çoğunlukla ince ve birikimlidir: 3. turdaki olgusal bir hata, 7. turda belirginleşmeyebilir. Konuşmaları izleyen insan açıklayıcılar, otomatik ölçütlerin tamamen kaçırdığı bu uzun mesafeli başarısızlık örüntülerini belirleyebilir.

---

## Programatik Etiketleme ve Zayıf Denetim

Etiketli veri kıt olduğunda, **zayıf denetim** ölçekli olasılıksal etiketler oluşturmak için birden fazla gürültülü, örtüşen etiketleme işlevinin kullanılmasına olanak tanır. **Snorkel** {cite}`ratner2017snorkel` standart çerçevedir:

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score

rng = np.random.default_rng(42)

# -------------------------------------------------------
# Toy weak supervision: sentiment classification
# 5 labeling functions (LFs) with different coverage/accuracy
# Label: +1 (positive), -1 (negative), 0 (abstain)
# -------------------------------------------------------

N = 1000
true_labels = rng.choice([-1, 1], size=N)
X_features = np.column_stack([
    true_labels * 0.8 + rng.normal(0, 0.5, N),
    rng.normal(0, 1, N),
    rng.normal(0, 1, N),
])

def make_lf(accuracy, coverage, seed):
    rng_lf = np.random.default_rng(seed)
    votes = np.zeros(N, dtype=int)
    active = rng_lf.random(N) < coverage
    correct = rng_lf.random(N) < accuracy
    votes[active & correct]  = true_labels[active & correct]
    votes[active & ~correct] = -true_labels[active & ~correct]
    return votes

LFs = np.column_stack([
    make_lf(accuracy=0.85, coverage=0.60, seed=1),
    make_lf(accuracy=0.78, coverage=0.45, seed=2),
    make_lf(accuracy=0.70, coverage=0.80, seed=3),
    make_lf(accuracy=0.90, coverage=0.30, seed=4),
    make_lf(accuracy=0.60, coverage=0.90, seed=5),
])

def majority_vote(LF_matrix):
    labels = []
    for i in range(LF_matrix.shape[0]):
        votes = LF_matrix[i][LF_matrix[i] != 0]
        labels.append(0 if len(votes) == 0 else int(np.sign(votes.sum())))
    return np.array(labels)

mv_labels = majority_vote(LFs)
covered = mv_labels != 0

print(f"Coverage:                    {covered.mean():.1%}")
print(f"MV accuracy (covered):       {(mv_labels[covered] == true_labels[covered]).mean():.3f}")

X_train, y_train = X_features[covered], mv_labels[covered]
X_test,  y_test  = X_features[~covered], true_labels[~covered]

if len(X_train) > 10 and len(X_test) > 10:
    clf = LogisticRegression().fit(X_train, y_train)
    preds = clf.predict(X_test)
    print(f"F1 on uncovered test set:    {f1_score(y_test, preds):.3f}")
```

---

## Dil Modelleri için RLHF: Açıklama Gerçekliği

Bölüm 6, RLHF'yi teknik olarak ele aldı. Doğal dil işleme perspektifinden, açıklama görevi dışarıdan göründüğünden daha güçtür.

**Açıklayıcıların gerçekte ne yapması isteniyor** — iki model çıktısını karşılaştırmak ve hangisinin "daha iyi" olduğunu belirtmek — basit görünür. Pratikte, "daha iyi" açıklayıcıların kişisel sezgileri kullanarak çözdüğü eksik belirtilmiş bir kavramdır. Kimisi akıcılığa büyük ağırlık verir; kimisi olgusal doğruluğa; kimisi ayrıntılılığı cezalandırır. Sıkı kılavuzlar olmadan, ortaya çıkan tercih veri kümesi, soyut insan değerlerini değil, istihdam edilen açıklama işgücünün belirli çözüm stratejilerini yansıtır.

**Temel açıklama boyutları şunlardır:**

- *Yararlılık:* Yanıt soruyu iyi yanıtlıyor mu? Bilgilendirici, açık ve uygun ölçüde ayrıntılı mı?
- *Olgusallık:* Yanıt olgusal olarak doğru mu? Bu, değerlendiricilerin alan bilgisine sahip olmasını gerektirir — genelci açıklayıcılar uzman iddiaları doğrulayamadığından ölçekte ciddi kalite sorunları yaratır.
- *Zararsızlık:* Yanıt toksik, önyargılı, zararlı veya uygunsuz içerikten kaçınıyor mu? "Zararlı"nın bağlama bağlı olduğu ve kültürler, zaman ve platform bağlamı genelinde değiştiği göz önüne alındığında bu yargılar ayrıntılı kılavuzlar gerektirir.
- *Kalibrasyon:* Yanıt uygun belirsizliği ifade ediyor mu? Açıklayıcılar sistematik olarak güvenli tonda yanıtları tercih etmektedir; bu durum, uygun epistemik alçakgönüllülüğe karşı bir ödül sinyali yaratır.

Ölçütler arasındaki etkileşim karmaşıktır: tehlikeli bir soruya maksimum düzeyde yararlı yanıt, maksimum düzeyde zararlı olabilir. Kılavuzlar, birbiriyle rekabet eden ölçütler arasında nasıl denge kurulacağını belirtmelidir — ve bu dengelerin kendisi, açıklama kararları değil politika kararlarıdır. Açıklama işgücü politika yapmaktadır.

**Ölçek, demografik etkiyi yoğunlaştırır.** Büyük modeller için RLHF nispeten küçük açıklama işgücünü (yüzlerden birkaç bine kadar) içerir ve bu işgücü milyarlarca aşağı akış kararı verir. Bu işgücünün demografik ve kültürel önyargıları, açıklama daha dağıtılmış olsaydı olmayacak biçimde modelin davranışına yansır. Bu, mevcut RLHF hattındaki en az tartışılan yapısal sorunlardan biridir.

---

## Açıklama–Model Geri Bildirim Döngüsü

Doğal dil işlemede, diğer herhangi bir alandan daha fazla, açıklama ve model geliştirme süreçleri zaman içinde iç içe geçer:

1. Açıklayıcılar, bir modelin mevcut çıktılarını örtük olarak referans olarak kullanarak kalibre edilir.
2. Ödül modeli, açıklamaların neyi tercih ettiğini öğrenir.
3. Üretici, yüksek ödül elde eden çıktılar üretmek üzere ince ayarlanır.
4. Bu çıktılar, sonraki açıklama turlarında "iyi"nin neye benzediğini etkiler.

Bu geri bildirim döngüsü özünde hastalıklı değildir — RLHF'nin yakınsamasını sağlayan budur — ancak modelin davranışının insan tercihlerini yansıttığı için mi yoksa açıklayıcı sezgilerini örüntü eşleştirmeyi öğrendiği için mi şekillendiğini ampirik olarak ayırt etmek güçtür.

Temiz bir çözüm yoktur. En iyi mevcut uygulama, düzenli aralıklarla toplanan tutulmuş tercih yargıları kullanarak kayma izlemek ve açıklama kılavuzu versiyonunu deneysel değişken olarak ele almaktır.

---

## Üretici Doğal Dil İşleme Modellerinin Değerlendirilmesi

Net bir doğruluk ölçütü olan sınıflandırma modellerinin aksine, üretim kalitesini değerlendirmek insan yargısı gerektirir:

| Değerlendirme yöntemi | Açıklama | Maliyet |
|---|---|---|
| Doğrudan değerlendirme (DA) | Açıklayıcılar kaliteyi ölçekle derecelendirir | Orta |
| Karşılaştırmalı yargı | Açıklayıcılar iki çıktuyu karşılaştırır | Düşük |
| MQM (Çok Boyutlu Kalite Ölçütleri) | Yapılandırılmış hata taksonomisi | Yüksek |
| RLHF tercihi | Eğitim için kullanılan tercih etiketleri | Orta |
| Yargıç olarak BDM | BDM çıktıları puanlar (insanla ılımlı korelasyon) | Çok düşük |
| BERTScore, BLEU | Otomatik ölçütler (insan yargısıyla yetersiz korelasyon) | Çok düşük |

Otomatik ölçütler (makine çevirisi için BLEU, özetleme için ROUGE) ucuzdur ancak insan kalite yargılarıyla yetersiz biçimde ilişkilidir {cite}`reiter2018structured`. Yargıç olarak BDM yaklaşımları, insan açıklayıcılarla ılımlı anlaşma göstermektedir {cite}`zheng2023judging` ve hızlı yineleme için giderek artan biçimde kullanılmaktadır; ancak nihai değerlendirmeler için insan değerlendirmesinin yerini almamalıdır. Gerçek riskler içeren kararlar için insan değerlendirmesi zorunluluğunu korumaktadır.

```{seealso}
Snorkel zayıf denetimi: {cite}`ratner2017snorkel`. Doğal dil işleme açıklama kılavuzları: {cite}`pustejovsky2012natural`. Doğal dil çıkarımında açıklama yapay ürünleri: {cite}`geva2019annotator`. Açıklayıcı önyargısı ve doğal dil işleme veri kümeleri: {cite}`blodgett2020language`. Üretici model değerlendirmesi için: {cite}`reiter2018structured`.
```
