# 07 — Functional Requirements

This document expands each P0/P1 feature from `06_Product_Requirements.md §6.4` into concrete functional behavior. Requirement IDs (`FR-xxx`) are referenced from `24_Testing.md` and `15_Agent_Workflow.md`.

## 7.1 AI Interview (FR-100 series)

| ID | Requirement |
|---|---|
| FR-101 | System MUST begin every new project with a structured interview, not a free-text-only box. Minimum captured fields: problem statement, target user, core value proposition, known constraints (budget/timeline/team size). |
| FR-102 | System MUST ask follow-up clarifying questions when a user's answer is vague or contradicts an earlier answer (e.g., "consumer app" + "B2B pricing" flagged for clarification). |
| FR-103 | System MUST allow the user to skip a question and mark it "decide later" without blocking pipeline progress, but downstream artifacts referencing that gap MUST show a visible "assumption" flag (ties to Version History, FR-900 series). |
| FR-104 | Interview output MUST be stored as a structured object (not raw chat transcript) that later stages consume programmatically — see `12_Database_Design.md` `projects.interview_data`. |

## 7.2 Idea Validation (FR-110 series)

| ID | Requirement |
|---|---|
| FR-111 | System MUST produce a feasibility assessment scoring: technical feasibility, market signal strength (labeled directional per `03_Market_Research.md`), and scope realism against stated constraints. |
| FR-112 | System MUST flag scope mismatches explicitly (e.g., "marketplace with real-time chat + payments + multi-currency" flagged as large-scope for a stated 4-week timeline) rather than silently proceeding. |
| FR-113 | Validation output MUST be editable/overridable by the user — the system advises, it does not block progress on its own judgment. |

## 7.3 Market Validation & Competitor Analysis (FR-120 series)

| ID | Requirement |
|---|---|
| FR-121 | System MUST clearly label any market-size or trend claim as directional/estimated unless sourced from a live web lookup performed during the session, consistent with `03_Market_Research.md`. |
| FR-122 | Competitor Analysis MUST accept user-supplied competitor names and MUST also attempt to surface competitors the user didn't list, with source attribution for any live-fetched claim. |
| FR-123 | Output MUST be structured as a comparison table (competitor × feature × pricing tier where determinable), not free prose. |

## 7.4 PRD Generator (FR-130 series)

| ID | Requirement |
|---|---|
| FR-131 | PRD MUST be generated only after AI Interview + Idea Validation are complete or explicitly skipped by the user — PRD generation cannot be the first pipeline action. |
| FR-132 | PRD MUST include, at minimum: problem statement, goals, scope (in/out), feature list with priority, personas reference, and success criteria. |
| FR-133 | Editing the PRD after downstream artifacts (BRD, stories, schema) exist MUST mark those downstream artifacts "stale" and surface a re-sync action — this is the core dependency-graph behavior from `06_Product_Requirements.md §6.3`. |

## 7.5 BRD Generator (FR-140 series)

| ID | Requirement |
|---|---|
| FR-141 | BRD MUST be distinct in content from the PRD — business justification, ROI framing, stakeholder impact — not a reformatted duplicate of PRD content. |
| FR-142 | BRD generation MUST reference the PRD's goals section directly (stored pointer, not copy-paste) so edits propagate the staleness flag described in FR-133. |

## 7.6 User Story & Acceptance Criteria Generator (FR-150 series)

| ID | Requirement |
|---|---|
| FR-151 | Every user story MUST follow `As a [persona], I want [capability], so that [outcome]` and MUST link to a specific persona defined in the project (from `05_User_Personas.md`-style persona objects, project-scoped). |
| FR-152 | Every user story MUST have at least one linked acceptance criterion before it can be marked "ready for architecture" — stories without criteria block progression to Database/API generation for that story specifically (not the whole project). |
| FR-153 | Acceptance criteria MUST default to Given/When/Then structure, editable to plain checklist if the user prefers. |

## 7.7 Database Designer & ERD Generator (FR-160 series)

