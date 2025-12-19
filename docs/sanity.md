# Sanity

## Project
- **projectId**: `j0yc55ca`
- **dataset**: `production` (public)

## Node version
- Use **Node 20 LTS** (recommended) for `sanity schema deploy` / `sanity deploy`.

## Studio location
- `apps/studio`

## Local schema is source of truth
Schemas live in `apps/studio/schemaTypes`. Deploy schema changes with:
- `pnpm sanity:deploy` (or `pnpm --filter studio run deploy`)

## Type generation
Generate schema-driven types (and keep web app aligned) with:
- `pnpm sanity:typegen`

## MCP usage (Sanity MCP)
When working via MCP tools, follow this sequence:
1. `list_sanity_rules`
2. `get_sanity_rules` with relevant rules (typically: `sanity-schema`, `sanity-localization`, `sanity-studio-structure`, `sanity-portable-text`, `sanity-typegen`, `sanity-groq`)
3. Inspect existing schema:
   - `get_schema({ resource: { projectId: \"j0yc55ca\", dataset: \"production\" } })`

## CORS / local dev
If your web app will read from the Content Lake directly, ensure CORS allows your local dev origin (e.g. `http://localhost:5173`) in the Sanity project settings or via MCP (`add_cors_origin`).


