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

# स्वास्थ्य सेवा एवं विज्ञान में HITL

स्वास्थ्य सेवा और विज्ञान उन डोमेन का प्रतिनिधित्व करते हैं जहाँ HITL ML सबसे अधिक परिणामपूर्ण और सबसे अधिक बहस का विषय है। दांव ऊँचे हैं: एक चूका हुआ कैंसर निदान या एक त्रुटिपूर्ण दवा लक्ष्य का वास्तविक मानव लागत है। अनुलेखन के लिए दुर्लभ और महंगी विशेषज्ञता की आवश्यकता होती है।

लोकप्रिय कवरेज में प्रमुख फ्रेमिंग "AI बनाम मानव" है: क्या AI रेडियोलॉजिस्ट की जगह लेगा? यह फ्रेमिंग एक ऐसे तरीके से गलत है जो महत्त्वपूर्ण है। वास्तविक प्रश्न यह है कि मानव-AI सहयोग का कौन सा रूप अकेले किसी एक से बेहतर परिणाम उत्पन्न करता है।

---

## चिकित्सा छवि विश्लेषण

चिकित्सा इमेजिंग — रेडियोलॉजी (X-ray, CT, MRI), पैथोलॉजी, त्वचाविज्ञान, नेत्र विज्ञान — वह डोमेन है जहाँ चिकित्सा AI सबसे तेज़ी से आगे बढ़ी है।

### विशेषज्ञ अनुलेखक आवश्यकताएँ

चिकित्सा छवि अनुलेखन के लिए आमतौर पर विशिष्ट उपविशेषता प्रशिक्षण वाले चिकित्सकों की आवश्यकता होती है।

### अंतर-रेडियोलॉजिस्ट परिवर्तनशीलता

रेडर परिवर्तनशीलता रेडियोलॉजी में अच्छी तरह प्रलेखित है। CheXNet अध्ययन में, चार रेडियोलॉजिस्टों ने एक ही न्यूमोनिया पहचान परीक्षण सेट को F1 स्कोर के साथ लेबल किया जो लगभग 12 प्रतिशत बिंदुओं में फैले हुए थे {cite}`rajpurkar2017chexnet`।

:::{admonition} HITL सबक के रूप में CheXNet विवाद
:class: note

जब Rajpurkar et al. ने दावा किया कि उनका CheXNet मॉडल न्यूमोनिया पहचान पर "रेडियोलॉजिस्ट प्रदर्शन से अधिक" था, रेडियोलॉजी समुदाय ने तुरंत इसे चुनौती दी {cite}`yu2022assessing`। सबक यह है कि **प्रदर्शन तुलनाओं के लिए HITL सेटअप निर्दिष्ट करने की आवश्यकता होती है**।
:::

:::{admonition} चिकित्सा में नरम लेबल
:class: important

कई चिकित्सा AI परियोजनाओं ने **नरम लेबल** का उपयोग करना शुरू किया है जो एकल "स्वर्ण मानक" लेबल के बजाय विशेषज्ञ राय के वितरण को दर्शाते हैं।
:::

---

## नैदानिक NLP अनुलेखन

इलेक्ट्रॉनिक स्वास्थ्य रिकॉर्ड (EHR) में नैदानिक कथा पाठ का एक विशाल भंडार होता है।

**सामान्य नैदानिक NLP अनुलेखन कार्य:**
- **नैदानिक NER:** पाठ में दवाएँ, खुराक, निदान, प्रक्रियाएँ, और लक्षण पहचानना
- **नकारण पहचान:** "न्यूमोनिया का कोई प्रमाण नहीं" बनाम "न्यूमोनिया की पुष्टि"
- **अस्थायी तर्क:** वर्तमान स्थितियों को इतिहास से अलग करना
- **डी-पहचान:** डेटा साझाकरण सक्षम करने के लिए Protected Health Information (PHI) हटाना

---

## नियामक विचार

**FDA (संयुक्त राज्य):** AI/ML-आधारित Software as a Medical Device (SaMD) के लिए पूर्व-बाज़ार अनुमोदन या मंज़ूरी की आवश्यकता है।

**CE मार्किंग (यूरोप):** AI प्रणालियों सहित चिकित्सा उपकरणों को Medical Device Regulation (MDR) का पालन करना होगा।

---

## वैज्ञानिक डेटा अनुलेखन

### खगोलशास्त्र: Galaxy Zoo

Galaxy Zoo {cite}`lintott2008galaxy` ने नागरिक वैज्ञानिकों को Sloan Digital Sky Survey से आकाशगंगाओं के आकारिकीय वर्गीकरण के लिए भीड़ से जुटाया। मूल परियोजना ने 100,000 से अधिक स्वयंसेवकों से 40 मिलियन से अधिक वर्गीकरण एकत्र किए।

