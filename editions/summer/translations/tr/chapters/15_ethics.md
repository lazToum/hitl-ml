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

# Adalet, Önyargı ve Etik

Döngüde insan sistemleri, içlerindeki insanların hem yeteneklerini hem de sınırlarını miras alır. Etiketleyiciler, çalışmalarına bilgi, yargı ve yaratıcılık katar — ama aynı zamanda önyargıları, yorgunlukları ve yaşamlarının toplumsal bağlamını da. HITL sistemleri tasarlarken yaptığımız seçimler — kimlerin etiketlediği, nelerle karşılaştıkları, nasıl ücretlendirildikleri ve çalışmalarının nasıl kullanıldığı — model doğruluk ölçütlerinin çok ötesine uzanan sonuçlar doğurur.

Bu bölüm, HITL makine öğrenmesinin etik boyutlarını ele alır.

---

## HITL Sistemlerindeki Önyargı Kaynakları

### Etiketleyici Demografisi

Etiketleme tarafsız bir eylem değildir. Etiketleyicilerin atadığı etiketler, onların perspektiflerini, deneyimlerini ve kültürel bağlamlarını yansıtır. Etiketleme işgücü demografik açıdan homojen olduğunda — kitle çalışmasının genç, erkek ve Batılı bir eğilim sergilemesiyle çoğu zaman olduğu gibi — ortaya çıkan veri kümesi o grubun perspektiflerini kodlar.

**Kanıt:** Doğal dil işleme etiketleme veri kümelerinin incelenmesi, etiketleyicilerin demografik özelliklerinin öznel görevler için (toksisite, duygu, saldırganlık) etiket seçimlerini öngördüğünü ortaya koymuştur. Ağırlıklı olarak ABD merkezli kitle çalışanları tarafından etiketlenen veri kümeleri, diğer bölgelere genellemeyen ABD kültürel normlarını kodlar {cite}`geva2019annotator`.

**Sonuçlar:** Bu tür verilerle eğitilen modeller, etiketleyici havuzunu andıran kullanıcılar için iyi; andırmayanlar için ise düşük performans gösterir veya önyargılı davranır.

**Azaltma:** Kasıtlı işgücü çeşitlendirmesi; katmanlı etiketleme (ilgili demografik gruplardan etiketleyicilerin ilgili görevlere katkıda bulunmasını sağlama); etiketleyici demografisini ve bunun etiket dağılımları üzerindeki etkisini izleme.

### Görev Çerçevelemesi

Bir sorunun nasıl çerçevelendiği, alınan yanıtları etkiler. Etiketleyicilere "Bu metin toksik mi?" sorusu sorulduğunda, "Bu metin bahsedilen gruba ait birine zarar verir mi?" sorusundan farklı yanıt alınabilir. Çerçeveleme, neyin önemli olduğuna ilişkin varsayımları kodlar.

**Örnek:** Sosyal medyadaki "saldırgan dil" etiketlemesi, etiketleyicilere yazarın kimliğine ilişkin bağlamsal bilginin gösterilip gösterilmemesine bağlı olarak önemli ölçüde farklılaşır. Yalıtılmış olarak tehdit edici görünen bir ifade, bağlam sağlandığında geri alınmış dil veya grup içi mizah olarak tanınabilir.

### Platform Etkileri

Platform ve ödeme yapısı, etiketleme kalitesini etkiler. Görev başına değil saat başına ücretlendirilen çalışanların hızlı çalışma teşviki vardır; bu verim artırır ancak kaliteyi düşürür. Düşük doğruluk nedeniyle platformdan engellenme korkusu taşıyan çalışanlar "belirsiz" işaretlemekten kaçınıp tahmin yapabilir; bu da gerçek belirsizliği gizler.

### Onaylama ve Çapalama Önyargıları

Etiketleyiciler şu etkilerden etkilenir:
- **Ön etiketleme:** Etiketleyicilere gösterilen model tahminleri yanlış olduğunda bile reddedilmeden kabul edilme oranı yüksektir
- **Sıra etkileri:** Aynı öğenin farklı bağlamlarda etiketlenmesi farklı yanıtlar verir
- **Hazırlama:** Bir gruptaki önceki öğeler, sonraki öğelerin nasıl etiketlendiğini etkiler

---

## HITL Sistemlerinde Adalet

### Adalet Nedir?

Makine öğrenmesinde adalet, çoğunlukla birbiriyle uyumsuz çok sayıda biçimsel tanıma sahip tartışmalı bir kavramdır {cite}`barocas2019fairness`. HITL açısından en ilgili boyutlar şunlardır:

**Temsil:** Eğitim verisi, modelin etkileyeceği nüfusları temsil ediyor mu?

