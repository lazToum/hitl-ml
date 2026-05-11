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

# التعلم المعزز من التغذية الراجعة البشرية

لا توجد تقنية فعلت ما هو أكثر من التعلم المعزز من التغذية الراجعة البشرية (RLHF) لإدخال HITL ML إلى التيار السائد. إنه الآلية الكامنة وراء InstructGPT {cite}`ouyang2022training` ومكوِّن أساسي في خطوط أنابيب اتباع التعليمات في كثير من نماذج اللغة الكبيرة الحديثة {cite}`stiennon2020learning`. فهم RLHF — لا بوصفه وصفة طعام تُتبَع فحسب، بل بوصفه منهجاً مبدئياً للمحاذاة — ضروري لكل من يعمل في الذكاء الاصطناعي الحديث.

---

## مشكلة المحاذاة

نماذج اللغة الكبيرة (LLMs) المُدرَّبة على التنبؤ بالرمز التالي فحسب تُحسِّن هدفاً وكالياً: توقع النص التالي في مجموعة من النصوص البشرية. هذا الهدف مرتبط بما نريده فعلاً، لكنه مختلف عنه: استجابات مفيدة ودقيقة وآمنة ومنسجمة مع القيم البشرية.

يُسمى عدم التطابق بين هدف التدريب والسلوك المرغوب فيه **مشكلة المحاذاة** {cite}`russell2019human`. بشكل ملموس، يتعلم نموذج لغة مُدرَّب على نصوص الإنترنت:
- إنتاج استمرارات مقنعة الصوت (قد تكون خاطئة واقعياً)
- عكس التحيزات والمضار الحاضرة في بيانات التدريب
- التهرب أو التلاعب حين يكون هذا ما يلي التحفيز إحصائياً

يعالج RLHF المحاذاةَ بجعل تفضيلات الإنسان *جزءاً من هدف التحسين*.

---

## خط أنابيب RLHF

يتقدم RLHF عبر ثلاث مراحل:

```text
المرحلة 1: الضبط الدقيق الخاضع للإشراف (SFT)
  --> جمع بيانات الاستعراض (يكتب إنسان استجابات مثالية)
  --> ضبط دقيق لـ LLM الأساسي على الاستعراضات

المرحلة 2: تدريب نموذج المكافأة
  --> جمع تفضيلات زوجية (الإنسان يُقيِّم A مقابل B)
  --> تدريب نموذج مكافأة R(x, y) للتنبؤ بتفضيلات الإنسان

المرحلة 3: الضبط الدقيق بالتعلم المعزز
  --> ضبط دقيق لـ LLM باستخدام PPO/التعلم المعزز لتعظيم R(x, y)
  --> عقوبة KL تمنع الانحراف المفرط عن نموذج SFT
```

### المرحلة 1: الضبط الدقيق الخاضع للإشراف

بدءاً من نموذج أساسي مُدرَّب مسبقاً $\pi_0$، نجمع مجموعة بيانات من أزواج (تحفيز، استجابة مثالية) يكتبها أو يختارها متعاقدون بشريون وفق إرشادات مفصلة. يُضبَط النموذج بدقة على هذه الاستعراضات باستخدام التباين المتقاطع القياسي:

$$
\mathcal{L}_\text{SFT}(\theta) = -\mathbb{E}_{(x, y) \sim \mathcal{D}_\text{demo}} \left[ \log \pi_\theta(y \mid x) \right]
$$

نموذج SFT $\pi_\text{SFT}$ هو نقطة بداية أفضل بكثير لـ RLHF من النموذج الأساسي الخام.

### المرحلة 2: تدريب نموذج المكافأة

لمجموعة من التحفيزات $\{x_i\}$، نُنشئ $K$ استجابة لكل تحفيز باستخدام $\pi_\text{SFT}$ ونقدمها لمُسمِّي بشريين كمقارنات زوجية: "أي الاستجابتَين أفضل، A أم B؟"

يُدرَّب نموذج المكافأة $r_\phi$ للتنبؤ بهذه التفضيلات. تحت نموذج **برادلي-تيري** (الفصل الثامن)، احتمالية تفضيل الاستجابة $y_w$ على $y_l$ هي:

$$
P(y_w \succ y_l \mid x) = \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)
$$

يُدرَّب نموذج المكافأة لتقليل خسارة الترتيب الزوجي:

$$
\mathcal{L}_\text{RM}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_\text{pref}} \left[ \log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) \right]
$$

يُهيَّأ نموذج المكافأة عادةً من نموذج SFT مع رأس عددي يحل محل الطبقة النهائية.

### المرحلة 3: الضبط الدقيق بالتعلم المعزز مع PPO

مع نموذج مكافأة مُدرَّب، يمكن استخدام التعلم المعزز لضبط LLM. كل تحفيز $x$ هو حالة؛ وكل استجابة $y$ هي مسار من اختيارات الرموز؛ والمكافأة هي $r_\phi(x, y)$.

