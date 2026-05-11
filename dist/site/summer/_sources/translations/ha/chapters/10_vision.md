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

# HITL a Gane Hoto ta Kwamfuta

Gane hoto ta kwamfuta yana ba da wasu mafi bayyana na ɗan adam na HITL ML. Gasar ImageNet, wanda aka gina akan hotuna miliyan 14 da dan adam ya yi lakabi, ya ƙaddamar da zamanin koyon zurfin. Lakabi na hoto likitanci ta likitan hoto yana ƙarfafa AI na gano cutar. Motoci masu tuka kan su suna dogara akan firam da dan adam ya yi lakabi da miliyoyi don koyon gane duniya.

Abin da ke da sauƙin rasa: waɗannan ba kawai lokuta ne na dan adam da ke ba da gaskiyar ƙasa ba. Su ne lokuta ne na dan adam da ke ƙirƙira saitin bayanai waɗanda ke ɓoye zaɓuɓɓukan fahimta, al'adu, da aiki musamman — zaɓuɓɓuka waɗanda ke bayyana kawai daga baya, lokacin da samfurin suka gazawa ta hanyoyi masu iya hasashe.

---

## Yadda Zaɓuɓɓukan Lakabi ke Zama Nuna Son Zuciya na Samfuri

Tsarin yau da kullum yana ɗaukar lakabi a matsayin tattara bayanai: dan adam suna lura da duniya kuma suna rubuta abin da suka gani. Tsarin mafi daidai shine cewa lakabi shine *zanen saitin bayanai*: dan adam suna yanke shawara waɗanne rukunan za a yi amfani da su, inda za a zana iyaka, waɗanne lokuta na iyaka za a haɗa, da yadda za a warware rikitarwa — kuma duk waɗannan yanke shawara suna tsara abin da samfuri da aka horar zai gane.

### Yanayin ImageNet

ImageNet {cite}`russakovsky2015imagenet` shine saitin bayanai mafi muhimmanci a cikin tarihin gane hoto ta kwamfuta. Saita lakabin sa yana samo asali daga synsets na WordNet, da farko an zaɓa don kasancewa da yawa da kuma bambancin ma'ana. Sakamako da yawa na wannan zaɓi na zane suka bayyana shekaru baya:

- **Rukunan mutum sun ɓoye alaƙa na halaye na dimokra'iyya.** Sigar farko na lakabin synset na ImageNet don mutum sun haɗa da da yawa waɗanda yanzu za a ɗauke su mara darajar ko nuna son zuciya, suna nuna duka tushen WordNet na tarihi da yanke shawara da ɓoye na ƙungiyar aiki na lakabi game da waɗanne lakabin za a yi amfani da su ga hotuna guda guda {cite}`yang2020towards`. Lakabin da aka yi amfani da su ga hotuna na mutum sun ɓoye alaƙa ta jinsi, jima'i, da aji waɗanda kai tsaye suka yada zuwa cikin embeddings na samfuri.

- **Taxonomy ta jinsin-jinsin tsari mai kyau, na kusan duk sauran.** ImageNet yana iya bambanta karnukan nau'in 120 amma yana ruguje bambancin mai yawa a cikin kayan aiki, motoci, abinci, da daki-daki zuwa rukunan ɗaya. Wannan sakamakon bin tsarin WordNet ne, ba zaɓin da gangan game da abin da ke da muhimmanci ba. Samfurin da aka horar akan ImageNet suna nuna daidaito mara daidaito ɗaya.

- **Ma'aunan gani na Yamma, mai magana da Turanci.** An tattara hotuna da farko daga Flickr da binciken Intanet ta amfani da tambayoyi da Turanci. Rarrabawar da ta samu tana nuna sosai zuwa yanayin gani da abubuwan al'adu na ƙasashe masu arziki, masu magana da Turanci.

