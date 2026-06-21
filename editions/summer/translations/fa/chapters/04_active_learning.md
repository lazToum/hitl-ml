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

# یادگیری فعال

داده برچسب‌زده گران است. بینش اصلی یادگیری فعال این است که *همه نمونه‌های بدون برچسب به یک اندازه آموزنده نیستند* — یک مدل می‌تواند سریع‌تر پیشرفت کند اگر بتواند انتخاب کند که درباره کدام نمونه‌ها بپرسد. به‌جای برچسب‌زنی تصادفی داده، یک سامانه یادگیری فعال یک راهنمای پرسش می‌کند (معمولاً یک حاشیه‌نویس انسانی) روی نمونه‌هایی که بیشترین احتمال را برای بهبود مدل دارند.

این فصل نظریه و عمل یادگیری فعال را پوشش می‌دهد: راهبردهای پرسش، چارچوب‌های نمونه‌گیری، معیارهای توقف، و ملاحظات عملی برای استقرارهای واقعی.

---

## راه‌اندازی یادگیری فعال

تنظیم استاندارد **یادگیری فعال مبتنی بر استخر** شامل:

- یک **مجموعه برچسب‌زده** $\mathcal{L} = \{(x_i, y_i)\}_{i=1}^n$ — در ابتدا کوچک
- یک **استخر بدون برچسب** $\mathcal{U} = \{x_j\}_{j=1}^m$ — معمولاً بسیار بزرگ‌تر از $\mathcal{L}$
- یک **راهنمای پرسش** $\mathcal{O}$ که می‌تواند $y = \mathcal{O}(x)$ را برای هر $x$ مورد پرسش‌شده برگرداند
- یک **راهبرد پرسش** $\phi$ که پرسش بعدی را انتخاب می‌کند $x^* = \phi(\mathcal{L}, \mathcal{U}, f_\theta)$

حلقه یادگیری فعال:

```text
    1. مقداردهی اولیه: L = مجموعه بذر برچسب‌زده کوچک، U = استخر بدون برچسب
    2. آموزش: f_θ ← train(L)
    3. پرسش: x* = argmax φ(x; f_θ) روی x ∈ U
    4. برچسب‌زنی: y* = O(x*)
    5. به‌روزرسانی: L ← L ∪ {(x*, y*)}, U ← U \ {x*}
    → از ۲ تکرار کنید تا بودجه تمام شود
```

هدف رسیدن به کیفیت هدف مدل با استفاده از کمترین تعداد ممکن پرسش از راهنما است.

---

## مبانی نظری

یک سؤال طبیعی این است: یادگیری فعال تا چه حد می‌تواند کمک کند؟ در بهترین حالت، یادگیری فعال می‌تواند کاهش‌های *نمایی* در پیچیدگی برچسب به دست آورد — رسیدن به خطای $\epsilon$ با $O(\log(1/\epsilon))$ برچسب به‌جای $O(1/\epsilon)$ که توسط یادگیری غیرفعال لازم است، حداقل در تنظیمات قابل‌تحقق با یک راهبرد پرسش خوب {cite}`settles2009active`.

در عمل، تضمین‌ها سخت‌تر به دست می‌آیند. **یادگیری فعال آگنوستیک** {cite}`balcan2006agnostic` نشان می‌دهد که صرفه‌جویی برچسب حتی وقتی مفهوم هدف در کلاس فرضیه نیست ممکن است، اما صرفه‌جویی‌ها به‌شدت به ضریب اختلاف‌نظر بستگی دارند — معیاری از اینکه مجموعه فرضیه‌های قابل قبول با تجمع داده چقدر سریع کوچک می‌شود.

نکته عملی کلیدی: مزیت یادگیری فعال زمانی بزرگ‌تر است که **مرز تصمیم ساده و متمرکز** باشد (بنابراین پرسش‌های عدم اطمینان به سرعت فرضیه‌های اشتباه را حذف می‌کنند)، و زمانی کوچک‌تر است که کلاس فرضیه بزرگ یا مرز پیچیده باشد.

---

## راهبردهای پرسش

### نمونه‌گیری عدم اطمینان

ساده‌ترین و پراستفاده‌ترین راهبرد: پرسش از نمونه‌ای که مدل *بیشترین عدم اطمینان* را درباره آن دارد {cite}`lewis1994sequential`.

**کمترین اطمینان** نمونه‌ای را پرسش می‌کند که مدل کمترین اطمینان را در پیش‌بینی برتر خود دارد:

