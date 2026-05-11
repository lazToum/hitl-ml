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

# Bayanan Bayanai da Lakabi

Lakabi bayanai shine mafi yawaitar nau'in shiga dan adam a ML. Kafin samfuri ya iya koyo, dole ne wani ya gaya masa abin da amsar daidai take — kuma wannan wani galibi dan adam ne. Wannan babi ya ƙunshi ka'idar da aikin lakabi: abin da ke sa lakabi ya yi wuya, yadda za a tsara ayyukan lakabi, yadda za a auna inganci, da yadda za a magance rashin jituwa.

---

## Nau'in Lakabi

Ayyukan lakabi suna bambanta sosai a cikin tsarinsu, wahalarsu, da kuɗinsu. Manyan nau'in sun haɗa da:

### Rarrabuwa

Mai lakabi yana sanya kowane misali zuwa ɗaya daga cikin $K$ rukunan da aka riga aka ƙayyadewa. Wannan mafi sauƙin aikin lakabi ne ta kwamitin tunani, amma ƙayyadewa tsarin rukunan mai kyau (*rarrabuwa*) na iya zama mai ban mamaki wahala.

**Rarrabuwa biyu** (shin wannan hoto cat ne?) shine mafi sauƙin yanayi. **Nau'i da yawa** (wane nau'in dabba shine wannan?) yana buƙatar masu lakabi su zaɓi zaɓi ɗaya daga jeri. **Lakabi nau'i da yawa** (waɗanne batutuwa wannan labarin ya ƙunshi?) yana ba da damar lakabin lokaci guda da yawa.

### Lakabi Jeri

Kowane alamar cikin jeri tana karɓar lakabi. Gane Sunan Wuri (NER) shine misali na gargajiya — masu lakabi suna alamta span na rubutu a matsayin MUTUM, ƘUNGIYA, WURI, dkk. Lakabi galibi ana yi shi ta amfani da tsarin BIO (Farko-Ciki-Waje) ko BIOES:

```text
  B-ORG    O           B-ORG    O     O      O
```

### Span da Lakabi Dangantaka

Bayan yin lakabi ga alamomi ɗaya ɗaya, masu lakabi na iya buƙatar:
- Gano span (maganganu masu alamu da yawa) kuma sanya nau'i
- Alama *dangantaka* tsakanin span ("Apple" SAMU "Shazam")
- Sanya lakabi ga sarƙoƙin coreference (duk ambaton wuri ɗaya)

Waɗannan ayyuka suna da wahala ta kwamitin tunani kuma suna da yarjejeniya ƙasa da masu sanya lakabi.

### Akwatin Iyaka da Gano Abubuwa

Masu lakabi suna zana murabba'i a kusa da abubuwa a cikin hotuna kuma suna sanya lakabi aji ga kowane akwati. Daidaito na gida yana da muhimmanci: akwati mai ƙanƙanta yawancin muhalli; akwati mai girma yana haɗa baya. Kayan aiki na zamani na lakabi suna ƙididdige haɗuwa-akan-ƙungiya (IoU) tare da lakabi na tunani don yin alamar matsalolin inganci.

### Rarrabuwa

