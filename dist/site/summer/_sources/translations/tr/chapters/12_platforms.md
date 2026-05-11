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

# Açıklama Platformları ve Araçlar

Açıklama platformu, insan geri bildiriminin veriye dönüştüğü ortamdır. İyi bir platform verimi artırır, hataları azaltır, kalite kontrollerini sürdürür ve açıklama hattını ölçekte yönetilebilir kılar. Doğru platformu seçmek — ve ne zaman satın alınacağını ne zaman inşa edileceğini bilmek — herhangi bir HITL projesinde sonuçlu bir karardır.

---

## Açıklama Platformu Manzarası

Açıklama araçları pazarı, kurumsal makine öğrenmesi eğitimi verisi talebinden beslenerek son yıllarda önemli ölçüde büyümüş ve olgunlaşmıştır. Araçlar, tamamen yönetilen hizmetlerden açık kaynaklı kendi barındırmalı çerçevelere kadar geniş bir yelpazeye yayılmaktadır.

### Açık Kaynaklı Platformlar

**Label Studio**, metin, görüntü, ses, video ve zaman serisi verilerini birleşik bir XML tabanlı görev yapılandırması aracılığıyla destekleyen en popüler açık kaynaklı açıklama platformudur. Kendi barındırmalı olarak kullanılabilir ve aktif öğrenme için makine öğrenmesi arka uçlarıyla entegre olur. Temel güçleri: esneklik, topluluk desteği ve ön açıklama için özel makine öğrenmesi tahminlerini yerleştirme olanağı.

**Prodigy** (spaCy yapıcılarından), doğal dil işleme görevleri için tasarlanmış yüksek derecede iş akışı odaklı bir açıklama aracıdır. Akış mimarisi örnekleri teker teker gönderir ve aktif öğrenmeyi doğrudan destekler. Açıklama arayüzü minimal ancak hızlıdır — açıklama verimini en üst düzeye çıkaracak biçimde tasarlanmıştır. Prodigy ücretli yazılımdır ancak doğal dil işleme araştırmalarında yaygın biçimde kullanılmaktadır.

**CVAT (Bilgisayarlı Görü Açıklama Aracı)**, algılama, segmentasyon ve video açıklamasına güçlü destek sunan bilgisayarlı görü açıklaması için önde gelen açık kaynaklı araçtır. Başlangıçta Intel'de geliştirilen CVAT, izleme algoritmaları, iskelet açıklaması ve üçüncü taraf algoritma entegrasyonlarını destekler.

**Doccano**, dizi etiketleme görevlerini (Adlandırılmış Varlık Tanıma, ilişki çıkarımı, metin sınıflandırması) hedef alır. Basit web arayüzü, özel veri mühendisliği kaynakları olmayan ekipler için erişilebilir kılar.

### Ticari Platformlar

**Scale AI**, insan işgücü, kalite yönetimi ve API entegrasyonunu kapsayan uçtan uca yönetilen açıklama hizmetleri sunar. Özellikle otonom sürüş, robotik ve karmaşık 3B açıklama için güçlüdür. Fiyatlandırma, görev karmaşıklığı ve hacme göre belirlenir.

**Labelbox**, veri kürasyon, açıklama ve makine öğrenmesi destekli etiketleme için tam bir platformdur. Güçlü kurumsal özellikler sunar: proje yönetimi, kalite iş akışları, model geri bildirim döngüleri ve başlıca makine öğrenmesi platformlarıyla entegrasyonlar (SageMaker, Vertex AI, Azure ML).

**Appen** (eski adıyla Figure Eight / CrowdFlower), araçların yanı sıra büyük bir küresel açıklama işgücü yönetir. Hacim ve işgücü yönetiminin birincil kaygılar olduğu durumlarda iyi bir seçimdir.

**Surge AI**, uzman açıklayıcılara odaklanmakta ve alan bilgisi veya nüanslı yargı gerektiren görevler için güçlüdür.

**Humanloop**, BDM geri bildirim toplama — tercih açıklaması, RLHF veri toplama ve model değerlendirme — konusunda uzmanlaşmıştır.

---

