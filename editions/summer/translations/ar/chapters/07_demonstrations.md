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

# التعلم من الاستعراض والمحاكاة

حين تكون مهمة ما صعبة التحديد لكن سهلة الاستعراض، قد يكون التعليم بالمثال أكثر كفاءة من التعريف بالقاعدة. يُريَ ذراع روبوتية خبيرٌ بشري كيف تمسك الجسم؛ يُقدِّم تفاعل مبرمج مع بيئة تطويره سلسلةً من التعديلات الصحيحة؛ يلعب غراندماستر شطرنج لعبة. **التعلم من الاستعراضات** يستخلص سياسةً من هذه البيانات السلوكية، متجنباً الحاجة إلى دوال مكافأة مُصنَّعة يدوياً أو مواصفات مهام صريحة.

---

## الاستنساخ السلوكي

أبسط المناهج هو **الاستنساخ السلوكي (BC)**: معاملة الاستعراض كبيانات مُشرَفة وتعلم تعيين من الحالات إلى الأفعال.

بالنظر إلى مجموعة بيانات من أزواج الحالة-الفعل $\mathcal{D} = \{(s_i, a_i)\}$ من معلِّم خبير، نضبط سياسة $\pi_\theta(a \mid s)$ بتقليل اللوغاريتم السالب للاحتمالية:

$$
\mathcal{L}_\text{BC}(\theta) = -\frac{1}{|\mathcal{D}|} \sum_{(s, a) \in \mathcal{D}} \log \pi_\theta(a \mid s)
$$

هذا بالضبط التعلم الخاضع للإشراف القياسي مُطبَّقاً على البيانات التسلسلية.

### مشكلة تحوّل التوزيع التغطوي

لدى BC ضعف جوهري: **تحوّل التوزيع** بين التدريب والنشر. استعراضات الخبير تُغطي الحالات التي يزورها الخبير. لكن أثناء النشر، قد تتخذ السياسة المُتعلَّمة قرارات مختلفة قليلاً، مُفضيةً إلى حالات لم يزرها الخبير قط — حالات لا إشراف على السياسة فيها وقد تفشل فيها فشلاً ذريعاً.

والأهم أن الأخطاء **تتراكم**: الانحراف الصغير يُفضي إلى حالة غير مألوفة، حيث يُفضي الفعل الخاطئ قليلاً إلى حالة أكثر غرابة، وهكذا. يتراجع الأداء بمعدل $O(T^2 \epsilon)$ حيث $T$ طول الحلقة و$\epsilon$ معدل الخطأ في كل خطوة — وهو أسوأ بكثير من التراجع $O(T\epsilon)$ لسياسة الأورابل {cite}`ross2010efficient`.

```{admonition} مثال: القيادة الذاتية
:class: note

نموذج استنساخ سلوكي للحفاظ على المسار مُدرَّب على بيانات قيادة بشرية يؤدي أداءً جيداً على الطرق المستقيمة (حالات قريبة من توزيع التدريب). لكن بمجرد انحرافه قليلاً — حالة لا يكون فيها سائق بشري لأنه سيكون قد صحَّح بالفعل — لا بيانات لتوجيهه وقد يخرج عن الطريق.
```

```text
Algorithm DAgger:
  Initialize: D <- {} (empty dataset)
  Train initial policy pi_1 on M expert demonstrations

  for iteration i = 1, 2, ..., N:
    1. Run pi_i in the environment to collect states {s_1, ..., s_t}
    2. Query expert for actions on each visited state: a_t = pi*(s_t)
    3. Aggregate: D <- D u {(s_1, a_1), ..., (s_t, a_t)}
    4. Train pi_{i+1} by supervised learning on D
```

يُحقق DAgger ندماً بمعدل $O(T\epsilon)$ — نفس سياسة الأورابل — لأن توزيع التدريب يتقارب ليطابق توزيع النشر.

الشرط الأساسي هو إمكانية استشارة الخبير في أي حالة، بما فيها الحالات التي لن يزورها الخبير طبيعياً. هذا ممكن في المحاكاة (أطلب من الخبير تصحيح الروبوت من تكوين غير عادي) لكنه قد يكون تحدياً أو غير آمن في الأنظمة المادية الحقيقية.

---

## التعلم المعزز العكسي

أحياناً يُفهَم سلوك الخبير بصورة أفضل لا بوصفه سلسلة أفعال للتقليد بل بوصفه نتيجة تحسين دالة مكافأة مجهولة. **التعلم المعزز العكسي (IRL)** {cite}`ng2000algorithms` يستعيد دالة المكافأة الكامنة هذه من الاستعراضات.

بالنظر إلى استعراضات $\tau = \{(s_1, a_1), \ldots, (s_T, a_T)\}$، يجد IRL دالة مكافأة $R(s, a)$ بحيث تكون سياسة الخبير مثالية تحت $R$.

