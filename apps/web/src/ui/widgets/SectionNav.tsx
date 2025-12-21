import React, { useEffect, useMemo, useState } from "react"

export type SectionNavItem = {
  id: string
  label: string
}

type Props = {
  items: SectionNavItem[]
  /** Sticky offset from top in px (e.g. header height) */
  offsetTopPx?: number
  ariaLabel: string
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

export function SectionNav({ items, offsetTopPx = 0, ariaLabel }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id)

  const ids = useMemo(() => items.map((i) => i.id), [items])

  useEffect(() => {
    if (!ids.length) return

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the first intersecting entry closest to top
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0))[0]

        if (visible?.target?.id) setActiveId(visible.target.id)
      },
      {
        root: null,
        rootMargin: `-${Math.max(offsetTopPx + 40, 0)}px 0px -60% 0px`,
        threshold: [0.01, 0.1, 0.25]
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, offsetTopPx])

  return (
    <div
      className="sticky z-20 border-b border-foreground bg-surface"
      style={{ top: offsetTopPx }}
      role="navigation"
      aria-label={ariaLabel}
    >
      <div className="mx-auto flex max-w-[1368px] overflow-x-auto">
        {items.map((item, idx) => {
          const isActive = activeId === item.id
          return (
            <React.Fragment key={item.id}>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById(item.id)
                  el?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
                className={cx(
                  "min-w-[220px] shrink-0 px-7 py-5 text-left text-sm",
                  isActive ? "font-bold text-foreground" : "font-medium text-foreground/50 hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </button>
              {idx !== items.length - 1 ? <div className="my-4 w-px bg-foreground/20" /> : null}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

