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

# Ujifunzaji wa Mashine wa Mwingiliano

Ujifunzaji tendaji huuliza swali la makusudi: kwa bajeti fulani, mifano ipi ninapaswa kuweka lebo? Ujifunzaji wa Mashine wa Mwingiliano (IML) huuliza swali pana zaidi: tunawezaje kubuni *mwingiliano wote* kati ya binadamu na mfumo wa kujifunza kuwa wa uzalishaji wa juu, wa kufurahisha, na sahihi?

IML inajulikana na **haraka** na **moja kwa moja** ya mzunguko wa maoni kati ya binadamu na mfano. Ambapo ML ya kitambo inahusisha binadamu kusambaza data na kusubiri mafunzo kukamilika, IML huwezesha binadamu kuangalia tabia ya mfano, kutoa maoni, na kuona mfano ukijibu — mara nyingi ndani ya sekunde.

---

## Kanuni za Ujifunzaji wa Mashine wa Mwingiliano

Amershi et al. {cite}`amershi2014power` wanatambua sifa tatu za msingi za IML:

**1. Maoni ya Haraka:** Mfano husasishwa haraka ya kutosha kwa binadamu kuhisi athari ya maoni yao. Katika kikomo, masasisho ya mfano hutokea wakati wa sasa hivi.

**2. Udhibiti wa Moja kwa Moja:** Binadamu hushirikiana na mfano kupitia data au kupitia utabiri wa mfano — si kupitia faili za usanidi au kurekebisha vigezo vya juu.

**3. Uboreshaji wa Mzunguko:** Mchakato ni wa mzunguko wa kweli: hatua ya binadamu inayofuata inajulishwa na tabia ya sasa ya mfano, ambayo iliundwa na hatua za awali za binadamu.

Hii inaunda **mzunguko wa urekebishaji wa pamoja** uliofungwa: binadamu na mfano wote wanabadilika baada ya muda kujibu wao kwa wao. Binadamu anajifunza mfano unaelewa nini; mfano unajifunza binadamu anajali nini.

---

## Ulinganisho na Ujifunzaji Tendaji

IML na ujifunzaji tendaji vinaingiliana sana lakini si sawa:

| Sifa                          | Ujifunzaji Tendaji            | ML ya Mwingiliano               |
|-------------------------------|-------------------------------|----------------------------------|
| Swali kuu                     | Nini cha kuweka lebo?         | Jinsi ya kushirikiana?           |
| Muda wa maoni                 | Inaweza kuwa vifurushi (siku) | Kawaida wakati wa sasa au karibu|
| Mara ya sasisha ya mfano      | Kwa raundi (vifurushi)        | Kwa mwingiliano (mtandaoni)      |
| Wakala wa binadamu            | Hujibu maswali ya mfano       | Anaweza kufundisha mfano kwa hiari|
| Muundo wa kiolesura           | Wasiwasi wa pili              | Wasiwasi mkuu                    |
| Mzigo wa kiakili wa binadamu  | Hauhesabiwi waziwazi          | Huzingatiwa waziwazi             |

Katika ujifunzaji tendaji, mashine inaelekeza mwingiliano. Katika IML, binadamu pia anaweza kuchukua hatua — kutoa mifano, marekebisho, au maoni kuhusu sehemu yoyote ya tabia ya mfano inayoonekana kuwa na matatizo zaidi.

---

## Mwingiliano wa Hiari Iliyochanganywa

Mifumo ya **hiari iliyochanganywa** huruhusu binadamu na mashine wote kuchukua uongozi wakati tofauti {cite}`allen1999mixed`. Mfumo ulioelekezwa na mashine peke yake huuliza maswali na binadamu hujibu. Mfumo ulioelekezwa na binadamu peke yake humwacha binadamu kufanya maamuzi yote. Mifumo ya hiari iliyochanganywa inasawazisha vyote viwili.

Katika mazoezi, mifumo bora ya IML huchanganya:
- **Hiari ya mashine:** "Sijui kuhusu mifano hii — unaweza kuweka lebo?"
- **Hiari ya binadamu:** "Naona mfano una makosa ya mara kwa mara kuhusu kategoria hii — acha nitoe mifano zaidi"
- **Uthibitisho:** Mfano unaonyesha uelewa wake wa sasa; binadamu anahakikisha au kurekebisha

