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

# Ujifunzaji wa Mashine wenye Binadamu Katikati ni Nini?

```{epigraph}
Mashine inayoweza kujifunza kutoka kwa uzoefu... lakini tu ukiipa uzoefu sahihi.
-- kwa kufuata Alan Turing
```

## Mkanganyiko wa Otomatiki

Kila wimbi jipya la otomatiki huunda mahitaji mapya ya makini ya binadamu. Wakati mashirika ya ndege yalianzisha rubani otomatiki, marubani wakawa wasimamizi — hawajibikii udhibiti wa dakika kwa dakika bali kwa kazi ngumu zaidi ya kujua *wakati* wa kuchukua udhibiti. Wakati maduka makubwa yalianzisha malipo ya kujihudumia, waligundua kwamba mifumo hiyo inahitaji usimamizi zaidi wa binadamu kwa kila muamala kuliko wahesabu wa kawaida, si chini. Na wakati ujifunzaji wa mashine ulianza kufanya maamuzi kwa kiwango kikubwa — katika dawa, fedha, uajiri, na usimamizi wa maudhui — iliunda mahitaji makubwa, yanayoendelea ya hukumu ya binadamu.

Hii ndiyo **mkanganyiko wa otomatiki** {cite}`bainbridge1983ironies`: kadri mfumo otomatiki unavyoimarika, ndivyo kushindwa kwake kunakuwa na matokeo makubwa zaidi, na kwa hivyo ndivyo usimamizi madhubuti wa binadamu unavyohitajika zaidi. Ujifunzaji wa mashine si ubaguzi.

Ujifunzaji wa Mashine wenye Binadamu Katikati (HITL ML) ni uwanja unaochukua mkanganyiko huu kwa uzito na kuujenga katika muundo wa mifumo tangu mwanzo. Badala ya kuona ushiriki wa binadamu kama nyenzo za muda zinazostahili kuondolewa hatimaye, HITL ML inauona mwingiliano kati ya binadamu na mashine kama *kipengele* — chanzo cha ishara, marekebisho, na mwongozo unaoweza kufanya mifano kuwa sahihi zaidi, iliyopatanishwa zaidi na maadili ya binadamu, na inayostahili kuaminiwa zaidi.

---

## Kufafanua HITL ML

Hakuna ufafanuzi mmoja uliokubaliwa wa HITL ML, na neno hilo linatumika kwa njia kadhaa zinazoingiliana katika fasihi. Kwa kitabu hiki cha mwongozo tunakubali ufafanuzi mpana lakini sahihi:

:::{admonition} Ufafanuzi
:class: important

**Ujifunzaji wa Mashine wenye Binadamu Katikati** unarejelea mfumo wowote wa ML au mbinu ambapo maoni ya binadamu yanajumuishwa katika mchakato wa kujifunza kwa njia ya *makusudi, iliyopangwa, na inayoendelea* — si tu wakati wa uundaji wa mkusanyiko wa data, bali katika mafunzo yote, tathmini, na utekelezaji.

:::

Ufafanuzi huu una vipengele vitatu muhimu:

**Kwa makusudi.** HITL si ushawishi wa bahati mbaya wa binadamu (k.m., ukweli kwamba data ya mafunzo iliundwa awali na binadamu). Unarejelea mifumo iliyoundwa wazi ili kuomba, kujumuisha, na kufaidika na maoni ya binadamu.

**Iliyopangwa.** Maoni yana mfumo uliofafanuliwa — lebo, marekebisho, hukumu ya upendeleo, maonyesho — na jukumu lililofafanuliwa katika kanuni ya kujifunza.

**Inayoendelea.** Mzunguko wa maoni unaendelea kwa wakati, ukiuruhusu mfumo kuboresha unapokutana na hali mpya, kufanya makosa, na kupokea mwongozo wa binadamu.

