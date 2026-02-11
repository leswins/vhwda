import React, { useState } from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import type { Language } from "../utils/i18n"
import { PageHead } from "../ui/PageHead"
import { Button } from "../ui/components/Button"

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const STAGE_OPTIONS = [
  { value: "high_school", key: "scholarshipForm.stage.highSchool" as const },
  { value: "college", key: "scholarshipForm.stage.college" as const },
  { value: "graduate", key: "scholarshipForm.stage.graduate" as const },
  { value: "working_professional", key: "scholarshipForm.stage.workingProfessional" as const },
  { value: "veteran_military", key: "scholarshipForm.stage.veteranMilitary" as const },
  { value: "adult_returning", key: "scholarshipForm.stage.adultReturning" as const }
]

const FUNDING_OPTIONS = [
  { value: "federal", key: "scholarshipForm.funding.federal" as const },
  { value: "state", key: "scholarshipForm.funding.state" as const },
  { value: "institutional", key: "scholarshipForm.funding.institutional" as const },
  { value: "private", key: "scholarshipForm.funding.private" as const },
  { value: "foundation", key: "scholarshipForm.funding.foundation" as const },
  { value: "other", key: "scholarshipForm.funding.other" as const }
]

const SCOPE_OPTIONS = [
  { value: "virginia_statewide", key: "scholarshipForm.scope.virginiaStatewide" as const },
  { value: "regional", key: "scholarshipForm.scope.regional" as const },
  { value: "national", key: "scholarshipForm.scope.national" as const },
  { value: "local", key: "scholarshipForm.scope.local" as const },
  { value: "international", key: "scholarshipForm.scope.international" as const }
]

const BADGE_OPTIONS = [
  { value: "undergraduate", key: "scholarshipForm.badge.undergraduate" as const },
  { value: "graduate", key: "scholarshipForm.badge.graduate" as const },
  { value: "undergraduate_graduate", key: "scholarshipForm.badge.undergraduateGraduate" as const },
  { value: "multiple_cohorts", key: "scholarshipForm.badge.multipleCohorts" as const },
  { value: "health_related", key: "scholarshipForm.badge.healthRelated" as const }
]

const INPUT_CLASS =
  "w-full border-[0.5px] border-foreground rounded-none px-3 py-2.5 bg-surface text-foreground text-body-base placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 transition-colors"

const TEXTAREA_CLASS = `${INPUT_CLASS} min-h-[100px] resize-y`

const SELECT_CLASS = `${INPUT_CLASS} appearance-none cursor-pointer`

