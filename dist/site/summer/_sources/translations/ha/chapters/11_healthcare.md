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

# HITL a Kiwon Lafiya da Kimiyya

Kiwon lafiya da kimiyya suna wakilta biyu daga cikin yankuna inda HITL ML yake da muhimmanci sosai kuma yana da tattaunawa sosai. Haɗari suna da girma: gano ciwon daji da bata ko manufar magani da ke da lahani yana da kuɗin dan adam na gaske. Lakabi yana buƙatar ƙwarewa ta wuya kuma mai tsada. Buƙatun doka suna ƙuntatawa abin da samfurin zai iya yi da yadda dole ne a tabbatar da su. Kuma ba kamar NLP ba, inda matsalar lakabi a wani ɓangare ƙirƙira ta zamantakewa ce, a nan galibi akwai gaskiya ta ƙasa — ciwon daji yana nan ko ba shi ba — ko da babu mai lura ɗaya da ke iya ƙayyade ta da aminci.

Tsarin yau da kullum a cikin rubutawa na al'ada shine "AI da dan adam": shin AI zai maye gurbin likitan hoto? Wannan tsari ba daidai ba ne ta hanyar da ke da muhimmanci. Tambayar ta gaske ita ce wane nau'in haɗin gwiwa ta dan adam da AI yana samar da sakamakon mafi kyau fiye da kowane ɗaya kawai, da yadda za a gina tsarin da ke ba da damar wannan haɗin gwiwa maimakon tarawa a gare shi.

---

## Binciken Hoto Likitanci

Hoto likitanci — likitancin hoton (X-ray, CT, MRI), pathology (abin da yake cikin kyallen jikin), dermatology, ophthalmology — shine yanki inda AI likitanci ya ci gaba mafi sauri.

### Buƙatun Mai Sanya Lakabi ƙwararru

Lakabi na hoto likitanci galibi yana buƙatar likitoci masu horo na musamman na yanki. Wannan yana sa lakabi ya zama:

- **Jinkiri:** Ƙwararru suna da lokaci iyakantacce; lakabi yana gasa da ayyukan asibiti
- **Mai tsada:** Kuɗi ya kai daga goma zuwa ɗaruruwa dalar Amurka kowace yanayin da aka sanya lakabi, dangane da fanin kuma rikitarwan aikin
- **Mai bambanta:** Ko da ƙwararru suna rashin jituwa, musamman kan lokuta na iyaka — gaskiya wanda galibi ana ɗauke shi a matsayin matsala amma a zahiri yana ba da bayanai

### Bambancin Tsakanin Likitocin Hoto

Bambancin mai karatu an rubuta shi da kyau a cikin likitancin hoto. Don fassarar X-ray ƙirji, rashin jituwa tsakanin mai karatu yana da mahimmanci — a binciken CheXNet, likitocin hoto guda huɗu sun sanya lakabi ga saitin gwaji na gano pneumonia ɗaya tare da maki F1 da suka rufe kusan kashi goma sha biyu na maki {cite}`rajpurkar2017chexnet`, yana nuna rashin tabbas na gano na gaske akan lokuta na iyaka. Don gano nodule akan CT na huhu, bambancin mai karatu na ciki (mai karatu ɗaya, yanayi ɗaya, rana daban) na iya zama kamar bambancin mai karatu na waje.

Wannan bambancin ba hayaniya kawai ba ne — yana nuna rashin tabbas na gano na gaske. Samfurin da aka horar akan lakabi na likitan hoto ɗaya na iya koyon son zuciya musamman na wannan likita maimakon pathology na ƙasa.

:::{admonition} Muhawarar CheXNet a matsayin Darasin HITL
:class: note

