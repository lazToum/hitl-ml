# Equidad, Sesgo y Ética

Los sistemas con humano en el bucle heredan tanto las capacidades como las limitaciones de los humanos que los componen. Los anotadores aportan conocimiento, juicio y creatividad a su trabajo —pero también sesgos, fatiga y el contexto social de sus vidas. Las decisiones que tomamos al diseñar los sistemas HITL —quién anota, qué se les pide, cómo se les compensa y cómo se usa su trabajo— tienen consecuencias que van mucho más allá de las métricas de precisión de los modelos.

Este capítulo aborda las dimensiones éticas del HITL ML.

---

## Fuentes de Sesgo en los Sistemas HITL

### Demografía de los Anotadores

La anotación no es un acto neutral. Las etiquetas que asignan los anotadores reflejan sus perspectivas, experiencias y contextos culturales. Cuando la fuerza laboral de anotación es demográficamente homogénea —como ocurre a menudo, con el trabajo de crowdsourcing inclinado hacia personas jóvenes, del sexo masculino y occidentales— el conjunto de datos resultante codifica las perspectivas de ese grupo.

**Evidencia:** Los estudios de los conjuntos de datos de anotación de PLN han encontrado que las características demográficas de los anotadores predicen sus elecciones de etiquetas en las tareas subjetivas (toxicidad, sentimiento, ofensividad). Los conjuntos de datos anotados principalmente por trabajadores de crowdsourcing estadounidenses codifican normas culturales de EE. UU. que no se generalizan a otras regiones {cite}`geva2019annotator`.

**Consecuencias:** Los modelos entrenados con dichos datos funcionan bien para los usuarios que se asemejan al grupo de anotadores y de manera menos buena —o sesgada— para los usuarios que no lo hacen.

**Mitigación:** Diversificación deliberada de la fuerza laboral; anotación estratificada (garantizar que los anotadores de grupos demográficos relevantes contribuyan a las tareas pertinentes); rastrear la demografía de los anotadores y su efecto sobre las distribuciones de etiquetas.

### Formulación de la Tarea

La manera en que se formula una pregunta influye en las respuestas que suscita. Si se pregunta a los anotadores "¿Es este texto tóxico?", pueden responder de manera diferente que si se les pregunta "¿Causaría daño este texto a alguien perteneciente al grupo mencionado?". La formulación incorpora suposiciones sobre lo que importa.

**Ejemplo:** La anotación del "lenguaje abusivo" en redes sociales varía significativamente según si se muestra o no a los anotadores información contextual sobre la identidad del autor. Una declaración que parece amenazante en aislamiento puede reconocerse como lenguaje reivindicado o humor interno cuando se proporciona contexto.

### Efectos de la Plataforma

La plataforma y la estructura de pago afectan la calidad de la anotación. Los trabajadores que reciben pago por tarea en lugar de por hora tienen incentivo para trabajar rápido; esto aumenta el rendimiento pero disminuye la calidad. Los trabajadores que temen ser bloqueados de una plataforma por baja precisión pueden evitar marcar como "incierto" y en su lugar hacer suposiciones, enmascarando la ambigüedad genuina.

### Sesgos de Confirmación y Anclaje

Los anotadores están influidos por:
- **Pre-anotación:** Las predicciones del modelo mostradas a los anotadores se aceptan con más frecuencia de la que se rechazan, incluso cuando son erróneas
- **Efectos de orden:** Etiquetar el mismo elemento en diferentes contextos produce respuestas diferentes
- **Priming:** Los elementos anteriores en una tarea afectan cómo se etiquetan los elementos posteriores

---

## Equidad en los Sistemas HITL

### ¿Qué es la Equidad?

La equidad en el aprendizaje automático es un concepto en disputa con múltiples definiciones formales que a menudo son mutuamente incompatibles {cite}`barocas2019fairness`. Para los propósitos de HITL, las dimensiones más relevantes son:

**Representación:** ¿Son los datos de entrenamiento representativos de las poblaciones que el modelo afectará?