Violesura bora vya IML vinafanya uelewa wa sasa wa mfano kuonekana na kurekebishika. Hii ndiyo mahitaji ya **ufahamikaji**: binadamu anaweza tu kuongoza mfano anaoufahamu, angalau kwa takriban.

---

## Mambo ya Kibinadamu katika IML

IML huleta mambo ya kibinadamu — mzigo wa kiakili, uchovu, uthabiti, na imani — moja kwa moja katika mzunguko wa kujifunza. Muundo mbaya wa IML husababisha:

**Uchovu wa uwekaji maelezo:** Binadamu wanaofanya maamuzi ya haraka, yasiyojali zaidi kadri vikao vinavyoendelea. Makosa yanayoingia katika data ya mafunzo.

**Upendeleo wa nanga:** Binadamu wanaoitegemea kupita kiasi mapendekezo ya sasa ya mfano. Kiolesura kikijaza mapema utabiri wa mfano, wawekaji maelezo uwezekano mdogo wa kurekebisha hata iwapo ni kosa — chanzo cha kimfumo cha kelele za lebo zinazokusanyika kati ya raundi za uwekaji maelezo {cite}`geva2019annotator`. Uwekaji maelezo wa awali unaweza kuharakisha uzalishaji {cite}`lingren2014evaluating` huku wakati huo huo ukipunguza kasi ambayo wawekaji maelezo wanagundua makosa ya mfano; athari hizi mbili zinapaswa kupimwa moja dhidi ya nyingine katika muundo wa kiolesura cha IML.

**Urekebishaji mbaya wa imani:** Binadamu wanaoimini kupita kiasi (wakubali matokeo mabaya ya mfano) au wasioamini (kupuuza mapendekezo sahihi). Mifumo yote miwili inapunguza thamani ya ushirikiano kati ya binadamu na mfano.

**Uthabiti wa kikao:** Binadamu wanaweza kufanya maamuzi tofauti kuhusu mfano sawa wakati tofauti, hasa baada ya vikao virefu. Ukaguzi wa uthabiti (kuwasilisha tena mifano ya awali) unaweza kugundua na kurekebisha hili.

Muundo mzuri wa IML unapunguza matatizo haya kupitia mipango ya kiolesura: kuwasilisha imani ya mfano waziwazi, kufanya mpangilio wa onyesho bila mpangilio, kupunguza urefu wa kikao, na kujenga ukaguzi wa uthabiti.

---

## Aina za Maoni ya IML katika Mazoezi

### Maoni ya Kiwango cha Mfano

Binadamu hutoa lebo au marekebisho kwa mfano maalum. Hii ndiyo aina ya kawaida zaidi na inaoana moja kwa moja na ujifunzaji wa usimamizi.

### Maoni ya Kiwango cha Kipengele

Binadamu anaonyesha vipengele vipi vina umuhimu au si na umuhimu. "Mfano unapaswa kuzingatia maneno 'ya haraka' na 'mwisho' kwa kategoria hii." Hii inaonyesha zaidi kuliko maoni ya kiwango cha mfano na inaweza kuwa ya ufanisi zaidi kwa kazi fulani.

**TFIDF Interactive** na mifumo inayofanana huruhusu wawekaji maelezo kuangazia maneno muhimu katika hati za maandishi. Sehemu hizi zilizoangaliwa zinabadilishwa kuwa vikwazo au usimamizi wa ziada kwenye makini ya mfano.

### Maoni ya Kiwango cha Mfano

Binadamu anarekebisha moja kwa moja tabia ya mfano kwenye darasa la ingizo: "Kila wakati ingizo lina [X], tokeo linapaswa kuwa [Y]." Hii inawiana na sheria za mantiki au vikwazo katika mbinu kama Urekebishaji wa Nyuma {cite}`ganchev2010posterior` au kujifunza kwa vikwazo.

---

## Mfano wa Kesi: Google Teachable Machine

Teachable Machine ni mfumo wa IML unaoweza kufikiwa kupitia wavuti ambao humruhusu mtumiaji asiye na ujuzi wa kiufundi kufunza wasambazaji wa picha kwenye kivinjari. Mtumiaji:

1. Anarekodi mifano ya kila darasa kwa kutumia kamera yake
2. Anafunza mfano kwa kubonyeza mara moja (kurekebisha fini MobileNet kwenye kivinjari)
3. Anaona mara moja utabiri wa mfano kwenye video ya wakati wa sasa hivi
4. Anaongeza mifano zaidi kwa madarasa ambayo mfano unakosea

