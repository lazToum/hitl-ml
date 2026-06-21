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

# HITL katika Usindikaji wa Lugha Asilia

Lugha asilia ni uwanja ambapo HITL ML imekuwa na athari kubwa zaidi — na ambapo matatizo yake ya dhana ya kina yanajitokeza. Lugha ni ya kijamii kwa asili: maana yake imejengwa na jamii za binadamu, pragmatiki yake inategemea muktadha na nia, na ubora wake unaweza kupimwa tu na wasomaji wa binadamu. Lakini hii pia inamaanisha kwamba uwekaji maelezo wa NLP si mchakato wa kukusanya uchunguzi tu. Ni mchakato wa *kuunda* kategoria.

---

## Tatizo la Kijenzi katika Uwekaji Maelezo wa NLP

Katika kupiga picha za kimatibabu, kuna ukweli wa ardhi: uvimbe upo au hauko. Lebo ya daktari wa radiolojia inaweza kuwa na wasiwasi, lakini inajaribu kufuatilia kitu cha kweli. Uwekaji maelezo wa NLP mara nyingi ni tofauti kabisa kwa msingi. Mweka maelezo anapoweka alama kwenye tweet kama "yenye sumu," hakuna molekuli ya sumu katika tweet tunayojaribu kugundua. **Lebo inaunda kategoria.**

Hii ina matokeo ya kina ambayo mara nyingi hayashughulikiwi kwa kutosha:

**Nguvu kazi ya uwekaji maelezo inafafanua tukio.** Mpango wa lebo kwa "usemi wa kukera" unaweka hisia za yeyote aliyeubunifu na yeyote aliyeutumia. Timu ya wawekaji maelezo wanaozungumza Kiingereza kutoka kwa historia moja ya kidemografia, wakifanya kazi chini ya mwongozo ulioandikwa na timu ya sera ya shirika, huzalisha mkusanyiko wa data unaoakisi uelewa wa timu hiyo wa kukera — si kiwango cha binadamu cha kimataifa. Mifano iliyofunzwa kwenye data kama hiyo itaonyesha mipaka hiyo hiyo ya picha.

**Mwongozo ni nadharia, akiribu au isiripoke.** Kila mpango wa uwekaji maelezo unasema madai kuhusu ontolojia. Kuamua kwamba "mzaha" na "dhihaka" ni darasa sawa ni dai la kinadharia, si urahisi wa kawaida. Kuamua kuweka lebo "hasira" kama darasa moja badala ya kutofautisha "hasira ya haki" na "hasira ya uadui" kunakunywa tofauti ambayo inaweza kuwa na umuhimu kwa kazi ya chini. Maamuzi haya yanafanywa chini ya shinikizo la uzalishaji na mara chache yanazingatiwa tena.

**Kutokuwa thabiti kwa lebo kwa wakati.** Lugha ya kijamii inabadilika. Mfano wa usumu uliofunzwa mwaka 2018 utaweka lebo vibaya maudhui kutoka mwaka 2024 si kwa sababu umefunzwa kidogo kwa takwimu, bali kwa sababu maana ya kijamii ya maneno fulani imebadilika. Uwekaji maelezo wa NLP si sampuli kutoka kwa usambazaji tuli — ni sampuli kutoka kwa lengo linalohamia ambalo kitendo cha kuweka lebo kinasaidia kwa sehemu kuunda.

:::{admonition} Tatizo la Kitu cha Mwelekeo wa Uwekaji Maelezo
:class: important

Geva et al. {cite}`geva2019annotator` walionyesha kwamba mkusanyiko wa data wa NLI (Inferensi ya Lugha Asilia) una vitu vya mwelekeo vya kimfumo vilivyoingizwa na mchakato wa uwekaji maelezo yenyewe. Wawekaji maelezo wanaoombwa kuandika nadharia za "uamuzi" kwa eneo fulani huwa wanatumia mifumo fulani ya kisintaksia; wawekaji maelezo wanaoandika nadharia za "kinzani" wanatumia nyingine. Mifano hujifunza kuainisha kulingana na vitu hivi badala ya uhusiano wa kisemantiki uliokusudiwa — wanaipata kazi ya uwekaji maelezo, si kazi ya NLP iliyo chini yake.

