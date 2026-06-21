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

# برون‌سپاری جمعی و کنترل کیفیت

وقتی وظایف حاشیه‌نویسی به‌اندازه کافی ساده هستند که افراد غیرمتخصص می‌توانند انجام دهند، بسترهای برون‌سپاری جمعی دسترسی به نیروهای کار حاشیه‌نویسی بزرگ و درخواستی با هزینه پایین به ازای هر مورد ارائه می‌دهند. ساختن مجموعه‌داده‌های برچسب‌زده با کیفیت بالا از جمعیت نیاز به طراحی دقیق وظیفه، افزونگی راهبردی، و کنترل کیفیت دقیق دارد.

---

## بسترهای برون‌سپاری جمعی

**Amazon Mechanical Turk (MTurk)** بازارگاه اصلی برون‌سپاری جمعی است که در سال ۲۰۰۵ راه‌اندازی شد. کارگران («Turker‌ها») وظایف خُردکار (HIT‌ها) پست‌شده توسط درخواست‌کنندگان را تکمیل می‌کنند. یک مطالعه ۲۰۱۸ درآمد ساعتی مؤثر میانه برای Turker‌ها را تقریباً ۲ دلار در ساعت یافت — خیلی پایین‌تر از حداقل دستمزد در بسیاری از کشورهای با درآمد بالا {cite}`hara2018data` — یک نگرانی اخلاقی که در فصل ۱۵ بحث می‌شود.

**Prolific** یک بستر برون‌سپاری جمعی دانشگاهی است که یک استاندارد حداقل پرداخت (در حال حاضر حدود ۹ پوند در ساعت، تقریباً ۱۱ دلار در ساعت، طبق دستورالعمل‌های منتشرشده Prolific) را اجرا می‌کند، شرکت‌کنندگان را بر اساس ویژگی‌های جمعیتی غربال می‌کند، و یک پانل از کارگرانی که در مشارکت در پژوهش اعلام آمادگی کرده‌اند حفظ می‌کند.

**Appen** (و مشابه: Telus International، iMerit) نیروهای کار حاشیه‌نویسی مدیریت‌شده با مدیریت کیفیت ارائه می‌دهند، که برای وظایف با پیچیدگی بالاتر و پروژه‌های سازمانی استفاده می‌شود.

**جوامع تخصصی.** برای وظایف خاص حوزه، جوامع علاقه‌مند به آن حوزه می‌توانند حاشیه‌نویسی با کیفیت بالا ارائه دهند: Galaxy Zoo برای نجوم، eBird برای گونه‌های پرندگان، Chess Tempo برای حاشیه‌نویسی موقعیت شطرنج.

---

## طراحی وظیفه برای برون‌سپاری جمعی

### تجزیه وظایف پیچیده

وظایف پیچیده باید به وظایف خُردکار ساده و خوب تعریف‌شده تجزیه شوند. به‌جای اینکه از کارگران بخواهید یک سند را به‌طور جامع حاشیه‌نویسی کنند، یک سؤال متمرکز به یک بار بپرسید: «آیا این جمله نام یک شخص دارد؟» یا «وضوح این ترجمه را روی مقیاس ۱ تا ۵ رتبه‌بندی کنید.»

**مزایای تجزیه:**
- تقاضای شناختی کمتر به ازای هر وظیفه ← کمتر خستگی، کیفیت بالاتر
- هر وظیفه خُردکار می‌تواند جداگانه کنترل کیفیت شود
- ممیزی و رفع اشکال آسان‌تر

### اهمیت دستورالعمل‌ها

تنها پیش‌بینی‌کننده بزرگ کیفیت برون‌سپاری جمعی کیفیت دستورالعمل است. دستورالعمل‌های خوب:
- *هدف* وظیفه را در یک جمله توضیح می‌دهند
- یک تعریف روشن و غیرمبهم از هر دسته می‌دهند
- ۳ تا ۵ نمونه کار‌شده (به‌ویژه موارد لبه‌ای) ارائه می‌دهند
- آنقدر طولانی نیستند که کارگران واقعاً بخوانند (< ۳۰۰ کلمه برای وظایف ساده)

