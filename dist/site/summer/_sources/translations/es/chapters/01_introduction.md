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

# ¿Qué es el Aprendizaje Automático con Humano en el Bucle?

```{epigraph}
Una máquina que puede aprender de la experiencia... pero solo si le proporcionas las experiencias adecuadas.
-- parafraseando a Alan Turing
```

## La Paradoja de la Automatización

Cada nueva oleada de automatización genera nuevas exigencias sobre la atención humana. Cuando las aerolíneas introdujeron el piloto automático, los pilotos se convirtieron en supervisores: ya no responsables del control momento a momento, sino de la tarea más difícil de saber *cuándo* intervenir. Cuando los supermercados introdujeron las cajas de autopago, descubrieron que esos sistemas requieren más supervisión humana por transacción que los cajeros tradicionales, no menos. Y cuando el aprendizaje automático comenzó a tomar decisiones a escala —en medicina, finanzas, contratación laboral y moderación de contenido— generó una demanda enorme y continua de juicio humano.

Esta es la **paradoja de la automatización** {cite}`bainbridge1983ironies`: cuanto más capaz se vuelve un sistema automatizado, más graves son sus fallos y, por tanto, más necesaria resulta una supervisión humana robusta. El aprendizaje automático no es una excepción.

El Aprendizaje Automático con Humano en el Bucle (HITL ML) es el campo que toma esta paradoja en serio y la incorpora al diseño de los sistemas desde el principio. En lugar de tratar la participación humana como un andamiaje temporal destinado a ser eventualmente eliminado, HITL ML trata la interacción humano–máquina como una *característica* —una fuente de señal, corrección y orientación que puede hacer los modelos más precisos, más alineados con los valores humanos y más confiables.

---

## Definición del Aprendizaje Automático con Humano en el Bucle

No existe una definición única acordada de HITL ML, y el término se utiliza de varias maneras superpuestas en la bibliografía. Para este manual adoptamos una definición amplia pero precisa:

:::{admonition} Definición
:class: important

**El Aprendizaje Automático con Humano en el Bucle** hace referencia a cualquier sistema o metodología de aprendizaje automático en el que la retroalimentación humana se incorpora al proceso de aprendizaje de manera *deliberada, estructurada y continua* —no solo en el momento de creación del conjunto de datos, sino a lo largo del entrenamiento, la evaluación y el despliegue.

:::

Esta definición tiene tres cláusulas clave:

**Deliberada.** HITL no se refiere a la influencia humana accidental (por ejemplo, el hecho de que los datos de entrenamiento fueran originalmente creados por humanos). Se refiere a sistemas diseñados explícitamente para solicitar, incorporar y beneficiarse de la retroalimentación humana.

**Estructurada.** La retroalimentación tiene una forma definida —una etiqueta, una corrección, un juicio de preferencia, una demostración— y un papel definido en el algoritmo de aprendizaje.

**Continua.** El bucle de retroalimentación se mantiene a lo largo del tiempo, permitiendo que el sistema mejore a medida que encuentra nuevas situaciones, comete errores y recibe orientación humana.

Esta definición incluye los flujos de anotación clásicos, el aprendizaje activo, el aprendizaje automático interactivo, RLHF y el aprendizaje por imitación. Excluye la recopilación de datos pasiva y el aprendizaje supervisado puramente offline (aunque la línea es difusa, como se discutirá en el Capítulo 2).

---

## Una Breve Historia

### Sistemas Expertos e Ingeniería del Conocimiento (décadas de 1960–1980)

Los primeros sistemas de IA eran casi completamente con humano en el bucle: los ingenieros del conocimiento se sentaban con expertos en el dominio durante meses, codificando pacientemente reglas en sistemas expertos como MYCIN y DENDRAL. Cada pieza de conocimiento era proporcionada explícitamente por un humano. La máquina era el ejecutor; el humano era el oráculo.

Estos sistemas funcionaban sorprendentemente bien en dominios estrechos, pero eran frágiles: incapaces de generalizar más allá de sus reglas artesanales y costosos de mantener.

### El Giro Estadístico (décadas de 1980–2000)

