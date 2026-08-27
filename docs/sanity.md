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

## Resource Hub + Submission Portal

External stakeholders submit resources via `/resource-submit` (legacy `/scholarship-submit` still works). The internal team reviews submissions at `/resource-portal` (legacy `/scholarship-portal`). Approved items are created in Sanity automatically.

Resource types are managed in Sanity (`resourceType` documents). Adding a type in Studio creates a new hub section and a new option on the submission form without a frontend code change. Public hub listings for generic types query Sanity by `resourceType.slug`, so new types work even before the frontend is redeployed.

### How it works
1. **Form** (`/resource-submit`) — public, no links from the main site. Share the URL directly. Submitters pick a type (scholarship, internship, grant, organization, classroom material, or any type added in Sanity).
2. **Portal** (`/resource-portal`) — password-gated. Approve or decline submissions. A **Teacher downloads** tab shows which educators downloaded classroom files.
3. **Data flow**: Submissions are stored in Supabase (`resource_submissions`, with fallback to `scholarship_submissions`). On approval, the matching Sanity document is created (`scholarship`, `professionalOrganization`, or generic `resource` referenced to a `resourceType`).

### Architecture
- **Frontend**: `ResourceSubmitPage` and `ResourcePortalPage` (legacy scholarship routes re-export these)
- **API routes** (Vercel Edge Functions in `apps/web/api/`):
  - `scholarship-submit.ts` — POST, public, inserts into Supabase
  - `scholarship-submissions.ts` — GET, password-protected
  - `scholarship-review.ts` — POST, password-protected, approve or decline
  - `teacher-config.ts` — GET, public Supabase auth config for the educator portal
  - `teacher-profile.ts` — GET/PUT, teacher session required
  - `teacher-download.ts` — POST, logs a download and returns the file URL
  - `teacher-downloads.ts` — GET, password-protected analytics
- **Supabase**: `resource_submissions`, `teacher_profiles`, and `teacher_downloads` (see `supabase/migrations/20260827_resource_hub_teacher_portal.sql`)

### Educator portal
Teachers sign in at `/teachers` with email/password or Google (Supabase Auth). After a short school/purpose form, they can download classroom resources stored as Sanity `resource` documents whose `resourceType.audience` is `teacherPortal` or `both`.

### Environment variables
Set these in Vercel Project Settings → Environment Variables:

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-side only) |
| `SUPABASE_ANON_KEY` | Supabase anon key (used by the teacher portal; safe to expose to the browser) |
| `SANITY_API_TOKEN` | Sanity API token with write permissions |
| `SCHOLARSHIP_PORTAL_PASSWORD` | Password for the admin review portal |

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` also work if you prefer Vite-prefixed public values.

For local development, add these to `.env.local` at the repo root and run `vercel dev` from `apps/web`.

### Seed resource types
After deploying the Studio schema (`pnpm sanity:deploy`), seed the starting taxonomy:

```bash
pnpm --filter studio run seed:resource-types
```

Editors can then add internships, grants, or any new type in **Resource Types** without a code change.

### Local testing
- Submit form: `curl -X POST http://localhost:3000/api/scholarship-submit -H "Content-Type: application/json" -d '{"name":"Test Internship","link":"https://example.com","resource_type_slug":"internships","submitter_name":"Jane","submitter_email":"jane@example.com"}'`
- List submissions: `curl http://localhost:3000/api/scholarship-submissions -H "x-portal-password: YOUR_PASSWORD"`
- Approve: `curl -X POST http://localhost:3000/api/scholarship-review -H "Content-Type: application/json" -H "x-portal-password: YOUR_PASSWORD" -d '{"id":"<submission-uuid>","action":"approve"}'`
