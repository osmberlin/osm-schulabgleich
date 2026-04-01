/**
 * Same real-world field, different key names across OSM vs official (or tag variants).
 * Values map from raw key (after `contact:` / `addr:` strip) → canonical compare key.
 */
const COMPARE_KEY_ALIASES: Record<string, string> = {
  zip: 'postcode',
}

type CompareRowBoth = [string, string, string]
type CompareRowSingle = [string, string]
type AddressCompareOsmKey = 'street' | 'housenumber'

export type AddressCompareGroup = {
  kind: 'address'
  officialKey: 'address'
  officialValue: string | null
  osmKeys: readonly ['street', 'housenumber']
  osmValues: Record<AddressCompareOsmKey, string | null>
  compareTargets: string[]
  consumedKeys: string[]
}

export type PropertyCompareGroup = AddressCompareGroup

function toComparableString(v: unknown): string | null {
  if (v == null || typeof v === 'object') return null
  const s = String(v).trim()
  return s === '' ? null : s
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
    const c = canonicalPropertyKey(k)
    if (c.startsWith('_')) continue
    const s = toComparableString(v)
    if (s == null) continue
    m.set(c, s)
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
    const c = canonicalPropertyKey(k)
    if (c.startsWith('_')) continue
    const s = toComparableString(v)
    if (s == null) continue
    if (k.startsWith('_pipeline')) continue
    if (k.startsWith('contact:')) {
      fromContact.set(c, s)
    } else if (k.startsWith('addr:')) {
      fromAddr.set(c, s)
    } else {
      fromBare.set(c, s)
    }
  }
  const merged = new Map(fromBare)
  for (const [c, v] of fromAddr) merged.set(c, v)
  for (const [c, v] of fromContact) merged.set(c, v)
  return merged
}

export function normalizeAddressCompareString(s: string): string {
  return s.trim().replace(/\s+/g, ' ')
}

export function abbrevGermanStrasseForCompare(s: string): string {
  return s.replaceAll('Straße', 'Str.').replaceAll('straße', 'str.')
}

function buildAddressCompareGroup(
  offMap: Map<string, string>,
  osmMap: Map<string, string>,
): AddressCompareGroup | null {
  const officialValue = offMap.get('address') ?? null
  const street = osmMap.get('street') ?? null
  const housenumber = osmMap.get('housenumber') ?? null
  if (officialValue == null) return null

  const line = normalizeAddressCompareString([street, housenumber].filter(Boolean).join(' '))
  if (line === '') return null
  const targets = new Set<string>()
  targets.add(line)
  targets.add(normalizeAddressCompareString(abbrevGermanStrasseForCompare(line)))
  const normalizedOfficial = normalizeAddressCompareString(officialValue)
  if (![...targets].includes(normalizedOfficial)) return null
  return {
    kind: 'address',
    officialKey: 'address',
    officialValue,
    osmKeys: ['street', 'housenumber'],
    osmValues: { street, housenumber },
    compareTargets: [...targets],
    consumedKeys: ['address', 'street', 'housenumber'],
  }
}

export function comparePropertySections(
  official: Record<string, unknown> | null | undefined,
  osm: Record<string, string> | null | undefined,
): {
  both: CompareRowBoth[]
  onlyO: CompareRowSingle[]
  onlyS: CompareRowSingle[]
  compareGroups: PropertyCompareGroup[]
} {
  const offMap = flattenOfficialForCompare(official ?? {})
  const osmMap = flattenOsmTagsForCompare(osm ?? {})
  const compareGroups: PropertyCompareGroup[] = []
  const consumedKeys = new Set<string>()
  const addressGroup = buildAddressCompareGroup(offMap, osmMap)
  if (addressGroup) {
    compareGroups.push(addressGroup)
    for (const key of addressGroup.consumedKeys) consumedKeys.add(key)
  }
  const keys = new Set([...offMap.keys(), ...osmMap.keys()])
  const both: CompareRowBoth[] = []
  const onlyO: CompareRowSingle[] = []
  const onlyS: CompareRowSingle[] = []
  for (const k of [...keys].sort((a, b) => a.localeCompare(b, 'de'))) {
    if (consumedKeys.has(k)) continue
    const os = offMap.get(k) ?? null
    const ss = osmMap.get(k) ?? null
    if (os != null && ss != null) both.push([k, os, ss])
    else if (os != null) onlyO.push([k, os])
    else if (ss != null) onlyS.push([k, ss])
  }
  return { both, onlyO, onlyS, compareGroups }
}
