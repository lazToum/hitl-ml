# Appendix 9A: Annotation Pipeline Tooling — Python Reference

*Python implementations, API references, and integration patterns for production annotation pipelines*

---

## 9A.1 Label Studio API Integration

Label Studio's Python SDK provides programmatic access to all platform features. The SDK supports Python 3.8+ and is available via pip.

### Installation and Connection

```python
pip install label-studio-sdk
```

```python
from label_studio_sdk import Client

# Connect to Label Studio instance
ls = Client(url='http://localhost:8080', api_key='YOUR_API_KEY')

# Verify connection
ls.check_connection()
# Returns True if connection is successful
```

### Project Creation

```python
# Text classification project
project = ls.start_project(
    title='Document Classification',
    label_config='''
    <View>
      <Text name="text" value="$text"/>
      <Choices name="label" toName="text" choice="single">
        <Choice value="relevant"/>
        <Choice value="irrelevant"/>
        <Choice value="uncertain"/>
      </Choices>
    </View>
    '''
)

# Image classification project
image_project = ls.start_project(
    title='Image Quality Assessment',
    label_config='''
    <View>
      <Image name="image" value="$image_url"/>
      <Rating name="quality" toName="image" maxRating="5" icon="star"/>
      <TextArea name="notes" toName="image" placeholder="Optional notes..."/>
    </View>
    '''
)
```

### Task Import

```python
# Import from list of dicts
tasks = [
    {"text": "First document to classify."},
    {"text": "Second document to classify."},
]
project.import_tasks(tasks)

# Import from JSON file
import json
with open('tasks.json') as f:
    tasks = json.load(f)
project.import_tasks(tasks)

# Import with pre-annotations (for model-assisted annotation)
pre_annotated_tasks = [
    {
        "text": "Document text here.",
        "predictions": [
            {
                "result": [{
                    "from_name": "label",
                    "to_name": "text",
                    "type": "choices",
                    "value": {"choices": ["relevant"]},
                    "score": 0.87
                }]
            }
        ]
    }
]
project.import_tasks(pre_annotated_tasks)
```

### Export and Parsing

```python
# Export all completed annotations
annotations = project.export_tasks(export_type='JSON_MIN')

# Parse annotations
results = []
for task in annotations:
    if task.get('annotations'):
        # Get first annotation (use majority vote for multi-annotator tasks)
        ann = task['annotations'][0]
        if ann.get('result'):
            label = ann['result'][0]['value']['choices'][0]
            results.append({
                'id': task['id'],
                'text': task['data']['text'],
                'label': label,
                'annotator': ann.get('completed_by', {}).get('id'),
                'created_at': ann.get('created_at'),
            })

# Export as DataFrame
import pandas as pd
df = pd.DataFrame(results)
```

---

## 9A.2 Complete HITLAnnotationPipeline

