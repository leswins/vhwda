import React, { useEffect, useMemo, useState } from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import type { Language, TranslationKey } from "../utils/i18n"
import { PageHead } from "../ui/PageHead"
import { Button } from "../ui/components/Button"
import { CheckboxGroup, FieldError, FieldLabel, FORM_INPUT_CLASS, FORM_SELECT_CLASS, FORM_TEXTAREA_CLASS, cx } from "../ui/forms/fields"
import {
  fetchResourceTypes,
  getResourceTypeLabel,
  type ResourceType
} from "../sanity/queries/resourceTypes"
import { fetchCareerCategories, type CareerCategory } from "../sanity/queries/careerCategories"
import { canChooseResourceDestination, destinationForAudience } from "../lib/resourceDestination"
import {
  EDUCATION_FACETS,
  GRANT_FACETS,
  INTERNSHIP_FACETS,
  LOCATION_SCOPE_OPTIONS,
  type HubFacetGroup
} from "../lib/hubResourceFacets"
import {
  fieldsForKind,
  splitTags,
  submitKindForType,
  type ResourceDetails,
  type SubmitFieldSet
} from "../lib/resourceSubmitFields"

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

const SCHOLARSHIP_SCOPE_OPTIONS = [
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

const MEMBERSHIP_OPTIONS = [
  { value: "student", key: "filters.membershipType.student" as const },
  { value: "professional", key: "filters.membershipType.professional" as const },
  { value: "employer", key: "filters.membershipType.employer" as const }
]

const GEOGRAPHIC_OPTIONS = [
  { value: "virginia_statewide", key: "filters.geographicFocus.virginiaStatewide" as const },
  { value: "regional", key: "filters.geographicFocus.regional" as const },
  { value: "national", key: "filters.geographicFocus.national" as const },
  { value: "international", key: "filters.geographicFocus.international" as const },
  { value: "local", key: "filters.geographicFocus.local" as const }
]

function facetOptions(group: HubFacetGroup) {
  return group.options.map((option) => ({ value: option.value, key: option.labelKey }))
}

function facetGroup(groups: HubFacetGroup[], id: string) {
  return groups.find((group) => group.id === id)
}

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
  file_label: string
  current_stage: string[]
  funding_type: string
  location_scope: string
  badges: string[]
  career_area_ids: string[]
  tags_text: string
  experience_kind: string
  compensation: string
  audience_level: string[]
  setting: string
  duration: string
  opportunity_kind: string
  applicant_type: string[]
  funding_amount: string
  material_kind: string
  grade_bands: string[]
  topic_focus: string
  format: string
  membership_type: string[]
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
  file_label: "",
  current_stage: [],
  funding_type: "",
  location_scope: "",
  badges: [],
  career_area_ids: [],
  tags_text: "",
  experience_kind: "",
  compensation: "",
  audience_level: [],
  setting: "",
  duration: "",
  opportunity_kind: "",
  applicant_type: [],
  funding_amount: "",
  material_kind: "",
  grade_bands: [],
  topic_focus: "",
  format: "",
  membership_type: [],
  submitter_name: "",
  submitter_email: "",
  submitter_organization: "",
  notes: ""
}

type FormErrors = Partial<Record<keyof FormData, string>>

