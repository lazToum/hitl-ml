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

# मूल्यांकन एवं मापदंड

यह जानना कि क्या आपकी HITL प्रणाली काम कर रही है, मॉडल सटीकता मापने से अधिक की आवश्यकता है। आपको यह जानना होगा कि क्या आपको अपने अनुलेखन बजट से मूल्य मिल रहा है, क्या मॉडल वास्तव में मानव इरादे के साथ बेहतर संरेखित है, और क्या अतिरिक्त मानव प्रतिक्रिया चीज़ों में सुधार जारी रखेगी। यह अध्याय HITL सेटिंग्स में मूल्यांकन के पूर्ण परिदृश्य को शामिल करता है।

---

## मॉडल-केंद्रित मेट्रिक्स

### वर्गीकरण मेट्रिक्स

**सटीकता** तब उपयुक्त है जब वर्ग संतुलित हों और सभी त्रुटियाँ समान रूप से महंगी हों।

**F1 स्कोर** प्रेसीजन और रिकॉल का हार्मोनिक माध्य है, असंतुलित वर्गों के लिए उपयुक्त।

**AUROC** थ्रेशोल्ड की परवाह किए बिना वर्गों के बीच भेद करने की मॉडल की क्षमता को मापता है।

**अंशांकन** मापता है कि भविष्यवाणी की गई प्रायिकताएँ अनुभवजन्य आवृत्तियों के साथ कितनी अच्छी तरह मेल खाती हैं।

### जेनरेटिव मॉडल मेट्रिक्स

- **BLEU / ROUGE / METEOR:** अनुवाद और सारांश के लिए संदर्भ-आधारित मेट्रिक्स।
- **Perplexity:** मॉडल होल्ड-आउट पाठ की भविष्यवाणी कितनी अच्छी तरह करता है।
- **BERTScore:** संदर्भों के साथ एम्बेडिंग-आधारित समानता।
- **मानव मूल्यांकन:** स्वर्ण मानक।

---

## अनुलेखन दक्षता मेट्रिक्स

### अधिगम वक्र

एक **अधिगम वक्र** लेबल किए गए उदाहरणों की संख्या के एक फ़ंक्शन के रूप में मॉडल प्रदर्शन को प्लॉट करता है।

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, roc_auc_score
from sklearn.model_selection import StratifiedShuffleSplit

rng = np.random.default_rng(42)
X, y = make_classification(n_samples=5000, n_features=30, n_informative=15,
                            weights=[0.8, 0.2], random_state=42)
X_test, y_test = X[4000:], y[4000:]
X_pool, y_pool = X[:4000], y[:4000]

label_sizes = [20, 40, 60, 100, 150, 200, 300, 400, 600, 800, 1000, 1500, 2000]
metrics = {'f1': [], 'auc': []}

for n in label_sizes:
    idx = rng.choice(len(X_pool), n, replace=False)
    clf = LogisticRegression(max_iter=500, class_weight='balanced')
    clf.fit(X_pool[idx], y_pool[idx])
    preds = clf.predict(X_test)
    probs = clf.predict_proba(X_test)[:, 1]
    metrics['f1'].append(f1_score(y_test, preds))
    metrics['auc'].append(roc_auc_score(y_test, probs))

# Fit learning curve: performance ≈ a - b/sqrt(n)
from scipy.optimize import curve_fit

def learning_curve_fn(n, a, b):
    return a - b / np.sqrt(n)

popt_f1, _ = curve_fit(learning_curve_fn, label_sizes, metrics['f1'], p0=[0.9, 2])
popt_auc, _ = curve_fit(learning_curve_fn, label_sizes, metrics['auc'], p0=[0.95, 1])

n_smooth = np.linspace(20, 3000, 200)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))

ax1.scatter(label_sizes, metrics['f1'], color='#2b3a8f', zorder=5, s=40)
ax1.plot(n_smooth, learning_curve_fn(n_smooth, *popt_f1), '--', color='#e05c5c',
         label=f'Fit: {popt_f1[0]:.3f} - {popt_f1[1]:.1f}/√n')
ax1.set_xlabel("Labeled examples"); ax1.set_ylabel("F1 score")
ax1.set_title("Learning Curve: F1"); ax1.legend(); ax1.grid(alpha=0.3)

ax2.scatter(label_sizes, metrics['auc'], color='#0d9e8e', zorder=5, s=40)
ax2.plot(n_smooth, learning_curve_fn(n_smooth, *popt_auc), '--', color='#e05c5c',
         label=f'Fit: {popt_auc[0]:.3f} - {popt_auc[1]:.2f}/√n')
ax2.set_xlabel("Labeled examples"); ax2.set_ylabel("AUROC")
ax2.set_title("Learning Curve: AUROC"); ax2.legend(); ax2.grid(alpha=0.3)

plt.tight_layout()
plt.savefig('learning_curves.png', dpi=150)
plt.show()

