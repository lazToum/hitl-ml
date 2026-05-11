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

# በቀለበት ውስጥ ያለ ሰው በኮምፒውተር ራዕይ

ኮምፒውተር ራዕይ HITL ML ሙሉ ሰፊ ዐይን ሙሉ ዋናቱ ምሳሌዎቹ ሊሰጡ ናቸው። ImageNet ፈተናው፣ 14 ሚሊዮን ሰው-ሰለጠኑ ምስሎቹ ሙሉ ሠሩ፣ ጥልቅ ትምህርቱ ዘመን ሚጀምሩ ሆነ። ሬዲዮሎጂስቶቹ ሙሉ ሕክምናዊ ምስሉ ትርጓሜ ምርምሩ AI ሙሉ ሚሰጡ ናቸው። ራስ-ሚሄዱ ተሽከርካሪዎቹ ዓለሙ ሊያዩ ሊማሩ ሰው-ሰለጠኑ ፍሬሞቹ ሚሊዮኖቹ ሙሉ ሚፈልጉ ናቸው።

ሊታዩ ቀናቱ ሁኔታ ምንድን ነው፦ ሰዎቹ ዕውን ሐቅ ሙሉ ሊሰጡ ብቻ ሳይሆን — ተለይቶ ምልከታ፣ ባህላዊ፣ እና ሥራ ምርጫዎቹ ሙሉ ምሳምሳዎቹ ሊሠሩ ናቸው — ሞዴሎቹ ሊወድቁ ሙሉ ምናምን ዓይነቶቹ ሊታዩ ብቻ ዋናቱ ቀጣዩ ሙሉ ናቸው።

---

## ትርጓሜ ምርጫዎቹ ሞዴሉ አድልዎ ሙኒያ ሙኒያ

ምናምን ማዕቀፉ ትርጓሜ ዳታ ስብሰባ ሙሉ ሊያስቀምጣቸው ናቸው፦ ሰዎቹ ዓለሙ ሙሉ ሊያዩ እና ሚያዩ ሙሉ ሊያሳዩ ናቸው። ሰፊ ትክክለኛ ማዕቀፉ ትርጓሜ *ውሂቡ ዲዛይን* ነው፦ ሰዎቹ ምን ምድቦቹ ሊጠቀሙ፣ ወሰኖቹ ሙሉ ሙሉ ሊሰቡ፣ ምን ጫፍ-ሁኔታዎቹ ሊያካትቱ፣ እናም ብዥታ ሙሉ ሙሉ ሙሉ ሊፈቱ ሊወስዱ ናቸው — ያ ወሳኔዎቹ ሁሉ ሰለጠነ ሞዴሉ ምን ሊያዩ ቅርፁ ናቸው።

### ImageNet ሁኔታ

ImageNet {cite}`russakovsky2015imagenet` ኮምፒውተር ራዕይ ታሪኩ ሙሉ ሰፊ ዋናቱ ውሂቡ ስብስቡ ነው። ትርጓሜ ዕቅዱ WordNet ሲንሴቶቹ ሙሉ ሙሉ ሊወጡ ናቸው፣ ዋናቱ ብዙ እና ሲማንቲካዊ ሙሉ ሙሉ ልዩ ምክንያቱ ሙሉ ምርጡ ናቸው። ይህ ዲዛይን ምርጫ ብዙ ዓመቶቹ ቀጣዩ ሙሉ ዋናቱ ሁኔታዎቹ ሙሉ ሆኑ፦

- **ሰው ምድቦቹ ዴሞግራፊያዊ ዝምዝምቶቹ ሙሉ ሸፈኑ።** ቀደምቱ ImageNet ሲንሴቱ ሰዎቹ ሙሉ ትርጓሜዎቹ ሁሉ አሁን ሙሉ ሙሉ ወይም አድልዎ ያለ ሙሉ ሊቆጠሩ ናቸው፣ ታሪካዊ WordNet ምንጩ እና ሙሉ ትርጓሜ ሠራተኞቹ ምን ምስሎቹ ሙሉ ምን ትርጓሜዎቹ ሙሉ ሊሰጡ ምናምን ወሳኔዎቻቸው ሁሉ ሙሉ ሊያሳዩ ናቸው {cite}`yang2020towards`። ሰዎቹ ምስሎቹ ሙሉ ሰሪ ትርጓሜዎቹ ዘር፣ ፆታ፣ እና ምድቡ ዝምዝምቶቹ ሸፈኑ ሙሉ ቀጥተኛ ወደ ሞዴሉ ምሥጢሮቹ ሙሉ ሄደ።

