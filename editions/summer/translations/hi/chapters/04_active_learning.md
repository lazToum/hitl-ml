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

# सक्रिय अधिगम

लेबल किया गया डेटा महंगा है। सक्रिय अधिगम की मूल अंतर्दृष्टि यह है कि *सभी बिना लेबल के उदाहरण समान रूप से जानकारीपूर्ण नहीं होते* — एक मॉडल तेज़ी से सुधर सकता है यदि उसे यह चुनने का मौका मिले कि किन उदाहरणों के बारे में पूछना है। डेटा को यादृच्छिक रूप से लेबल करने के बजाय, एक सक्रिय अधिगम प्रणाली एक ओरेकल (आमतौर पर एक मानव अनुलेखक) से उन उदाहरणों पर क्वेरी करती है जो मॉडल को सबसे अधिक सुधारने की संभावना रखते हैं।

यह अध्याय सक्रिय अधिगम के सिद्धांत और व्यवहार को शामिल करता है: क्वेरी रणनीतियाँ, नमूनाकरण रूपरेखाएँ, रुकने के मानदंड, और वास्तविक परिनियोजन के लिए व्यावहारिक विचार।

---

## सक्रिय अधिगम की स्थापना

मानक **पूल-आधारित सक्रिय अधिगम** सेटिंग में शामिल हैं:

- एक **लेबल किया गया सेट** $\mathcal{L} = \{(x_i, y_i)\}_{i=1}^n$ — प्रारंभ में छोटा
- एक **बिना लेबल का पूल** $\mathcal{U} = \{x_j\}_{j=1}^m$ — आमतौर पर $\mathcal{L}$ से बहुत बड़ा
- एक **ओरेकल** $\mathcal{O}$ जो किसी भी क्वेरी किए गए $x$ के लिए $y = \mathcal{O}(x)$ लौटा सकता है
- एक **क्वेरी रणनीति** $\phi$ जो अगली क्वेरी $x^* = \phi(\mathcal{L}, \mathcal{U}, f_\theta)$ का चयन करती है

सक्रिय अधिगम लूप:

```text
    1. आरंभ करें: L = छोटा लेबल किया गया सीड सेट, U = बिना लेबल का पूल
    2. प्रशिक्षित करें: f_θ ← train(L)
    3. क्वेरी करें: x* = argmax φ(x; f_θ) over x ∈ U
    4. लेबल करें: y* = O(x*)
    5. अपडेट करें: L ← L ∪ {(x*, y*)}, U ← U \ {x*}
    → बजट समाप्त होने तक 2 से दोहराएँ
```

लक्ष्य जितने कम ओरेकल क्वेरी संभव हों उतने में एक लक्ष्य मॉडल गुणवत्ता तक पहुँचना है।

---

## सैद्धांतिक आधार

एक स्वाभाविक प्रश्न है: सक्रिय अधिगम कितनी मदद कर सकता है? सर्वोत्तम मामले में, सक्रिय अधिगम लेबल जटिलता में *घातीय* कमी प्राप्त कर सकता है — निष्क्रिय अधिगम द्वारा आवश्यक $O(1/\epsilon)$ के बजाय $O(\log(1/\epsilon))$ लेबल के साथ त्रुटि $\epsilon$ तक पहुँचना, कम से कम एक अच्छी क्वेरी रणनीति के साथ साकार सेटिंग्स में {cite}`settles2009active`।

व्यवहार में, गारंटी प्राप्त करना कठिन है। **अज्ञेयवादी सक्रिय अधिगम** {cite}`balcan2006agnostic` दर्शाता है कि लेबल बचत तब भी संभव है जब लक्ष्य अवधारणा परिकल्पना वर्ग में न हो, लेकिन बचत असहमति गुणांक पर दृढ़ता से निर्भर करती है।

---

## क्वेरी रणनीतियाँ

### अनिश्चितता नमूनाकरण

सबसे सरल और सबसे व्यापक रूप से उपयोग की जाने वाली रणनीति: उस उदाहरण पर क्वेरी करें जिस पर मॉडल *सबसे अधिक अनिश्चित* है {cite}`lewis1994sequential`।

**न्यूनतम विश्वास** उस उदाहरण की क्वेरी करता है जिस पर मॉडल अपनी शीर्ष भविष्यवाणी में सबसे कम आश्वस्त है:

$$
x^* = \argmax_{x \in \mathcal{U}} \left(1 - P_\theta(\hat{y} \mid x)\right)
$$

**मार्जिन नमूनाकरण** शीर्ष दो भविष्यवाणी प्रायिकताओं के बीच के अंतर पर विचार करता है:

$$
x^* = \argmin_{x \in \mathcal{U}} \left(P_\theta(\hat{y}_1 \mid x) - P_\theta(\hat{y}_2 \mid x)\right)
$$

**एंट्रॉपी नमूनाकरण** पूरे भविष्यवाणी वितरण का उपयोग करता है:

$$
x^* = \argmax_{x \in \mathcal{U}} \left( -\sum_{k=1}^K P_\theta(y_k \mid x) \log P_\theta(y_k \mid x) \right)
$$

एंट्रॉपी नमूनाकरण तीनों में सबसे सुव्यवस्थित है — यह सभी वर्गों पर विचार करता है — और आमतौर पर बहुवर्गीय समस्याओं पर दूसरों से बेहतर प्रदर्शन करता है।

### समिति द्वारा क्वेरी (QbC)

$C$ मॉडलों की एक **समिति** प्रशिक्षित करें (बैगिंग, विभिन्न आरंभिकरण, या विभिन्न आर्किटेक्चर का उपयोग करके)। उस उदाहरण पर क्वेरी करें जिस पर समिति सबसे अधिक असहमत हो:

$$
x^* = \argmax_{x \in \mathcal{U}} \; \text{disagreement}(\{f_c(x)\}_{c=1}^C)
$$

असहमति को **वोट एंट्रॉपी** (समिति के बहुमत वोटों पर एंट्रॉपी) या सर्वसम्मति वितरण से **KL विचलन** के रूप में मापा जा सकता है।

QbC एकल मॉडल की तुलना में बेहतर अनिश्चितता अनुमान प्रदान करता है लेकिन एकाधिक मॉडलों के प्रशिक्षण की आवश्यकता होती है, जो गणनात्मक रूप से महंगा है।

### अपेक्षित मॉडल परिवर्तन

उस उदाहरण की क्वेरी करें जो लेबल किए जाने पर वर्तमान मॉडल में सबसे बड़ा परिवर्तन करेगा। ग्रेडिएंट-आधारित मॉडलों के लिए, यह सबसे बड़े अपेक्षित ग्रेडिएंट परिमाण वाले उदाहरण से मेल खाता है {cite}`settles2008analysis`:

$$
x^* = \argmax_{x \in \mathcal{U}} \sum_{y \in \mathcal{Y}} P_\theta(y \mid x) \left\| \nabla_\theta \mathcal{L}(f_\theta(x), y) \right\|
$$

### कोर-सेट / ज्यामितीय दृष्टिकोण

अनिश्चितता-आधारित रणनीतियाँ **आउटलायर की ओर पूर्वाग्रहित** हो सकती हैं। कोर-सेट विधियाँ इसे एक विविध नमूने की तलाश करके संबोधित करती हैं जो विशेषता स्थान को कवर करता है।

**k-center greedy** एल्गोरिदम {cite}`sener2018active` बिंदुओं का सबसे छोटा सेट खोजता है जैसे कि प्रत्येक बिना लेबल का बिंदु कम से कम एक क्वेरी किए गए बिंदु के $\delta$ के भीतर हो:

$$
x^* = \argmax_{x \in \mathcal{U}} \min_{x' \in \mathcal{L}} d(x, x')
$$

### BADGE

**Batch Active learning by Diverse Gradient Embeddings** {cite}`ash2020deep` अनिश्चितता और विविधता को जोड़ता है: यह उदाहरणों का एक बैच चुनता है जिनके ग्रेडिएंट एम्बेडिंग (भविष्यवाणी किए गए लेबल के संबंध में) परिमाण में बड़े (अनिश्चित) और विविध (ग्रेडिएंट स्थान के विभिन्न क्षेत्रों को कवर करते हुए) दोनों हों। यह सबसे प्रतिस्पर्धी आधुनिक रणनीतियों में से एक है।

---

## गहन मॉडलों के लिए अनिश्चितता अनुमान

ऊपर की रणनीतियाँ मॉडल से अंशांकित प्रायिकता आउटपुट तक पहुँच मानती हैं। सरल मॉडलों के लिए यह सीधा है। गहन नेटवर्क के लिए, विश्वसनीय अनिश्चितता अनुमान प्राप्त करने के लिए अतिरिक्त तकनीक की आवश्यकता है।

### दो प्रकार की अनिश्चितता

Kendall and Gal {cite}`kendall2017uncertainties` के अनुसार:

**आलेटोरिक अनिश्चितता** (डेटा अनिश्चितता): अवलोकनों में अंतर्निहित शोर जिसे अधिक डेटा एकत्र करके कम नहीं किया जा सकता।

