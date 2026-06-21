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

# Limen: Dan Adam a Cikin Zagaye na Komai

:::{admonition} Bayani game da wannan babi
:class: important
Wannan babi **rubutun zane na tunanin zuciya** ne, ba bincike na gwaji ko gudummawa da aka duba ta takwarorina ba. Yana bayyana tsarin gine-ginen da ake tunanin sa — Limen, tsarin aiki na kwamfuta na muryar farko mai AI-gida — a matsayin misali na aiki na yadda ka'idojin HITL daga babi da suka gabace su na iya haɗuwa zuwa cikakken tsari. Da'awojin a nan hujjoji ne na zane, ba sakamakon gwaji ba. Ya kamata a karanta su a matsayin hujjoji na zane mai ƙarfafawa, ba kamar bincike na injiniyan da aka tabbatar ba.
:::

Kowane babi a cikin wannan littafi ya bayyana HITL ML a matsayin falsafar zane: saitin ka'idoji don mai da shiga dan adam cikin tsarin koyo da gangan, mai inganci, da gaskiya. Wannan babi yana bayyana yadda yake kallonsa don amfani da wannan falsafar a matsayin ƙa'ida ta farko — ba ga tsari ɗaya ba, amma ga dukkan yanayin aiki.

**Limen** tsarin aiki na kwamfuta na muryar farko, AI-gida ne wanda aka gina akan ra'ayi cewa dan adam koyaushe yana cikin zagaye, ba a matsayin ƙuntatawa da za a inganta ta waje ba, amma a matsayin ƙa'ida ta tsara da kowane tsarin yake tsarawa. An zaɓi sunan da gangan: *limen* Kalmar Latinanci ce don ƙofar. A cikin ilimin halayyar dan adam na fahimta, limen ita ce iyaka tsakanin abin da ake fahimta da abin da ba a fahimta ba. Don tsarin aiki, limen iyaka ce tsakanin nufin dan adam da aiki na injin.

Gine-ginen da aka bayyana a nan ba na mallakin kowa ba ne. Saitin yanke shawara ne na zane, kowanensu yana biyo baya ta halitta daga ka'idojin HITL da aka haɓaka a cikin babi da suka gabace su. Manufar ba ta rubuta kayan aiki ba amma nuna yadda waɗannan ka'idoji suke haɗuwa — yadda suke ƙarfafa juna lokacin da aka yi amfani da su yadda ya kamata, da waɗanne nau'in tsarin suke yiwuwa lokacin da dan adam ba ya zama ɓangare da yake zuwa.

---

## Matsalar da ke tare da Tsarin Aiki na Gargajiya

Tsarin aiki na gargajiya ba an tsara shi don dan adam ba. An tsara shi don shirye-shirye. Dan adam ana tsare shi ta hanyar karin abstraction — mai amfani da hoton hoto, mai bincike na fayil, wata terminal — wanda yake zaune a saman daidai da aka gina don tsari, adireshi na ƙwaƙwalwar ajiya, da masu bayyana fayil.

Wannan zaɓin zane yana da hujja ta tarihi. Lokacin da aka yi ɗauki waɗanda suka samar da shi, kwamfutoci suna da tsada, dan adam yana da arha, kuma ƙoshewa ita ce ƙididdiga. Abin ingantawa daidai shine injin.

Waɗannan ɗauki ba sa ɗauke da ƙarfi. Ƙoshewa, don mafi yawan masu amfani a cikin mafi yawan ayyuka, ba ƙididdiga ba ne. Kulawar dan adam ne: kuɗin canza mahallin, neman fayil daidai, gina tambayar daidai, tunawa inda wani abu yake. Injin yana da sauri. Dan adam yana da jinkiri. Haɗin gwiwa ya kamata ya inganta gefen dan adam na zagaye.

Tsarin aiki na gargajiya ba ya yi wannan. An inganta su don shirye-shirye, kuma aikin dan adam shine magana da harshen shirye-shirye. Limen yana juya wannan. Shirye-shiryen suna magana da harshen dan adam. Dan adam yana cikin zagaye, kuma zagaye an tsara shi don dacewa da dan adam.

---

## Gine-ginen a Ƙofar

Gine-ginen Limen an tsara shi a kusa da ƙa'ida ɗaya: **kowane mu'amala al'amari ne**, kuma kowane al'amari damar ne don dan adam ya koyar, gyara, ko tabbatar. Tsarin ba ya jira zaman horarwa a fili. Koyo na ci gaba kuma yana kewaye da yanayi.

### Layer na Al'amari: WID

