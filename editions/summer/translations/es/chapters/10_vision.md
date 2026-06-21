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

# HITL en Visión por Computadora

La visión por computadora ofrece algunos de los ejemplos más visualmente intuitivos de HITL ML. El desafío ImageNet, construido sobre 14 millones de imágenes etiquetadas por humanos, lanzó la era del aprendizaje profundo. La anotación de imágenes médicas por radiólogos impulsa la IA diagnóstica. Los vehículos autónomos dependen de millones de fotogramas etiquetados por humanos para aprender a percibir el mundo.

Lo que es fácil pasar por alto: estos no son simplemente casos de humanos proporcionando verdad fundamental. Son casos de humanos construyendo conjuntos de datos que incorporan decisiones perceptuales, culturales y operativas específicas —decisiones que solo se vuelven visibles más tarde, cuando los modelos fallan de maneras predecibles.

---

## Cómo las Decisiones de Anotación Se Convierten en Sesgos del Modelo

El encuadre estándar trata la anotación como recopilación de datos: los humanos observan el mundo y registran lo que ven. El encuadre más preciso es que la anotación es *diseño de conjuntos de datos*: los humanos deciden qué categorías usar, dónde trazar los límites, qué casos límite incluir y cómo resolver la ambigüedad —y todas esas decisiones conforman lo que el modelo entrenado percibirá.

### El Caso de ImageNet

ImageNet {cite}`russakovsky2015imagenet` es el conjunto de datos más consecuente en la historia de la visión por computadora. Su conjunto de etiquetas deriva de los synsets de WordNet, elegidos principalmente por ser numerosos y semánticamente distintos. Varias consecuencias de esta elección de diseño emergieron años después:

- **Las categorías de personas codificaban asociaciones demográficas.** Las primeras versiones de las etiquetas de synset de ImageNet para personas incluían muchas que ahora se considerarían despectivas o sesgadas, reflejando tanto la fuente histórica de WordNet como las decisiones implícitas de la fuerza laboral de anotación sobre qué etiquetas aplicar a qué imágenes {cite}`yang2020towards`. Las etiquetas aplicadas a imágenes de personas codificaban asociaciones de raza, género y clase que se propagaron directamente a las representaciones del modelo.

- **Taxonomía de especies de grano fino, de casi todo lo demás de grano grueso.** ImageNet puede distinguir 120 razas de perros pero colapsa una enorme variación en herramientas, vehículos, alimentos y muebles en categorías únicas. Esto fue consecuencia de seguir la estructura de WordNet, no una elección deliberada sobre lo que importa. Los modelos entrenados en ImageNet exhiben la misma precisión asimétrica.

- **Valores visuales predeterminados del mundo occidental de habla inglesa.** Las imágenes se recopilaron principalmente de Flickr y búsquedas en internet usando consultas en inglés. La distribución resultante se inclina fuertemente hacia el entorno visual y los objetos culturales de los países ricos de habla inglesa.

Ninguno de estos fue un error. Fueron decisiones de diseño de anotación tomadas rápidamente a escala, a menudo por personas que no anticiparon cómo se usaría el conjunto de datos. La lección no es que ImageNet debería haberse construido diferente (aunque así debería haber sido), sino que **el diseño de la anotación es diseño del modelo**, y debería tratarse con el mismo cuidado.

:::{admonition} El esquema de anotación es una teoría del mundo
:class: note

Todo taxonomía de etiquetas hace afirmaciones sobre qué distinciones importan. Elegir separar "coche" de "camión" mientras se colapsan todos los sedanes en una clase es una afirmación teórica sobre qué distinciones son semánticamente relevantes. Elegir anotar "persona" como una única clase independientemente de la pose, la ropa o la actividad es una afirmación teórica diferente. Los modelos entrenados en estos esquemas harán las mismas distinciones, y no más —no generalizarán más allá de las categorías para las que fueron entrenados a distinguir.
:::

---

## Anotación de Clasificación de Imágenes

La tarea de anotación de visión por computadora más simple es asignar una o más etiquetas a una imagen completa.

**Jerarquía de etiquetas.** La etiqueta "perro" es hija de "animal" en una jerarquía semántica. Los modelos entrenados en taxonomías planas pueden no generalizar bien entre niveles de abstracción. ImageNet usa una jerarquía basada en synsets que permite la evaluación en múltiples niveles de especificidad.

