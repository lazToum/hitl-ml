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

# Bilgisayarlı Görüde Döngüde İnsan

Bilgisayarlı görü, HITL ML'nin en görsel açıdan sezgisel örneklerini sunar. 14 milyon insan etiketli görüntü üzerine inşa edilen ImageNet meydan okuması, derin öğrenme çağını başlattı. Radyologların tıbbi görüntü açıklamaları tanı yapay zekasını besliyor. Otonom araçlar, dünyayı algılamayı öğrenmek için milyonlarca insan etiketli kareye bağımlı.

Kolayca gözden kaçırılan şu dur: bunlar yalnızca insanların gerçek zemini sağladığı durumlar değildir. İnsanların belirli algısal, kültürel ve operasyonel seçimler içeren veri kümeleri inşa ettiği durumlardır — modeller öngörülebilir biçimlerde başarısız olduğunda ancak o zaman görünür hâle gelen seçimler.

---

## Açıklama Seçimleri Model Önyargılarına Nasıl Dönüşür?

Standart çerçeveleme, açıklamayı veri toplama olarak ele alır: insanlar dünyayı gözlemleyip gördüklerini kaydeder. Daha doğru bir çerçeveleme, açıklamanın *veri kümesi tasarımı* olduğudur: insanlar hangi kategorilerin kullanılacağına, sınırların nerede çekileceğine, hangi sınır vakaların dahil edileceğine ve belirsizliğin nasıl çözüleceğine karar verir — ve tüm bu kararlar eğitilen modelin algılayacaklarını şekillendirir.

### ImageNet Vakası

ImageNet {cite}`russakovsky2015imagenet`, bilgisayarlı görü tarihinin en sonuçlu veri kümesidir. Etiket kümesi, öncelikle çok sayıda ve anlamsal olarak ayırt edici oldukları gerekçesiyle seçilen WordNet eşanlamlı kümelerinden türetilmiştir. Bu tasarım seçiminin birkaç sonucu yıllar sonra ortaya çıktı:

- **Kişi kategorileri demografik ilişkilendirmeleri kodladı.** ImageNet'in kişilere yönelik eşanlamlı küme etiketlerinin erken versiyonları artık aşağılayıcı veya önyargılı kabul edilen pek çok etiketi içeriyordu; hem tarihsel WordNet kaynağını hem de hangi etiketlerin hangi görüntülere uygulanacağına ilişkin açıklama işgücünün örtük kararlarını yansıtıyordu {cite}`yang2020towards`. İnsanların görüntülerine uygulanan etiketler, doğrudan model gömmelerine yayılan ırk, cinsiyet ve sınıf ilişkilendirmelerini kodladı.

- **İnce taneli tür taksonomisi, neredeyse her şey için kaba taneli bir taksonomi.** ImageNet 120 köpek ırkını ayırt edebilir, ancak araçlar, taşıtlar, yiyecekler ve mobilyalardaki devasa farklılığı tek kategorilere indirger. Bu, neyin önemli olduğuna ilişkin kasıtlı bir seçimin değil, WordNet yapısını izlemenin bir sonucuydu. ImageNet üzerinde eğitilen modeller aynı asimetrik kesinliği sergiler.

- **Batılı, İngilizce konuşan görsel varsayılanlar.** Görüntüler öncelikle Flickr'dan ve İngilizce arama sorguları kullanılarak İnternet aramalarından toplandı. Ortaya çıkan dağılım, zengin, İngilizce konuşan ülkelerin görsel ortamına ve kültürel nesnelerine güçlü biçimde yönelmiştir.

Bunların hiçbiri hata değildi. Bunlar, veri kümesinin nasıl kullanılacağını öngöremeyen insanlar tarafından hızlı ve ölçekli biçimde alınan açıklama tasarım kararlarıydı. Ders, ImageNet'in farklı inşa edilmesi gerektiği değildir (her ne kadar gerekliydi) — **açıklama tasarımı model tasarımıdır** ve aynı özenle ele alınmalıdır.

