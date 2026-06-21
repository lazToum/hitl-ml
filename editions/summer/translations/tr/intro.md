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

# Döngüde İnsan Makine Öğrenmesi
## *Yanlış Anlaşılan*

```{epigraph}
"Döngüde İnsan Makine Öğrenmesi" başlıklı bir doktoraya gerek yok.
Ya da daha doğrusu — her anlamda gerek var, ama o doktora hiç yazılmadı.
Bu kitap o doktora değil. Onun yerine yazılandır.
```

---

Bu el kitabı, **Döngüde İnsan (HITL) Makine Öğrenmesi** — insan yargısı ile makine zekasının yalnızca yan yana var olmadığı, birbirini etkin biçimde yeniden şekillendirdiği sistemler tasarlama disiplini — üzerine kapsamlı, çalıştırılabilir ve bilinçli olarak akademik olmayan bir kılavuzdur.

En az üç anlamda *yanlış anlaşılmaktadır*:

**Alan yanlış anlaşılıyor.** Çoğu kişiye makine öğrenmesinin nasıl işlediğini sorun; modelin dağıtımıyla sona eren bir süreç tarif edeceklerdir. Gerçekte insan döngüden hiçbir zaman çıkarılmaz — yalnızca gözden gizlenir. Her "otonom" sistemin arkasında etiketleyiciler, gözden geçirenler, geri bildirim toplayanlar ve yargı çağrıları yapan mühendisler vardır. HITL ML bunu görünür ve kasıtlı kılar.

**İnsanın rolü yanlış anlaşılıyor.** Döngüdeki insan, model yeterince iyileştiğinde atılacak geçici bir iskele değildir. İnsan yargısı, "yeterince iyi"nin ne anlama geldiğini tanımlayan sinyaldir. Amaç işlevini, ödülü, etiket şemasını veya değerlendirme ölçütünü, neyin önemli olduğuna karar veren bir insan olmadan belirleyemezsiniz. Makine optimize eder; insan neyin için optimize edileceğine karar verir.

**Siz yanlış anlaşılıyorsunuz — ben de öyle.** Bir sistemin içine gömülü olmak hakkında bir kitap okuyorsunuz. Okurken, bir sistemin içine gömülüsünüz. Bu metnin bazı bölümlerinin üretilmesine yardım etmiş olabilecek model, insan geri bildirimiyle eğitildi. Kullandığınız modelleri eğiten etiketler, adları hiçbir yerde geçmeyen insanlar tarafından sağlandı. Hepimiz, bir anlamda, kendimizden daha büyük bir şeyin döngüsündeki insanlarız.

Bu kitap aksi yönde bir iddiada bulunmaz. Bu insanları adlandırır, emeklerini betimler ve onları anlamanın, gradyan inişini anlamak kadar önemli olduğunu savunur.

:::{admonition} Türkçe baskı
:class: note
Bu eser Türkçe çevirisidir. Birincil başvuru baskısı İngilizce özgün metindir. Bazı teknik bölümler henüz tamamlanmamış olabilir.
:::

---

## Bu El Kitabı Neleri Kapsıyor

Altı bölüme ayrılmış on altı kısım; temellerden sınırlara doğru ilerliyor:

**Bölüm I — Temeller.** HITL ML'nin ne olduğu, nereden geldiği ve insan–makine etkileşim kiplerinin uzayının nasıl düşünüleceği.

**Bölüm II — Temel Teknikler.** Etiketleme ve veri etiketlemesi, aktif öğrenme ve etkileşimli makine öğrenmesi — HITL'nin üç klasik sacayağı.

**Bölüm III — İnsan Geri Bildiriminden Öğrenme.** İnsan geri bildiriminden pekiştirmeli öğrenme (RLHF), gösterilerden öğrenme ve karşılaştırmalar ile sıralamalardan tercih öğrenimi — modern yapay zeka hizalamasını güçlendiren paradigmalar.

**Bölüm IV — Uygulamalar.** Doğal dil işleme, bilgisayarlı görü ve sağlık — gerçek kısıtları olan gerçek alanların merceğinden HITL.

**Bölüm V — Sistemler ve Pratik.** Etiketleme platformları, kitle kaynak kullanımında kalite kontrolü ve değerlendirme çerçeveleri — HITL'yi ölçekte işler kılan altyapı.

**Bölüm VI — Etik ve Ufuklar.** Verinin ardındaki insanlar: adalet, etiketleyici refahı, önyargı ve tüm bunların nereye gittiği.

---

## Kod Üzerine Bir Not

Her teknik bölüm çalıştırılabilir Python kodu içerir. Tüm örnekler kendi içinde bütünlüklüdür ve standart kütüphaneleri kullanır: NumPy, scikit-learn, PyTorch, Hugging Face Transformers.

```{code-cell} python
# A taste of what's ahead: querying the most uncertain sample
import numpy as np
from sklearn.linear_model import LogisticRegression

rng = np.random.default_rng(42)
X = rng.normal(size=(100, 2))
y = (X[:, 0] + X[:, 1] > 0).astype(int)

model = LogisticRegression().fit(X[:20], y[:20])

probs = model.predict_proba(X[20:])
entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
most_uncertain = np.argmax(entropy) + 20

print(f"Most uncertain sample index: {most_uncertain}")
print(f"Predicted probabilities:     {probs[most_uncertain - 20].round(3)}")
print()
print("The model doesn't know. So we ask a human.")
```

---

## Gösterim

- $\mathcal{X}$ — girdi uzayı; $\mathcal{Y}$ — etiket uzayı
- $f_\theta : \mathcal{X} \to \mathcal{Y}$ — $\theta$ parametrelerine sahip bir model
- $\mathcal{U}$ — etiketsiz havuz; $\mathcal{L}$ — etiketli veri kümesi
- $h$ — bir insan etiketleyici; $\mathcal{H}$ — bir etiketleyiciler kümesi

---

*Siz döngüdeki insansınız. Başlayalım.*
