# Chapter 9 Technical Appendix Solutions

*Worked solutions for Appendix 9A exercises*

---

## Exercise 9A.1 Solution — Label Studio API Integration

**Task:** Set up a Label Studio annotation project via Python API; import 50 items; export completed annotations.

### Full Implementation

```python
from label_studio_sdk import Client
import json

# Connect to Label Studio
ls = Client(url='http://localhost:8080', api_key='YOUR_API_KEY')
ls.check_connection()

# Create project with text classification interface
project = ls.start_project(
    title='Sentiment Classification',
    label_config='''
    <View>
        <Text name="text" value="$text"/>
        <Choices name="sentiment" toName="text" choice="single">
            <Choice value="positive"/>
            <Choice value="negative"/>
            <Choice value="neutral"/>
        </Choices>
    </View>
    '''
)

# Import 50 tasks
sample_texts = [
    {"text": f"Sample review text number {i}."} for i in range(50)
]
project.import_tasks(sample_texts)

# Export completed annotations
annotations = project.export_tasks(export_type='JSON_MIN')

# Parse annotation results
results = []
for task in annotations:
    if task.get('annotations'):
        annotation = task['annotations'][0]
        choice = annotation['result'][0]['value']['choices'][0]
        results.append({
            'id': task['id'],
            'text': task['data']['text'],
            'label': choice
        })

print(f"Exported {len(results)} completed annotations")
```

**Key learning points:**
- `Client` handles authentication and connection
- `start_project` accepts Label Studio XML configuration
- Export types: `JSON_MIN` for compact output, `JSON` for full metadata
- The `annotations[0]` pattern handles the case where multiple annotators labeled the same item

---

## Exercise 9A.2 Solution — HITLAnnotationPipeline

