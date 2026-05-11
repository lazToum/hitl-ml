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

# Aprendizaje a partir de Demostraciones

Cuando una tarea es difícil de especificar pero fácil de demostrar, puede ser más eficiente enseñar mediante el ejemplo que definir mediante reglas. Un experto humano muestra a un brazo robótico cómo agarrar un objeto; las interacciones de un programador con su entorno de desarrollo integrado proporcionan una secuencia de ediciones correctas; un gran maestro de ajedrez disputa una partida. El **aprendizaje a partir de demostraciones** extrae una política de dichos datos de comportamiento, evitando la necesidad de funciones de recompensa artesanales o especificaciones explícitas de tareas.

---

## Clonación de Comportamiento

El enfoque más simple es la **clonación de comportamiento (BC)**: tratar la demostración como datos supervisados y aprender un mapeo de estados a acciones.

Dado un conjunto de datos de pares estado-acción $\mathcal{D} = \{(s_i, a_i)\}$ de un demostrador experto, ajustamos una política $\pi_\theta(a \mid s)$ minimizando la log-verosimilitud negativa:

$$
\mathcal{L}_\text{BC}(\theta) = -\frac{1}{|\mathcal{D}|} \sum_{(s, a) \in \mathcal{D}} \log \pi_\theta(a \mid s)
$$

Esto es precisamente el aprendizaje supervisado estándar aplicado a datos secuenciales.

### El Problema del Desplazamiento de Covariables

La BC tiene una debilidad fundamental: **el desplazamiento de distribución** entre el entrenamiento y el despliegue. Las demostraciones del experto cubren los estados visitados por el experto. Pero durante el despliegue, la política aprendida puede tomar decisiones ligeramente diferentes, llevándola a estados que el experto nunca visitó —estados donde la política no tiene supervisión y puede fallar gravemente.

De manera crucial, los errores se **acumulan**: una pequeña desviación lleva a un estado desconocido, donde una acción ligeramente equivocada lleva a un estado aún más desconocido, y así sucesivamente. El rendimiento se degrada como $O(T^2 \epsilon)$ donde $T$ es la longitud del episodio y $\epsilon$ es la tasa de error en cada paso —mucho peor que la degradación $O(T\epsilon)$ de una política oráculo {cite}`ross2010efficient`.

```{admonition} Ejemplo: Conducción Autónoma
:class: note

Un modelo de clonación de comportamiento para mantener el carril entrenado con datos de conducción humana funciona bien en carreteras rectas (estados cercanos a la distribución de entrenamiento). Pero en el momento en que se desvía ligeramente —un estado en el que ningún conductor humano estaría porque ya habría corregido— no tiene datos que lo guíen y puede salirse de la carretera.
```

```text
Algoritmo DAgger:
  Inicializar: D <- {} (conjunto de datos vacío)
  Entrenar política inicial pi_1 con M demostraciones del experto

  para iteración i = 1, 2, ..., N:
    1. Ejecutar pi_i en el entorno para recopilar estados {s_1, ..., s_t}
    2. Consultar al experto las acciones en cada estado visitado: a_t = pi*(s_t)
    3. Agregar: D <- D u {(s_1, a_1), ..., (s_t, a_t)}
    4. Entrenar pi_{i+1} por aprendizaje supervisado sobre D
```

DAgger logra un arrepentimiento $O(T\epsilon)$ —el mismo que una política oráculo— porque la distribución de entrenamiento converge para coincidir con la distribución de despliegue.

El requisito clave es que el experto pueda ser consultado en cualquier estado, incluidos los estados que el experto nunca visitaría naturalmente. Esto es factible en simulación (pedir al experto que corrija el robot desde una configuración inusual) pero puede ser difícil o inseguro en sistemas físicos reales.

---

## Aprendizaje por Refuerzo Inverso

A veces el comportamiento del experto se entiende mejor no como una secuencia de acciones a imitar, sino como el resultado de optimizar una función de recompensa desconocida. El **Aprendizaje por Refuerzo Inverso (IRL)** {cite}`ng2000algorithms` recupera esta función de recompensa latente a partir de las demostraciones.

Dadas las demostraciones $\tau = \{(s_1, a_1), \ldots, (s_T, a_T)\}$, el IRL encuentra una función de recompensa $R(s, a)$ tal que la política del experto sea óptima bajo $R$.

El atractivo del IRL sobre la BC: si recuperamos la verdadera función de recompensa, podemos re-optimizarla en nuevos entornos, con dinámicas diferentes, o con planificadores mejorados —generalizando mucho más allá de los escenarios demostrados.

### IRL de Máxima Entropía

El **IRL MaxEnt** {cite}`ziebart2008maximum` resuelve el problema de ambigüedad del IRL (existen muchas funciones de recompensa consistentes con cualquier conjunto de demostraciones) eligiendo la función de recompensa que, siendo consistente con el comportamiento demostrado, conduce a una distribución sobre trayectorias con *máxima entropía*. Las trayectorias se distribuyen como:

$$
P(\tau \mid R) \propto \exp\left(\sum_t R(s_t, a_t)\right)
$$

El objetivo de aprendizaje hace coincidir las expectativas de características observadas del experto $\mu_E = \mathbb{E}_{\tau \sim \pi^*}[\phi(\tau)]$ con las expectativas de características del modelo $\mu_\theta = \mathbb{E}_{\tau \sim \pi_\theta}[\phi(\tau)]$.

---

## GAIL: Aprendizaje por Imitación Adversarial Generativo

**GAIL** {cite}`ho2016generative` omite por completo el aprendizaje de la función de recompensa, usando una formulación similar a las GAN para hacer coincidir directamente la distribución estado-acción del experto.