Ufafanuzi huu unajumuisha mifumo ya kitambo ya uwekaji maelezo, ujifunzaji tendaji, ML ya mwingiliano, RLHF, na kujifunza kwa kuiga. Unaacha nje ukusanyaji wa passiv wa data na ujifunzaji wa usimamizi wa nje ya mtandao peke yake (ingawa mpaka ni dhaifu, kama tutakavyojadili katika Sura ya 2).

---

## Historia Fupi

### Mifumo ya Wataalam na Uhandisi wa Maarifa (Miaka ya 1960–1980)

Mifumo ya kwanza ya AI ilikuwa karibu yote ya binadamu katika mzunguko: wahandisi wa maarifa walikaa na wataalam wa fani kwa miezi, wakiingiza kwa makini sheria kwenye mifumo ya wataalam kama MYCIN na DENDRAL. Kila kipande cha maarifa kilipewa waziwazi na binadamu. Mashine ilikuwa ya utekelezaji; binadamu alikuwa chanzo.

Mifumo hii ilifanya kazi vizuri kushangaza katika maeneo nyembamba lakini ilikuwa brittle — haikuweza kujumlisha zaidi ya sheria zilizoundwa kwa mkono na ilikuwa ghali kutunza.

### Mabadiliko ya Takwimu (Miaka ya 1980–2000)

Mabadiliko ya ujifunzaji wa mashine wa takwimu katika miaka ya 1980 na 1990 yalibadilisha asili ya ushiriki wa binadamu. Badala ya kuweka maarifa kama sheria, binadamu sasa walitoa *mifano* — mkusanyiko wa data ulioongezewa lebo ambao uliruhusu mifano kutabiri mifumo. Jukumu la binadamu likawa la mweka maelezo: kuweka lebo kwa hati, kutengeneza picha, kunukuu usemi.

Hii ilikuwa hatua kubwa mbele, lakini iliunda kikwazo kipya: **data yenye lebo ni ghali**. Watafiti walianza kuuliza jinsi ya kutumia kwa ufanisi zaidi juhudi za uwekaji lebo za binadamu. Swali hili lilizaa **ujifunzaji tendaji**, uliofanywa rasmi kwanza mwanzoni mwa miaka ya 1990 {cite}`cohn1994improving`.

### Enzi ya Kujifunza Kwa Kina (Miaka ya 2010 hadi sasa)

Mapinduzi ya kujifunza kwa kina yaliunda utaratibu mpya: mifano yenye mabilioni ya vigezo inayoweza kujifunza utendaji kazi mgumu sana kutoka kwa data — lakini inahitaji mkusanyiko mkubwa wa data yenye lebo. ImageNet (picha milioni 14 zenye lebo) na miradi ya baadaye ya uwekaji maelezo kwa kiwango kikubwa ilionyesha nguvu na gharama ya kiwango.

Wakati huo huo, utekelezaji wa ML kwa kiwango kikubwa ulifichua matatizo mapya: mifano iliyokuwa sahihi kwa wastani lakini yenye makosa ya kimfumo kwa makundi maalum, iliyokuwa na imani ya uongo juu ya ukweli, iliyoboreshwa kwa wawakilishi wanaoweza kupimwa badala ya maadili ya binadamu. Kushindwa huku kulisababisha aina mpya za ushiriki wa binadamu: si kuweka lebo tu, bali *upatanisho* — mradi wa kufanya mifano ifanye kama binadamu wanavyotaka kweli.

Usemi wazi zaidi wa kazi hii ya HITL inayozingatia upatanisho ni **Ujifunzaji wa Kuimarisha kutoka kwa Maoni ya Binadamu (RLHF)** {cite}`christiano2017deep`, ambao ukawa msingi wa mifumo kama InstructGPT {cite}`ouyang2022training` na uwezo wa kufuata maelekezo wa mifano ya kisasa ya lugha.

---

## Kwa Nini HITL? Hoja kwa Hukumu ya Binadamu