**Paridad de rendimiento:** ¿Funciona el modelo igualmente bien para diferentes grupos demográficos?

**Consistencia del etiquetado:** ¿Se etiquetan los mismos comportamientos de manera idéntica independientemente de quién los realiza? (La investigación ha demostrado que esto no siempre es así —el mismo contenido se etiqueta a veces de manera diferente cuando se atribuye a diferentes grupos raciales o de género.)

### Aprendizaje Activo Consciente de la Equidad

Las estrategias estándar de aprendizaje activo se centran en la incertidumbre del modelo, que tiende a concentrarse en los ejemplos de la clase mayoritaria. Esto puede exacerbar las disparidades de rendimiento para los grupos minoritarios.

Las **estrategias de consulta conscientes de la equidad** aumentan el criterio de incertidumbre con restricciones de diversidad o representación:

$$
x^* = \argmax_{x \in \mathcal{U}} \left[ \lambda \cdot \text{incertidumbre}(x) + (1 - \lambda) \cdot \text{bonificación\_grupo\_minoritario}(x) \right]
$$

Establecer $\lambda < 1$ garantiza que la estrategia de consulta no ignore por completo la representación de los grupos minoritarios.

---

## Bienestar de los Anotadores

### El Problema del Trabajo Fantasma

El trabajo de anotación que impulsa el aprendizaje automático es en gran parte invisible. Los trabajadores de datos —a menudo en el Sur Global— etiquetan imágenes, transcriben discurso y moderan contenido por salarios bajos, sin prestaciones, en acuerdos de economía de trabajo por encargo sin seguridad laboral. "Anatomy of an AI System" de Kate Crawford y Vladan Joler {cite}`crawford2018anatomy` y "Ghost Work" de Mary Gray y Siddharth Suri {cite}`gray2019ghost` documentaron la escala y la precariedad de este trabajo.

**Estadísticas de Amazon MTurk:** Un análisis sistemático de 2018 de los ingresos de MTurk encontró una paga horaria efectiva mediana de aproximadamente $2/hora —por debajo del salario mínimo en la mayoría de los estados de EE. UU. y en muchos países de ingresos altos {cite}`hara2018data`. Los trabajadores fuera de los países de ingresos altos a menudo enfrentan barreras adicionales: los solicitantes frecuentemente restringen las tareas bien pagadas a calificaciones exclusivas para EE. UU., y el grupo de trabajadores que compite por las restantes tareas abiertas es global, comprimiendo aún más los ingresos efectivos.

**Moderación de contenido:** Una forma particularmente dañina de trabajo de anotación —revisar contenido gráfico, violento y perturbador— ha sido relacionada con el PTSD, la depresión y la ansiedad entre los trabajadores {cite}`newton2019trauma`. Las plataformas han sido criticadas por el apoyo inadecuado a la salud mental y las cuotas excesivas de exposición.

### Prácticas Éticas

**Pago justo:** Pagar a los trabajadores de anotación al nivel o por encima del salario mínimo local. La investigación ha demostrado que una mayor remuneración atrae a trabajadores de mayor calidad sin aumentar proporcionalmente los costes por etiqueta correcta.

**Visibilidad del trabajo:** Reconocer el trabajo que crea los datos de entrenamiento en las publicaciones y la documentación del producto.

**Apoyo a la salud mental:** Para los trabajadores que revisan contenido dañino, proporcionar apoyo psicológico, programas de rotación y límites de exposición.

**Representación de los trabajadores:** Permitir que los trabajadores de anotación reporten preocupaciones, soliciten aclaraciones de directrices e impugnen evaluaciones de calidad injustas.

---

## Privacidad en la Anotación

### Información Sanitaria Protegida (PHI) e IPI

Las tareas de anotación a menudo implican datos personales sensibles. Un proyecto de anotación médica puede exponer a los trabajadores a registros de pacientes; un proyecto de PLN puede exponer a los trabajadores a comunicaciones privadas; un proyecto de moderación de contenido expone a los trabajadores a revelaciones personales de los usuarios.

