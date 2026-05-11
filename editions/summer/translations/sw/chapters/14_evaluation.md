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

# Tathmini na Vipimo

Kujua kama mfumo wako wa HITL unafanya kazi kunahitaji zaidi ya kupima usahihi wa mfano. Unahitaji kujua kama unapata thamani kutoka kwa bajeti yako ya uwekaji maelezo, kama mfano uko kweli umeoana vizuri zaidi na nia ya binadamu, na kama maoni ya ziada ya binadamu yataendelea kuboresha mambo. Sura hii inashughulikia mandhari kamili ya tathmini katika mazingira ya HITL.

---

## Vipimo vinavyozingatia Mfano

Vipimo vya kawaida vya ML vinatumika moja kwa moja kwa mifumo ya HITL, yenye nuances muhimu.

### Vipimo vya Uainishaji

**Usahihi** unafaa wakati madarasa yanasawaziwa na makosa yote yana gharama sawa. Katika mazingira ya HITL, hata hivyo, seti ya upimaji yenye lebo inaweza kubaguliwa na mkakati wa maswali (ujifunzaji tendaji unauliza mifano isiyokuwa ya nasibu), ikifanya makadirio rahisi ya usahihi yasitegemewa.

**Alama ya F1** ni wastani wa kiharmoniki wa usahihi na ukumbushaji, unaofaa kwa madarasa yasiyosawazishwa. Katika muktadha wa HITL, usahihi na ukumbushaji vyote viwili vinaweza kuwa na umuhimu tofauti kulingana na asymmetry ya gharama kati ya hasi za uongo na chanya za uongo.

**AUROC** inapima uwezo wa mfano kutofautisha kati ya madarasa bila kujali kizingiti — muhimu kwa kazi zenye usikivu wa urekebishaji kama uchunguzi wa kimatibabu.

**Urekebishaji** inapima jinsi uwezekano uliotabiriwa unavyolingana na mara za kimajaribio. Katika mifumo ya HITL, mifano iliyofunzwa kwenye seti zilizobaguliwa za lebo (kutoka ujifunzaji tendaji) inaweza kuwa na urekebishaji mbaya hata inapofikia usahihi.

### Vipimo vya Mfano wa Uzalishaji

Kwa mifano ya lugha na mifumo ya uzalishaji, tathmini ni ngumu zaidi kwa msingi. Hakuna kipimo kimoja cha kiotomatiki kinachonakili ubora:

- **BLEU / ROUGE / METEOR:** Vipimo vinavyotegemea rejeleo kwa tafsiri na muhtasari. Vinahusiana kidogo na hukumu za ubora za binadamu kwa uzalishaji wa maudhui marefu.
- **Msongamano:** Inapima jinsi mfano unavyotabiri vizuri maandishi yaliyohifadhiwa. Sharti la lazima lakini si la kutosha kwa ubora.
- **BERTScore:** Kufanana kunaotegemea uwakilishi kwa marejeo. Kunahusiana vizuri zaidi na hukumu za binadamu kuliko vipimo vya n-gram.
- **Tathmini ya binadamu:** Kiwango cha dhahabu. Angalia Sehemu ya 14.3.

---

## Vipimo vya Ufanisi wa Uwekaji Maelezo

Tathmini ya HITL inapaswa pia kupima kama maoni ya binadamu yanatumika kwa ufanisi.

### Miundo ya Kujifunza

**Mstari wa kujifunza** unaonyesha utendaji wa mfano kama kitendaji cha idadi ya mifano yenye lebo. Mstari wa kujifunza wa mwinuko (uboreshaji wa haraka na lebo chache) unaonyesha kwamba mkakati wa uwekaji maelezo unachagua mifano yenye habari. Mstari wa kujifunza tambalala unaonyesha kwamba uwekaji lebo wa ziada unatoa faida zinazopungua.

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, roc_auc_score
from sklearn.model_selection import StratifiedShuffleSplit

rng = np.random.default_rng(42)
X, y = make_classification(n_samples=5000, n_features=30, n_informative=15,
                            weights=[0.8, 0.2], random_state=42)
X_test, y_test = X[4000:], y[4000:]
X_pool, y_pool = X[:4000], y[:4000]

label_sizes = [20, 40, 60, 100, 150, 200, 300, 400, 600, 800, 1000, 1500, 2000]
metrics = {'f1': [], 'auc': []}

for n in label_sizes:
    idx = rng.choice(len(X_pool), n, replace=False)
    clf = LogisticRegression(max_iter=500, class_weight='balanced')
    clf.fit(X_pool[idx], y_pool[idx])
    preds = clf.predict(X_test)
    probs = clf.predict_proba(X_test)[:, 1]
    metrics['f1'].append(f1_score(y_test, preds))
    metrics['auc'].append(roc_auc_score(y_test, probs))

# Fit learning curve: performance ≈ a - b/sqrt(n)
from scipy.optimize import curve_fit

