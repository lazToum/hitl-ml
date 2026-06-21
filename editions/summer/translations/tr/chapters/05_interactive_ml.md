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

# Etkileşimli Makine Öğrenmesi

Aktif öğrenme odaklı bir soru sorar: bütçe göz önünde bulundurulduğunda hangi örnekler etiketlenmelidir? Etkileşimli Makine Öğrenmesi (IML) ise daha geniş bir soru sorar: bir insan ile bir öğrenme sistemi arasındaki *tüm etkileşimi* en üst düzeyde verimli, keyifli ve doğru biçimde nasıl tasarlayabiliriz?

IML'i diğerlerinden ayıran, insan–model geri bildirim döngüsünün **anlık** ve **doğrudan** niteliğidir. Geleneksel makine öğrenmesinde insan veri teslim eder ve eğitimin bitmesini beklerken, IML insanlara model davranışını gözlemleme, geri bildirim sağlama ve modelin — çoğunlukla saniyeler içinde — tepki verdiğini görme olanağı tanır.

---

## Etkileşimli Makine Öğrenmesinin İlkeleri

Amershi ve diğerleri {cite}`amershi2014power`, IML'nin üç belirleyici özelliğini saptamıştır:

**1. Hızlı Geri Bildirim:** Model, insanların geri bildirimlerinin etkisini algılayabilmesi için yeterince hızlı güncellenir. Limitde, model güncellemeleri gerçek zamanlı olarak gerçekleşir.

**2. Doğrudan Müdahale:** İnsan, modellerle veri ya da modelin tahminleri üzerinden etkileşim kurar — yapılandırma dosyaları veya hiper parametre ayarlaması yoluyla değil.

**3. Yinelemeli İyileştirme:** Süreç gerçek anlamda yinelemeli bir nitelik taşır: insanın sonraki eylemi, insanın önceki eylemlerinin şekillendirdiği modelin mevcut davranışıyla belirlenir.

Bu durum, sıkı bir **karşılıklı uyum döngüsü** yaratır: hem insan hem de model zaman içinde birbirlerine yanıt olarak değişir. İnsan, modelin neyi anladığını öğrenir; model ise insanın ne önemsediğini.

---

## Aktif Öğrenme ile Karşılaştırma

IML ve aktif öğrenme önemli ölçüde örtüşür ancak özdeş değildir:

| Özellik                    | Aktif Öğrenme                 | Etkileşimli ML                   |
|----------------------------|-------------------------------|----------------------------------|
| Birincil soru              | Ne etiketlenmeli?             | Nasıl etkileşim kurulmalı?       |
| Geri bildirim gecikmesi    | Toplu olabilir (günler)       | Genellikle gerçek zamanlı        |
| Model güncelleme sıklığı   | Tur başına (toplu)            | Etkileşim başına (çevrimiçi)     |
| İnsan özerkliği            | Modelin sorularına yanıt verir| Modeli proaktif olarak eğitebilir|
| Arayüz tasarımı            | İkincil endişe                | Merkezi endişe                   |
| İnsanın bilişsel yükü      | Açıkça modellenmiyor          | Açıkça dikkate alınıyor          |

Aktif öğrenmede makine etkileşimi yönlendirir. IML'de insan da inisiyatif alabilir — modelin davranışının en sorunlu görünen yönü ne ise o konuda örnekler, düzeltmeler veya geri bildirim sağlayabilir.

---

## Karma Girişim Etkileşimi

**Karma girişim** sistemleri, hem insanın hem de makinenin farklı anlarda öncü olmasına izin verir {cite}`allen1999mixed`. Tamamen makine yönlendirmeli bir sistem sorular sorar ve insan yanıtlar. Tamamen insan yönlendirmeli bir sistem her şeyi insanın belirlemesine izin verir. Karma girişim sistemleri her ikisini dengeler.

Pratikte en iyi IML sistemleri şunları bir araya getirir:
- **Makine girişimi:** "Bu örneklerden emin değilim — etiketleyebilir misiniz?"
- **İnsan girişimi:** "Modelin bu kategori konusunda sürekli hata yaptığını fark ediyorum — daha fazla örnek sağlayayım"
- **Onaylama:** Model mevcut anlayışını ortaya koyar; insan onaylar ya da düzeltir

