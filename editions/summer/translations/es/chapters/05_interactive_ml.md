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

# Aprendizaje Automático Interactivo

El aprendizaje activo hace una pregunta concreta: dado un presupuesto, ¿qué ejemplos debo etiquetar? El Aprendizaje Automático Interactivo (IML, por sus siglas en inglés) hace una pregunta más amplia: ¿cómo podemos diseñar la *interacción completa* entre un ser humano y un sistema de aprendizaje para que sea máximamente productiva, agradable y correcta?

El IML se distingue por la **inmediatez** y la **directness** del bucle de retroalimentación humano–modelo. Donde el aprendizaje automático tradicional implica que un humano entregue datos y espere a que el entrenamiento se complete, el IML permite a los humanos observar el comportamiento del modelo, proporcionar retroalimentación y ver cómo el modelo responde, a menudo en cuestión de segundos.

---

## Principios del Aprendizaje Automático Interactivo

Amershi et al. {cite}`amershi2014power` identifican tres características definitorias del IML:

**1. Retroalimentación Rápida:** El modelo se actualiza con suficiente rapidez como para que los humanos perciban el efecto de su retroalimentación. En el límite, las actualizaciones del modelo ocurren en tiempo real.

**2. Manipulación Directa:** El humano interactúa con el modelo a través de los datos o a través de las predicciones del modelo —no a través de archivos de configuración o ajuste de hiperparámetros.

**3. Refinamiento Iterativo:** El proceso es genuinamente iterativo: la siguiente acción del humano está informada por el comportamiento actual del modelo, que fue moldeado por las acciones anteriores del humano.

Esto crea un estrecho **bucle de co-adaptación**: tanto el humano como el modelo cambian con el tiempo en respuesta el uno al otro. El humano aprende lo que el modelo comprende; el modelo aprende lo que le importa al humano.

---

## Comparación con el Aprendizaje Activo

El IML y el aprendizaje activo se superponen considerablemente pero no son idénticos:

| Propiedad                    | Aprendizaje Activo            | Aprendizaje Automático Interactivo  |
|------------------------------|-------------------------------|--------------------------------------|
| Pregunta principal           | ¿Qué etiquetar?               | ¿Cómo interactuar?                  |
| Latencia de retroalimentación | Puede ser por lotes (días)   | Típicamente en tiempo real o casi   |
| Frecuencia de actualización  | Por ronda (lotes)             | Por interacción (en línea)           |
| Agencia del humano           | Responde las preguntas del modelo | Puede enseñar proactivamente al modelo |
| Diseño de interfaz           | Preocupación secundaria       | Preocupación central                 |
| Carga cognitiva del humano   | No se modela explícitamente   | Se considera explícitamente          |

En el aprendizaje activo, la máquina dirige la interacción. En el IML, el humano también puede tomar la iniciativa —aportando ejemplos, correcciones o retroalimentación sobre cualquier aspecto del comportamiento del modelo que parezca más problemático.

---

## Interacción de Iniciativa Mixta

Los sistemas de **iniciativa mixta** permiten tanto al humano como a la máquina tomar la iniciativa en diferentes momentos {cite}`allen1999mixed`. Un sistema dirigido puramente por la máquina hace preguntas y el humano responde. Un sistema dirigido puramente por el humano deja que el humano decida todo. Los sistemas de iniciativa mixta equilibran ambos.

En la práctica, los mejores sistemas IML combinan:
- **Iniciativa de la máquina:** "No estoy seguro sobre estos ejemplos —¿puede etiquetarlos?"
- **Iniciativa del humano:** "Noto que el modelo se equivoca constantemente con esta categoría —déjame proporcionar más ejemplos"
- **Confirmación:** El modelo muestra su comprensión actual; el humano la confirma o corrige

Las buenas interfaces IML hacen visible y corregible la comprensión actual del modelo. Este es el requisito de **inteligibilidad**: los humanos solo pueden guiar a un modelo que comprenden, al menos aproximadamente.

---

## Factores Humanos en el IML

El IML introduce los factores humanos —carga cognitiva, fatiga, coherencia y confianza— directamente en el bucle de aprendizaje. Un diseño deficiente de IML lleva a:

**Fatiga de anotación:** Los humanos toman decisiones más rápidas y descuidadas a medida que avanzan las sesiones. Errores que se incorporan a los datos de entrenamiento.

**Sesgo de anclaje:** Los humanos se apoyan excesivamente en las sugerencias actuales del modelo. Si una interfaz rellena previamente la predicción del modelo, los anotadores son menos propensos a corregirla incluso cuando es errónea —una fuente sistemática de ruido en las etiquetas que se compone a lo largo de las rondas de anotación {cite}`geva2019annotator`. La pre-anotación puede acelerar el rendimiento {cite}`lingren2014evaluating` mientras reduce simultáneamente la tasa a la que los anotadores detectan errores del modelo; estos dos efectos deben sopesarse entre sí en el diseño de interfaces IML.

**Mala calibración de la confianza:** Los humanos o bien confían demasiado (aceptando salidas del modelo incorrectas) o bien confían demasiado poco (ignorando sugerencias correctas). Ambos patrones reducen el valor de la colaboración humano–modelo.

**Coherencia de sesión:** Los humanos pueden tomar decisiones diferentes sobre el mismo ejemplo en momentos diferentes, especialmente después de sesiones largas. Las comprobaciones de coherencia (re-presentar ejemplos anteriores) pueden detectar y corregir esto.

Un buen diseño de IML mitiga estos problemas a través de opciones de interfaz: mostrar explícitamente la confianza del modelo, aleatorizar el orden de presentación, limitar la duración de las sesiones e incorporar comprobaciones de coherencia.

---

## Los Tipos de Retroalimentación en el IML en la Práctica

### Retroalimentación a Nivel de Ejemplo

El humano proporciona una etiqueta o corrección para un ejemplo específico. Esta es la forma más común y es directamente compatible con el aprendizaje supervisado.

### Retroalimentación a Nivel de Característica

El humano indica qué características son relevantes o irrelevantes. "El modelo debería prestar atención a las palabras 'urgente' y 'plazo' para esta categoría." Esto es más expresivo que la retroalimentación a nivel de ejemplo y puede ser más eficiente para ciertas tareas.

**TFIDF Interactivo** y sistemas similares permiten a los anotadores resaltar palabras relevantes en documentos de texto. Estos resaltados se convierten en restricciones o supervisión adicional sobre la atención del modelo.

### Retroalimentación a Nivel de Modelo

El humano corrige directamente el comportamiento del modelo en una clase de entradas: "Siempre que la entrada contenga [X], la salida debería ser [Y]." Esto se corresponde con reglas lógicas o restricciones en enfoques como la Regularización Posterior {cite}`ganchev2010posterior` o el aprendizaje guiado por restricciones.

---

## Caso de Estudio: Google Teachable Machine

Teachable Machine es un sistema IML accesible basado en la web que permite a usuarios no técnicos entrenar clasificadores de imágenes en el navegador. El usuario:

1. Graba ejemplos de cada clase usando su cámara web
2. Entrena el modelo con un solo clic (ajustando una MobileNet en el navegador)
3. Ve inmediatamente las predicciones del modelo sobre vídeo en directo
4. Agrega más ejemplos para las clases donde el modelo se equivoca

Esto ilustra el bucle central del IML: proporcionar ejemplos → observar el modelo → identificar el fallo → proporcionar más ejemplos específicos. La retroalimentación en tiempo real (las salidas del modelo se actualizan en tiempo real, típicamente a velocidades de fotogramas interactivas en hardware moderno) hace que el bucle de co-adaptación sea visceralmente inmediato.

---

## Implementación de un Bucle IML Simple

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

## La Prueba de la Abuela

Una heurística útil para evaluar el diseño de interfaces IML —y el diseño de sistemas HITL en términos más amplios— es lo que llamaremos la **Prueba de la Abuela** (una formulación original introducida aquí como restricción de diseño, no como referencia a trabajo previo):

> *Una mujer nacida en 1930 debería poder usar este dispositivo por voz, y si se frustra, degradarse elegantemente a una interfaz de teclado o texto.*