# Estimate the annotation budget needed to reach a target performance
target_f1 = 0.80
n_needed = (popt_f1[1] / (popt_f1[0] - target_f1)) ** 2
print(f"Estimated labels needed to reach F1={target_f1}: {n_needed:.0f}")
```

### निवेश पर वापसी (ROI) विश्लेषण

मानव प्रतिक्रिया का ROI उत्तर देता है: प्रत्येक अतिरिक्त लेबल के लिए, मॉडल प्रदर्शन कितना सुधरता है?

$$
\text{ROI}(n) = \frac{\Delta \text{performance}(n)}{\text{cost per label}}
$$

---

## मानव मूल्यांकन

### प्रत्यक्ष मूल्यांकन (DA)

अनुलेखक आउटपुट को एक पूर्ण पैमाने पर रेट करते हैं। DA को मशीन अनुवाद मूल्यांकन (WMT बेंचमार्क) में मानकीकृत किया गया है।

**DA के लिए सर्वोत्तम प्रथाएँ:**
- एंकरिंग को रोकने के लिए आउटपुट के क्रम को यादृच्छिक करें
- प्रति आइटम पर्याप्त संख्या में अनुलेखक (न्यूनतम 3–5)
- गुणवत्ता नियंत्रण शामिल करें
- समग्र स्कोर के साथ अंतर-अनुलेखक सहमति रिपोर्ट करें

### तुलनात्मक मूल्यांकन

अनुलेखक दो आउटपुट के बीच चुनते हैं। **ELO रेटिंग प्रणालियाँ** (शतरंज से उधार ली गई) युगल तुलना परिणामों को एक निरंतर गुणवत्ता रैंकिंग में परिवर्तित करती हैं।

```{code-cell} python
import numpy as np

def update_elo(rating_a, rating_b, outcome_a, k=32):
    """Update ELO ratings. outcome_a: 1=A wins, 0=B wins, 0.5=tie."""
    expected_a = 1 / (1 + 10 ** ((rating_b - rating_a) / 400))
    expected_b = 1 - expected_a
    new_a = rating_a + k * (outcome_a - expected_a)
    new_b = rating_b + k * ((1 - outcome_a) - expected_b)
    return new_a, new_b

# Simulate 5 model versions being compared pairwise
rng = np.random.default_rng(42)
true_quality = [0.60, 0.70, 0.75, 0.80, 0.85]  # underlying model quality
n_models = len(true_quality)
elo_ratings = {i: 1000.0 for i in range(n_models)}

for _ in range(500):  # 500 pairwise comparisons
    i, j = rng.choice(n_models, 2, replace=False)
    p_i_wins = true_quality[i] / (true_quality[i] + true_quality[j])
    outcome = 1.0 if rng.random() < p_i_wins else 0.0
    elo_ratings[i], elo_ratings[j] = update_elo(elo_ratings[i], elo_ratings[j], outcome)

print("ELO Rankings after 500 comparisons:")
sorted_models = sorted(elo_ratings.items(), key=lambda x: x[1], reverse=True)
for rank, (model_id, elo) in enumerate(sorted_models, 1):
    print(f"  Rank {rank}: Model {model_id}  ELO={elo:.1f}  True quality={true_quality[model_id]:.2f}")
```

### व्यवहार परीक्षण (CheckList)

**CheckList** {cite}`ribeiro2020beyond` NLP मॉडलों के व्यवस्थित व्यवहार मूल्यांकन के लिए एक पद्धति है:

- **न्यूनतम कार्यक्षमता परीक्षण (MFT):** क्या मॉडल सरल, स्पष्ट मामलों को संभालता है?
- **अपरिवर्तनशीलता परीक्षण (INV):** क्या मॉडल का आउटपुट तब बदलता है जब उसे नहीं बदलना चाहिए?
- **दिशात्मक अपेक्षा परीक्षण (DIR):** क्या मॉडल का आउटपुट इनपुट बदलने पर अपेक्षित दिशा में बदलता है?

---

## मानव इरादे के साथ संरेखण मापना

**पुरस्कार मॉडल मूल्यांकन:** होल्ड-आउट प्राथमिकता परीक्षण सेट पर पुरस्कार मॉडल की सटीकता।

**जीत दर:** दो मॉडल संस्करणों को देखते हुए, RLHF मॉडल मानव युगल तुलनाओं में कितने अंश प्रतिक्रियाएँ जीतता है?

**सहमत पहचान:** मापें कि क्या मॉडल निहित उपयोगकर्ता प्राथमिकता के आधार पर अपने उत्तर बदलता है।

---

## परिनियोजित प्रणालियों में A/B परीक्षण

प्रोडक्शन में प्रणालियों के लिए, अंतिम मूल्यांकन **A/B परीक्षण** है: उपयोगकर्ताओं के एक अंश को नए मॉडल संस्करण में रूट करें और डाउनस्ट्रीम परिणाम मापें।

```{seealso}
CheckList व्यवहार परीक्षण: {cite}`ribeiro2020beyond`। RLHF मूल्यांकन पद्धति के लिए, {cite}`ouyang2022training` देखें। MT में मानव मूल्यांकन सर्वोत्तम प्रथाओं के लिए: {cite}`graham2015accurate`। अधिगम वक्र सिद्धांत के लिए: {cite}`mukherjee2003estimating`।
```
