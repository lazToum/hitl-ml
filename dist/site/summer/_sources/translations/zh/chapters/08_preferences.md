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

# 从比较与排序中学习

要求人类为一个输出分配绝对质量分数是困难的。这篇文章的数字质量是多少，在1到10的分数上？这个问题本身就不够明确：人类缺乏稳定的内部评分尺度，他们的评分受锚定效应、情境和疲劳的严重影响。

要求人类*比较*两个输出则容易得多：哪篇文章更好，A还是B？比较性判断更具一致性、更可靠，也更直接地反映人类偏好。本章涵盖从比较和排序中学习的数学基础与实践应用。

---

## 为何比较优于评分

### 心理学依据

比较性判断的优越性在心理测量学中有悠久的历史。Thurstone的比较判断定律 {cite}`thurstone1927law`（1927年）表明，即使人类的绝对判断不一致，其相对判断也遵循一致的概率规律。比较利用了这样一个事实：人类在*相对*感知方面远优于绝对校准。

### 统计效率

每个成对比较提供了关于两个项目在质量尺度上*相对*位置的信息。对于 $K$ 个项目，$K-1$ 次比较可以对所有项目进行排序；只需 $O(\log K)$ 次比较就可以找到最优项目。绝对评分通常需要更多判断才能达到相同的精度。

### 可扩展性

对于生成式模型，不同输出的数量实际上是无限的。对一个输出进行绝对评分需要在所有输出之间建立共享尺度；比较输出只需要局部的相对判断，这些判断自然相互校准。

---

## Bradley-Terry模型

成对比较最主流的概率模型是**Bradley-Terry（BT）模型** {cite}`bradley1952rank`。每个项目 $i$ 具有潜在质量分数 $\alpha_i \in \mathbb{R}$。在直接比较中，项目 $i$ 优于项目 $j$ 的概率为：

$$
P(i \succ j) = \frac{e^{\alpha_i}}{e^{\alpha_i} + e^{\alpha_j}} = \sigma(\alpha_i - \alpha_j)
$$

其中 $\sigma$ 是逻辑Sigmoid函数。这等价于假设项目 $i$ 的感知质量为 $\alpha_i + \epsilon$，其中 $\epsilon$ 是标准逻辑噪声项。

### 可识别性

BT模型在平移意义下可识别：如果 $\alpha$ 是一个解，那么对任意常数 $c$，$\alpha + c$ 也是解。标准惯例是固定一个分数（例如 $\alpha_0 = 0$）或约束 $\sum_i \alpha_i = 0$。只有当**比较图**（节点 = 项目，边 = 观测到的比较对）是**连通的**时，分数才能被识别——如果图有不连通的分量，跨分量的相对分数是未定义的。

### 参数估计

给定成对比较数据集 $\mathcal{D} = \{(i, j, y_{ij})\}$，其中 $y_{ij} = 1$ 表示 $i$ 优于 $j$，对数似然为：

$$
\mathcal{L}(\alpha) = \sum_{(i, j, y_{ij}) \in \mathcal{D}} \left[ y_{ij} \log \sigma(\alpha_i - \alpha_j) + (1 - y_{ij}) \log \sigma(\alpha_j - \alpha_i) \right]
$$

这是 $\alpha$ 的凹函数，可以通过梯度上升或牛顿法最大化。

```{code-cell} python
import numpy as np
from scipy.optimize import minimize
from scipy.special import expit  # sigmoid

rng = np.random.default_rng(42)

# -----------------------------------------------
# Simulate Bradley-Terry: 8 items with true quality scores
# Generate pairwise comparisons and recover the scores
# -----------------------------------------------

N_ITEMS = 8
true_alpha = rng.normal(0, 1, N_ITEMS)
print(f"True quality ranking: {np.argsort(true_alpha)[::-1]}")

# Generate comparisons: every pair compared 5 times
comparisons = []
for i in range(N_ITEMS):
    for j in range(i + 1, N_ITEMS):
        for _ in range(5):
            p_i_wins = expit(true_alpha[i] - true_alpha[j])
            winner = i if rng.random() < p_i_wins else j
            loser  = j if winner == i else i
            comparisons.append((winner, loser))

print(f"Total comparisons: {len(comparisons)}")

def neg_log_likelihood(alpha, comparisons):
    """Bradley-Terry negative log-likelihood."""
    alpha = np.array(alpha)
    loss = 0.0
    for winner, loser in comparisons:
        log_prob = np.log(expit(alpha[winner] - alpha[loser]) + 1e-10)
        loss -= log_prob
    return loss

def neg_grad(alpha, comparisons):
    alpha = np.array(alpha)
    grad = np.zeros(len(alpha))
    for winner, loser in comparisons:
        p = expit(alpha[winner] - alpha[loser])
        grad[winner] -= (1 - p)
        grad[loser]  -= (-p)
    return grad

# Fix alpha[0] = 0 to resolve scale ambiguity
result = minimize(
    lambda a: neg_log_likelihood(np.concatenate([[0.0], a]), comparisons),
    x0=np.zeros(N_ITEMS - 1),
    jac=lambda a: neg_grad(np.concatenate([[0.0], a]), comparisons)[1:],
    method='L-BFGS-B'
)
est_alpha = np.concatenate([[0.0], result.x])

# Compare true vs estimated ranking
true_rank = np.argsort(true_alpha)[::-1]
est_rank  = np.argsort(est_alpha)[::-1]

print(f"\nTrue ranking (item indices): {true_rank}")
print(f"Estimated ranking:           {est_rank}")
rank_corr = np.corrcoef(true_alpha, est_alpha)[0, 1]
print(f"Correlation with true scores: {rank_corr:.4f}")
```

