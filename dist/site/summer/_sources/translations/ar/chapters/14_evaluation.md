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

# التقييم والمقاييس

معرفة ما إذا كان نظام HITL يعمل يستلزم أكثر من قياس دقة النموذج. تحتاج إلى معرفة ما إذا كنت تحصل على قيمة من ميزانية التوصيف، وما إذا كان النموذج في الواقع أكثر انسجاماً مع النية البشرية، وما إذا كانت التغذية الراجعة البشرية الإضافية ستستمر في تحسين الأمور. يتناول هذا الفصل المشهد الكامل للتقييم في إعدادات HITL.

---

## المقاييس المتمحورة حول النموذج

المقاييس القياسية للتعلم الآلي تنطبق مباشرةً على أنظمة HITL، مع بعض الفروق الدقيقة المهمة.

### مقاييس التصنيف

**الدقة** مناسبة حين تكون الفئات متوازنة وجميع الأخطاء متساوية في التكلفة. في إعدادات HITL مع ذلك، قد تكون مجموعة الاختبار المُسمَّاة متحيزة بسبب استراتيجية الاستعلام (التعلم النشط يستعلم عن أمثلة غير عشوائية)، مما يجعل تقديرات الدقة البسيطة غير موثوقة.

**درجة F1** هي الوسط التوافقي بين الدقة والاسترجاع، مناسبة للفئات غير المتوازنة. في سياقات HITL، قد تهم الدقة والاسترجاع بصورة مختلفة بحسب عدم تماثل التكلفة بين الإيجابيات الكاذبة والسلبيات الكاذبة.

**AUROC** يقيس قدرة النموذج على التمييز بين الفئات بصرف النظر عن العتبة — مهم للمهام الحساسة للمعايرة كالفرز الطبي.

**المعايرة** تقيس مدى توافق الاحتمالات المتنبأ بها مع التكرارات التجريبية. في أنظمة HITL، يمكن أن تكون النماذج المُدرَّبة على مجموعات مُسمَّاة متحيزة (من التعلم النشط) غير معايَرة حتى حين تكون دقيقة.

### مقاييس النماذج التوليدية

للنماذج اللغوية والأنظمة التوليدية، التقييم أصعب بشكل جوهري. لا يلتقط أي مقياس آلي واحد الجودة:

- **BLEU / ROUGE / METEOR:** مقاييس قائمة على المرجع للترجمة والتلخيص. ترتبط ارتباطاً ضعيفاً بأحكام جودة الإنسان في التوليد طويل الشكل.
- **الحيرة:** تقيس مدى توقع النموذج للنص المحتجز. شرط ضروري لكنه غير كافٍ للجودة.
- **BERTScore:** تشابه قائم على التضمين مع المراجع. أفضل ارتباطاً بأحكام الإنسان من مقاييس n-gram.
- **التقييم البشري:** المعيار الذهبي. راجع القسم 14.3.

---

## مقاييس كفاءة التوصيف

ينبغي لتقييم HITL أيضاً قياس ما إذا كانت التغذية الراجعة البشرية تُستخدَم بكفاءة.

### منحنيات التعلم

**منحنى التعلم** يرسم أداء النموذج كدالة لعدد الأمثلة المُسمَّاة. منحنى تعلم شديد الانحدار (تحسن سريع مع تسميات قليلة) يُشير إلى أن استراتيجية التوصيف تختار أمثلة مفيدة. منحنى تعلم مسطَّح يُشير إلى أن التسمية الإضافية تُقدِّم عوائد متناقصة.

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

### تحليل العائد على الاستثمار (ROI)

ROI التغذية الراجعة البشرية يُجيب على: لكل تسمية إضافية، كم يتحسن أداء النموذج؟

$$
\text{ROI}(n) = \frac{\Delta \text{الأداء}(n)}{\text{التكلفة لكل تسمية}}
$$

مع نضج النموذج (واستنفاد الأمثلة سهلة التعلم)، يتراجع ROI عادةً. الانعكاس العملي: ينبغي أن تكون ميزانيات التوصيف مُركَّزة في المراحل الأولى، مع جمع تسميات أكثر في المراحل المبكرة حين يكون ROI في أعلى مستوياته.

---

## التقييم البشري

للأنظمة التوليدية والمهام الذاتية، يبقى التقييم البشري المعيار الذهبي.

### التقييم المباشر (DA)

يُقيِّم المُوصِّفون المخرجات على مقياس مطلق (مثل 1–100 لجودة الترجمة، أو 1–5 لمساعدة الاستجابة). جُرِّد DA في تقييم الترجمة الآلية (معايير WMT).

