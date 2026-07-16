# PARDI — AI Product Architect

> **PARDI** turns a raw idea into a complete, implementation-ready software blueprint — validated, specified, architected, and translated into prompts an AI coding agent can execute without guessing.

This repository is the single source of truth for PARDI's product, design, and engineering decisions. It is written so that a product manager, a software architect, a designer, and an AI coding agent (Claude Code, Cursor, Windsurf, v0, Bolt, etc.) can each pick it up and build against it without needing a meeting to fill in gaps.

---

## 1. Why PARDI Exists

AI coding tools solved *typing* code. They did not solve *deciding what to build*. The bottleneck moved upstream: most developers still start prompting an AI coding agent with a one-paragraph idea, get a plausible-looking app, and then spend weeks discovering the schema is wrong, the auth model doesn't match the use case, or the API contract contradicts itself between screens.

PARDI's bet: **the scarce resource is no longer code generation — it's specification quality.** A coding agent given a precise PRD, ERD, API contract, and task breakdown will outperform the same agent given a vague idea, regardless of how good the underlying model is. PARDI exists to produce that precise specification, and to do it faster and more rigorously than a solo founder or a small team could do by hand.

This is why PARDI is positioned as an **AI Product Architect**, not a "PRD generator with AI features." A generator produces a document. An architect makes decisions, defends them, and hands off something buildable.

## 2. What PARDI Produces

PARDI walks a user through a fixed pipeline, and every stage produces a durable artifact — not just conversational output:

```
Idea → Validation → PRD → BRD → User Stories → System Design
     → Database Design → API Design → Task Breakdown
     → Coding Prompts → Deployment Checklist
```

Each artifact is versioned, exportable, and consumed as input by the next stage. Nothing is thrown away after the chat scrolls past it — this is the core difference from asking a general chatbot the same questions.

## 3. Who This Is For

| Tier | Users | Primary Job-to-be-Done |
|---|---|---|
| Primary | Software engineers, full-stack devs, indie hackers, startup founders, technical PMs | "Turn my idea into something an AI coding agent can build correctly on the first pass." |
| Secondary | Student developers, agencies, freelancers, product designers | "Produce client-ready or portfolio-ready specs without a dedicated PM." |

Full persona detail lives in `05_User_Personas.md`.

## 4. How to Read This Repository

The documents are ordered to match the actual product build sequence — strategy first, then requirements, then architecture, then execution detail. You don't have to read linearly, but if you're onboarding as a new contributor, this is the intended order:

| # | File | Purpose |
|---|---|---|
| 01 | `01_Executive_Summary.md` | One-page framing: problem, solution, wedge, why now |
| 02 | `02_Product_Strategy.md` | Positioning, philosophy, differentiation, moat |
| 03 | `03_Market_Research.md` | Market size, trends, buyer behavior |
| 04 | `04_Competitor_Analysis.md` | Direct/indirect competitors, gap analysis |
| 05 | `05_User_Personas.md` | Primary/secondary personas, jobs-to-be-done |
| 06 | `06_Product_Requirements.md` | The core PRD: scope, features, priorities |
| 07 | `07_Functional_Requirements.md` | Feature-by-feature functional spec |
| 08 | `08_Non_Functional_Requirements.md` | Performance, security, scalability targets |
| 09 | `09_User_Flow.md` | End-to-end flows, screen-by-screen |
| 10 | `10_Information_Architecture.md` | Navigation, entity relationships at product level |
| 11 | `11_System_Architecture.md` | Services, boundaries, data flow, diagrams |
| 12 | `12_Database_Design.md` | Full schema, ERD, indexing, migration strategy |
| 13 | `13_API_Specification.md` | Endpoints, contracts, auth, versioning |
| 14 | `14_AI_Workflow.md` | The AI pipeline stage-by-stage |
| 15 | `15_Agent_Workflow.md` | Multi-agent system: roles, I/O, protocols |
| 16 | `16_Prompt_Workflow.md` | How specs become coding-agent-ready prompts |
| 17 | `17_UI_UX_Design_System.md` | Design principles, components, patterns |
| 18 | `18_Animation_Guidelines.md` | Motion system, timing, easing, performance budget |
| 19 | `19_Design_Tokens.md` | Color, type, spacing, elevation tokens |
| 20 | `20_Tech_Stack.md` | Stack choices with reasoning and trade-offs |
| 21 | `21_Folder_Structure.md` | Repo layout, module boundaries, conventions |
| 22 | `22_Security.md` | Threat model, auth, data protection |
| 23 | `23_Performance.md` | Budgets, caching strategy, monitoring |
| 24 | `24_Testing.md` | Test pyramid, coverage targets, CI gates |
| 25 | `25_Deployment.md` | Environments, CI/CD, rollback strategy |
| 26 | `26_Pricing.md` | Tiers, packaging, billing model |
| 27 | `27_Roadmap.md` | Phased delivery plan |
| 28 | `28_KPI.md` | North star metric, leading/lagging indicators |
| 29 | `29_Risk_Analysis.md` | Key risks and mitigations |
| 30 | `30_Master_Prompt.md` | The canonical prompt used to regenerate/extend this repo |
| — | `Appendix.md` | Glossary, references, decision log |

Each file is self-contained: it can be handed to a single contributor or a single AI agent without requiring the rest of the repo as context, though cross-references are included where a decision in one file constrains another.

## 5. Conventions Used Throughout

- **Mermaid diagrams** for architecture, sequence, and ER diagrams — kept in-repo as text so they diff cleanly in git.
- **Decision records** (`> Decision:` callouts) wherever a non-obvious choice was made, with the reasoning and the alternative considered.
- **Tables over prose** for anything enumerable (endpoints, fields, requirements) so they can be scanned or parsed programmatically.
- **No filler.** If a section would otherwise restate the obvious, it's cut. Every paragraph should change what the reader does next.

## 6. Status

This repository is being built incrementally, one document at a time, in the order listed above. Each file is reviewed for depth and consistency with prior files before the next one is started, rather than generating all 30+ files in a single pass — this keeps reasoning sharp and avoids generic filler creeping in at scale.

**Next up:** `01_Executive_Summary.md`
