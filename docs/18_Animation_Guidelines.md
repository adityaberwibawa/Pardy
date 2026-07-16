# 18 — Animation Guidelines

## 18.1 Governing Principle

**Animation must communicate state change, never decorate it.** Every motion spec below exists to answer a specific user question ("is this still loading?", "what just changed?", "where did this go?") — none exist purely for visual flair. This directly follows the Apple-influenced restraint principle in `17_UI_UX_Design_System.md §17.1` and the NFR performance budget in `08_Non_Functional_Requirements.md §8.1`.

> **Decision:** Target 60 FPS on all interaction-driven animation (drag, hover, transitions) as a hard floor, and treat any animation that can't hit it on a mid-range laptop as a candidate for removal or simplification, not optimization debt to accept. A product whose core credibility rests on precision (`02_Product_Strategy.md`) cannot afford motion that feels janky — jank reads as "the product wasn't cared for," which undermines trust in the far more important structured output it produces.

## 18.2 Motion Tokens

| Token | Duration | Easing | Use case |
|---|---|---|---|
| `duration-instant` | 100ms | ease-out | Hover states, button press feedback |
| `duration-fast` | 150–200ms | ease-in-out | Toggle switches, tab changes, dropdown open/close |
| `duration-base` | 250–300ms | ease-in-out (custom cubic-bezier, slight overshoot avoided) | Panel transitions, modal open/close, split-view resize |
| `duration-slow` | 400–500ms | ease-in-out | Page-level transitions (navigating between pipeline stages) |
| `duration-stream` | Continuous, not fixed | Linear, per-token/chunk arrival | AI generation streaming (schema fields, PRD sections appearing incrementally) |

No animation exceeds 500ms outside of continuous streaming states — anything longer starts to read as sluggish rather than considered, per the perceived-latency management strategy referenced in `08_Non_Functional_Requirements.md §8.1`.

## 18.3 Micro-Interactions

| Interaction | Spec |
|---|---|
| Button press | Scale 0.98, `duration-instant`, no color animation (avoid competing signals) |
| Status badge change (e.g., draft → ready) | Cross-fade + subtle scale pulse, `duration-fast` — reinforces the status-vocabulary system (`17_UI_UX_Design_System.md §17.4`) without needing a toast notification for every change |
| Drag-and-drop (Kanban) | Card lifts with a soft shadow on pick-up, snaps to nearest valid column with `duration-fast` ease-out on drop; invalid drop targets (e.g., dragging a story without criteria into "Ready") shake subtly (2 cycles, 150ms) rather than silently rejecting |
| Command palette open | Scale + fade in from 96% to 100%, `duration-fast`, backdrop blur fades in slightly slower (`duration-base`) to avoid a jarring simultaneous pop |

## 18.4 Streaming / Generation States (Product-Specific)

Because AI generation is multi-second (NFR-102/104), the streaming experience is the single most important animation surface in the product — more consequential than any transition or hover state.

- **Skeleton loading**, not spinners, for any generation expected to take >1s: the skeleton shape mirrors the actual artifact's layout (e.g., a schema's entity-card skeleton, not a generic gray box), so the user has a sense of *what kind* of thing is arriving before it does.
- **Progressive reveal:** structured content streams in at the granularity it's generated (per-section for PRD, per-entity for schema, per-endpoint for API) — each new piece fades/slides in gently (`duration-fast`) as it arrives, rather than the whole artifact popping in at once at the end. This is a direct product requirement (NFR-104's "incremental streaming") expressed as a motion spec.
- **Review flags arriving mid-stream** (Reviewer Agent, FR-211) get a distinct, slightly more attention-grabbing entrance (brief amber highlight fading over `duration-base`) than ordinary content arrival, since they require the user's attention differently than "here's another schema field."

## 18.5 Optimistic UI

Applied specifically to non-generative actions (marking a story "ready," dismissing a review flag, reordering tasks): the UI updates immediately on user action, before server confirmation, with a subtle rollback animation (fade back + brief inline error) only in the rare failure case. **Never** applied to AI generation actions — generation results must reflect actual model output, never an optimistic guess, since incorrect optimistic content here would directly violate the trust the product depends on.

## 18.6 3D / Marketing Surface (Landing Page Only)

React Three Fiber / GSAP-driven hero treatment is scoped **only** to the public marketing/landing page, not the authenticated product — the in-app experience stays in the calmer, Linear/Stripe-influenced register described in `17_UI_UX_Design_System.md`. This separation is deliberate: a first-time visitor evaluating PARDI benefits from an impressive, premium first impression; a working developer mid-pipeline benefits from speed and restraint, and would find persistent 3D flourish actively counterproductive to trust and performance.

| Landing element | Spec |
|---|---|
| Hero background | Aurora/gradient animation, GPU-composited, paused when off-screen or on `prefers-reduced-motion` |
| Scroll-triggered reveals | GSAP ScrollTrigger, one reveal style used consistently down the page rather than a different effect per section (restraint principle again) |
| Cursor glow (hero only) | Subtle, low-opacity, disabled entirely on touch devices and under reduced-motion |

## 18.7 Accessibility Constraints (Binding, Not Optional)

- All animation respects `prefers-reduced-motion: reduce` — reduced-motion mode replaces sliding/scaling with simple opacity cross-fades at `duration-instant`, never removes the state-change signal entirely (NFR-141).
- No animation is the sole carrier of required information — a stale badge's amber pulse is accompanied by a persistent (non-animated) label and icon, so the information survives with motion disabled (NFR-142's text-equivalent principle applied to motion, not just diagrams).
- No flashing/strobing effects at any frequency near photosensitive-seizure thresholds — a hard rule with no exceptions, including in marketing/landing treatments.

## 18.8 Performance Constraints

- Animations use `transform`/`opacity` only wherever possible (GPU-composited), never animating `width`/`height`/`top`/`left` directly for anything performance-sensitive (Kanban drag, streaming reveals).
- Streaming reveal animations are throttled to avoid re-triggering layout thrash when many small chunks arrive in quick succession (batch DOM updates per animation frame rather than per token).
- Landing-page 3D/GSAP assets are code-split and lazy-loaded — they must never be part of the authenticated app's bundle, keeping the NFR-101 performance budget for the actual product untouched by marketing-page weight.

## 18.9 Cross-References

- Visual/status system these animations express → `17_UI_UX_Design_System.md`
- Exact color/timing token values → `19_Design_Tokens.md`
- Performance budget these constraints serve → `08_Non_Functional_Requirements.md §8.1`, `23_Performance.md`