İyi IML arayüzleri, modelin mevcut anlayışını görünür ve düzeltilebilir kılar. Bu, **anlaşılırlık** gerekliliğidir: insanlar yalnızca en azından kabaca anladıkları bir modele rehberlik edebilir.

---

## IML'deki İnsan Faktörleri

IML, bilişsel yük, yorgunluk, tutarlılık ve güven gibi insan faktörlerini doğrudan öğrenme döngüsüne taşır. Kötü IML tasarımı şunlara yol açar:

**Açıklama yorgunluğu:** İnsanların oturumlar uzadıkça daha hızlı ve daha özensiz kararlar alması. Eğitim verilerine giren hatalar.

**Çapalama önyargısı:** İnsanların modelin mevcut önerilerine aşırı güvenmesi. Bir arayüz modelin tahminini önceden doldurursa, yanlış olduğunda bile açıklayıcıların düzeltme olasılığı azalır — bu, açıklama turları arasında birikerek güçlenen sistematik bir etiket gürültüsü kaynağıdır {cite}`geva2019annotator`. Ön açıklama verimi artırabilir {cite}`lingren2014evaluating` ve aynı zamanda açıklayıcıların model hatalarını yakalama oranını düşürebilir; bu iki etki IML arayüz tasarımında birbirlerine karşı tartılmalıdır.

**Güven uyumsuzluğu:** İnsanlar ya gereğinden fazla güvenir (yanlış model çıktılarını kabul eder) ya da gereğinden az güvenir (doğru önerileri görmezden gelir). Her iki örüntü de insan–model işbirliğinin değerini düşürür.

**Oturum tutarlılığı:** İnsanlar, özellikle uzun oturumların ardından, aynı örnek üzerinde farklı zamanlarda farklı kararlar verebilir. Tutarlılık kontrolleri (önceki örnekleri yeniden sunmak) bunu tespit edip düzeltebilir.

İyi IML tasarımı bu sorunları arayüz seçimleriyle azaltır: model güvenini açıkça sunmak, görüntüleme sırasını rastgele belirlemek, oturum süresini sınırlamak ve tutarlılık kontrolleri yerleştirmek.

---

## Pratikte IML Geri Bildirim Türleri

### Örnek Düzeyinde Geri Bildirim

İnsan, belirli bir örnek için bir etiket veya düzeltme sağlar. Bu en yaygın biçimdir ve denetimli öğrenmeyle doğrudan uyumludur.

### Özellik Düzeyinde Geri Bildirim

İnsan hangi özelliklerin ilgili ya da ilgisiz olduğunu belirtir. "Model bu kategori için 'acil' ve 'son teslim tarihi' sözcüklerine dikkat etmeli." Bu, örnek düzeyinde geri bildirimden daha ifadeli ve belirli görevler için daha verimli olabilir.

**TFIDF Etkileşimli** ve benzer sistemler, açıklayıcıların metin belgelerindeki ilgili sözcükleri vurgulamasına olanak tanır. Bu vurgulamalar, modelin dikkatine yönelik kısıtlamalara veya ek denetime dönüştürülür.

### Model Düzeyinde Geri Bildirim

İnsan, modelin bir girdi sınıfındaki davranışını doğrudan düzeltir: "[X] içerdiğinde çıktı [Y] olmalı." Bu, Arka Plan Düzenlemesi {cite}`ganchev2010posterior` veya kısıt güdümlü öğrenme gibi yaklaşımlarda mantık kurallarına veya kısıtlamalara eşlenir.

---

## Vaka Çalışması: Google Teachable Machine

Teachable Machine, teknik olmayan kullanıcıların tarayıcıda görüntü sınıflandırıcıları eğitmesine olanak tanıyan erişilebilir bir web tabanlı IML sistemidir. Kullanıcı:

1. Web kamerasını kullanarak her sınıf için örnekler kaydeder
2. Tek tıklamayla modeli eğitir (tarayıcıda bir MobileNet ince ayarı)
3. Model tahminlerini canlı videoda anında görür
4. Modelin hatalı olduğu sınıflar için daha fazla örnek ekler