Hii si uzembe. Ni matokeo ya asili ya kuwa na binadamu wanaounda mifano kuoana na lebo. Mchakato wa HITL unaweka ishara ya kimfumo ambayo haikukusudiwa kuwepo katika data.
:::

---

## Uwekaji Maelezo wa Uainishaji wa Maandishi

Kazi rahisi zaidi ya uwekaji maelezo wa NLP ni kutoa kategoria kwa hati ya maandishi. Uchambuzi wa hisia, uainishaji wa mada, ugunduzaji wa nia, na uchujaji wa taka ni kazi zote za uainishaji.

**Changamoto maalum za uainishaji wa maandishi:**

*Udhati.* Kategoria kama "zenye sumu" au "za kukera" ni za udhati asili na zinatofautiana kati ya muktadha wa kitamaduni, historia za wawekaji maelezo, na muktadha wa jukwaa. Kati ya wawekaji maelezo, mtazamo wa kukera unatofautiana kwa kiasi kikubwa kulingana na kidemografia — ukweli wenye athari za moja kwa moja kwa haki {cite}`blodgett2020language`.

*Utata wa lebo.* Hati nyingi ni za kategoria nyingi au ziko kwenye mpaka. Tathmini ambayo ni 60% ya chanya na 40% ya hasi ina utata wa kweli, si ya kuwekewa lebo vibaya. Kulazimisha lebo moja kupoteza taarifa za kweli (angalia Sura ya 13 kuhusu lebo laini na kutokubaliana kwa wawekaji maelezo).

*Kina cha lebo.* Mfano wa hisia za madarasa 2 unaweza kuwa wa kutosha kwa ufuatiliaji wa mitandao ya kijamii; kipimo cha pointi 7 kinaweza kuhitajika kwa uchambuzi wa maoni ya bidhaa. Kina kinachofaa kinategemea kazi ya chini, lakini kawaida hurekebisha kabla ya uwekaji maelezo — uamuzi wa muundo wenye matokeo makubwa uliofanywa na data ya kutosha.

---

## Utambuzi wa Maneno Maalum

Uwekaji maelezo wa NER unahitaji kutambua vipande vya maandishi na kutoa aina ya kitengo (MTU, SHIRIKA, MAHALI, n.k.). Uwekaji maelezo ni mgumu zaidi kuliko uainishaji wa hati kwa sababu kadhaa:

**Mipaka ya kipande ina utata.** Katika "Apple CEO Tim Cook alitangaza...", kitengo cha MTU kinashughulikia "Tim Cook" au "Apple CEO Tim Cook"? Mwongozo lazima ushughulikie waziwazi hali hizi, na makubaliano ya wawekaji maelezo kwenye vipande huwa ya chini kuliko kwenye aina.

**Ugawaji wa aina unahitaji maarifa ya dunia.** "Apple" ni ORG katika muktadha mmoja, BIDHAA katika mwingine, na kwa hoja hakuna katika "pai ya tofaa." Wawekaji maelezo wanahitaji maarifa ya kutosha ya uwanja kufanya ugawaji sahihi wa aina.

**Vitengo vilivyotabia.** "Chuo Kikuu cha California, Berkeley" kina SHIRIKA kilichotabiwa ndani ya MAHALI. Uwekaji lebo wa BIO wa kawaida hauwezi kuwakilisha vitengo vilivyotabia; mipango ya mgumu zaidi (k.m., BIOES, au muundo wa grafu) inahitajika.

