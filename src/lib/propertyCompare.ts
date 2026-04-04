import {
  addressCompareTargetsFromOsmParts,
  flattenOfficialForCompare,
  flattenOsmTagsForCompare,
  normalizeAddressCompareString,
  normalizeAddressMatchKey,
} from './compareMatchKeys'

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

export { normalizeAddressCompareString } from './compareMatchKeys'

function buildAddressCompareGroup(
  offMap: Map<string, string>,
  osmMap: Map<string, string>,
): AddressCompareGroup | null {
  const officialValue = offMap.get('address') ?? null
  const street = osmMap.get('street') ?? null
  const housenumber = osmMap.get('housenumber') ?? null
  if (officialValue == null) return null

  const targets = addressCompareTargetsFromOsmParts(street, housenumber)
  if (targets.length === 0) return null
  const normalizedOfficial = normalizeAddressMatchKey(officialValue)
  const targetKeys = targets.map((v) => normalizeAddressMatchKey(v))
  if (!targetKeys.includes(normalizedOfficial)) return null
  return {
    kind: 'address',
    officialKey: 'address',
    officialValue,
    osmKeys: ['street', 'housenumber'],
    osmValues: { street, housenumber },
    compareTargets: targets,
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
