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

# 交互式机器学习

主动学习提出了一个聚焦的问题：在给定预算的情况下，应该标注哪些样本？交互式机器学习（IML）提出了一个更宏观的问题：我们如何设计人类与学习系统之间的*整个交互过程*，使其在生产力、体验和正确性上都达到最优？

IML的特征在于人机反馈回路的**即时性**与**直接性**。传统机器学习中，人类移交数据并等待训练完成；IML使人类能够观察模型行为、提供反馈，并看到模型响应——通常在数秒内完成。

---

## 交互式机器学习的原则

Amershi等人 {cite}`amershi2014power` 确定了IML的三个定义性特征：

**1. 快速反馈：** 模型更新速度足够快，使人类能够感知其反馈的效果。在极限情况下，模型更新实时发生。

**2. 直接操控：** 人类通过数据或模型的预测结果与模型交互——而非通过配置文件或超参数调整。

**3. 迭代精化：** 这个过程是真正的迭代：人类的下一步行动由模型当前的行为来决定，而模型当前的行为是由人类之前的行动塑造的。

这创造了一个紧密的**协同适应回路**：人类和模型随时间推移相互响应而共同演变。人类学习模型的理解方式；模型学习人类关注的内容。

---

## 与主动学习的比较

IML和主动学习有很大重叠，但并不相同：

| 属性                     | 主动学习                       | 交互式机器学习                  |
|--------------------------|--------------------------------|----------------------------------|
| 核心问题                 | 标注什么？                     | 如何交互？                      |
| 反馈延迟                 | 可以是批处理（数天）           | 通常实时或近实时                |
| 模型更新频率             | 每轮（批处理）                 | 每次交互（在线）                |
| 人类主动性               | 回答模型的问题                 | 可以主动教模型                  |
| 界面设计                 | 次要考量                       | 核心考量                        |
| 人类认知负荷             | 未被明确建模                   | 被明确考虑                      |

在主动学习中，机器主导交互。在IML中，人类也可以主动——提供示例、纠正或对模型行为中任何看起来最有问题的方面进行反馈。

---

## 混合主动交互

**混合主动**系统允许人类和机器在不同时刻各自主导 {cite}`allen1999mixed`。纯机器主导的系统提问，人类回答。纯人类主导的系统让人类决定一切。混合主动系统在两者之间取得平衡。

在实践中，最好的IML系统结合了：
- **机器主动：** "我对这些样本不确定——你能为它们添加标签吗？"
- **人类主动：** "我注意到模型对这个类别始终预测错误——让我提供更多示例"
- **确认：** 模型呈现其当前理解；人类确认或纠正

良好的IML界面使模型的当前理解可见且可纠正。这是**可解释性**要求：人类只能引导他们至少能大致理解的模型。

---

## IML中的人类因素

IML将人类因素——认知负荷、疲劳、一致性和信任——直接带入学习回路。糟糕的IML设计会导致：

**标注疲劳：** 人类在会话延长时做出越来越快、越来越粗糙的决策。进入训练数据的错误。

**锚定偏差：** 人类过度依赖模型当前的建议。如果界面预先填写模型的预测，即使预测是错误的，标注者也不太可能纠正它——这是一种跨标注轮次累积的系统性标签噪声来源 {cite}`geva2019annotator`。预标注可以加快吞吐量 {cite}`lingren2014evaluating`，同时降低标注者发现模型错误的比率；在IML界面设计中，必须权衡这两种效应。

**信任错误校准：** 人类要么过度信任（接受错误的模型输出），要么信任不足（忽视正确的建议）。两种模式都会降低人机协作的价值。

**会话一致性：** 人类可能在不同时间对相同样本做出不同决策，特别是在长时间会话后。一致性检查（重新呈现早期样本）可以检测并纠正这一问题。

良好的IML设计通过界面选择来缓解这些问题：明确呈现模型置信度、随机化显示顺序、限制会话时长，以及建立一致性检查机制。

---

## 实践中的IML反馈类型

### 样本级反馈

人类为特定样本提供标签或纠正。这是最常见的形式，与监督学习直接兼容。

### 特征级反馈

人类指出哪些特征是相关或不相关的。"模型应该关注'紧急'和'截止日期'这两个词来识别这个类别。"这比样本级反馈更具表达力，对某些任务而言也更高效。

**TFIDF Interactive**等类似系统允许标注者高亮文本文档中的相关词语。这些高亮被转化为对模型注意力的约束或附加监督信号。

### 模型级反馈

人类直接纠正模型对一类输入的行为："每当输入包含[X]时，输出应该是[Y]。"这映射到后验正则化 {cite}`ganchev2010posterior` 或约束驱动学习等方法中的逻辑规则或约束。

---

## 案例研究：Google Teachable Machine

Teachable Machine是一个易于使用的基于Web的IML系统，允许非技术用户在浏览器中训练图像分类器。用户可以：

1. 使用网络摄像头录制每个类别的示例
2. 点击一次按钮即可训练模型（在浏览器中对MobileNet进行微调）
3. 立即查看模型对实时视频的预测结果
4. 为模型预测错误的类别添加更多示例

这说明了IML的核心循环：提供示例 → 观察模型 → 识别失败 → 提供更有针对性的示例。实时反馈（模型输出实时更新，在现代硬件上通常能达到交互式帧率）使协同适应回路具有即时的直观感。

---

## 实现一个简单的IML回路

