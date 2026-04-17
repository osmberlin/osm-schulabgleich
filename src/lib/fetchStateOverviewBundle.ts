import { mergeSyntheticOfficialNoCoordRows } from './mergeSyntheticOfficialNoCoordRows'
import { stateBoundaryUrl, stateMatchesUrl, stateOfficialUrl } from './paths'
import { schoolsMatchesFileSchema } from './schemas'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'

/**
 * Official + matches + boundary for Bundesland overview / layout — no OSM GeoJSON
 * (state map uses match-derived points only).
 */
export async function fetchStateOverviewBundle(code: string) {
  const [oRes, mRes, bRes] = await Promise.all([
    fetch(stateOfficialUrl(code)),
    fetch(stateMatchesUrl(code)),
    fetch(stateBoundaryUrl(code)),
  ])
  if (!oRes.ok || !mRes.ok) {
    throw new Error('land fetch')
  }
  const [official, matchesRaw] = await Promise.all([oRes.json(), mRes.json()])
  const matchesParsed = schoolsMatchesFileSchema.parse(matchesRaw)
  const matches = mergeSyntheticOfficialNoCoordRows(matchesParsed, official as FeatureCollection)
  let boundary: Feature<Polygon | MultiPolygon> | null = null
  if (bRes.ok) {
    boundary = (await bRes.json()) as Feature<Polygon | MultiPolygon>
  }
  return { official, matches, boundary }
}
