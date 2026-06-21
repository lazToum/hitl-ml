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

# یادگیری تقویتی از بازخورد انسانی

هیچ تکنیکی بیش از یادگیری تقویتی از بازخورد انسانی (RLHF) نقشی در ورود HITL ML به جریان اصلی نداشته است. این مکانیزم پشت InstructGPT {cite}`ouyang2022training` و یک جزء اصلی از خطوط لوله دنبال‌کردن دستورالعمل در بسیاری از مدل‌های زبانی بزرگ مدرن {cite}`stiennon2020learning` است. درک RLHF — نه فقط به‌عنوان دستورالعملی برای پیروی، بلکه به‌عنوان رویکردی اصولی برای هم‌راستایی — برای هر کسی که در هوش مصنوعی مدرن کار می‌کند ضروری است.

---

## مسئله هم‌راستایی

مدل‌های زبانی بزرگ (LLM) که صرفاً روی پیش‌بینی نشانه بعدی آموزش می‌بینند، یک هدف نیابتی را بهینه می‌کنند: پیش‌بینی اینکه چه متنی بعد از متن نوشته‌شده توسط انسان می‌آید. این هدف مرتبط است با، اما متمایز از آنچه ما واقعاً می‌خواهیم: پاسخ‌هایی که مفید، دقیق، ایمن، و هم‌راستا با ارزش‌های انسانی هستند.

عدم تطابق بین هدف آموزش و رفتار مطلوب **مسئله هم‌راستایی** {cite}`russell2019human` نامیده می‌شود. به‌طور ملموس، یک مدل زبانی آموزش‌دیده روی متن اینترنتی یاد می‌گیرد:
- ادامه‌هایی که معقول به نظر می‌رسد تولید کند (که ممکن است از نظر واقعی اشتباه باشند)
- تعصبات و آسیب‌های موجود در داده آموزشی را منعکس کند
- وقتی آنچه از نظر آماری پس از درخواست می‌آید اجتناب یا دستکاری است، چنین باشد

RLHF با قراردادن ترجیحات انسانی به‌عنوان *بخشی از هدف بهینه‌سازی* مسئله هم‌راستایی را برطرف می‌کند.

---

## خط لوله RLHF

RLHF در سه مرحله پیش می‌رود:

```text
مرحله ۱: تنظیم ظریف نظارت‌شده (SFT)
  --> جمع‌آوری داده نمایش (انسان پاسخ‌های ایده‌آل می‌نویسد)
  --> تنظیم ظریف LLM پایه روی نمایش‌ها

مرحله ۲: آموزش مدل پاداش
  --> جمع‌آوری ترجیحات دوتایی (انسان A در برابر B را رتبه‌بندی می‌کند)
  --> آموزش مدل پاداش R(x, y) برای پیش‌بینی ترجیحات انسانی

مرحله ۳: تنظیم ظریف تقویتی
  --> تنظیم ظریف LLM با استفاده از PPO/RL برای به حداکثر رساندن R(x, y)
  --> جریمه KL از انحراف بیش از حد از مدل SFT جلوگیری می‌کند
```

### مرحله ۱: تنظیم ظریف نظارت‌شده

با شروع از یک مدل پایه پیش‌آموزش‌دیده $\pi_0$، یک مجموعه‌داده از جفت‌های (درخواست، پاسخ ایده‌آل) جمع‌آوری می‌کنیم که توسط پیمانکاران انسانی که دستورالعمل‌های دقیقی را دنبال می‌کنند نوشته یا انتخاب شده‌اند. مدل روی این نمایش‌ها با استفاده از آنتروپی متقاطع استاندارد تنظیم ظریف می‌شود:

$$
\mathcal{L}_\text{SFT}(\theta) = -\mathbb{E}_{(x, y) \sim \mathcal{D}_\text{demo}} \left[ \log \pi_\theta(y \mid x) \right]
$$

مدل SFT $\pi_\text{SFT}$ نقطه شروع بسیار بهتری برای RLHF نسبت به مدل پیش‌آموزش‌دیده خام است.

### مرحله ۲: آموزش مدل پاداش

برای مجموعه‌ای از درخواست‌ها $\{x_i\}$، برای هر درخواست $K$ پاسخ با استفاده از $\pi_\text{SFT}$ تولید می‌کنیم و آن‌ها را به‌عنوان مقایسه‌های دوتایی به برچسب‌زنان انسانی ارائه می‌دهیم: «کدام پاسخ بهتر است، A یا B؟»

مدل پاداش $r_\phi$ برای پیش‌بینی این ترجیحات آموزش می‌بیند. تحت **مدل Bradley-Terry** (فصل ۸)، احتمال اینکه پاسخ $y_w$ نسبت به $y_l$ ترجیح داده شود این است:

