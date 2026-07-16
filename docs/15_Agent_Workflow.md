# 15 — Agent Workflow (Multi-Agent System)

`14_AI_Workflow.md` defines *what* happens at each stage. This document defines *which specialized agent* performs it, and the contract each agent must honor: responsibility, input, output, tools, internal workflow, and communication protocol with the Agent Router (`11_System_Architecture.md §11.4`).

## 15.1 Why Specialized Agents Instead of One Generalist Prompt

> **Decision:** Each pipeline stage is owned by a narrowly-scoped agent with its own system prompt, rather than one large "do everything" agent switching modes via instructions. Reasoning, tied directly to `02_Product_Strategy.md §2.6` (moat): a narrow agent's prompt and few-shot examples can be evaluated and improved independently against stage-specific test cases (`24_Testing.md`), without risking regression in unrelated stages — a generalist prompt makes every improvement a gamble against every other capability it holds.

## 15.2 Agent Roster

| Agent | Owns Stage(s) (from `14_AI_Workflow.md`) | Primary Tools |
|---|---|---|
| CEO Agent | Cross-cutting: final feasibility/priority sanity pass before PRD is marked complete | Read access to Validation + Market Analysis artifacts |
| Product Manager (PM) Agent | PRD, BRD | Read access to Interview, Validation, Market Analysis |
| Business Analyst Agent | Idea Validation, Market/Competitor Analysis | Web search (live-fetch), read access to Interview |
| UX Researcher Agent | User Stories (persona-fit pass) | Read access to PRD, project personas |
| Software Architect Agent | System Architecture | Read access to Stories (ready only) |
| Database Engineer Agent | Database Design / ERD | Read access to Stories, Architecture |
| Backend Engineer Agent | API Design | Read access to Database Design, Stories |
| Frontend Engineer Agent | Task Breakdown (frontend-tagged tasks), UI-relevant task detail | Read access to Architecture, API Design |
| Security Engineer Agent | Cross-cutting review injected at Architecture + API stages | Read access to Architecture, API Design, Database Design |
| DevOps Engineer Agent | Deployment Checklist (`25_Deployment.md` output), CI/CD task tagging | Read access to Architecture, Tech Stack |
| QA Engineer Agent | Acceptance Criteria generation, test-relevant task tagging | Read access to Stories, API Design |
| UI Designer Agent | Design-system-aligned annotations on frontend tasks (`17_UI_UX_Design_System.md` conformance) | Read access to Architecture, Design Tokens |
| Technical Writer Agent | Assembling human-readable summaries/exports across stages | Read access to all artifacts in a project |
| Prompt Engineer Agent | Prompt Generation (Stage 11) | Read access to a single Task + its linked fragments |
| Reviewer Agent | Cross-artifact consistency pass, invoked after Stories/Architecture/Database/API/Tasks | Read access to the artifact pair being checked |

> **Decision:** Not every agent above is a distinct model call at v1. Several (UX Researcher, QA Engineer, UI Designer, Security Engineer) start as **prompt personas layered into an owning agent's generation call** (e.g., the Architect Agent's prompt includes a Security Engineer review sub-step) rather than fully independent Router-dispatched agents, to control latency and cost (NFR-102/104) while the roster is still being validated. Promoting a persona to a fully independent agent is a reversible, low-risk change (new Router entry, same output contract) once usage data shows it's warranted — see staged rollout in `27_Roadmap.md`.

## 15.3 Detailed Agent Contracts (Core Pipeline Agents)

### Product Manager (PM) Agent
- **Responsibility:** Produce PRD/BRD content that is scoped, prioritized, and consistent with stated constraints.
- **Input:** `interview_data`, validation scorecard, market/competitor analysis (if run).
- **Output:** `prds.sections` / `brds.sections` (structured, section-keyed per `12_Database_Design.md`).
- **Tools:** Read-only project context; no web access (BA Agent owns external lookups, keeping provenance tagging in one place per FR-121/122).
- **Workflow:** Section-by-section generation (`14_AI_Workflow.md` Stage 4/5); explicit instruction to distinguish PRD scope framing from BRD business-justification framing to prevent content duplication (FR-141).
- **Communication protocol:** Invoked by the Router with a `context` payload containing artifact IDs, not raw content duplicated in the prompt every time where avoidable — reduces token cost and keeps a single source of truth for what was actually fed to the model (auditable via NFR-180 logging).

### Software Architect Agent
- **Responsibility:** Produce a component/service diagram and component list genuinely derived from ready stories.
- **Input:** All `ready`-status stories for the project.
- **Output:** Mermaid diagram source + structured component list, each tagged with justifying story IDs.
- **Tools:** None external; pure reasoning over provided context.
- **Workflow:** Extract implied components → classify core vs. supporting (per `14_AI_Workflow.md` Stage 7) → invoke inline Security Engineer persona sub-step to flag components needing auth/data-boundary attention → assemble diagram.
- **Communication protocol:** Returns structured JSON (component list) alongside Mermaid text — never Mermaid-only, since downstream Database/Task agents consume the structured list, not the diagram source.

