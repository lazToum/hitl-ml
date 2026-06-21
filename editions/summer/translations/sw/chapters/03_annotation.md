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

# Uwekaji Maelezo na Ulabelishaji wa Data

Uwekaji maelezo wa data ni aina ya kawaida zaidi ya ushiriki wa binadamu katika ML. Kabla mfano haujaweza kujifunza, mtu lazima auambie majibu sahihi ni nini — na mtu huyo kawaida ni binadamu. Sura hii inashughulikia nadharia na mazoezi ya uwekaji maelezo: kinachofanya uwekaji maelezo kuwa mgumu, jinsi ya kubuni kazi za uwekaji maelezo, jinsi ya kupima ubora, na jinsi ya kushughulikia kutokubaliana.

---

## Aina za Uwekaji Maelezo

Kazi za uwekaji maelezo zinatofautiana sana katika muundo, ugumu, na gharama. Aina kuu ni pamoja na:

### Uainishaji

Mweka maelezo humweka kila kipengele katika moja ya kategoria $K$ zilizofafanuliwa awali. Hii ndiyo kazi rahisi zaidi ya uwekaji maelezo kiakili, lakini kubuni mpango mzuri wa kategoria (*uainishaji*) kunaweza kuwa gumu kushangaza.

**Uainishaji wa binary** (je, picha hii ni paka?) ni kesi rahisi zaidi. **Uainishaji wa darasa nyingi** (ni spishi gani ya mnyama huyu?) unahitaji wawekaji maelezo kuchagua chaguo moja kutoka kwa orodha. Uwekaji maelezo wa **lebo nyingi** (mada zipi zinahusika katika makala hii?) huruhusu lebo nyingi kwa wakati mmoja.

### Uwekaji Lebo kwa Mfululizo

Kila tokeni katika mfululizo hupokea lebo. Utambuzi wa Maneno Maalum (NER) ni mfano wa kawaida — wawekaji maelezo huweka alama kwenye vipande vya maandishi kama MTU, SHIRIKA, MAHALI, n.k. Uwekaji maelezo kawaida hufanywa kwa kutumia mpango wa uwekaji lebo wa BIO (Mwanzo-Ndani-Nje) au BIOES:

```text
  B-ORG    O           B-ORG    O     O      O
```

### Uwekaji Maelezo wa Vipande na Mahusiano

Zaidi ya kuweka lebo kwenye tokeni moja moja, wawekaji maelezo wanaweza kuhitajika:
- Kutambua vipande (maneno mengi ya pamoja) na kutoa aina
- Kuweka alama kwenye *mahusiano* kati ya vipande ("Apple" ILINUNUA "Shazam")
- Kuweka maelezo kwenye minyororo ya rejeleo (matajio yote ya kitengo kimoja)

Kazi hizi zinahitaji nguvu za kiakili na zina makubaliano ya chini ya wawekaji maelezo.

### Sanduku za Mipaka na Ugunduzi wa Vitu

Wawekaji maelezo huchora mstatili karibu na vitu katika picha na kutoa lebo ya kategoria kwa kila sanduku. Usahihi wa mahali unahusika: sanduku dogo sana linapoteza muktadha; sanduku kubwa sana linajumuisha mandhari ya nyuma. Zana za kisasa za uwekaji maelezo huhesabu makutano-juu-ya-muungano (IoU) na maelezo ya marejeleo ili kupata matatizo ya ubora.

### Ugawanyiko

Uwekaji maelezo wa kiwango cha pikseli: kila pikseli imepangwa kwenye darasa (ugawanyiko wa kisemantiki) au kwa kitengo maalum cha kitu (ugawanyiko wa kitengo). Ugawanyiko wa ubora wa juu ni kati ya aina za uwekaji maelezo zenye gharama kubwa zaidi, na gharama zinaanzia makumi hadi zaidi ya dola mia moja kwa picha kwa matukio magumu kulingana na uwanja na msaada wa zana.

### Unukuzi na Utafsiri

