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

# یادگیری از نمایش‌ها

وقتی مشخص‌کردن یک وظیفه سخت اما نشان‌دادن آن آسان است، ممکن است آموزش از طریق نمونه کارآمدتر از تعریف از طریق قانون باشد. یک متخصص انسانی نشان می‌دهد بازوی رباتیک چگونه یک شیء را بگیرد؛ تعامل یک برنامه‌نویس با IDE یک دنباله از ویرایش‌های صحیح را ارائه می‌دهد؛ یک استاد شطرنج بازی می‌کند. **یادگیری از نمایش‌ها** یک سیاست را از این داده رفتاری استخراج می‌کند و نیاز به توابع پاداش دست‌ساز یا مشخصات صریح وظیفه را نفی می‌کند.

---

## شبیه‌سازی رفتاری

ساده‌ترین رویکرد **شبیه‌سازی رفتاری (BC)** است: نمایش را به‌عنوان داده نظارت‌شده در نظر بگیرید و یک نگاشت از حالت‌ها به اعمال بیاموزید.

با توجه به یک مجموعه‌داده از جفت‌های حالت-عمل $\mathcal{D} = \{(s_i, a_i)\}$ از یک نمایشگر متخصص، یک سیاست $\pi_\theta(a \mid s)$ را با به حداقل رساندن احتمال لگاریتمی منفی برازش می‌کنیم:

$$
\mathcal{L}_\text{BC}(\theta) = -\frac{1}{|\mathcal{D}|} \sum_{(s, a) \in \mathcal{D}} \log \pi_\theta(a \mid s)
$$

این دقیقاً یادگیری نظارت‌شده استاندارد اعمال‌شده به داده متوالی است.

### مشکل جابجایی کوواریانس

BC یک ضعف بنیادی دارد: **جابجایی توزیع** بین آموزش و استقرار. نمایش‌های متخصص حالت‌هایی را پوشش می‌دهند که متخصص بازدید می‌کند. اما در طول استقرار، سیاست آموخته‌شده ممکن است تصمیمات کمی متفاوت بگیرد و به حالت‌هایی که متخصص هرگز بازدید نکرده برسد — حالت‌هایی که سیاست هیچ نظارتی ندارد و ممکن است بدتر عمل کند.

به‌طور حیاتی، خطاها **ترکیب** می‌شوند: یک انحراف کوچک به حالت ناآشنا منجر می‌شود، جایی که یک عمل کمی اشتباه به حالت ناآشناتر منجر می‌شود، و به همین ترتیب. عملکرد به شکل $O(T^2 \epsilon)$ کاهش می‌یابد که $T$ طول قسمت و $\epsilon$ نرخ خطا در هر مرحله است — بسیار بدتر از کاهش $O(T\epsilon)$ یک سیاست راهنما {cite}`ross2010efficient`.

```{admonition} نمونه: رانندگی خودکار
:class: note

یک مدل شبیه‌سازی رفتاری برای نگه‌داشتن خط که روی داده رانندگی انسانی آموزش دیده روی جاده‌های مستقیم (حالت‌هایی نزدیک توزیع آموزشی) خوب عمل می‌کند. اما لحظه‌ای که کمی منحرف می‌شود — حالتی که هیچ رانندهٔ انسانی در آن نخواهد بود چون قبلاً تصحیح می‌کردند — داده‌ای برای راهنمایی آن وجود ندارد و ممکن است از جاده خارج شود.
```

```text
الگوریتم DAgger:
  مقداردهی اولیه: D <- {} (مجموعه‌داده خالی)
  سیاست اولیه pi_1 را روی M نمایش متخصص آموزش دهید

  برای تکرار i = 1, 2, ..., N:
    1. pi_i را در محیط اجرا کنید تا حالت‌های {s_1, ..., s_t} را جمع‌آوری کنید
    2. از متخصص برای اعمال روی هر حالت بازدیدشده پرسش کنید: a_t = pi*(s_t)
    3. تجمیع: D <- D u {(s_1, a_1), ..., (s_t, a_t)}
    4. pi_{i+1} را از طریق یادگیری نظارت‌شده روی D آموزش دهید
```

DAgger پشیمانی $O(T\epsilon)$ به دست می‌آورد — همان یک سیاست راهنما — چون توزیع آموزشی همگرا می‌شود تا با توزیع استقرار مطابقت داشته باشد.

