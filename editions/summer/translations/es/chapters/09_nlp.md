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

# HITL en Procesamiento de Lenguaje Natural

El lenguaje natural es el dominio donde el HITL ML ha tenido posiblemente el mayor impacto —y donde afloran sus dificultades conceptuales más profundas. El lenguaje es inherentemente social: su significado es construido por comunidades humanas, su pragmática depende del contexto y la intención, y su calidad solo puede ser juzgada por lectores humanos. Pero esto también significa que la anotación de PLN no es simplemente un proceso de recopilación de observaciones. Es un proceso de *construcción* de categorías.

---

## El Problema Constitutivo en la Anotación de PLN

En imágenes médicas, existe una verdad fundamental: un tumor está presente o no lo está. La etiqueta del radiólogo puede ser incierta, pero intenta rastrear algo real. La anotación de PLN es a menudo fundamentalmente diferente. Cuando un anotador marca un tuit como "tóxico", no hay ninguna molécula-tóxica en el tuit que estemos intentando detectar. **La etiqueta constituye la categoría.**

Esto tiene consecuencias profundas que se subestiman con frecuencia:

**La fuerza laboral de anotación define el fenómeno.** Un esquema de etiquetado para "lenguaje ofensivo" codifica las sensibilidades de quien lo diseñó y de quien lo aplicó. Un equipo de anotadores de habla inglesa con un trasfondo demográfico uniforme, trabajando bajo directrices redactadas por un equipo de política corporativa, produce un conjunto de datos que refleja la comprensión de ese equipo sobre la ofensa —no algún estándar humano universal. Los modelos entrenados con dichos datos exhibirán esos mismos límites implícitos.

**Las directrices son teoría, lo reconozcan o no.** Todo esquema de anotación hace afirmaciones sobre ontología. Decidir que "ironía" y "sarcasmo" son la misma clase es una afirmación teórica, no una conveniencia neutral. Decidir etiquetar el "enojo" como una única clase en lugar de distinguir el "enojo justificado" del "enojo hostil" colapsa una distinción que puede importar para la tarea posterior. Estas decisiones se toman bajo presión de producción y rara vez se revisan.

**Inestabilidad temporal de las etiquetas.** El lenguaje social evoluciona. Un modelo de toxicidad entrenado en 2018 clasificará incorrectamente contenido de 2024 no porque esté estadísticamente subentrenado, sino porque el significado social de ciertos términos ha cambiado. La anotación de PLN no consiste en muestrear de una distribución estática —consiste en muestrear de un objetivo en movimiento que el propio acto de etiquetar ayuda parcialmente a constituir.

:::{admonition} El Problema del Artefacto de Anotación
:class: important

Geva et al. {cite}`geva2019annotator` demostraron que los conjuntos de datos de Inferencia en Lenguaje Natural (NLI) contienen artefactos sistemáticos introducidos por el propio proceso de anotación. Los anotadores a quienes se pide que escriban hipótesis de "implicación" para una premisa dada tienden a usar ciertos patrones sintácticos; los anotadores que escriben hipótesis de "contradicción" usan otros. Los modelos aprenden a clasificar basándose en estos artefactos en lugar de en la relación semántica pretendida —resuelven la tarea de anotación, no la tarea subyacente de PLN.

Esto no es descuido. Es una consecuencia inherente de que los humanos construyan ejemplos para ajustarse a una etiqueta. El proceso HITL inserta una señal sistemática que nunca estuvo destinada a estar en los datos.
:::

---

## Anotación de Clasificación de Texto

La tarea de anotación de PLN más simple es asignar una categoría a un documento de texto. El análisis de sentimientos, la clasificación de temas, la detección de intención y el filtrado de correo no deseado son todas tareas de clasificación.

**Desafíos específicos de la clasificación de texto:**

*Subjetividad.* Categorías como "tóxico" u "ofensivo" son inherentemente subjetivas y varían según los contextos culturales, los trasfondos de los anotadores y el contexto de la plataforma. Las percepciones de la ofensividad difieren significativamente según la demografía —un hecho con implicaciones directas para la equidad {cite}`blodgett2020language`.

