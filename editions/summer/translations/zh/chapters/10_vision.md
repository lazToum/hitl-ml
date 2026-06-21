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

# 人机协同在计算机视觉中的应用

计算机视觉提供了一些HITL ML最直观的示例。ImageNet挑战赛建立在1400万张人工标注图像之上，开启了深度学习时代。放射科医生对医学影像的标注为诊断AI提供了动力。自动驾驶汽车依赖数百万张人工标注帧来学习感知世界。

容易被忽视的是：这些不仅仅是人类提供客观真相的案例。它们是人类构建数据集的案例，而这些数据集嵌入了特定的感知、文化和操作选择——这些选择只有在后来，当模型以可预测的方式失败时，才变得可见。

---

## 标注选择如何变成模型偏见

标准框架将标注视为数据收集：人类观察世界并记录所见。更准确的框架是，标注是*数据集设计*：人类决定使用什么类别、在哪里划定边界、包含哪些边缘案例，以及如何解决歧义——所有这些决策都会影响训练好的模型将感知什么。

### ImageNet案例

ImageNet {cite}`russakovsky2015imagenet` 是计算机视觉历史上最具影响力的数据集。其标签集来源于WordNet词组，之所以被选用，主要是因为其数量众多且语义上相互区分。这一设计选择的几个后果在多年后才浮现：

- **人物类别编码了人口关联。** ImageNet早期版本的人物词组标签中，有许多现在会被认为是贬义或有偏见的，反映了历史上的WordNet来源以及标注者群体关于将哪些标签应用于哪些图像的隐性决策 {cite}`yang2020towards`。应用于人物图像的标签编码了种族、性别和阶级关联，并直接传播到模型嵌入中。

- **细粒度的物种分类体系，但其他几乎一切都是粗粒度的。** ImageNet能够区分120种狗品种，但将工具、车辆、食物和家具中的巨大变化压缩到单一类别中。这是遵循WordNet结构的结果，而非关于什么重要的深思熟虑的选择。在ImageNet上训练的模型表现出同样不对称的精度。

- **西方、英语的视觉默认值。** 图像主要通过Flickr和英语搜索词的互联网搜索收集。由此形成的分布严重偏向富裕英语国家的视觉环境和文化物品。

以上都不是错误。它们是在规模上快速做出的标注设计决策，通常由没有预见到数据集将被如何使用的人做出。教训不是ImageNet本应以不同方式构建（尽管它应该），而是**标注设计就是模型设计**，应当以同等的谨慎对待。

:::{admonition} 标注方案是关于世界的理论
:class: note

每个标签分类体系都在主张哪些区分是重要的。选择将"轿车"与"卡车"分开，同时将所有轿车合并为一类，是一个关于哪些区分在语义上相关的理论主张。选择将"人"标注为单一类别，无论姿势、服装或活动，是另一个理论主张。在这些方案上训练的模型将做出相同的区分，不会更多——它们不会泛化到它们被训练以区分的类别之外。
:::

---

## 图像分类标注

最简单的CV标注任务是为整张图像分配一个或多个标签。

**标签层次体系。** "狗"这个标签在语义层次体系中是"动物"的子节点。在平坦分类体系上训练的模型可能无法在不同抽象层次上很好地泛化。ImageNet使用基于词组的层次体系，允许在不同详细程度上进行评估。

**多标签歧义。** 一个街景可能同时包含一辆汽车、一个人、一辆自行车和一个交通信号灯。决定包含哪些标签需要关于相关性阈值的明确指南。

**长尾分布。** 自然图像数据集遵循幂律：少数类别极为常见；大多数类别很少见。主动学习对长尾类别尤其有价值，在这些类别中，随机采样只能产生少量示例。

---

## 目标检测：边界框标注

目标检测要求标注者在每个对象类别的实例周围绘制轴对齐的边界框。这引入了几何精度要求和大量边缘案例。

**标注质量指标：**

*IoU（交并比）* 测量标注框与参考框之间的重叠：

$$
\text{IoU}(A, B) = \frac{|A \cap B|}{|A \cup B|}
$$

$\text{IoU} \geq 0.5$ 是PASCAL VOC中"正确"检测的标准阈值；COCO {cite}`lin2014microsoft` 使用从0.5到0.95的一系列阈值，这要求更高也更具信息量。

**必须在指南中解决的标注边缘案例：**
- 被遮挡的物体：标注可见部分还是推断完整范围？
- 被截断的物体（部分在帧外）：包含还是排除？
- 人群区域：使用特殊的"人群"标注还是标注单独实例？

