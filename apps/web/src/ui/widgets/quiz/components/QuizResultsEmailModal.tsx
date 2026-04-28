import React, { useEffect, useId, useState } from "react"
import { Button } from "../../../components/Button"
import type { Language } from "../../../../utils/i18n"
import { t } from "../../../../utils/i18n"
import { isValidEmailAddress } from "../quizResultsEmail"

const INPUT_CLASS =
  "w-full border-[0.5px] border-foreground rounded-none px-3 py-2.5 bg-surface text-foreground text-body-base placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 transition-colors"

type QuizResultsEmailModalProps = {
  isOpen: boolean
  isSubmitting: boolean
  isSubmitted: boolean
  submitError?: string | null
  language: Language
  onClose: () => void
  onSubmit: (email: string) => Promise<void> | void
}

export function QuizResultsEmailModal({
  isOpen,
  isSubmitting,
  isSubmitted,
  submitError,
  language,
  onClose,
  onSubmit,
}: QuizResultsEmailModalProps) {
  const emailId = useId()
  const [email, setEmail] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setEmail("")
      setValidationError(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const errorMessage = validationError || submitError

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setValidationError(t(language, "quiz.results.email.validation.required"))
      return
    }

    if (!isValidEmailAddress(trimmedEmail)) {
      setValidationError(t(language, "quiz.results.email.validation.invalid"))
      return
    }

    setValidationError(null)
    await onSubmit(trimmedEmail)
  }

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-foreground/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-results-email-modal-title"
        className="w-full max-w-[560px] border border-foreground bg-surface"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b-[0.5px] border-foreground px-6 py-5">
          <div>
            <h2 id="quiz-results-email-modal-title" className="text-h4 font-bold text-foreground">
              {isSubmitted
                ? t(language, "quiz.results.email.success.title")
                : t(language, "quiz.results.email.title")}
            </h2>
          </div>
          <button
            type="button"
            aria-label={t(language, "quiz.results.email.close")}
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center border border-transparent text-foreground transition-colors hover:bg-surface1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {isSubmitted ? (
          <div className="space-y-6 px-6 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accentGreen/20">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-body-lg text-muted">
              {t(language, "quiz.results.email.success.description")}
            </p>
            <div className="flex justify-end">
              <Button variant="dark" onClick={onClose}>
                {t(language, "quiz.results.email.close")}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6 px-6 py-8">
            <p className="text-body-lg text-onSurfaceSecondary">
              {t(language, "quiz.results.email.description")}
            </p>

            <div>
              <input
                id={emailId}
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-label={t(language, "quiz.results.email.fieldLabel")}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (validationError) {
                    setValidationError(null)
                  }
                }}
                placeholder={t(language, "quiz.results.email.placeholder")}
                className={`${INPUT_CLASS} ${errorMessage ? "ring-2 ring-accentOrange" : ""}`}
              />
              {errorMessage ? (
                <p className="mt-[5px] text-body-sm text-accentOrange">{errorMessage}</p>
              ) : (
                <p className="mt-[5px] text-body-sm text-muted">
                  {t(language, "quiz.results.email.helper")}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" className="rounded-none" onClick={onClose} disabled={isSubmitting}>
                {t(language, "quiz.results.email.cancel")}
              </Button>
              <Button type="submit" variant="dark" disabled={isSubmitting}>
                {isSubmitting
                  ? t(language, "quiz.results.email.sending")
                  : t(language, "quiz.results.email.submit")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
