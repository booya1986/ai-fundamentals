# Course Improvement Report
## יסודות הבינה המלאכותית — AI Fundamentals
### Bank Hapoalim Internal Academy
**Date:** June 2026 | **Version:** 1.0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [What Employees Truly Need to Know](#2-what-employees-truly-need-to-know)
3. [Learner Level Diagnostic — Know Where They Start](#3-learner-level-diagnostic--know-where-they-start)
4. [Current Course Strengths](#4-current-course-strengths)
5. [Module-by-Module Analysis and Improvements](#5-module-by-module-analysis-and-improvements)
6. [Format Transformation Recommendations](#6-format-transformation-recommendations)
7. [Assessment Quality — All Modules](#7-assessment-quality--all-modules)
8. [Missing Learning Experiences](#8-missing-learning-experiences)
9. [What Stays as Text](#9-what-stays-as-text)
10. [Implementation Roadmap](#10-implementation-roadmap)
11. [Certification Architecture](#11-certification-architecture)
12. [Manager Enablement Program](#12-manager-enablement-program)
13. [Organizational Rollout and Change Management](#13-organizational-rollout-and-change-management)
14. [Post-Certification Ecosystem and Governance](#14-post-certification-ecosystem-and-governance)

---

## 1. Executive Summary

This report evaluates the *יסודות הבינה המלאכותית* course as a complete AI literacy program — not just as a tool-training product. The course has a strong instructional backbone: it scaffolds from conceptual understanding to practical application, embeds security throughout, and culminates in a real-work capstone. These are meaningful design decisions.

The gaps fall into four areas:

**1 — The course does not start from where employees actually are.**
The diagnostic quiz exists but produces no adaptive outcome. There is no mechanism to discover what employees already know or misunderstand before teaching them. Some employees use AI daily and find the early modules patronising; others have never used a language model and find the later modules overwhelming. Neither group gets what they need.

**2 — Critical AI thinking skills are underdeveloped.**
The course teaches employees *what* AI does and *which tool* to use. It does not adequately teach employees *when to trust* AI output, *how to spot* a hallucination in a professional context, or *how to reason* about AI limitations in real banking situations. These are the skills that prevent actual harm at the desk.

**3 — Too much content is delivered as passive reading on a mobile screen.**
Five lessons carry the conceptual load as long-form text with accordion keypoints. On a phone during a commute — the primary consumption context — this format has the highest dropout rate. Several of these lessons are strong candidates for short animated video, interactive simulations, or audio overviews.

**4 — Assessments test recognition, not competence.**
Most quiz items test whether employees can identify the right answer when it is presented to them. Few items test whether employees can produce, apply, or transfer the knowledge to a real-work scenario. An employee can complete every quiz at full marks and still make poor AI decisions on Monday morning.

The recommendations in this report are ordered by impact relative to effort. The highest-priority change is not a production task — it is a diagnostic redesign that ensures every employee starts and progresses at the right level.

---

## 2. What Employees Truly Need to Know

Before evaluating the course, it is worth stating clearly what AI-literate bank employees actually need. This list is the north star against which all content, format, and assessment decisions should be measured.

### 2.1 — Foundational Understanding (Know WHY, not just WHAT)

Employees need a durable mental model of how AI language models work — not a technical explanation, but an accurate conceptual one that explains real behaviour they will encounter:

| Concept | Why it matters at the desk |
|---------|---------------------------|
| AI generates responses probabilistically, word by word | Explains why two prompts that mean the same thing can yield different outputs |
| AI does not "know" — it predicts based on training data | Explains why confident-sounding answers can be wrong |
| AI has a knowledge cutoff | Explains why it cannot reliably know today's interest rates or last month's regulatory change |
| AI has no memory across sessions | Explains why you have to re-establish context each conversation |
| AI is shaped by training data — biases and gaps included | Explains why outputs reflect patterns in data, not objective truth |
| Longer, richer context produces better output | Explains why prompt quality matters and motivates RICE |
| Different models have different strengths and failure modes | Explains why ChatGPT, Copilot, and Claude can give different answers to the same question |

### 2.2 — Applied Skills (Do this, not just Know this)

| Skill | What "competent" looks like |
|-------|---------------------------|
| Prompt construction | Employee writes a RICE-structured prompt for a new task without referring to the framework card |
| Output evaluation | Employee can identify when an AI output needs verification before use, and knows how to verify it |
| Tool selection | Employee makes the right tool choice for a given task and data type, including when to use the bank's internal platform for sensitive data |
| Hallucination detection | Employee recognises when an AI output sounds plausible but contains a verifiable error |
| AI-assisted workflow design | Employee can decompose a multi-step task and identify which steps benefit from AI assistance and which do not |
| Security decision-making | Employee can correctly classify data as safe or unsafe for external AI tools and explain why |

### 2.3 — Attitudes and Mindset (The hardest to teach)

| Mindset | What it looks like in practice |
|---------|-------------------------------|
| Calibrated trust | Employee neither blindly accepts nor reflexively rejects AI output — they apply proportionate scepticism based on the stakes and nature of the claim |
| Responsible experimentation | Employee tries new AI approaches without waiting for permission for every small task, but also without bypassing security protocols |
| Continuous learning orientation | Employee understands that AI tools and capabilities change rapidly and that this course is a foundation, not a complete education |
| Error ownership | Employee understands that when AI output causes a problem, the responsibility lies with the person who used it, not the tool |

### 2.4 — Gap Between Goals and Current Course

The current course covers **all of the foundational understanding** (M1) and **most of the applied skills** (M2–M7), but almost none of the **attitudes and mindset**. The hallucination detection skill is introduced conceptually in M1 but not practised at a level that builds real competency. The calibrated trust mindset is mentioned in M4 but not systematically developed.

These are not additions to make the course longer. They are reframes that transform existing content from "here is information" to "here is how to think."

---

## 3. Learner Level Diagnostic — Know Where They Start

> **Implementation status (June 2026):** The diagnostic has been built and is live in the course. See Section 3.5 for what was implemented vs. the original plan.

### 3.1 — The Problem with the Current Diagnostic

The M0 diagnostic quiz collects learner data but uses it for nothing. Every employee — regardless of their prior AI experience — proceeds through all nine modules in the same sequence. This creates two failure modes:

- **Over-qualified learners** (regular Copilot users, tech-savvy employees) spend 40 minutes in M1 being told things they already know. They disengage early and the dropout rate rises.
- **Under-qualified learners** (employees who have never used a language model) reach M3 (prompt engineering) without a solid mental model of how AI works. They complete the exercises without understanding why the techniques help.

### 3.2 — Redesigned Diagnostic: Three Dimensions

Replace the current diagnostic with a 10-item pre-assessment that measures three dimensions, not one:

**Dimension A — AI Knowledge (4 items)**
Tests whether the employee has an accurate mental model of how language models work. Example:
> "You ask Copilot about the bank's current mortgage rate. It gives a confident, specific answer. What should you do?"
> (a) Use it — Copilot is connected to the internet ✗
> (b) Verify it — Copilot's training data has a cutoff date ✓
> (c) Ignore it — AI cannot answer financial questions ✗
> (d) Ask again in a different way to confirm ✗

**Dimension B — Tool Proficiency (3 items)**
Tests whether the employee uses AI tools regularly and understands basic usage patterns. Example:
> "You want AI to help you draft a complex client report but you have already given it a lot of context in this conversation. The output quality suddenly drops. What is most likely happening?"
> (a) The internet connection is slow ✗
> (b) You have reached the context window limit ✓
> (c) The tool needs to be restarted ✗
> (d) The prompt is too short ✗

**Dimension C — Security Awareness (3 items)**
Tests whether the employee knows which data is safe to share with external AI tools. Example:
> "You want to use AI to help summarise a customer complaint including their account details. You are working on Copilot Chat. What should you do?"
> (a) Paste the full complaint including account details ✗
> (b) Summarise the complaint yourself first, removing identifying details, then ask Copilot to help structure it ✓
> (c) Use Google instead ✗
> (d) Only Copilot with a company email account is safe for customer data ✗

### 3.3 — Using Diagnostic Results: Three Learning Tracks

Based on diagnostic scores across the three dimensions, learners are routed to one of three tracks:

| Track | Profile | Route |
|-------|---------|-------|
| **Foundation** | Low A + Low B | Full course: M0 → M1 → M2 → M3 → M4 → M5 → M6 → M7 → M8 |
| **Standard** | Medium A + Medium B | Condensed M1 (skip foundational readings, go straight to sims) → M2 → M3 → M4 → M5 → M6 → M7 → M8 |
| **Accelerated** | High A + High B | Skip M1 entirely → M2 (tool map) → M3 (RICE — always mandatory) → M6 (security — always mandatory) → M7 → M8 |

**Security (M6) and Prompt Engineering (M3) are mandatory for all tracks** regardless of prior knowledge. These are the two modules where the gap between "knows it" and "applies it correctly" is most consequential.

### 3.4 — Displaying Results to the Learner

After the diagnostic, show the learner their profile in plain language:
> "Based on your answers: you have solid knowledge of how AI works, but your answers suggest you may not be aware of which data is safe to use with external AI tools. We've highlighted Module 6 for you — it covers exactly this."

This builds trust (the course knows what they need), reduces resentment (they understand why they're doing certain modules), and sets accurate expectations.

### 3.5 — Implementation: What Was Built (June 2026) ✓

**Diagnostic questionnaire — implemented.** The diagnostic is live in two forms:

**A) Standalone SCORM package** (`ai-fundamentals/diagnostic/`) — a self-contained `index.html` with no external dependencies, packaged as `release/ai-fundamentals-diagnostic.zip`. Can be assigned in any SCORM 1.2 LMS as a pre-course assessment. Commits `cmi.core.lesson_status`, `cmi.core.score.raw`, and `cmi.suspend_data` (includes track assignment and per-dimension scores).

**B) Embedded optional quiz in M0** — the diagnostic lives as an optional lesson (`m0/l2`, kind: `quiz`) in the main course. It is never required for course progression.

**Gate screen design:** After the M0 intro video, learners see an interstitial gate screen (not a lesson) with:
- The purpose of the diagnostic and a recommendation to take it
- **Skip** button → continues to the course map (M0 marked complete, M1 unlocked)
- **לביצוע ›** button → opens the 12-question diagnostic
- A note that completing the quiz earns **up to 240 XP bonus** and a more personalised learning experience

**What changed from the original plan:**

| Plan | Implemented |
|------|-------------|
| 10 items | **12 items** (4 per dimension) |
| Dimension B = Tool Proficiency | **Dimension B = Bias, Reliability and Critical Trust** (over-reliance, hallucination recognition) |
| Adaptive auto-routing to learning track | Track assignment is **computed and shown** on the result screen; full auto-routing of module sequence is a future phase |
| Dimension scoring guides M1 skip | Not yet wired — scoring recorded in `suspend_data` for future LMS integration |

**Scoring:** scenario correct=1 pt, partial=0.5 pt, wrong/unsafe=0 pt; MCQ and T/F correct=1 pt. Maximum 12 points (4 per dimension). Track assignment: dimA<2 OR dimB<2 → Foundations; any dim 2–2.9 → Standard; all ≥3 → Accelerated.

**XP:** 20 XP per correct answer × 12 questions = up to 240 XP bonus (plus combo bonuses). This is the primary incentive for taking the optional quiz in the embedded version.

---

## 4. Current Course Strengths

These elements are working well and should be preserved or extended, not replaced.

| Strength | What to do with it |
|----------|-------------------|
| **WordPredictionSim (M1)** — employees experience the statistical mechanism directly, including the hallucination reveal (Sydney vs Canberra) | Extend the banking context: replace one generic example with a banking sentence so the stakes feel immediate |
| **EthicsCyber simulation (M6)** — consequences-based ethics scenarios are more effective than compliance lectures | Add specific Bank Hapoalim policy references to make consequences credible and institutional |
| **Security reminders in every Copilot exercise** — data hygiene is reinforced in context, not just in M6 | Keep and strengthen: make the reminder clickable to a quick data-classification reference |
| **Bino capstone (M8)** — Socratic coaching by a Custom GPT is sophisticated design for a facilitator-free course | Add a peer-story video at M8 entry and a share-with-manager mechanism at exit |
| **RICE framework (M3)** — a named, memorable, transferable framework that employees can use without the course | Extend to the capstone: require RICE in field 6 and reference it in M4 productivity exercises |
| **Banking-specific scenarios throughout** — every example is grounded in bank work, not generic office contexts | Audit all modules for generic examples and replace with banking-specific ones where they exist |
| **Gamification aligned to learning milestones** — badges for ethics, prompting, and completion track competency categories, not just time | Maintain — the badge identities reinforce what matters. Consider adding a "Trust Calibrator" badge for strong performance on hallucination-detection items |

---

## 5. Module-by-Module Analysis and Improvements

---

### M0 — פתיחה ואבחון (Opening and Diagnostic)
**Current:** Intro video (4 min) + optional diagnostic quiz (10 min) | Total: 4 min required, 14 min with diagnostic

> **Status (June 2026):** Diagnostic implemented ✓ — see Section 3.5. Video and animated course map pending.

**Analysis:**
The intro video sets the wrong expectation by framing the course as a "journey into AI" for people who are new to it. Many employees already use Copilot Chat daily.

**Improvements:**

**Intro video rewrite (pending):**
Open with the employee's existing reality: *"You probably already have an AI tool in your work environment. This course isn't about introducing AI — it's about making sure you use it in a way that is smart, safe, and genuinely useful. By the end you'll understand why it sometimes gets things wrong, how to get much better answers out of it, and where the real risks are."*

**Diagnostic redesign (✓ implemented):**
The three-dimension, 12-item diagnostic is live as an optional quiz in M0. After the intro video, a gate screen offers Skip or "לביצוע" with XP incentive. Full adaptive routing is a future phase (see Section 3.5).

**Add (pending):** A 60-second animated course map showing the full journey — which modules connect to Copilot, which introduce additional tools, which covers safety, and where the capstone sits. Learners see the shape of what they're doing before they start.

---

### M1 — איך AI באמת חושב (How AI Really Thinks)
**Current:** 2 readings + 2 interactive sims + 1 Copilot exercise + 1 quiz | Total: 40 min

**Analysis:**
This is the strongest module in the course. The WordPredictionSim is the best single learning moment — it makes the statistical mechanism viscerally real. The two readings, however, carry very different content density. M1/l1 (4 min) is lighter and can be merged into the sim. M1/lmap (6 min) has four dense keypoints that are too abstract for mobile text consumption and should become animated video.

**Critical gap:** The module teaches how AI *generates* output (statistical prediction). It does not teach employees how to *evaluate* AI output for quality, accuracy, or trustworthiness. These are not the same skill. A learner who finishes M1 understands why AI can hallucinate but has not practised detecting whether a specific output contains a hallucination. This gap should be filled here, where the conceptual foundation is established.

**Improvements:**

**M1/l1 — Remove as a standalone lesson.**
Merge the core framing (3 sentences) into the WordPredictionSim intro screen. Current content: *"AI is a statistical prediction engine."* New sim opening: *"Copilot doesn't think — it predicts, word by word. Let's see that happening in real time."* Everything else in l1 is covered by the sim experience.

**M1/lmap — Replace dense reading with 2 short animated videos.**

- **Video A: The AI Map (3 min)**
  An animation that zooms from the widest circle (Artificial Intelligence) down through Machine Learning → Deep Learning → Generative AI → LLM, with a real example at each level. Ends with the knowledge cutoff visualised as a calendar that stops, and a clear statement: *"If you ask Copilot about a regulation that changed last month, it may not know. Always verify time-sensitive information."*

- **Video B: Tokens and Context (3 min)**
  Shows the text "כתבו לי מייל ללקוח" being broken into token blocks, each mapped to a number. Then shows how Attention weighting works visually — tokens "looking at" each other to build meaning. Ends with: *"The more context you give, the more signals the model has to work with — which is why a structured prompt produces a better result than a vague one."*

**Add: "Spot the Problem" micro-interaction (new — fills the evaluation gap)**
After the WordPredictionSim and before the quiz, add a 5-item interaction:

Five Copilot-style output cards are shown, each responding to a banking-context request. Learners must decide: *"Would you use this output as-is, or verify it first?"* Examples:
1. A draft email to a client (no data, general tone) → Use as-is ✓
2. A specific interest rate quoted with confidence → Verify ⚠️
3. A summary of 10 banking regulations with dates → Verify ⚠️
4. A client recommendation based on their profile → Never without checking the actual profile ✗
5. A reworded internal announcement → Use as-is ✓

After each choice: one sentence explaining the reasoning. This builds calibrated trust — the most important mindset outcome of M1 — rather than just conceptual knowledge about how AI works.

---

### M2 — בוחרים את הכלי הנכון (Choosing the Right Tool)
**Current:** 1 reading + 1 Copilot exercise + 1 quiz | Total: 19 min

**Analysis:**
This module has the right intent but the wrong decision model. It teaches tool selection as a parallel choice: five tools, pick the right one for the task type. The real decision structure is sequential: start from the employee's default tool (Copilot Chat, which they use every day), and ask one question before anything else — *does this task involve sensitive bank data?* That single question determines more about tool choice than any task-type analysis.

Additionally, the reading conflates JARVIS (the internal LLM platform) with the Compliance Agent (one application built on top of JARVIS). Employees who only know JARVIS as a "policy lookup tool" will not think to use it for general tasks involving sensitive data — which is its primary value.

**Improvements:**

**M2/l1 — Transform to interactive decision flow + reference table.**

Replace the 6-minute reading with:

*Part A — The Decision Flow (3 min interactive):*
A clickable scenario walks the learner through one real task using a branch structure:
1. "Does this task involve actual customer data, account numbers, or confidential financials?" → Yes → JARVIS | No → continue
2. "Do you need to process more than 3 long documents at once?" → Yes → NotebookLM | No → continue
3. "Do you need the output as a diagram or visual?" → Yes → Napkin | No → Copilot Chat
4. "Are you looking up an internal bank procedure or policy?" → Yes → JARVIS Compliance Agent | No → Copilot Chat

After completing the flow: a summary card shows the learner's path and the one rule to remember: *"When in doubt about data sensitivity — use JARVIS. It has the same capabilities as Copilot Chat, but your data stays inside the bank."*

*Part B — Tool Reference Card (job aid, not a lesson):*
A tappable card grid — one card per tool — permanently accessible from M2 and from the M8 capstone. Each card shows: what the tool is best for, what data it can handle, and one real banking use case. This is a reference, not something to memorise.

**JARVIS description correction:**
The course currently describes JARVIS as a policy lookup tool. The accurate description:

> JARVIS is the bank's internal AI platform — it has the same general capabilities as Copilot Chat (drafting, analysis, summarisation), but your data never leaves the bank's infrastructure. The bank is building specialised agents on this platform, including a Compliance Agent trained on all bank policy and compliance documents. Use JARVIS for any task where the data is confidential or sensitive. Use it the same way you use Copilot Chat — just for a different category of content.

**Quiz redesign — M2:**
Rewrite two items to reflect the data-zone decision model (see Section 7 for detail).

---

### M3 — הנדסת פרומפטים · RICE (Prompt Engineering)
**Current:** 2 videos + 1 reading + 2 Copilot exercises + 1 quiz | Total: 43 min

**Analysis:**
This is the highest-value module for employees who already use Copilot Chat daily. If employees leave this course with one skill that changes their daily work, it will be prompt construction. The module is well-designed but has one structural gap: the RICE reading (l2) explains the framework declaratively, and then learners go directly to a live Copilot exercise. There is no intermediate step where they construct a prompt in a controlled environment before they're in the real tool.

The two Copilot exercises are good but their reflection fields are generic. Changing "what worked?" to a more targeted question would significantly improve transfer.

**Improvements:**

**M3/l2 — Transform reading to RICE Builder interactive.**

Replace the 8-minute reading with a structured interactive:
- A real banking task is shown (example: *"Prepare a summary of a client meeting"*)
- Four labelled input areas appear — R, I, C, E — with field-level guidance and placeholder examples
- As learners fill each field, a live preview assembles their prompt
- A "Compare" button shows their assembled prompt against a one-sentence vague alternative, then shows two mock output examples demonstrating the quality difference
- Learners can try multiple rounds with different tasks

Keep the RICE concept explained as a 3-sentence intro before the interactive begins. Keep a downloadable RICE Quick Card (one page, one line per element with a banking example) accessible from this lesson and permanently linked from M8.

**M3 Copilot exercises — improve reflection fields:**
Replace the generic "what worked?" reflection with task-specific questions:
- Exercise l4: *"Which RICE element made the biggest difference in the output quality? What would have been missing without it?"*
- Exercise l5: *"Compare your output to what you'd get from a one-sentence prompt. What would a less-structured request have produced?"*

**M3 quiz — add application scenario:**
Add one scenario item that requires RICE evaluation, not recall:

> "An employee sent this to Copilot: 'Help me communicate with the team.' The response was a generic paragraph that didn't match their situation. Which RICE element is most clearly missing?"

(a) Role — they did not define who they are
(b) Instruction — they did not specify the output format
**(c) ✓ Context and Expectations — no information about the team, the situation, or what the output should look like**
(d) Nothing is wrong — Copilot simply cannot write internal communications

---

### M4 — פרודוקטיביות בעבודה (Productivity at Work)
**Current:** 2 videos + 1 reading + 1 Copilot exercise + 1 quiz | Total: 35 min

**Analysis:**
This module is where employees connect course content to their daily work. Since they already use Copilot Chat every day, the framing should shift from "here is what you can do with AI" to "here is how to do what you're already doing, better." The reading on capabilities vs. limitations (lcap) is the right content in the wrong format — it teaches a judgment skill as a declarative list, which will not transfer to real work decisions.

**Improvements:**

**M4/lcap — Transform to "Trust Meter" scenario interaction.**

Replace the 5-minute reading with a 5-card interaction. Five Copilot-style outputs are shown — realistic, professional-looking responses to real banking-context requests. For each card, the learner makes a binary judgment: "Use as-is" or "Verify before using." After each: one-sentence explanation of the reasoning and what to verify.

Example cards:
1. A rewritten client email (no factual claims) → Use as-is
2. A list of investment products with specific return percentages → Verify — rates change
3. A summary of a regulation with a specific effective date → Verify — knowledge cutoff may miss recent changes
4. A competitor analysis with market share figures → Verify — may be outdated or hallucinated
5. A draft agenda for a team meeting → Use as-is

This trains calibrated trust — the exact judgment that prevents real harm — through practice, not instruction.

**M4 videos — add chapter navigation.**
Both videos in M4 are the primary mobile dropout points in the course. Add WebVTT chapter markers every 2–3 minutes so learners can resume after an interrupted commute session without restarting the entire video.

**M4 Copilot exercise — connect to real work:**
Add a framing question before the exercise: *"Think of a task you did in Copilot Chat this week. Keep it in mind as you do this exercise — you'll reflect on it at the end."* Add a reflection field: *"How does this exercise compare to how you've been using Copilot? What would you do differently for that task you recalled?"*

---

### M5 — כלים מתקדמים: NotebookLM ו-Napkin (Advanced Tools)
**Current:** 2 Copilot exercises + 1 quiz | Total: 20 min — NO conceptual content before exercises

**Analysis:**
This is the only module in the course that does not follow the Tell-Show-Do sequence used consistently elsewhere. Employees encounter two unfamiliar tools with no explanation of what they do, why they exist, or when to use them. The exercises produce learner frustration rather than tool competency.

Additionally, the module does not address the fundamental question employees have about these tools: *"If I'm already using Copilot Chat every day, why would I ever use these?"* That question needs a compelling answer before asking employees to open a new tool.

**Improvements:**

**Add two explainer videos before the exercises:**

*NotebookLM explainer (4 min, screen capture):*
Show a real walkthrough: upload a fictional internal regulatory document → ask a question → see the grounded, cited answer → generate an Audio Overview. Voiceover explains the key distinction: *"NotebookLM only answers from the documents you give it. It cannot hallucinate information from outside that set — which makes it uniquely reliable for document-heavy research."* End with the concrete value proposition: *"Have 12 regulations to understand before a board meeting? Upload them all, ask your questions, put the Audio Overview on during your commute."*

*Napkin explainer (90 seconds, screen capture):*
Paste a process description into Napkin, watch a diagram appear in real time. One real example — a loan approval workflow. That is the entire lesson. This tool explains itself through demonstration.

**Add: Why use these instead of Copilot Chat?**
A short comparison in text (not a lesson, just framing): Copilot Chat is general and conversational. NotebookLM is specialised for synthesis of many long documents — Copilot Chat can handle 3 files up to 8,000 characters; NotebookLM can handle far more. Napkin converts text to diagrams — Copilot Chat cannot reliably do this. These tools extend Copilot Chat's capabilities; they do not replace it.

**NotebookLM Audio Overview — use the tool to explain itself:**
Generate a 3-minute NotebookLM Audio Overview from the M5 lesson content and embed it at the top of the module as an optional "listen first" option. This is both instructionally useful (learners hear what they're about to do before they do it) and pedagogically meta (a module about NotebookLM uses NotebookLM to introduce itself).

---

### M6 — אתיקה, סייבר ואבטחת מידע (Ethics, Cybersecurity and Data Security)
**Current:** 1 podcast-video + 1 interactive sim + 1 quiz | Total: 22 min

**Analysis:**
This module has the right format choices. The podcast-video tone (conversational, not a lecture) and the EthicsCyber simulation with consequences are both effective for compliance content. Two gaps exist: the simulation's consequences are generic and not grounded in real institutional stakes, and the module treats data security as purely preventive — it does not acknowledge that employees may already be using AI tools in ways that expose sensitive data, which requires a remediation framing in addition to a prevention framing.

**The most important context for this module:** Since Copilot Chat is the employees' daily tool, there is a real possibility that some employees have already been sharing customer data or confidential information with it before taking this course. The module should address this directly, without shaming, and provide clear guidance on what to do going forward.

**Improvements:**

**Podcast-video update:**
Add a 60-second segment that opens with: *"If you've already used Copilot Chat with real customer information — you are not alone. Many employees have done this before understanding the data boundaries. Here is what you need to know going forward."* This acknowledges the reality without creating fear or shame, and immediately gives the employee a path forward.

**EthicsCyber simulation — ground consequences in real policy:**
Replace generic consequences (*"this could cause a problem"*) with specific institutional ones (*"this action would require a mandatory incident report under Bank Hapoalim Information Security Policy X.X"*). Real institutional stakes are more motivating than hypothetical bad outcomes.

**Add: Data Classification Micro-Tool.**
After the simulation, add a 90-second micro-interaction. The learner describes their data in plain language (free text input), and the tool classifies it into one of three zones:
- Green: Safe for external AI tools (Copilot Chat, ChatGPT)
- Yellow: Anonymise first, then use external tools
- Red: Internal AI platform only (JARVIS) — or no AI

Classification uses keyword pattern matching (account numbers, customer names, transaction data, regulatory terms). This is a practical tool, not a quiz — it practises the judgment employees will face at their desk every day.

**This module, along with M3, should receive spaced retrieval follow-up** at Day 7 and Day 30 post-completion (see Section 10). Security compliance and prompt engineering are the two highest-stakes skills where retention matters most.

---

### M7 — להפוך לארכיטקטים (Becoming Architects)
**Current:** 1 video + 1 Copilot exercise + 1 quiz | Total: 21 min

**Analysis:**
The "becoming architects" framing is the best motivational choice in the course. It positions employees as designers of AI behaviour, not just users of AI tools. The module is appropriately short — its value is in the exercise quality, not content volume. However, the single Copilot exercise does not build the skill incrementally before asking employees to apply it in the real tool. A structured intermediate step is missing.

Additionally, this module has become more relevant with the JARVIS platform context: the bank is already building specialised AI agents (Compliance Agent) on JARVIS. This gives the "architect" framing real institutional grounding — employees can see that what they're learning at the personal level (Custom Instructions) is what the technology team does at the organisational level (AI agents).

**Improvements:**

**Connect the personal to the organisational:**
Add a short section (reading or 2-min video): *"The bank's technology team is already building AI agents on our internal platform — including a Compliance Agent trained on all our compliance documents. When you write Custom Instructions for Copilot, you are practising the same design principles they use: define the role, define the knowledge, define the rules. The difference is scale."* This transforms an abstract skill exercise into something that feels connected to real organisational work.

**Add: Custom Instructions Builder interactive.**
Before the Copilot exercise, a structured 3-field input:
- Field 1: "What role should Copilot play for you?" (with examples: "a concise bullet-point editor," "a meeting summary writer who always asks for clarification first," "a formal correspondence drafter who never uses casual language")
- Field 2: "What should it always do?" (examples: "always respond in Hebrew," "always start with the most important point")
- Field 3: "What should it never do?" (examples: "never include customer names in summaries," "never use passive voice")

As learners fill each field, a preview shows their assembled instructions. One-click copies them for use in real Copilot. This makes the concept immediately applicable — learners leave M7 with a real Custom Instruction they built themselves.

---

### M8 — תרגול מסכם · בינו (Final Capstone)
**Current:** 1 final project with Bino Custom GPT | Total: 15 min

**Analysis:**
The capstone design is strong. The 6-field structure forces synthesis of every major course competency. The Bino Socratic coaching model is sophisticated and appropriate for a facilitator-free environment. Two risks: the dependency on Bino access (IT rollout), and the private nature of the exercise (no mechanism for learners to share their plan with their manager or peer).

**Improvements:**

**Build a Bino fallback:**
If an employee does not have Bino access, show a self-guided version: the same 6 fields, plus a collapsible "Bino would ask you" section under each field with 2 Socratic follow-up questions. A downloadable PDF version serves employees who want to complete it on paper or share with a manager. Flag completions via the fallback path for L&D follow-up.

**Add peer stories at M8 entry:**
Before the capstone begins, show 3 short videos (90 seconds each) of real bank employees, named and with their roles, describing one specific change they made using course content. These should be concrete: *"I'm a relationship manager. I now use JARVIS every time a client conversation involves their account history. Here is the prompt structure I use."* Social proof at the synthesis moment is the highest-leverage motivational intervention available. These can be filmed with a phone in under an hour total.

**Add a share mechanism at M8 exit:**
After completing the capstone, offer a pre-filled Teams message or email that the learner can send to their manager. The message summarises what they planned (fields 1–2 from the capstone) and asks for a 10-minute conversation to discuss implementation. This converts the private capstone into a real Level 3 activation conversation. It is the single highest-leverage transfer enabler available without a system change.

---

## 6. Format Transformation Recommendations

### 6.1 — Decision Framework: Which Format for Which Content?

| Content type | Best format | Reasoning |
|--------------|------------|-----------|
| Conceptual mechanism (how AI works) | Short animated video (2–4 min) | Abstract concepts need visual anchoring; mobile-friendly; replayable |
| Process or procedure (step-by-step) | Screen capture video (2–5 min) with chapters | Shows the actual interface; learners can follow along |
| Comparison of options | Interactive table or decision tree | Comparison requires parallel viewing, not linear reading |
| Skill practice (prompting, trust calibration) | Interactive simulation with immediate feedback | Judgment skills cannot be taught declaratively |
| Real-world application | Copilot exercise with structured reflection | Must use the real tool for real transfer |
| Reference material (frameworks, rules) | Structured text with scannable formatting | Must be searchable and re-readable, not watchable |
| Compliance rules | Explicit text (required) | Learners must be able to point to specific rules |
| Reinforcement / commute consumption | Audio overview (3–5 min) | Meets learners where they are; low friction |
| Emotional/motivational framing | Video (peer stories, instructional narrator) | Tone and authenticity require human presence |

### 6.2 — Module Format Recommendations Summary

| Module | Current format | Recommended change | Priority |
|--------|---------------|-------------------|----------|
| M0 diagnostic | Single-dimension quiz | Three-dimension 12-item diagnostic + adaptive routing — **implemented ✓ (routing phase 2)** | 🔴 High |
| M1/l1 reading | Reading 4 min | Merge 3 sentences into WordPredictionSim intro; remove lesson | 🟡 Medium |
| M1/lmap reading | Dense reading 6 min (4 heavy keypoints) | 2 animated explainer videos (3 min each) | 🔴 High |
| M1 new interaction | — | "Spot the Problem" trust calibration cards (5 items) | 🔴 High |
| M2/l1 reading | Reading 6 min (5 keypoints) | Interactive decision flow + reference card grid | 🔴 High |
| M3/l2 reading | Reading 8 min | RICE Builder interactive + downloadable Quick Card | 🟡 Medium |
| M4/lcap reading | Reading 5 min | Trust Meter 5-card scenario interaction | 🟡 Medium |
| M5 — no content | Two Copilot exercises, no intro | NotebookLM explainer video (4 min) + Napkin explainer (90 sec) | 🔴 High |
| M6 sim | EthicsCyber sim | Keep; add Data Classifier micro-tool after | 🟡 Medium |
| M7 exercise | One Copilot exercise | Add Custom Instructions Builder interactive before | 🟡 Medium |
| M8 entry | Direct to capstone | Add 3 peer story videos before capstone begins | 🟢 Low |

### 6.3 — Audio Content: NotebookLM Audio Overviews

NotebookLM's Audio Overview feature can produce a 4–8 minute podcast-style summary from source documents. Three modules are ideal candidates. These are low-effort to produce (built within NotebookLM from existing course transcripts) and serve the mobile/commute learner.

| Audio Overview | Source material | Duration | Module placement |
|---------------|----------------|----------|-----------------|
| "How AI works — the essentials" | M1/lmap transcript + M1/l1 transcript | ~5 min | Optional listen at M1 entry |
| "The RICE framework — with banking examples" | M3/l2 content + M3 exercise prompts | ~5 min | Optional listen at M3/l2 |
| "Advanced tools: when and why" | M5 explainer content (once written) | ~3 min | M5 module entry |

**Note:** Embedding an Audio Overview in the M5 module (which is about NotebookLM) simultaneously teaches the content and demonstrates the tool — a pedagogically elegant choice.

---

## 7. Assessment Quality — All Modules

### 7.1 — Systemic Issues

**Issue 1: Weak distractors across M1**
Most wrong-answer options in M1 are immediately dismissible by anyone who has spent 10 minutes with an AI tool ("the websites are designed in different colours," "the internet is faster on one tool"). These distractors have zero discriminating power — they cannot separate learners who understand from learners who do not. This makes M1's quiz a formality rather than a checkpoint.

**Issue 2: Recognition instead of recall and application**
Several fill-in-the-blank items provide a bank of words where 2–3 options are obviously wrong, making the task a 1–2 option recognition test rather than a recall or application task. Recognition tests significantly overestimate actual knowledge.

**Issue 3: Missing application-level items in M3, M4, M7**
These three modules teach skills that employees are expected to perform on the job. Their quizzes contain MCQ and T/F items that test recall of instruction, not ability to perform the skill. A learner who scores 100% on these quizzes may still write a weak prompt and accept a hallucinated output on Monday morning.

### 7.2 — Item-by-Item Recommendations

**M1/q4 — "Why do ChatGPT and Copilot give different answers?" (rewrite distractors)**

Current distractors: website colours, internet speed, no real difference. All immediately dismissible.

Replacement distractors (plausible misconceptions):
- "Copilot is always connected to real-time internet, so it has more current information than Claude"
  *(Partially true in some modes — tests whether learner understands training data vs. web access)*
- "They use the same underlying knowledge base but different writing styles"
  *(Common misconception — "they're all the same underneath")*
- "Claude was trained on books and Copilot was trained on the internet, making Claude more accurate for formal content"
  *(Sounds authoritative; factually oversimplified in a plausible-sounding way)*

**M1/q3 — Tokenisation fill-blank (replace format)**

Current: drag "טוקנים / טוקן" from a bank that includes obviously wrong options (pixels, bytes).

Replacement: Free-text production item.
> "A colleague says: 'The AI read and understood my document.' Based on what you learned about tokens and probability, explain in one sentence why this description is misleading."

Show a model answer after submission for self-evaluation:
> "The model did not 'read' or 'understand' — it broke the text into tokens, mapped them to numbers, and calculated probabilities. A mathematical process, not comprehension."

**M1/q2 — T/F "LLMs understand meaning like humans" (replace with scenario)**

Current T/F format hides whether the learner grasps nuance or just knows the label.

Replacement:
> "A colleague says: 'Copilot understood my report exactly the way I would.' Which response is most accurate?"
>
> (a) ✓ Copilot processed the text as tokens and calculated probabilities — a process that resembles understanding but is fundamentally different
> (b) Copilot cannot understand Hebrew documents at all
> (c) Copilot understands content the way a human does, just faster
> (d) Copilot did not process the report — it retrieved it from a document database

**M2/q2 — Drafting task scenario (add data sensitivity condition)**

Current: asks which tool for drafting a client letter (answer: Copilot). The scenario implies no sensitive data — but the real decision depends on what is in the letter.

Replacement:
> "A department manager wants to redraft a client letter. The letter includes the client's full name and account number. Which tool is appropriate?"
>
> (a) ✓ JARVIS — the letter contains identifying client information that must not leave the bank's internal network
> (b) Copilot — it is the best tool for drafting and editing documents
> (c) Remove the name and account number and then use Copilot
> (d) NotebookLM — it works best with existing documents

*(Explanation should acknowledge that option (c) is also valid — anonymisation + Copilot is an acceptable approach — but JARVIS is the safest choice when in doubt.)*

**M3 — Add application scenario (missing)**
> "An employee sent Copilot: 'Help me communicate with the team.' The response was a generic paragraph that did not match their situation. Which RICE element is most clearly missing?"
>
> (a) Role — they did not define who they are
> (b) Instruction — they did not specify an output format
> (c) ✓ Context and Expectations — no information about the team, the situation, or what the output should look like
> (d) Nothing is missing — Copilot simply cannot write internal communications

**M4 — Add trust calibration scenario (missing)**
> "Copilot tells you with confidence that the Bank of Israel's current prime lending rate is X%. You are about to include this in a client document. What should you do?"
>
> (a) ✓ Verify the rate on the Bank of Israel website before using it — rates change and Copilot's training data has a cutoff
> (b) Use it — Copilot is connected to real-time data
> (c) Ask Copilot to confirm the rate, and if it says the same thing, use it
> (d) Remove the rate from the document entirely — AI cannot handle financial figures

**M7 — Add architecture application scenario (missing)**
> "An employee wants to use Copilot as a personal writing editor that always responds in formal Hebrew, uses bullet points for summaries, and never includes client names in any draft. Where in Copilot do they configure this, and what do they write?"
>
> Open response: learner writes a Custom Instruction draft. Model answer shown after submission.

---

## 8. Missing Learning Experiences

These are learning experiences not currently in the course that would significantly strengthen AI literacy outcomes.

### 8.1 — Hallucination Detection Practice (Critical Gap)

The course explains why hallucinations happen (M1/WordPredictionSim) but does not teach employees to *detect* them in professional outputs. This is the most consequential missing skill.

**Proposed: "Fact-Check This" interactive (M1, after the Trust Calibration cards)**
Five AI-generated outputs on banking-relevant topics. Each contains at least one plausible but verifiable error. Learners identify the suspicious claim and explain why it needs checking. After each: the error is revealed with an explanation of why the model produced it (training data pattern, numerical extrapolation, etc.).

This is different from the Trust Meter interaction (which trains the judgment to verify) — Hallucination Detection trains the eye to spot specific patterns in the output itself.

### 8.2 — Prompt Failure Diagnosis (Application Gap)

The course teaches how to write a good prompt (M3). It does not teach what to do when a prompt produces a bad output — which will happen often, and immediately after the course ends.

**Proposed: "What Went Wrong?" micro-lesson (M4)**
Three examples of real Copilot outputs that failed. For each: the prompt that produced the failure, the bad output, and the diagnosis task — *which RICE element failed, and how would you fix the prompt?* This turns RICE from a construction framework into a diagnostic tool, which doubles its real-world value.

### 8.3 — AI-Assisted Workflow Design (Transfer Gap)

The course teaches individual AI interactions. It does not teach how to integrate AI into a multi-step work process — which is how productivity gains actually materialise.

**Proposed: Workflow Mapping exercise (M4)**
Learner describes a multi-step process they do regularly (example: preparing a monthly client report). A structured template asks: which steps involve AI assistance? Which steps require human judgment only? Which steps involve sensitive data and therefore require JARVIS? The completed template is the learner's personal AI workflow plan — a tangible takeaway they created, not a generic example they watched.

### 8.4 — The Limits of AI (Mindset Gap)

The course teaches when AI works well. It does not teach when AI is the *wrong* tool — situations where human expertise, human judgment, or simply a direct conversation are better. This gap can create over-reliance.

**Proposed: One lesson or section in M4 — "When Not to Use AI"**
Three to five real banking scenarios where using AI would make the situation worse, not better:
- A distressed client call that requires empathy and real-time listening (not a draft email)
- A complex credit decision where the factors are too nuanced and too sensitive for any AI tool
- A regulatory interpretation question that requires a qualified human (lawyer, compliance officer)
- A conversation with a colleague that involves confidential relationship dynamics

Short, direct. The point is not that AI is dangerous — it is that AI is a tool with a scope, and professional judgment includes knowing that scope.

### 8.5 — Peer Application Stories (Transfer Enabler)

No course-created example can fully anticipate the variety of ways employees will apply AI in their specific roles. Peer stories from real employees fill this gap while creating social proof.

**Proposed: 3–5 short videos (90 seconds each) embedded at M8 entry**
Real bank employees, named and with role titles, describe one specific change they made using course content. The framing must be concrete: not *"I now use AI more"* but *"I'm a mortgage advisor. I use this RICE prompt every time a client asks about refinancing options. Here is the exact structure I use, and here is the difference it made."*

Film with a phone. No production value required — authenticity is the point.

---

## 9. What Stays as Text

These elements should remain as text. The recommendation is not to transform everything — it is to transform the right things.

| Content | Why text is the right format |
|---------|------------------------------|
| **RICE Quick Card (M3)** | Job aid. Employees will open this at their desk while constructing a prompt. Must be scannable in 10 seconds, not watchable. |
| **Tool Reference Card (M2)** | Reference material. Learners need to scan a column for a specific tool, not watch a linear comparison. |
| **Data Security Rules** | Compliance reference. Must be readable, re-readable, and quotable. Learners may need to point to specific rules in a conversation with a colleague. |
| **Post-quiz feedback/explanations** | Must appear immediately after an answer and be processed alongside the question. Text is the only format that supports this. |
| **JARVIS/Copilot boundary description (M2)** | A precise institutional policy statement. Requires accurate wording that employees can reference. |
| **Capstone field instructions (M8)** | Learners read these while typing into the fields. Must be available alongside input, not watched before it. |
| **Key terminology definitions** | Glossary-style content (token, context window, RAG, hallucination) is best as scannable text that employees can return to, not video they have to rewatch. |

---

## 10. Implementation Roadmap

### Sprint 1 — Diagnostic and Assessment Fixes (Weeks 1–2)
*No production. All content edits and quiz rewrites.*

- [x] Redesign M0 diagnostic: three dimensions, 12 items, track assignment computed — **implemented June 2026** (standalone SCORM + embedded optional quiz with gate screen; adaptive routing phase 2)
- [ ] Rewrite M1/q4 distractors (ChatGPT vs. Claude question)
- [ ] Replace M1/q3 drag card with free-text production item
- [ ] Replace M1/q2 T/F with scenario MCQ
- [ ] Rewrite M2/q2 to include data sensitivity condition
- [ ] Update M2 JARVIS description to reflect platform + agents distinction
- [ ] Add M3 RICE application scenario item
- [ ] Add M4 trust calibration scenario item
- [ ] Rewrite M4/lcap as 5-card Trust Meter interaction (design spec)
- [ ] Update Copilot exercise reflection fields in M3 (x2) and M4
- [ ] Add "When Not to Use AI" section to M4 (reading, 3 min)

### Sprint 2 — Interactive Builds (Weeks 3–6)
*App development work required.*

- [ ] M0: 60-second animated course map
- [ ] M1: "Spot the Problem" trust calibration 5-card interaction
- [ ] M2: Tool Decision Flow interactive (clickable branch)
- [ ] M2: Tool Reference Card grid (tappable cards, permanent job aid)
- [ ] M3: RICE Builder (4-field input + live preview + compare)
- [ ] M4: Trust Meter 5-card scenario interaction
- [ ] M6: Data Classifier micro-tool (text input + zone classification)
- [ ] M7: Custom Instructions Builder (3-field + preview + copy)
- [ ] M8: Bino fallback (self-guided checklist with Socratic questions)
- [ ] M8: Share-with-manager mechanism (pre-filled Teams/email)

### Sprint 3 — Media Production (Weeks 5–10, parallel with Sprint 2)
*Video recording and audio production.*

- [ ] M1/lmap: Video A — The AI Map animation (3 min)
- [ ] M1/lmap: Video B — Tokens and Context animation (3 min)
- [ ] M1 Audio Overview (NotebookLM — low effort): M1 transcript → 5-min audio
- [ ] M3 Audio Overview (NotebookLM — low effort): RICE content → 5-min audio
- [ ] M5: NotebookLM explainer screen capture (4 min)
- [ ] M5: Napkin explainer screen capture (90 sec)
- [ ] M5 Audio Overview (NotebookLM — low effort): M5 content → 3-min audio
- [ ] M7: JARVIS agents context — short video or reading (2 min)
- [ ] M8: Peer story videos × 3 (90 sec each — phone recording)

### Sprint 4 — Post-Launch Infrastructure (Weeks 8–12)
*LMS configuration and supplementary materials.*

- [ ] Parallel post-test matched to M0 diagnostic (10 items)
- [ ] D+7 spaced retrieval quiz — M3 and M6 content (6 items, 3 min)
- [ ] D+30 spaced retrieval quiz — M3 and M6 content (6 items, 3 min)
- [ ] Manager communication kit (1-page PDF + Teams message template)
- [ ] Chapter navigation for all videos over 5 minutes (WebVTT)
- [ ] Prompt Gallery job aid (15–20 RICE-structured prompts by role)
- [ ] Arabic translation: M6 + M1 first sprint (8 weeks)
- [ ] xAPI migration assessment (budget planning)

---

## 11. Certification Architecture

The preceding sections improve the course as a *learning experience*. This section addresses what makes it a *certification* — a verifiable, organizational claim that an employee has demonstrated a minimum level of AI literacy. Without this layer, a bank employee who clicked through every screen at 2× speed receives the same credential as one who engaged deeply. That is not a competency certification.

### 11.1 — What "Certified" Means: Minimum Standards

Currently, course completion equals certification. Any employee who navigates all modules receives a completion record regardless of assessment performance. For a foundational competency, this is insufficient.

**Recommended certification standards:**

| Requirement | Standard | Rationale |
|-------------|----------|-----------|
| Complete all mandatory modules | M0, M3, M6, M8 — always; M1 and M2 per track | Ensures every employee has been exposed to core security and prompt content |
| Pass the comprehensive post-test | ≥70% on the 10-item parallel post-test | A meaningful threshold for a foundational level |
| Complete the M8 capstone | Bino path or self-guided fallback — both count | The synthesis exercise demonstrates integration, not just recall |
| Maximum attempts on post-test | 3 attempts before escalation to L&D facilitated session | Supports learning without creating a penalty loop |

Module quizzes serve as *learning checkpoints*, not certification requirements. They give feedback during learning; the post-test certifies the outcome.

### 11.2 — The Certificate Artifact

**Recommended:** A digital badge compliant with the Open Badges standard that includes:

- Employee name and date of certification
- Issuer: Bank Hapoalim L&D Academy
- Competency level: *"AI Fundamentals — AI Literacy Level 1"*
- Skills claimed: Prompt engineering · Responsible AI use · Data security · Tool selection
- A verification link so any manager or HR partner can confirm authenticity
- Expiration date: 18 months from issue date

The badge should appear in the employee's LMS profile, their HR system competency record, and the manager's team capability dashboard. LinkedIn sharing should be employee-controlled (opt-in, not default).

### 11.3 — Recertification Cycle

AI tools and bank policies change faster than any static certification can anticipate. A certification earned in 2026 will not represent current competency in 2028.

**Recommended recertification model:**

- Certification valid for **18 months**
- LMS triggers a recertification notification **2 months before expiry**
- Recertification path is **not the full course again** — a focused 20-minute update covering: new tools added to the bank's approved AI toolkit, policy or security changes, and a refreshed post-test using new items on the same competency domains
- **Trigger-based recertification:** Any major change — a new AI platform, a significant JARVIS capability update, or a material change to the bank's data security policy — triggers an ad-hoc recertification requirement independent of the 18-month cycle. L&D sets the timeline; the update content is the delta, not the full course.

### 11.4 — Mandatory Module Definition Under Adaptive Routing

The adaptive routing in Section 3 means some employees skip modules. This must be reconciled with certification requirements.

| Track | Mandatory for certification | May skip |
|-------|----------------------------|----------|
| Foundation | M0 → M1 → M2 → M3 → M4 → M5 → M6 → M7 → M8 | None |
| Standard | M0 → M1 → M2 → M3 → M6 → M8 (M4, M5, M7 optional) | M4, M5, M7 |
| Accelerated | M0 → M3 → M6 → M8 + M1 check quiz | M1 full, M2, M4, M5, M7 |

**Critical rule:** Accelerated-track employees who skip M1 must pass a 5-item knowledge check on M1 content before proceeding. They skip the instruction; they do not skip the assessment.

### 11.5 — HR and Talent System Integration

For this to be an organizational competency — not just a learning record — the certification must be visible outside the LMS:

- Integration with the bank's HR system to record "AI Literacy Level 1" as a verified competency on the employee record
- Inclusion in **new employee onboarding requirements**: completion within 30 days of start date
- Visibility in performance review conversations as a development checkpoint (not a performance metric)
- Reporting available to L&D, HR Business Partners, and department heads on completion rates by function and grade

---

## 12. Manager Enablement Program

The single highest predictor of on-the-job application of training is manager support. When managers do not know what their team learned, do not reinforce it, and do not create opportunities to apply it, transfer approaches zero — regardless of course quality.

For a bank-wide mandatory certification, manager enablement is not optional. It is the bridge between completion and competency.

### 12.1 — Manager Preview Brief

Before their team is assigned the course, every manager should receive a **2-page PDF** containing:

- What the course covers and what employees will be able to do when they complete it
- The five specific on-the-job behaviours the certification aims to enable (drawn from Section 2.2)
- A suggested 30-minute team meeting agenda to introduce *why AI literacy matters for this team specifically* — before employees start the course
- A plain-language summary of what will change: which tools employees will use, when JARVIS is required versus Copilot, what RICE prompting looks like in practice

The manager brief establishes the manager as a sponsor of the learning, not a bystander to it.

### 12.2 — Manager Team Dashboard in LMS

Managers should have real-time visibility of their team's certification status throughout the rollout window:

| Dashboard element | Detail |
|---|---|
| Team completion rate | Percentage of direct reports who have completed certification |
| Module-level progress | Which modules each employee has completed |
| Post-test scores | Score on the certification assessment (not module quizzes) |
| Pre/post knowledge gain | Delta between M0 diagnostic and post-test (once matched post-test is live) |
| At-risk flag | Employees who have not started after 2 weeks, or who have failed the post-test twice |

This dashboard should be available in the LMS manager portal and summarized in a weekly automated email to managers during the rollout period.

### 12.3 — Post-Certification Activation Guide

The most important manager conversation happens *after* an employee completes the certification. The activation guide provides a structured framework:

**Three questions to ask every team member who completes the certification:**

1. *"Which module surprised you most — something you didn't know or that changed how you think about your work?"*
2. *"What is one specific task you want to try differently with AI this week?"*
3. *"Is there anything in how we work as a team where you think AI could make a real difference?"*

These questions are not a quiz. They create the space for an employee to make a specific commitment in front of their manager — the most reliable activation mechanism available outside of structured coaching.

**Three suggested follow-up tasks managers can assign immediately after certification:**

- "Try the RICE prompt structure on your next complex task and share the before/after output with the team."
- "Use JARVIS for one task this week that involves client data, and tell us what you found."
- "Identify one recurring task in our team workflow where AI could save meaningful time. Bring it to next week's meeting."

### 12.4 — Manager's Role in AI Safety Culture

Managers have a specific responsibility for reinforcing data security behaviour — the area where individual employee decisions have organizational consequences. The manager brief should include:

- **How to respond non-punitively** when a team member discloses that they previously shared sensitive data with an external AI tool: acknowledge, inform about going-forward policy, do not shame
- **How to model good AI use** visibly: use JARVIS in team settings, use RICE when prompting in front of others, narrate your decision-making
- **How to set team norms**: when AI use is expected, when human judgment is explicitly required, and what the team's shared understanding of the data classification rules is

A manager who actively models and reinforces the certification content multiplies its impact across their entire team. A manager who ignores it cancels it.

---

## 13. Organizational Rollout and Change Management

A mandatory certification for every employee is a significant organizational event. Content quality alone does not determine whether it succeeds. The way the certification is introduced, communicated, and supported determines whether employees approach it as a meaningful development opportunity or a compliance checkbox — and the difference in engagement, completion quality, and transfer is substantial.

### 13.1 — Executive Sponsorship

The certification requires visible senior leadership support — not just sign-off, but active participation in the narrative.

**Recommended:** A 3–5 minute video from a senior executive (CIO, CHRO, or equivalent) explaining:
- Why AI literacy is a bank-wide priority now
- What the bank expects every employee to be able to do as a result
- What this means for customers, for colleagues, and for the bank's future

This video should appear in M0 as a prominently featured "Why this matters from leadership" resource — optional to watch, but clearly from a named leader, not an anonymous narrator. The message must be specific: not *"AI is the future"* but *"Here is what we are asking every person at this bank to be able to do, and here is why it matters."*

### 13.2 — Communication Cascade

| When | Audience | Message |
|------|----------|---------|
| 4 weeks before launch | All managers | "What is coming, when, what your team will be asked to do. Manager brief attached." |
| 3 weeks before launch | All managers | Activation guide + team dashboard access |
| 2 weeks before launch | All employees | "Why this certification exists, how long it takes, when it must be completed, and that this is allocated work time." |
| 1 week before launch | All employees | Reminder + FAQ link + L&D helpdesk contact |
| Day of launch | All employees | "The certification is now live. Here is your direct link." |
| Weekly during rollout | All managers | Automated team progress report |
| End of rollout window | Non-completers | Personalised reminder + facilitated session invitation |

The employee communication must explicitly state: **completing this certification is allocated from work time, not personal time.** Ambiguity on this point is one of the most common causes of low engagement with mandatory development programs.

### 13.3 — Completion Mandate and Accountability

| Parameter | Recommendation |
|-----------|----------------|
| Completion deadline — existing employees | 8 weeks from launch |
| Completion deadline — new employees | 30 days from start date |
| Primary accountability | Employee and direct manager |
| Week 4 non-completion | Manager receives a flag; expected to address with team member |
| Week 8 non-completion | Flag escalates to skip-level manager |
| Support for non-completers | L&D facilitated session — supportive, not disciplinary |
| Consequence of persistent non-completion | HR Business Partner involvement; treated as a development gap, not misconduct |

The accountability structure must be proportionate and clearly communicated in advance. Employees and managers should understand before the certification opens what the expectation is and what happens if it is not met. Surprises at week 8 create resentment; clarity at week 0 creates accountability.

### 13.4 — Role-Tailored "Why This Matters" Messaging

A single WIIFM narrative will not land across an entire bank workforce. Employees in different roles have different daily work, different AI touchpoints, and different questions about relevance. The communication cascade should include role-tailored messages for at least four segments:

| Employee segment | WIIFM message |
|-----------------|---------------|
| **Branch staff and tellers** | "AI tools can help you draft routine client communications faster, look up procedures more efficiently, and handle common queries with better information — without requiring technical knowledge. This certification shows you how to use them safely, even when your work involves customer data." |
| **Knowledge workers and analysts** | "If you are already using Copilot Chat, this certification will show you how to get dramatically better outputs from it — and how to protect yourself from the risks most users don't know about. If you haven't used it yet, you'll leave with a skill that changes how you work every day." |
| **Managers and team leaders** | "AI literacy in your team is a capability you can develop now. This certification gives your team a common language, common tools, and common protocols — which makes it easier to set expectations, reinforce good practice, and lead the change." |
| **Executives** | "Every employee in your function will complete a foundational AI literacy certification. Understanding what they are learning — and what they can now do — will help you lead through what is coming." |

---

## 14. Post-Certification Ecosystem and Governance

A certification without a supporting ecosystem decays. Employees complete the course, earn the badge, and return to an environment where nothing has changed — no community, no updated resources, no pathway forward. Within 90 days the certification becomes a historical record rather than an active competency.

The sections below describe what must be built around the course to sustain the competency it develops.

### 14.1 — Internal AI Champions Network

The certification creates a population of employees who have demonstrably engaged with AI fundamentals. Some of these employees will be early adopters and enthusiasts who want to go further. Identifying and organizing this group is the lowest-cost, highest-leverage post-launch investment available.

**Recommended structure:**
- At M8 exit, offer all employees the option to join an **"AI Champions"** internal network (opt-in, not mandatory)
- Champions receive: early access to new tools added to the approved toolkit, a monthly AI learning digest from L&D, and an invitation to a dedicated Teams workspace for sharing use cases, prompts, and questions
- Champions are the first cohort for peer story video contributions in future course updates
- L&D uses the Champions network as an advisory group: they surface emerging use patterns, unexpected risks, and questions that inform the quarterly content review

A Champions network requires no budget to launch — only a Teams channel, a commitment to a monthly digest, and an L&D owner who checks in quarterly.

### 14.2 — Living Resource Hub

Post-certification, employees need a single, maintained location for resources that evolve as AI tools evolve. A static course is the wrong home for dynamic job aids.

**Recommended elements of the Resource Hub (intranet or Teams channel):**
- Tool Reference Card (from M2) — maintained and updated as the approved tool list changes
- RICE Prompt Gallery — seeded with 15–20 role-specific prompts at launch, updated quarterly from Champions network contributions
- Data Classification Guide — one-page summary of the Green/Yellow/Red zones, linked from M6 and maintained by Information Security
- "What's new" feed — brief announcements when the bank adds or changes approved AI tools, updated by L&D
- FAQ and L&D contact — for questions that go beyond the course content

### 14.3 — Content Governance and Review Cycle

Without a defined governance model, the certification content will be materially outdated within 12 months.

**Recommended governance:**

| Activity | Frequency | Owner | Trigger |
|----------|-----------|-------|---------|
| Full content review | Annual | L&D content owner (named individual) | Calendar |
| Tool-specific content review (M2, M5) | Quarterly | L&D + IT | Calendar |
| Data security content review (M6) | Quarterly | L&D + Information Security | Calendar |
| Trigger-based update | Within 4 weeks | L&D content owner | New tool added / policy change / major AI capability shift |
| Post-test item refresh | At each annual review | L&D | Calendar |
| Recertification content update | Before each recertification cycle | L&D | 18-month calendar trigger |

**Version control:** Each content update increments the course version. Employees who completed an earlier version receive a notification and a short "What's New" summary (under 10 minutes) rather than repeating the full course. Employees on the Accelerated track receive only the changed modules.

### 14.4 — The Learning Journey Beyond Level 1

This certification is explicitly the bank's **first AI competency**. At M8 exit, employees should see clearly where they stand in a larger framework — even if the subsequent levels are still being designed.

**Recommended exit framing at M8 completion:**
> *"You've completed the AI Fundamentals certification — Level 1 of the bank's AI competency framework. What comes next depends on your role and your goals. Advanced AI users can explore Level 2. Managers leading AI adoption in their teams can access the Team AI Implementation Guide. Developers and data professionals have access to a technical AI track. Ask your L&D Business Partner or visit the AI Learning Hub."*

Naming Level 2 at M8 exit — even before it exists — establishes that this is a learning journey, not a checkbox. It also creates L&D accountability to deliver on the promise.

**Competency levels to design (in priority order):**

| Level | Target audience | Core content |
|-------|----------------|--------------|
| Level 1 — AI Fundamentals (current) | All employees | How AI works, responsible use, data security, prompt engineering, tool selection |
| Level 2 — AI Practitioner | Regular AI users, knowledge workers | Advanced prompt design, AI-assisted workflow design, output evaluation at depth, agentic tools |
| Level 3 — AI Team Lead | Managers leading AI adoption | Team AI strategy, creating team norms, AI governance at the team level, measuring AI impact |
| Specialist track — Technical | Developers, data engineers, IT | API access, fine-tuning, AI integration patterns, JARVIS platform capabilities |

### 14.5 — Feedback Loops: How Employee Experience Informs the Next Version

The most valuable data for improving this certification comes from employees who complete it. Course analytics capture what happens; employee feedback explains why.

**Recommended feedback mechanisms:**

| Mechanism | Timing | Format | Questions |
|-----------|--------|--------|-----------|
| End-of-course survey | Immediately at M8 completion | 3 free-text items | What was most useful? What confused you? What is missing? |
| D+30 pulse | Alongside the spaced retrieval quiz | 2 items | "Are you using AI differently than before the course?" + "What barriers have you encountered?" |
| Manager input | Activation conversation follow-up | 1 brief email | "What did your team apply? What questions came up that the course didn't answer?" |
| Champions network quarterly | Quarterly L&D call | Open discussion | Emerging use patterns, risks, and questions to inform next update |

This feedback feeds directly into the quarterly content review cycle, closing the loop between learner experience and course quality. Without this loop, the course improves only when L&D has time to reflect — not when employees have something to say.

---

## Appendix: Success Metrics

| Level | Metric | Target | When to measure |
|-------|--------|--------|----------------|
| Reaction | Overall satisfaction (1–5) | 4.0+ | Course completion |
| Reaction | "Relevant to my daily work" (1–5) | 4.2+ | Course completion |
| Reaction | Module dropout rate | Under 15% per module | Ongoing |
| Learning | Pre/post knowledge gain | 25+ percentage point gain | M0 diagnostic vs. post-test |
| Learning | M6 ethics scenario accuracy | 85%+ correct | Quiz analytics |
| Learning | M3 RICE scenario accuracy | 70%+ on first attempt | Quiz analytics |
| Learning | D+30 retention score | Within 15% of post-test | Spaced retrieval quiz |
| Learning | Certification pass rate (first attempt) | 80%+ of completers | Post-test analytics |
| Behavior | AI tool use frequency (weekly+) | 60%+ of completers | D+30 pulse survey |
| Behavior | RICE framework self-reported use | 50%+ of completers | D+30 pulse survey |
| Behavior | Security protocol adherence | 95% self-reported | D+30 pulse survey |
| Completion | Bank-wide certification rate | 95% within 8 weeks | LMS completion report |
| Completion | New employee onboarding completion | 95% within 30 days | LMS + HR system |
| Results | Zero AI-related data security incidents from trained population | 0 incidents | D+90 Information Security review |
| Results | Copilot active usage rate: trained vs. untrained cohort | Trained cohort higher | D+90 IT telemetry |
| Results | Manager activation conversation rate | 70%+ of managers | Manager survey at D+14 |

---

*End of Report*

*For questions about this report, contact the L&D team.*
*Next review scheduled: 30 days post-launch based on completion and satisfaction data.*
