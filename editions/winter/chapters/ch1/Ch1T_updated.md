# Chapter 1 Teacher's Manual: The Computers That Ask for Help

*Complete instructional guide for teaching human-in-the-loop concepts*

---

## Course Integration Guide

### Learning Objectives
By the end of this chapter, students will be able to:

**Knowledge (Remembering & Understanding):**
- Define human-in-the-loop (HITL) systems and uncertainty quantification
- Identify examples of HITL systems in everyday technology
- Explain the difference between aleatoric and epistemic uncertainty
- Describe why intelligent systems benefit from human oversight
- List the five dimensions of the HITL analysis framework

**Application & Analysis:**
- Analyze real-world systems to identify HITL intervention points
- Apply the five-dimension framework to evaluate HITL systems
- Evaluate the effectiveness of different uncertainty communication strategies
- Compare automated vs. human-in-the-loop approaches for specific scenarios
- Assess the trade-offs between system autonomy and human control

**Synthesis & Evaluation:**
- Design basic HITL intervention strategies for new applications
- Critique existing HITL implementations using the five-dimension framework
- Propose improvements to human-AI collaboration interfaces
- Evaluate ethical implications of uncertainty-based decision systems

### Prerequisites
- **Basic Computer Science:** Introductory programming, basic algorithms
- **Statistics:** Understanding of probability, confidence intervals, basic hypothesis testing
- **Optional but Helpful:** Machine learning fundamentals, human-computer interaction basics

### Course Positioning
**Early Course (Week 2-3):** Foundation for understanding human-AI collaboration
**Mid-Course:** Concrete examples before diving into technical implementation
**Advanced Course:** Quick review before focusing on implementation details

---

## Key Concepts for Instruction

### The Five-Dimension Framework (NEW)

This framework is central to Chapter 1 and should be emphasized throughout:

| Dimension | Key Question | Example |
|-----------|-------------|---------|
| **Uncertainty Detection** | Can the system recognize when it's unsure? | Netflix monitors engagement probability |
| **Intervention Design** | How does it ask for help? | "Are you still watching?" (Yes/No) |
| **Timing** | When does it ask? | After 3 episodes or 90 minutes |
| **Stakes Calibration** | Does it understand consequences? | Low stakes = can afford to interrupt |
| **Feedback Integration** | Does it learn from responses? | Adjusts thresholds based on user patterns |

**Teaching Tip:** Have students apply this framework to every example. It provides a consistent analytical lens.

### Contrast Pair: Netflix vs. Nest Thermostat

Chapter 1 uses Netflix (good design) and Nest thermostat (problematic design) as a contrast pair:

| Aspect | Netflix | Nest Thermostat |
|--------|---------|-----------------|
| **Asks for help?** | Yes ("Still watching?") | No (acts autonomously) |
| **Expresses uncertainty?** | Implicitly, by asking | No |
| **User complaints** | Minor annoyance | "I woke up freezing" |
| **Failure mode** | Interrupts unnecessarily | Confident but wrong |

**Teaching Tip:** This contrast is powerful for showing that "smart" doesn't mean "autonomous."

### Two Failure Modes

Emphasize that systems can fail in two opposite ways:

1. **Asking too often** → Alert fatigue (users ignore important warnings)
2. **Never asking** → Dangerous overconfidence (GPS into lake, chatbot hallucinations)

The Goldilocks problem: finding the "just right" balance.

---

## Lecture Planning Guide

### 50-Minute Lecture Structure

#### Opening Hook (5 minutes)
**Activity:** Netflix Demo
- Show actual Netflix "Are you still watching?" screen
- Poll class: "How many of you have seen this? How many find it annoying?"
- Reveal: "This isn't a bug—it's one of the smartest things Netflix does"

#### Part 1: Pattern Recognition (12 minutes)
**Interactive Examples:**
- **Autocorrect fails** (show funny "ducking" examples, discuss why they happen)
- **Voice assistant confusion** (play audio of Siri/Alexa saying "I don't understand")
- **Nest thermostat complaints** (show real forum posts about freezing houses)

**Key Teaching Point:** Some systems ask for help (Netflix, voice assistants), others don't (Nest Home/Away). What's the difference?

#### Part 2: The Framework (10 minutes)
**Introduce the Five Dimensions:**
1. Uncertainty Detection
2. Intervention Design  
3. Timing
4. Stakes Calibration
5. Feedback Integration

**Activity:** Apply framework to Netflix example on the board together.

