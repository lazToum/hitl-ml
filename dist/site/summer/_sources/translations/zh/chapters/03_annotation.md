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

# 数据标注与标记

数据标注是机器学习中人类参与最为普遍的形式。在模型能够学习之前，必须有人告诉它什么是正确答案——而那个人通常是人类。本章涵盖标注的理论与实践：是什么使标注变得困难、如何设计标注任务、如何衡量质量，以及如何处理分歧。

---

## 标注类型

标注任务在结构、难度和成本上差异极大。主要类型包括：

### 分类

标注者将每个实例分配到$K$个预定义类别之一。这是认知上最简单的标注任务，但定义良好的类别方案（即*分类体系*）可能出乎意料地困难。

**二分类**（这张图片是猫吗？）是最简单的情况。**多类分类**（这是什么动物？）要求标注者从列表中选择一个选项。**多标签**标注（这篇文章涉及哪些主题？）允许同时添加多个标签。

### 序列标注

序列中的每个词元都会获得一个标签。命名实体识别（NER）是典型示例——标注者将文本片段标记为PERSON（人名）、ORGANIZATION（组织机构名）、LOCATION（地名）等。标注通常使用BIO（Beginning-Inside-Outside）或BIOES标注方案：

```text
  B-ORG    O           B-ORG    O     O      O
```

### 片段与关系标注

除了标注单个词元，标注者可能还需要：
- 识别片段（多词元表达式）并分配类型
- 标记片段之间的*关系*（"苹果公司"收购了"Shazam"）
- 标注共指链（同一实体的所有提及）

这些任务认知要求较高，且标注者间一致性较低。

### 边界框与目标检测

标注者在图像中的物体周围绘制矩形，并为每个框分配类别标签。定位精度至关重要：框太小会遗漏上下文；框太大则包含背景。现代标注工具计算与参考标注的交并比（IoU）以标记质量问题。

### 图像分割

像素级标注：每个像素被分配到一个类别（语义分割）或一个特定对象实例（实例分割）。高质量分割是成本最高的标注类型之一，对于复杂场景，每张图像的成本从数十美元到逾百美元不等，具体取决于领域和工具支持。

### 转录与翻译

音频→文本（ASR训练数据）、手写→文本（OCR数据）或源语言→目标语言（机器翻译数据）。这些任务需要语言学专业知识，不经过培训的标注者无法可靠地完成。

---

## 标注指南

决定标注质量最重要的单一因素是**标注指南**的质量：标注者遵循的书面指令。

良好的指南：
- 说明任务目标并解释*为什么*标签重要
- 为每个类别提供清晰定义，附有正面和负面示例
- 明确处理常见的边缘案例和困难案例
- 说明不确定时应怎么做（例如，标记"跳过"还是强制选择）
- 包含完整标注的有效示例

糟糕的指南在边缘案例上依赖标注者"凭常识判断"——这会导致不一致的决策，降低模型质量并放大标注者间分歧。

```{admonition} 指南开发是迭代的
:class: note

不要期望一开始就写出完美的指南。先进行小规模的试点标注，分析分歧，然后更新指南。如此反复。完善后的指南通常需要经历3至5个修订周期才能趋于稳定。
```

---

## 衡量标注质量：标注者间一致性

当多个标注者为同一数据添加标签时，可以衡量他们的一致性。高一致性表明任务定义明确，标注者理解了任务。低一致性表明任务、指南或数据本身存在歧义。

### Cohen's Kappa系数

对于两个标注者将数据标注到$K$个类别的情况，**Cohen's kappa系数** {cite}`cohen1960coefficient` 对偶然因素进行了修正：

$$
\kappa = \frac{P_o - P_e}{1 - P_e}
$$

其中$P_o$是观测到的比例一致性，$P_e$是偶然一致性的概率（由边缘标签分布计算得出）。

$\kappa = 1$表示完全一致；$\kappa = 0$表示一致性不优于随机；$\kappa < 0$表示系统性分歧。

| $\kappa$范围  | 解释          |
|----------------|---------------|
| $< 0$          | 低于随机水平  |
| $0.0 - 0.20$   | 极弱一致性    |
| $0.21 - 0.40$  | 一般一致性    |
| $0.41 - 0.60$  | 中等一致性    |
| $0.61 - 0.80$  | 显著一致性    |
| $0.81 - 1.00$  | 近乎完全一致  |

### Fleiss' Kappa系数

将Cohen's kappa扩展至$M > 2$名标注者。每位标注者独立为每条数据添加标签；公式跨标注者聚合：

$$
\kappa_F = \frac{\bar{P} - \bar{P}_e}{1 - \bar{P}_e}
$$

其中$\bar{P}$是所有标注者对之间的平均成对一致性，$\bar{P}_e$是随机分配下的预期一致性。

### Krippendorff's Alpha系数

最通用的指标，支持任意数量的标注者、任意量表类型（名义、有序、区间、比率）以及缺失数据 {cite}`krippendorff2011computing`：

$$
\alpha = 1 - \frac{D_o}{D_e}
$$

其中$D_o$是观测到的分歧，$D_e$是预期的分歧。由于其灵活性，Krippendorff's alpha在学术研究中通常更受青睐。