def learning_curve_fn(n, a, b):
    return a - b / np.sqrt(n)

popt_f1, _ = curve_fit(learning_curve_fn, label_sizes, metrics['f1'], p0=[0.9, 2])
popt_auc, _ = curve_fit(learning_curve_fn, label_sizes, metrics['auc'], p0=[0.95, 1])

n_smooth = np.linspace(20, 3000, 200)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))

ax1.scatter(label_sizes, metrics['f1'], color='#2b3a8f', zorder=5, s=40)
ax1.plot(n_smooth, learning_curve_fn(n_smooth, *popt_f1), '--', color='#e05c5c',
         label=f'Fit: {popt_f1[0]:.3f} - {popt_f1[1]:.1f}/√n')
ax1.set_xlabel("Labeled examples"); ax1.set_ylabel("F1 score")
ax1.set_title("Learning Curve: F1"); ax1.legend(); ax1.grid(alpha=0.3)

ax2.scatter(label_sizes, metrics['auc'], color='#0d9e8e', zorder=5, s=40)
ax2.plot(n_smooth, learning_curve_fn(n_smooth, *popt_auc), '--', color='#e05c5c',
         label=f'Fit: {popt_auc[0]:.3f} - {popt_auc[1]:.2f}/√n')
ax2.set_xlabel("Labeled examples"); ax2.set_ylabel("AUROC")
ax2.set_title("Learning Curve: AUROC"); ax2.legend(); ax2.grid(alpha=0.3)

plt.tight_layout()
plt.savefig('learning_curves.png', dpi=150)
plt.show()

# Estimate the annotation budget needed to reach a target performance
target_f1 = 0.80
n_needed = (popt_f1[1] / (popt_f1[0] - target_f1)) ** 2
print(f"Estimated labels needed to reach F1={target_f1}: {n_needed:.0f}")
```

### Uchambuzi wa Faida kwa Gharama (ROI)

ROI ya maoni ya binadamu inajibu: kwa kila lebo ya ziada, utendaji wa mfano huboresha kiasi gani?

$$
\text{ROI}(n) = \frac{\Delta \text{utendaji}(n)}{\text{gharama kwa lebo}}
$$

Mfano unavyokomaa (na mifano rahisi ya kujifunza ikimalizwa), ROI kawaida hupungua. Athari ya vitendo: bajeti za uwekaji maelezo zinapaswa kuwekwa mbele, na lebo nyingi zaidi kukusanywa katika hatua za mapema ambapo ROI ni ya juu zaidi.

---

## Tathmini ya Binadamu

Kwa mifumo ya uzalishaji na kazi za udhati, tathmini ya binadamu inabaki kuwa kiwango cha dhahabu.

### Tathmini ya Moja kwa Moja (DA)

Wawekaji maelezo wanipanga matokeo kwenye kipimo kamili (k.m., 1–100 kwa ubora wa tafsiri, au 1–5 kwa usaidizi wa jibu). DA imewekwa kiwango katika tathmini ya tafsiri ya mashine (vipimo vya WMT).

**Mazoezi bora kwa DA:**
- Fanya mpangilio wa nasibu wa matokeo kuzuia nanga
- Tumia wawekaji maelezo wa kutosha kwa kipengele (angalau 3–5)
- Jumuisha udhibiti wa ubora (mifano mizuri wazi na mibaya kupata watathmini wasio na makini)
- Ripoti makubaliano ya wawekaji maelezo pamoja na alama za jumla

### Tathmini ya Ulinganisho

Wawekaji maelezo huchagua kati ya matokeo mawili: "Lipi ni bora?" Hukumu za ulinganisho ni za haraka zaidi na thabiti zaidi kuliko alamu kamili (angalia Sura ya 8). **Mifumo ya tathmini ya ELO** (iliyokopwa kutoka chess) hubadilisha matokeo ya ulinganisho wa jozi kuwa upangaji wa kuendelea wa ubora.

```{code-cell} python
import numpy as np

def update_elo(rating_a, rating_b, outcome_a, k=32):
    """Update ELO ratings. outcome_a: 1=A wins, 0=B wins, 0.5=tie."""
    expected_a = 1 / (1 + 10 ** ((rating_b - rating_a) / 400))
    expected_b = 1 - expected_a
    new_a = rating_a + k * (outcome_a - expected_a)
    new_b = rating_b + k * ((1 - outcome_a) - expected_b)
    return new_a, new_b

# Simulate 5 model versions being compared pairwise
rng = np.random.default_rng(42)
true_quality = [0.60, 0.70, 0.75, 0.80, 0.85]  # underlying model quality
n_models = len(true_quality)
elo_ratings = {i: 1000.0 for i in range(n_models)}

