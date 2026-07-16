# 01 — Executive Summary

## The Problem

AI coding agents (Claude Code, Cursor, Windsurf, Bolt, v0, Lovable, Firebase Studio) have made writing code nearly free. They have not made *deciding what to build* free. In practice this creates a new failure mode:

1. A founder or engineer has an idea.
2. They open a coding agent and describe it in a paragraph.
3. The agent produces a working-looking app in minutes.
4. Two weeks later, the schema doesn't support a feature they needed, the auth model is wrong for their use case, the API contracts between two screens contradict each other, and there's no record of *why* anything was built the way it was.

The agent didn't fail at coding. It failed because it was never given a real specification — it was given a vibe. Nobody would ask a construction crew to build a house from a one-paragraph description and no blueprint; increasingly, that's exactly how software gets built.

## The Insight

As code generation commoditizes, **specification quality becomes the differentiator.** The same coding agent, given a precise PRD, a normalized database schema, a versioned API contract, and a task-by-task execution plan, will produce dramatically more correct and maintainable output than the same agent given an idea and a prayer. The bottleneck moved upstream — but almost nobody is building tools for the *new* bottleneck. Most "AI PRD generator" tools address the old one: they produce a document a human reads, not an artifact a coding agent can execute against.

## The Solution

**PARDI** is an AI Product Architect that takes a user from idea to a complete, coherent, exportable software blueprint — and then converts that blueprint directly into prompts a coding agent can execute with minimal ambiguity.

PARDI is not a chatbot that answers "what should my PRD say?" It runs a fixed, opinionated pipeline:

```
Idea → Validation → PRD → BRD → User Stories → System Design
     → Database Design → API Design → Task Breakdown
     → Coding Prompts → Deployment Checklist
```

Every stage produces a durable, versioned artifact that feeds the next stage. The database design is *derived from* the user stories, not created in a vacuum. The API contract is *derived from* the database design. The coding prompts are *derived from* all of the above. This traceability is the product — a stack of disconnected AI-generated documents is not.

## Why Now

Three trends converge:

- **Coding agents are commoditizing.** The relative advantage of "we have the best code-writing model" is shrinking as multiple providers reach a similar bar. Value is migrating to what surrounds the model.
- **Solo and small-team builders are the fastest-growing segment of software creators**, and they structurally lack a PM or architect to do this work for them.
- **LLMs are now reliable enough to hold multi-stage structured reasoning** (spec → schema → API → tasks) with enough consistency to be trustworthy as a first draft, provided the workflow enforces traceability rather than asking one giant unstructured prompt to do everything at once.

## Who It's For

Primarily software engineers, indie hackers, and startup founders who are building product without a dedicated PM or architect — either solo or in small teams — and who are already using or planning to use an AI coding agent. See `05_User_Personas.md` for full detail.

## What Makes This Different

> **Decision:** PARDI is scoped as a *pre-code* tool, not a coding tool. It does not compete with Claude Code, Cursor, or v0 — it produces the input those tools need to perform well. This keeps PARDI's own AI workload focused on structured reasoning and document generation rather than code execution, which is a meaningfully different (and currently less commoditized) capability.

| Typical "AI PRD Generator" | PARDI |
|---|---|
| One prompt → one document | Fixed pipeline → chain of interdependent, versioned artifacts |
| Human-readable prose output | Human-readable *and* agent-executable output (structured prompts) |
| No persistence between stages | Every downstream stage is derived from upstream artifacts |
| Generic template filling | Opinionated recommendations with stated reasoning (tech stack, architecture, schema) |
| Single-agent generation | Multi-agent workflow with distinct roles (PM, Architect, DBA, Security, etc.) |

## Business Model (Summary)

Subscription SaaS with usage-based ceilings on AI generation, tiered by project count and export volume. Full detail in `26_Pricing.md`.

## Success Criteria

The product succeeds if a solo developer using PARDI's output can hand a coding agent a task from `Task Breakdown` and get correct, on-spec code back on the first or second attempt — measurably more often than if they'd prompted the coding agent directly from their own idea. This is PARDI's north star and is expanded in `28_KPI.md`.
