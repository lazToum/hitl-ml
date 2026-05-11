# Chapter 12 References: Measuring Success

---

## Foundational Measurement Theory

Goodhart, C. A. E. (1975). Problems of monetary management: The U.K. experience. *Papers in Monetary Economics*, Reserve Bank of Australia, 1.

Strathern, M. (1997). 'Improving ratings': Audit in the British University system. *European Journal of Education, 32*(3), 305–321.
> The paper that introduced "Goodhart's Law" as a named principle in academic discourse, extending Goodhart's original economic observation to institutional measurement.

Jacobs, A. Z., & Wallach, H. (2021). Measurement and fairness. In *Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency (FAccT)*, 375–385.
> Connects measurement theory to AI evaluation; central to understanding how measurement constructs can fail before the system even runs.

---

## Calibration

Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). On calibration of modern neural networks. In *Proceedings of the 34th International Conference on Machine Learning (ICML)*, 1321–1330.
> The foundational paper establishing that modern deep networks are systematically overconfident; introduces temperature scaling as a practical calibration method.

Niculescu-Mizil, A., & Caruana, R. (2005). Predicting good probabilities with supervised learning. In *Proceedings of the 22nd International Conference on Machine Learning (ICML)*, 625–632.
> Classic comparison of calibration methods including Platt scaling and isotonic regression.

Nixon, J., Dusenberry, M. W., Zhang, L., Jerfel, G., & Tran, D. (2019). Measuring calibration in deep learning. In *CVPR Workshop on Uncertainty and Robustness in Deep Visual Learning*.
> Critiques ECE and proposes improvements for edge cases.

Zadrozny, B., & Elkan, C. (2002). Transforming classifier scores into accurate multiclass probability estimates. In *Proceedings of the 8th ACM SIGKDD International Conference on Knowledge Discovery and Data Mining*, 694–699.
> Extension of calibration methods to multiclass settings relevant to content moderation and routing systems.

---

## Precision, Recall, and Evaluation Metrics

Manning, C. D., Raghavan, P., & Schütze, H. (2008). *Introduction to Information Retrieval*. Cambridge University Press. Chapter 8.
> Comprehensive treatment of precision, recall, F-measure with worked examples from information retrieval.

Davis, J., & Goadrich, M. (2006). The relationship between Precision-Recall and ROC curves. In *Proceedings of the 23rd International Conference on Machine Learning (ICML)*, 233–240.
> Essential for understanding when PR curves are more informative than ROC curves (specifically, under class imbalance — the setting of most HITL applications).

---

## Human Performance and Workload

Parasuraman, R., & Manzey, D. H. (2010). Complacency and bias in human use of automation: An attentional integration. *Human Factors, 52*(3), 381–410.
> Comprehensive review of how human performance changes with automated systems, including workload and fatigue effects.

Ancker, J. S., Edwards, A., Nosal, S., Hauser, D., Mauer, E., Kaushal, R., & for the HITEC Investigators. (2017). Effects of workload, work complexity, and repeated alerts on alert fatigue in a clinical decision support system. *BMC Medical Informatics and Decision Making, 17*, 36.
> Direct evidence for workload-driven alert fatigue in a high-stakes HITL context.

Baysari, M. T., Westbrook, J. I., Richardson, K. L., & Day, R. O. (2011). Not only doctors override clinical decision support alerts: An analysis of a decade of decision support alerts. *Journal of the American Medical Informatics Association, 18*(5), 655–660.

---

## Inter-Rater Reliability

Cohen, J. (1960). A coefficient of agreement for nominal scales. *Educational and Psychological Measurement, 20*(1), 37–46.
> Original kappa paper.

Fleiss, J. L. (1971). Measuring nominal scale agreement among many raters. *Psychological Bulletin, 76*(5), 378–382.
> Extension to multiple raters.

Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. *Biometrics, 33*(1), 159–174.
> Provides the standard interpretation benchmarks for kappa values.

---

## A/B Testing and Experimental Design

Kohavi, R., Tang, D., & Xu, Y. (2020). *Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing*. Cambridge University Press.
> The authoritative practitioner guide; includes CUPED, sequential testing, and common pitfalls.

Kohavi, R., Longbotham, R., Sommerfield, D., & Henne, R. M. (2009). Controlled experiments on the web: Survey and practical guide. *Data Mining and Knowledge Discovery, 18*(1), 140–181.
> Survey of A/B testing methodology at internet scale; directly relevant to HITL routing experiments.

Deng, A., Xu, Y., Kohavi, R., & Walker, T. (2013). Improving the sensitivity of online controlled experiments by utilizing pre-experiment data. In *Proceedings of the 6th ACM International Conference on Web Search and Data Mining (WSDM)*, 123–132.
> Original CUPED paper.

---

## Feedback Loops and Model Improvement

Sculley, D., Holt, G., Golovin, D., Davydov, E., Phillips, T., Ebner, D., Chaudhary, V., Young, M., Crespo, J.-F., & Dennison, D. (2015). Hidden technical debt in machine learning systems. In *Advances in Neural Information Processing Systems (NeurIPS) 28*.
> The "technical debt" paper; includes important discussion of feedback loop instability in production ML systems.

Amershi, S., Britz, D., Chickering, M., Simard, P. Y., & Suh, J. (2014). Power to the people: The role of humans in interactive machine learning. *AI Magazine, 35*(4), 105–120.
> Interactive machine learning perspective; directly relevant to how human feedback improves models over time.

---

## Software Engineering for ML Systems

Amershi, S., Begel, A., Bird, C., DeLine, R., Gall, H., Kamar, E., Nagappan, N., Nushi, B., & Zimmermann, T. (2019). Software engineering for machine learning: A case study. In *2019 IEEE/ACM 41st International Conference on Software Engineering: Software Engineering in Practice (ICSE-SEIP)*, 291–300.
> Microsoft research on production ML challenges; covers measurement and monitoring practices.

Shankar, S., Garcia, R., Hellerstein, J. M., & Parameswaran, A. (2022). Operationalizing machine learning: An interview study. arXiv:2209.09125.
> Practitioner perspectives on what actually gets measured in production HITL systems.