**Ambigüedad multietiqueta.** Una escena urbana puede contener simultáneamente un coche, una persona, una bicicleta y un semáforo. Decidir qué etiquetas incluir requiere directrices claras sobre los umbrales de relevancia.

**Distribuciones de cola larga.** Los conjuntos de datos de imágenes naturales siguen una ley de potencia: pocas categorías son extremadamente comunes; la mayoría son raras. El aprendizaje activo es particularmente valioso para las categorías de cola larga donde el muestreo aleatorio produce solo un puñado de ejemplos.

---

## Detección de Objetos: Anotación con Cajas Delimitadoras

La detección de objetos requiere que los anotadores dibujen cajas delimitadoras alineadas con los ejes alrededor de instancias de cada clase de objeto. Esto introduce requisitos de precisión geométrica y casos límite significativos.

**Métricas de calidad de anotación:**

*IoU (Intersección sobre la Unión)* mide la superposición entre una caja anotada y una caja de referencia:

$$
\text{IoU}(A, B) = \frac{|A \cap B|}{|A \cup B|}
$$

$\text{IoU} \geq 0{,}5$ es el umbral estándar para una detección "correcta" en PASCAL VOC; COCO {cite}`lin2014microsoft` usa un rango de umbrales de 0,5 a 0,95, lo cual es considerablemente más exigente e informativo.

**Casos límite de anotación que deben resolverse en las directrices:**
- Objetos ocluidos: ¿anotar la porción visible o extrapolar la extensión completa?
- Objetos truncados (parcialmente fuera del fotograma): ¿incluir o excluir?
- Regiones de multitud: ¿usar una anotación especial de "multitud" o anotar instancias individuales?

Cada una de estas decisiones cambia lo que significa "detección correcta" —y, por tanto, cambia para qué se entrena el modelo.

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def compute_iou(boxA, boxB):
    """Compute IoU between two boxes [x1, y1, x2, y2]."""
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    inter_area = max(0, xB - xA) * max(0, yB - yA)
    boxA_area = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    boxB_area = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
    union_area = boxA_area + boxB_area - inter_area
    return inter_area / (union_area + 1e-6)

ref_box  = [1.0, 1.0, 4.0, 4.0]
ann1_box = [1.1, 0.9, 4.1, 4.2]   # close
ann2_box = [0.5, 0.5, 3.5, 3.8]   # less precise

print(f"IoU (ann1 vs ref):  {compute_iou(ann1_box, ref_box):.3f}")
print(f"IoU (ann2 vs ref):  {compute_iou(ann2_box, ref_box):.3f}")
print(f"IoU (ann1 vs ann2): {compute_iou(ann1_box, ann2_box):.3f}")

fig, ax = plt.subplots(figsize=(5, 5))
ax.set_xlim(0, 5); ax.set_ylim(0, 5); ax.set_aspect('equal')
ax.add_patch(patches.Rectangle(
    (ref_box[0], ref_box[1]), ref_box[2]-ref_box[0], ref_box[3]-ref_box[1],
    linewidth=2.5, edgecolor='#2b3a8f', facecolor='none', label='Reference'))
ax.add_patch(patches.Rectangle(
    (ann1_box[0], ann1_box[1]), ann1_box[2]-ann1_box[0], ann1_box[3]-ann1_box[1],
    linewidth=2, edgecolor='#0d9e8e', facecolor='none', linestyle='--',
    label=f'Ann1 (IoU={compute_iou(ann1_box, ref_box):.2f})'))
ax.add_patch(patches.Rectangle(
    (ann2_box[0], ann2_box[1]), ann2_box[2]-ann2_box[0], ann2_box[3]-ann2_box[1],
    linewidth=2, edgecolor='#e05c5c', facecolor='none', linestyle=':',
    label=f'Ann2 (IoU={compute_iou(ann2_box, ref_box):.2f})'))