الزام کلیدی این است که متخصص بتواند روی هر حالتی پرسش شود، از جمله حالت‌هایی که متخصص به‌طور طبیعی هرگز بازدید نمی‌کند. این در شبیه‌سازی امکان‌پذیر است (از متخصص بخواهید ربات را از پیکربندی غیرمعمول تصحیح کند) اما می‌تواند در سیستم‌های فیزیکی واقعی دشوار یا ناامن باشد.

---

## یادگیری تقویتی معکوس

گاهی رفتار متخصص بهتر به‌عنوان نتیجه بهینه‌سازی یک تابع پاداش ناشناخته درک می‌شود تا به‌عنوان دنباله‌ای از اعمال برای تقلید. **یادگیری تقویتی معکوس (IRL)** {cite}`ng2000algorithms` این تابع پاداش پنهان را از نمایش‌ها بازیابی می‌کند.

با توجه به نمایش‌های $\tau = \{(s_1, a_1), \ldots, (s_T, a_T)\}$، IRL یک تابع پاداش $R(s, a)$ پیدا می‌کند به گونه‌ای که سیاست متخصص تحت $R$ بهینه باشد.

جذابیت IRL نسبت به BC: اگر تابع پاداش واقعی را بازیابی کنیم، می‌توانیم آن را در محیط‌های جدید، با دینامیک‌های مختلف، یا با برنامه‌ریزان بهبودیافته مجدداً بهینه کنیم — بسیار فراتر از سناریوهای نمایش‌داده‌شده تعمیم دهیم.

### IRL حداکثر آنتروپی

**MaxEnt IRL** {cite}`ziebart2008maximum` مشکل ابهام IRL را (تابع‌های پاداش زیادی وجود دارند که با هر مجموعه‌ای از نمایش‌ها سازگار هستند) با انتخاب تابع پاداشی که در حالی که با رفتار نمایش‌داده‌شده سازگار است، توزیعی روی مسیرها با *حداکثر آنتروپی* ایجاد می‌کند، حل می‌کند. مسیرها توزیع می‌شوند به‌عنوان:

$$
P(\tau \mid R) \propto \exp\left(\sum_t R(s_t, a_t)\right)
$$

هدف یادگیری انتظارات ویژگی مشاهده‌شده متخصص $\mu_E = \mathbb{E}_{\tau \sim \pi^*}[\phi(\tau)]$ را با انتظارات ویژگی مدل $\mu_\theta = \mathbb{E}_{\tau \sim \pi_\theta}[\phi(\tau)]$ مطابقت می‌دهد.

---

## GAIL: یادگیری تقلیدی مولد تقابلی

**GAIL** {cite}`ho2016generative` با استفاده از یک فرمول‌بندی مشابه GAN برای مطابقت مستقیم با توزیع حالت-عمل متخصص، از یادگیری تابع پاداش کلاً عبور می‌کند.

یک تفکیک‌کننده $D_\psi$ برای تفکیک جفت‌های حالت-عمل متخصص $(s, a) \sim \pi^*$ از جفت‌های حالت-عمل سیاست $(s, a) \sim \pi_\theta$ آموزش می‌بیند:

$$
\mathcal{L}_D = -\mathbb{E}_{\pi^*}[\log D_\psi(s,a)] - \mathbb{E}_{\pi_\theta}[\log(1 - D_\psi(s,a))]
$$

مولد (سیاست $\pi_\theta$) برای فریب تفکیک‌کننده آموزش می‌بیند — یعنی برای تولید جفت‌های حالت-عمل که شبیه جفت‌های متخصص هستند. خروجی تفکیک‌کننده $\log D_\psi(s,a)$ به‌عنوان سیگنال پاداش برای سیاست عمل می‌کند.

GAIL در معیارهای کنترل پیوسته با تعداد نمایش‌های بسیار کمتری نسبت به BC به عملکرد سطح متخصص دست می‌یابد، و در محیط‌های پیچیده بهتر از MaxEnt IRL تعمیم می‌دهد.

---

## شبیه‌سازی رفتاری در پردازش زبان طبیعی: یک مثال عملی

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

torch.manual_seed(42)

# -----------------------------------------------
# Toy NLP task: rewriting sentences to be more formal
# We simulate this as a simple sequence transformation
# In practice: fine-tuning a seq2seq model on expert rewrites
# -----------------------------------------------

class SimpleSeq2Seq(nn.Module):
    def __init__(self, vocab_size=100, embed_dim=32, hidden_dim=64):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.encoder = nn.GRU(embed_dim, hidden_dim, batch_first=True)
        self.decoder = nn.GRU(embed_dim, hidden_dim, batch_first=True)
        self.proj = nn.Linear(hidden_dim, vocab_size)
        self.hidden_dim = hidden_dim

    def forward(self, src, tgt):
        src_emb = self.embed(src)
        _, hidden = self.encoder(src_emb)
        tgt_emb = self.embed(tgt)
        out, _ = self.decoder(tgt_emb, hidden)
        return self.proj(out)

