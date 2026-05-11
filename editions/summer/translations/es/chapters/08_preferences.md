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

# Aprendizaje a partir de Comparaciones y Rankings

Pedirle a un humano que asigne una puntuación de calidad absoluta a una salida es difícil. ¿Cuál es la calidad numérica de este ensayo, en una escala del 1 al 10? La pregunta está mal planteada: los humanos carecen de una escala interna estable, y sus puntuaciones están fuertemente influidas por el anclaje, el contexto y la fatiga.

Pedirle a un humano que *compare* dos salidas es mucho más fácil: ¿cuál ensayo es mejor, A o B? Los juicios comparativos son más consistentes, más fiables y aprovechan las preferencias humanas de manera más directa que las valoraciones absolutas. Este capítulo cubre los fundamentos matemáticos y las aplicaciones prácticas del aprendizaje a partir de comparaciones y rankings.

---

## Por Qué las Comparaciones Son Mejores que las Valoraciones

### Fundamento Psicológico

La superioridad de los juicios comparativos tiene una larga historia en psicometría. La Ley del Juicio Comparativo de Thurstone {cite}`thurstone1927law` (1927) demostró que incluso cuando los humanos tienen juicios absolutos inconsistentes, sus juicios relativos siguen una ley probabilística consistente. Las comparaciones aprovechan el hecho de que los humanos son mucho mejores en la percepción *relativa* que en la calibración absoluta.

### Eficiencia Estadística

Cada comparación por pares proporciona información sobre las posiciones *relativas* de dos elementos en la escala de calidad. Con $K$ elementos, $K-1$ comparaciones pueden ordenar todos los elementos; solo se necesitan $O(\log K)$ comparaciones para encontrar el elemento superior. Las valoraciones absolutas suelen requerir más juicios para lograr la misma precisión.

### Escalabilidad

Para los modelos generativos, el número de salidas distintas es efectivamente infinito. Valorar una salida en términos absolutos requiere establecer una escala compartida en todas las salidas; comparar salidas requiere solo juicios locales y relativos que se calibran naturalmente entre sí.

---

## El Modelo de Bradley-Terry

El modelo probabilístico dominante para las comparaciones por pares es el **modelo de Bradley-Terry (BT)** {cite}`bradley1952rank`. Cada elemento $i$ tiene una puntuación de calidad latente $\alpha_i \in \mathbb{R}$. La probabilidad de que el elemento $i$ sea preferido al elemento $j$ en una comparación directa es:

$$
P(i \succ j) = \frac{e^{\alpha_i}}{e^{\alpha_i} + e^{\alpha_j}} = \sigma(\alpha_i - \alpha_j)
$$

donde $\sigma$ es la función sigmoide logística. Esto equivale a asumir que la calidad percibida del elemento $i$ es $\alpha_i + \epsilon$ donde $\epsilon$ es un término de ruido logístico estándar.

### Identificabilidad

El modelo BT es identificable salvo una traslación: si $\alpha$ es una solución, también lo es $\alpha + c$ para cualquier constante $c$. La convención estándar es fijar una puntuación (por ejemplo, $\alpha_0 = 0$) o restringir $\sum_i \alpha_i = 0$. Las puntuaciones solo se identifican cuando el **grafo de comparaciones** (nodos = elementos, aristas = pares observados) está **conectado** —si el grafo tiene componentes desconectados, las puntuaciones relativas entre componentes no están definidas.

### Estimación de Parámetros

Dado un conjunto de datos de comparaciones por pares $\mathcal{D} = \{(i, j, y_{ij})\}$ donde $y_{ij} = 1$ si $i$ fue preferido a $j$, el log-verosimilitud es:

$$
\mathcal{L}(\alpha) = \sum_{(i, j, y_{ij}) \in \mathcal{D}} \left[ y_{ij} \log \sigma(\alpha_i - \alpha_j) + (1 - y_{ij}) \log \sigma(\alpha_j - \alpha_i) \right]
$$

Esta es una función cóncava de $\alpha$ y puede maximizarse mediante ascenso de gradiente o el método de Newton.

```{code-cell} python
import numpy as np
from scipy.optimize import minimize
from scipy.special import expit  # sigmoid

rng = np.random.default_rng(42)

# -----------------------------------------------
# Simulate Bradley-Terry: 8 items with true quality scores
# Generate pairwise comparisons and recover the scores
# -----------------------------------------------

N_ITEMS = 8
true_alpha = rng.normal(0, 1, N_ITEMS)
print(f"True quality ranking: {np.argsort(true_alpha)[::-1]}")

# Generate comparisons: every pair compared 5 times
comparisons = []
for i in range(N_ITEMS):
    for j in range(i + 1, N_ITEMS):
        for _ in range(5):
            p_i_wins = expit(true_alpha[i] - true_alpha[j])
            winner = i if rng.random() < p_i_wins else j
            loser  = j if winner == i else i
            comparisons.append((winner, loser))

print(f"Total comparisons: {len(comparisons)}")

def neg_log_likelihood(alpha, comparisons):
    """Bradley-Terry negative log-likelihood."""
    alpha = np.array(alpha)
    loss = 0.0
    for winner, loser in comparisons:
        log_prob = np.log(expit(alpha[winner] - alpha[loser]) + 1e-10)
        loss -= log_prob
    return loss

def neg_grad(alpha, comparisons):
    alpha = np.array(alpha)
    grad = np.zeros(len(alpha))
    for winner, loser in comparisons:
        p = expit(alpha[winner] - alpha[loser])
        grad[winner] -= (1 - p)
        grad[loser]  -= (-p)
    return grad

# Fix alpha[0] = 0 to resolve scale ambiguity
result = minimize(
    lambda a: neg_log_likelihood(np.concatenate([[0.0], a]), comparisons),
    x0=np.zeros(N_ITEMS - 1),
    jac=lambda a: neg_grad(np.concatenate([[0.0], a]), comparisons)[1:],
    method='L-BFGS-B'
)
est_alpha = np.concatenate([[0.0], result.x])

# Compare true vs estimated ranking
true_rank = np.argsort(true_alpha)[::-1]
est_rank  = np.argsort(est_alpha)[::-1]

print(f"\nTrue ranking (item indices): {true_rank}")
print(f"Estimated ranking:           {est_rank}")
rank_corr = np.corrcoef(true_alpha, est_alpha)[0, 1]
print(f"Correlation with true scores: {rank_corr:.4f}")
```