ax.legend(fontsize=10)
ax.set_title("Bounding Box Agreement (IoU)", fontsize=12)
plt.tight_layout()
plt.savefig('bbox_iou.png', dpi=150)
plt.show()
```

---

## Segmentación Semántica y de Instancias

La anotación de segmentación requiere asignar una etiqueta de clase a cada píxel de una imagen —uno de los tipos de anotación más costosos.

**Segmentación semántica:** Cada píxel pertenece a una clase semántica (carretera, cielo, persona, coche). Todos los píxeles de la misma clase comparten la misma etiqueta, independientemente del objeto individual al que pertenezcan.

**Segmentación de instancias:** Cada instancia individual de objeto obtiene una etiqueta única. Una multitud de 20 personas se convierte en 20 máscaras distintas.

**Segmentación panóptica:** Combina ambas: las clases "cosa" (objetos contables) tienen máscaras de instancia; las clases "material" (carretera, cielo) tienen máscaras semánticas.

**Anotación asistida por SAM:** El Modelo Segment Anything (SAM) de Meta {cite}`kirillov2023segment` genera máscaras de segmentación de alta calidad a partir de un único clic sobre un punto. Los anotadores hacen clic en el centro de un objeto; SAM propone una máscara; el anotador acepta o corrige. Los autores de SAM reportan aceleraciones del motor de anotación de aproximadamente 6,5 veces respecto al etiquetado basado en polígonos; las ganancias varían según el tipo de escena y la herramienta de anotación.

SAM representa un cambio más amplio: **el papel del anotador cambia de dibujar a revisar**. Esto tiene implicaciones para la calidad de la anotación más allá de la velocidad. Cuando los anotadores dibujan, su atención está comprometida durante todo el proceso. Cuando los anotadores revisan y hacen clic en "aceptar", hay evidencia de que pasan por alto errores más fácilmente —una versión del sesgo de automatización específica del contexto de anotación.

---

## Aprendizaje Activo para Visión por Computadora

El aprendizaje activo es particularmente valioso en visión por computadora porque:
1. Las imágenes son de alta dimensionalidad y ricas en características —las representaciones de modelos preentrenados llevan señales fuertes para la estimación de incertidumbre
2. Los grandes grupos no etiquetados son baratos (fotos, fotogramas de vídeo)
3. La anotación (especialmente la segmentación) es costosa y no puede crowdsourcing fácilmente en dominios especializados

```{code-cell} python
import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

X, y = make_classification(n_samples=3000, n_features=50, n_informative=25,
                            n_classes=5, n_clusters_per_class=2, random_state=42)
X_train, y_train = X[:2500], y[:2500]
X_test,  y_test  = X[2500:], y[2500:]

def margin_uncertainty(model, X_pool):
    probs = model.predict_proba(X_pool)
    sorted_p = np.sort(probs, axis=1)
    return sorted_p[:, -2] - sorted_p[:, -1]  # most negative = most uncertain

n_init = 50
results = {'active': [], 'random': []}
label_counts = list(range(50, 401, 30))

for strategy in ['active', 'random']:
    labeled = list(rng.choice(len(X_train), n_init, replace=False))
    unlabeled = [i for i in range(len(X_train)) if i not in labeled]

    for target in label_counts:
        while len(labeled) < target and unlabeled:
            if strategy == 'active' and len(labeled) >= 10:
                model_temp = LogisticRegression(max_iter=300).fit(
                    X_train[labeled], y_train[labeled])
                margins = margin_uncertainty(model_temp, X_train[unlabeled])
                idx = int(np.argmin(margins))
            else:
                idx = rng.integers(0, len(unlabeled))
            labeled.append(unlabeled.pop(idx))

        clf = LogisticRegression(max_iter=300).fit(X_train[labeled], y_train[labeled])
        results[strategy].append(accuracy_score(y_test, clf.predict(X_test)))

plt.figure(figsize=(7, 4))
plt.plot(label_counts, results['active'], 'o-', color='#2b3a8f',
         linewidth=2, label='Active (margin sampling)')
plt.plot(label_counts, results['random'], 's--', color='#e05c5c',
         linewidth=2, label='Random baseline')
