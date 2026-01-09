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
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "rounded-md bg-primary text-sm text-onPrimary hover:bg-primary/90",
        variant === "outline" && "rounded-md border border-border bg-surface text-sm text-foreground hover:bg-surface1",
        variant === "dark" && "border border-foreground bg-foreground text-base text-surface hover:bg-foreground/90",
        variant === "ghost" && "rounded-md bg-transparent text-sm text-foreground hover:bg-surface1",
        size === "sm" && "px-3 py-1.5",
        size === "md" && "px-[15px] py-2.5",
        size === "lg" && "px-5 py-3",
        className
      )}
      {...props}
    />
  )
}

