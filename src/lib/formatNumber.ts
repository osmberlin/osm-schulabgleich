const deInteger = new Intl.NumberFormat('de-DE', {
  maximumFractionDigits: 0,
})

/**
 * Integers with German grouping (e.g. `17291` → `17.291`). No forced decimals.
 */
export function formatDeInteger(n: number): string {
  return deInteger.format(n)
}