#### Part 3: High-Stakes Examples (15 minutes)
**Case Studies:**
- **GPS into water** (systems that never express uncertainty)
- **Air Canada chatbot** (confidently wrong with legal consequences)
- **Medical AI** flagging uncertain diagnoses (stakes calibration done right)
- **Tesla Autopilot** handovers (show dashboard warnings)

**Discussion Question:** "Using the framework, what dimension failed in the Air Canada chatbot?"

#### Part 4: Wrap-up & Preview (8 minutes)
**The Two Failure Modes:**
- Too much asking → Alert fatigue
- Too little asking → Overconfidence

**Summary:** Intelligence isn't about never being wrong—it's about knowing when you might be wrong.

**Assign:** "Try This" exercise (count HITL moments in next 24 hours)

**Preview:** Next class will explore how systems detect uncertainty.

### 75-Minute Extended Session

**Add these components:**

#### Technical Deep Dive (15 minutes)
- Show actual uncertainty estimation code (from Technical Appendix)
- Demonstrate confidence thresholds in action
- Discuss calibration challenges
- Show the improved Nest thermostat pseudocode from the appendix

#### Hands-On Activity (10 minutes)
- Students identify HITL moments in apps on their phones
- Apply the five-dimension framework to at least two examples
- Share findings with class

---

## Discussion Questions by Level

### Introductory Level
1. **Recognition:** "Give three examples of technology asking you for help. Why do you think it asks instead of just making a decision?"

2. **Analysis:** "Netflix could easily keep playing episodes forever. Why doesn't it? What are the costs and benefits of the 'Are you still watching?' interruption?"

3. **Comparison:** "Compare the Netflix 'Are you still watching?' prompt to the Nest thermostat's Home/Away detection. One asks for help, one doesn't. What are the consequences of each approach?"

4. **Application:** "If you were redesigning the Nest thermostat, when would you want it to ask the human for input versus making decisions automatically?"

### Intermediate Level
1. **Framework Application:** "Apply the five-dimension framework to analyze Uber's surge pricing notifications. Rate each dimension 1-5."

2. **Design Thinking:** "Design the 'asking for help' strategy for a new application: an AI system that helps teachers grade student essays. When should it ask for human review?"

3. **Trade-off Analysis:** "Self-driving cars face a dilemma: ask for human help too often and people lose trust; ask too rarely and safety suffers. How would you find the right balance?"

4. **Ethical Considerations:** "The Air Canada tribunal ruled that companies are responsible for what their chatbots say. What are the implications for how companies should design AI uncertainty?"

5. **System Evaluation:** "How would you measure whether a human-in-the-loop system is working well? What metrics matter most?"

### Advanced Level
1. **Technical Implementation:** "Given the uncertainty estimation methods in the technical appendix, how would you implement an optimal intervention threshold for a medical diagnosis system?"

2. **Research Critique:** "Read the Kendall & Gal (2017) paper on uncertainty types. How do their findings apply to the Netflix example? What type of uncertainty is Netflix primarily addressing?"

3. **Framework Extension:** "The five-dimension framework covers individual interactions. How would you extend it to analyze system-level learning over time?"

4. **Novel Applications:** "Propose a new domain where human-in-the-loop systems could be valuable. Design the uncertainty detection and human intervention strategy using all five dimensions."

5. **Future Implications:** "As AI systems become more capable, will they need human oversight more or less? Defend your position with specific examples."

---

## Hands-On Activities & Exercises

### Activity 1: HITL Detection Hunt (15 minutes)
**Setup:** Students work in pairs with their smartphones/laptops
**Task:** Find and document 5 examples of systems asking for human input

**Examples to look for:**
- "Are you still there?" prompts
- App permission requests
- "Did you mean...?" suggestions
- "Are you a robot?" CAPTCHAs
- "Is this your location?" confirmations
- Two-factor authentication prompts
- Fraud alerts from banks

**Analysis:** For each example, identify which of the five dimensions are visible:
- U: Can you tell the system is uncertain?
- I: How does it ask?
- T: When does it ask?
- S: What are the stakes?
- F: Does your response seem to affect future behavior?

**Debrief:** Which dimension is most often invisible to users?

### Activity 2: Framework Application Workshop (20 minutes)
**Setup:** Small groups of 3-4 students
**Task:** Apply the five-dimension framework to analyze one of these systems:

- Google Photos face tagging
- Spotify music recommendations
- Amazon product recommendations
- Smart home device (Alexa, Google Home)
- Banking fraud detection

