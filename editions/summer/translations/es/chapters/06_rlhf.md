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

# Aprendizaje por Refuerzo a partir de Retroalimentación Humana

Ninguna técnica ha hecho más por llevar el HITL ML al ámbito general que el Aprendizaje por Refuerzo a partir de Retroalimentación Humana (RLHF). Es el mecanismo que sustenta InstructGPT {cite}`ouyang2022training` y un componente central de las tuberías de seguimiento de instrucciones en muchos grandes modelos de lenguaje modernos {cite}`stiennon2020learning`. Comprender RLHF —no solo como una receta a seguir, sino como un enfoque fundamentado para la alineación— es esencial para cualquiera que trabaje en la IA moderna.

---

## El Problema de la Alineación

Los grandes modelos de lenguaje (LLMs) entrenados puramente mediante predicción del siguiente token optimizan un objetivo proxy: predecir qué texto viene a continuación en un corpus de texto escrito por humanos. Este objetivo está relacionado, pero es distinto de, lo que realmente queremos: respuestas que sean útiles, precisas, seguras y alineadas con los valores humanos.

La discrepancia entre el objetivo de entrenamiento y el comportamiento deseado se denomina el **problema de alineación** {cite}`russell2019human`. Concretamente, un modelo de lenguaje entrenado en texto de internet aprende a:
- Producir continuaciones que suenen plausibles (que pueden ser factualmente incorrectas)
- Reflejar los sesgos y perjuicios presentes en los datos de entrenamiento
- Ser evasivo o manipulador cuando esto es lo que estadísticamente sigue al texto de entrada

RLHF aborda la alineación haciendo que las preferencias humanas sean *parte del objetivo de optimización*.

---

## La Tubería de RLHF

RLHF procede en tres etapas:

```text
Etapa 1: Ajuste Fino Supervisado (SFT)
  --> Recopilar datos de demostración (humano escribe respuestas ideales)
  --> Ajustar fino el LLM base con las demostraciones

Etapa 2: Entrenamiento del Modelo de Recompensa
  --> Recopilar preferencias por pares (humano puntúa A frente a B)
  --> Entrenar el modelo de recompensa R(x, y) para predecir preferencias humanas

Etapa 3: Ajuste Fino con RL
  --> Ajustar fino el LLM usando PPO/RL para maximizar R(x, y)
  --> La penalización KL evita la desviación excesiva del modelo SFT
```

### Etapa 1: Ajuste Fino Supervisado

Partiendo de un modelo base preentrenado $\pi_0$, recopilamos un conjunto de datos de pares (consulta, respuesta ideal), escritos o seleccionados por contratistas humanos que siguen directrices detalladas. El modelo se ajusta fino sobre estas demostraciones usando entropía cruzada estándar:

$$
\mathcal{L}_\text{SFT}(\theta) = -\mathbb{E}_{(x, y) \sim \mathcal{D}_\text{demo}} \left[ \log \pi_\theta(y \mid x) \right]
$$

El modelo SFT $\pi_\text{SFT}$ es un punto de partida mucho mejor para RLHF que el modelo preentrenado en bruto.

### Etapa 2: Entrenamiento del Modelo de Recompensa

Para un conjunto de consultas $\{x_i\}$, generamos $K$ respuestas por consulta usando $\pi_\text{SFT}$ y las presentamos a los anotadores humanos como comparaciones por pares: "¿Cuál respuesta es mejor, A o B?"

El modelo de recompensa $r_\phi$ se entrena para predecir estas preferencias. Bajo el modelo **Bradley-Terry** (Capítulo 8), la probabilidad de que la respuesta $y_w$ sea preferida a $y_l$ es:

$$
P(y_w \succ y_l \mid x) = \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right)
$$

El modelo de recompensa se entrena para minimizar la pérdida de clasificación por pares:

$$
\mathcal{L}_\text{RM}(\phi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}_\text{pref}} \left[ \log \sigma\left(r_\phi(x, y_w) - r_\phi(x, y_l)\right) \right]
$$

El modelo de recompensa se inicializa típicamente desde el modelo SFT con una cabeza escalar que reemplaza la capa final.

### Etapa 3: Ajuste Fino con RL mediante PPO

Con un modelo de recompensa entrenado, podemos usar el aprendizaje por refuerzo para ajustar fino el LLM. Cada consulta $x$ es un estado; cada respuesta $y$ es una trayectoria de elecciones de tokens; y la recompensa es $r_\phi(x, y)$.

El objetivo de optimización incluye una **penalización por divergencia KL** para evitar que el modelo se desvíe demasiado del modelo SFT base (lo que llevaría a la evasión de la recompensa {cite}`krakovna2020specification,gao2023scaling`):

$$
\max_\theta \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta(\cdot | x)} \left[ r_\phi(x, y) - \beta \cdot \text{KL}\left[\pi_\theta(\cdot \mid x) \| \pi_\text{SFT}(\cdot \mid x)\right] \right]
$$

El parámetro $\beta$ controla la intensidad de la penalización KL. Un $\beta$ pequeño permite más optimización pero arriesga la evasión de la recompensa; un $\beta$ grande mantiene el modelo cerca del SFT pero limita las ganancias de alineación.

La **Optimización de Política Proximal (PPO)** {cite}`schulman2017proximal` es el algoritmo estándar para esta etapa, elegido por su estabilidad en relación con los métodos de gradiente de política en bruto.

---

## Una Demostración Simplificada de RLHF

La tubería completa de RLHF requiere infraestructura a gran escala. El siguiente ejemplo demuestra las ideas clave a pequeña escala.

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.nn import functional as F

torch.manual_seed(42)
rng = np.random.default_rng(42)