plt.xlabel("Labeled training images", fontsize=12)
plt.ylabel("Test accuracy", fontsize=12)
plt.title("Active Learning for 5-Class Image Classification", fontsize=13)
plt.legend(fontsize=11); plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('cv_active_learning.png', dpi=150)
plt.show()
```

---

## Aprendizaje Semisupervisado con Guía Humana

La gran cantidad de datos visuales no etiquetados disponibles hace que el aprendizaje semisupervisado sea particularmente atractivo para la visión por computadora.

**Autoentrenamiento / pseudoetiquetado:** Entrenar un modelo con datos etiquetados; usar predicciones de alta confianza sobre datos no etiquetados como pseudoetiquetas; reentrenar. La pregunta de diseño crítica es el umbral de confianza. Un umbral bajo incorpora más ejemplos pero introduce ruido; un umbral alto deja la mayor parte del grupo no etiquetado sin usar. La participación humana puede guiar este umbral —los anotadores verifican una muestra de ejemplos pseudoetiquetados para calibrarlo.

**FixMatch y regularización de consistencia:** Estos métodos entrenan modelos para producir predicciones consistentes bajo aumentación. La clave del HITL: los humanos no son consultados solo para las etiquetas sino también para el **diseño de la aumentación** —¿qué invariancias debería aprender el modelo? Un modelo para imágenes médicas debería ser invariante a la rotación y el brillo pero no a la escala; un modelo para detección de texto no debería hacerse invariante a la distorsión de perspectiva. Estas elecciones específicas del dominio requieren experiencia humana, y equivocarse en ellas degrada sustancialmente el aprendizaje semisupervisado.

**Aprendizaje activo semisupervisado:** La combinación más eficiente: el aprendizaje activo concentra las etiquetas humanas donde la incertidumbre del modelo es mayor; el autoentrenamiento autoetiqueta la cola de alta confianza. El esfuerzo humano se concentra donde es más valioso, y el modelo arranca con el resto. En cada ciclo, una auditoría humana de una muestra aleatoria de pseudoetiquetas proporciona un control de calidad sin requerir una revisión completa.

---

## Anotación de Vídeo

La anotación de vídeo multiplica los desafíos de la anotación de imágenes por el tiempo:

- **Seguimiento:** Los objetos deben identificarse entre fotogramas. Los anotadores etiquetan fotogramas clave; los algoritmos de seguimiento interpolan entre ellos. Los fallos de seguimiento —oclusión, reentrada, movimiento rápido— requieren reetiquetado humano a tasas más altas que el seguimiento en estado estacionario.
- **Consistencia temporal:** Los límites trazados en el fotograma $t$ deben ser espacialmente consistentes con el fotograma $t+1$. Las anotaciones inconsistentes son una señal de entrenamiento que dice al modelo que los objetos saltan discontinuamente —una forma de ruido de anotación particularmente dañina para los modelos de detección.
- **Escalabilidad:** Un vídeo de 1 hora a 30 fps son 108.000 fotogramas. La anotación completa es impracticable; las estrategias de muestreo deben diseñarse cuidadosamente para garantizar que los eventos raros (casos límite, casi-colisiones, escenarios de fallo) no se excluyan sistemáticamente.

Las herramientas modernas de anotación de vídeo admiten **seguimiento inteligente** que propaga las anotaciones entre fotogramas y señala los fotogramas donde la confianza del seguimiento cae por debajo de un umbral, pidiendo al anotador que vuelva a verificar. Esta es una aplicación directa de la idea del aprendizaje activo a la propia tubería de anotación: la herramienta consulta al anotador exactamente donde su interpolación es incierta.

**El problema del evento raro en sistemas autónomos.** Para aplicaciones donde las consecuencias de los eventos raros son catastróficas —conducción autónoma, navegación de UAVs— la distribución de fotogramas vistos en operación normal está gravemente desajustada con la distribución de fotogramas que más importan. Un conjunto de datos construido muestreando uniformemente imágenes de conducción contendrá millones de fotogramas de "no está pasando nada interesante" y un puñado de los fotogramas de casi-accidente, iluminación inusual y sensor degradado que realmente importan para la seguridad. El aprendizaje activo HITL que identifica y prioriza tales fotogramas no es un truco de eficiencia —es un requisito de seguridad.

```{seealso}
Conjunto de datos ImageNet: {cite}`russakovsky2015imagenet`. Sesgo de etiquetas en ImageNet: {cite}`yang2020towards`. Benchmark COCO: {cite}`lin2014microsoft`. SAM (Segment Anything): {cite}`kirillov2023segment`. Aprendizaje activo de núcleo para visión por computadora: {cite}`sener2018active`.
```