**Deliverable:** Completed framework analysis table + 1 recommended improvement

| Dimension | Current Rating (1-5) | Evidence | Improvement Suggestion |
|-----------|---------------------|----------|----------------------|
| Uncertainty Detection | | | |
| Intervention Design | | | |
| Timing | | | |
| Stakes Calibration | | | |
| Feedback Integration | | | |

### Activity 3: Redesign Challenge (25 minutes)
**Setup:** Individual or pairs
**Task:** Redesign the Nest thermostat's Home/Away detection using the five-dimension framework

**Requirements:**
- When should it ask vs. act autonomously?
- What should the question look like?
- How should stakes affect the threshold?
- How should it learn from user responses?

**Deliverable:** Interface mockup (sketch) + decision flowchart

### Activity 4: Cost-Benefit Analysis (25 minutes)
**Setup:** Individual work, then class discussion
**Task:** Analyze the trade-offs for different intervention frequencies

**Scenario:** Email spam filter
- **Conservative** (asks about many emails): High accuracy, high annoyance
- **Aggressive** (rarely asks): Low accuracy, low annoyance
- **Balanced** (optimal threshold): Need to find sweet spot

**Given:**
- Cost of missed spam: $2 (user time)
- Cost of blocked legitimate email: $50 (business impact)
- Cost of asking user: $0.10 (interruption)
- Spam detection accuracy: 95% without human help, 99% with help

**Exercise:** Calculate optimal intervention threshold.

### Activity 5: "Try This" Debrief (10 minutes)
**Timing:** Beginning of second class session
**Task:** Students share findings from the 24-hour HITL detection exercise assigned in Chapter 1

**Discussion Questions:**
- How many HITL moments did you count?
- Which systems asked well? Which asked poorly?
- Did any systems that SHOULD have asked, not ask?
- What patterns did you notice?

---

## Assessment Strategies

### Formative Assessment (During Class)

#### Concept Checks
**Quick Polls:**
- "Which dimension of the framework does this represent?" (show example)
- "True or False: The best AI systems never need human help"
- "Which failure mode is worse: asking too often, or never asking?"

#### Exit Tickets
**3-2-1 Format:**
- 3 examples of HITL systems you've used today
- 2 dimensions of the framework you can apply confidently
- 1 question you still have about the topic

**Framework Application:**
- "Apply the five-dimension framework to one system you used today" (quick sketch)

#### Think-Pair-Share
**Prompt:** "Explain to your partner why a voice assistant says 'I don't understand' instead of just guessing what you meant."

**Prompt 2:** "Using the framework, explain why the Nest thermostat's Home/Away feature frustrates users."

### Summative Assessment Options

#### Option 1: Framework Analysis Paper (750 words)
**Prompt:** "Choose a technology you use regularly that incorporates human-in-the-loop principles. Using the five-dimension framework, analyze how it handles uncertainty, evaluate its effectiveness, and propose one specific improvement."

**Rubric:**
- **Framework Application** (35%): Correctly applies all five dimensions
- **Analysis Quality** (25%): Demonstrates understanding of uncertainty types and intervention strategies
- **Evidence** (20%): Uses specific examples and observations
- **Improvement Proposal** (20%): Proposes feasible, well-reasoned improvement

#### Option 2: Design Challenge
**Prompt:** "Design a human-in-the-loop system for a specific application. Include uncertainty detection, intervention triggers, and user interface mockups."

**Deliverables:**
- Five-dimension framework analysis
- System architecture diagram
- Interface mockups
- Decision flow chart
- 500-word design rationale

**Assessment Focus:**
- Understanding of HITL principles
- Practical application of five-dimension framework
- User-centered design thinking
- Technical feasibility

#### Option 3: Case Study Presentation (10 minutes)
**Assignment:** Research a real-world HITL system failure or success story (suggestions: Air Canada chatbot, GPS navigation failures, medical AI implementations)

**Requirements:**
- Technical explanation of what happened
- Analysis using the five-dimension framework
- Lessons learned for future systems
- Q&A session with class

#### Option 4: Technical Implementation (for advanced courses)
**Task:** Implement uncertainty estimation for a simple classifier

**Components:**
- Code implementing Monte Carlo Dropout or ensemble methods
- Analysis of uncertainty calibration
- Recommendation for human intervention thresholds
- Five-dimension framework analysis of your implementation
- Written reflection on challenges and insights

---

## Common Student Misconceptions & How to Address Them

