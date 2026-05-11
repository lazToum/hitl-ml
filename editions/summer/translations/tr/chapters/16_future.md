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

# Gelecek Yönelimler

Döngüde insan makine öğrenmesi alanı hızla değişmektedir. Temel modeller, açıklayıcı olarak büyük dil modelleri ve insan–yapay zeka işbirliği için yeni paradigmalar, HITL'nin ekonomisini ve pratiğini beş yıl önce hayal dahi edilemeyecek biçimlerde dönüştürmektedir. Bu son bölüm, ortaya çıkan yönlerin ve açık sorunların haritasını çıkarmaktadır.

---

## Temel Modeller ve Açıklamanın Değişen Rolü

Geniş veriler üzerinde önceden eğitilmiş ve aşağı akış görevlerine uyarlanabilen büyük modeller olan temel modeller, HITL'nin ekonomisini temelden değiştirmektedir.

### Açıklama Yükünü Azaltma

Daha önce sıfırdan eğitim için binlerce etiketli örnek gerektiren bir görev, bir temel modeli ince ayarlarken yalnızca düzinelere ihtiyaç duyabilir. Bazı görevler için az atışlı yönlendirme, ince ayar ihtiyacını tamamen ortadan kaldırabilir.

**Çıkarım:** Açıklama çabasının yatırım getirisi değişiyor. Açıklama çabası artık şunlara yönlendirilmek için daha iyi değerlendirilmektedir:
- Yüksek kaliteli değerlendirme kümeleri (uyarlanan modelin gerçekten çalışıp çalışmadığını ölçmek için)
- Temel modelin yanlış ele aldığı güç vakalar ve sınır durumlar
- Modele önceden eğitimden çıkaramayacağı bir şeyi öğreten göreve özgü örnekler

### Yeni Belirleme Biçimleri

Taban model zaten dili, kodu ve sağduyuyu anladığında, kullanıcılar etiketlenmiş örnekler yerine doğal dille iletişim kurabilir. Bir metin sınıflandırıcı isteyen kullanıcı artık 500 örnek etiketlemek zorunda değildir — sınıflandırma görevinin bir açıklamasını yazabilir ve sıfır atışlı performansı değerlendirebilir.

Bu durum, HITL güçlüğünü *örnek toplama*dan *görev belirleme*ye kaydırır: kullanıcıların modelin üzerinde eylemde bulunabileceği bir biçimde tam olarak ne istediklerini dile getirmelerine yardımcı olmak. Bu kulağa geldiğinden zordur — görevlerin doğal dil açıklamaları, etiketlenmiş örneklerin sahip olmadığı biçimlerde çoğunlukla belirsizdir.

---

## Açıklayıcı Olarak Büyük Dil Modelleri

2023–2025'in en önemli gelişmelerinden biri, **BDM'lerin açıklama kahinleri olarak kullanılmasıdır**. "Bu yorum olumlu mu olumsuz mu?" sorusunu bir insana değil GPT-4 veya Claude'a soruyoruz. İyi tanımlanmış sınıflandırma görevleri için BDM açıklamaları çoğunlukla kitle çalışanı doğruluğuyla eşleşiyor veya ona yaklaşıyor {cite}`gilardi2023chatgpt` ve API çağrılarının açıklama başına maliyeti tipik olarak insan işgücü ücretlerinden kat kat düşük.

### BDM Açıklamasının İyi Çalıştığı Yerler

- Basit, iyi tanımlanmış sınıflandırma görevleri (duygu, konu, niyet)
- İnsan etiketlerinin BDM'nin özümsediği kültürel mutabakatı kodladığı görevler
- Bağlamlar arasında tutarlı açıklamanın sağlandığı görevler (yüksek öznellik yoktur)
- İnsan incelemesi için ilk aşama açıklamalar oluşturma

### BDM Açıklamasının Başarısız Olduğu Yerler

- Nadir uzmanlık gerektiren son derece özelleşmiş alan görevleri (tıp, hukuk, bilim)
- Yerel kültürel bilgi veya dil çeşitliliği gerektiren görevler
- BDM'nin eğitildiği veriyle aynı yönde yanlış kalibre olabileceği güvenlik ve zarar görevleri
- Önceden eğitimde iyi temsil edilmemiş yeni görev türleri

### RLAIF ve Anayasal Yapay Zeka

Bölüm 6'da tartışıldığı üzere, yapay zeka tarafından üretilen geri bildirim ödül modellerini eğitmek ve pekiştirmeli öğrenme ince ayarını yönlendirmek için kullanılabilir. Bu durum bir geri bildirim döngüsü yaratır: BDM'ler veri üretir, modeller bunun üzerinde eğitilir ve daha iyi modeller daha iyi veri üretir. Bu döngüyü başlangıç modelinden sistematik hataları kodlamadan nasıl başlatacağımız, ölçeklenebilir denetim araştırmasında merkezi bir açık sorundur.

