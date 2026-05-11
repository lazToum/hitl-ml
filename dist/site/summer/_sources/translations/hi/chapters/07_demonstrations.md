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

# प्रदर्शन से अधिगम

जब कोई कार्य निर्दिष्ट करना कठिन हो लेकिन प्रदर्शित करना आसान हो, तो नियम से परिभाषित करने की तुलना में उदाहरण से सिखाना अधिक कुशल हो सकता है। एक मानव विशेषज्ञ एक रोबोटिक भुजा को किसी वस्तु को पकड़ना दिखाता है; एक प्रोग्रामर की अपने IDE के साथ अंतःक्रिया सही संपादनों का एक क्रम प्रदान करती है; एक शतरंज ग्रैंडमास्टर एक खेल खेलता है। **प्रदर्शन से अधिगम** ऐसे व्यवहार संबंधी डेटा से एक नीति निकालता है, हस्त-निर्मित पुरस्कार कार्यों या स्पष्ट कार्य विनिर्देशों की आवश्यकता को टालते हुए।

---

## व्यवहार क्लोनिंग

सबसे सरल दृष्टिकोण है **व्यवहार क्लोनिंग (BC)**: प्रदर्शन को निर्देशित डेटा के रूप में मानें और अवस्थाओं से क्रियाओं की मैपिंग सीखें।

एक विशेषज्ञ प्रदर्शनकर्ता से अवस्था-क्रिया जोड़ियों के डेटासेट $\mathcal{D} = \{(s_i, a_i)\}$ को देखते हुए, हम नकारात्मक लॉग-संभावना को न्यूनतम करके एक नीति $\pi_\theta(a \mid s)$ फिट करते हैं:

$$
\mathcal{L}_\text{BC}(\theta) = -\frac{1}{|\mathcal{D}|} \sum_{(s, a) \in \mathcal{D}} \log \pi_\theta(a \mid s)
$$

यह अनुक्रमिक डेटा पर लागू मानक निर्देशित अधिगम है।

### सहवेरिएट शिफ्ट समस्या

BC में एक मूलभूत कमज़ोरी है: प्रशिक्षण और परिनियोजन के बीच **वितरण बदलाव**। विशेषज्ञ के प्रदर्शन विशेषज्ञ द्वारा देखी गई अवस्थाओं को कवर करते हैं। लेकिन परिनियोजन के दौरान, सीखी गई नीति थोड़े भिन्न निर्णय ले सकती है, जिससे वह उन अवस्थाओं में पहुँच सकती है जो विशेषज्ञ ने कभी नहीं देखीं — जहाँ नीति के पास कोई पर्यवेक्षण नहीं है और वह बुरी तरह विफल हो सकती है।

त्रुटियाँ **संयोजित होती हैं**: एक छोटा विचलन एक अपरिचित अवस्था की ओर ले जाता है, जहाँ एक थोड़ी गलत क्रिया और भी अपरिचित अवस्था की ओर ले जाती है, और इसी तरह। प्रदर्शन $O(T^2 \epsilon)$ के रूप में खराब होता है जहाँ $T$ एपिसोड की लंबाई है और $\epsilon$ प्रत्येक चरण पर त्रुटि दर है {cite}`ross2010efficient`।

```{admonition} उदाहरण: स्वायत्त ड्राइविंग
:class: note

मानव ड्राइविंग डेटा पर प्रशिक्षित लेन-रखने के लिए एक व्यवहार क्लोनिंग मॉडल सीधी सड़कों पर अच्छा प्रदर्शन करता है। लेकिन जिस क्षण यह थोड़ा भटकता है — एक ऐसी अवस्था जिसमें कोई मानव चालक कभी नहीं होता क्योंकि वे पहले ही सुधार कर लेते — उसके पास मार्गदर्शन के लिए कोई डेटा नहीं है और वह सड़क से बाहर जा सकता है।
```