Sauti → maandishi (data ya mafunzo ya ASR), maandishi ya mkono → maandishi (data ya OCR), au lugha chanzo → lugha lengwa (data ya MT). Kazi hizi zinahitaji utaalamu wa lugha na haziwezi kufanywa kwa uaminifu na wawekaji maelezo wasio na mafunzo.

---

## Mwongozo wa Uwekaji Maelezo

Kipengele kimoja muhimu zaidi kinachoweza kuamua ubora wa uwekaji maelezo ni ubora wa **mwongozo wa uwekaji maelezo**: maelekezo yaliyoandikwa ambayo wawekaji maelezo wanafuata.

Mwongozo mzuri:
- Unaeleza lengo la kazi na kueleza *kwa nini* lebo ina umuhimu
- Unatoa ufafanuzi wazi kwa kila kategoria na mifano chanya na hasi
- Unashughulikia waziwazi hali za mipaka za kawaida na ngumu
- Unabainisha kufanya nini wakati wa wasiwasi (k.m., weka alama "ruka" dhidi ya chaguo la kulazimishwa)
- Unajumuisha mifano iliyofanyiwa kazi ya uwekaji maelezo kamili

Mwongozo mbaya unategemea wawekaji maelezo "kutumia akili ya kawaida" kwa hali za mipaka — ambayo husababisha maamuzi yasiyo ya uthabiti yanayopunguza ubora wa mfano na kuongeza kutokubaliana kwa wawekaji maelezo.

```{admonition} Maendeleo ya mwongozo ni ya mzunguko
:class: note

Usitarajie kuandika mwongozo kamili tangu mwanzo. Fanya raundi ndogo ya majaribio ya uwekaji maelezo, changanua kutokubaliana, na sasisha mwongozo. Rudia. Mwongozo ulioendelezwa vizuri kawaida hupitia mzunguko wa marekebisho 3–5 kabla ya kutulia.
```

---

## Kupima Ubora wa Uwekaji Maelezo: Makubaliano ya Wawekaji Maelezo

Wawekaji maelezo wengi wanapoweka lebo kwa data sawa, makubaliano yao yanaweza kupimwa. Makubaliano ya juu yanaonyesha kazi imefafanuliwa vizuri na wawekaji maelezo waliielewa. Makubaliano ya chini yanaonyesha utata katika kazi, mwongozo, au data yenyewe.

### Kappa ya Cohen

Kwa wawekaji maelezo wawili wanaoweka lebo kwa data katika kategoria $K$, **kappa ya Cohen** {cite}`cohen1960coefficient` inarekebisha makubaliano yanayoonekana kwa nafasi:

$$
\kappa = \frac{P_o - P_e}{1 - P_e}
$$

ambapo $P_o$ ni makubaliano ya sehemu yanayoonekana na $P_e$ ni uwezekano wa makubaliano kwa nafasi (imehesabiwa kutoka kwa usambazaji wa lebo za pembeni).

$\kappa = 1$ inamaanisha makubaliano kamili; $\kappa = 0$ inamaanisha makubaliano si bora kuliko nafasi; $\kappa < 0$ inamaanisha kutokubaliana kwa kimfumo.

| Upeo wa $\kappa$ | Tafsiri              |
|------------------|----------------------|
| $< 0$            | Chini ya nafasi      |
| $0.0 - 0.20$     | Ndogo                |
| $0.21 - 0.40$    | Ya wastani           |
| $0.41 - 0.60$    | Ya kati              |
| $0.61 - 0.80$    | Kubwa                |
| $0.81 - 1.00$    | Karibu kamili        |

### Kappa ya Fleiss

Inapanua kappa ya Cohen kwa $M > 2$ wawekaji maelezo. Kila mweka maelezo huweka lebo kwa kila kipengele kwa kujitegemea; formula inajumuisha kati ya wawekaji maelezo:

$$
\kappa_F = \frac{\bar{P} - \bar{P}_e}{1 - \bar{P}_e}
$$