$$
P(y_w \succ y_l \mid x) = \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)
$$

مدل پاداش برای به حداقل رساندن اتلاف رتبه‌بندی دوتایی آموزش می‌بیند:

$$
\mathcal{L}_\text{RM}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_\text{pref}} \left[ \log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) \right]
$$

مدل پاداش معمولاً از مدل SFT با یک سر اسکالر که لایه نهایی را جایگزین می‌کند مقداردهی اولیه می‌شود.

### مرحله ۳: تنظیم ظریف تقویتی با PPO

با یک مدل پاداش آموزش‌دیده، می‌توانیم از یادگیری تقویتی برای تنظیم ظریف LLM استفاده کنیم. هر درخواست $x$ یک وضعیت است؛ هر پاسخ $y$ یک مسیر از انتخاب‌های نشانه است؛ و پاداش $r_\phi(x, y)$ است.

هدف بهینه‌سازی شامل یک **جریمه واگرایی KL** است تا از انحراف بیش از حد مدل از خط پایه SFT جلوگیری کند (که منجر به هک پاداش {cite}`krakovna2020specification,gao2023scaling` می‌شود):

$$
\max_\theta \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot | x)} \left[ r_\phi(x, y) - \beta \cdot \text{KL}\left[\pi_\theta(\cdot \mid x) \| \pi_\text{SFT}(\cdot \mid x)\right] \right]
$$

پارامتر $\beta$ قدرت جریمه KL را کنترل می‌کند. $\beta$ کوچک بهینه‌سازی بیشتری را اجازه می‌دهد اما خطر هک پاداش را افزایش می‌دهد؛ $\beta$ بزرگ مدل را نزدیک به SFT نگه می‌دارد اما دستاوردهای هم‌راستایی را محدود می‌کند.

**بهینه‌سازی سیاست پروکسیمال (PPO)** {cite}`schulman2017proximal` الگوریتم استاندارد برای این مرحله است که به دلیل پایداری‌اش نسبت به روش‌های گرادیان سیاست خام انتخاب شده است.

---

## یک نمایش ساده‌شده RLHF

خط لوله کامل RLHF نیازمند زیرساخت بزرگ‌مقیاس است. مثال زیر ایده‌های اصلی را در مقیاس کوچک نشان می‌دهد.

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.nn import functional as F

torch.manual_seed(42)
rng = np.random.default_rng(42)

# -----------------------------------------------
# Toy setup: responses are 4-dimensional vectors
# "Quality" is known analytically (sum of positive values)
# We simulate a reward model learning this from pairwise feedback
# -----------------------------------------------

class RewardModel(nn.Module):
    def __init__(self, d=4, hidden=32):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden), nn.ReLU(),
            nn.Linear(hidden, 1)
        )
    def forward(self, x):
        return self.net(x).squeeze(-1)

def true_quality(x):
    """The hidden ground-truth reward function."""
    return x.sum(dim=-1) + 0.5 * (x ** 2).mean(dim=-1)

# Generate pairwise preference data
N_PAIRS = 500
X1 = torch.randn(N_PAIRS, 4)
X2 = torch.randn(N_PAIRS, 4)
q1, q2 = true_quality(X1), true_quality(X2)
# Human prefers X1 when q1 > q2 (with some noise)
noise = torch.randn(N_PAIRS) * 0.5
preferred_1 = ((q1 - q2 + noise) > 0).float()

# Train reward model
rm = RewardModel(d=4, hidden=32)
optimizer = optim.Adam(rm.parameters(), lr=3e-3)

losses = []
for epoch in range(200):
    r1 = rm(X1)
    r2 = rm(X2)
    # Bradley-Terry loss
    logit = r1 - r2
    loss = F.binary_cross_entropy_with_logits(logit, preferred_1)
    optimizer.zero_grad(); loss.backward(); optimizer.step()
    losses.append(loss.item())

# Evaluate: does the reward model agree with true quality?
X_eval = torch.randn(1000, 4)
with torch.no_grad():
    r_pred = rm(X_eval).numpy()
    r_true = true_quality(X_eval).numpy()

corr = np.corrcoef(r_pred, r_true)[0, 1]
print(f"Reward model correlation with true quality: {corr:.4f}")
print(f"Final training loss: {losses[-1]:.4f}")

import matplotlib.pyplot as plt
plt.figure(figsize=(8, 3))
plt.subplot(1, 2, 1)
plt.plot(losses, color='#2b3a8f', linewidth=1.5)
plt.xlabel("Epoch"); plt.ylabel("Pairwise loss")
plt.title("Reward Model Training")

