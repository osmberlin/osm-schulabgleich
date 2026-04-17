import { landCodeFromSchoolId } from '../../src/lib/stateConfig'
import { landCodeForPoint } from './bundeslandBoundaries'
import type { Feature, FeatureCollection, Point } from 'geojson'

export type ErrorOutsideBoundary = {
  latitude: number
  longitude: number
}

/**
 * If the official Point lies outside the Bundesland implied by the JedeSchule id prefix,
 * clear geometry and record the original position on properties for downstream UI.
 * Requires {@link initBundeslandBoundaries} for the same project root.
 */
export function voidOfficialPointOutsideDeclaredLand(f: Feature): Feature {
  const id = String(f.id ?? (f.properties as { id?: string } | null | undefined)?.id ?? '')
  const declaredLand = landCodeFromSchoolId(id)
  if (!declaredLand) return f

  const g = f.geometry
  if (!g || g.type !== 'Point') return f
  const coords = (g as Point).coordinates
  if (!Array.isArray(coords) || coords.length < 2) return f
  const lon = coords[0]!
  const lat = coords[1]!
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return f

  const pointLand = landCodeForPoint(lon, lat)
  if (pointLand === declaredLand) return f

  const baseProps =
    typeof f.properties === 'object' && f.properties != null && !Array.isArray(f.properties)
      ? { ...(f.properties as Record<string, unknown>) }
      : {}
  const err: ErrorOutsideBoundary = { latitude: lat, longitude: lon }
  return {
    ...f,
    geometry: null,
    properties: {
      ...baseProps,
      _error_outside_boundary: err,
    },
  }
}

export function gateOfficialFeatureCollection(fc: FeatureCollection): FeatureCollection {
  return {
    ...fc,
    features: fc.features.map(voidOfficialPointOutsideDeclaredLand),
  }
}
