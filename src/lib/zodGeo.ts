import { z } from 'zod'

/** Finite number (excludes NaN / ±Infinity). */
const zFinite = z.number().finite()

/** JedeSchule-style `{ latitude, longitude }` from property bags. */
const jedeschuleLatLonPointSchema = z.object({
  latitude: zFinite,
  longitude: zFinite,
})

/** Match row: OSM geometry centroid pair. */
const matchRowOsmCentroidLonLatSchema = z.object({
  osmCentroidLon: zFinite,
  osmCentroidLat: zFinite,
})

/** Map list filter: west, south, east, north. */
export const stateMapBboxTupleSchema = z
  .tuple([zFinite, zFinite, zFinite, zFinite])
  .refine(([w, s, e, n]) => w < e && s < n)

/**
 * OSM-style `map=z/lat/lon` (openstreetmap.org hash order): zoom, latitude, longitude.
 * Used for SchuleDetail compare map URL state.
 */
export const osmStyleMapTripleSchema = z
  .tuple([zFinite, zFinite, zFinite])
  .refine(([zoom, lat, lon]) => {
    return zoom >= 0 && zoom <= 24 && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
  })

export function parseJedeschuleLonLatFromRecord(
  props: Record<string, unknown> | null | undefined,
): [number, number] | null {
  if (!props) return null
  const r = jedeschuleLatLonPointSchema.safeParse(props)
  return r.success ? [r.data.longitude, r.data.latitude] : null
}

export function parseMatchRowOsmCentroidLonLat(row: {
  osmCentroidLon?: number | null | undefined
  osmCentroidLat?: number | null | undefined
}): [number, number] | null {
  const r = matchRowOsmCentroidLonLatSchema.safeParse(row)
  return r.success ? [r.data.osmCentroidLon, r.data.osmCentroidLat] : null
}

const errorOutsideBoundarySchema = z.object({
  latitude: zFinite,
  longitude: zFinite,
})

/** Pipeline `officialProperties._error_outside_boundary` when coords were outside declared Bundesland. */
export function parseErrorOutsideBoundaryFromOfficialProps(
  props: Record<string, unknown> | null | undefined,
): { latitude: number; longitude: number } | null {
  if (!props) return null
  const r = errorOutsideBoundarySchema.safeParse(props._error_outside_boundary)
  return r.success ? r.data : null
}
