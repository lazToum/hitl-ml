# Dandamali da Kayan Aikin Lakabi

Dandamali na lakabi shine yanayin inda ra'ayin dan adam ke zama bayanai. Dandamali mai kyau yana ƙara gudu, yana rage kurakurai, yana kiyaye sarrafa inganci, kuma yana sa tsarin lakabi mai sarrafa a sikeli. Zaɓar dandamali da ya dace — kuma sanin lokacin da za a gina da lokacin da za a saya — yanke shawara mai muhimmanci ne a kowane aikin HITL.

---

## Shimfidar Dandamali na Lakabi

Kasuwar kayan aikin lakabi ta girma sosai a cikin 'yan shekarun nan, tana jawo ta buƙatar kamfanoni don bayanan horarwa na ML. Kayan aiki suna faɗaɗawa daga ayyuka masu sarrafa gaba ɗaya zuwa tsarin buɗaɗɗen tushe na masaukin kai.

### Dandamali Buɗaɗɗen Tushe

**Label Studio** shine mafi shahararren dandamali na lakabi buɗaɗɗen tushe, yana tallafa wa lakabi na rubutu, hotuna, sauti, bidiyo, da bayanai na jeri ta amfani da tsarin tsari na XML mai haɗin gwiwa. Za a iya masaukin kai kuma yana haɗa da kwangarai na ML don koyon aiki. Ƙarfin muhimmanci: sassauci, tallafin al'umma, da damar saka hasashen ML na gani don pre-annotation.

**Prodigy** (daga masu ƙirƙira spaCy) kayan aikin lakabi mai mai da hankali kan aikin ne wanda aka tsara don ayyukan NLP. Tsarinsa na cigaban bayanai yana aika misalai ɗaya ɗaya kuma yana tallafa wa koyon aiki daga akwatin. Mai amfani da lakabi yana da ƙasa amma yana da sauri — an tsara shi don yin mafi yawan gudu na lakabi. Prodigy software ne mai biyan kuɗi amma ana amfani da shi sosai a binciken NLP.

**CVAT (Kayan Aikin Lakabi na Gane Hoto ta Kwamfuta)** shine kayan aikin buɗaɗɗen tushe na farko don lakabi na CV, tare da tallafi mai ƙarfi don gano, rarrabuwa, da lakabi na bidiyo. Asali an haɓaka shi a Intel, CVAT yana tallafa wa algorithms na bin sawu, lakabi na tsarin kashi, da haɗe-haɗen algorithm na ɓangare na uku.

**Doccano** yana mai da hankali kan ayyukan sanya lakabi jeri (NER, fitar da dangantaka, rarrabuwa rubutu). Mai amfani da shi mai sauƙi na yanar gizo yana sa shi ya samu damar ƙungiyoyi ba tare da albarkatu musamman na injiniyan bayanai ba.

### Dandamali Na Kasuwanci

**Scale AI** yana ba da ayyukan lakabi masu sarrafa daga farko: ƙungiyar aiki ta dan adam, sarrafa inganci, da haɗe-haɗen API. Mai ƙarfi musamman don tuka kai tsaye, robots, da lakabi 3D masu rikitarwa. Kuɗi yana dogara akan rikitarwan aiki da yawa.

**Labelbox** dandamali cikakke ne don yin kula da bayanai, lakabi, da sanya lakabi mai tallafi na ML. Fasalun kamfanin masu ƙarfi: sarrafa aiki, hanyoyin inganci, zagaye na ra'ayin samfuri, da haɗe-haɗe tare da dandamali na ML manyan (SageMaker, Vertex AI, Azure ML).

**Appen** (tsohon Figure Eight / CrowdFlower) yana aiki da babban ƙungiyar aiki na lakabi na duniya tare da kayan aiki. Zaɓi mai kyau lokacin da yawa da sarrafa ƙungiyar aiki sune damuwa ta farko.

**Surge AI** yana mai da hankali kan masu sanya lakabi ƙwararru kuma yana da ƙarfi don ayyuka waɗanda ke buƙatar ilimin yanki ko hukunci mai laushi.

