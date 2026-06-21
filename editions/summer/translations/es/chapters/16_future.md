# Direcciones Futuras

El campo del aprendizaje automático con humano en el bucle está cambiando rápidamente. Los modelos de fundación, los LLMs como anotadores y los nuevos paradigmas de colaboración humano-IA están reformando la economía y la práctica de HITL de maneras que no eran imaginables hace tan solo cinco años. Este capítulo final traza el panorama de las direcciones emergentes y los problemas abiertos.

---

## Modelos de Fundación y el Papel Cambiante de la Anotación

Los modelos de fundación —grandes modelos preentrenados en datos amplios que pueden adaptarse a tareas posteriores— están cambiando fundamentalmente la economía de HITL.

### Reducción de la Carga de Anotación

Una tarea que anteriormente requería miles de ejemplos etiquetados para entrenar desde cero puede requerir solo docenas al ajustar fino un modelo de fundación. El prompting con pocos ejemplos puede eliminar por completo la necesidad del ajuste fino para algunas tareas.

**Implicación:** El ROI de la anotación cambia. El esfuerzo de anotación ahora se dirige mejor hacia:
- Conjuntos de evaluación de alta calidad (para medir si el modelo adaptado funciona realmente)
- Casos difíciles y casos límite que el modelo de fundación maneja incorrectamente
- Ejemplos específicos de la tarea que enseñan al modelo algo que no puede inferir del preentrenamiento

### Nuevas Formas de Especificación

Cuando el modelo base ya entiende el lenguaje, el código y el sentido común, los usuarios pueden comunicarse con él en lenguaje natural en lugar de a través de ejemplos etiquetados. Un usuario que quiere un clasificador de texto ya no necesita etiqueter 500 ejemplos —puede escribir una descripción de la tarea de clasificación y evaluar el rendimiento en cero disparos.

Esto desplaza el desafío HITL de la *recopilación de ejemplos* a la *especificación de la tarea*: ayudar a los usuarios a articular con precisión lo que quieren en una forma sobre la que el modelo pueda actuar. Esto es más difícil de lo que parece —las descripciones en lenguaje natural de las tareas son a menudo ambiguas de maneras que los ejemplos anotados no lo son.

---

## LLMs como Anotadores

Uno de los desarrollos más significativos de 2023–2025 es el uso de **LLMs como oráculos de anotación**. En lugar de preguntarle a un humano "¿Esta reseña es positiva o negativa?", le preguntamos a GPT-4 o Claude. Para tareas de clasificación bien definidas, las anotaciones de LLM a menudo coinciden o se aproximan estrechamente a la precisión de los trabajadores de crowdsourcing {cite}`gilardi2023chatgpt`, y el coste por anotación de las llamadas a la API es típicamente órdenes de magnitud inferior a las tasas de trabajo humano.

### Dónde Funciona Bien la Anotación de LLM

- Tareas de clasificación simples y bien definidas (sentimiento, tema, intención)
- Tareas donde las etiquetas humanas codifican el consenso cultural que el LLM ha absorbido
- Tareas donde la anotación es consistente entre contextos (no muy subjetiva)
- Generación de anotaciones de primera pasada para revisión humana

### Dónde Falla la Anotación de LLM

- Tareas de dominio altamente especializado que requieren experiencia rara (médica, legal, científica)
- Tareas que requieren conocimiento cultural local o variación lingüística
- Tareas de seguridad y daño, donde el LLM puede estar mal calibrado en la misma dirección que los datos en los que fue entrenado
- Nuevos tipos de tareas no bien representados en el preentrenamiento

### RLAIF e IA Constitucional

Como se discutió en el Capítulo 6, la retroalimentación generada por IA puede usarse para entrenar modelos de recompensa y guiar el ajuste fino con RL. Esto crea un bucle de retroalimentación: los LLMs generan datos, los modelos se entrenan con ellos, y los modelos mejores generan mejores datos. La pregunta de cómo iniciar este bucle sin codificar errores sistemáticos del modelo inicial es un problema central de investigación abierta en la supervisión escalable.

