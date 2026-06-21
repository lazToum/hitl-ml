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

# HITL en Salud y Ciencia

La atención sanitaria y la ciencia representan dos de los dominios donde el HITL ML es más trascendente y más debatido. Los riesgos son elevados: un diagnóstico de cáncer no detectado o una diana farmacológica deficiente tienen un coste humano real. La anotación requiere una experiencia rara y costosa. Las exigencias regulatorias condicionan lo que los modelos pueden hacer y cómo deben validarse. Y a diferencia del PLN, donde el problema de anotación es parcialmente de construcción social, aquí a menudo existe una verdad fundamental genuina —un tumor está presente o no lo está— aunque ningún observador individual pueda determinarlo de manera fiable.

El encuadre dominante en la cobertura popular es "IA contra humanos": ¿reemplazará la IA a los radiólogos? Este encuadre es erróneo de una manera que importa. La pregunta real es qué forma de colaboración humano-IA produce mejores resultados que cualquiera de los dos por separado, y cómo construir sistemas que permitan esa colaboración en lugar de perturbarla.

---

## Análisis de Imágenes Médicas

Las imágenes médicas —radiología (rayos X, TC, RM), patología (muestras de tejido), dermatología, oftalmología— es el dominio donde la IA médica ha avanzado más rápidamente.

### Requisitos de los Anotadores Expertos

La anotación de imágenes médicas generalmente requiere médicos con formación de subespecialidad específica. Esto hace que la anotación sea:

- **Lenta:** Los especialistas tienen tiempo limitado; la anotación compite con las obligaciones clínicas
- **Costosa:** Los costes oscilan entre decenas y cientos de dólares por caso anotado, según la subespecialidad, la modalidad y la complejidad de la tarea
- **Variable:** Incluso los especialistas difieren, especialmente en casos límite —un hecho que a menudo se trata como un problema pero que en realidad es informativo

### Variabilidad entre Radiólogos

La variabilidad entre lectores está bien documentada en radiología. Para la interpretación de radiografías de tórax, el desacuerdo entre lectores es sustancial —en el estudio CheXNet, cuatro radiólogos etiquetaron el mismo conjunto de pruebas de detección de neumonía con puntuaciones F1 que abarcaban aproximadamente 12 puntos porcentuales {cite}`rajpurkar2017chexnet`, lo que refleja una incertidumbre diagnóstica genuina en los casos límite. Para la detección de nódulos en TC pulmonar, la variabilidad intra-lector (el mismo lector, el mismo caso, día diferente) puede ser tan grande como la variabilidad inter-lector.

Esta variabilidad no es solo ruido —refleja una incertidumbre diagnóstica genuina. Los modelos entrenados sobre las anotaciones de un único radiólogo pueden aprender los sesgos específicos de ese médico en lugar de la patología subyacente.

:::{admonition} La Controversia de CheXNet como Lección de HITL
:class: note

Cuando Rajpurkar et al. afirmaron que su modelo CheXNet "superaba el rendimiento del radiólogo" en la detección de neumonía, la afirmación fue inmediatamente cuestionada por la comunidad radiológica {cite}`yu2022assessing`. Parte de la controversia fue sobre el conjunto de pruebas específico y la comparación de radiólogos. Pero un problema más profundo era metodológico: la referencia de "rendimiento del radiólogo" usaba lectores individuales bajo presión de tiempo, mientras que la radiología clínica generalmente implica consulta, comparación con imágenes previas y acceso a contexto clínico —nada de lo cual tenía el modelo.

La lección no es que el modelo fuera bueno o malo, sino que **las comparaciones de rendimiento requieren especificar la configuración HITL**. Un modelo que supera a un radiólogo individual leyendo a ciegas puede seguir siendo menos preciso que un radiólogo que usa la salida del modelo como segunda opinión. Estos son sistemas diferentes con diferentes modos de error, y agregan de manera diferente.
:::

:::{admonition} Etiquetas suaves en medicina
:class: important

Varios proyectos de IA médica han pasado a usar **etiquetas suaves** que reflejan la distribución de opiniones expertas en lugar de una sola etiqueta "estándar dorado". Una radiografía de tórax etiquetada como 60% neumonía / 40% atelectasia por un panel de radiólogos lleva más información que una elección binaria forzada. Los modelos entrenados con tales distribuciones muestran mejor calibración y una cuantificación de incertidumbre más apropiada —y esa incertidumbre es clínicamente significativa, ya que indica al clínico cuándo consultar, no solo lo que el modelo piensa.
:::

### Aprendizaje Activo para Enfermedades Raras

El aprendizaje activo es especialmente valioso para enfermedades raras y patologías raras, donde incluso un gran grupo no etiquetado contiene solo un pequeño número de casos positivos. El muestreo aleatorio estándar desperdiciaría el tiempo del experto etiquetando sobre todo casos negativos.

