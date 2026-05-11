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

# Vaka Çalışması: Limen — Her Şeyin Döngüsünde Bir İnsan

:::{admonition} Bu bölüm hakkında not
:class: important
Bu bölüm, ampirik bir çalışma veya hakemli bir katkı değil, **spekülatif bir tasarım denemesidir**. Önceki bölümlerdeki HITL ilkelerinin nasıl tutarlı bir bütün oluşturabileceğinin işlenmiş bir örneği olarak tasarlanmış bir sistem mimarisini tanımlar: ses öncelikli yapay zeka yerel masaüstü işletim sistemi Limen. Buradaki iddialar tasarım argümanları olup deneysel sonuçlar değildir. Motive edilmiş tasarım gerekçesi olarak okunmalı; doğrulanmış mühendislik bulguları olarak değil.
:::

Bu el kitabının her bölümü, HITL ML'yi bir tasarım felsefesi olarak tanımlamıştır: öğrenme sistemlerindeki insan katılımını kasıtlı, verimli ve dürüst kılmaya yönelik bir ilkeler bütünü. Bu bölüm, söz konusu felsefenin birinci ilke olarak uygulanmasının nasıl göründüğünü tanımlar — tek bir sisteme değil, tüm bir çalışma ortamına.

**Limen**, insanın her zaman döngüde olduğunu öne süren; bunu uzaklaştırılacak bir kısıt olarak değil, her alt sistemin etrafında tasarlandığı örgütleyici ilke olarak ele alan ses öncelikli, yapay zeka yerel bir masaüstü işletim sistemidir. Ad kasıtlı seçilmiştir: *limen*, eşik anlamına gelen Latince sözcüktür. Algısal psikolojide limen, algılanan ile algılanmayan arasındaki sınırdır. İşletim sistemi için limen, insan niyeti ile makine eylemi arasındaki sınırdır.

Burada tanımlanan mimari tescilli değildir. Önceki bölümlerde geliştirilen HITL ilkelerinden doğal biçimde çıkan bir dizi tasarım kararıdır. Amaç bir ürünü belgelemek değil; bu ilkelerin nasıl bir araya geldiğini — tutarlı biçimde uygulandıklarında birbirlerini nasıl güçlendirdiklerini ve insan merkezi konumda, makine öğrenen ve döngü her zaman açık olduğunda ne tür sistemlerin mümkün hâle geldiğini — göstermektir.

---

## Geleneksel İşletim Sistemi Tasarımıyla Sorun

Geleneksel bir işletim sistemi insanlar için tasarlanmamıştır. Programlar için tasarlanmıştır. İnsan, grafik arayüz, dosya tarayıcısı, terminal gibi — süreçler, bellek adresleri ve dosya tanımlayıcıları için inşa edilmiş bir altyapının üstüne oturtulan bir soyutlama katmanı aracılığıyla barındırılmaktadır.

Bu tasarım seçimi tarihsel olarak gerekçelidir. Onu üreten varsayımlar yapıldığında, bilgisayarlar pahalıydı, insanlar ucuzdu ve darboğaz hesaplamaydı. Doğru optimizasyon hedefi makineydi.

Bu varsayımlar artık geçerli değil. Çoğu kullanıcı için çoğu görevde darboğaz hesaplama değil. İnsan dikkatidir: bağlam geçişinin maliyeti, doğru dosyayı bulma, doğru sorguyu oluşturma, bir şeyin nerede olduğunu hatırlama. Makine hızlıdır. İnsan yavaştır. Arayüz insanın döngü tarafını optimize etmelidir.

Geleneksel işletim sistemleri bunu yapmaz. Programlar için optimize edilmişlerdir ve insanın görevi programların dilini konuşmaktır. Limen bunu tersine çevirir. Programlar insanın dilini konuşur. İnsan döngüdedir ve döngü insana uyacak biçimde tasarlanmıştır.

---

## Eşiğin Mimarisi

Limen'in mimarisi tek bir ilke etrafında örgütlenmiştir: **her etkileşim bir olaydır** ve her olay insanın öğretmesi, düzeltmesi veya onaylaması için bir fırsattır. Sistem açık eğitim oturumlarını beklemez. Öğrenme sürekli ve ortamla iç içedir.

