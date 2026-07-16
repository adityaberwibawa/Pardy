# 20 — Tech Stack

This is PARDI's own recommended/adopted stack — a real-world application of the "Tech Stack Recommendation" feature (FR-182) PARDI offers its users, applied reflexively to itself. Every choice below states its reasoning and its rejected alternative, per the Writing Requirements in the master prompt.

## 20.1 Frontend

| Choice | Reasoning | Rejected alternative |
|---|---|---|
| **Next.js (App Router)** | Server Components fit PARDI's data-heavy, streaming-generation UI well (`08_Non_Functional_Requirements.md §8.1`); one framework covers routing, SSR, and API route handlers, reducing operational surface for a small team | A separate SPA (Vite/React) + standalone API — rejected because it doubles deployment/auth complexity for no benefit at this team size |
| **React + TypeScript** | Strict typing is non-negotiable given the product's own thesis (spec precision) — using an untyped stack would be a credibility contradiction | Plain JS — rejected outright per "Strict TypeScript" engineering standard |
| **Tailwind CSS** | Fast to enforce the token discipline in `19_Design_Tokens.md` via `theme.extend`; avoids hand-rolled CSS drift | CSS-in-JS (styled-components/emotion) — rejected for runtime cost and weaker static analyzability of token usage |
| **shadcn/ui** | Unstyled-by-default primitives (Radix under the hood) give accessibility (NFR-140) for free while remaining fully themeable via our own tokens, not fighting a pre-baked visual identity | A heavier pre-styled kit (MUI, Chakra) — rejected because their default visual language actively works against the Linear/Stripe-influenced identity in `17_UI_UX_Design_System.md` |
| **Framer Motion** | Declarative, React-idiomatic API for the micro-interaction and streaming-reveal specs in `18_Animation_Guidelines.md` | Raw CSS transitions only — insufficient for the orchestrated multi-element streaming reveals required |
| **React Three Fiber + GSAP** | Scoped only to the marketing landing page (`18_Animation_Guidelines.md §18.6`) — never imported into the authenticated app bundle | N/A — these are additive, isolated tools, not competing with the above |
| **Lenis** | Smooth-scroll for the marketing site's scroll-triggered reveals; isolated to the same landing-page bundle as R3F/GSAP | N/A |

> **Decision:** React Three Fiber, GSAP, and Lenis are explicitly **not** dependencies of the authenticated product — they are marketing-site-only. This is called out again here (having already been established in `18_Animation_Guidelines.md`) because it is a build/bundling decision, not just a design decision, and belongs in the stack rationale so a future engineer doesn't casually import GSAP into a product screen.

## 20.2 Backend

| Choice | Reasoning | Rejected alternative |
|---|---|---|
| **Next.js Server Actions / Route Handlers** | Keeps the modular monolith (`11_System_Architecture.md §11.1`) genuinely unified — one deploy target, one type-sharing boundary between client and server | A separate Express/Fastify backend — rejected as unnecessary operational split at current team size and traffic profile |
| **Supabase (PostgreSQL + Auth)** | Managed Postgres with built-in RLS (directly required by NFR-131) and auth, reduces infra ops for a small team while keeping a real, portable Postgres underneath (not a proprietary DB) | Firebase/Firestore — rejected because its document model fights the relational, foreign-key-enforced dependency graph central to `12_Database_Design.md` |
| **PostgreSQL** | Required by the relational, constraint-enforced dependency-graph design (NFR-150) — foreign keys and triggers are load-bearing, not optional | Any NoSQL store — rejected for the same relational-integrity reason above |
| **Redis** | Queue for long-running generation jobs (NFR-102/104) and cache for cheap repeated reads; well-understood ops profile | In-Postgres queueing (e.g., `pgmq`) — viable but rejected for v1 to keep queue and cache concerns on infrastructure purpose-built for them, revisit if ops overhead of a second managed service proves not worth it |
| **Drizzle ORM** | Type-safe, SQL-close (avoids the "ORM hides what's actually happening" risk when the schema itself is a first-class, user-facing product concept) | Prisma — a reasonable alternative, but Drizzle's closer-to-SQL model was preferred given how directly `12_Database_Design.md`'s JSONB-to-DDL derivation needs to reason about actual SQL shape |

## 20.3 AI

| Choice | Reasoning | Rejected alternative |
|---|---|---|
| **OpenRouter** | Model-provider abstraction lets the Agent Router (`11_System_Architecture.md §11.4`) swap/route models per agent without rearchitecting — important since different agents (e.g., Prompt Engineer Agent's low-creativity assembly vs. Software Architect Agent's structural reasoning) may warrant different models over time | Direct single-provider SDK integration — rejected as it locks stage-level model choice prematurely |
| **Vercel AI SDK** | First-class streaming primitives match the streaming/progressive-reveal requirements throughout `13_API_Specification.md §13.4` and `18_Animation_Guidelines.md §18.4` | Hand-rolled SSE handling — unnecessary reinvention given the SDK already solves this well |
| **Embeddings + Vector DB** | Powers template-marketplace search and retrieval-augmented context for large projects (avoiding re-sending full project history per generation call, per `11_System_Architecture.md` component table) | Skipping vector search entirely — viable for a very early v1, but the retrieval-context use case (not just marketplace search) makes this worth having from early on rather than retrofitting |

## 20.4 Deployment

| Choice | Reasoning | Rejected alternative |
|---|---|---|
| **Vercel** | Native Next.js deployment target, handles Server Actions/Route Handlers and edge caching with minimal config, matches the team's operational capacity | Self-hosted Node on raw cloud VMs — rejected as unnecessary ops burden pre-scale |
| **Docker** | Used specifically for long-running worker processes (queue consumers) that don't fit serverless function time limits (`11_System_Architecture.md §11.7`) | Running workers as long-lived serverless functions — rejected due to timeout constraints on genuinely long generation/queue-processing jobs |
| **Cloudflare** | CDN/edge cache in front of static assets, plus DNS/WAF | A Vercel-only edge setup — viable, but Cloudflare's WAF/DNS layer is kept as a separate, portable layer so the deployment target (Vercel) isn't a single point of platform lock-in |
| **GitHub Actions** | CI/CD gate before every deploy (`24_Testing.md`, `25_Deployment.md`), tightly integrated with the GitHub-hosted repo and the GitHub MCP hand-off pattern noted in `16_Prompt_Workflow.md` | A separate CI provider (CircleCI, etc.) — no meaningful advantage given GitHub is already the source-control home |

## 20.5 Stack-Level Decision Record Summary

The single thread running through every choice above: **favor tools that keep the relational, constraint-enforced, streaming-capable nature of the product intact**, and split out only the pieces (AI orchestration, queueing) that genuinely have different scaling/failure characteristics from the core CRUD app (`11_System_Architecture.md §11.1`'s modular-monolith rationale). Nothing here is chosen for novelty; each choice is checked against a requirement already established elsewhere in this repo, cross-referenced above rather than restated.