Ni nini kinachofanya hukumu ya binadamu kuwa na thamani ya kujumuisha katika mifumo ya ujifunzaji wa mashine? Sifa kadhaa:

### 1. Akili ya Kawaida na Maarifa ya Dunia

Binadamu huleta maarifa mapana ya msingi kwa kazi yoyote. Wakati daktari wa radiolojia anaweka lebo kwenye picha ya X-ray, anategemea miaka ya mafunzo, uelewa wa anatomy, na maarifa ya picha ya magonjwa yanayoonekana — maarifa ambayo ni magumu sana kufafanua kikamilifu au kupata kutoka kwa data peke yake.

### 2. Msingi wa Kisemantiki

Lebo zina maana kwa sababu binadamu wanaelewa zinamaanisha nini. Darasa "paka" katika ImageNet linarejelea dhana isiyo na mipaka wazi ambayo binadamu wanaijua kwa silika lakini ambayo hakuna ufafanuzi rasmi unaoinakili kikamilifu. Mifano hujifunza upanuzi wa lebo (picha zipi zinaielekeza) lakini inaweza isijifunze dhana yenyewe, na kusababisha kushindwa kwa hali za mpaka ambazo binadamu yeyote angezimudu kwa usahihi.

### 3. Upatanisho wa Maadili

Binadamu wana mapendeleo, maadili, na hukumu za kimaadili ambazo mifano ya ML haiwezi kupata kutoka kwa data peke yake. Kama kipande cha maandishi ni "cha kusaidia" au "cha kudhuru" si swali la kimajaribio tu — inategemea maadili ya binadamu yanayotofautiana kati ya watu binafsi na muktadha. HITL ndiyo njia kuu ambayo maadili haya yanaweza kuwasilishwa kwa mifumo ya ML.

### 4. Uwezo wa Kubadilika

Hukumu ya binadamu inaweza kubadilika kwa hali mpya bila mafunzo upya. Mfano uliofunzwa kwa data ya kihistoria unaweza kushindwa vibaya wakati ulimwengu unabadilika; binadamu anaweza kutambua uvumbuzi na kujibu ipasavyo.

### 5. Uwajibikaji

Katika maeneo yenye hatari kubwa — dawa, sheria, fedha — maamuzi yanahitaji kuwajibika kwa binadamu. Mifumo ya HITL inafanya uwajibikaji huu uwezekane kwa kuweka binadamu katika nafasi ya kuelewa, kuthibitisha, na kubatilisha tabia ya mashine.

---

## Mzunguko wa Maoni

Muundo wa msingi wa HITL ML ni mzunguko wa maoni kati ya mfano na binadamu mmoja au zaidi:

```text
+---------------------------------------------+
|                                             |
|   Mfano hufanya utabiri / huomba           |
|   ---------------------------------->       |
|                                   Binadamu |
|   Binadamu hutoa maoni           <-------- |
|   ----------------------------------        |
|                                             |
|   Mfano husasishwa kulingana na maoni      |
|                                             |
+---------------------------------------------+
```

Asili ya maoni inatofautiana sana katika mifumo ya HITL:

| Aina ya maoni     | Mfano                                        | Mfumo mkuu             |
|-------------------|----------------------------------------------|------------------------|
| Lebo ya darasa    | "Barua pepe hii ni taka"                     | Ujifunzaji wa usimamizi|
| Marekebisho       | "Kitengo kinapaswa kuwa ORG, si PER"         | ML tendaji / mwingiliano|
| Upendeleo         | "Jibu A ni bora kuliko B"                    | RLHF / upangaji        |
| Maonyesho         | Kuonyesha roboti jinsi ya kushika kitu       | Kujifunza kwa kuiga    |
| Lugha asilia      | "Kuwa mfupi zaidi katika majibu yako"        | Urekebishaji wa maelekezo|
| Ishara ya picha   | Mtumiaji alibofya / hakubofya               | Maoni ya picha         |

---

