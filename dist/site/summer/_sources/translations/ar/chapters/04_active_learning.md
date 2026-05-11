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

# التعلم النشط

البيانات المُسمَّاة مُكلفة. الفكرة الجوهرية للتعلم النشط هي أن *ليست جميع الأمثلة غير المُسمَّاة متساوية في قيمتها المعلوماتية* — يستطيع النموذج التطور بسرعة أكبر إذا أُتيح له اختيار الأمثلة التي يسأل عنها. بدلاً من تسمية البيانات بصورة عشوائية، يستعلم نظام التعلم النشط أورابل (عادةً مُوصِّف بشري) عن الأمثلة الأكثر احتمالاً لتحسين النموذج.

يتناول هذا الفصل نظرية وممارسة التعلم النشط: استراتيجيات الاستعلام، وأطر أخذ العينات، ومعايير التوقف، والاعتبارات العملية للنشر الفعلي.

---

## إعداد التعلم النشط

يشتمل الإعداد القياسي **للتعلم النشط المعتمد على المجموعة** على:

- **مجموعة مُسمَّاة** $\mathcal{L} = \{(x_i, y_i)\}_{i=1}^n$ — صغيرة في البداية
- **مجموعة غير مُسمَّاة** $\mathcal{U} = \{x_j\}_{j=1}^m$ — أكبر عادةً بكثير من $\mathcal{L}$
- **أورابل** $\mathcal{O}$ يستطيع إعادة $y = \mathcal{O}(x)$ لأي $x$ مستعلَم عنه
- **استراتيجية استعلام** $\phi$ تختار الاستعلام التالي $x^* = \phi(\mathcal{L}, \mathcal{U}, f_\theta)$

حلقة التعلم النشط:

```text
    1. تهيئة: L = مجموعة بذور مُسمَّاة صغيرة، U = مجموعة غير مُسمَّاة
    2. تدريب: f_θ ← train(L)
    3. استعلام: x* = argmax φ(x; f_θ) على x ∈ U
    4. تسمية: y* = O(x*)
    5. تحديث: L ← L ∪ {(x*, y*)}، U ← U \ {x*}
    → كرر من 2 حتى استنفاد الميزانية
```

الهدف هو بلوغ جودة نموذج مستهدفة باستخدام أقل عدد ممكن من الاستعلامات على الأورابل.

---

## الأسس النظرية

سؤال طبيعي: كم يمكن أن يُفيد التعلم النشط؟ في أفضل حالاته، يستطيع التعلم النشط تحقيق تقليل *أسّي* في تعقيد التسمية — بلوغ خطأ $\epsilon$ بـ $O(\log(1/\epsilon))$ تسمية بدلاً من $O(1/\epsilon)$ التي يحتاجها التعلم السلبي، في الإعدادات القابلة للتحقق مع استراتيجية استعلام جيدة {cite}`settles2009active`.

في الواقع العملي، الضمانات أصعب منالاً. يُظهر **التعلم النشط اللاأدري** {cite}`balcan2006agnostic` أن توفير التسميات ممكن حتى حين لا يكون المفهوم الهدف ضمن فئة الفرضيات، لكن التوفير يعتمد اعتماداً وثيقاً على معامل الخلاف — مقياس لمدى سرعة تقلص مجموعة الفرضيات المعقولة مع تراكم البيانات.

الأثر العملي الرئيسي: ميزة التعلم النشط أكبر ما تكون حين تكون **حدود القرار بسيطة ومركّزة** (حيث تُزيل استعلامات الشك الفرضيات الخاطئة بسرعة)، وأصغر ما تكون حين تكون فئة الفرضيات كبيرة أو الحد معقداً.

---

## استراتيجيات الاستعلام

### أخذ عينات الشك

أبسط استراتيجية وأكثرها استخداماً: الاستعلام عن المثال الذي يكون فيه النموذج *أكثر شكاً* {cite}`lewis1994sequential`.

**أدنى ثقة** يستعلم عن المثال الذي ثقة النموذج في تنبؤه الأعلى أدنى ما تكون:

$$
x^* = \argmax_{x \in \mathcal{U}} \left(1 - P_\theta(\hat{y} \mid x)\right)
$$

**أخذ عينات الهامش** ينظر في الفجوة بين أعلى احتمالين متنبأ بهما:

$$
x^* = \argmin_{x \in \mathcal{U}} \left(P_\theta(\hat{y}_1 \mid x) - P_\theta(\hat{y}_2 \mid x)\right)
$$

**أخذ عينات الإنتروبيا** يستخدم التوزيع المتنبأ الكامل:

$$
x^* = \argmax_{x \in \mathcal{U}} \left( -\sum_{k=1}^K P_\theta(y_k \mid x) \log P_\theta(y_k \mid x) \right)
$$

أخذ عينات الإنتروبيا هو الأكثر مبدئيةً من الثلاثة — إذ يعتبر جميع الفئات — وعموماً يتفوق على الاستراتيجيتين الأخريين في مسائل متعددة الفئات.

### الاستعلام باللجنة (QbC)

يُدرَّب **لجنة** من $C$ نماذج (باستخدام التجزئة أو تهيئات مختلفة أو معماريات مختلفة). يُستعلَم عن المثال الذي تختلف عليه اللجنة أكثر:

$$
x^* = \argmax_{x \in \mathcal{U}} \; \text{الخلاف}(\{f_c(x)\}_{c=1}^C)
$$

يمكن قياس الخلاف بـ **إنتروبيا التصويت** (إنتروبيا التصويت الأغلبي للجنة) أو **تباعد KL** عن توزيع الإجماع.

يُقدِّم QbC تقديرات شك أفضل من نموذج واحد لكنه يتطلب تدريب نماذج متعددة مما يُعدّ مُكلفاً حسابياً.

### التغيير المتوقع في النموذج

الاستعلام عن المثال الذي سيُسبِّب أكبر تغيير في النموذج الحالي إذا سُمِّي. للنماذج المعتمدة على التدرج، يتوافق هذا مع المثال ذي أكبر حجم تدرج متوقع {cite}`settles2008analysis`:

$$
x^* = \argmax_{x \in \mathcal{U}} \sum_{y \in \mathcal{Y}} P_\theta(y \mid x) \left\| \nabla_\theta \mathcal{L}(f_\theta(x), y) \right\|
$$

لهذه الاستراتيجية دوافع نظرية قوية لكنها تتطلب حساب التدرجات لكل مرشح مما يجعلها مُكلفة للنماذج الكبيرة.

### المجموعة الأساسية / المناهج الهندسية

يمكن أن تكون الاستراتيجيات المعتمدة على الشك **منحازة نحو الشاذات**: قد يكون المثال غير المألوف ذا شك عالٍ لكنه غير تمثيلي لتوزيع البيانات. تعالج أساليب المجموعة الأساسية ذلك بالبحث عن عينة متنوعة تُغطي فضاء الميزات.

تجد خوارزمية **k-center الجشعة** {cite}`sener2018active` أصغر مجموعة نقاط بحيث تكون كل نقطة غير مُسمَّاة ضمن $\delta$ من نقطة مستعلَم عنها على الأقل:

$$
x^* = \argmax_{x \in \mathcal{U}} \min_{x' \in \mathcal{L}} d(x, x')
$$

أي الاستعلام عن النقطة الأبعد عن أي نقطة مُسمَّاة حالياً. يُشجِّع هذا على مجموعة توصيفات موزعة توزيعاً جيداً.

### BADGE

**التعلم النشط الدفعي بتضمينات التدرج المتنوعة (BADGE)** {cite}`ash2020deep` يجمع الشك والتنوع: يختار دفعة من الأمثلة التي تكون تضميناتها التدرجية (بالنسبة للتسمية المتنبأ بها) كبيرة الحجم (شك عالٍ) ومتنوعة (تُغطي مناطق مختلفة من فضاء التدرج). وهو من أكثر الاستراتيجيات الحديثة تنافسية.

---

## تقدير الشك للنماذج العميقة

