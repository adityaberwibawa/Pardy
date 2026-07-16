# 05 — User Personas

## 5.1 Persona Summary

| Persona | Tier | One-line |
|---|---|---|
| Dara, the Indie Hacker | Primary | Solo builder shipping a SaaS side project; no PM, no architect, just her and a coding agent |
| Aji, the Startup CTO | Primary | Technical co-founder juggling architecture decisions across a 3-person team under deadline pressure |
| Rani, the Technical PM | Primary | Product manager at a small startup who writes specs but needs engineering-grade schema/API detail she can't produce alone |
| Farhan, the Freelance Developer | Secondary | Builds client projects; needs fast, professional-looking specs to align clients before coding starts |
| Sinta, the Student Developer | Secondary | Learning full-stack development; needs guardrails and explanations, not just fast output |

---

## 5.2 Dara — The Indie Hacker (Primary)

**Context:** Building a niche SaaS product solo, nights and weekends, funded by savings. Uses Claude Code daily. No formal PM or architecture training — learned by shipping.

**Jobs-to-be-done:**
- "Turn my 2am idea into something I can actually start building tomorrow without redoing it in two weeks."
- "Stop discovering my database schema is wrong after I've already built three features on top of it."

**Current workaround:** Talks through the idea with ChatGPT/Claude in an unstructured chat, copy-pastes fragments into a Notion doc, forgets half the reasoning by the time she starts coding.

**Pain points:**
- Loses track of *why* she made a decision two weeks ago.
- Coding agent produces inconsistent output across sessions because there's no persistent spec to re-anchor it.
- No budget or desire to hire a PM or architect — needs the tool to *be* that function.

**Success looks like:** Idea → usable PRD → schema → first coding-agent prompt in under an hour, with enough confidence in the plan that she doesn't second-guess the architecture mid-build.

**Relevant PARDI features:** AI Interview, Idea Validation, PRD Generator, Database Designer, Prompt Generator (see `06_Product_Requirements.md`).

---

## 5.3 Aji — The Startup CTO (Primary)

**Context:** Technical co-founder of a 3-person, pre-seed startup. Splits time between coding and making architecture calls for two other engineers. Deadline pressure from an upcoming fundraising milestone.

**Jobs-to-be-done:**
- "Make architecture decisions once, write them down properly, and get the rest of the team (and future hires) aligned without repeating myself in Slack."
- "Produce documentation good enough to survive investor/technical-diligence scrutiny without a week of dedicated writing."

**Pain points:**
- No time to be both architect and technical writer.
- Team members build inconsistent patterns without a shared system design and API contract reference.
- Needs artifacts that look and read as professionally as what a larger, funded startup would produce (this is where the Linear/Stripe/Notion quality bar in `17_UI_UX_Design_System.md` matters commercially, not just aesthetically).

**Success looks like:** A System Architecture doc, Database Design, and API Specification his whole team can build against without him personally reviewing every PR for architectural drift.

**Relevant PARDI features:** System Architecture Generator, Database Designer, API Designer, Collaboration/Workspace, AI Reviewer.

---

## 5.4 Rani — The Technical PM (Primary)

**Context:** Product manager at a 10-person startup. Comfortable writing user stories and acceptance criteria but lacks the engineering depth to specify a normalized schema or a clean API contract — has previously handed engineers under-specified requirements and watched them make schema decisions that caused rework.

**Jobs-to-be-done:**
- "Write requirements that engineers can't reasonably misinterpret or under-specify further."
- "Understand enough of the technical implications of my own PRD to negotiate scope intelligently with engineering."

**Pain points:**
- Requirements docs that look complete to her read as ambiguous to engineers.
- No easy way to sanity-check whether her proposed feature implies a schema/API change that's bigger than she thinks.

**Success looks like:** A PRD that PARDI has already translated into a proposed schema and API impact, so she can see the engineering cost of a requirement *before* committing to it in a planning meeting.

**Relevant PARDI features:** PRD Generator, BRD Generator, Acceptance Criteria Generator, AI Product Critic, Task Breakdown.

---

## 5.5 Farhan — The Freelance Developer (Secondary)

**Context:** Builds client web apps under fixed-price contracts. Client alignment failures (scope creep, "that's not what I meant") are his biggest source of unpaid rework.

**Jobs-to-be-done:** "Get the client to sign off on something specific and visual before I write a line of code, so scope disputes have a paper trail."

**Relevant PARDI features:** PRD Generator, User Flow, Export System (client-shareable, professional export), Template Marketplace (reusable client-project templates).

## 5.6 Sinta — The Student Developer (Secondary)

**Context:** Learning full-stack development through personal projects. Wants to build "the right way" but doesn't yet have the pattern recognition to know what "right" looks like.

**Jobs-to-be-done:** "Show me not just what to build, but why this schema/architecture is the correct choice, so I actually learn the reasoning."

**Relevant PARDI features:** AI Product Coach (explanatory mode), Knowledge Base, Template Marketplace (studying well-formed example projects).

---

## 5.7 Persona-to-Feature Traceability

This table is the anchor used in `06_Product_Requirements.md` to justify feature prioritization — every feature should map back to a job-to-be-done above, not exist because it's a common SaaS pattern.

| Feature Area | Dara | Aji | Rani | Farhan | Sinta |
|---|:---:|:---:|:---:|:---:|:---:|
| AI Interview / Idea Validation | ✅ | ◐ | ◐ | ✅ | ✅ |
| PRD / BRD Generator | ✅ | ✅ | ✅ | ✅ | ✅ |
| Database / API Designer | ✅ | ✅ | ◐ | ◐ | ✅ |
| Task Breakdown / Prompt Generator | ✅ | ✅ | ◐ | ✅ | ◐ |
| Collaboration / Workspace | ◐ | ✅ | ✅ | ◐ | ✗ |
| AI Reviewer / Critic / Coach | ◐ | ✅ | ✅ | ◐ | ✅ |
| Template Marketplace | ◐ | ◐ | ✗ | ✅ | ✅ |

(✅ core need · ◐ secondary benefit · ✗ not relevant)
