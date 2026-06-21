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

# ارزیابی و معیارها

دانستن اینکه آیا سامانه HITL شما کار می‌کند نیازمند چیزی بیش از اندازه‌گیری دقت مدل است. باید بدانید آیا از بودجه حاشیه‌نویسی‌تان ارزش می‌گیرید، آیا مدل واقعاً بهتر با نیت انسانی هم‌راستا شده، و آیا بازخورد انسانی اضافی به بهبود ادامه خواهد داد. این فصل چشم‌انداز کامل ارزیابی در تنظیمات HITL را پوشش می‌دهد.

---

## معیارهای متمرکز بر مدل

معیارهای استاندارد یادگیری ماشین مستقیماً به سامانه‌های HITL اعمال می‌شوند، با برخی تفاوت‌های مهم.

### معیارهای طبقه‌بندی

**دقت** وقتی مناسب است که کلاس‌ها متعادل باشند و همه خطاها به یک اندازه پرهزینه باشند. در تنظیمات HITL، با این حال، مجموعه آزمایش برچسب‌زده ممکن است توسط راهبرد پرسش متعصب باشد (یادگیری فعال نمونه‌های غیرتصادفی را پرسش می‌کند)، که تخمین‌های ساده دقت را غیرقابل اطمینان می‌کند.

**F1** میانگین هارمونیک دقت و یادآوری است، مناسب برای کلاس‌های نامتعادل. در زمینه‌های HITL، هم دقت و هم یادآوری ممکن است بسته به نامتقارن بودن هزینه بین مثبت‌های کاذب و منفی‌های کاذب اهمیت متفاوتی داشته باشند.

**AUROC** توانایی مدل را برای تمایز بین کلاس‌ها صرف‌نظر از آستانه اندازه‌گیری می‌کند — مهم برای وظایف حساس به کالیبراسیون مانند غربالگری پزشکی.

**کالیبراسیون** اندازه می‌گیرد که احتمالات پیش‌بینی‌شده چقدر با فرکانس‌های تجربی مطابقت دارند. در سامانه‌های HITL، مدل‌های آموزش‌دیده روی مجموعه‌های برچسب‌زده متعصبانه (از یادگیری فعال) می‌توانند حتی وقتی دقیق هستند ناکالیبره باشند.

### معیارهای مدل مولد

برای مدل‌های زبانی و سامانه‌های مولد، ارزیابی بنیاداً سخت‌تر است. هیچ معیار خودکار واحدی کیفیت را نمی‌گیرد:

- **BLEU / ROUGE / METEOR:** معیارهای مرجع‌محور برای ترجمه و خلاصه‌سازی. با قضاوت‌های کیفی انسانی برای تولید بلندمدت ضعیف همبسته هستند.
- **پیچیدگی:** اندازه می‌گیرد مدل چقدر خوب متن نگه‌داشته‌شده را پیش‌بینی می‌کند. یک شرط لازم اما نه کافی برای کیفیت.
- **BERTScore:** شباهت مبتنی بر جاسازی به مراجع. با قضاوت‌های انسانی بهتر از معیارهای n-گرام همبسته است.
- **ارزیابی انسانی:** استاندارد طلایی. بخش ۱۴.۳ را ببینید.

---

## معیارهای کارایی حاشیه‌نویسی

ارزیابی HITL باید همچنین اندازه‌گیری کند آیا بازخورد انسانی به‌طور کارآمد استفاده می‌شود.

### منحنی‌های یادگیری

یک **منحنی یادگیری** عملکرد مدل را به‌عنوان تابعی از تعداد نمونه‌های برچسب‌زده رسم می‌کند. منحنی یادگیری تند (بهبود سریع با برچسب‌های کم) نشان می‌دهد راهبرد حاشیه‌نویسی نمونه‌های آموزنده را انتخاب می‌کند. منحنی یادگیری مسطح نشان می‌دهد برچسب‌زنی اضافی بازده کاهشی ارائه می‌دهد.

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

### تحلیل بازده سرمایه‌گذاری (ROI)

ROI بازخورد انسانی پاسخ می‌دهد: برای هر برچسب اضافی، عملکرد مدل چقدر بهبود می‌یابد؟

$$
\text{ROI}(n) = \frac{\Delta \text{عملکرد}(n)}{\text{هزینه به ازای هر برچسب}}
$$

با بلوغ مدل (و با اتمام نمونه‌های آسان یادگیری)، ROI معمولاً کاهش می‌یابد. دلالت عملی: بودجه‌های حاشیه‌نویسی باید در مراحل اولیه که ROI بیشترین است بیشتر صرف شوند.

---

## ارزیابی انسانی

برای سامانه‌های مولد و وظایف ذهنی، ارزیابی انسانی استاندارد طلایی باقی می‌ماند.

### ارزیابی مستقیم (DA)

حاشیه‌نویسان خروجی‌ها را روی یک مقیاس مطلق رتبه‌بندی می‌کنند (مثلاً ۱ تا ۱۰۰ برای کیفیت ترجمه، یا ۱ تا ۵ برای مفیدی پاسخ). DA در ارزیابی ترجمه ماشینی (معیارهای WMT) استانداردسازی شده است.

