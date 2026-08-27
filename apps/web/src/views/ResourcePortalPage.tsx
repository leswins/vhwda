import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import type { Language } from "../utils/i18n"
import { PageHead } from "../ui/PageHead"
import { Button } from "../ui/components/Button"
import { cx } from "../ui/forms/fields"

type Submission = {
  id: string
  resource_type_slug?: string
  destination?: "public_hub" | "teacher_portal"
  name: string
  summary: string | null
  description: string | null
  institution: string | null
  eligibility: string | null
  region: string | null
  deadline: string | null
  link: string | null
  file_url?: string | null
  current_stage: string[]
  funding_type: string | null
  location_scope: string | null
  badges: string[]
  career_areas_text: string | null
  submitter_name: string
  submitter_email: string
  submitter_organization: string | null
  notes: string | null
  status: "pending" | "approved" | "declined"
  submitted_at: string
  reviewed_at: string | null
  sanity_document_id: string | null
}

type DownloadRow = {
  id?: string
  teacher_email?: string
  teacher_name?: string
  school_name?: string
  resource_id?: string
  resource_title?: string
  resource_type_slug?: string
  downloaded_at?: string
}

type StatusFilter = "all" | "pending" | "approved" | "declined"
type PortalTab = "submissions" | "downloads"

const STAGE_KEYS: Record<string, Parameters<typeof t>[1]> = {
  high_school: "scholarshipForm.stage.highSchool",
  college: "scholarshipForm.stage.college",
  graduate: "scholarshipForm.stage.graduate",
  working_professional: "scholarshipForm.stage.workingProfessional",
  veteran_military: "scholarshipForm.stage.veteranMilitary",
  adult_returning: "scholarshipForm.stage.adultReturning"
}

const FUNDING_KEYS: Record<string, Parameters<typeof t>[1]> = {
  federal: "scholarshipForm.funding.federal",
  state: "scholarshipForm.funding.state",
  institutional: "scholarshipForm.funding.institutional",
  private: "scholarshipForm.funding.private",
  foundation: "scholarshipForm.funding.foundation",
  other: "scholarshipForm.funding.other"
}

const SCOPE_KEYS: Record<string, Parameters<typeof t>[1]> = {
  virginia_statewide: "scholarshipForm.scope.virginiaStatewide",
  regional: "scholarshipForm.scope.regional",
  national: "scholarshipForm.scope.national",
  local: "scholarshipForm.scope.local",
  international: "scholarshipForm.scope.international"
}

const BADGE_KEYS: Record<string, Parameters<typeof t>[1]> = {
  undergraduate: "scholarshipForm.badge.undergraduate",
  graduate: "scholarshipForm.badge.graduate",
  undergraduate_graduate: "scholarshipForm.badge.undergraduateGraduate",
  multiple_cohorts: "scholarshipForm.badge.multipleCohorts",
  health_related: "scholarshipForm.badge.healthRelated"
}

function label(language: Language, keys: Record<string, Parameters<typeof t>[1]>, value: string) {
  const key = keys[value]
  return key ? t(language, key) : value
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

function StatusBadge({ status, language }: { status: Submission["status"]; language: Language }) {
  const key = `scholarshipPortal.status.${status}` as const
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-none px-2 py-0.5 text-xs font-semibold",
        status === "pending" && "bg-accentYellow/20 text-foreground",
        status === "approved" && "bg-accentGreen/20 text-foreground",
        status === "declined" && "bg-accentOrange/20 text-foreground"
      )}
    >
      {t(language, key)}
    </span>
  )
}

function DetailRow({ label: rowLabel, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <dt className="text-body-sm font-semibold text-foreground shrink-0 sm:w-40">{rowLabel}</dt>
      <dd className="text-body-sm text-muted break-words">{value}</dd>
    </div>
  )
}

