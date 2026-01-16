export function formatMoney(value?: number | null): string | undefined {
  if (value === undefined || value === null) return undefined
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `$${value}`
  }
}

