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

# Caso de Estudio: Limen — Un Humano en el Bucle de Todo

:::{admonition} Nota sobre este capítulo
:class: important
Este capítulo es un **ensayo de diseño especulativo**, no un estudio empírico ni una contribución revisada por pares. Describe una arquitectura de sistema imaginada —Limen, un sistema operativo de escritorio de voz primero y nativo de IA— como ejemplo trabajado de cómo los principios HITL de los capítulos precedentes podrían componerse en un conjunto coherente. Las afirmaciones aquí son argumentos de diseño, no resultados experimentales. Deben leerse como razonamiento de diseño motivado, no como hallazgos de ingeniería validados.
:::

Cada capítulo de este manual ha descrito el HITL ML como una filosofía de diseño: un conjunto de principios para hacer la participación humana en los sistemas de aprendizaje deliberada, eficiente y honesta. Este capítulo describe cómo se ve aplicar esa filosofía como principio fundamental —no a un único sistema, sino a un entorno operativo completo.

**Limen** es un sistema operativo de escritorio de voz primero y nativo de IA construido sobre la premisa de que el humano siempre está en el bucle, no como una restricción que hay que optimizar para eliminar, sino como el principio organizador alrededor del cual se diseña cada subsistema. El nombre se elige deliberadamente: *limen* es la palabra latina para umbral. En psicología perceptual, el limen es la frontera entre lo que se percibe y lo que no. Para un sistema operativo, el limen es la frontera entre la intención humana y la acción de la máquina.

La arquitectura aquí descrita no es propietaria. Es un conjunto de decisiones de diseño, cada una de las cuales se sigue naturalmente de los principios HITL desarrollados en los capítulos precedentes. El objetivo no es documentar un producto sino mostrar cómo se componen esos principios —cómo se refuerzan mutuamente cuando se aplican consistentemente, y qué tipos de sistemas se vuelven posibles cuando el humano no es una idea de último momento.

---

## El Problema con el Diseño Convencional de Sistemas Operativos

Un sistema operativo convencional no está diseñado para los humanos. Está diseñado para los programas. El humano es acomodado a través de una capa de abstracción —una interfaz gráfica, un explorador de archivos, una terminal— que se asienta sobre un sustrato construido para procesos, direcciones de memoria y descriptores de archivos.

Esta decisión de diseño está históricamente justificada. Cuando se tomaron los supuestos que la produjeron, las computadoras eran caras, los humanos eran baratos y el cuello de botella era la computación. El objetivo de optimización correcto era la máquina.

Esos supuestos ya no son válidos. El cuello de botella, para la mayoría de los usuarios en la mayoría de las tareas, no es la computación. Es la atención humana: el coste del cambio de contexto, de buscar el archivo correcto, de construir la consulta correcta, de recordar dónde estaba algo. La máquina es rápida. El humano es lento. La interfaz debería optimizar el lado del humano del bucle.

Los sistemas operativos convencionales no hacen esto. Están optimizados para los programas, y el trabajo del humano es hablar el lenguaje de los programas. Limen invierte esto. Los programas hablan el lenguaje del humano. El humano está en el bucle, y el bucle está diseñado para ajustarse al humano.

---

## Arquitectura en el Umbral

La arquitectura de Limen está organizada alrededor de un principio único: **cada interacción es un evento**, y cada evento es una oportunidad para que el humano enseñe, corrija o confirme. El sistema no espera sesiones de entrenamiento explícitas. El aprendizaje es continuo y ambiental.

### La Capa de Eventos: WID

En la base se encuentra **WID** (el sistema Waldiez ID, adaptado para la arquitectura local primero de Limen) —un sistema de seguimiento de eventos consciente de la causalidad que registra no solo lo que sucedió, sino lo que lo causó, y lo que a su vez causó.

El registro convencional pregunta: *¿qué sucedió?* WID pregunta: *¿por qué sucedió, y qué siguió?* Cada evento lleva un linaje causal —una cadena desde la acción humana desencadenante a través de los estados intermedios del sistema hasta el resultado observado.

Esto importa para el aprendizaje HITL porque resuelve el **problema de asignación de crédito** a nivel de interacción. Cuando un usuario corrige el comportamiento del sistema, WID puede identificar no solo la salida inmediata que era errónea, sino la cadena de decisiones que la produjo. Las correcciones pueden aplicarse al nivel correcto de abstracción: la salida, la regla de decisión, o la señal ascendente.

Este es el equivalente a nivel de sistema operativo de lo que el Capítulo 6 describe para RLHF: la capacidad de trazar una señal de recompensa a través de una secuencia de decisiones. WID proporciona ese rastreo de manera nativa, para cada interacción, sin requerir que el usuario lo entienda.

