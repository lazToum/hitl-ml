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

# 从示范中学习

当一个任务难以明确规定却易于演示时，通过示例教学可能比通过规则定义更为高效。人类专家展示机械臂如何抓取物体；程序员与IDE的交互提供了一系列正确的编辑操作；国际象棋大师进行一局对弈。**从示范中学习**从这类行为数据中提取策略，避免了手工设计奖励函数或明确指定任务的需求。

---

## 行为克隆

最简单的方法是**行为克隆（BC）**：将示范视为监督数据，学习从状态到动作的映射。

给定来自专家示范者的状态-动作对数据集 $\mathcal{D} = \{(s_i, a_i)\}$，我们通过最小化负对数似然来拟合策略 $\pi_\theta(a \mid s)$：

$$
\mathcal{L}_\text{BC}(\theta) = -\frac{1}{|\mathcal{D}|} \sum_{(s, a) \in \mathcal{D}} \log \pi_\theta(a \mid s)
$$

这正是应用于序列数据的标准监督学习。

### 协变量偏移问题

BC存在一个根本性弱点：训练与部署之间的**分布偏移**。专家的示范覆盖了专家访问过的状态。但在部署过程中，学习到的策略可能做出略有不同的决策，将其引向专家从未访问过的状态——在这些状态下，策略没有监督信号，可能会严重失败。

关键在于，错误会**复合累积**：一次小的偏差导致一个不熟悉的状态，在那里一次略微错误的动作导致一个更加陌生的状态，如此循环。性能以 $O(T^2 \epsilon)$ 退化，其中 $T$ 是幕长，$\epsilon$ 是每步的错误率——比具有神谕策略的 $O(T\epsilon)$ 退化要糟糕得多 {cite}`ross2010efficient`。

```{admonition} 示例：自动驾驶
:class: note

用于车道保持的行为克隆模型在直道上（接近训练分布的状态）表现良好。但一旦它稍微偏离——这是一个人类驾驶员不会处于的状态，因为他们早就纠正了——它就没有数据来引导它，可能会驶离道路。
```

```text
算法 DAgger：
  初始化：D <- {} （空数据集）
  在M个专家示范上训练初始策略 pi_1

  对于迭代 i = 1, 2, ..., N：
    1. 在环境中运行 pi_i 以收集状态 {s_1, ..., s_t}
    2. 查询专家在每个访问状态上的动作：a_t = pi*(s_t)
    3. 聚合：D <- D ∪ {(s_1, a_1), ..., (s_t, a_t)}
    4. 在D上通过监督学习训练 pi_{i+1}
```

DAgger实现了 $O(T\epsilon)$ 的遗憾——与神谕策略相同——因为训练分布收敛于部署分布。

关键要求是可以在任意状态上查询专家，包括专家自然从不会访问的状态。在仿真中这是可行的（要求专家从不寻常的配置中纠正机器人），但在真实物理系统中可能具有挑战性甚至不安全。

---

## 逆强化学习

有时，专家的行为最好不是理解为一系列需要模仿的动作序列，而是优化某个未知奖励函数的结果。**逆强化学习（IRL）** {cite}`ng2000algorithms` 从示范中恢复这个潜在的奖励函数。

给定示范 $\tau = \{(s_1, a_1), \ldots, (s_T, a_T)\}$，IRL找到一个奖励函数 $R(s, a)$，使得专家的策略在 $R$ 下是最优的。

IRL相对于BC的吸引力在于：如果我们恢复了真实的奖励函数，就可以在新的环境中、用不同的动力学或改进的规划器重新优化它——泛化能力远超示范场景。

### 最大熵IRL

**MaxEnt IRL** {cite}`ziebart2008maximum` 通过选择能带来*最大熵*轨迹分布的奖励函数，解决了IRL的歧义性问题（有许多奖励函数与任何一组示范相容）。轨迹的分布为：

$$
P(\tau \mid R) \propto \exp\left(\sum_t R(s_t, a_t)\right)
$$

学习目标是将专家观测到的特征期望 $\mu_E = \mathbb{E}_{\tau \sim \pi^*}[\phi(\tau)]$ 与模型的特征期望 $\mu_\theta = \mathbb{E}_{\tau \sim \pi_\theta}[\phi(\tau)]$ 相匹配。

---

## GAIL：生成对抗模仿学习

**GAIL** {cite}`ho2016generative` 完全绕过奖励函数学习，使用类似GAN的形式直接匹配专家的状态-动作分布。

判别器 $D_\psi$ 被训练以区分专家的状态-动作对 $(s, a) \sim \pi^*$ 和策略的状态-动作对 $(s, a) \sim \pi_\theta$：

$$
\mathcal{L}_D = -\mathbb{E}_{\pi^*}[\log D_\psi(s,a)] - \mathbb{E}_{\pi_\theta}[\log(1 - D_\psi(s,a))]
$$

生成器（策略 $\pi_\theta$）被训练以欺骗判别器——即产生看起来像专家的状态-动作对。判别器的输出 $\log D_\psi(s,a)$ 充当策略的奖励信号。

GAIL在连续控制基准上以远少于BC的示范实现专家级性能，在复杂环境中的泛化能力也优于MaxEnt IRL。

---

## NLP中的行为克隆：实践示例

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

## 模仿学习方法比较

| 方法           | 需要奖励？ | 在线查询专家？ | 对新动力学的泛化能力？ | 复杂度 |
|----------------|-----------|----------------|------------------------|--------|
| 行为克隆       | 否        | 否             | 差（分布偏移）          | 低     |
| DAgger         | 否        | 是             | 中等                   | 中     |
| MaxEnt IRL     | 可恢复    | 否             | 好                     | 高     |
| GAIL           | 否        | 否             | 好                     | 高     |

---

## 应用领域

**机器人学。** 教机器人操作物体、在环境中导航或执行家务任务。物理示范通过遥操作或运动教学收集。

**自动驾驶。** ALVINN {cite}`pomerleau1989alvinn` 和NVIDIA的DAVE等早期自动驾驶系统大量依赖从人类驾驶数据中进行行为克隆。

**游戏AI。** 在人类游戏数据上进行模仿学习，在强化学习微调前引导智能体。AlphaStar在RL之前先在人类回放数据上训练；当人类级别的示范可用时，这种方法十分常见。

**代码生成。** 在高质量代码示范上进行语言模型微调（GitHub Copilot、Codex）是一种行为克隆形式。

**临床决策支持。** 从专家医生针对复杂协议的决策序列中学习。

```{seealso}
BC/DAgger的奠基性分析见于 {cite}`ross2011reduction`。MaxEnt IRL来自 {cite}`ziebart2008maximum`。GAIL来自 {cite}`ho2016generative`。关于模仿学习的全面综述，请参见 {cite}`osa2018algorithmic`。
```
