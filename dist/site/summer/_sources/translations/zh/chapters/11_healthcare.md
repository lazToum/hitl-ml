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

# 人机协同在医疗与科学中的应用

医疗健康和科学研究是HITL ML最具影响力、也最受争议的两个领域。风险极高：一次漏诊的癌症或一个错误的药物靶点都有真实的人类代价。标注需要稀缺而昂贵的专业知识。监管要求约束了模型的功能以及必须如何验证。与NLP不同，在NLP中标注问题部分是社会建构的，这里通常存在真正的客观真相——肿瘤要么存在，要么不存在——即便没有任何单独的观察者能可靠地确定这一点。

大众报道中的主流框架是"AI对抗人类"：AI会取代放射科医生吗？这种框架错误的方式是重要的。真正的问题是什么形式的人机协作能产生比任何一方单独更好的结果，以及如何构建能够实现而非破坏这种协作的系统。

---

## 医学图像分析

医学影像——放射学（X射线、CT、MRI）、病理学（组织切片）、皮肤科、眼科——是医疗AI进展最为迅速的领域。

### 专家标注者的要求

医学影像标注通常需要具有特定亚专科培训的医师。这使标注：

- **缓慢：** 专家时间有限；标注与临床职责相竞争
- **昂贵：** 成本从数十美元到数百美元不等，具体取决于亚专科、模态和任务复杂度
- **多变：** 即使是专家也会出现分歧，特别是在边界案例上——这一事实通常被视为问题，但实际上具有信息价值

### 放射科医生间的变异性

阅片变异性在放射学中有充分记录。在CheXNet研究中，四位放射科医生对同一肺炎检测测试集进行标注，F1分数相差约12个百分点 {cite}`rajpurkar2017chexnet`，反映了边界案例上真实的诊断不确定性。对于肺部CT结节检测，阅片者内变异性（同一阅片者，同一病例，不同天）可以与阅片者间变异性一样大。

这种变异性不仅仅是噪声——它反映了真实的诊断不确定性。在单一放射科医生标注上训练的模型可能学习到该医生的特定偏见，而非底层病理。

:::{admonition} CheXNet争议作为HITL教训
:class: note

当Rajpurkar等人宣称其CheXNet模型在肺炎检测上"超越了放射科医生的表现"时，这一说法立即受到放射学界的质疑 {cite}`yu2022assessing`。争议的一部分涉及特定测试集和放射科医生比较。但更深层的问题是方法论的：所使用的"放射科医生表现"基线采用的是在时间压力下独立阅片的单个读片医生，而临床放射学通常涉及会诊、与既往影像的比较，以及获取临床情境——所有这些模型都没有。

教训不是模型是好是坏，而是**性能比较需要明确HITL设置**。一个优于独立冷读放射科医生的模型，可能仍然不如使用模型输出作为第二意见的放射科医生准确。这些是具有不同错误模式的不同系统，以不同方式聚合。
:::

:::{admonition} 医学中的软标签
:class: important

多个医疗AI项目已转向使用**软标签**，反映专家意见的分布而非单一"黄金标准"标签。一张由放射科医生小组标注为60%肺炎/40%肺不张的胸部X光，比强制进行的二元选择携带更多信息。在此类分布上训练的模型表现出更好的校准和更合适的不确定性量化——而这种不确定性在临床上是有意义的，因为它告诉临床医生何时应该会诊，而不仅仅是模型认为是什么。
:::

### 罕见病的主动学习

主动学习对罕见疾病和罕见病理尤其有价值，在这些情况下，即使是大型未标注样本池也只包含少量阳性病例。标准随机采样会浪费专家时间标注大部分阴性病例。

基于不确定性的主动学习自然地选择模型不确定的边界案例——对于罕见病，这些往往是阳性病例和边界阴性病例。这将专家时间集中在最有价值的地方。将类别不平衡训练（使用`class_weight='balanced'`或类似方法）与基于不确定性的选择相结合，是罕见病理检测任务的标准实践。

---

## 临床NLP标注

电子健康记录（EHR）包含大量临床叙述文本：医嘱、出院摘要、放射学报告、病理报告。从这些文本中提取结构化信息需要NLP——而高质量的NLP需要标注的训练数据。

**常见临床NLP标注任务：**
- **临床NER：** 识别文本中的药物、剂量、诊断、操作和症状
- **否定检测：** "无肺炎证据"与"确认肺炎"——一个关键区别，出人意料地困难
- **时序推理：** 区分当前状况与病史（"既往心肌梗死病史，以胸痛就诊"）
- **去标识化：** 删除受保护健康信息（PHI）以支持数据共享

**PHI去标识化**既是标注任务，也是数据治理要求。根据美国HIPAA和欧盟GDPR，健康数据在未删除或匿名化患者标识符的情况下不能共享。自动去标识化工具存在但并不完美；对自动化输出进行人工审查是标准实践，且风险状况是不对称的：假阴性（遗漏PHI）会造成法律风险，因此需要采用保守阈值。

