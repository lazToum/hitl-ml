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

# Anotación y Etiquetado de Datos

La anotación de datos es la forma más ubicua de participación humana en el aprendizaje automático. Antes de que un modelo pueda aprender, alguien debe indicarle cuáles son las respuestas correctas —y ese alguien es generalmente un ser humano. Este capítulo cubre la teoría y la práctica de la anotación: qué hace difícil la anotación, cómo diseñar tareas de anotación, cómo medir la calidad y cómo manejar el desacuerdo.

---

## Tipos de Anotación

Las tareas de anotación varían enormemente en su estructura, dificultad y coste. Los principales tipos incluyen:

### Clasificación

El anotador asigna cada instancia a una de $K$ categorías predefinidas. Esta es la tarea de anotación cognitivamente más sencilla, pero definir un buen esquema de categorías (una *taxonomía*) puede resultar sorprendentemente difícil.

La **clasificación binaria** (¿es esta imagen un gato?) es el caso más simple. La clasificación **multiclase** (¿qué especie es este animal?) requiere que los anotadores elijan una opción de una lista. La anotación **multietiqueta** (¿qué temas cubre este artículo?) permite múltiples etiquetas simultáneas.

### Etiquetado de Secuencias

Cada token de una secuencia recibe una etiqueta. El Reconocimiento de Entidades Nombradas (NER, por sus siglas en inglés) es el ejemplo canónico: los anotadores marcan fragmentos de texto como PERSONA, ORGANIZACIÓN, LUGAR, etc. La anotación se realiza típicamente usando el esquema de etiquetado BIO (Beginning-Inside-Outside, inicio-interior-exterior) o BIOES:

```text
  B-ORG    O           B-ORG    O     O      O
```

### Anotación de Tramos y Relaciones

Más allá del etiquetado de tokens individuales, los anotadores pueden necesitar:
- Identificar tramos (expresiones de múltiples tokens) y asignarles tipos
- Marcar *relaciones* entre tramos ("Apple" ADQUIRIÓ "Shazam")
- Anotar cadenas de correferencia (todas las menciones de la misma entidad)

Estas tareas son cognitivamente exigentes y tienen menor concordancia entre anotadores.

### Cajas Delimitadoras y Detección de Objetos

Los anotadores dibujan rectángulos alrededor de objetos en imágenes y asignan una etiqueta de categoría a cada caja. La precisión de la localización importa: una caja demasiado pequeña pierde contexto; una caja demasiado grande incluye el fondo. Las herramientas de anotación modernas calculan la intersección sobre la unión (IoU) con las anotaciones de referencia para señalar problemas de calidad.

### Segmentación

Anotación a nivel de píxel: se asigna cada píxel a una clase (segmentación semántica) o a una instancia específica de objeto (segmentación de instancias). La segmentación de alta calidad se encuentra entre los tipos de anotación más costosos, con precios que van desde decenas hasta más de cien dólares por imagen en escenas complejas, dependiendo del dominio y el soporte de herramientas.

### Transcripción y Traducción

Audio → texto (datos de entrenamiento para ASR), escritura manuscrita → texto (datos para OCR), o lengua origen → lengua destino (datos para traducción automática). Estas tareas requieren experiencia lingüística y no pueden realizarse de manera fiable por anotadores sin formación.

---

## Directrices de Anotación

El factor determinante más importante de la calidad de la anotación es la calidad de las **directrices de anotación**: las instrucciones escritas que siguen los anotadores.

Unas buenas directrices:
- Establecen el objetivo de la tarea y explican *por qué* importa la etiqueta
- Proporcionan una definición clara para cada categoría con ejemplos positivos y negativos
- Abordan explícitamente los casos límite y los casos difíciles más habituales
- Especifican qué hacer ante la incertidumbre (por ejemplo, marcar "omitir" frente a elección forzada)
- Incluyen ejemplos elaborados de anotación completa

Las directrices deficientes se apoyan en que los anotadores "usen el sentido común" para los casos límite —lo que lleva a decisiones inconsistentes que degradan la calidad del modelo e inflan el desacuerdo entre anotadores.

```{admonition} El desarrollo de las directrices es iterativo
:class: note

No espere escribir directrices perfectas desde el principio. Realice una pequeña ronda de anotación piloto, analice los desacuerdos y actualice las directrices. Repita. Las directrices bien desarrolladas suelen pasar por 3 a 5 ciclos de revisión antes de estabilizarse.
```

