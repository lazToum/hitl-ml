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

# Limen: Binadamu Katikati ya Kila Kitu

:::{admonition} Kumbuka kuhusu sura hii
:class: important
Sura hii ni **insha ya muundo wa nadharia**, si utafiti wa kimajaribio au mchango wa ukaguzi wa rika. Inaelezea usanifu wa mfumo uliofikiriwa — Limen, OS ya kompyuta ya kwanza ya sauti inayotegemea AI — kama mfano wa kazi wa jinsi kanuni za HITL kutoka sura zilizotangulia zinavyoweza kuchanganywa kuwa jumla thabiti. Madai hapa ni hoja za muundo, si matokeo ya majaribio. Yanapaswa kusomwa kama sababu ya muundo inayoongozwa, si kama matokeo ya uhandisi yaliyothibitishwa.
:::

Kila sura katika kitabu hiki cha mwongozo imeelezea HITL ML kama falsafa ya muundo: seti ya kanuni za kufanya ushiriki wa binadamu katika mifumo ya kujifunza kuwa wa makusudi, wa ufanisi, na wa uaminifu. Sura hii inaelezea jinsi inavyoonekana kutumia falsafa hiyo kama kanuni ya kwanza — si kwa mfumo mmoja, bali kwa mazingira yote ya uendeshaji.

**Limen** ni mfumo wa uendeshaji wa kompyuta wa kwanza wa sauti unaotegemea AI, ulioJengwa kwa msingi wa kwamba binadamu yuko daima katikati ya mzunguko, si kama kikwazo cha kuboreshwa mbali, bali kama kanuni inayopanga ambayo kila mfumo mdogo unaoundwa. Jina linachaguliwa kwa makusudi: *limen* ni neno la Kilatini kwa kizingiti. Katika saikolojia ya mtazamo, limen ni mpaka kati ya kinachohisiwa na kisichohisiwa. Kwa mfumo wa uendeshaji, limen ni mpaka kati ya nia ya binadamu na kitendo cha mashine.

Usanifu ulioelezwa hapa si wa umiliki. Ni seti ya maamuzi ya muundo, kila mmoja ukifuata kwa asili kutoka kwa kanuni za HITL zilizoendelezwa katika sura zilizotangulia. Lengo si kuandika bidhaa bali kuonyesha jinsi kanuni hizo zinavyochanganywa — jinsi zinavyoimarisha kila mmoja zinapotumiwa kwa uthabiti, na aina gani za mifumo inazowezekana binadamu asipokuwa kama mawazo ya baadaye.

---

## Tatizo na Muundo wa Kawaida wa OS

Mfumo wa kawaida wa uendeshaji haujaundwa kwa wanadamu. Umeundwa kwa programu. Binadamu hushughulikiwa kupitia safu ya ufupisho — kiolesura cha picha, kivinjari cha faili, terminal — kinachokaa juu ya sehemu ya chini iliyojengwa kwa michakato, anwani za kumbukumbu, na maelezo ya faili.

Chaguo hili la muundo lina sababu za kihistoria. Dhana zilizozalisha ilifanywa wakati, kompyuta zilikuwa ghali, binadamu walikuwa nafuu, na kikwazo kilikuwa kukokotoa. Lengo sahihi la uboreshaji lilikuwa mashine.

Dhana hizo hazijalishi tena. Kikwazo, kwa watumiaji wengi katika kazi nyingi, si kukokotoa. Ni makini ya binadamu: gharama ya kubadilisha muktadha, ya kutafuta faili sahihi, ya kuunda swali sahihi, ya kukumbuka kitu kilikuwapi. Mashine ni ya haraka. Binadamu ni ya polepole. Kiolesura kinapaswa kuboresha kwa upande wa binadamu wa mzunguko.

Mifumo ya kawaida ya uendeshaji haifanyi hivi. ImeBoreshwa kwa programu, na kazi ya binadamu ni kuzungumza lugha ya programu. Limen inabadilisha hili. Programu zinazungumza lugha ya binadamu. Binadamu yuko katikati ya mzunguko, na mzunguko umeundwa kuoana na binadamu.

---

## Usanifu kwenye Kizingiti

Usanifu wa Limen umepangwa karibu na kanuni moja: **kila mwingiliano ni tukio**, na kila tukio ni fursa ya binadamu kufundisha, kurekebisha, au kuthibitisha. Mfumo hausubiri vikao vya mafunzo waziwazi. Kujifunza ni kwa kuendelea na kwa mazingira.

### Safu ya Tukio: WID

