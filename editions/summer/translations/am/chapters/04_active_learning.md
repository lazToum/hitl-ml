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

# ንቁ ትምህርት

የሚለጠፈ ውሂቡ ዋጋ አለ። ንቁ ትምህርቱ ዋናው ሃሳቡ *ሁሉ ሳይለጠፉ ምሳሌዎቹ ዋናቱ ተመሳሳይ አይደሉ* — ሞዴሉ ምን ምሳሌዎቹ ሊጠይቁ ሊምርጡ ቢቻሉ ቶሎ ሊሻሻሉ ይዟሉ። ምናምን ሆኖ ውሂቡ ሊለጥፉ ሳይሄዱ፣ ንቁ ትምህርቱ ሥርዓቱ ሞዴሉ ሁሉ ሊሻሻሉ ሁሉ ምሳሌዎቹ ሁሉ ዐዋቂ (ብዙ ጊዜ ሰው ትርጓሜ ሰጪ) ሊጠይቁ ይዟሉ።

ይህ ምዕራፍ ንቁ ትምህርቱ ቲዎሪና ሥራ ይሸፍናሉ፦ ጥያቄ ስልቶቹ፣ ናሙናው ማዕቀፎቹ፣ ማቆሚያ ምልክቶቹ፣ እና ዕውነተኛ ሰፊ ሥራ ሁሉ ተጨባጭ ሁኔታዎቹ።

---

## ንቁ ትምህርቱ አዋቅሩ

ምናምን **ዝርዝሩ-ሁሉ ንቁ ትምህርቱ** ሁኔታ ያካትታሉ፦

- **የሚለጠፈ ስብስቡ** $\mathcal{L} = \{(x_i, y_i)\}_{i=1}^n$ — ቀደምቱ አነስ
- **ሳይለጠፉ ዝርዝሩ** $\mathcal{U} = \{x_j\}_{j=1}^m$ — ብዙ ጊዜ $\mathcal{L}$ ሁሉ ሰፊ
- **ዐዋቂ** $\mathcal{O}$ ማናቸውም የሚጠይቁ $x$ ሁሉ $y = \mathcal{O}(x)$ ሊሰጡ ይዟሉ
- **ጥያቄ ስልቱ** $\phi$ ቀጣዩ ጥያቄ $x^* = \phi(\mathcal{L}, \mathcal{U}, f_\theta)$ ሊምርጡ ይዟሉ

ንቁ ትምህርቱ ቀለበቱ፦

```text
    1. ጀምሩ: L = አነስ ሆኖ የሚለጠፉ ዘር ስብስቡ, U = ሳይለጠፉ ዝርዝሩ
    2. ሰልጥን: f_θ ← train(L)
    3. ጠይቅ: x* = argmax φ(x; f_θ) over x ∈ U
    4. ለጥፍ: y* = O(x*)
    5. ዘምን: L ← L ∪ {(x*, y*)}, U ← U \ {x*}
    → ከ2 ደጋግሙ በጀቱ ሙሉ ሲሆን
```

ዓላማው ሁሉ ዐዋቂ ጥያቄዎቹ ሊቀንሱ ተሞርኩዞ ዒላማ ሞዴሉ ጥራቱ ሊደርሱ ነው።

---

## ቲዎሪያዊ መሠረቶቹ

ዕውን ጥያቄ ይነሳሉ፦ ንቁ ትምህርቱ ምን ያህሉ ሊረዱ ይዟሉ? ሁሉ ጥሩ ሁኔታ ንቁ ትምህርቱ *ሂሳዊ* ቁጥሩ ቀንሶ ሊደርሱ ይዟሉ — $O(\log(1/\epsilon))$ መለያዎቹ ሁሉ ስህተቱ $\epsilon$ ሊደርሱ ምናምን ትምህርቱ ሚፈልገው $O(1/\epsilon)$ ሳይሆን፣ ቢያንስ ጥሩ ጥያቄ ስልቱ ሁሉ ሊደርሱ ዶሜይን ሁሉ {cite}`settles2009active`።

