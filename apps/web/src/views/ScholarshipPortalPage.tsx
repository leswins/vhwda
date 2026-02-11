import React, { useCallback, useEffect, useState } from "react"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import type { Language } from "../utils/i18n"
import { PageHead } from "../ui/PageHead"
import { Button } from "../ui/components/Button"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Submission = {
  id: string
  name: string
  summary: string | null
  description: string | null
  institution: string | null
  eligibility: string | null
  region: string | null
  deadline: string | null
  link: string
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

type StatusFilter = "all" | "pending" | "approved" | "declined"

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ")
}

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

/** Resolve a value through an i18n key map, falling back to the raw value. */
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

/* ------------------------------------------------------------------ */
/*  Detail row helper                                                  */
/* ------------------------------------------------------------------ */

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <dt className="text-body-sm font-semibold text-foreground shrink-0 sm:w-40">{label}</dt>
      <dd className="text-body-sm text-muted break-words">{value}</dd>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Submission Card                                                    */
/* ------------------------------------------------------------------ */

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
    if (!window.confirm(t(language, confirmKey as Parameters<typeof t>[1]))) return

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
      setReviewMessage({ type: "success", text: t(language, successKey as Parameters<typeof t>[1]) })

      // Refresh list after short delay
      setTimeout(onReviewComplete, 1000)
    } catch {
      setReviewMessage({ type: "error", text: t(language, "scholarshipPortal.reviewError") })
    } finally {
      setReviewing(false)
    }
  }

  return (
    <div className="border-b-[0.5px] border-foreground py-5 lg:py-8 first:pt-0 last:border-0 last:pb-0">
      {/* Summary row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-body-base lg:text-lg font-semibold text-foreground">{submission.name}</h3>
            <StatusBadge status={submission.status} language={language} />
          </div>
          {submission.institution && (
            <p className="text-body-sm text-muted">{submission.institution}</p>
          )}
          <p className="text-body-sm text-muted">
            {t(language, "scholarshipPortal.submittedBy")}{" "}
            <span className="font-medium text-foreground">{submission.submitter_name}</span>
            {" "}{t(language, "scholarshipPortal.submittedOn")}{" "}
            {formatDate(submission.submitted_at)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 text-body-sm font-medium text-accentBlue underline underline-offset-2 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 rounded"
        >
          {expanded
            ? t(language, "scholarshipPortal.hideDetails")
            : t(language, "scholarshipPortal.viewDetails")}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-5 space-y-5">
          <dl className="space-y-3 rounded-none bg-surface1 p-4">
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
                  <a
                    href={submission.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 hover:opacity-80 break-all"
                  >
                    {submission.link}
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
            <DetailRow
              label={t(language, "scholarshipPortal.detail.careerAreas")}
              value={submission.career_areas_text}
            />

            {/* Submitter details */}
            <div className="border-t-[0.5px] border-foreground/10 pt-3 mt-3" />
            <DetailRow
              label={t(language, "scholarshipPortal.detail.organization")}
              value={submission.submitter_organization}
            />
            <DetailRow label="Email" value={submission.submitter_email} />
            <DetailRow
              label={t(language, "scholarshipPortal.detail.notes")}
              value={submission.notes}
            />
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

          {/* Review message */}
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

          {/* Approve / Decline actions */}
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
              <Button
                variant="outline"
                size="sm"
                disabled={reviewing}
                onClick={() => handleReview("decline")}
                className="!rounded-none"
              >
                {t(language, "scholarshipPortal.decline")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export function ScholarshipPortalPage() {
  const { language } = useLanguageStore()
  const [password, setPassword] = useState(() => sessionStorage.getItem("scholarship_portal_pw") || "")
  const [authenticated, setAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const fetchSubmissions = useCallback(async (pw: string, filter?: StatusFilter) => {
    setLoading(true)
    setLoadError(false)
    try {
      const params = filter && filter !== "all" ? `?status=${filter}` : ""
      const response = await fetch(`/api/scholarship-submissions${params}`, {
        headers: { "x-portal-password": pw }
      })
      if (response.status === 401) {
        // Bad password
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

  // Auto-login if password in session
  useEffect(() => {
    const stored = sessionStorage.getItem("scholarship_portal_pw")
    if (stored) {
      setPassword(stored)
      setAuthenticated(true)
    }
  }, [])

  // Single fetch trigger: runs on mount (after auto-login sets state),
  // on login, and whenever the status filter changes.
  useEffect(() => {
    if (authenticated && password) {
      fetchSubmissions(password, statusFilter)
    }
  }, [statusFilter, authenticated, password, fetchSubmissions])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError(false)
    const pw = passwordInput.trim()
    if (!pw) return
    setPassword(pw)
    sessionStorage.setItem("scholarship_portal_pw", pw)
    setAuthenticated(true)
    // fetchSubmissions will be triggered by the useEffect above
    // when authenticated + password state updates propagate.
  }

  function handleLogout() {
    setPassword("")
    setPasswordInput("")
    setAuthenticated(false)
    setSubmissions([])
    sessionStorage.removeItem("scholarship_portal_pw")
  }

  const filteredCount = submissions.length
  const countText =
    filteredCount === 1
      ? t(language, "scholarshipPortal.countSingular")
      : t(language, "scholarshipPortal.count").replace("{count}", String(filteredCount))

  /* ---- Login gate ---- */
  if (!authenticated) {
    return (
      <>
        <PageHead title={t(language, "page.title.scholarshipPortal")} description={t(language, "scholarshipPortal.subtitle")} />
        <div className="min-h-[100vh] px-5 py-10 lg:p-fluid-50">
          <div className="mx-auto max-w-sm space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-h3 font-bold tracking-tight text-foreground">
                {t(language, "scholarshipPortal.login.title")}
              </h1>
              <p className="text-body-base text-muted">
                {t(language, "scholarshipPortal.login.description")}
              </p>
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
              {loginError && (
                <p className="text-body-sm text-accentOrange">
                  {t(language, "scholarshipPortal.login.error")}
                </p>
              )}
              <Button type="submit" variant="dark" size="lg" className="w-full !rounded-none">
                {t(language, "scholarshipPortal.login.submit")}
              </Button>
            </form>
          </div>
        </div>
      </>
    )
  }

  /* ---- Dashboard ---- */
  return (
    <>
      <PageHead title={t(language, "page.title.scholarshipPortal")} description={t(language, "scholarshipPortal.subtitle")} />

      {/* Header */}
      <div className="border-b-[0.5px] border-foreground px-5 py-10 lg:p-fluid-50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-h2 font-bold tracking-tight text-foreground">
              {t(language, "scholarshipPortal.title")}
            </h1>
            <p className="mt-2 text-body-lg text-muted">
              {t(language, "scholarshipPortal.subtitle")}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="shrink-0 !rounded-none"
          >
            {t(language, "scholarshipPortal.logout")}
          </Button>
        </div>
      </div>

      {/* Filter tabs + count */}
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
                    isActive
                      ? "bg-foreground text-surface"
                      : "bg-transparent text-foreground hover:bg-surface1"
                  )}
                >
                  {t(language, filterKey)}
                </button>
              )
            })}
          </div>
          {!loading && (
            <p className="text-body-sm text-muted">{countText}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[100vh] px-5 py-5 lg:px-fluid-50 lg:py-8">
        {loading ? (
          <p className="text-body-base text-muted py-10 text-center">
            {t(language, "scholarshipPortal.loading")}
          </p>
        ) : loadError ? (
          <p className="text-body-base text-accentOrange py-10 text-center">
            {t(language, "scholarshipPortal.error")}
          </p>
        ) : submissions.length === 0 ? (
          <p className="text-body-base text-muted py-10 text-center">
            {t(language, "scholarshipPortal.empty")}
          </p>
        ) : (
          <div>
            {submissions.map((submission) => (
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
  )
}