plt.subplot(1, 2, 2)
plt.scatter(r_true[:200], r_pred[:200], alpha=0.4, s=15, color='#2b3a8f')
plt.xlabel("True quality"); plt.ylabel("Predicted reward")
plt.title(f"Reward Model vs. Truth (r={corr:.3f})")
plt.tight_layout()
plt.savefig('reward_model.png', dpi=150)
plt.show()
```

---

## چالش‌های RLHF

### هک پاداش

یک حالت شکست کلیدی: سیاست راه‌هایی برای گرفتن پاداش بالا از مدل پاداش پیدا می‌کند که با رفتار واقعاً خوب مطابقت ندارد. به‌عنوان مثال، یک LLM ممکن است یاد بگیرد پاسخ‌هایی تولید کند که تملق‌آمیز یا با اعتماد بیان شده هستند (که برچسب‌زنان تمایل دارند بالا رتبه‌بندی کنند) به‌جای دقیق.

هک پاداش وقتی محتمل‌تر است که:
- مدل پاداش روی داده ترجیح ناکافی آموزش دیده باشد
- سیاست اجازه داشته باشد از خط پایه SFT دور شود (β کوچک)
- توزیع مدل پاداش در طول آموزش PPO تغییر کند

**راهبردهای کاهش:** جریمه KL، آموزش تکراری مدل پاداش، ارزیابی متنوع، قیود هوش مصنوعی قانون‌اساسی.

### تعصب ارزیاب

برچسب‌زنان انسانی تعصبات سیستماتیک دارند. آن‌ها تمایل دارند پاسخ‌های طولانی‌تر (تعصب پرحرفی)، متن با اعتماد بیشتر (تعصب اعتماد)، و پاسخ‌هایی که با باورهای قبلی‌شان موافقند را ترجیح دهند. این تعصبات وارد مدل پاداش می‌شوند.

شکست معروف چاپلوسی مدل‌های RLHF — جایی که مدل به کاربران آنچه می‌خواهند بشنوند نه آنچه درست است می‌گوید — بخشاً نتیجه ترجیح ارزیاب برای پاسخ‌های موافق است.

### نظارت مقیاس‌پذیر

برای وظایف پیچیده، انسان‌ها نمی‌توانند به‌طور قابل‌اطمینانی قضاوت کنند کدام پاسخ هوش مصنوعی درست است. یک برچسب‌زن که دو اثبات ریاضی طولانی یا دو پیاده‌سازی کد را مقایسه می‌کند ممکن است صرفاً خواناتر را انتخاب کند، صرف‌نظر از صحت. **نظارت مقیاس‌پذیر** مسئله پژوهشی باز در طراحی روش‌های ارزیابی است که با پیچیدگی وظیفه قابل‌اطمینان باقی می‌ماند {cite}`bowman2022measuring`.

---

## هوش مصنوعی قانون‌اساسی (RLAIF)

**هوش مصنوعی قانون‌اساسی** {cite}`bai2022constitutional`، توسعه‌یافته در Anthropic، با استفاده از خود هوش مصنوعی برای تولید برچسب‌های ترجیح هدایت‌شده توسط مجموعه‌ای از اصول (یک «قانون اساسی») وابستگی به برچسب‌زنان انسانی را کاهش می‌دهد. فرآیند:

۱. تولید پاسخ به درخواست‌های بالقوه مضر
۲. استفاده از یک منتقد هوش مصنوعی برای ارزیابی پاسخ‌ها در برابر اصول قانون اساسی
۳. بازبینی پاسخ‌ها با راهنمایی بازخورد هوش مصنوعی (RLAIF — یادگیری تقویتی از بازخورد هوش مصنوعی)
۴. آموزش یک مدل پاداش روی ترجیحات تولیدشده توسط هوش مصنوعی
۵. تنظیم ظریف با RLHF با استفاده از این مدل پاداش

RLAIF می‌تواند داده ترجیح را در مقیاس بسیار بزرگ‌تری نسبت به برچسب‌زنی انسانی تولید کند، و کنترل ظریفی بر ارزش‌های رمزگذاری‌شده در مدل پاداش اجازه می‌دهد.

```{seealso}
مقاله اصلی InstructGPT {cite}`ouyang2022training` اولین کاربرد بزرگ‌مقیاس RLHF بر LLM را توصیف می‌کند. کار بنیادی RLHF برای یادگیری تقویتی عمیق در {cite}`christiano2017deep` است. PPO در {cite}`schulman2017proximal` توصیف شده. هوش مصنوعی قانون‌اساسی از {cite}`bai2022constitutional` است.
```
