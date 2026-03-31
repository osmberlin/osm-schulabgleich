function str(v: unknown): string | null {
  if (v == null) return null
  const s = String(v).trim()
  return s.length ? s : null
}

/**
 * One subtitle line: address / Ort · Bundesland (code).
 * Uses JedeSchule fields first, then OSM addr:*.
 */
export function formatSchoolWhereSubtitle(
  landLabel: string,
  landCode: string,
  officialProperties: Record<string, unknown> | null | undefined,
  osmTags: Record<string, string> | null | undefined,
): string {
  const o = officialProperties ?? {}
  const addr = str(o.address)
  const zip = str(o.zip)
  const city = str(o.city) ?? str(osmTags?.['addr:city'])
  const street = str(osmTags?.['addr:street'])
  const hn = str(osmTags?.['addr:housenumber'])
  const osmAddr = street ? [street, hn].filter(Boolean).join(' ') : null
  const place = [zip, city].filter(Boolean).join(' ')

  const left = addr || osmAddr
  const mid = place
  if (left && mid) return `${left}, ${mid} · ${landLabel} (${landCode})`
  if (left) return `${left} · ${landLabel} (${landCode})`
  if (mid) return `${mid} · ${landLabel} (${landCode})`
  return `${landLabel} (${landCode})`
}