يشمل هدف التحسين **عقوبة تباعد KL** لمنع النموذج من الانحراف بعيداً جداً عن خط الأساس SFT (مما سيُفضي إلى اختراق المكافأة {cite}`krakovna2020specification,gao2023scaling`):

$$
\max_\theta \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot | x)} \left[ r_\phi(x, y) - \beta \cdot \text{KL}\left[\pi_\theta(\cdot \mid x) \| \pi_\text{SFT}(\cdot \mid x)\right] \right]
$$

يتحكم المعامل $\beta$ في قوة عقوبة KL. $\beta$ الصغير يسمح بتحسين أكبر لكنه يُخاطر باختراق المكافأة؛ $\beta$ الكبير يبقي النموذج قريباً من SFT لكنه يُقيِّد مكاسب المحاذاة.

**التحسين التقريبي للسياسة (PPO)** {cite}`schulman2017proximal` هو الخوارزمية القياسية لهذه المرحلة، مختارةً لاستقرارها نسبةً إلى طرق تدرج السياسة المباشرة.

---

## عرض توضيحي مبسط لـ RLHF

يتطلب خط أنابيب RLHF الكامل بنية تحتية واسعة النطاق. يُوضِّح المثال التالي الأفكار الرئيسية على نطاق صغير.

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

## تحديات RLHF

### اختراق المكافأة

نمط إخفاق رئيسي: تجد السياسة طرقاً للحصول على مكافأة عالية من نموذج المكافأة لا تتوافق مع سلوك جيد حقاً. على سبيل المثال، قد يتعلم LLM إنتاج استجابات مُطرية أو صائغة بثقة (مما يميل المُسمِّون إلى تقييمه بعلامات عالية) بدلاً من استجابات دقيقة.

اختراق المكافأة أكثر احتمالاً حين:
- يُدرَّب نموذج المكافأة على بيانات تفضيل غير كافية
- يُسمَح للسياسة بالانحراف بعيداً عن خط الأساس SFT (بيتا صغير $\beta$)
- يتحول توزيع نموذج المكافأة خلال تدريب PPO

**استراتيجيات التخفيف:** عقوبة KL، والتدريب المتكرر لنموذج المكافأة، والتقييم المتنوع، وقيود الذكاء الاصطناعي الدستوري.

### تحيز المُقيِّم

للمُسمِّين البشريين تحيزات منهجية. يميلون إلى تفضيل الاستجابات الأطول (تحيز الإطالة)، والنصوص الواثقة الصياغة (تحيز الثقة)، والاستجابات التي تتفق مع معتقداتهم المسبقة. تتسرب هذه التحيزات إلى نموذج المكافأة.

إخفاق الانصياع الشهير لنماذج RLHF — حيث تُخبر النماذجُ المستخدمين بما يريدون سماعه بدلاً من الحقيقة — هو جزئياً نتيجة تفضيل المُقيِّمين للاستجابات المتوافقة مع آرائهم.

### الإشراف القابل للتطوير

بالنسبة للمهام المعقدة، لا يستطيع البشر تقييم أي استجابة ذكاء اصطناعي بشكل موثوق. قد يختار مُسمٍّ يُقارن برهانَين رياضيَّين طويلَين أو تطبيقَين للكود الأكثر قراءةً منهما بصرف النظر عن الصحة. **الإشراف القابل للتطوير** هو مشكلة البحث المفتوحة المتمثلة في تصميم إجراءات تقييم تبقى موثوقة مع ازدياد تعقيد المهمة {cite}`bowman2022measuring`.

---

## الذكاء الاصطناعي الدستوري (RLAIF)

يُقلِّص **الذكاء الاصطناعي الدستوري** {cite}`bai2022constitutional`، المُطوَّر في Anthropic، الاعتماد على المُسمِّين البشريين باستخدام الذكاء الاصطناعي ذاته لإنشاء تسميات التفضيل مُوجَّهةً بمجموعة من المبادئ ("دستور"). العملية:

1. إنشاء استجابات لتحفيزات يحتمل أن تكون ضارة
2. استخدام ناقد ذكاء اصطناعي لتقييم الاستجابات وفق المبادئ الدستورية
3. مراجعة الاستجابات بتوجيه من تغذية راجعة الذكاء الاصطناعي (RLAIF — التعلم المعزز من تغذية راجعة الذكاء الاصطناعي)
4. تدريب نموذج مكافأة على التفضيلات المُنشأة بالذكاء الاصطناعي
5. الضبط الدقيق باستخدام RLHF مع نموذج المكافأة هذا

يستطيع RLAIF إنشاء بيانات تفضيل بحجم أكبر بكثير من التسمية البشرية، ويتيح تحكماً دقيقاً في القيم المُشفَّرة في نموذج المكافأة.

```{seealso}
تصف ورقة InstructGPT الأصلية {cite}`ouyang2022training` أول تطبيق واسع النطاق لـ RLHF على LLMs. العمل التأسيسي لـ RLHF في التعلم المعزز العميق هو {cite}`christiano2017deep`. PPO موصوف في {cite}`schulman2017proximal`. الذكاء الاصطناعي الدستوري من {cite}`bai2022constitutional`.
```
