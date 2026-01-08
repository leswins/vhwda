import React from "react"

interface CareerTagProps {
  title: string
  onRemove: () => void
}

export function CareerTag({ title, onRemove }: CareerTagProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-foreground bg-surface1 px-4 py-2">
      <span className="text-sm font-medium">{title}</span>
      <button
        onClick={onRemove}
        className="hover:bg-foreground/10 rounded p-1"
        aria-label={`Remove ${title}`}
      >
        <span className="text-lg leading-none" aria-hidden="true">×</span>
      </button>
    </div>
  )
}