La prueba no trata principalmente sobre accesibilidad, aunque también lo es. Trata sobre **diseñar para la fricción**. Si un sistema requiere un modelo mental de redes neuronales, bucles de entrenamiento o distribuciones de probabilidad para usarse eficazmente, ha fallado la Prueba de la Abuela. El humano en el bucle debería poder participar sin entender el lado de la máquina del bucle.

Las implicaciones para el diseño de IML son concretas:

**Alternativa de voz primero:** La modalidad de interacción primaria debería ser el lenguaje natural o el gesto —no los deslizadores de parámetros o los umbrales de confianza. Los expertos pueden querer deslizadores; todos deberían poder decir "eso está mal".

**Degradación elegante:** Cuando la modalidad preferida del usuario falla o frustra, el sistema debería ofrecer una alternativa —no una pantalla en blanco o un mensaje de error. La interfaz es parte del sistema de aprendizaje; un usuario que no puede interactuar no puede enseñar.

**Estado del modelo legible:** La comprensión actual del modelo debería ser visible en términos humanos. No "confianza: 0,73" sino "Estoy bastante seguro de que esto es [X], pero he visto ejemplos como este ir en ambas direcciones." La incertidumbre debería comunicarse en un lenguaje que invite a la corrección.

**Tolerancia a la ambigüedad:** Un usuario de 93 años y un ingeniero de aprendizaje automático de 23 años interactuarán de manera diferente con el mismo sistema. La Prueba de la Abuela pregunta si el sistema puede acomodar a ambos —no detectando la edad del usuario, sino diseñando interacciones que funcionen para un rango de experiencia y comodidad.

La prueba cobra especial importancia a medida que los sistemas de aprendizaje automático pasan de herramientas de investigación a infraestructura cotidiana. Un asistente de imágenes médicas utilizado por radiólogos, un clasificador de documentos legales utilizado por auxiliares judiciales, un sistema de retroalimentación educativa utilizado por docentes: cada uno implica humanos en el bucle que no se apuntaron para ser entrenadores de IA. Diseñar para ellos no es una concesión; es el propósito.

:::{admonition} Principio de Diseño
:class: tip
La Prueba de la Abuela es una restricción de diseño, no un grupo demográfico objetivo. Los sistemas que la superan son más robustos ante la diversidad de usuarios, más indulgentes con las brechas de experiencia y más honestos sobre lo que esperan de los humanos en el bucle. Si un sistema requiere explicación antes de usarse, está pidiendo al humano que haga trabajo extra. Ese trabajo debería estar justificado por un beneficio proporcional.
:::

---

## IML y Modelos de Fundación

El IML moderno aprovecha cada vez más los **modelos de fundación preentrenados** {cite}`bommasani2021opportunities` como base. En lugar de entrenar desde cero, los usuarios ajustan un gran modelo preentrenado con un pequeño número de ejemplos interactivos. Esto puede reducir drásticamente el número de ejemplos necesarios para alcanzar un rendimiento útil —en casos favorables, tan pocos como 5–50 ejemplos en lugar de miles, dependiendo de cuánto coincidan las representaciones preentrenadas con la tarea objetivo {cite}`bommasani2021opportunities`.

Las técnicas que lo posibilitan incluyen:
- **Prompting con pocos ejemplos:** Proporcionar ejemplos en la ventana de contexto del LLM
- **Ajuste con adaptadores:** Actualizar pequeños módulos adaptadores mientras se congela el modelo base
- **Ajuste de parámetros eficiente (PEFT):** LoRA, ajuste de prefijos y métodos similares que permiten actualizaciones rápidas con pocos recursos

Los modelos de fundación cambian la dinámica del IML: los humanos ya no están enseñando a un modelo sin conocimiento previo desde cero, sino *dirigiendo* un modelo que ya sabe mucho. El desafío se desplaza de "cómo proporcionar suficientes ejemplos" a "cómo especificar exactamente en qué queremos que se comporte diferente de lo que el modelo ya hace".

```{seealso}
La encuesta de {cite}`amershi2014power` sigue siendo la mejor visión general de los principios del IML. Para los sistemas de iniciativa mixta específicamente, véase {cite}`allen1999mixed`. Para los efectos de anclaje en la anotación, véase {cite}`geva2019annotator` y {cite}`lingren2014evaluating`.
```
