import centroid from '@turf/centroid'
import distance from '@turf/distance'
import { point } from '@turf/helpers'
import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon } from 'geojson'

import { MATCH_RADIUS_KM } from '../../src/lib/matchRadius'

export { MATCH_RADIUS_KM }

export type OfficialInput = {
  id: string
  name: string
  lon: number
  lat: number
  properties: Record<string, unknown>
}

export type OsmSchoolInput = {
  osmType: 'way' | 'relation' | 'node'
  osmId: string
  name: string | null
  tags: Record<string, string>
  geometry: Geometry | null
  centroid: [number, number]
}

export type MatchRowOut = {
  key: string
  category: 'matched' | 'official_only' | 'osm_only' | 'match_ambiguous'
  officialId: string | null
  officialName: string | null
  officialProperties: Record<string, unknown> | null
  osmId: string | null
  osmType: 'way' | 'relation' | 'node' | null
  /** OSM geometry centroid [lon, lat]; distance vs official data uses this point. */
  osmCentroidLon: number | null
  osmCentroidLat: number | null
  distanceMeters: number | null
  osmName: string | null
  osmTags: Record<string, string> | null
  ambiguousOfficialIds?: string[]
  /** Bundesland code for national pipeline split (optional). */
  pipelineLand?: string
}

function isPolyGeom(g: Geometry | null): g is Polygon | MultiPolygon {
  if (!g) return false
  return g.type === 'Polygon' || g.type === 'MultiPolygon'
}

export function centroidFromOsmGeometry(geom: Geometry | null): [number, number] | null {
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

export function buildOsmSchoolsFromGeoJson(fc: FeatureCollection): OsmSchoolInput[] {
  const out: OsmSchoolInput[] = []
  for (const f of fc.features) {
    if (f.geometry == null) continue
    const idRaw = f.id
    let osmType: OsmSchoolInput['osmType'] = 'way'
    let osmId = ''
    if (typeof idRaw === 'string') {
      if (idRaw.startsWith('way/')) {
        osmType = 'way'
        osmId = idRaw.slice(4)
      } else if (idRaw.startsWith('relation/')) {
        osmType = 'relation'
        osmId = idRaw.slice(9)
      } else if (idRaw.startsWith('node/')) {
        osmType = 'node'
        osmId = idRaw.slice(5)
      } else {
        osmId = String(idRaw)
      }
    } else if (typeof idRaw === 'number') {
      osmId = String(idRaw)
    }
    const p = f.properties ?? {}
    const tags: Record<string, string> = {}
    for (const [k, v] of Object.entries(p)) {
      if (v == null || typeof v === 'object') continue
      if (k.startsWith('_pipeline')) continue
      tags[k] = String(v)
    }
    const name = tags.name ?? tags['name:de'] ?? null
    const c = centroidFromOsmGeometry(f.geometry)
    if (!c) continue
    if (!osmId && p.id != null) osmId = String(p.id)
    if (!osmId) continue
    out.push({
      osmType,
      osmId,
      name,
      tags,
      geometry: f.geometry,
      centroid: c,
    })
  }
  return out
}

export function matchSchools(officials: OfficialInput[], osmSchools: OsmSchoolInput[]) {
  const withCoord = officials.filter((o) => Number.isFinite(o.lon) && Number.isFinite(o.lat))
  const reserved = new Set<string>()
  /** Officials that appear in any uneindeutig row — not reserved, so other OSM can list the same Kandidaten. */
  const ambiguousAllIds = new Set<string>()
  const rows: MatchRowOut[] = []

  for (const o of osmSchools) {
    const [lon, lat] = o.centroid
    const cands = withCoord.filter((off) => {
      if (reserved.has(off.id)) return false
      const d = distance(point([off.lon, off.lat]), point([lon, lat]), { units: 'kilometers' })
      return d <= MATCH_RADIUS_KM
    })

    if (cands.length === 0) {
      rows.push({
        key: `osm-${o.osmType}-${o.osmId}`,
        category: 'osm_only',
        officialId: null,
        officialName: null,
        officialProperties: null,
        osmId: o.osmId,
        osmType: o.osmType,
        osmCentroidLon: lon,
        osmCentroidLat: lat,
        distanceMeters: null,
        osmName: o.name,
        osmTags: o.tags,
      })
      continue
    }

    if (cands.length === 1) {
      const off = cands[0]
      const dM =
        distance(point([off.lon, off.lat]), point([lon, lat]), { units: 'kilometers' }) * 1000
      if (ambiguousAllIds.has(off.id)) {
        rows.push({
          key: `osm-${o.osmType}-${o.osmId}`,
          category: 'osm_only',
          officialId: null,
          officialName: null,
          officialProperties: null,
          osmId: o.osmId,
          osmType: o.osmType,
          osmCentroidLon: lon,
          osmCentroidLat: lat,
          distanceMeters: null,
          osmName: o.name,
          osmTags: o.tags,
        })
        continue
      }
      reserved.add(off.id)
      rows.push({
        key: `match-${off.id}`,
        category: 'matched',
        officialId: off.id,
        officialName: off.name,
        officialProperties: off.properties,
        osmId: o.osmId,
        osmType: o.osmType,
        osmCentroidLon: lon,
        osmCentroidLat: lat,
        distanceMeters: Math.round(dM),
        osmName: o.name,
        osmTags: o.tags,
      })
      continue
    }

    const withDist = cands.map((off) => ({
      off,
      distKm: distance(point([off.lon, off.lat]), point([lon, lat]), { units: 'kilometers' }),
    }))
    withDist.sort((a, b) => a.distKm - b.distKm)
    const closestKm = withDist[0].distKm

    for (const x of withDist) {
      ambiguousAllIds.add(x.off.id)
    }

    rows.push({
      key: `ambig-${o.osmType}-${o.osmId}`,
      category: 'match_ambiguous',
      officialId: null,
      officialName: null,
      officialProperties: null,
      osmId: o.osmId,
      osmType: o.osmType,
      osmCentroidLon: lon,
      osmCentroidLat: lat,
      distanceMeters: Math.round(closestKm * 1000),
      osmName: o.name,
      osmTags: o.tags,
      ambiguousOfficialIds: withDist.map((x) => x.off.id),
    })
  }

  for (const off of withCoord) {
    if (reserved.has(off.id) || ambiguousAllIds.has(off.id)) continue
    rows.push({
      key: `official-${off.id}`,
      category: 'official_only',
      officialId: off.id,
      officialName: off.name,
      officialProperties: off.properties,
      osmId: null,
      osmType: null,
      osmCentroidLon: null,
      osmCentroidLat: null,
      distanceMeters: null,
      osmName: null,
      osmTags: null,
    })
  }

  return { rows, officialNoCoordCount: officials.length - withCoord.length }
}
