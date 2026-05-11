# Menene Koyon Injin da Dan Adam a Cikin Zagaye?

```{epigraph}
Injin da zai iya koyo daga kwarewa... amma kawai idan ka ba shi kwarewar da ta dace.
-- Fassara daga Alan Turing
```

## Sauye-Sauyen Atomatik

Kowane sabon zagaye na atomatik yana haifar da buƙatu sabon kan kulawar dan adam. Lokacin da kamfanonin jiragen sama suka gabatar da atomatik tuka, direbobi suka zama masu sa ido — ba su da alhakin sarrafa daki da daki amma suna da aikin mafi wahala na sanin *lokacin* da za su ɗauki mulki. Lokacin da kasuwa suka gabatar da biyan kuɗi kai tsaye, sun gano cewa tsarin yana buƙatar kulawar dan adam fiye da masu kudi na gargajiya, ba ƙasa ba. Kuma lokacin da koyon injin ya fara yanke hukunci a sikeli — a likitanci, kuɗi, aiki, da sarrafa abun ciki — ya haifar da buƙatu mai yawa, ci gaba, na hukuncin dan adam.

Wannan shine **sauye-sauyen atomatik** {cite}`bainbridge1983ironies`: da yake tsarin atomatik ya zama mai ƙarfi, sakamakun gazawarsa suna da muhimmanci fiye da kima, kuma saboda haka kulawar ɗan adam mai ƙarfi ta zama dole fiye da kima. Koyon injin ba banda ba ne.

Koyon Injin da Dan Adam a Cikin Zagaye (HITL ML) shine filin da ya ɗauki wannan sauye-sauye da mahimmanci kuma ya gina shi cikin zanen tsarin daga farko. Maimakon ɗaukar shiga dan adam a matsayin gini na wucin gadi da za a ƙarshe a cire, HITL ML yana ɗaukar huldar dan adam da injin a matsayin *fasali* — tushen alama, gyarawa, da jagora wanda zai iya sa samfurin ya yi daidai fiye da kima, ya fi dacewa da ƙimar dan adam, kuma ya fi aminci.

---

## Ma'anar Koyon Injin da Dan Adam a Cikin Zagaye

Babu wata ma'ana guda ɗaya da aka amince da ita na HITL ML, kuma ana amfani da kalmar ta hanyoyi da yawa masu juna cikin wallafe-wallafen. Don wannan littafi muna ɗaukar ma'ana faffadan amma daidai:

:::{admonition} Ma'ana
:class: important

**Koyon Injin da Dan Adam a Cikin Zagaye** yana nufin duk tsarin ML ko hanyar da a cikinta ra'ayin dan adam ake haɗawa cikin tsarin koyo ta hanyar *da gangan, tsari, da kuma ci gaba* — ba kawai a lokacin ƙirƙira bayanan da aka yi lakabi ba, amma a duk lokacin horarwa, kimantawa, da aikawa.

:::

Wannan ma'ana tana da manyan rukunai uku:

**Da gangan.** HITL ba tasiri na dan adam na haɗari ba ne (misali, gaskiyar cewa bayanin horarwa asali dan adam ne ya ƙirƙira shi). Yana nufin tsarin da aka tsara da gangan don neman, haɗawa, da amfana da ra'ayin dan adam.

**Tsari.** Ra'ayin yana da nau'i da aka bayyana — lakabi, gyarawa, hukuncin fifiko, misali — da kuma matsayi da aka bayyana a cikin algorithm ɗin koyo.

**Ci gaba.** Zagayen ra'ayi yana ci gaba akan lokaci, yana ba da damar tsarin ya inganta yayin da ya samu sabbin yanayi, ya yi kuskure, kuma ya karɓi jagoran dan adam.

Wannan ma'ana ta haɗa da tsarin lakabi na gargajiya, koyon aiki, ML mai mu'amala, RLHF, da koyon kwaikwayo. Yana keɓance tarawa ta wucin gadi da koyon supervised na layi guda kawai (ko da yake iyaka ba ta bayyana ba, kamar yadda za mu tattauna a Babi na 2).

---

## Tarihin Gajere

### Tsarin Ƙwararru da Injiniyan Ilimi (1960s–1980s)

Tsarin AI na farko kusan gaba ɗaya dan adam ne cikin zagaye: injiniyoyin ilimi sun zauna tare da ƙwararrun yanki na watanni, suna yin lissafin ƙa'idoji cikin hankali a cikin tsarin ƙwararru kamar MYCIN da DENDRAL. Kowane yanki na ilimi dan adam ne ya bayar da shi a fili. Injin ya kasance mai aiwatarwa; dan adam ya kasance oracle.

Waɗannan tsarin sun yi aiki da kyau sosai a yankuna masu kunkuntar amma sun kasance masu laushi — ba su iya faɗaɗawa bayan ƙa'idodinsu da aka yi da hannu ba kuma sun kasance masu tsada don kulawa.

### Juyin Lissafi (1980s–2000s)