*Ambigüedad de etiquetas.* Muchos documentos pertenecen a múltiples categorías o están en un límite. Una reseña que es 60% positiva y 40% negativa es genuinamente ambigua, no está mal etiquetada. Forzar una sola etiqueta descarta información real (véase el Capítulo 13 sobre etiquetas suaves y desacuerdo entre anotadores).

*Granularidad de etiquetas.* Un modelo de sentimientos de 2 clases puede ser suficiente para el monitoreo de redes sociales; puede necesitarse una escala de 7 puntos para el análisis de retroalimentación de productos. La granularidad correcta depende de la tarea posterior, pero generalmente se fija antes de la anotación —una decisión de diseño consecuente tomada con datos insuficientes.

---

## Reconocimiento de Entidades Nombradas

La anotación de NER requiere identificar tramos de texto y asignar un tipo de entidad (PERSONA, ORGANIZACIÓN, LUGAR, etc.). La anotación es más compleja que la clasificación de documentos por varias razones:

**Los límites de los tramos son ambiguos.** En "Apple CEO Tim Cook anunció...", ¿abarca la entidad PERSONA solo "Tim Cook" o también "Apple CEO Tim Cook"? Las directrices deben abordar explícitamente estos casos, y la concordancia entre anotadores sobre los tramos es consistentemente menor que sobre los tipos.

**La asignación de tipos requiere conocimiento del mundo.** "Apple" es ORG en un contexto, PRODUCTO en otro, y posiblemente ninguno en "tarta de manzana". Los anotadores necesitan suficiente conocimiento del dominio para hacer asignaciones de tipos correctas.

**Entidades anidadas.** "La Universidad de California, Berkeley" contiene ORGANIZACIÓN anidada dentro de LUGAR. El etiquetado BIO estándar no puede representar entidades anidadas; se requieren esquemas más complejos (por ejemplo, BIOES, o formatos basados en grafos).

**Eficiencia de la anotación.** La pre-anotación con un modelo NER de referencia acelera significativamente la anotación al permitir a los anotadores corregir predicciones en lugar de anotar desde cero. En un estudio de NER clínico, se observaron aumentos de rendimiento del 30–60% {cite}`lingren2014evaluating`; la magnitud de tales ganancias depende fuertemente de la calidad del modelo de referencia y del dominio.

---

## Extracción de Relaciones y Anotación Semántica

Más allá de identificar entidades, la extracción de relaciones requiere anotar *relaciones* entre entidades:

- Los anotadores deben comprender tanto las entidades como el predicado que las conecta
- Los tipos de relación tienen distinciones semánticas complejas (TRABAJA\_EN vs. EMPLEADO\_POR vs. FUNDÓ)
- Los ejemplos negativos (pares de entidades sin relación) son mucho más comunes que los positivos

**La concordancia entre anotadores para la extracción de relaciones** tiende a ser menor que para las tareas de clasificación. Para esquemas bien definidos, se reportan comúnmente valores de $\kappa$ en el rango de 0,65–0,80 {cite}`pustejovsky2012natural`; para relaciones semánticas complejas (causalidad de eventos, relaciones temporales), la concordancia puede caer considerablemente por debajo, dependiendo del diseño del esquema y la formación de los anotadores.

---

## Posedición de Traducción Automática (MTPE)

La posedición de traducción automática es una forma madura de HITL en PLN. Un traductor humano corrige la salida de un sistema de traducción automática en lugar de traducir desde cero:

**Posedición ligera (LPE):** Solo se corrigen los errores críticos. Adecuada cuando los requisitos de calidad de traducción son moderados.

**Posedición completa (FPE):** La salida se corrige hasta alcanzar la calidad de publicación. La salida editada generalmente se convierte en datos de entrenamiento para mejorar aún más la traducción automática —un genuino ciclo de refinamiento con humano en el bucle.

**HTER (Tasa de Edición de Traducción Dirigida al Humano):** Una métrica que mide la distancia de edición entre la salida de la traducción automática y la traducción posedited, normalizada por la longitud de la oración {cite}`graham2015accurate`. Como regla práctica aproximada, un HTER por debajo de aproximadamente 0,3 se considera a menudo un buen resultado de traducción automática; por encima de 0,5, traducir desde cero puede ser más rápido —aunque estos umbrales varían según el dominio y el par de idiomas.

---

## IA Conversacional y Anotación de Diálogo

La anotación de diálogo introduce estructura temporal:

- **Anotación a nivel de turno:** etiquetar cada turno (intención, sentimiento, calidad)
- **Anotación a nivel de diálogo:** evaluar la coherencia general, el éxito de la tarea, la satisfacción del usuario
- **Anotación de trazas de interacción:** identificar momentos específicos de fallo en una conversación

HITL es especialmente importante en el diálogo porque los fallos del modelo son a menudo sutiles y acumulativos: un error factual en el turno 3 puede no hacerse aparente hasta el turno 7. Los anotadores humanos que rastrean conversaciones pueden identificar estos patrones de fallo de largo alcance que las métricas automatizadas pierden por completo.

---

## Etiquetado Programático y Supervisión Débil

Cuando los datos etiquetados son escasos, la **supervisión débil** permite usar múltiples funciones de etiquetado ruidosas y superpuestas para generar etiquetas probabilísticas a escala. **Snorkel** {cite}`ratner2017snorkel` es el marco canónico:

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score

rng = np.random.default_rng(42)

# -------------------------------------------------------
# Toy weak supervision: sentiment classification
# 5 labeling functions (LFs) with different coverage/accuracy
# Label: +1 (positive), -1 (negative), 0 (abstain)
# -------------------------------------------------------

N = 1000
true_labels = rng.choice([-1, 1], size=N)
X_features = np.column_stack([
    true_labels * 0.8 + rng.normal(0, 0.5, N),
    rng.normal(0, 1, N),
    rng.normal(0, 1, N),
])

def make_lf(accuracy, coverage, seed):
    rng_lf = np.random.default_rng(seed)
    votes = np.zeros(N, dtype=int)
    active = rng_lf.random(N) < coverage
    correct = rng_lf.random(N) < accuracy
    votes[active & correct]  = true_labels[active & correct]
    votes[active & ~correct] = -true_labels[active & ~correct]
    return votes

LFs = np.column_stack([
    make_lf(accuracy=0.85, coverage=0.60, seed=1),
    make_lf(accuracy=0.78, coverage=0.45, seed=2),
    make_lf(accuracy=0.70, coverage=0.80, seed=3),
    make_lf(accuracy=0.90, coverage=0.30, seed=4),
    make_lf(accuracy=0.60, coverage=0.90, seed=5),
])

def majority_vote(LF_matrix):
    labels = []
    for i in range(LF_matrix.shape[0]):
        votes = LF_matrix[i][LF_matrix[i] != 0]
        labels.append(0 if len(votes) == 0 else int(np.sign(votes.sum())))
    return np.array(labels)

mv_labels = majority_vote(LFs)
covered = mv_labels != 0

print(f"Coverage:                    {covered.mean():.1%}")
print(f"MV accuracy (covered):       {(mv_labels[covered] == true_labels[covered]).mean():.3f}")

X_train, y_train = X_features[covered], mv_labels[covered]
X_test,  y_test  = X_features[~covered], true_labels[~covered]

if len(X_train) > 10 and len(X_test) > 10:
    clf = LogisticRegression().fit(X_train, y_train)
    preds = clf.predict(X_test)
    print(f"F1 on uncovered test set:    {f1_score(y_test, preds):.3f}")
