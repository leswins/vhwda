# VHWDA Health Careers Catalog (Digital)

Monorepo for the VHWDA Health Careers Catalog web app and Sanity Studio.

## Structure
- `apps/web`: Vite + React + TypeScript + Tailwind + Zustand
- `apps/studio`: Sanity Studio + schemas
- `packages/shared`: shared types and GROQ helpers
- `docs`: documentation (start at `docs/index.md`)

## Prerequisites
- Node.js (LTS recommended)
- pnpm (recommended for workspaces)

## Quickstart (once scaffolded)
1. Install dependencies:
   - `pnpm install`
2. Configure env vars:
   - `apps/web/.env` with `VITE_SANITY_PROJECT_ID=j0yc55ca` and `VITE_SANITY_DATASET=production`
3. Run dev:
   - `pnpm dev`

## Docs
See `docs/index.md`.