A ginshiƙi shine **WID** (tsarin Waldiez ID, an daidaita shi don gine-ginen gida-farko na Limen) — tsarin bin sahun al'amarin da ya sani game da dalili wanda ke yin rikodin ba kawai abin da ya faru ba, amma abin da ya haifar da shi, da abin da ya haifar da hakan.

Shiga gargajiya na tambaya: *abin da ya faru?* WID yana tambaya: *dalilin da ya sa ya faru, kuma abin da ya biyo baya?* Kowane al'amari yana ɗaukar tarihin dalili — sarkar daga aikin dan adam na ƙarfafawa ta hanyar yanayin tsari na tsakiya zuwa sakamakon da aka ga.

Wannan yana da muhimmanci don koyon HITL saboda yana warware **matsalar bashi ta alhaki** a matakin mu'amala. Lokacin da mai amfani ya gyara ɗabi'ar tsarin, WID na iya gano ba kawai sakamakon kai tsaye da ya kasance kuskure ba, amma sarkar yanke shawara waɗanda ya samar da shi. Za a iya amfani da gyarawa a matakin abstraction daidai: sakamakon, ƙa'idar yanke shawara, ko alaman sama.

Wannan daidai-tsarin aiki ne na abin da Babi na 6 ke bayyanawa don RLHF: damar bin alaman lada ta hanyar jerin yanke shawara. WID yana ba da wannan bin sahun ta asali, don kowane mu'amala, ba tare da buƙatar mai amfani ya fahimta ba.

:::{admonition} Bin Sahun Al'amari na Dalili a matsayin Ababen More Rayuwa na HITL
:class: note
Zanen WID yana nuna ƙa'ida mafi faffada: ababen more rayuwa na HITL ya kamata ya sauƙaƙa tambayar "dalilin da ya sa tsarin ya yi wancan?" — ba kawai "abin da ya yi?" Tare da bin sahun dalili, gyarawa suna gyara alamomin. Tare da shi, suna iya gyara dalilin. Bambanci tsakanin gyarawa da darasi.
:::

### Layer na Fahimta: Murya-Farko

Yanayin shigarwa na farko na Limen murya ne, ana sarrafa shi a gida ta amfani da tsarin inference na Whisper ONNX. Dalilin wannan zaɓin yana cancanta a bayyanawa a fili:

**Murya ita ce mafi yawan hanyar samar da bayanai na dan adam don mafi yawan mutane.** Ba ta buƙatar horo, ba ta buƙatar dacewa na jiki fiye da magana ta yau da kullum, kuma ba ta buƙatar ilimin tsarin tsarin ciki na tsarin. Mai amfani da ba zai iya gano fayil a cikin tsarin folderin ba zai iya bayyana abin da yake nema.

**Sarrafa a gida yana kiyaye asirin sirri.** Bayanai na murya ba sa barin na'ura. Wannan yana da muhimmanci ta da'a — murya bayanai ne na halittun mutum, kuma tattarawa a sikeli ta masu ba da ayyuka girgije wata cutar da aka rubuta take — kuma ta aiki: aikin layi ɗaya yana nufin tsarin yana ci gaba ba tare da haɗin yanar gizo ba.

**Murya yana ƙirƙira zagayen ra'ayi na halitta.** Lokacin da tsarin ya amsa, amsar mai amfani — ci gaba da magana, sake fasali, cewa "a'a, ba daidai ba ne" — ita kanta alama ce. Limen yana ɗaukar waɗannan amsa a matsayin ra'ayin HITL: shaidar ko fassarar tsarin ta fitar da magana ta baya ta kasance daidai.

Sarkar koma gida yana da muhimmanci kamar yanayin farko. Lokacin da murya ta gaza — a cikin yanayi mai hayaniya, don mai amfani mai nakasassar magana, don shigarwa da ke cin amfana daga daidaito — Limen yana ragewa mai kyau zuwa haɗin maɓalli kuma sannan zuwa haɗin rubutu mai tsari. Jarabawar Kaka (duba Babi na 5) ba ɓangare na isa ba ne; ita ƙuntatawa ta gine-ginen ta farko ne.

### Layer na Hankali: Jagorancin LLM Da Yawa

Limen ba ya dogara kan samfuri na harshe ɗaya. Yana jagorantar buƙatu ta hanyar bishiyar yanke shawara mai tsari bisa nau'in aiki, latency da ake buƙata, buƙatun asirin sirri, da amincewar:

