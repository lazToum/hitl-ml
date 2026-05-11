# Chapter 10 References: Teaching Computers to Understand Language

---

## Foundational NLP and Language Model Papers

### Word Embeddings
Mikolov, T., Chen, K., Corrado, G., & Dean, J. (2013). **Efficient estimation of word representations in vector space.** *arXiv preprint arXiv:1301.3781.* [Word2Vec — the paper that introduced the "king - man + woman = queen" analogy and launched the word embedding era.]

Mikolov, T., Sutskever, I., Chen, K., Corrado, G., & Dean, J. (2013). **Distributed representations of words and phrases and their compositionality.** *Advances in Neural Information Processing Systems, 26.* [Word2Vec follow-up introducing negative sampling and additional analyses.]

Pennington, J., Socher, R., & Manning, C. D. (2014). **GloVe: Global vectors for word representation.** *Proceedings of the 2014 Conference on Empirical Methods in Natural Language Processing (EMNLP)*, 1532–1543.

### The Transformer Architecture
Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). **Attention is all you need.** *Advances in Neural Information Processing Systems, 30.* [The foundational transformer paper. Every modern LLM traces its lineage here.]

Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K. (2019). **BERT: Pre-training of deep bidirectional transformers for language understanding.** *Proceedings of NAACL-HLT 2019*, 4171–4186. [Introduced bidirectional pretraining; BERT-family models still widely used in production.]

Radford, A., Wu, J., Child, R., Luan, D., Amodei, D., & Sutskever, I. (2019). **Language models are unsupervised multitask learners.** OpenAI Blog. [GPT-2 paper; introduced the "language model as general-purpose system" framing.]

Brown, T., Mann, B., Ryder, N., Subbiah, M., Kaplan, J. D., Dhariwal, P., ... & Amodei, D. (2020). **Language models are few-shot learners.** *Advances in Neural Information Processing Systems, 33*, 1877–1901. [GPT-3 paper; demonstrated emergent few-shot learning at scale.]

### Scaling Laws
Kaplan, J., McCandlish, S., Henighan, T., Brown, T. B., Chess, B., Child, R., ... & Amodei, D. (2020). **Scaling laws for neural language models.** *arXiv preprint arXiv:2001.08361.* [Established the empirical power-law relationships between compute, parameters, data, and performance.]

Hoffmann, J., Borgeaud, S., Mensch, A., Buchatskaya, E., Cai, T., Rutherford, E., ... & Sifre, L. (2022). **Training compute-optimal large language models.** *arXiv preprint arXiv:2203.15556.* [Chinchilla scaling laws — showed that models were often undertrained relative to their parameter count.]

---

## RLHF, DPO, and Alignment

### RLHF
Christiano, P. F., Leike, J., Brown, T., Martic, M., Legg, S., & Amodei, D. (2017). **Deep reinforcement learning from human preferences.** *Advances in Neural Information Processing Systems, 30.* [The original RLHF paper applying human preference learning to RL agents.]

Stiennon, N., Ouyang, L., Wu, J., Ziegler, D., Lowe, R., Voss, C., ... & Christiano, P. F. (2020). **Learning to summarize with human feedback.** *Advances in Neural Information Processing Systems, 33*, 3008–3021. [Extended RLHF to language generation tasks.]

Ouyang, L., Wu, J., Jiang, X., Almeida, D., Wainwright, C., Mishkin, P., ... & Lowe, R. (2022). **Training language models to follow instructions with human feedback.** *Advances in Neural Information Processing Systems, 35*, 27730–27744. [InstructGPT — the paper that directly preceded ChatGPT and established the RLHF-for-LLMs paradigm.]

### DPO
Rafailov, R., Sharma, A., Mitchell, E., Manning, C. D., Ermon, S., & Finn, C. (2023). **Direct preference optimization: Your language model is secretly a reward model.** *Advances in Neural Information Processing Systems, 36.* [The DPO paper — shows that the RLHF objective has a closed-form optimal solution.]