Msingi ni **WID** (mfumo wa Kitambulisho cha Waldiez, uliorekebishwa kwa usanifu wa kwanza wa ndani wa Limen) — mfumo wa kufuatilia tukio unaozingatia uamuzi unaorekodia si tu kilichotokea, bali kilichosababisha, na kilichosababisha kwa mtiririko.

Uandishi wa kawaida unauliza: *nini kilitokea?* WID unauliza: *kwa nini kilitokea, na nini kilifuata?* Kila tukio hubeba uzao wa uamuzi — mnyororo kutoka kitendo cha binadamu kilichosababisha kupitia hali za kati za mfumo hadi matokeo yanayoonekana.

Hii ina umuhimu kwa kujifunza kwa HITL kwa sababu inamaliza **tatizo la ugawaji wa mkopo** katika kiwango cha mwingiliano. Mtumiaji anapoirekebisha tabia ya mfumo, WID inaweza kutambua si tu tokeo la moja kwa moja lililokuwa baya, bali mnyororo wa maamuzi yaliyolizalisha. Marekebisho yanaweza kutumiwa katika kiwango sahihi cha ufupisho: tokeo, sheria ya uamuzi, au ishara ya juu.

Hii ni sawa ya kiwango cha mfumo wa uendeshaji cha kilichoelezwa katika Sura ya 6 kwa RLHF: uwezo wa kufuatilia ishara ya zawadi nyuma kupitia mfululizo wa maamuzi. WID inatoa ufuatiliaji huo kwa asili, kwa kila mwingiliano, bila kuhitaji mtumiaji aelewe.

:::{admonition} Ufuatiliaji wa Tukio la Uamuzi kama Miundombinu ya HITL
:class: note
Muundo wa WID unaakisi kanuni pana: miundombinu ya HITL inapaswa kuifanya iwe rahisi kuuliza "kwa nini mfumo ulifanya hivyo?" — si tu "ulifanya nini?" Bila ufuatiliaji wa uamuzi, marekebisho yanarekebisha dalili. Nayo, yanaweza kurekebisha sababu. Tofauti kati ya kiraka na somo.
:::

### Safu ya Mtazamo: Kwanza ya Sauti

Ingizo kuu la Limen ni sauti, inayosindiikwa kwa ndani kwa kutumia mfumo wa inferensi wa Whisper ONNX. Sababu za chaguo hili zinastahili kuorodheshwa waziwazi:

**Sauti ndiyo njia ya kawaida zaidi ya kutoa habari kwa binadamu wengi.** Haihitaji mafunzo, wepesi wa kimwili zaidi ya usemi wa kawaida, au ujuzi wa mpango wa ndani wa mfumo. Mtumiaji ambaye hawezi kupata faili katika muundo wa saraka anaweza kuelezea wanachotafuta.

**Usindikaji wa ndani hulinda faragha.** Data ya sauti haiacha kifaa. Hii ina umuhimu wa kimaadili — sauti ni data ya biometriki, na ukusanyaji wake kwa kiwango kikubwa na watoa huduma wa wingu ni madhara yaliyoandikwa — na kwa vitendo: uendeshaji nje ya mtandao inamaanisha mfumo unabaki wa kufanya kazi bila muunganiko wa mtandao.

**Sauti huunda mzunguko wa asili wa maoni.** Mfumo unapojibu, majibu ya mtumiaji — kuendelea kuzungumza, kubadilisha maandishi, kusema "hapana, hiyo si sahihi" — ni yenyewe ishara. Limen inazitia majibu haya kama maoni ya HITL: ushahidi kuhusu kama tafsiri ya mfumo ya neno lililotangulia ilikuwa sahihi.

Mnyororo wa kuanguka una umuhimu sawa na hali kuu. Sauti inaposhindwa — katika mazingira yenye kelele, kwa mtumiaji mwenye ulemavu wa usemi, kwa ingizo linalofaidika na usahihi — Limen hushuka kwa neema hadi kiolesura cha kibodi na kisha hadi kiolesura cha maandishi yaliyopangwa. Mtihani wa Bibi (angalia Sura ya 5) si kuzingatiwa kwa ufikiaji baadaye; ni kikwazo cha kiusanifu cha daraja la kwanza.

### Safu ya Akili: Upelekaji wa LLM Wengi

Limen haitegemei mfano mmoja wa lugha. Inapeleka maombi kupitia mti wa uamuzi ulioundwa kulingana na aina ya kazi, muda wa kusubiri unaohitajika, mahitaji ya faragha, na imani:

1. **Mfano mdogo wa ndani** (kwanza daima): wa haraka, wa faragha, hushughulikia kazi za kawaida — "fungua faili nililikuwa nikihariri jana," "weka kengele," "hali ya hewa ni nini"
2. **Mfano mkubwa wa ndani** (imani ya mfano mdogo inapokuwa ndogo): ya polepole lakini yenye uwezo zaidi; hushughulikia ufikiriaji wa muundo, uzalishaji wa msimbo, uchimbaji mgumu
3. **Mfano wa mbali** (ndani inaposhindwa na mtumiaji ametoa ruhusa): mlango wa kutoka; unashughulikiwa kwa uwazi na arifa wazi kwa mtumiaji

Muundo huu si mpya — ni sawa wakati wa inferensi ya mkakati wa maswali wa ujifunzaji tendaji ulioelezwa katika Sura ya 4. Katika kila hatua, mfumo unauliza: je, mfano wangu wa sasa unatosha kujibu swali hili kwa imani inayokubalika? Kama hapana, panda. Kupanda ni gharama (muda wa kusubiri, faragha, kukokotoa); inabebwa tu inapohitajika.

Binadamu yuko katikati ya mzunguko kwenye mpaka wa kupanda. Mtumiaji aliyesanidi Limen isipande kamwe hadi mifano ya mbali amefanya uamuzi wa HITL — mmoja ambao mfumo unaheshimu na unaorekodia. Mtumiaji anayoidhinisha swali la mbali kisha kusema "usiulize tena kwa aina hii ya ombi" ametoa upendeleo unaosasisha sera ya upelekaji.

---

## Muundo wa Mwingiliano

### Haraka

Limen imeundwa kwa haraka kwa maana ambayo Sura ya 5 inabainisha: mtumiaji anahisi athari ya maoni yake. Mtumiaji anapoirekebisha tokeo la mfumo, urekebisho unatumika mara moja na kwa kuonekana. Mfano hauendi mbali na kufunza kwa dakika ishirini. Unasasishwa katika kikao cha sasa hivi.

Hii inahitaji kutumia usanifu wa mifano unaosaidia usasishaji wa ufanisi wa mtandaoni — viambatisho, kurekebisha kiambishi, na uzalishaji ulioongezewa ugunduzi badala ya kurekebisha fini kamili. Maelewano yanabainishwa waziwazi: masasisho ya mtandaoni yana kelele zaidi kuliko mafunzo ya vifurushi. Limen inakubali maelewano haya kwa sababu haraka ndiyo mahitaji ya kwanza: binadamu anaweza daima kuthibitisha, kukataa, au kukuza sasishi.

### Ufahamikaji

Mada inayorudiwa katika fasihi ya IML ni **mahitaji ya ufahamikaji**: binadamu wanaweza tu kuongoza mfano wanaoufahamu, angalau kwa takriban. Limen inaonyesha hili katika kiolesura: mfumo unapofanya uamuzi, unaeleza, kwa ufupi, kwa nini. Si ufuatiliaji wote wa mawazo — hiyo ingemzidishia watumiaji wengi — bali muhtasari wa lugha asilia wa sababu muhimu: "Ninafungua mradi uliofanya kazi nao hivi karibuni zaidi — je, hiyo ni sahihi?"

Maelezo haya pia ni swali. Yanaalikia urekebisho. Yanafanya inferensi ya mfano kuonekana ili mtumiaji aweze kuielekeza tena ikishindwa. Maelezo hayazalishwi kwa sababu za urembo; ni miundombinu ya HITL ya kufanya kazi.

### Uthabiti na Kutelekezea

Tatizo linaloibuka katika mfumo wowote wa mwingiliano wa muda mrefu ni **kutelekezea kwa tabia**: tabia ya mfumo kwa wakati $T+n$ ni tofauti kidogo na tabia yake kwa wakati $T$, kwa njia ambazo mtumiaji wala mfumo havikuchagua waziwazi. Marekebisho yanakusanyika. Hali za mipaka zinaongezeka. Mfano uliolinganiwa na mapendeleo ya mtumiaji mwezi uliopita unaweza kutokulinganiwa tena leo.

Limen inashughulikia hili kupitia ukaguzi wa uthabiti wa mara kwa mara — sawa la mfumo wa uendeshaji wa mbinu ya kuwasilisha tena iliyoelezwa katika Sura ya 13. Mfumo unaweka wazi maamuzi ya kihistoria kwa mtumiaji: "Miaka michache iliyopita, uliniiomba nifanye X. Je, hiyo bado ni unalotaka?" Ukaguzi huu unatoa kazi mbili: wanashika kutelekezea, na wanaakumbusha mtumiaji kuhusu mapendeleo ambayo wanaweza kusahau kubainisha.

---

## Limen kama Mfumo wa HITL

