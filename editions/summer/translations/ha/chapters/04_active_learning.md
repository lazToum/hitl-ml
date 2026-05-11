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

# Koyon Aiki

Bayanan da aka yi lakabi suna da tsada. Babban ra'ayin koyon aiki shine cewa *ba duk misalin da ba a yi lakabi ba yana da bayanai ɗaya ba* — samfuri zai iya inganta da sauri idan ya samu zaɓar waɗanne misalai za su tambaya game da su. Maimakon yin lakabi ga bayanai ta damari, tsarin koyon aiki yana tambaya oracle (galibi mai sanya lakabi ɗan adam) akan misalai mafi yiwuwar inganta samfuri.

Wannan babi ya ƙunshi ka'idar da aikin koyon aiki: dabarun tambaya, tsarin samfuri, ma'aunin dakatar, da abubuwan da ke da amfani ga aikawa na gaske.

---

## Tsarin Koyon Aiki

Tsarin **koyon aiki bisa tafkin** na yau da kullum ya ƙunshi:

- **Rukunin da aka yi lakabi** $\mathcal{L} = \{(x_i, y_i)\}_{i=1}^n$ — ƙarami a farko
- **Tafkin da ba a yi lakabi ba** $\mathcal{U} = \{x_j\}_{j=1}^m$ — galibi mafi girma fiye da $\mathcal{L}$
- **Oracle** $\mathcal{O}$ wanda zai iya mayar da $y = \mathcal{O}(x)$ don duk $x$ da aka tambaya
- **Dabarun tambaya** $\phi$ wanda ke zaɓar tambayar gaba $x^* = \phi(\mathcal{L}, \mathcal{U}, f_\theta)$

Zagayen koyon aiki:

```text
    1. Fara: L = ƙaramin saitin farko da aka yi lakabi, U = tafkin da ba a yi lakabi ba
    2. Horar: f_θ ← train(L)
    3. Tambaya: x* = argmax φ(x; f_θ) akan x ∈ U
    4. Lakabi: y* = O(x*)
    5. Sabunta: L ← L ∪ {(x*, y*)}, U ← U \ {x*}
    → Maimaita daga 2 har sai kasafin kuɗi ya ƙare
```

Manufar ita ce kaiwa ga ingancin samfuri da aka nufa ta amfani da kaɗan kaɗan tambayoyin oracle iya.

---

## Tushen Ka'ida

Tambayar yanayi ita ce: nawa koyon aiki zai iya taimaka? A mafi kyau, koyon aiki na iya cimma *raguwa mai tsanaki* a rikitarwan lakabi — kaiwa kuskure $\epsilon$ tare da $O(\log(1/\epsilon))$ lakabin maimakon $O(1/\epsilon)$ da ake buƙata ta koyon wucin gadi, a ƙalla a yanayi mai yiwuwa tare da dabarun tambaya mai kyau {cite}`settles2009active`.

A aiki, tabbaci ya fi wuya samu. **Koyon aiki na agnostic** {cite}`balcan2006agnostic` yana nuna cewa adana lakabi yana yiwuwa ko da lokacin da ra'ayin manufa ba cikin ajin hasashe ba, amma adana yana dogara sosai kan coefficient na rashin jituwa — auna yadda rukunin hasashe masu yiwuwa ke raguwa yayin da bayanai ke tara.

Tasirin da ke da amfani na aiki: fa'idar koyon aiki ta fi girma lokacin da **iyakar yanke shawara yana sauƙi kuma mai ƙullewa** (don haka tambayoyin rashin tabbas da sauri suna kawar da hasashe mara daidai), kuma mafi ƙanƙanta lokacin da ajin hasashe yana da girma ko iyakar ta rikitarwa.

---

## Dabarun Tambaya

### Samfurin Rashin Tabbas

Mafi sauƙin kuma mafi amfani na dabarun: tambaya misali wanda samfuri ke *mafi rashin tabbas* game da shi {cite}`lewis1994sequential`.

**Mafi ƙarancin amincewar** yana tambaya misali wanda samfuri ke mafi ƙarancin amincewar a cikin hasashen farko:

$$
x^* = \argmax_{x \in \mathcal{U}} \left(1 - P_\theta(\hat{y} \mid x)\right)
$$