### Database Engineer Agent
- **Responsibility:** Produce normalized, story-justified schema.
- **Input:** Ready stories + Architecture component list.
- **Output:** `entities`/`relationships` JSONB (source of truth per `12_Database_Design.md §12.3`).
- **Tools:** None external.
- **Workflow:** Entity extraction → relationship inference → normalization self-check (explicit sub-step, FR-163) → emit JSONB; DDL and ERD are deterministically derived downstream by application code, *not* by this agent, to guarantee they can't drift from the JSONB (this is a system-architecture decision, not an agent-capability limitation).
- **Communication protocol:** Must include, per entity/field, the story ID(s) that justify it — this is a required field in the output schema, not an optional annotation, since FR-161 depends on it existing for every entity without exception.

### Backend Engineer Agent
- **Responsibility:** Produce API contract derived from schema + story actions.
- **Input:** Current (non-stale) schema + ready stories.
- **Output:** Endpoint list matching FR-172's required fields.
- **Tools:** None external.
- **Workflow:** Map entities to CRUD endpoints; map non-CRUD story verbs to purpose-built endpoints (Stage 9 distinction); inline Security Engineer persona sub-step assigns auth requirements per endpoint.
- **Communication protocol:** Rejects (returns a structured error, not a best-effort guess) if invoked against a stale schema — enforces the dependency contract at the agent level as a second line of defense behind the API-layer check in `13_API_Specification.md §13.3`.

### Reviewer Agent
- **Responsibility:** Automatic cross-artifact consistency check (the automatic half of FR-211, distinct from the on-demand AI Product Critic below).
- **Input:** The artifact pair relevant to the transition just completed (e.g., Stories → Architecture).
- **Output:** A list of structured flags (`{ severity, artifactRef, description }`), never a pass/fail boolean alone — a flag must always be actionable and specific (mirrors the falsifiability requirement in FR-212, applied automatically rather than on-demand).
- **Tools:** None external.
- **Workflow:** Runs a fixed checklist per transition type (defined per stage, e.g. "every component has ≥1 justifying story," "every endpoint's auth requirement is consistent with the schema's row-level ownership model") rather than an open-ended "does this look right?" pass — checklists are versioned alongside code per NFR-171.
- **Communication protocol:** Flags are attached to the artifact version as review comments (`12_Database_Design.md` `comments` table), visible in the UI per `09_User_Flow.md §9.2.8`, and also returned inline in the streaming response (`13_API_Specification.md §13.4`, `review_flag` event) so they surface before generation is even marked complete.

### Prompt Engineer Agent
- **Responsibility:** Assemble (not freshly generate) a self-contained coding prompt from a task and its linked fragments.
- **Input:** One task + its linked schema/endpoint/criteria fragments (already-validated content).
- **Output:** Markdown/JSON prompt matching FR-192/193.
- **Tools:** None — deliberately the lowest-creativity agent in the roster (`14_AI_Workflow.md §14.2` Stage 11 note).
- **Workflow:** Template assembly (`16_Prompt_Workflow.md` owns the exact template), with light rewriting only for coherence, never altering the substance of embedded fragments.
- **Communication protocol:** Output is deterministic enough that repeated invocation with unchanged inputs should be low-variance — tested explicitly in `24_Testing.md` as a regression class (prompt-output stability), unlike the earlier, intentionally more generative stages.

## 15.4 AI Product Critic vs. Reviewer Agent — Explicit Distinction

These are easy to conflate; they are different by design:

| | Reviewer Agent | AI Product Critic |
|---|---|---|
| Trigger | Automatic, on every stage transition | On-demand, user-invoked |
| Tone/goal | Consistency (does X match Y) | Adversarial (is this actually a good decision) |
| Output | Structured flags tied to specific fields/entities | Prose-plus-structured objections, may challenge scope or product decisions, not just internal consistency |
| Blocking? | Non-blocking, but flags persist until dismissed | Never blocking — purely advisory, invoked at the user's discretion |

## 15.5 Communication Protocol Summary (Router ↔ Agents)

All agents receive a common envelope from the Router and return a common response shape, regardless of stage:

```json
// Request envelope
{
  "projectId": "...",
  "artifactContextRefs": ["artifact_version_id", "..."],
  "stage": "database_design",
  "options": { "scope": "full" }
}

// Response envelope
{
  "output": { /* stage-specific structured payload */ },
  "reviewFlags": [ /* Reviewer Agent output, if applicable */ ],
  "sourceRefs": { /* which upstream artifact IDs were actually used */ }
}
```

`sourceRefs` is mandatory in every response — it is what the Router uses to write `artifact_dependencies` rows (`12_Database_Design.md`), and its presence is enforced structurally (schema-validated response), not left to convention, since the entire dependency-graph guarantee (NFR-150) depends on it never being omitted.

## 15.6 Cross-References

- Stage-level reasoning process each agent follows → `14_AI_Workflow.md`
- Router dispatch mechanics → `11_System_Architecture.md §11.4–11.5`
- How Prompt Engineer Agent output becomes an external coding-agent prompt → `16_Prompt_Workflow.md`
