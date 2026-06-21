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

# الاستعانة بالحشود وضبط الجودة

حين تكون مهام التوصيف بسيطة بما يكفي لأدائها من غير متخصصين، توفر منصات الاستعانة بالحشود وصولاً إلى قوى عاملة توصيف كبيرة وعلى الطلب بتكلفة منخفضة لكل عنصر. بناء مجموعات بيانات مُسمَّاة عالية الجودة من الحشود يستلزم تصميماً دقيقاً للمهام وتكراراً استراتيجياً وضبط جودة صارماً.

---

## منصات الاستعانة بالحشود

**Amazon Mechanical Turk (MTurk)** سوق الاستعانة بالحشود الأصلي، أُطلق عام 2005. يُكمِّل العمال ("Turkers") مهام صغيرة (HITs) ينشرها الطالبون. وجدت دراسة عام 2018 أن متوسط الأجر الفعلي بالساعة لـ Turkers يبلغ نحو 2 دولار/ساعة — أقل بكثير من الحد الأدنى للأجر في كثير من البلدان ذات الدخل المرتفع {cite}`hara2018data` — وهو مصدر قلق أخلاقي يُناقَش في الفصل الخامس عشر. MTurk الأنسب للمهام البسيطة ذات المعايير الواضحة والقابلة للتحقق.

**Prolific** منصة أكاديمية للاستعانة بالحشود تفرض معيار دفع أدنى (حالياً نحو 9 جنيهات إسترلينية/ساعة، ما يعادل تقريباً 11 دولار/ساعة، كما ينص في إرشادات Prolific المنشورة)، وتُصفِّي المشاركين حسب التركيبة السكانية، وتحتفظ بفريق من العمال الذين اختاروا المشاركة في الأبحاث. مُفضَّلة للبحث في العلوم الاجتماعية والمهام التي تتطلب تمثيلاً ديموغرافياً.

**Appen** (ومنافسوها: Telus International وiMerit) توفر قوى عاملة توصيف مُدارة مع إدارة جودة، وتُستخدَم للمهام الأعلى تعقيداً والمشاريع المؤسسية.

**المجتمعات المتخصصة.** للمهام الخاصة بالمجال، يمكن لمجتمعات هواة المجال تقديم توصيفات عالية الجودة: Galaxy Zoo للفلك، وeBird لأنواع الطيور، وChess Tempo لتوصيف مواضع الشطرنج.

---

## تصميم المهام للاستعانة بالحشود

### تحليل المهام المعقدة

ينبغي تحليل المهام المعقدة إلى مهام صغيرة محددة بوضوح. بدلاً من طلب التوصيف الشامل للوثيقة من العمال، اطرح سؤالاً واحداً محدداً في كل مرة: "هل تحتوي هذه الجملة على اسم شخص؟" أو "قيِّم وضوح هذه الترجمة على مقياس من 1 إلى 5."

**فوائد التحليل:**
- طلب معرفي أقل لكل مهمة ← إرهاق أقل وجودة أعلى
- يمكن ضبط جودة كل مهمة صغيرة بشكل مستقل
- أسهل في التدقيق وتصحيح الأخطاء

### أهمية التعليمات

أكبر مؤشر منفرد لجودة الاستعانة بالحشود هو جودة التعليمات. التعليمات الجيدة للمهام:
- تشرح *هدف* المهمة في جملة واحدة
- تُقدِّم تعريفاً واضحاً لا لبس فيه لكل فئة
- تُقدِّم 3–5 أمثلة عمل (خاصةً للحالات الهامشية)
- لا تطول بما يتجاوز ما سيقرأه العمال فعلاً (أقل من 300 كلمة للمهام البسيطة)

أجرِ **دراسة تجريبية** (10–50 عاملاً، 20–100 مهمة) قبل التوسع. حلِّل الخلافات التجريبية؛ معظمها يُشير إلى غموضات في التعليمات يمكن إصلاحها.

### أسئلة المعيار الذهبي

ضمِّن **أسئلة المعيار الذهبي** — المهام ذات الإجابات الصحيحة المعروفة — طوال دفعة المهمة. يُزال العمال الذين يفشلون في أسئلة الذهب أدنى من عتبة من المشروع.