**Samfurin iyaka** yana la'akari da tazara tsakanin manyan iya yiwuwar biyu da aka hasashe:

$$
x^* = \argmin_{x \in \mathcal{U}} \left(P_\theta(\hat{y}_1 \mid x) - P_\theta(\hat{y}_2 \mid x)\right)
$$

**Samfurin entropy** yana amfani da cikakkiyar rarrabawar da aka hasashe:

$$
x^* = \argmax_{x \in \mathcal{U}} \left( -\sum_{k=1}^K P_\theta(y_k \mid x) \log P_\theta(y_k \mid x) \right)
$$

Samfurin entropy shine mafi ƙa'ida daga cikin uku — yana la'akari da duk aji — kuma galibi yana inganta sauran akan matsaloli nau'i da yawa.

### Tambaya ta Kwamitin (QbC)

Horar da **kwamitin** na $C$ samfurin (ta amfani da bagging, farawa daban-daban, ko tsarin daban-daban). Tambaya misali wanda kwamitin ke rashin jituwa game da shi sosai:

$$
x^* = \argmax_{x \in \mathcal{U}} \; \text{disagreement}(\{f_c(x)\}_{c=1}^C)
$$

Ana iya auna rashin jituwa a matsayin **entropy na zaɓi** (entropy akan zaɓin rinjaye na kwamitin) ko **KL divergence** daga rarrabawar yarjejeniya.

QbC yana ba da ƙiyasin rashin tabbas mafi kyau fiye da samfuri ɗaya amma yana buƙatar horar da samfurin da yawa, wanda yana da tsada ta ƙididdiga.

### Canjin Samfuri da Ake Tsammani

Tambaya misali wanda zai haifar da mafi girman canji ga samfuri na yanzu idan aka yi lakabi ga shi. Don samfurin bisa gradient, wannan ya dace da misali mai mafi girman iya ƙarfin gradient da ake tsammani {cite}`settles2008analysis`:

$$
x^* = \argmax_{x \in \mathcal{U}} \sum_{y \in \mathcal{Y}} P_\theta(y \mid x) \left\| \nabla_\theta \mathcal{L}(f_\theta(x), y) \right\|
$$

Wannan dabarun yana da ƙarfin ka'ida amma yana buƙatar ƙididdige gradient don kowane ɗan takara, yana mai da shi mai tsada don manyan samfurin.

### Hanyoyin Core-Set / Geometrical

Dabarun bisa rashin tabbas na iya kasancewa **masu nuna son zuciya ga waɗanda ke waje**: misali na musamman na iya zama mara tabbas sosai amma ba ya wakiltar rarrabawar bayanai. Hanyoyin Core-set suna magance wannan ta neman samfurin iri-iri da ke rufe sararin fasali.

Algorithm **k-center greedy** {cite}`sener2018active` yana nemo mafi ƙarami na aya waɗanda suka sa kowane aya da ba a yi lakabi ba yana cikin $\delta$ na aya ɗaya da aka tambaya akalla:

$$
x^* = \argmax_{x \in \mathcal{U}} \min_{x' \in \mathcal{L}} d(x, x')
$$

watau, tambaya aya mafi nisa daga duk aya da aka yi lakabi a yanzu. Wannan yana ƙarfafa saitin lakabi mai faɗaɗawa.

### BADGE

**Koyon Aiki na Jeri ta Embeddings na Gradient Iri-Iri** {cite}`ash2020deep` yana haɗa rashin tabbas da iri-iri: yana zaɓar jeri na misalai waɗanda embeddings na gradient (game da lakabi da aka hasashe) duka suna da girma (rashin tabbas) da iri-iri (suna rufe yankuna daban-daban na sararin gradient). Wannan yana ɗaya daga cikin dabarun zamani mafi gasa.

---

## Ƙiyasin Rashin Tabbas don Samfurin Zurfin

Dabarun da ke sama suna ɗauka damar ƙwanso iya yiwuwar ƙididdigan da aka daidaita daga samfuri. Don sauƙin samfurin (Logistic regression, masu rarraba softmax), wannan yana da sauƙi. Don cibiyoyin jijiya mai zurfi, samun ƙiyasin rashin tabbas mai aminci yana buƙatar fasaha ƙari.

