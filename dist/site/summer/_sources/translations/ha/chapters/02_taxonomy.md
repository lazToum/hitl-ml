# Rarrabuwa ta Huldar Dan Adam da Injin

Faɗi kalmomin yau da kullum shine sharaɗi don tunani mai bayyana. Ana amfani da kalmar "dan adam a cikin zagaye" cikin sassauci a aiki — wani lokaci yana nufin dan adam yana yin lakabi akan bayanan horarwa, wani lokaci cewa dan adam zai iya ƙetare yanke shawarar samfuri, kuma wani lokaci cewa dan adam yana kula da tsarin koyo a lokaci na gaske. Waɗannan abubuwa ne masu mahimmanci daban-daban.

Wannan babi yana zana shimfidar huldar dan adam da injin a ML, yana ba da kalmomi na ra'ayi da ake amfani da su a sauran littafi.

---

## Matakin Atomatik

Mafi mahimmancin bambance shine yadda dan adam ke shiga cikin yanke shawarar tsarin sosai. Tsarin da aka sani daga ka'idar atomatik {cite}`sheridan1992telerobotics` yana bambance matakai goma, amma don manufofin ML rukunai uku suna kama canjin muhimmanci:

### Dan Adam a Cikin Zagaye (HITL)

Dan adam shine *mai shiga aiki a cikin tsarin koyo*. Yanke shawara — ko a ƙalla, yanke shawara masu muhimmanci — yana buƙatar shigar dan adam kafin a ƙarshe su. Tsarin ba zai iya aiki ba tare da shiga dan adam da ke ci gaba.

*Misalai:* Tsarin koyon aiki da ke tambaya likita kafin ƙara wani yanayi zuwa bayanin horarwa. Mai lakabi da ke yin lakabi misalai waɗanda nan da nan ake amfani da su don sabunta samfuri. Mai sanya wa lakabi RLHF da ke kwatanta sakamakon samfuri.

### Dan Adam a Saman Zagaye (HOTL)

Tsarin yana aiki ta atomatik amma dan adam yana sa ido kuma zai iya shiga tsakani. Dan adam shine *mai sa ido*, ba mai shiga ba. Ra'ayi na iya ko ba zai iya koma cikin horarwa ba.

*Misalai:* Tsarin sarrafa abun ciki da ke yin alamar rubutu ta atomatik; mai duba dan adam yana bitar ɓangare kuma yana gyara yanke shawara. Atomatik tuka da ke tuka jirgin amma yana faɗakar da matukin jirgi game da sabon abu.

### Dan Adam a Ciki Umarni (HIC)

Dan adam yana yanke duk shawarwari; tsarin yana ba da *shawarwari ko bayanai* amma ba shi da atomatik. Wannan mafi rauni ne na aikawa ML.

*Misalai:* Tsarin tallafi na ganewar cutar da ke nuna wa likita ƙiyadar iya yiwuwar samfuri amma yana barin yanke hukuncin ƙarshe gaba ɗaya ga likita.

```{admonition} Wane matakin ya dace?
:class: tip

Matakin atomatik da ya dace yana dogara akan kuɗin kurakurai, amincin samfuri, ƙwarewar dan adam da yake samuwa, da ƙuntatawa na latency na aiki. Waɗannan abubuwa suna canzawa yayin da samfuri ya nuna — mafi yawan tsarin suna fara HITL kuma suna ƙaura zuwa HOTL yayin da amincewar ke ƙaruwa.
```

```text
Bayanai mentah --> Sarrafa --> Fasali --> Horarwa --> Kimantawa --> Aikawa
    ^                ^                      ^              ^              ^
    |                |                      |              |              |
 Tattara       Lakabi                   Koyon           Gwaji        Sa ido
 ra'ayi        & sanya                  aiki            ra'ayi       & gyarawa
               lakabi
```

