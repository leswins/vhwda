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
   - For quiz result emails, also configure `RESEND_API_KEY` and `QUIZ_RESULTS_EMAIL_FROM` in the web app deployment environment
   - For resource submissions and the educator portal, see `docs/sanity.md` (Supabase + portal password + `SUPABASE_ANON_KEY`). Demo sample listings are toggled in Sanity or with `?demo=1`, not via `VITE_DEMO_RESOURCES` on Vercel.
   - For Ask AI, set **server-only** `GEMINI_API_KEY` (never `VITE_GEMINI_API_KEY` — Vite public keys are shipped to the browser)
3. Run dev:
   - `pnpm dev`

## Docs
See `docs/index.md`.