function SubmissionCard({
  submission,
  language,
  password,
  onReviewComplete
}: {
  submission: Submission
  language: Language
  password: string
  onReviewComplete: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [reviewMessage, setReviewMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleReview(action: "approve" | "decline") {
    const confirmKey =
      action === "approve" ? "scholarshipPortal.confirmApprove" : "scholarshipPortal.confirmDecline"
    if (!window.confirm(t(language, confirmKey))) return

    setReviewing(true)
    setReviewMessage(null)

    try {
      const response = await fetch("/api/scholarship-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-portal-password": password
        },
        body: JSON.stringify({ id: submission.id, action })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "Review failed")
      }

      const successKey =
        action === "approve" ? "scholarshipPortal.approveSuccess" : "scholarshipPortal.declineSuccess"
      setReviewMessage({ type: "success", text: t(language, successKey) })
      setTimeout(onReviewComplete, 1000)
    } catch {
      setReviewMessage({ type: "error", text: t(language, "scholarshipPortal.reviewError") })
    } finally {
      setReviewing(false)
    }
  }

  return (
    <div className="border-b-[0.5px] border-foreground py-5 lg:py-8 first:pt-0 last:border-0 last:pb-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-body-base lg:text-lg font-semibold text-foreground">{submission.name}</h3>
            <StatusBadge status={submission.status} language={language} />
            {submission.resource_type_slug ? (
              <span className="inline-flex items-center rounded-none bg-surface2 px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
                {submission.resource_type_slug}
              </span>
            ) : null}
          </div>
          {submission.institution && <p className="text-body-sm text-muted">{submission.institution}</p>}
          <p className="text-body-sm text-muted">
            {t(language, "scholarshipPortal.submittedBy")}{" "}
            <span className="font-medium text-foreground">{submission.submitter_name}</span>{" "}
            {t(language, "scholarshipPortal.submittedOn")} {formatDate(submission.submitted_at)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 text-body-sm font-medium text-accentBlue underline underline-offset-2 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 rounded"
        >
          {expanded ? t(language, "scholarshipPortal.hideDetails") : t(language, "scholarshipPortal.viewDetails")}
        </button>
      </div>

      {expanded && (
        <div className="mt-5 space-y-5">
          <dl className="space-y-3 rounded-none bg-surface1 p-4">
            <DetailRow label={t(language, "resourcePortal.detail.type")} value={submission.resource_type_slug} />
            <DetailRow
              label={t(language, "resourceForm.field.destination")}
              value={
                submission.destination === "teacher_portal"
                  ? t(language, "resourceForm.destination.teacherPortal")
                  : t(language, "resourceForm.destination.publicHub")
              }
            />
            <DetailRow label={t(language, "scholarshipPortal.detail.institution")} value={submission.institution} />
            <DetailRow label={t(language, "scholarshipPortal.detail.summary")} value={submission.summary} />
            <DetailRow label={t(language, "scholarshipPortal.detail.description")} value={submission.description} />
            <DetailRow label={t(language, "scholarshipPortal.detail.eligibility")} value={submission.eligibility} />
            <DetailRow label={t(language, "scholarshipPortal.detail.region")} value={submission.region} />
            <DetailRow
              label={t(language, "scholarshipPortal.detail.deadline")}
              value={submission.deadline ? formatDate(submission.deadline) : null}
            />
            <DetailRow
              label={t(language, "scholarshipPortal.detail.link")}
              value={
                submission.link ? (
                  <a href={submission.link} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:opacity-80 break-all">
                    {submission.link}
                  </a>
                ) : null
              }
            />
            <DetailRow
              label={t(language, "resourceForm.field.fileUrl")}
              value={
                submission.file_url ? (
                  <a href={submission.file_url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:opacity-80 break-all">
                    {submission.file_url}
                  </a>
                ) : null
              }
            />
            <DetailRow
              label={t(language, "scholarshipPortal.detail.currentStage")}
              value={
                submission.current_stage?.length > 0
                  ? submission.current_stage.map((s) => label(language, STAGE_KEYS, s)).join(", ")
                  : null
              }
            />
            <DetailRow
              label={t(language, "scholarshipPortal.detail.fundingType")}
              value={submission.funding_type ? label(language, FUNDING_KEYS, submission.funding_type) : null}
            />
            <DetailRow
              label={t(language, "scholarshipPortal.detail.locationScope")}
              value={submission.location_scope ? label(language, SCOPE_KEYS, submission.location_scope) : null}
            />
            <DetailRow
              label={t(language, "scholarshipPortal.detail.badges")}
              value={
                submission.badges?.length > 0
                  ? submission.badges.map((b) => label(language, BADGE_KEYS, b)).join(", ")
                  : null
              }
            />
            <DetailRow label={t(language, "scholarshipPortal.detail.careerAreas")} value={submission.career_areas_text} />
            <div className="border-t-[0.5px] border-foreground/10 pt-3 mt-3" />
            <DetailRow label={t(language, "scholarshipPortal.detail.organization")} value={submission.submitter_organization} />
            <DetailRow label={t(language, "scholarshipForm.field.submitterEmail")} value={submission.submitter_email} />
            <DetailRow label={t(language, "scholarshipPortal.detail.notes")} value={submission.notes} />
            {submission.sanity_document_id && (
              <DetailRow
                label={t(language, "scholarshipPortal.detail.sanityId")}
                value={
                  <code className="rounded bg-surface2 px-1.5 py-0.5 text-body-sm font-mono">
                    {submission.sanity_document_id}
                  </code>
                }
              />
            )}
          </dl>

          {reviewMessage && (
            <div
              className={cx(
                "rounded-none border-[0.5px] px-4 py-3 text-body-sm",
                reviewMessage.type === "success" && "border-accentGreen bg-accentGreen/10 text-foreground",
                reviewMessage.type === "error" && "border-accentOrange bg-accentOrange/10 text-foreground"
              )}
            >
              {reviewMessage.text}
            </div>
          )}

          {submission.status === "pending" && (
            <div className="flex items-center gap-3">
              <Button
                variant="dark"
                size="sm"
                disabled={reviewing}
                onClick={() => handleReview("approve")}
                className="!rounded-none !bg-[rgb(var(--color-accent-green))] !text-foreground hover:!opacity-90"
              >
                {t(language, "scholarshipPortal.approve")}
              </Button>
              <Button variant="outline" size="sm" disabled={reviewing} onClick={() => handleReview("decline")} className="!rounded-none">
                {t(language, "scholarshipPortal.decline")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ResourcePortalPage() {
  const { language } = useLanguageStore()
  const [password, setPassword] = useState(() => sessionStorage.getItem("scholarship_portal_pw") || "")
  const [authenticated, setAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [downloads, setDownloads] = useState<DownloadRow[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [tab, setTab] = useState<PortalTab>("submissions")

  const fetchSubmissions = useCallback(async (pw: string, filter?: StatusFilter) => {
    setLoading(true)
    setLoadError(false)
    try {
      const params = filter && filter !== "all" ? `?status=${filter}` : ""
      const response = await fetch(`/api/scholarship-submissions${params}`, {
        headers: { "x-portal-password": pw }
      })
      if (response.status === 401) {
        setAuthenticated(false)
        sessionStorage.removeItem("scholarship_portal_pw")
        setLoginError(true)
        return
      }
      if (!response.ok) throw new Error("Failed to fetch")
      const data = (await response.json()) as Submission[]
      setSubmissions(data)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDownloads = useCallback(async (pw: string) => {
    const response = await fetch("/api/teacher-downloads", {
      headers: { "x-portal-password": pw }
    })
    if (!response.ok) return
    const data = (await response.json()) as { downloads?: DownloadRow[] }
    setDownloads(data.downloads ?? [])
  }, [])

  useEffect(() => {
    const stored = sessionStorage.getItem("scholarship_portal_pw")
    if (stored) {
      setPassword(stored)
      setAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (authenticated && password) {
      fetchSubmissions(password, statusFilter)
      fetchDownloads(password)
    }
  }, [statusFilter, authenticated, password, fetchSubmissions, fetchDownloads])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError(false)
    const pw = passwordInput.trim()
    if (!pw) return
    setPassword(pw)
    sessionStorage.setItem("scholarship_portal_pw", pw)
    setAuthenticated(true)
  }

  function handleLogout() {
    setPassword("")
    setPasswordInput("")
    setAuthenticated(false)
    setSubmissions([])
    setDownloads([])
    sessionStorage.removeItem("scholarship_portal_pw")
  }

  const typeOptions = useMemo(() => {
    const slugs = Array.from(new Set(submissions.map((row) => row.resource_type_slug || "scholarships")))
    return slugs.sort()
  }, [submissions])

  const [typeFilter, setTypeFilter] = useState("all")
  const visibleSubmissions = submissions.filter((row) =>
    typeFilter === "all" ? true : (row.resource_type_slug || "scholarships") === typeFilter
  )

  const filteredCount = visibleSubmissions.length
  const countText =
    filteredCount === 1
      ? t(language, "scholarshipPortal.countSingular")
      : t(language, "scholarshipPortal.count").replace("{count}", String(filteredCount))

  if (!authenticated) {
    return (
      <>
        <PageHead title={t(language, "page.title.resourcePortal")} description={t(language, "resourcePortal.subtitle")} />
        <div className="min-h-[100vh] px-5 py-10 lg:p-fluid-50">
          <div className="mx-auto max-w-sm space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-h3 font-bold tracking-tight text-foreground">{t(language, "resourcePortal.login.title")}</h1>
              <p className="text-body-base text-muted">{t(language, "resourcePortal.login.description")}</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value)
                  setLoginError(false)
                }}
                placeholder={t(language, "scholarshipPortal.login.placeholder")}
                className={cx(
                  "w-full border-[0.5px] border-foreground rounded-none px-3 py-2.5 bg-surface text-foreground text-body-base placeholder:text-muted",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
                  loginError && "ring-2 ring-accentOrange"
                )}
                autoFocus
              />
              {loginError && <p className="text-body-sm text-accentOrange">{t(language, "scholarshipPortal.login.error")}</p>}
              <Button type="submit" variant="dark" size="lg" className="w-full !rounded-none">
                {t(language, "scholarshipPortal.login.submit")}
              </Button>
            </form>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHead title={t(language, "page.title.resourcePortal")} description={t(language, "resourcePortal.subtitle")} />

      <div className="border-b-[0.5px] border-foreground px-5 py-10 lg:p-fluid-50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-h2 font-bold tracking-tight text-foreground">{t(language, "resourcePortal.title")}</h1>
            <p className="mt-2 text-body-lg text-muted">{t(language, "resourcePortal.subtitle")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="shrink-0 !rounded-none">
            {t(language, "scholarshipPortal.logout")}
          </Button>
        </div>
      </div>

      <div className="border-b-[0.5px] border-foreground px-5 py-4 lg:px-fluid-50">
        <div className="flex items-center gap-1 flex-wrap">
          {(["submissions", "downloads"] as PortalTab[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={cx(
                "px-3 py-1.5 text-body-sm font-medium rounded-none transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
                tab === value ? "bg-foreground text-surface" : "bg-transparent text-foreground hover:bg-surface1"
              )}
            >
              {t(language, value === "submissions" ? "resourcePortal.tab.submissions" : "resourcePortal.tab.downloads")}
            </button>
          ))}
        </div>
      </div>

      {tab === "submissions" ? (
        <>
          <div className="border-b-[0.5px] border-foreground px-5 py-4 lg:px-fluid-50">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1 flex-wrap">
                {(["all", "pending", "approved", "declined"] as StatusFilter[]).map((filter) => {
                  const filterKey = `scholarshipPortal.filter.${filter}` as const
                  const isActive = statusFilter === filter
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setStatusFilter(filter)}
                      className={cx(
                        "px-3 py-1.5 text-body-sm font-medium rounded-none transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
                        isActive ? "bg-foreground text-surface" : "bg-transparent text-foreground hover:bg-surface1"
                      )}
                    >
                      {t(language, filterKey)}
                    </button>
                  )
                })}
                {typeOptions.length > 1 ? (
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="ml-2 border-[0.5px] border-foreground bg-surface px-2 py-1.5 text-body-sm text-foreground"
                  >
                    <option value="all">{t(language, "resourcePortal.filter.allTypes")}</option>
                    {typeOptions.map((slug) => (
                      <option key={slug} value={slug}>
                        {slug}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
              {!loading && <p className="text-body-sm text-muted">{countText}</p>}
            </div>
          </div>

          <div className="min-h-[100vh] px-5 py-5 lg:px-fluid-50 lg:py-8">
            {loading ? (
              <p className="text-body-base text-muted py-10 text-center">{t(language, "scholarshipPortal.loading")}</p>
            ) : loadError ? (
              <p className="text-body-base text-accentOrange py-10 text-center">{t(language, "scholarshipPortal.error")}</p>
            ) : visibleSubmissions.length === 0 ? (
              <p className="text-body-base text-muted py-10 text-center">{t(language, "scholarshipPortal.empty")}</p>
            ) : (
              <div>
                {visibleSubmissions.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    language={language}
                    password={password}
                    onReviewComplete={() => fetchSubmissions(password, statusFilter)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="min-h-[100vh] px-5 py-5 lg:px-fluid-50 lg:py-8">
          {downloads.length === 0 ? (
            <p className="text-body-base text-muted py-10 text-center">{t(language, "resourcePortal.downloads.empty")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-[0.5px] border-foreground text-left">
                <thead className="bg-surface1">
                  <tr>
                    <th className="border-b-[0.5px] border-foreground px-3 py-2 text-body-sm font-semibold">{t(language, "resourcePortal.downloads.when")}</th>
                    <th className="border-b-[0.5px] border-foreground px-3 py-2 text-body-sm font-semibold">{t(language, "resourcePortal.downloads.teacher")}</th>
                    <th className="border-b-[0.5px] border-foreground px-3 py-2 text-body-sm font-semibold">{t(language, "resourcePortal.downloads.school")}</th>
                    <th className="border-b-[0.5px] border-foreground px-3 py-2 text-body-sm font-semibold">{t(language, "resourcePortal.downloads.resource")}</th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.map((row, index) => (
                    <tr key={row.id ?? `${row.resource_id}-${index}`}>
                      <td className="border-b-[0.5px] border-foreground px-3 py-2 text-body-sm text-muted">
                        {row.downloaded_at ? formatDate(row.downloaded_at) : "—"}
                      </td>
                      <td className="border-b-[0.5px] border-foreground px-3 py-2 text-body-sm text-foreground">
                        {row.teacher_name || row.teacher_email || "—"}
                      </td>
                      <td className="border-b-[0.5px] border-foreground px-3 py-2 text-body-sm text-muted">{row.school_name || "—"}</td>
                      <td className="border-b-[0.5px] border-foreground px-3 py-2 text-body-sm text-foreground">
                        {row.resource_title || row.resource_id || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export { ResourcePortalPage as ScholarshipPortalPage }
