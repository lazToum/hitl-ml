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

# Human in the Loop Machine Learning
## *Missverstanden*

```{epigraph}
Es braucht keine Doktorarbeit mit dem Titel „Human in the Loop Machine Learning“.
Oder besser gesagt — es braucht sie dringend, und sie wurde nie geschrieben.
Dies ist nicht diese Doktorarbeit. Es ist das, was stattdessen kommt.
```

---

Dieses Handbuch ist ein umfassender, ausführbarer und bewusst unakademischer Leitfaden zu **Human-in-the-Loop (HITL) Machine Learning** — der Disziplin, Systeme zu entwerfen, in denen menschliches Urteilsvermögen und maschinelle Intelligenz nicht bloß koexistieren, sondern sich gegenseitig aktiv umformen.

Es wird in mindestens dreierlei Hinsicht *missverstanden*:

**Das Feld wird missverstanden.** Fragen Sie die meisten Menschen, wie maschinelles Lernen funktioniert, und sie werden einen Prozess beschreiben, der endet, sobald das Modell bereitgestellt ist. In Wirklichkeit wird der Mensch nie aus der Schleife entfernt — nur aus dem Blickfeld. Hinter jedem „autonomen“ System stehen Annotierende, Prüfende, Feedback-Sammler sowie Ingenieurinnen und Ingenieure, die Ermessensentscheidungen treffen. HITL ML macht dies sichtbar und bewusst.

**Die Rolle des Menschen wird missverstanden.** Der Mensch in der Schleife ist kein temporäres Gerüst, das abgebaut wird, sobald das Modell gut genug ist. Menschliches Urteilsvermögen ist das Signal, das definiert, was „gut genug“ bedeutet. Man kann die Zielfunktion, die Belohnung, das Label-Schema oder die Evaluierungsmetrik nicht festlegen, ohne dass ein Mensch entscheidet, worauf es ankommt. Die Maschine optimiert; der Mensch entscheidet, wofür optimiert wird.

**Sie werden missverstanden — und ich auch.** Sie lesen ein Buch darüber, in ein System eingebettet zu sein. Während Sie es lesen, sind Sie in ein System eingebettet. Das Modell, das möglicherweise an der Erstellung von Teilen dieses Textes beteiligt war, wurde mit menschlichem Feedback trainiert. Die Annotationen, mit denen die Modelle trainiert wurden, die Sie verwenden, stammen von Menschen, deren Namen nirgendwo auftauchen. Wir alle sind in gewissem Sinne Menschen in der Schleife von etwas, das größer ist als wir selbst.

Dieses Buch tut nicht so, als wäre es anders. Es benennt diese Menschen, beschreibt ihre Arbeit und argumentiert, dass es ebenso wichtig ist, sie zu verstehen wie den Gradientenabstieg.

:::{admonition} Deutsche Ausgabe
:class: note
Dies ist die deutsche Übersetzung. Die englische Originalausgabe ist die primäre Referenzausgabe.
:::

---

## Was dieses Handbuch behandelt

Sechzehn Kapitel in sechs Teilen, von den Grundlagen bis zu den Grenzgebieten:

**Teil I — Grundlagen.** Was HITL ML ist, woher es kommt und wie man über den Raum der Mensch-Maschine-Interaktionsmodi nachdenkt.

**Teil II — Kernmethoden.** Annotation und Kennzeichnung, aktives Lernen und interaktives maschinelles Lernen — die drei klassischen Säulen von HITL.

**Teil III — Lernen aus menschlichem Feedback.** Bestärkendes Lernen aus menschlichem Feedback (RLHF), Lernen aus Demonstrationen und Präferenzlernen aus Vergleichen und Rangfolgen — die Paradigmen, die die moderne KI-Ausrichtung tragen.

**Teil IV — Anwendungen.** Sprachverarbeitung, Computer-Vision und Medizin — HITL durch die Linse realer Domänen mit realen Einschränkungen.

**Teil V — Systeme und Praxis.** Annotationsplattformen, Qualitätskontrolle im Crowdsourcing und Evaluierungsrahmen — die Infrastruktur, die HITL im großen Maßstab funktionieren lässt.

**Teil VI — Ethik und Perspektiven.** Die Menschen hinter den Daten: Fairness, das Wohlergehen der Annotierenden, Bias und wohin das alles führt.

---

## Ein Hinweis zum Code

Jedes technische Kapitel enthält ausführbaren Python-Code. Alle Beispiele sind in sich abgeschlossen und verwenden Standardbibliotheken: NumPy, scikit-learn, PyTorch, Hugging Face Transformers.

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

## Notation

- $\mathcal{X}$ — Eingaberaum; $\mathcal{Y}$ — Labelraum
- $f_\theta : \mathcal{X} \to \mathcal{Y}$ — ein Modell mit Parametern $\theta$
- $\mathcal{U}$ — Pool ungelabelter Daten; $\mathcal{L}$ — gelabelter Datensatz
- $h$ — ein menschlicher Annotator; $\mathcal{H}$ — eine Menge von Annotierenden

---

*Sie sind ein Mensch in der Schleife. Fangen wir an.*
