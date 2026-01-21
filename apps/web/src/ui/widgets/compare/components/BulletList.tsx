import React from "react"

interface BulletListProps {
  items?: string[]
}

export function BulletList({ items }: BulletListProps) {
  if (!items?.length) return null
  return (
    <div className="flex flex-col gap-[15px]">
      {items.map((item, idx) => (
        <p 
          key={idx} 
          className="text-[length:var(--text-body-base)] font-medium leading-[var(--leading-body-base)] tracking-[var(--tracking-body-base)]"
        >
          {item}
        </p>
      ))}
    </div>
  )
}