:::{admonition} Seguimiento Causal de Eventos como Infraestructura HITL
:class: note
El diseño de WID refleja un principio más amplio: la infraestructura HITL debería hacer fácil preguntar "¿por qué el sistema hizo eso?" —no solo "¿qué hizo?". Sin rastreo causal, las correcciones arreglan síntomas. Con él, pueden arreglar causas. La diferencia entre un parche y una lección.
:::

### La Capa de Percepción: Voz Primero

La modalidad de entrada principal de Limen es la voz, procesada localmente usando una tubería de inferencia Whisper ONNX. Las razones de esta elección merecen enunciarse explícitamente:

**La voz es el canal de salida humano más natural para la mayoría de las personas.** No requiere entrenamiento, destreza física más allá del habla ordinaria, ni conocimiento de la organización interna del sistema. Un usuario que no puede localizar un archivo en una jerarquía de directorios puede describir lo que está buscando.

**El procesamiento local preserva la privacidad.** Los datos de voz no salen del dispositivo. Esto importa éticamente —la voz es datos biométricos, y su recopilación a escala por proveedores de nube es un daño documentado— y prácticamente: la operación sin conexión significa que el sistema permanece funcional sin una conexión de red.

**La voz crea un bucle de retroalimentación natural.** Cuando el sistema responde, la reacción del usuario —seguir hablando, reformular, decir "no, eso no es correcto"— es en sí misma una señal. Limen trata estas reacciones como retroalimentación HITL: evidencia sobre si la interpretación del sistema de la emisión anterior era correcta.

La cadena de repuesto importa tanto como la modalidad principal. Cuando la voz falla —en un entorno ruidoso, para un usuario con una discapacidad del habla, para una entrada que se beneficia de la precisión— Limen se degrada elegantemente a una interfaz de teclado y luego a una interfaz de texto estructurado. La Prueba de la Abuela (véase el Capítulo 5) no es una idea de accesibilidad de último momento; es una restricción arquitectónica de primera clase.

### La Capa de Inteligencia: Enrutamiento Multi-LLM

Limen no depende de un único modelo de lenguaje. Enruta las solicitudes a través de un árbol de decisión estructurado basado en el tipo de tarea, la latencia requerida, los requisitos de privacidad y la confianza:

1. **Modelo pequeño local** (siempre primero): rápido, privado, maneja las tareas rutinarias —"abrir el archivo que estaba editando ayer", "poner un temporizador", "¿qué tiempo hace?"
2. **Modelo grande local** (cuando la confianza del modelo pequeño es baja): más lento pero más capaz; maneja el razonamiento estructurado, la generación de código, la recuperación compleja
3. **Modelo remoto** (cuando el local falla y el usuario ha otorgado permiso): la salida de emergencia; manejada de manera transparente con notificación explícita al usuario

Esta estructura no es novedosa —es el equivalente en tiempo de inferencia de la estrategia de consulta del aprendizaje activo descrita en el Capítulo 4. En cada paso, el sistema pregunta: ¿es mi modelo actual suficiente para responder esta consulta con una confianza aceptable? Si no, escalar. La escalada es un coste (latencia, privacidad, computación); se incurre solo cuando es necesario.

El humano está en el bucle en la frontera de escalada. Un usuario que ha configurado Limen para que nunca escale a modelos remotos ha tomado una decisión HITL —que el sistema respeta y registra. Un usuario que aprueba una consulta remota y luego dice "no me preguntes de nuevo para este tipo de solicitud" ha proporcionado una preferencia que actualiza la política de enrutamiento.

---

## El Diseño de Interacción

### Inmediatez

Limen está diseñado para la inmediatez en el sentido que el Capítulo 5 define: el usuario percibe el efecto de su retroalimentación. Cuando el usuario corrige una salida del sistema, la corrección se aplica de inmediato y de manera visible. El modelo no se va y entrena durante veinte minutos. Se actualiza en la sesión actual.

Esto requiere usar arquitecturas de modelos que admitan actualizaciones en línea eficientes —adaptadores, ajuste de prefijos y generación aumentada por recuperación en lugar de ajuste fino completo. El compromiso es explícito: las actualizaciones en línea son más ruidosas que el entrenamiento por lotes. Limen acepta este compromiso porque la inmediatez es el requisito principal: el humano siempre puede confirmar, rechazar o refinar la actualización.

### Inteligibilidad

Un tema recurrente en la literatura IML es el **requisito de inteligibilidad**: los humanos solo pueden guiar a un modelo que comprenden, al menos aproximadamente. Limen lo plasma en la interfaz: cuando el sistema toma una decisión, explica brevemente por qué. No una traza de razonamiento completa —eso abrumaría a la mayoría de los usuarios— sino un resumen en lenguaje natural del factor clave: "Estoy abriendo el proyecto en el que trabajaste más recientemente —¿es eso correcto?"

