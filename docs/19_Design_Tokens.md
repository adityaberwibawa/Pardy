# 19 — Design Tokens

Implements the intent defined in `17_UI_UX_Design_System.md` and `18_Animation_Guidelines.md` as concrete, code-usable values. These are CSS variables consumed by Tailwind config and shadcn/ui theme overrides (`20_Tech_Stack.md`).

## 19.1 Color Tokens

Dark mode is default (`17_UI_UX_Design_System.md §17.1`); light mode values are provided for the marketing site and as a user preference toggle in-app.

### Base Palette

| Token | Dark value | Light value | Usage |
|---|---|---|---|
| `--color-bg-base` | `#0A0A0B` | `#FFFFFF` | App background |
| `--color-bg-surface` | `#141416` | `#F7F7F8` | Cards, panels |
| `--color-bg-surface-raised` | `#1C1C1F` | `#FFFFFF` (with border) | Modals, popovers, command palette |
| `--color-border` | `#2A2A2E` | `#E5E5E7` | Default dividers/borders |
| `--color-text-primary` | `#F2F2F3` | `#111113` | Primary text |
| `--color-text-secondary` | `#9A9AA0` | `#6B6B70` | Secondary/muted text |
| `--color-accent` | `#5B8DEF` | `#3D6FE0` | Primary brand accent, primary buttons, links |

### Status Palette (implements `17_UI_UX_Design_System.md §17.4`)

| Token | Value | Usage |
|---|---|---|
| `--color-status-draft` | `#7A7A80` (neutral gray) | Draft status |
| `--color-status-ready` | `#3DBE7A` (green) | Ready / complete |
| `--color-status-stale` | `#E0A93D` (amber) | Stale artifact |
| `--color-status-flagged` | `#E0503D` (red, icon-only per §17.4) | Reviewer/normalization flag |
| `--color-status-generating` | `#5B8DEF` (accent, animated per `18_Animation_Guidelines.md`) | Active streaming generation |

> **Decision:** Status colors are defined once as semantic tokens (`--color-status-*`), never hardcoded hex values in component code. This is what makes the "status is a color, never a paragraph, and means the same thing everywhere" principle (`17_UI_UX_Design_System.md §17.2`) enforceable in code review, not just in a design spec nobody re-checks.

## 19.2 Typography Tokens

| Token | Value |
|---|---|
| `--font-ui` | Inter Variable, fallback: system-ui, sans-serif |
| `--font-mono` | JetBrains Mono, fallback: ui-monospace, monospace |
| `--text-xs` | 12px / 16px line-height |
| `--text-sm` | 13px / 20px |
| `--text-base` | 14px / 22px |
| `--text-md` | 16px / 24px |
| `--text-lg` | 20px / 28px |
| `--text-xl` | 26px / 34px |
| `--text-2xl` | 34px / 42px |

Base UI text at `--text-base` (14px), deliberately smaller than typical marketing-site defaults — consistent with the Linear/Stripe information-density principle (`17_UI_UX_Design_System.md §17.2` point 4) rather than a landing-page type scale.

## 19.3 Spacing Scale

4px base unit, standard geometric-ish progression:

`--space-1: 4px` · `--space-2: 8px` · `--space-3: 12px` · `--space-4: 16px` · `--space-5: 24px` · `--space-6: 32px` · `--space-7: 48px` · `--space-8: 64px`

## 19.4 Radius & Elevation

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 6px | Buttons, badges, inputs |
| `--radius-md` | 10px | Cards, panels |
| `--radius-lg` | 16px | Modals, command palette |
| `--elevation-1` | `0 1px 2px rgba(0,0,0,0.24)` | Resting cards |
| `--elevation-2` | `0 4px 16px rgba(0,0,0,0.32)` | Dragged Kanban card, popovers |
| `--elevation-3` | `0 12px 32px rgba(0,0,0,0.4)` | Modals, command palette |

## 19.5 Motion Tokens (Cross-Reference)

Duration/easing tokens (`--duration-instant`, `--duration-fast`, `--duration-base`, `--duration-slow`) are defined in full in `18_Animation_Guidelines.md §18.2` — not duplicated here to avoid two sources of truth for the same values; this file only notes that they live in the same CSS-variable system as color/type/spacing above.

## 19.6 Token Governance

> **Decision:** All tokens are defined as CSS custom properties at `:root` (and `.light`/`.dark` scoped overrides), consumed via Tailwind's `theme.extend` config referencing `var(--token-name)`, never as hardcoded Tailwind arbitrary values (`bg-[#141416]`) in component code. This is enforced via lint rule (`21_Folder_Structure.md`, `24_Testing.md` CI gates) so design-system drift is caught at PR time, the same discipline this document's own subject matter (a tool that prevents *spec* drift) implicitly holds itself to.