---

## El Modelo de Thurstone

El modelo de Thurstone {cite}`thurstone1927law` está estrechamente relacionado con Bradley-Terry pero utiliza ruido gaussiano en lugar de logístico:

$$
P(i \succ j) = \Phi\left(\frac{\alpha_i - \alpha_j}{\sqrt{2}\sigma}\right)
$$

donde $\Phi$ es la función de distribución acumulada normal estándar. Cuando $\sigma = 1/\sqrt{2}$, esto se vuelve equivalente a BT con una pequeña diferencia de escala. En la práctica, los dos modelos dan resultados casi idénticos.

---

## Agregación de Rankings

Cuando cada anotador proporciona un ranking completo de $K$ elementos (en lugar de comparaciones por pares), el problema es la **agregación de rankings**: combinar múltiples listas ordenadas en un ranking de consenso.

**Conteo de Borda:** Cada elemento recibe una puntuación igual al número de elementos clasificados por debajo de él en el ranking de cada anotador. Las puntuaciones se suman entre anotadores. Sencillo y robusto.

**Kemeny–Young:** Encontrar el ranking que minimiza la suma de desacuerdos por pares (la distancia tau de Kendall) con el ranking de cada anotador. Es NP-difícil para $K$ grande pero tratable para conjuntos pequeños.

**RankNet / ListNet:** Enfoques neurales que aprenden una función de puntuación a partir de listas ordenadas, permitiendo la generalización a elementos no vistos.

---

## Bandidos Duelos

En el aprendizaje de preferencias **en línea**, los elementos llegan en flujo continuo y debemos decidir qué pares comparar, equilibrando la exploración (aprender sobre elementos desconocidos) y la explotación (presentar elementos de alta calidad). Este es el problema del **bandido duelo** {cite}`yue2009interactively`.

Algoritmos clave:
- **Doubler:** Mantiene un elemento campeón; lo desafía con competidores aleatorios
- **RUCB (Límite de Confianza Superior Relativo):** Calcula intervalos de confianza estilo UCB para la probabilidad de cada elemento de vencer a cada otro elemento
- **MergeRank:** Combina comparación estilo torneo con UCB

Los bandidos duelos se utilizan en sistemas de recomendación en línea (qué artículo mostrar a continuación, dado el retroalimentación implícita) y en la obtención interactiva de preferencias para la recopilación de datos de RLHF.

---

## Aprendizaje de Preferencias para Modelos de Lenguaje

En el contexto de RLHF (Capítulo 6), el modelo de Bradley-Terry se utiliza para entrenar el modelo de recompensa. Una variante importante es la **Optimización Directa de Preferencias (DPO)** {cite}`rafailov2023direct`, que muestra que el objetivo de RLHF puede optimizarse directamente a partir de datos de preferencia sin entrenar un modelo de recompensa separado:

$$
\mathcal{L}_\text{DPO}(\theta) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_\text{ref}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_\text{ref}(y_l \mid x)} \right) \right]
$$

DPO es más simple que el RLHF completo (sin bucle de entrenamiento PPO, sin modelo de recompensa) y logra resultados comparables o mejores en muchos benchmarks {cite}`rafailov2023direct`. Se ha convertido en una alternativa ampliamente adoptada al RLHF basado en PPO para el ajuste fino del seguimiento de instrucciones, aunque ambos enfoques siguen en uso activo y sus fortalezas relativas dependen de la tarea.

---

## Recopilación de Datos de Preferencia de Alta Calidad

La calidad de los datos de preferencia determina la calidad del modelo de recompensa. Consideraciones clave:

**Diversidad de consultas.** Los datos de preferencia deben cubrir la distribución completa de consultas que el modelo encontrará en el despliegue. Las lagunas en la cobertura llevan a un comportamiento poco fiable del modelo de recompensa en esas regiones.

**Diversidad de respuestas.** Comparar dos respuestas muy similares proporciona poca información. Las respuestas comparadas deben diferir lo suficiente para que los anotadores tengan una preferencia clara.

**Concordancia entre anotadores.** Una baja concordancia entre anotadores sugiere que los criterios de comparación son ambiguos. Medir la concordancia (κ de Cohen) y revisar las directrices cuando esté por debajo de los umbrales aceptables.

**Calibración.** Los anotadores deben entender *por qué* una respuesta es mejor: utilidad, precisión, seguridad, estilo. Las tareas que agrupan múltiples criterios tienden a producir preferencias inconsistentes. A menudo es mejor recopilar preferencias sobre cada criterio por separado.

```{seealso}
Modelo de Bradley-Terry: {cite}`bradley1952rank`. Thurstone: {cite}`thurstone1927law`. Bandidos duelos: {cite}`yue2009interactively`. Optimización Directa de Preferencias (DPO): {cite}`rafailov2023direct`.
```