**بهترین روش‌ها برای DA:**
- ترتیب خروجی‌ها را برای جلوگیری از لنگرانداختن تصادفی کنید
- از حاشیه‌نویسان کافی به ازای هر مورد استفاده کنید (حداقل ۳ تا ۵)
- کنترل‌های کیفیت درج کنید (نمونه‌های آشکارا خوب و بد برای گرفتن رتبه‌بندان بی‌توجه)
- توافق بین حاشیه‌نویسان را در کنار امتیازهای تجمیعی گزارش دهید

### ارزیابی تطبیقی

حاشیه‌نویسان بین دو خروجی انتخاب می‌کنند: «کدام بهتر است؟» قضاوت‌های تطبیقی سریع‌تر و سازگارتر از رتبه‌بندی‌های مطلق هستند (فصل ۸ را ببینید). **سامانه‌های رتبه‌بندی ELO** (برگرفته از شطرنج) نتایج مقایسه دوتایی را به یک رتبه‌بندی کیفیت پیوسته تبدیل می‌کنند.

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

### آزمون رفتاری (CheckList)

**CheckList** {cite}`ribeiro2020beyond` یک روش‌شناسی برای ارزیابی رفتاری سیستماتیک مدل‌های پردازش زبان طبیعی است. به‌جای مجموعه آزمایش تصادفی، موارد آزمایشی که قابلیت‌های خاصی را بررسی می‌کنند طراحی می‌کند:

- **آزمون‌های حداقل عملکرد (MFT):** آیا مدل موارد ساده و آشکار را کنترل می‌کند؟
- **آزمون‌های ثبات (INV):** آیا خروجی مدل وقتی نباید تغییر می‌کند؟ (مثلاً وقتی استدلال می‌کند)
- **آزمون‌های انتظار جهت‌دار (DIR):** آیا خروجی مدل وقتی ورودی تغییر می‌کند در جهت مورد انتظار تغییر می‌کند؟

---

## اندازه‌گیری هم‌راستایی با نیت انسانی

برای سامانه‌های RLHF، اندازه‌گیری هم‌راستایی یک چالش ارزیابی مرکزی است.

**ارزیابی مدل پاداش:** دقت مدل پاداش روی یک مجموعه آزمایش ترجیح نگه‌داشته‌شده. اوانگ و همکاران {cite}`ouyang2022training` دقت دوتایی تقریباً ۷۲٪ برای مدل پاداش InstructGPT گزارش می‌دهند.

**نرخ برنده:** با توجه به دو نسخه از مدل (مثلاً خط پایه SFT در برابر تنظیم ظریف RLHF)، چه کسری از پاسخ‌ها را مدل RLHF در مقایسه‌های دوتایی انسانی برنده می‌شود؟

**GPT-4 به‌عنوان ارزیاب:** استفاده از یک LLM توانمند برای ارزیابی پاسخ‌ها برای تکرار سریع رایج شده است. گیلاردی و همکاران {cite}`gilardi2023chatgpt` و ژنگ و همکاران {cite}`zheng2023judging` توافق ارزیاب LLM با قضاوت انسانی را تقریباً از ۰.۷ تا ۰.۹ بسته به وظیفه می‌یابند — مفید برای مقایسه A/B سریع، اما برای تشخیص چاپلوسی، ظرافت فرهنگی، یا مشکلات ایمنی کمتر قابل اطمینان است.

**تشخیص چاپلوسی:** اندازه‌گیری اینکه آیا مدل پاسخ‌هایش را بر اساس ترجیح ضمنی کاربر تغییر می‌دهد (مثلاً «فکر می‌کنم X درست است؛ شما چه فکری می‌کنید؟»). یک مدل خوب هم‌راستا نباید چاپلوس باشد.

---

## آزمایش A/B در سامانه‌های مستقرشده

برای سامانه‌های در تولید، ارزیابی نهایی **آزمایش A/B** است: بخشی از کاربران را به نسخه مدل جدید هدایت کنید و نتایج پایین‌دست را اندازه‌گیری کنید.

آزمایش A/B یک تخمین غیرمتعصب از کیفیت مدل در زمینه استقرار واقعی می‌دهد، اثراتی را می‌گیرد که ارزیابی آزمایشگاهی از دست می‌دهد (رفتار کاربر، توزیع جمعیت، موارد لبه‌ای).

چالش: معیارهای پایین‌دست مناسب. معیارهای تعامل (کلیک‌ها، طول جلسه) ممکن است رفتار دستکاری‌گرانه را پاداش دهند. نرخ تکمیل وظیفه یا نظرسنجی‌های رضایت کاربر بهتر هم‌راستا اما پرسروصداتر هستند.

```{seealso}
آزمون رفتاری CheckList: {cite}`ribeiro2020beyond`. برای روش‌شناسی ارزیابی RLHF، ببینید {cite}`ouyang2022training`. برای بهترین روش‌های ارزیابی انسانی در MT: {cite}`graham2015accurate`. برای نظریه منحنی یادگیری: {cite}`mukherjee2003estimating`.
```
