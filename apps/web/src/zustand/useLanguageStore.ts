import { create } from "zustand"

type Language = "en" | "es"

type State = {
  language: Language
  setLanguage: (language: Language) => void
}

const STORAGE_KEY = "vhwda.language"

function loadLanguage(): Language {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === "en" || raw === "es") return raw
  return "en"
}

export const useLanguageStore = create<State>((set) => ({
  language: loadLanguage(),
  setLanguage: (language) => {
    localStorage.setItem(STORAGE_KEY, language)
    set({ language })
  }
}))


