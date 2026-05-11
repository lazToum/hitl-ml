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

# HITL katika Mwono wa Kompyuta

Mwono wa kompyuta hutoa baadhi ya mifano inayoeleweka zaidi kwa macho ya HITL ML. Changamoto ya ImageNet, iliyojengwa kwenye picha milioni 14 zilizowekewa lebo na binadamu, ilianzisha enzi ya kujifunza kwa kina. Uwekaji maelezo wa picha za kimatibabu na madaktari wa radiolojia huendesha AI ya utambuzi. Magari ya uhuru yanategemea fremu milioni zilizowekewa lebo na binadamu kujifunza kutambua ulimwengu.

Kinachopita kwa urahisi bila kutambuliwa: hizi si hali za binadamu tu wanaotoa ukweli wa ardhi. Ni hali za binadamu wanaounda mkusanyiko wa data ambao unaweka maamuzi maalum ya mtazamo, kitamaduni, na uendeshaji — maamuzi yanayoonekana tu baadaye, wakati mifano inashindwa kwa njia zinazotarajiwa.

---

## Jinsi Maamuzi ya Uwekaji Maelezo Yanavyokuwa Upendeleo wa Mfano

Mfumo wa kawaida unauona uwekaji maelezo kama ukusanyaji wa data: binadamu wanaangalia ulimwengu na kurekodi wanachoona. Mfumo sahihi zaidi ni kwamba uwekaji maelezo ni *muundo wa mkusanyiko wa data*: binadamu wanaamua kategoria zipi kutumia, mahali pa kuchora mipaka, hali zipi za mipaka kujumuisha, na jinsi ya kutatua utata — na maamuzi hayo yote yanaathiri mfano uliofunzwa utakachotambua.

### Kesi ya ImageNet

ImageNet {cite}`russakovsky2015imagenet` ni mkusanyiko wa data wenye matokeo makubwa zaidi katika historia ya mwono wa kompyuta. Seti yake ya lebo inatoka kwa synsets za WordNet, zilizochaguliwa hasa kwa kuwa nyingi na tofauti kisemantiki. Matokeo kadhaa ya chaguo hili la muundo yalijitokeza miaka baadaye:

- **Kategoria za watu ziliweka uhusiano wa kidemografia.** Toleo za mapema za lebo za synset za ImageNet kwa watu zilijumuisha nyingi ambazo sasa zingedhaniwa za kubaguliwa au zenye upendeleo, zinaakisi chanzo cha kihistoria cha WordNet na maamuzi ya picha ya nguvu kazi ya uwekaji maelezo kuhusu lebo zipi kutumia kwenye picha zipi {cite}`yang2020towards`. Lebo zilizotumika kwenye picha za watu ziliweka uhusiano wa rangi, jinsia, na daraja ambao ulienea moja kwa moja katika uwakilishi wa mfano.

- **Uainishaji wa kina wa ushuru wa spishi, wa jumla wa kila kitu kingine.** ImageNet inaweza kutofautisha mbwa wa mifugo 120 lakini inakusanya tofauti kubwa za zana, magari, chakula, na samani katika kategoria moja. Hii ilikuwa matokeo ya kufuata muundo wa WordNet, si chaguo la makusudi kuhusu kinachohusika. Mifano iliyofunzwa kwenye ImageNet inaonyesha usahihi huo huo wa asymmetric.

- **Kawaida za kuona za Magharibi, wanaozungumza Kiingereza.** Picha zilikusanywa hasa kutoka Flickr na utafutaji wa mtandaoni kwa kutumia maswali ya Kiingereza. Usambazaji unaotokea unapenda sana mazingira ya kuona na vitu vya kitamaduni vya nchi tajiri, zinazozungumza Kiingereza.

Hakuna hizi zilikuwa makosa. Zilikuwa maamuzi ya muundo wa uwekaji maelezo yaliyofanywa haraka kwa kiwango kikubwa, mara nyingi na watu ambao hawakutarajia jinsi mkusanyiko wa data ungetumiwa. Somo si kwamba ImageNet ingepaswa kujengwa tofauti (ingawa ingepaswa), bali kwamba **muundo wa uwekaji maelezo ni muundo wa mfano**, na unapaswa kushughulikiwa kwa uangalifu sawa.