每一个决策都改变了"正确检测"的含义——因此改变了模型被训练去做的事情。

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def compute_iou(boxA, boxB):
    """Compute IoU between two boxes [x1, y1, x2, y2]."""
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    inter_area = max(0, xB - xA) * max(0, yB - yA)
    boxA_area = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxB_area = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
    union_area = boxA_area + boxB_area - inter_area
    return inter_area / (union_area + 1e-6)

ref_box  = [1.0, 1.0, 4.0, 4.0]
ann1_box = [1.1, 0.9, 4.1, 4.2]   # close
ann2_box = [0.5, 0.5, 3.5, 3.8]   # less precise

print(f"IoU (ann1 vs ref):  {compute_iou(ann1_box, ref_box):.3f}")
print(f"IoU (ann2 vs ref):  {compute_iou(ann2_box, ref_box):.3f}")
print(f"IoU (ann1 vs ann2): {compute_iou(ann1_box, ann2_box):.3f}")

fig, ax = plt.subplots(figsize=(5, 5))
ax.set_xlim(0, 5); ax.set_ylim(0, 5); ax.set_aspect('equal')
ax.add_patch(patches.Rectangle(
    (ref_box[0], ref_box[1]), ref_box[2]-ref_box[0], ref_box[3]-ref_box[1],
    linewidth=2.5, edgecolor='#2b3a8f', facecolor='none', label='Reference'))
ax.add_patch(patches.Rectangle(
    (ann1_box[0], ann1_box[1]), ann1_box[2]-ann1_box[0], ann1_box[3]-ann1_box[1],
    linewidth=2, edgecolor='#0d9e8e', facecolor='none', linestyle='--',
    label=f'Ann1 (IoU={compute_iou(ann1_box, ref_box):.2f})'))
ax.add_patch(patches.Rectangle(
    (ann2_box[0], ann2_box[1]), ann2_box[2]-ann2_box[0], ann2_box[3]-ann2_box[1],
    linewidth=2, edgecolor='#e05c5c', facecolor='none', linestyle=':',
    label=f'Ann2 (IoU={compute_iou(ann2_box, ref_box):.2f})'))
ax.legend(fontsize=10)
ax.set_title("Bounding Box Agreement (IoU)", fontsize=12)
plt.tight_layout()
plt.savefig('bbox_iou.png', dpi=150)
plt.show()
```

---

## 语义与实例分割

分割标注需要为图像中的每个像素分配类别标签——是成本最高的标注类型之一。

**语义分割：** 每个像素属于一个语义类别（道路、天空、人、汽车）。同一类别的所有像素共享相同的标签，无论它们属于哪个单独的对象。

**实例分割：** 每个单独的对象实例获得唯一标签。20人的人群变成20个不同的掩码。

**全景分割：** 结合两者："物体"类别（可计数的对象）有实例掩码；"场景"类别（道路、天空）有语义掩码。

**SAM辅助标注：** Meta的Segment Anything Model {cite}`kirillov2023segment` 通过单次点击生成高质量的分割掩码。标注者点击对象的中心；SAM提出掩码；标注者接受或纠正。SAM作者报告相比基于多边形的标注方式有约6.5倍的标注速度提升；提升幅度因场景类型和标注工具而异。

SAM代表了一种更广泛的转变：**标注者的角色从绘制转变为审核**。这对标注质量的影响超越了速度本身。当标注者绘制时，他们在整个过程中都是专注的。当标注者审核并点击"接受"时，有证据表明他们更容易遗漏错误——这是特定于标注情境的自动化偏差的一种版本。

---

## 计算机视觉的主动学习

主动学习在CV中尤其有价值，因为：
1. 图像是高维且特征丰富的——预训练模型的嵌入携带了用于不确定性估计的强信号
2. 大型未标注样本池成本低廉（照片、视频帧）
3. 标注（特别是分割）成本高昂，对于专业领域无法轻易进行众包

```{code-cell} python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

X, y = make_classification(n_samples=3000, n_features=50, n_informative=25,
                            n_classes=5, n_clusters_per_class=2, random_state=42)
X_train, y_train = X[:2500], y[:2500]
X_test,  y_test  = X[2500:], y[2500:]

def margin_uncertainty(model, X_pool):
    probs = model.predict_proba(X_pool)
    sorted_p = np.sort(probs, axis=1)
    return sorted_p[:, -2] - sorted_p[:, -1]  # most negative = most uncertain

n_init = 50
results = {'active': [], 'random': []}
label_counts = list(range(50, 401, 30))

