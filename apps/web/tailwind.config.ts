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
        accentPink: "rgb(var(--color-accent-pink) / <alpha-value>)",
        accentOrange: "rgb(var(--color-accent-orange) / <alpha-value>)",
        accentYellow: "rgb(var(--color-accent-yellow) / <alpha-value>)",
        accentBlue: "rgb(var(--color-accent-blue) / <alpha-value>)",
        accentGreen: "rgb(var(--color-accent-green) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      borderRadius: {
        md: "var(--radius-md)"
      }
    }
  },
  plugins: []
} satisfies Config


