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

# Ujifunzaji Tendaji

Data yenye lebo ni ghali. Ufahamu wa msingi wa ujifunzaji tendaji ni kwamba *si mifano yote isiyo na lebo ina taarifa sawa* — mfano unaweza kuboresha haraka zaidi ukipewa nafasi ya kuchagua mifano gani ya kuuliza kuhusu. Badala ya kuweka lebo kwa data bila mpangilio, mfumo wa ujifunzaji tendaji huuliza chanzo (kawaida mweka maelezo wa binadamu) kuhusu mifano inayoweza zaidi kuboresha mfano.

Sura hii inashughulikia nadharia na mazoezi ya ujifunzaji tendaji: mikakati ya maswali, miundo ya sampuli, vigezo vya kusimama, na masuala ya vitendo kwa utekelezaji wa kweli.

---

## Mpangilio wa Ujifunzaji Tendaji

Mpangilio wa kawaida wa **ujifunzaji tendaji wa msingi wa bwawa** unahusisha:

- **Seti yenye lebo** $\mathcal{L} = \{(x_i, y_i)\}_{i=1}^n$ — ndogo awali
- **Bwawa lisilo na lebo** $\mathcal{U} = \{x_j\}_{j=1}^m$ — kawaida kubwa zaidi sana kuliko $\mathcal{L}$
- **Chanzo** $\mathcal{O}$ kinachoweza kurudisha $y = \mathcal{O}(x)$ kwa $x$ yoyote iliyoulizwa
- **Mkakati wa maswali** $\phi$ unaochagua swali lijalo $x^* = \phi(\mathcal{L}, \mathcal{U}, f_\theta)$

Mzunguko wa ujifunzaji tendaji:

```text
    1. Anzisha: L = seti ndogo ya mbegu zenye lebo, U = bwawa lisilo na lebo
    2. Funza: f_θ ← funza(L)
    3. Uliza: x* = argmax φ(x; f_θ) kwa x ∈ U
    4. Weka lebo: y* = O(x*)
    5. Sasisha: L ← L ∪ {(x*, y*)}, U ← U \ {x*}
    → Rudia kutoka 2 hadi bajeti imekwisha
```

Lengo ni kufikia ubora wa mfano unaolengwa kwa maswali machache iwezekanavyo ya chanzo.

---

## Misingi ya Kinadharia

Swali la asili ni: ujifunzaji tendaji unaweza kusaidia kiasi gani? Katika hali bora zaidi, ujifunzaji tendaji unaweza kufikia kupungua kwa *mara nyingi sana* katika ugumu wa lebo — kufikia kosa $\epsilon$ na lebo $O(\log(1/\epsilon))$ badala ya $O(1/\epsilon)$ inayohitajika na ujifunzaji passiv, angalau katika mazingira yanayoweza kutekelezwa na mkakati mzuri wa maswali {cite}`settles2009active`.

Katika mazoezi, dhamana ni ngumu zaidi kupata. **Ujifunzaji tendaji wa agnostiki** {cite}`balcan2006agnostic` unaonyesha kwamba akiba ya lebo inawezekana hata dhana inayolengwa haipo katika darasa la nadharia, lakini akiba inategemea sana mgawo wa kutokubaliana — kipimo cha jinsi seti ya nadharia zinazowezekana inavyopungua haraka kadri data inavyokusanyika.

Athari kuu ya vitendo: faida ya ujifunzaji tendaji ni kubwa zaidi wakati **mpaka wa uamuzi ni rahisi na umejumuishwa** (kwa hivyo maswali ya wasiwasi yanaondoa haraka nadharia zisizo sahihi), na ndogo zaidi wakati darasa la nadharia ni kubwa au mpaka ni mgumu.

---

## Mikakati ya Maswali

### Sampuli ya Wasiwasi

Mkakati rahisi na unaotumika zaidi: uliza mfano ambao mfano una *wasiwasi zaidi* nao {cite}`lewis1994sequential`.

**Imani ya chini** huuliza mfano ambao mfano una imani ndogo zaidi katika utabiri wake mkuu:

$$
x^* = \argmax_{x \in \mathcal{U}} \left(1 - P_\theta(\hat{y} \mid x)\right)
$$

**Sampuli ya pembezoni** inazingatia pengo kati ya uwezekano wa juu mbili uliotabiriwa:

$$
x^* = \argmin_{x \in \mathcal{U}} \left(P_\theta(\hat{y}_1 \mid x) - P_\theta(\hat{y}_2 \mid x)\right)
$$

**Sampuli ya entropi** inatumia usambazaji wote uliotabiriwa:

$$
x^* = \argmax_{x \in \mathcal{U}} \left( -\sum_{k=1}^K P_\theta(y_k \mid x) \log P_\theta(y_k \mid x) \right)
$$

Sampuli ya entropi ndiyo ya msingi zaidi kati ya tatu — inazingatia madarasa yote — na kwa ujumla inazidi nyingine kwa matatizo ya madarasa mengi.

### Maswali kwa Kamati (QbC)

Funza **kamati** ya mifano $C$ (kwa kutumia mifumo ya upiganaji, uzinduzi tofauti, au miundo tofauti). Uliza mfano ambao kamati inakinzana nao zaidi:

$$
x^* = \argmax_{x \in \mathcal{U}} \; \text{kutokubaliana}(\{f_c(x)\}_{c=1}^C)
$$

Kutokubaliana kunaweza kupimwa kama **entropi ya kura** (entropi juu ya kura za wingi za kamati) au **kutofautiana kwa KL** kutoka kwa usambazaji wa makubaliano.

QbC inatoa makadirio bora ya wasiwasi kuliko mfano mmoja lakini inahitaji kufunza mifano mingi, ambayo ni ghali kinadharia.

### Mabadiliko ya Mfano Yanayotarajiwa

Uliza mfano ambao ungesababisha mabadiliko makubwa zaidi kwa mfano wa sasa ukiwekewa lebo. Kwa mifano inayotegemea gradient, hii inalingana na mfano wenye ukubwa wa gradient ya wastani unaotarajiwa {cite}`settles2008analysis`:

$$
x^* = \argmax_{x \in \mathcal{U}} \sum_{y \in \mathcal{Y}} P_\theta(y \mid x) \left\| \nabla_\theta \mathcal{L}(f_\theta(x), y) \right\|
$$

Mkakati huu una msukumo wa kinadharia lakini unahitaji kuhesabu gradient kwa kila mgombea, na kuufanya ghali kwa mifano mikubwa.

### Seti ya Msingi / Mbinu za Kijiometri

Mikakati inayotegemea wasiwasi inaweza **kubaguliwa kuelekea nje ya kawaida**: mfano usio wa kawaida unaweza kuwa na wasiwasi mkubwa lakini si mwakilishi wa usambazaji wa data. Mbinu za seti ya msingi zinashughulikia hili kwa kutafuta sampuli mbalimbali inayoshughulikia nafasi ya vipengele.

Kanuni ya **k-center ya mara moja** {cite}`sener2018active` inapata seti ndogo zaidi ya pointi ambapo kila pointi isiyowekewa lebo iko ndani ya $\delta$ ya angalau pointi moja iliyoulizwa:

$$
x^* = \argmax_{x \in \mathcal{U}} \min_{x' \in \mathcal{L}} d(x, x')
$$

yaani, uliza pointi iliyo mbali zaidi na pointi yoyote iliyowekewa lebo kwa sasa. Hii inachochea seti iliyoenea vizuri ya maelezo.

### BADGE

**Kujifunza Tendaji kwa Vifurushi kwa Uwakilishi wa Gradient Mbalimbali** {cite}`ash2020deep` huchanganya wasiwasi na utofauti: huchagua kifurushi cha mifano ambayo uwakilishi wa gradient yake (kuhusiana na lebo iliyotabiriwa) ni kubwa kwa ukubwa (wasiwasi) na mbalimbali (inayoshughulikia maeneo tofauti ya nafasi ya gradient). Hii ni moja ya mikakati ya kisasa inayoshindana zaidi.

---

## Makadirio ya Wasiwasi kwa Mifano ya Kina

Mikakati hapo juu inadhani ufikiaji wa matokeo ya uwezekano yaliyorekebishwa kutoka kwa mfano. Kwa mifano rahisi (regression ya logistiki, wasambazaji wa softmax), hii ni rahisi. Kwa mtandao wa kina, kupata makadirio ya wasiwasi yanayotegemeka kunahitaji mbinu za ziada.

