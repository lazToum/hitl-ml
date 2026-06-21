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

# Shukrani

Kila kitabu kuhusu ujifunzaji wa mashine wenye binadamu katikati kinapaswa kuanza na binadamu walioko katika mzunguko wake wenyewe.

**Wawekaji maelezo.** Kitabu hiki cha mwongozo kinahusu, kwa sehemu, ninyi — kuhusu kazi yenu, hukumu yenu, na ukweli kwamba majina yenu hayaonekani katika kadi yoyote ya mkusanyiko wa data, shukrani za makala, au taarifa yoyote ya vyombo vya habari kuhusu mifano ambayo kazi yenu iliiwezesha. Uwanja huu unaanza kujizingatia hili. Bado una njia ndefu ya kwenda.

**Wachangiaji wa programu huria** ambao maktaba zao zinatumika katika kila mfano wa msimbo: jumuiya ya NumPy (tangu 2006), wachangiaji wa scikit-learn (tangu 2007), timu ya PyTorch, jumuiya ya Hugging Face, na watunzaji wasio na hesabu wanaoshughulikia hitilafu za programu wikendi bila malipo wala kutambuliwa. Kompyuta za kisayansi zimejengwa juu ya kazi hii isiyoonekana.

**Watafiti** waliochapisha kazi yao waziwazi — katika nakala za awali za arXiv, maeneo ya ufikiaji wazi, na hazina za GitHub — kuifanya iwezekane kwa wataalamu kujifunza bila ufikiaji wa kitaasisi. Na watafiti waliokagua makala kwa makini na kwa uaminifu, aina ya uwekaji maelezo wa wataalam ambayo taaluma ya kitaaluma kwa namna fulani imejishawishi si kazi.

**Walimu** waliofanya maarifa yawe ya ufikiaji: wablogu, waandishi wa mafunzo, wajibu wa Stack Overflow, wawasilishaji wa mikutano walioweka slaidi zao wazi. Kujifunza hakutokei kwa kutengwa, na hakutokei bila watu wanaokuwa tayari kueleza mambo kwa wageni.

**Wakosoaji.** Watafiti walioonyesha kwamba mkusanyiko wa data unabeba upendeleo, kwamba asili ya wawekaji maelezo huathiri tabia ya mfano, kwamba binadamu walioko katika mzunguko mara nyingi ni washiriki wanaoweza kuumizwa zaidi katika mfumo. Uwanja huu unafaidika zaidi na msisitizo wenu wa kuuliza maswali yasiyofurahi.

---

```{epigraph}
Kuna mambo yanayojulikana yanayojulikana — mambo tunayoyajua kwamba tunayajua.
Kuna mambo yanayojulikana yasiyojulikana — mambo tunayoyajua kwamba hatuyajui.
Kuna mambo yasiyojulikana yasiyojulikana — mambo tusiyoyajua kwamba hatuyajui.

Na kisha kuna mambo ambayo kila mtu katika uwanja huu anayajua
lakini ambayo kamwe hayafikii makala za kisayansi.

Kitabu hiki cha mwongozo ni, kwa sehemu, jaribio la kategoria ya mwisho.
```

---

*Ukichangia katika uwanja huu na huoni jina lako hapa: umetambuliwa. Mzunguko unakujumuisha.*