:::{admonition} Açıklama şeması bir dünya teorisidir
:class: note

Her etiket taksonomisi, hangi ayrımların önemli olduğu hakkında iddialar içerir. "Araç"ı "kamyon"dan ayırırken tüm sedan türlerini tek bir sınıfta toplamak, hangi ayrımların anlamsal olarak ilgili olduğu hakkında teorik bir iddiadır. Poz, giyim veya faaliyetten bağımsız olarak "kişi"yi tek bir sınıf olarak etiketlemeye karar vermek, farklı bir teorik iddiadır. Bu şemalar üzerinde eğitilen modeller aynı ayrımları yapacak, bunun ötesine geçemeyecektir — eğitildikleri kategorilerin ötesine genelleşemeyeceklerdir.
:::

---

## Görüntü Sınıflandırması Açıklaması

En basit bilgisayarlı görü açıklama görevi, tüm görüntüye bir veya birden fazla etiket atamaktır.

**Etiket hiyerarşisi.** "Köpek" etiketi anlamsal bir hiyerarşide "hayvan"ın altında yer alır. Düz taksonomilerle eğitilen modeller, soyutlama düzeyleri genelinde iyi genelleşmeyebilir. ImageNet, birden fazla özgüllük düzeyinde değerlendirmeye olanak tanıyan eşanlamlı küme tabanlı bir hiyerarşi kullanır.

**Çok etiketli belirsizlik.** Bir sokak sahnesi aynı anda bir araba, bir insan, bir bisiklet ve bir trafik ışığı içerebilir. Hangi etiketlerin dahil edileceğine karar vermek, ilgi eşiklerine ilişkin açık kılavuzlar gerektirir.

**Uzun kuyruk dağılımları.** Doğal görüntü veri kümeleri kuvvet yasasını izler: birkaç kategori son derece yaygın; çoğu nadirdir. Aktif öğrenme, rastgele örneklemenin yalnızca bir avuç örnek vereceği uzun kuyruk kategorileri için özellikle değerlidir.

---

## Nesne Algılama: Sınır Kutusu Açıklaması

Nesne algılama, açıklayıcıların her nesne sınıfının örneklerinin etrafına eksen hizalı sınır kutuları çizmesini gerektirir. Bu durum, geometrik hassasiyet gereklilikleri ve önemli sınır vakalar getirir.

**Açıklama kalitesi ölçütleri:**

*IoU (Kesişim / Birleşim)*, açıklamalı kutu ile referans kutu arasındaki örtüşmeyi ölçer:

$$
\text{IoU}(A, B) = \frac{|A \cap B|}{|A \cup B|}
$$

$\text{IoU} \geq 0{,}5$, PASCAL VOC'ta "doğru" algılama için standart eşiktir; COCO {cite}`lin2014microsoft` ise 0,5'ten 0,95'e uzanan ve çok daha zorlu ve daha bilgilendirici olan bir eşik aralığı kullanır.

**Kılavuzlarda ele alınması gereken açıklama sınır vakaları:**
- Kapalı nesneler: görünür kısmı açıkla mı yoksa tam uzantıyı tahmin et mi?
- Kesik nesneler (çerçevenin kısmen dışında): dahil et mi yoksa dışarıda bırak mı?
- Kalabalık bölgeler: özel bir "kalabalık" açıklaması kullan mı yoksa tekil örnekleri açıkla mı?

Bu kararların her biri "doğru algılamanın" ne anlama geldiğini değiştirir — ve dolayısıyla modelin eğitildiği şeyi değiştirir.

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def compute_iou(boxA, boxB):
    """Compute IoU between two boxes [x1, y1, x2, y2]."""
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    inter_area = max(0, xB - xA) * max(0, yB - yA)
    boxA_area = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxB_area = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
    union_area = boxA_area + boxB_area - inter_area
    return inter_area / (union_area + 1e-6)