ሥራ ላይ ዋስትናዎቹ ሊያገኙ ቸር ነው። **ምናምን ንቁ ትምህርቱ** {cite}`balcan2006agnostic` ዒላማ ሃሳቡ ሂፖቴሲስ ምድቡ ውስጥ ሳይሆን ሳለ ሳይቀሩ መለያ ቁጠባዎቹ ሊደርሱ ይዟሉ ሁሉ ይዟሉ ግን ቁጠባዎቹ አለመስማማቱ ቅዋሜ ላይ ሰፊ ይወሰናሉ — ውሂቡ ሲሰበሰቡ ሊደርሱ ምናምን ሂፖቴሲሶቹ ቡድኑ ምን ያህሉ ቶሎ ሊቀንሱ ቁጥሩ።

ዋናው ተጨባጭ ምሳሌ፦ ንቁ ትምህርቱ ጥቅሙ **ወሳኔ ድንበሩ ቀላሉ እና ተሰብሳቢ** ሲሆን (ስለዚህ እርግጠኛ ሳይሆን ጥያቄዎቹ ስህተቱ ሂፖቴሲሶቹ ቶሎ ሊያስወጡ ይዟሉ) ሰፊ ነው፣ ሂፖቴሲስ ምድቡ ትልቅ ወይም ድንበሩ ቸር ሲሆን ዝቅ ያለ ነው።

---

## ጥያቄ ስልቶቹ

### እርግጠኛ ሳይሆን ናሙናው

ቀላሉ እና ሰፊ ጥቅም ላይ ሚውሉ ስልቱ፦ ሞዴሉ *ሁሉ ዝቅ ያለ እርግጠኛ ሆኖ* ያለ ምሳሌ ሊጠይቁ {cite}`lewis1994sequential`።

**ዝቅ ያለ እምነቱ** ሞዴሉ ዋናው ትንቢቱ ሁሉ ዝቅ ያለ እምነቱ ያለ ምሳሌ ሊጠይቁ ይዟሉ፦

$$
x^* = \argmax_{x \in \mathcal{U}} \left(1 - P_\theta(\hat{y} \mid x)\right)
$$

**ድንበሩ ናሙናው** ሁለቱ ትንቢቶቹ ሁሉ ምናምን ሁሉ ልዩነቱ ሊያስቡ ይዟሉ፦

$$
x^* = \argmin_{x \in \mathcal{U}} \left(P_\theta(\hat{y}_1 \mid x) - P_\theta(\hat{y}_2 \mid x)\right)
$$

**ኤንትሮፒ ናሙናው** ሙሉ ትንቢቱ ስርጭቱ ሊጠቀሙ ይዟሉ፦

$$
x^* = \argmax_{x \in \mathcal{U}} \left( -\sum_{k=1}^K P_\theta(y_k \mid x) \log P_\theta(y_k \mid x) \right)
$$

ኤንትሮፒ ናሙናው ሦስቱ ሁሉ ሁሉ ምድቦቹ ሁሉ ሊያስቡ ሁሉ ሁሉ ዋናቱ ናቸው — ብዙ ምድቦቹ ሥራ ሁሉ ሌሎቹ ሁሉ ሰፊ ሊሻሻሉ ይዟሉ።

### ኮሚቴ ሁሉ ጥያቄ (QbC)

$C$ ሞዴሎቹ **ኮሚቴ** ሊሰለጥኑ (ባጊንግ፣ ልዩ ጅምሮቹ፣ ወይም ልዩ አርኪቴክቸሮቹ ጥቅም ላይ ሲያውሉ)። ኮሚቴው ሁሉ ዝቅ ያለ ስምምነቱ ያለ ምሳሌ ሊጠይቁ ይዟሉ፦

$$
x^* = \argmax_{x \in \mathcal{U}} \; \text{disagreement}(\{f_c(x)\}_{c=1}^C)
$$

አለመስማማቱ **ድምፅ ኤንትሮፒ** (ኮሚቴው ብዙ ድምፆቹ ሁሉ ኤንትሮፒ) ወይም ምሳሌ ስርጭቱ ሁሉ **KL ልዩ ርቀቱ** ሆኖ ሊለካ ይዟሉ።

QbC አንድ ሞዴሉ ሁሉ ሊሻሻሉ እርግጠኛ ሳይሆን ምናምን ሊሰጡ ነገር ግን ብዙ ሞዴሎቹ ሊሰለጥኑ ሃሳባዊ ወጪ ሰፊ ነው።

### የሚጠበቀው ሞዴሉ ለውጡ