:::{admonition} Mpango wa uwekaji maelezo ni nadharia ya dunia
:class: note

Kila uainishaji wa lebo unadai kuhusu tofauti gani zinazohusika. Kuchagua kutenganisha "gari" na "lori" huku ukikusanya sedan zote katika darasa moja ni dai la kinadharia kuhusu tofauti zipi zina umuhimu wa kisemantiki. Kuchagua kuweka maelezo kwa "mtu" kama darasa moja bila kujali mkao, mavazi, au shughuli ni dai tofauti la kinadharia. Mifano iliyofunzwa kwenye mipango hii itafanya tofauti hizo hizo, na si zaidi — haitajumlisha zaidi ya kategoria zilizofunzwa kutofautisha.
:::

---

## Uwekaji Maelezo wa Uainishaji wa Picha

Kazi rahisi zaidi ya uwekaji maelezo wa CV ni kutoa lebo moja au zaidi kwa picha nzima.

**Muundo wa lebo.** Lebo "mbwa" ni mtoto wa "mnyama" katika muundo wa kisemantiki. Mifano iliyofunzwa kwenye uainishaji wa gorofa inaweza kutojumlisha vizuri kati ya viwango vya ufupishaji. ImageNet inatumia muundo unaotegemea synset ambao huruhusu tathmini katika viwango vingi vya maalum.

**Utata wa lebo nyingi.** Mandhari ya barabara inaweza kuwa na gari, mtu, baiskeli, na taa ya barabara wakati mmoja. Kuamua lebo zipi kujumuisha kunahitaji mwongozo wazi kuhusu viwango vya umuhimu.

**Usambazaji wa mkia mrefu.** Mkusanyiko wa data wa picha za asili hufuata sheria ya nguvu: kategoria chache ni za kawaida sana; nyingi ni adimu. Ujifunzaji tendaji una thamani sana kwa kategoria za mkia mrefu ambapo sampuli ya nasibu hutoa mifano michache tu.

---

## Ugunduzi wa Kitu: Uwekaji Maelezo wa Sanduku la Mpaka

Ugunduzi wa kitu unahitaji wawekaji maelezo kuchora sanduku la mpaka linalooana na mhimili karibu na mifano ya kila darasa la kitu. Hii inaanzisha mahitaji ya usahihi wa kijiometri na hali nyingi za mipaka.

**Vipimo vya ubora wa uwekaji maelezo:**

*IoU (Makutano juu ya Muungano)* inapima mwingiliano kati ya sanduku lililowekewa maelezo na sanduku la rejeleo:

$$
\text{IoU}(A, B) = \frac{|A \cap B|}{|A \cup B|}
$$

$\text{IoU} \geq 0.5$ ndiyo kiwango cha kawaida cha "ugunduzi sahihi" katika PASCAL VOC; COCO {cite}`lin2014microsoft` inatumia upeo wa viwango kutoka 0.5 hadi 0.95, ambayo ni ya kudai zaidi sana na yenye habari zaidi.

**Hali za mipaka za uwekaji maelezo ambazo lazima zitatuliwe katika mwongozo:**
- Vitu vilivyofunikwa: weka maelezo sehemu inayoonekana au kalibu upanuzi kamili?
- Vitu vilivyokatwa (kwa sehemu nje ya fremu): jumuisha au acha nje?
- Maeneo ya umati: tumia maelezo maalum ya "umati" au weka maelezo kwa mifano binafsi?

Kila moja ya maamuzi haya inabadilika maana ya "ugunduzi sahihi" — na kwa hivyo inabadilisha kile mfano unafunzwa kufanya.

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

## Ugawanyiko wa Kisemantiki na wa Kitengo

Uwekaji maelezo wa ugawanyiko unahitaji kutoa lebo ya darasa kwa kila pikseli katika picha — kati ya aina za uwekaji maelezo zenye gharama kubwa zaidi.

