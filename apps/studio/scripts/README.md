# Migration Scripts

## Hard Filters Migration

Migrates career documents from legacy hard filter fields to the new checklist format.

### Prerequisites

1. **Get a Sanity API Token**:
   - Go to https://sanity.io/manage
   - Select your project (`j0yc55ca`)
   - Go to "API" → "Tokens"
   - Create a new token with "Editor" permissions (or higher)

2. **Set the token as environment variable**:
   ```bash
   export SANITY_API_TOKEN='your-token-here'
   ```
   
   Or create a `.env` file in `apps/studio/`:
   ```
   SANITY_API_TOKEN=your-token-here
   ```

### Running the Migration

From the repo root:
```bash
pnpm --filter studio migrate:hard-filters
```

Or from `apps/studio/`:
```bash
pnpm migrate:hard-filters
```

### What it does

1. Fetches all career documents
2. Converts legacy fields to new `hardFilters` array:
   - `educationMin` → `education_ceiling` filter
   - `licensureRequired` → `licensure_required` filter
   - `hardRequirements.requiresLifting` → `dealbreaker_lifting` filter
   - `hardRequirements.requiresNightsWeekends` → `dealbreaker_nights_weekends` filter
   - `hardRequirements.requiresBloodNeedles` → `dealbreaker_blood_needles` filter
   - `hardRequirements.requiresAcuteStress` → `dealbreaker_high_stress` filter
   - `salary.rangeMin` → `min_start_salary` filter (if > 0)
3. Skips careers that already have `hardFilters` (already migrated)
4. Updates careers in Sanity

### Safety

- The script only **adds** new `hardFilters`, it doesn't remove legacy fields
- Careers that already have `hardFilters` are skipped
- Each migration includes a note indicating it was migrated from legacy fields
- The script shows a summary of what was migrated

### Verifying in Sanity Studio

After running the migration:

1. Open Sanity Studio: `pnpm --filter studio dev`
2. Navigate to a Career document
3. Check the "Hard Filter Requirements (Checklist)" section
4. You should see the migrated filters with notes like "Migrated from educationMin field"

### Rollback

If you need to rollback, you can manually:
1. Remove items from the `hardFilters` array in Sanity Studio
2. The legacy fields are still present (marked as deprecated)

---

## Professional Organizations Enrichment

Populates missing `description`, `membershipType`, `geographicFocus`, and `careerAreas`
for Professional Organization documents using Gemini.

### Prerequisites

1. **Sanity API Token** (Editor or higher):
   ```
   SANITY_API_TOKEN=your-token-here
   ```

2. **Gemini API Key**:
   ```
   GEMINI_API_KEY=your-key-here
   ```

### Running the script

From the repo root:
```bash
pnpm --filter studio migrate:professional-orgs -- --dry-run --limit 10
```

Remove `--dry-run` to apply changes. Optionally set the model:
```bash
GEMINI_MODEL=gemini-1.5-flash pnpm --filter studio migrate:professional-orgs
```

---

## Fix Missing Career Area Keys

Adds missing `_key` values to `careerAreas` array items for Professional Organizations,
then republishes the documents so changes are live.

### Running the script

From the repo root:
```bash
pnpm --filter studio fix:professional-org-career-keys -- --dry-run --limit 10
```

Remove `--dry-run` to apply changes:
```bash
pnpm --filter studio fix:professional-org-career-keys
```