- **ዝርዝሩ ዝርያው ምደባ፣ ሌሎቹ ሁሉ ሰፊ ምደባ።** ImageNet 120 ውሻ ዝርያዎቹ ሙሉ ሊለዩ ናቸው ግን ሳሙናዎቹ፣ ተሽከርካሪዎቹ፣ ምግቡ፣ እና ወንበሩ ሙሉ ሰፊ ሙሉ ወደ አንዱ ምድቡ ሙሉ ሻቅሉ። ይህ WordNet ቅርፍ ሙሉ ሙሉ ምክንያቱ ምን ዋናቱ ሙሉ ሙሉ ምርጫ ሙሉ ሳይሆን ነው። ImageNet ሙሉ ሰለጠኑ ሞዴሎቹ ያው ምናምን ምናምን ዋናቱ ሙሉ ሊያሳዩ ናቸው።

- **ምዕራባዊ፣ ሉዐሉ ቋንቋ ቀናቱ ዐይን ሙሉ።** ምስሎቹ ዋናቱ Flickr እና ሉዐሉ ቋንቋ ጥያቄዎቹ ሙሉ ኢንተርኔቱ ፍለጋዎቹ ሙሉ ሰበሰቡ። ምናምን ስርጭቱ ምዕራቡ፣ ሉዐሉ ቋንቋ ሚናገሩ ሀገሮቹ ዐይን አካባቢ እና ባህላዊ ዕቃዎቹ ሙሉ ሰፊ ሊሸዘዘጥ ናቸው።

እነዚህ ሙሉ ስህተቶቹ ሳይሆኑ ናቸው። ሰፊ ደረጃ ቶሎ ሙሉ ሠሩ ትርጓሜ ዲዛይን ምርጫዎቹ ናቸው፣ ብዙ ጊዜ ውሂቡ ስብስቡ ሙሉ ሊጠቀሙ ምን ሁኔታ ሙሉ ሊጠብቁ ሙሉ ሳይሆን ሰዎቹ ሙሉ። ሙሉ አቋሙ ImageNet ሌላ ሁኔታ ሊሠሩ ሙሉ (ምንም ሆኖ ሊሠሩ ሉዓሎቸው ናቸው) ሳይሆን **ትርጓሜ ዲዛይን ሞዴሉ ዲዛይን ነው**፣ ያው ጥንቃቄ ሙሉ ሊያዙ ሉዓሎቸው ናቸው።

:::{admonition} ትርጓሜ ዕቅዱ ዓለሙ ቲዎሪ ነው
:class: note

ምሳሌ ምደባ ዕቅዱ ምን ልዩነቶቹ ዋናቱ ሙሉ ሙሉ ምናምን ናቸው ሊወስዱ ናቸው። "ማሽን" ሙሉ "ጭነቱ" ሙሉ ሊለዩ ስምምነቱ ሴዳኖቹ ሁሉ ወደ አንዱ ምድቡ ሙሉ ሙሉ ሙሙ ሲማንቲካዊ ዋናቱ ምን ሁሉ ሙሉ ቲዎሪያዊ ሙሉ ሙሉ ሌለ ምናምን ነው። ሰዎቹ ሙሉ "ሰው" አንዱ ምድቡ ሙሉ ሙሉ ሙሉ ሆን ወይም ሥራ ሙሉ ሳይሆን ሌላ ቲዎሪያዊ ሙሉ ሙሉ ሌለ ምናምን ነው። እነዚህ ዕቅዶቹ ሙሉ ሰለጠኑ ሞዴሎቹ ያው ልዩነቶቹ ሊሠሩ ናቸው፣ ሙሉ ምናምን — ሊሰለጥኑ ሙሉ ምድቦቹ ሙሉ ሊሰፋፋ ሊሄዱ አይዟሉ።
:::

---

## ምስሉ ምደባ ትርጓሜ

ቀናቱ CV ትርጓሜ ሥራ ሙሉ ምስሉ ሙሉ አንዱ ወይም ሙሉ ትርጓሜዎቹ ሊሰጡ ነው።

