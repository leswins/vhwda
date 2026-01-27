# Responsive Design System

This document describes how responsive design is implemented across the VHWDA web application. The system uses **fluid scaling** via CSS `clamp()` functions, allowing elements to scale smoothly with viewport width rather than jumping between breakpoints.

## Overview

The design scales proportionally between two reference points:
- **Mobile**: 375px viewport width
- **Desktop**: 1512px viewport width

All fluid values are defined as CSS custom properties in `apps/web/src/styles/tokens.css` and exposed as Tailwind utilities via `apps/web/tailwind.config.ts`.

## The `clamp()` Formula

All fluid values use the CSS `clamp()` function:

```css
clamp(min, preferred, max)
```

The preferred value is calculated so that:
- At 375px viewport → the value equals the mobile size
- At 1512px viewport → the value equals the desktop size
- Between these viewports → the value scales linearly

**Formula breakdown:**
```
clamp(mobile_rem, base_rem + vw_coefficient, desktop_rem)

where:
- vw_coefficient = (desktop_px - mobile_px) / 1137 * 100
- base_rem = (mobile_px - (375 * vw_coefficient / 100)) / 16
```

---

## Typography

Typography scales fluidly using the same `clamp()` approach.

### Available Type Styles

| Token | Mobile (375px) | Desktop (1512px) | Tailwind Class |
|-------|---------------|------------------|----------------|
| H1 | 36px | 72px | `text-h1` |
| H2 | 30px | 48px | `text-h2` |
| H3 | 24px | 36px | `text-h3` |
| H4 | 18px | 24px | `text-h4` |
| H5 | 16px | 20px | `text-h5` |
| Subheading 1 | 18px | 24px | `text-sub1` |
| Subheading 2 | 12px | 16px | `text-sub2` |
| Body Large | 16px | 20px | `text-body-lg` |
| Body Base | 14px | 16px | `text-body-base` |
| Body Small | 12px | 14px | `text-body-sm` |

### Usage

```tsx
<h1 className="text-h1">Heading</h1>
<p className="text-body-lg">Body text</p>
```

Each typography class includes:
- Fluid font size
- Line height
- Letter spacing
- Font weight

---

## Spacing

Spacing values (padding, margin, gap) scale fluidly for values ≤50px.

### Available Spacing Tokens

| Token | Mobile (375px) | Desktop (1512px) | Tailwind Class |
|-------|---------------|------------------|----------------|
| Space 50 | 35px | 50px | `fluid-50` |
| Space 40 | 30px | 40px | `fluid-40` |
| Space 30 | 20px | 30px | `fluid-30` |
| Space 25 | 17.5px | 25px | `fluid-25` |
| Space 20 | 15px | 20px | `fluid-20` |
| Space 15 | 10px | 15px | `fluid-15` |
| Space 12 | 8.25px | 12.5px | `fluid-12` |
| Space 10 | 7.5px | 10px | `fluid-10` |
| Space 7 | 5px | 7.5px | `fluid-7` |
| Space 5 | 2.5px | 5px | `fluid-5` |

### Usage

These tokens work with all Tailwind spacing utilities:

```tsx
// Padding
<div className="p-fluid-50">...</div>
<div className="px-fluid-30 py-fluid-20">...</div>

// Margin
<div className="mt-fluid-25 mb-fluid-15">...</div>

// Gap
<div className="flex gap-fluid-20">...</div>

// Space between
<div className="space-y-fluid-10">...</div>
```

### Migration from Arbitrary Values

When converting existing code:

| Old (Arbitrary) | New (Fluid) |
|-----------------|-------------|
| `p-[50px]` | `p-fluid-50` |
| `px-[30px]` | `px-fluid-30` |
| `gap-[25px]` | `gap-fluid-25` |
| `mt-[20px]` | `mt-fluid-20` |
| `space-y-[10px]` | `space-y-fluid-10` |

---

## Icon Sizes

Icon dimensions scale fluidly for common icon sizes.

### Available Icon Tokens