**Ufanisi wa uwekaji maelezo.** Uwekaji maelezo wa awali kwa kutumia mfano wa msingi wa NER huharakisha sana uwekaji maelezo kwa kuruhusu wawekaji maelezo kurekebisha utabiri badala ya kuweka maelezo kutoka mwanzo. Katika utafiti mmoja wa NER ya kimatibabu, ongezeko la uzalishaji la 30–60% lilionekana {cite}`lingren2014evaluating`; ukubwa wa faida kama hizi unategemea sana ubora wa mfano wa msingi na uwanja.

---

## Uchimbaji wa Uhusiano na Uwekaji Maelezo wa Kisemantiki

Zaidi ya kutambua vitengo, uchimbaji wa uhusiano unahitaji kuweka maelezo kwenye *mahusiano* kati ya vitengo:

- Wawekaji maelezo lazima waelewe vitengo vyote viwili na kiunganishi kinachoviunganisha
- Aina za uhusiano zina tofauti ngumu za kisemantiki (ANAFANYA\_KAZI\_KATIKA dhidi ya AMEAJIRIWA\_NA dhidi ya ILIANZISHA)
- Mifano hasi (jozi za kitengo bila uhusiano) ni ya kawaida zaidi sana kuliko ya chanya

**Makubaliano ya wawekaji maelezo kwa uchimbaji wa uhusiano** huwa ya chini kuliko kwa kazi za uainishaji. Kwa mipango iliyofafanuliwa vizuri, maadili ya $\kappa$ katika upeo wa 0.65–0.80 yanaripotiwa kawaida {cite}`pustejovsky2012natural`; kwa uhusiano mgumu wa kisemantiki (uamuzi wa tukio, mahusiano ya wakati), makubaliano yanaweza kuanguka chini zaidi sana, kulingana na muundo wa mpango na mafunzo ya wawekaji maelezo.

---

## Uhariri Baada ya Tafsiri ya Mashine (MTPE)

Uhariri baada ya tafsiri ya mashine ni aina iliyokomaa ya HITL NLP. Mtafsiri wa binadamu hurekebisha tokeo la mfumo wa MT badala ya kutafsiri kutoka mwanzo:

**Uhariri wa mwanga (LPE):** Makosa ya msingi tu ndiyo yanayorekebishwa. Inafaa wakati mahitaji ya ubora wa tafsiri ni ya wastani.

**Uhariri kamili (FPE):** Tokeo linarekebishwa hadi ubora wa uchapishaji. Tokeo lililohaririwa kawaida linakuwa data ya mafunzo kwa uboreshaji zaidi wa MT — mzunguko wa kweli wa kurekebisha wa binadamu-katika-mzunguko.

**HTER (Kiwango cha Uhariri wa Tafsiri Kinacholenga Binadamu):** Kipimo kinachopima umbali wa uhariri kati ya tokeo la MT na tafsiri iliyohaririwa, iliyorekebisha kwa urefu wa sentensi {cite}`graham2015accurate`. Kama kanuni ya vitendo ya makadirio, HTER chini ya takriban 0.3 mara nyingi inachukuliwa kama tokeo nzuri la MT; zaidi ya 0.5, tafsiri kutoka mwanzo inaweza kuwa ya haraka zaidi — ingawa viwango hivi vinatofautiana kulingana na uwanja na jozi ya lugha.

---

## AI ya Mazungumzo na Uwekaji Maelezo wa Mazungumzo

Kuweka maelezo kwenye mazungumzo kunaanzisha muundo wa muda:

- **Uwekaji maelezo wa kiwango cha zamu:** weka lebo kwa kila zamu (nia, hisia, ubora)
- **Uwekaji maelezo wa kiwango cha mazungumzo:** tathmini mshikamano wa jumla, mafanikio ya kazi, ridhaa ya mtumiaji
- **Uwekaji maelezo wa athari ya mwingiliano:** tambua wakati maalum wa kushindwa katika mazungumzo

