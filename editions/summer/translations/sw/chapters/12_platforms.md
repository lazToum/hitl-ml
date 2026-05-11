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

# Majukwaa na Zana za Uwekaji Maelezo

Jukwaa la uwekaji maelezo ni mazingira ambapo maoni ya binadamu yanakuwa data. Jukwaa zuri huongeza uzalishaji, hupunguza makosa, hudumisha udhibiti wa ubora, na hufanya mfumo wa uwekaji maelezo uweze kusimamiwa kwa kiwango kikubwa. Kuchagua jukwaa sahihi — na kujua wakati wa kujenga dhidi ya kununua — ni uamuzi wenye matokeo makubwa katika mradi wowote wa HITL.

---

## Mazingira ya Jukwaa la Uwekaji Maelezo

Soko la zana za uwekaji maelezo limekua na kukomaa sana katika miaka ya hivi karibuni, likiendeshwa na mahitaji ya biashara ya data ya mafunzo ya ML. Zana zinapanuka kutoka huduma zilizodhibitiwa kikamilifu hadi mifumo ya chanzo wazi inayohifadhiwa na wewe mwenyewe.

### Majukwaa ya Chanzo Wazi

**Label Studio** ni jukwaa maarufu zaidi la uwekaji maelezo la chanzo wazi, linaloungwa mkono na maandishi, picha, sauti, video, na data ya mfululizo wa wakati kupitia usanidi wa kazi unaotegemea XML uliounganishwa. Inaweza kuhifadhiwa na wewe mwenyewe na inaunganisha na njia za nyuma za ML kwa ujifunzaji tendaji. Nguvu muhimu: unyumbufu, msaada wa jumuiya, na uwezo wa kuweka utabiri wa ML wa kawaida kwa uwekaji maelezo wa awali.

**Prodigy** (kutoka kwa waundaji wa spaCy) ni zana ya uwekaji maelezo inayozingatia sana mtiririko wa kazi iliyoundwa kwa kazi za NLP. Muundo wake wa mtiririko unatuma mifano mmoja kwa wakati mmoja na unasaidia ujifunzaji tendaji kutoka kwenye kisanduku. Kiolesura cha uwekaji maelezo ni kidogo lakini cha haraka — kimeundwa kuongeza juu uzalishaji wa uwekaji maelezo. Prodigy ni programu ya malipo lakini inatumika sana katika utafiti wa NLP.

**CVAT (Zana ya Uwekaji Maelezo ya Mwono wa Kompyuta)** ni zana inayoongoza ya chanzo wazi kwa uwekaji maelezo wa CV, yenye msaada imara kwa ugunduzi, ugawanyiko, na uwekaji maelezo wa video. Ilitengenezwa awali kwenye Intel, CVAT inasaidia kanuni za ufuatiliaji, uwekaji maelezo wa mifupa, na muunganiko wa kanuni za wahusika wengine.

**Doccano** inalenga kazi za uwekaji lebo wa mfululizo (NER, uchimbaji wa uhusiano, uainishaji wa maandishi). Kiolesura chake rahisi cha wavuti kinakifanya kiweze kufikiwa na timu bila rasilimali za uhandisi wa data zilizowekwa.

### Majukwaa ya Kibiashara

**Scale AI** inatoa huduma za uwekaji maelezo zilizodhibitiwa kutoka mwisho hadi mwisho: nguvu kazi ya binadamu, usimamizi wa ubora, na muunganiko wa API. Yenye nguvu sana kwa uendeshaji wa uhuru, roboti, na uwekaji maelezo wa 3D mgumu. Bei inategemea ugumu wa kazi na sauti.

**Labelbox** ni jukwaa kamili la utunzaji wa data, uwekaji maelezo, na uwekaji lebo unaosaidiwa na ML. Vipengele imara vya biashara: usimamizi wa mradi, mtiririko wa ubora, mzunguko wa maoni wa mfano, na muunganiko na majukwaa makubwa ya ML (SageMaker, Vertex AI, Azure ML).

**Appen** (awali Figure Eight / CrowdFlower) inafanya kazi na nguvu kazi kubwa ya uwekaji maelezo ya kimataifa pamoja na zana. Chaguo zuri wakati sauti na usimamizi wa nguvu kazi ndio wasiwasi mkuu.

**Surge AI** inazingatia wawekaji maelezo wataalamu na ni imara kwa kazi zinazohitaji maarifa ya uwanja au hukumu ya kina.

**Humanloop** inabobea katika ukusanyaji wa maoni ya LLM — uwekaji maelezo wa mapendeleo, ukusanyaji wa data ya RLHF, na tathmini ya mfano.

---

## Ulinganisho wa Kipengele cha Jukwaa la Uwekaji Maelezo