---

## Medición de la Calidad de Anotación: Concordancia entre Anotadores

Cuando múltiples anotadores etiquetan los mismos datos, su concordancia puede medirse. Una alta concordancia sugiere que la tarea está bien definida y que los anotadores la comprendieron. Una baja concordancia sugiere ambigüedad en la tarea, las directrices o los datos en sí.

### Kappa de Cohen

Para dos anotadores que etiquetan datos en $K$ categorías, el **kappa de Cohen** {cite}`cohen1960coefficient` corrige la concordancia observada por el azar:

$$
\kappa = \frac{P_o - P_e}{1 - P_e}
$$

donde $P_o$ es la concordancia proporcional observada y $P_e$ es la probabilidad de concordancia por azar (calculada a partir de las distribuciones marginales de etiquetas).

$\kappa = 1$ significa concordancia perfecta; $\kappa = 0$ significa concordancia no superior al azar; $\kappa < 0$ significa desacuerdo sistemático.

| Rango de $\kappa$ | Interpretación         |
|-------------------|------------------------|
| $< 0$             | Por debajo del azar    |
| $0{,}0 - 0{,}20$  | Leve                   |
| $0{,}21 - 0{,}40$ | Regular                |
| $0{,}41 - 0{,}60$ | Moderada               |
| $0{,}61 - 0{,}80$ | Sustancial             |
| $0{,}81 - 1{,}00$ | Casi perfecta          |

### Kappa de Fleiss

Extiende el kappa de Cohen a $M > 2$ anotadores. Cada anotador etiqueta de manera independiente cada elemento; la fórmula agrega todos los pares de anotadores:

$$
\kappa_F = \frac{\bar{P} - \bar{P}_e}{1 - \bar{P}_e}
$$

donde $\bar{P}$ es la concordancia pairwise media entre todos los pares de anotadores, y $\bar{P}_e$ es la concordancia esperada bajo asignación aleatoria.

### Alfa de Krippendorff

La métrica más general, que admite cualquier número de anotadores, cualquier tipo de escala (nominal, ordinal, de intervalo, de razón) y datos faltantes {cite}`krippendorff2011computing`:

$$
\alpha = 1 - \frac{D_o}{D_e}
$$

donde $D_o$ es el desacuerdo observado y $D_e$ es el desacuerdo esperado. El alfa de Krippendorff es generalmente preferido en el trabajo académico por su flexibilidad.

```{code-cell} python
import numpy as np
from sklearn.metrics import cohen_kappa_score

# Simulate two annotators labeling 200 items into 3 categories
rng = np.random.default_rng(0)
true_labels = rng.integers(0, 3, size=200)

# Annotator 1: mostly agrees with ground truth
ann1 = true_labels.copy()
flip_mask = rng.random(200) < 0.15
ann1[flip_mask] = rng.integers(0, 3, size=flip_mask.sum())

# Annotator 2: less consistent
ann2 = true_labels.copy()
flip_mask2 = rng.random(200) < 0.30
ann2[flip_mask2] = rng.integers(0, 3, size=flip_mask2.sum())

kappa_12 = cohen_kappa_score(ann1, ann2)
kappa_1true = cohen_kappa_score(ann1, true_labels)
kappa_2true = cohen_kappa_score(ann2, true_labels)

print(f"Cohen's κ (ann1 vs ann2):   {kappa_12:.3f}")
print(f"Cohen's κ (ann1 vs truth):  {kappa_1true:.3f}")
print(f"Cohen's κ (ann2 vs truth):  {kappa_2true:.3f}")
```

---

## Manejo de Desacuerdos

Cuando los anotadores no coinciden, existen varias estrategias:

### Votación Mayoritaria

Se toma como estándar de referencia la etiqueta más común. Sencilla y robusta cuando el número de anotadores por elemento es impar. Falla cuando un subgrupo minoritario de anotadores es sistemáticamente más preciso.

### Votación Ponderada

Los anotadores se ponderan según su precisión estimada (derivada de la concordancia con un estándar de referencia u otros anotadores). Los anotadores más precisos tienen mayor influencia.

### Etiquetas Suaves

En lugar de colapsar las anotaciones a una sola etiqueta, se preserva la distribución. Si 3 de 5 anotadores dijeron "positivo" y 2 dijeron "neutro", esto se representa como $(p_\text{pos}, p_\text{neutro}, p_\text{neg}) = (0{,}6, 0{,}4, 0{,}0)$. Entrenar con etiquetas suaves mejora la calibración.