Ukiangalia usanifu wa Limen kupitia lenzi ya kitabu hiki, maamuzi ya muundo yanaoanishwa moja kwa moja na dhana zilizoendelezwa katika kila sehemu.

**Sehemu ya I (Misingi):** Limen inatibu kila mwingiliano kama tukio la mwingiliano kati ya binadamu na mashine. Hakuna "hali ya si-HITL" — mfumo unajifunza daima, unagawanya mkopo daima, unangoja binadamu ashiriki daima.

**Sehemu ya II (Mbinu za Msingi):** Ujifunzaji tendaji unaonyeshwa kama mnyororo wa kupanda unaotegemea imani. ML ya mwingiliano inaonyeshwa katika mzunguko wa kusasisha wa wakati wa sasa hivi. Uwekaji maelezo ni wa picha: kila urekebisho wa mtumiaji ni lebo.

**Sehemu ya III (Kujifunza kutoka kwa Maoni ya Binadamu):** Kujifunza mapendeleo kulikoelezwa katika Sura ya 8 kunaonekana katika masasisho ya sera ya upelekaji. Mtumiaji anapoupendelea jibu la mfano wa ndani kuliko la mbali, upendeleo huo unarekodiwna unajumlisha. RLHF katika OS ya kibinafsi inamaanisha mfano wa zawadi ni wa kibinafsi, wa binafsi, na unasasishwa kwa kuendelea.

**Sehemu ya IV (Matumizi):** Limen ni mazingira ya jumla, lakini muundo wake unaonekana zaidi katika maeneo ambapo hukumu ya binadamu haiwezi kubadilishwa na gharama ya kosa ni kubwa — uandishi wa hati, utangulizi wa kazi, kazi ya ubunifu.

**Sehemu ya V (Mifumo na Mazoezi):** WID ni jukwaa la uwekaji maelezo la Limen. Haionekani kwa mtumiaji katika uendeshaji wa kawaida, inayoonekana inapohitajika kwa utatuzi wa hitilafu au uwazi. Njia za udhibiti wa ubora (ukaguzi wa uthabiti, viwango vya imani, kumbukumbu za kupanda) vinakopwa moja kwa moja kutoka fasihi ya ushirikiano wa umma.

**Sehemu ya VI (Maadili):** Muundo wa kwanza wa ndani, unaohifadhi faragha ni chaguo la kimaadili, si la kiufundi tu. Data ya binadamu haitoki kwenye kifaa chao bila idhini yao waziwazi. Mfano unaojifunza kutoka kwa tabia ya mtumiaji ni mali ya mtumiaji huyo.

---

## Hoja ya Kina

Limen si ushirikishaji wa bidhaa. Ni hoja kwa ujenzi.

Hoja ni hii: ukichukua kanuni za HITL ML kwa uzito — ukiamini kwamba maoni ya binadamu ni ishara ya kueleweka badala ya gharama ya kupunguza, kwamba binadamu yuko daima katikati ya mzunguko hata wabunifu wanapodai vinginevyo, kwamba ulinganifu ni mchakato unaoendelea badala ya tukio moja — basi unamaliza kujenga kitu kinachofanana na Limen.

Si lazima Limen hasa. Seti maalum ya teknolojia (Tauri, Rust, Babylon.js, Whisper ONNX) ni chaguo moja kati ya mengi. Lakini usanifu — ufuatiliaji wa tukio la uamuzi, usindikaji wa kwanza wa ndani, kuanguka kwa neema, kujifunza mapendeleo kwa kuendelea, uwazi kama kipengele cha daraja la kwanza — unafuata kutoka kwa kanuni.

Uwanja wa HITL ML umetumia nguvu kubwa kuonyesha jinsi ya kuweka binadamu katikati ya mzunguko wa mifano maalum na kazi maalum. Swali lijalo ni kama tunaweza kubuni *mazingira* yote karibu na kanuni hizo: mazingira ambapo binadamu yuko daima katikati, mashine yuko daima mjifunzaji, na mzunguko uko daima wazi.

Limen ni jibu moja kwa swali hilo.

Kizingiti si kitu unachokivuka na kukiacha nyuma. Ndiyo unapoishi.

---

```{seealso}
Kanuni za IML zinazosaidia muundo wa mwingiliano wa Limen zimeendelezwa katika Sura ya 5. Mbinu ya kujifunza mapendeleo nyuma ya sera ya upelekaji imerasimishwa katika Sura ya 8. Mfano wa uamuzi wa WID unavyorejelea fasihi ya mgawaji tukio iliyochunguzwa katika Sura ya 14. Mtihani wa Bibi, ulioanzishwa katika Sura ya 5, ni kikwazo kuu cha muundo wa kiolesura cha Limen.
```
