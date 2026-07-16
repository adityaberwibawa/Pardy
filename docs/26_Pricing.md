# 26 — Pricing

## 26.1 Pricing Philosophy

Priced as a **professional tool with real ROI**, not as a cheap utility — consistent with the "AI Product Architect, not PRD generator" positioning (`02_Product_Strategy.md §2.2`) and the buyer-behavior finding that solo builders already pay for Notion/Linear-class tools (`03_Market_Research.md §3.2`). Pricing is anchored to *hours of rework saved*, not to a feature count.

> **Decision:** Free tier is generous through PRD generation, then gates the schema/API/task/prompt stages behind paid tiers. Reasoning: the free tier needs to prove PARDI is meaningfully better than "just ask ChatGPT" (the Idea → PRD stages are where that comparison happens most directly), while the paid tiers gate exactly the stages that constitute PARDI's hardest-to-replicate value (`02_Product_Strategy.md §2.6` moat) — the derived, traceable schema/API/task/prompt chain.

## 26.2 Tier Structure

| Tier | Price (illustrative — to be validated per `03_Market_Research.md §3.5`) | Included |
|---|---|---|
| **Free** | $0 | 1 project · AI Interview, Idea Validation, PRD Generator · Markdown export of PRD only · No Database/API/Task/Prompt generation |
| **Builder** | ~$19–29/mo (individual) | Unlimited projects (soft usage cap, see §26.3) · Full pipeline through Prompt Generator · Version History · Full export system · Single-user, no workspace collaboration |
| **Team** | ~$49–79/user/mo | Everything in Builder · Workspace + Collaboration (comments, roles per `10_Information_Architecture.md §10.4`) · AI Reviewer + AI Product Critic · Priority generation queueing |
| **Agency/Enterprise** | Custom | Everything in Team · Template Marketplace private/org-scoped publishing · Higher generation quotas · (Future, Phase 3) SOC 2-track compliance features per `22_Security.md §22.8` |

> **Decision:** Pricing is per-workspace-seat at Team tier, not per-project, because project count scales with how much a team is building (which PARDI wants to encourage, not tax) while seat count scales with team size (a more defensible and legible axis to price against, matching how Linear/Notion price).

## 26.3 Usage-Based Ceilings

Rather than hard feature walls beyond Free, paid tiers meter **AI generation quota** (a specific count of full-stage generations/regenerations per billing period) — this is the "usage-based ceilings" model referenced in `01_Executive_Summary.md §Business Model Summary`.

| Metered unit | Why this unit, not something else |
|---|---|
| Full-stage generations (PRD, Schema, API, Task Breakdown, etc.) count against quota | This is the unit of actual AI cost (`20_Tech_Stack.md` OpenRouter spend) and the unit of actual user value delivered — a fairer meter than "seats" alone for a single-user Builder plan |
| Section-level regenerations (`09_User_Flow.md §9.2.4` scoped regen) count as a fraction of a full-stage unit | Encourages the cheaper, more targeted regeneration UX over wasteful full regenerations, aligning incentive with the UX design intent |
| Prompt Generator calls (Stage 11) are cheap/unmetered or very lightly metered | This is deliberately the lowest-creativity, lowest-cost stage (`14_AI_Workflow.md §14.2`) — metering it heavily would discourage the exact hand-off action that is PARDI's core success metric (`01_Executive_Summary.md`) |

Exceeding quota does not hard-block the user mid-task — it prompts an upgrade or an add-on quota purchase, with existing artifacts always remaining fully viewable/editable (same non-blocking posture as NFR-111's degradation philosophy, applied to billing rather than outages).

## 26.4 Billing Implementation Notes

- Third-party billing provider (Stripe-class) handles all payment method storage — PARDI's own systems never touch raw card data (`22_Security.md §22.4`).
- Plan tier and quota remaining are surfaced via the `X-Pardi-Generation-Quota-Remaining` header (`13_API_Specification.md §13.5`) and prominently in the product UI (a persistent, non-intrusive quota indicator, not a surprise paywall mid-pipeline).
- Downgrade behavior: if a workspace downgrades below Team, collaboration/comment features on existing multi-collaborator projects move to read-only for extra collaborators rather than deleting their access or the data — protects existing user content per the "never lose data" posture (NFR-112 extended to billing state transitions).

## 26.5 Why Not Pure Usage-Based (No Tiers) or Pure Flat-Rate (No Metering)

- **Pure usage-based** was rejected as the sole model because early-stage users (Dara, the indie hacker persona, `05_User_Personas.md §5.2`) need to predict their monthly cost before committing, and unpredictable AI-cost-passthrough pricing is a known adoption blocker for this exact buyer segment.
- **Pure flat-rate with no metering** was rejected because AI generation cost is real and variable enough (schema/API generation for a 50-entity project costs meaningfully more than a 5-entity project) that an unmetered flat plan either overprices light users or underprices heavy ones — the hybrid (tier + soft quota) captures predictability for the buyer while keeping unit economics sane for PARDI.

## 26.6 Cross-References

- Feature-to-tier gating source list → `06_Product_Requirements.md §6.4` priority table
- Segment this pricing targets → `03_Market_Research.md §3.1` (SOM)
- KPIs pricing performance is measured against → `28_KPI.md`
