import { stateOsmAreasUrl } from './paths'
import type { Feature } from 'geojson'

/** Per-OSM-ref polygon/line geometries for detail map (`way/…` / `relation/…` keys). */
export async function fetchStateOsmAreasLookup(code: string): Promise<Record<string, Feature>> {
  const r = await fetch(stateOsmAreasUrl(code))
  if (!r.ok) return {}
  const data = (await r.json()) as unknown
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {}
  return data as Record<string, Feature>
}