**एपिस्टेमिक अनिश्चितता** (मॉडल अनिश्चितता): सीमित प्रशिक्षण डेटा के कारण अनिश्चितता। एपिस्टेमिक अनिश्चितता *अधिक डेटा लेबल करके कम की जा सकती है* — और इसलिए सक्रिय अधिगम क्वेरी चयन के लिए प्रासंगिक मात्रा है।

### Monte Carlo Dropout

तंत्रिका नेटवर्क के लिए एपिस्टेमिक अनिश्चितता अनुमान के लिए एक व्यावहारिक दृष्टिकोण है **MC Dropout** {cite}`gal2016dropout`: अनुमान समय पर ड्रॉपआउट लागू करें और $T$ आगे के पास चलाएँ।

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn

torch.manual_seed(42)
rng = np.random.default_rng(42)

class MCDropoutNet(nn.Module):
    def __init__(self, input_dim=20, hidden=64, output_dim=2, p_drop=0.3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden), nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, hidden),    nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, output_dim)
        )

    def forward(self, x):
        return self.net(x)

def mc_uncertainty(model, x, T=30):
    """
    Run T stochastic forward passes with dropout active.
    Returns mean prediction and epistemic uncertainty (predictive variance).
    """
    model.train()  # keep dropout active during inference
    with torch.no_grad():
        preds = torch.stack([
            torch.softmax(model(x), dim=-1) for _ in range(T)
        ])  # shape: (T, N, C)
    mean_pred = preds.mean(0)
    # Epistemic uncertainty: mean of variances across passes
    epistemic = preds.var(0).sum(-1)
    # Aleatoric uncertainty: entropy of mean prediction
    aleatoric = -(mean_pred * (mean_pred + 1e-9).log()).sum(-1)
    return mean_pred, epistemic, aleatoric

# Quick demonstration
model = MCDropoutNet(input_dim=20, output_dim=2)
# In-distribution example (simulated)
x_familiar   = torch.randn(1, 20) * 0.5
# Out-of-distribution example (far from training distribution)
x_unfamiliar = torch.randn(1, 20) * 3.0

for name, x in [("In-distribution ", x_familiar), ("Out-of-distribution", x_unfamiliar)]:
    _, ep, al = mc_uncertainty(model, x)
    print(f"{name} | epistemic: {ep.item():.4f} | aleatoric: {al.item():.4f}")
```

---

## एक पूर्ण सक्रिय अधिगम लूप

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from copy import deepcopy

rng = np.random.default_rng(42)

# Generate dataset
X, y = make_classification(
    n_samples=2000, n_features=20, n_informative=10,
    n_classes=3, n_clusters_per_class=1, random_state=42
)
X_train, y_train = X[:1500], y[:1500]
X_test,  y_test  = X[1500:], y[1500:]

def entropy_query(model, X_pool):
    """Return index of most uncertain sample (entropy)."""
    probs = model.predict_proba(X_pool)
    ent = -np.sum(probs * np.log(probs + 1e-9), axis=1)
    return np.argmax(ent)

def random_query(X_pool):
    """Random baseline."""
    return rng.integers(0, len(X_pool))

def run_active_learning(strategy='entropy', n_initial=30, n_queries=120, query_batch=5):
    labeled_idx = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled_idx = [i for i in range(len(X_train)) if i not in labeled_idx]
    accs = []

    for step in range(n_queries // query_batch):
        model = LogisticRegression(max_iter=500, C=1.0)
        model.fit(X_train[labeled_idx], y_train[labeled_idx])
        accs.append(accuracy_score(y_test, model.predict(X_test)))

        # Query
        X_pool = X_train[unlabeled_idx]
        for _ in range(query_batch):
            if strategy == 'entropy':
                q = entropy_query(model, X_pool)
            else:
                q = random_query(X_pool)
            labeled_idx.append(unlabeled_idx.pop(q))
            X_pool = X_train[unlabeled_idx]

    return np.array(accs)

labels_used = np.arange(1, 25) * 5 + 30  # label counts at each step

accs_active = run_active_learning(strategy='entropy')
accs_random = run_active_learning(strategy='random')

plt.figure(figsize=(8, 5))
plt.plot(labels_used, accs_active, 'o-', label='Entropy sampling', color='#2b3a8f', linewidth=2)
plt.plot(labels_used, accs_random, 's--', label='Random baseline',  color='#e05c5c', linewidth=2)
plt.xlabel("Number of labeled examples", fontsize=12)
plt.ylabel("Test accuracy", fontsize=12)
plt.title("Active Learning vs. Random Sampling", fontsize=13)
plt.legend(fontsize=11)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('active_learning_curve.png', dpi=150)
plt.show()

print(f"Active learning reaches {accs_active[-1]:.3f} accuracy")
print(f"Random sampling reaches {accs_random[-1]:.3f} accuracy")
print(f"Active learning saves ~{int((accs_random.tolist().index(min(accs_random, key=lambda a: abs(a-accs_active[-1]))) - len(accs_active) + 1) * 5)} labels to match random's final accuracy")
```