1. **Ƙaramin samfuri a gida** (koyaushe na farko): sauri, sirri, yana sarrafa ayyuka na yau da kullum — "buɗe fayil da nake gyarawa jiya," "saita ƙidayar lokaci," "yaya yanayin"
2. **Babban samfuri a gida** (lokacin da amincewar samfurin ƙarami ta kasance ƙarami): ya fi jinkiri amma mai ƙarfi fiye da kima; yana sarrafa tunani mai tsari, ƙirƙira lambar shirye-shirye, neman mai rikitarwa
3. **Samfurin nesa** (lokacin da gida ya gaza kuma mai amfani ya ba da izini): ƙofar koma; ana sarrafa shi ta bayyane tare da sanarwa ta mai amfani a fili

Wannan tsari ba sabon abu ba ne — shi daidai ne na inference na darajin koyon aiki wanda aka bayyana a Babi na 4. A kowane mataki, tsarin yana tambaya: shin samfurina na yanzu ya isa don amsa wannan tambayar da amincewar da za a iya yarda? Idan a'a, ƙara. Ƙaruwar kuɗi ce (latency, sirri, ƙididdiga); ana ɗaukarta kawai idan dole ne.

Dan adam yana cikin zagaye a iyakar ƙaruwa. Mai amfani da ya tsara Limen don kada ya taɓa ƙara ga samfurin nesa ya yanke shawara na HITL — ɗaya wanda tsarin ke mutuntawa da kuma rubuta shi. Mai amfani da ya amince da tambayar nesa kuma ya ce "kada ka tambayeni kuma don wannan nau'in buƙata" ya ba da fifiko wanda ke sabuntar manufar jagorancin.

---

## Zanen Hulda

### Nan da Nan

Limen an tsara shi don nan da nan a ma'anar da Babi na 5 ke bayyanawa: mai amfani yana ganin tasirin ra'ayinsu. Lokacin da mai amfani ya gyara sakamakon tsarin, gyarawa tana aiki nan da nan kuma yana bayyana. Samfuri ba ya tafi kuma ya horar da mintuna ashirin. Yana sabuntawa a cikin zaman yanzu.

Wannan yana buƙatar amfani da tsarin samfuri waɗanda ke tallafa wa sabuntawa mai inganci yanar gizo — adapters, daidaita prefix, da ƙirƙira mai karin albarkatu maimakon daidaita cikakke. Musayar yana bayyananne: sabuntawa yanar gizo suna da hayaniya fiye da horarwa ta jeri. Limen yana yarda da wannan musayar saboda nan da nan ita ita buƙata ta farko: dan adam koyaushe zai iya tabbatarwa, ƙi, ko gyara sabuntawa.

### Fahimtar Bayyane

Jigo mai sake dawowa a cikin wallafe-wallafen IML shine **buƙatar fahimtar**: dan adam kawai zai iya kula da samfuri da suke fahimta, a ƙalla kusan kusan. Limen yana fito da wannan a cikin haɗin gwiwa: lokacin da tsarin ya yanke shawara, yana bayyanawa, a taƙaice, dalilin. Ba cikakkiyar hanyar tunani ba — waccan za ta mamaye mafi yawan masu amfani — amma takaitawar harshen yau da kullum na muhimmin dalili: "Ina buɗewa aiki da ka yi aikin fiye da kima a kan kwanan nan — shin haka ne?"

Wannan bayanin kuma tambaya ne. Yana gayyatar gyarawa. Yana mai da fassarar samfuri ta bayyane don mai amfani ya iya jagorantar ta idan ba daidai ba. Bayanin ba saboda dalili na kyakkyawan zane ba ne; ababen more rayuwa ne na aiki na HITL.

### Daidaito da Karkacewa

Matsala da ke tasowa a kowane tsari mai mu'amala mai dogon lokaci shine **karkacewar ɗabi'a**: ɗabi'ar tsarin a lokaci $T+n$ ta bambanta kaɗan daga ɗabi'arsa a lokaci $T$, ta hanyoyin da babu mai amfani ko tsarin da ya zaɓa a fili. Gyarawa suna tara. Lokuta na iyaka suna haɗawa. Samfuri da ya daidaita ga fifikon mai amfani watan da ya wuce na iya ba daidaita a yau.

Limen yana magance wannan ta duba daidaito na yau da kullum — daidai-tsarin aiki na dabarun sake gabatarwa da aka bayyana a Babi na 13. Tsarin yana fito da yanke shawara na tarihi ga mai amfani: "Makonni kaɗan da suka wuce, ka roƙe ni in yi X. Shin haka ne har yanzu abin da za ka so?" Waɗannan duba suna zama ayyuka biyu: suna kama karkacewa, kuma suna tunatar da mai amfani game da fifiko waɗanda suka taɓa sanya su amma sun manta.

---

## Limen a matsayin Tsarin HITL