**ትርጓሜ ሰሪ ዝርዝሩ።** "ውሻ" ትርጓሜ ሲማንቲካዊ ዝርዝሩ ሙሉ "እንስሳ" ልጅ ነው። ምናምን ምደቦቹ ሙሉ ሰለጠኑ ሞዴሎቹ ምናምን ሙሉ ሙሉ ሊሰፋፋ ሊሄዱ አይዟሉ። ImageNet ምናምን-ሁሉ ዝርዝሩ ሙሉ ዋናቱ ሙሉ ምዘናቸው ሊያደርጋቸዋሉ ናቸው።

**ብዙ-ትርጓሜ ብዥታ።** የሜዳ ዕይታ ሙሉ ምናምን ማሽን፣ ሰው፣ ብስክሌቱ፣ እናም ምልክቱ ብርሃን ሁሉ አንድ ጊዜ ሙሉ ያካትታሉ። ምን ትርጓሜዎቹ ሙሉ ሊያካትቱ ወሰኑ ዋናቱ ድርሳዎቹ ሙሉ ዋናቱ ሙሉ ሁሉ ዋናቱ መምሪያዎቹ ሙሉ ሊፈልጉ ናቸው።

**ረዥም-ጭራ ስርጭቶቹ።** ዕውን ምስሉ ውሂቡ ስብስቦቹ ሙሉ ሁሉ ሕግ ሙሉ ሙሉ ሙሉ ናቸው፦ ምደቦቹ ብዙ ናቸው ብዙ ናቸው፤ ሙሉ ናቸው ምናምን ናቸው። ንቁ ትምህርቱ ምናምን ናሙናቸው ብዙ ምሳሌዎቹ ሙሉ ሊሰጡ ብቻ ምናምን ስብሰባ ሙሉ ረዥም-ጭራ ምድቦቹ ሙሉ ሰፊ ዋናቱ ነው።

---

## ዕቃ ዕውቅና፦ ሚሰፉ ሳጥን ትርጓሜ

ዕቃ ዕውቅና ትርጓሜ ሰጪዎቹ ምድቡ ሁሉ ዕቃ ዕቃ ሁሉ ዘንጋ-ሰለጠነ ሚሰፉ ሳጥኖቹ ሙሉ ሊሰቡ ያስፈልጋቸዋሉ። ይህ ጂዎሜትሪካዊ ዋናቱ ፍላጎቶቹ እና ሰፊ ጫፍ-ሁኔታዎቹ ሙሉ ሙሉ ሊያስተዋውቃቸዋሉ ናቸው።

**ትርጓሜ ጥራቱ ቁጥሮቹ፦**

*IoU (ሂደቱ-ሁሉ-ዩኒዮን)* ሰለጠነ ሳጥን እና ዋቢ ሳጥን ሙሉ ሙሉ ሊለካ ናቸው፦

$$
\text{IoU}(A, B) = \frac{|A \cap B|}{|A \cup B|}
$$

$\text{IoU} \geq 0.5$ PASCAL VOC ሙሉ "ትክክለኛ" ዕውቅና ምናምን ደረጃ ነው፤ COCO {cite}`lin2014microsoft` 0.5 ሙሉ 0.95 ምድቡ ሙሉ ሙሉ ሙሉ ሊጠቀሙ ናቸው፣ ሰፊ ቀናቱ እና ሰፊ ዋናቱ ናቸው።

**መምሪያዎቹ ሙሉ ሊፈቱ ሙሉ ትርጓሜ ጫፍ-ሁኔታዎቹ ናቸው፦**
- ሸፍኖ ዕቃዎቹ፦ ዋናቱ ሙሉ ትርጓሜ ሙሉ ሙሉ ሙሉ ሙሉ?
- ቆርጦ ዕቃዎቹ (ፍሬሙ ሙሉ ከፊሉ ውጭ)፦ ሙሉ ወይም ሙሉ?
- ሕዝቡ ቦታዎቹ፦ ምናምን "ሕዝቡ" ትርጓሜ ሙሉ ሙሉ ዕቃ ዕቃ ምሳሌዎቹ ሙሉ?

እነዚህ ወሳኔዎቹ ሁሉ "ትክክለኛ ዕውቅና" ምን ማለት ሙሉ ሊቀይሩ ናቸው — ስለዚህ ሞዴሉ ሙሉ ሙሉ ሊሰለጥን ሙሉ ሊቀይሩ ናቸው።

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

## ሲማንቲካዊ እና ዕቃ ዕቃ ክፍፍሉ

ክፍፍሉ ትርጓሜ ምስሉ ሙሉ ምሳሌ ፒክሴሉ ሁሉ ምድቡ ሊሰጡ ያስፈልጋቸዋሉ — ሙሉ ዋናቱ ትርጓሜ ዓይነቶቹ አንዱ።

