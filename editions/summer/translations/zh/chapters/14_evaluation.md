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

# 评估方法与度量指标

了解HITL系统是否正常运作，不仅仅是衡量模型准确率。你需要知道：你是否从标注预算中获得了价值，模型是否真正与人类意图更好地对齐，以及额外的人类反馈是否会继续改善结果。本章涵盖HITL设置下的完整评估方法论。

---

## 以模型为中心的指标

标准机器学习指标可直接应用于HITL系统，但有一些重要的细微差别。

### 分类指标

**准确率**在类别平衡且所有错误代价相同时适用。然而，在HITL设置中，标注测试集可能因查询策略而产生偏差（主动学习查询的是非随机样本），使简单的准确率估计不可靠。

**F1分数**是精确率和召回率的调和平均，适用于不平衡类别。在HITL情境中，精确率和召回率的重要程度可能因假阳性和假阴性的代价不对称而不同。

**AUROC**衡量模型不依赖阈值区分类别的能力——对于医学筛查等对校准敏感的任务很重要。

**校准**衡量预测概率与经验频率的吻合程度。在HITL系统中，从主动学习的偏斜标注集上训练的模型，即使准确率较高，也可能存在校准问题。

### 生成式模型指标

对于语言模型和生成系统，评估从根本上更为困难。没有单一的自动指标能够捕捉质量的全部：

- **BLEU / ROUGE / METEOR：** 用于翻译和摘要的基于参考的指标。与长文本生成的人类质量判断的相关性较弱。
- **困惑度：** 衡量模型预测保留文本的能力。是质量的必要但非充分条件。
- **BERTScore：** 与参考文本的基于嵌入的相似度。与人类判断的相关性优于n-gram指标。
- **人工评估：** 黄金标准。详见第14.3节。

---

## 标注效率指标

HITL评估还应衡量人类反馈的使用效率。

### 学习曲线

**学习曲线**将模型性能绘制为标注样本数量的函数。学习曲线陡峭（标签少，改善快）表明标注策略正在选择信息量丰富的样本。学习曲线平坦表明额外标注带来的收益递减。

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, roc_auc_score
from sklearn.model_selection import StratifiedShuffleSplit

rng = np.random.default_rng(42)
X, y = make_classification(n_samples=5000, n_features=30, n_informative=15,
                            weights=[0.8, 0.2], random_state=42)
X_test, y_test = X[4000:], y[4000:]
X_pool, y_pool = X[:4000], y[:4000]

label_sizes = [20, 40, 60, 100, 150, 200, 300, 400, 600, 800, 1000, 1500, 2000]
metrics = {'f1': [], 'auc': []}

for n in label_sizes:
    idx = rng.choice(len(X_pool), n, replace=False)
    clf = LogisticRegression(max_iter=500, class_weight='balanced')
    clf.fit(X_pool[idx], y_pool[idx])
    preds = clf.predict(X_test)
    probs = clf.predict_proba(X_test)[:, 1]
    metrics['f1'].append(f1_score(y_test, preds))
    metrics['auc'].append(roc_auc_score(y_test, probs))

# Fit learning curve: performance ≈ a - b/sqrt(n)
from scipy.optimize import curve_fit

def learning_curve_fn(n, a, b):
    return a - b / np.sqrt(n)

popt_f1, _ = curve_fit(learning_curve_fn, label_sizes, metrics['f1'], p0=[0.9, 2])
popt_auc, _ = curve_fit(learning_curve_fn, label_sizes, metrics['auc'], p0=[0.95, 1])

n_smooth = np.linspace(20, 3000, 200)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4))

ax1.scatter(label_sizes, metrics['f1'], color='#2b3a8f', zorder=5, s=40)
ax1.plot(n_smooth, learning_curve_fn(n_smooth, *popt_f1), '--', color='#e05c5c',
         label=f'Fit: {popt_f1[0]:.3f} - {popt_f1[1]:.1f}/√n')
ax1.set_xlabel("Labeled examples"); ax1.set_ylabel("F1 score")
ax1.set_title("Learning Curve: F1"); ax1.legend(); ax1.grid(alpha=0.3)

ax2.scatter(label_sizes, metrics['auc'], color='#0d9e8e', zorder=5, s=40)
ax2.plot(n_smooth, learning_curve_fn(n_smooth, *popt_auc), '--', color='#e05c5c',
         label=f'Fit: {popt_auc[0]:.3f} - {popt_auc[1]:.2f}/√n')
ax2.set_xlabel("Labeled examples"); ax2.set_ylabel("AUROC")
ax2.set_title("Learning Curve: AUROC"); ax2.legend(); ax2.grid(alpha=0.3)

plt.tight_layout()
plt.savefig('learning_curves.png', dpi=150)
plt.show()

