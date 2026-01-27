import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens -> CSS vars defined in src/styles/tokens.css
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        onPrimary: "rgb(var(--color-on-primary) / <alpha-value>)",
        surface1: "rgb(var(--color-surface-1) / <alpha-value>)",
        surface2: "rgb(var(--color-surface-2) / <alpha-value>)",
        onSurfaceSecondary: "rgb(var(--color-on-surface-secondary) / <alpha-value>)",
        onSurfaceDisabled: "rgb(var(--color-on-surface-disabled) / <alpha-value>)",
        onSurfaceDisabledLight: "rgb(var(--color-on-surface-disabled-light) / <alpha-value>)",
        accentPink: "rgb(var(--color-accent-pink) / <alpha-value>)",
        accentOrange: "rgb(var(--color-accent-orange) / <alpha-value>)",
        accentYellow: "rgb(var(--color-accent-yellow) / <alpha-value>)",
        accentBlue: "rgb(var(--color-accent-blue) / <alpha-value>)",
        accentGreen: "rgb(var(--color-accent-green) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"]
      },
      fontSize: {
        h1: ["var(--text-h1)", { lineHeight: "var(--leading-h1)", letterSpacing: "var(--tracking-h1)", fontWeight: "700" }],
        h2: ["var(--text-h2)", { lineHeight: "var(--leading-h2)", letterSpacing: "var(--tracking-h2)", fontWeight: "700" }],
        h3: ["var(--text-h3)", { lineHeight: "var(--leading-h3)", letterSpacing: "var(--tracking-h3)", fontWeight: "var(--font-weight-h3)" }],
        h4: ["var(--text-h4)", { lineHeight: "var(--leading-h4)", letterSpacing: "var(--tracking-h4)", fontWeight: "600" }],
        h5: ["var(--text-h5)", { lineHeight: "var(--leading-h5)", letterSpacing: "var(--tracking-h5)", fontWeight: "700" }],
        sub1: ["var(--text-sub1)", { lineHeight: "var(--leading-sub1)", letterSpacing: "var(--tracking-sub1)", fontWeight: "500" }],
        sub2: ["var(--text-sub2)", { lineHeight: "var(--leading-sub2)", letterSpacing: "var(--tracking-sub2)", fontWeight: "700" }],
        "body-lg": ["var(--text-body-lg)", { lineHeight: "var(--leading-body-lg)", letterSpacing: "var(--tracking-body-lg)", fontWeight: "500" }],
        "body-base": ["var(--text-body-base)", { lineHeight: "var(--leading-body-base)", letterSpacing: "var(--tracking-body-base)", fontWeight: "500" }],
        "body-sm": ["var(--text-body-sm)", { lineHeight: "var(--leading-body-sm)", letterSpacing: "var(--tracking-body-sm)", fontWeight: "500" }],
      },
      borderRadius: {
        md: "var(--radius-md)"
      },
      borderWidth: {
        DEFAULT: "0.5px"
      },
      spacing: {
        // Fluid spacing tokens -> CSS vars defined in src/styles/tokens.css
        'fluid-50': 'var(--space-50)',
        'fluid-40': 'var(--space-40)',
        'fluid-30': 'var(--space-30)',
        'fluid-25': 'var(--space-25)',
        'fluid-20': 'var(--space-20)',
        'fluid-15': 'var(--space-15)',
        'fluid-12': 'var(--space-12)',
        'fluid-10': 'var(--space-10)',
        'fluid-7': 'var(--space-7)',
        'fluid-5': 'var(--space-5)',
        // Fluid icon sizes
        'icon-35': 'var(--icon-35)',
        'icon-30': 'var(--icon-30)',
        'icon-25': 'var(--icon-25)',
        'icon-20': 'var(--icon-20)',
      }
    }
  },
  plugins: []
} satisfies Config