**ሲማንቲካዊ ክፍፍሉ፦** ምሳሌ ፒክሴሉ ሲማንቲካዊ ምድቡ ሊካቱ ናቸው (መንገዱ፣ ሰማዩ፣ ሰዎቹ፣ ማሽን)። ያው ምድቡ ሙሉ ፒክሴሎቹ ሁሉ ያው ትርጓሜ ሊሰጣቸዋሉ ናቸው፣ ምን ዕቃ ዕቃ ሙሉ ሙሉ ሳይሆን።

**ዕቃ ዕቃ ክፍፍሉ፦** ምሳሌ ዕቃ ዕቃ ዕቃ ምናምን ዕቃ ዕቃ ምሳሌ ምሳሌ ሊያፈሩ ናቸው። 20 ሰዎቹ ሕዝቡ 20 ልዩ ማስክዎቹ ሙሉ ይሆናሉ።

**ፓኖፕቲካዊ ክፍፍሉ፦** ሁለቱ ሙሉ ሊዋሃዱ ናቸው፦ "ዕቃ" ምድቦቹ (ሊቆጠሩ ዕቃዎቹ) ዕቃ ዕቃ ማስክዎቹ አሏቸው፤ "ሞላ" ምድቦቹ (መንገዱ፣ ሰማዩ) ሲማንቲካዊ ማስክዎቹ አሏቸው።

**SAM-ርዳ ትርጓሜ፦** Meta Segment Anything Model {cite}`kirillov2023segment` አንዱ ነጥቡ ጠቅ ሙሉ ሰፊ-ጥሩ ክፍፍሉ ማስክዎቹ ሊሰጡ ናቸው። ትርጓሜ ሰጪዎቹ ዕቃ ሙሉ ሊጠቁሙ ናቸው፤ SAM ማስኩ ሊሰጥ ናቸው፤ ትርጓሜ ሰጪ ሙሉ ሊቀበሉ ወይም ሊያስተካክሉ ናቸው። SAM ደራሲዎቹ ምናምን ፖሊጎን-ሁሉ ትርጓሜ ሙሉ ምናምን 6.5× ቀናቱ ትርጓሜ ሞተሩ ቀናቱ ሙሉ ሊሳዩ ናቸው፤ ሙሉ ምናምን ዕይታ ዓይነቶቹ እና ትርጓሜ ሳሙናዎቹ ሙሉ ሊቀይሩ ናቸው።

SAM ሰፊ ሙሉ ሙሉ ሊቀይሩ ናቸው፦ **ትርጓሜ ሰጪ ሚና ሁሉ ሙሉ ሙሉ ሊቀይሩ ናቸው።** ይህ ሙሉ ምዘናቸው ቶሎ ሙሉ ሳሳ ትርጓሜ ጥራቱ ሙሉ ምሳሌዎቹ አሉ። ትርጓሜ ሰጪዎቹ ሙሉ ሲሳቡ፣ ሙሉ ሂደቱ ሙሉ ትኩረቱ ሙሉ ሊሆን ናቸው። ትርጓሜ ሰጪዎቹ ሙሉ ሊገምቱ እና "ተቀበሉ" ሙሉ ሊጠቁሙ ሲሄዱ፣ ሙሉ ሙሉ ስህተቶቹ ሙሉ ሊያሳሳቱ ሙሉ ምናምን አሉ — ትርጓሜ ዓወደ-ንባቡ ሙሉ አውቶሜሽን ምናምን አድልዎ ዓይነቱ።

---

## ኮምፒውተር ራዕይ ሙሉ ንቁ ትምህርቱ

ንቁ ትምህርቱ CV ሙሉ ሰፊ ዋናቱ ነው ምክንያቱ፦
1. ምስሎቹ ሰፊ-ዐቢይ እና ባሕሪ-ሰፊ ናቸው — ቀደምቱ ሰለጠኑ ሞዴሎቹ ሙሉ ምሥጢሮቹ ዕርግጠኛ ሳይሆን ምናምን ሙሉ ጠንካራ ምልክቶቹ ሊሸፍኑ ናቸው
2. ሰፊ ሳይለጠፉ ዝርዝሮቹ ዋጋ ሳይኖሩ ናቸው (ፎቶዎቹ፣ ቪዲዮ ፍሬሞቹ)
3. ትርጓሜ (ሰፊ ክፍፍሉ) ዋጋ አለ እናም ሙያ ዶሜይን ሙሉ ቀላሉ ሕዝቡ ምንጭ ሊሆን አይዟሉ

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