### Nau'in Rashin Tabbas Biyu

Bayan Kendall da Gal {cite}`kendall2017uncertainties`, muna bambanta:

**Rashin tabbas aleatoric** (rashin tabbas na bayanai): hayaniya da ke cikin lura waɗanda ba za a rage ta hanyar tara bayani fiye da ba. Hoto mara bayyana yana da rashin tabbas na aleatoric — babu ƙari na horarwa daga rarrabawar ɗaya zai sa samfuri ya fi amincewar akan shi.

**Rashin tabbas epistemic** (rashin tabbas na samfuri): rashin tabbas saboda iyakancin bayanin horarwa ko samfuri da bai ga misalai makamancin haka ba. Rashin tabbas na epistemic *zai iya* ragewa ta hanyar yin lakabi ga bayani fiye da kima — kuma saboda haka shine adadin da ya dace don zaɓin tambaya na koyon aiki.

Don koyon aiki, muna son tambaya misalai masu rashin tabbas epistemic mai ƙari, ba rashin tabbas aleatoric mai ƙari ba. Tambaya misali mai rikitarwa ta asali yana bata ƙoƙarin oracle: babu lakabi da za su bayar ya kasance daidai sosai.

### MC Dropout

Hanyar da ke da amfani ga ƙiyasin rashin tabbas epistemic don cibiyoyin jijiya ita ce **MC Dropout** {cite}`gal2016dropout`: yi amfani da dropout a lokacin inference kuma gudanar da $T$ na gaba. Bambancin a cikin hasashe shine ƙiyasin rashin tabbas epistemic.

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn

torch.manual_seed(42)
rng = np.random.default_rng(42)

class MCDropoutNet(nn.Module):
    def __init__(self, input_dim=20, hidden=64, output_dim=2, p_drop=0.3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden), nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, hidden),    nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, output_dim)
        )

    def forward(self, x):
        return self.net(x)

def mc_uncertainty(model, x, T=30):
    """
    Run T stochastic forward passes with dropout active.
    Returns mean prediction and epistemic uncertainty (predictive variance).
    """
    model.train()  # keep dropout active during inference
    with torch.no_grad():
        preds = torch.stack([
            torch.softmax(model(x), dim=-1) for _ in range(T)
        ])  # shape: (T, N, C)
    mean_pred = preds.mean(0)
    # Epistemic uncertainty: mean of variances across passes
    epistemic = preds.var(0).sum(-1)
    # Aleatoric uncertainty: entropy of mean prediction
    aleatoric = -(mean_pred * (mean_pred + 1e-9).log()).sum(-1)
    return mean_pred, epistemic, aleatoric

# Quick demonstration
model = MCDropoutNet(input_dim=20, output_dim=2)
# In-distribution example (simulated)
x_familiar   = torch.randn(1, 20) * 0.5
# Out-of-distribution example (far from training distribution)
x_unfamiliar = torch.randn(1, 20) * 3.0

for name, x in [("In-distribution ", x_familiar), ("Out-of-distribution", x_unfamiliar)]:
    _, ep, al = mc_uncertainty(model, x)
    print(f"{name} | epistemic: {ep.item():.4f} | aleatoric: {al.item():.4f}")
