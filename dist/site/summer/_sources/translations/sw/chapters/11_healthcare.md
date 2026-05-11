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

# HITL katika Afya na Sayansi

Huduma ya afya na sayansi zinawakilisha mawili kati ya maeneo ambapo HITL ML ina matokeo makubwa zaidi na inajadiliwa zaidi. Hatua ni kubwa: utambuzi wa saratani uliokosewa au lengo la dawa lenye kasoro lina gharama ya kweli ya kibinadamu. Uwekaji maelezo unahitaji utaalamu wa nadra na ghali. Mahitaji ya kisheria yanazuia mifano inaweza kufanya nini na jinsi lazima ithhibitishwe. Na tofauti na NLP, ambapo tatizo la uwekaji maelezo ni kwa sehemu la ujenzi wa kijamii, hapa mara nyingi kuna ukweli halisi wa ardhi — uvimbe upo au hauko — hata kama hakuna mwangalifu mmoja anayeweza kuuamua kwa uaminifu.

Mfumo mkubwa katika chanjo maarufu ni "AI dhidi ya binadamu": je, AI itabadilisha madaktari wa radiolojia? Mfumo huu ni mbaya kwa njia inayohusika. Swali halisi ni aina gani ya ushirikiano wa binadamu-AI inazalisha matokeo bora kuliko yoyote peke yake, na jinsi ya kujenga mifumo inayowezesha ushirikiano huo badala ya kuutatiza.

---

## Uchambuzi wa Picha za Kimatibabu

Kupiga picha za kimatibabu — radiolojia (X-ray, CT, MRI), patholojia (slaidi za tishu), darmatolojia, ofthalmolojia — ni uwanja ambapo AI ya kimatibabu imepiga hatua haraka zaidi.

### Mahitaji ya Mweka Maelezo Mtaalamu

Uwekaji maelezo wa picha za kimatibabu kawaida unahitaji madaktari wenye mafunzo maalum ya taaluma ndogo. Hii hufanya uwekaji maelezo kuwa:

- **Wa polepole:** Wataalamu wana muda mdogo; uwekaji maelezo unashindana na majukumu ya kliniki
- **Ghali:** Gharama zinaanzia makumi hadi mamia ya dola kwa kesi iliyowekewa maelezo, kulingana na taaluma ndogo, hali, na ugumu wa kazi
- **Tofauti:** Hata wataalamu wanakinzana, hasa kwenye hali za mpaka — ukweli ambao mara nyingi unachukuliwa kama tatizo lakini kweli una habari

### Tofauti kati ya Madaktari wa Radiolojia

Tofauti ya msomaji imeandikwa vizuri katika radiolojia. Kwa tafsiri ya X-ray ya kifua, kutokubaliana kwa wasomaji ni muhimu — katika utafiti wa CheXNet, madaktari wanne wa radiolojia waliweka lebo kwenye seti sawa ya upimaji wa ugunduzaji wa nimonia na alamu za F1 zinazopana takriban pointi 12 za asilimia {cite}`rajpurkar2017chexnet`, zinaakisi wasiwasi wa kweli wa utambuzi kwenye hali za mpaka. Kwa ugunduzaji wa nodulio kwenye CT ya mapafu, tofauti ya ndani ya msomaji (msomaji mmoja, kesi moja, siku tofauti) inaweza kuwa kubwa kama tofauti kati ya wasomaji.

Tofauti hii si kelele tu — inaakisi wasiwasi wa kweli wa utambuzi. Mifano iliyofunzwa kwenye maelezo ya daktari mmoja wa radiolojia inaweza kujifunza upendeleo maalum wa daktari huyo badala ya patholojia iliyo chini.

:::{admonition} Mgongano wa CheXNet kama Somo la HITL
:class: note

