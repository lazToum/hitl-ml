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

# Crowdsourcing y Control de Calidad

Cuando las tareas de anotación son suficientemente simples para que las realicen no especialistas, las plataformas de crowdsourcing ofrecen acceso a grandes fuerzas laborales de anotación a demanda y a bajo coste por elemento. Construir conjuntos de datos etiquetados de alta calidad a partir de multitudes requiere un diseño cuidadoso de las tareas, redundancia estratégica y un riguroso control de calidad.

---

## Plataformas de Crowdsourcing

**Amazon Mechanical Turk (MTurk)** es el mercado de crowdsourcing original, lanzado en 2005. Los trabajadores ("Turkers") completan micro-tareas (HITs) publicadas por solicitantes. Un estudio de 2018 encontró ingresos por hora efectivos medianos para los Turkers de aproximadamente $2/hora —muy por debajo del salario mínimo en muchos países de ingresos altos {cite}`hara2018data`— una preocupación ética abordada más adelante en el Capítulo 15. MTurk es más adecuado para tareas simples con criterios claros y verificables.

**Prolific** es una plataforma de crowdsourcing académico que impone un estándar de pago mínimo (actualmente alrededor de £9/hora, aproximadamente $11/hora, tal como se indica en las directrices publicadas de Prolific), selecciona participantes por demografía y mantiene un panel de trabajadores que han optado voluntariamente por participar en investigaciones. Preferida para investigaciones en ciencias sociales y tareas que requieren representatividad.

**Appen** (y similares: Telus International, iMerit) proporciona fuerzas laborales de anotación gestionadas con gestión de calidad, utilizadas para tareas de mayor complejidad y proyectos empresariales.

**Comunidades especializadas.** Para tareas específicas del dominio, las comunidades de entusiastas del dominio pueden proporcionar anotaciones de alta calidad: Galaxy Zoo para astronomía, eBird para especies de aves, Chess Tempo para la anotación de posiciones de ajedrez.

---

## Diseño de Tareas para el Crowdsourcing

### Descomponer las Tareas Complejas

Las tareas complejas deben descomponerse en micro-tareas simples y bien definidas. En lugar de pedir a los trabajadores que anoten exhaustivamente un documento, hágales una pregunta específica a la vez: "¿Contiene esta oración el nombre de una persona?" o "Valore la claridad de esta traducción en una escala del 1 al 5."

**Ventajas de la descomposición:**
- Menor demanda cognitiva por tarea → menos fatiga, mayor calidad
- Cada micro-tarea puede controlarse por calidad por separado
- Más fácil de auditar y depurar

### La Importancia de las Instrucciones

El predictor más importante de la calidad del crowdsourcing es la calidad de las instrucciones. Las buenas instrucciones de tarea:
- Explican el *propósito* de la tarea en una oración
- Dan una definición clara y sin ambigüedades de cada categoría
- Proporcionan 3–5 ejemplos trabajados (especialmente casos límite)
- No son más largas de lo que los trabajadores realmente leerán (< 300 palabras para tareas simples)

Realice un **estudio piloto** (10–50 trabajadores, 20–100 tareas) antes de escalar. Analice los desacuerdos del piloto; la mayoría apuntan a ambigüedades en las instrucciones que pueden corregirse.

### Preguntas de Estándar de Referencia

Incruste **preguntas de estándar de referencia** —tareas con respuestas correctas conocidas— a lo largo del lote de tareas. Los trabajadores que fallan las preguntas de referencia por debajo de un umbral se eliminan del proyecto.

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

## Modelos Estadísticos para la Agregación de Etiquetas

La votación mayoritaria es una referencia natural pero ignora las diferencias en la precisión de los anotadores. Los modelos estadísticos pueden hacerlo mejor.

### El Modelo de Dawid-Skene

El **modelo de Dawid-Skene (DS)** {cite}`dawid1979maximum` estima conjuntamente:
- La **etiqueta verdadera** $z_i$ para cada elemento $i$
- La **matriz de confusión** $\pi_j^{(k,l)}$ para cada anotador $j$: la probabilidad de que el anotador $j$ etiquete un elemento con clase verdadera $k$ como clase $l$

El algoritmo EM itera:
- **Paso E:** Dadas las matrices de confusión de los anotadores, calcular la probabilidad posterior de cada etiqueta verdadera
- **Paso M:** Dadas las estimaciones de etiquetas de los elementos, actualizar las matrices de confusión de los anotadores

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

**MACE (Estimación de Competencia Multi-Anotador)** {cite}`hovy2013learning` es un modelo probabilístico alternativo que representa explícitamente el comportamiento de spam de los anotadores (etiquetado aleatorio) frente a la anotación competente. Un anotador o bien proporciona una etiqueta significativa (con probabilidad $1 - \text{spam}_j$) o bien una etiqueta aleatoria (con probabilidad $\text{spam}_j$). Este modelo de dos componentes suele estar mejor calibrado que el de Dawid-Skene para los escenarios de crowdsourcing donde algunos anotadores son spammers puros.

---

## Redundancia y Estrategia de Agregación

El número óptimo de anotadores por elemento depende de la dificultad de la tarea y la calidad de los anotadores:

- **Tareas fáciles con anotadores cualificados:** 1–2 anotadores por elemento suele ser suficiente
- **Tareas moderadas con anotadores entrenados:** 3 anotadores + votación mayoritaria
- **Tareas difíciles/subjetivas con trabajadores de crowdsourcing:** 5–7 anotadores + Dawid-Skene

La clave: la redundancia es más valiosa cuando la precisión del anotador es baja. Para anotadores con precisión $p$, la precisión de la votación mayoritaria con $n$ anotadores es:

$$
P(\text{VM correcta}) = \sum_{k > n/2}^{n} \binom{n}{k} p^k (1-p)^{n-k}
$$

Para $p = 0{,}70$, añadir un tercer anotador aumenta la precisión de la votación mayoritaria del 70% al 78%; para $p = 0{,}90$, la ganancia de un tercer anotador es insignificante (del 90% al 97%).

```{seealso}
Modelo de Dawid-Skene: {cite}`dawid1979maximum`. MACE: {cite}`hovy2013learning`. Para una revisión exhaustiva del crowdsourcing para PLN: {cite}`snow2008cheap`. Ética del crowdsourcing y pago justo: véase el Capítulo 15.
```
