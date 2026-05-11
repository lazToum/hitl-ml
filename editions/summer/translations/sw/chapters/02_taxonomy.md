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

# Uainishaji wa Mwingiliano kati ya Binadamu na Mashine

Msamiati sahihi ndio sharti la kwanza la fikira wazi. Neno "binadamu katikati ya mzunguko" linatumika kwa upole katika mazoezi — wakati mwingine kumaanisha kwamba binadamu anaweka lebo kwa data ya mafunzo, wakati mwingine kwamba binadamu anaweza kubatilisha uamuzi wa mfano, na wakati mwingine kwamba binadamu anaelekeza kikamilifu mchakato wa kujifunza wakati wa sasa hivi. Hizi ni mambo tofauti yenye maana.

Sura hii inaainisha mazingira ya mwingiliano kati ya binadamu na mashine katika ML, ikitoa msamiati wa kidhana unaotumika katika sehemu iliyobaki ya kitabu hiki cha mwongozo.

---

## Viwango vya Otomatiki

Tofauti ya msingi zaidi ni jinsi binadamu anavyoshiriki kikamilifu katika ufanyaji maamuzi wa mfumo. Mfumo unaojulikana kutoka katika nadharia ya otomatiki {cite}`sheridan1992telerobotics` unatofautisha viwango kumi, lakini kwa madhumuni ya ML kategoria tatu zinanasa tofauti muhimu:

### Binadamu Katikati ya Mzunguko (HITL)

Binadamu ni *mshiriki tendaji katika mchakato wa kujifunza*. Maamuzi — au angalau maamuzi yenye matokeo makubwa — yanahitaji ingizo la binadamu kabla hayajafanyiwa mwisho. Mfumo hauwezi kufanya kazi bila ushirikiano unaoendelea wa binadamu.

*Mifano:* Mfumo wa ujifunzaji tendaji unaomuuliza daktari wa kliniki kabla ya kuongeza kesi kwenye data ya mafunzo. Mweka maelezo wa data anayeweka lebo kwa mifano ambayo inatumika mara moja kwa masasisho ya mfano. Mweka lebo wa RLHF anayelinganisha matokeo ya mfano.

### Binadamu Juu ya Mzunguko (HOTL)

Mfumo hufanya kazi kwa uhuru lakini binadamu unausimamia na anaweza kuingilia kati. Binadamu ni *msimamizi*, si mshiriki. Maoni yanaweza au yasirudi kwenye mafunzo.

*Mifano:* Mfumo wa usimamizi wa maudhui unaotia bendera kwenye machapisho kiotomatiki; mkaguzi wa binadamu anakagua na kurekebisha sehemu ya maamuzi. Rubani otomatiki anayeruka ndege lakini anaarifu rubani kuhusu hali zisizo za kawaida.

### Binadamu Anayeamuru (HIC)

Binadamu hufanya maamuzi yote; mfumo hutoa *mapendekezo au habari* lakini hauna uhuru wowote. Hii ni aina dhaifu zaidi ya utekelezaji wa ML.

*Mifano:* Mfumo wa msaada wa utambuzi unaoonyesha daktari makadirio ya uwezekano wa mfano lakini kuacha uamuzi wa mwisho kwa daktari kabisa.

```{admonition} Kiwango kipi ndicho sahihi?
:class: tip

Kiwango kinachofaa cha otomatiki kinategemea gharama ya makosa, utegemezi wa mfano, utaalamu wa binadamu wanaoweza kupatikana, na vikwazo vya muda wa kazi. Mambo haya yanabadilika kadri mfano unavyokomaa — mifumo mingi inaanza HITL na kuhamia HOTL kadri imani inavyoongezeka.
```

```text
Data ghafi --> Usindikaji wa awali --> Vipengele --> Mafunzo --> Tathmini --> Utekelezaji
    ^              ^                                    ^              ^              ^
    |              |                                    |              |              |
 Maoni ya       Uwekaji                            Ujifunzaji    Maoni ya       Ufuatiliaji
 ukusanyaji     maelezo                            tendaji       upimaji        na marekebisho
```

