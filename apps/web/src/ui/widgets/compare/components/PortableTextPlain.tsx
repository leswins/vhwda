import React from "react"

interface PortableTextBlock {
  _type?: string
  _key?: string
  style?: string
  children?: Array<{ text?: string }>
}

interface PortableTextPlainProps {
  value?: PortableTextBlock[]
}

export function PortableTextPlain({ value }: PortableTextPlainProps) {
  if (!value?.length) return null

  const blocks = value.filter((b) => b?._type === "block" && Array.isArray(b?.children))

  if (!blocks.length) return null

  return (
    <div className="space-y-3">
      {blocks.map((b) => {
        const text = (b.children ?? []).map((c) => c?.text ?? "").join("")
        if (!text.trim()) return null

        const style = b?.style ?? "normal"
        const className =
          style === "small" ? "text-sm text-foreground/70" : "text-lg text-foreground"

        return (
          <p key={b._key ?? text} className={className}>
            {text}
          </p>
        )
      })}
    </div>
  )
}