Esta explicación es también una pregunta. Invita a la corrección. Hace visible la inferencia del modelo para que el usuario pueda redirigirla si está equivocada. La explicación no se genera por razones estéticas; es infraestructura HITL funcional.

### Consistencia y Deriva

Un problema que surge en cualquier sistema interactivo de larga duración es la **deriva de comportamiento**: el comportamiento del sistema en el tiempo $T+n$ es sutilmente diferente de su comportamiento en el tiempo $T$, de maneras que ni el usuario ni el sistema eligieron explícitamente. Las correcciones se acumulan. Los casos límite se componen. El modelo que estaba alineado con las preferencias del usuario el mes pasado puede ya no estarlo hoy.

Limen aborda esto mediante comprobaciones de consistencia periódicas —el equivalente a nivel de sistema operativo de la técnica de re-presentación descrita en el Capítulo 13. El sistema saca a relucir decisiones históricas ante el usuario: "Hace unas semanas, me pediste que hiciera X. ¿Sigue siendo eso lo que querrías?" Estas comprobaciones sirven dos funciones: detectan la deriva y recuerdan al usuario las preferencias que puede haber olvidado especificar.

---

## Limen como Sistema HITL

Mirando la arquitectura de Limen a través del prisma de este manual, las decisiones de diseño se corresponden directamente con los conceptos desarrollados en cada parte.

**Parte I (Fundamentos):** Limen trata cada interacción como un evento de interacción humano–máquina. No existe un "modo sin HITL" —el sistema siempre está aprendiendo, siempre atribuyendo, siempre esperando a que un humano participe.

**Parte II (Técnicas Fundamentales):** El aprendizaje activo se manifiesta como la cadena de escalada basada en confianza. El aprendizaje automático interactivo se manifiesta en el ciclo de actualización en tiempo real. La anotación es implícita: cada corrección que hace el usuario es una etiqueta.

**Parte III (Aprendizaje a partir de Retroalimentación Humana):** El aprendizaje de preferencias descrito en el Capítulo 8 aparece en las actualizaciones de la política de enrutamiento. Cuando un usuario prefiere la respuesta de un modelo local a la de uno remoto, esa preferencia se registra y generaliza. RLHF en un sistema operativo personal significa que el modelo de recompensa es privado, individual y continuamente actualizado.

**Parte IV (Aplicaciones):** Limen es un entorno de propósito general, pero su diseño es más visible en los dominios donde el juicio del humano es insustituible y el coste del error es alto —redacción de documentos, priorización de tareas, trabajo creativo.

**Parte V (Sistemas y Práctica):** WID es la plataforma de anotación de Limen. Es invisible para el usuario en operación normal, visible cuando se necesita para la depuración o la transparencia. Los mecanismos de control de calidad (comprobaciones de consistencia, umbrales de confianza, registros de escalada) están tomados directamente de la bibliografía sobre crowdsourcing.

**Parte VI (Ética):** El diseño local primero y de preservación de la privacidad es una elección ética, no solo técnica. Los datos del humano no salen de su dispositivo sin su consentimiento explícito. El modelo que aprende del comportamiento de un usuario pertenece a ese usuario.

---

## El Punto Más Profundo

Limen no es una presentación de producto. Es un argumento por construcción.

El argumento es este: si se toman en serio los principios del HITL ML —si se cree que la retroalimentación humana es una señal que hay que entender en lugar de un coste a minimizar, que el humano siempre está en el bucle incluso cuando los diseñadores pretenden lo contrario, que la alineación es un proceso continuo en lugar de un evento único— entonces uno acaba construyendo algo que se parece a Limen.

No necesariamente Limen específicamente. La pila tecnológica específica (Tauri, Rust, Babylon.js, Whisper ONNX) es una elección entre muchas. Pero la arquitectura —seguimiento causal de eventos, procesamiento local primero, degradación elegante, aprendizaje de preferencias continuo, transparencia como característica de primera clase— se sigue de los principios.

El campo del HITL ML ha dedicado una energía considerable a describir cómo poner a los humanos en el bucle de modelos específicos y tareas específicas. La siguiente pregunta es si podemos diseñar *entornos* enteros en torno a los mismos principios: entornos donde el humano sea siempre el centro, la máquina sea siempre el aprendiz y el bucle esté siempre abierto.

Limen es una respuesta a esa pregunta.

El umbral no es algo que se cruza y se deja atrás. Es donde se vive.

---

```{seealso}
Los principios IML que sustentan el diseño de interacción de Limen se desarrollan en el Capítulo 5. El enfoque de aprendizaje de preferencias detrás de la política de enrutamiento se formaliza en el Capítulo 8. El modelo de causalidad de WID se basa en la bibliografía de atribución de eventos estudiada en el Capítulo 14. La Prueba de la Abuela, introducida en el Capítulo 5, es la principal restricción de diseño de interfaz de Limen.
```