### Aina Mbili za Wasiwasi

Kufuata Kendall na Gal {cite}`kendall2017uncertainties`, tunatofautisha:

**Wasiwasi wa aleatoric** (wasiwasi wa data): kelele asili katika uchunguzi ambazo haziwezi kupunguzwa kwa kukusanya data zaidi. Picha iliyofifia ina wasiwasi wa aleatoric — hakuna kiasi cha data ya ziada ya mafunzo kutoka kwa usambazaji sawa kitakachofanya mfano kuwa na imani zaidi nao.

**Wasiwasi wa epistemic** (wasiwasi wa mfano): wasiwasi unaotokana na data ndogo ya mafunzo au mfano ambao haujawahi kuona mifano inayofanana. Wasiwasi wa epistemic *unaweza* kupunguzwa kwa kuweka lebo data zaidi — na kwa hivyo ndiyo kiasi muhimu cha ujifunzaji tendaji wa uchaguzi wa maswali.

Kwa ujifunzaji tendaji, tunataka kuuliza mifano yenye wasiwasi mkubwa wa epistemic, si wa aleatoric mkubwa. Kuuliza mfano ulio na utata wa kimsingi kunapoteza juhudi za chanzo: hakuna lebo watakayotoa itakayokuwa wazi sahihi.

### MC Dropout

Mbinu ya vitendo ya makadirio ya wasiwasi wa epistemic kwa mitandao ya neva ni **MC Dropout** {cite}`gal2016dropout`: tumia dropout wakati wa inferensi na uendeshe picha $T$ za mbele. Tofauti kati ya utabiri ni makadirio ya wasiwasi wa epistemic.

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

Katika mtandao ambao haujafunzwa hapo juu, mifano yote miwili inaonyesha wasiwasi sawa. Baada ya mafunzo, mfano wa nje ya usambazaji utaonyesha wasiwasi wa juu zaidi wa epistemic — mfano haujajifunza upangaji wa kutegemewa kwa ingizo mbali na usambazaji wa mafunzo.

### Makundi ya Kina

Kufunza mifano $M$ iliyoanzishwa kwa kujitegemea na kuchanganya utabiri wao kutoa makadirio ya wasiwasi rahisi na mara nyingi ya kutegemewa zaidi kuliko MC Dropout {cite}`lakshminarayanan2017simple`. Kutokubaliana kati ya wanakikundi ni ishara ya wasiwasi wa epistemic.

Kwa ujifunzaji tendaji kwa kiwango kikubwa, MC Dropout na makundi ya kina yote mawili yanaongeza mzigo wa ziada unaolingana na picha $T$ au $M$ za mbele. Katika mazoezi, $T = 10$–$30$ kwa MC Dropout au wanakikundi $M = 5$ mara nyingi inatosha kupanga mifano kwa wasiwasi wa epistemic, hata kama maadili ya kamili hayarekebishwi vizuri.

---

## Mzunguko Kamili wa Ujifunzaji Tendaji

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

## Tatizo la Kuanza Baridi

Ujifunzaji tendaji unahitaji mfano uliofunzwa kupanga pointi zisizo na lebo — lakini mwanzoni, huna (au una kidogo sana) mifano yenye lebo. Hili ndilo **tatizo la kuanza baridi**.

Suluhisho za vitendo:

1. **Uanzishaji wa nasibu:** Weka lebo kwenye seti ndogo ya mbegu ya nasibu (mifano 20–100) kabla ya kuanza ujifunzaji tendaji.
2. **Uanzishaji unaotegemea makundi:** Tumia k-means kwenye bwawa lisilo na lebo; weka lebo kwenye mfano mmoja kutoka kwa kila kundi. Hii inahakikisha utofauti katika seti ya awali yenye lebo.
3. **Uchaguzi unaotegemea uwakilishi:** Tumia enkoda iliyofunzwa awali kuwakilisha mifano; chagua kikundi mbalimbali kupitia seti ya msingi.

Kwa kazi nyingi, lebo chache za mbegu za nasibu kawaida zinatosha kuanza ujifunzaji tendaji; idadi halisi inategemea usawa wa darasa, ukubwa wa vipengele, na ugumu wa mfano.

---

## Ujifunzaji Tendaji wa Hali ya Vifurushi

