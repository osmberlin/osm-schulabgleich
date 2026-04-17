import difference from '@turf/difference'
import { featureCollection, polygon } from '@turf/helpers'
import type { Feature, MultiPolygon, Polygon } from 'geojson'

/** Same dimming on state overview and school detail maps. */
export const MAP_DIM_MASK_FILL = 'rgba(0,0,0,0.42)'

/** Europe shell (WGS84 west/south/east/north −10, 35, 40, 72); cutout must lie inside for `difference`. */
export const MAP_DIM_MASK_OUTER_POLYGON: Feature<Polygon> = polygon([
  [
    [-10, 35],
    [40, 35],
    [40, 72],
    [-10, 72],
    [-10, 35],
  ],
])

/** Black Bundesland outline (state overview + school detail). */
export const LAND_BOUNDARY_LINE_PAINT = {
  'line-color': '#000000',
  'line-width': 2,
  'line-opacity': 0.95,
} as const

/**
 * `difference(outerEurope, cutout)` → dimmed ring; cutout stays clear (Bundesland, bbox rect, or
 * Vergleichsradius circle).
 */
export function buildMapDimMaskFeature(
  cutout: Feature<Polygon | MultiPolygon> | null,
): Feature<Polygon | MultiPolygon> | null {
  if (!cutout) return null
  try {
    return difference(featureCollection([MAP_DIM_MASK_OUTER_POLYGON, cutout])) ?? null
  } catch {
    return null
  }
}

/** Axis-aligned bbox → rectangle polygon for overview list-filter cutout. */
export function bboxWsenToPolygonFeature(
  b: readonly [west: number, south: number, east: number, north: number],
): Feature<Polygon> {
  const [w, s, e, n] = b
  return polygon([
    [
      [w, s],
      [e, s],
      [e, n],
      [w, n],
      [w, s],
    ],
  ])
}