```

A cikin cibiyar jijiya da ba a horar da ita a sama, misalai biyu suna nuna rashin tabbas makamancin haka. Bayan horarwa, misali da ke waje da rarrabawar zai nuna rashin tabbas epistemic mai ƙari — samfuri bai koyi zana daidai don shigarwa nesa daga rarrabawar horarwa ba.

### Haɗin Gwiwa Mai Zurfi

Horar da $M$ na samfurin da aka farawa ba tare da juna ba kuma matsakaici hasashensu yana ba da ƙiyasin rashin tabbas mafi sauƙi kuma galibi mafi aminci fiye da MC Dropout {cite}`lakshminarayanan2017simple`. Rashin jituwa tsakanin mambobin haɗin gwiwa shine alaman rashin tabbas epistemic.

Don koyon aiki a sikeli, MC Dropout da haɗin gwiwa mai zurfi duka suna ƙara nauyi kwatankwacin $T$ ko $M$ hanyoyin gaba. A aiki, $T = 10$–$30$ don MC Dropout ko $M = 5$ mambobin haɗin gwiwa galibi ya isa wajen jera misalai ta rashin tabbas epistemic, ko da dai ƙimomi na cikakke ba su da daidaitawa.

---

## Zagayen Koyon Aiki Cikakke

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from copy import deepcopy

rng = np.random.default_rng(42)

# Generate dataset
X, y = make_classification(
    n_samples=2000, n_features=20, n_informative=10,
    n_classes=3, n_clusters_per_class=1, random_state=42
)
X_train, y_train = X[:1500], y[:1500]
X_test,  y_test  = X[1500:], y[1500:]

def entropy_query(model, X_pool):
    """Return index of most uncertain sample (entropy)."""
    probs = model.predict_proba(X_pool)
    ent = -np.sum(probs * np.log(probs + 1e-9), axis=1)
    return np.argmax(ent)

def random_query(X_pool):
    """Random baseline."""
    return rng.integers(0, len(X_pool))

def run_active_learning(strategy='entropy', n_initial=30, n_queries=120, query_batch=5):
    labeled_idx = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled_idx = [i for i in range(len(X_train)) if i not in labeled_idx]
    accs = []

    for step in range(n_queries // query_batch):
        model = LogisticRegression(max_iter=500, C=1.0)
        model.fit(X_train[labeled_idx], y_train[labeled_idx])
        accs.append(accuracy_score(y_test, model.predict(X_test)))

        # Query
        X_pool = X_train[unlabeled_idx]
        for _ in range(query_batch):
            if strategy == 'entropy':
                q = entropy_query(model, X_pool)
            else:
                q = random_query(X_pool)
            labeled_idx.append(unlabeled_idx.pop(q))
            X_pool = X_train[unlabeled_idx]

    return np.array(accs)

labels_used = np.arange(1, 25) * 5 + 30  # label counts at each step

accs_active = run_active_learning(strategy='entropy')
accs_random = run_active_learning(strategy='random')

plt.figure(figsize=(8, 5))
plt.plot(labels_used, accs_active, 'o-', label='Entropy sampling', color='#2b3a8f', linewidth=2)
plt.plot(labels_used, accs_random, 's--', label='Random baseline',  color='#e05c5c', linewidth=2)
plt.xlabel("Number of labeled examples", fontsize=12)
plt.ylabel("Test accuracy", fontsize=12)
plt.title("Active Learning vs. Random Sampling", fontsize=13)
plt.legend(fontsize=11)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('active_learning_curve.png', dpi=150)
plt.show()

print(f"Active learning reaches {accs_active[-1]:.3f} accuracy")
print(f"Random sampling reaches {accs_random[-1]:.3f} accuracy")
print(f"Active learning saves ~{int((accs_random.tolist().index(min(accs_random, key=lambda a: abs(a-accs_active[-1]))) - len(accs_active) + 1) * 5)} labels to match random's final accuracy")
```

---

## Matsalar Farawa Mai Sanyi

Koyon aiki yana buƙatar samfuri da aka horar don ƙididdiga aya da ba a yi lakabi ba — amma a farko, kana da kaɗan (ko ba shi) misalin da aka yi lakabi. Wannan shine **matsalar farawa mai sanyi**.

Mafita masu amfani:

1. **Farawa ta damari:** Yi lakabi ga ƙaramin saitin farko ta damari (misalai 20–100) kafin fara koyon aiki.
2. **Farawa bisa clustering:** Yi amfani da k-means akan tafkin da ba a yi lakabi ba; yi lakabi ga misali ɗaya daga kowane cluster. Wannan yana tabbatar da iri-iri a cikin saitin farko da aka yi lakabi.
3. **Zaɓi bisa embedding:** Yi amfani da encoder da aka horar a baya don ɓoye misalai; zaɓi iri-iri ta core-set.

Don mafi yawan ayyuka, ɗan ƙaramin lakabin farko ta damari galibi ya isa don fara koyon aiki; adadin daidai yana dogara kan daidaito na aji, girman fasali, da rikitarwan samfuri.

---

## Koyon Aiki na Yanayin Jeri

