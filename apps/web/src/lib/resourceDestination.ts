export type ResourceDestination = "public_hub" | "teacher_portal"

export function destinationForAudience(
  audience: string | undefined,
  requested: ResourceDestination
): ResourceDestination {
  if (audience === "teacherPortal") return "teacher_portal"
  if (audience === "publicHub") return "public_hub"
  return requested
}

export function canChooseResourceDestination(audience: string | undefined) {
  return audience === "both"
}