Bu, temel IML döngüsünü örnekler: örnek sağla → modeli gözlemle → başarısızlığı tespit et → daha hedefli örnekler sağla. Gerçek zamanlı geri bildirim (model çıktıları gerçek zamanlı, modern donanımda genellikle etkileşimli kare hızlarında güncellenir), karşılıklı uyum döngüsünü somut biçimde hissettiren bir anlıklık yaratır.

---

## Basit Bir IML Döngüsünün Uygulanması

```{code-cell} python
import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

class SimpleIMLSystem:
    """
    Minimal IML system that allows online feedback and displays
    model state after each annotation.
    """

    def __init__(self, n_features=10, n_classes=2):
        self.model = SGDClassifier(loss='log_loss', max_iter=1, warm_start=True,
                                   random_state=42)
        self.scaler = StandardScaler()
        self.X_seen = []
        self.y_seen = []
        self.n_classes = n_classes
        self.initialized = False

    def update(self, x, y_true):
        """Receive a single labeled example and update the model."""
        self.X_seen.append(x)
        self.y_seen.append(y_true)

        if len(self.X_seen) >= 2 * self.n_classes:
            X_arr = np.array(self.X_seen)
            y_arr = np.array(self.y_seen)
            X_scaled = self.scaler.fit_transform(X_arr)
            self.model.partial_fit(X_scaled[-1:], y_arr[-1:],
                                   classes=list(range(self.n_classes)))
            self.initialized = True

        return self

    def predict_with_confidence(self, x):
        """Predict label and return confidence."""
        if not self.initialized:
            return None, 0.0
        x_scaled = self.scaler.transform(x.reshape(1, -1))
        probs = self.model.predict_proba(x_scaled)[0]
        return self.model.predict(x_scaled)[0], probs.max()

    def current_accuracy(self, X_val, y_val):
        if not self.initialized:
            return None
        X_scaled = self.scaler.transform(X_val)
        return (self.model.predict(X_scaled) == y_val).mean()


# Simulate an IML session
rng = np.random.default_rng(42)
X_all, y_all = np.random.default_rng(0).random((500, 10)), np.random.default_rng(0).integers(0,2,500)
X_val, y_val = X_all[400:], y_all[400:]

system = SimpleIMLSystem(n_features=10, n_classes=2)
accs, confidences = [], []

print("Step | Labels | Accuracy | Example confidence")
print("-" * 50)

for step in range(100):
    x, y = X_all[step], y_all[step]
    pred, conf = system.predict_with_confidence(x)
    system.update(x, y)

    if (step + 1) % 10 == 0:
        acc = system.current_accuracy(X_val, y_val)
        if acc is not None:
            accs.append(acc)
            print(f"  {step+1:3d} |  {step+1:4d}  |  {acc:.3f}   | {conf:.3f}")
```

---

## Büyükanne Testi

IML arayüz tasarımını — ve daha genel olarak HITL sistem tasarımını — değerlendirmek için yararlı bir sezgisel yönteme **Büyükanne Testi** adını veriyoruz (bu kavram burada özgün bir tasarım kısıtı olarak ortaya atılmaktadır; önceki çalışmalara bir atıf değildir):

> *1930 doğumlu bir kadın bu cihazı sesle kullanabilmeli ve hayal kırıklığına uğradığında klavye veya metin arayüzüne sorunsuz biçimde geçebilmelidir.*

Test öncelikle erişilebilirlikle ilgili değildir — her ne kadar o da olsa. **Dirençli tasarım** üzerinedir. Bir sistem, etkili biçimde kullanılabilmesi için sinir ağları, eğitim döngüleri veya olasılık dağılımlarına ilişkin zihinsel bir model gerektiriyorsa, Büyükanne Testini başaramamış demektir. Döngüdeki insan, döngünün makine tarafını anlamadan da katılabilmelidir.

IML tasarımına yönelik çıkarımlar somuttur:

**Ses öncelikli yedekleme:** Birincil etkileşim kipi doğal dil veya jest olmalıdır — parametre kaydırıcıları ya da güven eşikleri değil. Uzmanlar kaydırıcı isteyebilir; herkes "bu yanlış" diyebilmelidir.

