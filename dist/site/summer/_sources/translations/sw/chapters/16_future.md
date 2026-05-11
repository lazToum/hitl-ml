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

# Mwelekeo wa Baadaye

Uwanja wa ujifunzaji wa mashine wenye binadamu katikati unabadilika haraka. Mifano ya msingi, LLMs-kama-wawekaji maelezo, na mifumo mipya ya ushirikiano kati ya binadamu na AI inabadilika uchumi na mazoezi ya HITL kwa njia ambazo hazikuweza kufikiwa hata miaka mitano iliyopita. Sura hii ya mwisho inaainisha mandhari ya mwelekeo wa kuibuka na matatizo ya wazi.

---

## Mifano ya Msingi na Jukumu Linaloobadilika la Uwekaji Maelezo

Mifano ya msingi — mifano mikubwa iliyofunzwa awali kwenye data pana inayoweza kurekebisiwa kwa kazi za chini — inabadilisha msingi wa uchumi wa HITL.

### Kupunguza Mzigo wa Uwekaji Maelezo

Kazi iliyohitaji hapo awali mifano maelfu yenye lebo kwa mafunzo kutoka mwanzo inaweza kuhitaji tu makumi wakati wa kurekebisha mfano wa msingi. Maswali ya mifano michache yanaweza kuondoa haja ya kurekebisha fini kabisa kwa kazi fulani.

**Athari:** ROI ya uwekaji maelezo inabadilika. Juhudi za uwekaji maelezo sasa zinaelekezwa vizuri zaidi kuelekea:
- Seti za tathmini za ubora wa juu (kupima kama mfano uliorekebishwa unafanya kazi kweli kweli)
- Hali ngumu na hali za mipaka ambazo mfano wa msingi hushughulikia vibaya
- Mifano maalum ya kazi inayofundisha mfano kitu ambacho huwezi kujifunza kutoka mafunzo ya awali

### Aina Mpya za Ubainishaji

Mfano wa msingi unaelewa lugha, msimbo, na akili ya kawaida tayari, watumiaji wanaweza kuwasiliana nao kwa lugha asilia badala ya kupitia mifano yenye lebo. Mtumiaji anayetaka kisambazaji cha maandishi hahitaji tena kuweka lebo mifano 500 — anaweza kuandika maelezo ya kazi ya uainishaji na kutathmini utendaji wa sifuri-onyesho.

Hii inahamisha changamoto ya HITL kutoka *ukusanyaji wa mifano* hadi *ubainishaji wa kazi*: kusaidia watumiaji kubainisha waziwazi watakavyo kwa mfumo mfano unaoufanya. Hii ni ngumu zaidi ya inavyosikika — maelezo ya lugha asilia ya kazi mara nyingi yana utata kwa njia ambazo mifano iliyowekewa maelezo haiana.

---

## LLMs kama Wawekaji Maelezo

Moja ya maendeleo muhimu zaidi ya 2023–2025 ni matumizi ya **LLMs kama vyanzo vya uwekaji maelezo**. Badala ya kumuuliza binadamu "Je, tathmini hii ni ya chanya au hasi?", tunamuliza GPT-4 au Claude. Kwa kazi za uainishaji zilizofafanuliwa vizuri, maelezo ya LLM mara nyingi yanalingana na au kufanana karibu na usahihi wa wafanyakazi wa umma {cite}`gilardi2023chatgpt`, na gharama kwa maelezo ya simu za API kawaida ni ya chini kwa mara nyingi zaidi kuliko viwango vya kazi ya binadamu.

### Mahali Uwekaji Maelezo wa LLM Unavyofanya Kazi Vizuri

- Kazi rahisi, zilizofafanuliwa vizuri za uainishaji (hisia, mada, nia)
- Kazi ambapo lebo za binadamu zinaweka makubaliano ya kitamaduni ambayo LLM imeyachukua
- Kazi ambapo uwekaji maelezo ni thabiti kati ya muktadha (si ya udhati mkubwa sana)
- Kuzalisha maelezo ya kwanza ya ukaguzi wa binadamu

### Mahali Uwekaji Maelezo wa LLM Unavyoshindwa

- Kazi za uwanja maalum sana zinazohitaji utaalamu wa nadra (kimatibabu, kisheria, kisayansi)
- Kazi zinazohitaji maarifa ya kitamaduni ya ndani au tofauti za lugha
- Kazi za usalama na madhara, ambapo LLM inaweza kuwa na urekebishaji mbaya katika mwelekeo huo huo kama data iliyofunzwa
- Aina mpya za kazi ambazo haziwakilishwi vizuri katika mafunzo ya awali

### RLAIF na AI ya Kikatiba

Kama ilivyojadiliwa katika Sura ya 6, maoni yaliyozalishwa na AI yanaweza kutumika kufunza mifano ya zawadi na kuongoza kurekebisha fini kwa RL. Hii inaunda mzunguko wa maoni: LLMs huzalisha data, mifano hufunzwa kwake, na mifano bora huzalisha data bora. Swali la jinsi ya kuanzisha mzunguko huu bila kuweka kosa la kimfumo kutoka kwa mfano wa awali ni tatizo kuu la wazi katika utafiti wa usimamizi unaoweza kupanuka.

