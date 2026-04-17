import { fetchStateSchoolsBundle } from './fetchStateSchoolsBundle'
import { findOfficialSchoolFeature } from './findOfficialSchoolFeature'
import { findOsmFeature } from './osmFeatureLookup'
import { centroidFromOsmGeometry } from './osmGeometryCentroid'
import { parseJedeschuleLonLatFromRecord, parseMatchRowOsmCentroidLonLat } from './zodGeo'

type StateSchoolsBundle = Awaited<ReturnType<typeof fetchStateSchoolsBundle>>
type StateSchoolMatchRow = StateSchoolsBundle['matches'][number]

/**
 * Map focus: OSM centroid (matcher order), else OSM geometry, else official coordinates —
 * so markers work without a stored centroid in JSON.
 */
export function resolveSchoolMapOsmCentroid(
  data: StateSchoolsBundle | undefined,
  matchRow: StateSchoolMatchRow | null,
): readonly [number, number] | null {
  if (!data || !matchRow) return null

  const fromRow = parseMatchRowOsmCentroidLonLat(matchRow)
  if (fromRow) return fromRow

  const fromOsmFeature = findOsmFeature(data.osm, matchRow.osmType, matchRow.osmId)
  if (fromOsmFeature?.geometry) {
    return centroidFromOsmGeometry(fromOsmFeature.geometry)
  }

  const fromOfficialProps = parseJedeschuleLonLatFromRecord(
    matchRow.officialProperties ?? undefined,
  )
  if (fromOfficialProps) return fromOfficialProps

  if (!matchRow.officialId) return null
  const officialFeature = findOfficialSchoolFeature(data.official, matchRow.officialId)
  if (!officialFeature?.geometry) return null
  if (officialFeature.geometry.type === 'Point') {
    const [lon, lat] = officialFeature.geometry.coordinates
    return [lon, lat] as const
  }
  return centroidFromOsmGeometry(officialFeature.geometry)
}
