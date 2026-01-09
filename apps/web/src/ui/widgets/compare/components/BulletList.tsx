import React from "react"

interface BulletListProps {
  items?: string[]
}

export function BulletList({ items }: BulletListProps) {
  if (!items?.length) return null
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accentOrange" aria-hidden="true" />
          <span className="text-sm leading-relaxed">{item}</span>
        </div>
      ))}
    </div>
  )
}

