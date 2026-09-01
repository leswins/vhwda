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

## Live client demo (Resources Hub + educator portal)

Do **not** use `VITE_DEMO_RESOURCES` on Vercel to turn samples on and off during a meeting. That variable is baked into the Vite client bundle at **build time**. Changing it in Vercel requires a **redeploy**, so it cannot be toggled on the live site mid-demo.

### Toggle sample listings on the live site (no redeploy)

After this branch is deployed and the Studio schema is published:

1. **Presenter URL (fastest):** open `https://vahealthcareers.org/resources?demo=1`. That sticks for the current browser tab (`?demo=0` turns it off). Internships, grants, and the teacher library fill with samples only when Sanity has no real documents for that type.
2. **Everyone on the live site:** Sanity → Site Settings → Feature Flags → **Demo sample resources**. Publish, then refresh the website.

Leave `VITE_DEMO_RESOURCES` unset in Vercel. Local `pnpm --filter web dev` still shows samples by default.

### Go-live checklist (Google + Ask AI can wait)

1. Merge and deploy the Resources Hub branch to production.
2. `pnpm sanity:deploy` then `pnpm --filter studio run seed:resource-types`.
3. Confirm the Supabase SQL migration is applied (already done if `teacher_profiles` exists).
4. Vercel **Production** env (no Vite prefix required for APIs):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `SANITY_API_TOKEN`
   - `SCHOLARSHIP_PORTAL_PASSWORD`
   - Do **not** set `TEACHER_GOOGLE_AUTH` until Google OAuth is ready (hides the Google button).
   - Do **not** set `GEMINI_API_KEY` until Ask AI should work.
5. Supabase Auth:
   - Authentication → Providers → **Email** enabled.
   - For a live demo, turn **Confirm email** off so a new account can sign in immediately (turn it back on after the meeting if you want confirmation).
   - URL configuration: Site URL `https://vahealthcareers.org`
   - Redirect URLs include `https://vahealthcareers.org/teachers/auth/callback`
6. Redeploy once after adding the Supabase keys so `/api/teacher-config` returns `configured: true`.

Email/password, submit form, review portal, and hub samples then work on production. Google and Ask AI stay off until those keys exist.

## Deploy checklist (suggested)
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- Verify:
  - home renders
  - browse + detail queries return expected data
  - language toggle + fallback behavior
  - basic a11y (keyboard navigation + focus)