## Kinachosi HITL

Inafaa kuwa wazi kuhusu kinachoko *nje* ya ufafanuzi wetu.

**HITL si sawa na utekelezaji wa binadamu katika mzunguko** (mara nyingi huitwa "binadamu juu ya mzunguko"), ambapo binadamu wanasimamia maamuzi otomatiki na wanaweza kuyabatilisha lakini hawapelekei marekebisho kurudi katika mafunzo. Tutajadili tofauti hii katika Sura ya 2.

**HITL si usimamizi dhaifu peke yake.** Mifumo ya uwekaji lebo ya programu kama Snorkel hutumia kazi za uwekaji lebo (mara nyingi sheria zilizoandikwa na binadamu) kuzalisha lebo zenye kelele kwa kiwango kikubwa. Hii ni aina ya ingizo la binadamu lililoundwa, lakini maoni si ya mzunguko kwa njia ambayo HITL kawaida ina maana.

**HITL si utumiaji tu wa data yenye lebo.** Kila mfano wa ujifunzaji wa usimamizi hutumia data iliyowekewa lebo na binadamu. HITL inarejelea hasa mifumo ambapo maoni ya binadamu ni sehemu *tendaji, ya mzunguko* ya mchakato wa kujifunza.

---

## Uchumi wa Maoni ya Binadamu

Maoni ya binadamu yana thamani lakini ni ghali. Uwekaji maelezo wa picha ya kimatibabu unaweza kugharimu popote kutoka makumi hadi mamia ya dola kwa picha ikifanywa na mtaalam, kulingana na taaluma ndogo na ugumu wa kazi {cite}`monarch2021human`. Lebo za wafanyakazi wa umma kwenye majukwaa kama Amazon Mechanical Turk zinaweza kugharimu $0.01–$0.10 kwa kipengele {cite}`hara2018data` kwa ubora mdogo zaidi. Changamoto ya msingi ya HITL ML ni **kuongeza thamani ya kila kitengo cha maoni ya binadamu**.

Hii inasababisha swali la muungano linalopigia uzi katika sehemu nyingi za kitabu hiki:

:::{admonition} Swali Kuu la HITL ML
:class: tip

*Kwa bajeti iliyowekwa ya wakati na makini ya binadamu, tunapaswa kuamua vipi nini kuuliza binadamu, wakati wa kuuliza, na jinsi ya kujumuisha majibu yao katika mafunzo ya mfano?*

:::

Jibu la swali hili linategemea eneo la matumizi, mfumo wa maoni, gharama ya uwekaji maelezo, hatari ya kosa, na hali ya sasa ya mfano — ndiyo maana HITL ML ni taaluma tajiri na inayoendelea kubadilika.

---

## Muhtasari wa Kitabu cha Mwongozo

Sehemu iliyobaki ya kitabu hiki imepangwa kama ifuatavyo. **Sehemu ya II** inashughulikia nguzo tatu za kitambo za HITL: uwekaji maelezo, ujifunzaji tendaji, na ML ya mwingiliano. **Sehemu ya III** inazungumzia mifumo mipya ya kujifunza kutoka kwa maoni — RLHF, kujifunza kwa kuiga, na kujifunza upendeleo — ambayo imekuwa ya msingi kwa AI ya kisasa. **Sehemu ya IV** inachunguza HITL kupitia lenzi ya maeneo maalum ya matumizi. **Sehemu ya V** inachukua mtazamo wa mtaalamu wa vitendo kuhusu majukwaa, ushirikiano wa umma, na tathmini. **Sehemu ya VI** inashughulikia maadili na kutazama mbele.

```{seealso}
Kwa mapitio yanayozingatia wataalamu wa vitendo wa uwanja huu, angalia {cite}`monarch2021human`. Kwa makala ya msingi ya ujifunzaji tendaji iliyoanzisha matibabu mengi rasmi ya HITL, angalia {cite}`settles2009active`.
```