---

## Ölçekte Zayıf Denetim

Etiketleme işlevleri aracılığıyla **programatik etiketleme** (Bölüm 9), alan uzmanlarının bilgilerini etiketlenmiş örnekler yerine kod olarak ifade etmelerine olanak tanır. Snorkel {cite}`ratner2017snorkel` ve halef sistemleri önemli ölçüde olgunlaşmış ve büyük teknoloji şirketlerinde üretimde kullanılmaktadır.

**Sınır yönelimler:**
- **BDM artırımlı etiketleme işlevleri:** Doğal dil açıklamalarından etiketleme işlevleri oluşturmak için BDM'leri kullanma
- **Dilim tabanlı öğrenme:** Etiketleme işlevlerinin anlaşmazlığa düştüğü kritik veri alt kümelerini (dilimleri) belirleyin ve insan açıklamasını oraya yönlendirin
- **Belirsizlik duyarlı birleştirme:** Farklı doğruluk ve korelasyonlara sahip etiketleme işlevlerini birleştirmek için daha iyi istatistiksel modeller

---

## İnsan Denetimiyle Sürekli Öğrenme

Makine öğrenmesi sistemlerinin büyük çoğunluğu çevrimdışı eğitilir ve statik model olarak dağıtılır. Gerçek dünya değişir; dağıtım anında doğru olan modeller, veri dağılımı kaydıkça bozulur.

**Sürekli öğrenme** — eski bilgiyi korurken yeni veriden öğrenme yetisi — aktif bir araştırma alanıdır. İnsan denetimi kritiktir: insan incelemesi olmadan otomatik sürekli öğrenme, dünya değişikliklerini değil hataları temsil eden dağılım kaymaları hızla kodlayabilir.

**HITL sürekli öğrenme** şunları içerir:
- Dağılım kaymasını izleme (otomatik) ve kaymış örnekleri insan incelemesine yönlendirme
- Seçici yeniden eğitim: yeni dağılımdan insan onaylı örnekler eğitim verisine eklenir
- Her güncellemeden sonra model davranışı değişikliklerinin insan incelemesi

---

## Çok Kipli HITL

Yapay zeka sistemleri çok kipli hâle geldikçe — metin, görüntü, ses ve videoyu aynı anda işleyip ürettikçe — açıklama daha karmaşık hâle geliyor. Tek bir içerik parçası, aralarında bağımlılıklar bulunan kipler genelinde açıklama gerektirebilir.

**Ortaya çıkan görev türleri:**
- Video + transkript açıklaması (ne oluyor, kim konuşuyor, metin görsel olarak neyi tanımlıyor?)
- Tıbbi görüntü + klinik rapor açıklaması
- Robotik yörünge açıklaması (sensör verilerini eylem dizileriyle ilişkilendirme)

Çok kipli temel modeller (GPT-4V, Gemini, Claude) buradaki açıklama manzarasını da değiştiriyor — modeller artık görüntüleri yorumlayıp aday açıklamalar üretebiliyor; insanlar ise bunları inceliyor.

---

## Ölçeklenebilir Denetim

HITL ML'deki temel açık sorun **ölçeklenebilir denetimdir** {cite}`irving2018ai,bowman2022measuring`: yapay zeka sistemleri belirli alanlarda insanları geçecek biçimde gelişirken anlamlı insan denetimini nasıl sürdüreceğiz?

Protein yapı tahmini, hukuki analiz veya matematiksel kanıt doğrulama gibi görevler için uzman açıklayıcılar bile iki yapay zeka çıktısından hangisinin doğru olduğuna güvenilir biçimde karar veremeyebilir. Değerlendirilen modelden insan yargısı daha az güvenilir olduğunda mevcut HITL yöntemleri işe yaramaz.

**Önerilen yaklaşımlar {cite}`bowman2022measuring`:**

**Tartışma:** İki yapay zeka sistemi farklı sonuçlar için argüman geliştirir; insan yargıcı doğrudan sonuçları değil argümanları değerlendirir. Doğru sonuç daha savunulabilir olmalıdır.

**Yükseltme:** İnsan yargıcılar, karmaşık çıktıları değerlendirmeye yardımcı olmak için yapay zeka asistanlarına (modelin kendisine) danışır. Bu, insan denetiminin yerini almak yerine onu genişletmek için yapay zeka yeteneklerinden yararlanır.

