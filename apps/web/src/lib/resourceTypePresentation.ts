import type { ResourceAccent, ResourceIconKey } from "../sanity/queries/resourceTypes"

export const ACCENT_BG: Record<ResourceAccent, string> = {
  green: "bg-accentGreen",
  pink: "bg-accentPink",
  blue: "bg-accentBlue",
  yellow: "bg-accentYellow",
  orange: "bg-accentOrange"
}

export const ACCENT_SOFT_BG: Record<ResourceAccent, string> = {
  green: "bg-accentGreen/20",
  pink: "bg-accentPink/20",
  blue: "bg-accentBlue/20",
  yellow: "bg-accentYellow/20",
  orange: "bg-accentOrange/20"
}

export function accentBg(accent?: ResourceAccent) {
  return ACCENT_BG[accent ?? "green"]
}

export function isBuiltInIcon(value: string): value is ResourceIconKey {
  return ["help", "doctor", "education", "briefcase", "grant", "document"].includes(value)
}