El cambio hacia el aprendizaje automático estadístico en las décadas de 1980 y 1990 transformó la naturaleza de la participación humana. En lugar de codificar el conocimiento como reglas, los humanos proporcionaban ahora *ejemplos* —conjuntos de datos etiquetados que permitían a los modelos inferir patrones. El papel humano pasó a ser el de anotador: etiquetar documentos, clasificar imágenes, transcribir discurso.

Fue un gran avance, pero creó un nuevo cuello de botella: **los datos etiquetados son costosos**. Los investigadores comenzaron a preguntarse cómo aprovechar al máximo el esfuerzo de etiquetado humano. Esta pregunta dio lugar al **aprendizaje activo**, formalizado por primera vez a principios de la década de 1990 {cite}`cohn1994improving`.

### La Era del Aprendizaje Profundo (de la década de 2010 hasta la actualidad)

La revolución del aprendizaje profundo creó un nuevo régimen: modelos con miles de millones de parámetros capaces de aprender funciones extraordinariamente complejas a partir de datos, pero que requieren conjuntos de datos etiquetados de tamaño equivalentemente enorme. ImageNet (14 millones de imágenes etiquetadas) y los proyectos de anotación a gran escala que le siguieron mostraron tanto el poder como el coste de la escala.

Al mismo tiempo, el despliegue del aprendizaje automático a escala expuso nuevos problemas: modelos precisos en promedio pero sistemáticamente erróneos para grupos específicos, que alucinaban hechos con confianza, que optimizaban métricas proxy en lugar de valores humanos. Estos fallos motivaron nuevas formas de participación humana: no solo el etiquetado, sino la *alineación* —el proyecto de hacer que los modelos se comporten de la manera que los humanos realmente desean.

La expresión más clara de este trabajo de HITL centrado en la alineación es el **Aprendizaje por Refuerzo a partir de Retroalimentación Humana (RLHF)** {cite}`christiano2017deep`, que se convirtió en la columna vertebral de sistemas como InstructGPT {cite}`ouyang2022training` y las capacidades de seguimiento de instrucciones de los modelos de lenguaje modernos.

---

## ¿Por qué HITL? El caso del juicio humano

¿Qué hace que el juicio humano sea suficientemente valioso como para incorporarlo a los sistemas de aprendizaje automático? Varias propiedades:

### 1. Sentido Común y Conocimiento del Mundo

Los humanos aportan un vasto conocimiento de fondo a cualquier tarea. Cuando un radiólogo etiqueta una radiografía, recurre a años de formación, a una comprensión de la anatomía y al conocimiento implícito sobre el aspecto de las enfermedades —un conocimiento extraordinariamente difícil de especificar completamente o de adquirir solo a partir de los datos.

### 2. Anclaje Semántico

Las etiquetas son significativas porque los humanos entienden lo que significan. La clase "gato" en ImageNet hace referencia a un concepto difuso que los humanos reconocen intuitivamente pero que ninguna definición formal captura completamente. Los modelos aprenden la extensión de la etiqueta (qué imágenes se corresponden con ella) pero pueden no aprender el concepto en sí, lo que lleva a fallos en casos límite que cualquier humano manejaría correctamente.

### 3. Alineación de Valores

Los humanos tienen preferencias, valores y juicios éticos que los modelos de aprendizaje automático no pueden derivar de los datos por sí solos. Si un fragmento de texto es "útil" o "dañino" no es una pregunta puramente empírica: depende de valores humanos que varían entre individuos y contextos. HITL es el mecanismo principal mediante el cual estos valores pueden comunicarse a los sistemas de aprendizaje automático.

### 4. Adaptabilidad

El juicio humano puede adaptarse a situaciones novedosas sin necesidad de reentrenamiento. Un modelo entrenado con datos históricos puede fallar catastróficamente cuando el mundo cambia; un humano puede reconocer la novedad y responder adecuadamente.

### 5. Rendición de Cuentas

En dominios de alto riesgo —medicina, derecho, finanzas— las decisiones deben ser responsables ante los seres humanos. Los sistemas HITL hacen que esta rendición de cuentas sea viable al mantener a los humanos en posición de comprender, verificar e invalidar el comportamiento de las máquinas.

---

## El Bucle de Retroalimentación

La estructura central de HITL ML es un bucle de retroalimentación entre un modelo y uno o más humanos:

```text
+---------------------------------------------+
|                                             |
|   El modelo hace predicciones / solicita   |
|   ---------------------------------->       |
|                                   Humano   |
|   El humano proporciona feedback <--------- |
|   ----------------------------------        |
|                                             |
|   El modelo actualiza con el feedback      |
|                                             |
+---------------------------------------------+
```

La naturaleza de la retroalimentación varía enormemente entre los paradigmas de HITL:

| Tipo de retroalimentación | Ejemplo                                                | Paradigma principal         |
|---------------------------|--------------------------------------------------------|-----------------------------|
| Etiqueta de clase         | "Este correo electrónico es spam"                      | Aprendizaje supervisado     |
| Corrección                | "La entidad debería ser ORG, no PER"                   | Aprendizaje activo/interactivo |
| Preferencia               | "La respuesta A es mejor que la B"                     | RLHF / clasificación        |
| Demostración              | Mostrar al robot cómo agarrar un objeto                | Aprendizaje por imitación   |
| Lenguaje natural          | "Sé más conciso en tus respuestas"                     | Ajuste por instrucciones    |
| Señal implícita           | El usuario hizo clic / no hizo clic                    | Retroalimentación implícita |

---

## Lo que HITL No Es

Conviene ser precisos sobre lo que queda *fuera* de nuestra definición.

**HITL no es lo mismo que el despliegue con humano en el bucle** (a veces llamado "humano sobre el bucle"), donde los humanos supervisan decisiones automatizadas y pueden invalidarlas, pero no retroalimentan correcciones al entrenamiento. Trataremos esta distinción en el Capítulo 2.

**HITL no es solo supervisión débil.** Los sistemas de etiquetado programático como Snorkel utilizan funciones de etiquetado (a menudo reglas de autoría humana) para generar etiquetas ruidosas a escala. Esta es una forma de entrada humana estructurada, pero la retroalimentación no es iterativa en el sentido que HITL generalmente implica.

**HITL no consiste simplemente en usar datos etiquetados.** Todos los modelos de aprendizaje supervisado utilizan datos etiquetados por humanos. HITL se refiere específicamente a sistemas en los que la retroalimentación humana es una parte *activa e iterativa* del proceso de aprendizaje.

---

## La Economía de la Retroalimentación Humana

La retroalimentación humana es valiosa pero costosa. Una anotación de imagen médica puede costar entre decenas y cientos de dólares por imagen cuando la realiza un especialista, dependiendo de la subespecialidad y la complejidad de la tarea {cite}`monarch2021human`. Las etiquetas de trabajadores de crowdsourcing en plataformas como Amazon Mechanical Turk pueden costar entre $0,01 y $0,10 por elemento {cite}`hara2018data` con una calidad mucho menor. El desafío fundamental del HITL ML es **maximizar el valor de cada unidad de retroalimentación humana**.

Esto conduce a una pregunta unificadora que atraviesa la mayor parte de este manual:

:::{admonition} La Pregunta Central del HITL ML
:class: tip

*Dado un presupuesto fijo de tiempo y atención humana, ¿cómo debemos decidir qué preguntar a los humanos, cuándo preguntarlo y cómo incorporar sus respuestas al entrenamiento del modelo?*

:::

La respuesta a esta pregunta depende del dominio, la forma de retroalimentación, el coste de anotación, el riesgo de error y el estado actual del modelo —razón por la cual HITL ML es una disciplina rica y en continua evolución.

---

## Descripción General del Manual

El resto de este manual está estructurado de la siguiente manera. La **Parte II** cubre los tres pilares clásicos de HITL: anotación, aprendizaje activo y aprendizaje automático interactivo. La **Parte III** aborda los paradigmas más recientes del aprendizaje a partir de retroalimentación —RLHF, aprendizaje por imitación y aprendizaje de preferencias— que se han vuelto centrales en la IA moderna. La **Parte IV** examina HITL desde la perspectiva de dominios de aplicación específicos. La **Parte V** adopta una perspectiva de profesional sobre plataformas, crowdsourcing y evaluación. La **Parte VI** aborda la ética y mira hacia el futuro.

```{seealso}
Para una visión general del campo orientada al profesional, véase {cite}`monarch2021human`. Para el artículo fundacional sobre aprendizaje activo que inició gran parte del tratamiento formal de HITL, véase {cite}`settles2009active`.
```