| Hatua         | Jukumu la binadamu                                        | Sura    |
|---------------|-----------------------------------------------------------|---------|
| Ukusanyaji    | Kuamua data ya kukusanya; mkakati wa sampuli              | 3, 4    |
| Uwekaji maelezo | Kutoa lebo, miundo, metadata                            | 3, 13   |
| Mafunzo       | Maswali ya ujifunzaji tendaji; maoni ya mtandaoni         | 4, 5, 6 |
| Tathmini      | Tathmini ya binadamu ya matokeo ya mfano                  | 14      |
| Utekelezaji   | Ufuatiliaji, ushughulikiaji wa matatizo, marekebisho      | 12, 14  |

---

## Ushiriki wa Binadamu wa Tendaji dhidi ya wa Passiv

Katika HITL *tendaji*, mfumo huchagua pointi za data zipi za kuwasilisha kwa binadamu — ukiuliza maswali kwa mkakati. Katika HITL *passiv*, binadamu hutoa maoni kuhusu data yoyote inayofika (k.m., vifurushi vya uwekaji lebo vilivyopangwa kwa mfululizo).

Ushiriki tendaji ni wa ufanisi zaidi kwa sababu maoni yanaelekeza mahali ambapo yataboresha zaidi mfano. Ushiriki passiv ni rahisi zaidi kutekeleza na kusimamia.

Tofauti inayohusiana ni kati ya maoni ya **vifurushi** na **mtandaoni**:

- **Vifurushi:** Binadamu huweka lebo kwenye hazina kubwa ya mifano; mfano unafunzwa tena. Rudia.
- **Mtandaoni (mtiririko):** Maoni ya binadamu yanafika kila wakati; mfano husasishwa kwa hatua ndogo ndogo.

Mifumo ya vifurushi ndiyo ya kawaida katika tasnia (miradi ya uwekaji maelezo inayofuatiwa na mwendo wa mafunzo). Mifumo ya mtandaoni ni ya asili zaidi kwa mifumo ya mwingiliano na mazingira ya ujifunzaji wa kuimarisha.

---

## Mweka Maelezo Mmoja dhidi ya Wengi

Wawasilishaji rasmi wengi wa HITL wanadhani mweka maelezo mmoja, thabiti. Katika mazoezi, uwekaji maelezo unahusisha watu wengi, na hukumu zao zinatofautiana.

**Ujumuishaji** huchanganya maelezo mengi kuwa lebo moja, kawaida kwa kura ya wingi au mfano wa takwimu (Sura ya 13).

**Kutokubaliana kama ishara** — watafiti wengine wanasema kwamba kutokubaliana kwa wawekaji maelezo ni habari yenye thamani ambayo haipaswi kupigwa chini kuwa lebo moja ya "dhahabu". Mbinu za mtazamo katika NLP, kwa mfano, huhifadhi maelezo mengi kama lebo laini zinazoakisi utata wa kweli wa data {cite}`uma2021learning`.

---

## Mfumo wa Umoja

Tunaweza kuwakilisha usanidi wowote wa HITL kwa tano-jozi:

$$
\text{usanidi wa HITL} = (\text{kiwango}, \text{hali}, \text{hatua}, \text{mara}, \text{wawekaji maelezo})
$$

ambapo:

- **kiwango** $\in$ {HITL, HOTL, HIC}
- **hali** $\in$ {lebo, marekebisho, maonyesho, upendeleo, lugha asilia, picha}
- **hatua** $\in$ {ukusanyaji, uwekaji maelezo, mafunzo, tathmini, utekelezaji}
- **mara** $\in$ {vifurushi, mtandaoni}
- **wawekaji maelezo** $\in \mathbb{N}^+$ (idadi ya wawekaji maelezo kwa kipengele)

Uainishaji huu unatuwezesha kulinganisha mifumo mbalimbali ya HITL kwenye mhimili sawa na kufikiria kuhusu maelewano kati yao. Sehemu iliyobaki ya kitabu hiki inaingia kwa kina katika seli maalum za nafasi hii.

```{seealso}
Kwa utafiti wa kimajaribio wa jinsi maamuzi ya uwekaji maelezo yanavyoathiri tabia ya mfano wa chini, angalia {cite}`bender2021stochastic`. Kwa mapitio ya mifumo ya ML ya mwingiliano, angalia {cite}`amershi2014power`.
```