### Misconception 1: "Asking for help = system failure"
**Student thinking:** "Good AI should never need human help"
**Correction strategy:** 
- Use medical analogy: "Even experienced doctors get second opinions"
- Show Air Canada chatbot case: overconfidence caused legal liability
- Emphasize that recognition of limits is a form of intelligence
- Framework connection: "Uncertainty Detection is a feature, not a bug"

### Misconception 2: "All uncertainty is the same"
**Student thinking:** "If the system isn't sure, just ask a human"
**Correction strategy:**
- Clear examples of aleatoric vs. epistemic uncertainty
- Show how different uncertainty types require different responses
- Practice categorizing uncertainty sources using Chapter 1 examples

### Misconception 3: "Humans are always better judges"
**Student thinking:** "Human input always improves decisions"
**Correction strategy:**
- Examples of human cognitive biases
- Discussion of expertise levels and context
- Alert fatigue research: too many questions = humans ignore them
- Framework connection: "Stakes Calibration determines when human input is worth the cost"

### Misconception 4: "This is just about AI systems"
**Student thinking:** "HITL only applies to machine learning"
**Correction strategy:**
- Broader examples: calculators asking "are you sure?", spell-check, etc.
- Historical perspective: Human-computer collaboration predates AI
- The Nest thermostat isn't "AI" but still exhibits HITL design choices
- Emphasize general principles of system design

### Misconception 5: "The framework is just academic"
**Student thinking:** "This is theoretical, not practical"
**Correction strategy:**
- Show how the framework predicts which systems frustrate users (Nest)
- Use framework to diagnose real failures (Air Canada)
- Have students apply framework to systems they use daily
- Point to legal implications (companies liable for chatbot errors)

---

## Extension Activities & Research Projects

### Individual Research Topics
1. **Historical Analysis:** How did early computer systems handle uncertainty? Compare to modern approaches.
2. **Cultural Differences:** How do uncertainty communication preferences vary across cultures?
3. **Accessibility:** How should HITL systems be designed for users with disabilities?
4. **Industry Deep Dive:** Analyze HITL implementation in a specific domain (healthcare, finance, transportation).
5. **Legal Implications:** Research the Air Canada case and similar AI liability rulings.

### Group Projects
1. **System Comparison:** Compare how different companies handle similar uncertainty scenarios (e.g., Google vs. Apple voice assistants) using the five-dimension framework.
2. **User Study:** Design and conduct interviews about user experiences with HITL systems.
3. **Design Challenge:** Propose HITL solutions for emerging technologies (VR/AR, IoT, etc.).
4. **Failure Database:** Create a collection of HITL failures with framework analysis.

### Advanced Technical Projects
1. **Implementation:** Build a working HITL system with uncertainty quantification.
2. **Algorithm Development:** Improve uncertainty estimation for a specific type of model.
3. **Evaluation Framework:** Develop new metrics for assessing HITL system effectiveness.
4. **Intervention Optimization:** Implement and test different intervention timing strategies.

---

## Technology Integration

### Required Technology
- **Basic:** Computer/projector for demonstrations, internet access
- **Enhanced:** Student devices for hands-on activities
- **Advanced:** Access to programming environment for technical exercises

### Recommended Tools
- **Demo Platforms:** 
  - Teachable Machine (for quick ML demonstrations)
  - Scratch for AI (visual programming examples)
  - Online uncertainty visualization tools

- **Collaboration:**
  - Miro/Mural for system design activities and framework diagrams
  - Padlet for collecting HITL examples
  - Poll Everywhere for real-time class feedback

### Virtual/Hybrid Considerations
- **Screen sharing** for demonstrations works well
- **Breakout rooms** for small group activities
- **Shared documents** for collaborative note-taking
- **Recorded examples** can be paused and discussed

---

## Connections to Other Chapters

### Backward Links
- **Prerequisites from Introduction:** Basic understanding of AI capabilities and limitations
- **Foundational concepts:** What is "intelligence" in artificial systems?

### Forward Links
- **Chapter 2:** How do we detect when systems are confused? (Deeper dive into Uncertainty Detection dimension)
- **Chapter 3:** How do machine learning systems actually learn from uncertainty?
- **Chapter 4:** Technical framework for HITL decision-making (formal treatment of the five dimensions)
- **Parts II-III:** Implementation and real-world examples build on these principles

