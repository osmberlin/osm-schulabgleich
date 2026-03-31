/**
 * Same real-world field, different key names across OSM vs official (or tag variants).
 * Values map from raw key (after `contact:` / `addr:` strip) → canonical compare key.
 */
const COMPARE_KEY_ALIASES: Record<string, string> = {
  zip: 'postcode',
}

/**
 * Canonical key for property compare: OSM `contact:email` ↔ official `email`,
 * `addr:city` ↔ official `city`, manual aliases like `zip` ↔ `postcode`, etc.
 * (`addr:*` and `contact:*` use the same prefix rules.)
 */
function canonicalPropertyKey(key: string): string {
  let k = key
  if (k.startsWith('contact:')) k = k.slice('contact:'.length)
  else if (k.startsWith('addr:')) k = k.slice('addr:'.length)
  return COMPARE_KEY_ALIASES[k] ?? k
}

function flattenOfficialForCompare(o: Record<string, unknown>): Map<string, string> {
  const m = new Map<string, string>()
  for (const [k, v] of Object.entries(o)) {
    if (v == null || typeof v === 'object') continue
    const s = String(v)
    m.set(canonicalPropertyKey(k), s)
  }
  return m
}

/**
 * Bare keys, `addr:*`, and `contact:*` share one canonical key each; on conflict,
 * `addr:*` overrides bare, `contact:*` overrides both (same idea as contact vs bare).
 */
function flattenOsmTagsForCompare(osm: Record<string, string>): Map<string, string> {
  const fromBare = new Map<string, string>()
  const fromAddr = new Map<string, string>()
  const fromContact = new Map<string, string>()
  for (const [k, v] of Object.entries(osm)) {
    if (v == null) continue
    if (k.startsWith('_pipeline')) continue
    if (k.startsWith('contact:')) {
      fromContact.set(canonicalPropertyKey(k), v)
    } else if (k.startsWith('addr:')) {
      fromAddr.set(canonicalPropertyKey(k), v)
    } else {
      fromBare.set(canonicalPropertyKey(k), v)
    }
  }
  const merged = new Map(fromBare)
  for (const [c, v] of fromAddr) merged.set(c, v)
  for (const [c, v] of fromContact) merged.set(c, v)
  return merged
}

export function comparePropertySections(
  official: Record<string, unknown> | null | undefined,
  osm: Record<string, string> | null | undefined,
): {
  both: [string, string, string][]
  onlyO: [string, string][]
  onlyS: [string, string][]
} {
  const offMap = flattenOfficialForCompare(official ?? {})
  const osmMap = flattenOsmTagsForCompare(osm ?? {})
  const keys = new Set([...offMap.keys(), ...osmMap.keys()])
  const both: [string, string, string][] = []
  const onlyO: [string, string][] = []
  const onlyS: [string, string][] = []
  for (const k of [...keys].sort((a, b) => a.localeCompare(b, 'de'))) {
    const os = offMap.get(k) ?? null
    const ss = osmMap.get(k) ?? null
    if (os != null && ss != null) both.push([k, os, ss])
    else if (os != null) onlyO.push([k, os])
    else if (ss != null) onlyS.push([k, ss])
  }
  return { both, onlyO, onlyS }
}