```text
एल्गोरिदम DAgger:
  आरंभ करें: D <- {} (रिक्त डेटासेट)
  M विशेषज्ञ प्रदर्शनों पर प्रारंभिक नीति pi_1 प्रशिक्षित करें

  पुनरावृत्ति i = 1, 2, ..., N के लिए:
    1. अवस्थाएँ एकत्र करने के लिए pi_i को पर्यावरण में चलाएँ {s_1, ..., s_t}
    2. प्रत्येक देखी गई अवस्था पर क्रियाओं के लिए विशेषज्ञ से क्वेरी करें: a_t = pi*(s_t)
    3. एकत्रित करें: D <- D u {(s_1, a_1), ..., (s_t, a_t)}
    4. D पर निर्देशित अधिगम द्वारा pi_{i+1} प्रशिक्षित करें
```

DAgger $O(T\epsilon)$ खेद प्राप्त करता है क्योंकि प्रशिक्षण वितरण परिनियोजन वितरण से मेल खाने के लिए अभिसरित होता है।

---

## व्युत्क्रम प्रबलन अधिगम

कभी-कभी विशेषज्ञ का व्यवहार नकल की जाने वाली क्रियाओं की एक श्रृंखला के रूप में नहीं बल्कि एक अज्ञात पुरस्कार फ़ंक्शन को अनुकूलित करने के परिणाम के रूप में बेहतर समझा जाता है। **व्युत्क्रम प्रबलन अधिगम (IRL)** {cite}`ng2000algorithms` प्रदर्शनों से इस अव्यक्त पुरस्कार फ़ंक्शन को पुनर्प्राप्त करता है।

### अधिकतम एंट्रॉपी IRL

**MaxEnt IRL** {cite}`ziebart2008maximum` IRL अस्पष्टता समस्या (प्रदर्शनों के किसी भी सेट के साथ कई पुरस्कार फ़ंक्शन संगत हैं) को उस पुरस्कार फ़ंक्शन को चुनकर हल करता है जो, प्रदर्शित व्यवहार के अनुरूप रहते हुए, *अधिकतम एंट्रॉपी* वाले प्रक्षेप-पथों के वितरण की ओर ले जाता है:

$$
P(\tau \mid R) \propto \exp\left(\sum_t R(s_t, a_t)\right)
$$

---

## GAIL: जेनरेटिव एडवर्सेरियल अनुकरण अधिगम

**GAIL** {cite}`ho2016generative` पुरस्कार फ़ंक्शन सीखने को पूरी तरह से बायपास करता है, विशेषज्ञ की अवस्था-क्रिया वितरण को सीधे मिलाने के लिए एक GAN-जैसे सूत्रीकरण का उपयोग करता है।

एक विभेदक $D_\psi$ विशेषज्ञ अवस्था-क्रिया जोड़ियों $(s, a) \sim \pi^*$ को नीति अवस्था-क्रिया जोड़ियों $(s, a) \sim \pi_\theta$ से अलग करने के लिए प्रशिक्षित है:

$$
\mathcal{L}_D = -\mathbb{E}_{\pi^*}[\log D_\psi(s,a)] - \mathbb{E}_{\pi_\theta}[\log(1 - D_\psi(s,a))]
$$

---

## NLP में व्यवहार क्लोनिंग: एक व्यावहारिक उदाहरण

