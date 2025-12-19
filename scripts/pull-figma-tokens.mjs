/**
 * Placeholder token pull script.
 *
 * This repo expects tokens to be sourced from Figma variables via MCP and written into:
 * - apps/web/src/styles/tokens.css
 *
 * Since MCP tools are executed by agents (not by Node in CI), keep this script as a thin
 * wrapper that documents the workflow and fails loudly if run directly.
 */

console.error(
    [
        "Token pull is performed via Figma MCP (agent tooling), not a direct Node script.",
        "",
        "Use MCP calls documented in docs/design-system.md:",
        '- get_variable_defs({ nodeId: "411:1329", clientLanguages: "typescript,css", clientFrameworks: "react" })',
        "",
        "Then update apps/web/src/styles/tokens.css accordingly."
    ].join("\n")
)
process.exit(1)


