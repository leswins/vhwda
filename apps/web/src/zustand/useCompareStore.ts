import { create } from "zustand"

type State = {
  careerIds: string[]
  addCareer: (id: string) => void
  removeCareer: (id: string) => void
  clearCompare: () => void
}

const STORAGE_KEY = "vhwda.compare"
const MAX_COMPARE = 4

function loadCompare(): string[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const ids = JSON.parse(raw)
    if (Array.isArray(ids) && ids.every(id => typeof id === "string")) {
      return ids.slice(0, MAX_COMPARE)
    }
    return []
  } catch {
    return []
  }
}

function saveCompare(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export const useCompareStore = create<State>((set) => ({
  careerIds: loadCompare(),
  addCareer: (id: string) => {
    set((state) => {
      if (state.careerIds.includes(id)) return state
      if (state.careerIds.length >= MAX_COMPARE) return state
      const newIds = [...state.careerIds, id]
      saveCompare(newIds)
      return { careerIds: newIds }
    })
  },
  removeCareer: (id: string) => {
    set((state) => {
      const newIds = state.careerIds.filter(cId => cId !== id)
      saveCompare(newIds)
      return { careerIds: newIds }
    })
  },
  clearCompare: () => {
    saveCompare([])
    set({ careerIds: [] })
  }
}))