**Süreç denetimi:** Nihai çıktıyı değerlendirmek yerine insanlar *akıl yürütme sürecini* değerlendirir — nihai yanıtın doğru olup olmadığından bağımsız olarak düşünce zincirindeki kusurlu adımları işaretler.

---

## Değişen İş Bölümü

HITL ML'nin uzun vadeli gidişatı, ne birinin sadece "etiketleyici" ne de diğerinin sadece "öğrenen" olduğu, her ikisinin de paylaşılan bir bilişsel sürece katkıda bulunduğu insanlar ve yapay zeka arasında daha akışkan bir işbirliğine doğrudur.

**İzlenecek eğilimler:**
- **Yapay zeka destekli açıklama:** Yapay zeka önerir; insanlar karar verir. Yapay zeka daha iyi seçenekler önerdikçe kalite artar.
- **İnsan rehberliğinde keşif:** İnsanlar hedefler ve kısıtlamalar belirler; yapay zeka çözüm uzayını keşfeder.
- **İşbirlikçi değerlendirme:** İnsanlar ve yapay zeka, karmaşık çıktıları diyalog yoluyla birlikte değerlendirir.
- **Ölçekte tercih öğrenmesi:** Kullanıcıların yapay zeka çıktılarıyla nasıl etkileşime girdiğine ilişkin örtük sinyaller, açık açıklama oturumları gerektirmeden sürekli tercih öğrenmesini besler.

Yapay zeka yargısına kıyasla insan yargısına ne kadar güvenileceği sorusu — ve hangi alanlarda, hangi yetenek düzeylerinde, hangi güvence önlemleriyle — nihai olarak teknik bir soru değil, toplumsal bir sorudur. HITL ML, varsayılan olarak değil, dikkatli biçimde yanıtlanması için teknik altyapıyı sağlar.

---

## Açık Araştırma Sorunları

Alanın üzerinde etkin biçimde çalıştığı önemli açık sorunların bir listesiyle kapanıyoruz:

1. **Aktif öğrenmede optimum durdurma:** Bir sonraki açıklamanın marjinal değeri maliyetin altında kaldığında? Prensipli durdurma kuralları hâlâ zordur.

2. **Görevler arasında açıklama bütçesi tahsisi:** Çok görevli ortamlarda, sabit bir açıklama bütçesi görevler arasında nasıl bölünmelidir?

3. **Aktif öğrenmede dağılım kayması:** Aktif öğrenme önyargılı etiketli kümeler oluşturur. Bu şekilde eğitilen modeller nasıl düzgün kalibre edilebilir?

4. **Ödül modeli genellemesi:** RLHF ödül modelleri yeni istem-yanıt çiftlerine genelleşemeyebilir. Daha sağlam tercih modelleri nasıl inşa edebiliriz?

5. **Ölçeklenebilir denetim:** Yapay zeka sistemleri belirli alanlarda insan performansını aşarken insan denetimini nasıl sürdüreceğiz?

6. **Açıklayıcı modelleme:** Yalnızca yetkinliği değil sistematik önyargıları, konu uzmanlığını ve yorgunluğu da yakalayan daha iyi istatistiksel açıklayıcı davranış modelleri.

7. **Hizalamanın değerlendirilmesi:** Bir modelin insan değerleriyle hizalandığına ilişkin gerçek zemin testlerimiz yok. Sağlamlık için karşıt örneklere benzer bu tür testler geliştirmek açık bir sorundur.

8. **Adil veri emeği:** Açıklama çalışanlarının adil biçimde ücretlendirilmesini ve korunmasını sağlarken büyük ölçekli açıklamanın maliyet etkinliğini koruyan ekonomik ve kurumsal yapılar.

---

```{epigraph}
Amaç, insan yargısının yerini makine yargısıyla almak değil,
her ikisinin birleşiminin tek başına herhangi birinden daha iyi olduğu sistemler inşa etmektir.
```

Bu el kitabındaki araçlar ve teknikler — açıklama, aktif öğrenme, RLHF, tercih öğrenmesi ve geri kalanı — bu amaca ulaşmanın araçlarıdır. Alan geliştikçe belirli teknikler değişecek. Temel ilham — hem yetenekli hem de gerçek anlamda insan niyetiyle hizalanmış sistemler inşa etmek — kalıcı olacaktır.

```{seealso}
Ölçeklenebilir denetim ve tartışma: {cite}`bowman2022measuring`. Snorkel zayıf denetimi: {cite}`ratner2017snorkel`. İnsan–yapay zeka işbirliğinin geniş geleceği için bkz. {cite}`amershi2019software`.
```
