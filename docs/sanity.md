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

## Slack notifications for new careers
This project uses a Vercel Serverless Function to send a Slack message only when a new `career` document is created.

### Environment variables
- Local: create `.env.local` at the repo root with:
  - `SLACK_WEBHOOK_URL=...`
- Vercel: set `SLACK_WEBHOOK_URL` in Project Settings -> Environment Variables.

### Sanity webhook setup
Configure a Sanity webhook (Sanity Manage -> API -> Webhooks):
- **Name:** Slack New Career Notifications
- **URL:** `https://<your-site>.vercel.app/api/sanity-webhook`
- **Dataset:** `production`
- **Trigger on:** Create and Update (updates are ignored by the function)
- **Filter:** `_type == "career"`
- **HTTP method:** POST
- **Include drafts:** No

### Local testing
- Run `vercel dev` (from `apps/web`) if you have the Vercel CLI installed.
- Send a test payload:
  - `curl -X POST http://localhost:3000/api/sanity-webhook -H "Content-Type: application/json" -d '{"_id":"test123","_type":"career","title":{"en":"Test Career"}}'`