const LABEL_CLASS = "block text-body-sm font-semibold text-foreground mb-[9px]"

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FieldLabel({
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
    <label htmlFor={htmlFor} className={LABEL_CLASS}>
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

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-body-sm text-accentOrange">{message}</p>
}

function CheckboxGroup({
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
      onChange(selected.filter((v) => v !== value))
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

/* ------------------------------------------------------------------ */
/*  Form state                                                         */
/* ------------------------------------------------------------------ */

type FormData = {
  name: string
  institution: string
  summary: string
  description: string
  eligibility: string
  region: string
  deadline: string
  link: string
  current_stage: string[]
  funding_type: string
  location_scope: string
  badges: string[]
  career_areas_text: string
  submitter_name: string
  submitter_email: string
  submitter_organization: string
  notes: string
}

const INITIAL_FORM: FormData = {
  name: "",
  institution: "",
  summary: "",
  description: "",
  eligibility: "",
  region: "",
  deadline: "",
  link: "",
  current_stage: [],
  funding_type: "",
  location_scope: "",
  badges: [],
  career_areas_text: "",
  submitter_name: "",
  submitter_email: "",
  submitter_organization: "",
  notes: ""
}

type FormErrors = Partial<Record<keyof FormData, string>>

function validate(form: FormData, language: Language): FormErrors {
  const errors: FormErrors = {}
  if (!form.name.trim()) errors.name = t(language, "scholarshipForm.validation.nameRequired")
  if (!form.link.trim()) {
    errors.link = t(language, "scholarshipForm.validation.linkRequired")
  } else {
    try {
      new URL(form.link)
    } catch {
      errors.link = t(language, "scholarshipForm.validation.linkInvalid")
    }
  }
  if (!form.submitter_name.trim())
    errors.submitter_name = t(language, "scholarshipForm.validation.submitterNameRequired")
  if (!form.submitter_email.trim()) {
    errors.submitter_email = t(language, "scholarshipForm.validation.submitterEmailRequired")
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submitter_email)) {
    errors.submitter_email = t(language, "scholarshipForm.validation.submitterEmailInvalid")
  }
  return errors
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export function ScholarshipSubmitPage() {
  const { language } = useLanguageStore()
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(false)

    const validationErrors = validate(form, language)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Scroll to first error
      const firstErrorKey = Object.keys(validationErrors)[0]
      document.getElementById(firstErrorKey)?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/scholarship-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      if (!response.ok) throw new Error("Submit failed")

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  function handleReset() {
    setForm(INITIAL_FORM)
    setErrors({})
    setSubmitted(false)
    setSubmitError(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  /* ---- Success state ---- */
  if (submitted) {
    return (
      <>
        <PageHead title={t(language, "page.title.scholarshipSubmit")} description={t(language, "scholarshipForm.subtitle")} />
        <div className="border-b-[0.5px] border-foreground px-5 py-10 lg:p-fluid-50">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accentGreen/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-h2 font-bold tracking-tight text-foreground">
              {t(language, "scholarshipForm.success.title")}
            </h1>
            <p className="text-body-lg text-muted">
              {t(language, "scholarshipForm.success.message")}
            </p>
            <Button variant="dark" onClick={handleReset}>
              {t(language, "scholarshipForm.success.another")}
            </Button>
          </div>
        </div>
      </>
    )
  }

  /* ---- Form ---- */
  return (
    <>
      <PageHead title={t(language, "page.title.scholarshipSubmit")} description={t(language, "scholarshipForm.subtitle")} />

      {/* Header */}
      <div className="border-b-[0.5px] border-foreground px-5 py-10 lg:p-fluid-50">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-h2 font-bold tracking-tight text-foreground">
            {t(language, "scholarshipForm.title")}
          </h1>
          <p className="mt-3 text-body-lg text-muted">
            {t(language, "scholarshipForm.subtitle")}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="px-5 py-10 lg:p-fluid-50">
        <div className="mx-auto max-w-2xl space-y-10">

          {/* Scholarship Details Section */}
          <fieldset className="space-y-6">
            <legend className="text-h4 font-bold tracking-tight text-foreground mb-4">
              {t(language, "scholarshipForm.section.details")}
            </legend>

            {/* Name */}
            <div>
              <FieldLabel htmlFor="name" label={t(language, "scholarshipForm.field.name")} required language={language} />
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.name.placeholder")}
                className={cx(INPUT_CLASS, errors.name && "ring-2 ring-accentOrange")}
              />
              <FieldError message={errors.name} />
            </div>

            {/* Institution */}
            <div>
              <FieldLabel htmlFor="institution" label={t(language, "scholarshipForm.field.institution")} language={language} />
              <input
                id="institution"
                type="text"
                value={form.institution}
                onChange={(e) => updateField("institution", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.institution.placeholder")}
                className={INPUT_CLASS}
              />
            </div>

            {/* Summary */}
            <div>
              <FieldLabel htmlFor="summary" label={t(language, "scholarshipForm.field.summary")} language={language} />
              <textarea
                id="summary"
                value={form.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.summary.placeholder")}
                className={TEXTAREA_CLASS}
                rows={3}
              />
            </div>

            {/* Description */}
            <div>
              <FieldLabel htmlFor="description" label={t(language, "scholarshipForm.field.description")} language={language} />
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.description.placeholder")}
                className={TEXTAREA_CLASS}
                rows={4}
              />
            </div>

            {/* Eligibility */}
            <div>
              <FieldLabel htmlFor="eligibility" label={t(language, "scholarshipForm.field.eligibility")} language={language} />
              <textarea
                id="eligibility"
                value={form.eligibility}
                onChange={(e) => updateField("eligibility", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.eligibility.placeholder")}
                className={TEXTAREA_CLASS}
                rows={3}
              />
            </div>

            {/* Region */}
            <div>
              <FieldLabel htmlFor="region" label={t(language, "scholarshipForm.field.region")} language={language} />
              <input
                id="region"
                type="text"
                value={form.region}
                onChange={(e) => updateField("region", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.region.placeholder")}
                className={INPUT_CLASS}
              />
            </div>

            {/* Deadline */}
            <div>
              <FieldLabel htmlFor="deadline" label={t(language, "scholarshipForm.field.deadline")} language={language} />
              <input
                id="deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => updateField("deadline", e.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            {/* Link */}
            <div>
              <FieldLabel htmlFor="link" label={t(language, "scholarshipForm.field.link")} required language={language} />
              <input
                id="link"
                type="url"
                value={form.link}
                onChange={(e) => updateField("link", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.link.placeholder")}
                className={cx(INPUT_CLASS, errors.link && "ring-2 ring-accentOrange")}
              />
              <FieldError message={errors.link} />
            </div>

            {/* Current Stage */}
            <div>
              <FieldLabel htmlFor="current_stage" label={t(language, "scholarshipForm.field.currentStage")} language={language} />
              <CheckboxGroup
                options={STAGE_OPTIONS}
                selected={form.current_stage}
                onChange={(values) => updateField("current_stage", values)}
                language={language}
              />
            </div>

            {/* Funding Type */}
            <div>
              <FieldLabel htmlFor="funding_type" label={t(language, "scholarshipForm.field.fundingType")} language={language} />
              <select
                id="funding_type"
                value={form.funding_type}
                onChange={(e) => updateField("funding_type", e.target.value)}
                className={SELECT_CLASS}
              >
                <option value="">{t(language, "scholarshipForm.field.fundingType.select")}</option>
                {FUNDING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {t(language, opt.key)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Scope */}
            <div>
              <FieldLabel htmlFor="location_scope" label={t(language, "scholarshipForm.field.locationScope")} language={language} />
              <select
                id="location_scope"
                value={form.location_scope}
                onChange={(e) => updateField("location_scope", e.target.value)}
                className={SELECT_CLASS}
              >
                <option value="">{t(language, "scholarshipForm.field.locationScope.select")}</option>
                {SCOPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {t(language, opt.key)}
                  </option>
                ))}
              </select>
            </div>

            {/* Badges */}
            <div>
              <FieldLabel htmlFor="badges" label={t(language, "scholarshipForm.field.badges")} language={language} />
              <CheckboxGroup
                options={BADGE_OPTIONS}
                selected={form.badges}
                onChange={(values) => updateField("badges", values)}
                language={language}
              />
            </div>

            {/* Career Areas */}
            <div>
              <FieldLabel htmlFor="career_areas_text" label={t(language, "scholarshipForm.field.careerAreas")} language={language} />
              <textarea
                id="career_areas_text"
                value={form.career_areas_text}
                onChange={(e) => updateField("career_areas_text", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.careerAreas.placeholder")}
                className={TEXTAREA_CLASS}
                rows={2}
              />
            </div>
          </fieldset>

          {/* Divider */}
          <div className="border-t-[0.5px] border-foreground" />

          {/* Submitter Info Section */}
          <fieldset className="space-y-6">
            <legend className="text-h4 font-bold tracking-tight text-foreground mb-4">
              {t(language, "scholarshipForm.section.submitter")}
            </legend>

            {/* Submitter Name */}
            <div>
              <FieldLabel htmlFor="submitter_name" label={t(language, "scholarshipForm.field.submitterName")} required language={language} />
              <input
                id="submitter_name"
                type="text"
                value={form.submitter_name}
                onChange={(e) => updateField("submitter_name", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.submitterName.placeholder")}
                className={cx(INPUT_CLASS, errors.submitter_name && "ring-2 ring-accentOrange")}
              />
              <FieldError message={errors.submitter_name} />
            </div>

            {/* Submitter Email */}
            <div>
              <FieldLabel htmlFor="submitter_email" label={t(language, "scholarshipForm.field.submitterEmail")} required language={language} />
              <input
                id="submitter_email"
                type="email"
                value={form.submitter_email}
                onChange={(e) => updateField("submitter_email", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.submitterEmail.placeholder")}
                className={cx(INPUT_CLASS, errors.submitter_email && "ring-2 ring-accentOrange")}
              />
              <FieldError message={errors.submitter_email} />
            </div>

            {/* Submitter Organization */}
            <div>
              <FieldLabel htmlFor="submitter_organization" label={t(language, "scholarshipForm.field.submitterOrg")} language={language} />
              <input
                id="submitter_organization"
                type="text"
                value={form.submitter_organization}
                onChange={(e) => updateField("submitter_organization", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.submitterOrg.placeholder")}
                className={INPUT_CLASS}
              />
            </div>

            {/* Notes */}
            <div>
              <FieldLabel htmlFor="notes" label={t(language, "scholarshipForm.field.notes")} language={language} />
              <textarea
                id="notes"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.notes.placeholder")}
                className={TEXTAREA_CLASS}
                rows={3}
              />
            </div>
          </fieldset>

          {/* Error message */}
          {submitError && (
            <div className="rounded-none bg-accentOrange/10 border-[0.5px] border-accentOrange px-4 py-3">
              <p className="text-body-sm text-foreground">{t(language, "scholarshipForm.error")}</p>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="dark"
              size="lg"
              disabled={submitting}
              className="w-full sm:w-auto !rounded-none"
            >
              {submitting
                ? t(language, "scholarshipForm.submitting")
                : t(language, "scholarshipForm.submit")}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
