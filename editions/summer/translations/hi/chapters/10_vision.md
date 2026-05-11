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

# कंप्यूटर दृष्टि में HITL

कंप्यूटर दृष्टि HITL ML के कुछ सबसे दृश्यात्मक रूप से सहज उदाहरण प्रदान करती है। 14 मिलियन मानव-लेबल किए गए चित्रों पर निर्मित ImageNet चुनौती ने डीप लर्निंग युग की शुरुआत की। रेडियोलॉजिस्टों द्वारा चिकित्सा इमेजिंग अनुलेखन नैदानिक AI को शक्ति देता है। स्वायत्त वाहन दुनिया को देखना सीखने के लिए लाखों मानव-लेबल किए गए फ्रेम पर निर्भर करते हैं।

जो आसानी से छूट जाता है: ये केवल मनुष्यों के ग्राउंड ट्रुथ प्रदान करने के मामले नहीं हैं। ये मनुष्यों द्वारा विशिष्ट अवधारणात्मक, सांस्कृतिक और परिचालन विकल्पों को शामिल करने वाले डेटासेट निर्मित करने के मामले हैं — ऐसे विकल्प जो बाद में दृश्यमान होते हैं, जब मॉडल पूर्वानुमानित तरीकों से विफल होते हैं।

---

## अनुलेखन विकल्प कैसे मॉडल पूर्वाग्रह बनते हैं

मानक फ्रेमिंग अनुलेखन को डेटा संग्रह के रूप में मानती है। अधिक सटीक फ्रेमिंग है कि अनुलेखन *डेटासेट डिज़ाइन* है।

### ImageNet मामला

ImageNet {cite}`russakovsky2015imagenet` कंप्यूटर दृष्टि इतिहास में सबसे परिणामपूर्ण डेटासेट है। इसके डिज़ाइन विकल्पों के कई परिणाम बाद में सामने आए:

- **व्यक्ति श्रेणियों ने जनसांख्यिकीय संबद्धताओं को कूटबद्ध किया** {cite}`yang2020towards`। लोगों की छवियों पर लागू लेबल ने जाति, लिंग और वर्ग संबद्धताओं को कूटबद्ध किया जो सीधे मॉडल एम्बेडिंग में प्रचारित हुईं।

- **पश्चिमी, अंग्रेज़ी-भाषी दृश्य डिफ़ॉल्ट।** छवियाँ मुख्य रूप से Flickr और अंग्रेज़ी-भाषा खोजों से एकत्र की गईं।

:::{admonition} अनुलेखन योजना दुनिया का एक सिद्धांत है
:class: note

प्रत्येक लेबल वर्गीकरण इस बारे में दावे करता है कि कौन से भेद महत्त्वपूर्ण हैं। इन योजनाओं पर प्रशिक्षित मॉडल वही भेद करेंगे, और उससे अधिक नहीं।
:::

---

## छवि वर्गीकरण अनुलेखन

**लेबल पदानुक्रम।** "कुत्ता" लेबल एक अर्थ पदानुक्रम में "जानवर" का एक बच्चा है।

**बहुलेबल अस्पष्टता।** एक सड़क दृश्य में एक साथ कार, व्यक्ति, साइकिल और ट्रैफिक लाइट हो सकती है।

**लंबी-पूँछ वितरण।** प्राकृतिक छवि डेटासेट एक शक्ति नियम का पालन करते हैं।

---

## वस्तु पहचान: बाउंडिंग बॉक्स अनुलेखन

वस्तु पहचान के लिए अनुलेखकों को प्रत्येक वस्तु वर्ग के उदाहरणों के चारों ओर अक्ष-संरेखित बाउंडिंग बॉक्स खींचने की आवश्यकता होती है।

**अनुलेखन गुणवत्ता मेट्रिक्स:**

*IoU (Intersection over Union)* एक अनुलेखित बॉक्स और एक संदर्भ बॉक्स के बीच ओवरलैप मापता है:

$$
\text{IoU}(A, B) = \frac{|A \cap B|}{|A \cup B|}
$$

$\text{IoU} \geq 0.5$ PASCAL VOC में "सही" पहचान के लिए मानक सीमा है; COCO {cite}`lin2014microsoft` 0.5 से 0.95 तक की एक श्रृंखला का उपयोग करता है।

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

## सिमेंटिक और इंस्टेंस विभाजन

**सिमेंटिक विभाजन:** प्रत्येक पिक्सेल एक सिमेंटिक वर्ग (सड़क, आकाश, व्यक्ति, कार) से संबंधित है।

**इंस्टेंस विभाजन:** प्रत्येक व्यक्तिगत वस्तु उदाहरण को एक अद्वितीय लेबल मिलता है।

**SAM-सहायता प्राप्त अनुलेखन:** Meta का Segment Anything Model {cite}`kirillov2023segment` एकल बिंदु क्लिक से उच्च-गुणवत्ता विभाजन मास्क उत्पन्न करता है। अनुलेखकों की भूमिका खींचने से समीक्षा करने में बदल जाती है।

---

## कंप्यूटर दृष्टि के लिए सक्रिय अधिगम

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

## वीडियो अनुलेखन

वीडियो अनुलेखन छवि अनुलेखन की चुनौतियों को समय से गुणा करता है:

- **ट्रैकिंग:** वस्तुओं को फ्रेम में पहचाना जाना चाहिए।
- **अस्थायी संगति:** फ्रेम $t$ में खींची गई सीमाएँ फ्रेम $t+1$ के साथ स्थानिक रूप से सुसंगत होनी चाहिए।
- **स्केलेबिलिटी:** 30fps पर 1 घंटे का वीडियो 108,000 फ्रेम है।

**स्वायत्त प्रणालियों में दुर्लभ घटना समस्या।** स्वायत्त ड्राइविंग के लिए, सामान्य संचालन में देखे गए फ्रेम का वितरण सबसे महत्त्वपूर्ण फ्रेम के वितरण से बुरी तरह मेल नहीं खाता।

```{seealso}
ImageNet डेटासेट: {cite}`russakovsky2015imagenet`। ImageNet में लेबल पूर्वाग्रह: {cite}`yang2020towards`। COCO बेंचमार्क: {cite}`lin2014microsoft`। SAM (Segment Anything): {cite}`kirillov2023segment`। CV के लिए कोर-सेट सक्रिय अधिगम: {cite}`sener2018active`।
```