El aprendizaje activo basado en incertidumbre selecciona naturalmente los casos límite donde el modelo es incierto —los cuales, para condiciones raras, tienden a ser los casos positivos y los negativos límite. Esto concentra el tiempo del especialista donde es más valioso. La combinación de entrenamiento desequilibrado de clases (con `class_weight='balanced'` o similar) y selección basada en incertidumbre es práctica estándar para las tareas de detección de patología rara.

---

## Anotación Clínica de PLN

Las historias clínicas electrónicas (HCE) contienen una enorme riqueza de texto narrativo clínico: notas médicas, informes de alta, informes radiológicos, informes de patología. Extraer información estructurada de este texto requiere PLN —y un PLN de alta calidad requiere datos de entrenamiento anotados.

**Tareas comunes de anotación clínica de PLN:**
- **NER clínico:** Identificación de medicamentos, dosis, diagnósticos, procedimientos y síntomas en texto
- **Detección de negación:** "Sin evidencia de neumonía" frente a "Neumonía confirmada" —una distinción crítica que es sorprendentemente difícil
- **Razonamiento temporal:** Distinguir condiciones actuales de antecedentes ("antecedentes de infarto de miocardio, acudió con dolor torácico")
- **Desidentificación:** Eliminar Información Sanitaria Protegida (PHI) para permitir el intercambio de datos

La **desidentificación de PHI** es tanto una tarea de anotación como un requisito de gobernanza de datos. Bajo HIPAA (EE. UU.) y GDPR (UE), los datos de salud no pueden compartirse sin eliminar o anonimizar los identificadores del paciente. Las herramientas de desidentificación automatizadas existen pero son imperfectas; la revisión humana de las salidas automatizadas es práctica estándar, y el perfil de riesgo es asimétrico: los falsos negativos (PHI no detectada) crean exposición legal, lo que hace necesarios umbrales conservadores.

### i2b2 / n2c2 como Plantilla

Las iniciativas de tarea compartida i2b2 (Informática para Integrar la Biología y el Cabecero) y la sucesora n2c2 (Desafíos Clínicos Nacionales de PLN) han publicado una serie de conjuntos de datos de PLN clínico anotados por expertos. Estos ilustran tanto el potencial como el coste: los esfuerzos de anotación típicamente implican equipos de expertos en el dominio clínico trabajando durante varios meses, anotando cientos de documentos por desafío. Los conjuntos de datos n2c2 han catalizado un rápido progreso precisamente porque resolvieron el problema de gobernanza del intercambio de datos (desidentificación + acuerdos institucionales), no solo el problema de anotación.

---

## Consideraciones Regulatorias

La IA médica está sujeta a supervisión regulatoria en la mayoría de las jurisdicciones.

**FDA (Estados Unidos):** El Software como Dispositivo Médico (SaMD) basado en IA/ML requiere aprobación previa a la comercialización o autorización de comercialización. El Plan de Acción de IA/ML de la FDA de 2021 enfatiza los **planes de control de cambios predeterminados** —documentar cómo se actualizará el modelo y cómo se validarán esas actualizaciones antes del despliegue. Un modelo que aprende continuamente de la retroalimentación clínica es, bajo este marco, un dispositivo diferente después de cada actualización y puede requerir revalidación.

**Marcado CE (Europa):** Los dispositivos médicos, incluyendo los sistemas de IA, deben cumplir con el Reglamento de Dispositivos Médicos (MDR). El MDR exige evaluación clínica, vigilancia poscomercialización y documentación de los datos utilizados para el entrenamiento y la validación.

**Implicación clave de HITL:** Los marcos regulatorios requieren documentación clara de los procesos de anotación, las calificaciones de los anotadores, la fiabilidad entre evaluadores y cualquier cambio en los datos de entrenamiento. Esto no es burocracia adicional —es la pista de auditoría que permite a un clínico entender qué datos de entrenamiento produjeron el comportamiento actual del modelo, y es legalmente obligatorio. Las tuberías HITL que tratan la anotación como un subproceso informal crean un riesgo regulatorio que típicamente se hace visible solo en el peor momento.

---

## Anotación de Datos Científicos

Más allá de la atención sanitaria, el HITL ML desempeña un papel creciente y subestimado en la investigación científica, donde el desafío de anotación a menudo combina experiencia en el dominio con escala.

### Astronomía: Galaxy Zoo

Galaxy Zoo {cite}`lintott2008galaxy` externalizó la clasificación morfológica de galaxias del Sloan Digital Sky Survey a científicos ciudadanos. El proyecto original recopiló más de 40 millones de clasificaciones de más de 100.000 voluntarios, demostrando que la clasificación de imágenes científicas a gran escala mediante crowdsourcing es factible cuando la tarea puede descomponerse en preguntas simples respondibles sin formación especializada ("¿Esta galaxia es suave o presenta estructura?").