**Performans paritesi:** Model, farklı demografik gruplar genelinde eşit biçimde performans gösteriyor mu?

**Etiketleme tutarlılığı:** Aynı davranışlar, kim tarafından gerçekleştirildiğinden bağımsız olarak aynı biçimde etiketleniyor mu? (Araştırmalar bunun her zaman böyle olmadığını göstermiştir — özdeş içerikler bazen farklı ırksal veya cinsiyet gruplarına atfedildiğinde farklı biçimde etiketlenmektedir.)

### Adalete Duyarlı Aktif Öğrenme

Standart aktif öğrenme sorguları, model belirsizliğine odaklanır; bu da azınlık grupları için performans farklılıklarını şiddetlendirebilir.

**Adalete duyarlı sorgu stratejileri**, belirsizlik ölçütünü çeşitlilik veya temsil kısıtlamalarıyla artırır:

$$
x^* = \argmax_{x \in \mathcal{U}} \left[ \lambda \cdot \text{belirsizlik}(x) + (1 - \lambda) \cdot \text{azınlık\_grubu\_bonusu}(x) \right]
$$

$\lambda < 1$ ayarlamak, sorgu stratejisinin azınlık temsilini tamamen görmezden gelmemesini sağlar.

---

## Etiketleyici Refahı

### Hayalet Çalışma Problemi

Makine öğrenmesini besleyen etiketleme çalışması büyük ölçüde görünmezdir. Veri çalışanları — çoğunlukla Küresel Güney'de — düşük ücretlerle, sosyal güvencesiz, iş güvencesiz gig ekonomisi düzenlemelerinde görüntüleri etiketler, konuşmaları transkribe eder ve içerikleri moderasyondan geçirir. Kate Crawford ve Vladan Joler'in "Bir YZ Sisteminin Anatomisi" {cite}`crawford2018anatomy` ve Mary Gray ve Siddharth Suri'nin "Hayalet Çalışma" {cite}`gray2019ghost` çalışmaları bu emeğin ölçeğini ve güvencesizliğini belgeledi.

**Amazon MTurk istatistikleri:** MTurk kazançları üzerine yapılan 2018 tarihli sistematik bir analiz, medyan etkin saatlik ücreti yaklaşık 2 ABD doları olarak buldu — ABD eyaletlerinin ve pek çok yüksek gelirli ülkenin asgari ücretinin çok altında {cite}`hara2018data`. Yüksek gelirli ülkelerin dışındaki çalışanlar ek engellerle karşılaşmaktadır: talep sahipleri çoğunlukla yüksek ücretli görevleri yalnızca ABD niteliklerine kısıtlamakta; geriye kalan açık görevler için rekabet eden çalışan havuzu küresel olduğundan etkin kazançlar daha da baskılanmaktadır.

**İçerik moderasyonu:** Özellikle zararlı bir etiketleme çalışması biçimi — grafik, şiddet içeren ve rahatsız edici içerikleri incelemek — çalışanlar arasında TSSB, depresyon ve kaygıyla ilişkilendirilmiştir {cite}`newton2019trauma`. Platformlar yetersiz ruh sağlığı desteği ve aşırı maruz kalma kotaları nedeniyle eleştirilere maruz kalmıştır.

### Etik Uygulamalar

**Adil ücret:** Etiketleme çalışanlarına yerel asgari ücret düzeyinde veya üzerinde ödeme yapın. Araştırmalar, daha yüksek ücretin doğru etiket başına maliyeti orantılı biçimde artırmadan daha kaliteli çalışanları çektiğini göstermiştir.

**Çalışma görünürlüğü:** Eğitim verisi oluşturan emeği yayınlarda ve ürün belgelerinde kabul edin.

**Ruh sağlığı desteği:** Zararlı içerik inceleyen çalışanlar için psikolojik destek, rotasyon takvimleri ve maruz kalma sınırları sağlayın.

**Çalışan temsili:** Etiketleme çalışanlarının endişelerini bildirmesine, kılavuz etiketlemeleri talep etmesine ve haksız kalite değerlendirmelerine itiraz etmesine olanak tanıyın.

---

## Etiketlemede Gizlilik

### Korunan Sağlık Bilgileri (KSB) ve Kişisel Tanımlayıcı Bilgiler (KTB)

Etiketleme görevleri çoğunlukla hassas kişisel veriler içerir. Tıbbi etiketleme projesi çalışanları hasta kayıtlarına; doğal dil işleme projesi çalışanları özel iletişimlere; içerik moderasyonu çalışanları kullanıcıların kişisel etiketlemelerine maruz kalabilir.