Lokacin da Rajpurkar et al. suka da'awa cewa samfurin CheXNet ɗinsu "ya wuce aikin likitan hoto" akan gano pneumonia, an yi kalubalantar da'awar nan da nan ta al'ummar likitan hoto {cite}`yu2022assessing`. Wani ɓangare na muhawara ya kasance game da saitin gwaji musamman da kwatancen likitan hoto. Amma matsala mafi zurfi ta kasance ta hanyar: tushen "aikin likitan hoto" da aka yi amfani da shi yana amfani da masu karatu kawai a ƙarƙashin matsincin lokaci, yayin da likitancin hoto na asibiti galibi yana haɗa shawara, kwatancen zuwa hotuna na baya, da damar mahallin asibiti — babu ɗayan waɗannan samfurin ya samu.

Darasin ba shine samfuri ya yi kyau ko mara kyau ba, amma **kwatancen aiki yana buƙatar ƙayyadewa da tsarin HITL**. Samfuri wanda ya wuce likitan hoto ɗaya da ke karanta mai sanyi na iya har yanzu ya kasance mara daidai fiye da likitan hoto da ke amfani da sakamakon samfuri a matsayin ra'ayin biyu. Waɗannan tsarin daban ne masu yanayin kuskure daban, kuma haɗa su daban yana ba da sakamakon daban.
:::

:::{admonition} Lakabin laushi a likitanci
:class: important

Ayyukan AI likitanci da yawa sun koma ga amfani da **lakabin laushi** waɗanda suke nuna rarrabawar ra'ayoyin ƙwararru maimakon lakabi ɗaya na "zinariya". X-ray na ƙirji da aka sanya lakabi a matsayin 60% pneumonia / 40% atelectasis ta kwamitin likitocin hoto yana ɗaukar bayanai fiye da zaɓin tilas biyu. Samfurin da aka horar akan irin waɗannan rarrabawar suna nuna daidaitar ƙididdigan iya yiwuwa mafi kyau da kuma ƙididdigan rashin tabbas mafi dacewa — kuma wannan rashin tabbas yana da ma'ana ta asibiti, tun da yana gaya wa likita lokacin da za su yi shawarwari, ba kawai abin da samfuri ya yi tsammani ba.
:::

### Koyon Aiki don Yanayin Da Ba A Cika Ba

Koyon aiki yana da ƙima musamman don cututtuka mara cika da pathology mara cika, inda ko da tafkin da ba a yi lakabi ba yana ƙunshi kaɗan yanayi masu kyau. Samfurin ta damari zai bata lokacin ƙwararru yana yin lakabi ga yanayin mara kyau galibi.

Koyon aiki bisa rashin tabbas yana zaɓar lokuta na iyaka inda samfuri ya kasance mara tabbas — waɗanda, don cututtuka mara cika, sukan zama yanayi masu kyau da mara kyaun na iyaka. Wannan yana tattara lokacin ƙwararru inda yake da ƙima sosai. Haɗin gwiwar horarwa mara daidaito na aji (tare da `class_weight='balanced'` ko irin haka) da zaɓi bisa rashin tabbas aiki ne na yau da kullum don ayyukan gano pathology mara cika.

---

## Lakabi na NLP na Asibiti

Rikodin lafiya na lantarki (EHRs) suna ƙunshi arziki mai yawa na rubutun labari na asibiti: bayanin likita, takaitawar fita daga asibiti, rahotannin likitancin hoto, rahotannin pathology. Fitar da bayanai mai tsari daga wannan rubutu yana buƙatar NLP — kuma NLP mai inganci yana buƙatar bayanin horarwa da aka sanya lakabi.

**Ayyukan lakabi na NLP na asibiti na yau da kullum:**
- **NER na asibiti:** Gano magungunan, allurai, ganewar cutar, hanyoyin, da alamun a cikin rubutu
- **Gano musun:** "Babu shaidar pneumonia" da "An tabbatar da pneumonia" — bambance mai mahimmanci wanda yana da wuya sosai
- **Tunani na lokaci:** Bambanta yanayin yanzu daga tarihi ("tarihi na MI, ya gabatar da ciwo na ƙirji")
- **Cire gane-gane:** Cire Bayanan Lafiya da aka Kare (PHI) don ba da damar raba bayanai

