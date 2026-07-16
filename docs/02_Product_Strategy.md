# 02 — Product Strategy

## 2.1 Positioning Statement

For software engineers and founders who use AI coding agents but keep hitting rework caused by vague specs, **PARDI is an AI Product Architect** that turns an idea into a complete, traceable software blueprint — unlike PRD-generator tools or general-purpose chatbots, PARDI produces a chain of derived, versioned artifacts that a coding agent can execute against directly.

## 2.2 Category Definition

PARDI intentionally avoids the "PRD generator" category. That category is associated with template-filling and one-shot document output, and it undersells what the product does. PARDI defines and occupies a new category:

**AI Product Architect** — software that performs the reasoning work of a product manager, software architect, and technical writer in sequence, producing artifacts that are inputs to each other rather than isolated outputs.

> **Decision:** We reject "PRD generator" as primary positioning even though PRD generation is one of PARDI's stages. Reasoning: category names anchor buyer expectations and pricing power. "Generator" implies a commodity, single-shot tool priced low; "Architect" implies ongoing, high-stakes reasoning work priced closer to how teams already pay for PM/architect tooling (Linear, Notion, Productboard).

## 2.3 Product Philosophy

**"Generate executable thinking, not documents."**

Three philosophy statements that constrain every feature decision:

1. **Every artifact must be derivable and re-derivable.** If a user changes a user story, PARDI should be able to show what downstream artifacts (schema, API, tasks) are now stale — not silently leave them wrong. This is the core reason PARDI is a pipeline with dependency tracking, not a document editor with AI autocomplete.
2. **Opinions over options.** When PARDI recommends a tech stack, a schema shape, or an architecture pattern, it commits to a specific recommendation with stated reasoning, not a menu of five options with no guidance. Indecision is the thing PARDI is supposed to remove.
3. **Output must be agent-legible, not just human-legible.** Every artifact that can plausibly feed a coding agent (schema, API contract, task breakdown) is authored in a structure a coding agent can parse and act on directly — not just prose a human has to manually translate into a prompt.

## 2.4 Strategic Wedge

The wedge is **not** "better PRD writing." It's **narrower and sharper**: *reduce the number of correction cycles between a user and their AI coding agent.* This is measurable, it's the actual pain solo builders describe, and it's defensible because it requires the full pipeline (a good PRD alone doesn't reduce correction cycles if the schema derived from it is inconsistent).

Go-to-market sequencing:

```
Phase 1 — Wedge: Idea → PRD → Database → API → Task Breakdown → Prompts
          (solo builders, indie hackers; distribution via building in public,
          Twitter/X, Indie Hackers, Product Hunt)
              ↓
Phase 2 — Expand: Team collaboration, workspace, template marketplace
          (small startup teams, technical PMs)
              ↓
Phase 3 — Platform: Multi-agent customization, third-party MCP integrations,
          enterprise workspace controls
          (agencies, larger product orgs)
```

Full phased plan in `27_Roadmap.md`.

## 2.5 Differentiation Matrix

| Dimension | ChatGPT/Claude (raw) | Notion AI / generic PRD tools | v0 / Bolt / Lovable | PARDI |
|---|---|---|---|---|
| Produces a PRD | Yes, unstructured | Yes, templated | No | Yes, structured & versioned |
| Produces schema/API derived from PRD | No | No | No | Yes |
| Produces coding-agent-ready prompts | No (manual) | No | N/A (is the coding agent) | Yes |
| Tracks staleness across artifacts | No | No | No | Yes |
| Opinionated tech/architecture recommendation | Inconsistent | No | Implicit in generated code | Yes, explicit with reasoning |
| Designed to hand off to a coding agent | No | No | N/A | Yes, this is the point |

## 2.6 Moat

Three compounding sources of defensibility, none of which are "we have a good prompt":

1. **Structured dependency graph between artifacts.** This is a product/data-modeling problem, not a prompting problem, and it gets more valuable as more artifact types are added (harder for a single-prompt competitor to replicate quickly).
2. **Template marketplace and pattern library**, seeded by real shipped projects, that improves PARDI's own recommendation quality over time (`SKILL`-like reusable patterns for common product types: marketplace, SaaS dashboard, mobile-backend, etc.).
3. **Multi-agent workflow tuned per role** (PM agent, Architect agent, DBA agent, Security agent) rather than one generalist prompt — each agent's prompt and evaluation improves independently, compounding quality advantages that are expensive for a competitor to reverse-engineer from the outside.

## 2.7 What PARDI Deliberately Does Not Do

- **Does not write application code.** Keeps scope pre-code; avoids competing directly with Claude Code/Cursor/v0, and avoids the liability and quality bar of shipping production code.
- **Does not manage project execution/PM tracking long-term** (no Jira/Linear replacement) — it hands off to those tools rather than replacing them. See integration notes in `15_Agent_Workflow.md`.
- **Does not attempt full market research automation** in place of real customer discovery — `03_Market_Research.md` and the AI Interview stage assist and structure discovery, they don't substitute for talking to users.

## 2.8 Risks to This Strategy

Summarized here; full detail and mitigations in `29_Risk_Analysis.md`.

- Coding agents themselves could absorb the "planning" step (e.g., an agent that asks clarifying questions and builds its own spec before coding). Mitigation: PARDI's artifacts are portable and exportable to *any* coding agent, so it doesn't need to bet on one agent's specific planning feature.
- Buyers may not yet perceive spec quality as the bottleneck (some still believe "better prompting" is enough). Mitigation: wedge messaging is built around a visceral, specific pain (rework cycles), not an abstract claim about specs.