ref_box  = [1.0, 1.0, 4.0, 4.0]
ann1_box = [1.1, 0.9, 4.1, 4.2]   # close
ann2_box = [0.5, 0.5, 3.5, 3.8]   # less precise

print(f"IoU (ann1 vs ref):  {compute_iou(ann1_box, ref_box):.3f}")
print(f"IoU (ann2 vs ref):  {compute_iou(ann2_box, ref_box):.3f}")
print(f"IoU (ann1 vs ann2): {compute_iou(ann1_box, ann2_box):.3f}")

fig, ax = plt.subplots(figsize=(5, 5))
ax.set_xlim(0, 5); ax.set_ylim(0, 5); ax.set_aspect('equal')
ax.add_patch(patches.Rectangle(
    (ref_box[0], ref_box[1]), ref_box[2]-ref_box[0], ref_box[3]-ref_box[1],
    linewidth=2.5, edgecolor='#2b3a8f', facecolor='none', label='Reference'))
ax.add_patch(patches.Rectangle(
    (ann1_box[0], ann1_box[1]), ann1_box[2]-ann1_box[0], ann1_box[3]-ann1_box[1],
    linewidth=2, edgecolor='#0d9e8e', facecolor='none', linestyle='--',
    label=f'Ann1 (IoU={compute_iou(ann1_box, ref_box):.2f})'))
ax.add_patch(patches.Rectangle(
    (ann2_box[0], ann2_box[1]), ann2_box[2]-ann2_box[0], ann2_box[3]-ann2_box[1],
    linewidth=2, edgecolor='#e05c5c', facecolor='none', linestyle=':',
    label=f'Ann2 (IoU={compute_iou(ann2_box, ref_box):.2f})'))
ax.legend(fontsize=10)
ax.set_title("Bounding Box Agreement (IoU)", fontsize=12)
plt.tight_layout()
plt.savefig('bbox_iou.png', dpi=150)
plt.show()
```

---

## Anlamsal ve Örnek Segmentasyonu

Segmentasyon açıklaması, bir görüntüdeki her piksele sınıf etiketi atamayı gerektirir — en pahalı açıklama türlerinden biridir.

**Anlamsal segmentasyon:** Her piksel bir anlamsal sınıfa (yol, gökyüzü, kişi, araba) aittir. Aynı sınıfın tüm pikselleri, hangi tekil nesneye ait olduklarından bağımsız olarak aynı etiketi paylaşır.

**Örnek segmentasyonu:** Her tekil nesne örneği benzersiz bir etiket alır. 20 kişilik bir kalabalık, 20 ayrı maskeye dönüşür.

**Panoramik segmentasyon:** Her ikisini birleştirir: "şey" sınıfları (sayılabilir nesneler) örnek maskelere sahiptir; "şey" sınıfları (yol, gökyüzü) anlamsal maskelere sahiptir.

**SAM destekli açıklama:** Meta'nın Segment Anything Modeli {cite}`kirillov2023segment`, tek bir nokta tıklamasından yüksek kaliteli segmentasyon maskeleri üretir. Açıklayıcılar bir nesnenin merkezine tıklar; SAM bir maske önerir; açıklayıcı kabul eder ya da düzeltir. SAM yazarları, poligon tabanlı etiketlemeye kıyasla yaklaşık 6,5 kat hız kazanımı bildirmektedir; kazanımlar sahne türleri ve açıklama araçlarına göre değişmektedir.

SAM daha geniş bir dönüşümü temsil etmektedir: **açıklayıcının rolü çizmekten incelemeye geçmektedir**. Bunun hız ötesinde açıklama kalitesi üzerinde etkileri vardır. Açıklayıcılar çizdiğinde, dikkatleri süreç boyunca odaklanmış olur. Açıklayıcılar inceleyip "kabul et"e tıkladığında, hataları daha kolay kaçırdıklarına dair kanıtlar mevcuttur — açıklama bağlamına özgü bir otomasyon önyargısı türü.

---

## Bilgisayarlı Görü için Aktif Öğrenme

Aktif öğrenme bilgisayarlı görü için özellikle değerlidir; çünkü:
1. Görüntüler yüksek boyutlu ve zengin özelliklere sahiptir — önceden eğitilmiş modellerden elde edilen gömmeler, belirsizlik tahmini için güçlü sinyaller taşır
2. Büyük etiketsiz havuzlar ucuzdur (fotoğraflar, video kareleri)
3. Açıklama (özellikle segmentasyon) pahalıdır ve özel alanlar için kolayca kitle kaynaklı yapılamaz

```{code-cell} python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

