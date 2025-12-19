export type Language = "en" | "es"

export type LocalizedString = { en: string; es?: string }
export type LocalizedText = { en: string; es?: string }

export function pickLocale<T extends { en: any; es?: any }>(value: T, language: Language) {
  if (language === "es" && value.es) return value.es
  return value.en
}

/**
 * Shared constants (centralized to keep Studio + Web aligned)
 */
export const SANITY_PROJECT_ID = "j0yc55ca"
export const SANITY_DATASET = "production"


