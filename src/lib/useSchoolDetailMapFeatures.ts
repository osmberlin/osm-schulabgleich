import { detailMapConnectorLines } from './detailMapConnectorLines'
import { fetchStateSchoolsBundle } from './fetchStateSchoolsBundle'
import { findOfficialSchoolFeature } from './findOfficialSchoolFeature'
import { buildMapDimMaskFeature } from './mapDimMask'
import { MATCH_RADIUS_KM } from './matchRadius'
import { promoteClosedLineStringsToPolygons } from './osmClosedRingsToPolygons'
import { findOsmFeature } from './osmFeatureLookup'
import { parseMatchRowOsmCentroidLonLat } from './zodGeo'
import circle from '@turf/circle'
import type { Feature, FeatureCollection, Polygon } from 'geojson'

type StateSchoolsBundle = Awaited<ReturnType<typeof fetchStateSchoolsBundle>>
type StateSchoolMatchRow = StateSchoolsBundle['matches'][number]

type HoveredMapLabelLike =
  | { kind: 'osm-reference' }
  | { kind: 'official-current'; lon: number; lat: number }
  | { kind: 'osm-other'; matchKey: string }
  | null

function resolveSchoolDetailMapFeatures(
  data: StateSchoolsBundle | undefined,
  row: StateSchoolMatchRow | null,
  mapOsmCentroid: readonly [number, number] | null,
  hoveredMapLabel: HoveredMapLabelLike,
) {
  const detailFeatures: Feature[] = (() => {
    if (!data || !row) return []
    const features: Feature[] = []
    if (row.ambiguousOfficialIds && row.ambiguousOfficialIds.length > 0) {
      for (const oid of row.ambiguousOfficialIds) {
        const f = findOfficialSchoolFeature(data.official, oid)
        if (f) features.push(f as Feature)
      }
    } else if (row.officialId) {
      const f = findOfficialSchoolFeature(data.official, row.officialId)
      if (f) features.push(f as Feature)
    }
    const of = findOsmFeature(data.osm, row.osmType, row.osmId)
    if (of) {
      const g = promoteClosedLineStringsToPolygons(of.geometry ?? null) ?? of.geometry
      features.push({ ...of, geometry: g })
    }
    if (mapOsmCentroid) {
      const [clon, clat] = mapOsmCentroid
      features.push({
        type: 'Feature',
        properties: { _mapDetail: 'osmCentroid' as const },
        geometry: { type: 'Point', coordinates: [clon, clat] },
      })
    }
    return features
  })()

  let compareRadiusRing: Feature<Polygon> | null = null
  if (mapOsmCentroid) {
    const [lon, lat] = mapOsmCentroid
    const ring = circle([lon, lat], MATCH_RADIUS_KM, { steps: 64, units: 'kilometers' })
    ring.properties = { ...ring.properties, _mapDetail: 'compareRadius' as const }
    compareRadiusRing = ring as Feature<Polygon>
  }

  const detailMapMaskFeature = buildMapDimMaskFeature(compareRadiusRing)

  const connectorLineFeatures: Feature[] =
    !mapOsmCentroid || !data || !row
      ? []
      : detailMapConnectorLines({
          officialFc: data.official as FeatureCollection,
          matchRow: row,
          fromLon: mapOsmCentroid[0],
          fromLat: mapOsmCentroid[1],
          mapDetail: 'connector',
        })

  const hoverRelationLineFeatures: Feature[] = (() => {
    if (!data || !row || !hoveredMapLabel) return []
    const officialFc = data.official as FeatureCollection
    if (hoveredMapLabel.kind === 'osm-other') {
      const match = data.matches.find((m) => m.key === hoveredMapLabel.matchKey)
      if (!match) return []
      const from = parseMatchRowOsmCentroidLonLat(match)
      if (!from) return []
      const [fromLon, fromLat] = from
      return detailMapConnectorLines({
        officialFc,
        matchRow: match,
        fromLon,
        fromLat,
        mapDetail: 'hoverRelation',
      })
    }
    if (hoveredMapLabel.kind === 'osm-reference') {
      if (!mapOsmCentroid) return []
      const [fromLon, fromLat] = mapOsmCentroid
      return detailMapConnectorLines({
        officialFc,
        matchRow: row,
        fromLon,
        fromLat,
        mapDetail: 'hoverRelation',
      })
    }
    if (hoveredMapLabel.kind === 'official-current') {
      if (!mapOsmCentroid) return []
      const [clon, clat] = mapOsmCentroid
      return [
        {
          type: 'Feature',
          properties: { _mapDetail: 'hoverRelation' as const },
          geometry: {
            type: 'LineString',
            coordinates: [
              [hoveredMapLabel.lon, hoveredMapLabel.lat],
              [clon, clat],
            ],
          },
        },
      ]
    }
    return []
  })()

  return {
    detailFeatures,
    compareRadiusRing,
    detailMapMaskFeature,
    connectorLineFeatures,
    hoverRelationLineFeatures,
  }
}

export function deriveSchoolDetailMapFeatures(
  data: StateSchoolsBundle | undefined,
  row: StateSchoolMatchRow | null,
  mapOsmCentroid: readonly [number, number] | null,
  hoveredMapLabel: HoveredMapLabelLike,
) {
  return resolveSchoolDetailMapFeatures(data, row, mapOsmCentroid, hoveredMapLabel)
}
