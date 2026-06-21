# Annotation Platforms and Tooling

The annotation platform is the environment where human feedback becomes data. A good platform increases throughput, reduces errors, maintains quality controls, and makes the annotation pipeline manageable at scale. Choosing the right platform — and knowing when to build versus buy — is a consequential decision in any HITL project.

---

## The Annotation Platform Landscape

The market for annotation tooling has grown and matured substantially in recent years, driven by enterprise demand for ML training data. Tools span a wide range from fully managed services to open-source self-hosted frameworks.

### Open-Source Platforms

**Label Studio** is the most popular open-source annotation platform, supporting text, images, audio, video, and time-series data through a unified XML-based task configuration. It can be self-hosted and integrates with ML backends for active learning. Key strengths: flexibility, community support, and the ability to embed custom ML predictions for pre-annotation.

**Prodigy** (from the makers of spaCy) is a highly workflow-oriented annotation tool designed for NLP tasks. Its streaming architecture sends examples one at a time and supports active learning out of the box. The annotation interface is minimal but fast — designed to maximize annotation throughput. Prodigy is paid software but widely used in NLP research.

**CVAT (Computer Vision Annotation Tool)** is the leading open-source tool for CV annotation, with strong support for detection, segmentation, and video annotation. Originally developed at Intel, CVAT supports tracking algorithms, skeleton annotation, and third-party algorithm integrations.

**Doccano** targets sequence labeling tasks (NER, relation extraction, text classification). Its simple web interface makes it accessible for teams without dedicated data engineering resources.

### Commercial Platforms

**Scale AI** provides end-to-end managed annotation services: human workforce, quality management, and API integration. Particularly strong for autonomous driving, robotics, and complex 3D annotation. Pricing is based on task complexity and volume.

**Labelbox** is a full platform for data curation, annotation, and ML-assisted labeling. Strong enterprise features: project management, quality workflows, model feedback loops, and integrations with major ML platforms (SageMaker, Vertex AI, Azure ML).

**Appen** (formerly Figure Eight / CrowdFlower) operates a large global annotation workforce alongside tooling. A good choice when volume and workforce management are primary concerns.

**Surge AI** focuses on expert annotators and is strong for tasks requiring domain knowledge or nuanced judgment.

**Humanloop** specializes in LLM feedback collection — preference annotation, RLHF data collection, and model evaluation.

---

## Annotation Platform Feature Comparison

| Feature | Label Studio | Prodigy | CVAT | Labelbox | Scale AI |
|---|---|---|---|---|---|
| License | Open source | Commercial | Open source | Commercial | Commercial |
| Hosting | Self / cloud | Self | Self / cloud | Cloud | Managed |
| Text annotation | ✓ | ✓ | — | ✓ | ✓ |
| Image annotation | ✓ | Limited | ✓ | ✓ | ✓ |
| Video annotation | ✓ | — | ✓ | ✓ | ✓ |
| Active learning integration | ✓ | ✓ | Limited | ✓ | ✓ |
| ML-assisted pre-annotation | ✓ | ✓ | ✓ | ✓ | ✓ |
| Quality control workflows | Basic | Basic | Basic | Advanced | Advanced |
| API / Programmatic access | ✓ | ✓ | ✓ | ✓ | ✓ |
| Workforce management | — | — | — | Limited | ✓ |

---

## Annotation as Code

A critical but often overlooked aspect of annotation infrastructure is **version control for annotations and annotation schemas**. Treating annotation as code means:

**Schema-first design.** The label taxonomy and annotation rules are defined in a versioned configuration file (YAML or JSON) before annotation begins. Changes to the schema create a new version.

**Annotation versioning.** Annotations are stored with a link to the schema version under which they were created. This allows auditing, rolling back, and comparing annotations across schema versions.

**Reproducible pipelines.** The annotation pipeline — from raw data to training-ready labels — should be reproducible from code. Pre-annotation models, quality filters, aggregation logic, and data splits should all be recorded.

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
Data source
    |
    v
Unlabeled pool -->  Annotation platform --> Labeled dataset
    ^                    |                        |
    |                    | (ML-assisted)           v
Active learning <--------+                    Training run
query strategy                                    |
    ^                                             v
    +------------ Trained model <---------- Evaluation
                                                  |
                                            Deployment &
                                            monitoring
```

Key integration points:
1. **Data ingestion:** Unlabeled data flows automatically from the data warehouse to the annotation platform
2. **Model serving:** The current best model is deployed to the annotation platform for pre-annotation and active learning scoring
3. **Export:** Completed annotations are exported in a format compatible with the training framework (COCO JSON, Hugging Face datasets, etc.)
4. **Feedback loop:** Production model errors are routed back to the annotation platform for correction

```{seealso}
For Label Studio documentation and active learning integration: https://labelstud.io. For Prodigy: https://prodi.gy. CVAT: https://cvat.ai. For a comprehensive comparison of annotation tools, see {cite}`monarch2021human`, Chapter 7.
```