ሊለጠፉ ቢሆን ሁሉ ሞዴሉ ሁሉ ሰፊ ለውጡ ሊፈጥሩ ያለ ምሳሌ ሊጠይቁ ይዟሉ። ግሬዲዬንቱ ሞዴሎቹ ሁሉ ይህ ሁሉ ሰፊ የሚጠበቀው ግሬዲዬንቱ ዐቢይ ምሳሌ ጋር ሊስማሙ ይዟሉ {cite}`settles2008analysis`፦

$$
x^* = \argmax_{x \in \mathcal{U}} \sum_{y \in \mathcal{Y}} P_\theta(y \mid x) \left\| \nabla_\theta \mathcal{L}(f_\theta(x), y) \right\|
$$

ይህ ስልቱ ጠንካራ ቲዎሪያዊ ምሳሌ አለ ነገር ግን ለእያንዳንዱ እጩ ምሳሌ ሁሉ ሊሰሉ ሰፊ ሞዴሎቹ ሁሉ ዋጋ ሰፊ ነው።

### ዋናው-ስብስቡ / ጂዎሜትሪካዊ አቀራረቦቹ

እርግጠኛ ሳይሆን ስልቶቹ **ወጪ ሁሉ ዘምን ያለ** ሊሆኑ ይዟሉ፦ ያልተለምዶ ምሳሌ ሰፊ እርግጠኛ ሳይሆን ሊሆን ይዟሉ ግን ውሂቡ ስርጭቱ ምሳሌ ሊሆን አይዟሉ። ዋናው-ስብስቡ ዘዴዎቹ ባሕሪ ቦታ ሊሸፍኑ ልዩ ናሙናው ሊፈልጉ ይህን ሊፈቱ ይዟሉ።

**k-ማዕከሉ ሁሉ ጉርሻ** ቀመሩ {cite}`sener2018active` ሁሉ ሳይለጠፉ ነጥቦቹ ቢያንስ አንዱ የሚጠይቁ ነጥቡ ሁሉ $\delta$ ውስጥ ሁሉ ያቃርቡ ሁሉ ሁሉ ዝቅ ያለ ስብስቡ ሊያገኙ ይዟሉ፦

$$
x^* = \argmax_{x \in \mathcal{U}} \min_{x' \in \mathcal{L}} d(x, x')
$$

ማናቸውም ሁሉ ሚለጠፉ ነጥቡ ሁሉ ዝቅ ያለ ነጥቡ ጠይቁ ማለት ነው። ይህ ጥሩ ሆኖ ሰፊ ትርጓሜዎቹ ስብስቡ ሊፈጥሩ ያበረታታሉ።

### BADGE

**ልዩ ግሬዲዬንቱ ምሥጢሮቹ ሁሉ ቡድን ንቁ ትምህርቱ** {cite}`ash2020deep` እርግጠኛ ሳይሆን ናሙናውን እና ልዩነቱን ሊያዋሃዱ ይዟሉ፦ (የሚጠበቀው መለያ ሁሉ) ግሬዲዬንቱ ምሥጢሮቻቸው ሁሉ ምሳሌዎቹ ቡድኑ ሊምርጡ ሁሉ ዐቢይ (እርግጠኛ ሳይሆን) እና ልዩ (ግሬዲዬንቱ ቦታ ልዩ ቦታዎቹ ሸፍኖ) ሁሉ ናቸው። ይህ ዘመናዊ ሁሉ ሰፊ ተወዳዳሪ ስልቶቹ አንዱ ነው።

---

## ጥልቅ ሞዴሎቹ ሁሉ እርግጠኛ ሳይሆን ምናምን

ሁሉ ስልቶቹ ሞዴሉ ሁሉ ምናምን ምናምን ውጤቶቹ ሊደርሱ ያሳያሉ። ቀላሉ ሞዴሎቹ (ሎጂስቲካዊ ሬግሬሽን፣ ሶፍትማክስ ምደቦቹ) ሁሉ ይህ ቀላሉ ነው። ጥልቅ ኔትዎርኮቹ ሁሉ ሊታመን ሊሆኑ እርግጠኛ ሳይሆን ምናምን ሊፈልጉ ተጨማሪ ዘዴ ይፈልጋሉ።

### ሁለቱ ዓይነቶቹ እርግጠኛ ሳይሆን

ኬንዳሉ እና ጋሉን {cite}`kendall2017uncertainties` ሁሉ ተከታዮ ይዟሉ፦

