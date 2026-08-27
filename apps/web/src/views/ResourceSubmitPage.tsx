import React, { useEffect, useMemo, useState } from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import type { Language } from "../utils/i18n"
import { PageHead } from "../ui/PageHead"
import { Button } from "../ui/components/Button"
import { CheckboxGroup, FieldError, FieldLabel, FORM_INPUT_CLASS, FORM_SELECT_CLASS, FORM_TEXTAREA_CLASS, cx } from "../ui/forms/fields"
import {
  fetchResourceTypes,
  getResourceTypeLabel,
  type ResourceType
} from "../sanity/queries/resourceTypes"
import { canChooseResourceDestination, destinationForAudience } from "../lib/resourceDestination"

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

type FormData = {
  resource_type_slug: string
  destination: "public_hub" | "teacher_portal"
  name: string
  institution: string
  summary: string
  description: string
  eligibility: string
  region: string
  deadline: string
  link: string
  file_url: string
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
  resource_type_slug: "scholarships",
  destination: "public_hub",
  name: "",
  institution: "",
  summary: "",
  description: "",
  eligibility: "",
  region: "",
  deadline: "",
  link: "",
  file_url: "",
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

function validate(form: FormData, language: Language, selectedType?: ResourceType): FormErrors {
  const errors: FormErrors = {}
  if (!form.name.trim()) errors.name = t(language, "resourceForm.validation.nameRequired")
  if (!form.submitter_name.trim()) errors.submitter_name = t(language, "scholarshipForm.validation.submitterNameRequired")
  if (!form.submitter_email.trim()) {
    errors.submitter_email = t(language, "scholarshipForm.validation.submitterEmailRequired")
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submitter_email)) {
    errors.submitter_email = t(language, "scholarshipForm.validation.submitterEmailInvalid")
  }

  const teacherFileOk = form.destination === "teacher_portal" && Boolean(form.file_url.trim())
  if (!form.link.trim() && !teacherFileOk) {
    errors.link = t(language, "scholarshipForm.validation.linkRequired")
  } else if (form.link.trim()) {
    try {
      new URL(form.link)
    } catch {
      errors.link = t(language, "scholarshipForm.validation.linkInvalid")
    }
  }

  if (form.file_url.trim()) {
    try {
      new URL(form.file_url)
    } catch {
      errors.file_url = t(language, "scholarshipForm.validation.linkInvalid")
    }
  }

  if (!form.resource_type_slug && !selectedType) {
    errors.resource_type_slug = t(language, "resourceForm.validation.typeRequired")
  }

  return errors
}