```{code-cell} python
import numpy as np
from scipy.stats import binom

rng = np.random.default_rng(42)

def simulate_gold_screening(n_workers=100, gold_per_batch=5,
                             p_good_worker=0.7, good_acc=0.92,
                             bad_acc=0.55, threshold=0.70):
    """
    Simulate quality screening via gold questions.
    Returns: precision and recall of identifying bad workers.
    """
    worker_quality = rng.choice(['good', 'bad'], size=n_workers,
                                 p=[p_good_worker, 1 - p_good_worker])
    results = {'tp': 0, 'fp': 0, 'tn': 0, 'fn': 0}

    for q in worker_quality:
        acc = good_acc if q == 'good' else bad_acc
        n_correct = rng.binomial(gold_per_batch, acc)
        passed = (n_correct / gold_per_batch) >= threshold
        if q == 'bad' and not passed:  results['tp'] += 1
        if q == 'good' and not passed: results['fp'] += 1
        if q == 'bad' and passed:      results['fn'] += 1
        if q == 'good' and passed:     results['tn'] += 1

    tp, fp, fn = results['tp'], results['fp'], results['fn']
    precision = tp / (tp + fp + 1e-6)
    recall    = tp / (tp + fn + 1e-6)
    return precision, recall

# Vary gold question count
gold_counts = [3, 5, 8, 10, 15, 20]
precisions, recalls = [], []
for g in gold_counts:
    p_list, r_list = [], []
    for _ in range(50):
        p, r = simulate_gold_screening(gold_per_batch=g)
        p_list.append(p); r_list.append(r)
    precisions.append(np.mean(p_list))
    recalls.append(np.mean(r_list))

import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(gold_counts, precisions, 'o-', color='#2b3a8f', label='Precision', linewidth=2)
ax.plot(gold_counts, recalls,    's--', color='#0d9e8e', label='Recall',    linewidth=2)
ax.set_xlabel("Gold questions per batch", fontsize=12)
ax.set_ylabel("Screening performance", fontsize=12)
ax.set_title("Worker Screening via Gold Standard Questions", fontsize=13)
ax.legend(fontsize=11); ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('gold_screening.png', dpi=150)
plt.show()

p, r = simulate_gold_screening(gold_per_batch=5)
print(f"5 gold questions: Precision={p:.3f}, Recall={r:.3f}")
p, r = simulate_gold_screening(gold_per_batch=10)
print(f"10 gold questions: Precision={p:.3f}, Recall={r:.3f}")
```

---

## النماذج الإحصائية لتجميع التسميات

التصويت بالأغلبية خط أساس طبيعي لكنه يتجاهل الاختلافات في دقة المُوصِّف. يمكن للنماذج الإحصائية تحقيق نتائج أفضل.

### نموذج داويد-سكين

يُقدِّر **نموذج داويد-سكين (DS)** {cite}`dawid1979maximum` بصورة مشتركة:
- **التسمية الحقيقية** $z_i$ لكل عنصر $i$
- **مصفوفة الارتباك** $\pi_j^{(k,l)}$ لكل مُوصِّف $j$: احتمالية أن يُسمِّي المُوصِّف $j$ عنصراً من الفئة الحقيقية $k$ بالفئة $l$

تتكرر خوارزمية EM:
- **الخطوة E:** بالنظر إلى مصفوفات ارتباك المُوصِّف، احسب الاحتمالية الخلفية لكل تسمية حقيقية
- **الخطوة M:** بالنظر إلى تقديرات تسمية العناصر، حدِّث مصفوفات ارتباك المُوصِّف

