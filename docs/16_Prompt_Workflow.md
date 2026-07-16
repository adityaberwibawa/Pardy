# 16 — Prompt Workflow

This document specifies exactly how a Task artifact becomes an external-coding-agent-ready prompt, and how that prompt (or PARDI itself) integrates with MCP-based tooling during actual implementation. It is the final translation layer between PARDI's internal artifacts and the tools listed in the product's problem statement (`01_Executive_Summary.md`): Claude Code, Cursor, Windsurf, Bolt, v0, etc.

## 16.1 Design Constraint: Prompts Must Be Self-Contained

> **Decision:** A generated prompt must never say "see the PRD" or reference a PARDI URL as its only source of a fact. Reasoning: the destination is an external tool with no access to PARDI's database. A prompt that depends on the receiving agent fetching context from PARDI is a broken hand-off. Every fact the coding agent needs (schema fragment, endpoint contract, acceptance criteria) is embedded verbatim in the prompt text (FR-192), sourced directly from the already-validated `db_schemas`/`api_contracts`/`acceptance_criteria` rows — never re-generated at prompt-assembly time (`15_Agent_Workflow.md`, Prompt Engineer Agent contract).

## 16.2 Canonical Prompt Template

Every generated prompt follows this structure, regardless of the target coding agent:

```
## Task: {task.title}

### Context
{One or two sentences: what this task accomplishes and why, pulled from
the task's linked story}

### Relevant Schema
{Embedded fragment of db_schemas.entities for only the entities this task touches}

### Relevant API Contract
{Embedded fragment of api_contracts.endpoints for only the endpoints this task touches}

### Acceptance Criteria
{Given/When/Then criteria from the linked story, verbatim}

### Constraints
{Project-level tech stack / architecture constraints relevant to this task,
e.g. "Use Drizzle ORM against the schema above, not raw SQL"}

### Out of Scope for This Task
{Explicit boundary — what NOT to build in this task, derived from milestone
sequencing in Task Breakdown, to prevent an agent from over-building}
```

The "Out of Scope" section exists specifically because coding agents given an under-bounded prompt tend to over-scaffold (e.g., building auth when the task was "add a comment field") — this section is populated directly from the task's milestone/sequencing metadata (`12_Database_Design.md` `tasks.milestone`), not left to the agent's judgment.

## 16.3 Format Variants (FR-193)

| Format | Use case |
|---|---|
| **Markdown** | Default; copy-paste directly into a chat-based coding agent (Claude Code, Cursor chat) |
| **JSON** | Programmatic consumption — e.g., a script that batches multiple task prompts into a queue, or an MCP-based hand-off (below) |

Both are generated from the same underlying structured payload — never two independent generations — so they cannot drift from each other (same discipline as ERD/DDL in `12_Database_Design.md`).

## 16.4 MCP Integration Guidance

PARDI does not execute code itself (`06_Product_Requirements.md §6.5`), but its exported prompts and project context are designed to work naturally alongside MCP servers a user's coding agent may already have connected. This section documents when each common MCP integration is *relevant* to a PARDI-generated task, so users (and their coding agent) know which tool to reach for.

| MCP Server | When it's relevant to a PARDI-generated task |
|---|---|
| **Context7 MCP** | When a task's "Constraints" section names a specific library/framework version (from `20_Tech_Stack.md`) — the coding agent should pull current docs for that exact library rather than relying on training-data knowledge of it. |
| **GitHub MCP** | When a task is ready to be committed/PR'd — task metadata includes a suggested branch name and commit message stub derived from the task title, for the coding agent to use via GitHub MCP once the task is implemented. |
| **Filesystem MCP** | Default expectation for any task touching multiple files — PARDI's task breakdown deliberately scopes each task to a bounded set of files/components (per Architecture tagging) so a filesystem-aware agent can reason about blast radius correctly. |
| **PostgreSQL MCP** | Relevant specifically for schema-migration tasks (the first task in most milestones, per the dependency-ordering in `14_AI_Workflow.md` Stage 10) — the coding agent can validate the migration against a live database via this MCP rather than trusting the DDL blind. |
| **Playwright MCP** | Relevant for tasks whose acceptance criteria describe user-facing behavior (most frontend tasks) — the embedded Given/When/Then criteria are written in a form directly translatable into Playwright assertions, intentionally. |

> **Decision:** PARDI documents *when* each MCP is relevant rather than programmatically invoking any of them itself. Reasoning: which MCP servers a user has connected, and to which coding agent, is outside PARDI's control and varies per user setup — over-committing to orchestrating them from PARDI's own backend would reintroduce exactly the coding-agent-competition problem ruled out in `02_Product_Strategy.md §2.7`. PARDI's job is to make its output *legible* to whatever MCP-enabled agent the user already has, not to become that agent.

## 16.5 Prompt Consumption Patterns

1. **Copy-paste (primary v1 pattern):** User clicks "Copy" on a single task's prompt (`09_User_Flow.md §9.2.11`) and pastes into their coding agent's chat.
2. **Bundle export:** User exports a full milestone as a sequence of Markdown prompts (`13_API_Specification.md`, project export), for agents/workflows that accept a batch of instructions.
3. **Programmatic/MCP hand-off (future, Phase 2/3 per `27_Roadmap.md`):** JSON-format prompts consumed by a script or an MCP client that feeds them one at a time to a coding agent, checking task completion status back into PARDI via the API — this closes the loop PARDI currently leaves manual in v1, and is flagged here as a deliberate near-term extension point rather than an afterthought.

## 16.6 Quality Bar for Generated Prompts

A generated prompt is considered correct only if a competent engineer, reading only the prompt (no access to PARDI), could implement the task without needing to ask a clarifying question that the prompt could have answered. This is the practical, testable version of the "reduce correction cycles" wedge metric from `01_Executive_Summary.md`, and is the basis for the prompt-quality test suite in `24_Testing.md`.
