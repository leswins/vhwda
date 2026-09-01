import React from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"

export const FORM_INPUT_CLASS =
  "w-full border-[0.5px] border-foreground rounded-none px-3 py-2.5 bg-surface text-foreground text-body-base placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 transition-colors"

export const FORM_TEXTAREA_CLASS = `${FORM_INPUT_CLASS} min-h-[100px] resize-y`

export const FORM_SELECT_CLASS = `${FORM_INPUT_CLASS} appearance-none cursor-pointer`

export const FORM_LABEL_CLASS = "block text-body-sm font-semibold text-foreground mb-[9px]"

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

export function FieldLabel({
  htmlFor,
  label,
  required,
  language
}: {
  htmlFor: string
  label: string
  required?: boolean
  language: Language
}) {
  return (
    <label htmlFor={htmlFor} className={FORM_LABEL_CLASS}>
      {label}
      {required ? (
        <span className="ml-1 text-accentOrange text-body-sm font-normal">
          ({t(language, "scholarshipForm.required")})
        </span>
      ) : (
        <span className="ml-1 text-muted text-body-sm font-normal">
          ({t(language, "scholarshipForm.optional")})
        </span>
      )}
    </label>
  )
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-body-sm text-accentOrange">{message}</p>
}

export function CheckboxGroup({
  options,
  selected,
  onChange,
  language
}: {
  options: Array<{ value: string; key: Parameters<typeof t>[1] }>
  selected: string[]
  onChange: (values: string[]) => void
  language: Language
}) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const checked = selected.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={cx(
              "inline-flex items-center gap-1.5 rounded-none border-[0.5px] px-3 py-1.5 text-body-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
              checked
                ? "border-foreground bg-foreground text-surface"
                : "border-foreground bg-surface text-foreground hover:bg-surface1"
            )}
          >
            {t(language, opt.key)}
          </button>
        )
      })}
    </div>
  )
}
