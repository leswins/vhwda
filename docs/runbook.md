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

## Deploy checklist (suggested)
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- Verify:
  - home renders
  - browse + detail queries return expected data
  - language toggle + fallback behavior
  - basic a11y (keyboard navigation + focus)


