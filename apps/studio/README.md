# Sanity Studio (`apps/studio`)

This folder contains the **Sanity Studio** for the VHWDA Health Careers Catalog project. The Studio is the editorial/admin interface where VHWDA staff (Admins/Editors) create and maintain content that the public-facing web app consumes.

## What this Studio is for
- **Define the CMS schema** (content types + fields) for the catalog (Careers, Programs, Scholarships, etc.).
- Provide a clean **editor experience** via a curated “Desk Structure” (left-nav).
- Deploy schema changes to the Sanity project so editors can create/update content in the Content Lake.

## Sanity project configuration
- **projectId**: `j0yc55ca`
- **dataset**: `production` (public reads expected)

These values are configured in:
- `sanity.cli.ts` (CLI operations like schema deploy)
- `sanity.config.ts` (Studio runtime configuration)

### Hosted Studio URL / hostname
- **Studio URL**: `https://careercatalog.sanity.studio/`
- `sanity.cli.ts` pins `studioHost: "careercatalog"` so `pnpm studio:deploy` doesn’t prompt for a hostname.

## Node version
- Use **Node 20 LTS** (recommended) for `sanity schema deploy` / `sanity deploy`.

## How to run locally
From repo root:

```bash
pnpm --filter studio dev
```

Build the Studio:

```bash
pnpm --filter studio build
```

## Deploy schema (first-time + updates)
Sanity currently reported **no schema deployed** for this project/dataset during initial setup, so the first deploy is required before editors can create documents.

From repo root:

```bash
pnpm sanity:deploy
```

## Deploy the Studio (so it appears in the Sanity “Studios” tab)
Running the Studio locally (`sanity dev`) is just for your machine. If you want the Studio to appear in `sanity.io` under **Studios**, deploy it:

```bash
pnpm studio:deploy
```

## Where to find the important code

### Studio entrypoints
- `sanity.config.ts`: Studio config (plugins, schema types)
- `sanity.cli.ts`: CLI config (projectId/dataset)

### Schema definitions
Schemas live in:
- `src/schemaTypes/`
  - `src/schemaTypes/index.ts`: exports `schemaTypes` array
  - `src/schemaTypes/documents/*`: top-level document types
  - `src/schemaTypes/objects/*`: reusable embedded objects (localization, salary, etc.)

### Desk (content navigation)
The Studio left-nav is customized in:
- `src/structure/index.ts`

This structure does two key things:
- **Pins singletons** (like `siteSettings`) to a fixed document ID so there is exactly one.
- Groups content by editorial workflow: Careers, Programs, Scholarships, Resources, etc.

## Content model (matches `prd.md` §8.2)
This Studio defines the following primary document types:
- **`career`**: the core catalog item
- **`program`**: training programs / schools
- **`scholarship`**: scholarship & financial aid entries
- **`resource`**: resources hub entries (category-driven)
- **`professionalOrganization`**: professional orgs & networks
- **`quiz`**: quiz configuration (questions + options + scoring placeholder)
- **`siteSettings`**: global settings (nav/footer links, announcements, feature flags, SEO defaults) — **singleton**
- **`careerCategory`**: taxonomy helper referenced by `career.categories`

## Localization (EN/ES)
The app is bilingual (EN/ES). Studio fields use **localized objects**:
- `localizedString`: `{ en: string, es?: string }`
- `localizedText`: `{ en: string, es?: string }`
- `localizedPortableText`: `{ en: PortableText[], es?: PortableText[] }`

These types live in `src/schemaTypes/objects/` and are reused across documents.

## Notes on schema evolution
Avoid deleting fields that may have production content. Prefer deprecation patterns:
- `deprecated` + `readOnly: true` + `hidden` (when undefined)

## Common gotchas
- **CORS**: If the web app cannot read from Sanity locally, add `http://localhost:5173` to CORS origins in the Sanity project settings.
- **Dataset is public**: web reads are expected to use CDN (`useCdn: true`) and not require a token for basic browsing.


