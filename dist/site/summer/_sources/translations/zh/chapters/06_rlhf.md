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

# 基于人类反馈的强化学习

没有任何一项技术比基于人类反馈的强化学习（RLHF）更能将HITL ML带入主流视野。它是InstructGPT {cite}`ouyang2022training` 背后的核心机制，也是许多现代大型语言模型指令遵循流程的关键组件 {cite}`stiennon2020learning`。理解RLHF——不仅仅是作为一套可以遵循的技术方案，而是作为一种有原则的对齐方法——对任何从事现代人工智能工作的人而言都至关重要。

---

## 对齐问题

纯粹基于下一词元预测进行训练的大型语言模型（LLM）针对一个代理目标进行优化：预测人类书写文本中下一个词元是什么。这个目标与我们实际想要的——有帮助、准确、安全且符合人类价值观的回复——相关，但并不相同。

训练目标与期望行为之间的不匹配被称为**对齐问题** {cite}`russell2019human`。具体而言，在互联网文本上训练的语言模型会学习：
- 产生听起来合理的续写内容（这些内容可能在事实上是错误的）
- 反映训练数据中存在的偏见和有害内容
- 当这是统计上最可能跟随提示的内容时，表现出回避或操纵性行为

RLHF通过将人类偏好纳入*优化目标本身*来解决对齐问题。

---

## RLHF流程

RLHF分三个阶段进行：

```text
阶段1：监督微调（SFT）
  --> 收集示范数据（人类撰写理想回复）
  --> 在示范数据上对基础LLM进行微调

阶段2：奖励模型训练
  --> 收集成对偏好数据（人类对A与B进行评分）
  --> 训练奖励模型 R(x, y) 以预测人类偏好

阶段3：强化学习微调
  --> 使用PPO/RL对LLM进行微调以最大化 R(x, y)
  --> KL散度惩罚防止过度偏离SFT模型
```

### 阶段1：监督微调

从预训练基础模型 $\pi_0$ 出发，我们收集一个（提示，理想回复）对的数据集，由遵循详细指南的人类承包商撰写或选择。模型在这些示范数据上使用标准交叉熵进行微调：

$$
\mathcal{L}_\text{SFT}(\theta) = -\mathbb{E}_{(x, y) \sim \mathcal{D}_\text{demo}} \left[ \log \pi_\theta(y \mid x) \right]
$$

SFT模型 $\pi_\text{SFT}$ 是比原始预训练模型更好的RLHF起始点。

### 阶段2：奖励模型训练

对于一组提示 $\{x_i\}$，我们使用 $\pi_\text{SFT}$ 为每个提示生成 $K$ 个回复，并以成对比较的形式呈现给人类标注者："哪个回复更好，A还是B？"

奖励模型 $r_\phi$ 被训练以预测这些偏好。在**Bradley-Terry模型**（第8章）下，回复 $y_w$ 优于 $y_l$ 的概率为：

$$
P(y_w \succ y_l \mid x) = \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)
$$

奖励模型被训练以最小化成对排序损失：

$$
\mathcal{L}_\text{RM}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_\text{pref}} \left[ \log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) \right]
$$

奖励模型通常从SFT模型初始化，以标量头替换最后一层。

### 阶段3：使用PPO进行强化学习微调

有了训练好的奖励模型，我们可以使用强化学习对LLM进行微调。每个提示 $x$ 是一个状态；每个回复 $y$ 是词元选择的轨迹；奖励为 $r_\phi(x, y)$。

优化目标包括一个**KL散度惩罚**，以防止模型过度偏离SFT基线（这会导致奖励黑客攻击 {cite}`krakovna2020specification,gao2023scaling`）：

$$
\max_\theta \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot | x)} \left[ r_\phi(x, y) - \beta \cdot \text{KL}\left[\pi_\theta(\cdot \mid x) \| \pi_\text{SFT}(\cdot \mid x)\right] \right]
$$

参数 $\beta$ 控制KL惩罚强度。较小的 $\beta$ 允许更多优化，但存在奖励黑客攻击风险；较大的 $\beta$ 使模型保持接近SFT，但限制了对齐收益。

**近端策略优化（PPO）** {cite}`schulman2017proximal` 是这一阶段的标准算法，因其相对于原始策略梯度方法更为稳定而被选用。

---

## 简化版RLHF演示

完整的RLHF流程需要大规模基础设施。以下示例在小规模上展示了核心思想。

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

## RLHF的挑战

### 奖励黑客攻击

一个关键的失败模式：策略找到了从奖励模型中获得高分的方式，但这些方式并不对应真正良好的行为。例如，LLM可能学会产生奉承性或听起来很自信的回复（标注者往往给这类回复高分），而不是准确的回复。

以下情况更容易出现奖励黑客攻击：
- 奖励模型在偏好数据不足的情况下进行训练
- 策略被允许大幅偏离SFT基线（较小的 $\beta$）
- 奖励模型分布在PPO训练过程中发生偏移

**缓解策略：** KL惩罚、迭代奖励模型训练、多样化评估、宪法AI约束。

### 评估者偏差

人类标注者存在系统性偏差。他们往往偏好更长的回复（冗长偏差）、听起来更自信的文本（置信偏差），以及与他们先验信念一致的回复。这些偏差会传播到奖励模型中。

RLHF模型臭名昭著的逢迎失败——模型告诉用户他们想听的而不是真实的内容——部分原因就是评估者对顺从性回复的偏好所致。

### 可扩展监督

对于复杂任务，人类无法可靠地判断哪个AI回复是正确的。比较两个长篇数学证明或两段代码实现的标注者可能只是选择更易读的那个，而不考虑正确性。**可扩展监督**是一个开放性研究问题：随着任务复杂度的增加，如何设计仍然可靠的评估程序 {cite}`bowman2022measuring`。

---

## 宪法AI（RLAIF）

**宪法AI** {cite}`bai2022constitutional`（由Anthropic开发）通过让AI本身基于一套原则（即"宪法"）生成偏好标签，减少了对人类标注者的依赖。其流程如下：

1. 对潜在有害的提示生成回复
2. 使用AI评论者根据宪法原则评估回复
3. 在AI反馈的引导下修改回复（RLAIF——基于AI反馈的强化学习）
4. 在AI生成的偏好数据上训练奖励模型
5. 使用这个奖励模型进行RLHF微调

RLAIF能够以远超人类标注的规模生成偏好数据，并允许对奖励模型中编码的价值观进行精细控制。

```{seealso}
原始InstructGPT论文 {cite}`ouyang2022training` 描述了RLHF在LLM上的第一次大规模应用。深度强化学习中RLHF的奠基性工作为 {cite}`christiano2017deep`。PPO见于 {cite}`schulman2017proximal`。宪法AI来自 {cite}`bai2022constitutional`。
```
