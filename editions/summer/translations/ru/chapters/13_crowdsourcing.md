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

# Краудсорсинг и контроль качества

Когда задачи аннотирования достаточно просты для выполнения неспециалистами, краудсорсинговые платформы обеспечивают доступ к большим аннотационным рабочим силам по низкой стоимости за элемент. Построение высококачественных размеченных датасетов из толпы требует тщательного проектирования задач, стратегической избыточности и строгого контроля качества.

---

## Краудсорсинговые платформы

**Amazon Mechanical Turk (MTurk)** — исходный краудсорсинговый рынок, запущенный в 2005 году. Работники («тёркеры») выполняют микрозадачи (HIT), размещённые заказчиками. Исследование 2018 года показало, что средняя эффективная почасовая оплата тёркеров составляет примерно $2 в час — значительно ниже минимальной заработной платы во многих странах с высоким уровнем дохода {cite}`hara2018data` — этический аспект, рассматриваемый в главе 15. MTurk наиболее подходит для простых задач с чёткими, верифицируемыми критериями.

**Prolific** — академическая краудсорсинговая платформа, устанавливающая минимальный стандарт оплаты (в настоящее время около £9 в час, по данным опубликованных руководящих принципов Prolific), проводящая скрининг участников по демографическим показателям и поддерживающая пул работников, добровольно участвующих в исследованиях. Предпочтительна для исследований в социальных науках и задач, требующих репрезентативности.

**Appen** (и аналогичные: Telus International, iMerit) предоставляет управляемые аннотационные рабочие силы с управлением качеством, используемые для более сложных задач и корпоративных проектов.

**Специализированные сообщества.** Для задач, специфичных для предметной области, сообщества энтузиастов могут обеспечить высококачественные аннотации: Galaxy Zoo для астрономии, eBird для видов птиц, Chess Tempo для аннотирования шахматных позиций.

---

## Проектирование задач для краудсорсинга

### Декомпозиция сложных задач

Сложные задачи следует разбивать на простые, хорошо определённые микрозадачи. Вместо того чтобы просить работников провести исчерпывающее аннотирование документа, задавайте им один сфокусированный вопрос: «Содержит ли это предложение имя человека?» или «Оцените ясность этого перевода по шкале от 1 до 5».

**Преимущества декомпозиции:**
- Меньшая когнитивная нагрузка на задачу → меньше усталости, выше качество
- Каждая микрозадача поддаётся отдельному контролю качества
- Проще аудировать и отлаживать

### Важность инструкций

Единственный наиболее значимый предиктор качества краудсорсинга — это качество инструкций. Хорошие инструкции к задаче:
- Объясняют *цель* задачи в одном предложении
- Дают чёткое, однозначное определение каждой категории
- Предоставляют 3–5 проработанных примеров (особенно пограничных случаев)
- Не длиннее, чем работники реально прочитают (< 300 слов для простых задач)

Проведите **пилотное исследование** (10–50 работников, 20–100 задач) перед масштабированием. Проанализируйте расхождения пилота; большинство из них указывают на неоднозначности в инструкциях, которые можно исправить.

### Вопросы золотого стандарта

Встраивайте **вопросы золотого стандарта** — задачи с известными правильными ответами — по всему батчу задач. Работники, не справляющиеся с вопросами золотого стандарта ниже порогового значения, исключаются из проекта.

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

## Статистические модели агрегирования меток

Голосование большинства является естественной базовой линией, однако игнорирует различия в точности аннотаторов. Статистические модели могут работать лучше.

### Модель Dawid–Skene

**Модель Dawid–Skene (DS)** {cite}`dawid1979maximum` совместно оценивает:
- **Истинную метку** $z_i$ для каждого элемента $i$
- **Матрицу ошибок** $\pi_j^{(k,l)}$ для каждого аннотатора $j$: вероятность того, что аннотатор $j$ разметит элемент с истинным классом $k$ как класс $l$

EM-алгоритм итерирует:
- **E-шаг:** Дав матрицы ошибок аннотаторов, вычислить апостериорную вероятность каждой истинной метки
- **M-шаг:** Дав оценки меток элементов, обновить матрицы ошибок аннотаторов

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

**MACE (Multi-Annotator Competence Estimation)** {cite}`hovy2013learning` — альтернативная вероятностная модель, явно представляющая спам аннотаторов (случайная разметка) и компетентное аннотирование. Аннотатор либо предоставляет значимую метку (с вероятностью $1 - \text{spam}_j$), либо случайную метку (с вероятностью $\text{spam}_j$). Эта двухкомпонентная модель нередко лучше калиброванна, чем Dawid–Skene в сценариях краудсорсинга, где некоторые аннотаторы являются чистыми спамерами.

---

## Избыточность и стратегия агрегирования

Оптимальное число аннотаторов на элемент зависит от сложности задачи и качества аннотаторов:

- **Простые задачи с квалифицированными аннотаторами:** 1–2 аннотатора на элемент нередко достаточно
- **Умеренные задачи с обученными аннотаторами:** 3 аннотатора + голосование большинства
- **Сложные/субъективные задачи с краудворкерами:** 5–7 аннотаторов + Dawid–Skene

Ключевой вывод: избыточность наиболее ценна при низкой точности аннотаторов. Для аннотаторов с точностью $p$, точность голосования большинства при $n$ аннотаторах составляет:

$$
P(\text{большинство правы}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

При $p = 0{,}70$ добавление третьего аннотатора повышает точность голосования большинства с 70% до 78%; при $p = 0{,}90$ прирост от третьего аннотатора незначителен (с 90% до 97%).

```{seealso}
Модель Dawid–Skene: {cite}`dawid1979maximum`. MACE: {cite}`hovy2013learning`. Исчерпывающий обзор краудсорсинга для NLP: {cite}`snow2008cheap`. Этика краудсорсинга и справедливая оплата: см. главу 15.
```
