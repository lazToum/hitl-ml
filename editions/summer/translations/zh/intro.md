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

# 人在回路机器学习
## *被误解的*

```{epigraph}
没有必要写一篇题为"人在回路机器学习"的博士论文。
或者不如说——太有必要了，只是从未有人写过。
这不是那篇博士论文。它是取而代之的这部作品。
```

---

本手册是一部全面、可执行且刻意去学术化的**人在回路机器学习（HITL ML）**指南——这门学科致力于设计这样的系统：人类判断与机器智能不仅仅是共存，而是积极地相互重塑。

它至少在三个层面上被*误解*：

**这个领域被误解了。** 问大多数人机器学习是如何运作的，他们会描述一个在模型部署之时便告结束的过程。实际上，人类从未离开回路——只是被隐藏在了视野之外。每一个"自主"系统的背后，都有标注者、审核者、反馈收集者和工程师在做出判断。HITL ML让这一切变得可见且有意为之。

**人类的角色被误解了。** 回路中的人并非一个临时脚手架，不能在模型足够好之后就将其丢弃。人类判断正是定义何为"足够好"的信号。如果没有人类来决定什么是重要的，你就无法指定目标函数、奖励、标签模式或评估指标。机器负责优化；人类决定优化什么。

**你被误解了——我也是。** 你正在读一本关于嵌入系统之中的书。而在阅读它的同时，你正嵌入在一个系统之中。那个可能帮助生成本书部分文字的模型，是用人类反馈训练出来的。训练你所使用的模型的那些标注，是由姓名无处可查的人类提供的。从某种意义上说，我们都是身处某个比我们自身更宏大的事物的回路之中的人。

本书并不假装情况并非如此。它说出这些人类的名字，描述他们的劳动，并主张：理解他们与理解梯度下降同等重要。

:::{admonition} 中文版说明
:class: note
本版本为简体中文译本。英文原版为主要参考版本。
:::

---

## 本手册涵盖的内容

全书共十六章，分为六个部分，从基础一直讲到前沿：

**第一部分——基础。** 什么是HITL ML，它从何而来，以及如何思考人机交互模式的空间。

**第二部分——核心技术。** 标注与打标签、主动学习和交互式机器学习——HITL的三大经典支柱。

**第三部分——从人类反馈中学习。** 基于人类反馈的强化学习（RLHF）、从示范中学习，以及从比较与排序中进行的偏好学习——驱动现代AI对齐的诸范式。

**第四部分——应用。** 自然语言处理、计算机视觉与医疗健康——透过具有真实约束的真实领域来审视HITL。

**第五部分——系统与实践。** 标注平台、众包质量控制和评估框架——使HITL得以规模化运转的基础设施。

**第六部分——伦理与前景。** 数据背后的人类：公平性、标注者福祉、偏见，以及这一切将走向何方。

---

## 关于代码的说明

每个技术章节都包含可运行的Python代码。所有示例都是自包含的，并使用标准库：NumPy、scikit-learn、PyTorch、Hugging Face Transformers。

```{code-cell} python
# A taste of what's ahead: querying the most uncertain sample
import numpy as np
from sklearn.linear_model import LogisticRegression

rng = np.random.default_rng(42)
X = rng.normal(size=(100, 2))
y = (X[:, 0] + X[:, 1] > 0).astype(int)

model = LogisticRegression().fit(X[:20], y[:20])

probs = model.predict_proba(X[20:])
entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
most_uncertain = np.argmax(entropy) + 20

print(f"Most uncertain sample index: {most_uncertain}")
print(f"Predicted probabilities:     {probs[most_uncertain - 20].round(3)}")
print()
print("The model doesn't know. So we ask a human.")
```

---

## 符号约定

- $\mathcal{X}$ — 输入空间；$\mathcal{Y}$ — 标签空间
- $f_\theta : \mathcal{X} \to \mathcal{Y}$ — 参数为 $\theta$ 的模型
- $\mathcal{U}$ — 未标注样本池；$\mathcal{L}$ — 已标注数据集
- $h$ — 一位人类标注者；$\mathcal{H}$ — 标注者集合

---

*你是回路中的人。让我们开始吧。*