```python
import numpy as np
from label_studio_sdk import Client
from sklearn.metrics import cohen_kappa_score
from collections import defaultdict
from typing import Dict, List, Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class HITLAnnotationPipeline:
    """
    Production annotation pipeline with quality control.
    
    Features:
    - Automatic overlap sampling for inter-annotator agreement measurement
    - Per-annotator kappa computation with outlier detection
    - Multi-stage routing (fast pass → expert review for low-confidence items)
    - Integration with active learning queues
    """
    
    def __init__(
        self,
        ls_url: str,
        api_key: str,
        project_id: int,
        min_kappa: float = 0.60,
        overlap_fraction: float = 0.10,
        expert_threshold: float = 0.45,
    ):
        self.client = Client(url=ls_url, api_key=api_key)
        self.project = self.client.get_project(project_id)
        self.min_kappa = min_kappa
        self.overlap_fraction = overlap_fraction
        self.expert_threshold = expert_threshold
        self._quality_metrics_history = []
    
    def sample_overlap_items(
        self, 
        all_items: List[dict],
    ) -> Tuple[List[dict], List[dict]]:
        """
        Split items into overlap (multi-annotator) and regular (single-annotator).
        """
        n = len(all_items)
        n_overlap = max(30, int(n * self.overlap_fraction))
        
        np.random.shuffle(all_items)
        overlap_items = all_items[:n_overlap]
        regular_items = all_items[n_overlap:]
        
        return overlap_items, regular_items
    
    def compute_project_kappa(self) -> Tuple[float, List[str]]:
        """
        Compute inter-annotator kappa from completed overlap tasks.
        Returns aggregate kappa and list of low-quality annotator IDs.
        """
        tasks = self.project.export_tasks(export_type='JSON')
        
        # Filter to tasks with multiple annotations
        overlap_tasks = [
            t for t in tasks
            if len(t.get('annotations', [])) >= 2
        ]
        
        if not overlap_tasks:
            logger.warning("No overlap tasks found — cannot compute kappa")
            return float('nan'), []
        
        # Build annotator → labels mapping per task
        per_task: Dict[int, Dict[str, str]] = {}
        for task in overlap_tasks:
            task_id = task['id']
            per_task[task_id] = {}
            for ann in task['annotations']:
                ann_id = str(ann.get('completed_by', {}).get('id', 'unknown'))
                if ann.get('result'):
                    label = ann['result'][0]['value']['choices'][0]
                    per_task[task_id][ann_id] = label
        
        # Compute pairwise kappas
        all_annotators = set()
        for labels in per_task.values():
            all_annotators.update(labels.keys())
        all_annotators = list(all_annotators)
        
        pair_kappas: Dict[Tuple[str, str], float] = {}
        for i in range(len(all_annotators)):
            for j in range(i + 1, len(all_annotators)):
                a, b = all_annotators[i], all_annotators[j]
                la, lb = [], []
                for task_labels in per_task.values():
                    if a in task_labels and b in task_labels:
                        la.append(task_labels[a])
                        lb.append(task_labels[b])
                if len(la) >= 5:
                    pair_kappas[(a, b)] = cohen_kappa_score(la, lb)
        
        if not pair_kappas:
            return float('nan'), []
        
        # Aggregate kappa
        all_a, all_b = [], []
        for (a, b), _ in pair_kappas.items():
            for task_labels in per_task.values():
                if a in task_labels and b in task_labels:
                    all_a.append(task_labels[a])
                    all_b.append(task_labels[b])
        
        aggregate_kappa = cohen_kappa_score(all_a, all_b) if all_a else float('nan')
        
        # Identify low-quality annotators
        annotator_avg_kappa = defaultdict(list)
        for (a, b), kappa in pair_kappas.items():
            annotator_avg_kappa[a].append(kappa)
            annotator_avg_kappa[b].append(kappa)
        
        low_quality = [
            ann_id for ann_id, kappas in annotator_avg_kappa.items()
            if np.mean(kappas) < self.expert_threshold
        ]
        
        self._quality_metrics_history.append({
            'aggregate_kappa': aggregate_kappa,
            'n_annotators': len(all_annotators),
            'n_overlap_tasks': len(overlap_tasks),
        })
        
        return aggregate_kappa, low_quality
    
    def route_for_expert_review(
        self,
        completed_tasks: List[dict]
    ) -> Tuple[List[dict], List[dict]]:
        """
        Split completed tasks into accepted annotations and expert review queue.
        
        Routes to expert review:
        - Tasks where annotators disagreed
        - Tasks annotated by low-quality annotators
        """
        # Identify low-quality annotators from current kappa measurement
        _, low_quality_ids = self.compute_project_kappa()
        
        accepted = []
        expert_queue = []
        
        for task in completed_tasks:
            annotations = task.get('annotations', [])
            
            # Check for disagreement
            if len(annotations) >= 2:
                labels = set()
                for ann in annotations:
                    if ann.get('result'):
                        labels.add(ann['result'][0]['value']['choices'][0])
                if len(labels) > 1:
                    expert_queue.append(task)
                    continue
            
            # Check for low-quality annotator
            annotator_ids = [
                str(ann.get('completed_by', {}).get('id', ''))
                for ann in annotations
            ]
            if any(aid in low_quality_ids for aid in annotator_ids):
                expert_queue.append(task)
                continue
            
            accepted.append(task)
        
        return accepted, expert_queue
    
    def cost_estimate(
        self,
        n_items: int,
        cost_per_annotation_usd: float,
        n_annotators_per_overlap_item: int = 3
    ) -> dict:
        """Estimate total project cost including quality control overhead."""
        n_overlap = max(30, int(n_items * self.overlap_fraction))
        n_regular = n_items - n_overlap
        
        total_annotations = (
            n_regular
            + n_overlap * n_annotators_per_overlap_item
        )
        total_cost = total_annotations * cost_per_annotation_usd
        
        return {
            'n_items': n_items,
            'n_overlap_items': n_overlap,
            'total_annotations': total_annotations,
            'total_cost_usd': round(total_cost, 2),
            'qc_overhead_fraction': n_overlap * n_annotators_per_overlap_item / total_annotations,
        }
```

---

## 9A.3 Tool Comparison Summary

| Tool | Data Types | Managed Annotators | Self-Hostable | Best Use Case |
|------|------------|-------------------|---------------|---------------|
| Label Studio | All | No | Yes | Research, privacy-sensitive, customized workflows |
| Argilla | NLP, LLM eval | No | Yes | RLHF preference collection, NLP annotation |
| CVAT | Image, video | No | Yes | Object detection, segmentation |
| Prodigy | NLP | No | License | Fast NLP with active learning |
| Scale AI | All | Yes | No | High-volume, time-constrained commercial projects |
| SageMaker GT | All | Yes (MTurk) | AWS-hosted | AWS-integrated workflows |
| Labelbox | All | Yes | No | Enterprise, collaborative teams |

---

## 9A.4 Exercises

**Exercise 9A.1:** Using the Label Studio SDK, set up a project for binary text classification. Import 50 sample items. Annotate 20 items manually. Export the results and compute the distribution of labels.

**Exercise 9A.2:** Extend the `HITLAnnotationPipeline` class to support a configurable majority vote resolution for overlap items. When 3 annotators label an item and 2 agree, accept the majority. When all 3 disagree on a 3-class task, route to expert review.

**Exercise 9A.3:** Using the inter-annotator agreement code, analyze a real annotation dataset (the SNLI or MultiNLI datasets from HuggingFace include per-annotator labels). Compute pairwise kappa for all annotator pairs. Identify the 10% most contested items. What is the kappa improvement from removing them?

**Exercise 9A.4:** Build a cost estimation function that accounts for: (a) initial annotation; (b) quality control overlap; (c) expected expert re-annotation rate for items that fail quality control. For a project of 10,000 items with $0.10/annotation and 10% expert re-annotation rate at $1.00/annotation, what is the total estimated cost?