**አሌዓቲካዊ እርግጠኛ ሳይሆን** (ውሂቡ እርግጠኛ ሳይሆን)፦ ቁጥቃጤ ሙሉ ያሉ ምልከታዎቹ ሁሉ ውሂቡ ሊሰበሰቡ ሊቀንሱ የማይቻሉ ዕውነተኛ ሁኔታ። ብዥ ምስሉ አሌዓቲካዊ ሁኔታ ነው — ያው ስርጭቱ ሁሉ ሰፊ ሆኖ ተጨማሪ ስልጠናቸው ውሂቡ ሞዴሉ ሁሉ ሁሉ ዝቅ ያለ ምናምን ሊሆን አያደርጋቸውም።

**ኤፒስቴሚካዊ እርግጠኛ ሳይሆን** (ሞዴሉ እርግጠኛ ሳይሆን)፦ ተወሰን ስልጠናቸው ውሂቡ ወይም ሞዴሉ ሰለ ምሳሌዎቹ ሳያዩ ምክንያቱ እርግጠኛ ሳይሆን። ኤፒስቴሚካዊ እርግጠኛ ሳይሆን ሙሉ ውሂቡ ሊሰቡ *ሊቀንሱ ይዟሉ* — ስለዚህ ንቁ ትምህርቱ ጥያቄ ምርጫ ሁሉ ዋናቱ ዐቅ ነው።

ንቁ ትምህርቱ ሁሉ፣ ሰፊ ኤፒስቴሚካዊ ሁሉ ሚያሉ ምሳሌዎቹ ሊጠይቁ እንፈልጋለን፣ ሰፊ አሌዓቲካዊ ሳይሆን። ሙሉ ብዥ ምሳሌ ሊጠይቁ ዐዋቂው ጥረቱ ሊባክን ይዟሉ፦ ሊሰጡ ምንም መለያ ሙሉ ትክክለኛ አይደለም።

### MC ድሮፕዓውት

ኒውራል ኔትዎርኮቹ ሁሉ ኤፒስቴሚካዊ እርግጠኛ ሳይሆን ምናምን ሁሉ ተጨባጭ አቀራረቡ **MC ድሮፕዓውት** {cite}`gal2016dropout` ነው፦ ምናምን ሰዓቱ ሁሉ ድሮፕዓውት ሊጠቀሙ እና $T$ ፊት-ሂደቶቹ ሊሮጡ ይዟሉ። ትንቢቶቹ ሁሉ ልዩነቱ ኤፒስቴሚካዊ እርግጠኛ ሳይሆን ምናምን ነው።

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

ሁሉ ሁሉ ሰለጠኑ ኔትዎርኩ ሁሉ ሁለቱ ምሳሌዎቹ ተመሳሳይ እርግጠኛ ሳይሆን ሊያሳዩ ይዟሉ። ሰልጥኖ ከዚያ፣ ውጪ-ስርጭቱ ምሳሌ ሰፊ ኤፒስቴሚካዊ እርግጠኛ ሳይሆን ሊያሳዩ ይዟሉ — ሞዴሉ ስልጠናቸው ስርጭቱ ሁሉ ዙሪያ ሁሉ ምልክቶቹ ሁሉ ሊታመን ሊሆን አልቻሉም።

### ጥልቅ ስብስቦቹ

$M$ ዕጥፍ ዕጥፍ ሊጀምሩ ሞዴሎቹ ሰልጥኖ ትንቢቶቻቸው አማካዩ MC ድሮፕዓውት ሁሉ ቀላሉ እና ብዙ ጊዜ ሊታመን ሊሆን እርግጠኛ ሳይሆን ምናምን ሊሰጡ ይዟሉ {cite}`lakshminarayanan2017simple`። ስብስቡ አካላት ሁሉ አለመስማማቱ ኤፒስቴሚካዊ እርግጠኛ ሳይሆን ምልክቱ ነው።

ሰፊ ንቁ ትምህርቱ ሁሉ MC ድሮፕዓውቱ እና ጥልቅ ስብስቦቹ $T$ ወይም $M$ ፊት-ሂደቶቹ ሁሉ ምናምን ሰፊ ጨምሩ ያበረታቱ ይዟሉ። ሥራ ላይ $T = 10$–$30$ MC ድሮፕዓውቱ ወይም $M = 5$ ስብስቡ አካላት ምናምን ምናምን ዋጋ ጥሩ ሰለሆነ ሳለ ሳይቀሩ ምሳሌዎቹ ኤፒስቴሚካዊ እርግጠኛ ሳይሆን ሁሉ ደረጃ ሊሰጡ ሰፊ ይቻላሉ።