## ሰው ምምሪያ ሙሉ ግማሽ-ቁጥጥሩ ትምህርቱ

ሰፊ ሳይለጠፉ ምሳሌዊ ዐይን ውሂቡ ሙሉ ሙሉ ትርጓሜ ምናምን CV ሙሉ ሰፊ ዋናቱ ናቸው።

**ሰልፍ-ትምህርቱ / ምናምን-ትርጓሜ፦** ሰለጠነ ሙሉ ሙሉ ምሳሌዎቹ ሙሉ ሞዴሉ ሰልጥን፤ ሳይለጠፉ ውሂቡ ሙሉ ሙሉ-ዕርግጠኛ ትንቢቶቹ ምናምን-ትርጓሜዎቹ ሆኖ ሊጠቀሙ፤ ዳግም ሰልጥን። ዋናቱ ዲዛይን ጥያቄ ዕርግጠኛ ድርሱ ነው። ዝቅ ድርሱ ሰፊ ምሳሌዎቹ ሙሉ ሊሳሱ ናቸው ግን ሁኔታ ሙሉ ሊሳቡ ናቸው፤ ሰፊ ድርሱ ሳይለጠፉ ዝርዝሩ ሰፊ ሳይሰቡ ናቸው። ሰው ሳቦ ይህ ድርሱ ሊምሩ ናቸው — ትርጓሜ ሰጪዎቹ ምናምን-ሰለጠነ ምሳሌዎቹ ናሙናቸው ሙሉ ሁሉ ሊያረጋግጡ ናቸው።

**FixMatch እና ምናምን ተደጋጋሚ ቀጥሩ፦** እነዚህ ዘዴዎቹ ሞዴሎቹ ሙሉ ሙሉ ሙሉ ምናምን ትንቢቶቹ ሙሉ ሊሰጡ ሊሰለጥኑ ናቸው። ዋናቱ HITL ሃሳቡ፦ ሰዎቹ ትርጓሜዎቹ ብቻ ሳይሆን **ምናምን ዲዛይን** ሙሉ ሊጠይቁ ናቸው — ሞዴሉ ምን ዕረፍቶቹ ሊማሩ? ሕክምናዊ ምስሉ ሙሉ ሞዴሉ ዞሩ እና ብሩሃነቱ ሙሉ ዕረፍቱ ሊሆን ናቸው ግን ሚዛን ሙሉ ሳይሆን፤ ጽሑፍ ዕውቅና ሙሉ ሞዴሉ አቅጣጫ ዓሳቢ ሙሉ ዕረፍቱ ሳይሆን ሙሉ ሊሆን ሉዓሎቸው ናቸው። እነዚህ ዶሜይን-ሙሉ ምርጫዎቹ ሰው ሙያ ሙሉ ፈልጎ ናቸው፣ እናም ሙሉ ያሳሳቱ ሲሆን ሰሚ-ቁጥጥሩ ትምህርቱ ሙሉ ሰፊ ሊቀንሱ ናቸው።

**ንቁ ሰሚ-ቁጥጥሩ ትምህርቱ፦** ሰፊ ቀልጣፋ ዘዴ ሙሉ፦ ንቁ ትምህርቱ ሰው ትርጓሜዎቹ ሙሉ ሞዴሉ ዕርግጠኛ ሳይሆን ሙሉ ሙሉ ሊሰበሰቡ ናቸው፤ ሰልፍ-ትምህርቱ ሰፊ-ዕርግጠኛ ጭራ ሙሉ ምናምን-ትርጓሜ ናቸው። ሰው ጥረቱ ዋናቱ ሙሉ ሙሉ ሙሉ ሊሰበሰቡ ናቸው፣ ሞዴሉ ቀሪው ሙሉ ሊዛርፉ ናቸው።

---

## ቪዲዮ ትርጓሜ

ቪዲዮ ትርጓሜ ምስሉ ትርጓሜ ፈተናዎቹ ሙሉ ጊዜ ሙሉ ሊጠቃለሉ ናቸው፦