Rajpurkar et al. walipodai kwamba mfano wao wa CheXNet "ulizidi utendaji wa daktari wa radiolojia" kwenye ugunduzaji wa nimonia, dai hilo lilipingwa mara moja na jumuiya ya radiolojia {cite}`yu2022assessing`. Sehemu ya mgongano ulikuwa kuhusu seti maalum ya upimaji na ulinganisho wa daktari wa radiolojia. Lakini tatizo la kina zaidi lilikuwa la kimbinu: msingi wa "utendaji wa daktari wa radiolojia" uliotumia wasomaji wa peke yao chini ya shinikizo la muda, wakati radiolojia ya kliniki kawaida inahusisha mashauriano, ulinganisho na picha za awali, na ufikiaji wa muktadha wa kliniki — ambayo mfano haukuwa nayo.

Somo si kwamba mfano ulikuwa mzuri au mbaya, bali kwamba **ulinganisho wa utendaji unahitaji kubainisha mpangilio wa HITL**. Mfano unaozidi daktari wa radiolojia wa peke yake anayesoma baridi unaweza bado kuwa sahihi kidogo kuliko daktari wa radiolojia anayetumia tokeo la mfano kama maoni ya pili. Hizi ni mifumo tofauti yenye njia tofauti za makosa, na inakusanyika tofauti.
:::

:::{admonition} Lebo laini katika dawa
:class: important

Miradi kadhaa ya AI ya kimatibabu imehamia kutumia **lebo laini** zinazoakisi usambazaji wa maoni ya wataalam badala ya lebo moja ya "kiwango cha dhahabu". X-ray ya kifua iliyowekewa lebo kama nimonia 60% / atelectasis 40% na jopo la madaktari wa radiolojia ina habari zaidi kuliko chaguo la kulazimishwa la binary. Mifano iliyofunzwa kwenye usambazaji kama huo inaonyesha urekebishaji bora na upimaji wa wasiwasi unaofaa zaidi — na wasiwasi huo una maana ya kliniki, kwani humwambia daktari wa kliniki wakati wa kushauriana, si tu mfano unaofikiria nini.
:::

### Ujifunzaji Tendaji kwa Hali Adimu

Ujifunzaji tendaji una thamani sana kwa magonjwa adimu na patholojia adimu, ambapo hata bwawa kubwa lisilo na lebo lina kesi chache za chanya. Sampuli ya nasibu ya kawaida ingepoteza muda wa mtaalamu kuweka lebo hasa kesi hasi.

Ujifunzaji tendaji unaotegemea wasiwasi huchagua kwa asili hali za mpaka ambapo mfano una wasiwasi — ambazo, kwa hali adimu, huwa ni kesi za chanya na hasi za mpaka. Hii inazingatia muda wa mtaalamu mahali panapokuwa na thamani zaidi. Mchanganyiko wa mafunzo ya darasa lisiosawaziwa (na `class_weight='balanced'` au sawa) na uchaguzi unaotegemea wasiwasi ni mazoezi ya kawaida kwa kazi za ugunduzi wa patholojia adimu.

---

## Uwekaji Maelezo wa NLP ya Kliniki

Rekodi za kielectroniki za kiafya (EHRs) zina utajiri mkubwa wa maandishi ya hadithi ya kliniki: maelezo ya madaktari, muhtasari wa kutoka hospitalini, ripoti za radiolojia, ripoti za patholojia. Kuchimba habari zilizopangwa kutoka maandishi haya kunahitaji NLP — na NLP ya ubora wa juu inahitaji data ya mafunzo iliyowekewa maelezo.

**Kazi za kawaida za uwekaji maelezo wa NLP ya kliniki:**
- **NER ya kliniki:** Kutambua dawa, kipimo, utambuzi, taratibu, na dalili katika maandishi
- **Ugunduzaji wa kukanusha:** "Hakuna ushahidi wa nimonia" dhidi ya "Nimonia imethibitishwa" — tofauti muhimu ambayo ni ngumu kushangaza
- **Ufikiriaji wa muda:** Kutofautisha hali za sasa na historia ("historia ya MI, alihudhuria na maumivu ya kifua")
- **Kuondoa utambuzi:** Kuondoa Habari Zilizo Chini ya Ulinzi (PHI) kuwezesha kushiriki data

