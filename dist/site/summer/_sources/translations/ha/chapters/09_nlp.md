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

# HITL a Sarrafa Harshen Yau da Kullum

Harshen yau da kullum shine yanki inda HITL ML ya sami tasiri mafi girma a iya magana — kuma inda mafi zurfinsa na kwamitin tunani suke fitar da kansu. Harshe yana da ma'ana ta zamantakewa: ma'anarsa an gina ta ta hanyar al'umman dan adam, pragmatics ɗinsa yana dogara akan mahallin da niyyar, kuma ingancin sa kawai ake iya ƙididdiga ta masu karatu dan adam. Amma wannan kuma yana nufin cewa lakabi na NLP ba kawai tsari ne na tattara lura ba. Tsari ne na *gina* rukunan.

---

## Matsalar Ƙirƙira a Lakabi na NLP

A cikin hoto likitanci, akwai gaskiya ta ƙasa: ciwon daji yana nan ko ba shi ba. Lakabi na likita na iya kasancewa mara tabbas, amma yana ƙoƙarin bin wani abu na gaske. Lakabi na NLP galibi yana da bambance da yawa. Lokacin da mai sanya lakabi ya alamta tweet a matsayin "mai guba," babu kwayoyin guba a cikin tweet wanda muke ƙoƙarin gano. **Lakabi yana ƙirƙira rukuni.**

Wannan yana da sakamako mai zurfi waɗanda galibi ba a fahimta su sosai:

**Ƙungiyar aiki na lakabi tana bayyana al'amari.** Schema ta lakabi don "magana mara kyau" tana ɓoye hankali da duk wanda ya tsara shi da duk wanda ya yi amfani da shi. Ƙungiya na masu sanya lakabi da ke magana Turanci daga bango na dimokra'iyya ɗaya, suna aiki ƙarƙashin jagoran da ƙungiyar manufofi ta kamfani ta rubuta, tana samar da saitin bayanai wanda ke nuna fahimtar wannan ƙungiyar ga laifin — ba wani ma'aunin dan adam na duniya ba. Samfurin da aka horar akan irin waɗannan bayanai za su nuna iyakar da ke ɓoye ɗaya.

**Jagoran su ne ka'ida, ko sun yarda ko ba su yarda ba.** Kowane schema na lakabi yana yin da'awar akan ontology. Yanke shawara cewa "ba da manufar" da "izgili" ajin ɗaya ne da'awar ka'ida ce, ba sauki na neutral ba. Yanke shawara don yin lakabi ga "fushi" a matsayin ajin ɗaya maimakon bambanta "fushi mai adalci" daga "fushi mai ƙiyayya" yana ruguje bambance wanda na iya yin muhimmanci ga aikin ƙasa. Waɗannan yanke shawara ana yi su ƙarƙashin matsincin samarwa kuma da wuya a sake duba su.

**Rashin daidaito na lakabi akan lokaci.** Harshe na zamantakewa yana haɓaka. Samfurin guba da aka horar a 2018 zai rarrabe abun ciki daga 2024 ba daidai ba saboda ba saboda ba a horar da shi da isa ba amma saboda ma'anar zamantakewa na wasu kalmomi ta canza. Lakabi na NLP ba ana bitar rarrabawa mai tsaye ba — ana bitar iyaka mai motsi wanda aikin lakabi yana taimaka ƙirƙira shi a wani ɓangare.

:::{admonition} Matsalar Kayan Aikin Lakabi
:class: important

Geva et al. {cite}`geva2019annotator` sun nuna cewa saitin bayanai na NLI (Natural Language Inference) sun ƙunshi kayan aikin tsari da aka gabatar ta tsarin lakabi kansa. Masu sanya lakabi da aka roƙa su rubuta hasashe na "ɗaukar" don wani yanki da aka ba su galibi suna amfani da salon tsari musamman; masu sanya lakabi suna rubuta hasashe na "sabani" suna amfani da wasu. Samfurin yana koyon rarrabawa bisa waɗannan kayan aikin maimakon alaƙar ma'ana da aka nufa — suna warware aikin lakabi, ba aikin NLP na ƙasa ba.

