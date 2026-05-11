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

# 众包与质量控制

当标注任务足够简单，非专家也能完成时，众包平台提供了以较低的每条成本访问大型按需标注者队伍的途径。从人群中构建高质量标注数据集需要精心的任务设计、策略性的冗余设置和严格的质量控制。

---

## 众包平台

**Amazon Mechanical Turk（MTurk）** 是最原始的众包市场，于2005年推出。工人（"Turkers"）完成发布者发布的微任务（HIT）。2018年的一项研究发现，Turkers的有效时薪中位数约为2美元/小时——远低于许多高收入国家的最低工资 {cite}`hara2018data`——这是第15章将讨论的伦理问题。MTurk最适合具有清晰、可验证标准的简单任务。

**Prolific** 是一个学术众包平台，执行最低薪酬标准（目前约为9英镑/小时，即约11美元/小时，如Prolific发布的指南所述），按人口统计特征筛选参与者，并维护一个已选择参与研究的工人群体。更适合社会科学研究和需要代表性的任务。

**Appen**（以及类似的Telus International、iMerit）提供托管标注队伍与质量管理，用于更复杂的任务和企业项目。

**专业社区。** 对于特定领域的任务，领域爱好者社区可以提供高质量的标注：用于天文学的Galaxy Zoo、用于鸟类物种的eBird、用于国际象棋局面标注的Chess Tempo。

---

## 众包的任务设计

### 分解复杂任务

复杂任务应分解为简单、定义明确的微任务。与其要求工人全面标注一份文档，不如每次只问他们一个专注的问题："这个句子包含人名吗？"或"在1到5的分数上，这个翻译的清晰程度如何？"

**分解的好处：**
- 每个任务的认知需求降低 → 疲劳减少，质量提高
- 每个微任务可以单独进行质量控制
- 更易于审计和调试

### 说明的重要性

众包质量最重要的单一预测因素是说明质量。良好的任务说明：
- 用一句话解释任务的*目的*
- 为每个类别提供清晰、无歧义的定义
- 提供3至5个有效示例（特别是边缘案例）
- 长度不超过工人实际会阅读的范围（简单任务少于300字）

在扩大规模之前进行**试点研究**（10至50名工人，20至100个任务）。分析试点分歧；大多数分歧指向可以修复的说明歧义。

### 黄金标准问题

在任务批次中嵌入**黄金标准问题**——具有已知正确答案的任务。在黄金问题上低于阈值的工人将被从项目中移除。

```{code-cell} python
import numpy as np
from scipy.stats import binom

rng = np.random.default_rng(42)

def simulate_gold_screening(n_workers=100, gold_per_batch=5,
                             p_good_worker=0.7, good_acc=0.92,
                             bad_acc=0.55, threshold=0.70):
    """
    Simulate quality screening via gold questions.
    Returns: precision and recall of identifying bad workers.
    """
    worker_quality = rng.choice(['good', 'bad'], size=n_workers,
                                 p=[p_good_worker, 1 - p_good_worker])
    results = {'tp': 0, 'fp': 0, 'tn': 0, 'fn': 0}

    for q in worker_quality:
        acc = good_acc if q == 'good' else bad_acc
        n_correct = rng.binomial(gold_per_batch, acc)
        passed = (n_correct / gold_per_batch) >= threshold
        if q == 'bad' and not passed:  results['tp'] += 1
        if q == 'good' and not passed: results['fp'] += 1
        if q == 'bad' and passed:      results['fn'] += 1
        if q == 'good' and passed:     results['tn'] += 1

    tp, fp, fn = results['tp'], results['fp'], results['fn']
    precision = tp / (tp + fp + 1e-6)
    recall    = tp / (tp + fn + 1e-6)
    return precision, recall

# Vary gold question count
gold_counts = [3, 5, 8, 10, 15, 20]
precisions, recalls = [], []
for g in gold_counts:
    p_list, r_list = [], []
    for _ in range(50):
        p, r = simulate_gold_screening(gold_per_batch=g)
        p_list.append(p); r_list.append(r)
    precisions.append(np.mean(p_list))
    recalls.append(np.mean(r_list))

import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(gold_counts, precisions, 'o-', color='#2b3a8f', label='Precision', linewidth=2)
ax.plot(gold_counts, recalls,    's--', color='#0d9e8e', label='Recall',    linewidth=2)
ax.set_xlabel("Gold questions per batch", fontsize=12)
ax.set_ylabel("Screening performance", fontsize=12)
ax.set_title("Worker Screening via Gold Standard Questions", fontsize=13)
ax.legend(fontsize=11); ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('gold_screening.png', dpi=150)
plt.show()

p, r = simulate_gold_screening(gold_per_batch=5)
print(f"5 gold questions: Precision={p:.3f}, Recall={r:.3f}")
p, r = simulate_gold_screening(gold_per_batch=10)
print(f"10 gold questions: Precision={p:.3f}, Recall={r:.3f}")
```

---

## 标签聚合的统计模型

多数投票是自然的基线，但忽略了标注者准确率的差异。统计模型可以做得更好。

### Dawid-Skene模型

**Dawid-Skene（DS）模型** {cite}`dawid1979maximum` 联合估计：
- 每个条目 $i$ 的**真实标签** $z_i$
- 每位标注者 $j$ 的**混淆矩阵** $\pi_j^{(k,l)}$：标注者 $j$ 将真实类别为 $k$ 的条目标注为类别 $l$ 的概率

