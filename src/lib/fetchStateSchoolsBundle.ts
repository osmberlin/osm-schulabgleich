import { mergeSyntheticOfficialNoCoordRows } from './mergeSyntheticOfficialNoCoordRows'
import { stateBoundaryUrl, stateMatchesUrl, stateOfficialUrl, stateOsmUrl } from './paths'
import { schoolsMatchesFileSchema } from './schemas'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'

/** Official + OSM GeoJSON + matches + optional Bundesland outline for one land (SchuleDetail / cache). */
export async function fetchStateSchoolsBundle(code: string) {
  const [oRes, osmRes, mRes, bRes] = await Promise.all([
    fetch(stateOfficialUrl(code)),
    fetch(stateOsmUrl(code)),
    fetch(stateMatchesUrl(code)),
    fetch(stateBoundaryUrl(code)),
  ])
  if (!oRes.ok || !osmRes.ok || !mRes.ok) {
    throw new Error('land fetch')
  }
  const [official, osmGeojson, matchesRaw] = await Promise.all([
    oRes.json(),
    osmRes.json(),
    mRes.json(),
  ])
  const matchesParsed = schoolsMatchesFileSchema.parse(matchesRaw)
  const matches = mergeSyntheticOfficialNoCoordRows(matchesParsed, official as FeatureCollection)
  let boundary: Feature<Polygon | MultiPolygon> | null = null
  if (bRes.ok) {
    boundary = (await bRes.json()) as Feature<Polygon | MultiPolygon>
  }
  return { official, osm: osmGeojson, matches, boundary }
}