**Cire PHI** duka aikin lakabi ne da buƙatar sarrafa bayanai. Ƙarƙashin HIPAA (Amurka) da GDPR (EU), ba za a iya raba bayanai na lafiya ba tare da cire ko ɓoye alamun marasa lafiya ba. Kayan aikin cire da atomatik suna wanzuwa amma ba cikakke ba; duba dan adam na sakamakon da atomatik ya ƙirƙira aiki ne na yau da kullum, kuma haɗarin haɗari ba daidai ba ne: kararan karya mara kyau (PHI da aka rasa) yana ƙirƙira hadari na doka, yana mai da iyakar mai ra'ayin kiyayewa ta dole.

### i2b2 / n2c2 a matsayin Template

Ayyukan i2b2 (Bayani don Haɗa Biology da Gadon) da na n2c2 maye gurbinsu (Ƙalubalen NLP na Asibiti na ƙasa) sun sakar da jeri na saitin bayanai na NLP na asibiti da ƙwararru suka sanya lakabi. Waɗannan suna nuna duka yiwuwa da kuɗi: ƙoƙarin lakabi galibi suna haɗa ƙungiyoyin ƙwararru na yanki da ke aiki tsawon watanni da yawa, yana sanya lakabi ga takardun da yawa kowace ƙalubale. Saitin bayanai na n2c2 sun haifar da ci gaba mai sauri ainihin saboda sun warware matsalar sarrafa raba bayanai (cire gane-gane + yarjejeniyar cibiya), ba kawai matsalar lakabi ba.

---

## La'akari na Doka

AI na likitanci yana ƙarƙashin kulawa ta doka a mafi yawan ƙasashe.

**FDA (Amurka):** Software ta AI/ML a matsayin Na'urar Likitanci (SaMD) yana buƙatar amincewar kafin kasuwa ko izini. Shirin Aiki na AI/ML na FDA na 2021 yana jaddada **tsare-tsaren sarrafa sauyi da aka riga aka ƙayyade** — rubuta yadda za a sabunta samfuri da yadda waɗannan sabuntar za a tabbatar da su kafin aikawa. Samfuri wanda ke ci gaba da koyo daga ra'ayin asibiti shine, ƙarƙashin wannan tsari, na'ura daban bayan kowane sabuntawa kuma na iya buƙatar sake tabbatarwa.

**Alamar CE (Turai):** Na'urori na likitanci gami da tsarin AI dole ne su bi Doka na Na'ura Likitanci (MDR). MDR yana buƙatar kimantawa ta asibiti, sa ido bayan kasuwa, da takardun bayanai da aka yi amfani da su don horarwa da tabbatarwa.

**Abubuwa masu amfani na HITL:** Tsarin doka yana buƙatar takardun bayyananne na tsarin lakabi, cancantar mai sanya lakabi, amincin tsakanin mai kimantawa, da kowane canjin bayanin horarwa. Wannan ba nauyin hukuma ba ne — shi ne hanyar bincike wanda ke ba da damar likita ya fahimci waɗanne bayanin horarwa suka samar da ɗabi'ar samfuri ta yanzu, kuma ana buƙata ta doka. Tsarin HITL waɗanda ke ɗaukar lakabi a matsayin tsari na bisa ƙasa yana ƙirƙira hadari na doka wanda galibi yana bayyanawa kawai a lokacin mafi muni.

---

## Lakabi na Bayanai na Kimiyya

Bayan kiwon lafiya, HITL ML yana taka rawa mai ƙaruwa kuma ba a yabe shi ba a cikin binciken kimiyya, inda kalubalen lakabi galibi yana haɗa ƙwarewa ta yanki da sikeli.

### Taurari: Galaxy Zoo

