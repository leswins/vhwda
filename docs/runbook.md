# Runbook

## Local development
- Install deps: `pnpm install`
- Run everything: `pnpm dev`
- Run web only: `pnpm --filter web dev`
- Run studio only: `pnpm --filter studio dev`

## Schema changes
1. Update schema files in `apps/studio/schemaTypes`
2. (Recommended) run typegen: `pnpm sanity:typegen`
3. Deploy schema: `pnpm sanity:deploy`

## Token updates (design system)
1. Pull updated variables from Figma via the documented MCP workflow.
2. Update `apps/web/src/styles/tokens.css` and verify key screens visually.

## Ask AI (Gemini)
- Browser code must never read `VITE_GEMINI_API_KEY` or any other Gemini secret.
- Set `GEMINI_API_KEY` on Vercel (Production + Preview). After a deploy that includes `/api/chat`, delete `VITE_GEMINI_API_KEY` so it cannot leak into a client bundle again.
- Local Ask AI requires `vercel dev` from `apps/web` (Vite alone does not serve `/api/*`).

## Local client demo (Resources Hub + educator portal)
The hub/teacher work lives on the `cursor/resources-hub-teacher-portal-4e7e` branch until that PR is merged. For a local walkthrough:

```bash
git checkout cursor/resources-hub-teacher-portal-4e7e
pnpm install
pnpm --filter web dev
```

In Vite dev (`import.meta.env.DEV`), internships, grants, and the teacher library show **sample** listings if Sanity has none. On `/teachers`, use **Preview sample library**. These samples are not published to production unless you set `VITE_DEMO_RESOURCES=true` on a build.

Submit/review (`/resource-submit`, `/resource-portal`) still need `vercel dev` plus Supabase. Scholarships stay behind the Sanity feature flag.

## Deploy checklist (suggested)
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- Verify:
  - home renders
  - browse + detail queries return expected data
  - language toggle + fallback behavior
  - basic a11y (keyboard navigation + focus)