```{code-cell} python
import numpy as np
from scipy.special import softmax

def dawid_skene_em(annotations, n_classes, n_iter=20):
    """
    Simplified Dawid-Skene EM for binary classification.
    annotations: dict {item_idx: [(annotator_idx, label), ...]}
    Returns: estimated true labels and annotator accuracies.
    """
    items = sorted(annotations.keys())
    n_items = len(items)
    annotators = sorted({a for anns in annotations.values() for a, _ in anns})
    n_annotators = len(annotators)
    ann_idx = {a: i for i, a in enumerate(annotators)}

    # Initialize: majority vote
    T = np.zeros((n_items, n_classes))  # soft label estimates
    for i, item in enumerate(items):
        for _, label in annotations[item]:
            T[i, label] += 1
        T[i] /= T[i].sum()

    # Confusion matrices: shape (n_annotators, n_classes, n_classes)
    PI = np.ones((n_annotators, n_classes, n_classes)) * 0.5

    for _ in range(n_iter):
        # M-step: update confusion matrices
        PI = np.zeros((n_annotators, n_classes, n_classes)) + 1e-6
        for i, item in enumerate(items):
            for ann, label in annotations[item]:
                a = ann_idx[ann]
                for k in range(n_classes):
                    PI[a, k, label] += T[i, k]
        PI /= PI.sum(axis=2, keepdims=True)

        # E-step: update soft label estimates
        T = np.zeros((n_items, n_classes))
        for i, item in enumerate(items):
            log_p = np.zeros(n_classes)
            for ann, label in annotations[item]:
                a = ann_idx[ann]
                log_p += np.log(PI[a, :, label] + 1e-10)
            T[i] = softmax(log_p)

    return {item: T[i] for i, item in enumerate(items)}, PI

# Simulate crowdsourcing scenario
rng = np.random.default_rng(42)
N_ITEMS, N_ANNOTATORS, ANNS_PER_ITEM = 200, 10, 3
true_labels = rng.integers(0, 2, N_ITEMS)
# Annotator accuracies: 3 good (0.9), 4 medium (0.75), 3 noisy (0.6)
accuracies = [0.90]*3 + [0.75]*4 + [0.60]*3

annotations = {}
for i in range(N_ITEMS):
    anns_for_item = []
    chosen = rng.choice(N_ANNOTATORS, ANNS_PER_ITEM, replace=False)
    for a in chosen:
        acc = accuracies[a]
        label = true_labels[i] if rng.random() < acc else 1 - true_labels[i]
        anns_for_item.append((a, int(label)))
    annotations[i] = anns_for_item

# Run Dawid-Skene
soft_labels, confusion = dawid_skene_em(annotations, n_classes=2, n_iter=30)
ds_preds = {i: int(np.argmax(soft_labels[i])) for i in range(N_ITEMS)}

# Compare with majority vote
mv_preds = {}
for i in range(N_ITEMS):
    votes = [l for _, l in annotations[i]]
    mv_preds[i] = int(np.round(np.mean(votes)))

ds_acc = np.mean([ds_preds[i] == true_labels[i] for i in range(N_ITEMS)])
mv_acc = np.mean([mv_preds[i] == true_labels[i] for i in range(N_ITEMS)])

print(f"Majority vote accuracy:  {mv_acc:.3f}")
print(f"Dawid-Skene accuracy:    {ds_acc:.3f}")
print(f"\nEstimated annotator accuracies (diagonal of confusion matrix):")
for a in range(N_ANNOTATORS):
    est_acc = np.mean([confusion[a, k, k] for k in range(2)])
    print(f"  Annotator {a}: estimated={est_acc:.3f}, true={accuracies[a]:.2f}")
```

### MACE

**MACE (تقدير كفاءة المُوصِّفين المتعددين)** {cite}`hovy2013learning` نموذج احتمالي بديل يُمثِّل صراحةً إسبام المُوصِّف (التسمية العشوائية) مقابل التوصيف الكفء. إما أن يُقدِّم المُوصِّف تسمية ذات معنى (باحتمالية $1 - \text{spam}_j$) أو تسمية عشوائية (باحتمالية $\text{spam}_j$). هذا النموذج ذو المكوِّنَين غالباً أفضل معايرةً من داويد-سكين في سيناريوهات الاستعانة بالحشود حيث بعض المُوصِّفين مُسبِّمون صِرف.

---

## استراتيجية التكرار والتجميع

يعتمد العدد الأمثل من المُوصِّفين لكل عنصر على صعوبة المهمة وجودة المُوصِّف:

- **المهام السهلة مع المُوصِّفين المهرة:** 1–2 مُوصِّفَين لكل عنصر كثيراً ما يكفي
- **المهام المعتدلة مع المُوصِّفين المدرَّبين:** 3 مُوصِّفين + التصويت بالأغلبية
- **المهام الصعبة/الذاتية مع العمال الجماعيين:** 5–7 مُوصِّفين + داويد-سكين

الفكرة الجوهرية: التكرار الأكثر قيمةً حين تكون دقة المُوصِّم منخفضة. للمُوصِّفين بدقة $p$، دقة التصويت بالأغلبية مع $n$ مُوصِّف هي:

$$
P(\text{MV صحيح}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

بالنسبة لـ $p = 0.70$، إضافة مُوصِّف ثالث ترفع دقة التصويت بالأغلبية من 70% إلى 78%؛ بالنسبة لـ $p = 0.90$، المكسب من مُوصِّف ثالث ضئيل (من 90% إلى 97%).

```{seealso}
نموذج داويد-سكين: {cite}`dawid1979maximum`. MACE: {cite}`hovy2013learning`. لمراجعة شاملة للاستعانة بالحشود في معالجة اللغات الطبيعية: {cite}`snow2008cheap`. أخلاقيات الحشود والأجر العادل: راجع الفصل الخامس عشر.
```
