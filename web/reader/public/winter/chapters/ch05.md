# Chapter 5: The Art of Asking for Help (Without Being Annoying)

*How the design of the ask changes whether humans actually help*

---

## One Word

In the spring of 2019, the city of Louisville, Kentucky's 911 dispatch center faced a problem that had nothing to do with technology. Their emergency dispatch system had a high rate of false dispatches — crews sent to locations where nothing was wrong, or where the situation had resolved before they arrived. False dispatches wasted resources, delayed responses to genuine emergencies, and wore down dispatchers and first responders.

A consultant hired to analyze the problem reviewed audio recordings of dispatch calls and noticed something striking. When dispatchers asked callers, "Is there someone there who needs help?" — the typical formulation — they got a high rate of ambiguous answers. Callers who were uncertain, or who were calling on someone else's behalf, or who were watching something happen from a distance, tended to answer "yes" to the general question even when the situation was unclear.

The consultant recommended a single change: replace "Is there someone there who needs help?" with "Do you personally need emergency assistance right now?"

The addition of "personally" and "right now" did two things. It forced the caller to think specifically about themselves and the present moment, rather than reporting vaguely on a situation. And it changed the framing from a general inquiry to a direct commitment.

The false dispatch rate dropped by approximately 40 percent over the following months.

One word. One word in a question that dispatchers were asking hundreds of times a day changed how callers understood what they were being asked — and changed what information the dispatchers got back.

This is the art of asking for help. Not whether to ask. How.

---

## The Ask Is a Design Problem

Everything we've established in the previous chapters points toward a moment: the moment when a system detects that it's uncertain, evaluates that the case is worth routing to a human, and then... asks. Or alerts. Or flags. Or notifies. Or interrupts.

That moment is where most HITL systems fail, even when everything before it has been done right.

Chapter 1 gave us the framework: five dimensions, three failure modes. Chapter 2 explained that confusion itself is useful information. Chapter 3 showed that learning systems produce predictable patterns of uncertainty at the edges of their training. Chapter 4 introduced the threshold problem and the human value judgments embedded in it.

All of that engineering, all of that calibration, all of that careful cost analysis — it delivers the system to the moment of the ask. And then a poorly designed question throws it all away.

The fraud alert that comes at 3 AM and wakes you from sleep to ask about a charge you made yourself that morning. The spam filter notification that flags the same newsletter for the hundredth time. The pop-up that asks for your permission to access your location before you've even understood what the app is for. The car alarm that fires whenever a large truck passes.

Each of these is a system that detected uncertainty correctly, made a reasonable threshold decision, and then asked badly. The ask was the failure.

---

## Three Levers

The design space for an ask has three primary dimensions:

**Timing** — When does the ask happen? Is it synchronous (immediately interrupting what the person is doing) or asynchronous (deferred until a natural break)? Is it too early (before the person has the information needed to answer) or too late (after the decision has already been made by default)?

**Frequency** — How often does the ask happen? Is it rare enough to command attention, or common enough to become noise? Does the system have a mechanism to prevent the same person from being asked the same type of question too many times?

**Format** — How is the ask phrased? What choices does it offer? How much cognitive work does it require? Does the phrasing bias the answer?

These are not independent. A well-timed, infrequent ask can survive imperfect format. A perfectly formatted ask at the wrong moment fails. The goal is to optimize all three together, and to understand how the human's context — what they're doing, what they're attending to, what they've already been asked — shapes every dimension of the optimal ask.

---

## The Trust-Attention-Response Triangle

Human psychology and the design of alerts interact in a system that has its own dynamics. Call it the trust-attention-response triangle.

When a system asks for human input, three things are required: the human must **trust** that the ask is worth responding to; the human must have **attention** available to process it; and the human must be willing and able to **respond** effectively.

Each of these can fail independently.

**Trust failure:** A system that has cried wolf too many times loses the trust that makes its alerts actionable. The alerts still arrive. The human learns to dismiss them. This is the clinical alert fatigue problem described in Chapter 1, but it applies everywhere. The fire alarm that fires so frequently that residents stop evacuating. The fraud alert service that flags so many routine purchases that cardholders start ignoring the texts. The over-alerting system trains its own users to be non-users.

