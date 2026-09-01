import { createClient, type Session, type SupabaseClient, type User } from "@supabase/supabase-js"

export type TeacherAuthConfig = {
  configured: boolean
  googleAuthEnabled?: boolean
  supabaseUrl?: string
  anonKey?: string
}

let client: SupabaseClient | null = null
let configPromise: Promise<TeacherAuthConfig> | null = null

export async function getTeacherAuthConfig(): Promise<TeacherAuthConfig> {
  if (!configPromise) {
    configPromise = fetch("/api/teacher-config")
      .then(async (response) => {
        if (!response.ok) return { configured: false }
        return (await response.json()) as TeacherAuthConfig
      })
      .catch(() => ({ configured: false }))
  }
  return configPromise
}

export async function getTeacherClient(): Promise<SupabaseClient | null> {
  if (client) return client
  const config = await getTeacherAuthConfig()
  if (!config.configured || !config.supabaseUrl || !config.anonKey) return null
  client = createClient(config.supabaseUrl, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "vhwda.teacher.auth"
    }
  })
  return client
}

export type TeacherSession = {
  user: User
  session: Session
}