ambapo $\bar{P}$ ni wastani wa makubaliano ya jozi kati ya jozi zote za wawekaji maelezo, na $\bar{P}_e$ ni makubaliano yanayotarajiwa chini ya mgawanyiko wa nasibu.

### Alpha ya Krippendorff

Kipimo cha jumla zaidi, kinachosaidia idadi yoyote ya wawekaji maelezo, aina yoyote ya kipimo (nomino, mpangilio, nafasi, uwiano), na data inayokosekana {cite}`krippendorff2011computing`:

$$
\alpha = 1 - \frac{D_o}{D_e}
$$

ambapo $D_o$ ni kutokubaliana kunakoonekana na $D_e$ ni kutokubaliana kunakotarajiwa. Alpha ya Krippendorff kwa ujumla inapendelewa katika kazi za kitaaluma kwa sababu ya unyumbufu wake.

```{code-cell} python
import numpy as np
from sklearn.metrics import cohen_kappa_score

# Simulate two annotators labeling 200 items into 3 categories
rng = np.random.default_rng(0)
true_labels = rng.integers(0, 3, size=200)

# Annotator 1: mostly agrees with ground truth
ann1 = true_labels.copy()
flip_mask = rng.random(200) < 0.15
ann1[flip_mask] = rng.integers(0, 3, size=flip_mask.sum())

# Annotator 2: less consistent
ann2 = true_labels.copy()
flip_mask2 = rng.random(200) < 0.30
ann2[flip_mask2] = rng.integers(0, 3, size=flip_mask2.sum())

kappa_12 = cohen_kappa_score(ann1, ann2)
kappa_1true = cohen_kappa_score(ann1, true_labels)
kappa_2true = cohen_kappa_score(ann2, true_labels)

print(f"Cohen's κ (ann1 vs ann2):   {kappa_12:.3f}")
print(f"Cohen's κ (ann1 vs truth):  {kappa_1true:.3f}")
print(f"Cohen's κ (ann2 vs truth):  {kappa_2true:.3f}")
```

---

## Kushughulikia Kutokubaliana

Wawekaji maelezo wanapokosoa, kuna mikakati kadhaa:

### Kura ya Wingi

Lebo ya kawaida zaidi inachukuliwa kama kiwango cha dhahabu. Rahisi na imara wakati idadi ya wawekaji maelezo kwa kipengele ni ya ajabu. Inashindwa wakati kikundi kidogo cha wawekaji maelezo ni sahihi zaidi kwa kimfumo.

### Upigaji Kura wa Uzito

Wawekaji maelezo wanapewa uzito kulingana na usahihi wao uliokadirika (unaotokana na makubaliano na kiwango cha dhahabu au wawekaji maelezo wengine). Wawekaji maelezo sahihi zaidi wana ushawishi zaidi.

### Lebo Laini

Badala ya kupiga chini maelezo hadi lebo moja, hifadhi usambazaji. Kama 3 kati ya wawekaji maelezo 5 walisema "chanya" na 2 walisema "wastani," iwakilishe kama $(p_\text{chanya}, p_\text{wastani}, p_\text{hasi}) = (0.6, 0.4, 0.0)$. Mafunzo kwenye lebo laini yanaboresha urekebishaji.

### Usuluhishi

Mweka maelezo mwandamizi au mtaalamu wa uwanja anasuluhisha kutokubaliana. Kiwango cha dhahabu lakini ghali; kawaida huhifadhiwa kwa maeneo yenye hatari kubwa.

### Mifano ya Takwimu

Mbinu za kisasa zaidi zinaiga uwezo wa wawekaji maelezo kwa uwezekano. Mfano wa **Dawid-Skene** {cite}`dawid1979maximum` unakadiri wakati mmoja matrices za mkanganyiko za wawekaji maelezo na lebo za kweli za kipengele kupitia EM. Angalia Sura ya 13 kwa maelezo zaidi.

---

## Kelele za Lebo na Athari Zake