HITL ni muhimu sana katika mazungumzo kwa sababu kushindwa kwa mfano mara nyingi ni dhaifu na kumkusanyika: kosa la ukweli katika zamu ya 3 linaweza kuonekana hadi zamu ya 7. Wawekaji maelezo wa binadamu wanaofuatilia mazungumzo wanaweza kutambua mifumo hii ya kushindwa ya masafa marefu ambayo vipimo otomatiki vinakosa kabisa.

---

## Uwekaji Lebo wa Programu na Usimamizi Dhaifu

Data yenye lebo inapokelewa kidogo, **usimamizi dhaifu** huruhusu kutumia kazi nyingi za uwekaji lebo zenye kelele, zinazoingiliana kuzalisha lebo za uwezekano kwa kiwango kikubwa. **Snorkel** {cite}`ratner2017snorkel` ndiyo mfumo wa kawaida:

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

## RLHF kwa Mifano ya Lugha: Ukweli wa Uwekaji Maelezo

Sura ya 6 ilishughulikia RLHF kwa kiufundi. Kutoka mtazamo wa NLP, kazi ya uwekaji maelezo ni ngumu zaidi ya unavyoonekana kutoka nje.

**Wawekaji maelezo wanaulizwa kweli kufanya nini** — kulinganisha matokeo mawili ya mfano na kuonyesha nini "bora" — inasikika rahisi. Katika mazoezi, "bora" ni dhana isiyobainishwa ambayo wawekaji maelezo wanaipata kwa kutumia kanuni za hisia. Wengine wanashika unyoofu sana; wengine wanashika usahihi wa ukweli; wengine wanaadhibu maneno mengi. Bila mwongozo madhubuti, mkusanyiko wa data wa mapendeleo unaotokea hauakisi maadili ya binadamu kwa ufupi bali mikakati ya azimio ya nguvu kazi ya uwekaji maelezo iliyoajiriwa.

**Vipimo kuu vya uwekaji maelezo ni:**

- *Usaidizi:* Je, jibu linajibu swali vizuri? Je, lina habari, wazi, na una kina kinachofaa?
- *Ukweli:* Je, jibu ni sahihi kwa ukweli? Hii inahitaji watathminii kuwa na maarifa ya uwanja — mahitaji yanayosababisha matatizo makubwa ya ubora kwa kiwango kikubwa, kwani wawekaji maelezo wa jumla hawawezi kuthibitisha madai ya wataalam.
- *Kutokuwa na madhara:* Je, jibu linaepuka maudhui yenye sumu, ya kibaguzi, ya kudhuru, au yasiyofaa? Hukumu hizi zinahitaji mwongozo wa kina kwa sababu "ya kudhuru" inategemea sana muktadha na inabadilika kati ya tamaduni, wakati, na muktadha wa jukwaa.
- *Urekebishaji:* Je, jibu linaelezea wasiwasi unaofaa? Wawekaji maelezo wanapendelea kwa kimfumo majibu yanayosikika ya ujasiri, ambayo huunda ishara ya zawadi dhidi ya unyenyekevu wa hali ya maarifa.

Mwingiliano kati ya vigezo ni mgumu: jibu la kusaidia zaidi kwa swali hatari linaweza kuwa la kudhuru zaidi. Mwongozo lazima ubainishe jinsi ya kufanya maelewano kwa vigezo vinavyoshindana — na maelewano hayo ni maamuzi ya sera, si maamuzi ya uwekaji maelezo. Nguvu kazi ya uwekaji maelezo inafanya sera.

**Kiwango kinazingatia ushawishi wa kidemografia.** RLHF kwa mifano mikubwa inahusisha nguvu kazi ndogo za uwekaji maelezo (mamia hadi maelfu ya chini) kufanya maamuzi ya mabilioni ya chini. Upendeleo wa kidemografia na kitamaduni wa nguvu kazi hiyo huenea katika tabia ya mfano kwa kiwango kikubwa kwa njia ambayo haungetokea kama uwekaji maelezo ungesambazwa zaidi. Hili ni moja ya matatizo ya kimuundo yasiyojadiliwa kidogo zaidi katika mfumo wa sasa wa RLHF.

