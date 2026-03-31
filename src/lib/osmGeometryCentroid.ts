import centroid from '@turf/centroid'
import type { Feature, Geometry, MultiPolygon, Polygon } from 'geojson'

function isPolyGeom(g: Geometry | null): g is Polygon | MultiPolygon {
  if (!g) return false
  return g.type === 'Polygon' || g.type === 'MultiPolygon'
}

/** Same logic as pipeline `centroidFromOsmGeometry` — for map fallback when JSON has no stored centroid. */
export function osmGeometryCentroidLonLat(geom: Geometry | null): [number, number] | null {
  if (!geom) return null
  if (geom.type === 'Point') {
    return [geom.coordinates[0], geom.coordinates[1]]
  }
  if (!isPolyGeom(geom)) return null
  try {
    const f: Feature<Polygon | MultiPolygon> = { type: 'Feature', properties: {}, geometry: geom }
    const c = centroid(f)
    const [lon, lat] = c.geometry.coordinates
    return [lon, lat]
  } catch {
    return null
  }
}