**Task:** Build a complete annotation pipeline with quality control and inter-annotator agreement monitoring.

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
    End-to-end annotation pipeline with quality control.
    
    Manages task routing, annotator assignment, quality measurement,
    and disagreement resolution.
    """
    
    def __init__(
        self,
        ls_url: str,
        api_key: str,
        project_id: int,
        min_kappa: float = 0.60,
        overlap_fraction: float = 0.10,
    ):
        self.client = Client(url=ls_url, api_key=api_key)
        self.project = self.client.get_project(project_id)
        self.min_kappa = min_kappa
        self.overlap_fraction = overlap_fraction
        self._annotator_records: Dict[str, List] = defaultdict(list)
    
    def measure_agreement(
        self, 
        tasks_with_multiple_annotations: List[dict]
    ) -> Tuple[float, dict]:
        """
        Compute kappa across all annotator pairs from overlap tasks.
        
        Returns:
            aggregate_kappa: float
            per_pair_kappa: dict mapping (annotator_1, annotator_2) -> kappa
        """
        # Build per-task annotator label map
        per_task = defaultdict(dict)  # task_id -> {annotator_id: label}
        
        for task in tasks_with_multiple_annotations:
            task_id = task['id']
            for ann in task.get('annotations', []):
                annotator_id = ann.get('completed_by', {}).get('id', 'unknown')
                if ann.get('result'):
                    label = ann['result'][0]['value']['choices'][0]
                    per_task[task_id][annotator_id] = label
        
        # Find pairs with shared tasks
        annotator_ids = set()
        for labels in per_task.values():
            annotator_ids.update(labels.keys())
        annotator_ids = list(annotator_ids)
        
        per_pair_kappa = {}
        all_labels_a, all_labels_b = [], []
        
        for i in range(len(annotator_ids)):
            for j in range(i + 1, len(annotator_ids)):
                a, b = annotator_ids[i], annotator_ids[j]
                shared_labels_a, shared_labels_b = [], []
                
                for task_labels in per_task.values():
                    if a in task_labels and b in task_labels:
                        shared_labels_a.append(task_labels[a])
                        shared_labels_b.append(task_labels[b])
                
                if len(shared_labels_a) >= 5:  # minimum for reliable kappa
                    kappa = cohen_kappa_score(shared_labels_a, shared_labels_b)
                    per_pair_kappa[(a, b)] = kappa
                    all_labels_a.extend(shared_labels_a)
                    all_labels_b.extend(shared_labels_b)
        
        aggregate_kappa = (
            cohen_kappa_score(all_labels_a, all_labels_b) 
            if all_labels_a else float('nan')
        )
        return aggregate_kappa, per_pair_kappa
    
    def flag_low_quality_annotators(
        self, 
        per_pair_kappa: dict,
        threshold: float = 0.40
    ) -> List[str]:
        """
        Identify annotators whose average pairwise kappa is below threshold.
        """
        annotator_kappas = defaultdict(list)
        for (a, b), kappa in per_pair_kappa.items():
            annotator_kappas[a].append(kappa)
            annotator_kappas[b].append(kappa)
        
        low_quality = []
        for annotator_id, kappas in annotator_kappas.items():
            avg_kappa = np.mean(kappas)
            if avg_kappa < threshold:
                logger.warning(
                    f"Annotator {annotator_id}: avg kappa {avg_kappa:.3f} "
                    f"below threshold {threshold}"
                )
                low_quality.append(annotator_id)
        
        return low_quality
    
    def compute_cost_estimate(
        self,
        n_items: int,
        n_annotators_per_item: int,
        cost_per_annotation: float,
        overlap_fraction: Optional[float] = None
    ) -> dict:
        """
        Estimate total annotation cost.
        """
        overlap = overlap_fraction or self.overlap_fraction
        n_overlap = int(n_items * overlap)
        n_regular = n_items - n_overlap
        
        # Regular items: 1 annotator each
        # Overlap items: n_annotators each (for agreement measurement)
        total_annotations = n_regular + n_overlap * n_annotators_per_item
        total_cost = total_annotations * cost_per_annotation
        
        return {
            'n_items': n_items,
            'n_overlap_items': n_overlap,
            'total_annotations': total_annotations,
            'cost_per_annotation': cost_per_annotation,
            'estimated_total_cost': total_cost,
            'cost_for_quality_control': n_overlap * n_annotators_per_item * cost_per_annotation,
            'cost_fraction_for_qc': (n_overlap * n_annotators_per_item) / total_annotations,
        }
```

**Expected output for cost estimate with 10,000 items, 3-way overlap, $0.05/annotation:**
```
n_items: 10,000
n_overlap_items: 1,000
total_annotations: 9,000 + 3,000 = 12,000
estimated_total_cost: $600.00
cost_fraction_for_qc: 25%
```

---

## Exercise 9A.3 Solution — Inter-Annotator Agreement Analysis

**Task:** Given a dataset with per-annotator labels, compute kappa, identify outlier annotators, assess impact of removing contested items.

```python
import numpy as np
from sklearn.metrics import cohen_kappa_score
from itertools import combinations
import pandas as pd

def analyze_annotator_agreement(
    annotations: pd.DataFrame  # columns: item_id, annotator_id, label
) -> dict:
    """
    Comprehensive inter-annotator agreement analysis.
    
    Returns per-pair kappa, outlier annotators, and projected
    kappa after removing most-contested items.
    """
    annotators = annotations['annotator_id'].unique()
    items = annotations['item_id'].unique()
    
    # Pivot to item x annotator matrix
    pivot = annotations.pivot(
        index='item_id', 
        columns='annotator_id', 
        values='label'
    )
    
    # Per-pair kappa
    pair_kappas = {}
    for a1, a2 in combinations(annotators, 2):
        shared = pivot[[a1, a2]].dropna()
        if len(shared) >= 5:
            kappa = cohen_kappa_score(shared[a1], shared[a2])
            pair_kappas[(a1, a2)] = {'kappa': kappa, 'n': len(shared)}
    
    # Per-annotator average kappa
    annotator_avg_kappa = {}
    for ann in annotators:
        related = [
            v['kappa'] for k, v in pair_kappas.items() 
            if ann in k
        ]
        annotator_avg_kappa[ann] = np.mean(related) if related else float('nan')
    
    # Identify outliers (kappa > 1.5 std devs below mean)
    kappas = list(annotator_avg_kappa.values())
    mean_k = np.nanmean(kappas)
    std_k = np.nanstd(kappas)
    outliers = [
        ann for ann, k in annotator_avg_kappa.items()
        if not np.isnan(k) and k < mean_k - 1.5 * std_k
    ]
    
    # Identify most contested items (highest disagreement)
    # Use standard deviation of labels as disagreement proxy
    label_map = {label: i for i, label in enumerate(
        annotations['label'].unique()
    )}
    pivot_numeric = pivot.replace(label_map)
    item_disagreement = pivot_numeric.std(axis=1)
    contested_items = item_disagreement.nlargest(
        int(0.10 * len(items))  # top 10% most contested
    ).index.tolist()
    
    # Compute kappa after removing contested items
    non_contested = pivot.drop(index=contested_items)
    clean_kappas = {}
    for a1, a2 in combinations(annotators, 2):
        shared = non_contested[[a1, a2]].dropna()
        if len(shared) >= 5:
            kappa = cohen_kappa_score(shared[a1], shared[a2])
            clean_kappas[(a1, a2)] = kappa
    
    aggregate_clean = np.mean(list(clean_kappas.values()))
    aggregate_original = np.mean([v['kappa'] for v in pair_kappas.values()])
    
    return {
        'pair_kappas': pair_kappas,
        'annotator_avg_kappa': annotator_avg_kappa,
        'outlier_annotators': outliers,
        'contested_items': contested_items,
        'aggregate_kappa_original': aggregate_original,
        'aggregate_kappa_without_contested': aggregate_clean,
        'kappa_improvement': aggregate_clean - aggregate_original,
    }
```

**Interpretation notes:**
- Removing the top 10% most contested items typically improves kappa by 0.08–0.15
- Outlier annotators identified by 1.5 SD threshold represent approximately the bottom 7% of annotators
- For items with high disagreement: (a) some are genuinely ambiguous → keep as uncertain; (b) some are clear cases that a subgroup of annotators consistently mislabels → investigate

---

## Tool Selection Decision Matrix

| Factor | Weight (1–5) | Label Studio | Argilla | CVAT | Scale AI | SageMaker GT |
|--------|-------------|--------------|---------|------|----------|--------------|
| Open source | 4 | ✓✓ | ✓✓ | ✓✓ | ✗ | ✗ |
| NLP support | 3 | ✓ | ✓✓ | ✗ | ✓ | ✓ |
| Vision support | 3 | ✓ | ✗ | ✓✓ | ✓✓ | ✓✓ |
| Managed annotators | 5 | ✗ | ✗ | ✗ | ✓✓ | ✓ |
| Active learning | 3 | ✓ | ✓ | ✗ | ✓ | ✓ |
| Privacy / self-host | 5 | ✓✓ | ✓✓ | ✓✓ | limited | ✓ |
| Technical barrier | 4 | medium | medium | medium | low | low |

Scoring: ✓✓ = excellent, ✓ = good, ✗ = poor/not supported
