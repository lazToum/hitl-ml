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

# Koyo daga Kwatancen da Jeri

Roƙon dan adam su sanya kyautatuwar inganci ta cikakke ga sakamakon yana da wuya. Mene ne ingancin lissafi na wannan rubutu, akan sikelin 1 zuwa 10? Tambayar ba ta bayyananne: dan adam yana rasa sikeli na ciki mai daidaito, kuma maki ɗinsu suna shafawa sosai ta anchoring, mahallin, da gajiya.

Roƙon dan adam su *kwatanta* sakamakon biyu yana da sauƙi sosai: wane rubutu ya fi, A ko B? Hukunci na kwatancen sun fi daidaito, sun fi aminci, kuma suna taɓa fifikon dan adam kai tsaye fiye da ƙididdigan cikakke. Wannan babi ya ƙunshi tushen lissafi da aikace-aikacen da ke da amfani na koyo daga kwatancen da jeri.

---

## Dalilin da Ya Sa Kwatancen Sun Fi Ƙididdigan

### Asalin Kimiyyar Ilimin ɗan Adam

Fifikon hukunci na kwatancen yana da tarihi mai tsawo a cikin kimanta yanayi. Dokar Hukunci na Kwatancen ta Thurstone {cite}`thurstone1927law` (1927) ta nuna cewa ko da lokacin da dan adam yana da hukunci na cikakke mara daidaito, hukuncin su na dangi yana bin doka mai yiwuwa mai daidaito. Kwatancen suna amfani da gaskiyar cewa dan adam sun fi ƙwarewa a *fahimtar dangi* fiye da daidaita cikakke.

### Ingancin Lissafi

Kowane kwatancen biyu biyu yana ba da bayanai game da *matsayin dangi* na abubuwan biyu akan sikelin inganci. Tare da $K$ abubuwa, $K-1$ kwatancen suna iya jera duk abubuwa; kawai $O(\log K)$ kwatancen ake buƙata don nemo item mafi ƙari. Ƙididdigan cikakke galibi yana buƙatar hukunci fiye da kima don cimma daidaito ɗaya.

### Girman Sikeli

Don samfurin generative, yawan sakamakon daban-daban yana da tasiri mara iyaka. Ƙididdiga sakamakon ta cikakke yana buƙatar kafa sikeli mai haɗin gwiwa a duk sakamakon; kwatanta sakamakon yana buƙatar kawai hukunci na gida, na dangi waɗanda suka daidaita da juna ta halitta.

---

## Tsarin Bradley-Terry

Tsarin iya yiwuwa mai rinjaye don kwatancen biyu biyu shine **tsarin Bradley-Terry (BT)** {cite}`bradley1952rank`. Kowane item $i$ yana da maki inganci da ke ɓoye $\alpha_i \in \mathbb{R}$. Iya yiwuwar cewa item $i$ an fi so da item $j$ a cikin kwatancen kai tsaye shine:

$$
P(i \succ j) = \frac{e^{\alpha_i}}{e^{\alpha_i} + e^{\alpha_j}} = \sigma(\alpha_i - \alpha_j)
$$

inda $\sigma$ shine logistic sigmoid. Wannan daidai yake da ɗauka cewa ingancin da ake gane na item $i$ shine $\alpha_i + \epsilon$ inda $\epsilon$ shine ma'aunin hayaniya na logistic.

### Iya Gane

Tsarin BT yana iya gane har zuwa fassara: idan $\alpha$ mafita ce, haka ma $\alpha + c$ don duk yawan $c$. Al'ada ta yau da kullum ita ce ƙayyade maki ɗaya (misali, $\alpha_0 = 0$) ko ƙuntatawa $\sum_i \alpha_i = 0$. Ana iya gane maki kawai lokacin da **graph na kwatancen** (nodes = abubuwa, edges = nau'i da aka ga) **yana da haɗi** — idan graph yana da sassan da ba sa haɗi, alaƙan maki a cikin sassan ba su da ma'ana.

### Ƙiyasin Sinadari

Da saitin bayanai na kwatancen biyu biyu $\mathcal{D} = \{(i, j, y_{ij})\}$ inda $y_{ij} = 1$ idan $i$ an fi so da $j$, log-likelihood shine:

$$
\mathcal{L}(\alpha) = \sum_{(i, j, y_{ij}) \in \mathcal{D}} \left[ y_{ij} \log \sigma(\alpha_i - \alpha_j) + (1 - y_{ij}) \log \sigma(\alpha_j - \alpha_i) \right]
$$

Wannan ayyuka mai gwiwa ne na $\alpha$ kuma za a iya inganta shi ta hanyar haɓaka gradient ko hanyar Newton.

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

## Tsarin Thurstone

Tsarin Thurstone {cite}`thurstone1927law` yana da alaƙa da Bradley-Terry amma yana amfani da hayaniya ta Gaussian maimakon logistic:

$$
P(i \succ j) = \Phi\left(\frac{\alpha_i - \alpha_j}{\sqrt{2}\sigma}\right)
$$

inda $\Phi$ shine CDF na yau da kullum. Lokacin da $\sigma = 1/\sqrt{2}$, wannan ya zama daidai da BT tare da sauƙaƙan bambancin sukeli. A aiki, samfurin biyu suna ba da sakamakon kusan ɗaya.