---

## Supervisión Débil a Escala

El **etiquetado programático** mediante funciones de etiquetado (Capítulo 9) permite a los expertos en la materia expresar su conocimiento como código en lugar de como ejemplos etiquetados. Sistemas como Snorkel {cite}`ratner2017snorkel` y sus sucesores han madurado sustancialmente y ahora se usan en producción en las principales empresas tecnológicas.

**Direcciones de vanguardia:**
- **Funciones de etiquetado aumentadas por LLM:** Usar LLMs para generar funciones de etiquetado a partir de descripciones en lenguaje natural
- **Aprendizaje basado en segmentos:** Identificar subconjuntos críticos de los datos (segmentos) donde las funciones de etiquetado difieren y dirigir la anotación humana allí
- **Agregación consciente de la incertidumbre:** Mejores modelos estadísticos para combinar funciones de etiquetado con diferentes precisiones y correlaciones

---

## Aprendizaje Continuo con Supervisión Humana

La mayoría de los sistemas de aprendizaje automático se entrenan offline y se despliegan como modelos estáticos. El mundo real cambia; los modelos que eran precisos en el momento del despliegue se degradan a medida que la distribución de datos cambia.

El **aprendizaje continuo** —la capacidad de aprender de nuevos datos mientras se retiene el conocimiento antiguo— es un área de investigación activa. La supervisión humana es crítica: el aprendizaje continuo automatizado sin revisión humana puede codificar rápidamente cambios en la distribución que son errores en lugar de cambios genuinos en el mundo.

**El aprendizaje continuo HITL** implica:
- Monitorear el cambio de distribución (automatizado) y enrutar los ejemplos desplazados a la revisión humana
- Reentrenamiento selectivo: los ejemplos aprobados por humanos de la nueva distribución se agregan a los datos de entrenamiento
- Revisión humana de los cambios en el comportamiento del modelo después de cada actualización

---

## HITL Multimodal

A medida que los sistemas de IA se vuelven multimodales —procesando y generando texto, imágenes, audio y vídeo simultáneamente— la anotación se vuelve más compleja. Una sola pieza de contenido puede requerir anotación en múltiples modalidades, con dependencias entre ellas.

**Tipos de tareas emergentes:**
- Anotación de vídeo + transcripción (¿qué está pasando, quién habla, qué describe el texto visualmente?)
- Anotación de imagen médica + informe clínico
- Anotación de trayectoria robótica (vinculando datos de sensores a secuencias de acciones)

Los modelos de fundación multimodales (GPT-4V, Gemini, Claude) también están cambiando el panorama de la anotación aquí —los modelos ahora pueden interpretar imágenes y generar anotaciones candidatas, que los humanos revisan.

---

## Supervisión Escalable

Un problema fundamental abierto en el HITL ML es la **supervisión escalable** {cite}`irving2018ai,bowman2022measuring`: a medida que los sistemas de IA se vuelven más capaces que los humanos en dominios específicos, ¿cómo mantenemos una supervisión humana significativa?

Para tareas como la predicción de estructuras de proteínas, el análisis legal o la verificación de demostraciones matemáticas, incluso los anotadores expertos pueden no ser capaces de juzgar cuál de dos salidas de IA es correcta. Los métodos actuales de HITL se rompen cuando el juicio humano es menos fiable que el modelo que se evalúa.

**Enfoques propuestos {cite}`bowman2022measuring`:**

**Debate:** Dos sistemas de IA argumentan por diferentes conclusiones; un juez humano evalúa los argumentos en lugar de las conclusiones directamente. La conclusión correcta debería ser más defendible.

**Amplificación:** Los jueces humanos consultan asistentes de IA (el propio modelo) para ayudar a evaluar salidas complejas. Esto aprovecha las capacidades de la IA para extender la supervisión humana en lugar de reemplazarla.

