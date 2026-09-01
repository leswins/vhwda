import React, { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import { PageHead } from "../ui/PageHead"
import { Button } from "../ui/components/Button"
import { FieldError, FieldLabel, FORM_INPUT_CLASS, FORM_SELECT_CLASS, FORM_TEXTAREA_CLASS, cx } from "../ui/forms/fields"
import { useTeacherAuthStore } from "../zustand/useTeacherAuthStore"
import { fetchTeacherResources } from "../sanity/queries/hubResources"
import type { HubResource } from "../sanity/queries/hubResources"
import {
  fetchResourceTypes,
  getResourceTypeLabel,
  isTeacherPortalType,
  type ResourceType
} from "../sanity/queries/resourceTypes"
import { getLocalizedString, getLocalizedText } from "../sanity/queries/careers"
import { ResourceTypeIcon } from "../ui/widgets/ResourceTypeIcon"
import { accentBg } from "../lib/resourceTypePresentation"
import { trackEvent } from "../utils/analytics"
import { DEMO_TEACHER_RESOURCES, isDemoResourcesEnabled } from "../data/demoResources"

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  )
}

const ROLE_OPTIONS = [
  { value: "teacher", key: "teacherPortal.role.teacher" as const },
  { value: "counselor", key: "teacherPortal.role.counselor" as const },
  { value: "administrator", key: "teacherPortal.role.administrator" as const },
  { value: "other", key: "teacherPortal.role.other" as const }
]