**Ugawanyiko wa kisemantiki:** Kila pikseli ni ya darasa la kisemantiki (barabara, anga, mtu, gari). Pikseli zote za darasa sawa zinashiriki lebo sawa, bila kujali ni kitu gani binafsi wanachomiliki.

**Ugawanyiko wa kitengo:** Kila kitu binafsi cha kitengo hupata lebo ya kipekee. Umati wa watu 20 unakuwa masago 20 tofauti.

**Ugawanyiko wa panoptiki:** Huchanganya vyote viwili: madarasa ya "kitu" (vitu vinavyohesabika) yana masago ya kitengo; madarasa ya "vitu" (barabara, anga) yana masago ya kisemantiki.

**Uwekaji maelezo unaosaidiwa na SAM:** Mfano wa Kukata Kitu Chochote wa Meta {cite}`kirillov2023segment` huzalisha masago ya kukata ya ubora wa juu kutoka kwa kubonyeza ncha moja. Wawekaji maelezo wanabonyeza katikati ya kitu; SAM inapendekeza sago; mweka maelezo anakubali au kurekebisha. Waandishi wa SAM wanaripoti kuharakisha kwa injini ya uwekaji maelezo ya takriban mara 6.5 zaidi ya uwekaji lebo unaotegemea poligoni; faida zinatofautiana kati ya aina za mandhari na zana za uwekaji maelezo.

SAM inawakilisha mabadiliko mapana: **jukumu la mweka maelezo linabadilika kutoka kuchora hadi kukagua**. Hii ina athari kwa ubora wa uwekaji maelezo zaidi ya kasi. Wawekaji maelezo wanapochora, umakini wao unashirikiana katika mchakato wote. Wawekaji maelezo wanapokagua na kubonyeza "kukubali," kuna ushahidi kwamba wanakosa makosa kwa urahisi zaidi — toleo la upendeleo wa otomatiki maalum kwa muktadha wa uwekaji maelezo.

---

## Ujifunzaji Tendaji kwa Mwono wa Kompyuta

Ujifunzaji tendaji una thamani sana katika CV kwa sababu:
1. Picha zina vipimo vingi na tajiri — uwakilishi kutoka kwa mifano iliyofunzwa awali hubeba ishara kali za makadirio ya wasiwasi
2. Mabwawa makubwa yasiyowekewa lebo ni ya bei nafuu (picha, fremu za video)
3. Uwekaji maelezo (hasa ugawanyiko) ni ghali na hauwezi kukusanywa kwa urahisi kwa maeneo maalum

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

## Kujifunza Nusu-Usimamizi na Mwongozo wa Binadamu

Wingi mkubwa wa data ya kuona isiyowekewa lebo inayopatikana hufanya kujifunza nusu-usimamizi kuwa na mvuto sana kwa CV.

**Kujifunza binafsi / uwekaji lebo wa picha:** Funza mfano kwenye data yenye lebo; tumia utabiri wa imani ya juu kwenye data isiyowekewa lebo kama lebo za picha; funza tena. Swali muhimu la muundo ni kizingiti cha imani. Kizingiti cha chini kinaileta mifano zaidi lakini kinaanzisha kelele; kizingiti cha juu kuacha sehemu kubwa ya bwawa lisilo na lebo bila kutumika. Ushiriki wa binadamu unaweza kuongoza kizingiti hiki — wawekaji maelezo wanakagua sampuli ya mifano iliyowekewa lebo ya picha kuirekebisha.

**FixMatch na urekebishaji wa uthabiti:** Mbinu hizi zinafunza mifano kutoa utabiri thabiti chini ya ongezeko la data. Ufahamu muhimu wa HITL: binadamu wanashauriwa si tu kwa lebo bali kwa **muundo wa ongezeko la data** — mfano unapaswa kujifunza kutofautiana gani? Mfano kwa picha za kimatibabu unapaswa kuwa wa kudumu kwa mzunguko na mwanga lakini si kwa kiwango; mfano kwa ugunduzi wa maandishi haupaswi kufanywa wa kudumu kwa upotoshaji wa mtazamo. Maamuzi haya maalum ya uwanja yanahitaji utaalamu wa binadamu, na kuyapata vibaya kunapunguza kwa kiasi kikubwa kujifunza nusu-usimamizi.

