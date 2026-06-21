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

# Usawa, Upendeleo, na Maadili

Mifumo ya binadamu-katika-mzunguko hurithi uwezo na mipaka ya binadamu walio ndani yake. Wawekaji maelezo wanaleta maarifa, hukumu, na ubunifu katika kazi yao — lakini pia upendeleo, uchovu, na muktadha wa kijamii wa maisha yao. Maamuzi tunayofanya katika kubuni mifumo ya HITL — ni nani anayeweka maelezo, wanaulizwa nini, wanalipwaje, na jinsi kazi yao inavyotumika — yana matokeo yanayopanuka mbali zaidi ya vipimo vya usahihi wa mfano.

Sura hii inashughulikia vipengele vya kimaadili vya HITL ML.

---

## Vyanzo vya Upendeleo katika Mifumo ya HITL

### Kidemografia cha Wawekaji Maelezo

Uwekaji maelezo si kitendo cha kawaida. Lebo wanazotoa wawekaji maelezo zinaakisi mitazamo, uzoefu, na muktadha wa kitamaduni. Nguvu kazi ya uwekaji maelezo inapokuwa ya kidemografia moja — kama ilivyo mara nyingi, kazi za umma zikitawaliwa na wachanga, wa kiume, na wa Magharibi — mkusanyiko wa data unaotokea huweka mitazamo ya kikundi hicho.

**Ushahidi:** Tafiti za mkusanyiko wa data wa uwekaji maelezo wa NLP zimegundua kwamba sifa za kidemografia za wawekaji maelezo zinaabiri uchaguzi wa lebo kwa kazi za udhati (usumu, hisia, kukera). Mkusanyiko wa data ulioandikwa na wafanyakazi wa umma wa Marekani hasa huweka kanuni za kitamaduni za Marekani ambazo hazijumlishi katika maeneo mengine {cite}`geva2019annotator`.

**Matokeo:** Mifano iliyofunzwa kwenye data kama hiyo hufanya vizuri kwa watumiaji wanaofanana na bwawa la wawekaji maelezo na vibaya zaidi — au kwa njia za kibaguzi — kwa watumiaji ambao hawafanani.

**Kupunguza:** Utofauti wa nguvu kazi wa makusudi; uwekaji maelezo uliobainishwa (hakikisha wawekaji maelezo kutoka kwa vikundi vya kidemografia vinavyohusika vanachangia kwa kazi zinazohusika); fuatilia kidemografia cha wawekaji maelezo na athari yake kwenye usambazaji wa lebo.

### Muundo wa Kazi

Jinsi swali linavyowekwa muundo huathiri majibu yanayosababishwa. Wawekaji maelezo wakiulizwa "Je, maandishi haya yana sumu?" wanaweza kujibu tofauti kuliko wakiulizwa "Je, maandishi haya yangedhuru mtu anayemiliki kikundi kilichotajwa?" Muundo huweka dhana kuhusu kinachohusika.

**Mfano:** Uwekaji maelezo wa "lugha ya udhalimu" kwenye mitandao ya kijamii unatofautiana kwa kiasi kikubwa kulingana na kama wawekaji maelezo wanaonyeshwa habari za muktadha kuhusu utambulisho wa mwandishi. Taarifa inayoonekana kuwa ya kutisha peke yake inaweza kutambuliwa kama lugha iliyorejelewa au mzaha wa ndani ya kikundi habari za muktadha zinapotolewa.

### Athari za Jukwaa

Jukwaa na muundo wa malipo huathiri ubora wa uwekaji maelezo. Wafanyakazi wanaolipwa kwa kazi badala ya kwa saa wana motisha ya kufanya haraka; hii huongeza uzalishaji lakini hupunguza ubora. Wafanyakazi wanaohofu kuzuiwa kutoka kwa jukwaa kwa usahihi mdogo wanaweza kuepuka kuandika "wasiwasi" na badake kufanya nadhani, kuficha utata wa kweli.

### Upendeleo wa Uthibitisho na Nanga

Wawekaji maelezo wanaathiriwa na:
- **Uwekaji maelezo wa awali:** Utabiri wa mfano unaoonyeshwa kwa wawekaji maelezo unakubaliwa mara nyingi zaidi kuliko kukataliwa, hata unaposha makosa
- **Athari za mpangilio:** Kuweka lebo kipengele kimoja katika muktadha tofauti huzalisha majibu tofauti
- **Kuchochea:** Vipengele vya awali katika kazi huathiri jinsi vipengele vinavyofuata vinavyowekewa lebo

---

## Usawa katika Mifumo ya HITL

### Usawa ni Nini?

Usawa katika ML ni dhana inayoshindaniwa yenye ufafanuzi mwingi rasmi ambao mara nyingi hauwezi kupatikana pamoja {cite}`barocas2019fairness`. Kwa madhumuni ya HITL, vipengele muhimu zaidi ni:

**Uwakilishi:** Je, data ya mafunzo inawakilisha idadi za watu ambazo mfano utaziathiri?