| Matakin        | Matsayin dan adam                                     | Babi   |
|----------------|-------------------------------------------------------|--------|
| Tattara        | Yanke shawara abin da za a tattara; tsarin samfuri    | 3, 4   |
| Lakabi         | Bayar da lakabin, tsari, metadata                     | 3, 13  |
| Horarwa        | Tambayoyin koyon aiki; ra'ayin yanar gizo             | 4, 5, 6|
| Kimantawa      | Kimantawar dan adam na sakamakon samfuri              | 14     |
| Aikawa         | Sa ido, sarrafa keɓantawa, gyarawa                    | 12, 14 |

---

## Shiga Mai Aiki da Wanda Ba Na Aiki Ba

A cikin HITL *mai aiki*, tsarin yana zaɓar waɗanne bayanai za a gabatar ga dan adam — yana tambaya da dabarun lissafi. A cikin HITL *wanda ba na aiki ba*, dan adam yana ba da ra'ayi akan duk bayanai da suka isa (misali, jerin lakabi da aka sanya jeri jeri).

Shiga mai aiki yana da inganci fiye da kima saboda ra'ayin yana gudana inda zai fi inganta samfuri. Shiga wanda ba na aiki ba yana da sauƙi don aiwatarwa da sarrafa.

Bambance na alaƙa shine tsakanin ra'ayi **jeri** da **yanar gizo**:

- **Jeri:** Dan adam yana yin lakabi ga babban rukunin misalai; samfuri yana sake horarwa. Maimaita.
- **Yanar gizo (cigaban yanayi):** Ra'ayin dan adam yana isa cikin ci gaba; samfuri yana sabunta a hankali.

Aikin jeri shine al'ada a masana'anta (ayyukan lakabi da aka biyo bayan gudu na horarwa). Aikin yanar gizo ya fi yanayi ga tsarin mai mu'amala da yanayin koyon ƙarfafawa.

---

## Mai Sanya Lakabi ɗaya da Masu Yawa

Yawancin gabatarwa na yau da kullum na HITL suna ɗauka mai sanya lakabi ɗaya, mai daidaito. A aiki, lakabi yana haɗar da mutane da yawa, kuma hukumcin su yana bambanta.

**Haɗawa** yana haɗa lakabi da yawa cikin lakabi ɗaya, galibi ta zaɓin rinjaye ko tsarin lissafi (Babi na 13).

**Rashin jituwa a matsayin alama** — wasu masu bincike suna jayayya cewa rashin jituwa na masu sanya lakabi bayanai ne masu ƙima waɗanda ba za a runtuma zuwa lakabi ɗaya na "zinariya" ba. Hanyoyin da ke la'akari da hangen nesa ga NLP, misali, suna kiyaye lakabi da yawa a matsayin lakabin laushi waɗanda ke nuna rikitarwan gaskiya na bayanai {cite}`uma2021learning`.

---

## Tsarin Haɗe

Za mu iya wakilta duk tsarin HITL da biyar-biyar:

$$
\text{HITL config} = (\text{level}, \text{modality}, \text{stage}, \text{frequency}, \text{annotators})
$$

inda:

- **matakin** $\in$ {HITL, HOTL, HIC}
- **yanayi** $\in$ {lakabi, gyarawa, misali, fifiko, NL, da ɓoye}
- **matakin aiki** $\in$ {tattara, lakabi, horarwa, kimantawa, aikawa}
- **yawan lokaci** $\in$ {jeri, yanar gizo}
- **masu sanya lakabi** $\in \mathbb{N}^+$ (yawan masu sanya lakabi kowace item)

Wannan rarrabuwa tana ba mu damar kwatanta tsarin HITL iri-iri kan axes ɗaya kuma tunani game da musayar tsakanin su. Sauran littafi yana huda zuwa sel musamman na wannan sararin.

```{seealso}
Don bincike na yadda yanke shawara na lakabi ke shafar ɗabi'ar samfuri a ƙasa, duba {cite}`bender2021stochastic`. Don bita na tsarin ML mai mu'amala, duba {cite}`amershi2014power`.
```