for strategy in ['active', 'random']:
    labeled = list(rng.choice(len(X_train), n_init, replace=False))
    unlabeled = [i for i in range(len(X_train)) if i not in labeled]

    for target in label_counts:
        while len(labeled) < target and unlabeled:
            if strategy == 'active' and len(labeled) >= 10:
                model_temp = LogisticRegression(max_iter=300).fit(
                    X_train[labeled], y_train[labeled])
                margins = margin_uncertainty(model_temp, X_train[unlabeled])
                idx = int(np.argmin(margins))
            else:
                idx = rng.integers(0, len(unlabeled))
            labeled.append(unlabeled.pop(idx))

        clf = LogisticRegression(max_iter=300).fit(X_train[labeled], y_train[labeled])
        results[strategy].append(accuracy_score(y_test, clf.predict(X_test)))

plt.figure(figsize=(7, 4))
plt.plot(label_counts, results['active'], 'o-', color='#2b3a8f',
         linewidth=2, label='Active (margin sampling)')
plt.plot(label_counts, results['random'], 's--', color='#e05c5c',
         linewidth=2, label='Random baseline')
plt.xlabel("Labeled training images", fontsize=12)
plt.ylabel("Test accuracy", fontsize=12)
plt.title("Active Learning for 5-Class Image Classification", fontsize=13)
plt.legend(fontsize=11); plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('cv_active_learning.png', dpi=150)
plt.show()
```

---

## 基于人类引导的半监督学习

大量可用的未标注视觉数据使半监督学习对CV尤具吸引力。

**自训练 / 伪标签：** 在已标注数据上训练模型；将未标注数据上的高置信度预测作为伪标签；重新训练。关键的设计问题是置信度阈值。阈值低会带入更多样本但引入噪声；阈值高会使大部分未标注样本池闲置。人类参与可以引导这个阈值——标注者对伪标注样本的随机子集进行抽查以进行校准。

**FixMatch与一致性正则化：** 这些方法训练模型在数据增强下产生一致的预测。关键的HITL洞见是：咨询人类不仅仅是为了获取标签，也是为了**增强设计**——模型应该学习哪些不变性？医学影像模型应该对旋转和亮度不变，但不对尺度不变；文本检测模型不应对透视失真不变。这些领域特定的选择需要人类专业知识，错误选择会严重降低半监督学习的效果。

**主动半监督学习：** 最高效的组合：主动学习将人类标签集中在模型不确定性最高的地方；自训练对高置信度的长尾自动添加标签。人类精力集中在最有价值之处，模型在其余部分进行自举。在每个周期中，对伪标签随机样本进行人工审计，无需完整审查即可提供质量检验。

---

## 视频标注

视频标注将图像标注的挑战乘以时间维度：

- **跟踪：** 对象必须跨帧被识别。标注者为关键帧添加标签；跟踪算法在其间进行插值。遮挡、重新进入、快速移动等跟踪失败情况，需要比稳态跟踪更高比率的人工重新标注。
- **时序一致性：** 在帧 $t$ 中绘制的边界应与帧 $t+1$ 在空间上保持一致。不一致的标注是告诉模型对象不连续跳跃的训练信号——这是一种对检测模型特别有害的标注噪声形式。
- **可扩展性：** 以30帧/秒拍摄的1小时视频有108,000帧。完整标注是不切实际的；采样策略必须精心设计，以确保稀有事件（边缘案例、险情、故障场景）不被系统性地排除在外。

现代视频标注工具支持**智能跟踪**，跨帧传播标注，并在跟踪置信度下降到阈值以下时标记帧，提示标注者重新检查。这是主动学习理念在标注流程本身中的直接应用：工具在其插值不确定的地方精确地查询标注者。

**自动驾驶系统中的稀有事件问题。** 对于稀有事件后果灾难性的应用——自动驾驶、无人机导航——正常操作中看到的帧分布与最重要的帧分布严重不匹配。通过均匀采样行车影像构建的数据集，将包含数百万个"没有什么有趣事情发生"的帧，以及少量真正重要的险情、异常光线和传感器降级帧。识别和优先处理此类帧的HITL主动学习不是效率黑客——它是安全要求。

```{seealso}
ImageNet数据集：{cite}`russakovsky2015imagenet`。ImageNet中的标签偏见：{cite}`yang2020towards`。COCO基准：{cite}`lin2014microsoft`。SAM（Segment Anything）：{cite}`kirillov2023segment`。CV核心集主动学习：{cite}`sener2018active`。
```