```

---

## RLHF para Modelos de Lenguaje: La Realidad de la Anotación

El Capítulo 6 abordó RLHF técnicamente. Desde la perspectiva del PLN, la tarea de anotación es más difícil de lo que parece desde fuera.

**Lo que realmente se pide a los anotadores** —comparar dos salidas del modelo e indicar cuál es "mejor"— suena simple. En la práctica, "mejor" es un constructo no especificado que los anotadores resuelven usando heurísticas personales. Algunos ponderan fuertemente la fluidez; otros la precisión factual; otros penalizan la verbosidad. Sin directrices estrictas, el conjunto de datos de preferencias resultante no refleja los valores humanos en abstracto, sino las estrategias de resolución particulares de la fuerza laboral de anotación empleada.

**Las dimensiones clave de anotación son:**

- *Utilidad:* ¿La respuesta responde bien a la pregunta? ¿Es informativa, clara y apropiadamente detallada?
- *Factualidad:* ¿La respuesta es factualmente precisa? Esto requiere que los evaluadores tengan conocimiento del dominio —un requisito que crea graves problemas de calidad a escala, ya que los anotadores generalistas no pueden verificar afirmaciones especializadas.
- *Inocuidad:* ¿La respuesta evita contenido tóxico, sesgado, dañino o inapropiado? Estos juicios requieren directrices detalladas porque "dañino" depende enormemente del contexto y varía según las culturas, el tiempo y el contexto de la plataforma.
- *Calibración:* ¿La respuesta expresa incertidumbre apropiada? Los anotadores prefieren sistemáticamente respuestas que suenan confiadas, lo que crea una señal de recompensa contraria a la humildad epistémica adecuada.

La interacción entre criterios es compleja: una respuesta maximalmente útil a una pregunta peligrosa puede ser maximalmente dañina. Las directrices deben especificar cómo equilibrar criterios en competencia —y esos equilibrios son efectivamente decisiones de política, no decisiones de anotación. La fuerza laboral de anotación está tomando decisiones políticas.

**La escala concentra la influencia demográfica.** RLHF para grandes modelos implica fuerzas laborales de anotación relativamente pequeñas (cientos a pocos miles) tomando miles de millones de decisiones posteriores. Los sesgos demográficos y culturales de esa fuerza laboral se propagan al comportamiento del modelo a escala de una manera que no ocurriría si la anotación estuviera más distribuida. Este es uno de los problemas estructurales menos discutidos en la tubería actual de RLHF.

---

## El Bucle de Retroalimentación Anotación–Modelo

En PLN más que en cualquier otro dominio, los procesos de anotación y desarrollo del modelo se entrelazan con el tiempo:

1. Los anotadores se calibran usando las salidas existentes del modelo como referencia (a menudo de manera implícita).
2. El modelo de recompensa aprende lo que tienden a preferir las anotaciones.
3. El generador se ajusta fino para producir salidas que obtengan alta recompensa.
4. Esas salidas influyen en lo que parece "bueno" en las rondas de anotación posteriores.

Este bucle de retroalimentación no es inherentemente patológico —es lo que permite que RLHF converja— pero significa que el comportamiento del modelo está moldeado por un objetivo en movimiento que el propio proceso de anotación ayuda a mover. Distinguir empíricamente lo que el modelo aprendió porque refleja preferencias humanas de lo que aprendió porque aprendió a hacer coincidencia de patrones con las heurísticas de los anotadores es difícil.

No existe una solución limpia. La mejor práctica actual es monitorear la deriva usando juicios de preferencia reservados recopilados a intervalos regulares, y tratar la versión de las directrices de anotación como una variable experimental.

---

## Evaluación de Modelos de PLN Generativos

A diferencia de los modelos de clasificación con una métrica de precisión clara, evaluar la calidad de la generación requiere juicio humano:

| Método de evaluación | Descripción | Coste |
|---|---|---|
| Evaluación directa (DA) | Los anotadores puntúan la calidad en una escala | Medio |
| Juicio comparativo | Los anotadores comparan dos salidas | Bajo |
| MQM (Métricas de Calidad Multidimensional) | Taxonomía estructurada de errores | Alto |
| Preferencia RLHF | Etiquetas de preferencia usadas para el entrenamiento | Medio |
| LLM como juez | El LLM puntúa salidas (correlaciona moderadamente con el humano) | Muy bajo |
| BERTScore, BLEU | Métricas automáticas (correlación imperfecta con el juicio humano) | Muy bajo |

Las métricas automáticas (BLEU para traducción automática, ROUGE para resumir) son económicas pero se correlacionan imperfectamente con los juicios de calidad humana {cite}`reiter2018structured`. Los enfoques LLM-como-juez muestran una concordancia moderada con los anotadores humanos {cite}`zheng2023judging` y se usan cada vez más para la iteración rápida, pero no deben reemplazar la evaluación humana para los juicios definitivos. Para las decisiones con riesgos reales, la evaluación humana sigue siendo necesaria.

```{seealso}
Supervisión débil con Snorkel: {cite}`ratner2017snorkel`. Directrices de anotación de PLN: {cite}`pustejovsky2012natural`. Artefactos de anotación en NLI: {cite}`geva2019annotator`. Sesgo de anotadores y conjuntos de datos de PLN: {cite}`blodgett2020language`. Para la evaluación de modelos generativos: {cite}`reiter2018structured`.
```