| ID | Requirement |
|---|---|
| FR-161 | Schema MUST be derived by parsing entities and relationships implied by user stories and PRD scope — not generated independently of them. Each table/field MUST store which story/requirement justified it. |
| FR-162 | System MUST output both a machine-readable schema definition (SQL DDL or ORM schema, per `20_Tech_Stack.md`) and a Mermaid ER diagram generated from the same underlying model, so they cannot drift from each other. |
| FR-163 | System MUST flag normalization issues (e.g., repeating groups, missing foreign keys implied by a relationship in the stories) as review comments, not silently "fix" them without showing the user what changed. |

## 7.8 API Designer (FR-170 series)

| ID | Requirement |
|---|---|
| FR-171 | API contract MUST be derived from the schema (FR-161) and the user stories' described actions — each endpoint traceable to the entity/action that justifies it. |
| FR-172 | Every endpoint definition MUST include method, path, auth requirement, request shape, response shape, and error cases — partial endpoint specs are not permitted to progress to Task Breakdown. |
| FR-173 | System MUST version the API contract (`v1`, `v2`, ...) once it has been exported/consumed downstream at least once, to prevent silent breaking changes to already-generated task breakdowns. |

## 7.9 Architecture Generator & Tech Stack Recommendation (FR-180 series)

| ID | Requirement |
|---|---|
| FR-181 | System MUST produce a component/service diagram (Mermaid) reflecting the actual entities/endpoints generated, not a generic template diagram. |
| FR-182 | Tech stack recommendation MUST include explicit reasoning for each major choice and MUST flag when a user's stated constraint (e.g., "must run on-prem") conflicts with the default recommendation (`20_Tech_Stack.md` is the default; project-level constraints can override it). |

## 7.10 Task Breakdown & Prompt Generator (FR-190 series)

| ID | Requirement |
|---|---|
| FR-191 | Each task MUST map to exactly one architecture component and one or more API endpoints/schema entities — freeform tasks not traceable to an upstream artifact are not permitted in v1. |
| FR-192 | Generated coding prompts MUST embed the relevant schema fragment, API contract fragment, and acceptance criteria inline in the prompt text — not merely reference "see the PRD," since the destination is a coding agent operating outside PARDI's UI. |
| FR-193 | Prompt Generator output MUST be available in at least plain Markdown and structured JSON, to support both copy-paste workflows and programmatic MCP-based hand-off (`16_Prompt_Workflow.md`). |

## 7.11 Export System (FR-200 series)

| ID | Requirement |
|---|---|
| FR-201 | Every artifact type MUST be exportable individually and as a full-project bundle. |
| FR-202 | Exports MUST preserve the dependency metadata (which artifact was derived from which) in a machine-readable export format, not just human-readable Markdown. |

## 7.12 Version History (FR-900 series)

| ID | Requirement |
|---|---|
| FR-901 | Every artifact edit MUST create a new version, retaining prior versions, not overwrite in place. |
| FR-902 | System MUST visually indicate when an artifact is stale relative to an upstream change (see FR-133) until the user acknowledges or re-syncs it. |
| FR-903 | Users MUST be able to view a diff between two versions of the same artifact. |

## 7.13 AI Reviewer & AI Product Critic (FR-210 series)

| ID | Requirement |
|---|---|
| FR-211 | AI Reviewer MUST run automatically on stage transition (e.g., stories → architecture) and check cross-artifact consistency, not just grammar/style. |
| FR-212 | AI Product Critic MUST be invocable on-demand and MUST produce specific, falsifiable objections (e.g., "Story #12 implies a refund flow with no corresponding endpoint") rather than generic praise or vague concerns. |

## 7.14 Traceability Note

Every `FR-xxx` above must remain mapped to a specific persona job-to-be-done from `05_User_Personas.md §5.7` and a specific pipeline stage from `06_Product_Requirements.md §6.3`. A functional requirement that cannot be traced to either should be treated as scope creep and flagged for removal or deferral to `27_Roadmap.md`.