$$
x^* = \argmax_{x \in \mathcal{U}} \left(1 - P_\theta(\hat{y} \mid x)\right)
$$

**نمونه‌گیری حاشیه** شکاف بین دو احتمال پیش‌بینی‌شده برتر را در نظر می‌گیرد:

$$
x^* = \argmin_{x \in \mathcal{U}} \left(P_\theta(\hat{y}_1 \mid x) - P_\theta(\hat{y}_2 \mid x)\right)
$$

**نمونه‌گیری آنتروپی** از توزیع پیش‌بینی‌شده کامل استفاده می‌کند:

$$
x^* = \argmax_{x \in \mathcal{U}} \left( -\sum_{k=1}^K P_\theta(y_k \mid x) \log P_\theta(y_k \mid x) \right)
$$

نمونه‌گیری آنتروپی از هر سه اصولی‌ترین است — همه کلاس‌ها را در نظر می‌گیرد — و معمولاً در مسائل چندکلاسه بهتر از بقیه عمل می‌کند.

### پرسش توسط کمیته (QbC)

یک **کمیته** از $C$ مدل (با استفاده از bagging، مقداردهی‌های اولیه متفاوت، یا معماری‌های متفاوت) آموزش دهید. نمونه‌ای را پرسش کنید که کمیته روی آن بیشترین اختلاف‌نظر را دارد:

$$
x^* = \argmax_{x \in \mathcal{U}} \; \text{اختلاف‌نظر}(\{f_c(x)\}_{c=1}^C)
$$

اختلاف‌نظر را می‌توان به‌عنوان **آنتروپی رأی** (آنتروپی روی اکثریت آرای کمیته) یا **واگرایی KL** از توزیع اجماع اندازه‌گیری کرد.

QbC تخمین‌های عدم اطمینان بهتری نسبت به یک مدل واحد ارائه می‌دهد اما نیاز به آموزش مدل‌های متعدد دارد که از نظر محاسباتی گران است.

### تغییر مدل مورد انتظار

نمونه‌ای را پرسش کنید که اگر برچسب‌زده شود بزرگ‌ترین تغییر را در مدل فعلی ایجاد کند. برای مدل‌های مبتنی بر گرادیان، این با نمونه با بزرگ‌ترین بزرگی گرادیان مورد انتظار مطابقت دارد {cite}`settles2008analysis`:

$$
x^* = \argmax_{x \in \mathcal{U}} \sum_{y \in \mathcal{Y}} P_\theta(y \mid x) \left\| \nabla_\theta \mathcal{L}(f_\theta(x), y) \right\|
$$

این راهبرد انگیزه نظری قوی دارد اما نیاز به محاسبه گرادیان برای هر نامزد دارد که برای مدل‌های بزرگ گران است.

### رویکردهای هسته‌ای / هندسی

راهبردهای مبتنی بر عدم اطمینان می‌توانند **نسبت به انحراف‌دهنده‌ها متعصب** باشند: یک نمونه غیرمعمول ممکن است عدم اطمینان بالایی داشته باشد اما نماینده توزیع داده نباشد. روش‌های هسته‌ای با جستجوی یک نمونه متنوع که فضای ویژگی را پوشش می‌دهد این را برطرف می‌کنند.

الگوریتم **k-center حریصانه** {cite}`sener2018active` کوچک‌ترین مجموعه نقاطی را پیدا می‌کند که هر نقطه بدون برچسب در فاصله $\delta$ از حداقل یک نقطه پرسش‌شده باشد:

$$
x^* = \argmax_{x \in \mathcal{U}} \min_{x' \in \mathcal{L}} d(x, x')
$$

یعنی نقطه‌ای را پرسش کنید که از هر نقطه برچسب‌زده فعلی دورتر است. این مجموعه حاشیه‌نویسی با پراکندگی خوب را تشویق می‌کند.

### BADGE

**یادگیری فعال دسته‌ای از طریق جاسازی‌های گرادیان متنوع** {cite}`ash2020deep` عدم اطمینان و تنوع را ترکیب می‌کند: دسته‌ای از نمونه‌ها را انتخاب می‌کند که جاسازی‌های گرادیانشان (نسبت به برچسب پیش‌بینی‌شده) هم در بزرگی بزرگ هستند (نامطمئن) و هم متنوع (پوشش‌دهنده مناطق مختلف فضای گرادیان). این یکی از رقابتی‌ترین راهبردهای مدرن است.

---

## تخمین عدم اطمینان برای مدل‌های عمیق