La experiencia de Galaxy Zoo produjo dos hallazgos metodológicos importantes. Primero, la concordancia entre científicos ciudadanos y astrónomos profesionales era alta para los casos claros y divergía sistemáticamente en los casos límite —precisamente los casos donde la distinción importa científicamente. La solución no fue descartar los datos de ciencia ciudadana en los casos límite, sino tratar la distribución de respuestas de los voluntarios como una etiqueta suave que codificaba la ambigüedad morfológica genuina. Segundo, el clasificador entrenado con las etiquetas de Galaxy Zoo superó a los modelos entrenados para reproducir las etiquetas de cualquier experto individual, porque la distribución colectiva capturaba una incertidumbre visual real que la elección forzada de un único experto colapsaba.

### Genómica: Clasificación de Patogenicidad

Anotar variantes genómicas —decidir si una variante es patogénica, benigna o de significado incierto— es un problema de PLN y juicio experto de alto riesgo. Las bases de datos de variantes clínicas como ClinVar agregan interpretaciones expertas de múltiples laboratorios colaboradores, y el desacuerdo entre laboratorios es común. El aprendizaje activo se usa para priorizar qué variantes requieren revisión experta completa (búsqueda bibliográfica, evaluación de evidencia funcional) frente a cuáles pueden clasificarse automáticamente con la evidencia existente. El resultado es una tubería híbrida donde la mayoría de las variantes se manejan por lógica automatizada, un subconjunto requiere revisión experta, y los casos más difíciles se marcan para el consenso multilaboratorio.

### Clima y Ciencias de la Tierra

El etiquetado de imágenes satelitales para cambios en el uso del suelo, deforestación, extensión de glaciares y trayectorias de tormentas involucra a expertos en teledetección y, cada vez más, a plataformas de ciencia ciudadana. El principal desafío HITL en este dominio es temporal: las etiquetas hechas hoy pueden volverse obsoletas a medida que el mundo cambia, y la verificación de la verdad fundamental (encuestas de campo) es costosa y logísticamente limitada. El aprendizaje activo que prioriza las imágenes donde la predicción del modelo difiere de los a priori físicos (por ejemplo, predecir deforestación en una región que se sabe que está protegida) es una forma práctica de dirigir los escasos recursos de verificación de campo.

### Neurociencia: Connectómica

Reconstruir circuitos neurales a partir de imágenes de microscopio electrónico —connectómica— requiere anotación a nivel de píxel de membranas neuronales en enormes pilas de imágenes. El proyecto Eyewire gamificó esta tarea, involucrando a decenas de miles de jugadores en el trazado de neuronas a través de volúmenes de imágenes 3D. El diseño de la gamificación resolvió un problema específico de HITL: la tarea requiere atención sostenida y razonamiento espacial durante sesiones largas, lo que provoca una degradación de la calidad en la anotación tradicional. Dividir la tarea en segmentos de juego con mecánicas sociales mantuvo el compromiso y la calidad de los anotadores a escalas que la anotación profesional no puede lograr.

---

## Gestión de Anotadores Especialistas

Cuando la anotación requiere experiencia rara, los enfoques habituales de crowdsourcing (Capítulo 13) no se aplican.

**La tensión fundamental** es que las personas que pueden producir las anotaciones de mayor calidad son también las personas cuyo tiempo es más valioso y más limitado. Cada decisión de diseño en una tubería de anotación especialista debería evaluarse respecto a la pregunta: ¿hace esto el mejor uso del escaso tiempo del experto?

**Lo que esto significa en la práctica:**

- **Pre-anotar agresivamente.** Usar anotadores de nivel inferior, modelos automatizados o sistemas basados en reglas para generar candidatos que el especialista revisa y corrige en lugar de crear desde cero. El juicio del especialista es el cuello de botella; proporcionarles una pre-anotación para corregir es más rápido que pedirles que anoten desde una pantalla en blanco, siempre que la calidad de la pre-anotación sea suficiente para que la corrección no sea más lenta que empezar de nuevo.

- **Diseñar para la atención del experto, no el rendimiento.** Las interfaces de anotación optimizadas para alto rendimiento (decisiones binarias rápidas, atajos de teclado, visualización mínima) son apropiadas para el crowdsourcing. La anotación especialista a menudo se beneficia de interfaces más ricas: comparación lado a lado con casos previos, fácil acceso a materiales de referencia, campos de confianza de anotación y la capacidad de marcar un caso para discusión. Esto ralentiza las anotaciones individuales pero mejora la calidad y reduce la necesidad de re-anotación.