function validateUrl(value: string) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function validate(form: FormData, language: Language, fields: SubmitFieldSet, selectedType?: ResourceType): FormErrors {
  const errors: FormErrors = {}
  if (!form.resource_type_slug && !selectedType) {
    errors.resource_type_slug = t(language, "resourceForm.validation.typeRequired")
  }
  if (!form.name.trim()) {
    errors.name = t(
      language,
      fields.nameLabel === "title" ? "resourceForm.validation.titleRequired" : "resourceForm.validation.nameRequired"
    )
  }
  if (!form.submitter_name.trim()) errors.submitter_name = t(language, "scholarshipForm.validation.submitterNameRequired")
  if (!form.submitter_email.trim()) {
    errors.submitter_email = t(language, "scholarshipForm.validation.submitterEmailRequired")
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submitter_email)) {
    errors.submitter_email = t(language, "scholarshipForm.validation.submitterEmailInvalid")
  }

  if (fields.linkRequired && !form.link.trim()) {
    errors.link = t(language, "scholarshipForm.validation.linkRequired")
  }
  if (form.link.trim() && !validateUrl(form.link.trim())) {
    errors.link = t(language, "scholarshipForm.validation.linkInvalid")
  }
  if (form.file_url.trim() && !validateUrl(form.file_url.trim())) {
    errors.file_url = t(language, "scholarshipForm.validation.linkInvalid")
  }
  if (fields.fileUrl && !fields.linkRequired && !form.link.trim() && !form.file_url.trim()) {
    errors.link = t(language, "resourceForm.validation.accessRequired")
  }

  if (fields.experienceKind && !form.experience_kind) {
    errors.experience_kind = t(language, "resourceForm.validation.experienceKind")
  }
  if (fields.compensation && !form.compensation) {
    errors.compensation = t(language, "resourceForm.validation.compensation")
  }
  if (fields.opportunityKind && !form.opportunity_kind) {
    errors.opportunity_kind = t(language, "resourceForm.validation.opportunityKind")
  }
  if (fields.applicantType && form.applicant_type.length === 0) {
    errors.applicant_type = t(language, "resourceForm.validation.applicantType")
  }
  if (fields.materialKind && !form.material_kind) {
    errors.material_kind = t(language, "resourceForm.validation.materialKind")
  }

  return errors
}

function detailsFromForm(form: FormData, fields: SubmitFieldSet): ResourceDetails {
  const details: ResourceDetails = {}
  if (fields.experienceKind) details.experienceKind = form.experience_kind
  if (fields.compensation) details.compensation = form.compensation
  if (fields.audienceLevel) details.audienceLevel = form.audience_level
  if (fields.setting) details.setting = form.setting
  if (fields.duration) details.duration = form.duration
  if (fields.opportunityKind) details.opportunityKind = form.opportunity_kind
  if (fields.applicantType) details.applicantType = form.applicant_type
  if (fields.fundingAmount) details.fundingAmount = form.funding_amount
  if (fields.materialKind) details.materialKind = form.material_kind
  if (fields.gradeBands) details.gradeBands = form.grade_bands
  if (fields.topicFocus) details.topicFocus = form.topic_focus
  if (fields.format) details.format = form.format
  if (fields.fileLabel) details.fileLabel = form.file_label
  if (fields.membershipType) details.membershipType = form.membership_type
  if (fields.tags) details.tags = splitTags(form.tags_text)
  if (fields.careerAreas) details.careerAreaIds = form.career_area_ids
  return details
}