**Supervisión del proceso:** En lugar de evaluar la salida final, los humanos evalúan el *proceso de razonamiento* —marcando los pasos defectuosos en una cadena de pensamiento, independientemente de si la respuesta final resulta ser correcta.

---

## La División del Trabajo en Evolución

La trayectoria a largo plazo del HITL ML apunta hacia una colaboración más fluida entre humanos e IA, donde ninguno es simplemente el "etiquetador" y el otro el "aprendiz", sino que ambos contribuyen a un proceso cognitivo compartido.

**Tendencias a seguir:**
- **Anotación asistida por IA:** La IA propone; los humanos deciden. La calidad mejora a medida que la IA propone mejores opciones.
- **Exploración guiada por humanos:** Los humanos establecen metas y restricciones; la IA explora el espacio de soluciones.
- **Evaluación colaborativa:** Los humanos y la IA evalúan conjuntamente las salidas complejas mediante el diálogo.
- **Aprendizaje de preferencias a escala:** Las señales implícitas (cómo los usuarios interactúan con las salidas de IA) alimentan el aprendizaje de preferencias continuo sin requerir sesiones de anotación explícitas.

La pregunta de cuánto confiar en el juicio de la IA frente al humano —y en qué dominios, a qué niveles de capacidad, con qué salvaguardas— es en última instancia una pregunta social, no solo técnica. El HITL ML proporciona la infraestructura técnica para responderla cuidadosamente, en lugar de por defecto.

---

## Problemas de Investigación Abiertos

Cerramos con una lista de problemas abiertos importantes en los que el campo está trabajando activamente:

1. **Parada óptima en el aprendizaje activo:** ¿Cuándo el valor marginal de la siguiente anotación está por debajo del coste? Las reglas de parada fundamentadas siguen siendo difíciles de obtener.

2. **Asignación del presupuesto de anotación entre tareas:** En entornos multitarea, ¿cómo debe dividirse un presupuesto fijo de anotación entre tareas?

3. **Cambio de distribución en el aprendizaje activo:** El aprendizaje activo crea conjuntos etiquetados sesgados. ¿Cómo pueden calibrarse adecuadamente los modelos entrenados de esta manera?

4. **Generalización del modelo de recompensa:** Los modelos de recompensa de RLHF pueden no generalizarse a pares consulta-respuesta novedosos. ¿Cómo podemos construir modelos de preferencia más robustos?

5. **Supervisión escalable:** ¿Cómo mantenemos la supervisión humana a medida que los sistemas de IA superan el rendimiento humano en dominios específicos?

6. **Modelado de anotadores:** Mejores modelos estadísticos para el comportamiento de los anotadores que capturen no solo la competencia sino también los sesgos sistemáticos, la experiencia temática y la fatiga.

7. **Evaluación de la alineación:** Carecemos de pruebas de verdad fundamental sobre si un modelo está alineado con los valores humanos. Desarrollar tales pruebas —análogas a los ejemplos adversariales para la robustez— es un problema abierto.

8. **Trabajo de datos justo:** Estructuras económicas e institucionales que garanticen que los trabajadores de anotación sean compensados justamente y protegidos, manteniendo al mismo tiempo la rentabilidad de la anotación a gran escala.

---

```{epigraph}
El objetivo no es reemplazar el juicio humano con el juicio de la máquina,
sino construir sistemas donde la combinación de ambos sea mejor que cualquiera de los dos por separado.
```

Las herramientas y técnicas de este manual —anotación, aprendizaje activo, RLHF, aprendizaje de preferencias, y todo lo demás— son los medios para ese fin. A medida que el campo evolucione, las técnicas específicas cambiarán. La aspiración subyacente —construir sistemas que sean a la vez capaces y genuinamente alineados con la intención humana— permanecerá.

```{seealso}
Supervisión escalable y debate: {cite}`bowman2022measuring`. Supervisión débil con Snorkel: {cite}`ratner2017snorkel`. Para el futuro amplio de la colaboración humano-IA, véase {cite}`amershi2019software`.
```
