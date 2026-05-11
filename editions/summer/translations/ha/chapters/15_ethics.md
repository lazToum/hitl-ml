# Adalci, Nuna Bambanci, da Da'a

Tsarin da dan adam ke cikin zagaye yana gaji duka iyawar da kuma iyakokin mutanen da ke cikin su. Masu sanya lakabi suna kawo ilimi, hukunci, da ƙirƙira ga aikinsu — amma kuma nuna son zuciya, gajiya, da mahallin zamantakewar rayuwarsu. Zaɓuɓɓuka da muke yi a cikin tsara tsarin HITL — wane ya sanya lakabi, abin da ake roƙar su, yadda ake biyan su, da yadda ake amfani da aikinsu — suna da sakamako waɗanda ke faɗaɗawa fiye da ma'aunai na daidaito na samfuri.

Wannan babi yana magance girman da'a na HITL ML.

---

## Hanyoyin Nuna Son Zuciya a Cikin Tsarin HITL

### Halaye na Dimokra'iyya na Masu Sanya Lakabi

Lakabi ba aikin neutral ba ne. Lakabin da masu sanya lakabi suke bayarwa suna nuna hangen nesansu, ƙwarewarsu, da mahallin al'adunsu. Lokacin da ƙungiyar aiki na lakabi yana da halaye na dimokra'iyya ɗaya — kamar yadda galibi take, tare da aikin taron aiki da ke nuna son zuciya ga matasai, maza, da Yammaci — saitin bayanai da aka samu yana ɓoye hangen nesa na wannan ƙungiya.

**Shaidar:** Bincike na saitin bayanai na lakabi na NLP sun sami cewa halaye na dimokra'iyya na masu sanya lakabi suna hasashen zaɓuɓɓukan lakabinsu don ayyuka na son zuciya (guba, ji, laifi). Saitin bayanai da masu aiki da ke Amurka da farko suka sanya lakabi suna ɓoye al'adun Amurka waɗanda ba sa faɗaɗawa zuwa wasu yankuna {cite}`geva2019annotator`.

**Sakamako:** Samfurin da aka horar akan irin waɗannan bayanai suna aiki da kyau don masu amfani waɗanda suke kama da tafkin mai sanya lakabi kuma mafi ƙaranci — ko ta hanyar nuna son zuciya — don masu amfani waɗanda ba su yi ba.

