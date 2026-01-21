import { create } from "zustand"
import type { CareerSummaryCard } from "../sanity/queries/careers"
import { fetchCareersForSearch } from "../sanity/queries/careers"
import { useGlobalLoadingStore } from "./useGlobalLoadingStore"

type State = {
  careers: CareerSummaryCard[]
  loading: boolean
  error: Error | null
  initialized: boolean
  fetchCareers: () => Promise<void>
}

export const useCareersStore = create<State>((set) => ({
  careers: [],
  loading: false,
  error: null,
  initialized: false,
  fetchCareers: async () => {
    const state = useCareersStore.getState()
    if (state.initialized && state.careers.length > 0) {
      return
    }

    set({ loading: true, error: null })
    useGlobalLoadingStore.getState().setLoading(true)
    try {
      const careers = await fetchCareersForSearch()
      set({ careers, loading: false, error: null, initialized: true })
    } catch (error) {
      set({ error: error as Error, loading: false })
    } finally {
      useGlobalLoadingStore.getState().setLoading(false)
    }
  }
}))

