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

# Evaluación y Métricas

Saber si su sistema HITL está funcionando requiere más que medir la precisión del modelo. Necesita saber si está obteniendo valor de su presupuesto de anotación, si el modelo está realmente mejor alineado con la intención humana, y si la retroalimentación humana adicional seguirá mejorando las cosas. Este capítulo cubre el panorama completo de la evaluación en los entornos HITL.

---

## Métricas Centradas en el Modelo

Las métricas estándar de aprendizaje automático se aplican directamente a los sistemas HITL, con algunos matices importantes.

### Métricas de Clasificación

La **exactitud** es apropiada cuando las clases están equilibradas y todos los errores tienen el mismo coste. En los entornos HITL, sin embargo, el conjunto de prueba etiquetado puede estar sesgado por la estrategia de consulta (el aprendizaje activo consulta ejemplos no aleatorios), lo que hace que las estimaciones de exactitud simple sean poco fiables.

La **puntuación F1** es la media armónica de la precisión y la recuperación, apropiada para clases desequilibradas. En los contextos HITL, tanto la precisión como la recuperación pueden importar de manera diferente según la asimetría de coste entre los falsos positivos y los falsos negativos.

**AUROC** mide la capacidad del modelo para discriminar entre clases independientemente del umbral —importante para las tareas sensibles a la calibración como el cribado médico.

La **calibración** mide qué tan bien se corresponden las probabilidades predichas con las frecuencias empíricas. En los sistemas HITL, los modelos entrenados en conjuntos etiquetados sesgados (del aprendizaje activo) pueden estar mal calibrados incluso cuando son precisos.

### Métricas de Modelos Generativos

Para los modelos de lenguaje y los sistemas generativos, la evaluación es fundamentalmente más difícil. Ninguna métrica automática única captura la calidad:

- **BLEU / ROUGE / METEOR:** Métricas basadas en referencias para traducción y resumen. Se correlacionan débilmente con los juicios de calidad humana para la generación de texto largo.
- **Perplejidad:** Mide qué tan bien el modelo predice el texto reservado. Es una condición necesaria pero no suficiente para la calidad.
- **BERTScore:** Similitud basada en representaciones respecto a las referencias. Mejor correlación con los juicios humanos que las métricas n-gram.
- **Evaluación humana:** El estándar de oro. Véase la Sección 14.3.

---

## Métricas de Eficiencia de la Anotación

La evaluación HITL también debe medir si la retroalimentación humana se está usando eficientemente.

### Curvas de Aprendizaje

Una **curva de aprendizaje** representa el rendimiento del modelo en función del número de ejemplos etiquetados. Una curva de aprendizaje empinada (mejora rápida con pocas etiquetas) indica que la estrategia de anotación está seleccionando ejemplos informativos. Una curva de aprendizaje plana indica que el etiquetado adicional está proporcionando rendimientos decrecientes.

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

### Análisis del Retorno de la Inversión (ROI)

El ROI de la retroalimentación humana responde: por cada etiqueta adicional, ¿cuánto mejora el rendimiento del modelo?

$$
\text{ROI}(n) = \frac{\Delta \text{rendimiento}(n)}{\text{coste por etiqueta}}
$$

A medida que el modelo madura (y se agotan los ejemplos fáciles de aprender), el ROI típicamente disminuye. La implicación práctica: los presupuestos de anotación deberían estar orientados hacia el inicio, con más etiquetas recopiladas en las etapas tempranas cuando el ROI es más alto.

---

## Evaluación Humana

Para los sistemas generativos y las tareas subjetivas, la evaluación humana sigue siendo el estándar de oro.

### Evaluación Directa (DA)

Los anotadores valoran las salidas en una escala absoluta (por ejemplo, 1–100 para la calidad de la traducción, o 1–5 para la utilidad de la respuesta). La DA se ha estandarizado en la evaluación de la traducción automática (benchmarks WMT).

