import React from "react"

interface BulletListProps {
  items?: string[]
}

export function BulletList({ items }: BulletListProps) {
  if (!items?.length) return null
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accentOrange" aria-hidden="true" />
          <span className="text-lg">{item}</span>
        </div>
      ))}
    </div>
  )
}

