# Chapter 11 References: Teaching Computers to See

---

## Foundational Computer Vision Papers

### Convolutional Neural Networks
Lecun, Y., Bottou, L., Bengio, Y., & Haffner, P. (1998). **Gradient-based learning applied to document recognition.** *Proceedings of the IEEE, 86*(11), 2278–2324. [Original LeNet — the foundational CNN paper for handwritten digit recognition.]

Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012). **ImageNet classification with deep convolutional neural networks.** *Advances in Neural Information Processing Systems, 25*, 1097–1105. [AlexNet — the paper that launched the deep learning revolution in computer vision. 11-point improvement on ImageNet top-5 error.]

Simonyan, K., & Zisserman, A. (2015). **Very deep convolutional networks for large-scale image recognition.** *International Conference on Learning Representations (ICLR).* [VGGNet — showed depth matters more than complex architectures.]

He, K., Zhang, X., Ren, S., & Sun, J. (2016). **Deep residual learning for image recognition.** *Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)*, 770–778. [ResNet — introduced skip connections enabling networks 100+ layers deep.]

Dosovitskiy, A., Beyer, L., Kolesnikov, A., Weissenborn, D., Zhai, X., Unterthiner, T., ... & Houlsby, N. (2021). **An image is worth 16x16 words: Transformers for image recognition at scale.** *International Conference on Learning Representations (ICLR).* [Vision Transformer (ViT) — applied transformer architecture to image patches.]

### ImageNet Dataset
Deng, J., Dong, W., Socher, R., Li, L.-J., Li, K., & Fei-Fei, L. (2009). **ImageNet: A large-scale hierarchical image database.** *Proceedings of CVPR 2009*, 248–255.

Russakovsky, O., Deng, J., Su, H., Krause, J., Satheesh, S., Ma, S., ... & Fei-Fei, L. (2015). **ImageNet large scale visual recognition challenge.** *International Journal of Computer Vision, 115*(3), 211–252.

---

## Adversarial Examples

Szegedy, C., Zaremba, W., Sutskever, I., Bruna, J., Erhan, D., Goodfellow, I., & Fergus, R. (2014). **Intriguing properties of neural networks.** *International Conference on Learning Representations (ICLR).* [First adversarial examples paper — showed that imperceptible perturbations could reliably fool neural networks.]

Goodfellow, I. J., Shlens, J., & Szegedy, C. (2015). **Explaining and harnessing adversarial examples.** *International Conference on Learning Representations (ICLR).* [Introduced FGSM (Fast Gradient Sign Method) and the formal analysis of why adversarial examples exist. The panda-to-gibbon example is from this paper.]

Eykholt, K., Evtimov, I., Fernandes, E., Li, B., Rahmati, A., Xiao, C., ... & Song, D. (2018). **Robust physical-world attacks on deep learning visual classification.** *Proceedings of CVPR 2018*, 1625–1634. [The stop sign with stickers paper — physical adversarial attacks on traffic sign classifiers.]

Madry, A., Makelov, A., Schmidt, L., Tsipras, D., & Vladu, A. (2018). **Towards deep learning models resistant to adversarial attacks.** *International Conference on Learning Representations (ICLR).* [PGD adversarial training — the dominant defense against adversarial examples.]

Carlini, N., & Wagner, D. (2017). **Towards evaluating the robustness of neural networks.** *IEEE Symposium on Security and Privacy*, 39–57. [C&W attack — stronger than FGSM, showed that many defenses were ineffective.]

Athalye, A., Carlini, N., & Wagner, D. (2018). **Obfuscated gradients give a false sense of security: Circumventing defenses to adversarial examples.** *Proceedings of ICML 2018*. [Showed that many proposed adversarial defenses were defeated by adaptive attackers.]

---

## Medical Imaging AI

Topol, E. J. (2019). **High-performance medicine: The convergence of human and artificial intelligence.** *Nature Medicine, 25*(1), 44–56. [Influential review of AI performance in medical imaging.]

Rajpurkar, P., Irvin, J., Ball, R. L., Zhu, K., Yang, B., Mehta, H., ... & Lungren, M. P. (2018). **Deep learning for chest radiograph diagnosis.** *PLOS Medicine, 15*(11), e1002686. [CheXNet — AI matched radiologist performance on chest X-ray diagnosis.]

Ardila, D., Kiraly, A. P., Bharadwaj, S., Choi, B., Reicher, J. J., Peng, L., ... & Shetty, S. (2019). **End-to-end lung cancer detection on chest computed tomography with deep learning.** *Nature Medicine, 25*(6), 954–961. [Google AI lung cancer detection — outperformed radiologists on the specific classification task.]

### Automation Bias in Radiology
Goddard, K., Roudsari, A., & Wyatt, J. C. (2012). **Automation bias: A systematic review of frequency, effect mediators, and mitigators.** *Journal of the American Medical Informatics Association, 19*(1), 121–127. [Comprehensive review of automation bias in clinical settings.]

Gaube, S., Suresh, H., Raue, M., Merritt, A., Berkowitz, S. J., Lermer, E., ... & Ghassemi, M. (2021). **Do as AI say: Susceptibility in deployment of clinical decision-aids.** *npj Digital Medicine, 4*(1), 1–8. [Empirical study of how AI recommendations affect physician behavior — key automation bias evidence.]