Babu ɗayan waɗannan kurakurai ba ne. Yanke shawara ne na zanen lakabi da aka yi da sauri a sikeli, galibi ta mutane waɗanda ba su yi tsammanin yadda saitin bayanai za a yi amfani da shi ba. Darasin ba shine cewa ya kamata a gina ImageNet daban ba (ko da yake ya kamata), amma **zanen lakabi zanen samfuri ne**, kuma ya kamata a ɗauke shi da kulawa ɗaya.

:::{admonition} Schema na lakabi ka'idar duniya ce
:class: note

Kowane taxonomy na lakabi yana yin da'awa game da bambance waɗanda ke da muhimmanci. Zaɓar rarrabewa "mota" daga "motar da aka yi watsi da wuri biyu" yayin da suka dunkule duk wayoyin hannu zuwa aji ɗaya da'awar ka'ida ce game da waɗanne bambance ke da ma'ana ta ma'ana. Zaɓar yin lakabi ga "mutum" a matsayin aji ɗaya ba tare da la'akari da hali, sutura, ko aiki ba wata da'awar ka'ida ce. Samfurin da aka horar akan waɗannan schemas za su yi bambancen ɗaya, kuma ba fiye da haka — ba za su faɗaɗa fiye da rukunan da aka horar su don bambanta ba.
:::

---

## Lakabi na Rarrabuwa Hoto

Mafi sauƙin aikin lakabi na CV shine sanya lakabin ɗaya ko fiye ga hoto gaba ɗaya.

**Hierarchy na lakabi.** Lakabi "kare" yana yaro na "dabba" a cikin hierarchy na ma'ana. Samfurin da aka horar akan taxonomies mai saman iya ba su faɗaɗa da kyau a cikin matakin abstraction. ImageNet yana amfani da hierarchy bisa synset wanda ke ba da damar kimantawa a matakai da yawa na musamman.

**Rikitarwa ta lakabi nau'i da yawa.** Yanayin titin na iya ƙunshi mota, mutum, keke, da hasken zirga-zirga a lokaci ɗaya. Yanke shawara waɗanne lakabin za a haɗa yana buƙatar jagoran bayyananne game da iyakar dacewa.

**Rarrabawar dogon wutsiya.** Saitin bayanai na hotuna na yanayi suna bin doka mai iko: rukunan kaɗan suna da yawa sosai; mafi yawansu suna da ƙarami. Koyon aiki yana da ƙima musamman don rukunan dogon wutsiya inda samfurin ta damari yana ba da kaɗan misalai.

---

## Gano Abubuwa: Lakabi na Akwatin Iyaka

Gano abubuwa yana buƙatar masu sanya lakabi su zana akwatuna daidai da axis a kusa da misali na kowane ajin abubuwa. Wannan yana gabatar da buƙatun daidaito na geometrical da lokuta na iyaka masu yawa.

**Ma'aunai na ingancin lakabi:**

*IoU (Haɗuwa-akan-Ƙungiya)* yana auna haɗuwa tsakanin akwati da aka sanya lakabi da akwati na tunani:

$$
\text{IoU}(A, B) = \frac{|A \cap B|}{|A \cup B|}
$$

$\text{IoU} \geq 0.5$ shine iyaka ta yau da kullum don gano "daidai" a PASCAL VOC; COCO {cite}`lin2014microsoft` yana amfani da iyaka da yawa daga 0.5 zuwa 0.95, wanda yana da buƙatu fiye da kima kuma yana ba da bayanai fiye da kima.

**Lokuta na iyaka na lakabi waɗanda dole ne a warware su a cikin jagoran:**
- Abubuwa masu toshe: yin lakabi ga ɓangare da ake gani ko kimanta faɗin cikakke?
- Abubuwa masu yanke (a wani ɓangare waje da firam): haɗa ko cire?
- Yankuna masu cunkoson jama'a: yi amfani da lakabi na musamman "fama da cunkoson jama'a" ko yin lakabi ga misali ɗaya ɗaya?

Kowane ɗayan waɗannan yanke shawara yana canza abin da "gano daidai" ke nufi — kuma saboda haka yana canza abin da samfuri aka horar don yi.

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

## Rarrabuwa ta Ma'ana da Misali

