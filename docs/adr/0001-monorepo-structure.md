# ADR 0001 — Monorepo Structure

## Context
This project needs a React web app and a Sanity Studio, plus shared schema-driven types/queries. Keeping these in sync is a major maintainability risk if they live in separate repos.

## Decision
Use a single monorepo with:
- `apps/web` (Vite + React + TS + Tailwind + Zustand)
- `apps/studio` (Sanity Studio + schemas)
- `packages/shared` (shared TS types and GROQ helpers)

## Consequences
- Easier refactors across schema/query/UI boundaries.
- Single CI pipeline can validate schema typegen + web build together.
- Slightly more tooling up-front (workspaces), but lower long-term operational overhead.


