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

# Una Taxonomía de la Interacción Humano–Máquina

Un vocabulario preciso es el requisito previo para un pensamiento claro. El término "humano en el bucle" se utiliza de manera imprecisa en la práctica —a veces para significar que un humano etiqueta los datos de entrenamiento, a veces que un humano puede invalidar la decisión de un modelo, y a veces que un humano está dirigiendo activamente el proceso de aprendizaje en tiempo real. Estas son cosas significativamente diferentes.

Este capítulo traza el paisaje de la interacción humano–máquina en aprendizaje automático, proporcionando el vocabulario conceptual utilizado a lo largo del resto del manual.

---

## Niveles de Automatización

La distinción más fundamental es la intensidad con que el humano participa en la toma de decisiones del sistema. Un marco bien conocido de la teoría de la automatización {cite}`sheridan1992telerobotics` distingue diez niveles, pero para los propósitos del aprendizaje automático tres categorías capturan la variación más importante:

### Humano en el Bucle (HITL)

El humano es un *participante activo en el proceso de aprendizaje*. Las decisiones —o al menos las decisiones relevantes— requieren intervención humana antes de ser finalizadas. El sistema no puede operar sin el compromiso humano continuo.

*Ejemplos:* Un sistema de aprendizaje activo que consulta a un médico antes de agregar un caso a los datos de entrenamiento. Un anotador de datos que etiqueta ejemplos utilizados inmediatamente para actualizar el modelo. Un anotador de RLHF que compara salidas del modelo.

### Humano Sobre el Bucle (HOTL)

El sistema opera de manera autónoma pero un humano lo supervisa y puede intervenir. El humano es un *supervisor*, no un participante. La retroalimentación puede o no puede retroalimentarse al entrenamiento.

*Ejemplos:* Un sistema de moderación de contenido que marca publicaciones automáticamente; un revisor humano muestrea y corrige una fracción de las decisiones. Un piloto automático que vuela el avión pero alerta al piloto sobre anomalías.

### Humano al Mando (HIC)

El humano toma todas las decisiones; el sistema proporciona *recomendaciones o información* pero no tiene autonomía. Esta es la forma más débil de despliegue de aprendizaje automático.

*Ejemplos:* Un sistema de apoyo diagnóstico que muestra al médico la estimación de probabilidad del modelo pero deja la decisión final enteramente al facultativo.

```{admonition} ¿Qué nivel es el adecuado?
:class: tip

El nivel apropiado de automatización depende del coste de los errores, la fiabilidad del modelo, la experiencia de los humanos disponibles y las restricciones de latencia de la tarea. Estos factores cambian a medida que el modelo madura —la mayoría de los sistemas comienzan en HITL y migran hacia HOTL a medida que crece la confianza.
```

```text
Datos crudos --> Preprocesamiento --> Características --> Entrenamiento --> Evaluación --> Despliegue
     ^                 ^                                      ^                 ^               ^
     |                 |                                      |                 |               |
 Recopilación      Anotación                            Aprendizaje        Pruebas de     Supervisión
  feedback         y etiquetado                          activo            retroalim.      y corrección
```

| Etapa          | Papel humano                                              | Capítulo |
|----------------|-----------------------------------------------------------|---------|
| Recopilación   | Decidir qué datos recopilar; estrategia de muestreo       | 3, 4    |
| Anotación      | Asignar etiquetas, estructuras, metadatos                 | 3, 13   |
| Entrenamiento  | Consultas de aprendizaje activo; retroalimentación online | 4, 5, 6 |
| Evaluación     | Evaluación humana de salidas del modelo                   | 14      |
| Despliegue     | Supervisión, manejo de excepciones, correcciones          | 12, 14  |

---

## Participación Activa Frente a Pasiva

En HITL *activo*, el sistema selecciona qué puntos de datos presentar al humano —formulando preguntas estratégicamente. En HITL *pasivo*, el humano proporciona retroalimentación sobre los datos que llegan (por ejemplo, lotes de etiquetado de datos asignados secuencialmente).

La participación activa es más eficiente porque la retroalimentación se dirige donde más mejorará el modelo. La participación pasiva es más sencilla de implementar y gestionar.

Una distinción relacionada es entre retroalimentación **por lotes** y **en línea**:

- **Por lotes:** Los humanos etiquetan un gran grupo de ejemplos; el modelo se reentrena. Se repite.
- **En línea (streaming):** La retroalimentación humana llega continuamente; el modelo se actualiza de manera incremental.

Los flujos de trabajo por lotes son la norma en la industria (proyectos de anotación seguidos de ciclos de entrenamiento). Los flujos de trabajo en línea son más naturales para sistemas interactivos y entornos de aprendizaje por refuerzo.

---

## Anotador Único Frente a Múltiples Anotadores

La mayoría de las presentaciones formales de HITL asumen un único anotador consistente. En la práctica, la anotación involucra a muchas personas, y sus juicios difieren.

La **agregación** combina múltiples anotaciones en una sola etiqueta, típicamente mediante votación mayoritaria o un modelo estadístico (Capítulo 13).

**El desacuerdo como señal** —algunos investigadores sostienen que el desacuerdo entre anotadores es información valiosa que no debería comprimirse en una única etiqueta "dorada". Los enfoques perspectivistas del PLN, por ejemplo, preservan múltiples anotaciones como etiquetas suaves que reflejan la genuina ambigüedad de los datos {cite}`uma2021learning`.

---

## Un Marco Unificado

Podemos representar cualquier configuración HITL con una 5-tupla:

$$
\text{Configuración HITL} = (\text{nivel}, \text{modalidad}, \text{etapa}, \text{frecuencia}, \text{anotadores})
$$

donde:

- **nivel** $\in$ {HITL, HOTL, HIC}
- **modalidad** $\in$ {etiqueta, corrección, demostración, preferencia, lenguaje natural, implícita}
- **etapa** $\in$ {recopilación, anotación, entrenamiento, evaluación, despliegue}
- **frecuencia** $\in$ {lotes, en línea}
- **anotadores** $\in \mathbb{N}^+$ (número de anotadores por elemento)

Esta taxonomía nos permite comparar sistemas HITL diversos en los mismos ejes y razonar sobre los compromisos entre ellos. El resto del manual profundiza en celdas específicas de este espacio.

```{seealso}
Para un estudio empírico de cómo las decisiones de anotación afectan el comportamiento del modelo aguas abajo, véase {cite}`bender2021stochastic`. Para una encuesta de sistemas de aprendizaje automático interactivo, véase {cite}`amershi2014power`.
```
