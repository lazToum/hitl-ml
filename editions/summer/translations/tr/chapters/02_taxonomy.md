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

# İnsan–Makine Etkileşiminin Bir Taksonomisi

Kesin bir söz dağarcığı, açık düşüncenin ön koşuludur. "Döngüde insan" terimi pratikte gevşek biçimde kullanılır — bazen bir insanın eğitim verisi etiketlediği, bazen bir insanın modelin kararını geçersiz kılabildiği ve bazen de bir insanın gerçek zamanlı olarak öğrenme sürecini etkin biçimde yönlendirdiği anlamında. Bunlar anlamlı ölçüde farklı şeylerdir.

Bu bölüm, makine öğrenmesinde insan–makine etkileşiminin haritasını çıkarmakta ve el kitabının geri kalanında kullanılan kavramsal söz dağarcığını sunmaktadır.

---

## Otomasyon Düzeyleri

En temel ayrım, insanın sistemin karar alma sürecine ne ölçüde etkin biçimde katıldığıdır. Otomasyon teorisinden alınan iyi bilinen bir çerçeve {cite}`sheridan1992telerobotics` on düzey ayırt eder; ancak makine öğrenmesi açısından üç kategori önemli farklılıkları yeterince yansıtır:

### Döngüde İnsan (HITL)

İnsan, *öğrenme sürecinde etkin bir katılımcıdır*. Kararlar — ya da en azından sonuçları önemli olan kararlar — kesinleştirilmeden önce insan girdisi gerektirir. Sistem, süregelen insan katılımı olmaksızın işleyemez.

*Örnekler:* Bir vakayı eğitim verisine eklemeden önce bir klinisyeni sorgulayan aktif öğrenme sistemi. Model güncellemeleri için anında kullanılan örnekleri etiketleyen veri açıklayıcısı. Model çıktılarını karşılaştıran bir RLHF etiketleyicisi.

### Döngü Üzerinde İnsan (HOTL)

Sistem özerk biçimde çalışır ancak bir insan onu izler ve müdahale edebilir. İnsan bir *denetçidir*, katılımcı değil. Geri bildirim eğitime geri beslenebilir de beslenemeyebilir de.

*Örnekler:* Gönderileri otomatik olarak işaretleyen bir içerik moderasyon sistemi; bir insan gözlemci kararların bir bölümünü örnekler ve düzeltir. Uçağı uçuran ancak pilotu anormalliklere karşı uyaran bir otopilot.

### Komutada İnsan (HIC)

İnsan tüm kararları verir; sistem *tavsiyeler veya bilgiler* sunar ancak herhangi bir özerkliği yoktur. Bu, makine öğrenmesi dağıtımının en zayıf biçimidir.

*Örnekler:* Doktora modelin olasılık tahminini gösteren, ancak nihai kararı tamamen hekime bırakan bir tanı destek sistemi.

```{admonition} Hangi düzey doğru?
:class: tip

Uygun otomasyon düzeyi, hataların maliyetine, modelin güvenilirliğine, mevcut insanların uzmanlığına ve görevin gecikme kısıtlamalarına bağlıdır. Bu etkenler model olgunlaştıkça değişir — çoğu sistem HITL olarak başlar ve güven arttıkça HOTL'a doğru ilerler.
```

```text
Ham veri --> Ön işleme --> Özellikler --> Eğitim --> Değerlendirme --> Dağıtım
    ^              ^                         ^              ^               ^
    |              |                         |              |               |
 Toplama      Açıklama                  Aktif           Test         İzleme
 geri bildirimi & etiketleme           öğrenme        geri bildirimi & düzeltme
```

| Aşama        | İnsan rolü                                                  | Bölüm  |
|--------------|-------------------------------------------------------------|--------|
| Toplama      | Toplanacak veriyi belirleme; örnekleme stratejisi           | 3, 4   |
| Açıklama     | Etiket, yapı, meta veri atama                               | 3, 13  |
| Eğitim       | Aktif öğrenme sorguları; çevrimiçi geri bildirim            | 4, 5, 6|
| Değerlendirme| Model çıktılarının insan tarafından değerlendirilmesi       | 14     |
| Dağıtım      | İzleme, istisna yönetimi, düzeltmeler                       | 12, 14 |

---

## Etkin ve Pasif İnsan Katılımı

*Etkin* HITL'de sistem, insana sunacağı veri noktalarını stratejik biçimde seçer ve sorular sorar. *Pasif* HITL'de insan, rastgele gelen veriler üzerinde geri bildirim sağlar (örneğin sıralı olarak atanan veri etiketleme grupları).

Etkin katılım daha verimlidir; çünkü geri bildirim, modeli en çok iyileştirecek yerlere yönlendirilir. Pasif katılım uygulaması ve yönetimi daha kolaydır.

İlgili bir ayrım da **toplu** ile **çevrimiçi** geri bildirim arasındadır:

- **Toplu:** İnsanlar büyük bir örnek havuzunu etiketler; model yeniden eğitilir. Tekrarlanır.
- **Çevrimiçi (akışlı):** İnsan geri bildirimi sürekli gelir; model artımlı biçimde güncellenir.

Toplu iş akışları sektörde yaygın normdur (ardından eğitim çalıştırması gelen açıklama projeleri). Çevrimiçi iş akışları, etkileşimli sistemler ve pekiştirmeli öğrenme ortamları için daha doğaldır.

---

## Tekil ve Çoklu Açıklayıcılar

HITL'nin büyük bölümündeki biçimsel sunumlar, tekil ve tutarlı bir açıklayıcı varsayar. Pratikte açıklama birçok kişiyi kapsar ve yargıları farklılaşır.

**Birleştirme**, birden fazla açıklamayı genellikle çoğunluk oyu veya istatistiksel bir model aracılığıyla tek bir etikette toplar (Bölüm 13).

**Sinyal olarak anlaşmazlık** — bazı araştırmacılar, açıklayıcı anlaşmazlığının tek bir "altın" etikette yoğunlaşmaması gereken değerli bilgi olduğunu savunmaktadır. Örneğin doğal dil işlemede perspektivist yaklaşımlar, gerçek veri belirsizliğini yansıtan yumuşak etiketler olarak birden fazla açıklamayı korur {cite}`uma2021learning`.

---

## Birleşik Bir Çerçeve

Herhangi bir HITL yapılandırmasını beş öğeli bir demet ile temsil edebiliriz:

$$
\text{HITL yapılandırması} = (\text{düzey}, \text{kiplik}, \text{aşama}, \text{sıklık}, \text{açıklayıcılar})
$$

burada:

- **düzey** $\in$ {HITL, HOTL, HIC}
- **kiplik** $\in$ {etiket, düzeltme, gösteri, tercih, doğal dil, örtük}
- **aşama** $\in$ {toplama, açıklama, eğitim, değerlendirme, dağıtım}
- **sıklık** $\in$ {toplu, çevrimiçi}
- **açıklayıcılar** $\in \mathbb{N}^+$ (öğe başına açıklayıcı sayısı)

Bu taksonomi, farklı HITL sistemlerini aynı eksenler üzerinde karşılaştırmamıza ve aralarındaki değiş tokuşlar hakkında akıl yürütmemize olanak tanır. El kitabının geri kalanı, bu uzayın belirli hücrelerini derinlemesine inceleyecektir.

```{seealso}
Açıklama kararlarının aşağı akış model davranışını nasıl etkilediğine dair ampirik bir çalışma için bkz. {cite}`bender2021stochastic`. Etkileşimli makine öğrenmesi sistemlerinin araştırması için bkz. {cite}`amershi2014power`.
```