| Token | Mobile (375px) | Desktop (1512px) | Tailwind Class |
|-------|---------------|------------------|----------------|
| Icon 35 | 25px | 35px | `icon-35` |
| Icon 30 | 20px | 30px | `icon-30` |
| Icon 25 | 17.5px | 25px | `icon-25` |
| Icon 20 | 15px | 20px | `icon-20` |

### Usage

```tsx
// Width and height
<div className="w-icon-30 h-icon-30">
  <IconComponent />
</div>

// Square sizing
<img className="w-icon-25 h-icon-25" src="..." />
```

---

## What Stays Fixed

**Large layout values (75px+) remain fixed** and should continue using Tailwind's arbitrary value syntax:

- Container max-widths: `max-w-[1200px]`, `max-w-[500px]`
- Fixed layout widths: `w-[492px]`, `w-[520px]`
- Large heights: `h-[650px]`, `h-[750px]`
- Component-specific fixed dimensions: `h-[75px]` (header height)

These values are intentionally not fluid because:
1. They represent structural layout constraints
2. Scaling them could break the intended design
3. They often interact with grid/container systems

---

## CSS Variables Reference

All fluid values are defined in `apps/web/src/styles/tokens.css`:

```css
:root {
  /* Typography */
  --text-h1: clamp(2.25rem, 1.5rem + 3.17vw, 4.5rem);
  --text-h2: clamp(1.875rem, 1.4rem + 1.58vw, 3rem);
  /* ... etc */

  /* Spacing */
  --space-50: clamp(2.1875rem, 1.88rem + 1.32vw, 3.125rem);
  --space-40: clamp(1.875rem, 1.67rem + 0.88vw, 2.5rem);
  /* ... etc */

  /* Icon Sizes */
  --icon-35: clamp(1.5625rem, 1.36rem + 0.88vw, 2.1875rem);
  --icon-30: clamp(1.25rem, 1.04rem + 0.88vw, 1.875rem);
  /* ... etc */
}
```

---

## Tailwind Configuration

The tokens are exposed via `apps/web/tailwind.config.ts`:

```typescript
theme: {
  extend: {
    fontSize: {
      h1: ["var(--text-h1)", { lineHeight: "var(--leading-h1)", ... }],
      // ... etc
    },
    spacing: {
      'fluid-50': 'var(--space-50)',
      'fluid-40': 'var(--space-40)',
      // ... etc
      'icon-35': 'var(--icon-35)',
      'icon-30': 'var(--icon-30)',
      // ... etc
    }
  }
}
```

---

## Testing Responsiveness

When testing fluid scaling:

1. **Mobile (375px)**: Values should be at their minimum
2. **Desktop (1512px)**: Values should be at their maximum
3. **Intermediate widths**: Values should scale smoothly (no jumps)

Use browser DevTools to resize the viewport and observe smooth transitions.

---

## Adding New Fluid Values

To add a new fluid spacing value:

1. **Calculate the `clamp()` values:**
   ```
   vw_coefficient = (desktop_px - mobile_px) / 1137 * 100
   base_px = mobile_px - (375 * vw_coefficient / 100)
   base_rem = base_px / 16
   mobile_rem = mobile_px / 16
   desktop_rem = desktop_px / 16
   ```

2. **Add to `tokens.css`:**
   ```css
   --space-XX: clamp(mobile_rem, base_rem + vw_coefficient, desktop_rem);
   ```

3. **Add to `tailwind.config.ts`:**
   ```typescript
   spacing: {
     'fluid-XX': 'var(--space-XX)',
   }
   ```

---

## Summary

| Category | Approach | Example Classes |
|----------|----------|-----------------|
| Typography | Fluid via `clamp()` | `text-h1`, `text-body-lg` |
| Small spacing (≤50px) | Fluid via `clamp()` | `p-fluid-50`, `gap-fluid-20` |
| Icon dimensions | Fluid via `clamp()` | `w-icon-30`, `h-icon-25` |
| Large layout values | Fixed (arbitrary) | `max-w-[1200px]`, `h-[650px]` |
| Colors, borders | Static | `bg-surface`, `border-foreground` |