```{code-cell} python
import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

class SimpleIMLSystem:
    """
    Minimal IML system that allows online feedback and displays
    model state after each annotation.
    """

    def __init__(self, n_features=10, n_classes=2):
        self.model = SGDClassifier(loss='log_loss', max_iter=1, warm_start=True,
                                   random_state=42)
        self.scaler = StandardScaler()
        self.X_seen = []
        self.y_seen = []
        self.n_classes = n_classes
        self.initialized = False

    def update(self, x, y_true):
        """Receive a single labeled example and update the model."""
        self.X_seen.append(x)
        self.y_seen.append(y_true)

        if len(self.X_seen) >= 2 * self.n_classes:
            X_arr = np.array(self.X_seen)
            y_arr = np.array(self.y_seen)
            X_scaled = self.scaler.fit_transform(X_arr)
            self.model.partial_fit(X_scaled[-1:], y_arr[-1:],
                                   classes=list(range(self.n_classes)))
            self.initialized = True

        return self

    def predict_with_confidence(self, x):
        """Predict label and return confidence."""
        if not self.initialized:
            return None, 0.0
        x_scaled = self.scaler.transform(x.reshape(1, -1))
        probs = self.model.predict_proba(x_scaled)[0]
        return self.model.predict(x_scaled)[0], probs.max()

    def current_accuracy(self, X_val, y_val):
        if not self.initialized:
            return None
        X_scaled = self.scaler.transform(X_val)
        return (self.model.predict(X_scaled) == y_val).mean()


# Simulate an IML session
rng = np.random.default_rng(42)
X_all, y_all = np.random.default_rng(0).random((500, 10)), np.random.default_rng(0).integers(0,2,500)
X_val, y_val = X_all[400:], y_all[400:]

system = SimpleIMLSystem(n_features=10, n_classes=2)
accs, confidences = [], []

print("Step | Labels | Accuracy | Example confidence")
print("-" * 50)

for step in range(100):
    x, y = X_all[step], y_all[step]
    pred, conf = system.predict_with_confidence(x)
    system.update(x, y)

    if (step + 1) % 10 == 0:
        acc = system.current_accuracy(X_val, y_val)
        if acc is not None:
            accs.append(acc)
            print(f"  {step+1:3d} |  {step+1:4d}  |  {acc:.3f}   | {conf:.3f}")
```

---

## 祖母测试

评估IML界面设计——以及更广泛地评估HITL系统设计——的一个有用启发式方法，是我们在此称之为**祖母测试**的方法（这是在本手册中作为设计约束首次提出的原创概念，而非对已有文献的引用）：

> *一位出生于1930年的女性应能通过语音使用这个设备，在遇到困难时，能够优雅地切换到键盘或文本界面。*

这个测试的主要目的不是可访问性，尽管它也包含这层含义。它是关于**为阻力而设计**。如果一个系统需要用户对神经网络、训练循环或概率分布有心智模型才能有效使用，那么它就没有通过祖母测试。回路中的人类应该能够在不理解回路机器端的情况下参与其中。

这对IML设计的含义是具体的：

**语音优先的回退：** 主要交互模式应该是自然语言或手势——而非参数滑块或置信度阈值。专家可能需要滑块；但每个人都应该能够说"那是错的"。

**优雅降级：** 当用户的首选模式失败或令其沮丧时，系统应提供替代方案——而非空白屏幕或错误消息。界面是学习系统的一部分；无法交互的用户无法教导系统。

**可读的模型状态：** 模型的当前理解应该以人类可理解的术语呈现。不是"置信度：0.73"，而是"我相当确定这是[X]，但我见过类似这样的例子两面都有。"不确定性应该以邀请纠正的语言来表达。

**对模糊性的容忍：** 一位93岁的用户和一位23岁的机器学习工程师会以不同的方式与同一系统互动。祖母测试问的是系统是否能容纳两者——不是通过检测用户年龄，而是通过设计能在各种专业水平和舒适程度下都有效的交互。

随着机器学习系统从研究工具走向日常基础设施，这个测试变得尤为重要。放射科医生使用的医学影像助手、办事员使用的法律文档分类器、教师使用的教育反馈系统——每一个都涉及并未自愿成为AI训练师的回路中的人类。为他们而设计不是让步；这才是重点所在。

:::{admonition} 设计原则
:class: tip
祖母测试是一种设计约束，而非目标受众。通过这个测试的系统对用户多样性更具鲁棒性，对专业知识差距更具包容性，对其期望于人类回路参与者的要求也更为诚实。如果一个系统在使用前需要解释，那么它就是在要求人类额外付出。这种付出应该以相称的收益来证明其正当性。
:::

---

## IML与基础模型

现代IML越来越多地将**预训练基础模型** {cite}`bommasani2021opportunities` 作为基础。用户不再从头开始训练，而是通过少量交互示例对大型预训练模型进行微调。这可以大幅减少达到有用性能所需的样本数——在有利情况下，可能只需要5至50个示例而非数千个，这取决于预训练表示与目标任务的匹配程度 {cite}`bommasani2021opportunities`。

实现这一点的技术包括：
- **少样本提示：** 在大型语言模型的上下文窗口中提供示例
- **适配器微调：** 更新小型适配器模块，同时冻结基础模型
- **参数高效微调（PEFT）：** LoRA、前缀调整（prefix tuning）及类似方法，允许快速、低资源的更新

基础模型改变了IML的动态：人类不再是从零开始教一个空白模型，而是*引导*一个已经知晓大量知识的模型。挑战从"如何提供足够的示例"转变为"如何精确指定我们希望与模型已有行为不同的地方"。

```{seealso}
{cite}`amershi2014power` 的综述仍是IML原则最佳概述。关于混合主动系统，请参见 {cite}`allen1999mixed`。关于标注中的锚定效应，请参见 {cite}`geva2019annotator` 和 {cite}`lingren2014evaluating`。
```