**Usawa wa utendaji:** Je, mfano hufanya vizuri sawasawa kati ya vikundi tofauti vya kidemografia?

**Uthabiti wa uwekaji lebo:** Je, tabia sawa zinawekewa lebo sawasawa bila kujali ni nani anazifanya? (Utafiti umeonyesha hii si mara zote hivyo — maudhui sawa wakati mwingine huwekewa lebo tofauti yanapohusishwa na vikundi tofauti vya rangi au jinsia.)

### Ujifunzaji Tendaji Unaozingatia Usawa

Ujifunzaji tendaji wa kawaida unazingatia wasiwasi wa mfano, ambao huwa unajilundika kwenye mifano ya darasa kubwa. Hii inaweza kuongeza tofauti za utendaji kwa vikundi vidogo.

**Mikakati ya maswali inayozingatia usawa** huongeza kigezo cha wasiwasi na vikwazo vya utofauti au uwakilishi:

$$
x^* = \argmax_{x \in \mathcal{U}} \left[ \lambda \cdot \text{wasiwasi}(x) + (1 - \lambda) \cdot \text{faida\_ya\_kikundi\_kidogo}(x) \right]
$$

Kuweka $\lambda < 1$ kuhakikisha mkakati wa maswali haupuuzi uwakilishi wa kikundi kidogo kabisa.

---

## Ustawi wa Wawekaji Maelezo

### Tatizo la Kazi ya Kivuli

Kazi ya uwekaji maelezo inayosaidia ML kwa kiasi kikubwa haionekani. Wafanyakazi wa data — mara nyingi katika Kusini mwa Dunia — huweka lebo kwenye picha, kunukuu usemi, na kusimamia maudhui kwa malipo ya chini, bila faida, katika mipango ya uchumi wa kazi za ziada bila usalama wa kazi. "Anatomy of an AI System" ya Kate Crawford na Vladan Joler {cite}`crawford2018anatomy` na "Ghost Work" ya Mary Gray na Siddharth Suri {cite}`gray2019ghost` ziliandika kiwango na hatari ya kazi hii.

**Takwimu za Amazon MTurk:** Uchambuzi wa kimfumo wa 2018 wa mapato ya MTurk uligundua malipo ya wastani ya kwa saa ya takriban $2/saa — chini ya kiwango cha mshahara wa chini katika majimbo mengi ya Marekani na nchi nyingi zenye mapato ya juu {cite}`hara2018data`. Wafanyakazi nje ya nchi zenye mapato ya juu mara nyingi wanakabili vikwazo vya ziada: waombaji mara nyingi huzuia kazi za malipo ya juu kwa sifa za Marekani-peke yake, na bwawa la wafanyakazi wanaoshindana kwa kazi zilizobaki za wazi ni la kimataifa, ukibanisha mapato ya kwa kazi zaidi.

**Usimamizi wa maudhui:** Aina inayodhuru hasa ya kazi ya uwekaji maelezo — kukagua maudhui ya picha, ya ukatili, na ya kusumbua — imehusishwa na PTSD, msongo wa mawazo, na wasiwasi miongoni mwa wafanyakazi {cite}`newton2019trauma`. Majukwaa yamekabili ukosoaji kwa msaada wa kutosha wa afya ya akili na nambari za kukaribia zinazozidi.

### Mazoezi ya Kimaadili

**Malipo ya haki:** Lipa wafanyakazi wa uwekaji maelezo kwa kiwango sawa au juu ya kiwango cha chini cha mshahara cha ndani. Utafiti umeonyesha kwamba malipo ya juu huvutia wafanyakazi wa ubora wa juu bila kuongeza kwa usawa gharama kwa lebo sahihi.

**Uonekano wa kazi:** Kiri kazi ya kuunda data ya mafunzo katika machapisho na nyaraka za bidhaa.

**Msaada wa afya ya akili:** Kwa wafanyakazi wanaokagua maudhui ya kudhuru, toa msaada wa kisaikolojia, ratiba za mzunguko, na mipaka ya mfiduo.

**Uwakilishi wa wafanyakazi:** Wezesha wafanyakazi wa uwekaji maelezo kuripoti matatizo, kuomba ufafanuzi wa mwongozo, na kupinga tathmini za ubora zisizo za haki.

---

## Faragha katika Uwekaji Maelezo

### Habari Zilizo Chini ya Ulinzi wa Afya (PHI) na PII

Kazi za uwekaji maelezo mara nyingi zinahusisha data nyeti ya kibinafsi. Mradi wa uwekaji maelezo wa kimatibabu unaweza kuweka wazi wafanyakazi kwa rekodi za wagonjwa; mradi wa NLP unaweza kuweka wazi wafanyakazi kwa mawasiliano ya kibinafsi; mradi wa usimamizi wa maudhui huweka wazi wafanyakazi kwa ufafanuzi wa kibinafsi wa watumiaji.

Mifumo ya kisheria (HIPAA, GDPR) ina mipaka ya jinsi data ya kibinafsi inavyoweza kushirikiwa na nguvu kazi za uwekaji maelezo. Kanuni muhimu:

- **Kupunguza data:** Shiriki habari tu ambazo wawekaji maelezo wanahitaji kukamilisha kazi
- **Kuondoa utambuzi:** Ondoa PHI na PII kabla ya uwekaji maelezo inapowezekana
- **Ridhaa:** Data ya kweli ya mtumiaji inapowekewa maelezo, hakikisha ridhaa inayofaa au msingi wa kisheria
- **Udhibiti wa ufikiaji:** Punguza wawekaji maelezo gani wanaweza kufikia data nyeti kulingana na jukumu na uidhinishaji

### Data ya Sintetiki kama Mbadala

Kwa kazi ambapo data ya kweli ina hatari za faragha, uzalishaji wa data ya sintetiki unaweza kuunda mkusanyiko wa data tayari wa uwekaji maelezo bila kuweka wazi habari nyeti. Kwa NLP ya kliniki, kwa mfano, maandishi ya EHR ya sintetiki yanaweza kutoa data ya mafunzo ya kweli kwa mifano ya kuondoa utambuzi bila kuweka wazi rekodi halisi za wagonjwa.

---

## Uwekaji Maelezo wa Adui na Uchafuzi wa Data

Mifumo ya HITL huunda uso wa mashambulizi: kama adui anaweza kuathiri mchakato wa uwekaji maelezo, anaweza kuathiri tabia ya mfano.

**Uchafuzi wa data kupitia uwekaji maelezo:** Mshambuliaji mwenye ufikiaji wa nguvu kazi ya uwekaji maelezo (k.m., akaunti ya wafanyakazi wa umma iliyoathiriwa) anaweza kuingiza mifano iliyowekewa lebo vibaya kwa kimfumo. Hii ni ya ufanisi sana katika mazingira ya ujifunzaji tendaji, ambapo mfano unauliza kwa upendeleo mifano yenye wasiwasi — ambayo inaweza kuwa lengo la adui.

**Udanganyifu wa zawadi kupitia maoni:** Katika RLHF, wawekaji maelezo (au maelezo yaliyozalishwa na AI) wanaopanga kwa uthabiti aina fulani za maudhui vizuri wanaweza kuielekeza mfano kuelekea maudhui hayo, bila kujali ubora wake wa kweli.

**Kupunguza:** Wawekaji maelezo wengi huru kwa kipengele; ugunduzaji wa nje ya kawaida kwenye mifumo ya uwekaji maelezo; ufuatiliaji wa makubaliano au kutokubaliana kwa ajabu; kudumisha seti za tathmini ambazo haziwezi kuathiriwa na nguvu kazi ya uwekaji maelezo.

---

## Maadili ya Kitaasisi

### IRB na Mapitio ya Kimaadili

Miradi ya utafiti inayohusisha masomo ya binadamu — ikiwemo wafanyakazi wa uwekaji maelezo — mara nyingi inahitaji idhini ya Bodi ya Mapitio ya Kitaasisi (IRB). Miradi ya uwekaji maelezo inayokusanya data kuhusu imani za wafanyakazi, majibu kwa maudhui nyeti, au habari za kidemografia inapaswa kukaguliwa chini ya mfumo huo huo wa kimaadili kama utafiti mwingine wa masomo ya binadamu.

### Utawala wa Data

Mashirika yanapaswa kuwa na sera wazi za:
- Data gani inaweza kutumwa kwa uwekaji maelezo wa nje dhidi ya kuwekewa maelezo ndani
- Maelezo hudumishwa kwa muda mrefu kiasi gani na na nani
- Ni nani ana ufikiaji wa maelezo na mifano iliyofunzwa kwenye hayo
- Jinsi ya kushughulikia maombi ya kufuta data iliyowekewa maelezo (haki ya GDPR ya kufuta)

### Uwazi na Uwajibikaji

Watumiaji walioathiriwa na mifumo ya ML wana hamu ya kisheria ya kuelewa jinsi mifumo hiyo ilijengwa. Kuandika mbinu za uwekaji maelezo — ni nani aliyeweka lebo data, chini ya hali zipi, na mwongozo gani — ni aina ya uwajibikaji unaofaidisha watumiaji, wasimamizi, na uwanja kwa jumla.

**Karatasi za Data za Mkusanyiko wa Data** {cite}`gebru2021datasheets` zinatoa kiolezo kilichopangwa cha kuandika asili ya mkusanyiko wa data, taratibu za uwekaji maelezo, na mipaka inayojulikana.

```{seealso}
Mfumo wa usawa wa kanuni: {cite}`barocas2019fairness`. Kazi ya kivuli na kazi ya jukwaa: Gray & Suri (2019). Karatasi za Data za Mkusanyiko wa Data: {cite}`gebru2021datasheets`. Ustawi wa wafanyakazi wa usimamizi wa maudhui: {cite}`newton2019trauma`. Kidemografia cha wawekaji maelezo na mkusanyiko wa data wa NLP: {cite}`geva2019annotator`.
```
