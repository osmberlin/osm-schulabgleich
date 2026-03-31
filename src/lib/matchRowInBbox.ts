import type { Feature, FeatureCollection } from 'geojson'
import type { z } from 'zod'
import type { schoolsMatchRowSchema } from './schemas'
import type { LandMapBbox } from './useLandMapBbox'
import { parseJedeschuleLonLatFromRecord, parseMatchRowOsmCentroidLonLat } from './zodGeo'

type Row = z.infer<typeof schoolsMatchRowSchema>

/** Representative point for list/map filtering (OSM-Schwerpunkt bevorzugt, sonst amtliche Koordinaten). */
function matchRowRepresentativeLonLat(row: Row): [number, number] | null {
  return (
    parseMatchRowOsmCentroidLonLat(row) ??
    parseJedeschuleLonLatFromRecord(row.officialProperties ?? null)
  )
}

/**
 * One map point per Treffer (same coordinate logic as list/bbox filter), `matchCat` = row category.
 */
export function matchesToOverviewMapPoints(rows: Row[]): FeatureCollection {
  const features: Feature[] = []
  for (const r of rows) {
    const ll = matchRowRepresentativeLonLat(r)
    if (!ll) continue
    features.push({
      type: 'Feature',
      properties: { matchCat: r.category },
      geometry: { type: 'Point', coordinates: ll },
    })
  }
  return { type: 'FeatureCollection', features }
}

function pointInLandMapBbox(lon: number, lat: number, bbox: LandMapBbox): boolean {
  const [w, s, e, n] = bbox
  return lon >= w && lon <= e && lat >= s && lat <= n
}

export function matchRowInLandMapBbox(row: Row, bbox: LandMapBbox): boolean {
  const p = matchRowRepresentativeLonLat(row)
  if (!p) return false
  return pointInLandMapBbox(p[0], p[1], bbox)
}
