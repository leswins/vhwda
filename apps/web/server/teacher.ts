import { getSupabaseConfig, supabaseRest } from "./cms"

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
  created_at?: string
  updated_at?: string
}

export type AuthUser = {
  id: string
  email?: string
}

export async function getAuthUser(accessToken: string): Promise<AuthUser | null> {
  const { supabaseUrl, serviceKey, anonKey } = getSupabaseConfig()
  const apikey = serviceKey || anonKey
  if (!supabaseUrl || !apikey || !accessToken) return null

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey,
      Authorization: `Bearer ${accessToken}`
    }
  })
  if (!response.ok) return null
  const user = (await response.json()) as AuthUser
  return user?.id ? user : null
}

export function getBearerToken(request: Request) {
  const header = request.headers.get("authorization") || request.headers.get("Authorization")
  if (!header) return null
  const [scheme, token] = header.split(" ")
  if (scheme?.toLowerCase() !== "bearer" || !token) return null
  return token
}

export async function fetchTeacherProfile(id: string) {
  const result = await supabaseRest<TeacherProfile[]>(`teacher_profiles?id=eq.${id}&limit=1`)
  if (!result.ok || !Array.isArray(result.data)) return null
  return result.data[0] ?? null
}

export async function upsertTeacherProfile(profile: TeacherProfile) {
  const result = await supabaseRest<TeacherProfile[]>("teacher_profiles", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: {
      ...profile,
      updated_at: new Date().toISOString()
    }
  })
  if (result.ok && Array.isArray(result.data) && result.data[0]) return result.data[0]

  const patch = await supabaseRest<TeacherProfile[]>(`teacher_profiles?id=eq.${profile.id}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: {
      ...profile,
      updated_at: new Date().toISOString()
    }
  })
  if (patch.ok && Array.isArray(patch.data) && patch.data[0]) return patch.data[0]
  return null
}