### Arbitraje

Un anotador senior o experto en el dominio dirime los desacuerdos. Es el estándar de oro, pero costoso; generalmente reservado para dominios de alto riesgo.

### Modelos Estadísticos

Los enfoques más sofisticados modelan probabilísticamente la competencia del anotador. El modelo **Dawid-Skene** {cite}`dawid1979maximum` estima simultáneamente las matrices de confusión de los anotadores y las etiquetas verdaderas de los elementos mediante el algoritmo EM. Véase el Capítulo 13 para más detalles.

---

## Ruido en las Etiquetas y Sus Efectos

La anotación real es ruidosa. Los efectos del ruido en las etiquetas sobre el entrenamiento del modelo dependen del tipo de ruido:

- El **ruido aleatorio** (etiquetas invertidas aleatoriamente) degrada el rendimiento, pero los modelos son sorprendentemente robustos frente a niveles moderados (hasta ~20% para muchas tareas).
- El **ruido sistemático/adversarial** (etiquetas consistentemente erróneas en patrones específicos) es mucho más dañino y más difícil de detectar.
- El **ruido condicional por clase** (errores más probables para ciertas clases) sesga la frontera de decisión del modelo.

Una regla práctica: con $n$ ejemplos de entrenamiento y una fracción $\epsilon$ de etiquetas corrompidas, el rendimiento del modelo se degrada aproximadamente como si se tuvieran $(1 - 2\epsilon)^2 n$ ejemplos limpios {cite}`natarajan2013learning`. Para $\epsilon = 0{,}2$, esto equivale a perder el 36% de los datos.

```{code-cell} python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(42)
X, y = make_classification(n_samples=2000, n_features=20, random_state=42)

noise_levels = np.linspace(0, 0.45, 15)
mean_accs = []

for eps in noise_levels:
    y_noisy = y.copy()
    flip = rng.random(len(y)) < eps
    y_noisy[flip] = 1 - y_noisy[flip]
    scores = cross_val_score(LogisticRegression(max_iter=500), X, y_noisy, cv=5)
    mean_accs.append(scores.mean())

plt.figure(figsize=(7, 4))
plt.plot(noise_levels, mean_accs, 'o-', color='#2b3a8f', linewidth=2)
plt.xlabel("Label noise rate (ε)", fontsize=12)
plt.ylabel("Cross-validated accuracy", fontsize=12)
plt.title("Effect of Label Noise on Model Performance", fontsize=13)
plt.axvline(0.2, color='#e05c5c', linestyle='--', alpha=0.7, label='20% noise')
plt.legend()
plt.tight_layout()
plt.savefig('label_noise_effect.png', dpi=150)
plt.show()
print(f"\nAccuracy at 0% noise:  {mean_accs[0]:.3f}")
print(f"Accuracy at 20% noise: {mean_accs[round(0.2 / 0.45 * 14)]:.3f}")
print(f"Accuracy at 40% noise: {mean_accs[-2]:.3f}")
```

---

## Coste y Rendimiento de la Anotación

Comprender la economía de la anotación es esencial para la planificación de proyectos.

| Tipo de tarea                         | Rendimiento típico    | Coste por elemento (especialista) |
|---------------------------------------|-----------------------|-----------------------------------|
| Clasificación binaria de imágenes     | 200–500 por hora      | $0,02–$0,10                       |
| NER (texto corto)                     | 50–150 elementos/h    | $0,10–$0,50                       |
| Extracción de relaciones              | 20–60 elementos/h     | $0,30–$1,50                       |
| Segmentación de imágenes médicas      | 5–30 elementos/h      | $10–$100                          |
| Anotación de vídeo                    | 5–20 min de vídeo/h   | $20–$200                          |

Estas cifras son estimaciones aproximadas de orden de magnitud y varían enormemente según la experiencia en el dominio requerida, la calidad de la herramienta de anotación, la claridad de las directrices y la experiencia del anotador. Deben tratarse como ilustrativas, no como prescriptivas.

```{seealso}
Las opciones de herramientas de anotación se tratan en el Capítulo 12. Los modelos estadísticos para la anotación mediante crowdsourcing (Dawid-Skene, MACE) se tratan en el Capítulo 13.
```