Wannan ba sakaci ba ne. Sakamakon da ba a kaurace shi ba ne na sanya dan adam su ƙirƙira misalai don dacewa da lakabi. Tsarin HITL yana saka alaman tsari wanda ba a taɓa nufa shi a cikin bayanai ba.
:::

---

## Lakabi na Rarrabuwa Rubutu

Mafi sauƙin aikin lakabi na NLP shine sanya rukuni ga takarda rubutu. Binciken ji, rarrabuwa ta batu, gano niyya, da tace faci duk su ne ayyukan rarrabuwa.

**Kalubale musamman ga rarrabuwa rubutu:**

*Son zuciya.* Rukunan kamar "mai guba" ko "mai laifi" yana da son zuciya ta asali kuma yana bambanta cikin mahallin al'adu, bango na mai sanya lakabi, da mahallin dandamali. A duk masu sanya lakabi, fahimtar laifi suna bambanta sosai ta halaye na dimokra'iyya — gaskiya mai kai tsaye ga adalci {cite}`blodgett2020language`.

*Rikitarwan lakabi.* Takardun da yawa suna cikin rukunan da yawa ko suna kan iyaka. Bita da ke da 60% mai kyau da 40% mai muni yana rikitarwa gaske, ba mislabeled ba. Tilasta lakabi ɗaya yana watsi da bayanai na gaske (duba Babi na 13 akan lakabin laushi da rashin jituwa na mai sanya lakabi).

*Girma na lakabi.* Samfurin ji 2-aji na iya isa don sa ido na kafofin yada labarai na zamantakewa; sikelin maki 7 na iya zama dole don binciken ra'ayin kaya. Girman da ya dace yana dogara akan aikin ƙasa, amma galibi ana ƙayyade shi kafin lakabi — yanke shawara mai muhimmanci da aka yi tare da bayanai ƙasa da isa.

---

## Gane Sunan Wuri

Lakabi na NER yana buƙatar gano span na rubutu da sanya nau'in wuri (MUTUM, ƘUNGIYA, WURI, dkk.). Lakabi ya fi rikitarwa fiye da rarrabuwa takarda saboda dalilai da yawa:

**Iyakar span suna rikitarwa.** A "CEO Tim Cook na Apple ya sanar da...", shin wuri na MUTUM ya rufe "Tim Cook" ko "CEO Tim Cook na Apple"? Jagoran dole ne su magance waɗannan lokuta a fili, kuma yarjejeniya tsakanin masu sanya lakabi akan span koyaushe ta kasance ƙasa fiye da akan nau'i.

**Sanya nau'i yana buƙatar ilimin duniya.** "Apple" ORG ne a mahallin ɗaya, KAYAN AIKI a wani, kuma ba ko ɗaya ba a "fitilar apple." Masu sanya lakabi suna buƙatar isa ga ilimin yanki don yin sanya nau'i daidai.

**Wuri mai juna juna.** "The University of California, Berkeley" tana ƙunshi ƘUNGIYA mai juna juna a ciki WURI. Tsarin BIO na yau da kullum ba zai iya wakilta wuri mai juna juna ba; tsarin mafi rikitarwa (misali, BIOES, ko tsarin bisa graph) ake buƙata.

**Ingancin lakabi.** Pre-annotation tare da tsarin NER na tushe yana hanzarta lakabi sosai ta ba da damar masu sanya lakabi su gyara hasashe maimakon yin lakabi daga farko. A wani bincike na NER asibiti, an ga ƙaruwa ta gudu ta 30–60% {cite}`lingren2014evaluating`; girman irin waɗannan riba yana dogara sosai kan ingancin samfuri na tushe da yanki.

---

## Fitar da Dangantaka da Lakabi na Ma'ana

Bayan gano wuri, fitar da dangantaka yana buƙatar yin lakabi ga *alaƙa* tsakanin wurin:

- Masu sanya lakabi dole ne su fahimci wuri biyu da kuma mai hasashe da ke haɗa su
- Nau'in dangantaka yana da bambance na ma'ana masu rikitarwa (YA_DAUKI_AIKI vs. AN_DAUKE_YA vs. AN_KAFA_YA)
- Misalai mara kyau (nau'i na wuri ba shi da dangantaka) sun fi yawa fiye da masu kyau

**Yarjejeniya tsakanin masu sanya lakabi don fitar da dangantaka** galibi ta kasance ƙasa fiye da ayyukan rarrabuwa. Don schemas masu bayyana, ƙimomi na $\kappa$ a cikin iyaka 0.65–0.80 galibi an ruwaito {cite}`pustejovsky2012natural`; don alaƙar ma'ana masu rikitarwa (dalili na al'amari, alaƙar lokaci), yarjejeniya na iya faɗuwa ƙasa da haka, dangane da zanen schema da horar da mai sanya lakabi.

---

## Gyarawa Bayan Fassara ta Injin (MTPE)

Gyarawa bayan fassara ta injin wata nau'i ce ta HITL NLP mai girma. Mai fassara dan adam yana gyara sakamakon tsarin MT maimakon fassara daga farko:

**Gyarawa haske (LPE):** Kawai ana gyara kurakurai masu mahimmanci. Ya dace lokacin da buƙatun ingancin fassara sun kasance matsakaici.

**Gyarawa cikakke (FPE):** Ana gyara sakamakon zuwa ingancin bugu. Sakamakon da aka gyara galibi yana zama bayanin horarwa don inganta MT ƙari — zagayen gyarawa na gaske na dan adam a cikin zagaye.