# Estimate the annotation budget needed to reach a target performance
target_f1 = 0.80
n_needed = (popt_f1[1] / (popt_f1[0] - target_f1)) ** 2
print(f"Estimated labels needed to reach F1={target_f1}: {n_needed:.0f}")
```

### 投资回报率（ROI）分析

人类反馈的ROI回答了这样一个问题：每增加一个标签，模型性能会提升多少？

$$
\text{ROI}(n) = \frac{\Delta \text{性能}(n)}{\text{每标签成本}}
$$

随着模型的成熟（以及易于学习的样本被耗尽），ROI通常会下降。实际含义：标注预算应该前置，在ROI最高的早期阶段收集更多标签。

---

## 人工评估

对于生成系统和主观任务，人工评估仍然是黄金标准。

### 直接评估（DA）

标注者在绝对量表上（例如，翻译质量1至100分，或回复有帮助性1至5分）对输出进行评分。DA已在机器翻译评估（WMT基准）中实现标准化。

**DA的最佳实践：**
- 随机化输出顺序以防止锚定效应
- 每个条目使用足够数量的标注者（最少3至5名）
- 包含质量控制（明显好和坏的示例，以发现注意力不集中的评分者）
- 在汇总分数的同时报告标注者间一致性

### 比较评估

标注者选择两个输出中的一个："哪个更好？"比较判断比绝对评分更快且更一致（见第8章）。**ELO评分系统**（借自国际象棋）将成对比较结果转换为连续质量排名。

```{code-cell} python
import numpy as np

def update_elo(rating_a, rating_b, outcome_a, k=32):
    """Update ELO ratings. outcome_a: 1=A wins, 0=B wins, 0.5=tie."""
    expected_a = 1 / (1 + 10 ** ((rating_b - rating_a) / 400))
    expected_b = 1 - expected_a
    new_a = rating_a + k * (outcome_a - expected_a)
    new_b = rating_b + k * ((1 - outcome_a) - expected_b)
    return new_a, new_b

# Simulate 5 model versions being compared pairwise
rng = np.random.default_rng(42)
true_quality = [0.60, 0.70, 0.75, 0.80, 0.85]  # underlying model quality
n_models = len(true_quality)
elo_ratings = {i: 1000.0 for i in range(n_models)}

for _ in range(500):  # 500 pairwise comparisons
    i, j = rng.choice(n_models, 2, replace=False)
    p_i_wins = true_quality[i] / (true_quality[i] + true_quality[j])
    outcome = 1.0 if rng.random() < p_i_wins else 0.0
    elo_ratings[i], elo_ratings[j] = update_elo(elo_ratings[i], elo_ratings[j], outcome)

print("ELO Rankings after 500 comparisons:")
sorted_models = sorted(elo_ratings.items(), key=lambda x: x[1], reverse=True)
for rank, (model_id, elo) in enumerate(sorted_models, 1):
    print(f"  Rank {rank}: Model {model_id}  ELO={elo:.1f}  True quality={true_quality[model_id]:.2f}")
```

### 行为测试（CheckList）

**CheckList** {cite}`ribeiro2020beyond` 是一种对NLP模型进行系统性行为评估的方法论。与随机测试集不同，它设计测试用例来探测特定能力：

- **最小功能测试（MFT）：** 模型能否处理简单、明显的案例？
- **不变性测试（INV）：** 当不应发生变化时（例如，改写时），模型的输出是否会变化？
- **方向性预期测试（DIR）：** 当输入发生变化时，模型的输出是否按预期方向变化？

CheckList使人工评估具有针对性且可操作：不是单一的准确率数字，而是能力概况。

---

## 衡量与人类意图的对齐程度

对于RLHF系统，衡量对齐程度是核心评估挑战。

**奖励模型评估：** 奖励模型在保留偏好测试集上的准确率。Ouyang等人 {cite}`ouyang2022training` 报告InstructGPT奖励模型的成对准确率约为72%；作为粗略的参考点，类似数量级的数字在类似的RLHF流程中经常被引用，尽管结果因任务和数据质量而差异很大。

**胜率：** 给定两个模型版本（例如，SFT基线与RLHF微调版），在人类成对比较中，RLHF模型的回复赢得了多少比例？

**GPT-4作为评估者：** 使用有能力的LLM来评估回复，已成为快速迭代的常见做法。Gilardi等人 {cite}`gilardi2023chatgpt` 和Zheng等人 {cite}`zheng2023judging` 发现LLM评估者与人类判断的一致性大约在0.7至0.9之间，具体取决于任务——对于快速A/B比较有用，但对于检测逢迎性、文化细微差别或安全问题则不够可靠。

**逢迎性检测：** 衡量模型是否根据隐含的用户偏好改变其答案（例如，"我认为X是正确的；你怎么看？"）。一个良好对齐的模型不应该是逢迎性的。

---

## 已部署系统中的A/B测试

对于生产中的系统，最终评估是**A/B测试**：将一部分用户路由到新的模型版本，并衡量下游结果。

A/B测试提供了模型在实际部署情境中质量的无偏估计，能够捕捉实验室评估遗漏的影响（用户行为、人口分布、边缘案例）。

挑战在于：合适的下游指标。参与度指标（点击、会话时长）可能奖励操纵性行为。任务完成率或用户满意度调查更符合目标，但噪声更大。

```{seealso}
CheckList行为测试：{cite}`ribeiro2020beyond`。关于RLHF评估方法论，请参见 {cite}`ouyang2022training`。关于MT中人工评估的最佳实践：{cite}`graham2015accurate`。关于学习曲线理论：{cite}`mukherjee2003estimating`。
```