راهبردهای بالا دسترسی به خروجی‌های احتمالاتی کالیبره از مدل را فرض می‌کنند. برای مدل‌های ساده (رگرسیون لجستیک، طبقه‌بند‌های softmax)، این ساده است. برای شبکه‌های عمیق، به دست آوردن تخمین‌های عدم اطمینان قابل‌اعتماد به تکنیک اضافی نیاز دارد.

### دو نوع عدم اطمینان

به دنبال کندال و گال {cite}`kendall2017uncertainties`، تمایز می‌گذاریم:

**عدم اطمینان آلئاتوریک** (عدم اطمینان داده): نویز ذاتی در مشاهدات که با جمع‌آوری داده بیشتر نمی‌توان آن را کاهش داد. یک تصویر تار از نظر آلئاتوریک نامطمئن است — هیچ مقدار داده آموزشی اضافی از توزیع یکسان مدل را نسبت به آن مطمئن‌تر نخواهد کرد.

**عدم اطمینان معرفتی** (عدم اطمینان مدل): عدم اطمینان به دلیل داده آموزشی محدود یا مدلی که نمونه‌های مشابه را ندیده. عدم اطمینان معرفتی *می‌تواند* با برچسب‌زنی داده بیشتر کاهش یابد — و بنابراین کمیت مرتبط برای انتخاب پرسش یادگیری فعال است.

برای یادگیری فعال، می‌خواهیم نمونه‌هایی با عدم اطمینان معرفتی بالا را پرسش کنیم، نه عدم اطمینان آلئاتوریک بالا. پرسش از یک نمونه اساساً مبهم تلاش راهنما را هدر می‌دهد: هیچ برچسبی که ارائه می‌دهند به وضوح درست نخواهد بود.

### MC Dropout

یک رویکرد عملی برای تخمین عدم اطمینان معرفتی برای شبکه‌های عصبی **MC Dropout** {cite}`gal2016dropout` است: dropout را در زمان استنتاج اعمال کنید و $T$ عبور رو به جلو اجرا کنید. واریانس در پیش‌بینی‌ها تخمینی از عدم اطمینان معرفتی است.

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

در شبکه آموزش‌ندیده بالا، هر دو نمونه عدم اطمینان مشابه نشان می‌دهند. پس از آموزش، نمونه خارج از توزیع عدم اطمینان معرفتی بالاتری نشان خواهد داد — مدل نگاشت قابل‌اعتمادی برای ورودی‌های دور از توزیع آموزشی یاد نگرفته است.

### انسامبل‌های عمیق

آموزش $M$ مدل با مقداردهی اولیه مستقل و میانگین‌گیری پیش‌بینی‌هایشان تخمین عدم اطمینان ساده‌تر و اغلب قابل‌اطمینان‌تری نسبت به MC Dropout ارائه می‌دهد {cite}`lakshminarayanan2017simple`. اختلاف‌نظر بین اعضای انسامبل سیگنال عدم اطمینان معرفتی است.

---

## یک حلقه یادگیری فعال کامل

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

## مشکل شروع سرد

یادگیری فعال برای امتیازدهی به نقاط بدون برچسب به یک مدل آموزش‌دیده نیاز دارد — اما در ابتدا هیچ (یا بسیار کم) نمونه برچسب‌زده‌ای ندارید. این **مشکل شروع سرد** است.

راه‌حل‌های عملی:

۱. **مقداردهی اولیه تصادفی:** یک مجموعه بذر تصادفی کوچک (۲۰ تا ۱۰۰ نمونه) قبل از شروع یادگیری فعال برچسب بزنید.
۲. **مقداردهی اولیه مبتنی بر خوشه‌بندی:** از k-means روی استخر بدون برچسب استفاده کنید؛ یک نمونه از هر خوشه برچسب بزنید. این تنوع را در مجموعه برچسب‌زده اولیه تضمین می‌کند.
۳. **انتخاب مبتنی بر جاسازی:** از یک رمزگذار پیش‌آموزش‌دیده برای جاسازی نمونه‌ها استفاده کنید؛ زیرمجموعه‌ای متنوع از طریق هسته‌ای انتخاب کنید.

برای اغلب وظایف، چند ده برچسب بذر تصادفی معمولاً برای شروع یادگیری فعال کافی است؛ تعداد دقیق به تعادل کلاس، بُعد ویژگی، و پیچیدگی مدل بستگی دارد.

---

## یادگیری فعال حالت دسته‌ای