**HTER (Ma'aunin Gyarawa na Fassara ta Dan Adam):** Metric ɗin da ke auna nisan gyarawa tsakanin sakamakon MT da fassarar da aka gyara, an daidaita ta tsawon jumla {cite}`graham2015accurate`. A matsayin ƙa'idar mai aiki kusan, ana ɗaukar HTER ƙasa da kusan 0.3 a matsayin sakamakon MT mai kyau; sama da 0.5, fassara daga farko na iya zama mafi sauri — ko da yake waɗannan iyakar suna bambanta ta yanki da nau'in harshe.

---

## AI na Tattaunawa da Lakabi na Zance

Sanya lakabi ga zance yana gabatar da tsarin lokaci:

- **Lakabi matakin juyawa:** yin lakabi ga kowane juyawa (niyya, ji, inganci)
- **Lakabi matakin zance:** kimanta daidaito na gaba ɗaya, nasarar aiki, gamsuwar mai amfani
- **Lakabi hanya-hanya na mu'amala:** gano lokuta na gazawa musamman a cikin tattaunawa

HITL yana da muhimmanci musamman a cikin tattaunawa saboda gazawar samfuri galibi suna da laushi da haɗawa: kuskuren gaskiya a juyawa na 3 na iya zama ba a bayyana shi ba har juyawa na 7. Masu sanya lakabi dan adam da ke bin tattaunawa suna iya gano waɗannan salon gazawar dogon lokaci waɗanda ma'aunai ta atomatik gaba ɗaya suke rasa.

---

## Sanya Lakabi na Shirye-shirye da Kulawa ƙasa

Lokacin da bayanan da aka yi lakabi suka yi ƙarami, **kulawa ƙasa** yana ba da damar amfani da ayyukan sanya lakabi da yawa masu ƙura, masu haɗawa don ƙirƙira lakabin iya yiwuwar a sikeli. **Snorkel** {cite}`ratner2017snorkel` shine tsarin canonical:

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score

rng = np.random.default_rng(42)

# -------------------------------------------------------
# Toy weak supervision: sentiment classification
# 5 labeling functions (LFs) with different coverage/accuracy
# Label: +1 (positive), -1 (negative), 0 (abstain)
# -------------------------------------------------------

N = 1000
true_labels = rng.choice([-1, 1], size=N)
X_features = np.column_stack([
    true_labels * 0.8 + rng.normal(0, 0.5, N),
    rng.normal(0, 1, N),
    rng.normal(0, 1, N),
])

def make_lf(accuracy, coverage, seed):
    rng_lf = np.random.default_rng(seed)
    votes = np.zeros(N, dtype=int)
    active = rng_lf.random(N) < coverage
    correct = rng_lf.random(N) < accuracy
    votes[active & correct]  = true_labels[active & correct]
    votes[active & ~correct] = -true_labels[active & ~correct]
    return votes

LFs = np.column_stack([
    make_lf(accuracy=0.85, coverage=0.60, seed=1),
    make_lf(accuracy=0.78, coverage=0.45, seed=2),
    make_lf(accuracy=0.70, coverage=0.80, seed=3),
    make_lf(accuracy=0.90, coverage=0.30, seed=4),
    make_lf(accuracy=0.60, coverage=0.90, seed=5),
])

def majority_vote(LF_matrix):
    labels = []
    for i in range(LF_matrix.shape[0]):
        votes = LF_matrix[i][LF_matrix[i] != 0]
        labels.append(0 if len(votes) == 0 else int(np.sign(votes.sum())))
    return np.array(labels)

mv_labels = majority_vote(LFs)
covered = mv_labels != 0

print(f"Coverage:                    {covered.mean():.1%}")
print(f"MV accuracy (covered):       {(mv_labels[covered] == true_labels[covered]).mean():.3f}")

X_train, y_train = X_features[covered], mv_labels[covered]
X_test,  y_test  = X_features[~covered], true_labels[~covered]

if len(X_train) > 10 and len(X_test) > 10:
    clf = LogisticRegression().fit(X_train, y_train)
    preds = clf.predict(X_test)
    print(f"F1 on uncovered test set:    {f1_score(y_test, preds):.3f}")
```

---

## RLHF don Samfurin Harshe: Gaskiyar Lakabi

Babi na 6 ya ƙunshi RLHF ta fasaha. Daga hangen NLP, aikin lakabi ya fi wuya fiye da yadda ya bayyana daga waje.

**Abin da ake roƙa masu sanya lakabi da gaske su yi** — kwatanta sakamakon samfuri guda biyu kuma nuna wanda ya fi "kyau" — yana kama da sauƙi. A aiki, "kyau" wani tsari ne mara bayyananne wanda masu sanya lakabi ke warware ta amfani da hanyoyi na sirri. Wasu suna bai wa fluency muhimmanci sosai; wasu suna bai wa daidaito na gaskiya; wasu suna hukunta yawa. Ba tare da jagoran mai ƙarfi ba, saitin bayanin fifiko da ya samu yana nuna ba ƙimar dan adam a sah ba amma dabarun warwarewa musamman na ƙungiyar aiki na lakabi da aka yi hayar.

**Abubuwan muhimmanci na lakabi su ne:**

- *Taimako:* Shin amsar ta amsa tambayar da kyau? Ta bayyananne, ta ba da bayanai sosai, kuma ta dace sosai?
- *Gaskiya:* Shin amsar ta kasance daidai ta gaskiya? Wannan yana buƙatar masu kimantawa su sami ilimin yanki — buƙata wanda ke ƙirƙira matsalolin inganci mai girma a sikeli, tun da masu sanya lakabi na gaba ɗaya ba za su iya tabbatar da da'awa na ƙwararru ba.
- *Rashin cutar:* Shin amsar ta kaurace daga abun ciki mai guba, nuna son zuciya, mai cutarwa, ko mara dacewa? Waɗannan hukunci suna buƙatar jagoran cikakku saboda "mai cutarwa" yana dogara sosai akan mahallin kuma yana canzawa cikin al'adu, lokaci, da mahallin dandamali.
- *Daidaitar ƙididdigan:* Shin amsar ta bayyana rashin tabbas da ya dace? Masu sanya lakabi suna fifiko ta tsari don amsoshi waɗanda suke kama amincewar, wanda ke ƙirƙira alaman lada a kan tawali'u na epistemological da ya dace.

Mu'amalar tsakanin ma'aunai tana da rikitarwa: amsar mafi taimako ga tambaya mai haɗari na iya kasancewa mafi cutar. Jagoran dole ne su ƙayyadewa yadda za a musayar ma'aunai masu gasa — kuma waɗannan musayar a zahiri yanke shawara na manufofi ne, ba yanke shawara na lakabi ba. Ƙungiyar aiki na lakabi tana yanke manufofi.

**Girman sikeli yana tattara tasirin halaye na dimokra'iyya.** RLHF don manyan samfurin yana haɗa da ƙungiyar aiki na lakabi da ba su da girma (ɗaruruwa zuwa dubbai kaɗan) da ke yanke shawara miliyan ɗaruruwa ƙasa. Halaye na al'adu da dimokra'iyya na wannan ƙungiya suna yada zuwa cikin ɗabi'ar samfuri a sikeli ta hanyar da ba za ta faru ba idan lakabi ya kasance mafi yadi. Wannan yana ɗaya daga cikin matsalolin tsari mafi ƙarancin tattaunawa a cikin tsarin RLHF na yanzu.

---

## Zagayen Lakabi–Samfuri

A NLP fiye da kowane yanki, tsarin lakabi da haɓaka samfuri suna rikita tsarin akan lokaci:

1. Ana daidaita masu sanya lakabi ta amfani da sakamakon samfuri da ake nan a matsayin tunani (galibi da ɓoye).
2. Samfurin lada yana koyon abin da lakabi galibi suka fi so.
3. Ana daidaita mai ƙirƙira don samar da sakamakon da ke samun lada mai ƙari.
4. Waɗannan sakamakon suna shafawa abin da ke kama "mai kyau" a zagaye na lakabi masu zuwa.

Wannan zagaye ba mara lafiya ta asali ba ne — shi ne abin da ke ba da damar RLHF ya ƙusanci — amma yana nufin cewa ɗabi'ar samfuri tana tsarawa ta iyaka mai motsi wanda tsarin lakabi kansa yana taimaka motsa. Bambance abin da samfuri ya koyo saboda yana nuna fifikon dan adam daga abin da ya koyo saboda ya koyi dacewa da heuristics na masu sanya lakabi yana da wuya ta gwaji.

Babu mafita mai tsabta. Aiki mafi kyau na yanzu yana sa ido don canzawa ta amfani da hukunci na fifiko na ɗaure da aka tattara a tazara na yau da kullum, da kuma ɗaukar sigar jagoran lakabi a matsayin canji na gwaji.

---

## Kimantawa ta Samfurin NLP na Generative

Ba kamar samfurin rarrabuwa tare da metric ɗin daidaito bayyananne, kimantawar ingancin ƙirƙira yana buƙatar hukuncin dan adam:

| Hanyar kimantawa          | Bayani                                  | Kuɗi     |
|---------------------------|-----------------------------------------|----------|
| Kimantawa kai tsaye (DA)  | Masu sanya lakabi suna ƙididdiga inganci akan sikeli | Matsakaici |
| Hukunci na kwatancen      | Masu sanya lakabi suna kwatanta sakamakon biyu | Ƙarami  |
| MQM (Ma'aunai Inganci Mai Yawan Girma) | Taxonomy na kuskure mai tsari | Babba |
| Fifikon RLHF              | Lakabin fifiko da ake amfani da su don horarwa | Matsakaici |
| LLM a matsayin alƙali     | LLM yana ƙididdiga sakamakon (yana dacewa matsakaici da dan adam) | Ƙarami sosai |
| BERTScore, BLEU           | Ma'aunai ta atomatik (alaƙa mara daidai da hukuncin dan adam) | Ƙarami sosai |

Ma'aunai ta atomatik (BLEU don MT, ROUGE don takaitawa) suna da arha amma yana dacewa da ƙarancin daidaito tare da hukunci na inganci na dan adam {cite}`reiter2018structured`. Hanyoyin LLM-a-matsayin-alƙali suna nuna yarjejeniya matsakaici tare da masu sanya lakabi dan adam {cite}`zheng2023judging` kuma ana amfani da su fiye da kima don sake zagaye mai sauri, amma ba ya kamata su maye gurbin kimantawar dan adam don kima na ƙarshe. Don yanke shawara tare da haɗari na gaske, kimantawar dan adam har yanzu yana dole.

```{seealso}
Kulawa ƙasa ta Snorkel: {cite}`ratner2017snorkel`. Jagoran lakabi na NLP: {cite}`pustejovsky2012natural`. Kayan aikin lakabi a NLI: {cite}`geva2019annotator`. Nuna son zuciya na mai sanya lakabi da saitin bayanai na NLP: {cite}`blodgett2020language`. Don kimantawa ta samfurin generative: {cite}`reiter2018structured`.
```
