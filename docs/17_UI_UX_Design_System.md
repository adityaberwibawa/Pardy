# 17 — UI/UX Design System

## 17.1 Design Philosophy

**Calm, opinionated, and dense with information without feeling cluttered.** PARDI's UI has to hold genuinely complex, interlinked content (schemas, API contracts, dependency graphs) and present it the way Linear presents issues or Stripe presents API docs — structured enough to trust, restrained enough not to overwhelm.

Reference points and what PARDI borrows from each, specifically:

| Reference | What PARDI borrows |
|---|---|
| **Linear** | Keyboard-first navigation, instant perceived responsiveness, restrained color usage reserved for status/priority signaling |
| **Stripe** | Documentation-grade information density — tables, code blocks, and structured data treated as first-class UI, not an afterthought bolted onto a marketing-style layout |
| **Vercel** | Dark-mode-first visual language, monospace accents for technical content (schema fields, endpoint paths) |
| **Raycast** | Command-palette-style quick actions for power users (jump to any artifact, trigger regeneration, without deep menu navigation) |
| **Arc Browser** | Playful micro-delight in low-stakes moments (empty states, onboarding) contrasted against seriousness in high-stakes moments (schema review, staleness warnings) |
| **Notion** | Flexible block-like presentation for PRD/BRD sections, so editing feels like editing a document, not filling out a form |
| **Apple** | Restraint — motion and visual flourish are earned, never default; clarity always wins over cleverness |
| **OpenAI** | Typographic confidence — generous whitespace, a single strong type voice, technical content never apologized for with excessive hand-holding UI chrome |

> **Decision:** Dark mode is the default, not an option users must discover (per the master engineering standard "Dark Mode by default"). Reasoning: the primary usage context (a developer working alongside a coding agent's terminal/IDE) is already dark-mode-dominant; matching that reduces context-switching eye strain and reinforces the "this is a tool for builders" positioning over "this is a business PM tool."

## 17.2 Core Design Principles

1. **Every complex artifact gets a dual view (visual + raw/structured).** Established already at the feature level (`09_User_Flow.md §9.2.8`, ERD ↔ schema toggle) — this is a system-wide pattern, not a one-off. Any artifact with a visual and a structured representation (diagrams, schemas) gets the same toggle affordance in the same position across screens.
2. **Status is a color, never a paragraph.** Stale, ready, draft, complete — always a small, consistent badge/dot vocabulary (`§17.4`), never inferred from reading surrounding text. Users scanning a dense project should be able to assess pipeline health in seconds.
3. **Nothing generative happens invisibly.** Every AI action has a visible trigger, a visible in-progress state (streaming, not a blank spinner — ties to `18_Animation_Guidelines.md` skeleton/streaming patterns), and a visible completion state showing what changed.
4. **Density is earned through hierarchy, not shrinking text.** Dense screens (schema view, API endpoint list) use grouping, whitespace rhythm, and progressive disclosure (expand/collapse) rather than uniformly small type to fit more on screen.

## 17.3 Typography

| Role | Typeface direction | Notes |
|---|---|---|
| UI / prose | A single modern grotesk (e.g., Inter or equivalent variable font) | One typeface family for all UI chrome and prose — no second display face, per Apple-style restraint principle above |
| Technical / code (schema fields, endpoint paths, DDL) | Monospace (e.g., JetBrains Mono or equivalent) | Used consistently anywhere raw technical content appears, reinforcing "this is real, structured data," not decorative |
| Scale | Modular scale, 4–6 steps from body to largest heading | Kept restrained; PARDI's screens are tool-like, not marketing-page-like, so heading sizes stay closer to Linear/Stripe than to a landing page |

Full token values (hex, exact rem sizes, spacing scale) are specified in `19_Design_Tokens.md` — this file governs *intent*, that file governs *implementation values*.

## 17.4 Status Vocabulary (System-Wide)

| Status | Color intent | Used for |
|---|---|---|
| Draft | Neutral gray | Artifact not yet marked ready/complete |
| Ready / Complete | Green | Story marked ready (FR-152), stage fully generated with no open flags |
| Stale | Amber | Artifact whose upstream dependency changed (`11_System_Architecture.md §11.6`) |
| Flagged | Red (icon, not full-row fill — avoid alarm fatigue) | Reviewer Agent flag present (FR-211) or normalization issue (FR-163) |
| Generating | Animated neutral/brand accent | Streaming generation in progress (`18_Animation_Guidelines.md`) |

This vocabulary is used identically across the Overview pipeline map (`10_Information_Architecture.md §10.2`), individual artifact screens, and the Task Breakdown board — a status color must mean the same thing everywhere in the product.

## 17.5 Core Component Patterns

| Pattern | Where used | Key behavior |
|---|---|---|
| Split-view (generated ↔ source context) | PRD, BRD screens | Lets the user see *why* generated content says what it says, reinforcing the "Architect, not black box" positioning (`02_Product_Strategy.md`) |
| Dual toggle (visual ↔ structured) | Database Designer, Architecture, API Design | Same interaction pattern, same toggle placement, across all three |
| Inline review comment | Database Designer, API Design, Architecture | Dismissible with required justification if overridden (`09_User_Flow.md §9.2.8`) — never silently removable |
| Staleness banner | Project Overview, any artifact screen | Persistent but non-blocking; always names which artifacts are affected, never a generic "something changed" |
| Kanban board (persona/milestone grouped) | User Stories, Task Breakdown | Drag-to-status with disabled-state tooltips explaining blocked transitions (FR-152 UX) |
| Command palette | Global | Keyboard-triggered (Cmd/Ctrl+K), jump to any artifact or trigger any generation action without mouse navigation — Raycast-influenced |

## 17.6 Empty & Error States

- **Empty states** (new project, no stories yet) get a small amount of Arc-influenced personality — a short, specific, non-generic line of copy plus a clear single primary action — never a large decorative illustration that adds load time without adding clarity.
- **Error states** (generation failure, stale dependency conflict) are treated seriously and plainly: what failed, what the user's data state is (never ambiguous about whether something was lost, per NFR-112), and one clear next action.

## 17.7 Cross-References

- Exact color/spacing/type token values → `19_Design_Tokens.md`
- Motion specification for streaming/status transitions → `18_Animation_Guidelines.md`
- Screen-by-screen flow this system is applied to → `09_User_Flow.md`
