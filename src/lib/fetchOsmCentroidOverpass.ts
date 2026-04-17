import type { OsmElementRef } from './parseOsmIdInput'

const OVERPASS_INTERPRETERS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
] as const

async function postOverpass(query: string, interpreterUrl: string): Promise<unknown> {
  const r = await fetch(interpreterUrl, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  if (!r.ok) throw new Error(`Overpass HTTP ${r.status}`)
  return r.json()
}

/**
 * Read [lon, lat] from one Overpass element after `out center`.
 * - Nodes: `lat` / `lon` on the element.
 * - Ways / relations: Overpass adds `center` (representative point).
 */
function lonLatFromCenterOutput(el: Record<string, unknown>): [number, number] | null {
  if (el.type === 'node' && typeof el.lat === 'number' && typeof el.lon === 'number') {
    return [el.lon, el.lat]
  }
  const center = el.center as { lat?: number; lon?: number } | undefined
  if (center && typeof center.lat === 'number' && typeof center.lon === 'number') {
    return [center.lon, center.lat]
  }
  return null
}

/**
 * Resolve WGS84 [lon, lat] via Overpass `out center` only.
 *
 * We rely on Overpass’s center computation instead of fetching full geometry and using
 * {@link centroidFromOsmGeometry}: simpler, less payload, same idea for a map hint.
 *
 * **When this can fail:** object does not exist (`elements` empty); or the response has no
 * `lat`/`lon` (node) and no `center` (way/relation) — unusual for normal OSM data, but possible
 * if the object was deleted/redacted between parse and query.
 */
export async function fetchOsmCentroidOverpass(ref: OsmElementRef): Promise<[number, number]> {
  const id = Number.parseInt(ref.id, 10)
  if (!Number.isFinite(id)) throw new Error('invalid id')

  const query = `[out:json][timeout:25];${ref.type}(${id});out center;`

  let lastErr: Error | null = null
  for (const url of OVERPASS_INTERPRETERS) {
    try {
      const raw = await postOverpass(query, url)
      const elements = (raw as { elements?: unknown[] }).elements
      const el = Array.isArray(elements)
        ? (elements[0] as Record<string, unknown> | undefined)
        : undefined
      if (!el) {
        lastErr = new Error('Kein OSM-Objekt gefunden')
        continue
      }
      const ll = lonLatFromCenterOutput(el)
      if (ll) return ll
      lastErr = new Error('Overpass lieferte keinen Schwerpunkt (center/lat/lon)')
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e))
    }
  }
  throw lastErr ?? new Error('Overpass: keine Antwort')
}
