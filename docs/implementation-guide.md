# Implementation Guide (Initial Setup)

This guide covers **initial project setup** for the VHWDA Health Careers Catalog monorepo.

## 0) Prerequisites
- Node.js (**20 LTS recommended**)
- `pnpm` (workspace package manager)
- Sanity CLI (installed via `apps/studio` dependencies)
- Git + GitHub CLI (`gh`) (recommended)

## 1) Repo layout (monorepo)
- `apps/web`: Vite + React + TS + Tailwind + Zustand (public site)
- `apps/studio`: Sanity Studio + schema types (CMS)
- `packages/shared`: shared TS types + constants (schema/query alignment)
- `docs`: documentation (see `docs/index.md`)

## 2) Install dependencies
From repo root:

```bash
pnpm install
```

## 3) Environment variables
The web app reads Sanity config from env vars with safe defaults:
- `VITE_SANITY_PROJECT_ID` (default `j0yc55ca`)
- `VITE_SANITY_DATASET` (default `production`)

Create a local env file:

```bash
mkdir -p apps/web
cat > apps/web/.env << 'EOF'
VITE_SANITY_PROJECT_ID=j0yc55ca
VITE_SANITY_DATASET=production
EOF
```

Notes:
- The Sanity dataset is **public**, so the web app uses CDN reads and does **not** require a token for basic reads.

## 4) Run locally
Run both apps:

```bash
pnpm dev
```

Or run them separately:

```bash
pnpm --filter web dev
pnpm --filter studio dev
```

## 5) Sanity CMS setup (schemas + Studio)

### 5.1 What you have locally
Schemas are defined in `apps/studio/src/schemaTypes` to match `prd.md` §8.2:
- `career`
- `program`
- `scholarship`
- `resource`
- `professionalOrganization`
- `quiz`
- `siteSettings` (singleton)
- `careerCategory` (taxonomy helper)

Localized content is modeled as `{ en, es }` objects (`localizedString`, `localizedText`, `localizedPortableText`).

### 5.2 Deploy schema to the project
Sanity reports that **no schema is currently deployed** to `j0yc55ca/production`, so the first deploy is required before editors can create content.

```bash
pnpm sanity:deploy
```

Notes:
- `pnpm --filter studio dev` starts a **local** Studio at `http://localhost:3333` for editing, but does **not** register a “deployed studio” in the Sanity web app.
- The **Sanity “Studios” tab** only shows Studios that have been **hosted/deployed** (Sanity-hosted or your own hosting).
- If you see `TypeError: Cannot read properties of undefined (reading 'get')` during deploy, upgrade to **Node 20** and reinstall deps (`pnpm install`), then retry.

If you hit CORS issues when the web app reads from Sanity locally, add your dev origin in Sanity project settings (e.g. `http://localhost:5173`).

### 5.3 (Optional) Type generation
Once you add `sanity-typegen.json` and choose where to output types, you can generate types to keep schema + queries aligned.

## 6) Tailwind design system (Figma → `tokens.css` → Tailwind)

### 6.1 Token source
- Figma file: `VHWDA` (`M7AFcGjm2vdq1H1KlIn28c`)
- Token node: `411:1329`

### 6.2 How tokens are implemented
- `apps/web/src/styles/tokens.css`: CSS variables (source of truth at runtime)
- `apps/web/tailwind.config.ts`: maps Tailwind semantic colors to `tokens.css`

### 6.3 Pull tokens with Figma MCP (agent workflow)
Use MCP to extract variables:
- `get_variable_defs({ nodeId: "411:1329", clientLanguages: "typescript,css", clientFrameworks: "react" })`

Then:
1. Convert hex colors to RGB triplets.
2. Update `apps/web/src/styles/tokens.css`.
3. Ensure Tailwind semantic colors reference CSS vars (no hardcoded colors).

## 7) Initial Git + GitHub setup
This repo is hosted at `https://github.com/leswins/vhwda`.

### 7.0 Creating the repo (CLI reference)
If bootstrapping from scratch, the recommended flow is:

```bash
git init
git branch -M main
git add -A
git commit -m "Initial project setup"
gh repo create vhwda --public --source=. --remote=origin --push
```

### 7.1 Recommended branch protection (manual)
In GitHub repo settings:
- Protect `main`
- Require PR reviews
- Require status checks (CI)
- Disallow force-pushes

### 7.2 CI baseline (recommended)
Use a simple CI workflow to run:
- `pnpm install`
- `pnpm ci` (lint + typecheck + build)


