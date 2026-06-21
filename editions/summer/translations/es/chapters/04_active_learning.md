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

# Aprendizaje Activo

Los datos etiquetados son costosos. La idea central del aprendizaje activo es que *no todos los ejemplos no etiquetados son igualmente informativos*: un modelo puede mejorar más rápido si puede elegir sobre qué ejemplos preguntar. En lugar de etiquetar datos aleatoriamente, un sistema de aprendizaje activo consulta a un oráculo (generalmente un anotador humano) sobre los ejemplos más propensos a mejorar el modelo.

Este capítulo cubre la teoría y la práctica del aprendizaje activo: estrategias de consulta, marcos de muestreo, criterios de parada y consideraciones prácticas para despliegues reales.

---

## La Configuración del Aprendizaje Activo

La configuración estándar de **aprendizaje activo basado en agrupamiento** involucra:

- Un **conjunto etiquetado** $\mathcal{L} = \{(x_i, y_i)\}_{i=1}^n$ — inicialmente pequeño
- Un **grupo no etiquetado** $\mathcal{U} = \{x_j\}_{j=1}^m$ — típicamente mucho más grande que $\mathcal{L}$
- Un **oráculo** $\mathcal{O}$ que puede devolver $y = \mathcal{O}(x)$ para cualquier $x$ consultado
- Una **estrategia de consulta** $\phi$ que selecciona la siguiente consulta $x^* = \phi(\mathcal{L}, \mathcal{U}, f_\theta)$

El bucle de aprendizaje activo:

```text
    1. Inicializar: L = conjunto semilla etiquetado pequeño, U = grupo no etiquetado
    2. Entrenar: f_θ ← entrenar(L)
    3. Consultar: x* = argmax φ(x; f_θ) sobre x ∈ U
    4. Etiquetar: y* = O(x*)
    5. Actualizar: L ← L ∪ {(x*, y*)}, U ← U \ {x*}
    → Repetir desde 2 hasta agotar el presupuesto
```

El objetivo es alcanzar la calidad objetivo del modelo usando el menor número posible de consultas al oráculo.

---

## Fundamentos Teóricos

Una pregunta natural es: ¿cuánto puede ayudar el aprendizaje activo? En el mejor caso, el aprendizaje activo puede lograr reducciones *exponenciales* en la complejidad de etiquetado —alcanzando un error $\epsilon$ con $O(\log(1/\epsilon))$ etiquetas en lugar de las $O(1/\epsilon)$ necesarias con el aprendizaje pasivo, al menos en entornos realizables con una buena estrategia de consulta {cite}`settles2009active`.

En la práctica, las garantías son más difíciles de obtener. El **aprendizaje activo agnóstico** {cite}`balcan2006agnostic` muestra que el ahorro de etiquetas es posible incluso cuando el concepto objetivo no está en la clase de hipótesis, pero los ahorros dependen fuertemente del coeficiente de desacuerdo —una medida de con qué rapidez se reduce el conjunto de hipótesis plausibles a medida que se acumulan los datos.

La implicación práctica clave: la ventaja del aprendizaje activo es mayor cuando la **frontera de decisión es simple y concentrada** (de modo que las consultas de incertidumbre eliminan rápidamente las hipótesis erróneas), y menor cuando la clase de hipótesis es grande o la frontera es compleja.

---

## Estrategias de Consulta

### Muestreo por Incertidumbre

La estrategia más sencilla y más ampliamente utilizada: consultar el ejemplo sobre el que el modelo tiene mayor *incertidumbre* {cite}`lewis1994sequential`.

La **menor confianza** consulta el ejemplo para el que el modelo es menos seguro en su predicción principal:

$$
x^* = \argmax_{x \in \mathcal{U}} \left(1 - P_\theta(\hat{y} \mid x)\right)
$$

El **muestreo por margen** considera la diferencia entre las dos probabilidades predichas más altas:

$$
x^* = \argmin_{x \in \mathcal{U}} \left(P_\theta(\hat{y}_1 \mid x) - P_\theta(\hat{y}_2 \mid x)\right)
$$

El **muestreo por entropía** utiliza la distribución predicha completa:

$$
x^* = \argmax_{x \in \mathcal{U}} \left( -\sum_{k=1}^K P_\theta(y_k \mid x) \log P_\theta(y_k \mid x) \right)
$$

El muestreo por entropía es el más fundamentado de los tres —considera todas las clases— y generalmente supera a los otros en problemas multiclase.

### Consulta por Comité (QbC)

Se entrena un **comité** de $C$ modelos (usando bagging, diferentes inicializaciones o diferentes arquitecturas). Se consulta el ejemplo sobre el que el comité más discrepa:

$$
x^* = \argmax_{x \in \mathcal{U}} \; \text{desacuerdo}(\{f_c(x)\}_{c=1}^C)
$$

El desacuerdo puede medirse como **entropía de votos** (entropía sobre los votos mayoritarios del comité) o **divergencia KL** respecto a la distribución de consenso.

QbC proporciona mejores estimaciones de incertidumbre que un solo modelo, pero requiere entrenar múltiples modelos, lo que es costoso computacionalmente.

### Cambio Esperado del Modelo

Se consulta el ejemplo que causaría el mayor cambio al modelo actual si se etiquetara. Para modelos basados en gradientes, esto corresponde al ejemplo con la mayor magnitud esperada del gradiente {cite}`settles2008analysis`:

$$
x^* = \argmax_{x \in \mathcal{U}} \sum_{y \in \mathcal{Y}} P_\theta(y \mid x) \left\| \nabla_\theta \mathcal{L}(f_\theta(x), y) \right\|
$$

Esta estrategia tiene una fuerte motivación teórica, pero requiere calcular gradientes para cada candidato, lo que la hace costosa para modelos grandes.

### Enfoques de Núcleo / Geométricos

Las estrategias basadas en incertidumbre pueden estar **sesgadas hacia los valores atípicos**: un ejemplo inusual puede ser muy incierto pero no representativo de la distribución de datos. Los métodos de núcleo abordan esto buscando una muestra diversa que cubra el espacio de características.

El algoritmo **k-centro codicioso** {cite}`sener2018active` encuentra el conjunto más pequeño de puntos tal que cada punto no etiquetado esté a distancia $\delta$ de al menos un punto consultado:

$$
x^* = \argmax_{x \in \mathcal{U}} \min_{x' \in \mathcal{L}} d(x, x')
$$

es decir, consultar el punto más alejado de cualquier punto actualmente etiquetado. Esto favorece un conjunto de anotaciones bien distribuido.

### BADGE

**Aprendizaje Activo por Lotes mediante Incrustaciones de Gradiente Diversas (BADGE)** {cite}`ash2020deep` combina incertidumbre y diversidad: selecciona un lote de ejemplos cuyas incrustaciones de gradiente (con respecto a la etiqueta predicha) son a la vez grandes en magnitud (inciertos) y diversas (cubriendo diferentes regiones del espacio de gradiente). Esta es una de las estrategias modernas más competitivas.

---

## Estimación de Incertidumbre para Modelos Profundos

Las estrategias anteriores suponen el acceso a salidas de probabilidad calibradas del modelo. Para modelos simples (regresión logística, clasificadores softmax), esto es sencillo. Para redes profundas, obtener estimaciones de incertidumbre fiables requiere técnica adicional.

### Dos Tipos de Incertidumbre

Siguiendo a Kendall y Gal {cite}`kendall2017uncertainties`, distinguimos:

**Incertidumbre aleatórica** (incertidumbre de los datos): ruido inherente en las observaciones que no puede reducirse recopilando más datos. Una imagen borrosa es aleatoricamente incierta —ninguna cantidad de datos de entrenamiento adicionales de la misma distribución hará al modelo más seguro al respecto.

**Incertidumbre epistémica** (incertidumbre del modelo): incertidumbre debida a datos de entrenamiento limitados o a un modelo que no ha visto ejemplos similares. La incertidumbre epistémica *puede* reducirse etiquetando más datos —y es, por tanto, la cantidad relevante para la selección de consultas en aprendizaje activo.

Para el aprendizaje activo, queremos consultar ejemplos con alta incertidumbre epistémica, no alta incertidumbre aleatórica. Consultar un ejemplo fundamentalmente ambiguo desperdicia el esfuerzo del oráculo: ninguna etiqueta que proporcionen será claramente correcta.

### Dropout de Monte Carlo

Un enfoque práctico para la estimación de incertidumbre epistémica en redes neuronales es el **Dropout MC** {cite}`gal2016dropout`: aplicar dropout en el momento de la inferencia y ejecutar $T$ pasadas hacia adelante. La varianza entre predicciones es una estimación de la incertidumbre epistémica.

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn

torch.manual_seed(42)
rng = np.random.default_rng(42)

class MCDropoutNet(nn.Module):
    def __init__(self, input_dim=20, hidden=64, output_dim=2, p_drop=0.3):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden), nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, hidden),    nn.ReLU(), nn.Dropout(p_drop),
            nn.Linear(hidden, output_dim)
        )

    def forward(self, x):
        return self.net(x)

