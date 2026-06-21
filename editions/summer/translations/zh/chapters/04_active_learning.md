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

# 主动学习

标注数据代价高昂。主动学习的核心洞见在于：*并非所有未标注样本对信息量的贡献都相同*——如果允许模型选择对哪些样本进行提问，它就能以更快的速度提升性能。主动学习系统不是随机标注数据，而是向标注者（通常是人类）查询最可能改善模型的样本。

本章涵盖主动学习的理论与实践：查询策略、采样框架、停止准则，以及真实部署中的实践考量。

---

## 主动学习的设置

标准的**基于样本池的主动学习**设置涉及：

- 一个**已标注集** $\mathcal{L} = \{(x_i, y_i)\}_{i=1}^n$ ——初始时规模较小
- 一个**未标注样本池** $\mathcal{U} = \{x_j\}_{j=1}^m$ ——通常远大于 $\mathcal{L}$
- 一个**标注者** $\mathcal{O}$，能够为任意查询的 $x$ 返回 $y = \mathcal{O}(x)$
- 一个**查询策略** $\phi$，选择下一个查询 $x^* = \phi(\mathcal{L}, \mathcal{U}, f_\theta)$

主动学习循环：

```text
    1. 初始化：L = 小型标注种子集，U = 未标注样本池
    2. 训练：f_θ ← train(L)
    3. 查询：x* = argmax φ(x; f_θ)，x ∈ U
    4. 标注：y* = O(x*)
    5. 更新：L ← L ∪ {(x*, y*)}，U ← U \ {x*}
    → 从步骤2重复，直至预算耗尽
```

目标是使用尽可能少的标注者查询次数，达到目标模型质量。

---

## 理论基础

一个自然的问题是：主动学习能提供多少帮助？在最佳情况下，主动学习能实现标签复杂度的*指数级*缩减——至少在可实现的设置下，以好的查询策略，能够以 $O(\log(1/\epsilon))$ 个标签将误差降至 $\epsilon$，而被动学习则需要 $O(1/\epsilon)$ 个标签 {cite}`settles2009active`。

在实践中，性能保证更难获得。**不可知主动学习** {cite}`balcan2006agnostic` 表明，即使目标概念不在假设类中，节省标签仍然是可能的，但节省量在很大程度上取决于分歧系数——衡量随着数据积累，合理假设集缩小速度的指标。

关键的实践含义：当**决策边界简单且集中**时（不确定性查询能快速排除错误假设），主动学习的优势最大；当假设类较大或边界较复杂时，优势最小。

---

## 查询策略

### 不确定性采样

最简单也最广泛使用的策略：查询模型*最不确定*的样本 {cite}`lewis1994sequential`。

**最低置信度**查询模型对其最优预测置信度最低的样本：

$$
x^* = \argmax_{x \in \mathcal{U}} \left(1 - P_\theta(\hat{y} \mid x)\right)
$$

**边界采样**考虑排名前两位的预测概率之差：

$$
x^* = \argmin_{x \in \mathcal{U}} \left(P_\theta(\hat{y}_1 \mid x) - P_\theta(\hat{y}_2 \mid x)\right)
$$

**熵采样**使用完整的预测分布：

$$
x^* = \argmax_{x \in \mathcal{U}} \left( -\sum_{k=1}^K P_\theta(y_k \mid x) \log P_\theta(y_k \mid x) \right)
$$

熵采样是三者中最有原则的——它考虑所有类别——在多类问题上通常优于其他两种方法。

### 委员会查询（QbC）

训练一个由 $C$ 个模型组成的**委员会**（使用自助法、不同初始化或不同架构）。查询委员会分歧最大的样本：

$$
x^* = \argmax_{x \in \mathcal{U}} \; \text{disagreement}(\{f_c(x)\}_{c=1}^C)
$$

分歧可以用**投票熵**（委员会多数票的熵）或与共识分布的**KL散度**来衡量。

QbC提供比单一模型更好的不确定性估计，但需要训练多个模型，计算成本较高。

### 预期模型变化

查询会导致当前模型发生最大变化的样本。对于基于梯度的模型，这对应于具有最大预期梯度幅度的样本 {cite}`settles2008analysis`：

$$
x^* = \argmax_{x \in \mathcal{U}} \sum_{y \in \mathcal{Y}} P_\theta(y \mid x) \left\| \nabla_\theta \mathcal{L}(f_\theta(x), y) \right\|
$$

该策略有充分的理论依据，但需要为每个候选样本计算梯度，对于大型模型代价高昂。

### 核心集 / 几何方法

基于不确定性的策略可能**偏向离群点**：一个不寻常的样本可能高度不确定，但不代表数据分布。核心集方法通过寻找覆盖特征空间的多样化样本来解决这个问题。

**k中心贪婪算法** {cite}`sener2018active` 找到最小的点集，使得每个未标注点都在至少一个被查询点的 $\delta$ 范围内：

$$
x^* = \argmax_{x \in \mathcal{U}} \min_{x' \in \mathcal{L}} d(x, x')
$$

即查询距离任何当前已标注点最远的点。这鼓励形成分布均匀的标注集。

### BADGE

**BADGE**（基于多样梯度嵌入的批量主动学习）{cite}`ash2020deep` 结合了不确定性与多样性：它选择一批样本，这些样本的梯度嵌入（相对于预测标签）在幅度上既大（不确定）又多样（覆盖梯度空间的不同区域）。这是目前最具竞争力的现代策略之一。

