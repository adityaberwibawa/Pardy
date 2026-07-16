# 21 — Folder Structure

Implements the stack chosen in `20_Tech_Stack.md` as a concrete repository layout, and enforces the engineering standards (SOLID, Clean Architecture, Server Components first) from the master engineering standards.

## 21.1 Top-Level Layout

```
pardi/
├── apps/
│   └── web/                      # Next.js app (client + server)
│       ├── app/                  # App Router — routes, layouts, Server Components
│       ├── components/           # Shared UI components (see 21.3)
│       ├── lib/                  # App-level utilities, non-domain
│       └── middleware.ts         # Auth/session middleware
├── packages/
│   ├── domain/                   # Framework-agnostic domain logic (Clean Architecture core)
│   │   ├── artifacts/            # Artifact types, dependency-graph logic (12_Database_Design.md)
│   │   ├── pipeline/             # Stage sequencing rules (14_AI_Workflow.md)
│   │   └── permissions/          # Role/permission rules (10_Information_Architecture.md §10.4)
│   ├── agents/                   # Agent Router + individual agent implementations (15_Agent_Workflow.md)
│   │   ├── router/
│   │   ├── pm-agent/
│   │   ├── architect-agent/
│   │   ├── db-agent/
│   │   ├── backend-agent/
│   │   ├── reviewer-agent/
│   │   └── prompt-agent/
│   ├── db/                       # Drizzle schema + migrations (12_Database_Design.md)
│   ├── ui/                       # Design-system primitives (17/19_*.md) — shadcn/ui wrappers, tokens
│   └── config/                   # Shared TS/ESLint/Tailwind config
├── infra/
│   ├── docker/                   # Worker Dockerfiles (11_System_Architecture.md §11.7)
│   └── github-actions/           # CI/CD workflows (24/25_*.md)
└── docs/                         # This documentation repository
```

> **Decision:** Domain logic (`packages/domain`) and agent implementations (`packages/agents`) are separate packages from the Next.js app (`apps/web`), even though there's currently only one app consuming them. Reasoning: this is the concrete expression of Clean Architecture for this codebase — the dependency-graph rules and agent contracts must not import Next.js-specific types, which keeps them testable in isolation (`24_Testing.md`) and keeps the door open to a future non-web consumer (e.g., a CLI or MCP-native client) without a rewrite.

## 21.2 `apps/web/app` Routing Structure (App Router)

```
app/
├── (marketing)/                  # Public landing site — isolated route group
│   └── page.tsx                  # Hero, R3F/GSAP scoped only here (18_Animation_Guidelines.md §18.6)
├── (auth)/
│   ├── sign-in/
│   └── sign-up/
├── (app)/                        # Authenticated product — separate route group, separate layout
│   ├── layout.tsx                # Command palette, nav shell (17_UI_UX_Design_System.md)
│   ├── w/[workspaceId]/
│   │   ├── page.tsx               # Workspace: project list
│   │   └── p/[projectId]/
│   │       ├── page.tsx           # Project Overview (10_Information_Architecture.md §10.2)
│   │       ├── interview/
│   │       ├── validation/
│   │       ├── prd/
│   │       ├── brd/
│   │       ├── stories/
│   │       ├── architecture/
│   │       ├── database/
│   │       ├── api-design/
│   │       ├── tasks/
│   │       └── settings/
└── api/
    └── v1/                       # Route Handlers implementing 13_API_Specification.md
```

Route grouping (`(marketing)` vs `(app)`) is what physically enforces the bundle-isolation decision in `18_Animation_Guidelines.md §18.6` and `20_Tech_Stack.md §20.1` — R3F/GSAP/Lenis dependencies are only ever imported inside `(marketing)`, checked via a bundle-analyzer CI step (`24_Testing.md`).

## 21.3 Component Architecture

```
components/
├── ui/                # Design-system primitives (button, badge, card) — thin wrappers over packages/ui
├── artifacts/          # Artifact-type-specific display components (PrdView, SchemaView, ApiContractView...)
│   ├── shared/          # Dual-view toggle, staleness banner, review-comment thread — 17_UI_UX_Design_System.md §17.5 patterns, built once
│   └── ...
├── pipeline/            # Overview map, stage navigation
└── kanban/              # Shared Kanban primitive used by both Stories and Tasks screens
```

> **Decision:** The dual-view toggle, staleness banner, and review-comment thread (`17_UI_UX_Design_System.md §17.5`) are built as single shared components under `artifacts/shared/`, parameterized per artifact type, rather than reimplemented per screen. This is what makes "same pattern, same position, everywhere" (the design system's core enforceable promise) actually true in code rather than aspirational in a Figma file.

## 21.4 Naming Conventions

| Item | Convention | Example |
|---|---|---|
| React components | PascalCase, one component per file | `SchemaView.tsx` |
| Hooks | `use` + camelCase | `useArtifactStaleness.ts` |
| Server Actions | camelCase verb-first | `generateDatabaseSchema.ts` |
| Domain types | PascalCase, suffixed by kind | `ArtifactVersion`, `StoryStatus` (enum) |
| DB tables/columns | snake_case (Postgres convention) | `artifact_versions`, `is_stale` |
| Route segments | kebab-case | `api-design/` |
| Agent packages | kebab-case, `-agent` suffix | `db-agent/`, `reviewer-agent/` |

## 21.5 Server Components First

> **Decision:** Every screen defaults to a Server Component; a component is only marked `"use client"` when it genuinely needs interactivity (drag-and-drop, live streaming updates, command palette) — never by default "to be safe." This is enforced via an ESLint rule flagging `"use client"` directives for review in PRs, since unnecessary client components directly work against the NFR-101 performance budget (`08_Non_Functional_Requirements.md`).

## 21.6 Testing Layout

Mirrors source structure (`packages/domain/artifacts/__tests__/`, etc.) rather than a separate top-level `tests/` tree — keeps unit tests physically adjacent to the logic they cover, particularly important for `packages/agents`, where prompt/output-contract regression tests (`24_Testing.md`) need to stay in lockstep with agent prompt changes in the same PR.

## 21.7 Cross-References

- CI enforcement of these conventions → `24_Testing.md`
- Deployment of `infra/docker` workers → `25_Deployment.md`
- Domain logic this structure isolates → `11_System_Architecture.md`, `12_Database_Design.md`