export function ResourceSubmitPage() {
  const { language } = useLanguageStore()
  const [types, setTypes] = useState<ResourceType[]>([])
  const [categories, setCategories] = useState<CareerCategory[]>([])
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchResourceTypes(), fetchCareerCategories().catch(() => [] as CareerCategory[])]).then(([all, nextCategories]) => {
      if (cancelled) return
      const formTypes = all.filter((type) => type.enabled && type.showInSubmissionForm !== false)
      setTypes(formTypes)
      setCategories(nextCategories ?? [])
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
  const kind = submitKindForType(selectedType)
  const fields = fieldsForKind(kind)
  const canChooseDestination = canChooseResourceDestination(selectedType?.audience)

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
    const validationErrors = validate(form, language, fields, selectedType)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const firstErrorKey = Object.keys(validationErrors)[0]
      document.getElementById(firstErrorKey)?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    const selectedCategories = categories.filter((category) => form.career_area_ids.includes(category._id))
    const details = detailsFromForm(form, fields)
    const tags = fields.tags ? splitTags(form.tags_text) : form.badges

    setSubmitting(true)
    try {
      const response = await fetch("/api/scholarship-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource_type_slug: form.resource_type_slug,
          resource_type_id: selectedType?._id.startsWith("fallback.") ? null : selectedType?._id,
          destination: form.destination,
          name: form.name,
          institution: form.institution,
          summary: fields.summary ? form.summary : "",
          description: form.description,
          eligibility: fields.eligibility ? form.eligibility : "",
          region: fields.region ? form.region : "",
          deadline: fields.deadline ? form.deadline : "",
          link: form.link,
          file_url: fields.fileUrl ? form.file_url : "",
          current_stage: fields.currentStage
            ? form.current_stage
            : fields.audienceLevel
              ? form.audience_level
              : fields.applicantType
                ? form.applicant_type
                : fields.gradeBands
                  ? form.grade_bands
                  : fields.membershipType
                    ? form.membership_type
                    : [],
          funding_type: fields.fundingType
            ? form.funding_type
            : fields.experienceKind
              ? form.experience_kind
              : fields.opportunityKind
                ? form.opportunity_kind
                : fields.materialKind
                  ? form.material_kind
                  : "",
          location_scope: fields.scholarshipLocationScope || fields.hubLocationScope || fields.geographicFocus
            ? form.location_scope
            : "",
          badges: fields.badges ? form.badges : tags,
          career_areas_text: selectedCategories.map((category) => category.title).join(", "),
          details,
          submitter_name: form.submitter_name,
          submitter_email: form.submitter_email,
          submitter_organization: form.submitter_organization,
          notes: form.notes
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

  const nameLabel = t(
    language,
    fields.nameLabel === "title" ? "resourceForm.field.title" : "resourceForm.field.name"
  )
  const institutionLabel =
    fields.institutionLabel === "host"
      ? t(language, "resourceForm.field.host")
      : fields.institutionLabel === "org"
        ? t(language, "resourceForm.field.orgInstitution")
        : t(language, "scholarshipForm.field.institution")
  const institutionPlaceholder =
    fields.institutionLabel === "host"
      ? t(language, "resourceForm.field.host.placeholder")
      : t(language, "scholarshipForm.field.institution.placeholder")

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

            <TextField
              id="name"
              label={nameLabel}
              required
              language={language}
              value={form.name}
              onChange={(value) => updateField("name", value)}
              placeholder={t(language, "resourceForm.field.name.placeholder")}
              error={errors.name}
            />

            {fields.institution ? (
              <TextField
                id="institution"
                label={institutionLabel}
                language={language}
                value={form.institution}
                onChange={(value) => updateField("institution", value)}
                placeholder={institutionPlaceholder}
              />
            ) : null}

            {fields.summary ? (
              <TextAreaField
                id="summary"
                label={t(language, "scholarshipForm.field.summary")}
                language={language}
                value={form.summary}
                onChange={(value) => updateField("summary", value)}
                placeholder={t(language, "scholarshipForm.field.summary.placeholder")}
                rows={3}
              />
            ) : null}

            {fields.description ? (
              <TextAreaField
                id="description"
                label={t(language, "scholarshipForm.field.description")}
                language={language}
                value={form.description}
                onChange={(value) => updateField("description", value)}
                placeholder={t(language, "scholarshipForm.field.description.placeholder")}
                rows={4}
              />
            ) : null}

            {fields.experienceKind ? (
              <SelectField
                id="experience_kind"
                label={t(language, "filters.experienceKind")}
                required
                language={language}
                value={form.experience_kind}
                onChange={(value) => updateField("experience_kind", value)}
                options={facetOptions(facetGroup(INTERNSHIP_FACETS, "experienceKind")!)}
                error={errors.experience_kind}
              />
            ) : null}

            {fields.compensation ? (
              <SelectField
                id="compensation"
                label={t(language, "filters.compensation")}
                required
                language={language}
                value={form.compensation}
                onChange={(value) => updateField("compensation", value)}
                options={facetOptions(facetGroup(INTERNSHIP_FACETS, "compensation")!)}
                error={errors.compensation}
              />
            ) : null}

            {fields.audienceLevel ? (
              <ChoiceField
                id="audience_level"
                label={t(language, "filters.audienceLevel")}
                language={language}
                selected={form.audience_level}
                onChange={(values) => updateField("audience_level", values)}
                options={facetOptions(facetGroup(INTERNSHIP_FACETS, "audienceLevel")!)}
              />
            ) : null}

            {fields.setting ? (
              <SelectField
                id="setting"
                label={t(language, "filters.setting")}
                language={language}
                value={form.setting}
                onChange={(value) => updateField("setting", value)}
                options={facetOptions(facetGroup(INTERNSHIP_FACETS, "setting")!)}
              />
            ) : null}

            {fields.duration ? (
              <TextField
                id="duration"
                label={t(language, "resourceForm.field.duration")}
                language={language}
                value={form.duration}
                onChange={(value) => updateField("duration", value)}
                placeholder={t(language, "resourceForm.field.duration.placeholder")}
                help={t(language, "resourceForm.field.duration.help")}
              />
            ) : null}

            {fields.opportunityKind ? (
              <SelectField
                id="opportunity_kind"
                label={t(language, "filters.opportunityKind")}
                required
                language={language}
                value={form.opportunity_kind}
                onChange={(value) => updateField("opportunity_kind", value)}
                options={facetOptions(facetGroup(GRANT_FACETS, "opportunityKind")!)}
                error={errors.opportunity_kind}
              />
            ) : null}

            {fields.applicantType ? (
              <ChoiceField
                id="applicant_type"
                label={t(language, "filters.applicantType")}
                required
                language={language}
                selected={form.applicant_type}
                onChange={(values) => updateField("applicant_type", values)}
                options={facetOptions(facetGroup(GRANT_FACETS, "applicantType")!)}
                error={errors.applicant_type}
              />
            ) : null}

            {fields.fundingAmount ? (
              <TextField
                id="funding_amount"
                label={t(language, "resourceForm.field.fundingAmount")}
                language={language}
                value={form.funding_amount}
                onChange={(value) => updateField("funding_amount", value)}
                placeholder={t(language, "resourceForm.field.fundingAmount.placeholder")}
              />
            ) : null}

            {fields.materialKind ? (
              <SelectField
                id="material_kind"
                label={t(language, "filters.materialKind")}
                required
                language={language}
                value={form.material_kind}
                onChange={(value) => updateField("material_kind", value)}
                options={facetOptions(facetGroup(EDUCATION_FACETS, "materialKind")!)}
                error={errors.material_kind}
              />
            ) : null}

            {fields.gradeBands ? (
              <ChoiceField
                id="grade_bands"
                label={t(language, "filters.gradeBands")}
                language={language}
                selected={form.grade_bands}
                onChange={(values) => updateField("grade_bands", values)}
                options={facetOptions(facetGroup(EDUCATION_FACETS, "gradeBands")!)}
              />
            ) : null}

            {fields.topicFocus ? (
              <SelectField
                id="topic_focus"
                label={t(language, "filters.topicFocus")}
                language={language}
                value={form.topic_focus}
                onChange={(value) => updateField("topic_focus", value)}
                options={facetOptions(facetGroup(EDUCATION_FACETS, "topicFocus")!)}
              />
            ) : null}

            {fields.format ? (
              <SelectField
                id="format"
                label={t(language, "filters.format")}
                language={language}
                value={form.format}
                onChange={(value) => updateField("format", value)}
                options={facetOptions(facetGroup(EDUCATION_FACETS, "format")!)}
              />
            ) : null}

            {fields.membershipType ? (
              <ChoiceField
                id="membership_type"
                label={t(language, "filters.membershipType")}
                language={language}
                selected={form.membership_type}
                onChange={(values) => updateField("membership_type", values)}
                options={MEMBERSHIP_OPTIONS}
              />
            ) : null}

            {fields.hubLocationScope ? (
              <SelectField
                id="location_scope"
                label={t(language, "filters.locationScope")}
                language={language}
                value={form.location_scope}
                onChange={(value) => updateField("location_scope", value)}
                options={LOCATION_SCOPE_OPTIONS.map((option) => ({ value: option.value, key: option.labelKey }))}
              />
            ) : null}

            {fields.scholarshipLocationScope ? (
              <SelectField
                id="location_scope"
                label={t(language, "scholarshipForm.field.locationScope")}
                language={language}
                value={form.location_scope}
                onChange={(value) => updateField("location_scope", value)}
                options={SCHOLARSHIP_SCOPE_OPTIONS}
              />
            ) : null}

            {fields.geographicFocus ? (
              <SelectField
                id="location_scope"
                label={t(language, "filters.geographicFocus")}
                language={language}
                value={form.location_scope}
                onChange={(value) => updateField("location_scope", value)}
                options={GEOGRAPHIC_OPTIONS}
              />
            ) : null}

            {fields.currentStage ? (
              <ChoiceField
                id="current_stage"
                label={t(language, "scholarshipForm.field.currentStage")}
                language={language}
                selected={form.current_stage}
                onChange={(values) => updateField("current_stage", values)}
                options={STAGE_OPTIONS}
              />
            ) : null}

            {fields.fundingType ? (
              <SelectField
                id="funding_type"
                label={t(language, "scholarshipForm.field.fundingType")}
                language={language}
                value={form.funding_type}
                onChange={(value) => updateField("funding_type", value)}
                options={FUNDING_OPTIONS}
              />
            ) : null}

            {fields.badges ? (
              <ChoiceField
                id="badges"
                label={t(language, "scholarshipForm.field.badges")}
                language={language}
                selected={form.badges}
                onChange={(values) => updateField("badges", values)}
                options={BADGE_OPTIONS}
              />
            ) : null}

            {fields.eligibility ? (
              <TextAreaField
                id="eligibility"
                label={t(language, "scholarshipForm.field.eligibility")}
                language={language}
                value={form.eligibility}
                onChange={(value) => updateField("eligibility", value)}
                placeholder={t(language, "scholarshipForm.field.eligibility.placeholder")}
                rows={3}
              />
            ) : null}

            {fields.region ? (
              <TextField
                id="region"
                label={t(language, fields.nameLabel === "title" ? "resourceForm.field.regionFree" : "scholarshipForm.field.region")}
                language={language}
                value={form.region}
                onChange={(value) => updateField("region", value)}
                placeholder={t(language, "scholarshipForm.field.region.placeholder")}
              />
            ) : null}

            {fields.deadline ? (
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
            ) : null}

            {fields.link ? (
              <TextField
                id="link"
                label={t(language, "scholarshipForm.field.link")}
                required={fields.linkRequired}
                language={language}
                value={form.link}
                onChange={(value) => updateField("link", value)}
                placeholder={t(language, "scholarshipForm.field.link.placeholder")}
                error={errors.link}
                type="url"
              />
            ) : null}

            {fields.fileUrl ? (
              <div>
                <TextField
                  id="file_url"
                  label={t(language, "resourceForm.field.fileUrl")}
                  language={language}
                  value={form.file_url}
                  onChange={(value) => updateField("file_url", value)}
                  placeholder={t(language, "resourceForm.field.fileUrl.placeholder")}
                  error={errors.file_url}
                  type="url"
                />
                <p className="mt-1 text-body-sm text-muted">{t(language, "resourceForm.field.fileUrl.help")}</p>
              </div>
            ) : null}

            {fields.fileLabel ? (
              <TextField
                id="file_label"
                label={t(language, "resourceForm.field.fileLabel")}
                language={language}
                value={form.file_label}
                onChange={(value) => updateField("file_label", value)}
                placeholder={t(language, "resourceForm.field.fileLabel.placeholder")}
              />
            ) : null}

            {fields.careerAreas && categories.length > 0 ? (
              <ChoiceField
                id="career_area_ids"
                label={t(language, "resourceForm.field.careerAreas")}
                language={language}
                selected={form.career_area_ids}
                onChange={(values) => updateField("career_area_ids", values)}
                options={categories.map((category) => ({ value: category._id, label: category.title }))}
              />
            ) : null}

            {fields.tags ? (
              <TextField
                id="tags_text"
                label={t(language, "resourceForm.field.tags")}
                language={language}
                value={form.tags_text}
                onChange={(value) => updateField("tags_text", value)}
                placeholder={t(language, "resourceForm.field.tags.placeholder")}
              />
            ) : null}
          </fieldset>

          <div className="border-t-[0.5px] border-foreground" />

          <fieldset className="space-y-6">
            <legend className="text-h4 font-bold tracking-tight text-foreground mb-4">
              {t(language, "scholarshipForm.section.submitter")}
            </legend>

            <TextField
              id="submitter_name"
              label={t(language, "scholarshipForm.field.submitterName")}
              required
              language={language}
              value={form.submitter_name}
              onChange={(value) => updateField("submitter_name", value)}
              placeholder={t(language, "scholarshipForm.field.submitterName.placeholder")}
              error={errors.submitter_name}
            />
            <TextField
              id="submitter_email"
              label={t(language, "scholarshipForm.field.submitterEmail")}
              required
              language={language}
              value={form.submitter_email}
              onChange={(value) => updateField("submitter_email", value)}
              placeholder={t(language, "scholarshipForm.field.submitterEmail.placeholder")}
              error={errors.submitter_email}
              type="email"
            />
            <TextField
              id="submitter_organization"
              label={t(language, "scholarshipForm.field.submitterOrg")}
              language={language}
              value={form.submitter_organization}
              onChange={(value) => updateField("submitter_organization", value)}
              placeholder={t(language, "scholarshipForm.field.submitterOrg.placeholder")}
            />
            <TextAreaField
              id="notes"
              label={t(language, "scholarshipForm.field.notes")}
              language={language}
              value={form.notes}
              onChange={(value) => updateField("notes", value)}
              placeholder={t(language, "scholarshipForm.field.notes.placeholder")}
              rows={3}
            />
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

function TextField({
  id,
  label,
  required,
  language,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  help
}: {
  id: string
  label: string
  required?: boolean
  language: Language
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  type?: string
  help?: string
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} required={required} language={language} />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cx(FORM_INPUT_CLASS, error && "ring-2 ring-accentOrange")}
      />
      {help ? <p className="mt-1 text-body-sm text-muted">{help}</p> : null}
      <FieldError message={error} />
    </div>
  )
}

function TextAreaField({
  id,
  label,
  language,
  value,
  onChange,
  placeholder,
  rows
}: {
  id: string
  label: string
  language: Language
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows: number
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} language={language} />
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={FORM_TEXTAREA_CLASS}
        rows={rows}
      />
    </div>
  )
}

function SelectField({
  id,
  label,
  required,
  language,
  value,
  onChange,
  options,
  error
}: {
  id: string
  label: string
  required?: boolean
  language: Language
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; key?: TranslationKey; label?: string }>
  error?: string
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} required={required} language={language} />
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cx(FORM_SELECT_CLASS, error && "ring-2 ring-accentOrange")}
      >
        <option value="">{t(language, "resourceForm.select")}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label ?? (option.key ? t(language, option.key) : option.value)}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  )
}

function ChoiceField({
  id,
  label,
  required,
  language,
  selected,
  onChange,
  options,
  error
}: {
  id: string
  label: string
  required?: boolean
  language: Language
  selected: string[]
  onChange: (values: string[]) => void
  options: Array<{ value: string; key?: TranslationKey; label?: string }>
  error?: string
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} required={required} language={language} />
      <CheckboxGroup options={options} selected={selected} onChange={onChange} language={language} />
      <FieldError message={error} />
    </div>
  )
}

export { ResourceSubmitPage as ScholarshipSubmitPage }