**Kuondoa utambuzi wa PHI** ni kazi ya uwekaji maelezo na mahitaji ya utawala wa data. Chini ya HIPAA (Marekani) na GDPR (EU), data ya kiafya haiwezi kushirikiwa bila kuondoa au kufanya isijulikane vitambulisho vya mgonjwa. Zana za kuondoa utambuzi kiotomatiki zipo lakini si kamili; mapitio ya binadamu ya matokeo ya kiotomatiki ni mazoezi ya kawaida, na wasifu wa hatari ni usio-sawa: hasi za uongo (PHI zilizokosewa) zinaunda mfiduo wa kisheria, ikifanya viwango vya kihafidhina vya lazima.

### i2b2 / n2c2 kama Kiolezo

Mipango ya kazi zilizoshirikiwa za i2b2 (Informatics for Integrating Biology and the Bedside) na mrithi n2c2 (National NLP Clinical Challenges) imetoa safu ya mkusanyiko wa data wa NLP ya kliniki uliosema na wataalam. Hizi zinaonyesha uwezo na gharama: juhudi za uwekaji maelezo kawaida zinahusisha timu za wataalam wa uwanja wa kliniki wanaofanya kazi kwa miezi kadhaa, wakiweka maelezo kwenye hati mamia kwa changamoto. Mkusanyiko wa data wa n2c2 umechochea maendeleo ya haraka hasa kwa sababu ulitatua tatizo la utawala wa kushiriki data (kuondoa utambuzi + makubaliano ya kitaasisi), si tatizo la uwekaji maelezo tu.

---

## Mambo ya Kisheria

AI ya kimatibabu inakabiliwa na usimamizi wa kisheria katika mamlaka nyingi.

**FDA (Marekani):** Programu kama Kifaa cha Kimatibabu (SaMD) inayotegemea AI/ML inahitaji idhini ya awali au ruhusa ya soko. Mpango wa Utekelezaji wa AI/ML wa FDA wa 2021 unasisitiza **mipango ya udhibiti wa mabadiliko iliyoamuliwa awali** — kuandika jinsi mfano utasasishwa na jinsi masasisho hayo yatathhibitishwa kabla ya utekelezaji. Mfano unaojifunza kwa kuendelea kutoka kwa maoni ya kliniki ni, chini ya mfumo huu, kifaa tofauti baada ya kila sasishi na kinaweza kuhitaji uthibitishaji upya.

**Alama ya CE (Ulaya):** Vifaa vya kimatibabu ikiwemo mifumo ya AI lazima vizingatie Kanuni za Kifaa cha Kimatibabu (MDR). MDR inahitaji tathmini ya kliniki, ufuatiliaji wa baada ya soko, na nyaraka za data iliyotumiwa kwa mafunzo na uthibitishaji.

**Athari kuu ya HITL:** Mifumo ya kisheria inahitaji nyaraka wazi za michakato ya uwekaji maelezo, sifa za wawekaji maelezo, uaminifu wa tathmini ya wasomaji wengi, na mabadiliko yoyote kwa data ya mafunzo. Hii si mzigo wa kiutawala — ni mkondo wa ukaguzi unaoruhusu daktari wa kliniki kuelewa data ya mafunzo iliyozalisha tabia ya sasa ya mfano, na inahitajika kwa kisheria. Mifumo ya HITL inayouona uwekaji maelezo kama mchakato usio rasmi huunda hatari ya kisheria ambayo kawaida huonekana wakati mbaya zaidi.

---

## Uwekaji Maelezo wa Data ya Kisayansi

Zaidi ya huduma ya afya, HITL ML inacheza jukumu linaloongezeka na lisilotambuliwa kikamilifu katika utafiti wa kisayansi, ambapo changamoto ya uwekaji maelezo mara nyingi huchanganya utaalamu wa uwanja na kiwango.

### Astronomia: Galaxy Zoo

