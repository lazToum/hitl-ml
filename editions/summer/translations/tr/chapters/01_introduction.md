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

# Döngüde İnsan Makine Öğrenmesi Nedir?

```{epigraph}
Deneyimden öğrenebilen bir makine... ama yalnızca ona doğru deneyimleri verirseniz.
-- Alan Turing'den uyarlanmıştır
```

## Otomasyon Paradoksu

Her yeni otomasyon dalgası, insan dikkatine yönelik yeni talepler yaratır. Havayolları otopilot sistemlerini tanıttığında pilotlar izleyiciye dönüştü — anlık kontrolden değil, *ne zaman devreye gireceklerini bilmek* gibi daha zorlu görevden sorumlu hâle geldiler. Süpermarketler self-checkout sistemlerini hayata geçirdiğinde, bu sistemlerin geleneksel kasiyerlere kıyasla işlem başına daha fazla insan denetimi gerektirdiği anlaşıldı. Makine öğrenmesi tıp, finans, istihdam ve içerik moderasyonu gibi alanlarda ölçekli kararlar almaya başladığında ise insan yargısına yönelik devasa ve süregelen bir talep ortaya çıktı.

Bu, **otomasyon paradoksunun** ta kendisidir {cite}`bainbridge1983ironies`: otomatik bir sistem ne kadar yetenekli hâle gelirse, hatalarının sonuçları o kadar ağır olur ve dolayısıyla sağlam insan denetiminin gerekliliği de o denli artar. Makine öğrenmesi bu paradoksun dışında değildir.

Döngüde İnsan Makine Öğrenmesi (HITL ML), bu paradoksu ciddiye alan ve onu baştan itibaren sistemlerin tasarımına dahil eden alandır. İnsan katılımını nihayetinde kaldırılacak geçici bir iskele olarak ele almak yerine, HITL ML insan–makine etkileşimini bir *özellik* olarak değerlendirir: modelleri daha doğru, insan değerleriyle daha uyumlu ve daha güvenilir kılabilecek bir sinyal, düzeltme ve yönlendirme kaynağı.

---

## Döngüde İnsan Makine Öğrenmesini Tanımlamak

HITL ML'ye ilişkin tek bir kabul görmüş tanım bulunmamakta olup terim, literatürde birbirine örtüşen birkaç anlamda kullanılmaktadır. Bu el kitabında geniş kapsamlı ancak kesin bir tanım benimsemekteyiz:

:::{admonition} Tanım
:class: important

**Döngüde İnsan Makine Öğrenmesi**, insan geri bildiriminin öğrenme sürecine *kasıtlı, yapılandırılmış ve süregelen* biçimde dahil edildiği herhangi bir makine öğrenmesi sistemini veya metodolojisini ifade eder — yalnızca veri kümesi oluşturma anında değil, eğitim, değerlendirme ve dağıtım süreçleri boyunca.

:::

Bu tanımın üç temel maddesi vardır:

**Kasıtlı.** HITL, tesadüfi insan etkisini (örneğin eğitim verilerinin başlangıçta insanlar tarafından oluşturulduğu gerçeğini) değil; insan geri bildirimini açıkça talep etmek, dahil etmek ve bundan faydalanmak üzere tasarlanmış sistemleri kapsar.

**Yapılandırılmış.** Geri bildirim belirli bir biçime sahiptir — bir etiket, bir düzeltme, bir tercih yargısı, bir gösteri — ve öğrenme algoritmasında tanımlanmış bir rolü vardır.

**Süregelen.** Geri bildirim döngüsü zaman içinde devam eder; sistemin yeni durumlarla karşılaştıkça, hata yaptıkça ve insan rehberliği aldıkça gelişmesine olanak tanır.

Bu tanım, klasik açıklama hatlarını, aktif öğrenmeyi, etkileşimli makine öğrenmesini, RLHF'yi ve taklit öğrenmesini kapsar. Pasif veri toplamayı ve yalnızca çevrimdışı denetimli öğrenmeyi dışarıda bırakır (her ne kadar sınır belirsiz olsa da, Bölüm 2'de ele alınacaktır).

---

## Kısa Bir Tarih

### Uzman Sistemler ve Bilgi Mühendisliği (1960'lar–1980'ler)

İlk yapay zeka sistemleri neredeyse tamamen döngüde insandı: bilgi mühendisleri, aylarca alan uzmanlarıyla oturup MYCIN ve DENDRAL gibi uzman sistemlere kuralları özenle kodladı. Her bilgi parçası açıkça bir insan tarafından sağlandı. Makine uygulayıcıydı; insan ise kahindir.

Bu sistemler dar alanlarda şaşırtıcı biçimde iyi çalıştı, ancak kırılgandı — elle hazırlanmış kuralların ötesine genelleyemedi ve bakımı pahalıydı.

### İstatistiksel Dönüş (1980'ler–2000'ler)