Jungwirth, D., & Haluza, D. (2023). **Artificial intelligence and the future of healthcare: Challenges and opportunities.** *International Journal of Environmental Research and Public Health, 20*(13), 6238. [Broader context on AI deployment in healthcare settings.]

### FDA Regulatory Framework
U.S. Food and Drug Administration. (2021). **Artificial intelligence/machine learning (AI/ML)-based software as a medical device (SaMD) action plan.** FDA White Paper. [Describes the regulatory framework for AI medical devices, including locked vs. adaptive algorithms.]

U.S. Food and Drug Administration. (2023). **Predetermined change control plans for machine learning-enabled medical devices: Guidance for industry and FDA staff.** [Current guidance on adaptive AI medical devices.]

---

## Autonomous Vehicles

### Technical Background
Thrun, S., Burgard, W., & Fox, D. (2005). **Probabilistic robotics.** MIT Press. [Foundational text on probabilistic sensing, localization, and navigation — the mathematical basis of AV perception.]

Geiger, A., Lenz, P., Stiller, C., & Urtasun, R. (2013). **Vision meets robotics: The KITTI dataset.** *International Journal of Robotics Research, 32*(11), 1231–1237. [The standard autonomous driving benchmark dataset.]

### Human Factors
Stanton, N. A., & Marsden, P. (1996). **From fly-by-wire to drive-by-wire: Safety implications of automation in vehicles.** *Safety Science, 24*(1), 35–49. [Early analysis of automation and human vigilance in vehicles.]

Casner, S. M., Hutchins, E. L., & Norman, D. (2016). **The challenges of partially automated driving.** *Communications of the ACM, 59*(5), 70–77. [Clear analysis of the automation bias and vigilance challenges in partially automated vehicles.]

National Transportation Safety Board. (2019). **Collision between vehicle controlled by developmental automated driving system and a pedestrian, Tempe, Arizona, March 18, 2018.** Accident Report NTSB/HAR-19/03. [Official investigation of the 2018 Uber AV fatality.]

California Department of Motor Vehicles. (2023). **Summary of Autonomous Vehicle Disengagements 2022–2023.** [Annual reports from Waymo, Cruise, and other AV operators on disengagement rates — useful for comparing operational performance.]

---

## Content Moderation

### Perceptual Hashing
Farid, H. (2021). **An overview of perceptual hashing.** *Journal of Online Trust and Safety, 1*(1). [The technical overview of perceptual hashing, PhotoDNA, and related methods, by the inventor of PhotoDNA.]

Jain, P., Kolb, H., Miers, I., & Tyagi, A. K. (2022). **Adversarial examples for detecting perceptual hash-based child sexual abuse material detection systems.** *USENIX Security Symposium.* [Technical analysis of adversarial evasion against perceptual hashing systems.]

### Human Moderators
Roberts, S. T. (2019). **Behind the screen: Content moderation in the shadows of social media.** Yale University Press. [Foundational work on the human labor of content moderation.]

Steiger, M., Bharucha, T. J., Venkatagiri, S., Riedl, M. J., & Lease, M. (2021). **The psychological well-being of content moderators: The emotional labor of commercial moderation and avenues for improving support.** *Proceedings of CHI 2021*, 1–14.

---

## Uncertainty in Vision

Gal, Y., & Ghahramani, Z. (2016). **Dropout as a Bayesian approximation: Representing model uncertainty in deep learning.** *Proceedings of ICML 2016*, 1050–1059. [Introduced MC Dropout as a practical Bayesian uncertainty estimation method for deep learning.]

Lakshminarayanan, B., Pritzel, A., & Blundell, C. (2017). **Simple and scalable predictive uncertainty estimation using deep ensembles.** *Advances in Neural Information Processing Systems, 30.* [Deep ensembles — a strong baseline for uncertainty estimation, often outperforming MC Dropout in calibration.]

Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). **On calibration of modern neural networks.** *Proceedings of ICML 2017*, 1321–1330. [Showed that modern CNNs are systematically overconfident; introduced temperature scaling.]

---

## Active Learning for Image Annotation

Settles, B. (2009). **Active learning literature survey.** Computer Sciences Technical Report 1648, University of Wisconsin–Madison. [The canonical survey of active learning methods.]

Gal, Y., Islam, R., & Ghahramani, Z. (2017). **Deep Bayesian active learning with image data.** *Proceedings of ICML 2017*, 1183–1192. [Introduced BALD for image classification active learning.]

Sener, O., & Savarese, S. (2018). **Active learning for convolutional neural networks: A core-set approach.** *International Conference on Learning Representations (ICLR).* [Core-set active learning for CNNs.]

---

## Object Detection

Ren, S., He, K., Girshick, R., & Sun, J. (2015). **Faster R-CNN: Towards real-time object detection with region proposal networks.** *Advances in Neural Information Processing Systems, 28.* [The dominant two-stage object detector architecture.]

Redmon, J., Divvala, S., Girshick, R., & Farhadi, A. (2016). **You only look once: Unified, real-time object detection.** *Proceedings of CVPR 2016*, 779–788. [YOLO — single-stage detector enabling real-time detection.]

Lin, T.-Y., Goyal, P., Girshick, R., He, K., & Dollár, P. (2017). **Focal loss for dense object detection.** *Proceedings of ICCV 2017*, 2980–2988. [RetinaNet and focal loss — addressed class imbalance in object detection.]

---

*All arXiv papers are freely accessible at arxiv.org. NTSB accident reports are publicly available at ntsb.gov. FDA guidance documents are available at fda.gov.*
