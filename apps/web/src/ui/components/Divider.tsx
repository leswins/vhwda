import React from "react"

type Orientation = "horizontal" | "vertical"

export type DividerProps = {
  orientation?: Orientation
  className?: string
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

export function Divider({ orientation = "horizontal", className }: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cx(
        orientation === "horizontal" ? "h-[0.5px] w-full" : "h-full w-[0.5px]",
        "bg-foreground",
        className
      )}
    />
  )
}