---

## Thurstone模型

Thurstone模型 {cite}`thurstone1927law` 与Bradley-Terry密切相关，但使用高斯噪声而非逻辑噪声：

$$
P(i \succ j) = \Phi\left(\frac{\alpha_i - \alpha_j}{\sqrt{2}\sigma}\right)
$$

其中 $\Phi$ 是标准正态累积分布函数。当 $\sigma = 1/\sqrt{2}$ 时，这在微小的缩放差异下等价于BT。在实践中，两个模型给出几乎相同的结果。

---

## 排序聚合

当每位标注者对 $K$ 个项目提供完整排序（而非成对比较）时，问题变为**排序聚合**：将多个排序列表合并为共识排序。

**Borda计数：** 每个项目获得的分数等于在每位标注者排序中排在其后的项目数量。分数跨标注者求和。简单且鲁棒。

**Kemeny-Young：** 找到使各标注者排序之间成对分歧之和（Kendall tau距离）最小的排序。对于较大的 $K$ 是NP难问题，但对小集合可处理。

**RankNet / ListNet：** 从排序列表中学习评分函数的神经网络方法，能够泛化到未见过的项目。

---

## 决斗赌博机

在**在线**偏好学习中，项目以流式方式到达，我们必须决定比较哪些对，在探索（了解未知项目）和利用（呈现高质量项目）之间取得平衡。这就是**决斗赌博机**问题 {cite}`yue2009interactively`。

主要算法：
- **Doubler：** 维护一个冠军项目；用随机竞争者挑战它
- **RUCB（相对置信上界）：** 计算每个项目击败每个其他项目的概率的UCB风格置信区间
- **MergeRank：** 将锦标赛式比较与UCB相结合

决斗赌博机用于在线推荐系统（接下来展示哪篇文章，基于隐式反馈）和RLHF数据收集的交互式偏好挖掘。

---

## 语言模型的偏好学习

在RLHF的背景下（第6章），Bradley-Terry模型用于训练奖励模型。一个重要变体是**直接偏好优化（DPO）** {cite}`rafailov2023direct`，它表明RLHF目标可以直接从偏好数据中优化，而无需训练单独的奖励模型：

$$
\mathcal{L}_\text{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_\text{ref}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_\text{ref}(y_l \mid x)} \right) \right]
$$

DPO比完整的RLHF更简单（无需PPO训练循环，无需奖励模型），在许多基准上能达到相当甚至更好的效果 {cite}`rafailov2023direct`。它已成为指令遵循微调中被广泛采用的PPO-RLHF替代方案，尽管两种方法都仍在积极使用，且其相对优势依赖于具体任务。

---

## 收集高质量偏好数据

偏好数据的质量决定了奖励模型的质量。关键考量：

**提示多样性。** 偏好数据应覆盖模型在部署中将遇到的完整提示分布。覆盖缺口会导致奖励模型在这些区域的行为不可靠。

**回复多样性。** 比较两个非常相似的回复提供的信息很少。被比较的回复应有足够差异，使标注者能有清晰的偏好。

**标注者一致性。** 低标注者间一致性表明比较标准不明确。衡量一致性（Cohen's κ），当其低于可接受阈值时修订指南。

**校准。** 标注者应理解*为何*一个回复更好：有帮助性、准确性、安全性、风格？将多个标准捆绑在一起的任务往往产生不一致的偏好。通常最好分别收集每个标准上的偏好。

```{seealso}
Bradley-Terry模型：{cite}`bradley1952rank`。Thurstone：{cite}`thurstone1927law`。决斗赌博机：{cite}`yue2009interactively`。直接偏好优化（DPO）：{cite}`rafailov2023direct`。
```