```{code-cell} python
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

torch.manual_seed(42)

# -----------------------------------------------
# Toy NLP task: rewriting sentences to be more formal
# We simulate this as a simple sequence transformation
# In practice: fine-tuning a seq2seq model on expert rewrites
# -----------------------------------------------

class SimpleSeq2Seq(nn.Module):
    def __init__(self, vocab_size=100, embed_dim=32, hidden_dim=64):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.encoder = nn.GRU(embed_dim, hidden_dim, batch_first=True)
        self.decoder = nn.GRU(embed_dim, hidden_dim, batch_first=True)
        self.proj = nn.Linear(hidden_dim, vocab_size)
        self.hidden_dim = hidden_dim

    def forward(self, src, tgt):
        src_emb = self.embed(src)
        _, hidden = self.encoder(src_emb)
        tgt_emb = self.embed(tgt)
        out, _ = self.decoder(tgt_emb, hidden)
        return self.proj(out)

# Generate synthetic demonstration data
VOCAB = 100
rng = np.random.default_rng(42)
N, SEQ_LEN = 1000, 12

src_seqs = torch.tensor(rng.integers(1, VOCAB, (N, SEQ_LEN)), dtype=torch.long)
# "Expert" transformation: shift tokens by 1 (toy formalization)
tgt_seqs = torch.clamp(src_seqs + 1, 1, VOCAB - 1)
tgt_in  = torch.cat([torch.ones(N, 1, dtype=torch.long), tgt_seqs[:, :-1]], dim=1)

dataset = TensorDataset(src_seqs, tgt_in, tgt_seqs)
loader = DataLoader(dataset, batch_size=64, shuffle=True)

model = SimpleSeq2Seq(vocab_size=VOCAB)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss(ignore_index=0)

# Behavioral cloning training
train_losses = []
for epoch in range(20):
    epoch_loss = 0
    for src, tgt_i, tgt_o in loader:
        logits = model(src, tgt_i)
        loss = criterion(logits.reshape(-1, VOCAB), tgt_o.reshape(-1))
        optimizer.zero_grad(); loss.backward(); optimizer.step()
        epoch_loss += loss.item()
    train_losses.append(epoch_loss / len(loader))

print(f"Initial loss: {train_losses[0]:.3f}")
print(f"Final loss:   {train_losses[-1]:.3f}")

# Evaluate: check token accuracy on held-out examples
model.eval()
with torch.no_grad():
    src_test = src_seqs[-100:]
    tgt_test_in = tgt_in[-100:]
    tgt_test_out = tgt_seqs[-100:]
    logits = model(src_test, tgt_test_in)
    preds = logits.argmax(dim=-1)
    acc = (preds == tgt_test_out).float().mean().item()
    print(f"Token accuracy on held-out set: {acc:.3f}")
```

---

## अनुकरण अधिगम विधियों की तुलना

| विधि           | पुरस्कार चाहिए? | विशेषज्ञ ऑनलाइन क्वेरी? | नई गतिशीलता में सामान्यीकरण? | जटिलता    |
|----------------|-----------------|------------------------|------------------------------|------------|
| व्यवहार क्लोनिंग | नहीं          | नहीं                   | खराब (वितरण बदलाव)           | कम         |
| DAgger         | नहीं            | हाँ                    | मध्यम                        | मध्यम      |
| MaxEnt IRL     | इसे पुनर्प्राप्त करता है | नहीं          | अच्छा                        | उच्च       |
| GAIL           | नहीं            | नहीं                   | अच्छा                        | उच्च       |

---

## अनुप्रयोग

**रोबोटिक्स।** रोबोट को वस्तुओं को संभालना, पर्यावरण में नेविगेट करना, या घरेलू कार्य करना सिखाना।

**स्वायत्त ड्राइविंग।** ALVINN {cite}`pomerleau1989alvinn` और NVIDIA के DAVE जैसे प्रारंभिक स्व-चालित प्रणालियाँ मानव ड्राइविंग डेटा से व्यवहार क्लोनिंग पर बहुत अधिक निर्भर थीं।

**गेम AI।** RL फाइन-ट्यूनिंग से पहले मानव गेमप्ले पर अनुकरण अधिगम एजेंटों को बूटस्ट्रैप करता है।

**कोड जनरेशन।** उच्च-गुणवत्ता कोड प्रदर्शनों (GitHub Copilot, Codex) पर भाषा मॉडल फाइन-ट्यूनिंग व्यवहार क्लोनिंग का एक रूप है।

**नैदानिक निर्णय समर्थन।** जटिल प्रोटोकॉल के लिए विशेषज्ञ चिकित्सक निर्णय अनुक्रमों से अधिगम।

```{seealso}
मूलभूत BC/DAgger विश्लेषण {cite}`ross2011reduction` में है। MaxEnt IRL {cite}`ziebart2008maximum` से है। GAIL {cite}`ho2016generative` से है। अनुकरण अधिगम के व्यापक सर्वेक्षण के लिए, {cite}`osa2018algorithmic` देखें।
```
