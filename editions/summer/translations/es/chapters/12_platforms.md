# Plataformas y Herramientas de Anotación

La plataforma de anotación es el entorno donde la retroalimentación humana se convierte en datos. Una buena plataforma aumenta el rendimiento, reduce los errores, mantiene los controles de calidad y hace que la tubería de anotación sea manejable a escala. Elegir la plataforma adecuada —y saber cuándo construir frente a cuándo comprar— es una decisión trascendente en cualquier proyecto HITL.

---

## El Panorama de las Plataformas de Anotación

El mercado de herramientas de anotación ha crecido y madurado sustancialmente en los últimos años, impulsado por la demanda empresarial de datos de entrenamiento para aprendizaje automático. Las herramientas abarcan desde servicios completamente gestionados hasta marcos de código abierto autoalojados.

### Plataformas de Código Abierto

**Label Studio** es la plataforma de anotación de código abierto más popular, compatible con datos de texto, imágenes, audio, vídeo y series temporales a través de una configuración de tareas unificada basada en XML. Puede autoalojarse e integrarse con backends de aprendizaje automático para el aprendizaje activo. Principales fortalezas: flexibilidad, soporte de la comunidad y la capacidad de incrustar predicciones de aprendizaje automático personalizadas para la pre-anotación.

**Prodigy** (de los creadores de spaCy) es una herramienta de anotación muy orientada al flujo de trabajo, diseñada para tareas de PLN. Su arquitectura de streaming envía los ejemplos de uno en uno y admite el aprendizaje activo de forma nativa. La interfaz de anotación es mínima pero rápida —diseñada para maximizar el rendimiento de la anotación. Prodigy es software de pago pero ampliamente utilizado en la investigación de PLN.

**CVAT (Computer Vision Annotation Tool)** es la herramienta de código abierto líder para la anotación de visión por computadora, con sólido soporte para detección, segmentación y anotación de vídeo. Desarrollado originalmente en Intel, CVAT admite algoritmos de seguimiento, anotación de esqueletos e integraciones de algoritmos de terceros.

**Doccano** está orientado a las tareas de etiquetado de secuencias (NER, extracción de relaciones, clasificación de texto). Su sencilla interfaz web lo hace accesible para equipos sin recursos dedicados de ingeniería de datos.

### Plataformas Comerciales

**Scale AI** ofrece servicios de anotación gestionados de extremo a extremo: fuerza laboral humana, gestión de calidad e integración de API. Especialmente potente para conducción autónoma, robótica y anotación 3D compleja. El precio se basa en la complejidad y el volumen de las tareas.

**Labelbox** es una plataforma completa para la curación de datos, la anotación y el etiquetado asistido por aprendizaje automático. Potentes características empresariales: gestión de proyectos, flujos de trabajo de calidad, bucles de retroalimentación del modelo e integraciones con las principales plataformas de aprendizaje automático (SageMaker, Vertex AI, Azure ML).

**Appen** (anteriormente Figure Eight / CrowdFlower) opera una gran fuerza laboral global de anotación junto con herramientas. Una buena opción cuando el volumen y la gestión de la fuerza laboral son preocupaciones principales.

**Surge AI** se centra en anotadores expertos y es potente para tareas que requieren conocimiento del dominio o juicio matizado.

**Humanloop** se especializa en la recopilación de retroalimentación de LLM —anotación de preferencias, recopilación de datos de RLHF y evaluación de modelos.

---

## Comparación de Características de Plataformas de Anotación

| Característica | Label Studio | Prodigy | CVAT | Labelbox | Scale AI |
|---|---|---|---|---|---|
| Licencia | Código abierto | Comercial | Código abierto | Comercial | Comercial |
| Alojamiento | Propio / nube | Propio | Propio / nube | Nube | Gestionado |
| Anotación de texto | ✓ | ✓ | — | ✓ | ✓ |
| Anotación de imágenes | ✓ | Limitado | ✓ | ✓ | ✓ |
| Anotación de vídeo | ✓ | — | ✓ | ✓ | ✓ |
| Integración de aprendizaje activo | ✓ | ✓ | Limitado | ✓ | ✓ |
| Pre-anotación asistida por ML | ✓ | ✓ | ✓ | ✓ | ✓ |
| Flujos de trabajo de control de calidad | Básico | Básico | Básico | Avanzado | Avanzado |
| API / Acceso programático | ✓ | ✓ | ✓ | ✓ | ✓ |
| Gestión de la fuerza laboral | — | — | — | Limitado | ✓ |

---

## Anotación como Código

Un aspecto crítico pero a menudo ignorado de la infraestructura de anotación es el **control de versiones para las anotaciones y los esquemas de anotación**. Tratar la anotación como código significa:

**Diseño primero del esquema.** La taxonomía de etiquetas y las reglas de anotación se definen en un archivo de configuración versionado (YAML o JSON) antes de que comience la anotación. Los cambios en el esquema crean una nueva versión.

**Versionado de las anotaciones.** Las anotaciones se almacenan con un enlace a la versión del esquema bajo la que se crearon. Esto permite la auditoría, la reversión y la comparación de anotaciones entre versiones del esquema.

**Tuberías reproducibles.** La tubería de anotación —desde los datos crudos hasta las etiquetas listas para el entrenamiento— debería ser reproducible a partir del código. Los modelos de pre-anotación, los filtros de calidad, la lógica de agregación y las divisiones de datos deberían registrarse todos.

```yaml
# Example: Label Studio annotation schema (text classification)
label_config: |
  <View>
    <Text name="text" value="$text"/>
    <Choices name="sentiment" toName="text" choice="single">
      <Choice value="positive"/>
      <Choice value="negative"/>
      <Choice value="neutral"/>
      <Choice value="mixed"/>
    </Choices>
  </View>
schema_version: "2.1.0"
task_type: text_classification
guidelines_version: "guidelines_v3.pdf"
```text
Fuente de datos
    |
    v
Grupo no etiquetado --> Plataforma de anotación --> Conjunto de datos etiquetado
    ^                          |                              |
    |                          | (asistido por ML)            v
Estrategia de            <----+                         Ejecución de
consulta de                                             entrenamiento
aprendizaje activo                                           |
    ^                                                        v
    +---------- Modelo entrenado <-------------------- Evaluación
                                                            |
                                                     Despliegue y
                                                     monitorización
```

Puntos clave de integración:
1. **Ingesta de datos:** Los datos no etiquetados fluyen automáticamente desde el almacén de datos a la plataforma de anotación
2. **Servicio del modelo:** El mejor modelo actual se despliega en la plataforma de anotación para la pre-anotación y la puntuación del aprendizaje activo
3. **Exportación:** Las anotaciones completadas se exportan en un formato compatible con el marco de entrenamiento (COCO JSON, conjuntos de datos de Hugging Face, etc.)
4. **Bucle de retroalimentación:** Los errores del modelo en producción se enrutan de vuelta a la plataforma de anotación para su corrección

```{seealso}
Para la documentación de Label Studio y la integración del aprendizaje activo: https://labelstud.io. Para Prodigy: https://prodi.gy. CVAT: https://cvat.ai. Para una comparación exhaustiva de las herramientas de anotación, véase {cite}`monarch2021human`, Capítulo 7.
```