### Cross-Curricular Connections
- **Psychology:** Human decision-making and cognitive biases (alert fatigue)
- **Philosophy:** Nature of intelligence and knowledge
- **Ethics:** Responsibility and transparency in AI systems (Air Canada case)
- **Business:** Cost-benefit analysis and user experience design
- **Statistics:** Probability, confidence intervals, uncertainty quantification
- **Law:** AI liability and corporate responsibility for chatbot errors

---

## Accessibility & Inclusion Notes

### Universal Design Principles
- **Multiple examples** to connect with diverse experiences (streaming, banking, smart home, medical)
- **Visual, auditory, and kinesthetic** learning opportunities
- **Scaffolded complexity** from concrete to abstract concepts
- **Cultural sensitivity** in examples and case studies

### Accommodation Strategies
- **Visual impairments:** Detailed verbal descriptions of screenshots and demos
- **Hearing impairments:** Visual demonstrations, written summaries
- **Learning differences:** Multiple explanation styles, extended time for activities
- **ESL considerations:** Clear technical vocabulary definitions, cultural context for examples

### Inclusive Examples
- **Global perspectives:** Air Canada case (Canada), examples from different countries
- **Diverse applications:** Healthcare, education, entertainment, accessibility tools
- **Varied expertise levels:** Examples that don't assume technical background
- **Multiple interaction styles:** Voice, touch, traditional interfaces

---

## Assessment Rubrics

### Participation Rubric (for discussion-based classes)

| Criterion | Excellent (4) | Good (3) | Satisfactory (2) | Needs Improvement (1) |
|-----------|---------------|----------|-------------------|------------------------|
| **Preparation** | Clearly has done readings, references specific examples | Shows familiarity with material | Basic understanding evident | Little evidence of preparation |
| **Contribution** | Insightful comments that advance discussion | Relevant contributions, asks good questions | Participates when prompted | Minimal or off-topic contributions |
| **Framework Use** | Applies five-dimension framework accurately and creatively | Uses framework appropriately | Basic framework application | Struggles to apply framework |
| **Analysis** | Applies concepts creatively, sees connections | Uses chapter concepts appropriately | Basic application of ideas | Struggles to apply concepts |

### Framework Analysis Rubric

| Criterion | Excellent (4) | Good (3) | Satisfactory (2) | Needs Improvement (1) |
|-----------|---------------|----------|-------------------|------------------------|
| **Completeness** | All five dimensions analyzed thoroughly | All five dimensions addressed | Most dimensions addressed | Missing multiple dimensions |
| **Accuracy** | Correct application of each dimension | Minor errors in application | Some misunderstandings | Fundamental misapplication |
| **Evidence** | Strong, specific evidence for each rating | Good evidence for most ratings | Some evidence provided | Assertions without evidence |
| **Insight** | Identifies non-obvious patterns and implications | Good analysis with some insight | Basic analysis | Superficial analysis |

### Technical Exercise Rubric

| Criterion | Excellent (4) | Good (3) | Satisfactory (2) | Needs Improvement (1) |
|-----------|---------------|----------|-------------------|------------------------|
| **Technical Accuracy** | Code works correctly, proper implementation | Minor technical issues, mostly correct | Basic functionality, some errors | Significant technical problems |
| **Conceptual Understanding** | Clear grasp of uncertainty principles | Good understanding with minor gaps | Basic understanding | Fundamental misconceptions |
| **Documentation** | Clear explanations, well-commented code | Good documentation, mostly clear | Adequate documentation | Poor or missing documentation |
| **Innovation** | Creative solutions, goes beyond requirements | Some creative elements | Meets basic requirements | Below minimum requirements |

---

## Sample Lesson Plan: 50-Minute Session

| Time | Activity | Materials |
|------|----------|-----------|
| 0:00-0:05 | Opening: Netflix demo + poll | Slide with Netflix screenshot |
| 0:05-0:12 | Examples: Autocorrect, voice assistants, Nest | Slides with real examples |
| 0:12-0:22 | Framework introduction + Netflix analysis | Framework diagram, whiteboard |
| 0:22-0:37 | High-stakes case studies (GPS, Air Canada, Medical AI) | Case study slides |
| 0:37-0:45 | Two failure modes discussion | Whiteboard diagram |
| 0:45-0:50 | Wrap-up, assign "Try This" exercise | Chapter handout |

---

This teacher's manual provides everything needed to successfully teach Chapter 1 across different course levels and formats. The five-dimension framework provides a consistent analytical tool that students can apply throughout the course and beyond.

*Next: Chapter 2 explores how systems detect uncertainty—diving deeper into the "Uncertainty Detection" dimension of the framework.*