Galaxy Zoo {cite}`lintott2008galaxy` ya ɓarɓaza rarrabuwa ta morphological na taurari daga Sloan Digital Sky Survey zuwa masanan kimiyya na al'umma. Aikin asali ya tattara rarrabuwa fiye da miliyan 40 daga masu aikin sa kai fiye da 100,000, yana nuna cewa ɓarɓaza ta sizeli ta rarrabuwa na hoto na kimiyya yana yiwuwa lokacin da za a iya rushe aiki zuwa tambayoyi masu sauƙi da za a iya amsa ba tare da horo na ƙwararru ba ("Shin wannan taurare yana da santsi ko yana da fasali?").

Kwarewa ta Galaxy Zoo ta samar da binciken hanyar guda biyu masu muhimmanci. Na farko, yarjejeniya tsakanin masanan kimiyya na al'umma da masanan taurari ƙwararru ta kasance mai ƙari don lokuta bayyananne kuma ta bambanta ta tsari akan lokuta na iyaka — ainihin lokuta inda bambancen yana da muhimmanci ta kimiyya. Mafita ba ta watsi da bayanin kimiyyar al'umma akan lokuta na iyaka ba amma ta ɗaukar rarrabawar amoshin masu aikin sa kai a matsayin lakabi mai laushi da ke ɓoye rikitarwar morphological na gaske. Na biyu, mai rarraba da aka horar akan lakabin Galaxy Zoo ya wuce samfurin da aka horar don maimaita lakabi na ƙwararru ɗaya, saboda rarrabawar jama'a ta kamo rashin tabbas na gani na gaske wanda zaɓin tilas na ƙwararru ɗaya ya ruguje.

### Genomics: Rarrabuwa ta Pathogenicity

Sanya lakabi ga sigar kwayar halitta — yanke shawara ko sigar yana da cuta, mara cutar, ko mara tabbas na muhimmanci — matsala ce mai haɗari ta NLP da hukuncin ƙwararru. Bayanan sigar asibiti kamar ClinVar suna haɗa fassarori na ƙwararru daga labs da yawa masu gabatarwa, kuma rashin jituwa tsakanin labs yana yau da kullum. Ana amfani da koyon aiki don fifita waɗanne sigogi suna buƙatar duba ƙwararru cikakke (bincike na wallafe-wallafen, kimantawa ta shaida aiki) da waɗanne za a iya auto-classified ta shaida da ke wanzuwa. Sakamakon shine tsarin haɗe inda mafi yawan sigogi suna sarrafawa ta logic ta atomatik, ɓangaren yana buƙatar duba ƙwararru, kuma lokuta mafi wuya an yin alamar su don yarjejeniyar labs da yawa.

### Yanayi da Kimiyyar Duniya

Sanya lakabi ga hoton tauraron dan adam don sauyin amfani da ƙasa, sare daji, faɗin kankara, da hanyoyin guguwa yana haɗa ƙwararru a cikin aikin nunawa na nesa kuma fiye da kima dandamali na kimiyyar al'umma. Babban kalubalen HITL a wannan yanki na lokaci ne: lakabin da aka yi yau na iya zama tsohon yayin da duniya ke canzawa, kuma tabbatarwa na ƙasa (bincike na filin) yana da tsada kuma yana da iyakancin nisan tafiya. Koyon aiki wanda ke fifita hotuna inda hasashen samfuri ya sabawa ƙarin na jiki (misali, hasashen sare daji a yanki da aka sani yana da kariya) hanyar da ke da amfani don jagorar albarkatu masu iyaka na tabbatarwa na filin.

### Neuroscience: Connectomics

Sake gina da'irori na jijiya daga hoton microscope na lantarki — connectomics — yana buƙatar lakabi matakin pixel na membranin neuron cikin ɗimbin hoto masu yawa. Aikin Eyewire ya yi wasanin bidiyo da wannan aiki, yana kara da'awar 'yan wasa goma da yawa a cikin bin hanyoyin neuron ta hanyar ɓangaren hoto 3D. Zanen wasanin bidiyo ya warware matsala musamman ta HITL: aikin yana buƙatar kulawa ta ci gaba da tunani na sarari akan zaman mai tsawo, wanda ke haifar da ƙudurin inganci a cikin lakabi na gargajiya. Rushe aiki zuwa sassan wasan da salon zamantakewa ya kiyaye shiga da ingancin mai sanya lakabi a sikalin da lakabi na ƙwararru ba za a iya cimma shi ba.