تفترض الاستراتيجيات أعلاه الوصول إلى مخرجات احتمالية معايَرة من النموذج. للنماذج البسيطة (الانحدار اللوجستي، مصنفات softmax)، هذا بسيط. للشبكات العميقة، يستلزم الحصول على تقديرات شك موثوقة تقنيات إضافية.

### نوعان من الشك

تبعاً لـ Kendall وGal {cite}`kendall2017uncertainties`، نُميِّز:

**الشك الذري** (شك البيانات): ضجيج متأصل في الملاحظات لا يمكن تقليصه بجمع مزيد من البيانات. الصورة الضبابية غير مؤكدة ذرياً — لن يجعل النموذج أكثر ثقةً بشأنها أي كمية من بيانات التدريب الإضافية من التوزيع ذاته.

**الشك المعرفي** (شك النموذج): شك ناتج عن محدودية بيانات التدريب أو نموذج لم يرَ أمثلة مماثلة. الشك المعرفي *يمكن* تقليصه بتسمية مزيد من البيانات — وبالتالي فهو الكمية ذات الصلة باختيار الاستعلام في التعلم النشط.

للتعلم النشط، نريد الاستعلام عن الأمثلة ذات الشك المعرفي العالي لا ذات الشك الذري العالي. الاستعلام عن مثال غامض بطبيعته يُضيِّع جهد الأورابل: لا توجد تسمية يقدمونها يمكن أن تكون صحيحة بوضوح.

### إسقاط Monte Carlo

منهج عملي لتقدير الشك المعرفي للشبكات العصبية هو **إسقاط MC** {cite}`gal2016dropout`: تطبيق الإسقاط عند الاستنتاج وتشغيل $T$ تمرير للأمام. التباين عبر التنبؤات هو تقدير للشك المعرفي.

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

في الشبكة غير المدرَّبة أعلاه، يُظهر كلا المثالَين شكاً مماثلاً. بعد التدريب، سيُظهر المثال خارج التوزيع شكاً معرفياً أعلى — النموذج لم يتعلم تعييناً موثوقاً للمدخلات البعيدة عن توزيع التدريب.

### التجميعات العميقة

يُوفر تدريب $M$ نماذج مهيأة باستقلالية وتوسط تنبؤاتها تقديراً للشك أبسط وأكثر موثوقية في الغالب من إسقاط MC {cite}`lakshminarayanan2017simple`. الخلاف بين أعضاء التجميع هو إشارة الشك المعرفي.

للتعلم النشط على نطاق واسع، يُضيف كل من إسقاط MC والتجميعات العميقة تكلفة بمقدار $T$ أو $M$ تمريرات للأمام. في الواقع العملي، $T = 10$–$30$ لإسقاط MC أو $M = 5$ أعضاء تجميع كثيراً ما يكفي لترتيب الأمثلة حسب الشك المعرفي، حتى وإن لم تكن القيم المطلقة معايَرةً جيداً.

---

## حلقة تعلم نشط متكاملة

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

## مشكلة البداية الباردة

يتطلب التعلم النشط نموذجاً مدرَّباً لتصنيف النقاط غير المُسمَّاة — لكن في البداية لا توجد (أو توجد قليل جداً من) الأمثلة المُسمَّاة. هذه هي **مشكلة البداية الباردة**.

الحلول العملية:

1. **التهيئة العشوائية:** تسمية مجموعة بذور عشوائية صغيرة (20–100 مثال) قبل بدء التعلم النشط.
2. **التهيئة المعتمدة على التجميع:** استخدام k-means على المجموعة غير المُسمَّاة؛ تسمية مثال واحد من كل مجموعة. يضمن هذا التنوع في المجموعة المُسمَّاة الأولية.
3. **الاختيار المعتمد على التضمين:** استخدام مشفِّر مُدرَّب مسبقاً لتضمين الأمثلة؛ اختيار مجموعة فرعية متنوعة عبر المجموعة الأساسية.

لمعظم المهام، يكفي عادةً بضع عشرات من تسميات البذور العشوائية لبدء التعلم النشط؛ يعتمد العدد الدقيق على توازن الفئات وأبعاد الميزات وتعقيد النموذج.

