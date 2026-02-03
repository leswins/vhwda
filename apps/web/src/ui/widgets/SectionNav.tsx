import React, { useEffect, useMemo, useRef, useState } from "react"

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
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const ids = useMemo(() => items.map((i) => i.id), [items])

  useEffect(() => {
    if (!ids.length) return

    const getNavHeight = () => (window.innerWidth < 1024 ? 60 : 90)

    const handleScroll = () => {
      const scrollY = window.scrollY
      const triggerPoint = scrollY + offsetTopPx + getNavHeight() + 50

      let currentId = ids[0]

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue

        const top = el.offsetTop
        if (top <= triggerPoint) {
          currentId = id
        } else {
          break
        }
      }

      setActiveId(currentId)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [ids, offsetTopPx])

  // Auto-scroll the nav to show active item on the left
  useEffect(() => {
    if (!activeId || !scrollContainerRef.current) return

    const button = buttonRefs.current.get(activeId)
    if (!button) return

    const container = scrollContainerRef.current
    const buttonLeft = button.offsetLeft
    
    container.scrollTo({
      left: buttonLeft,
      behavior: "smooth"
    })
  }, [activeId])

  return (
    <div
      className="sticky z-20 flex h-[60px] items-center border-y-[0.5px] border-foreground bg-surface py-[15px] lg:block lg:h-auto lg:py-5"
      style={{ top: offsetTopPx }}
      role="navigation"
      aria-label={ariaLabel}
    >
      <div 
        ref={scrollContainerRef}
        className="mx-auto flex h-full items-center max-w-[1368px] overflow-x-auto scrollbar-hide lg:h-auto lg:items-stretch"
      >
        {items.map((item, idx) => {
          const isActive = activeId === item.id
          return (
            <React.Fragment key={item.id}>
              <button
                ref={(el) => {
                  if (el) buttonRefs.current.set(item.id, el)
                }}
                type="button"
                onClick={() => {
                  const el = document.getElementById(item.id)
                  el?.scrollIntoView({ behavior: "smooth", block: "start" })
                }}
                className={cx(
                  "flex h-full min-w-[220px] shrink-0 items-center justify-center px-[30px] py-0 text-center text-sm lg:py-[20px]",
                  isActive ? "font-bold text-foreground" : "font-medium text-foreground/50 hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </button>
              {idx !== items.length - 1 ? <div className="w-[0.5px] shrink-0 bg-foreground self-stretch" /> : null}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