### i2b2 / n2c2作为模板

i2b2（用于整合生物学与床旁实践的信息学）及其后续项目n2c2（国家NLP临床挑战赛）共享任务计划发布了一系列专家标注的临床NLP数据集。这些项目说明了潜力和成本：标注工作通常需要临床领域专家团队工作数月，每个挑战赛标注数百份文档。n2c2数据集之所以能够催生快速进展，正是因为它们解决了数据共享治理问题（去标识化+机构协议），而不仅仅是标注问题。

---

## 监管考量

医疗AI在大多数司法管辖区受到监管监督。

**FDA（美国）：** 基于AI/ML的医疗软件设备（SaMD）需要上市前审批或许可。FDA 2021年AI/ML行动计划强调**预定变更控制计划**——记录模型将如何更新以及在部署前如何验证这些更新。在此框架下，持续从临床反馈中学习的模型在每次更新后都是不同的设备，可能需要重新验证。

**CE认证（欧洲）：** 包括AI系统在内的医疗设备必须符合医疗器械法规（MDR）。MDR要求临床评估、上市后监督，以及对用于训练和验证的数据的文档化记录。

**关键HITL含义：** 监管框架要求清晰地记录标注流程、标注者资质、评分者间可靠性，以及对训练数据任何变更的记录。这不是官僚性的额外负担——它是允许临床医生了解什么训练数据产生了模型当前行为的审计追踪，且在法律上是必需的。将标注视为非正式子流程的HITL流程会带来监管风险，而这种风险通常在最糟糕的时机才变得可见。

---

## 科学数据标注

除医疗健康之外，HITL ML在科学研究中发挥着日益增长且未被充分认识的作用，在那里标注挑战往往将领域专业知识与规模要求相融合。

### 天文学：Galaxy Zoo

Galaxy Zoo {cite}`lintott2008galaxy` 将斯隆数字巡天中星系的形态分类众包给了公民科学家。原始项目从超过100,000名志愿者处收集了超过4,000万条分类，证明了当任务能够分解为不需要专业培训就能回答的简单问题时（"这个星系是光滑的还是有特征的？"），大规模众包科学图像分类是可行的。

Galaxy Zoo的经验产生了两个重要的方法论发现。首先，公民科学家与专业天文学家之间的一致性对清晰案例较高，对边界案例系统性地存在分歧——而恰恰是这些案例在科学上最重要。解决方案不是丢弃公民科学数据中的边界案例，而是将志愿者响应的分布视为编码了真实形态模糊性的软标签。其次，在Galaxy Zoo标签上训练的分类器优于在任何单一专家标签上训练的模型，因为人群分布捕捉了单个专家的强制选择所压缩的真实视觉不确定性。

### 基因组学：致病性分类

标注基因组变异——决定某个变异是致病性的、良性的还是意义不明的——是一个高风险的NLP和专家判断问题。临床变异数据库如ClinVar汇集了多个提交实验室的专家解释，实验室间的分歧很常见。主动学习被用来优先决定哪些变异需要完整的专家审查（文献检索、功能证据评估），哪些可以由现有证据自动分类。结果是一个混合流程，其中大多数变异由自动化逻辑处理，一部分需要专家审查，最困难的案例被标记以进行多实验室共识。

### 气候与地球科学

为土地利用变化、森林砍伐、冰川范围和风暴轨迹标注卫星图像，涉及遥感专家，以及日益增多的公民科学平台。该领域的主要HITL挑战是时间维度：今天做出的标签可能随着世界的变化而过时，而地面真相验证（实地调查）是昂贵且在后勤上受约束的。当模型预测与物理先验不一致时（例如，在已知受保护区域预测森林砍伐），优先处理这类图像的主动学习，是将有限的实地验证资源引导到最有价值之处的实践方式。

### 神经科学：连接组学

从电子显微镜图像重建神经回路——连接组学——需要对跨越庞大图像栈的神经元膜进行像素级标注。Eyewire项目将这一任务游戏化，吸引数万名玩家在3D图像体中追踪神经元。游戏化设计解决了一个特定的HITL问题：该任务需要在长时间会话中持续的注意力和空间推理，这会在传统标注中导致质量退化。将任务分解为具有社交机制的游戏片段，保持了专业标注无法实现的规模下的标注者参与度和质量。

---

## 管理专家标注者

当标注需要稀缺专业知识时，通常的众包方法（第13章）不适用。

**根本矛盾**在于，能够产生最高质量标注的人，也是时间最宝贵、最受约束的人。专家标注流程中的每个设计决策都应该针对这个问题进行评估：这是否充分利用了稀缺的专家时间？

**这在实践中意味着：**

- **积极地进行预标注。** 使用低层级标注者、自动化模型或基于规则的系统来生成候选结果，供专家审查和纠正，而非从头创建。专家的判断是瓶颈；给他们一个预标注结果来纠正，比让他们面对空白屏幕更快，前提是预标注质量足够高，使纠正不比从头开始更慢。

