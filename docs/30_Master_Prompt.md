# 30 — Master Prompt

This is the canonical prompt to use when asking an AI assistant (or a future contributor) to **extend, regenerate, or maintain consistency within** this documentation repository. It distills the working principles established across `01`–`29` into a single reusable instruction set, so future additions don't drift from the standards already set.

## 30.1 How to Use This File

Paste the prompt in §30.2 as a system/context message before asking for any new file, section, or revision within this repo. Fill in the bracketed task description. The assistant should treat every existing file in this repository as binding context — not to be contradicted without an explicit, stated decision record explaining why a prior decision is being revised.

## 30.2 The Prompt

```
You are extending the PARDI documentation repository — an AI-native SaaS
product that turns an idea into a complete, traceable software blueprint
(Idea → Validation → PRD → BRD → Stories → Architecture → Database → API
→ Task Breakdown → Coding Prompts → Deployment Checklist).

Ground rules, non-negotiable:

1. Read the existing repository first. Every new section must be
   consistent with prior decisions (marked "> Decision:" throughout the
   repo) unless you are deliberately revising one — in which case, state
   explicitly which prior decision is being changed and why.

2. Every non-obvious choice gets a "> Decision:" callout with reasoning
   and the rejected alternative. Do not state a conclusion without the
   reasoning that produced it.

3. Cross-reference, don't duplicate. If a fact, value, or rule already
   lives in another file (e.g., color tokens in 19_Design_Tokens.md,
   motion timing in 18_Animation_Guidelines.md), reference it by file
   and section rather than restating or (worse) restating with drift.

4. Tables over prose for anything enumerable. Mermaid diagrams for
   architecture, sequence, ER, and flow content. No filler paragraphs
   that restate the obvious.

5. Every feature/requirement should be traceable to a persona
   job-to-be-done (05_User_Personas.md) and a pipeline stage
   (06_Product_Requirements.md §6.3). If it isn't traceable to either,
   flag it as possible scope creep rather than including it silently.

6. Respect existing scope boundaries: PARDI does not write or execute
   application code, does not replace long-term PM/ticket tracking, and
   does not fully automate market research in place of real user
   research (06_Product_Requirements.md §6.5). Do not propose features
   that cross these boundaries without flagging the conflict explicitly.

7. Write in English, in Markdown, production-ready and implementation-
   ready — this document should be usable directly by an engineer, a
   designer, or an AI coding agent without further clarification.

8. Where a claim would require external data (market size, competitor
   figures) that hasn't been verified, label it directionally
   (see 03_Market_Research.md's convention) rather than presenting an
   estimate as verified fact.

Task: [describe the specific file, section, or revision needed — e.g.,
"Add a new Functional Requirement section for a Sprint Planner feature,
consistent with 06_Product_Requirements.md's P2 designation and
15_Agent_Workflow.md's agent-contract format."]
```

## 30.3 Maintenance Protocol

When a decision recorded in an earlier file is later reversed (e.g., Sprint Planner is promoted from P2 to P0 based on real usage data per `27_Roadmap.md §27.2`), the correct process is:

1. Update the original file's requirement/priority directly (don't leave it stale).
2. Add a dated entry to the Decision Log in `Appendix.md §A.3` noting what changed and the evidence that justified it (e.g., a specific KPI threshold from `28_KPI.md` being crossed).
3. Check every file that cross-references the changed decision (search for its file/section citation) and confirm they still read correctly — this repository's own credibility depends on the same non-staleness discipline it asks PARDI's product to enforce for its users.

## 30.4 Extending the Repository Beyond File 30

Should this documentation set need to grow beyond the current 30 files + Appendix (e.g., a dedicated `31_Localization.md` if internationalization moves out of "out of scope," per `08_Non_Functional_Requirements.md §8.7`), follow the same discipline used to build files 01–30: one file at a time, cross-referenced rather than duplicative, with explicit "> Decision:" reasoning — not all at once, for the same depth-over-breadth reasoning stated at the outset of this repository's construction (`README.md §6`).