Düzenleyici çerçeveler (HIPAA, GDPR), kişisel verilerin etiketleme işgücüyle nasıl paylaşılabileceğini kısıtlar. Temel ilkeler:

- **Veri minimizasyonu:** Etiketleyicilerle yalnızca görevi tamamlamak için gerekli bilgileri paylaşın
- **Tanımlama kaldırma:** Mümkün olan yerlerde etiketlemeden önce KSB ve KTB'yi kaldırın
- **Onay:** Gerçek kullanıcı verisi etiketlendiğinde, uygun onay veya yasal dayanak sağlayın
- **Erişim kontrolleri:** Hassas verilere erişimi rol ve yetkiye göre sınırlayın

### Alternatif Olarak Sentetik Veri

Gerçek verilerin gizlilik riski taşıdığı görevler için, sentetik veri üretimi hassas bilgileri açığa çıkarmadan etiketlemeye hazır veri kümeleri oluşturabilir. Örneğin klinik doğal dil işlemede, sentetik EHR metni gerçek hasta kayıtlarını açmadan tanımlama kaldırma modelleri için gerçekçi eğitim verisi sağlayabilir.

---

## Saldırgan Etiketleme ve Veri Zehirleme

HITL sistemleri bir saldırı yüzeyi oluşturur: bir düşman etiketleme sürecini etkileyebilirse modelin davranışını da etkileyebilir.

**Etiketleme yoluyla veri zehirleme:** Etiketleme işgücüne erişimi olan bir saldırgan (örneğin ele geçirilmiş bir kitle çalışanı hesabı) sistematik biçimde yanlış etiketlenmiş örnekler enjekte edebilir. Bu, aktif öğrenme ortamlarında özellikle etkilidir; burada model, belirsiz örnekleri tercihli olarak sorgular — ki bunlar saldırganın hedefleri olabilir.

**Geri bildirim yoluyla ödül korsanlığı:** RLHF'de, belirli içerik türlerini sürekli yüksek puanlayan etiketleyiciler (veya yapay zeka tarafından oluşturulan etiketlemeler), modeli gerçek kalitesinden bağımsız olarak o içeriğe yönlendirebilir.

**Azaltma:** Öğe başına birden fazla bağımsız etiketleyici; etiketleme örüntülerinde aykırı değer tespiti; anormal anlaşma veya anlaşmazlıkları izleme; etiketleme işgücü tarafından etkilenemeyen değerlendirme kümelerini koruma.

---

## Kurumsal Etik

### Kurumsal Değerlendirme Kurulu ve Etik İnceleme

İnsan deneklerini — etiketleme çalışanları dahil — kapsayan araştırma projeleri çoğunlukla Kurumsal Değerlendirme Kurulu (KDK) onayı gerektirir. Çalışanların inançlarını, hassas içeriklere verdiği tepkileri veya demografik bilgileri toplayan etiketleme projeleri, diğer insan denekleri araştırmalarıyla aynı etik çerçeve altında incelenmelidir.

### Veri Yönetişimi

Kuruluşlar şunlar için açık politikalara sahip olmalıdır:
- Hangi verinin dış etiketleme için gönderilebileceği ile dahili olarak etiketlenmesi gerekenler
- Etiketleme verisinin ne kadar süreyle ve kim tarafından saklanacağı
- Etiketlemelere ve bunlar üzerinde eğitilen modellere kimlerin erişebildiği
- Etiketlemeli verileri silme taleplerinin nasıl ele alınacağı (GDPR silme hakkı)

### Şeffaflık ve Hesap Verebilirlik

Makine öğrenmesi sistemlerinden etkilenen kullanıcıların bu sistemlerin nasıl inşa edildiğini anlama konusunda meşru bir çıkarı vardır. Etiketleme metodolojisini belgelemek — veriyi kimlerin, hangi koşullarda, hangi kılavuzlarla etiketlediğini — kullanıcılara, düzenleyicilere ve bir bütün olarak alana fayda sağlayan bir hesap verebilirlik biçimidir.

**Veri Kümeleri için Veri Sayfaları** {cite}`gebru2021datasheets`, veri kümesi kaynağını, etiketleme prosedürlerini ve bilinen sınırlamaları belgelemek için yapılandırılmış bir şablon sunar.

```{seealso}
Algoritmik adalet çerçevesi: {cite}`barocas2019fairness`. Hayalet çalışma ve platform emeği: Gray ve Suri (2019). Veri Kümeleri için Veri Sayfaları: {cite}`gebru2021datasheets`. İçerik moderasyonu çalışan refahı: {cite}`newton2019trauma`. Etiketleyici demografisi ve doğal dil işleme veri kümeleri: {cite}`geva2019annotator`.
```