Kallon gine-ginen Limen ta maɓallan wannan littafi, yanke shawara na zane yana kai tsaye zuwa ra'ayoyin da aka haɓaka a kowane ɓangare.

**Kashi na Farko (Ginshiƙai):** Limen yana ɗaukar kowane mu'amala a matsayin al'amari na hulda dan adam da injin. Babu "yanayi mara HITL" — tsarin koyaushe yana koyo, koyaushe yana ba da alhaki, koyaushe yana jira dan adam ya shiga.

**Kashi na Biyu (Dabarun Asali):** Koyon aiki yana bayyana a matsayin sarkar ƙaruwa bisa amincewar. ML mai mu'amala yana bayyana a cikin zagayen sabuntawa na lokaci na gaske. Lakabi yana da ɓoye: kowane gyarawa da mai amfani ya yi lakabi ne.

**Kashi na Uku (Koyo daga Ra'ayin Dan Adam):** Koyon fifiko da aka bayyana a Babi na 8 yana bayyana a cikin sabuntawa na manufa ta jagorancin. Lokacin da mai amfani ya fi son amsar samfuri na gida zuwa na nesa, wannan fifiko yana rikodin kuma yana faɗaɗa. RLHF a tsarin aiki na sirri yana nufin samfurin lada yana zaman sirri, na mutum, kuma ana sabuntar da shi cikin ci gaba.

**Kashi na Hudu (Aikace-aikace):** Limen yanayi ne na gaba ɗaya, amma zanensa yana bayyana sosai a yankuna inda hukunci na dan adam ba ya maye da shi kuma kuɗin kuskure yana da girma — tsara takarda, fifita aiki, aikin ƙirƙira.

**Kashi na Biyar (Tsarin Aiki da Aiwatarwa):** WID ita ce dandamali na lakabi na Limen. Yana da ɓoye ga mai amfani a aiki na yau da kullum, yana bayyana lokacin da ake buƙata don gyarawa ko bayyananci. Hanyoyin sarrafa inganci (duba daidaito, iyakar amincewar, akwatin tarihin ƙaruwa) an aro su kai tsaye daga wallafe-wallafen tarin aiki.

**Kashi na Shida (Da'a):** Zanen gida-farko, mai kiyaye asirin sirri yanke shawara ne na da'a, ba ta fasaha kawai ba. Bayanin mai amfani ba ya barin na'urarsu ba tare da izinin su a fili ba. Samfurin da ke koyo daga ɗabi'ar mai amfani yana cikin mallakar mai amfani.

---

## Muhimmin Batu

Limen ba gangamin kayan aiki ba ne. Hujja ta gine-ginen ne.

Hujja ita ce: idan ka ɗauki ka'idojin HITL ML da mahimmanci — idan ka yi imani cewa ra'ayin dan adam alama ce da za a fahimta maimakon kuɗin da za a rage, cewa dan adam koyaushe yana cikin zagaye ko da masu zane sun yi kare in ba haka ba, cewa daidaitawa tsari ne mai ci gaba maimakon al'amari ɗaya — to za ka ƙarshe gina wani abu da ya kama Limen.

Ba lallai Limen ne musamman ba. Tsarin fasaha musamman (Tauri, Rust, Babylon.js, Whisper ONNX) zaɓi ɗaya ne tsakanin da yawa. Amma gine-ginen — bin sahun al'amari na dalili, sarrafa gida-farko, ragewa mai kyau, koyon fifiko na ci gaba, bayyananci a matsayin fasali na farko — yana biyo baya daga ka'idojin.

Filin HITL ML ya kashe ƙoƙari mai yawa yana bayyana yadda za a sanya dan adam cikin zagaye na musamman na samfurin da musamman na ayyuka. Tambayar gaba ita ce ko za mu iya tsara gaba ɗaya *yanayi* a kusa da ka'idoji ɗaya: yanayi inda dan adam koyaushe shine cibiya, injin koyaushe shine mai koyo, kuma zagaye koyaushe yana buɗe.

Limen ɗaya amsa ce ga wannan tambaya.

Ƙofar ba wani abu ba ne da kake haye kuma bari baya. Inda kake zaune.

---

```{seealso}
Ka'idojin IML da ke ƙarƙashin zanen hulda na Limen an haɓaka su a Babi na 5. Hanyar koyon fifiko da ke bayan manufar jagorancin an tsara shi a Babi na 8. Tsarin dalili na WID yana zana daga wallafe-wallafen ba da alhaki na al'amari da aka duba a Babi na 14. Jarabawar Kaka, da aka gabatar a Babi na 5, ita ce ƙuntatawa na zane na farko na haɗin gwiwa na Limen.
```