---

## Sarrafa Masu Sanya Lakabi ƙwararru

Lokacin da lakabi yana buƙatar ƙwarewa mara cika, hanyoyin tarin aiki na yau da kullum (Babi na 13) ba su aiki ba.

**Damuwa ta asali** ita ce mutanen da za su iya samar da lakabin mafi inganci sune kuma mutanen da lokacin su yake da ƙima sosai kuma yana da iyakancin yawa. Kowane yanke shawara na zane a cikin tsarin lakabi na ƙwararru ya kamata a kimanta shi ƙarƙashin tambaya: shin wannan yana mai da mafi kyau amfani da lokacin ƙwararru mara cika?

**Abin da wannan ke nufi a aiki:**

- **Pre-annotate da gangan.** Yi amfani da masu sanya lakabi na ƙasa, samfurin ta atomatik, ko tsarin bisa ƙa'idoji don ƙirƙira ɗan takara wanda ƙwararrun yana duba da gyarawa maimakon ƙirƙira daga farko. Hukuncin ƙwararru shine ƙoshewa; ciyar da pre-annotation don gyara yana da sauri fiye da roƙa su sanya lakabi daga allon fanko, da yanayin pre-annotation yana da isa don gyarawa ya zama mafi sauri fiye da farawa daga farko.

- **Tsara don hankalin ƙwararru, ba gudu ba.** Mai amfani da lakabi da aka inganta don gudu mai ƙari (yanke shawara biyu biyu mai sauri, mahimman maɓalli, ƙarancin nuna alama) ya dace don tarin aiki. Lakabi na ƙwararru galibi yana amfana daga mai amfani da shi mai arziki: kwatancen kusa da kusa da lokuta na baya, damar samun kayan tunani cikin sauƙi, filin amincewar lakabi, da damar yin alamar yanayin don tattaunawa. Waɗannan suna jinkirtawa lakabi na mutum ɗaya amma suna inganta inganci kuma suna rage buƙatar sake lakabi.

- **Bi sahun salon mai sanya lakabi ɗaya musamman.** Tare da ƙaramin rukunin ƙwararru, yana yiwuwa kuma yana da muhimmanci don bin yawan yarjejeniyar kowane mai sanya lakabi tare da kwamitin, yin alamar lokuta waɗanda suka yi kama daban da tarihin su, kuma tattauna su a zaman daidaita na yau da kullum. Wannan ba sa ido ba ne — shi ne tsarin inganci ɗaya da likitanci na asibiti ke amfani da shi don duba aiki, kuma ƙwararru galibi suna amsa da kyau lokacin da aka tsara shi a matsayin ingancin gama gari maimakon kimantawa.

- **Zanen zaman yana da muhimmanci.** Lakabi na likitanci yana da ƙalubale ta kwamitin tunani. Shaida daga likitancin hoto da pathology tana ba da shawara cewa yawan kuskure suna ƙaruwa sosai bayan kusan mintuna 90 na karatu mai ci gaba, kuma mafita na minti kaɗan suna iya maido da hankali a wani ɓangare. Mai amfani da lakabi waɗanda ke tilasta duba hutu (ba tare da su iya watsi da su ba) yanke shawara ne mai sauƙi na zanen HITL tare da tasiri na inganci na gaske.

---

## Tsarin Koyon Aiki na HITL don Hoto Likitanci

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
Tarin aiki na Galaxy Zoo: {cite}`lintott2008galaxy`. Aikin likita na CheXNet: {cite}`rajpurkar2017chexnet`. Ingancin hoton da gano cutar ta tallafi na AI: {cite}`yu2022assessing`. Hanyar lakabi na NLP na asibiti: {cite}`pustejovsky2012natural`. Don jagora na shirin aiki na FDA AI/ML, duba takardun FDA da aka wallafa (2021).
```