export function ResourceSubmitPage() {
  const { language } = useLanguageStore()
  const [types, setTypes] = useState<ResourceType[]>([])
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchResourceTypes().then((all) => {
      if (cancelled) return
      const formTypes = all.filter((type) => type.showInSubmissionForm !== false)
      setTypes(formTypes)
      setForm((prev) => {
        const slug = formTypes.some((type) => type.slug === prev.resource_type_slug)
          ? prev.resource_type_slug
          : (formTypes[0]?.slug ?? "scholarships")
        const nextType = formTypes.find((type) => type.slug === slug)
        return {
          ...prev,
          resource_type_slug: slug,
          destination: destinationForAudience(nextType?.audience, prev.destination)
        }
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const selectedType = useMemo(
    () => types.find((type) => type.slug === form.resource_type_slug) ?? types[0],
    [form.resource_type_slug, types]
  )

  const showScholarshipFields = selectedType?.sourceKind === "scholarship"
  const canChooseDestination = canChooseResourceDestination(selectedType?.audience)
  const showFileField =
    form.destination === "teacher_portal" || Boolean(selectedType?.allowFileAttachment)

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

  function handleTypeChange(slug: string) {
    const nextType = types.find((type) => type.slug === slug)
    setForm((prev) => ({
      ...prev,
      resource_type_slug: slug,
      destination: destinationForAudience(nextType?.audience, prev.destination)
    }))
    if (errors.resource_type_slug) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next.resource_type_slug
        return next
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(false)
    const validationErrors = validate(form, language, selectedType)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const firstErrorKey = Object.keys(validationErrors)[0]
      document.getElementById(firstErrorKey)?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/scholarship-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          resource_type_id: selectedType?._id.startsWith("fallback.") ? null : selectedType?._id
        })
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
    const firstType = types[0]
    setForm({
      ...INITIAL_FORM,
      resource_type_slug: firstType?.slug ?? "scholarships",
      destination: destinationForAudience(firstType?.audience, "public_hub")
    })
    setErrors({})
    setSubmitted(false)
    setSubmitError(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (submitted) {
    return (
      <>
        <PageHead title={t(language, "page.title.resourceSubmit")} description={t(language, "resourceForm.subtitle")} />
        <div className="min-h-[100vh] border-b-[0.5px] border-foreground px-5 py-10 lg:p-fluid-50">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accentGreen/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-h2 font-bold tracking-tight text-foreground">
              {t(language, "resourceForm.success.title")}
            </h1>
            <p className="text-body-lg text-muted">{t(language, "resourceForm.success.message")}</p>
            <Button variant="dark" onClick={handleReset}>
              {t(language, "resourceForm.success.another")}
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHead title={t(language, "page.title.resourceSubmit")} description={t(language, "resourceForm.subtitle")} />

      <div className="border-b-[0.5px] border-foreground px-5 py-10 lg:p-fluid-50">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-h2 font-bold tracking-tight text-foreground">{t(language, "resourceForm.title")}</h1>
          <p className="mt-3 text-body-lg text-muted">{t(language, "resourceForm.subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="min-h-[100vh] px-5 py-10 lg:p-fluid-50">
        <div className="mx-auto max-w-2xl space-y-10">
          <fieldset className="space-y-6">
            <legend className="text-h4 font-bold tracking-tight text-foreground mb-4">
              {t(language, "resourceForm.section.type")}
            </legend>

            <div>
              <FieldLabel htmlFor="resource_type_slug" label={t(language, "resourceForm.field.type")} required language={language} />
              <select
                id="resource_type_slug"
                value={form.resource_type_slug}
                onChange={(e) => handleTypeChange(e.target.value)}
                className={cx(FORM_SELECT_CLASS, errors.resource_type_slug && "ring-2 ring-accentOrange")}
              >
                {types.map((type) => (
                  <option key={type._id} value={type.slug}>
                    {getResourceTypeLabel(language, type)}
                  </option>
                ))}
              </select>
              <FieldError message={errors.resource_type_slug} />
            </div>

            {canChooseDestination ? (
              <div>
                <FieldLabel htmlFor="destination" label={t(language, "resourceForm.field.destination")} required language={language} />
                <select
                  id="destination"
                  value={form.destination}
                  onChange={(e) => updateField("destination", e.target.value as FormData["destination"])}
                  className={FORM_SELECT_CLASS}
                >
                  <option value="public_hub">{t(language, "resourceForm.destination.publicHub")}</option>
                  <option value="teacher_portal">{t(language, "resourceForm.destination.teacherPortal")}</option>
                </select>
              </div>
            ) : null}
          </fieldset>

          <fieldset className="space-y-6">
            <legend className="text-h4 font-bold tracking-tight text-foreground mb-4">
              {t(language, "resourceForm.section.details")}
            </legend>

            <div>
              <FieldLabel htmlFor="name" label={t(language, "resourceForm.field.name")} required language={language} />
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder={t(language, "resourceForm.field.name.placeholder")}
                className={cx(FORM_INPUT_CLASS, errors.name && "ring-2 ring-accentOrange")}
              />
              <FieldError message={errors.name} />
            </div>

            <div>
              <FieldLabel htmlFor="institution" label={t(language, "scholarshipForm.field.institution")} language={language} />
              <input
                id="institution"
                type="text"
                value={form.institution}
                onChange={(e) => updateField("institution", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.institution.placeholder")}
                className={FORM_INPUT_CLASS}
              />
            </div>

            <div>
              <FieldLabel htmlFor="summary" label={t(language, "scholarshipForm.field.summary")} language={language} />
              <textarea
                id="summary"
                value={form.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.summary.placeholder")}
                className={FORM_TEXTAREA_CLASS}
                rows={3}
              />
            </div>

            <div>
              <FieldLabel htmlFor="description" label={t(language, "scholarshipForm.field.description")} language={language} />
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.description.placeholder")}
                className={FORM_TEXTAREA_CLASS}
                rows={4}
              />
            </div>

            <div>
              <FieldLabel htmlFor="eligibility" label={t(language, "scholarshipForm.field.eligibility")} language={language} />
              <textarea
                id="eligibility"
                value={form.eligibility}
                onChange={(e) => updateField("eligibility", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.eligibility.placeholder")}
                className={FORM_TEXTAREA_CLASS}
                rows={3}
              />
            </div>

            <div>
              <FieldLabel htmlFor="region" label={t(language, "scholarshipForm.field.region")} language={language} />
              <input
                id="region"
                type="text"
                value={form.region}
                onChange={(e) => updateField("region", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.region.placeholder")}
                className={FORM_INPUT_CLASS}
              />
            </div>

            <div>
              <FieldLabel htmlFor="deadline" label={t(language, "scholarshipForm.field.deadline")} language={language} />
              <input
                id="deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => updateField("deadline", e.target.value)}
                className={FORM_INPUT_CLASS}
              />
            </div>

            <div>
              <FieldLabel
                htmlFor="link"
                label={t(language, "scholarshipForm.field.link")}
                required={form.destination !== "teacher_portal"}
                language={language}
              />
              <input
                id="link"
                type="url"
                value={form.link}
                onChange={(e) => updateField("link", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.link.placeholder")}
                className={cx(FORM_INPUT_CLASS, errors.link && "ring-2 ring-accentOrange")}
              />
              <FieldError message={errors.link} />
            </div>

            {showFileField ? (
              <div>
                <FieldLabel htmlFor="file_url" label={t(language, "resourceForm.field.fileUrl")} language={language} />
                <input
                  id="file_url"
                  type="url"
                  value={form.file_url}
                  onChange={(e) => updateField("file_url", e.target.value)}
                  placeholder={t(language, "resourceForm.field.fileUrl.placeholder")}
                  className={cx(FORM_INPUT_CLASS, errors.file_url && "ring-2 ring-accentOrange")}
                />
                <p className="mt-1 text-body-sm text-muted">{t(language, "resourceForm.field.fileUrl.help")}</p>
                <FieldError message={errors.file_url} />
              </div>
            ) : null}

            {showScholarshipFields ? (
              <>
                <div>
                  <FieldLabel htmlFor="current_stage" label={t(language, "scholarshipForm.field.currentStage")} language={language} />
                  <CheckboxGroup
                    options={STAGE_OPTIONS}
                    selected={form.current_stage}
                    onChange={(values) => updateField("current_stage", values)}
                    language={language}
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="funding_type" label={t(language, "scholarshipForm.field.fundingType")} language={language} />
                  <select
                    id="funding_type"
                    value={form.funding_type}
                    onChange={(e) => updateField("funding_type", e.target.value)}
                    className={FORM_SELECT_CLASS}
                  >
                    <option value="">{t(language, "scholarshipForm.field.fundingType.select")}</option>
                    {FUNDING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(language, opt.key)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="location_scope" label={t(language, "scholarshipForm.field.locationScope")} language={language} />
                  <select
                    id="location_scope"
                    value={form.location_scope}
                    onChange={(e) => updateField("location_scope", e.target.value)}
                    className={FORM_SELECT_CLASS}
                  >
                    <option value="">{t(language, "scholarshipForm.field.locationScope.select")}</option>
                    {SCOPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(language, opt.key)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="badges" label={t(language, "scholarshipForm.field.badges")} language={language} />
                  <CheckboxGroup
                    options={BADGE_OPTIONS}
                    selected={form.badges}
                    onChange={(values) => updateField("badges", values)}
                    language={language}
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="career_areas_text" label={t(language, "scholarshipForm.field.careerAreas")} language={language} />
                  <textarea
                    id="career_areas_text"
                    value={form.career_areas_text}
                    onChange={(e) => updateField("career_areas_text", e.target.value)}
                    placeholder={t(language, "scholarshipForm.field.careerAreas.placeholder")}
                    className={FORM_TEXTAREA_CLASS}
                    rows={2}
                  />
                </div>
              </>
            ) : null}
          </fieldset>

          <div className="border-t-[0.5px] border-foreground" />

          <fieldset className="space-y-6">
            <legend className="text-h4 font-bold tracking-tight text-foreground mb-4">
              {t(language, "scholarshipForm.section.submitter")}
            </legend>

            <div>
              <FieldLabel htmlFor="submitter_name" label={t(language, "scholarshipForm.field.submitterName")} required language={language} />
              <input
                id="submitter_name"
                type="text"
                value={form.submitter_name}
                onChange={(e) => updateField("submitter_name", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.submitterName.placeholder")}
                className={cx(FORM_INPUT_CLASS, errors.submitter_name && "ring-2 ring-accentOrange")}
              />
              <FieldError message={errors.submitter_name} />
            </div>

            <div>
              <FieldLabel htmlFor="submitter_email" label={t(language, "scholarshipForm.field.submitterEmail")} required language={language} />
              <input
                id="submitter_email"
                type="email"
                value={form.submitter_email}
                onChange={(e) => updateField("submitter_email", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.submitterEmail.placeholder")}
                className={cx(FORM_INPUT_CLASS, errors.submitter_email && "ring-2 ring-accentOrange")}
              />
              <FieldError message={errors.submitter_email} />
            </div>

            <div>
              <FieldLabel htmlFor="submitter_organization" label={t(language, "scholarshipForm.field.submitterOrg")} language={language} />
              <input
                id="submitter_organization"
                type="text"
                value={form.submitter_organization}
                onChange={(e) => updateField("submitter_organization", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.submitterOrg.placeholder")}
                className={FORM_INPUT_CLASS}
              />
            </div>

            <div>
              <FieldLabel htmlFor="notes" label={t(language, "scholarshipForm.field.notes")} language={language} />
              <textarea
                id="notes"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder={t(language, "scholarshipForm.field.notes.placeholder")}
                className={FORM_TEXTAREA_CLASS}
                rows={3}
              />
            </div>
          </fieldset>

          {submitError && (
            <div className="rounded-none bg-accentOrange/10 border-[0.5px] border-accentOrange px-4 py-3">
              <p className="text-body-sm text-foreground">{t(language, "resourceForm.error")}</p>
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" variant="dark" size="lg" disabled={submitting} className="w-full sm:w-auto !rounded-none">
              {submitting ? t(language, "resourceForm.submitting") : t(language, "resourceForm.submit")}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export { ResourceSubmitPage as ScholarshipSubmitPage }