### Olay Katmanı: WID

Temelde **WID** (Waldiez ID sistemi, Limen'in yerel öncelikli mimarisine uyarlanmış) bulunur — yalnızca ne olduğunu değil neyin neden olduğunu ve bunun ne doğurduğunu kaydeden nedensellik farkındalıklı olay izleme sistemi.

Geleneksel günlük tutma şunu sorar: *ne oldu?* WID şunu sorar: *neden oldu ve ardından ne geldi?* Her olay, tetikleyici insan eyleminden ara sistem durumları aracılığıyla gözlemlenen sonuca uzanan nedensel bir soy taşır.

Bu, HITL öğrenmesi açısından önem taşır; çünkü etkileşim düzeyindeki **kredi atama sorununu** çözer. Kullanıcı sistemin davranışını düzelttiğinde, WID yalnızca yanlış olan anlık çıktıyı değil, onu üreten karar zincirini de belirleyebilir. Düzeltmeler doğru soyutlama düzeyinde uygulanabilir: çıktı, karar kuralı veya yukarı akış sinyali.

Bu, işletim sistemi düzeyinde Bölüm 6'nın RLHF için tanımladığıyla aynı eşdeğerdir: bir ödül sinyalini bir dizi karar aracılığıyla izleme yetisi. WID bu izlemeyi yerel olarak, her etkileşim için, kullanıcının bunu anlamasını gerektirmeden sağlar.

:::{admonition} HITL Altyapısı Olarak Nedensel Olay İzleme
:class: note
WID'in tasarımı daha geniş bir ilkeyi yansıtır: HITL altyapısı "sistem neden bunu yaptı?" sorusunu sormayı kolaylaştırmalıdır — yalnızca "ne yaptı?" değil. Nedensel izleme olmadan düzeltmeler semptomları giderir. Bununla birlikte nedenleri giderebilirler. Bir yama ile bir ders arasındaki fark.
:::

### Algı Katmanı: Ses Öncelikli

Limen'in birincil girdi kipi, Whisper ONNX çıkarım hattı kullanılarak yerel olarak işlenen sestir. Bu seçimin gerekçelerini açıkça belirtmeye değer:

**Ses, çoğu insan için en doğal çıktı kanalıdır.** Eğitim, fiziksel beceri veya sistemin iç örgütlenmesine ilişkin bilgi gerektirmez. Bir dizin hiyerarşisinde dosya bulamayan kullanıcı, ne aradığını söyleyebilir.

**Yerel işleme gizliliği korur.** Ses verisi cihazı terk etmez. Bu hem etik açıdan önem taşır — ses biyometrik veridir ve ölçekte bulut sağlayıcılar tarafından toplanması belgelenmiş bir zarardır — hem de pratik açıdan: çevrimdışı çalışma, sistemin ağ bağlantısı olmadan işlevsel kalması anlamına gelir.

**Ses, doğal bir geri bildirim döngüsü oluşturur.** Sistem yanıt verdiğinde, kullanıcının tepkisi — konuşmaya devam etmek, yeniden ifade etmek, "hayır, bu doğru değil" demek — kendisi de bir sinyaldir. Limen bu tepkileri HITL geri bildirimi olarak değerlendirir: önceki söyleminin yorumunun doğru olup olmadığına ilişkin kanıt.

Yedek zinciri, birincil kip kadar önemlidir. Ses başarısız olduğunda — gürültülü bir ortamda, konuşma bozukluğu olan bir kullanıcı için, hassasiyet gerektiren bir girdi için — Limen klavye arayüzüne, ardından yapılandırılmış metin arayüzüne zarifçe geçer. Büyükanne Testi (bkz. Bölüm 5) bir erişilebilirlik düşüncesi değil; birinci sınıf bir mimari kısıttır.

### Zeka Katmanı: Çoklu BDM Yönlendirme

Limen tek bir dil modeline güvenmez. İstekleri görev türüne, gereken gecikmeye, gizlilik gerekliliklerine ve güvene dayalı yapılandırılmış bir karar ağacından geçirerek yönlendirir:

1. **Yerel küçük model** (her zaman önce): hızlı, gizli, rutin görevleri yönetir — "dün düzenlediğim dosyayı aç," "zamanlayıcı kur," "hava durumu nedir"
2. **Yerel büyük model** (küçük model güveni düşük olduğunda): daha yavaş ama daha yetenekli; yapılandırılmış akıl yürütmeyi, kod üretimini, karmaşık almayı yönetir
3. **Uzak model** (yerel başarısız olduğunda ve kullanıcı izin verdiğinde): çıkış kapısı; kullanıcıya açık bildirimle şeffaf biçimde yönetilir

Bu yapı yeni değildir — Bölüm 4'te tanımlanan aktif öğrenme sorgu stratejisinin çıkarım zamanındaki eşdeğeridir. Her adımda sistem şunu sorar: mevcut modelim bu sorguyu kabul edilebilir güvenle yanıtlamak için yeterli mi? Değilse, yükselt. Yükseltme bir maliyettir (gecikme, gizlilik, hesaplama); yalnızca gerektiğinde ödenir.

İnsan, yükseltme sınırında döngüdedir. Limen'i uzak modellere hiçbir zaman yükseltmeyecek şekilde yapılandırmış kullanıcı, bir HITL kararı almıştır — sistemin saygı duyduğu ve kaydettiği bir karar. Uzak bir sorguyu onaylayan ve ardından "bu tür istekler için bir daha sorma" diyen kullanıcı, yönlendirme politikasını güncelleyen bir tercih sağlamıştır.

---

## Etkileşim Tasarımı

### Anlıklık

Limen, Bölüm 5'in tanımladığı anlamda anlıklık için tasarlanmıştır: kullanıcı geri bildiriminin etkisini algılar. Kullanıcı bir sistem çıktısını düzelttiğinde, düzeltme anında ve görünür biçimde uygulanır. Model yirmi dakika eğitim için uzaklaşmaz. Mevcut oturumda güncellenir.

Bu, verimli çevrimiçi güncellemeyi destekleyen model mimarileri gerektirir — tam ince ayar yerine adaptörler, önek ayarı ve geri alma artırımlı üretim. Değiş tokuş açıktır: çevrimiçi güncellemeler toplu eğitimden daha gürültülüdür. Limen bu değiş tokuşu kabul eder; çünkü anlıklık birincil gerekliliktir: insan her zaman güncellemeyi onaylayabilir, reddedebilir veya geliştirebilir.

### Anlaşılırlık

IML literatüründe yinelenen bir tema, **anlaşılırlık gerekliliğidir**: insanlar yalnızca en azından kabaca anladıkları bir modele rehberlik edebilir. Limen bunu arayüzde ortaya koyar: sistem bir karar verdiğinde, neden kısaca açıklar. Tam bir akıl yürütme izi değil — bu çoğu kullanıcıyı bunaltır — ama temel etkenin doğal dil özeti: "En son çalıştığınız projeyi açıyorum — doğru mu?"

Bu açıklama aynı zamanda bir sorudur. Düzeltmeye davet eder. Modelin çıkarımını görünür kılar; böylece kullanıcı yanlışsa yeniden yönlendirebilir. Açıklama estetik nedenlerle üretilmez; işlevsel HITL altyapısıdır.

### Tutarlılık ve Kayma

Uzun süreli etkileşimli bir sistemde ortaya çıkan bir sorun, **davranışsal kaymadır**: sistemin $T+n$ zamanındaki davranışı, $T$ zamanındakinden hem kullanıcının hem de sistemin açıkça seçmediği biçimlerde ince olarak farklılaşır. Düzeltmeler birikir. Sınır vakalar katmerleşir. Geçen ay kullanıcının tercihlerine hizalanmış model artık hizalanmamış olabilir.

Limen bunu periyodik tutarlılık kontrolleriyle ele alır — Bölüm 13'te tanımlanan yeniden sunum tekniğinin işletim sistemi eşdeğeri. Sistem tarihsel kararları kullanıcıya sunar: "Birkaç hafta önce X yapmanı istedin. Hâlâ böyle ister miydin?" Bu kontroller iki işlev üstlenir: kaymayı yakalar ve kullanıcıya belirttiği tercihleri hatırlatır.

---

## HITL Sistemi Olarak Limen

Limen'in mimarisine bu el kitabının merceğinden bakıldığında, tasarım kararları her bölümde geliştirilen kavramlarla doğrudan örtüşür.

**Bölüm I (Temeller):** Limen her etkileşimi insan–makine etkileşim olayı olarak ele alır. "HITL dışı mod" yoktur — sistem her zaman öğrenmekte, her zaman ilişkilendirmekte, her zaman insanın katılmasını beklemektedir.

**Bölüm II (Temel Teknikler):** Aktif öğrenme, güvene dayalı yükseltme zinciri olarak kendini gösterir. Etkileşimli makine öğrenmesi, gerçek zamanlı güncelleme döngüsünde kendini gösterir. Açıklama örtüktür: kullanıcının her düzeltmesi bir etikettir.

**Bölüm III (İnsan Geri Bildiriminden Öğrenme):** Bölüm 8'de tanımlanan tercih öğrenmesi, yönlendirme politikası güncellemelerinde kendini gösterir. Kullanıcı uzak modelin yanıtına göre yerel modelin yanıtını tercih ettiğinde, bu tercih kaydedilir ve genelleşir. Kişisel bir işletim sisteminde RLHF, ödül modelinin özel, bireysel ve sürekli güncellendiği anlamına gelir.

**Bölüm IV (Uygulamalar):** Limen genel amaçlı bir ortamdır, ancak tasarımı en çok insan yargısının vazgeçilmez ve hata maliyetinin yüksek olduğu alanlarda görünür hâle gelir — belge taslakları, görev önceliklendirmesi, yaratıcı çalışma.

**Bölüm V (Sistemler ve Pratik):** WID, Limen'in açıklama platformudur. Normal çalışmada kullanıcıya görünmez; hata ayıklama veya şeffaflık için gerektiğinde görünür. Kalite kontrol mekanizmaları (tutarlılık kontrolleri, güven eşikleri, yükseltme günlükleri) doğrudan kitle kaynaklı çalışma literatüründen alınmıştır.

**Bölüm VI (Etik):** Yerel öncelikli, gizliliği koruyan tasarım yalnızca teknik değil, etik bir seçimdir. İnsanın verileri açık rızası olmadan cihazı terk etmez. Kullanıcının davranışından öğrenen model o kullanıcıya aittir.

---

## Daha Derin Nokta

Limen bir ürün tanıtımı değildir. Yapı yoluyla bir argümandır.

Argüman şudur: HITL ML'nin ilkelerini ciddiye alırsanız — insan geri bildiriminin en aza indirilmesi gereken bir maliyet değil, anlaşılması gereken bir sinyal olduğuna, tasarımcılar aksi iddia etse dahi insanın her zaman döngüde olduğuna, hizalamanın tek seferlik bir olay değil süregelen bir süreç olduğuna inanırsanız — Limen'e benzeyen bir şey inşa edersiniz.

Özellikle Limen olmak zorunda değil. Belirli teknoloji yığını (Tauri, Rust, Babylon.js, Whisper ONNX) birçok seçenekten biridir. Ancak mimari — nedensel olay izleme, yerel öncelikli işleme, zarif bozulma, sürekli tercih öğrenmesi, birinci sınıf özellik olarak şeffaflık — ilkelerden çıkar.

HITL ML alanı, insanları belirli modellerin ve belirli görevlerin döngüsüne dahil etmenin nasıl sağlanacağını tanımlamaya önemli ölçüde enerji harcamıştır. Bir sonraki soru, aynı ilkeler etrafında tüm *ortamları* tasarlayıp tasarlayamayacağımızdır: insanın her zaman merkez, makinenin her zaman öğrenen ve döngünün her zaman açık olduğu ortamlar.

Limen bu sorunun bir yanıtıdır.

Eşik, geçip geride bırakılan bir şey değildir. Yaşadığınız yerdir.

---

```{seealso}
Limen'in etkileşim tasarımının altında yatan IML ilkeleri Bölüm 5'te geliştirilmektedir. Yönlendirme politikasının arkasındaki tercih öğrenme yaklaşımı Bölüm 8'de biçimselleştirilmektedir. WID'in nedensellik modeli, Bölüm 14'te araştırılan olay atıf literatüründen yararlanmaktadır. Bölüm 5'te tanıtılan Büyükanne Testi, Limen'in birincil arayüz tasarım kısıtıdır.
```