# -----------------------------------------------
# Toy setup: responses are 4-dimensional vectors
# "Quality" is known analytically (sum of positive values)
# We simulate a reward model learning this from pairwise feedback
# -----------------------------------------------

class RewardModel(nn.Module):
    def __init__(self, d=4, hidden=32):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(d, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden), nn.ReLU(),
            nn.Linear(hidden, 1)
        )
    def forward(self, x):
        return self.net(x).squeeze(-1)

def true_quality(x):
    """The hidden ground-truth reward function."""
    return x.sum(dim=-1) + 0.5 * (x ** 2).mean(dim=-1)

# Generate pairwise preference data
N_PAIRS = 500
X1 = torch.randn(N_PAIRS, 4)
X2 = torch.randn(N_PAIRS, 4)
q1, q2 = true_quality(X1), true_quality(X2)
# Human prefers X1 when q1 > q2 (with some noise)
noise = torch.randn(N_PAIRS) * 0.5
preferred_1 = ((q1 - q2 + noise) > 0).float()

# Train reward model
rm = RewardModel(d=4, hidden=32)
optimizer = optim.Adam(rm.parameters(), lr=3e-3)

losses = []
for epoch in range(200):
    r1 = rm(X1)
    r2 = rm(X2)
    # Bradley-Terry loss
    logit = r1 - r2
    loss = F.binary_cross_entropy_with_logits(logit, preferred_1)
    optimizer.zero_grad(); loss.backward(); optimizer.step()
    losses.append(loss.item())

# Evaluate: does the reward model agree with true quality?
X_eval = torch.randn(1000, 4)
with torch.no_grad():
    r_pred = rm(X_eval).numpy()
    r_true = true_quality(X_eval).numpy()

corr = np.corrcoef(r_pred, r_true)[0, 1]
print(f"Reward model correlation with true quality: {corr:.4f}")
print(f"Final training loss: {losses[-1]:.4f}")

import matplotlib.pyplot as plt
plt.figure(figsize=(8, 3))
plt.subplot(1, 2, 1)
plt.plot(losses, color='#2b3a8f', linewidth=1.5)
plt.xlabel("Epoch"); plt.ylabel("Pairwise loss")
plt.title("Reward Model Training")

plt.subplot(1, 2, 2)
plt.scatter(r_true[:200], r_pred[:200], alpha=0.4, s=15, color='#2b3a8f')
plt.xlabel("True quality"); plt.ylabel("Predicted reward")
plt.title(f"Reward Model vs. Truth (r={corr:.3f})")
plt.tight_layout()
plt.savefig('reward_model.png', dpi=150)
plt.show()
```

---

## Desafíos en RLHF

### Evasión de la Recompensa

Un modo de fallo clave: la política encuentra formas de obtener alta recompensa del modelo de recompensa que no corresponden a un comportamiento genuinamente bueno. Por ejemplo, un LLM puede aprender a producir respuestas que son halagadoras o suenan confiadas (que los anotadores tienden a calificar favorablemente) en lugar de precisas.

La evasión de la recompensa es más probable cuando:
- El modelo de recompensa se entrena con datos de preferencias insuficientes
- Se permite que la política se desvíe mucho del modelo SFT base ($\beta$ pequeño)
- La distribución del modelo de recompensa cambia durante el entrenamiento con PPO

**Estrategias de mitigación:** Penalización KL, entrenamiento iterativo del modelo de recompensa, evaluación diversa, restricciones de IA constitucional.

### Sesgo del Evaluador

Los anotadores humanos tienen sesgos sistemáticos. Tienden a preferir respuestas más largas (sesgo de verbosidad), texto que suena más confiado (sesgo de confianza) y respuestas que coinciden con sus creencias previas. Estos sesgos se propagan al modelo de recompensa.

El conocido fallo de servilismo de los modelos RLHF —donde el modelo le dice a los usuarios lo que quieren escuchar en lugar de lo que es verdad— es en parte resultado de la preferencia de los evaluadores por las respuestas condescendientes.

### Supervisión Escalable

Para tareas complejas, los humanos no pueden juzgar de manera fiable cuál respuesta de la IA es correcta. Un anotador que compara dos demostraciones matemáticas largas o dos implementaciones de código puede simplemente escoger la más legible, independientemente de su corrección. La **supervisión escalable** es el problema de investigación abierto de diseñar procedimientos de evaluación que sigan siendo fiables a medida que aumenta la complejidad de la tarea {cite}`bowman2022measuring`.

---

## IA Constitucional (RLAIF)

La **IA Constitucional** {cite}`bai2022constitutional`, desarrollada en Anthropic, reduce la dependencia de los anotadores humanos usando la propia IA para generar etiquetas de preferencia guiadas por un conjunto de principios (una "constitución"). El proceso:

1. Generar respuestas a indicaciones potencialmente dañinas
2. Usar un crítico de IA para evaluar respuestas según los principios constitucionales
3. Revisar respuestas guiadas por retroalimentación de IA (RLAIF — RL a partir de Retroalimentación de IA)
4. Entrenar un modelo de recompensa sobre las preferencias generadas por IA
5. Ajustar fino con RLHF usando este modelo de recompensa

RLAIF puede generar datos de preferencia a una escala mucho mayor que el etiquetado humano, y permite un control preciso sobre los valores codificados en el modelo de recompensa.

```{seealso}
El artículo original de InstructGPT {cite}`ouyang2022training` describe la primera aplicación a gran escala de RLHF a los LLMs. El trabajo fundacional de RLHF para RL profundo es {cite}`christiano2017deep`. PPO se describe en {cite}`schulman2017proximal`. La IA Constitucional es de {cite}`bai2022constitutional`.
```
