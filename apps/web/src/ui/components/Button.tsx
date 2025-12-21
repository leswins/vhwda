import React from "react"

type Variant = "primary" | "outline" | "dark" | "ghost"
type Size = "sm" | "md" | "lg"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

export function Button({ className, variant = "primary", size = "md", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-primary text-onPrimary hover:bg-primary/90",
        variant === "outline" && "border border-border bg-surface text-foreground hover:bg-surface1",
        variant === "dark" && "bg-foreground text-surface hover:bg-foreground/90",
        variant === "ghost" && "bg-transparent text-foreground hover:bg-surface1",
        size === "sm" && "px-3 py-1.5",
        size === "md" && "px-4 py-2",
        size === "lg" && "px-5 py-3 text-base",
        className
      )}
      {...props}
    />
  )
}