# Generate synthetic demonstration data
VOCAB = 100
rng = np.random.default_rng(42)
N, SEQ_LEN = 1000, 12

src_seqs = torch.tensor(rng.integers(1, VOCAB, (N, SEQ_LEN)), dtype=torch.long)
# "Expert" transformation: shift tokens by 1 (toy formalization)
tgt_seqs = torch.clamp(src_seqs + 1, 1, VOCAB - 1)
tgt_in  = torch.cat([torch.ones(N, 1, dtype=torch.long), tgt_seqs[:, :-1]], dim=1)

dataset = TensorDataset(src_seqs, tgt_in, tgt_seqs)
loader = DataLoader(dataset, batch_size=64, shuffle=True)

model = SimpleSeq2Seq(vocab_size=VOCAB)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss(ignore_index=0)

# Behavioral cloning training
train_losses = []
for epoch in range(20):
    epoch_loss = 0
    for src, tgt_i, tgt_o in loader:
        logits = model(src, tgt_i)
        loss = criterion(logits.reshape(-1, VOCAB), tgt_o.reshape(-1))
        optimizer.zero_grad(); loss.backward(); optimizer.step()
        epoch_loss += loss.item()
    train_losses.append(epoch_loss / len(loader))

print(f"Initial loss: {train_losses[0]:.3f}")
print(f"Final loss:   {train_losses[-1]:.3f}")

# Evaluate: check token accuracy on held-out examples
model.eval()
with torch.no_grad():
    src_test = src_seqs[-100:]
    tgt_test_in = tgt_in[-100:]
    tgt_test_out = tgt_seqs[-100:]
    logits = model(src_test, tgt_test_in)
    preds = logits.argmax(dim=-1)
    acc = (preds == tgt_test_out).float().mean().item()
    print(f"Token accuracy on held-out set: {acc:.3f}")
```

---

## مقایسه روش‌های یادگیری تقلیدی

| روش            | نیاز به پاداش؟ | متخصص برخط پرسش می‌شود؟ | تعمیم به دینامیک جدید؟ | پیچیدگی  |
|----------------|---------------|-------------------------|------------------------|-----------|
| شبیه‌سازی رفتاری | خیر         | خیر                     | ضعیف (جابجایی توزیع)  | پایین     |
| DAgger         | خیر           | بله                     | متوسط                  | متوسط    |
| MaxEnt IRL     | بازیابی می‌کند | خیر                    | خوب                   | بالا      |
| GAIL           | خیر           | خیر                     | خوب                   | بالا      |

---

## کاربردها

**رباتیک.** آموزش ربات‌ها برای دستکاری اشیاء، ناوبری در محیط‌ها، یا انجام وظایف خانگی. نمایش‌های فیزیکی از طریق تله‌عمل‌گری یا آموزش سینماتیکی جمع‌آوری می‌شوند.

**رانندگی خودکار.** سامانه‌های اولیه خودران مانند ALVINN {cite}`pomerleau1989alvinn` و DAVE نیویدیا به‌شدت به شبیه‌سازی رفتاری از داده رانندگی انسانی متکی بودند.

**هوش مصنوعی بازی.** یادگیری تقلیدی از بازی انسانی عوامل را قبل از تنظیم ظریف یادگیری تقویتی bootstrap می‌کند. AlphaStar قبل از یادگیری تقویتی روی بازپخش‌های انسانی آموزش دید؛ این رویکرد وقتی نمایش‌های در سطح انسانی در دسترس هستند رایج است.

**تولید کد.** تنظیم ظریف مدل زبانی روی نمایش‌های کد با کیفیت بالا (GitHub Copilot، Codex) نوعی شبیه‌سازی رفتاری است.

**پشتیبانی تصمیم‌گیری بالینی.** یادگیری از دنباله‌های تصمیم پزشک متخصص برای پروتکل‌های پیچیده.

```{seealso}
تحلیل بنیادی BC/DAgger در {cite}`ross2011reduction` است. MaxEnt IRL از {cite}`ziebart2008maximum` است. GAIL از {cite}`ho2016generative` است. برای یک بررسی جامع از یادگیری تقلیدی، ببینید {cite}`osa2018algorithmic`.
```