---

## ሙሉ ንቁ ትምህርቱ ቀለበቱ

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

## ቀዝቃዛ ጅምሩ ችግሩ

ንቁ ትምህርቱ ሳይለጠፉ ነጥቦቹ ሊሰጡ ሰለጠነ ሞዴሉ ይፈልጋሉ — ግን ጅምሩ ሁሉ፣ ምንም (ወይም ጣቢያ ትንሽ) ሚለጠፉ ምሳሌዎቹ ሌለዎ ይዟሉ። ይህ **ቀዝቃዛ ጅምሩ ችግሩ** ነው።

ተጨባጭ ፍቱ ናቸው፦

1. **ምናምን ጅምሩ፦** ንቁ ትምህርቱ ሲጀምሩ ከምን አነስ ምናምን ዘር ስብስቡ (20–100 ምሳሌዎቹ) ሊለጥፉ።
2. **ስብስቡ-ሁሉ ጅምሩ፦** ሳይለጠፉ ዝርዝሩ ሁሉ k-ኢናን ሊጠቀሙ፤ ከእያንዳንዱ ስብስቡ አንዱ ምሳሌ ሊለጥፉ። ይህ ሁሉ ሙሉ ያለ ሊለጠፉ ዝርዝሩ ሁሉ ልዩነቱ ሊያረጋግጡ ይዟሉ።
3. **ምሥጢሩ-ሁሉ ምርጫ፦** ምሳሌዎቹ ሊሸፍኑ ቀደምቱ ሰለጠነ ምሳሌ ኮደሩ ሊጠቀሙ፤ ዋናው-ስብስቡ ሁሉ ልዩ ንዑስ ስብስቡ ሊምርጡ።

ሁሉ ሥራዎቹ ሁሉ ጥቂቱ አስርዎቹ ምናምን ዘር መለያዎቹ ሁሉ ንቁ ትምህርቱ ሊጀምሩ ሰፊ ናቸው፤ ዕውን ቁጥሩ ምድቡ ሚዛኑ፣ ባሕሪ ዐቢይ ቁጥሩ፣ እና ሞዴሉ ቸርነቱ ሁሉ ይወሰናሉ።

---

## ቡድን ዓይነቱ ንቁ ትምህርቱ

ሥራ ላይ ትርጓሜ ሰጪዎቹ ቡድን ሆኖ ሠሩ — ሁሉ አንዱ መለያ ሁሉ አዲስ ሞዴሉ ሊሰለጥኑ ሊሰፍሩ ቀናቱ ነው። **ቡድን ዓይነቱ ንቁ ትምህርቱ** $b$ ምሳሌዎቹ ስብስቡ ሁሉ ተደራቢ ሆኖ ሊምርጡ ይዟሉ።

ዋናቱ $b$ ሁሉ ዝቅ ያለ እርግጠኛ ሳይሆን ምሳሌዎቹ ሊምርጡ **ድፍደፋ** ይወስዳሉ፦ ሰፊ እርግጠኛ ሳይሆን ምሳሌዎቹ ሁሉ ሊሰበሰቡ ይዟሉ (ሰለምሳሌ ያው ቦታ ወሳኔ ድንበሩ ዙሪያ ምሳሌዎቹ)። ጥሩ ቡድን ስልቶቹ ቡድኑ ሁሉ እርግጠኛ ሳይሆን *እና* ልዩነቱ ሁሉ ሊሻሻሉ ይዟሉ።

**ዲቴርሚናንታዊ ነጥቡ ሂደቶቹ (DPPs)** ልዩ ቡድኖቹ ሊቀምሩ ዋናቱ ዘዴ ሰጡ፦ ተመሳሳይ ዕቃዎቹ ሊቀጡ ንዑስ ስብስቦቹ ሁሉ ስርጭቱ ሊዘረዝሩ ይዟሉ። ንዑስ ስብስቡ $S$ ሁሉ DPP ምናምን $\det(L_S)$ ሁሉ ምጥጥን ነው ሲሆን $L$ ተመሳሳይነቱ ሊያሳይ ዋናቱ ማትሪኩ ነው።

---

## ማቆሚያ ምልክቶቹ

ንቁ ትምህርቱ መቼ ሊቆሙ? ብዙ ምልክቶቹ አሉ፦

