import { create } from "zustand"
import type { Session, User } from "@supabase/supabase-js"
import { getTeacherAuthConfig, getTeacherClient } from "../lib/teacherAuth"

export type TeacherProfile = {
  id: string
  email: string
  full_name: string | null
  school_name: string | null
  school_district: string | null
  role: string | null
  purpose: string | null
  grade_levels: string | null
  onboarding_completed_at: string | null
}

type State = {
  initialized: boolean
  configured: boolean
  googleAuthEnabled: boolean
  loading: boolean
  user: User | null
  session: Session | null
  profile: TeacherProfile | null
  error: string | null
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string) => Promise<{ ok: boolean; needsConfirmation?: boolean }>
  signInWithGoogle: () => Promise<boolean>
  signOut: () => Promise<void>
  saveProfile: (profile: Omit<TeacherProfile, "id" | "email" | "onboarding_completed_at"> & { email?: string }) => Promise<boolean>
  clearError: () => void
}

async function loadProfile(accessToken: string): Promise<TeacherProfile | null> {
  const response = await fetch("/api/teacher-profile", {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!response.ok) return null
  const payload = (await response.json()) as { profile?: TeacherProfile | null }
  return payload.profile ?? null
}

function mapAuthError(message: string) {
  const value = message.toLowerCase()
  if (value.includes("invalid login") || value.includes("invalid credentials")) return "invalid_credentials"
  if (value.includes("email not confirmed")) return "email_not_confirmed"
  if (value.includes("already registered") || value.includes("already been registered")) return "already_registered"
  if (value.includes("password") && (value.includes("6") || value.includes("least"))) return "weak_password"
  if (value.includes("signups not allowed") || value.includes("signup is disabled")) return "signup_disabled"
  return "auth_failed"
}

export const useTeacherAuthStore = create<State>((set, get) => ({
  initialized: false,
  configured: false,
  googleAuthEnabled: false,
  loading: false,
  user: null,
  session: null,
  profile: null,
  error: null,

  clearError: () => set({ error: null }),

  initialize: async () => {
    if (get().initialized) return
    const config = await getTeacherAuthConfig()
    const googleAuthEnabled = Boolean(config.googleAuthEnabled)
    if (!config.configured) {
      set({ initialized: true, configured: false, googleAuthEnabled })
      return
    }

    const client = await getTeacherClient()
    if (!client) {
      set({ initialized: true, configured: false, googleAuthEnabled })
      return
    }

    const { data } = await client.auth.getSession()
    const session = data.session
    const profile = session ? await loadProfile(session.access_token) : null
    set({
      initialized: true,
      configured: true,
      googleAuthEnabled,
      user: session?.user ?? null,
      session,
      profile
    })

    client.auth.onAuthStateChange(async (_event, nextSession) => {
      const nextProfile = nextSession ? await loadProfile(nextSession.access_token) : null
      set({
        user: nextSession?.user ?? null,
        session: nextSession,
        profile: nextProfile
      })
    })
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null })
    const client = await getTeacherClient()
    if (!client) {
      set({ loading: false, error: "not_configured" })
      return false
    }
    const { error } = await client.auth.signInWithPassword({ email, password })
    if (error) {
      set({ loading: false, error: mapAuthError(error.message) })
      return false
    }
    const { data } = await client.auth.getSession()
    const profile = data.session ? await loadProfile(data.session.access_token) : null
    set({
      loading: false,
      user: data.session?.user ?? null,
      session: data.session,
      profile
    })
    return true
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null })
    const client = await getTeacherClient()
    if (!client) {
      set({ loading: false, error: "not_configured" })
      return { ok: false }
    }
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/teachers/auth/callback`
      }
    })
    if (error) {
      set({ loading: false, error: mapAuthError(error.message) })
      return { ok: false }
    }
    const needsConfirmation = Boolean(data.user) && !data.session
    if (data.session) {
      const profile = await loadProfile(data.session.access_token)
      set({
        loading: false,
        user: data.session.user,
        session: data.session,
        profile
      })
    } else {
      set({ loading: false })
    }
    return { ok: true, needsConfirmation }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null })
    const client = await getTeacherClient()
    if (!client) {
      set({ loading: false, error: "not_configured" })
      return false
    }
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/teachers/auth/callback`
      }
    })
    if (error) {
      set({ loading: false, error: mapAuthError(error.message) })
      return false
    }
    return true
  },

  signOut: async () => {
    const client = await getTeacherClient()
    await client?.auth.signOut()
    set({ user: null, session: null, profile: null, error: null })
  },

  saveProfile: async (input) => {
    const session = get().session
    if (!session) return false
    set({ loading: true, error: null })
    const response = await fetch("/api/teacher-profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    })
    if (!response.ok) {
      set({ loading: false, error: "profile_save_failed" })
      return false
    }
    const payload = (await response.json()) as { profile?: TeacherProfile }
    set({ loading: false, profile: payload.profile ?? null })
    return true
  }
}))
