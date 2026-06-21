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

# Aprendizaje Automático con Humano en el Bucle
## *Incomprendido*

```{epigraph}
No hace falta un doctorado titulado «Aprendizaje Automático con Humano en el Bucle».
O mejor dicho — hace toda la falta del mundo, y nunca se ha escrito.
Esto no es ese doctorado. Es lo que viene en su lugar.
```

---

Este manual es una guía exhaustiva, ejecutable y deliberadamente no académica sobre el **Aprendizaje Automático con Humano en el Bucle (HITL ML)** — la disciplina de diseñar sistemas en los que el juicio humano y la inteligencia de las máquinas no se limitan a coexistir, sino que se transforman activamente el uno al otro.

Es *incomprendido* al menos de tres maneras:

**El campo es incomprendido.** Pregunte a la mayoría de la gente cómo funciona el aprendizaje automático y describirá un proceso que termina cuando el modelo se despliega. En realidad, el ser humano nunca sale del bucle — solo se oculta a la vista. Detrás de cada sistema «autónomo» hay anotadores, revisores, recopiladores de retroalimentación e ingenieros que toman decisiones de criterio. HITL ML hace esto visible y deliberado.

**El papel humano es incomprendido.** El humano en el bucle no es un andamiaje temporal destinado a descartarse cuando el modelo sea lo suficientemente bueno. El juicio humano es la señal que define qué significa «suficientemente bueno». No se puede especificar la función objetivo, la recompensa, el esquema de etiquetas ni la métrica de evaluación sin que un ser humano decida qué es lo importante. La máquina optimiza; el humano decide para qué optimizar.

**Usted es incomprendido — y yo también.** Está leyendo un libro sobre estar integrado en un sistema. Mientras lo lee, está integrado en un sistema. El modelo que puede haber ayudado a generar partes de este texto fue entrenado con retroalimentación humana. Las anotaciones con las que se entrenaron los modelos que usted utiliza fueron proporcionadas por humanos cuyos nombres no aparecen en ninguna parte. Todos somos, en cierto sentido, humanos en el bucle de algo más grande que nosotros mismos.

Este libro no pretende lo contrario. Nombra a estos humanos, describe su labor y sostiene que comprenderlos es tan importante como comprender el descenso de gradiente.

:::{admonition} Edición en español
:class: note
Esta es la traducción al español. La edición original en inglés constituye la referencia principal.
:::

---

## Qué Cubre Este Manual

Dieciséis capítulos en seis partes, desde los fundamentos hasta las fronteras:

**Parte I — Fundamentos.** Qué es HITL ML, de dónde viene y cómo pensar el espacio de los modos de interacción humano–máquina.

**Parte II — Técnicas Fundamentales.** Anotación y etiquetado, aprendizaje activo y aprendizaje automático interactivo — los tres pilares clásicos de HITL.

**Parte III — Aprendizaje a partir de Retroalimentación Humana.** Aprendizaje por refuerzo a partir de retroalimentación humana (RLHF), aprendizaje a partir de demostraciones y aprendizaje de preferencias a partir de comparaciones y clasificaciones — los paradigmas que impulsan la alineación moderna de la IA.

**Parte IV — Aplicaciones.** PLN, visión por computadora y atención sanitaria — HITL a través del prisma de dominios reales con restricciones reales.

**Parte V — Sistemas y Práctica.** Plataformas de anotación, control de calidad del crowdsourcing y marcos de evaluación — la infraestructura que hace que HITL funcione a escala.

**Parte VI — Ética y Horizontes.** Los humanos detrás de los datos: equidad, bienestar de los anotadores, sesgo y hacia dónde va todo esto.

---

## Una Nota sobre el Código

Cada capítulo técnico incluye código Python ejecutable. Todos los ejemplos son autocontenidos y utilizan bibliotecas estándar: NumPy, scikit-learn, PyTorch y Hugging Face Transformers.

```{code-cell} python
# A taste of what's ahead: querying the most uncertain sample
import numpy as np
from sklearn.linear_model import LogisticRegression

rng = np.random.default_rng(42)
X = rng.normal(size=(100, 2))
y = (X[:, 0] + X[:, 1] > 0).astype(int)

model = LogisticRegression().fit(X[:20], y[:20])

probs = model.predict_proba(X[20:])
entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
most_uncertain = np.argmax(entropy) + 20

print(f"Most uncertain sample index: {most_uncertain}")
print(f"Predicted probabilities:     {probs[most_uncertain - 20].round(3)}")
print()
print("The model doesn't know. So we ask a human.")
```

---

## Notación

- $\mathcal{X}$ — espacio de entrada; $\mathcal{Y}$ — espacio de etiquetas
- $f_\theta : \mathcal{X} \to \mathcal{Y}$ — un modelo con parámetros $\theta$
- $\mathcal{U}$ — conjunto de datos no etiquetados; $\mathcal{L}$ — conjunto de datos etiquetados
- $h$ — un anotador humano; $\mathcal{H}$ — un conjunto de anotadores

---

*Usted es un humano en el bucle. Comencemos.*