### Constitutional AI
Bai, Y., Jones, A., Ndousse, K., Askell, A., Chen, A., DasSarma, N., ... & Kaplan, J. (2022). **Training a helpful and harmless assistant with reinforcement learning from human feedback.** *arXiv preprint arXiv:2204.05862.* [Anthropic's RLHF paper, including early Constitutional AI concepts.]

Bai, Y., Kadavath, S., Kundu, S., Askell, A., Kernion, J., Jones, A., ... & Clark, J. (2022). **Constitutional AI: Harmlessness from AI feedback.** *arXiv preprint arXiv:2212.08073.* [The formal Constitutional AI paper — introduced self-critique and RLAIF.]

### GRPO
Shao, Z., Wang, P., Zhu, Q., Xu, R., Song, J., Bi, X., ... & Guo, D. (2024). **DeepSeekMath: Pushing the limits of mathematical reasoning in open language models.** *arXiv preprint arXiv:2402.03300.* [Introduced Group Relative Policy Optimization (GRPO), a more compute-efficient RL alignment method.]

---

## Hallucination Research

Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Xu, Y., ... & Fung, P. (2023). **Survey of hallucination in natural language generation.** *ACM Computing Surveys, 55*(12), 1–38. [Comprehensive survey of hallucination types, causes, and measurement.]

Maynez, J., Narayan, S., Bohnet, B., & McDonald, R. (2020). **On faithfulness and factuality in abstractive summarization.** *Proceedings of ACL 2020*, 1906–1919. [Foundational work on factuality failures in text generation.]

Rawte, V., Sheth, A., & Das, A. (2023). **A survey of hallucination in large foundation models.** *arXiv preprint arXiv:2309.05922.*

Magesh, V., Surani, F., Dahl, M., Suzgun, M., Manning, C. D., & Ho, D. E. (2024). **Hallucination-free? Assessing the reliability of leading AI legal research tools.** *arXiv preprint arXiv:2405.20362.* [Stanford study demonstrating high hallucination rates in legal AI, including the findings cited in the chapter.]

---

## Calibration

Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). **On calibration of modern neural networks.** *Proceedings of the 34th International Conference on Machine Learning (ICML 2017)*, 1321–1330. [Showed that modern deep networks are systematically overconfident; introduced temperature scaling for calibration.]

Kadavath, S., Conerly, T., Askell, A., Henighan, T., Drain, D., Perez, E., ... & Kaplan, J. (2022). **Language models (mostly) know what they know.** *arXiv preprint arXiv:2207.05221.* [Anthropic study of self-knowledge in language models — when do models know they're wrong?]

---

## Content Moderation and Human Reviewers

Roberts, S. T. (2019). **Behind the screen: Content moderation in the shadows of social media.** Yale University Press. [The foundational book on the human labor behind platform content moderation.]

Gillespie, T. (2018). **Custodians of the internet: Platforms, content moderation, and the hidden decisions that shape social media.** Yale University Press.

Steiger, M., Bharucha, T. J., Venkatagiri, S., Riedl, M. J., & Lease, M. (2021). **The psychological well-being of content moderators: The emotional labor of commercial moderation and avenues for improving support.** *Proceedings of the 2021 CHI Conference on Human Factors in Computing Systems*, 1–14.

---

## Legal and Ethical Cases

*Mata v. Avianca, Inc.*, No. 22-CV-1461 (PKC) (S.D.N.Y. June 22, 2023). [The sanctions order in the fabricated-citations case; publicly available on PACER and widely reported.]

*Moffatt v. Air Canada*, 2024 BCCRT 149 (Civil Resolution Tribunal, British Columbia). [The chatbot liability ruling discussed in Chapter 1 and revisited here.]

Chesterman, S. (2024). **I, human: AI, automation, and the quest to reclaim what makes us unique.** Harvard Business Review Press. [Useful for the philosophical discussion of AI "understanding."]

---

## Philosophical Background

Searle, J. R. (1980). **Minds, brains, and programs.** *Behavioral and Brain Sciences, 3*(3), 417–424. [The Chinese Room argument — foundational for discussions of whether AI systems "understand."]

Bender, E. M., Gebru, T., McMillan-Major, A., & Shmitchell, S. (2021). **On the dangers of stochastic parrots: Can language models be too big?** *Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency*, 610–623. [The "stochastic parrots" paper — critiques the view that language models have understanding.]

Marcus, G., & Davis, E. (2019). **Rebooting AI: Building artificial intelligence we can trust.** Pantheon Books.

---

## Tokenization

Sennrich, R., Haddow, B., & Birch, A. (2016). **Neural machine translation of rare words with subword units.** *Proceedings of ACL 2016*, 1715–1725. [Introduced BPE (Byte Pair Encoding) for neural MT — the tokenization approach used by most modern LLMs.]

---

*All arXiv papers are freely accessible at arxiv.org. Court documents are publicly available through PACER (pacer.gov) or legal news coverage.*
