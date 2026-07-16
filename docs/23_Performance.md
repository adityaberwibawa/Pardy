# 23 — Performance

Expands the performance NFRs (`08_Non_Functional_Requirements.md §8.1`) into concrete budgets, caching strategy, and monitoring approach.

## 23.1 Performance Budgets

| Surface | Metric | Budget |
|---|---|---|
| Marketing landing page | LCP | < 2.0s (mobile, throttled 4G) — despite the R3F/GSAP hero, achieved via code-splitting and lazy-loading those assets (`18_Animation_Guidelines.md §18.6`, `20_Tech_Stack.md §20.1`) |
| Authenticated app shell | FCP / TTI | < 1.2s / < 2.5s (NFR-101) |
| Artifact screen navigation (e.g., Stories → Architecture) | Perceived transition | < 300ms to first meaningful paint of the new screen, using Next.js prefetching + Server Component streaming |
| Single-stage AI generation (PRD, Validation) | First streamed token | < 3s (NFR-102) |
| Multi-entity generation (Schema, API, Task Breakdown, ≤30 entities) | End-to-end completion | < 60s, with incremental streaming throughout (NFR-104) — never a single 60s blocking spinner |
| Command palette open → usable | Input latency | < 50ms — this is a Raycast-influenced power-user surface (`17_UI_UX_Design_System.md §17.5`) and any perceptible lag undermines its entire premise |

## 23.2 Caching Strategy

| Layer | What's cached | Invalidation trigger |
|---|---|---|
| CDN (Cloudflare) | Static assets, marketing page | Standard cache-busting via build hash |
| Next.js Server Component cache | Read-only artifact views not currently streaming | Invalidated on any write to the underlying artifact (new version inserted) — never served stale by more than one request cycle |
| Redis | Cheap, repeated reads (e.g., project Overview pipeline-status aggregation) | Invalidated on any `artifact_versions` insert or staleness-scan update (`11_System_Architecture.md §11.6`) for that project |
| Redis (generation queue) | In-flight/queued generation jobs, not a read cache | Consumed and removed on job completion |
| Vector DB | Embeddings for marketplace search / retrieval context | Re-embedded on template publish or significant project update; not a correctness-critical cache (search relevance degrades gracefully, never blocks core functionality) |

> **Decision:** Nothing in the caching layer is allowed to serve stale *artifact content* to a user, even briefly, though it may serve stale *aggregate/derived* data (like a marketplace search ranking) briefly. Reasoning: the product's entire credibility rests on artifact correctness and the staleness system (`11_System_Architecture.md §11.6`) — a cache bug that shows a user an old schema version as if current would be a direct violation of the product's core promise, categorically worse than a slightly stale search ranking.

## 23.3 Database Performance

- Indexing strategy defined in `12_Database_Design.md §12.4`; reviewed against actual query patterns in `24_Testing.md` load tests before any index is removed or added in production.
- Read-heavy paths (Project Overview, artifact list views) use targeted composite indexes rather than relying on ORM-generated queries unexamined — Drizzle's SQL-proximity (`20_Tech_Stack.md §20.2`) is specifically chosen to make this review tractable.
- Connection pooling via Supabase's built-in pooler (PgBouncer) to handle serverless function connection churn without exhausting Postgres connection limits — a common failure mode for serverless-Postgres architectures that is addressed explicitly rather than discovered under load.

## 23.4 AI Generation Performance

- Long-running, multi-entity generations (Schema, API, Tasks) run through the Redis-backed queue (`11_System_Architecture.md §11.2`) rather than a single long-lived HTTP request, avoiding serverless function timeout limits and allowing the client to reconnect to a stream if a connection drops mid-generation without losing progress.
- Streaming granularity (per-entity, per-endpoint, per-section — `14_AI_Workflow.md`, `18_Animation_Guidelines.md §18.4`) is itself a performance-perception decision, not just a UX one: it converts one large latency budget into many small, individually-fast-feeling increments.

## 23.5 Scalability Load Assumptions (v1)

| Assumption | Basis |
|---|---|
| Median project size: 10–20 entities, 20–40 endpoints, 30–60 tasks | Derived from the persona/job-to-be-done scope in `05_User_Personas.md` (solo builders, small teams — not enterprise-scale systems) |
| Concurrent generation jobs per workspace: low (1–2 typical) | Single-user or small-team usage pattern; queue is sized for burst tolerance, not sustained high concurrency, at v1 |
| Read:write ratio on artifacts: heavily read-skewed after initial generation | Users generate once, then read/reference/export repeatedly — caching strategy (§23.2) is optimized accordingly |

These assumptions are explicitly flagged as **assumptions to monitor**, not guarantees — `28_KPI.md` and NFR-180 observability requirements exist specifically so real usage data can correct them before they become a scaling incident rather than after.

## 23.6 Monitoring

- Every AI generation call logged with latency, stage, and success/failure (NFR-180) — aggregated into per-stage p50/p95/p99 latency dashboards, since a single average would hide the exact failure mode (a slow p99 on Schema generation) that most damages user trust.
- Core Web Vitals tracked in production for the authenticated app shell, separately from the marketing site, since their performance budgets and acceptable trade-offs differ (§23.1).
- Database query performance monitored via Supabase's built-in query insights, with alerting on any query exceeding an agreed threshold relative to its expected index-backed cost.

## 23.7 Cross-References

- Underlying budget source → `08_Non_Functional_Requirements.md §8.1`
- Streaming/animation expression of these budgets → `18_Animation_Guidelines.md §18.4`
- Load-test methodology validating these budgets → `24_Testing.md`
