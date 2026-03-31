import centroid from '@turf/centroid'
import distance from '@turf/distance'
import { point } from '@turf/helpers'
import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon } from 'geojson'

import { MATCH_RADIUS_KM } from '../../src/lib/matchRadius'
import type { LandCode } from '../../src/lib/stateConfig'
import { landCodeFromSchoolId } from '../../src/lib/stateConfig'
import { normalizeSchoolNameForMatch } from './schoolNameNormalize'

export { MATCH_RADIUS_KM }
export { normalizeSchoolNameForMatch } from './schoolNameNormalize'

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

/** Official record snapshot per ambiguous candidate (stored with the match; even if the ID is absent from state GeoJSON). */
export type AmbiguousOfficialSnapshot = {
  id: string
  name: string
  properties: Record<string, unknown>
}

export type MatchRowOut = {
  key: string
  category: 'matched' | 'official_only' | 'osm_only' | 'match_ambiguous'
  matchMode?: 'distance' | 'distance_and_name' | 'name'
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
  ambiguousOfficialSnapshots?: AmbiguousOfficialSnapshot[]
  /** Set when `matched` was chosen by multi-candidate name equality (normalized key). */
  matchedByNameNormalized?: string
  /** Federal state code for national pipeline split (optional). */
  pipelineLand?: string
}

function snapshotsFromOfficials(offs: OfficialInput[]): AmbiguousOfficialSnapshot[] {
  return offs.map((off) => ({
    id: off.id,
    name: off.name,
    properties: off.properties,
  }))
}

/** Name-based fallback only considers official IDs from the same federal state as the OSM school. */
function officialsInSameLandAsOsm(officials: OfficialInput[], osmLand: LandCode): OfficialInput[] {
  return officials.filter((off) => landCodeFromSchoolId(off.id) === osmLand)
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

export type MatchSchoolsOptions = {
  /**
   * Federal state per OSM feature (`way/123`, …). Only officials whose JedeSchule ID prefix matches that
   * state participate in distance-radius matching and in the no-coordinates name fallback. Every
   * `osmSchools` entry must have a map entry.
   */
  osmLandByKey: Map<string, LandCode>
}

export function matchSchools(
  officials: OfficialInput[],
  osmSchools: OsmSchoolInput[],
  opts: MatchSchoolsOptions,
) {
  const withCoord = officials.filter((o) => Number.isFinite(o.lon) && Number.isFinite(o.lat))
  const withoutCoord = officials.filter((o) => !Number.isFinite(o.lon) || !Number.isFinite(o.lat))
  const reserved = new Set<string>()
  /** Officials listed on any ambiguous row — not reserved, so other OSM features may still reference them. */
  const ambiguousAllIds = new Set<string>()
  const rows: MatchRowOut[] = []

  for (const o of osmSchools) {
    const [lon, lat] = o.centroid
    const landKey = `${o.osmType}/${o.osmId}`
    const osmLand = opts.osmLandByKey.get(landKey)
    if (osmLand === undefined) {
      throw new Error(`matchSchools: osmLandByKey missing entry "${landKey}"`)
    }
    const cands = withCoord.filter((off) => {
      if (reserved.has(off.id)) return false
      const offLand = landCodeFromSchoolId(off.id)
      if (offLand != null && offLand !== osmLand) return false
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
        matchMode: 'distance',
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

    const nameKey = normalizeSchoolNameForMatch(o.name)
    if (nameKey) {
      const nameMatches = withDist.filter(
        (x) => normalizeSchoolNameForMatch(x.off.name) === nameKey,
      )
      if (nameMatches.length === 1) {
        const win = nameMatches[0]
        const winner = win.off
        if (!ambiguousAllIds.has(winner.id)) {
          reserved.add(winner.id)
          const dM = win.distKm * 1000
          rows.push({
            key: `match-${winner.id}`,
            category: 'matched',
            matchMode: 'distance_and_name',
            officialId: winner.id,
            officialName: winner.name,
            officialProperties: winner.properties,
            osmId: o.osmId,
            osmType: o.osmType,
            osmCentroidLon: lon,
            osmCentroidLat: lat,
            distanceMeters: Math.round(dM),
            osmName: o.name,
            osmTags: o.tags,
            matchedByNameNormalized: nameKey,
          })
          continue
        }
      }
    }

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
      ambiguousOfficialSnapshots: snapshotsFromOfficials(withDist.map((x) => x.off)),
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

  const noCoordByName = new Map<string, OfficialInput[]>()
  for (const off of withoutCoord) {
    const key = normalizeSchoolNameForMatch(off.name)
    if (!key) continue
    const arr = noCoordByName.get(key)
    if (arr) arr.push(off)
    else noCoordByName.set(key, [off])
  }

  const osmOnlyByName = new Map<string, number[]>()
  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx]
    if (row.category !== 'osm_only') continue
    const key = normalizeSchoolNameForMatch(row.osmName)
    if (!key) continue
    const arr = osmOnlyByName.get(key)
    if (arr) arr.push(idx)
    else osmOnlyByName.set(key, [idx])
  }

  const noCoordMatched = new Set<string>()
  for (const [key, officialsWithNameAll] of noCoordByName.entries()) {
    const osmIdxs = osmOnlyByName.get(key)
    if (!osmIdxs) continue
    if (osmIdxs.length !== 1) continue
    const targetIdx = osmIdxs[0]
    const base = rows[targetIdx]
    const nameLandKey = `${base.osmType}/${base.osmId}`
    const osmLandName = opts.osmLandByKey.get(nameLandKey)
    if (osmLandName === undefined) {
      throw new Error(`matchSchools: osmLandByKey missing entry "${nameLandKey}"`)
    }
    const officialsWithName = officialsInSameLandAsOsm(officialsWithNameAll, osmLandName)
    if (officialsWithName.length === 0) continue
    if (officialsWithName.length === 1) {
      const off = officialsWithName[0]
      if (noCoordMatched.has(off.id)) continue
      rows[targetIdx] = {
        ...base,
        key: `match-${off.id}`,
        category: 'matched',
        matchMode: 'name',
        officialId: off.id,
        officialName: off.name,
        officialProperties: off.properties,
        matchedByNameNormalized: key,
      }
      noCoordMatched.add(off.id)
      continue
    }
    const ids = officialsWithName.map((off) => off.id).filter((id) => !noCoordMatched.has(id))
    if (ids.length <= 1) continue
    const byId = new Map(officialsWithName.map((off) => [off.id, off] as const))
    const snapOffs = ids.map((id) => byId.get(id)).filter((x): x is OfficialInput => x != null)
    rows[targetIdx] = {
      ...base,
      key: `ambig-${base.osmType ?? 'way'}-${base.osmId ?? 'unknown'}`,
      category: 'match_ambiguous',
      matchMode: 'name',
      officialId: null,
      officialName: null,
      officialProperties: null,
      distanceMeters: null,
      ambiguousOfficialIds: ids,
      ambiguousOfficialSnapshots: snapshotsFromOfficials(snapOffs),
      matchedByNameNormalized: key,
    }
  }

  return { rows, officialNoCoordCount: withoutCoord.length - noCoordMatched.size }
}