---

## التعلم النشط الدفعي

في الواقع العملي، يعمل المُوصِّفون في دفعات — تدريب ونشر نموذج جديد بعد كل تسمية مفردة أمر غير كفء. **التعلم النشط الدفعي** يختار مجموعة من $b$ أمثلة للتسمية في آنٍ واحد.

الاختيار الساذج لأفضل $b$ أمثلة الأكثر شكاً يُفضي إلى **التكرار**: الأمثلة ذات الشك العالي تميل إلى التجمع (أمثلاً، الأمثلة القريبة من حدود القرار في المنطقة نفسها). تُحسِّن استراتيجيات الدفعات الأفضل الشكَّ *والتنوع* معاً داخل الدفعة.

**عمليات النقطة المحددة (DPPs)** توفر طريقة مبدئية لأخذ عينات دفعات متنوعة: تُعرِّف توزيعاً على المجموعات الفرعية يُعاقب العناصر المتشابهة. احتمالية المجموعة الفرعية $S$ تحت DPP تتناسب مع $\det(L_S)$ حيث $L$ مصفوفة نواة تُشفِّر التشابه.

---

## معايير التوقف

متى ينبغي للتعلم النشط أن يتوقف؟ المعايير الشائعة:

- **استنفاد الميزانية:** الأبسط — التوقف حين تنفد ميزانية التوصيف.
- **تسطح الأداء:** التوقف حين لم تتحسن دقة النموذج على مجموعة تحقق محتجزة بأكثر من $\delta$ لـ $k$ جولات متتالية.
- **عتبة الثقة:** التوقف حين تكون نسبة أقل من نسبة معينة من الأمثلة غير المُسمَّاة ذات شك يتجاوز عتبة.
- **أقصى تقليص للخسارة:** تقدير أقصى مكسب ممكن من تسميات إضافية؛ التوقف حين يقل هذا عن عتبة {cite}`bloodgood2009method`.

---

## متى يعمل التعلم النشط (ومتى لا يعمل)

يميل التعلم النشط إلى العمل جيداً حين:
- التسمية مُكلفة والمجموعة غير المُسمَّاة كبيرة
- البيانات ذات بنية واضحة يستطيع النموذج استغلالها لتحديد الأمثلة المفيدة
- فئة النموذج مناسبة للمهمة

يؤدي التعلم النشط أداءً رديئاً حين:
- النموذج الأولي ضعيف جداً (بداية باردة) ولا يستطيع بشكل ذي معنى ترتيب الأمثلة
- تختار استراتيجية الاستعلام شاذات أو أمثلة مُسمَّاة خطأ (تهم مقاومة الضجيج)
- يتحول توزيع البيانات بين المجموعة غير المُسمَّاة وتوزيع الاختبار

مصدر قلق عملي رئيسي هو **عدم تطابق التوزيع**: يميل التعلم النشط إلى الاستعلام عن الأمثلة القريبة من حدود القرار، مُنشئاً مجموعةً مُسمَّاة متحيزة قد لا تُمثِّل توزيع الاختبار بشكل جيد. قد يُفضي هذا إلى حدود قرار مُدرَّبة جيداً لكن معايرة رديئة.

```{seealso}
الاستعراض التأسيسي هو {cite}`settles2009active`. الأسس النظرية (تعقيد التسمية، الحدود اللاأدرية): {cite}`balcan2006agnostic`. للتعلم النشط الخاص بالتعلم العميق، راجع {cite}`ash2020deep` (BADGE) و{cite}`sener2018active` (المجموعة الأساسية). لتقييم نقدي لمتى يساعد التعلم النشط فعلاً، راجع {cite}`lowell2019practical`. حول الشك الذري مقابل المعرفي للنماذج العميقة، راجع {cite}`kendall2017uncertainties`؛ للتجميعات العميقة كمقدِّرات شك، راجع {cite}`lakshminarayanan2017simple`؛ لإسقاط MC كاستدلال بايزي تقريبي، راجع {cite}`gal2016dropout`.
```
