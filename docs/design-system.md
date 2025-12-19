# Design System

## Source of truth
- **Figma file**: `VHWDA` (`M7AFcGjm2vdq1H1KlIn28c`)
- **Reference node**: `411:1329`

## Token strategy (Figma → CSS variables → Tailwind)
We treat Figma variables as the **authoritative token source**, but we expose them to the app as **CSS variables** so:
- tokens can be themed centrally
- Tailwind utilities stay semantic (`bg-surface`, `text-foreground`, etc.)
- we avoid hardcoded colors in components

### Files
- `apps/web/src/styles/tokens.css`: generated/maintained token CSS variables
- `apps/web/tailwind.config.ts`: Tailwind theme maps semantic names to CSS variables
- `apps/web/src/styles/globals.css`: base typography + focus styles

## Pull tokens using Figma MCP
1. Extract variables for the node:
   - `get_variable_defs({ nodeId: \"411:1329\", clientLanguages: \"typescript,css\", clientFrameworks: \"react\" })`
2. If you get no variables, locate the variables/tokens node(s):
   - `get_metadata({ nodeId: \"411:1329\", clientLanguages: \"unknown\", clientFrameworks: \"unknown\" })`
   - then `get_design_context(...)` on likely token nodes/pages
   - re-run `get_variable_defs(...)` on the token node(s)
3. Map variables into `tokens.css` as:
   - **semantic tokens** (recommended): `--color-surface`, `--color-foreground`, `--color-primary`, etc.
   - **scale tokens** (optional): `--space-1..n`, `--radius-sm..xl`, `--font-size-...`

## Mapping rules (recommended)
- Prefer **semantic** tokens in Tailwind config (component usage should stay stable even if palette changes).
- Keep raw palette tokens available as escape hatches, but discourage direct usage in UI components.


