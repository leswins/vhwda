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
- **`educationalInstitution`**: a shared list of schools/training institutions (used for the Career detail “Educational Programs” section)
- **`program`**: training programs / schools
- **`scholarship`**: scholarship & financial aid entries
- **`resource`**: resources hub entries (category-driven)
- **`professionalOrganization`**: professional orgs & networks
- **`quiz`**: quiz configuration (questions + options + scoring placeholder)
- **`siteSettings`**: global settings (nav/footer links, announcements, feature flags, SEO defaults) — **singleton**
- **`careerCategory`**: taxonomy helper referenced by `career.categories`

## Career detail modeling (Career page)
The public Career detail page is section-driven. **Section titles are handled in the web app (i18n) and should not be authored in Sanity.**

### Bullet-list sections (reduce editor error)
Some Career sections are displayed as uniform “bullets” on the frontend. To reduce editor error, these fields use `localizedBulletList` (plain strings) instead of rich text:
- `career.responsibilities`
- `career.workEnvironment`
- `career.specializations`
- `career.licensureAndCerts`

Rule of thumb: **enter one bullet per item**. Do not paste headings into these fields.

### Areas of Specialization (note text)
The “Areas of Specialization” section can include an optional supporting sentence/link beneath the bullets:
- `career.specializationsNote` (uses `localizedPortableTextSmall`)

### Top highlights (career detail widgets)
Some values shown in the top highlight widgets are authored as plain text on the Career document:
- `career.academicRequirementsHighlight` (uses `localizedString`)
- `career.programLengthHighlight` (uses `localizedString`)

### Academic Requirements formatting
`career.educationRequirements` uses `localizedPortableTextSmall` so editors only see **Normal** and **Small** style options (no headings).

### Educational programs / institutions
Career pages show an “Educational Programs” section with a map and list.

- Institutions live in the **`educationalInstitution`** collection and include `location` (geopoint).
- Each Career can associate a list of institution items via `career.educationInstitutions[]`, where each item links to an `educationalInstitution` reference and optional `programUrl` (deep link) and optional display `label`.

## Localization (EN/ES)
The app is bilingual (EN/ES). Studio fields use **localized objects**:
- `localizedString`: `{ en: string, es?: string }`
- `localizedText`: `{ en: string, es?: string }`
- `localizedPortableText`: `{ en: PortableText[], es?: PortableText[] }`
- `localizedBulletList`: `{ en: string[], es?: string[] }` (one bullet per item)
- `localizedPortableTextSmall`: `{ en: PortableText[], es?: PortableText[] }` (Normal + Small only)

These types live in `src/schemaTypes/objects/` and are reused across documents.

## Notes on schema evolution
Avoid deleting fields that may have production content. Prefer deprecation patterns:
- `deprecated` + `readOnly: true` + `hidden` (when undefined)

## Common gotchas
- **CORS**: If the web app cannot read from Sanity locally, add `http://localhost:5173` to CORS origins in the Sanity project settings.
- **Dataset is public**: web reads are expected to use CDN (`useCdn: true`) and not require a token for basic browsing.
- **Hosted Studio vs local Studio**: Changes you make locally show up at `http://localhost:3333/` when running `pnpm --filter studio dev`. To update the hosted Studio at `https://careercatalog.sanity.studio/`, run `pnpm studio:deploy` after schema changes.