Galaxy Zoo {cite}`lintott2008galaxy` iliwashirikisha wanasayansi raia kuainisha muundo wa galaksi kutoka kwa Sloan Digital Sky Survey. Mradi wa awali ulikusanya zaidi ya uainishaji milioni 40 kutoka kwa wajitolea zaidi ya 100,000, ukionyesha kwamba ushirikiano wa umma kwa kiwango kikubwa wa uainishaji wa picha za kisayansi unawezekana kazi inapoweza kugawanywa katika maswali rahisi yanayoweza kujibiwa bila mafunzo ya mtaalamu ("Je, galaksi hii ni laini au ina vipengele?").

Uzoefu wa Galaxy Zoo ulizalisha matokeo mawili muhimu ya kimbinu. Kwanza, makubaliano kati ya wanasayansi raia na wanaastronomi wa kitaalamu yalikuwa ya juu kwa hali wazi na yalitofautiana kwa kimfumo kwenye hali za mpaka — hasa hali ambapo tofauti ina umuhimu wa kisayansi. Suluhisho haikuwa kutupa data ya sayansi ya raia kwenye hali za mpaka bali kutibu usambazaji wa majibu ya wajitolea kama lebo laini inayoweka utata wa kweli wa kimuundo. Pili, kisambazaji kilichofunzwa kwenye lebo za Galaxy Zoo kilikuwa bora kuliko mifano iliyofunzwa kuiga lebo za mtaalamu yeyote mmoja, kwa sababu usambazaji wa umati ulinasa wasiwasi wa kweli wa kuona ambao chaguo la kulazimishwa la mtaalamu mmoja ulikukunywa.

### Genomiki: Uainishaji wa Pathogenicity

Kuweka maelezo kwenye tofauti za genomiki — kuamua kama tofauti ni ya kudhuru, salama, au ya maana isiyo wazi — ni tatizo la NLP yenye hatari kubwa na hukumu ya wataalam. Hifadhidata za kimatibabu za tofauti kama ClinVar hujumuisha tafsiri za wataalam kutoka maabara nyingi zinazotoa, na kutokubaliana kati ya maabara ni kawaida. Ujifunzaji tendaji unatumika kutanguliza tofauti zipi zinahitaji mapitio kamili ya wataalam (utafutaji wa fasihi, tathmini ya ushahidi wa kazi) dhidi ya zipi zinaweza kuwekewa maelezo kiotomatiki na ushahidi uliopo. Matokeo ni mfumo mseto ambapo tofauti nyingi zinashughulikiwa na mantiki ya kiotomatiki, kundi dogo linahitaji mapitio ya wataalam, na hali ngumu zaidi zinabainishwa kwa makubaliano ya maabara nyingi.

### Hali ya Hewa na Sayansi ya Ardhi

Kuweka lebo kwenye picha za satelaiti kwa mabadiliko ya matumizi ya ardhi, ukataji miti, upanuzi wa barafu, na njia za dhoruba kunahusisha wataalam wa kunasa kwa mbali na, zaidi, majukwaa ya sayansi ya raia. Changamoto kuu ya HITL katika uwanja huu ni ya muda: lebo zilizofanywa leo zinaweza kuwa za zamani kadri ulimwengu unavyobadilika, na uthibitishaji wa ukweli wa ardhi (uchunguzi wa shambani) ni ghali na umezuiliwa kwa ulogistiki. Ujifunzaji tendaji unaotanguliza picha ambapo utabiri wa mfano unakinzana na vigezo vya kimwili (k.m., kutabiri ukataji miti katika eneo linalojulikana kuwa linalindwa) ni njia ya vitendo ya kuelekeza rasilimali adimu za uthibitishaji wa shambani.

### Sayansi ya Neva: Connectomics