---

## Mzunguko wa Maoni wa Uwekaji Maelezo–Mfano

Katika NLP zaidi ya uwanja wowote mwingine, mchakato wa uwekaji maelezo na maendeleo ya mfano vinachoshana baada ya muda:

1. Wawekaji maelezo huwekwa calibrated kwa kutumia matokeo ya sasa ya mfano kama rejeleo (mara nyingi kwa picha).
2. Mfano wa zawadi hujifunza maelezo yanayopendelea nini.
3. Kizalishaji kinarekebishwa fini kuzalisha matokeo yanayopata zawadi kubwa.
4. Matokeo hayo yanaathiri jinsi "nzuri" inavyoonekana katika raundi za uwekaji maelezo zinazofuata.

Mzunguko huu wa maoni si wa kudhuru kwa asili — ndiyo unaoruhusu RLHF kuungana — lakini inamaanisha kwamba tabia ya mfano inaundwa na lengo linalohamia ambalo mchakato wa uwekaji maelezo yenyewe husaidia kuhamisha. Kutofautisha kile mfano ulichojifunza kwa sababu kinaakisi mapendeleo ya binadamu na kile kilichojifunza kwa sababu kilijifunza kuoanishwa na kanuni za wawekaji maelezo ni kigumu kimajaribio.

Hakuna suluhisho safi. Mazoezi bora ya sasa ni kufuatilia mabadiliko kwa kutumia hukumu za mapendeleo zilizohifadhiwa zilizokusanywa kwa vipindi vya kawaida, na kutibu toleo la mwongozo wa uwekaji maelezo kama kigezo cha majaribio.

---

## Tathmini ya Mifano ya NLP ya Uzalishaji

Tofauti na mifano ya uainishaji na kipimo wazi cha usahihi, kutathmini ubora wa uzalishaji kunahitaji hukumu ya binadamu:

| Mbinu ya tathmini         | Maelezo                                         | Gharama   |
|---------------------------|-------------------------------------------------|-----------|
| Tathmini ya moja kwa moja (DA) | Wawekaji maelezo wanipanga ubora kwa kipimo | Wastani   |
| Hukumu ya kulinganishwa   | Wawekaji maelezo wanalinganisha matokeo mawili  | Chini     |
| MQM (Vipimo vya Ubora vya Pande Nyingi) | Uainishaji wa makosa wa muundo | Juu      |
| Mapendeleo ya RLHF        | Lebo za mapendeleo zinazotumiwa kwa mafunzo     | Wastani   |
| LLM-kama-jaji             | LLM inapanga matokeo (inalingana kwa wastani na binadamu) | Chini sana |
| BERTScore, BLEU           | Vipimo otomatiki (muunganiko usio kamili na hukumu ya binadamu) | Chini sana |

Vipimo otomatiki (BLEU kwa MT, ROUGE kwa muhtasari) ni nafuu lakini vina muunganiko usio kamili na hukumu za ubora za binadamu {cite}`reiter2018structured`. Mbinu za LLM-kama-jaji zinaonyesha makubaliano ya wastani na wawekaji maelezo wa binadamu {cite}`zheng2023judging` na zinatumika zaidi kwa mzunguko wa haraka, lakini hazipaswi kuchukua nafasi ya tathmini ya binadamu kwa tathmini za mwisho. Kwa maamuzi yenye hatua za kweli, tathmini ya binadamu inabaki kuwa ya lazima.

```{seealso}
Usimamizi dhaifu wa Snorkel: {cite}`ratner2017snorkel`. Mwongozo wa uwekaji maelezo wa NLP: {cite}`pustejovsky2012natural`. Vitu vya mwelekeo vya uwekaji maelezo katika NLI: {cite}`geva2019annotator`. Upendeleo wa wawekaji maelezo na mkusanyiko wa data wa NLP: {cite}`blodgett2020language`. Kwa tathmini ya mifano ya uzalishaji: {cite}`reiter2018structured`.
```