**Attention failure:** A system that asks at the worst possible moment gets ignored not because the human doesn't trust it but because the human literally cannot process the ask right now. The update prompt that fires during a video call. The security notification that arrives mid-presentation. The fraud alert that comes while you're driving and you can't read a text. Timing failures are attention failures.

**Response failure:** A system that asks a question the human cannot answer effectively gets useless or harmful responses. A fraud alert that asks "Was this transaction legitimate?" when you can't remember whether you made it, at an amount that's not extraordinary — you'll answer randomly or default to "yes" without thinking. The ask's format must give the human the information they need to answer accurately.

The trust-attention-response triangle isn't static. It changes over time, across users, and across contexts. A system that maintains all three is rare. A system that degrades all three is common.

---

## The Lazy User Assumption

Here is a design assumption that underlies most bad alert design, usually implicitly: users won't try.

The premise behind asking questions with six items to review, or requiring navigating three menus to respond to a notification, or sending a fraud alert in a format that requires calling a phone number — all of these assume that the user is lazy and that the friction is acceptable because dedicated users will push through it.

This assumption is wrong in two ways.

First, it's empirically incorrect. Users in well-designed systems routinely engage with alerts, respond to notifications, and participate in feedback mechanisms — when the design makes it easy. The problem is not user laziness. The problem is designers treating users as if they have infinite attention and zero competing demands.

Second, the assumption fails even on its own terms. A user who is willing to engage with a fraud alert but is given a format that requires four steps to respond will not respond four times better than a user given one step. The friction doesn't select for motivated users. It just loses them.

Good HITL intervention design starts from the opposite assumption: **users will try if the ask is worth their time.** The design challenge is making the ask worthy.

"Worth their time" means: the ask is rare enough to be surprising; it arrives at a moment when the human can actually respond; the format makes the question clear and the response easy; and the human has reason to believe their response will actually matter.

---

## Two-Factor Authentication: Lessons from the Field

Two-factor authentication (2FA) is perhaps the most widely deployed HITL mechanism in existence. Every time a website sends you a six-digit code and asks you to type it in, it is inserting a human into a loop that would otherwise be purely automated.

The security rationale is sound: even if an attacker has your password, they're unlikely to also have your phone. The human in the loop — you, confirming your identity by entering a code only you could receive — provides a verification layer that pure password authentication cannot.

But 2FA's implementation landscape is a masterclass in how to design the ask both well and badly.

**Poorly designed 2FA:**
- Push notifications sent to a phone that require dismissal without confirmation (so-called "MFA fatigue attacks" exploit users who approve requests reflexively)
- SMS codes sent to numbers that may be SIM-swappable
- Time pressure so aggressive that the window expires before the user finds their phone
- No context provided: "Your authentication code is 847291" — but for what? From where?
- Prompts sent at 3 AM that train users to approve requests without fully waking up

**Well-designed 2FA:**
- Provides context: "Someone is trying to sign into your account from a new device in [location]. If this was you, enter this code: [code]"
- Number matching: the login screen shows a number and the push notification asks "Did you see the number [X]?" — defeating reflexive approval
- Adaptive authentication: only prompts for 2FA when the login context is unusual (new device, new location, unusual time)
- Clear, low-friction response options with a prominent "I did not initiate this login" option

The difference between these two designs is not the technology. It's the application of the trust-attention-response triangle. Good 2FA provides the context the user needs (trust), arrives when the user is actively trying to log in (attention), and makes both "approve" and "deny" equally easy (response).

---

## The Fraud Alert as Design Canvas

Bank fraud alerts are another rich case study, because the same underlying technology — "this transaction looks unusual, confirm it was you" — can be implemented in ways that range from excellent to actively harmful.

**An excellent fraud alert (composite of best practices):**
- Sent within seconds of the transaction, while you're still in the situation
- Contains specific, identifiable information: the merchant name, the exact amount, the last four digits of the card
- Asks a simple binary question: "Did you make this $47.23 purchase at Costa Coffee on [street]? Reply YES or NO"
- Takes one action (a single text reply) to confirm
- If you reply NO: immediate card freeze + one-tap call option to the fraud line
- If you don't reply within 10 minutes: gentle follow-up, then escalation protocol

**A poor fraud alert:**
- Sent six hours after the transaction, when context is gone
- Contains: "Your account has been flagged for unusual activity"
- Requires you to call a number, navigate an IVR system, verify your identity, explain the situation
- If the transaction was legitimate: 20 minutes of your life gone
- Teaches you that fraud alerts are time-consuming, training you to ignore the next one