Hii inaonyesha mzunguko wa msingi wa IML: toa mifano → angalia mfano → tambua kushindwa → toa mifano zaidi yenye lengo. Maoni ya wakati wa sasa hivi (matokeo ya mfano yanasasishwa wakati wa sasa hivi, kawaida kwa viwango vya fremu vya mwingiliano kwenye vifaa vya kisasa) hufanya mzunguko wa urekebishaji wa pamoja kuwa wa karibu na wa kugusa.

---

## Kutekeleza Mzunguko Rahisi wa IML

```{code-cell} python
import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

class SimpleIMLSystem:
    """
    Minimal IML system that allows online feedback and displays
    model state after each annotation.
    """

    def __init__(self, n_features=10, n_classes=2):
        self.model = SGDClassifier(loss='log_loss', max_iter=1, warm_start=True,
                                   random_state=42)
        self.scaler = StandardScaler()
        self.X_seen = []
        self.y_seen = []
        self.n_classes = n_classes
        self.initialized = False

    def update(self, x, y_true):
        """Receive a single labeled example and update the model."""
        self.X_seen.append(x)
        self.y_seen.append(y_true)

        if len(self.X_seen) >= 2 * self.n_classes:
            X_arr = np.array(self.X_seen)
            y_arr = np.array(self.y_seen)
            X_scaled = self.scaler.fit_transform(X_arr)
            self.model.partial_fit(X_scaled[-1:], y_arr[-1:],
                                   classes=list(range(self.n_classes)))
            self.initialized = True

        return self

    def predict_with_confidence(self, x):
        """Predict label and return confidence."""
        if not self.initialized:
            return None, 0.0
        x_scaled = self.scaler.transform(x.reshape(1, -1))
        probs = self.model.predict_proba(x_scaled)[0]
        return self.model.predict(x_scaled)[0], probs.max()

    def current_accuracy(self, X_val, y_val):
        if not self.initialized:
            return None
        X_scaled = self.scaler.transform(X_val)
        return (self.model.predict(X_scaled) == y_val).mean()


# Simulate an IML session
rng = np.random.default_rng(42)
X_all, y_all = np.random.default_rng(0).random((500, 10)), np.random.default_rng(0).integers(0,2,500)
X_val, y_val = X_all[400:], y_all[400:]

system = SimpleIMLSystem(n_features=10, n_classes=2)
accs, confidences = [], []

print("Step | Labels | Accuracy | Example confidence")
print("-" * 50)

for step in range(100):
    x, y = X_all[step], y_all[step]
    pred, conf = system.predict_with_confidence(x)
    system.update(x, y)

    if (step + 1) % 10 == 0:
        acc = system.current_accuracy(X_val, y_val)
        if acc is not None:
            accs.append(acc)
            print(f"  {step+1:3d} |  {step+1:4d}  |  {acc:.3f}   | {conf:.3f}")
```

---

## Mtihani wa Bibi

Kipimo kimoja cha manufaa cha kutathmini muundo wa kiolesura cha IML — na muundo wa mfumo wa HITL kwa upana zaidi — ni tunachokiita **Mtihani wa Bibi** (neno asili lililoanzishwa hapa kama kikwazo cha muundo, si kama rejeleo la kazi za awali):

> *Mwanamke aliyezaliwa mwaka 1930 anapaswa kuweza kutumia kifaa hiki kwa sauti, na akichanganyikiwa, ashuke kwa ustadi hadi kiolesura cha kibodi au maandishi.*

Mtihani huu si wa ufikiaji hasa, ingawa ni hilo pia. Ni kuhusu **kubuni kwa mgongano**. Kama mfumo unahitaji mfano wa akili wa mitandao ya neva, mizunguko ya mafunzo, au usambazaji wa uwezekano kutumika vizuri, umeshindwa Mtihani wa Bibi. Binadamu katika mzunguko anapaswa kuweza kushiriki bila kuelewa upande wa mashine wa mzunguko.

Athari kwa muundo wa IML ni za moja kwa moja:

**Kuanguka kwa sauti kwanza:** Hali ya kwanza ya mwingiliano inapaswa kuwa lugha asilia au ishara — si vitelezi vya vigezo au vizingiti vya imani. Wataalamu wanaweza kutaka vitelezi; kila mtu anapaswa kuweza kusema "hilo ni kosa."

