import type { Feature, FeatureCollection } from 'geojson'

export function findOsmFeature(
  osm: FeatureCollection,
  osmType: string | null,
  osmId: string | null,
): Feature | null {
  if (!osmType || !osmId) return null
  const want = `${osmType}/${osmId}`
  for (const f of osm.features) {
    const id = f.id
    if (typeof id === 'string' && (id === want || id.endsWith(`/${osmId}`))) return f
    if (typeof id === 'number' && String(id) === osmId && osmType === 'way') return f
  }
  return null
}