| Kipengele | Label Studio | Prodigy | CVAT | Labelbox | Scale AI |
|---|---|---|---|---|---|
| Leseni | Chanzo wazi | Kibiashara | Chanzo wazi | Kibiashara | Kibiashara |
| Mwenyeji | Mwenyewe / wingu | Mwenyewe | Mwenyewe / wingu | Wingu | Iliyodhibitiwa |
| Uwekaji maelezo wa maandishi | ✓ | ✓ | — | ✓ | ✓ |
| Uwekaji maelezo wa picha | ✓ | Kidogo | ✓ | ✓ | ✓ |
| Uwekaji maelezo wa video | ✓ | — | ✓ | ✓ | ✓ |
| Muunganiko wa ujifunzaji tendaji | ✓ | ✓ | Kidogo | ✓ | ✓ |
| Uwekaji maelezo wa awali unaosaidiwa na ML | ✓ | ✓ | ✓ | ✓ | ✓ |
| Mtiririko wa udhibiti wa ubora | Msingi | Msingi | Msingi | Ya juu | Ya juu |
| Ufikiaji wa API / Programu | ✓ | ✓ | ✓ | ✓ | ✓ |
| Usimamizi wa nguvu kazi | — | — | — | Kidogo | ✓ |

---

## Uwekaji Maelezo kama Msimbo

Kipengele muhimu lakini mara nyingi kisichoshughulikiwa cha miundombinu ya uwekaji maelezo ni **udhibiti wa toleo kwa maelezo na mipango ya uwekaji maelezo**. Kutibu uwekaji maelezo kama msimbo kunamaanisha:

**Muundo wa kwanza wa mpango.** Uainishaji wa lebo na sheria za uwekaji maelezo vinafafanuliwa katika faili ya usanidi yenye toleo (YAML au JSON) kabla uwekaji maelezo haukuanza. Mabadiliko ya mpango huunda toleo jipya.

**Uwekaji toleo wa maelezo.** Maelezo huhifadhiwa na kiungo cha toleo la mpango ambalo yalikuundwa chini yake. Hii inaruhusu ukaguzi, kurudisha nyuma, na kulinganisha maelezo kati ya matoleo ya mpango.

**Mifumo inayoweza kurudiwa.** Mfumo wa uwekaji maelezo — kutoka data ghafi hadi lebo tayari za mafunzo — unapaswa kuweza kurudiwa kutoka kwa msimbo. Mifano ya uwekaji maelezo wa awali, vichujio vya ubora, mantiki ya ujumuishaji, na mgawanyiko wa data vyote vinapaswa kuandikwa.

```yaml
# Example: Label Studio annotation schema (text classification)
label_config: |
  <View>
    <Text name="text" value="$text"/>
    <Choices name="sentiment" toName="text" choice="single">
      <Choice value="positive"/>
      <Choice value="negative"/>
      <Choice value="neutral"/>
      <Choice value="mixed"/>
    </Choices>
  </View>
schema_version: "2.1.0"
task_type: text_classification
guidelines_version: "guidelines_v3.pdf"
```

```text
Chanzo cha data
    |
    v
Bwawa lisilo na lebo --> Jukwaa la uwekaji maelezo --> Mkusanyiko wenye lebo
    ^                           |                              |
    |                           | (unaosaidiwa na ML)          v
Ujifunzaji tendaji <-----------+                       Mwendo wa mafunzo
wa mkakati wa maswali                                          |
    ^                                                          v
    +------------- Mfano uliofunzwa <------------------ Tathmini
                                                               |
                                                         Utekelezaji na
                                                         ufuatiliaji
```

Pointi kuu za muunganiko:
1. **Ulaji wa data:** Data isiyowekewa lebo inatiririka kiotomatiki kutoka ghala la data hadi jukwaa la uwekaji maelezo
2. **Uwasilishaji wa mfano:** Mfano bora wa sasa unatekelezwa kwenye jukwaa la uwekaji maelezo kwa uwekaji maelezo wa awali na alama za ujifunzaji tendaji
3. **Usafirishaji:** Maelezo yaliyokamilika husafirishwa katika umbizo linalooana na mfumo wa mafunzo (COCO JSON, mkusanyiko wa data wa Hugging Face, n.k.)
4. **Mzunguko wa maoni:** Makosa ya mfano wa uzalishaji yanaelekezwa nyuma kwenye jukwaa la uwekaji maelezo kwa marekebisho

```{seealso}
Kwa nyaraka za Label Studio na muunganiko wa ujifunzaji tendaji: https://labelstud.io. Kwa Prodigy: https://prodi.gy. CVAT: https://cvat.ai. Kwa ulinganisho wa kina wa zana za uwekaji maelezo, angalia {cite}`monarch2021human`, Sura ya 7.
```