def mc_uncertainty(model, x, T=30):
    """
    Run T stochastic forward passes with dropout active.
    Returns mean prediction and epistemic uncertainty (predictive variance).
    """
    model.train()  # keep dropout active during inference
    with torch.no_grad():
        preds = torch.stack([
            torch.softmax(model(x), dim=-1) for _ in range(T)
        ])  # shape: (T, N, C)
    mean_pred = preds.mean(0)
    # Epistemic uncertainty: mean of variances across passes
    epistemic = preds.var(0).sum(-1)
    # Aleatoric uncertainty: entropy of mean prediction
    aleatoric = -(mean_pred * (mean_pred + 1e-9).log()).sum(-1)
    return mean_pred, epistemic, aleatoric

# Quick demonstration
model = MCDropoutNet(input_dim=20, output_dim=2)
# In-distribution example (simulated)
x_familiar   = torch.randn(1, 20) * 0.5
# Out-of-distribution example (far from training distribution)
x_unfamiliar = torch.randn(1, 20) * 3.0

for name, x in [("In-distribution ", x_familiar), ("Out-of-distribution", x_unfamiliar)]:
    _, ep, al = mc_uncertainty(model, x)
    print(f"{name} | epistemic: {ep.item():.4f} | aleatoric: {al.item():.4f}")
```

En la red no entrenada anterior, ambos ejemplos muestran una incertidumbre similar. Tras el entrenamiento, el ejemplo fuera de la distribución mostrará mayor incertidumbre epistémica —el modelo no ha aprendido un mapeo fiable para entradas lejanas a la distribución de entrenamiento.

### Ensambles Profundos

Entrenar $M$ modelos inicializados independientemente y promediar sus predicciones proporciona una estimación de incertidumbre más sencilla y a menudo más fiable que el Dropout MC {cite}`lakshminarayanan2017simple`. El desacuerdo entre los miembros del ensamble es la señal de incertidumbre epistémica.

Para el aprendizaje activo a escala, tanto el Dropout MC como los ensambles profundos añaden una sobrecarga proporcional a $T$ o $M$ pasadas hacia adelante. En la práctica, $T = 10$–$30$ para Dropout MC o $M = 5$ miembros del ensamble suele ser suficiente para clasificar ejemplos por incertidumbre epistémica, incluso si los valores absolutos no están bien calibrados.

---

## Un Bucle Completo de Aprendizaje Activo

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from copy import deepcopy

rng = np.random.default_rng(42)

# Generate dataset
X, y = make_classification(
    n_samples=2000, n_features=20, n_informative=10,
    n_classes=3, n_clusters_per_class=1, random_state=42
)
X_train, y_train = X[:1500], y[:1500]
X_test,  y_test  = X[1500:], y[1500:]

def entropy_query(model, X_pool):
    """Return index of most uncertain sample (entropy)."""
    probs = model.predict_proba(X_pool)
    ent = -np.sum(probs * np.log(probs + 1e-9), axis=1)
    return np.argmax(ent)

def random_query(X_pool):
    """Random baseline."""
    return rng.integers(0, len(X_pool))

def run_active_learning(strategy='entropy', n_initial=30, n_queries=120, query_batch=5):
    labeled_idx = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled_idx = [i for i in range(len(X_train)) if i not in labeled_idx]
    accs = []

    for step in range(n_queries // query_batch):
        model = LogisticRegression(max_iter=500, C=1.0)
        model.fit(X_train[labeled_idx], y_train[labeled_idx])
        accs.append(accuracy_score(y_test, model.predict(X_test)))

        # Query
        X_pool = X_train[unlabeled_idx]
        for _ in range(query_batch):
            if strategy == 'entropy':
                q = entropy_query(model, X_pool)
            else:
                q = random_query(X_pool)
            labeled_idx.append(unlabeled_idx.pop(q))
            X_pool = X_train[unlabeled_idx]

    return np.array(accs)

labels_used = np.arange(1, 25) * 5 + 30  # label counts at each step

accs_active = run_active_learning(strategy='entropy')
accs_random = run_active_learning(strategy='random')

plt.figure(figsize=(8, 5))
plt.plot(labels_used, accs_active, 'o-', label='Entropy sampling', color='#2b3a8f', linewidth=2)
plt.plot(labels_used, accs_random, 's--', label='Random baseline',  color='#e05c5c', linewidth=2)
plt.xlabel("Number of labeled examples", fontsize=12)
plt.ylabel("Test accuracy", fontsize=12)
plt.title("Active Learning vs. Random Sampling", fontsize=13)
plt.legend(fontsize=11)
plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('active_learning_curve.png', dpi=150)
plt.show()

print(f"Active learning reaches {accs_active[-1]:.3f} accuracy")
print(f"Random sampling reaches {accs_random[-1]:.3f} accuracy")
print(f"Active learning saves ~{int((accs_random.tolist().index(min(accs_random, key=lambda a: abs(a-accs_active[-1]))) - len(accs_active) + 1) * 5)} labels to match random's final accuracy")
```