- **ቁጥጥር፦** ዕቃዎቹ ፍሬሞቹ ሙሉ ሊለዩ ናቸው። ትርጓሜ ሰጪዎቹ ዋናቱ ፍሬሞቹ ሊለጥፉ ናቸው፤ ቁጥጥሩ ቀመሮቹ ሙሉ ሊዛርፉ ናቸው። ቁጥጥሩ ውድቀቶቹ — ሸፍኖ፣ ዳግም-ዕድሉ፣ ቶሎ እንቅስቃሴ — ምናምን ቁጥጥሩ ሙሉ ሰፊ ምጥጥን ሙሉ ሰው ዳግም-ትርጓሜ ሙሉ ፈልጎ ናቸው።
- **ጊዜ ወጥነቱ፦** ፍሬሙ $t$ ሙሉ ሰሪ ወሰኖቹ ፍሬሙ $t+1$ ሙሉ ሙሉ ሊሆን ናቸው። ምናምን ትርጓሜዎቹ ዕቃዎቹ ቀጣዩ-ምዕረት ሙሉ ሊዛረፉ ሙሉ ሞዴሉ ሙሉ ሚነግሩ ትምህርቱ ምልክቱ ናቸው — ዕውቅና ሞዴሎቹ ሙሉ ሰፊ ጎጂ ሆኖ ሙሉ ትርጓሜ ሁኔታ ዓይነቱ ነው።
- **ሊሰፋፋ ሊሆን፦** 30fps ሙሉ 1-ሰዓት ቪዲዮ 108,000 ፍሬሞቹ ናቸው። ሙሉ ትርጓሜ ሙሉ ሳይቻሉ ናቸው፤ ናሙና ስልቶቹ ሙሉ ምናምን ክስተቶቹ (ጫፍ-ሁኔታዎቹ፣ ሙሉ-አቅርቦቱ ሁኔታዎቹ፣ ውድቀቱ ሁኔታዎቹ) ሙሉ ሥርዓታዊ ሊቀሩ ሙሉ ሊዳዩ ሊሠሩ ናቸው።

ዘመናዊ ቪዲዮ ትርጓሜ ሳሙናዎቹ ፍሬሞቹ ሙሉ ሊዛርፉ እና ቁጥጥሩ ዕርግጠኛ ሳይሆን ዝቅ ድርሱ ሙሉ ፍሬሞቹ ሊቀፍዱ **ብልሕ ቁጥጥሩ** ሊደግፉ ናቸው፣ ትርጓሜ ሰጪ ሙሉ ዳግም-ምርምሩ ሙሉ ሊሰጡ ናቸው። ይህ ምናምን ሙሉ ቀጥተኛ ንቁ ትምህርቱ ሃሳቡ ትርጓሜ ቧምቧ ሙሉ ናቸው፦ ሳሙናው ትርጓሜ ሰጪ ምናምን ዕርግጠኛ ሳይሆን ሙሉ ናቸው ዝርዝሩ።

**ምናምን ሥርዓቶቹ ሙሉ ምናምን ክስተቱ ችግሩ።** ምናምን ምናምን ዋጋ ዋናቱ ሙሉ — ራስ-ሚሄዱ ሽቅብ ሙሉ፣ UAV ናቪጌሽን — ምናምን ስምሮቹ ሁሉ ስርጭቱ ምናምን ስምሮቹ ምናምን ሙሉ ናቸው። ምናምን ምናምን ሽቅብ ፍሬሞቹ ናሙና ሙሉ ሠሩ ውሂቡ ሚሊዮኖቹ ምናምን "ምናምን ዋናቱ ሌለ" ፍሬሞቹ እና ዋናቱ ደህናነቱ ሙሉ ዋናቱ ሙሉ ያሉ ምናምን-አደጋ፣ ምናምን-ብሩሃነቱ፣ እና ሙሉ ሙሉ ሴንሰሩ ፍሬሞቹ ጥቂቱ ሙሉ ሊይዙ ናቸው። HITL ንቁ ትምህርቱ ምናምን ፍሬሞቹ ሙሉ ሊያዩ እና ሙሉ ቅድሚያ ሙሉ ቀልጣፋነቱ ዘዴ ሳይሆን — ደህናነቱ ፍላጎቱ ነው።

```{seealso}
ImageNet ውሂቡ ስብስቡ፦ {cite}`russakovsky2015imagenet`። ImageNet ሙሉ ትርጓሜ አድልዎ፦ {cite}`yang2020towards`። COCO ቤንቺማርኩ፦ {cite}`lin2014microsoft`። SAM (Segment Anything)፦ {cite}`kirillov2023segment`። CV ሙሉ ዋናቱ-ስብስቡ ንቁ ትምህርቱ፦ {cite}`sener2018active`።
```