- **为专家注意力而非吞吐量设计。** 针对高吞吐量优化的标注界面（快速二元决策、键盘快捷键、最小化显示）适合众包。专家标注通常受益于更丰富的界面：与先前案例的并排比较、参考资料的便捷访问、标注置信度字段，以及标记案例以供讨论的能力。这些会减慢单个标注速度，但能提高质量并减少重新标注的需要。

- **明确追踪个体标注者模式。** 有了一小批专家，追踪每位标注者与小组的一致率、标记看似与其自身历史不一致的案例，并在定期校准会议上讨论，这是可行且重要的。这不是监视——它是临床医学用于绩效审查的相同质量流程，当被框架为共同质量改进而非评估时，专家通常反应良好。

- **会话设计很重要。** 医学标注在认知上是要求苛刻的。来自放射学和病理学的证据表明，连续阅片约90分钟后，错误率会明显增加，即使是几分钟的休息也能部分恢复注意力。强制执行休息提示（且无法忽略）的标注界面，是一个对质量产生真实影响的简单HITL设计决策。

---

## 医学影像HITL主动学习流程

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.datasets import make_classification
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

# Simulate a rare-pathology detection task
# 8% positive class (e.g., rare pathology)
X, y = make_classification(
    n_samples=5000, n_features=100,
    n_informative=20, n_redundant=10,
    weights=[0.92, 0.08],
    random_state=42
)
X_train, y_train = X[:4000], y[:4000]
X_test,  y_test  = X[4000:], y[4000:]

print(f"Training set positive prevalence: {y_train.mean():.1%}")

def run_medical_al(strategy, n_initial=50, budget=300):
    labeled = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled = [i for i in range(len(X_train)) if i not in labeled]
    aucs = []

    while len(labeled) < n_initial + budget:
        model = LogisticRegression(max_iter=500, class_weight='balanced')
        model.fit(X_train[labeled], y_train[labeled])

        if len(labeled) % 30 == 0:
            preds = model.predict_proba(X_test)[:, 1]
            aucs.append(roc_auc_score(y_test, preds))

        X_pool = X_train[unlabeled]
        if strategy == 'uncertainty' and len(labeled) >= 10:
            probs = model.predict_proba(X_pool)
            entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
            q = int(np.argmax(entropy))
        else:
            q = rng.integers(0, len(unlabeled))

        labeled.append(unlabeled.pop(q))

    return np.array(aucs)

aucs_al  = run_medical_al('uncertainty')
aucs_rnd = run_medical_al('random')
label_counts = np.arange(len(aucs_al)) * 30 + 50

plt.figure(figsize=(7, 4))
plt.plot(label_counts, aucs_al,  'o-',  color='#2b3a8f', linewidth=2, label='Uncertainty AL')
plt.plot(label_counts, aucs_rnd, 's--', color='#e05c5c', linewidth=2, label='Random baseline')
plt.xlabel("Expert labels obtained", fontsize=12)
plt.ylabel("AUROC", fontsize=12)
plt.title("Active Learning for Rare Pathology Detection", fontsize=13)
plt.legend(); plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('medical_al.png', dpi=150)
plt.show()

# Show how AL preferentially selects positive examples
# by checking which class the queried examples belong to
n_init = 50
labeled_al  = list(rng.choice(len(X_train), n_init, replace=False))
labeled_rnd = labeled_al.copy()
unlabeled_al  = [i for i in range(len(X_train)) if i not in labeled_al]
unlabeled_rnd = unlabeled_al.copy()

model = LogisticRegression(max_iter=500, class_weight='balanced')
model.fit(X_train[labeled_al], y_train[labeled_al])
probs = model.predict_proba(X_train[unlabeled_al])
entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
top50_al  = [unlabeled_al[i] for i in np.argsort(entropy)[-50:]]
top50_rnd = list(rng.choice(unlabeled_rnd, 50, replace=False))

pos_rate_al  = y_train[top50_al].mean()
pos_rate_rnd = y_train[top50_rnd].mean()
print(f"\nPositive rate in next 50 queries:")
print(f"  Uncertainty AL: {pos_rate_al:.1%}  (base rate: {y_train.mean():.1%})")
print(f"  Random:         {pos_rate_rnd:.1%}")
print(f"  AL queries {pos_rate_al/y_train.mean():.1f}x more positives than random")
```

```{seealso}
Galaxy Zoo众包：{cite}`lintott2008galaxy`。CheXNet放射科医生表现：{cite}`rajpurkar2017chexnet`。放射影像质量与AI辅助诊断：{cite}`yu2022assessing`。临床NLP标注方法论：{cite}`pustejovsky2012natural`。关于FDA AI/ML行动计划指导意见，请参阅FDA发布的相关文件（2021年）。
```