---

## El Problema del Arranque en Frío

El aprendizaje activo requiere un modelo entrenado para puntuar los puntos no etiquetados —pero al principio, no se tienen (o se tienen muy pocos) ejemplos etiquetados. Este es el **problema del arranque en frío**.

Soluciones prácticas:

1. **Inicialización aleatoria:** Etiquetar un pequeño conjunto semilla aleatorio (20–100 ejemplos) antes de comenzar el aprendizaje activo.
2. **Inicialización basada en agrupamiento:** Usar k-means sobre el grupo no etiquetado; etiquetar un ejemplo de cada clúster. Esto garantiza diversidad en el conjunto etiquetado inicial.
3. **Selección basada en incrustaciones:** Usar un codificador preentrenado para incrustar los ejemplos; seleccionar un subconjunto diverso mediante el enfoque de núcleo.

Para la mayoría de las tareas, unas pocas docenas de etiquetas semilla aleatorias suelen ser suficientes para iniciar el aprendizaje activo; el número exacto depende del equilibrio de clases, la dimensionalidad de las características y la complejidad del modelo.

---

## Aprendizaje Activo por Lotes

En la práctica, los anotadores trabajan por lotes —es ineficiente entrenar y desplegar un nuevo modelo después de cada etiqueta individual. El **aprendizaje activo por lotes** selecciona un conjunto de $b$ ejemplos para etiquetar simultáneamente.

Seleccionar ingenuamente los $b$ ejemplos más inciertos genera **redundancia**: los ejemplos muy inciertos tienden a agruparse (por ejemplo, ejemplos cerca de la frontera de decisión en la misma región). Las mejores estrategias por lotes optimizan tanto la incertidumbre *como* la diversidad dentro del lote.

Los **Procesos de Punto Determinantal (DPPs)** proporcionan una manera fundamentada de muestrear lotes diversos: definen una distribución sobre subconjuntos que penaliza los elementos similares. La probabilidad de un subconjunto $S$ bajo un DPP es proporcional a $\det(L_S)$, donde $L$ es una matriz de núcleo que codifica la similitud.

---

## Criterios de Parada

¿Cuándo debe detenerse el aprendizaje activo? Criterios comunes:

- **Presupuesto agotado:** El más simple —detenerse cuando se agota el presupuesto de anotación.
- **Meseta de rendimiento:** Detenerse cuando la exactitud del modelo en un conjunto de validación retenido no ha mejorado más de $\delta$ durante $k$ rondas consecutivas.
- **Umbral de confianza:** Detenerse cuando menos de cierta fracción de los ejemplos no etiquetados tienen una incertidumbre por encima de un umbral.
- **Reducción máxima de pérdida:** Estimar la ganancia máxima posible de etiquetas adicionales; detenerse cuando esta caiga por debajo de un umbral {cite}`bloodgood2009method`.

---

## Cuándo Funciona el Aprendizaje Activo (y Cuándo No)

El aprendizaje activo tiende a funcionar bien cuando:
- El etiquetado es costoso y el grupo no etiquetado es grande
- Los datos tienen una estructura clara que el modelo puede aprovechar para identificar ejemplos informativos
- La clase del modelo es apropiada para la tarea

El aprendizaje activo funciona mal cuando:
- El modelo inicial es muy deficiente (arranque en frío) y no puede clasificar ejemplos de manera significativa
- La estrategia de consulta selecciona valores atípicos o ejemplos mal etiquetados (importa la robustez al ruido)
- La distribución de datos cambia entre el grupo no etiquetado y la distribución de prueba

Una preocupación práctica clave es el **desajuste de distribución**: el aprendizaje activo tiende a consultar ejemplos cerca de la frontera de decisión, creando un conjunto etiquetado sesgado que puede no representar bien la distribución de prueba. Esto puede conducir a fronteras de decisión bien entrenadas pero con pobre calibración.

```{seealso}
La encuesta fundacional es {cite}`settles2009active`. Fundamentos teóricos (complejidad de etiquetado, límites agnósticos): {cite}`balcan2006agnostic`. Para el aprendizaje activo específico del aprendizaje profundo, véase {cite}`ash2020deep` (BADGE) y {cite}`sener2018active` (núcleo). Para una evaluación crítica de cuándo el aprendizaje activo realmente ayuda, véase {cite}`lowell2019practical`. Sobre la incertidumbre aleatórica frente a la epistémica en modelos profundos, véase {cite}`kendall2017uncertainties`; para los ensambles profundos como estimadores de incertidumbre, véase {cite}`lakshminarayanan2017simple`; para el Dropout MC como inferencia bayesiana aproximada, véase {cite}`gal2016dropout`.
```