Lakabi na rarrabuwa yana buƙatar sanya ajin lakabi ga kowane pixel a cikin hoto — daga cikin mafi tsada nau'in lakabi.

**Rarrabuwa ta ma'ana:** Kowane pixel yana cikin ajin ma'ana (hanya, sararin sama, mutum, mota). Duk pixel na ajin ɗaya suna raba lakabi ɗaya, ba tare da la'akari da wane abu na musamman suke cikin shi ba.

**Rarrabuwa misali:** Kowane misali na abu na musamman yana karɓar lakabi na musamman. Fama da cunkoson jama'a na mutum 20 yana zama tufafi 20 daban-daban.

**Rarrabuwa Panoptic:** Yana haɗa duka biyun: rukunan "abu" (abubuwa masu iya ƙidaya) suna da tufafi misali; rukunan "abubuwa" (hanya, sararin sama) suna da tufafi ma'ana.

**Lakabi mai tallafi na SAM:** Samfurin Segment Anything Meta {cite}`kirillov2023segment` yana ƙirƙira tufafin rarrabuwa mai inganci daga danna kan ɗaya. Masu sanya lakabi suna danna tsakiyar abu; SAM yana ba da shawara tufafi; mai sanya lakabi yana yarda ko gyara. Marubutan SAM sun ruwaito hanzartar da injin lakabi na kusan 6.5× akan sanya lakabi bisa polygon; riba suna bambanta cikin nau'in yanayi da kayan aiki na lakabi.

SAM yana wakilta canjin mafi faffada: **matsayin mai sanya lakabi yana canzawa daga zane zuwa duba da tabbatarwa**. Wannan yana da abubuwa masu amfani don ingancin lakabi fiye da sauri. Lokacin da masu sanya lakabi suna zane, hankalinsu yana shiga a duk tsari. Lokacin da masu sanya lakabi suna duba kuma suna danna "yarda," akwai shaidar cewa suna rasa kurakurai cikin sauƙin fiye da kima — sigar nuna son zuciya na atomatik musamman ga mahallin lakabi.

---

## Koyon Aiki don Gane Hoto ta Kwamfuta

Koyon aiki yana da ƙima musamman a CV saboda:
1. Hotuna suna da yawan girma kuma suna da arziki ta fasali — embeddings daga samfurin da aka horar a baya suna ɗaukar alaman ƙarfi don ƙiyasin rashin tabbas
2. Tafkin mara lakabi yana da arha (hotuna, firam na bidiyo)
3. Lakabi (musamman rarrabuwa) yana da tsada kuma ba za a iya cunkusar da shi da sauƙin don yankuna musamman ba

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

## Koyon Semi-Supervised tare da Jagoran Dan Adam

Yawan bayanai na gani da ba a yi lakabi ba da yake samuwa yana mai da koyon semi-supervised yana da jan hankali musamman don CV.

**Horarwa-kan-kansa / pseudo-labeling:** Horar da samfuri akan bayanai da aka yi lakabi; yi amfani da hasashe masu amincewar ƙari akan bayanai da ba a yi lakabi ba a matsayin pseudo-lakabin; sake horarwa. Tambayar zanen da ke da muhimmanci ita ce iyakar amincewar. Iyaka ƙarami yana kawo misalai fiye da kima amma yana gabatar da hayaniya; iyaka mai ƙari yana barin mafi yawan tafkin da ba a yi lakabi ba ba a yi amfani da shi ba. Shiga dan adam zai iya kula da wannan iyaka — masu sanya lakabi suna bitar samfuri na pseudo-lakabin misalai don daidaita shi.

**FixMatch da daidaito ta haɓaka:** Waɗannan hanyoyin suna horar da samfurin don samar da hasashe daidai ƙarƙashin haɓaka. Babban ra'ayin HITL: ana ba da shawarwari ta dan adam ba kawai don lakabin amma don **zanen haɓaka** — waɗanne daidaito ya kamata samfuri ya koyo? Samfuri don hoto likitanci ya kamata ya kasance daidai da jujjuyawa da haske amma ba da sukeli ba; samfuri don gano rubutu bai kamata a mai da shi daidai da canzawar hangen nesa ba. Waɗannan zaɓuɓɓuka musamman na yanki suna buƙatar ƙwarewa ta dan adam, kuma kuskuren su yana raunana koyon semi-supervised sosai.