## Açıklama Platformu Özellik Karşılaştırması

| Özellik | Label Studio | Prodigy | CVAT | Labelbox | Scale AI |
|---|---|---|---|---|---|
| Lisans | Açık kaynak | Ticari | Açık kaynak | Ticari | Ticari |
| Barındırma | Kendi / bulut | Kendi | Kendi / bulut | Bulut | Yönetilen |
| Metin açıklama | ✓ | ✓ | — | ✓ | ✓ |
| Görüntü açıklama | ✓ | Sınırlı | ✓ | ✓ | ✓ |
| Video açıklama | ✓ | — | ✓ | ✓ | ✓ |
| Aktif öğrenme entegrasyonu | ✓ | ✓ | Sınırlı | ✓ | ✓ |
| MÖ destekli ön açıklama | ✓ | ✓ | ✓ | ✓ | ✓ |
| Kalite kontrol iş akışları | Temel | Temel | Temel | Gelişmiş | Gelişmiş |
| API / Programatik erişim | ✓ | ✓ | ✓ | ✓ | ✓ |
| İşgücü yönetimi | — | — | — | Sınırlı | ✓ |

---

## Kod Olarak Açıklama

Açıklama altyapısının kritik ancak çoğunlukla göz ardı edilen bir boyutu, **açıklamalar ve açıklama şemaları için sürüm kontrolüdür**. Açıklamayı kod olarak ele almak şu anlama gelir:

**Şema öncelikli tasarım.** Etiket taksonomisi ve açıklama kuralları, açıklama başlamadan önce sürümlü bir yapılandırma dosyasında (YAML veya JSON) tanımlanır. Şema değişiklikleri yeni bir sürüm oluşturur.

**Açıklama sürümlendirme.** Açıklamalar, oluşturuldukları şema sürümüne bağlantıyla depolanır. Bu, denetlemeye, geri almaya ve şema sürümleri arasında açıklamaları karşılaştırmaya olanak tanır.

**Yeniden üretilebilir hatlar.** Ham veriden eğitime hazır etiketlere uzanan açıklama hattı koddan yeniden üretilebilir olmalıdır. Ön açıklama modelleri, kalite filtreleri, birleştirme mantığı ve veri bölümleri hepsi kaydedilmelidir.

```yaml
# Example: Label Studio annotation schema (text classification)
label_config: |
  <View>
    <Text name="text" value="$text"/>
    <Choices name="sentiment" toName="text" choice="single">
      <Choice value="positive"/>
      <Choice value="negative"/>
      <Choice value="neutral"/>
      <Choice value="mixed"/>
    </Choices>
  </View>
schema_version: "2.1.0"
task_type: text_classification
guidelines_version: "guidelines_v3.pdf"
```

```text
Veri kaynağı
    |
    v
Etiketsiz havuz -->  Açıklama platformu --> Etiketlenmiş veri kümesi
    ^                    |                         |
    |                    | (MÖ destekli)            v
Aktif öğrenme <----------+                    Eğitim çalıştırması
sorgu stratejisi                                   |
    ^                                              v
    +------------ Eğitilmiş model <---------- Değerlendirme
                                                   |
                                             Dağıtım ve
                                             izleme
```

Temel entegrasyon noktaları:
1. **Veri alımı:** Etiketsiz veri, veri ambarından açıklama platformuna otomatik olarak akar
2. **Model servis:** Mevcut en iyi model, ön açıklama ve aktif öğrenme puanlaması için açıklama platformuna dağıtılır
3. **Dışa aktarma:** Tamamlanan açıklamalar eğitim çerçevesiyle uyumlu bir biçimde dışa aktarılır (COCO JSON, Hugging Face veri kümeleri vb.)
4. **Geri bildirim döngüsü:** Üretimdeki model hataları, düzeltme için açıklama platformuna yönlendirilir

```{seealso}
Label Studio belgeleri ve aktif öğrenme entegrasyonu için: https://labelstud.io. Prodigy için: https://prodi.gy. CVAT için: https://cvat.ai. Açıklama araçlarının kapsamlı karşılaştırması için bkz. {cite}`monarch2021human`, Bölüm 7.
```
