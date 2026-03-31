const JOSM = 'http://127.0.0.1:8111'

export function buildIdUrl(
  osmType: 'way' | 'relation' | 'node' | null,
  osmId: string | null,
  bbox?: [number, number, number, number] | null,
) {
  if (!osmType || !osmId) return null
  const u = new URL('https://www.openstreetmap.org/edit')
  u.searchParams.set('editor', 'id')
  if (osmType === 'way') u.searchParams.set('way', osmId)
  if (osmType === 'relation') u.searchParams.set('relation', osmId)
  if (osmType === 'node') u.searchParams.set('node', osmId)
  if (bbox && bbox.length === 4) {
    const [w, s, e, n] = bbox
    const lat = (s + n) / 2
    const lon = (w + e) / 2
    const span = Math.max(n - s, e - w)
    const zoom = Math.min(18, Math.max(11, Math.round(14 - Math.log2(span * 45))))
    u.searchParams.set('lat', lat.toFixed(5))
    u.searchParams.set('lon', lon.toFixed(5))
    u.searchParams.set('zoom', String(zoom))
  }
  return u.toString()
}

export function buildJosmLoadObject(
  osmType: 'way' | 'relation' | 'node' | null,
  osmId: string | null,
) {
  if (!osmType || !osmId) return null
  const prefix = osmType === 'way' ? 'w' : osmType === 'relation' ? 'r' : 'n'
  return `${JOSM}/load_object?objects=${prefix}${osmId}`
}

/** openstreetmap.org object page (read-only), not the iD editor. */
export function buildOsmBrowseUrl(
  osmType: 'way' | 'relation' | 'node' | null,
  osmId: string | null,
) {
  if (!osmType || !osmId) return null
  return `https://www.openstreetmap.org/${osmType}/${encodeURIComponent(osmId)}`
}