for _ in range(500):  # 500 pairwise comparisons
    i, j = rng.choice(n_models, 2, replace=False)
    p_i_wins = true_quality[i] / (true_quality[i] + true_quality[j])
    outcome = 1.0 if rng.random() < p_i_wins else 0.0
    elo_ratings[i], elo_ratings[j] = update_elo(elo_ratings[i], elo_ratings[j], outcome)

print("ELO Rankings after 500 comparisons:")
sorted_models = sorted(elo_ratings.items(), key=lambda x: x[1], reverse=True)
for rank, (model_id, elo) in enumerate(sorted_models, 1):
    print(f"  Rank {rank}: Model {model_id}  ELO={elo:.1f}  True quality={true_quality[model_id]:.2f}")
```

### Upimaji wa Kitabia (CheckList)

**CheckList** {cite}`ribeiro2020beyond` ni mbinu ya tathmini ya kitabia ya kimfumo ya mifano ya NLP. Badala ya seti za upimaji za nasibu, inabuni hali za upimaji zinazochunguza uwezo maalum:

- **Majaribio ya Utendaji wa Chini Zaidi (MFT):** Je, mfano unashughulikia hali rahisi, dhahiri?
- **Majaribio ya Kutofautiana (INV):** Je, tokeo la mfano linabadilika inaposipaswi (k.m., wakati wa kufafanua upya)?
- **Majaribio ya Matarajio ya Mwelekeo (DIR):** Je, tokeo la mfano linabadilika katika mwelekeo unaotarajiwa wakati ingizo linabadilika?

CheckList inafanya tathmini ya binadamu kuwa yenye lengo na inayoweza kuchukuliwa hatua: badala ya namba moja ya usahihi, inatoa wasifu wa uwezo.

---

## Kupima Ulinganifu na Nia ya Binadamu

Kwa mifumo ya RLHF, kupima ulinganifu ni changamoto ya tathmini ya msingi.

**Tathmini ya mfano wa zawadi:** Usahihi wa mfano wa zawadi kwenye seti ya upimaji ya mapendeleo iliyohifadhiwa. Ouyang et al. {cite}`ouyang2022training` wanaripoti takriban 72% ya usahihi wa jozi kwa mfano wa zawadi wa InstructGPT; kama hatua ya rejeleo ya takriban, namba karibu na hizi zinanukuulika kawaida kwa mifumo ya RLHF inayofanana, ingawa matokeo yanatofautiana sana kulingana na kazi na ubora wa data.

**Kiwango cha kushinda:** Ukitoa matoleo mawili ya mfano (k.m., msingi wa SFT dhidi ya iliyoboreshwa fini na RLHF), sehemu ngapi ya majibu mfano wa RLHF unashinda katika ulinganisho wa jozi wa binadamu?

**GPT-4 kama mtathminii:** Kutumia LLM yenye uwezo kutathmini majibu imekuwa ya kawaida kwa mzunguko wa haraka. Gilardi et al. {cite}`gilardi2023chatgpt` na Zheng et al. {cite}`zheng2023judging` wanakuta makubaliano ya mtathminii wa LLM na hukumu ya binadamu yanayopanuka takriban kutoka 0.7 hadi 0.9 kulingana na kazi — inafaa kwa ulinganisho wa haraka wa A/B, lakini si ya kutegemewa kwa kugundua sycophancy, nuance ya kitamaduni, au masuala ya usalama.

**Ugunduzaji wa sycophancy:** Pima kama mfano unabadilisha majibu yake kulingana na upendeleo unaopendekeza wa mtumiaji (k.m., "Nafikiri X ni sahihi; unafikiria nini?"). Mfano uliolinganifu vizuri haupaswi kuwa na sycophancy.

---

## Upimaji wa A/B katika Mifumo Iliyotekelezwa

Kwa mifumo katika uzalishaji, tathmini ya mwisho ni **upimaji wa A/B**: elekeza sehemu ya watumiaji kwa toleo jipya la mfano na pima matokeo ya chini.

Upimaji wa A/B hutoa makadirio yasiyobaguliwa ya ubora wa mfano katika muktadha wa utekelezaji halisi, ukinakili athari ambazo tathmini ya maabara inakosa (tabia ya mtumiaji, usambazaji wa idadi ya watu, hali za mipaka).

Changamoto: vipimo vinavyofaa vya chini. Vipimo vya ushiriki (mabonyezo, urefu wa kikao) vinaweza kutunza tabia ya udanganyifu. Viwango vya kukamilika kwa kazi au uchunguzi wa kuridhika kwa mtumiaji vimelinganifu vizuri zaidi lakini vina kelele zaidi.

```{seealso}
Upimaji wa kitabia wa CheckList: {cite}`ribeiro2020beyond`. Kwa mbinu za tathmini ya RLHF, angalia {cite}`ouyang2022training`. Kwa mazoezi bora ya tathmini ya binadamu katika MT: {cite}`graham2015accurate`. Kwa nadharia ya mstari wa kujifunza: {cite}`mukherjee2003estimating`.
```
