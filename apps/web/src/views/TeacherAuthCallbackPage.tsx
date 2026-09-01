import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguageStore } from "../zustand/useLanguageStore"
import { t } from "../utils/i18n"
import { PageHead } from "../ui/PageHead"
import { getTeacherClient } from "../lib/teacherAuth"
import { useTeacherAuthStore } from "../zustand/useTeacherAuthStore"

export function TeacherAuthCallbackPage() {
  const { language } = useLanguageStore()
  const navigate = useNavigate()
  const initialize = useTeacherAuthStore((state) => state.initialize)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function complete() {
      try {
        const client = await getTeacherClient()
        if (!client) {
          if (!cancelled) setError(true)
          return
        }
        await client.auth.getSession()
        await initialize()
        if (!cancelled) navigate("/teachers", { replace: true })
      } catch {
        if (!cancelled) setError(true)
      }
    }
    complete()
    return () => {
      cancelled = true
    }
  }, [initialize, navigate])

  return (
    <>
      <PageHead title={t(language, "page.title.teachers")} description={t(language, "teacherPortal.subtitle")} path="/teachers/auth/callback" />
      <div className="min-h-[60vh] px-5 py-10 lg:p-fluid-50">
        <p className="text-body-base text-muted">
          {error ? t(language, "teacherPortal.callback.error") : t(language, "teacherPortal.callback.working")}
        </p>
      </div>
    </>
  )
}
