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

# Kimantawa da Ma'aunai

Sanin ko tsarin HITL ɗinka yana aiki yana buƙatar fiye da auna daidaito na samfuri. Kana buƙatar sanin ko kana samun darajar daga kasafin kuɗin lakabinka, ko samfuri ya fi dacewa gaske da nufin dan adam, da kuma ko ra'ayin dan adam ƙari zai ci gaba da inganta abubuwa. Wannan babi ya ƙunshi shimfidar cikakkiyar kimantawa a cikin yanayi na HITL.

---

## Ma'aunai na Tsakiyar Samfuri

Ma'aunai na ML na yau da kullum suna aiki kai tsaye ga tsarin HITL, tare da wasu abubuwa masu muhimmanci.

### Ma'aunai na Rarrabuwa

**Daidaito** yana dacewa lokacin da aji suke daidaito kuma duk kurakurai suna da kuɗi ɗaya. A cikin yanayi na HITL, ko da yake, saitin gwaji da aka yi lakabi na iya kasancewa mara daidaito ta dabarun tambaya (tambayoyi na koyon aiki ba su daidai ba), yana mai da ƙiyasin daidaito mara aminci.

**Maki F1** shine matsakaicin harmonic na daidaito da koma-ga-asali, wanda ya dace don aji mara daidaito. A cikin mahallin HITL, daidaito da koma-ga-asali duka na iya yin muhimmanci daban-daban dangane da rashin daidaito na kuɗi tsakanin kararan karya mara kyau da kararan karya mai kyau.

**AUROC** yana auna damar samfuri don bambanta tsakanin aji ba tare da la'akari da iyaka ba — muhimmanci don ayyuka masu ma'ana ta ƙididdigan iya yiwuwa kamar tantancewa na likitanci.

**Daidaitar ƙididdigan** yana auna yadda iya yiwuwar da aka hasashe suka dace da yawan gwaji na gwaji. A cikin tsarin HITL, samfurin da aka horar akan saitin da aka yi lakabi mara daidaito (daga koyon aiki) na iya kasancewa mara daidai ko da daidai ne.

### Ma'aunai ta Samfurin Generative

Don samfurin harshe da tsarin generative, kimantawa yana da wuya ta asali. Babu wani metric ɗin ta atomatik ɗaya wanda ke kama inganci:

- **BLEU / ROUGE / METEOR:** Ma'aunai bisa tunani don fassara da takaitawa. Yana dacewa da ƙarancin daidaito da hukunci na inganci na dan adam don ƙirƙira tsawo.
- **Perplexity:** Yana auna yadda samfuri ke hasashen rubutu da aka ɗaure. Yanayin dole amma ba ya isa don inganci.
- **BERTScore:** Kamancin bisa embedding zuwa tunani. Yana dacewa mafi daidaito da hukunci na dan adam fiye da ma'aunai n-gram.
- **Kimantawar dan adam:** Ma'aunin zinariya. Duba Sashe na 14.3.

---

## Ma'aunai na Ingancin Lakabi

Kimantawar HITL ya kamata kuma ta auna ko ake amfani da ra'ayin dan adam yadda ya kamata.

### Curves na Koyo

**Curve na koyo** yana zana aiki na samfuri a matsayin ayyuka na yawan misalin da aka yi lakabi. Curve mai tsananin girma (ingancin da sauri tare da lakabin kaɗan) yana nuna cewa dabarun lakabi suna zaɓar misalai masu bayanai. Curve mai filefilen yana nuna cewa lakabi ƙari yana ba da raguwar dawo.

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

### Bincike na Dawo kan Zuba Jari (ROI)

ROI na ra'ayin dan adam yana amsa: don kowane lakabi ƙari, nawa aiki na samfuri yana inganta?

$$
\text{ROI}(n) = \frac{\Delta \text{performance}(n)}{\text{cost per label}}
$$

Yayin da samfuri ya nuna (kuma yayin da misalan mafi sauƙin koyo suka ƙare), ROI galibi yana raguwa. Abubuwa masu amfani na aiki: ya kamata a sanya kasafin kuɗin lakabi a farkon, tare da lakabin fiye da kima da aka tattara a matakai na farko lokacin da ROI ya kasance mafi ƙari.

---

## Kimantawar Dan Adam

Don tsarin generative da ayyuka na son zuciya, kimantawar dan adam har yanzu ita ce ma'aunin zinariya.

### Kimantawa Kai Tsaye (DA)