Katika mazoezi, wawekaji maelezo wanafanya kazi kwa vifurushi — ni kisiasa kufunza na kutekeleza mfano mpya baada ya kila lebo moja. **Ujifunzaji tendaji wa hali ya vifurushi** huchagua seti ya mifano $b$ ya kuweka lebo wakati mmoja.

Kuchagua bila msimamo mifano $b$ ya juu yenye wasiwasi mkubwa zaidi husababisha **urudiarudia**: mifano yenye wasiwasi mkubwa huwa imejikusanya pamoja (k.m., mifano karibu na mpaka wa uamuzi katika eneo sawa). Mikakati bora ya vifurushi inaboresha kwa wasiwasi *na* utofauti ndani ya kifurushi.

**Michakato ya Pointi ya Kuthibitisha (DPPs)** inatoa njia ya msingi ya kuchagua vifurushi mbalimbali: vinafafanua usambazaji juu ya vikundi vinavyoadhibu vitu vinavyofanana. Uwezekano wa kikundi $S$ chini ya DPP ni unaolingana na $\det(L_S)$ ambapo $L$ ni matrix ya kernel inayowakilisha kufanana.

---

## Vigezo vya Kusimama

Ujifunzaji tendaji unapaswa kusimama lini? Vigezo vya kawaida:

- **Bajeti imekwisha:** Rahisi zaidi — simama bajeti ya uwekaji maelezo inapoisha.
- **Usimamaji wa utendaji:** Simama usahihi wa mfano kwenye seti ya uthibitishaji ya pembezoni haukuboresha kwa zaidi ya $\delta$ kwa raundi $k$ mfululizo.
- **Kizingiti cha imani:** Simama chini ya sehemu fulani ya mifano isiyowekewa lebo ina wasiwasi juu ya kizingiti.
- **Upunguzaji wa hasara wa juu zaidi:** Kadiri manufaa yanayowezekana kutoka kwa lebo za ziada; simama inapoanguka chini ya kizingiti {cite}`bloodgood2009method`.

---

## Wakati Ujifunzaji Tendaji Unafanya Kazi (na Wakati Haifanyi)

Ujifunzaji tendaji huwa hufanya kazi vizuri wakati:
- Uwekaji lebo ni ghali na bwawa lisilo na lebo ni kubwa
- Data ina muundo wazi ambao mfano unaweza kutumia kutambua mifano ya habari
- Darasa la mfano linafaa kwa kazi

Ujifunzaji tendaji hufanya vibaya wakati:
- Mfano wa awali ni mbaya sana (kuanza baridi) na hauwezi kupanga mifano kwa maana
- Mkakati wa maswali huchagua nje ya kawaida au mifano iliyowekewa lebo vibaya (ustahimilivu wa kelele una umuhimu)
- Usambazaji wa data unahamia kati ya bwawa lisilo na lebo na usambazaji wa upimaji

Wasiwasi mkuu wa vitendo ni **kutofautiana kwa usambazaji**: ujifunzaji tendaji huwa huuliza mifano karibu na mpaka wa uamuzi, ukiunda seti ya lebo iliyobaguliwa ambayo inaweza kutokuwakilisha vizuri usambazaji wa upimaji. Hii inaweza kusababisha mipaka ya uamuzi iliyofunzwa vizuri lakini urekebishaji mbaya.

```{seealso}
Utafiti wa msingi ni {cite}`settles2009active`. Misingi ya kinadharia (ugumu wa lebo, mipaka ya agnostiki): {cite}`balcan2006agnostic`. Kwa ujifunzaji tendaji maalum wa kujifunza kwa kina, angalia {cite}`ash2020deep` (BADGE) na {cite}`sener2018active` (seti ya msingi). Kwa tathmini ya kina ya wakati ujifunzaji tendaji husaidia kweli, angalia {cite}`lowell2019practical`. Kuhusu wasiwasi wa aleatoric dhidi ya epistemic kwa mifano ya kina, angalia {cite}`kendall2017uncertainties`; kwa makundi ya kina kama wakadiriaji wa wasiwasi, angalia {cite}`lakshminarayanan2017simple`; kwa MC Dropout kama inferensi ya takriban ya Bayesian, angalia {cite}`gal2016dropout`.
```