EM算法迭代：
- **E步：** 给定标注者混淆矩阵，计算每个真实标签的后验概率
- **M步：** 给定条目标签估计，更新标注者混淆矩阵

```{code-cell} python
import numpy as np
from scipy.special import softmax

def dawid_skene_em(annotations, n_classes, n_iter=20):
    """
    Simplified Dawid-Skene EM for binary classification.
    annotations: dict {item_idx: [(annotator_idx, label), ...]}
    Returns: estimated true labels and annotator accuracies.
    """
    items = sorted(annotations.keys())
    n_items = len(items)
    annotators = sorted({a for anns in annotations.values() for a, _ in anns})
    n_annotators = len(annotators)
    ann_idx = {a: i for i, a in enumerate(annotators)}

    # Initialize: majority vote
    T = np.zeros((n_items, n_classes))  # soft label estimates
    for i, item in enumerate(items):
        for _, label in annotations[item]:
            T[i, label] += 1
        T[i] /= T[i].sum()

    # Confusion matrices: shape (n_annotators, n_classes, n_classes)
    PI = np.ones((n_annotators, n_classes, n_classes)) * 0.5

    for _ in range(n_iter):
        # M-step: update confusion matrices
        PI = np.zeros((n_annotators, n_classes, n_classes)) + 1e-6
        for i, item in enumerate(items):
            for ann, label in annotations[item]:
                a = ann_idx[ann]
                for k in range(n_classes):
                    PI[a, k, label] += T[i, k]
        PI /= PI.sum(axis=2, keepdims=True)

        # E-step: update soft label estimates
        T = np.zeros((n_items, n_classes))
        for i, item in enumerate(items):
            log_p = np.zeros(n_classes)
            for ann, label in annotations[item]:
                a = ann_idx[ann]
                log_p += np.log(PI[a, :, label] + 1e-10)
            T[i] = softmax(log_p)

    return {item: T[i] for i, item in enumerate(items)}, PI

# Simulate crowdsourcing scenario
rng = np.random.default_rng(42)
N_ITEMS, N_ANNOTATORS, ANNS_PER_ITEM = 200, 10, 3
true_labels = rng.integers(0, 2, N_ITEMS)
# Annotator accuracies: 3 good (0.9), 4 medium (0.75), 3 noisy (0.6)
accuracies = [0.90]*3 + [0.75]*4 + [0.60]*3

annotations = {}
for i in range(N_ITEMS):
    anns_for_item = []
    chosen = rng.choice(N_ANNOTATORS, ANNS_PER_ITEM, replace=False)
    for a in chosen:
        acc = accuracies[a]
        label = true_labels[i] if rng.random() < acc else 1 - true_labels[i]
        anns_for_item.append((a, int(label)))
    annotations[i] = anns_for_item

# Run Dawid-Skene
soft_labels, confusion = dawid_skene_em(annotations, n_classes=2, n_iter=30)
ds_preds = {i: int(np.argmax(soft_labels[i])) for i in range(N_ITEMS)}

# Compare with majority vote
mv_preds = {}
for i in range(N_ITEMS):
    votes = [l for _, l in annotations[i]]
    mv_preds[i] = int(np.round(np.mean(votes)))

ds_acc = np.mean([ds_preds[i] == true_labels[i] for i in range(N_ITEMS)])
mv_acc = np.mean([mv_preds[i] == true_labels[i] for i in range(N_ITEMS)])

print(f"Majority vote accuracy:  {mv_acc:.3f}")
print(f"Dawid-Skene accuracy:    {ds_acc:.3f}")
print(f"\nEstimated annotator accuracies (diagonal of confusion matrix):")
for a in range(N_ANNOTATORS):
    est_acc = np.mean([confusion[a, k, k] for k in range(2)])
    print(f"  Annotator {a}: estimated={est_acc:.3f}, true={accuracies[a]:.2f}")
```

### MACE

**MACE（多标注者能力估计）** {cite}`hovy2013learning` 是另一种概率模型，它明确表示标注者的刷单行为（随机标注）与有效标注之间的区别。标注者要么提供有意义的标签（概率为 $1 - \text{spam}_j$），要么提供随机标签（概率为 $\text{spam}_j$）。这种两组分模型在众包场景中通常比Dawid-Skene具有更好的校准效果，特别是在一些标注者完全是刷单者的情况下。

---

## 冗余与聚合策略

每条数据的最优标注者数量取决于任务难度和标注者质量：

- **容易任务且有技能的标注者：** 每条数据1至2名标注者通常足够
- **中等难度任务且有经过培训的标注者：** 3名标注者 + 多数投票
- **困难/主观任务且有众包工人：** 5至7名标注者 + Dawid-Skene

关键洞见：当标注者准确率较低时，冗余最有价值。对于准确率为 $p$ 的标注者，$n$ 名标注者多数投票的准确率为：

$$
P(\text{MV正确}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

对于 $p = 0.70$，添加第三名标注者将多数投票准确率从70%提升至78%；对于 $p = 0.90$，第三名标注者带来的收益可以忽略不计（从90%提升至97%）。

```{seealso}
Dawid-Skene模型：{cite}`dawid1979maximum`。MACE：{cite}`hovy2013learning`。关于NLP众包的全面综述：{cite}`snow2008cheap`。众包伦理与公平薪酬：参见第15章。
```