در عمل، حاشیه‌نویسان در دسته‌ها کار می‌کنند — آموزش و استقرار یک مدل جدید پس از هر برچسب واحد ناکارآمد است. **یادگیری فعال حالت دسته‌ای** یک مجموعه از $b$ نمونه را برای برچسب‌زنی همزمان انتخاب می‌کند.

انتخاب ساده $b$ نمونه با بیشترین عدم اطمینان منجر به **افزونگی** می‌شود: نمونه‌های بسیار نامطمئن تمایل دارند خوشه‌بندی شوند (مثلاً نمونه‌هایی نزدیک مرز تصمیم در یک منطقه). راهبردهای دسته بهتر هم برای عدم اطمینان *و هم* تنوع درون دسته بهینه می‌شوند.

**فرآیندهای نقطه‌ای تعیین‌کننده (DPP)** راهی اصولی برای نمونه‌گیری دسته‌های متنوع ارائه می‌دهند: توزیعی روی زیرمجموعه‌ها تعریف می‌کنند که موارد مشابه را جریمه می‌کند. احتمال یک زیرمجموعه $S$ تحت یک DPP متناسب با $\det(L_S)$ است که $L$ یک ماتریس هسته رمزگذار شباهت است.

---

## معیارهای توقف

یادگیری فعال چه زمانی باید متوقف شود؟ معیارهای رایج:

- **بودجه تمام شد:** ساده‌ترین — وقتی بودجه حاشیه‌نویسی تمام شد متوقف شوید.
- **پلاتوی عملکرد:** وقتی دقت مدل روی یک مجموعه اعتبارسنجی نگه‌داشته‌شده برای $k$ دور متوالی بیش از $\delta$ بهبود نیافت متوقف شوید.
- **آستانه اطمینان:** وقتی کمتر از بخشی از نمونه‌های بدون برچسب عدم اطمینان بالاتر از آستانه دارند متوقف شوید.
- **حداکثر کاهش اتلاف:** حداکثر سود ممکن از برچسب‌های اضافی را تخمین بزنید؛ وقتی این به زیر آستانه‌ای افتاد متوقف شوید {cite}`bloodgood2009method`.

---

## وقتی یادگیری فعال کار می‌کند (و وقتی نمی‌کند)

یادگیری فعال وقتی خوب عمل می‌کند که:
- برچسب‌زنی گران است و استخر بدون برچسب بزرگ است
- داده ساختار روشنی دارد که مدل می‌تواند برای شناسایی نمونه‌های آموزنده از آن استفاده کند
- کلاس مدل برای وظیفه مناسب است

یادگیری فعال ضعیف عمل می‌کند وقتی:
- مدل اولیه بسیار ضعیف است (شروع سرد) و نمی‌تواند نمونه‌ها را به‌معنادار رتبه‌بندی کند
- راهبرد پرسش انحراف‌دهنده‌ها یا نمونه‌های اشتباه برچسب‌زده را انتخاب می‌کند (مقاومت در برابر نویز اهمیت دارد)
- توزیع داده بین استخر بدون برچسب و توزیع آزمایش تغییر می‌کند

یک نگرانی عملی کلیدی **ناسازگاری توزیع** است: یادگیری فعال تمایل دارد نمونه‌هایی نزدیک مرز تصمیم پرسش کند و یک مجموعه برچسب‌زده متعصبانه ایجاد کند که ممکن است توزیع آزمایش را به‌خوبی نمایندگی نکند. این می‌تواند منجر به مرزهای تصمیم به‌خوبی آموزش‌دیده اما کالیبراسیون ضعیف شود.

```{seealso}
بررسی بنیادی {cite}`settles2009active` است. مبانی نظری (پیچیدگی برچسب، کران‌های آگنوستیک): {cite}`balcan2006agnostic`. برای یادگیری فعال خاص یادگیری عمیق، ببینید {cite}`ash2020deep` (BADGE) و {cite}`sener2018active` (هسته‌ای). برای ارزیابی انتقادی از اینکه چه زمانی یادگیری فعال واقعاً کمک می‌کند، ببینید {cite}`lowell2019practical`. درباره عدم اطمینان آلئاتوریک در برابر معرفتی برای مدل‌های عمیق، ببینید {cite}`kendall2017uncertainties`؛ برای انسامبل‌های عمیق به‌عنوان تخمین‌زننده‌های عدم اطمینان، ببینید {cite}`lakshminarayanan2017simple`؛ برای MC Dropout به‌عنوان استنتاج بیزی تقریبی، ببینید {cite}`gal2016dropout`.
```