**Kuanguka kwa neema:** Wakati hali ya mwingiliano inayopendelewa ya mtumiaji inashindwa au kumfadhaisha, mfumo unapaswa kutoa mbadala — si skrini tupu au ujumbe wa kosa. Kiolesura ni sehemu ya mfumo wa kujifunza; mtumiaji ambaye hawezi kushirikiana hawezi kufundisha.

**Hali ya mfano inayosomeka:** Uelewa wa sasa wa mfano unapaswa kuonekana kwa maneno ya kibinadamu. Si "imani: 0.73" bali "Niko wazi kabisa hii ni [X], lakini nimekuona mifano kama hii ikienda pande zote mbili." Wasiwasi unapaswa kuwasilishwa katika lugha inayokaribisha marekebisho.

**Uvumilivu wa utata:** Mtumiaji wa umri wa miaka 93 na mhandisi wa ML wa umri wa miaka 23 watashirikiana tofauti na mfumo sawa. Mtihani wa Bibi unauliza kama mfumo unaweza kukubaliana na wote wawili — si kwa kugundua umri wa mtumiaji, bali kwa kubuni mwingiliano unaofanya kazi kwa anuwai ya utaalamu na starehe.

Mtihani huu una umuhimu maalum mifumo ya ML inapohamia kutoka kwa zana za utafiti hadi miundombinu ya kila siku. Msaada wa kupiga picha za kimatibabu unaotumika na madaktari wa radiolojia, kisambazaji cha hati za kisheria kinachotumika na wasimamizi, mfumo wa maoni ya elimu unaotumika na walimu — kila mmoja unahusisha binadamu katika mzunguko ambao hawakujiandikisha kuwa wafunzaji wa AI. Kubuni kwao si makubaliano; ni lengo.

:::{admonition} Kanuni ya Muundo
:class: tip
Mtihani wa Bibi ni kikwazo cha muundo, si idadi ya walengwa. Mifumo inayopita inastahimili zaidi utofauti wa watumiaji, inasamehe zaidi pengo la utaalamu, na ni ya uaminifu zaidi kuhusu kinachohitajiwa kutoka kwa binadamu katika mzunguko. Kama mfumo unahitaji maelezo kabla ya kutumika, unomba binadamu afanye kazi ya ziada. Kazi hiyo inapaswa kuhesabiwa na manufaa ya kulinganishwa.
:::

---

## IML na Mifano ya Msingi

IML ya kisasa mara nyingi inatumia **mifano ya msingi iliyofunzwa awali** {cite}`bommasani2021opportunities` kama msingi. Badala ya kufunza kutoka mwanzo, watumiaji wanaboresha fini mfano mkubwa uliofunzwa awali na mifano michache ya mwingiliano. Hii inaweza kupunguza sana idadi ya mifano inayohitajika kufikia utendaji unaofaa — katika hali nzuri, mifano 5–50 tu badala ya maelfu, kulingana na jinsi uwakilishi wa awali unavyooana na kazi inayolengwa {cite}`bommasani2021opportunities`.

Mbinu zinazomwezesha hili ni pamoja na:
- **Maswali ya mifano michache:** Kutoa mifano katika dirisha la muktadha la LLM
- **Kurekebisha fini kwa kiambatisho:** Kusasisha moduli ndogo za kiambatisho huku ukifunza mfano wa msingi
- **Kurekebisha fini kwa ufanisi wa vigezo (PEFT):** LoRA, kurekebisha kiambishi, na mbinu zinazofanana zinazokuruhusu masasisho ya haraka, ya rasilimali ndogo

Mifano ya msingi inabadilisha mienendo ya IML: binadamu hawafundishi tena mfano wa mwanzo kutoka mwanzo bali *wanasimamia* mfano ambao tayari unajua mengi sana. Changamoto inahamia kutoka "jinsi ya kutoa mifano ya kutosha" hadi "jinsi ya kubainisha hasa tunachotaka tofauti na mfano unavyofanya tayari."

```{seealso}
Utafiti wa {cite}`amershi2014power` unabaki kuwa mapitio bora ya kanuni za IML. Kwa mifumo ya hiari iliyochanganywa hasa, angalia {cite}`allen1999mixed`. Kwa athari za nanga katika uwekaji maelezo, angalia {cite}`geva2019annotator` na {cite}`lingren2014evaluating`.
```