---

## 深度模型的不确定性估计

上述策略假设能够从模型获取经过校准的概率输出。对于简单模型（逻辑回归、softmax分类器），这很直接。对于深度网络，获取可靠的不确定性估计需要额外的技术。

### 两类不确定性

按照Kendall和Gal的分类 {cite}`kendall2017uncertainties`，我们区分：

**偶然不确定性**（数据不确定性）：观测中固有的噪声，无法通过收集更多数据来消除。一张模糊的图像具有偶然不确定性——即使从相同分布收集更多训练数据，也无法使模型对它更有把握。

**认知不确定性**（模型不确定性）：由于训练数据有限或模型未见过类似样本而产生的不确定性。认知不确定性*可以*通过标注更多数据来减少——因此是主动学习查询选择的相关量。

对于主动学习，我们希望查询具有高认知不确定性的样本，而非高偶然不确定性的样本。查询本质上模糊的样本会浪费标注者的努力：无论他们提供什么标签，都不会明确地正确。

### 蒙特卡洛Dropout

针对神经网络认知不确定性估计的一种实用方法是**MC Dropout** {cite}`gal2016dropout`：在推理时应用dropout并进行 $T$ 次前向传播。预测结果之间的方差是认知不确定性的估计。

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

在上述未训练的网络中，两个样本显示出相似的不确定性。训练后，分布外样本将显示更高的认知不确定性——模型尚未学习到对距训练分布较远的输入的可靠映射。

### 深度集成

训练 $M$ 个独立初始化的模型并对其预测结果取平均，能提供比MC Dropout更简单且通常更可靠的不确定性估计 {cite}`lakshminarayanan2017simple`。集成成员之间的分歧就是认知不确定性信号。

对于大规模主动学习，MC Dropout和深度集成都会增加与 $T$ 或 $M$ 次前向传播成比例的开销。在实践中，MC Dropout的 $T = 10$—$30$ 或集成的 $M = 5$ 个成员，通常足以按认知不确定性对样本进行排序，即使绝对值校准不够精确。

---

## 完整的主动学习循环

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

## 冷启动问题

主动学习需要经过训练的模型来对未标注点进行评分——但在开始时，你没有（或只有极少）标注样本。这就是**冷启动问题**。

实际解决方案：

1. **随机初始化：** 在开始主动学习之前，标注一小批随机种子集（20至100个样本）。
2. **基于聚类的初始化：** 对未标注样本池使用k-means；从每个聚类中标注一个样本。这确保了初始标注集的多样性。
3. **基于嵌入的选择：** 使用预训练编码器对样本进行嵌入；通过核心集方法选择多样化的子集。

对于大多数任务，几十个随机种子标签通常足以启动主动学习；确切数量取决于类别平衡、特征维度和模型复杂度。

---

## 批量模式主动学习

在实践中，标注者是批量工作的——在每个单一标签之后训练和部署新模型效率低下。**批量模式主动学习**同时选择 $b$ 个样本进行标注。

简单地选择不确定性最高的前 $b$ 个样本会导致**冗余**：高度不确定的样本往往聚集在一起（例如，在同一区域内决策边界附近的样本）。更好的批量策略同时优化批次内的不确定性*和*多样性。

**行列式点过程（DPP，Determinantal Point Processes）** 提供了一种有原则的方法来采样多样化的批次：它们定义了一种惩罚相似项目的子集分布。子集 $S$ 在DPP下的概率正比于 $\det(L_S)$，其中 $L$ 是编码相似性的核矩阵。

---

## 停止准则

主动学习应该何时停止？常见准则包括：

- **预算耗尽：** 最简单——当标注预算用完时停止。
- **性能平台期：** 当模型在保留验证集上的精度连续 $k$ 轮没有提升超过 $\delta$ 时停止。
- **置信度阈值：** 当不确定性超过阈值的未标注样本比例低于某个比例时停止。
- **最大损失减少量：** 估计额外标签所能带来的最大收益；当该值降至阈值以下时停止 {cite}`bloodgood2009method`。

---

## 主动学习的适用场景（及不适用场景）

主动学习在以下情况下表现良好：
- 标注昂贵且未标注样本池规模较大
- 数据具有清晰结构，模型可以利用这种结构来识别信息量丰富的样本
- 模型类别适合该任务

主动学习在以下情况下表现不佳：
- 初始模型质量很差（冷启动），无法有意义地对样本进行排序
- 查询策略选择了离群点或错误标注的样本（噪声鲁棒性很重要）
- 未标注样本池与测试分布之间存在数据分布偏移

一个关键的实践问题是**分布不匹配**：主动学习倾向于查询决策边界附近的样本，从而创建一个偏斜的已标注集，可能无法很好地代表测试分布。这可能导致决策边界训练良好，但校准质量较差。

```{seealso}
奠基性综述为 {cite}`settles2009active`。理论基础（标签复杂度、不可知界）：{cite}`balcan2006agnostic`。关于深度学习专用主动学习，请参见 {cite}`ash2020deep`（BADGE）和 {cite}`sener2018active`（核心集）。关于主动学习实际效果的批判性评估，请参见 {cite}`lowell2019practical`。关于深度模型的偶然与认知不确定性，请参见 {cite}`kendall2017uncertainties`；关于作为不确定性估计器的深度集成，请参见 {cite}`lakshminarayanan2017simple`；关于MC Dropout作为近似贝叶斯推断，请参见 {cite}`gal2016dropout`。
```