Se entrena un discriminador $D_\psi$ para distinguir pares estado-acción del experto $(s, a) \sim \pi^*$ de pares estado-acción de la política $(s, a) \sim \pi_\theta$:

$$
\mathcal{L}_D = -\mathbb{E}_{\pi^*}[\log D_\psi(s,a)] - \mathbb{E}_{\pi_\theta}[\log(1 - D_\psi(s,a))]
$$

El generador (la política $\pi_\theta$) se entrena para engañar al discriminador —es decir, para producir pares estado-acción que parezcan del experto. La salida del discriminador $\log D_\psi(s,a)$ sirve como señal de recompensa para la política.

GAIL logra un rendimiento a nivel de experto en benchmarks de control continuo con muchas menos demostraciones que la BC, y generaliza mejor que el IRL MaxEnt en entornos complejos.

---

## Clonación de Comportamiento en PLN: Un Ejemplo Práctico

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

torch.manual_seed(42)

# -----------------------------------------------
# Toy NLP task: rewriting sentences to be more formal
# We simulate this as a simple sequence transformation
# In practice: fine-tuning a seq2seq model on expert rewrites
# -----------------------------------------------

class SimpleSeq2Seq(nn.Module):
    def __init__(self, vocab_size=100, embed_dim=32, hidden_dim=64):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.encoder = nn.GRU(embed_dim, hidden_dim, batch_first=True)
        self.decoder = nn.GRU(embed_dim, hidden_dim, batch_first=True)
        self.proj = nn.Linear(hidden_dim, vocab_size)
        self.hidden_dim = hidden_dim

    def forward(self, src, tgt):
        src_emb = self.embed(src)
        _, hidden = self.encoder(src_emb)
        tgt_emb = self.embed(tgt)
        out, _ = self.decoder(tgt_emb, hidden)
        return self.proj(out)

# Generate synthetic demonstration data
VOCAB = 100
rng = np.random.default_rng(42)
N, SEQ_LEN = 1000, 12

src_seqs = torch.tensor(rng.integers(1, VOCAB, (N, SEQ_LEN)), dtype=torch.long)
# "Expert" transformation: shift tokens by 1 (toy formalization)
tgt_seqs = torch.clamp(src_seqs + 1, 1, VOCAB - 1)
tgt_in  = torch.cat([torch.ones(N, 1, dtype=torch.long), tgt_seqs[:, :-1]], dim=1)

dataset = TensorDataset(src_seqs, tgt_in, tgt_seqs)
loader = DataLoader(dataset, batch_size=64, shuffle=True)

model = SimpleSeq2Seq(vocab_size=VOCAB)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss(ignore_index=0)

# Behavioral cloning training
train_losses = []
for epoch in range(20):
    epoch_loss = 0
    for src, tgt_i, tgt_o in loader:
        logits = model(src, tgt_i)
        loss = criterion(logits.reshape(-1, VOCAB), tgt_o.reshape(-1))
        optimizer.zero_grad(); loss.backward(); optimizer.step()
        epoch_loss += loss.item()
    train_losses.append(epoch_loss / len(loader))

print(f"Initial loss: {train_losses[0]:.3f}")
print(f"Final loss:   {train_losses[-1]:.3f}")

# Evaluate: check token accuracy on held-out examples
model.eval()
with torch.no_grad():
    src_test = src_seqs[-100:]
    tgt_test_in = tgt_in[-100:]
    tgt_test_out = tgt_seqs[-100:]
    logits = model(src_test, tgt_test_in)
    preds = logits.argmax(dim=-1)
    acc = (preds == tgt_test_out).float().mean().item()
    print(f"Token accuracy on held-out set: {acc:.3f}")
```

---

## Comparación de los Métodos de Aprendizaje por Imitación

| Método            | ¿Requiere recompensa? | ¿Experto consultado en línea? | ¿Generaliza a nueva dinámica? | Complejidad |
|-------------------|-----------------------|-------------------------------|-------------------------------|-------------|
| Clonación de Comportamiento | No         | No                            | Mal (desplazamiento de distribución) | Baja    |
| DAgger            | No                    | Sí                            | Moderadamente                 | Media       |
| IRL MaxEnt        | La recupera           | No                            | Bien                          | Alta        |
| GAIL              | No                    | No                            | Bien                          | Alta        |

---

## Aplicaciones

**Robótica.** Enseñar a los robots a manipular objetos, navegar por entornos o realizar tareas domésticas. Las demostraciones físicas se recopilan mediante teleoperación o enseñanza cinestésica.

**Conducción autónoma.** Los primeros sistemas de vehículos autónomos como ALVINN {cite}`pomerleau1989alvinn` y DAVE de NVIDIA dependían en gran medida de la clonación de comportamiento a partir de datos de conducción humana.

**IA en videojuegos.** El aprendizaje por imitación sobre partidas humanas inicializa agentes antes del ajuste fino por RL. AlphaStar entrenó sobre repeticiones humanas antes del RL; este enfoque es común cuando se dispone de demostraciones de nivel humano.

**Generación de código.** El ajuste fino de modelos de lenguaje sobre demostraciones de código de alta calidad (GitHub Copilot, Codex) es una forma de clonación de comportamiento.

**Soporte a la decisión clínica.** Aprender de secuencias de decisiones de médicos expertos para protocolos complejos.

```{seealso}
El análisis fundacional de BC/DAgger está en {cite}`ross2011reduction`. El IRL MaxEnt es de {cite}`ziebart2008maximum`. GAIL es de {cite}`ho2016generative`. Para una encuesta exhaustiva del aprendizaje por imitación, véase {cite}`osa2018algorithmic`.
```