A aiki, masu sanya lakabi suna aiki a jeri — yana da ƙarancin inganci don horar da kuma aikawa da sabon samfuri bayan kowane lakabi ɗaya. **Koyon aiki na yanayin jeri** yana zaɓar saitin $b$ misalai don yi lakabi a lokaci ɗaya.

Zaɓin mafi rashin tabbas $b$ misalai kawai yana haifar da **tsattsauran maimaitawa**: misalin mara tabbas sosai suna tara tare (misali, misalai kusa da iyakar yanke shawara a yanki ɗaya). Dabarun jeri mafi kyau suna inganta duka rashin tabbas *da* iri-iri a cikin jeri.

**Tsarin Determinantal Point Process (DPPs)** suna ba da hanyar ƙa'ida don samfuri na jeri iri-iri: suna bayyana rarrabawa akan ƙananan saiti waɗanda ke hukunta abubuwa makamancin haka. Iya yiwuwar ƙaramin saiti $S$ ƙarƙashin DPP ya dace da $\det(L_S)$ inda $L$ shine matrix na kernel da ke ɓoye kamancin.

---

## Ma'aunin Dakatar

Yaushe koyon aiki ya kamata ya tsaya? Ma'aunin yau da kullum:

- **Kasafin kuɗi ya ƙare:** Mafi sauƙi — tsaya lokacin da kasafin kuɗin lakabi ya ƙare.
- **Kushewar aiki:** Tsaya lokacin da daidaito na samfuri akan saitin tabbatarwa da aka ɗaure bai inganta fiye da $\delta$ don $k$ zagaye na jere ba.
- **Iyakar amincewar:** Tsaya lokacin da kaɗan misalin da ba a yi lakabi ba suna da rashin tabbas a saman iyaka.
- **Raguwar ƙarin girma mai yiwuwa:** Ƙiyasta ƙarin mafi yawa daga lakabi ƙari; tsaya lokacin da wannan ya faɗi ƙasa da iyaka {cite}`bloodgood2009method`.

---

## Lokacin da Koyon Aiki ke Aiki (da Lokacin da Ba Aiki Ba)

Koyon aiki galibi yana aiki lokacin da:
- Lakabi yana da tsada kuma tafkin da ba a yi lakabi ba yana da girma
- Bayanai yana da tsari bayyananne samfuri zai iya amfani da shi don gano misalai masu bayanai
- Ajin samfuri ya dace da aiki

Koyon aiki yana yin mara kyau lokacin da:
- Samfuri na farko ya yi mara kyau sosai (farawa mai sanyi) kuma ba zai iya jera misalai da ma'ana ba
- Dabarun tambaya yana zaɓar waɗanda ke waje ko misalin mislabeled (juriya na hayaniya yana da muhimmanci)
- Rarrabawar bayanai tana canzawa tsakanin tafkin da ba a yi lakabi ba da rarrabawar gwaji

Damuwa ta aiki ta muhimmanci shine **rashin daidaito na rarrabawa**: koyon aiki galibi yana tambaya misalai kusa da iyakar yanke shawara, yana ƙirƙira saitin da aka yi lakabi mai nuna son zuciya wanda ba zai iya wakilta rarrabawar gwaji da kyau ba. Wannan na iya haifar da iyakar yanke shawara da aka horar da kyau amma ƙididdigan iya yiwuwar mara daidai.

```{seealso}
Bita na asali shine {cite}`settles2009active`. Tushe na ka'ida (rikitarwan lakabi, iyakar agnostic): {cite}`balcan2006agnostic`. Don koyon aiki na musamman ga koyon zurfin, duba {cite}`ash2020deep` (BADGE) da {cite}`sener2018active` (core-set). Don kimantawa mai sukar lokacin da koyon aiki ke taimaka gaske, duba {cite}`lowell2019practical`. Akan rashin tabbas aleatoric da epistemic don samfurin mai zurfi, duba {cite}`kendall2017uncertainties`; don haɗin gwiwa mai zurfi a matsayin ƙiyasin rashin tabbas, duba {cite}`lakshminarayanan2017simple`; don MC Dropout a matsayin Bayesian inference na kusan, duba {cite}`gal2016dropout`.
```
