const deInteger = new Intl.NumberFormat('de-DE', {
  maximumFractionDigits: 0,
})

/**
 * Integers with German grouping (e.g. `17291` → `17.291`). No forced decimals.
 */
export function formatDeInteger(n: number): string {
  return deInteger.format(n)
}

const deOneDecimal = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

/** Metres up to 1000 (`36 m`), kilometres with one decimal above (`2,4 km`). */
export function formatDistanceDe(meters: number): string {
  return meters > 1000 ? `${deOneDecimal.format(meters / 1000)} km` : `${formatDeInteger(meters)} m`
}
