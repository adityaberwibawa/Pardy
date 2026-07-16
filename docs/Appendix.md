# Appendix

## A.1 Glossary

| Term | Definition |
|---|---|
| **Artifact** | Any versioned output of a pipeline stage (PRD, schema, API contract, task, prompt, etc.) — the fundamental unit of the dependency graph (`12_Database_Design.md`) |
| **Artifact version** | A single, immutable snapshot of an artifact; edits create new versions rather than mutating in place (FR-901) |
| **Staleness** | The state of a downstream artifact whose upstream dependency has changed since it was generated (`11_System_Architecture.md §11.6`) |
| **Dependency graph** | The parent/child relationships between artifact versions, enforced at the database level (`artifact_dependencies` table, NFR-150) |
| **Agent Router** | The orchestration layer that dispatches generation requests to the correct specialized agent(s) and enforces the dependency contract before doing so (`11_System_Architecture.md §11.4`) |
| **Reviewer Agent** | The automatic, checklist-driven cross-artifact consistency check run on every relevant stage transition (`15_Agent_Workflow.md`) |
| **AI Product Critic** | The on-demand, adversarial "is this actually a good decision" check, distinct from the Reviewer Agent (`15_Agent_Workflow.md §15.4`) |
| **Pipeline stage** | One node in the Idea → Deployment Checklist sequence (`06_Product_Requirements.md §6.3`) |
| **Wedge** | The specific, narrow pain point PARDI's GTM is anchored to — reducing correction cycles with a coding agent (`02_Product_Strategy.md §2.4`) |
| **SOM** | Serviceable Obtainable Market — the specific near-term target segment (solo/small-team builders), narrower than TAM/SAM (`03_Market_Research.md §3.1`) |
| **North Star Metric** | Correction-cycle reduction rate, PARDI's primary success measure (`28_KPI.md §28.1`) |

## A.2 Reference Index (Cross-Document Map)

| If you need... | Go to... |
|---|---|
| The overall product pitch and positioning | `01_Executive_Summary.md`, `02_Product_Strategy.md` |
| Who this is for | `05_User_Personas.md` |
| What's in scope for v1 | `06_Product_Requirements.md` |
| Exact feature behavior | `07_Functional_Requirements.md` |
| Performance/security/scale targets | `08_Non_Functional_Requirements.md` |
| Screen-level flow | `09_User_Flow.md` |
| How content is organized/navigated | `10_Information_Architecture.md` |
| System components and how they talk to each other | `11_System_Architecture.md` |
| The actual database schema | `12_Database_Design.md` |
| PARDI's own API | `13_API_Specification.md` |
| The AI reasoning process per stage | `14_AI_Workflow.md` |
| Which agent does what | `15_Agent_Workflow.md` |
| How output becomes a coding-agent prompt | `16_Prompt_Workflow.md` |
| Visual design principles | `17_UI_UX_Design_System.md` |
| Motion/animation specs | `18_Animation_Guidelines.md` |
| Exact color/type/spacing values | `19_Design_Tokens.md` |
| Stack choices and reasoning | `20_Tech_Stack.md` |
| Repo layout conventions | `21_Folder_Structure.md` |
| Threat model and security controls | `22_Security.md` |
| Performance budgets and caching | `23_Performance.md` |
| Testing strategy | `24_Testing.md` |
| Deployment process | `25_Deployment.md` |
| Pricing model | `26_Pricing.md` |
| Phased delivery plan | `27_Roadmap.md` |
| Success metrics | `28_KPI.md` |
| Key risks and mitigations | `29_Risk_Analysis.md` |
| The prompt to extend this repo | `30_Master_Prompt.md` |

## A.3 Decision Log

A running, dated log of major decisions and any subsequent reversals — maintained per the protocol in `30_Master_Prompt.md §30.3`. Entries below reflect decisions made during this repository's initial construction; future entries should be appended, never edited in place, consistent with the append-only discipline this repo asks of PARDI's own product data.

| Date | Decision | Location | Status |
|---|---|---|---|
| Initial | Position as "AI Product Architect," not "PRD generator" | `02_Product_Strategy.md §2.2` | Active |
| Initial | Scope v1 around one deep, trustworthy pipeline run rather than broad shallow feature coverage | `06_Product_Requirements.md §6.2` | Active |
| Initial | Dependency graph modeled as a join table (`artifact_dependencies`), not a single parent-pointer column | `12_Database_Design.md §12.3` | Active |
| Initial | Modular monolith architecture; only the AI orchestration layer is split out for independent scaling | `11_System_Architecture.md §11.1` | Active |
| Initial | Several specialized agent "roles" implemented as prompt personas within an owning agent rather than fully independent Router-dispatched agents at v1 | `15_Agent_Workflow.md §15.2` | Active — revisit per usage data |
| Initial | R3F/GSAP/Lenis scoped strictly to the marketing landing page, never the authenticated app | `18_Animation_Guidelines.md §18.6`, `20_Tech_Stack.md §20.1` | Active |
| Initial | Dark mode default | `17_UI_UX_Design_System.md §17.1` | Active |
| Initial | Free tier gated at PRD stage; Schema/API/Task/Prompt behind paid tiers | `26_Pricing.md §26.1` | Active |
| Initial | Template Marketplace deferred to Phase 3, gated on seed-content critical mass | `27_Roadmap.md §27.3` | Active |
| Initial | Manual (not fully automatic) promotion from staging to production | `25_Deployment.md §25.1` | Active |

## A.4 Assumptions Requiring Future Validation

Consolidated from callouts throughout the repo, so they aren't lost in individual file context:

- Market sizing figures in `03_Market_Research.md` are directional, not verified — replace with real waitlist/usage data per §3.4/§3.5 of that file.
- Pricing figures in `26_Pricing.md §26.2` are illustrative and should be tested against actual willingness-to-pay data.
- Load/scale assumptions in `23_Performance.md §23.5` (median project size, concurrency) are v1 planning estimates, explicitly flagged for monitoring rather than treated as fixed capacity planning inputs.

## A.5 Document Maintenance

This repository is a living set of documents. When usage data, user research, or product decisions supersede something written here, update the source file directly, log the change per §A.3, and verify cross-referencing files still read correctly — per the same non-staleness discipline this documentation describes for PARDI's own product.