---

## Usimamizi Dhaifu kwa Kiwango Kikubwa

**Uwekaji lebo wa programu** kupitia kazi za uwekaji lebo (Sura ya 9) inaruhusu wataalam wa mada kuonyesha maarifa yao kama msimbo badala ya kama mifano yenye lebo. Mifumo kama Snorkel {cite}`ratner2017snorkel` na warithi wake imekomaa kwa kiasi kikubwa na sasa inatumika katika uzalishaji katika makampuni makubwa ya teknolojia.

**Mwelekeo wa mpaka:**
- **Kazi za uwekaji lebo zilizoongezewa LLM:** Tumia LLMs kuzalisha kazi za uwekaji lebo kutoka kwa maelezo ya lugha asilia
- **Kujifunza kulingana na kipande:** Tambua vikundi muhimu vya data (vipande) ambapo kazi za uwekaji lebo zinakinzana na elekeza uwekaji maelezo wa binadamu huko
- **Ujumuishaji unaozingatia wasiwasi:** Mifano bora ya takwimu ya kuchanganya kazi za uwekaji lebo zenye usahihi na muunganiko tofauti

---

## Kujifunza kwa Kuendelea kwa Usimamizi wa Binadamu

Mifumo mingi ya ML hufunzwa nje ya mtandao na kutekelezwa kama mifano tuli. Ulimwengu unabadilika; mifano iliyokuwa sahihi wakati wa utekelezaji hupungua kadri usambazaji wa data unavyohamia.

**Kujifunza kwa kuendelea** — uwezo wa kujifunza kutoka kwa data mpya huku ukihifadhi maarifa ya zamani — ni eneo la utafiti tendi. Usimamizi wa binadamu ni muhimu: kujifunza kwa kuendelea kiotomatiki bila mapitio ya binadamu kunaweza haraka kuweka mabadiliko ya usambazaji ambayo ni makosa badala ya mabadiliko ya kweli ya ulimwengu.

**Kujifunza kwa kuendelea kwa HITL** kunahusisha:
- Ufuatiliaji wa mabadiliko ya usambazaji (kiotomatiki) na kuelekeza mifano iliyohamia kwa mapitio ya binadamu
- Kurekebisha tena kwa uchaguzi: mifano iliyoidhinishwa na binadamu kutoka usambazaji mpya huongezwa kwenye data ya mafunzo
- Mapitio ya binadamu ya mabadiliko ya tabia ya mfano baada ya kila sasishi

---

## HITL ya Pande Nyingi

Mifumo ya AI inakuwa ya pande nyingi — ikisindika na kuzalisha maandishi, picha, sauti, na video wakati huo huo — uwekaji maelezo unakuwa mgumu zaidi. Kipande kimoja cha maudhui kinaweza kuhitaji uwekaji maelezo kati ya hali, yenye utegemezi kati yao.

**Aina za kazi zinazoibuka:**
- Uwekaji maelezo wa video + nakala (nini kinatokea, ni nani anazungumza, maandishi yanafanya maelezo ya nini kwa macho?)
- Uwekaji maelezo wa picha ya kimatibabu + ripoti ya kliniki
- Uwekaji maelezo wa njia ya roboti (kuunganisha data ya sensorer na mfululizo wa vitendo)

Mifano ya msingi ya pande nyingi (GPT-4V, Gemini, Claude) inabadilisha mandhari ya uwekaji maelezo hapa pia — mifano sasa inaweza kufafanua picha na kuzalisha maelezo ya wagombea, ambayo binadamu wanakagua.

---

## Usimamizi Unaoweza Kupanuka

Tatizo la kimsingi la wazi katika HITL ML ni **usimamizi unaoweza kupanuka** {cite}`irving2018ai,bowman2022measuring`: mifumo ya AI inakuwa na uwezo zaidi kuliko binadamu katika maeneo maalum, tunawezaje kudumisha usimamizi wa maana wa binadamu?

Kwa kazi kama utabiri wa muundo wa protini, uchambuzi wa kisheria, au uthibitishaji wa uthibitisho wa kihesabu, hata wawekaji maelezo wataalamu wanaweza kutoweza kuhukumu matokeo mawili ya AI ni sahihi. Mbinu za sasa za HITL zinaharibika wakati hukumu ya binadamu ni ya kutegemewa kidogo kuliko mfano unaopimwa.

**Mbinu zilizopendekezwa {cite}`bowman2022measuring`:**

**Mjadala:** Mifumo miwili ya AI inajadili kwa hitimisho tofauti; jaji wa binadamu anatathmini hoja badala ya hitimisho moja kwa moja. Hitimisho sahihi linapaswa kuwa na utetezi zaidi.

**Ukuzaji:** Waamuzi wa binadamu wanashauriana na wasaidizi wa AI (mfano wenyewe) kusaidia kutathmini matokeo magumu. Hii inatumia uwezo wa AI kupanua usimamizi wa binadamu badala ya kuubadilisha.