---

## Haɗa Jeri

Lokacin da kowane mai sanya lakabi ya ba da cikakken jeri na $K$ abubuwa (maimakon kwatancen biyu biyu), matsala ita ce **haɗa jeri**: haɗa jerin jeri da yawa zuwa jeri na yarjejeniya.

**Ƙididdigan Borda:** Kowane item yana karɓar maki daidai da yawan abubuwa da aka jera ƙasansa a cikin jerin kowane mai sanya lakabi. Ana haɗa maki daga cikin masu sanya lakabi. Sauƙi da ƙarfi.

**Kemeny–Young:** Nemo jeri wanda ke rage jimla na rashin jituwa biyu biyu (nisan Kendall tau) tare da jerin kowane mai sanya lakabi. Wannan NP-hard ne don babban $K$ amma mai yiwuwa don ƙaramin saitin.

**RankNet / ListNet:** Hanyoyin cibiyar jijiya waɗanda ke koyon ayyukan ƙididdiga daga jerin jeri, yana ba da damar yaɗuwa ga abubuwa da ba a ga su ba.

---

## Makiyayan Biyu Biyu

A cikin koyon fifiko **yanar gizo**, abubuwa suna isa cikin yanayi kuma dole ne mu yanke shawara waɗanne nau'i za a kwatanta, daidaita bincike (koyon game da abubuwa da ba a sani ba) da amfani (gabatar da abubuwa masu inganci). Wannan shine matsalar **makiyan biyu biyu** {cite}`yue2009interactively`.

Algorithm ɗin muhimmanci:
- **Doubler:** Yana kiyaye item jagora; yana ƙalubalantar shi da abokan hamayya ta damari
- **RUCB (Iyakar Amincewar Mai Dangi):** Yana ƙididdige tazarar amincewar salon UCB don iya yiwuwar kowane item ya fi kowane item ɗin na biyu
- **MergeRank:** Yana haɗa kwatancen salon gasar da UCB

Ana amfani da makiyayan biyu biyu a tsarin shawarwarin yanar gizo (wane labari za a nuna gaba, da ra'ayin da ke ɓoye) da neman fifiko mai mu'amala don tattara bayanin RLHF.

---

## Koyon Fifiko don Samfurin Harshe

A mahallin RLHF (Babi na 6), ana amfani da tsarin Bradley-Terry don horar da samfurin lada. Wani bambancin muhimmanci shine **Inganta Fifiko Kai Tsaye (DPO)** {cite}`rafailov2023direct`, wanda ke nuna cewa za a iya inganta manufar RLHF kai tsaye daga bayanin fifiko ba tare da horar da samfurin lada daban ba:

$$
\mathcal{L}_\text{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_\text{ref}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_\text{ref}(y_l \mid x)} \right) \right]
$$

DPO yana da sauƙi fiye da cikakken RLHF (babu zagayen horarwa na PPO, babu samfurin lada) yayin da cimma sakamakon kwatankwacin ko mafi kyau akan gwaji da yawa {cite}`rafailov2023direct`. Ya zama hanya mai faɗin amfani maimakon RLHF bisa PPO don daidaitar bin umarni, ko da yake hanyoyin biyu har yanzu suna cikin amfani mai aiki kuma ƙarfinsu na dangi yana dogara akan aiki.

---

## Tattara Bayanin Fifiko Mai Inganci

Ingancin bayanin fifiko yana ƙayyade ingancin samfurin lada. Abubuwan da ke da muhimmanci:

**Iri-iri na tambaya.** Bayanin fifiko ya kamata ya rufe cikakkiyar rarrabawar tambayoyin da samfuri zai fuskanta a aikawa. Giɓɓin rufe yana haifar da ɗabi'ar samfurin lada mara aminci a waɗancan yankuna.

**Iri-iri na amsa.** Kwatanta amsoshi biyu makamancin haka yana ba da bayanai kaɗan. Amsoshin da aka kwatanta ya kamata su bambanta sosai don masu sanya lakabi su sami fifiko bayyananne.

**Yarjejeniya na masu sanya lakabi.** Yarjejeniya ƙasa da yawa tsakanin masu sanya lakabi yana ba da shawara ma'aunin kwatancen ba a bayyananne. Auna yarjejeniya (kappa na Cohen) kuma gyara jagoran lokacin da ta kasance ƙasa da iyakar da za a iya yarda.

**Daidaita ƙididdigan.** Masu sanya lakabi ya kamata su fahimci *dalilin da ya sa* amsa ɗaya ta fi: taimako, daidaito, aminci, salo? Ayyuka waɗanda ke haɗa ma'aunai da yawa galibi suna samar da fifiko mara daidaito. Galibi ya fi kyau don tattara fifiko akan kowane ma'auni daban.

```{seealso}
Tsarin Bradley-Terry: {cite}`bradley1952rank`. Thurstone: {cite}`thurstone1927law`. Makiyayan biyu biyu: {cite}`yue2009interactively`. Inganta Fifiko Kai Tsaye (DPO): {cite}`rafailov2023direct`.
```
