import React from "react"
import type { Language } from "../../utils/i18n"
import { t } from "../../utils/i18n"

type Props = {
  language: Language
  count?: number
}

export function ProfessionalOrganizationList({ language, count = 0 }: Props) {
  return <div className="flex-1 space-y-4"></div>
}