Lakabi matakin pixel: kowane pixel yana sanyawa aji (rarrabuwa ta ma'ana) ko zuwa misali na abin musamman (rarrabuwa misali). Rarrabuwa mai inganci na daga cikin mafi tsada nau'in lakabi, tare da kuɗi daga goma zuwa sama da dala ɗari kowace hoto don yanayi masu rikitarwa dangane da yanki da tallafin kayan aiki.

### Rubutu da Fassara

Sauti → rubutu (bayanin horarwa ASR), rubutu mai hannu → rubutu (bayanan OCR), ko harshen tushe → harshen manufa (bayanan MT). Waɗannan ayyuka suna buƙatar ƙwarewa ta harshe kuma ba za a iya yi da aminci ta masu sanya lakabi da ba su samu horo ba.

---

## Jagoran Lakabi

Mafi muhimmin abin da ke ƙayyade ingancin lakabi shine ingancin **jagoran lakabi**: umarni na rubutu da masu lakabi ke bi.

Jagoran mai kyau:
- Ya bayyana manufar aikin kuma ya bayyana *dalilin da ya sa* lakabi yana da muhimmanci
- Ya ba da ma'ana mai bayyana ga kowane rukuni tare da misalai masu kyau da mara kyau
- Ya magance lokuta na iyaka na yau da kullum da lokuta masu wuya a fili
- Ya bayyana abin da za a yi lokacin da ba a tabbata ba (misali, alamar "tsallake" da zaɓin tilas)
- Ya haɗa misalai masu aiki na cikakkiyar lakabi

Jagoran mai muni ya dogara akan masu lakabi don "amfani da hankali na yau da kullum" don lokuta na iyaka — wanda ke haifar da yanke shawara masu karo da juna waɗanda ke raunana ingancin samfuri da kara rashin jituwa tsakanin masu sanya lakabi.

```{admonition} Haɓaka jagoran yana sake zagaye
:class: note

Kada ka yi tsammanin rubuta jagoran cikakke a farko. Gudanar da ƙaramin zagayen lakabi na gwaji, bincika rashin jituwa, kuma sabunta jagoran. Maimaita. Jagoran da aka haɓaka da kyau galibi yana ta cikin zagaye na gyarawa 3–5 kafin su kwantar.
```

---

## Auna Ingancin Lakabi: Yarjejeniyar Tsakanin Masu Sanya Lakabi

Lokacin da masu sanya lakabi da yawa suka yi lakabi ga bayanai ɗaya, ana iya auna yarjejeniyarsu. Yarjejeniya mai ƙari tana ba da shawara aiki an ƙayyadewa da kyau kuma masu sanya lakabi sun fahimce shi. Yarjejeniya ƙasa tana ba da shawara rikitarwa a cikin aiki, jagoran, ko bayanai kanta.

### Kappa na Cohen

Don masu sanya lakabi biyu da ke yin lakabi ga bayanai zuwa $K$ rukunan, **kappa na Cohen** {cite}`cohen1960coefficient` yana gyara yarjejeniyar da aka ga don damari:

$$
\kappa = \frac{P_o - P_e}{1 - P_e}
$$

inda $P_o$ shine ɓangare yarjejeniya da aka ga kuma $P_e$ shine iya yiwuwar yarjejeniya ta damari (an ƙididdige daga rarrabawar lakabi na iyaka).

$\kappa = 1$ yana nufin cikakkiyar yarjejeniya; $\kappa = 0$ yana nufin yarjejeniya ba fi damari ba; $\kappa < 0$ yana nufin rashin jituwa na tsari.

| $\kappa$ iyaka | Fassara             |
|----------------|---------------------|
| $< 0$          | Ƙasa da damari      |
| $0.0 - 0.20$   | Ƙarami              |
| $0.21 - 0.40$  | Mai gaskiya         |
| $0.41 - 0.60$  | Matsakaici          |
| $0.61 - 0.80$  | Muhimmanci          |
| $0.81 - 1.00$  | Kusan cikakke       |

### Kappa na Fleiss

Yana faɗaɗa kappa na Cohen zuwa $M > 2$ masu sanya lakabi. Kowane mai sanya lakabi yana yin lakabi ga kowane item ba tare da wani ba; tsari yana haɗa daga cikin masu sanya lakabi:

$$
\kappa_F = \frac{\bar{P} - \bar{P}_e}{1 - \bar{P}_e}
$$

inda $\bar{P}$ shine matsakaicin yarjejeniyar ma'anar ma'anar juna a duk ma'anar masu sanya lakabi, kuma $\bar{P}_e$ shine yarjejeniyar da ake tsammani ƙarƙashin sanyawa da damari.

### Alpha na Krippendorff

Mafi yawan metric ɗin gaba ɗaya, yana tallafa wa duk yawan masu sanya lakabi, duk nau'in sikelin (suna, tsari, tazara, rabo), da bayanai da bata {cite}`krippendorff2011computing`:

$$
\alpha = 1 - \frac{D_o}{D_e}
$$

inda $D_o$ shine rashin jituwa da aka ga kuma $D_e$ shine rashin jituwa da ake tsammani. Alpha na Krippendorff galibi shine mafi so a aikin ilimi saboda sassaucinsa.

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

## Sarrafa Rashin Jituwa

Lokacin da masu sanya lakabi suka yi rashin jituwa, akwai dabarun da yawa:

### Zaɓin Rinjaye

Ana ɗaukar lakabi mafi yawa a matsayin ma'aunin zinariya. Sauƙi da ƙarfi lokacin da yawan masu sanya lakabi kowace item ba shi ba. Gazawa lokacin da ƙaramin ƙungiya na masu sanya lakabi sun fi daidai ta tsari.

### Zaɓin Nauyi

Ana nauyata masu sanya lakabi ta daidai ta ƙididdigan su (an samo daga yarjejeniya tare da ma'aunin zinariya ko sauran masu sanya lakabi). Masu sanya lakabi mafi daidai suna da tasiri fiye da kima.

### Lakabin Laushi

Maimakon runtuma lakabi zuwa ɗaya, kiyaye rarrabawa. Idan masu sanya lakabi 3 daga cikin 5 sun ce "mai kyau" kuma 2 sun ce "neutral," wakilci wannan a matsayin $(p_\text{pos}, p_\text{neutral}, p_\text{neg}) = (0.6, 0.4, 0.0)$. Horarwa akan lakabin laushi yana inganta ƙididdigan iya yiwuwa.

### Shari'a

Babban mai sanya lakabi ko ƙwararren yanki yana shari'a rashin jituwa. Ma'aunin zinariya amma yana da tsada; galibi ana kiyaye shi don yankuna masu haɗari.

### Samfurin Lissafi

Hanyoyin mafi inganci suna ƙiyana iyawar mai sanya lakabi ta yiwuwar. Tsarin **Dawid-Skene** {cite}`dawid1979maximum` yana ƙididdiga matrices na rikicewar mai sanya lakabi da ma'aunin ƙarshe na item a lokaci ɗaya ta EM. Duba Babi na 13 don cikakkiyar bayanai.

---

## Ƙurar Lakabi da Tasirinta

Lakabi na gaske yana da ƙura. Tasirin ƙurar lakabi akan horarwar samfuri yana dogara kan nau'in ƙura:

- **Ƙura ta damari** (lakabin da aka juye ta damari) yana raunana aiki amma samfurin suna da juriya mai ban mamaki ga matakan matsakaici (har ~20% ga ayyuka da yawa).
- **Ƙura ta tsari/makiya** (lakabin da ke kuskure koyaushe a salon musamman) yana da damashi fiye da kima kuma yana da wahala gano.
- **Ƙura ta yanayin ajin** (kuskure mafi yiwuwa ga aji musamman) yana nuna iyakar yanke shawara na samfuri.

Ƙa'idar amfani ta aiki: tare da $n$ misalin horarwa da ɓangare $\epsilon$ na lakabin lalace, aiki na samfuri yana raguwa kusan kamar dai kana da $(1 - 2\epsilon)^2 n$ misalan tsabta {cite}`natarajan2013learning`. Don $\epsilon = 0.2$, wannan daidai yake da rasa kashi 36% na bayananku.

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

## Kuɗin Lakabi da Gudu

Fahimtar tattalin arzikin lakabi yana da mahimmanci don tsare-tsaren aiki.

| Nau'in aiki                    | Gudu na yau da kullum | Kuɗi kowace item (ƙwararru) |
|--------------------------------|----------------------|------------------------------|
| Rarrabuwa hoto biyu            | 200–500/hr           | $0.02–0.10                   |
| NER (rubutu gajere)            | 50–150 items/hr      | $0.10–0.50                   |
| Fitar da dangantaka            | 20–60 items/hr       | $0.30–1.50                   |
| Rarrabuwa hoto likitanci       | 5–30 items/hr        | $10–100                      |
| Lakabi bidiyo                  | 5–20 min bidiyo/hr   | $20–200                      |

Waɗannan alkaluma ƙiyasin girma ne na kusan kuma suna bambanta sosai ta ƙwarewa da ake buƙata, ingancin kayan aiki na lakabi, bayyanar jagoran, da kwarewa na mai sanya lakabi. Ya kamata a ɗauke su a matsayin misali, ba umarnin ƙa'ida ba.

```{seealso}
Zaɓuɓɓukan kayan aiki na lakabi an ƙunshi su a Babi na 12. Samfurin lissafi don lakabi na taron aiki (Dawid-Skene, MACE) an ƙunshi su a Babi na 13.
```