X, y = make_classification(n_samples=3000, n_features=50, n_informative=25,
                            n_classes=5, n_clusters_per_class=2, random_state=42)
X_train, y_train = X[:2500], y[:2500]
X_test,  y_test  = X[2500:], y[2500:]

def margin_uncertainty(model, X_pool):
    probs = model.predict_proba(X_pool)
    sorted_p = np.sort(probs, axis=1)
    return sorted_p[:, -2] - sorted_p[:, -1]  # most negative = most uncertain

n_init = 50
results = {'active': [], 'random': []}
label_counts = list(range(50, 401, 30))

for strategy in ['active', 'random']:
    labeled = list(rng.choice(len(X_train), n_init, replace=False))
    unlabeled = [i for i in range(len(X_train)) if i not in labeled]

    for target in label_counts:
        while len(labeled) < target and unlabeled:
            if strategy == 'active' and len(labeled) >= 10:
                model_temp = LogisticRegression(max_iter=300).fit(
                    X_train[labeled], y_train[labeled])
                margins = margin_uncertainty(model_temp, X_train[unlabeled])
                idx = int(np.argmin(margins))
            else:
                idx = rng.integers(0, len(unlabeled))
            labeled.append(unlabeled.pop(idx))

        clf = LogisticRegression(max_iter=300).fit(X_train[labeled], y_train[labeled])
        results[strategy].append(accuracy_score(y_test, clf.predict(X_test)))

plt.figure(figsize=(7, 4))
plt.plot(label_counts, results['active'], 'o-', color='#2b3a8f',
         linewidth=2, label='Active (margin sampling)')
plt.plot(label_counts, results['random'], 's--', color='#e05c5c',
         linewidth=2, label='Random baseline')
