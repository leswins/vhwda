# Repo Conventions

## Monorepo layout
- `apps/web`: public-facing React app (Vite + React 18 + TS + Tailwind + Zustand)
- `apps/studio`: Sanity Studio + schema types
- `packages/shared`: shared TypeScript types, GROQ fragments/queries, and constants
- `docs`: project documentation (see [docs/index.md](index.md))

## Naming
- **Files**: `kebab-case` for directories; `PascalCase.tsx` for React components; `camelCase.ts` for utilities
- **Components**: `PascalCase` exports (`Button`, `CareerCard`)
- **Zustand stores**: `useXStore` naming (`useLanguageStore`, `useCompareStore`)

## Localization (EN/ES)
- **UI strings**: must use i18n utilities (no inline English in components).
- **CMS fields**: localized objects `{en, es}` for strings and Portable Text.
- **Fallback**: if Spanish is missing, show English with a small “Spanish not yet available” notice (handled in a shared helper).

## Design tokens
- **Never hardcode colors** in components.
- Use CSS variables from `tokens.css` and reference them via Tailwind theme (e.g. `bg-surface`, `text-foreground`).

## Data access
- All Sanity GROQ queries should live in `packages/shared` (or be re-exported from there).
- Web app should depend on shared types/fragments to keep schema → query → UI aligned.

## Git hygiene
- Use `main` as default branch.
- Prefer small PRs with clear scope.
- Keep secrets out of git; use `.env` files locally and CI/hosting env vars in deployments.