**Usimamizi wa mchakato:** Badala ya kutathmini tokeo la mwisho, binadamu wanatathmini *mchakato wa ufikiriaji* — wakibainisha hatua zenye kasoro katika mnyororo wa mawazo, bila kujali kama jibu la mwisho linafanyika kuwa sahihi.

---

## Mgawanyiko wa Kazi Unaobadilika

Njia ya muda mrefu ya HITL ML ni kuelekea ushirikiano wa zaidi kuelea kati ya binadamu na AI, ambapo hakuna mmoja anayekuwa tu "mweka lebo" na mwingine "mjifunzaji," bali wote wanachangia mchakato wa pamoja wa kiakili.

**Mwelekeo wa kufuatilia:**
- **Uwekaji maelezo unaosaidiwa na AI:** AI inapendekeza; binadamu anaamua. Ubora unaboresha AI inapopendekezea chaguo bora.
- **Uchunguzi ulioongozwa na binadamu:** Binadamu wanaweka malengo na vikwazo; AI inachunguza nafasi ya suluhisho.
- **Tathmini ya ushirikiano:** Binadamu na AI wanavitathmini matokeo magumu kupitia mazungumzo.
- **Kujifunza mapendeleo kwa kiwango kikubwa:** Ishara za picha (jinsi watumiaji wanavyoshirikiana na matokeo ya AI) zinalisha kujifunza mapendeleo kwa kuendelea bila kuhitaji vikao vya uwekaji maelezo waziwazi.

Swali la kiasi gani cha kuamini hukumu ya AI dhidi ya hukumu ya binadamu — na katika maeneo gani, kwa viwango gani vya uwezo, na na ulinzi gani — ni hatimaye swali la kijamii, si la kiufundi tu. HITL ML inatoa miundombinu ya kiufundi ya kulijibu kwa makini, badala ya kwa msingi.

---

## Matatizo ya Wazi ya Utafiti

Tunamaliza na orodha ya matatizo muhimu ya wazi ambayo uwanja unashughulikia kikamilifu:

1. **Kusimama bora katika ujifunzaji tendaji:** Wakati thamani ya pembezoni ya maelezo inayofuata ni chini ya gharama? Sheria za kusimama za msingi zinabaki za kueleweka vibaya.

2. **Ugawaji wa bajeti ya uwekaji maelezo kati ya kazi:** Katika mazingira ya kazi nyingi, bajeti ya uwekaji maelezo iliyowekwa inapaswa kugawanywaje kati ya kazi?

3. **Mabadiliko ya usambazaji katika ujifunzaji tendaji:** Ujifunzaji tendaji huunda seti zilizobaguliwa za lebo. Mifano iliyofunzwa hivi iwezaje kurekebishwa ipasavyo?

4. **Ujumlishaji wa mfano wa zawadi:** Mifano ya zawadi ya RLHF inaweza kushindwa kujumlisha kwa jozi mpya za maswali-majibu. Tunawezaje kujenga mifano ya mapendeleo ya ustahimilivu zaidi?

5. **Usimamizi unaoweza kupanuka:** Tunawezaje kudumisha usimamizi wa binadamu mifumo ya AI inapozidi utendaji wa binadamu katika maeneo maalum?

6. **Kuiga wawekaji maelezo:** Mifano bora ya takwimu ya tabia ya wawekaji maelezo inayonasa si uwezo tu bali pia upendeleo wa kimfumo, utaalamu wa mada, na uchovu.

7. **Tathmini ya ulinganifu:** Hatuna majaribio ya ukweli wa ardhi kwa kama mfano unalingana na maadili ya binadamu. Kuendeleza majaribio kama hayo — yanayofanana na mifano ya adui kwa ustahimilivu — ni tatizo la wazi.

8. **Kazi ya data ya haki:** Miundo ya kiuchumi na kitaasisi inayohakikisha wafanyakazi wa uwekaji maelezo wanalipwa haki na kulindwa, huku ikidumisha ufanisi wa gharama wa uwekaji maelezo kwa kiwango kikubwa.

---

```{epigraph}
Lengo si kubadilisha hukumu ya binadamu na hukumu ya mashine,
bali kujenga mifumo ambapo mchanganyiko wa vyote viwili ni bora kuliko yoyote peke yake.
```

Zana na mbinu katika kitabu hiki cha mwongozo — uwekaji maelezo, ujifunzaji tendaji, RLHF, kujifunza mapendeleo, na mengine yote — ni njia kuelekea lengo hilo. Uwanja unavyobadilika, mbinu maalum zitabadilika. Dhamira ya msingi — kujenga mifumo ambayo ni yenye uwezo na imelinganifu kweli na nia ya binadamu — itabaki.

```{seealso}
Usimamizi unaoweza kupanuka na mjadala: {cite}`bowman2022measuring`. Usimamizi dhaifu wa Snorkel: {cite}`ratner2017snorkel`. Kwa mustakabali mpana wa ushirikiano kati ya binadamu na AI, angalia {cite}`amershi2019software`.
```