**Koyon aiki na semi-supervised mai aiki:** Haɗin gwiwa mafi inganci: koyon aiki yana tattara lakabin dan adam inda rashin tabbas na samfuri ya fi girma; horarwa-kan-kansa yana yin lakabi ta atomatik ga wutsiyar amincewar ƙari. Ƙoƙarin dan adam yana tattara inda yake da ƙima fiye da kima, kuma samfuri yana ɗaukar sauran ta auto-labeling. A kowane zagaye, bitar dan adam na samfuri ta damari na pseudo-lakabin yana ba da duba inganci ba tare da buƙatar duba cikakke ba.

---

## Lakabi na Bidiyo

Lakabi na bidiyo yana ninka kalubalen lakabi na hoto ta lokaci:

- **Bin sawu:** Dole ne a gano abubuwa cikin firam. Masu sanya lakabi suna yin lakabi ga firam muhimmanci; algorithms na bin sawu suna interpolate tsakanin su. Gazawar bin sawu — toshe, sake shiga, motsi mai sauri — suna buƙatar sake lakabi na dan adam a yawan fiye da bin sawu na daidai.
- **Daidaito na lokaci:** Ya kamata iyaka da aka zana a firam $t$ su kasance daidai a sararin duniya da firam $t+1$. Lakabi mara daidaito alama ce ta horarwa da ke gaya wa samfuri cewa abubuwa suna tsalle ba da tsari ba — wata nau'i ta ƙurar lakabi musamman mai cutarwa don samfurin gano.
- **Girman sikeli:** Bidiyo na awa 1 a 30fps shine firam 108,000. Lakabi cikakke ba mai yiwuwa ba ne; dole ne a tsara dabarun samfuri da hankali don tabbatarwa cewa al'amurra da ba a cika ba (lokuta na iyaka, kusan gazawa, yanayin gazawa) ba a cire su ta tsari ba.

Kayan aikin lakabi na bidiyo na zamani suna tallafa wa **bin sawu mai wayo** wanda ke yada lakabi cikin firam kuma yana yin alamar firam inda amincewar bin sawu ta faɗi ƙasa da iyaka, yana kira mai sanya lakabi don sake duba. Wannan amfani kai tsaye ne na ra'ayin koyon aiki ga tsarin lakabi kansa: kayan aikin yana tambaya mai sanya lakabi ainihin inda interpolation ɗinsa ya kasance mara tabbas.

**Matsalar al'amari da ba a cika ba a cikin tsarin atomatik.** Don aikace-aikace inda sakamakun al'amurra mara cika suka lalace — tuka kai tsaye, kewayar UAV — rarrabawar firam da ake gani a aiki na yau da kullum yana dacewa mara kyau sosai tare da rarrabawar firam waɗanda ke da muhimmanci sosai. Saitin bayanai da aka gina ta samfurin firam na tuka ta daidaito zai ƙunshi firam miliyan na "babu abin ban sha'awa yana faruwa" da ɗan kaɗan na firam na kusan-haɗari, haske na musamman, da firam na sensor masu lalacewa waɗanda ke da muhimmanci sosai ga aminci. Koyon aiki na HITL wanda ke gano da kuma fifita irin waɗannan firam ba dabara ta ingancin ƙoƙari ba ne — buƙata ce ta aminci.

```{seealso}
Saitin bayanai na ImageNet: {cite}`russakovsky2015imagenet`. Nuna son zuciya na lakabi a ImageNet: {cite}`yang2020towards`. Ma'aunin COCO: {cite}`lin2014microsoft`. SAM (Segment Anything): {cite}`kirillov2023segment`. Koyon aiki na core-set don CV: {cite}`sener2018active`.
```
