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

# Kujifunza kutoka kwa Ulinganisho na Upangaji wa Daraja

Kumuuliza binadamu atoe alamu kamili ya ubora kwa tokeo ni ngumu. Ubora wa nambari wa insha hii ni nini, kwenye kipimo cha 1 hadi 10? Swali hilo halina msingi: binadamu wana upungufu wa kipimo thabiti cha ndani, na alamu zao zinaathiriwa sana na nanga, muktadha, na uchovu.

Kumuuliza binadamu *alinganishe* matokeo mawili ni rahisi zaidi sana: insha ipi ni bora, A au B? Hukumu za kulinganishwa ni thabiti zaidi, za kutegemewa zaidi, na zinafikia mapendeleo ya binadamu moja kwa moja zaidi kuliko alamu kamili. Sura hii inashughulikia misingi ya kihesabu na matumizi ya vitendo ya kujifunza kutoka kwa ulinganisho na upangaji wa daraja.

---

## Kwa Nini Ulinganisho ni Bora Kuliko Alamu

### Msingi wa Kisaikolojia

Ubora wa hukumu za kulinganishwa una historia ndefu katika upimaji wa kisaikolojia. Sheria ya Hukumu ya Kulinganishwa ya Thurstone {cite}`thurstone1927law` (1927) ilionyesha kwamba hata binadamu wanapokuwa na hukumu zisizo thabiti kamili, hukumu zao za kulinganishwa hufuata sheria thabiti ya uwezekano. Ulinganisho hutumia ukweli kwamba binadamu ni bora zaidi katika *mtazamo wa kilinganisho* kuliko urekebishaji kamili.

### Ufanisi wa Takwimu

Kila ulinganisho wa jozi hutoa taarifa kuhusu nafasi za *kilinganisho* za vipengele viwili kwenye kipimo cha ubora. Na vipengele $K$, ulinganisho $K-1$ unaweza kupanga vipengele vyote; ulinganisho $O(\log K)$ tu unahitajika kupata kipengele cha juu zaidi. Alamu kamili kawaida zinahitaji hukumu zaidi kufikia usahihi sawa.

### Upanuzi

Kwa mifano ya uzalishaji, idadi ya matokeo tofauti ni ya uhesabuiwa na haina mwisho. Kupanga tokeo kamili kunahitaji kuanzisha kipimo cha pamoja kwa matokeo yote; kulinganisha matokeo kunahitaji tu hukumu za ndani, za kilinganisho ambazo zina urekebishaji wa asili kwa kila mmoja.

---

## Mfano wa Bradley-Terry

Mfano mkubwa wa uwezekano kwa ulinganisho wa jozi ni **mfano wa Bradley-Terry (BT)** {cite}`bradley1952rank`. Kila kipengele $i$ kina alamu ya ubora ya picha $\alpha_i \in \mathbb{R}$. Uwezekano kwamba kipengele $i$ kinapendelewa kuliko kipengele $j$ katika ulinganisho wa moja kwa moja ni:

$$
P(i \succ j) = \frac{e^{\alpha_i}}{e^{\alpha_i} + e^{\alpha_j}} = \sigma(\alpha_i - \alpha_j)
$$

ambapo $\sigma$ ni sigmoid ya logistiki. Hii inafanana na kudhania kwamba ubora unaotambuliwa wa kipengele $i$ ni $\alpha_i + \epsilon$ ambapo $\epsilon$ ni neno la kelele la kawaida la logistiki.

### Utambulikaji

Mfano wa BT unajulikana hadi tafsiri: kama $\alpha$ ni suluhisho, $\alpha + c$ pia ni suluhisho kwa kila mara $c$. Makubaliano ya kawaida ni kurekebisha alamu moja (k.m., $\alpha_0 = 0$) au kuzuia $\sum_i \alpha_i = 0$. Alamu zinajulikana tu wakati **grafu ya ulinganisho** (nodi = vipengele, pembe = jozi zinazoonekana) imeunganishwa — kama grafu ina sehemu zilizokatika, alamu za kilinganisho kati ya sehemu hazijaelezwa.

### Makadirio ya Vigezo

Ukitoa mkusanyiko wa ulinganisho wa jozi $\mathcal{D} = \{(i, j, y_{ij})\}$ ambapo $y_{ij} = 1$ kama $i$ ilipendelewa kuliko $j$, kiwango cha uwezekano cha logarithm ni:

$$
\mathcal{L}(\alpha) = \sum_{(i, j, y_{ij}) \in \mathcal{D}} \left[ y_{ij} \log \sigma(\alpha_i - \alpha_j) + (1 - y_{ij}) \log \sigma(\alpha_j - \alpha_i) \right]
$$

Hii ni kitendaji chenye msongamano wa $\alpha$ na kinaweza kuboreshwa kupitia kupanda kwa gradient au mbinu ya Newton.

```{code-cell} python
import numpy as np
from scipy.optimize import minimize
from scipy.special import expit  # sigmoid

rng = np.random.default_rng(42)

# -----------------------------------------------
# Simulate Bradley-Terry: 8 items with true quality scores
# Generate pairwise comparisons and recover the scores
# -----------------------------------------------

N_ITEMS = 8
true_alpha = rng.normal(0, 1, N_ITEMS)
print(f"True quality ranking: {np.argsort(true_alpha)[::-1]}")

# Generate comparisons: every pair compared 5 times
comparisons = []
for i in range(N_ITEMS):
    for j in range(i + 1, N_ITEMS):
        for _ in range(5):
            p_i_wins = expit(true_alpha[i] - true_alpha[j])
            winner = i if rng.random() < p_i_wins else j
            loser  = j if winner == i else i
            comparisons.append((winner, loser))

print(f"Total comparisons: {len(comparisons)}")

def neg_log_likelihood(alpha, comparisons):
    """Bradley-Terry negative log-likelihood."""
    alpha = np.array(alpha)
    loss = 0.0
    for winner, loser in comparisons:
        log_prob = np.log(expit(alpha[winner] - alpha[loser]) + 1e-10)
        loss -= log_prob
    return loss

def neg_grad(alpha, comparisons):
    alpha = np.array(alpha)
    grad = np.zeros(len(alpha))
    for winner, loser in comparisons:
        p = expit(alpha[winner] - alpha[loser])
        grad[winner] -= (1 - p)
        grad[loser]  -= (-p)
    return grad

# Fix alpha[0] = 0 to resolve scale ambiguity
result = minimize(
    lambda a: neg_log_likelihood(np.concatenate([[0.0], a]), comparisons),
    x0=np.zeros(N_ITEMS - 1),
    jac=lambda a: neg_grad(np.concatenate([[0.0], a]), comparisons)[1:],
    method='L-BFGS-B'
)
est_alpha = np.concatenate([[0.0], result.x])

# Compare true vs estimated ranking
true_rank = np.argsort(true_alpha)[::-1]
est_rank  = np.argsort(est_alpha)[::-1]

print(f"\nTrue ranking (item indices): {true_rank}")
print(f"Estimated ranking:           {est_rank}")
rank_corr = np.corrcoef(true_alpha, est_alpha)[0, 1]
print(f"Correlation with true scores: {rank_corr:.4f}")
```

---

## Mfano wa Thurstone

Mfano wa Thurstone {cite}`thurstone1927law` unahusiana sana na Bradley-Terry lakini unatumia kelele ya Gaussian badala ya logistiki:

$$
P(i \succ j) = \Phi\left(\frac{\alpha_i - \alpha_j}{\sqrt{2}\sigma}\right)
$$

ambapo $\Phi$ ni CDF ya kawaida ya kawaida. $\sigma = 1/\sqrt{2}$ ikifaa, hii inakuwa sawa na BT na tofauti ndogo ya kupimia. Katika mazoezi, mifano miwili inatoa matokeo yanayofanana karibu.

---

## Ujumuishaji wa Upangaji

Kila mweka maelezo anapotoa upangaji kamili wa vipengele $K$ (badala ya ulinganisho wa jozi), tatizo ni **ujumuishaji wa upangaji**: changanya orodha nyingi zilizopangwa kuwa upangaji wa makubaliano.

**Hesabu ya Borda:** Kila kipengele hupokea alamu sawa na idadi ya vipengele vilivyopangwa chini yake katika upangaji wa kila mweka maelezo. Alamu zinajumuishwa kati ya wawekaji maelezo. Rahisi na imara.

**Kemeny–Young:** Pata upangaji unaopunguza jumla ya kutokubaliana kwa jozi (umbali wa Kendall tau) na upangaji wa kila mweka maelezo. Hii ni NP-ngumu kwa $K$ kubwa lakini inaweza kutekelezwa kwa seti ndogo.