---

## कोल्ड स्टार्ट समस्या

सक्रिय अधिगम के लिए बिना लेबल के बिंदुओं को स्कोर करने के लिए एक प्रशिक्षित मॉडल की आवश्यकता होती है — लेकिन शुरुआत में आपके पास कोई (या बहुत कम) लेबल किए गए उदाहरण नहीं होते। यही **कोल्ड स्टार्ट समस्या** है।

व्यावहारिक समाधान:

1. **यादृच्छिक आरंभिकरण:** सक्रिय अधिगम शुरू करने से पहले एक छोटा यादृच्छिक सीड सेट (20–100 उदाहरण) लेबल करें।
2. **क्लस्टरिंग-आधारित आरंभिकरण:** बिना लेबल के पूल पर k-means उपयोग करें; प्रत्येक क्लस्टर से एक उदाहरण लेबल करें।
3. **एम्बेडिंग-आधारित चयन:** उदाहरणों को एम्बेड करने के लिए एक पूर्व-प्रशिक्षित एनकोडर का उपयोग करें; कोर-सेट के माध्यम से एक विविध उपसमुच्चय चुनें।

---

## बैच-मोड सक्रिय अधिगम

व्यवहार में, अनुलेखक बैच में काम करते हैं — प्रत्येक एकल लेबल के बाद एक नया मॉडल प्रशिक्षित और परिनियोजित करना अक्षम है। **बैच-मोड सक्रिय अधिगम** एक साथ लेबल करने के लिए $b$ उदाहरणों का एक सेट चुनता है।

**निर्धारक बिंदु प्रक्रियाएँ (DPPs)** विविध बैच नमूने के लिए एक सिद्धांतसम्मत तरीका प्रदान करती हैं।

---

## रुकने के मानदंड

सक्रिय अधिगम कब रोकना चाहिए? सामान्य मानदंड:

- **बजट समाप्त:** सबसे सरल — जब अनुलेखन बजट समाप्त हो जाए तो रोकें।
- **प्रदर्शन पठार:** जब एक होल्ड-आउट सत्यापन सेट पर मॉडल सटीकता $k$ लगातार राउंड के लिए $\delta$ से अधिक नहीं सुधरी हो।
- **विश्वास सीमा:** जब बिना लेबल के उदाहरणों का एक निश्चित अंश से कम एक सीमा से ऊपर अनिश्चितता हो।
- **अधिकतम हानि कमी:** अतिरिक्त लेबल से अधिकतम संभव लाभ का अनुमान लगाएँ; जब यह एक सीमा से नीचे गिरे तो रोकें {cite}`bloodgood2009method`।

---

## सक्रिय अधिगम कब काम करता है (और कब नहीं)

सक्रिय अधिगम अच्छा काम करता है जब:
- लेबलिंग महंगी है और बिना लेबल का पूल बड़ा है
- डेटा में स्पष्ट संरचना है जिसका मॉडल सूचनाप्रद उदाहरणों की पहचान करने के लिए उपयोग कर सकता है
- मॉडल वर्ग कार्य के लिए उपयुक्त है

सक्रिय अधिगम खराब प्रदर्शन करता है जब:
- प्रारंभिक मॉडल बहुत खराब है (कोल्ड स्टार्ट) और उदाहरणों को सार्थक रूप से रैंक नहीं कर सकता
- क्वेरी रणनीति आउटलायर या गलत-लेबल किए गए उदाहरण चुनती है
- बिना लेबल के पूल और परीक्षण वितरण के बीच डेटा वितरण बदलता है

```{seealso}
मूलभूत सर्वेक्षण {cite}`settles2009active` है। सैद्धांतिक आधार (लेबल जटिलता, अज्ञेयवादी सीमाएँ): {cite}`balcan2006agnostic`। गहन अधिगम-विशिष्ट सक्रिय अधिगम के लिए, {cite}`ash2020deep` (BADGE) और {cite}`sener2018active` (कोर-सेट) देखें। जब सक्रिय अधिगम वास्तव में मदद करता है तो एक महत्वपूर्ण मूल्यांकन के लिए, {cite}`lowell2019practical` देखें। गहन मॉडलों के लिए आलेटोरिक बनाम एपिस्टेमिक अनिश्चितता पर, {cite}`kendall2017uncertainties` देखें; अनिश्चितता अनुमानकों के रूप में गहन पहनावा के लिए, {cite}`lakshminarayanan2017simple` देखें; MC Dropout के लिए, {cite}`gal2016dropout` देखें।
```