**Mejores prácticas para DA:**
- Aleatorizar el orden de las salidas para evitar el anclaje
- Usar un número suficiente de anotadores por elemento (3–5 como mínimo)
- Incluir controles de calidad (ejemplos obviamente buenos y malos para detectar evaluadores desatentos)
- Informar de la concordancia entre anotadores junto con las puntuaciones agregadas

### Evaluación Comparativa

Los anotadores eligen entre dos salidas: "¿Cuál es mejor?" Los juicios comparativos son más rápidos y consistentes que las valoraciones absolutas (véase el Capítulo 8). Los **sistemas de clasificación ELO** (tomados del ajedrez) convierten los resultados de las comparaciones pairwise en una clasificación de calidad continua.

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

### Pruebas de Comportamiento (CheckList)

**CheckList** {cite}`ribeiro2020beyond` es una metodología para la evaluación sistemática del comportamiento de los modelos de PLN. En lugar de conjuntos de prueba aleatorios, diseña casos de prueba que sondean capacidades específicas:

- **Pruebas de Funcionalidad Mínima (MFT):** ¿Maneja el modelo los casos simples y obvios?
- **Pruebas de Invariancia (INV):** ¿Cambia la salida del modelo cuando no debería (por ejemplo, al parafrasear)?
- **Pruebas de Expectativa Direccional (DIR):** ¿Cambia la salida del modelo en la dirección esperada cuando cambia la entrada?

CheckList hace que la evaluación humana sea específica y accionable: en lugar de un único número de precisión, proporciona un perfil de capacidades.

---

## Medición de la Alineación con la Intención Humana

Para los sistemas RLHF, medir la alineación es un desafío de evaluación central.

**Evaluación del modelo de recompensa:** La precisión del modelo de recompensa en un conjunto de prueba de preferencias reservado. Ouyang et al. {cite}`ouyang2022training` reportan aproximadamente el 72% de precisión pairwise para el modelo de recompensa de InstructGPT; como referencia aproximada, las cifras en este rango se citan comúnmente para tuberías RLHF similares, aunque los resultados varían ampliamente según la tarea y la calidad de los datos.

**Tasa de victorias:** Dadas dos versiones del modelo (por ejemplo, la referencia SFT frente al ajuste fino RLHF), ¿qué fracción de respuestas gana el modelo RLHF en comparaciones pairwise humanas?

**GPT-4 como evaluador:** Usar un LLM capaz para evaluar respuestas se ha vuelto habitual para la iteración rápida. Gilardi et al. {cite}`gilardi2023chatgpt` y Zheng et al. {cite}`zheng2023judging` encuentran que la concordancia del evaluador LLM con el juicio humano oscila aproximadamente entre 0,7 y 0,9 dependiendo de la tarea —útil para la comparación A/B rápida, pero menos fiable para detectar el servilismo, los matices culturales o los problemas de seguridad.

**Detección del servilismo:** Medir si el modelo cambia sus respuestas según la preferencia implícita del usuario (por ejemplo, "Creo que X es correcto; ¿qué opina?"). Un modelo bien alineado no debería ser servil.

---

## Pruebas A/B en Sistemas Desplegados

Para los sistemas en producción, la evaluación definitiva son las **pruebas A/B**: dirigir una fracción de los usuarios a la nueva versión del modelo y medir los resultados posteriores.

Las pruebas A/B proporcionan una estimación insesgada de la calidad del modelo en el contexto de despliegue real, capturando efectos que la evaluación en laboratorio pasa por alto (comportamiento del usuario, distribución de la población, casos límite).

El desafío: las métricas posteriores apropiadas. Las métricas de compromiso (clics, duración de la sesión) pueden recompensar el comportamiento manipulador. Las tasas de finalización de tareas o las encuestas de satisfacción del usuario están mejor alineadas pero son más ruidosas.

```{seealso}
Pruebas de comportamiento CheckList: {cite}`ribeiro2020beyond`. Para la metodología de evaluación RLHF, véase {cite}`ouyang2022training`. Para las mejores prácticas de evaluación humana en traducción automática: {cite}`graham2015accurate`. Para la teoría de curvas de aprendizaje: {cite}`mukherjee2003estimating`.
```
