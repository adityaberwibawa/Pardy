# 13 — API Specification

Covers PARDI's own application API (the API a client/future integrations call to operate PARDI itself) — not to be confused with the API contracts PARDI *generates for users' projects* (that's the `API Designer` feature, specified behaviorally in `07_Functional_Requirements.md §7.8` and stored per `12_Database_Design.md`'s `api_contracts` table). This document specifies PARDI's own backend surface.

## 13.1 Conventions

- REST over Next.js Route Handlers for public/programmatic surface; Server Actions for internal UI-driven mutations (not separately documented here, since they aren't a stable public contract).
- Base path: `/api/v1/...` — versioned from day one per NFR/maintainability posture; a breaking change requires `/api/v2`, never an in-place breaking change to `v1`.
- Auth: Bearer token (Supabase-issued JWT) on every request; workspace/project scoping enforced both by RLS (`12_Database_Design.md §12.6`) and by an application-level authorization check before any handler logic runs.
- All list endpoints paginated (`?cursor=`, `?limit=`, default 25, max 100).
- Errors follow a single shape:

```json
{
  "error": {
    "code": "ARTIFACT_STALE_DEPENDENCY",
    "message": "Cannot generate API contract: schema is stale relative to current stories.",
    "details": { "artifact_version_id": "..." }
  }
}
```

## 13.2 Resource Overview

| Resource | Base path | Maps to |
|---|---|---|
| Workspaces | `/api/v1/workspaces` | `workspaces`, `workspace_members` |
| Projects | `/api/v1/projects` | `projects` |
| Interview | `/api/v1/projects/:id/interview` | `projects.interview_data` |
| Validation | `/api/v1/projects/:id/validation` | `artifact_versions` (`type=validation`) |
| PRD | `/api/v1/projects/:id/prd` | `artifact_versions` + `prds` |
| BRD | `/api/v1/projects/:id/brd` | `artifact_versions` + `brds` |
| Stories | `/api/v1/projects/:id/stories` | `artifact_versions` + `user_stories` + `acceptance_criteria` |
| Architecture | `/api/v1/projects/:id/architecture` | `artifact_versions` |
| Database Design | `/api/v1/projects/:id/database` | `artifact_versions` + `db_schemas` |
| API Design | `/api/v1/projects/:id/api-design` | `artifact_versions` + `api_contracts` |
| Tasks | `/api/v1/projects/:id/tasks` | `artifact_versions` + `tasks` |
| Prompts | `/api/v1/tasks/:id/prompts` | `artifact_versions` + `prompts` |
| Exports | `/api/v1/projects/:id/export` | Read-only, composed from above |
| Comments | `/api/v1/artifacts/:versionId/comments` | `comments` |

## 13.3 Core Endpoints (Representative Detail)

### `POST /api/v1/projects`
Creates a project inside a workspace. Body: `{ workspaceId, name }`. Returns the new `project` with `status: "interview_pending"`.

### `PATCH /api/v1/projects/:id/interview`
Upserts structured interview fields (FR-101–104). Body is a partial `interview_data` object; unspecified fields are left untouched (supports the incremental, skippable nature of FR-103). Returns updated `interview_data` plus a `completeness` object flagging which fields are still unanswered.

### `POST /api/v1/projects/:id/validation`
Triggers Idea Validation generation (FR-111). Requires `interview_data` completeness above a minimum threshold or an explicit `{ force: true }` override, mirroring the "advise, don't block" posture of FR-113. Returns the validation artifact version, streamed via Server-Sent Events if the client requests `Accept: text/event-stream`.

### `POST /api/v1/projects/:id/prd`
Generates or regenerates the PRD. Body: `{ scope: "full" | "section", sectionId? }` — supports the scoped-section regeneration UX from `09_User_Flow.md §9.2.4`. Returns the new `artifact_versions` row plus `prds.sections`. **Side effect:** if this is a regeneration of an existing PRD, triggers the staleness-scan described in `11_System_Architecture.md §11.6` and includes `{ staleDownstream: [...] }` in the response so the client can render the banner immediately without a separate round-trip.

### `POST /api/v1/projects/:id/stories/:storyId/status`
Body: `{ status: "ready" }`. Server-side enforces FR-152 (rejects with `422 MISSING_ACCEPTANCE_CRITERIA` if no criteria exist) — this is the API-level twin of the DB constraint trigger in `12_Database_Design.md §12.3`.

### `POST /api/v1/projects/:id/database`
Requires all referenced stories to have `status: "ready"` (enforces the dependency contract at the API layer before ever reaching the Agent Router — see `11_System_Architecture.md §11.4` point 1). Returns schema + ERD-source JSONB (FR-162); `raw_ddl` included in the same payload, never fetched separately, so client code cannot present a schema and DDL that came from different generation calls.

### `POST /api/v1/projects/:id/api-design`
Requires current, non-stale `db_schemas` artifact. Returns endpoint list (FR-172 shape) plus `spec_version`.

### `POST /api/v1/tasks/:id/prompts`
Body: `{ format: "markdown" | "json" }`. Returns a self-contained prompt (FR-192) — the response embeds the relevant schema fragment, endpoint fragment, and acceptance criteria inline, not by reference, since the destination context (an external coding agent) cannot resolve PARDI-internal links.

### `GET /api/v1/projects/:id/export?format=bundle`
Returns the full project bundle including `artifact_dependencies` metadata (FR-202) in a structured export format (`application/vnd.pardi.export+json`), suitable for round-tripping or for MCP-based programmatic hand-off (`16_Prompt_Workflow.md`).

## 13.4 Streaming Convention

Any endpoint that triggers a generation stage (interview→validation→PRD→…→prompts) supports `Accept: text/event-stream` and streams partial output as it resolves (NFR-102/104). Event types:

| Event | Payload |
|---|---|
| `progress` | `{ step: string, percent?: number }` — coarse status, e.g. "Drafting entities…" |
| `partial` | Incremental structured fragment of the artifact being generated |
| `review_flag` | A flag raised by the Reviewer Agent mid-stream (FR-211), can arrive before `complete` |
| `complete` | Final artifact version, same shape as the non-streaming response |
| `error` | Error shape from §13.1, guarantees no partial artifact is persisted (NFR-112) |

## 13.5 Rate Limiting & Quotas

Generation endpoints are metered against the workspace's plan tier (`26_Pricing.md`), returned via standard `X-RateLimit-*` headers plus a PARDI-specific `X-Pardi-Generation-Quota-Remaining` header, since generation quota (distinct from raw request rate) is the actual billing-relevant resource.

## 13.6 Cross-References

- Auth/permission enforcement detail → `22_Security.md`
- Underlying orchestration these endpoints trigger → `11_System_Architecture.md §11.4–11.5`
- Consumers of the export format → `16_Prompt_Workflow.md`