1980'ler ve 1990'larda istatistiksel makine öğrenmesine geçiş, insan katılımının doğasını değiştirdi. Bilgiyi kural olarak kodlamak yerine insanlar artık *örnekler* sağladı — modellerin kalıpları çıkarsayabilmesi için etiketlenmiş veri kümeleri. İnsanın rolü açıklayıcı olmaya dönüştü: belgeleri etiketlemek, görüntüleri işaretlemek, konuşmaları metne dökmek.

Bu büyük bir ilerleme oldu ancak yeni bir darboğaz yarattı: **etiketli veri pahalıdır**. Araştırmacılar insan etiketleme çabasından en verimli biçimde nasıl yararlanılabileceğini sormaya başladı. Bu soru, 1990'ların başında ilk kez formalize edilen **aktif öğrenme** alanının doğmasına yol açtı {cite}`cohn1994improving`.

### Derin Öğrenme Çağı (2010'lar–günümüz)

Derin öğrenme devrimi yeni bir rejim yarattı: veriden son derece karmaşık işlevler öğrenebilen milyarlarca parametreli modeller — ancak orantılı ölçüde büyük etiketli veri kümeleri gerektiriyor. ImageNet (14 milyon etiketli görüntü) ve ardından gelen büyük ölçekli açıklama projeleri, ölçeğin hem gücünü hem de maliyetini gözler önüne serdi.

Aynı zamanda makine öğrenmesinin ölçekli dağıtımı yeni sorunları açığa çıkardı: ortalamada doğru ancak belirli gruplara sistematik biçimde hatalı davranan, gerçekleri güvenle halüsine eden, ölçülebilir vekil hedefler için optimize eden — insan değerlerinden değil — modeller. Bu başarısızlıklar yeni insan katılımı biçimlerini motive etti: yalnızca etiketleme değil, *hizalama* — modellerin insanların gerçekten istediği biçimde davranmasını sağlama projesi.

Bu hizalama odaklı HITL çalışmasının en belirgin ifadesi, InstructGPT {cite}`ouyang2022training` gibi sistemlerin omurgasına dönüşen ve modern dil modellerinin talimat takip yeteneklerini destekleyen **İnsan Geri Bildiriminden Pekiştirmeli Öğrenme (RLHF)** oldu {cite}`christiano2017deep`.

---

## Neden HITL? İnsan Yargısı İçin Gerekçe

İnsan yargısını makine öğrenmesi sistemlerine dahil etmeye değer kılan ne? Birkaç özellik:

### 1. Sağduyu ve Dünya Bilgisi

İnsanlar herhangi bir göreve muazzam bir arka plan bilgisiyle gelir. Bir radyolog bir röntgen görüntüsünü etiketlediğinde yıllarca süren eğitimine, anatomi bilgisine ve hastalıkların nasıl göründüğüne ilişkin örtük bilgisine başvurur — bu bilgiyi tam olarak belirtmek ya da yalnızca veriden edinmek son derece güçtür.

### 2. Anlamsal Temellendirme

Etiketler, insanların ne anlama geldiğini kavramasıyla anlam kazanır. ImageNet'teki "kedi" sınıfı, insanların sezgisel olarak tanıdığı ancak hiçbir biçimsel tanımın tam olarak yakalayamadığı bulanık bir kavrama karşılık gelir. Modeller etiketin uzantısını öğrenir (hangi görüntülerin bununla eşleştiğini) ancak kavramın kendisini öğrenemeyebilir; bu durum, herhangi bir insanın doğru biçimde ele alacağı sınır vakalarda başarısızlıklara yol açar.

### 3. Değer Hizalaması

İnsanların makine öğrenmesi modellerinin yalnızca veriden türetemeyeceği tercihleri, değerleri ve etik yargıları vardır. Bir metnin "yararlı" mı yoksa "zararlı" mı olduğu salt ampirik bir soru değildir — bireyler ve bağlamlar arasında değişen insan değerlerine bağlıdır. HITL, bu değerlerin makine öğrenmesi sistemlerine aktarılabildiği başlıca mekanizmadır.

### 4. Uyarlanabilirlik

İnsan yargısı yeniden eğitim gerekmeksizin yeni durumlarla baş edebilir. Tarihsel verilerle eğitilmiş bir model, dünya değiştiğinde feci biçimde başarısız olabilir; bir insan ise yeniliği fark edip uygun biçimde tepki verebilir.

### 5. Hesap Verebilirlik

Tıp, hukuk ve finans gibi yüksek riskli alanlarda kararların insan varlıklarına hesap vermesi gerekmektedir. HITL sistemleri, insanları makine davranışını anlayabilecek, doğrulayabilecek ve geçersiz kılabilecek bir konumda tutarak bu hesap verebilirliği uygulanabilir hâle getirir.

---

## Geri Bildirim Döngüsü

HITL ML'nin merkezi yapısı, bir model ile bir ya da birden fazla insan arasındaki geri bildirim döngüsüdür:

```text
+---------------------------------------------+
|                                             |
|   Model tahminler / istekler sunar          |
|   ---------------------------------->       |
|                                   İnsan    |
|   İnsan geri bildirim sağlar     <-------- |
|   ----------------------------------        |
|                                             |
|   Model geri bildirimi dahil ederek         |
|   güncellenir                               |
|                                             |
+---------------------------------------------+
```

Geri bildirimin niteliği, HITL paradigmaları arasında büyük ölçüde farklılaşır:

| Geri bildirim türü  | Örnek                                           | Birincil paradigma             |
|---------------------|-------------------------------------------------|--------------------------------|
| Sınıf etiketi       | "Bu e-posta istenmeyen"                         | Denetimli öğrenme              |
| Düzeltme            | "Varlık ORG olmalı, PER değil"                  | Aktif / etkileşimli ML         |
| Tercih              | "A yanıtı B'den daha iyi"                       | RLHF / sıralama                |
| Gösteri             | Robota bir nesneyi nasıl kavrayacağını gösterme | Taklit öğrenmesi               |
| Doğal dil           | "Yanıtlarında daha özlü ol"                     | Talimat ince ayarı             |
| Örtük sinyal        | Kullanıcı tıkladı / tıklamadı                  | Örtük geri bildirim            |

---

## HITL'nin Olmadığı Şeyler

Tanımımızın dışında kalanları belirtmek önem taşır.

**HITL, döngüde insan dağıtımıyla aynı şey değildir** (bazen "döngü üzerinde insan" olarak da anılır); bu durumda insanlar otomatik kararları izler ve geçersiz kılabilir, ancak düzeltmeleri eğitime geri beslemez. Bu ayrımı Bölüm 2'de ele alacağız.

**HITL tek başına zayıf denetim değildir.** Snorkel gibi programatik etiketleme sistemleri, ölçekli gürültülü etiketler üretmek için etiketleme işlevlerini (çoğunlukla insan tarafından yazılan kuralları) kullanır. Bu yapılandırılmış bir insan girdisi biçimidir, ancak geri bildirim HITL'nin genellikle ima ettiği şekilde yinelemeli değildir.

**HITL, yalnızca etiketli veri kullanmak değildir.** Her denetimli öğrenme modeli insan tarafından etiketlenmiş veri kullanır. HITL, özellikle insan geri bildiriminin öğrenme sürecinin *etkin, yinelemeli* bir parçası olduğu sistemleri ifade eder.

---

## İnsan Geri Bildiriminin Ekonomisi

İnsan geri bildirimi değerlidir ancak maliyetlidir. Tıbbi görüntü açıklaması, uzmanlık alanı ve görev karmaşıklığına bağlı olarak uzman tarafından gerçekleştirildiğinde görüntü başına onlarca ila yüzlerce dolar arasında bir maliyete sahip olabilir {cite}`monarch2021human`. Amazon Mechanical Turk gibi platformlardaki kitle kaynaklı çalışma etiketleri, çok daha düşük kalitede olmak üzere öğe başına 0,01–0,10 ABD doları arasında değişebilir {cite}`hara2018data`. HITL ML'nin temel güçlüğü **her bir insan geri bildirim biriminin değerini en üst düzeye çıkarmaktır**.

Bu durum, el kitabının büyük bölümünde işlenen birleştirici soruya yol açar:

:::{admonition} HITL ML'nin Merkezi Sorusu
:class: tip

*Sabit bir insan zamanı ve dikkati bütçesi göz önüne alındığında, insanlara ne sorulacağına, ne zaman sorulacağına ve yanıtlarının model eğitimine nasıl dahil edileceğine nasıl karar verilmelidir?*

:::

Bu sorunun yanıtı alana, geri bildirim biçimine, açıklama maliyetine, hata riskine ve modelin mevcut durumuna bağlıdır — HITL ML'nin zengin ve hâlâ gelişmekte olan bir disiplin olmasının nedeni de budur.

---

## El Kitabına Genel Bakış

El kitabının geri kalanı şu şekilde yapılandırılmıştır. **Bölüm II**, HITL'nin üç klasik sütununu kapsar: açıklama, aktif öğrenme ve etkileşimli makine öğrenmesi. **Bölüm III**, modern yapay zeka için merkezi hâle gelen geri bildirimden öğrenme paradigmalarını ele alır: RLHF, taklit öğrenmesi ve tercih öğrenmesi. **Bölüm IV**, HITL'yi belirli uygulama alanları perspektifinden inceler. **Bölüm V**, platformlar, kitle kaynaklı çalışma ve değerlendirme üzerine bir uygulayıcı bakışı sunar. **Bölüm VI** ise etik sorunları ele alır ve ileriye bakar.

```{seealso}
Alanın uygulayıcı odaklı genel bir değerlendirmesi için bkz. {cite}`monarch2021human`. HITL'nin büyük bölümünün biçimsel işlemini başlatan temel aktif öğrenme makalesi için bkz. {cite}`settles2009active`.
```
