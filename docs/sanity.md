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

## Scholarship Submission Portal

External stakeholders submit scholarships via a form at `/scholarship-submit`. The internal team reviews submissions at `/scholarship-portal` (password-protected). Approved scholarships are created in Sanity automatically.

### How it works
1. **Form** (`/scholarship-submit`) — public, no links from the main site. Share the URL directly.
2. **Portal** (`/scholarship-portal`) — password-gated. Enter the portal password to view, approve, or decline submissions.
3. **Data flow**: Submissions are stored in Supabase (`scholarship_submissions` table). On approval, a `scholarship` document is created in the Sanity Content Lake.

### Architecture
- **Frontend**: Two React pages in `apps/web/src/views/` (`ScholarshipSubmitPage.tsx`, `ScholarshipPortalPage.tsx`)
- **API routes** (Vercel Edge Functions in `apps/web/api/`):
  - `scholarship-submit.ts` — POST, public, inserts into Supabase
  - `scholarship-submissions.ts` — GET, password-protected, reads from Supabase
  - `scholarship-review.ts` — POST, password-protected, approve (creates Sanity doc) or decline
- **Supabase**: `scholarship_submissions` table with RLS enabled (service-role access only)

### Environment variables
Set these in Vercel Project Settings → Environment Variables:

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL (e.g. `https://plkibckwdpzchnggkytt.supabase.co`) |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-side only) |
| `SANITY_API_TOKEN` | Sanity API token with write permissions |
| `SCHOLARSHIP_PORTAL_PASSWORD` | Password for the admin review portal |

For local development, add these to `.env.local` at the repo root and run `vercel dev` from `apps/web`.

### Local testing
- Submit form: `curl -X POST http://localhost:3000/api/scholarship-submit -H "Content-Type: application/json" -d '{"name":"Test Scholarship","link":"https://example.com","submitter_name":"Jane","submitter_email":"jane@example.com"}'`
- List submissions: `curl http://localhost:3000/api/scholarship-submissions -H "x-portal-password: YOUR_PASSWORD"`
- Approve: `curl -X POST http://localhost:3000/api/scholarship-review -H "Content-Type: application/json" -H "x-portal-password: YOUR_PASSWORD" -d '{"id":"<submission-uuid>","action":"approve"}'`