export function TeacherPortalPage() {
  const { language } = useLanguageStore()
  const {
    initialized,
    configured,
    loading,
    user,
    session,
    profile,
    error,
    initialize,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    saveProfile,
    clearError
  } = useTeacherAuthStore()

  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const [fullName, setFullName] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [schoolDistrict, setSchoolDistrict] = useState("")
  const [role, setRole] = useState("teacher")
  const [gradeLevels, setGradeLevels] = useState("")
  const [purpose, setPurpose] = useState("")

  const [resources, setResources] = useState<HubResource[]>([])
  const [types, setTypes] = useState<ResourceType[]>([])
  const [libraryLoading, setLibraryLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [demoLibrary, setDemoLibrary] = useState(false)
  const showDemoEntry = isDemoResourcesEnabled()

  useEffect(() => {
    void initialize()
  }, [initialize])

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "")
      setSchoolName(profile.school_name ?? "")
      setSchoolDistrict(profile.school_district ?? "")
      setRole(profile.role ?? "teacher")
      setGradeLevels(profile.grade_levels ?? "")
      setPurpose(profile.purpose ?? "")
    }
  }, [profile])

  const onboarded = Boolean(profile?.onboarding_completed_at)
  const showLibrary = demoLibrary || Boolean(user && onboarded)

  useEffect(() => {
    if (!showLibrary) return
    let cancelled = false
    async function load() {
      setLibraryLoading(true)
      try {
        const [nextRaw, nextTypes] = await Promise.all([fetchTeacherResources(), fetchResourceTypes()])
        if (cancelled) return
        const nextResources =
          nextRaw.length > 0 ? nextRaw : isDemoResourcesEnabled() ? DEMO_TEACHER_RESOURCES : []
        setResources(nextResources)
        setTypes(nextTypes.filter(isTeacherPortalType))
      } catch {
        if (cancelled) return
        if (isDemoResourcesEnabled()) {
          setResources(DEMO_TEACHER_RESOURCES)
        }
      } finally {
        if (!cancelled) setLibraryLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [showLibrary])

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return resources
    return resources.filter((resource) => {
      const title = getLocalizedString(language, resource.title)?.toLowerCase() ?? ""
      const summary = getLocalizedString(language, resource.summary)?.toLowerCase() ?? ""
      const description = getLocalizedText(language, resource.description)?.toLowerCase() ?? ""
      return `${title} ${summary} ${description} ${resource.institution ?? ""}`.includes(query)
    })
  }, [language, resources, searchQuery])

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    clearError()
    if (!email.trim() || !password) {
      setFormError(t(language, "teacherPortal.validation.credentials"))
      return
    }
    if (mode === "signup" && password !== confirmPassword) {
      setFormError(t(language, "teacherPortal.validation.passwordMatch"))
      return
    }
    if (mode === "signup" && password.length < 6) {
      setFormError(t(language, "teacherPortal.validation.passwordLength"))
      return
    }
    if (mode === "signin") {
      const ok = await signIn(email.trim(), password)
      if (ok) trackEvent("teacher_sign_in", { method: "password", language })
    } else {
      const result = await signUp(email.trim(), password)
      if (result.ok) {
        trackEvent("teacher_sign_up", { method: "password", language })
        setNeedsConfirmation(Boolean(result.needsConfirmation))
      }
    }
  }

  async function handleGoogle() {
    setFormError(null)
    clearError()
    trackEvent("teacher_sign_in", { method: "google", language })
    await signInWithGoogle()
  }

  async function handleProfile(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!fullName.trim() || !schoolName.trim() || !purpose.trim()) {
      setFormError(t(language, "teacherPortal.validation.profile"))
      return
    }
    const ok = await saveProfile({
      full_name: fullName.trim(),
      school_name: schoolName.trim(),
      school_district: schoolDistrict.trim(),
      role,
      grade_levels: gradeLevels.trim(),
      purpose: purpose.trim()
    })
    if (ok) trackEvent("teacher_onboarding_complete", { language, school_name: schoolName.trim() })
  }

  async function handleDownload(resource: HubResource) {
    setDownloadError(null)
    const title = getLocalizedString(language, resource.title) ?? resource._id
    const demoUrl = resource.fileUrl || resource.link
    if (demoLibrary || resource._id.startsWith("demo.")) {
      if (!demoUrl) {
        setDownloadError(t(language, "teacherPortal.download.error"))
        return
      }
      trackEvent("teacher_download", { resource_id: resource._id, resource_title: title, language, demo: true })
      window.open(demoUrl, "_blank", "noopener,noreferrer")
      return
    }
    if (!session) return
    try {
      const response = await fetch("/api/teacher-download", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ resource_id: resource._id })
      })
      if (!response.ok) throw new Error("download failed")
      const payload = (await response.json()) as { url?: string }
      if (!payload.url) throw new Error("missing url")
      trackEvent("teacher_download", {
        resource_id: resource._id,
        resource_title: title,
        language
      })
      window.open(payload.url, "_blank", "noopener,noreferrer")
    } catch {
      setDownloadError(t(language, "teacherPortal.download.error"))
    }
  }

  const authError = formError
    ? formError
    : error === "not_configured"
      ? null
      : error === "profile_save_failed"
        ? t(language, "teacherPortal.profile.error")
        : error === "invalid_credentials"
          ? t(language, "teacherPortal.error.invalidCredentials")
          : error === "email_not_confirmed"
            ? t(language, "teacherPortal.error.emailNotConfirmed")
            : error === "already_registered"
              ? t(language, "teacherPortal.error.alreadyRegistered")
              : error === "weak_password"
                ? t(language, "teacherPortal.error.weakPassword")
                : error === "signup_disabled"
                  ? t(language, "teacherPortal.error.signupDisabled")
                  : error === "auth_failed"
                    ? t(language, "teacherPortal.error.authFailed")
                    : error

  return (
    <>
      <PageHead title={t(language, "page.title.teachers")} description={t(language, "teacherPortal.subtitle")} path="/teachers" />

      <div className="border-b-[0.5px] border-foreground px-5 py-10 lg:p-fluid-50">
        <div className="mx-auto max-w-2xl space-y-3">
          <span className="text-sub2 font-bold uppercase tracking-[0.15em] text-onSurfaceSecondary">
            {t(language, "teacherPortal.kicker")}
          </span>
          <h1 className="text-h2 font-bold tracking-tight text-foreground">{t(language, "teacherPortal.title")}</h1>
          <p className="text-body-lg text-muted">{t(language, "teacherPortal.subtitle")}</p>
        </div>
      </div>

      <div className="min-h-[70vh] px-5 py-10 lg:p-fluid-50">
        <div className="mx-auto max-w-2xl">
          {!initialized ? (
            <p className="text-muted">{t(language, "teacherPortal.loading")}</p>
          ) : !user && !demoLibrary ? (
            <div className="space-y-6">
              {!configured ? (
                <div className="space-y-2 border-[0.5px] border-foreground p-4">
                  <h2 className="text-h4 font-bold text-foreground">{t(language, "teacherPortal.notConfigured.title")}</h2>
                  <p className="text-body-base text-muted">{t(language, "teacherPortal.notConfigured")}</p>
                </div>
              ) : null}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin")
                    setNeedsConfirmation(false)
                    setFormError(null)
                    clearError()
                  }}
                  className={cx(
                    "px-3 py-1.5 text-body-sm font-medium",
                    mode === "signin" ? "bg-foreground text-surface" : "text-foreground hover:bg-surface1"
                  )}
                >
                  {t(language, "teacherPortal.signIn")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup")
                    setNeedsConfirmation(false)
                    setFormError(null)
                    clearError()
                  }}
                  className={cx(
                    "px-3 py-1.5 text-body-sm font-medium",
                    mode === "signup" ? "bg-foreground text-surface" : "text-foreground hover:bg-surface1"
                  )}
                >
                  {t(language, "teacherPortal.createAccount")}
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <FieldLabel htmlFor="email" label={t(language, "teacherPortal.field.email")} required language={language} />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={FORM_INPUT_CLASS}
                    disabled={!configured || loading}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="password" label={t(language, "teacherPortal.field.password")} required language={language} />
                  <input
                    id="password"
                    type="password"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={FORM_INPUT_CLASS}
                    disabled={!configured || loading}
                  />
                </div>
                {mode === "signup" ? (
                  <div>
                    <FieldLabel htmlFor="confirmPassword" label={t(language, "teacherPortal.field.confirmPassword")} required language={language} />
                    <input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={FORM_INPUT_CLASS}
                      disabled={!configured || loading}
                    />
                  </div>
                ) : null}
                {authError ? <FieldError message={authError} /> : null}
                {needsConfirmation ? (
                  <p className="text-body-sm text-foreground">{t(language, "teacherPortal.checkEmail")}</p>
                ) : null}
                <Button type="submit" variant="dark" size="lg" disabled={!configured || loading} className="w-full !rounded-none">
                  {loading
                    ? t(language, "teacherPortal.submitting")
                    : mode === "signin"
                      ? t(language, "teacherPortal.signIn")
                      : t(language, "teacherPortal.createAccount")}
                </Button>
              </form>

              <div className="flex items-center gap-3 text-body-sm text-muted">
                <div className="h-[0.5px] flex-1 bg-foreground" />
                {t(language, "teacherPortal.or")}
                <div className="h-[0.5px] flex-1 bg-foreground" />
              </div>

              <Button type="button" variant="outline" size="lg" disabled={!configured || loading} onClick={handleGoogle} className="w-full !rounded-none">
                <GoogleMark />
                {t(language, "teacherPortal.continueGoogle")}
              </Button>
              {showDemoEntry ? (
                <Button type="button" variant="outline" size="lg" onClick={() => setDemoLibrary(true)} className="w-full !rounded-none">
                  {t(language, "teacherPortal.demo.preview")}
                </Button>
              ) : null}
            </div>
          ) : user && !onboarded && !demoLibrary ? (
            <form onSubmit={handleProfile} className="space-y-6">
              <div>
                <h2 className="text-h4 font-bold text-foreground">{t(language, "teacherPortal.onboarding.title")}</h2>
                <p className="mt-2 text-body-base text-muted">{t(language, "teacherPortal.onboarding.subtitle")}</p>
              </div>
              <div>
                <FieldLabel htmlFor="fullName" label={t(language, "teacherPortal.field.fullName")} required language={language} />
                <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className={FORM_INPUT_CLASS} />
              </div>
              <div>
                <FieldLabel htmlFor="schoolName" label={t(language, "teacherPortal.field.school")} required language={language} />
                <input id="schoolName" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className={FORM_INPUT_CLASS} />
              </div>
              <div>
                <FieldLabel htmlFor="schoolDistrict" label={t(language, "teacherPortal.field.district")} language={language} />
                <input id="schoolDistrict" value={schoolDistrict} onChange={(e) => setSchoolDistrict(e.target.value)} className={FORM_INPUT_CLASS} />
              </div>
              <div>
                <FieldLabel htmlFor="role" label={t(language, "teacherPortal.field.role")} language={language} />
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className={FORM_SELECT_CLASS}>
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(language, opt.key)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="gradeLevels" label={t(language, "teacherPortal.field.grades")} language={language} />
                <input id="gradeLevels" value={gradeLevels} onChange={(e) => setGradeLevels(e.target.value)} className={FORM_INPUT_CLASS} />
              </div>
              <div>
                <FieldLabel htmlFor="purpose" label={t(language, "teacherPortal.field.purpose")} required language={language} />
                <textarea id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} className={FORM_TEXTAREA_CLASS} rows={4} />
              </div>
              {authError ? <FieldError message={authError} /> : null}
              <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="dark" size="lg" disabled={loading} className="!rounded-none">
                  {loading ? t(language, "teacherPortal.submitting") : t(language, "teacherPortal.onboarding.submit")}
                </Button>
                <Button type="button" variant="outline" onClick={() => void signOut()} className="!rounded-none">
                  {t(language, "teacherPortal.signOut")}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              {demoLibrary ? (
                <div className="border-[0.5px] border-foreground p-4">
                  <p className="text-body-sm text-muted">{t(language, "teacherPortal.demo.banner")}</p>
                </div>
              ) : null}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-h4 font-bold text-foreground">{t(language, "teacherPortal.library.title")}</h2>
                  <p className="mt-2 text-body-base text-muted">
                    {demoLibrary
                      ? t(language, "teacherPortal.demo.greeting")
                      : t(language, "teacherPortal.library.greeting").replace("{name}", profile?.full_name || user?.email || "")}
                  </p>
                </div>
                {demoLibrary && !user ? (
                  <Button type="button" variant="outline" size="sm" onClick={() => setDemoLibrary(false)} className="!rounded-none">
                    {t(language, "teacherPortal.demo.exit")}
                  </Button>
                ) : (
                  <Button type="button" variant="outline" size="sm" onClick={() => void signOut()} className="!rounded-none">
                    {t(language, "teacherPortal.signOut")}
                  </Button>
                )}
              </div>

              {types.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {types.map((type) => (
                    <span key={type._id} className={cx("inline-flex items-center gap-2 px-3 py-1.5 text-body-sm font-semibold", accentBg(type.accent))}>
                      <span className="h-4 w-4">
                        <ResourceTypeIcon icon={type.icon} />
                      </span>
                      {getResourceTypeLabel(language, type)}
                    </span>
                  ))}
                </div>
              ) : null}

              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(language, "teacherPortal.library.search")}
                className={FORM_INPUT_CLASS}
              />

              {downloadError ? <FieldError message={downloadError} /> : null}

              {libraryLoading ? (
                <p className="text-muted">{t(language, "teacherPortal.library.loading")}</p>
              ) : filteredResources.length === 0 ? (
                <p className="text-muted">{t(language, "teacherPortal.library.empty")}</p>
              ) : (
                <div>
                  {filteredResources.map((resource) => {
                    const title = getLocalizedString(language, resource.title) ?? ""
                    const description =
                      getLocalizedText(language, resource.description) || getLocalizedString(language, resource.summary)
                    return (
                      <div key={resource._id} className="space-y-3 border-b-[0.5px] border-foreground py-6 first:pt-0 last:border-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <h3 className="text-h4 font-semibold text-foreground">{title}</h3>
                            {resource.institution ? (
                              <p className="text-body-xs font-medium uppercase tracking-[0.08em] text-onSurfaceSecondary">
                                {resource.institution}
                              </p>
                            ) : null}
                            {description ? <p className="text-body-sm text-muted">{description}</p> : null}
                          </div>
                          {resource.hasFile ? (
                            <Button
                              type="button"
                              variant="dark"
                              size="sm"
                              className="shrink-0 !rounded-none !bg-accentYellow !text-foreground"
                              onClick={() => void handleDownload(resource)}
                            >
                              {t(language, "teacherPortal.download")}
                            </Button>
                          ) : resource.link ? (
                            <a
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 bg-accentYellow px-4 py-2 text-sm font-semibold text-foreground"
                            >
                              {t(language, "common.visitSite")}
                            </a>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <p className="text-body-sm text-muted">
                {t(language, "teacherPortal.library.publicHubPrompt")}{" "}
                <Link to="/resources" className="underline underline-offset-2">
                  {t(language, "nav.resources")}
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