Sauyin zuwa koyon injin na lissafi a cikin 1980s da 1990s ya canza yanayin shiga dan adam. Maimakon yin rubutu na ilimi a matsayin ƙa'idoji, dan adam yanzu yana ba da *misalai* — bayanan da aka yi lakabi waɗanda suke ba da damar samfuri su fitar da salon. Matsayin dan adam ya zama na mai lakabi: yin lakabi ga takardun karatu, alamanta hotuna, rubuta magana.

Wannan babban mataki ne gaba, amma ya haifar da wani ɓangare da ke toshe yanayi sabon: **bayanan da aka yi lakabi suna da tsada**. Masu bincike sun fara tambaya yadda za su samu mafi amfanin amfani da ƙoƙarin lakabi na dan adam. Wannan tambayar ta haifi **koyon aiki**, wanda aka tsara shi a farkon 1990s {cite}`cohn1994improving`.

### Zamanin Koyon Zurfin (2010s–yanzu)

Juyin koyon zurfin ya haifar da sabon tsari: samfurin masu ɓiliyan ɓiliyan na sinadarai waɗanda za su iya koyon ayyuka masu rikitarwa daga bayanai — amma suna buƙatar bayanan da aka yi lakabi mafi girma kwatankwacin su. ImageNet (hoto miliyan 14 da aka yi lakabi) da ayyukan lakabi masu sikeli waɗanda suka zo bayan sun nuna iko da kuma kuɗin sikeli.

A lokaci ɗaya, aikawa ML a sikeli ya fallasa matsaloli sabon: samfurin masu daidai a matsakaici amma ba daidai ba a tsari don ƙungiyoyi musamman, waɗanda suke ƙirƙira gaskiya da amincewar kuskure, waɗanda ke inganta wakilcin aunawa maimakon ƙimar dan adam. Waɗannan gazawar sun ƙarfafa sabon nau'in shiga dan adam: ba kawai lakabi ba, amma *daidaitawa* — aikin sa samfurin ya ɗabi'anta ta hanyoyin da dan adam ke nufin gaske.

Mafi bayyanar bayyanar wannan aikin HITL mai mai da hankali kan daidaitawa shine **Koyon Ƙarfafawa daga Ra'ayin Dan Adam (RLHF)** {cite}`christiano2017deep`, wanda ya zama ginshiƙin tsarin kamar InstructGPT {cite}`ouyang2022training` da iyawar bin umarni na samfurin harshe na zamani.

---

## Me Yasa HITL? Hujjar Hukuncin Dan Adam

Mene ne ya sa hukuncin dan adam yana da ƙima sosai don haɗawa cikin tsarin koyon injin? Siffofi da yawa:

### 1. Hankali na Yau da Kullum da Ilimin Duniya

Dan adam yana kawo ilimin baya mai yawa ga kowane aiki. Lokacin da likitan hoto ya yi wa hoto X lakabi, tana jan abubuwa daga shekarun horo, fahimtar jikin mutum, da ilimin da aka ɓoye game da yadda cututtuka ke kama — ilimi mai wahala wajen ƙayyadewa ko samu daga bayanai kawai.

### 2. Gine-ginen Ma'ana

Lakabin yana da ma'ana domin dan adam yana fahimtar abin da suke nufi. Ajin "cat" a ImageNet yana nufin ra'ayi mai laushi wanda dan adam ke gane shi ta asali amma babu wata ma'anar yau da kullum da ta cika canzawa. Samfurin yana koyon faɗaɗawar lakabi (waɗanne hotuna ake yin mu'amala da shi) amma ba zai iya koyon ra'ayin kansa ba, yana haifar da gazawar a lokuta na iyaka wanda kowane dan adam zai yi da kyau.

### 3. Daidaitan Ƙima

Dan adam yana da fifiko, ƙima, da hukunci na da'a wanda samfurin ML ba za su iya samo daga bayanai kawai ba. Ko rubutu "mai taimako" ko "mai cutarwa" ba tambaya ta kimiyya kawai ba ne — yana dogara akan ƙimar dan adam wanda ke bambanta a cikin mutane daban-daban da mahallin. HITL shine babbar hanyar da za a iya sadar da waɗannan ƙimomi ga tsarin ML.

### 4. Iya Daidaitawa

Hukuncin dan adam zai iya daidaitawa ga sabbin yanayi ba tare da sake horarwa ba. Samfuri da aka horar akan bayanai na tarihi na iya gazawa da tsanaki lokacin da duniya ta canza; dan adam na iya gane sauyi kuma ya amsa da kyau.

### 5. Alhaki

A yankunan masu mahimmanci — likitanci, shari'a, kuɗi — yanke shawara suna buƙatar alhakin ga dan adam. Tsarin HITL yana sa wannan alhaki ya yiwu ta hanyar sanya dan adam a matsayin da zai iya fahimtar, tabbatar da, da ƙetare ɗabi'ar injin.

---

## Zagayen Ra'ayi

Tsarin tsakiyar HITL ML zagaye ne na ra'ayi tsakanin samfuri da ɗaya ko fiye da dan adam:

```text
+---------------------------------------------+
|                                             |
|   Samfuri yana yanke hukunci / roƙo         |
|   ---------------------------------->       |
|                                   Dan Adam  |
|   Dan Adam yana ba da ra'ayi     <-------- |
|   ----------------------------------        |
|                                             |
|   Samfuri yana sabuntawa kan ra'ayi        |
|                                             |
+---------------------------------------------+
```

Yanayin ra'ayi yana bambanta sosai a cikin tsarin HITL:

| Nau'in ra'ayi     | Misali                                      | Tsarin farko          |
|-------------------|---------------------------------------------|------------------------|
| Lakabi aji        | "Wannan imel faci ne"                       | Koyon supervised       |
| Gyarawa           | "Wuri ya kamata ya zama ORG, ba PER ba"     | Koyon aiki / mu'amala  |
| Fifiko            | "Amsar A ta fi ta B"                        | RLHF / jeri            |
| Misali            | Nuna robot yadda za ya kama abu             | Koyon kwaikwayo        |
| Harshen yau da kullum | "Kasance mai taƙaita a amoshin ka"     | Daidaitar umarni       |
| Alama da ɓoye     | Mai amfani ya danna / bai danna ba          | Ra'ayin da ɓoye        |

---

## Abin da HITL Ba Shi Ba

Ya cancanta mu daidaita abin da ke *waje* da ma'anarmu.

**HITL ba daidai yake da aikawa da dan adam a cikin zagaye ba** (wani lokaci ana kiransa "dan adam a saman zagaye"), inda dan adam ke sa ido kan yanke shawara ta atomatik kuma zai iya ƙetare amma ba suna ciyar da gyarawa zuwa horarwa ba. Za mu tattauna wannan bambance a Babi na 2.

**HITL ba ƙaramar kulawa kawai ba ne.** Tsarin lakabi na shirye-shirye kamar Snorkel yana amfani da ayyukan lakabi (galibi ƙa'idoji da dan adam ya rubuta) don ƙirƙira lakabin da ke da ƙura a sikeli. Wannan wata nau'i ce ta shigar dan adam mai tsari, amma ra'ayin ba sake zagaye ba ne ta hanyar da HITL galibi ke nuna shi.

**HITL ba kawai amfani da bayanai da aka yi lakabi ba ne.** Kowane samfuri na koyon supervised yana amfani da bayanai da dan adam ya yi lakabi. HITL yana nufin musamman tsarin inda ra'ayin dan adam shine *wuri mai aiki, sake zagaye* na tsarin koyo.

---

## Tattalin Arzikin Ra'ayin Dan Adam

Ra'ayin dan adam yana da ƙima amma yana da tsada. Lakabi ta hoto na likitanci na iya kashe daga goma zuwa ɗaruruwa dalar Amurka kowace hoto lokacin da ƙwararren ne ya yi, dangane da fanin kuma rikitarwar aikin {cite}`monarch2021human`. Lakabin masu aiki a yanar gizo kamar Amazon Mechanical Turk na iya kashe $0.01–$0.10 kowace item {cite}`hara2018data` a inganci mafi ƙasa. Kalubalen asali na HITL ML shine **yin mafi amfanin kowane naushi na ra'ayin dan adam**.

Wannan yana haifar da tambaya ta haɗawa da ke gudana ta cikin mafi yawan wannan littafi:

:::{admonition} Tambayar Tsakiyar HITL ML
:class: tip

*Da wani tsarin kasafin kuɗi na lokaci da kulawar dan adam, ta yaya za mu yanke shawara abin da za mu tambaye dan adam, lokacin da za mu tambaya, da yadda za mu haɗa amoshin su cikin horarwa ta samfuri?*

:::

Amsar wannan tambayar tana dogara kan yanki, nau'in ra'ayi, kuɗin lakabi, haɗarin kuskure, da halin yanzu na samfuri — shi ya sa HITL ML ilimi mai arziki kuma har yanzu yana haɓaka.

---

## Duba a Kan Littafi

Sauran wannan littafi yana da tsari kamar haka. **Kashi na Biyu** ya ƙunshi ginshiƙai uku na gargajiya na HITL: lakabi, koyon aiki, da ML mai mu'amala. **Kashi na Uku** ya magance tsarin zamani na koyo daga ra'ayi — RLHF, koyon kwaikwayo, da koyon fifiko — waɗanda suka zama tsakiya ga AI na zamani. **Kashi na Hudu** yana duba HITL ta fuskantoki na yanki musamman. **Kashi na Biyar** yana ɗaukar hangen mai aiki akan dandamali, tarin aiki, da kimantawa. **Kashi na Shida** yana magance da'a da yin duba gaba.

```{seealso}
Don duba mai mai da hankali kan mai aiki na filin, duba {cite}`monarch2021human`. Don takarda asali ta koyon aiki da ta fara yawancin magance yau da kullum na HITL, duba {cite}`settles2009active`.
```