**أفضل الممارسات لـ DA:**
- عشوائية ترتيب المخرجات لمنع الإرساء
- استخدام عدد كافٍ من المُوصِّفين لكل عنصر (3–5 كحد أدنى)
- إدراج ضوابط جودة (أمثلة واضحة الجودة الجيدة والرديئة لاكتشاف المُقيِّمين غير المنتبهين)
- الإبلاغ عن الاتفاق بين المُوصِّفين جنباً إلى جنب مع الدرجات الإجمالية

### التقييم المقارن

يختار المُوصِّفون بين مخرجَين: "أيهما أفضل؟" الأحكام المقارنة أسرع وأكثر اتساقاً من التقييمات المطلقة (راجع الفصل الثامن). **أنظمة تقييم ELO** (المُستعارة من الشطرنج) تُحوِّل نتائج المقارنات الزوجية إلى ترتيب جودة مستمر.

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

### الاختبار السلوكي (CheckList)

**CheckList** {cite}`ribeiro2020beyond` منهجية للتقييم السلوكي المنهجي لنماذج معالجة اللغات الطبيعية. بدلاً من مجموعات اختبار عشوائية، تُصمِّم حالات اختبار تفحص قدرات بعينها:

- **اختبارات الوظيفة الدنيا (MFT):** هل يُعالج النموذج الحالات البسيطة الواضحة؟
- **اختبارات الثبات (INV):** هل يتغير مخرج النموذج حين لا ينبغي له (مثل إعادة الصياغة)؟
- **اختبارات التوقع الاتجاهي (DIR):** هل يتغير مخرج النموذج في الاتجاه المتوقع حين يتغير المدخل؟

يجعل CheckList التقييم البشري هادفاً وقابلاً للتنفيذ: بدلاً من رقم دقة واحد، يُوفِّر ملف تعريف القدرات.

---

## قياس المحاذاة مع النية البشرية

لأنظمة RLHF، قياس المحاذاة تحدٍّ تقييمي مركزي.

**تقييم نموذج المكافأة:** دقة نموذج المكافأة على مجموعة اختبار تفضيل محتجزة. يُشير Ouyang وآخرون {cite}`ouyang2022training` إلى دقة زوجية تبلغ نحو 72% لنموذج مكافأة InstructGPT؛ كنقطة مرجعية تقريبية، تُستشهد بالأرقام في هذا النطاق لخطوط أنابيب RLHF المماثلة، وإن كانت النتائج تتباين بصورة كبيرة بحسب المهمة وجودة البيانات.

**معدل الفوز:** بالنظر إلى إصدارَي نموذج (مثل خط الأساس SFT مقابل الضبط الدقيق بـ RLHF)، أي نسبة استجابات يفوز فيها نموذج RLHF في المقارنات الزوجية البشرية؟

**GPT-4 كمُقيِّم:** أصبح استخدام LLM قادر لتقييم الاستجابات شائعاً للتكرار السريع. يجد Gilardi وآخرون {cite}`gilardi2023chatgpt` وZheng وآخرون {cite}`zheng2023judging` أن اتفاق المُقيِّم LLM مع الحكم البشري يتراوح تقريباً من 0.7 إلى 0.9 بحسب المهمة — مفيد للمقارنة السريعة A/B، لكنه أقل موثوقيةً للكشف عن الانصياع والفروق الثقافية الدقيقة ومسائل السلامة.

**كشف الانصياع:** قياس ما إذا كان النموذج يُغيِّر إجاباته استناداً إلى التفضيل الضمني للمستخدم (مثل "أعتقد أن X صحيح؛ ما رأيك؟"). النموذج المحاذى جيداً لا ينبغي أن يكون انصياعياً.

---

## اختبار A/B في الأنظمة المنشورة

للأنظمة في الإنتاج، التقييم النهائي هو **اختبار A/B**: توجيه جزء من المستخدمين إلى إصدار النموذج الجديد وقياس النتائج النهائية.

يُعطي اختبار A/B تقديراً غير متحيز لجودة النموذج في سياق النشر الفعلي، مُلتقِطاً تأثيرات يُفوِّتها التقييم المختبري (سلوك المستخدم، وتوزيع السكان، والحالات الهامشية).

التحدي: المقاييس النهائية المناسبة. مقاييس المشاركة (النقرات، ومدة الجلسة) قد تُكافئ السلوك التلاعبي. معدلات إكمال المهام أو استطلاعات رضا المستخدم أفضل محاذاةً لكنها أكثر ضجيجاً.

```{seealso}
الاختبار السلوكي CheckList: {cite}`ribeiro2020beyond`. لمنهجية تقييم RLHF، راجع {cite}`ouyang2022training`. لأفضل الممارسات في التقييم البشري في الترجمة الآلية: {cite}`graham2015accurate`. لنظرية منحنى التعلم: {cite}`mukherjee2003estimating`.
```