Kuunda upya mzunguko wa neva kutoka picha za darubini ya elektroni — connectomics — inahitaji uwekaji maelezo wa kiwango cha pikseli wa utando wa neva kati ya safu kubwa za picha. Mradi wa Eyewire uliweza kufanya mchezo wa kazi hii, ukiwaingiza wachezaji maelfu wa kufuatilia neva kupitia seli za picha za 3D. Muundo wa uchezaji ulitoa tatizo maalum la HITL: kazi inahitaji makini yanayoendelea na ufikiriaji wa anga kwa vikao virefu, ambavyo husababisha kupungua kwa ubora katika uwekaji maelezo wa kitambo. Kugawanya kazi katika sehemu za mchezo na mitambo ya kijamii kuliweka ushirikiano na ubora wa wawekaji maelezo kwa kiwango ambacho uwekaji maelezo wa kitaalamu hauwezi kufikia.

---

## Kusimamia Wawekaji Maelezo Wataalamu

Uwekaji maelezo unapohitaji utaalamu wa nadra, njia za kawaida za ushirikiano wa umma (Sura ya 13) hazitumiki.

**Mvutano wa kimsingi** ni kwamba watu wanaoweza kuzalisha maelezo ya ubora wa juu zaidi pia ni watu ambao wakati wao una thamani zaidi na umezuiliwa zaidi. Kila uamuzi wa muundo katika mfumo wa uwekaji maelezo wa wataalamu unapaswa kupimwa dhidi ya swali: je, hii inafanya matumizi bora ya muda wa mtaalamu adimu?

**Hii inamaanisha nini katika mazoezi:**

- **Weka maelezo ya awali kwa nguvu.** Tumia wawekaji maelezo wa kiwango cha chini, mifano otomatiki, au mifumo inayotegemea sheria kuzalisha wagombea ambao mtaalamu anakagua na kurekebisha badala ya kuunda kutoka mwanzo. Hukumu ya mtaalamu ndiyo kikwazo; kuwalisha uwekaji maelezo wa awali wa kurekebisha ni wa haraka zaidi kuliko kuwaomba waweke maelezo kutoka skrini tupu, mradi ubora wa uwekaji maelezo wa awali ni wa kutosha kwamba marekebisho si ya polepole zaidi kuliko kuanza upya.

- **Buniwa kwa makini ya mtaalamu, si uzalishaji.** Violesura vya uwekaji maelezo vilivyoboreshwa kwa uzalishaji wa juu (maamuzi ya haraka ya binary, mkato wa kibodi, onyesho dogo) yanafaa kwa ushirikiano wa umma. Uwekaji maelezo wa wataalamu mara nyingi hufaidika na violesura tajiri zaidi: ulinganisho wa jozi wa kesi za awali, ufikiaji rahisi wa vifaa vya rejeleo, uwanja wa kuamini wa uwekaji maelezo, na uwezo wa kubainisha kesi kwa majadiliano. Hizi zinapunguza maelezo binafsi lakini zinaboresha ubora na kupunguza haja ya kuweka maelezo tena.

- **Fuatilia mifumo ya wawekaji maelezo binafsi waziwazi.** Na bwawa dogo la wataalamu, inawezekana na muhimu kufuatilia kiwango cha makubaliano cha kila mweka maelezo na jopo, kubainisha kesi zinazoonekana kutofautiana na historia yao wenyewe, na kuzijadili katika vikao vya urekebishaji wa kawaida. Hii si ufuatiliaji — ni mchakato huo huo wa ubora ambao dawa ya kliniki inatumia kwa mapitio ya utendaji, na wataalamu kwa ujumla wanajibu vizuri inapowasilishwa kama uboreshaji wa ubora wa pamoja badala ya tathmini.

- **Muundo wa kikao una umuhimu.** Uwekaji maelezo wa kimatibabu ni wa kudai kiakili. Ushahidi kutoka radiolojia na patholojia unaonyesha kwamba viwango vya makosa huongezeka kwa kiasi kinachopimika baada ya takriban dakika 90 za kusoma kwa kuendelea, na kwamba mapumziko ya dakika chache hata yanaweza kurejesha makini kwa sehemu. Violesura vya uwekaji maelezo vinavyolazimisha mapumziko ya maelekezo (bila kufanywa vinaweza kutupwa) ni uamuzi rahisi wa muundo wa HITL wenye athari ya kweli ya ubora.