```{code-cell} python
import numpy as np
from sklearn.metrics import cohen_kappa_score

# Simulate two annotators labeling 200 items into 3 categories
rng = np.random.default_rng(0)
true_labels = rng.integers(0, 3, size=200)

# Annotator 1: mostly agrees with ground truth
ann1 = true_labels.copy()
flip_mask = rng.random(200) < 0.15
ann1[flip_mask] = rng.integers(0, 3, size=flip_mask.sum())

# Annotator 2: less consistent
ann2 = true_labels.copy()
flip_mask2 = rng.random(200) < 0.30
ann2[flip_mask2] = rng.integers(0, 3, size=flip_mask2.sum())

kappa_12 = cohen_kappa_score(ann1, ann2)
kappa_1true = cohen_kappa_score(ann1, true_labels)
kappa_2true = cohen_kappa_score(ann2, true_labels)

print(f"Cohen's κ (ann1 vs ann2):   {kappa_12:.3f}")
print(f"Cohen's κ (ann1 vs truth):  {kappa_1true:.3f}")
print(f"Cohen's κ (ann2 vs truth):  {kappa_2true:.3f}")
```

---

## 处理分歧

当标注者意见不一致时，有几种策略可供选择：

### 多数投票

以最常见的标签作为黄金标准。当每条数据的标注者数量为奇数时，该方法简单且稳健。当少数标注者群体系统性地更准确时，该方法会失效。

### 加权投票

标注者根据其估计的准确率进行加权（准确率由与黄金标准或其他标注者的一致性推导得出）。准确率更高的标注者具有更大的影响力。

### 软标签

与其将标注压缩为单一标签，不如保留分布。如果5位标注者中有3位说"正面"，2位说"中性"，则将其表示为$(p_\text{正面}, p_\text{中性}, p_\text{负面}) = (0.6, 0.4, 0.0)$。在软标签上训练可以改善模型校准。

### 仲裁

由高级标注者或领域专家裁定分歧。这是黄金标准，但代价高昂；通常只在高风险领域使用。

### 统计模型

更复杂的方法以概率方式对标注者能力进行建模。**Dawid-Skene模型** {cite}`dawid1979maximum` 通过EM算法同时估计标注者混淆矩阵和数据条目的真实标签。详见第13章。

---

## 标签噪声及其影响

真实的标注是有噪声的。标签噪声对模型训练的影响取决于噪声类型：

- **随机噪声**（标签随机翻转）会降低性能，但模型对中等水平的噪声（许多任务上高达约20%）具有出人意料的鲁棒性。
- **系统性/对抗性噪声**（标签在特定模式下持续出错）危害更大，也更难检测。
- **类别条件噪声**（某些类别更容易出错）会使模型的决策边界产生偏差。

一条实用的经验法则：在有$n$个训练样本且$\epsilon$比例标签被污染的情况下，模型性能大致等同于拥有$(1 - 2\epsilon)^2 n$个干净样本 {cite}`natarajan2013learning`。对于$\epsilon = 0.2$，这相当于损失了36%的数据。

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(42)
X, y = make_classification(n_samples=2000, n_features=20, random_state=42)

noise_levels = np.linspace(0, 0.45, 15)
mean_accs = []

for eps in noise_levels:
    y_noisy = y.copy()
    flip = rng.random(len(y)) < eps
    y_noisy[flip] = 1 - y_noisy[flip]
    scores = cross_val_score(LogisticRegression(max_iter=500), X, y_noisy, cv=5)
    mean_accs.append(scores.mean())

plt.figure(figsize=(7, 4))
plt.plot(noise_levels, mean_accs, 'o-', color='#2b3a8f', linewidth=2)
plt.xlabel("Label noise rate (ε)", fontsize=12)
plt.ylabel("Cross-validated accuracy", fontsize=12)
plt.title("Effect of Label Noise on Model Performance", fontsize=13)
plt.axvline(0.2, color='#e05c5c', linestyle='--', alpha=0.7, label='20% noise')
plt.legend()
plt.tight_layout()
plt.savefig('label_noise_effect.png', dpi=150)
plt.show()
print(f"\nAccuracy at 0% noise:  {mean_accs[0]:.3f}")
print(f"Accuracy at 20% noise: {mean_accs[round(0.2 / 0.45 * 14)]:.3f}")
print(f"Accuracy at 40% noise: {mean_accs[-2]:.3f}")
```

---

## 标注成本与吞吐量

理解标注经济学对于项目规划至关重要。

| 任务类型                     | 典型吞吐量          | 每条成本（专家）  |
|------------------------------|---------------------|-------------------|
| 二分类图像分类               | 200–500条/小时      | 0.02–0.10美元     |
| NER（短文本）                | 50–150条/小时       | 0.10–0.50美元     |
| 关系抽取                     | 20–60条/小时        | 0.30–1.50美元     |
| 医学图像分割                 | 5–30条/小时         | 10–100美元        |
| 视频标注                     | 5–20分钟视频/小时   | 20–200美元        |

以上数据为大致量级估计，因所需领域专业知识、标注工具质量、指南清晰度和标注者经验的不同而差异极大。应将其视为说明性参考，而非规范性数据。

```{seealso}
标注工具选项在第12章介绍。众包标注的统计模型（Dawid-Skene、MACE）在第13章介绍。
```