Masu sanya lakabi suna ƙididdiga sakamakon akan sikeli na cikakke (misali, 1–100 don ingancin fassara, ko 1–5 don taimako na amsa). DA ta kasance ta daidaita a cikin kimantawar fassara ta injin (ma'aunai WMT).

**Mafi kyau na aiki don DA:**
- Bazata tsarin sakamakon don hana anchoring
- Yi amfani da adadin mai sanya lakabi masu isa kowace item (ƙaranci 3–5)
- Haɗa sarrafa inganci (misalai bayyananne masu kyau da mara kyau don kama masu ƙididdiga ba su kula ba)
- Ruwaito yarjejeniya tsakanin masu sanya lakabi tare da maki haɗe

### Kimantawa na Kwatancen

Masu sanya lakabi suna zaɓar tsakanin sakamakon biyu: "Wanne ya fi?" Hukunci na kwatancen suna da sauri da daidaito fiye da ƙididdigan cikakke (duba Babi na 8). **Tsarin ƙididdigan ELO** (an aro daga chess) yana canza sakamakon kwatancen biyu biyu zuwa matsayin inganci na ci gaba.

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

### Gwajin Ɗabi'a (CheckList)

**CheckList** {cite}`ribeiro2020beyond` hanya ce don kimantawar ɗabi'a ta tsari na samfurin NLP. Maimakon saitin gwaji ta damari, yana tsara lokuta na gwaji waɗanda suna bincika iyawa musamman:

- **Gwajin Iyaka ta ƙaranci (MFT):** Shin samfuri yana sarrafa lokuta masu sauƙi, bayyananne?
- **Gwajin Daidaito (INV):** Shin sakamakon samfuri yana canzawa lokacin da bai kamata ba (misali, lokacin sake rubuta)?
- **Gwajin Tsammani na Alkibla (DIR):** Shin sakamakon samfuri yana canzawa ta alkiblar da ake tsammani lokacin da shigarwa ta canza?

CheckList yana mai da kimantawar dan adam kai tsaye kuma mai aiki: maimakon lamba ɗaya ta daidaito, yana ba da bayanan iyawa.

---

## Auna Dacewa da Nufin Dan Adam

Don tsarin RLHF, auna dacewa yana kalubale na kimantawa ta tsakiya.

**Kimantawar samfurin lada:** Daidaito na samfurin lada akan saitin gwaji na fifiko da aka ɗaure. Ouyang et al. {cite}`ouyang2022training` sun ruwaito kusan daidaito 72% biyu biyu don samfurin lada na InstructGPT; a matsayin tunani na ƙana da aka sani, alkaluma a wannan ƙasa ana ambaton su galibi don tsarin RLHF makamancin haka, ko da yake sakamakon suna bambanta sosai ta aiki da ingancin bayanai.

**Yawan nasara:** Da sigar samfuri biyu (misali, tushe na SFT da amsar RLHF da aka daidaita), ɗaukar ɗauren amsoshi na samfuri RLHF ya ci a cikin kwatancen biyu biyu na dan adam?

**GPT-4 a matsayin mai kimantawa:** Amfani da LLM mai ƙarfi don kimanta amsoshi ya zama yau da kullum don sake zagaye mai sauri. Gilardi et al. {cite}`gilardi2023chatgpt` da Zheng et al. {cite}`zheng2023judging` suna nemo yarjejeniyar mai kimantawa na LLM tare da hukunci na dan adam da ke yawo kusan daga 0.7 zuwa 0.9 dangane da aiki — mai amfani don kwatancen A/B mai sauri, amma mara aminci sosai don gano son zuciya na sycophancy, ɓoyayyen al'adu, ko matsalolin aminci.

**Gano sycophancy:** Auna ko samfuri yana canza amoshinsa bisa fifikon mai amfani da aka nuna (misali, "Ina tsammanin X daidai ne; me ka yi tsammani?"). Samfuri mai daidaito ya kamata bai zama mai sycophancy ba.

---

## Gwajin A/B a Cikin Tsarin Aiki

Don tsarin da ke aiki, kimantawar ƙarshe shine **gwajin A/B**: jagorancin ɗaukar ɓangaren masu amfani zuwa sigar samfuri sabon kuma auna sakamakon ƙasa.

Gwajin A/B yana ba da ƙiyasin mara nuna son zuciya na ingancin samfuri a cikin mahallin aikawa na gaske, yana kama tasirin da kimantawar dakin bincike ya rasa (ɗabi'ar mai amfani, rarrabawar yawan jama'a, lokuta na iyaka).

Kalubale: ma'aunai ƙasa masu dacewa. Ma'aunai na shiga (danna, tsawon zaman) na iya lada da ɗabi'ar mai yaudarar. Yawan cikawa na aiki ko binciken gamsuwar mai amfani sun fi dacewa amma suna da hayaniya.

```{seealso}
Gwajin ɗabi'a na CheckList: {cite}`ribeiro2020beyond`. Don hanyar kimantawa na RLHF, duba {cite}`ouyang2022training`. Don mafi kyau na aiki na kimantawar dan adam a MT: {cite}`graham2015accurate`. Don ka'idar curve na koyo: {cite}`mukherjee2003estimating`.
```