**Zarif bozulma:** Kullanıcının tercih ettiği kip başarısız olduğunda veya hayal kırıklığı yarattığında, sistem boş bir ekran veya hata iletisi değil, bir alternatif sunmalıdır. Arayüz öğrenme sisteminin bir parçasıdır; etkileşim kuramayan bir kullanıcı öğretemez.

**Anlaşılır model durumu:** Modelin mevcut anlayışı insan dilinde görünür olmalıdır. "Güven: 0,73" değil; "Bunun [X] olduğundan oldukça eminim, ancak bu türden örneklerin her iki yöne de gittiğini gördüm." Belirsizlik, düzeltmeyi davet eden bir dilde iletilmelidir.

**Belirsizliğe tolerans:** 93 yaşındaki bir kullanıcı ile 23 yaşındaki bir makine öğrenmesi mühendisi aynı sistemle farklı biçimlerde etkileşim kuracaktır. Büyükanne Testi, sistemin her ikisine de uyum sağlayıp sağlayamadığını sorar — kullanıcının yaşını tespit ederek değil, geniş bir uzmanlık ve rahatlık yelpazesinde işe yarayan etkileşimler tasarlayarak.

Test, makine öğrenmesi sistemleri araştırma araçlarından gündelik altyapıya taşındıkça özel bir önem kazanır. Radyologlar tarafından kullanılan bir tıbbi görüntüleme asistanı, kâtipler tarafından kullanılan bir hukuki belge sınıflandırıcısı, öğretmenler tarafından kullanılan bir eğitimsel geri bildirim sistemi — her biri AI eğitmeni olmak için başvurmamış döngüde insanları içerir. Onlar için tasarım yapmak bir taviz değildir; asıl amacın ta kendisidir.

:::{admonition} Tasarım İlkesi
:class: tip
Büyükanne Testi bir hedef demografi değil, bir tasarım kısıtıdır. Bu testi geçen sistemler, kullanıcı çeşitliliğine karşı daha dayanıklı, uzmanlık boşluklarına karşı daha hoşgörülü ve döngüdeki insanlardan neler beklediği konusunda daha dürüsttür. Bir sistem kullanımdan önce açıklama gerektiriyorsa, insandan ek çaba istiyor demektir. Bu çabanın orantılı bir fayda sağlaması gerekir.
:::

---

## IML ve Temel Modeller

Modern IML giderek artan biçimde **önceden eğitilmiş temel modelleri** {cite}`bommasani2021opportunities` temel olarak kullanmaktadır. Sıfırdan eğitmek yerine kullanıcılar, az sayıda etkileşimli örnekle büyük bir önceden eğitilmiş modeli ince ayar yapar. Bu, yararlı performansa ulaşmak için gereken örnek sayısını önemli ölçüde azaltabilir — önceden eğitilmiş temsillerin hedef görevle ne kadar örtüştüğüne bağlı olarak, elverişli durumlarda binler yerine yalnızca 5–50 örnek yeterli olabilir {cite}`bommasani2021opportunities`.

Bunu sağlayan teknikler şunlardır:
- **Az atışlı yönlendirme:** Örnekleri büyük dil modelinin bağlam penceresinde sağlama
- **Adaptör ince ayarı:** Taban modeli dondurarak küçük adaptör modülleri güncelleme
- **Parametreden Verimli İnce Ayar (PEFT):** Hızlı, düşük kaynaklı güncellemelere olanak tanıyan LoRA, önek ayarı ve benzeri yöntemler

Temel modeller IML dinamiğini değiştirir: insanlar artık boş bir modeli sıfırdan eğitmek yerine zaten çok şey bilen bir modeli *yönlendirmektedir*. Zorluk "yeterli örnek nasıl sağlanır"dan "modelin zaten yaptıklarından tam olarak ne farklı istiyoruz"a kayar.

```{seealso}
{cite}`amershi2014power` araştırması, IML ilkelerinin en iyi genel değerlendirmesi olmaya devam etmektedir. Karma girişim sistemleri için bkz. {cite}`allen1999mixed`. Açıklamada çapalama etkileri için bkz. {cite}`geva2019annotator` ve {cite}`lingren2014evaluating`.
```