**Humanloop** yana ƙwararre a tattara ra'ayin LLM — lakabi na fifiko, tattara bayanin RLHF, da kimantawa ta samfuri.

---

## Kwatancen Fasalin Dandamali na Lakabi

| Fasali | Label Studio | Prodigy | CVAT | Labelbox | Scale AI |
|--------|--------------|---------|------|----------|---------|
| Lasisin | Buɗaɗɗen tushe | Na kasuwanci | Buɗaɗɗen tushe | Na kasuwanci | Na kasuwanci |
| Masaukin | Kai / girgije | Kai | Kai / girgije | Girgije | Sarrafa |
| Lakabi rubutu | ✓ | ✓ | — | ✓ | ✓ |
| Lakabi hoto | ✓ | Iyakantacce | ✓ | ✓ | ✓ |
| Lakabi bidiyo | ✓ | — | ✓ | ✓ | ✓ |
| Haɗin koyon aiki | ✓ | ✓ | Iyakantacce | ✓ | ✓ |
| Pre-annotation ta tallafi na ML | ✓ | ✓ | ✓ | ✓ | ✓ |
| Hanyoyin sarrafa inganci | Asali | Asali | Asali | Ci gaba | Ci gaba |
| API / Samun dama ta shirye-shirye | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sarrafa ƙungiyar aiki | — | — | — | Iyakantacce | ✓ |

---

## Lakabi a matsayin Lambar Shirye-shirye

Muhimmin abu amma galibi ba a kula da shi a cikin ababen more rayuwa na lakabi shine **sarrafa sigar don lakabi da schemas na lakabi**. Ɗaukar lakabi a matsayin lambar shirye-shirye yana nufi:

**Zane-farko na schema.** Taxonomy na lakabi da ƙa'idojin lakabi suna bayyananne a cikin fayil ɗin tsara na sigar (YAML ko JSON) kafin lakabi ya fara. Canjin schema yana ƙirƙira sigar sabon.

**Sigar lakabi.** Ana ajiye lakabi tare da haɗi zuwa sigar schema da aka yi su ƙarƙashinsa. Wannan yana ba da damar bincike, komawa, da kwatanta lakabi cikin sigar schema.

**Tsarin da ake iya maimaita su.** Tsarin lakabi — daga bayanai mentah zuwa lakabin shirye don horarwa — ya kamata a iya maimaita su daga lambar. Samfurin pre-annotation, tacewar inganci, logic ta haɗawa, da rarraba bayanai duka ya kamata a rubuta su.

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
```text
Tushen bayanai
    |
    v
Tafkin ba a yi lakabi ba -->  Dandamali na lakabi --> Saitin bayanai da aka yi lakabi
    ^                              |                              |
    |                              | (Mai tallafi na ML)          v
Dabarun tambaya <-----------------+                         Gudu na horarwa
na koyon aiki                                                     |
    ^                                                             v
    +------------ Samfurin da aka horar <---------- Kimantawa
                                                          |
                                                    Aikawa &
                                                    sa ido
```

Manyan wurin haɗe:
1. **Shigar bayanai:** Bayanai ba a yi lakabi ba yana gudana ta atomatik daga gidan ajiya na bayanai zuwa dandamali na lakabi
2. **Aika samfuri:** Ana aika samfuri mafi kyau na yanzu zuwa dandamali na lakabi don pre-annotation da ƙididdiga koyon aiki
3. **Fitarwa:** An fitar da lakabi da aka ƙare a cikin tsarin dacewa da tsarin horarwa (COCO JSON, saitin bayanai na Hugging Face, dkk.)
4. **Zagayen ra'ayi:** Ana jagorancin kurakuran samfuri na samarwa koma zuwa dandamali na lakabi don gyarawa

```{seealso}
Don takardun Label Studio da haɗin koyon aiki: https://labelstud.io. Don Prodigy: https://prodi.gy. CVAT: https://cvat.ai. Don cikakken kwatancen kayan aiki na lakabi, duba {cite}`monarch2021human`, Babi na 7.
```
