# Plateformes et outils d'annotation

La plateforme d'annotation est l'environnement où le retour humain devient des données. Une bonne plateforme augmente le débit, réduit les erreurs, maintient les contrôles de qualité et rend le pipeline d'annotation gérable à grande échelle. Choisir la bonne plateforme — et savoir quand construire plutôt qu'acheter — est une décision importante dans tout projet HITL.

---

## Le paysage des plateformes d'annotation

Le marché des outils d'annotation a considérablement grandi et mûri ces dernières années, porté par la demande des entreprises en données d'entraînement pour l'apprentissage automatique. Les outils vont des services entièrement gérés aux frameworks open source auto-hébergés.

### Plateformes open source

**Label Studio** est la plateforme d'annotation open source la plus populaire, prenant en charge les données textuelles, images, audio, vidéo et séries temporelles via une configuration de tâche unifiée basée sur XML. Elle peut être auto-hébergée et s'intègre avec des backends d'apprentissage automatique pour l'apprentissage actif. Points forts : flexibilité, soutien communautaire et possibilité d'intégrer des prédictions ML pour la pré-annotation.

**Prodigy** (des créateurs de spaCy) est un outil d'annotation hautement orienté flux de travail conçu pour les tâches TAL. Son architecture en streaming envoie des exemples un par un et prend en charge l'apprentissage actif nativement. L'interface d'annotation est minimaliste mais rapide — conçue pour maximiser le débit. Prodigy est un logiciel payant mais largement utilisé dans la recherche en TAL.

**CVAT (Computer Vision Annotation Tool)** est le principal outil open source pour l'annotation en CV, avec un fort support pour la détection, la segmentation et l'annotation vidéo. Développé à l'origine chez Intel, CVAT prend en charge les algorithmes de suivi, l'annotation de squelettes et les intégrations d'algorithmes tiers.

**Doccano** cible les tâches d'étiquetage de séquences (NER, extraction de relations, classification de texte). Son interface web simple le rend accessible aux équipes sans ressources dédiées en ingénierie de données.

### Plateformes commerciales

**Scale AI** fournit des services d'annotation gérés de bout en bout : main-d'œuvre humaine, gestion de la qualité et intégration API. Particulièrement forte pour la conduite autonome, la robotique et l'annotation 3D complexe. La tarification est basée sur la complexité et le volume de la tâche.

**Labelbox** est une plateforme complète pour la curation de données, l'annotation et l'étiquetage assisté par apprentissage automatique. Fonctionnalités d'entreprise robustes : gestion de projets, flux de travail qualité, boucles de retour du modèle et intégrations avec les principales plateformes d'apprentissage automatique (SageMaker, Vertex AI, Azure ML).

**Appen** (anciennement Figure Eight / CrowdFlower) opère une grande main-d'œuvre d'annotation mondiale aux côtés d'outils. Un bon choix quand le volume et la gestion de la main-d'œuvre sont les principales préoccupations.

**Surge AI** se concentre sur les annotateurs experts et est fort pour les tâches nécessitant une connaissance du domaine ou un jugement nuancé.

**Humanloop** se spécialise dans la collecte de retours pour les LLM — annotation de préférences, collecte de données RLHF et évaluation des modèles.

---

## Comparaison des fonctionnalités des plateformes d'annotation

| Fonctionnalité | Label Studio | Prodigy | CVAT | Labelbox | Scale AI |
|---|---|---|---|---|---|
| Licence | Open source | Commercial | Open source | Commercial | Commercial |
| Hébergement | Auto / cloud | Auto | Auto / cloud | Cloud | Géré |
| Annotation de texte | ✓ | ✓ | — | ✓ | ✓ |
| Annotation d'images | ✓ | Limité | ✓ | ✓ | ✓ |
| Annotation vidéo | ✓ | — | ✓ | ✓ | ✓ |
| Intégration apprentissage actif | ✓ | ✓ | Limité | ✓ | ✓ |
| Pré-annotation assistée par ML | ✓ | ✓ | ✓ | ✓ | ✓ |
| Flux de travail contrôle qualité | Basique | Basique | Basique | Avancé | Avancé |
| Accès API / programmatique | ✓ | ✓ | ✓ | ✓ | ✓ |
| Gestion de la main-d'œuvre | — | — | — | Limité | ✓ |

---

## L'annotation comme code

Un aspect critique mais souvent négligé de l'infrastructure d'annotation est le **contrôle de version pour les annotations et les schémas d'annotation**. Traiter l'annotation comme du code signifie :

**Conception schéma d'abord.** La taxonomie des étiquettes et les règles d'annotation sont définies dans un fichier de configuration versionné (YAML ou JSON) avant le début de l'annotation. Les modifications du schéma créent une nouvelle version.

**Versionnage des annotations.** Les annotations sont stockées avec un lien vers la version du schéma sous laquelle elles ont été créées. Cela permet l'audit, la restauration et la comparaison des annotations entre les versions du schéma.

**Pipelines reproductibles.** Le pipeline d'annotation — des données brutes aux étiquettes prêtes à l'entraînement — devrait être reproductible à partir du code. Les modèles de pré-annotation, les filtres de qualité, la logique d'agrégation et les divisions de données devraient tous être enregistrés.

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
Source de données
    |
    v
Pool non étiqueté -->  Plateforme d'annotation --> Jeu de données étiqueté
    ^                        |                              |
    |                        | (assisté par ML)             v
Apprentissage actif <--------+                        Cycle d'entraînement
stratégie de requête                                        |
    ^                                                       v
    +---------- Modèle entraîné <--------------------- Évaluation
                                                            |
                                                      Déploiement &
                                                      surveillance
```

Points d'intégration clés :
1. **Ingestion de données :** Les données non étiquetées circulent automatiquement de l'entrepôt de données vers la plateforme d'annotation
2. **Service du modèle :** Le meilleur modèle actuel est déployé sur la plateforme d'annotation pour la pré-annotation et l'évaluation de l'apprentissage actif
3. **Export :** Les annotations complètes sont exportées dans un format compatible avec le framework d'entraînement (JSON COCO, jeux de données Hugging Face, etc.)
4. **Boucle de retour :** Les erreurs du modèle en production sont acheminées vers la plateforme d'annotation pour correction

```{seealso}
Pour la documentation Label Studio et l'intégration de l'apprentissage actif : https://labelstud.io. Pour Prodigy : https://prodi.gy. CVAT : https://cvat.ai. Pour une comparaison complète des outils d'annotation, voir {cite}`monarch2021human`, Chapitre 7.
```