### जीनोमिक्स: रोगजनकता वर्गीकरण

जीनोमिक वेरिएंट को एनोटेट करना — यह तय करना कि कोई वेरिएंट रोगजनक, सौम्य, या अनिश्चित महत्त्व का है — एक उच्च-दांव की समस्या है।

### तंत्रिका विज्ञान: कनेक्टोमिक्स

इलेक्ट्रॉन माइक्रोस्कोप छवियों से तंत्रिका सर्किट का पुनर्निर्माण — कनेक्टोमिक्स — विशाल छवि स्टैक पर न्यूरॉन झिल्लियों के पिक्सेल-स्तर अनुलेखन की आवश्यकता है। Eyewire परियोजना ने इस कार्य को गेमिफाई किया।

---

## चिकित्सा इमेजिंग के लिए एक HITL सक्रिय अधिगम पाइपलाइन

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.datasets import make_classification
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

# Simulate a rare-pathology detection task
# 8% positive class (e.g., rare pathology)
X, y = make_classification(
    n_samples=5000, n_features=100,
    n_informative=20, n_redundant=10,
    weights=[0.92, 0.08],
    random_state=42
)
X_train, y_train = X[:4000], y[:4000]
X_test,  y_test  = X[4000:], y[4000:]

print(f"Training set positive prevalence: {y_train.mean():.1%}")

def run_medical_al(strategy, n_initial=50, budget=300):
    labeled = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled = [i for i in range(len(X_train)) if i not in labeled]
    aucs = []

    while len(labeled) < n_initial + budget:
        model = LogisticRegression(max_iter=500, class_weight='balanced')
        model.fit(X_train[labeled], y_train[labeled])

        if len(labeled) % 30 == 0:
            preds = model.predict_proba(X_test)[:, 1]
            aucs.append(roc_auc_score(y_test, preds))

        X_pool = X_train[unlabeled]
        if strategy == 'uncertainty' and len(labeled) >= 10:
            probs = model.predict_proba(X_pool)
            entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
            q = int(np.argmax(entropy))
        else:
            q = rng.integers(0, len(unlabeled))

        labeled.append(unlabeled.pop(q))

    return np.array(aucs)

aucs_al  = run_medical_al('uncertainty')
aucs_rnd = run_medical_al('random')
label_counts = np.arange(len(aucs_al)) * 30 + 50

plt.figure(figsize=(7, 4))
plt.plot(label_counts, aucs_al,  'o-',  color='#2b3a8f', linewidth=2, label='Uncertainty AL')
plt.plot(label_counts, aucs_rnd, 's--', color='#e05c5c', linewidth=2, label='Random baseline')
plt.xlabel("Expert labels obtained", fontsize=12)
plt.ylabel("AUROC", fontsize=12)
plt.title("Active Learning for Rare Pathology Detection", fontsize=13)
plt.legend(); plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('medical_al.png', dpi=150)
plt.show()

# Show how AL preferentially selects positive examples
n_init = 50
labeled_al  = list(rng.choice(len(X_train), n_init, replace=False))
labeled_rnd = labeled_al.copy()
unlabeled_al  = [i for i in range(len(X_train)) if i not in labeled_al]
unlabeled_rnd = unlabeled_al.copy()

model = LogisticRegression(max_iter=500, class_weight='balanced')
model.fit(X_train[labeled_al], y_train[labeled_al])
probs = model.predict_proba(X_train[unlabeled_al])
entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
top50_al  = [unlabeled_al[i] for i in np.argsort(entropy)[-50:]]
top50_rnd = list(rng.choice(unlabeled_rnd, 50, replace=False))

pos_rate_al  = y_train[top50_al].mean()
pos_rate_rnd = y_train[top50_rnd].mean()
print(f"\nPositive rate in next 50 queries:")
print(f"  Uncertainty AL: {pos_rate_al:.1%}  (base rate: {y_train.mean():.1%})")
print(f"  Random:         {pos_rate_rnd:.1%}")
print(f"  AL queries {pos_rate_al/y_train.mean():.1f}x more positives than random")
```

```{seealso}
Galaxy Zoo क्राउडसोर्सिंग: {cite}`lintott2008galaxy`। CheXNet रेडियोलॉजिस्ट प्रदर्शन: {cite}`rajpurkar2017chexnet`। रेडियोग्राफ़ गुणवत्ता और AI-सहायता प्राप्त निदान: {cite}`yu2022assessing`। नैदानिक NLP अनुलेखन पद्धति: {cite}`pustejovsky2012natural`।
```