---

## Mfumo wa Ujifunzaji Tendaji wa HITL kwa Picha za Kimatibabu

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.datasets import make_classification
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

# Simulate a rare-pathology detection task
# 8% positive class (e.g., rare pathology)
X, y = make_classification(
    n_samples=5000, n_features=100,
    n_informative=20, n_redundant=10,
    weights=[0.92, 0.08],
    random_state=42
)
X_train, y_train = X[:4000], y[:4000]
X_test,  y_test  = X[4000:], y[4000:]

print(f"Training set positive prevalence: {y_train.mean():.1%}")

def run_medical_al(strategy, n_initial=50, budget=300):
    labeled = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled = [i for i in range(len(X_train)) if i not in labeled]
    aucs = []

    while len(labeled) < n_initial + budget:
        model = LogisticRegression(max_iter=500, class_weight='balanced')
        model.fit(X_train[labeled], y_train[labeled])

        if len(labeled) % 30 == 0:
            preds = model.predict_proba(X_test)[:, 1]
            aucs.append(roc_auc_score(y_test, preds))

        X_pool = X_train[unlabeled]
        if strategy == 'uncertainty' and len(labeled) >= 10:
            probs = model.predict_proba(X_pool)
            entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
            q = int(np.argmax(entropy))
        else:
            q = rng.integers(0, len(unlabeled))

        labeled.append(unlabeled.pop(q))

    return np.array(aucs)

aucs_al  = run_medical_al('uncertainty')
aucs_rnd = run_medical_al('random')
label_counts = np.arange(len(aucs_al)) * 30 + 50

plt.figure(figsize=(7, 4))
plt.plot(label_counts, aucs_al,  'o-',  color='#2b3a8f', linewidth=2, label='Uncertainty AL')
plt.plot(label_counts, aucs_rnd, 's--', color='#e05c5c', linewidth=2, label='Random baseline')
plt.xlabel("Expert labels obtained", fontsize=12)
plt.ylabel("AUROC", fontsize=12)
plt.title("Active Learning for Rare Pathology Detection", fontsize=13)
plt.legend(); plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('medical_al.png', dpi=150)
plt.show()

# Show how AL preferentially selects positive examples
# by checking which class the queried examples belong to
n_init = 50
labeled_al  = list(rng.choice(len(X_train), n_init, replace=False))
labeled_rnd = labeled_al.copy()
unlabeled_al  = [i for i in range(len(X_train)) if i not in labeled_al]
unlabeled_rnd = unlabeled_al.copy()

model = LogisticRegression(max_iter=500, class_weight='balanced')
model.fit(X_train[labeled_al], y_train[labeled_al])
probs = model.predict_proba(X_train[unlabeled_al])
entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
top50_al  = [unlabeled_al[i] for i in np.argsort(entropy)[-50:]]
top50_rnd = list(rng.choice(unlabeled_rnd, 50, replace=False))

pos_rate_al  = y_train[top50_al].mean()
pos_rate_rnd = y_train[top50_rnd].mean()
print(f"\nPositive rate in next 50 queries:")
print(f"  Uncertainty AL: {pos_rate_al:.1%}  (base rate: {y_train.mean():.1%})")
print(f"  Random:         {pos_rate_rnd:.1%}")
print(f"  AL queries {pos_rate_al/y_train.mean():.1f}x more positives than random")
```

```{seealso}
Ushirikiano wa umma wa Galaxy Zoo: {cite}`lintott2008galaxy`. Utendaji wa daktari wa radiolojia wa CheXNet: {cite}`rajpurkar2017chexnet`. Ubora wa picha na utambuzi unaosaidiwa na AI: {cite}`yu2022assessing`. Mbinu ya uwekaji maelezo wa NLP ya kliniki: {cite}`pustejovsky2012natural`. Kwa mwongozo wa mpango wa utekelezaji wa AI/ML wa FDA, angalia nyaraka zilizochapishwa na FDA (2021).
```