یک **مطالعه آزمایشی** (۱۰ تا ۵۰ کارگر، ۲۰ تا ۱۰۰ وظیفه) قبل از مقیاس‌بندی اجرا کنید. اختلاف‌نظرهای آزمایشی را تحلیل کنید؛ اغلب به ابهامات دستورالعمل اشاره دارند که می‌توان برطرف کرد.

### سؤالات استاندارد طلایی

**سؤالات استاندارد طلایی** — وظایف با پاسخ‌های صحیح شناخته‌شده — را در سراسر دسته وظیفه جاسازی کنید. کارگرانی که زیر آستانه‌ای از سؤالات طلایی را شکست می‌خورند از پروژه حذف می‌شوند.

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

## مدل‌های آماری برای تجمیع برچسب

رأی اکثریت یک خط پایه طبیعی است اما تفاوت‌ها در دقت حاشیه‌نویس را نادیده می‌گیرد. مدل‌های آماری می‌توانند بهتر عمل کنند.

### مدل داوید-اسکنه

**مدل داوید-اسکنه (DS)** {cite}`dawid1979maximum` به‌طور همزمان تخمین می‌زند:
- **برچسب واقعی** $z_i$ برای هر مورد $i$
- **ماتریس آشفتگی** $\pi_j^{(k,l)}$ برای هر حاشیه‌نویس $j$: احتمال اینکه حاشیه‌نویس $j$ مورد با کلاس واقعی $k$ را به‌عنوان کلاس $l$ برچسب بزند

الگوریتم EM تکرار می‌کند:
- **گام E:** با توجه به ماتریس‌های آشفتگی حاشیه‌نویس، احتمال پسین هر برچسب واقعی را محاسبه کنید
- **گام M:** با توجه به تخمین‌های برچسب مورد، ماتریس‌های آشفتگی حاشیه‌نویس را به‌روز کنید

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

**MACE (تخمین شایستگی چند حاشیه‌نویس)** {cite}`hovy2013learning` یک مدل احتمالاتی جایگزین است که صریحاً هرزنامه‌بودن حاشیه‌نویس (برچسب‌زنی تصادفی) در مقابل حاشیه‌نویسی شایسته را نشان می‌دهد. یک حاشیه‌نویس یا یک برچسب معنادار می‌دهد (با احتمال $1 - \text{spam}_j$) یا یک برچسب تصادفی می‌دهد (با احتمال $\text{spam}_j$). این مدل دو-مؤلفه‌ای اغلب برای سناریوهای برون‌سپاری جمعی که برخی حاشیه‌نویسان هرزنامه‌باز خالص هستند بهتر کالیبره است.

---

## افزونگی و راهبرد تجمیع

تعداد بهینه حاشیه‌نویسان به ازای هر مورد به دشواری وظیفه و کیفیت حاشیه‌نویس بستگی دارد:

- **وظایف آسان با حاشیه‌نویسان ماهر:** ۱ تا ۲ حاشیه‌نویس به ازای هر مورد اغلب کافی است
- **وظایف متوسط با حاشیه‌نویسان آموزش‌دیده:** ۳ حاشیه‌نویس + رأی اکثریت
- **وظایف دشوار/ذهنی با کارگران جمعی:** ۵ تا ۷ حاشیه‌نویس + داوید-اسکنه

بینش کلیدی: افزونگی وقتی بیشترین ارزش را دارد که دقت حاشیه‌نویس پایین باشد. برای حاشیه‌نویسان با دقت $p$، دقت رأی اکثریت با $n$ حاشیه‌نویس:

$$
P(\text{رأی اکثریت درست}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

برای $p = 0.70$، اضافه‌کردن حاشیه‌نویس سوم دقت رأی اکثریت را از ۷۰٪ به ۷۸٪ افزایش می‌دهد؛ برای $p = 0.90$، سود از حاشیه‌نویس سوم ناچیز است (از ۹۰٪ به ۹۷٪).

```{seealso}
مدل داوید-اسکنه: {cite}`dawid1979maximum`. MACE: {cite}`hovy2013learning`. برای یک مرور جامع از برون‌سپاری جمعی برای پردازش زبان طبیعی: {cite}`snow2008cheap`. اخلاق جمعیت و پرداخت منصفانه: فصل ۱۵ را ببینید.
```