- **Rastrear los patrones individuales de los anotadores explícitamente.** Con un pequeño grupo de especialistas, es factible e importante rastrear la tasa de concordancia de cada anotador con el panel, señalar los casos que parecen inconsistentes con su historial propio y discutirlos en sesiones regulares de calibración. Esto no es vigilancia —es el mismo proceso de calidad que la medicina clínica usa para la revisión del rendimiento, y los especialistas generalmente responden bien cuando se enmarca como mejora de la calidad compartida en lugar de evaluación.

- **El diseño de la sesión importa.** La anotación médica es cognitivamente exigente. La evidencia de radiología y patología sugiere que las tasas de error aumentan de manera mensurable después de aproximadamente 90 minutos de lectura continua, y que descansos de incluso unos pocos minutos pueden restablecer parcialmente la atención. Las interfaces de anotación que aplican avisos de descanso (sin posibilidad de ignorarlos) son una decisión de diseño HITL simple con impacto real en la calidad.

---

## Una Tubería de Aprendizaje Activo HITL para Imágenes Médicas

```{code-cell} python
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.datasets import make_classification
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

# Simulate a rare-pathology detection task
# 8% positive class (e.g., rare pathology)
X, y = make_classification(
    n_samples=5000, n_features=100,
    n_informative=20, n_redundant=10,
    weights=[0.92, 0.08],
    random_state=42
)
X_train, y_train = X[:4000], y[:4000]
X_test,  y_test  = X[4000:], y[4000:]

print(f"Training set positive prevalence: {y_train.mean():.1%}")

def run_medical_al(strategy, n_initial=50, budget=300):
    labeled = list(rng.choice(len(X_train), n_initial, replace=False))
    unlabeled = [i for i in range(len(X_train)) if i not in labeled]
    aucs = []

    while len(labeled) < n_initial + budget:
        model = LogisticRegression(max_iter=500, class_weight='balanced')
        model.fit(X_train[labeled], y_train[labeled])

        if len(labeled) % 30 == 0:
            preds = model.predict_proba(X_test)[:, 1]
            aucs.append(roc_auc_score(y_test, preds))

        X_pool = X_train[unlabeled]
        if strategy == 'uncertainty' and len(labeled) >= 10:
            probs = model.predict_proba(X_pool)
            entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
            q = int(np.argmax(entropy))
        else:
            q = rng.integers(0, len(unlabeled))

        labeled.append(unlabeled.pop(q))

    return np.array(aucs)

aucs_al  = run_medical_al('uncertainty')
aucs_rnd = run_medical_al('random')
label_counts = np.arange(len(aucs_al)) * 30 + 50

plt.figure(figsize=(7, 4))
plt.plot(label_counts, aucs_al,  'o-',  color='#2b3a8f', linewidth=2, label='Uncertainty AL')
plt.plot(label_counts, aucs_rnd, 's--', color='#e05c5c', linewidth=2, label='Random baseline')
plt.xlabel("Expert labels obtained", fontsize=12)
plt.ylabel("AUROC", fontsize=12)
plt.title("Active Learning for Rare Pathology Detection", fontsize=13)
plt.legend(); plt.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('medical_al.png', dpi=150)
plt.show()

# Show how AL preferentially selects positive examples
# by checking which class the queried examples belong to
n_init = 50
labeled_al  = list(rng.choice(len(X_train), n_init, replace=False))
labeled_rnd = labeled_al.copy()
unlabeled_al  = [i for i in range(len(X_train)) if i not in labeled_al]
unlabeled_rnd = unlabeled_al.copy()

model = LogisticRegression(max_iter=500, class_weight='balanced')
model.fit(X_train[labeled_al], y_train[labeled_al])
probs = model.predict_proba(X_train[unlabeled_al])
entropy = -np.sum(probs * np.log(probs + 1e-9), axis=1)
top50_al  = [unlabeled_al[i] for i in np.argsort(entropy)[-50:]]
top50_rnd = list(rng.choice(unlabeled_rnd, 50, replace=False))

pos_rate_al  = y_train[top50_al].mean()
pos_rate_rnd = y_train[top50_rnd].mean()
print(f"\nPositive rate in next 50 queries:")
print(f"  Uncertainty AL: {pos_rate_al:.1%}  (base rate: {y_train.mean():.1%})")
print(f"  Random:         {pos_rate_rnd:.1%}")
print(f"  AL queries {pos_rate_al/y_train.mean():.1f}x more positives than random")
```

```{seealso}
Crowdsourcing en Galaxy Zoo: {cite}`lintott2008galaxy`. Rendimiento del radiólogo con CheXNet: {cite}`rajpurkar2017chexnet`. Calidad de radiografías y diagnóstico asistido por IA: {cite}`yu2022assessing`. Metodología de anotación de PLN clínico: {cite}`pustejovsky2012natural`. Para la guía del plan de acción IA/ML de la FDA, véase la documentación publicada por la FDA (2021).
```