- **በጀቱ ሙሉ ሆነ፦** ቀላሉ — ትርጓሜ በጀቱ ሙሉ ሲሆን ሊቆሙ።
- **ቀልጣፋነቱ ድረ-ሆነ፦** ዋጠ ያለ ምርመራ ስብስቡ ሁሉ ሞዴሉ ትክክለኛነቱ $k$ ቀጣዩ ዙሮቹ ሁሉ $\delta$ ሙሉ ሊሻሻሉ ሳይሄዱ ሲቆሙ።
- **ምናምን ድረሱ፦** ሳይለጠፉ ምሳሌዎቹ ሙሉ ምናምን ሁሉ ድረሱ ሁሉ ሁሉ ዝቅ ያለ ምጥጥን ሲቆሙ።
- **ሙሉ ኪሳራ ቀነሰ፦** ተጨማሪ መለያዎቹ ሁሉ ሙሉ ሊፈጥሩ ጥቅሙ ምናምን ሊዛሰቡ፤ ይህ ድረሱ ሁሉ ሲቆሙ {cite}`bloodgood2009method`።

---

## ንቁ ትምህርቱ ሲሠራ (እና ሲሠራ)

ንቁ ትምህርቱ ብዙ ጊዜ ጥሩ ሠራ ሲሆን፦
- ትርጓሜ ዋጋ አለ እናም ሳይለጠፉ ዝርዝሩ ትልቅ ነው
- ውሂቡ ሙሉ ቅርጸቱ ሞዴሉ ሁሉ ዋናቱ ምሳሌዎቹ ሊለዩ ሊጠቀሙ ይዟሉ
- ሞዴሉ ምድቡ ሥራ ሁሉ ተገቢ ነው

ንቁ ትምህርቱ ጥሩ ሠርቶ ሊወድቁ ሲሆን፦
- ዋናው ሞዴሉ ጣቢያ ጥሩ ነው (ቀዝቃዛ ጅምሩ) እናም ምሳሌዎቹ ዋናቱ ሁሉ ሊደረጉ አይዟሉ
- ጥያቄ ስልቱ ወጪ ወይም ሁኔታ ያለ ምሳሌዎቹ ሊምርጡ ይዟሉ (ሁኔታ ጠቃሚነቱ ዋናቱ ነው)
- ሳይለጠፉ ዝርዝሩ እና ፈተናቸው ስርጭቱ መካከሉ ውሂቡ ስርጭቱ ሊቀየሩ ይዟሉ

ዋናቱ ተጨባጭ ሁኔታ **ስርጭቱ አለ-ሰምምነቱ** ነው፦ ንቁ ትምህርቱ ወሳኔ ድንበሩ ዙሪያ ምሳሌዎቹ ሊጠይቁ ዝቅ ያለ ፈተናቸው ስርጭቱ ጥሩ ሊያሳዩ ሊሆን ያልኖሩ ሚለጠፉ ስብስቡ ፈጥሮ ይሄዳሉ። ይህ ጥሩ ሰለጠነ ወሳኔ ድንበሮቹ ፈጥሮ ሊሄዳሉ ነገር ግን ጥሩ ምናምን ሳይሆን።

```{seealso}
ዋናቱ ዳሰሳ {cite}`settles2009active` ነው። ቲዎሪያዊ መሠረቶቹ (መለያ ቸርነቱ፣ ምናምን ድንበሮቹ)፦ {cite}`balcan2006agnostic`። ጥልቅ ትምህርቱ ልዩ ንቁ ትምህርቱ ሁሉ {cite}`ash2020deep` (BADGE) እና {cite}`sener2018active` (ዋናው-ስብስቡ) ይመልከቱ። ንቁ ትምህርቱ ዕውን ሲረዳ ሙሉ ቁጥጥር ምዘናቸው ሁሉ {cite}`lowell2019practical` ይመልከቱ። ጥልቅ ሞዴሎቹ ሁሉ አሌዓቲካዊ ወ. ኤፒስቴሚካዊ እርግጠኛ ሳይሆን {cite}`kendall2017uncertainties` ይመልከቱ፤ ጥልቅ ስብስቦቹ ሁሉ {cite}`lakshminarayanan2017simple`፤ MC ድሮፕዓውቱ ምናምን ቤይዝያን ምናምን ሁሉ {cite}`gal2016dropout` ይመልከቱ።
```