The first design respects the trust-attention-response triangle at every step. The second violates all three. And the second is, unfortunately, still common.

---

## Content Moderation and the Interface of Judgment

Content moderation is a domain that makes the design of the ask visible in ways that other HITL applications don't, because the "human" in the loop is often a professional reviewer whose job is entirely about responding to system-generated asks.

Professional content moderators at major platforms spend their days responding to a stream of flagged content: videos, images, posts, comments, each one a system-generated ask requiring a human response. The design of the interface they use — how the content is presented, what categories they can select, how many decisions they're expected to make per hour, what context they see — shapes the quality of every response they give.

Research into content moderation interfaces has documented several consistent findings:

**Context improves accuracy.** Moderators shown content with its original context (the thread, the account history, the apparent intent) make more accurate decisions than those shown the same content in isolation. But showing context slows throughput. The ask's format creates a tradeoff between speed and quality.

**Category granularity matters.** Interfaces with many specific categories ("graphic violence: real vs. artistic context," "hate speech: individual vs. systemic") produce more consistent and useful decisions than interfaces with coarse categories ("violent," "non-violent"). But more categories require more cognitive work per decision.

**Throughput pressure degrades decision quality.** Moderators required to make more decisions per hour show increased error rates, particularly near the end of shifts and during high-volume periods. The ask format cannot compensate for structural workload problems.

**Explanation requests improve downstream model quality.** When moderators are asked not just "is this violating?" but "what makes this violating?" (even briefly), the resulting labels are more useful for model training. The ask format shapes what information is captured, not just what decision is made.

Each of these findings is a design lesson. The ask format is not neutral. It actively shapes the information the system gets back.

---

## The 911 Dispatcher, Revisited

Return to Louisville. One word changed the false dispatch rate by 40 percent.

Why did "personally" and "right now" matter so much?

The original question ("Is there someone there who needs help?") asked callers to interpret a situation they may have been observing from some distance, with some uncertainty, with some motivation to act because they were already on the phone with 911. The framing invited them to extrapolate.

The revised question ("Do you personally need emergency assistance right now?") grounded the question in the caller's direct experience at the present moment. It asked for first-person knowledge rather than third-party interpretation. It implicitly provided a category: "emergency assistance" is more specific than "help," and "right now" excludes anticipated future needs.

These are not just clarity improvements. They are changes to what information the question extracts. The question's format shapes the answer's content.

This is the most important lesson in the design of human-AI asks: **the question you ask determines the information you get**. A vague question gets vague information. A question framed to invite confirmation gets confirmation. A question framed to invite nuance gets nuance.

And in a HITL system, the quality of the information the human provides determines how much the system improves. A question designed to extract maximum useful information from a minimum human effort is not just a UX nicety. It is the core engineering of the feedback loop.

---

## Feedback Integration: Does It Learn?

There is a fifth dimension in our framework that often gets overlooked in the design of individual asks: **Feedback Integration** — whether the system actually learns from the human's response.

The ask is useless if the response disappears into a void. If a fraud alert's "NO" response doesn't update the model's representation of the user's spending patterns, the same type of transaction will keep getting flagged. If a content moderator's "not violating" decision on a borderline case doesn't inform how similar cases are classified in the future, the system is simply routing work rather than learning.

The design of the ask and the design of the feedback loop are not separate problems. The ask's format determines what information is captured. The feedback loop determines what happens with that information.

Well-designed HITL systems close this loop explicitly:
- The user's response is labeled and stored with the full context of the ask
- Cases where human decisions systematically differ from model predictions are flagged for calibration review
- The frequency of human corrections in a particular category is used to prioritize model improvement
- The human reviewer occasionally receives confirmation that their feedback mattered: "Your corrections in this category helped improve accuracy by X%"

That last point — feedback to the feedback provider — may seem like a courtesy. It's actually a mechanism for maintaining engagement. A human reviewer who never sees evidence that their responses matter eventually stops trying. The trust-attention-response triangle degrades from the trust side.

---

## Chapter Summary