**Rage:** Bambancita deliberate na ƙungiyar aiki; lakabi mai tsari (tabbatar da masu sanya lakabi daga rukunin halaye na dimokra'iyya masu dacewa suna ba da gudummawa ga ayyukan masu dacewa); bin sahun halaye na dimokra'iyya na masu sanya lakabi da tasirin su akan rarrabawar lakabi.

### Tsarin Tsara Tambaya

Yadda tambaya aka tsara yana shafawa amoshin da ta jawo. Idan ana roƙa masu sanya lakabi "Shin wannan rubutu ne mai guba?" na iya amsa daban fiye da "Shin wannan rubutu zai cutar wa wani da yake cikin ƙungiyar da aka ambata?" Tsara yana ɓoye ɗauki a kan abin da ke da muhimmanci.

**Misali:** Lakabi na "harshen cin zarafi" akan kafofin yada labarai na zamantakewa yana bambanta sosai dangane da ko ana nuna masu sanya lakabi bayanin mahallin game da asalin marubucin. Magana da ke kama da barazana a keɓe na iya a gane shi a matsayin harshe da aka ɗauka ko wasan kamfani na ƙungiya lokacin da aka ba da mahallin.

### Tasirin Dandamali

Dandamali da tsarin biyan kuɗi suna shafawa ingancin lakabi. Masu aiki da ake biya kowace aiki maimakon kowace sa'a suna da ƙarfin gwiwa don aiki da sauri; wannan yana ƙara gudu amma yana rage inganci. Masu aiki da suka ji tsoron an toshe su daga dandamali don ƙarancin daidaito na iya guji alamar "mara tabbas" kuma maimakon haka yin kiyasi, yana rufe rikitarwa ta gaske.

### Nuna Son Zuciya na Tabbatarwa da Anchoring

Masu sanya lakabi suna shafawa ta:
- **Pre-annotation:** Hasashen samfuri da ake nuna ga masu sanya lakabi ana yarda da su fiye da a yi watsi da su, ko da lokacin da ba daidai ba
- **Tasirin tsari:** Yin lakabi ga item ɗaya a mahallin daban yana ba da amoshin daban
- **Priming:** Abubuwa na baya a cikin aiki suna shafawa yadda ake yin lakabi ga abubuwa masu zuwa

---

## Adalci a Cikin Tsarin HITL

### Menene Adalci?

Adalci a ML ra'ayi ne mai jayayya tare da ma'anoni da yawa masu yiwuwa masu dacewa waɗanda galibi suna sabawa da juna {cite}`barocas2019fairness`. Don manufofin HITL, girman mafi dacewa su ne:

**Wakilci:** Shin bayanin horarwa yana wakilta yawan jama'a waɗanda samfuri zai shafe su?

**Daidaito na aiki:** Shin samfuri yana aiki daidai cikin rukunin halaye na dimokra'iyya daban-daban?

**Daidaito na lakabi:** Shin ana yin lakabi ga ɗabi'oci ɗaya daidai ba tare da la'akari da wanda yake yin su ba? (Bincike ya nuna cewa ba koyaushe haka ne ba — iri iri na abun ciki wani lokaci ana yin lakabi daban lokacin da aka danganta ga rukunin jinsi ko jima'i daban.)

### Koyon Aiki Mai Sani ga Adalci

Dabarun koyon aiki na yau da kullum suna mai da hankali kan rashin tabbas na samfuri, wanda ke mai da hankali kan misalin ajin rinjaye. Wannan na iya ƙara rashin daidaito na aiki ga ƙungiyoyin azamtawa.

**Dabarun tambaya masu sani ga adalci** suna ƙara rashin tabbas tare da ƙuntatawa na iri-iri ko wakilci:

$$
x^* = \argmax_{x \in \mathcal{U}} \left[ \lambda \cdot \text{uncertainty}(x) + (1 - \lambda) \cdot \text{minority\_group\_bonus}(x) \right]
$$

Sanya $\lambda < 1$ yana tabbatarwa dabarun tambaya ba ta gaba ɗaya yin watsi da wakilcin azamtawa.

---

## Walwalar Mai Sanya Lakabi

### Matsalar Aikin Fatalwa

Aikin lakabi da ke ƙarfafa ML galibi yana ɓoye. Masu aiki da bayanai — galibi a Duniya ta Kudu — suna yin lakabi ga hotuna, sun rubuta magana, da sarrafa abun ciki don albashi ƙarami, ba tare da fa'idodi ba, cikin tsarin tattalin arzikin gig ba tare da tsaron aiki ba. "Anatomy of an AI System" na Kate Crawford da Vladan Joler {cite}`crawford2018anatomy` da "Ghost Work" na Mary Gray da Siddharth Suri {cite}`gray2019ghost` sun rubuta sikelin da rashin daidaito na wannan aiki.

**Alkaluman MTurk:** Bincike na tsari na 2018 na kuɗin MTurk ya sami matsakaicin biyan kuɗi na sa'a na gaske na kusan $2/hr — ƙasa da ƙarancin albashi a mafi yawan jihohi na Amurka da ƙasashe da yawa masu samun kuɗi sosai {cite}`hara2018data`. Masu aiki waje da ƙasashe masu samun kuɗi sosai galibi suna fuskantar cikas ƙari: masu buƙata galibi suna iyakance ayyukan biyan kuɗi sosai ga cancantar Amurka kawai, kuma rukunin masu aiki da ke gasa don ayyukan buɗaɗɗen da suka rage suna duniya, suna tattara kuɗin sa'a mai tasiri ƙari.

**Sarrafa abun ciki:** Wata nau'i musamman mai cutarwa ta aikin lakabi — duba abun ciki mai hoto, mai tashin hankali, da mai damun kai — an danganta ta da PTSD, damuwa, da damuwa tsakanin masu aiki {cite}`newton2019trauma`. Dandamali sun yi fuskar sukar don tallafin lafiya ta tunani mara isa da yawan fitar da su sosai.

### Ayyukan Da'a

**Biyan kuɗi mai gaskiya:** Biya masu aiki na lakabi a ko sama da ƙarancin albashi na gida. Bincike ya nuna cewa biyan kuɗi mai ƙari yana jawo masu aiki mafi inganci ba tare da ƙara kuɗi kowace lakabi daidai ba.

**Ganin aiki:** Amince da aiki wanda ke ƙirƙira bayanin horarwa a cikin wallafe-wallafen da takardun kayan aiki.

**Tallafin lafiya ta tunani:** Don masu aiki waɗanda ke duba abun ciki mai cutarwa, bayar da tallafin ilimin halin ɗan adam, tsare-tsaren musun, da iyakar fitar da.

**Wakilcin mai aiki:** Ba da damar masu aiki na lakabi su ruwaito damuwa, neman bayanin jagoran, da ƙalubalantar kimantawar inganci mara adalci.

---

## Asirin Sirri a Lakabi

### Bayanan Lafiya da Sirri (PHI da PII)

Ayyukan lakabi galibi suna haɗa bayanai masu mahimmanci na sirri. Aikin lakabi na likitanci na iya fallasa masu aiki ga rikodin mara lafiya; aikin NLP na iya fallasa masu aiki ga sadarwa na sirri; aikin sarrafa abun ciki yana fallasa masu aiki ga bayyanar sirri na masu amfani.

Tsarin doka (HIPAA, GDPR) suna iyakance yadda za a raba bayanai na sirri tare da ƙungiyar aiki na lakabi. Ka'idojin muhimmanci:

- **Rage bayanai:** Raba kawai bayanai da masu sanya lakabi suke buƙata don cikawa aiki
- **Cire gane-gane:** Cire PHI da PII kafin lakabi inda ya yiwu
- **Yarda:** Inda ake yin lakabi ga bayanin mai amfani na gaske, tabbatar da yardarta daidai ko tushe na doka
- **Sarrafa dama:** Iyakance waɗanne masu sanya lakabi suke samun damar bayanai masu mahimmanci bisa matsayi da izini

### Bayanai na Wucin Gadi a matsayin Hanya

Don ayyuka inda bayanai na gaske suna ɗaukar haɗarin sirri, ƙirƙira bayanai na wucin gadi na iya ƙirƙira saitin bayanai masu shirye don lakabi ba tare da fallasa bayanai masu mahimmanci ba. Don NLP na asibiti, misali, rubutu na EHR na wucin gadi na iya ba da bayanin horarwa na gaske don samfurin cire gane-gane ba tare da fallasa rikodin mara lafiya na gaske ba.

---

## Lakabi na Makiya da Gurɓata Bayanai

Tsarin HITL suna ƙirƙira saman harin: idan abokin hamayya na iya shafawa tsarin lakabi, zai iya shafawa ɗabi'ar samfuri.

**Gurɓata bayanai ta hanyar lakabi:** Maharin da ya sami damar ƙungiyar aiki na lakabi (misali, asusun mai aiki da aka lalata) na iya saka misalin da aka sanya lakabi kuskure ta tsari. Wannan yana da inganci musamman a cikin yanayi na koyon aiki, inda samfuri ke tambaya misalin mara tabbas da fifiko — waɗanda na iya kasancewa manufar maharin.

**Hacking lada ta ra'ayi:** A RLHF, masu sanya lakabi (ko lakabi da AI ya ƙirƙira) waɗanda suke ƙididdiga wasu nau'i na abun ciki mafi ƙari na iya kula da samfuri zuwa wannan abun ciki, ba tare da la'akari da ingancin ta gaske ba.

**Rage:** Masu sanya lakabi masu zaman kansu da yawa kowace item; gano ɓataccen akan salon lakabi; sa ido don yarjejeniya ko rashin jituwa mara al'ada; kiyaye saitin kimantawa waɗanda ba za a iya shafawa ta ƙungiyar aiki na lakabi ba.

---

## Da'a ta Cibiya

### IRB da Duba Da'a

Ayyukan bincike da suka haɗa da mahalarta dan adam — gami da masu aiki na lakabi — galibi suna buƙatar amincewar Kwamitin Duba na Cibiya (IRB). Ayyukan lakabi waɗanda ke tattara bayanai game da imanin masu aiki, amsoshi ga abun ciki masu mahimmanci, ko bayanai na halaye na dimokra'iyya ya kamata a duba su ƙarƙashin tsarin da'a ɗaya kamar sauran binciken mahalarta dan adam.

### Sarrafa Bayanai

Kungiyoyi ya kamata su sami manufofi bayyananne don:
- Waɗanne bayanai za a iya aika don lakabi na waje da waɗanne za a sanya lakabi a ciki
- Tsawon lokacin da ake kiyaye bayanin lakabi da ta wane
- Wanda ke samun damar lakabi da samfurin da aka horar akan su
- Yadda za a sarrafa roƙon don share bayanin da aka sanya lakabi (haƙƙin goge na GDPR)

### Bayyananci da Alhaki

Masu amfani da tsarin ML suna da sha'awa ta halal a cikin fahimtar yadda waɗancan tsarin aka gina su. Rubuta hanyar lakabi — wanda ya sanya lakabi ga bayanai, ƙarƙashin waɗanne yanayi, tare da waɗanne jagoran — wata nau'i ce ta alhaki da ke amfana da masu amfani, masu tsara ƙa'idoji, da filin gaba ɗaya.

**Takardun Bayanai don Saitin Bayanai** {cite}`gebru2021datasheets` yana ba da template mai tsari don rubuta kaddara saitin bayanai, hanyoyin lakabi, da iyakokin da aka sani.

```{seealso}
Tsarin adalci ta algorithm: {cite}`barocas2019fairness`. Aikin fatalwa da aiki na dandamali: Gray & Suri (2019). Takardun Bayanai don Saitin Bayanai: {cite}`gebru2021datasheets`. Walwalar mai aiki na sarrafa abun ciki: {cite}`newton2019trauma`. Halaye na dimokra'iyya na mai sanya lakabi da saitin bayanai na NLP: {cite}`geva2019annotator`.
```