جاذبية IRL على BC: إذا استعدنا دالة المكافأة الحقيقية، يمكن إعادة تحسينها في بيئات جديدة، بديناميكيات مختلفة، أو بمُخططين مُحسَّنين — مُعمِّمةً بعيداً خارج السيناريوهات المُستعرَضة.

### IRL بأقصى إنتروبيا

يحل **MaxEnt IRL** {cite}`ziebart2008maximum` مشكلة الغموض في IRL (هناك دوال مكافأة كثيرة متسقة مع أي مجموعة استعراضات) باختيار دالة المكافأة التي، مع كونها متسقة مع السلوك المُستعرَض، تُفضي إلى توزيع على المسارات بـ *أقصى إنتروبيا*. توزع المسارات بـ:

$$
P(\tau \mid R) \propto \exp\left(\sum_t R(s_t, a_t)\right)
$$

يُطابق هدف التعلم توقعات ميزات الخبير الملاحظة $\mu_E = \mathbb{E}_{\tau \sim \pi^*}[\phi(\tau)]$ مع توقعات ميزات النموذج $\mu_\theta = \mathbb{E}_{\tau \sim \pi_\theta}[\phi(\tau)]$.

---

## GAIL: التعلم بالتقليد التوليدي التنافسي

يتجاوز **GAIL** {cite}`ho2016generative` تعلم دالة المكافأة كلياً، مستخدماً صياغةً شبيهة بـ GAN لمطابقة توزيع الحالة-الفعل للخبير مباشرةً.

يُدرَّب مُمييِّز $D_\psi$ للتمييز بين أزواج الحالة-الفعل من الخبير $(s, a) \sim \pi^*$ وأزواج الحالة-الفعل من السياسة $(s, a) \sim \pi_\theta$:

$$
\mathcal{L}_D = -\mathbb{E}_{\pi^*}[\log D_\psi(s,a)] - \mathbb{E}_{\pi_\theta}[\log(1 - D_\psi(s,a))]
$$

يُدرَّب المُولِّد (السياسة $\pi_\theta$) لخداع المُمييِّز — أي لإنتاج أزواج حالة-فعل تبدو مثل أزواج الخبير. مخرج المُمييِّز $\log D_\psi(s,a)$ يعمل كإشارة مكافأة للسياسة.

يُحقق GAIL أداءً على مستوى الخبير في معايير التحكم المستمر مع عدد أقل بكثير من الاستعراضات مقارنةً بـ BC، ويُعمِّم بصورة أفضل من MaxEnt IRL في البيئات المعقدة.

---

## الاستنساخ السلوكي في معالجة اللغات الطبيعية: مثال عملي

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

## مقارنة طرق التعلم بالتقليد

| الطريقة           | تحتاج مكافأة؟ | استشارة الخبير فورياً؟ | تُعمِّم لديناميكيات جديدة؟ | التعقيد  |
|-------------------|---------------|------------------------|----------------------------|----------|
| الاستنساخ السلوكي | لا             | لا                     | ضعيف (تحوّل التوزيع)      | منخفض    |
| DAgger            | لا             | نعم                    | معتدل                       | متوسط    |
| MaxEnt IRL        | يستعيدها       | لا                     | جيد                         | عالٍ     |
| GAIL              | لا             | لا                     | جيد                         | عالٍ     |

---

## التطبيقات

**الروبوتات.** تعليم الروبوتات التعامل مع الأجسام، والتنقل في البيئات، أو أداء مهام منزلية. تُجمَع الاستعراضات المادية عبر التحكم عن بُعد أو التعليم الحركي.

**القيادة الذاتية.** اعتمدت أوائل أنظمة القيادة الذاتية كـ ALVINN {cite}`pomerleau1989alvinn` ونظام DAVE من NVIDIA اعتماداً كبيراً على الاستنساخ السلوكي من بيانات القيادة البشرية.

**ذكاء الألعاب.** يُعطي التعلم بالتقليد من اللعب البشري وكلاء عجلة قبل الضبط الدقيق بالتعلم المعزز. تدرَّب AlphaStar على تسجيلات بشرية قبل التعلم المعزز؛ هذا المنهج شائع حين تتوفر استعراضات على مستوى بشري.

**توليد الكود.** الضبط الدقيق لنماذج اللغة على استعراضات كود عالية الجودة (GitHub Copilot، Codex) هو شكل من أشكال الاستنساخ السلوكي.

**دعم القرار السريري.** التعلم من سلسلة قرارات الطبيب الخبير للبروتوكولات المعقدة.

```{seealso}
التحليل التأسيسي لـ BC/DAgger في {cite}`ross2011reduction`. MaxEnt IRL من {cite}`ziebart2008maximum`. GAIL من {cite}`ho2016generative`. لاستعراض شامل للتعلم بالتقليد، راجع {cite}`osa2018algorithmic`.
```
