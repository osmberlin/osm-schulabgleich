import { findOsmFeature } from './osmFeatureLookup'
import type { Feature, FeatureCollection } from 'geojson'

/**
 * Campus **polygon** for the detail map: **only** from lazy-loaded `schools_osm_areas.json`.
 *
 * `schools_osm.geojson` is a **pipeline** product (point layer + `hasPolygonGeometry` flags). It is
 * not a source of outline geometry for users: the app still loads that file today for lightweight
 * lookup (flag, id, centroid on the point row), but **never** to draw campus outlines — those come
 * exclusively from the areas file. The `main` argument is that lookup feature when present.
 */
export function resolveOsmSchoolAreaOutline(
  main: Feature | null,
  osmType: string | null,
  osmId: string | null,
  osmAreasByKey: Record<string, Feature> | undefined,
): Feature | null {
  if (!main) return null
  const props = main.properties as { hasPolygonGeometry?: boolean } | null
  if (props?.hasPolygonGeometry !== true) return null
  const key = osmType && osmId ? `${osmType}/${osmId}` : null
  if (!key || !osmAreasByKey) return null
  const area = osmAreasByKey[key]
  if (!area) return null
  return { ...area, id: main.id ?? area.id }
}

/**
 * Whether to fetch `schools_osm_areas.json` — reads `hasPolygonGeometry` from the point row
 * (today: from the bundled main OSM layer). Prefer moving this flag onto match rows from the
 * pipeline so the client can avoid loading `schools_osm.geojson` for metadata only.
 */
export function schoolMatchRowNeedsOsmAreasFetch(
  osm: FeatureCollection,
  osmType: string | null,
  osmId: string | null,
): boolean {
  const f = findOsmFeature(osm, osmType, osmId)
  return Boolean((f?.properties as { hasPolygonGeometry?: boolean })?.hasPolygonGeometry)
}
