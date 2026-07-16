# 08 — Non-Functional Requirements

Functional behavior is defined in `07_Functional_Requirements.md`. This document sets the quality bar those behaviors must be delivered at — performance, security, scalability, reliability, accessibility — with numeric targets wherever a target can be meaningfully stated. Detail implementations live in `22_Security.md`, `23_Performance.md`, `24_Testing.md`.

## 8.1 Performance

| ID | Requirement | Target |
|---|---|---|
| NFR-101 | Interactive UI actions (navigation, opening an artifact) | First Contentful Paint < 1.2s, Time to Interactive < 2.5s on a median connection (per `23_Performance.md` budget) |
| NFR-102 | AI generation latency — single-stage generation (e.g., PRD from interview data) | Streamed first token < 3s; full stage generation acceptable up to ~30–45s given multi-step reasoning, provided streaming keeps perceived latency low |
| NFR-103 | Cross-artifact consistency check (AI Reviewer, FR-211) | Must complete within the same request cycle as the stage transition that triggered it — must not silently defer and leave the user unaware a check is pending |
| NFR-104 | Database/API generation for a project of typical size (≤30 entities) | < 60s end-to-end, with incremental streaming of entities as they resolve rather than one blocking response |

> **Decision:** We accept multi-second latency for deep-reasoning stages (schema/API/task generation) rather than optimizing for sub-second responses at the cost of reasoning quality — this is the opposite trade-off a chat product would make, because PARDI's value proposition depends on correctness of derived artifacts, not conversational snappiness. Perceived latency is managed via streaming and progress indication (`18_Animation_Guidelines.md` skeleton/optimistic-UI patterns), not by cutting reasoning steps.

## 8.2 Reliability & Availability

| ID | Requirement |
|---|---|
| NFR-110 | Target 99.9% uptime for core CRUD/read operations (viewing existing artifacts) — this must not depend on AI provider availability. |
| NFR-111 | AI-generation endpoints MAY degrade independently of core app availability (e.g., if the AI provider is down, existing artifacts remain fully viewable/editable manually, only new generation is blocked) — see graceful degradation note in `11_System_Architecture.md`. |
| NFR-112 | No user-visible data loss on a failed generation: a failed AI call MUST NOT overwrite or corrupt the previous artifact version (ties to FR-901, Version History). |

## 8.3 Scalability

| ID | Requirement |
|---|---|
| NFR-120 | Architecture must support horizontal scaling of the AI-orchestration layer independently from the core CRUD API layer, since AI workload and request-volume workload scale differently (see `11_System_Architecture.md`). |
| NFR-121 | Database schema must support a project growing from a handful of entities at PRD stage to 50+ entities/endpoints by Task Breakdown stage without a schema redesign (see indexing/partitioning notes in `12_Database_Design.md`). |
| NFR-122 | Multi-tenant data isolation must scale to workspace-level sharding readiness even though v1 ships single-tenant-per-workspace (Phase 2 collaboration features in `27_Roadmap.md` assume this). |

## 8.4 Security

Full threat model in `22_Security.md`; the requirements below are the non-negotiable floor.

| ID | Requirement |
|---|---|
| NFR-130 | All artifact data MUST be encrypted at rest and in transit. |
| NFR-131 | Row-level access control MUST be enforced at the data layer (not only in application logic) for every project/workspace-scoped table. |
| NFR-132 | AI provider calls MUST NOT include data from a different user/workspace than the one initiating the request, even for shared model context or caching layers. |
| NFR-133 | Exported artifacts (FR-201) MUST NOT leak other users' or workspaces' data through shared templates or marketplace content unless explicitly published by the owning user. |

## 8.5 Accessibility

| ID | Requirement |
|---|---|
| NFR-140 | All core flows MUST meet WCAG 2.1 AA at minimum — this is a hard requirement, not aspirational, consistent with "Accessibility first" in the master engineering standards. |
| NFR-141 | All animations (`18_Animation_Guidelines.md`) MUST respect `prefers-reduced-motion` and MUST NOT be required to understand or operate any control. |
| NFR-142 | Generated diagrams (ERD, architecture, sequence) MUST have a text-equivalent representation available (the underlying Mermaid/structured data), not exist only as a rendered image. |

## 8.6 Data Integrity & Traceability (Product-Specific NFR)

This category exists because it's central to PARDI's differentiation (`02_Product_Strategy.md §2.3`), not a generic checklist item.

| ID | Requirement |
|---|---|
| NFR-150 | The upstream/downstream dependency pointer between any two artifacts MUST be enforced at the database level (foreign key or equivalent constraint), not just convention in application code — see `12_Database_Design.md`. |
| NFR-151 | It MUST NOT be possible for a downstream artifact to silently reference a deleted or since-replaced upstream artifact version without a visible broken-link/stale indicator. |

## 8.7 Internationalization

| ID | Requirement |
|---|---|
| NFR-160 | v1 UI and AI-generated content ship in English only (per Writing Requirements in the master prompt) — architecture should not hard-code English-only assumptions in a way that blocks future localization, but localization itself is out of scope for v1 (`06_Product_Requirements.md §6.5`). |

## 8.8 Maintainability

| ID | Requirement |
|---|---|
| NFR-170 | Codebase MUST follow the conventions in `21_Folder_Structure.md` and pass CI gates defined in `24_Testing.md` before merge — no exceptions for "quick fixes," since architectural drift is precisely the failure mode PARDI itself is built to prevent for its users. |
| NFR-171 | Every AI-agent prompt template (per `15_Agent_Workflow.md`) MUST be version-controlled alongside application code, not managed out-of-band in a dashboard with no history. |

## 8.9 Observability

| ID | Requirement |
|---|---|
| NFR-180 | Every AI generation call MUST be logged with: stage, input artifact version(s), output artifact version, latency, and success/failure — required both for debugging and for the KPI instrumentation in `28_KPI.md`. |
| NFR-181 | Failed cross-artifact consistency checks (FR-211) MUST be tracked as a first-class metric, since a rising failure rate is a direct signal of AI generation quality regression. |