**RankNet / ListNet:** Mbinu za neva zinazojifunza kitendaji cha kupanga kutoka kwa orodha zilizopangwa, kuwezesha ujumla kwa vipengele ambavyo havijawahi kuonekana.

---

## Banditi za Kupigana

Katika kujifunza mapendeleo **mtandaoni**, vipengele hufika kama mtiririko na lazima tuamue jozi zipi za kulinganisha, kusawazisha uchunguzi (kujifunza kuhusu vipengele visivyojulikana) na unyonyaji (kuwasilisha vipengele vya ubora wa juu). Hili ndilo tatizo la **banditi ya kupigana** {cite}`yue2009interactively`.

Kanuni muhimu:
- **Doubler:** Inabeba kipengele cha shujaa; kinashindana nacho kwa washindani wa nasibu
- **RUCB (Kizingiti cha Imani cha Kilinganisho cha Juu Zaidi):** Huhesabu vipindi vya imani vya mtindo wa UCB kwa uwezekano wa kila kipengele kushinda kila kipengele kingine
- **MergeRank:** Huchanganya ulinganisho wa mtindo wa mashindano na UCB

Banditi za kupigana zinatumika katika mifumo ya mapendekezo ya mtandaoni (makala gani ya kuonyesha ijayo, ukitoa maoni ya picha) na uchimbaji wa mapendeleo wa mwingiliano kwa ukusanyaji wa data ya RLHF.

---

## Kujifunza Mapendeleo kwa Mifano ya Lugha

Katika muktadha wa RLHF (Sura ya 6), mfano wa Bradley-Terry unatumika kufunza mfano wa zawadi. Tofauti muhimu ni **Uboreshaji wa Mapendeleo wa Moja kwa Moja (DPO)** {cite}`rafailov2023direct`, unaoonyesha kwamba lengo la RLHF linaweza kuboreshwa moja kwa moja kutoka kwa data ya mapendeleo bila kufunza mfano tofauti wa zawadi:

$$
\mathcal{L}_\text{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_\text{ref}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_\text{ref}(y_l \mid x)} \right) \right]
$$

DPO ni rahisi zaidi kuliko RLHF kamili (hakuna mzunguko wa mafunzo wa PPO, hakuna mfano wa zawadi) huku ukifikia matokeo yanayolinganishwa au bora kwenye vipimo vingi {cite}`rafailov2023direct`. Imekuwa mbadala unaotumika sana kwa RLHF inayotegemea PPO kwa kurekebisha fini kwa kufuata maelekezo, ingawa mbinu zote mbili bado zinatumika kikamilifu na nguvu zao za kilinganisho zinategemea kazi.

---

## Kukusanya Data ya Mapendeleo ya Ubora wa Juu

Ubora wa data ya mapendeleo unaathiri ubora wa mfano wa zawadi. Mambo muhimu ya kuzingatia:

**Utofauti wa maswali.** Data ya mapendeleo inapaswa kufunika usambazaji wote wa maswali ambayo mfano utakutana nayo wakati wa utekelezaji. Mapengo katika usimamizi husababisha tabia isiyotegemewa ya mfano wa zawadi katika maeneo hayo.

**Utofauti wa majibu.** Kulinganisha majibu mawili yanayofanana sana kutoa taarifa ndogo. Majibu yanayolinganishwa yanapaswa kutofautiana vya kutosha kwa wawekaji maelezo kuwa na upendeleo wazi.

**Makubaliano ya wawekaji maelezo.** Makubaliano ya chini ya wawekaji maelezo yanaonyesha vigezo vya ulinganisho vina utata. Pima makubaliano (κ ya Cohen) na rekebisha mwongozo unapokuwa chini ya viwango vinavyokubalika.

**Urekebishaji.** Wawekaji maelezo wanapaswa kuelewa *kwa nini* jibu moja ni bora: usaidizi, usahihi, usalama, mtindo? Kazi zinazounganisha vigezo vingi huwa hutoa mapendeleo yasiyo thabiti. Mara nyingi ni bora kukusanya mapendeleo kwenye kila kigezo kwa kujitegemea.

```{seealso}
Mfano wa Bradley-Terry: {cite}`bradley1952rank`. Thurstone: {cite}`thurstone1927law`. Banditi za kupigana: {cite}`yue2009interactively`. Uboreshaji wa Mapendeleo wa Moja kwa Moja (DPO): {cite}`rafailov2023direct`.
```