plt.xlabel("Labeled training images", fontsize=12)
plt.ylabel("Test accuracy", fontsize=12)
plt.title("Active Learning for 5-Class Image Classification", fontsize=13)
plt.legend(fontsize=11); plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('cv_active_learning.png', dpi=150)
plt.show()
```

---

## İnsan Rehberliğiyle Yarı Denetimli Öğrenme

Mevcut etiketsiz görsel verinin büyük miktarı, yarı denetimli öğrenmeyi bilgisayarlı görü için özellikle cazip kılar.

**Öz eğitim / sözde etiketleme:** Etiketli veri üzerinde bir model eğit; etiketsiz veri üzerinde yüksek güvenilirlikli tahminleri sözde etiket olarak kullan; yeniden eğit. Kritik tasarım sorusu güven eşiğidir. Düşük eşik daha fazla örnek getirir ancak gürültü ekler; yüksek eşik etiketsiz havuzun büyük bölümünü kullanılmaz bırakır. İnsan katılımı bu eşiğe rehberlik edebilir — açıklayıcılar sözde etiketlenmiş örneklerin bir örneklemini kalibre etmek için gözden geçirir.

**FixMatch ve tutarlılık düzenleme:** Bu yöntemler, modelleri büyütme altında tutarlı tahminler üretecek şekilde eğitir. Temel HITL kavrayışı: insanlar yalnızca etiketler için değil, **büyütme tasarımı** için de danışılır — model hangi değişmezlikleri öğrenmeli? Tıbbi görüntüleme modeli döndürme ve parlaklığa karşı değişmez olmalı, ancak ölçeğe karşı değil; metin algılama modeli perspektif bozulmasına karşı değişmez hâle getirilmemelidir. Bu alana özgü seçimler insan uzmanlığı gerektirir ve yanlış yapılmaları yarı denetimli öğrenmeyi önemli ölçüde bozar.

**Etkin yarı denetimli öğrenme:** En verimli kombinasyon: aktif öğrenme, insan etiketlerini model belirsizliğinin en yüksek olduğu yerlere yoğunlaştırır; öz eğitim yüksek güvenilirlikli kuyruğu otomatik olarak etiketler. İnsan çabası en değerli olduğu yere yoğunlaşır; model geri kalanı üzerinde önyükleme yapar. Her döngüde, sözde etiketlerin rastgele bir örnekleminin insan denetimi, tam inceleme gerektirmeden kalite kontrolü sağlar.

---

## Video Açıklaması

Video açıklaması, görüntü açıklamasının güçlüklerini zamanla çarpar:

- **İzleme:** Nesneler kareler arasında belirlenmelidir. Açıklayıcılar anahtar kareleri etiketler; izleme algoritmaları aralarını doldurur. İzleme başarısızlıkları — kapanma, yeniden giriş, hızlı hareket — sabit durum izlemesinden daha yüksek oranda insan yeniden etiketleme gerektirir.
- **Zamansal tutarlılık:** $t$ karesinde çizilen sınırlar, $t+1$ karedekiyle mekânsal olarak tutarlı olmalıdır. Tutarsız açıklamalar, modele nesnelerin süreksiz biçimde atladığını söyleyen bir eğitim sinyalidir — algılama modelleri için özellikle zararlı bir açıklama gürültüsü biçimi.
- **Ölçeklenebilirlik:** 30 fps'de 1 saatlik video 108.000 karedir. Tam açıklama pratik değildir; örnekleme stratejilerinin, nadir olayların (sınır vakaları, ramak kalmalar, başarısızlık senaryoları) sistematik biçimde dışlanmamasını sağlayacak şekilde dikkatle tasarlanması gerekir.

Modern video açıklama araçları, açıklamaları kareler arasında yayan ve izleme güvenilirliğinin eşiğin altına düştüğü kareleri işaretleyen **akıllı izleme** desteği sunar; bu da açıklayıcıyı yeniden kontrol etmeye davet eder. Bu, aktif öğrenme fikrini açıklama hattının kendisine doğrudan uygulamaktır: araç, tam olarak enterpolasyonunun belirsiz olduğu yerlerde açıklayıcıyı sorgular.

**Otonom sistemlerde nadir olay problemi.** Nadir olayların sonuçlarının felakete yol açabileceği uygulamalarda — otonom sürüş, insansız hava aracı navigasyonu — normal çalışmada görülen karelerin dağılımı, gerçekten önemli olan karelerin dağılımıyla ciddi biçimde uyumsuz olur. Normal sürüş görüntüsünün tek tip örneklemesiyle oluşturulan bir veri kümesi, milyonlarca "ilgi çekici bir şey olmuyor" karesi ve güvenlik açısından gerçekten önemli olan yakın kaza, alışılmadık aydınlatma ve bozulmuş sensör karelerinden yalnızca bir avuç içerecektir. Bu tür kareleri belirleyip önceliklendiren HITL aktif öğrenmesi bir verimlilik hilesi değildir — bir güvenlik gerekliliğidir.

```{seealso}
ImageNet veri kümesi: {cite}`russakovsky2015imagenet`. ImageNet'teki etiket önyargısı: {cite}`yang2020towards`. COCO kıyaslaması: {cite}`lin2014microsoft`. SAM (Segment Anything): {cite}`kirillov2023segment`. Bilgisayarlı görü için çekirdek küme aktif öğrenmesi: {cite}`sener2018active`.
```