**Key Concepts:**
- The design of the ask is as important as the decision to ask — a technically correct routing decision can be wasted by a poorly designed intervention
- Three primary levers: timing, frequency, format
- The trust-attention-response triangle: all three must be maintained for HITL to work
- The Lazy User Assumption is wrong: users will engage with asks that respect their time and attention
- The question's format determines the information captured — not just what decision is made
- Feedback Integration closes the loop: the ask is wasted if the response doesn't improve the system

**Key Examples:**
- 911 dispatch: one word change in a question reduced false dispatches by 40%
- Two-factor authentication: the same security mechanism implemented well vs. poorly
- Bank fraud alerts: specific, timely, binary ask vs. generic, delayed, high-friction request
- Content moderation interfaces: context, category granularity, and throughput pressure shape decision quality

**Key Principles:**
- Timing must align with the human's attention window — ask when they can answer
- Frequency must be low enough to preserve the signal value of each ask
- Format must give the human what they need to answer accurately in minimum steps
- Good design assumes users will try; bad design assumes they won't
- The ask and the feedback loop are one system, not two separate problems

---

> **Try This:** For the next week, pay attention to every digital alert or notification that asks you to take an action. For each one, ask three questions: (1) Is this well-timed — are you in a position to respond effectively right now? (2) Is this well-framed — do you understand exactly what's being asked and have what you need to answer? (3) Does your response matter — does it feel like your answer will change anything? Keep a log of your answers. You'll quickly develop a sense for which systems are designed to get useful human input, and which are designed to appear to involve humans without actually extracting useful judgment.

---

*This chapter closes the first part of our journey: from understanding that smart systems need to ask for help, through understanding what confusion is and where it comes from, to understanding how to turn uncertainty into decisions, and finally to understanding how to make the ask itself effective. The next part of the book turns to specific domains where human-in-the-loop design matters most — and where the lessons from these five chapters play out in their highest-stakes forms.*

---

## References

### Cognitive Load and Alert Design
- Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. *Cognitive Science*, 12(2), 257–285.
- Wickens, C. D., Helleberg, J., & Xu, X. (2002). Pilot maneuver choice and workload in free flight: A preliminary examination. *Human Factors*, 44(2), 171–188.

### Alert Fatigue
- Ancker, J. S., et al. (2017). Effects of workload, work complexity, and repeated alerts on alert fatigue in a clinical decision support system. *BMC Medical Informatics and Decision Making*, 17(1), 36.
- Howe, J. L., et al. (2018). Electronic health record usability issues and potential contribution to patient harm. *Journal of the American Medical Informatics Association*, 25(9), 1191–1197.

### Two-Factor Authentication
- Reeder, R. W., et al. (2013). A user study of off-the-record messaging: Motivations, tradeoffs, and social norms. *ACM CHI*.
- Bonneau, J., et al. (2012). The quest to replace passwords: A framework for comparative evaluation of web authentication schemes. *IEEE Symposium on Security and Privacy*.
- Taneski, V., Heričko, M., & Brumen, B. (2019). Systematic literature review of two-factor authentication. *Proceedings of MIPRO*.

### Fraud Alert Design
- Shen, A., et al. (2010). Improving usability of IT security: challenges and perspectives. *Proceedings of the 1st Workshop on Socio-Technical Aspects in Security and Trust*.

### Content Moderation Interface Design
- Roberts, S. T. (2019). *Behind the Screen: Content Moderation in the Shadows of Social Media*. Yale University Press.
- Steiger, M., et al. (2021). The psychological well-being of content moderators: The emotional labor of commercial moderation and avenues for improving support. *Proceedings of ACM CHI*.
- Gillespie, T. (2018). *Custodians of the Internet: Platforms, Content Moderation, and the Hidden Decisions That Shape Social Media*. Yale University Press.

### Question Framing and Response Behavior
- Tourangeau, R., Rips, L. J., & Rasinski, K. (2000). *The Psychology of Survey Response*. Cambridge University Press.
- Schwarz, N. (1999). Self-reports: How the questions shape the answers. *American Psychologist*, 54(2), 93–105.

### Feedback Integration in Human-AI Systems
- Amershi, S., et al. (2014). Power to the people: The role of humans in interactive machine learning. *AI Magazine*, 35(4), 105–120.
- Fails, J. A., & Olsen, D. R. (2003). Interactive machine learning. *Proceedings of the 8th International Conference on Intelligent User Interfaces*.