**Kujifunza tendaji nusu-usimamizi:** Mchanganyiko wa ufanisi zaidi: ujifunzaji tendaji unazingatia lebo za binadamu mahali ambapo wasiwasi wa mfano ni mkubwa zaidi; kujifunza binafsi kunaweka lebo kiotomatiki mkia wa imani wa juu. Juhudi za binadamu zinazingatia mahali ambapo zina thamani zaidi, na mfano unajizindua kwenye iliyobaki. Katika kila mzunguko, ukaguzi wa binadamu wa sampuli ya nasibu ya lebo za picha hutoa ukaguzi wa ubora bila kuhitaji mapitio kamili.

---

## Uwekaji Maelezo wa Video

Uwekaji maelezo wa video huongeza changamoto za uwekaji maelezo wa picha kwa mara ya wakati:

- **Ufuatiliaji:** Vitu lazima vitambuliwe kati ya fremu. Wawekaji maelezo wanaweka lebo kwenye fremu kuu; kanuni za ufuatiliaji huzingatiwa kati yake. Kushindwa kwa ufuatiliaji — kufunikwa, kuingia tena, mwendo wa haraka — kunahitaji kuweka maelezo tena kwa binadamu kwa viwango vya juu kuliko ufuatiliaji wa hali thabiti.
- **Uthabiti wa muda:** Mipaka iliyochorwa katika fremu $t$ inapaswa kuwa thabiti kwa nafasi na fremu $t+1$. Maelezo yasiyothabiti ni ishara ya mafunzo inayomwambia mfano kwamba vitu vinaruka bila mpangilio — aina ya kelele ya uwekaji maelezo inayodhuru hasa kwa mifano ya ugunduzi.
- **Upanuzi:** Video ya saa 1 kwa fps 30 ni fremu 108,000. Uwekaji maelezo kamili si wa vitendo; mikakati ya sampuli lazima ibuniwe kwa makini kuhakikisha kwamba matukio adimu (hali za mipaka, karibu-kosa, hali za kushindwa) hazizuiwi kwa kimfumo.

Zana za kisasa za uwekaji maelezo wa video zinasaidia **ufuatiliaji wa akili** ambao unaeneza maelezo kati ya fremu na kuonyesha fremu ambapo imani ya ufuatiliaji iko chini ya kizingiti, ukimtaka mweka maelezo arudie kukagua. Hii ni matumizi ya moja kwa moja ya wazo la ujifunzaji tendaji kwa mfumo wa uwekaji maelezo yenyewe: zana inauliza mweka maelezo hasa mahali ambapo upangizaji wake una wasiwasi.

**Tatizo la tukio adimu katika mifumo ya uhuru.** Kwa matumizi ambapo matokeo ya matukio adimu ni ya maafa — uendeshaji wa uhuru, urambazaji wa UAV — usambazaji wa fremu zinazopatikana katika uendeshaji wa kawaida unakoana vibaya sana na usambazaji wa fremu zinazohusika zaidi. Mkusanyiko wa data uliojengwa kwa sampuli sawa za picha za uendeshaji utakuwa na fremu milioni za "hakuna kitu cha kuvutisa kinatokea" na chache za karibu-ajali, taa za ajabu, na fremu za sensorer zilizoharibiwa ambazo ndizo muhimu kweli kwa usalama. Ujifunzaji tendaji wa HITL unaotambua na kutanguliza fremu kama hizo si mbinu ya ufanisi — ni mahitaji ya usalama.

```{seealso}
Mkusanyiko wa data wa ImageNet: {cite}`russakovsky2015imagenet`. Upendeleo wa lebo katika ImageNet: {cite}`yang2020towards`. Kipimo cha COCO: {cite}`lin2014microsoft`. SAM (Kukata Kitu Chochote): {cite}`kirillov2023segment`. Ujifunzaji tendaji wa seti ya msingi kwa CV: {cite}`sener2018active`.
```