Uwekaji maelezo wa kweli una kelele. Athari za kelele za lebo kwenye mafunzo ya mfano zinategemea aina ya kelele:

- **Kelele za nasibu** (lebo zinazogeuzwa bila mpangilio) zinapunguza utendaji lakini mifano ina ustahimilivu wa kushangaza kwa viwango vya wastani (hadi ~20% kwa kazi nyingi).
- **Kelele za kimfumo/za adui** (lebo zisizo sahihi kwa njia maalum) ni za kudhuru zaidi na ngumu kugundua.
- **Kelele za masharti ya darasa** (makosa yanayowezekana zaidi kwa madarasa fulani) yanabagua mpaka wa uamuzi wa mfano.

Kanuni ya vitendo ya kawaida: na mifano $n$ ya mafunzo na sehemu $\epsilon$ ya lebo zilizoharibiwa, utendaji wa mfano unapungua takriban kama vile una mifano $(1 - 2\epsilon)^2 n$ safi {cite}`natarajan2013learning`. Kwa $\epsilon = 0.2$, hii inafanana na kupoteza 36% ya data yako.

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(42)
X, y = make_classification(n_samples=2000, n_features=20, random_state=42)

noise_levels = np.linspace(0, 0.45, 15)
mean_accs = []

for eps in noise_levels:
    y_noisy = y.copy()
    flip = rng.random(len(y)) < eps
    y_noisy[flip] = 1 - y_noisy[flip]
    scores = cross_val_score(LogisticRegression(max_iter=500), X, y_noisy, cv=5)
    mean_accs.append(scores.mean())

plt.figure(figsize=(7, 4))
plt.plot(noise_levels, mean_accs, 'o-', color='#2b3a8f', linewidth=2)
plt.xlabel("Label noise rate (ε)", fontsize=12)
plt.ylabel("Cross-validated accuracy", fontsize=12)
plt.title("Effect of Label Noise on Model Performance", fontsize=13)
plt.axvline(0.2, color='#e05c5c', linestyle='--', alpha=0.7, label='20% noise')
plt.legend()
plt.tight_layout()
plt.savefig('label_noise_effect.png', dpi=150)
plt.show()
print(f"\nAccuracy at 0% noise:  {mean_accs[0]:.3f}")
print(f"Accuracy at 20% noise: {mean_accs[round(0.2 / 0.45 * 14)]:.3f}")
print(f"Accuracy at 40% noise: {mean_accs[-2]:.3f}")
```

---

## Gharama ya Uwekaji Maelezo na Kiwango cha Uzalishaji

Kuelewa uchumi wa uwekaji maelezo ni muhimu kwa mipango ya mradi.

| Aina ya kazi                      | Kiwango cha kawaida cha uzalishaji | Gharama kwa kipengele (mtaalamu) |
|-----------------------------------|------------------------------------|----------------------------------|
| Uainishaji wa binary wa picha     | 200–500/saa                        | $0.02–0.10                       |
| NER (maandishi mafupi)            | Vipengele 50–150/saa               | $0.10–0.50                       |
| Uchimbaji wa mahusiano            | Vipengele 20–60/saa                | $0.30–1.50                       |
| Ugawanyiko wa picha ya kimatibabu | Vipengele 5–30/saa                 | $10–100                          |
| Uwekaji maelezo wa video          | Dakika 5–20 za video/saa           | $20–200                          |

Takwimu hizi ni makadirio ya takriban ya mpangilio wa ukubwa na zinatofautiana sana kulingana na utaalamu wa uwanja unaohitajika, ubora wa zana ya uwekaji maelezo, uwazi wa mwongozo, na uzoefu wa mweka maelezo. Zinapaswa kuchukuliwa kama za mwanga, si kama za amri.

```{seealso}
Chaguo za zana za uwekaji maelezo zimeshughulikiwa katika Sura ya 12. Mifano ya takwimu kwa uwekaji maelezo wa ushirikiano wa umma (Dawid-Skene, MACE) imeshughulikiwa katika Sura ya 13.
```