Los marcos regulatorios (HIPAA, GDPR) restringen cómo pueden compartirse los datos personales con las fuerzas laborales de anotación. Principios clave:

- **Minimización de datos:** Compartir solo la información que los anotadores necesitan para completar la tarea
- **Desidentificación:** Eliminar PHI e IPI antes de la anotación donde sea posible
- **Consentimiento:** Cuando se anoten datos reales de usuarios, garantizar el consentimiento apropiado o la base legal
- **Controles de acceso:** Limitar qué anotadores pueden acceder a datos sensibles según el rol y la autorización

### Datos Sintéticos como Alternativa

Para las tareas donde los datos reales conllevan riesgos de privacidad, la generación de datos sintéticos puede crear conjuntos de datos listos para la anotación sin exponer información sensible. Para el PLN clínico, por ejemplo, el texto sintético de historias clínicas electrónicas puede proporcionar datos de entrenamiento realistas para los modelos de desidentificación sin exponer registros reales de pacientes.

---

## Anotación Adversarial e Intoxicación de Datos

Los sistemas HITL crean una superficie de ataque: si un adversario puede influir en el proceso de anotación, puede influir en el comportamiento del modelo.

**Intoxicación de datos mediante anotación:** Un atacante con acceso a la fuerza laboral de anotación (por ejemplo, una cuenta de crowdworker comprometida) puede inyectar ejemplos sistemáticamente mal etiquetados. Esto es particularmente eficaz en los entornos de aprendizaje activo, donde el modelo consulta preferentemente los ejemplos inciertos —que pueden ser el objetivo del adversario.

**Evasión de la recompensa mediante retroalimentación:** En RLHF, los anotadores (o las anotaciones generadas por IA) que califican consistentemente ciertos tipos de contenido favorablemente pueden dirigir el modelo hacia ese contenido, independientemente de su calidad real.

**Mitigación:** Múltiples anotadores independientes por elemento; detección de valores atípicos en los patrones de anotación; monitorización de la concordancia o el desacuerdo anómalos; mantenimiento de conjuntos de evaluación que no puedan ser influenciados por la fuerza laboral de anotación.

---

## Ética Institucional

### IRB y Revisión Ética

Los proyectos de investigación que involucran sujetos humanos —incluidos los trabajadores de anotación— a menudo requieren la aprobación de un Comité de Revisión Institucional (IRB). Los proyectos de anotación que recopilan datos sobre las creencias de los trabajadores, las respuestas a contenido sensible o la información demográfica deben revisarse bajo el mismo marco ético que otras investigaciones con sujetos humanos.

### Gobernanza de Datos

Las organizaciones deben tener políticas claras para:
- Qué datos pueden enviarse para anotación externa frente a los que se anotan internamente
- Cuánto tiempo se conservan los datos de anotación y por quién
- Quién tiene acceso a las anotaciones y a los modelos entrenados con ellas
- Cómo manejar las solicitudes de eliminación de datos anotados (derecho de supresión del GDPR)

### Transparencia y Rendición de Cuentas

Los usuarios afectados por los sistemas de aprendizaje automático tienen un interés legítimo en comprender cómo se construyeron esos sistemas. Documentar la metodología de anotación —quién etiquetó los datos, bajo qué condiciones, con qué directrices— es una forma de rendición de cuentas que beneficia a los usuarios, los reguladores y el campo en su conjunto.

**Fichas de Datos para Conjuntos de Datos** {cite}`gebru2021datasheets` proporciona una plantilla estructurada para documentar la procedencia del conjunto de datos, los procedimientos de anotación y las limitaciones conocidas.

```{seealso}
Marco de equidad algorítmica: {cite}`barocas2019fairness`. Trabajo fantasma y trabajo en plataformas: Gray y Suri (2019). Fichas de Datos para Conjuntos de Datos: {cite}`gebru2021datasheets`. Bienestar de los trabajadores de moderación de contenido: {cite}`newton2019trauma`. Demografía de los anotadores y conjuntos de datos de PLN: {cite}`geva2019annotator`.
```
