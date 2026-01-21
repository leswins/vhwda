import { create } from "zustand"
import {
  fetchGlobalSearchData,
  type CareerSearchResult,
  type ScholarshipSearchResult,
  type OrganizationSearchResult
} from "../sanity/queries/globalSearch"

type State = {
  careers: CareerSearchResult[]
  scholarships: ScholarshipSearchResult[]
  organizations: OrganizationSearchResult[]
  loading: boolean
  error: Error | null
  initialized: boolean
  fetchSearchData: () => Promise<void>
}

/**
 * Stores global search data so the NavHeader can filter locally.
 * Data is fetched once and cached to avoid repeated network calls.
 */
export const useGlobalSearchStore = create<State>((set, get) => ({
  careers: [],
  scholarships: [],
  organizations: [],
  loading: false,
  error: null,
  initialized: false,
  fetchSearchData: async () => {
    const state = get()
    if (state.initialized && state.careers.length > 0) {
      return
    }

    set({ loading: true, error: null })
    try {
      const { careers, scholarships, organizations } = await fetchGlobalSearchData()
      set({
        careers,
        scholarships,
        organizations,
        loading: false,
        error: null,
        initialized: true
      })
    } catch (error) {
      set({ error: error as Error, loading: false })
    }
  }
}))

