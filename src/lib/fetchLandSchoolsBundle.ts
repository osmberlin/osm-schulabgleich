import { landMatchesUrl, landOfficialUrl, landOsmUrl } from './paths'
import { schoolsMatchesFileSchema } from './schemas'

/** Official + OSM GeoJSON + matches for one Bundesland (shared cache key with SchuleDetail). */
export async function fetchLandSchoolsBundle(code: string) {
  const [oRes, osmRes, mRes] = await Promise.all([
    fetch(landOfficialUrl(code)),
    fetch(landOsmUrl(code)),
    fetch(landMatchesUrl(code)),
  ])
  if (!oRes.ok || !osmRes.ok || !mRes.ok) {
    throw new Error('land fetch')
  }
  const [official, osmGeojson, matchesRaw] = await Promise.all([
    oRes.json(),
    osmRes.json(),
    mRes.json(),
  ])
  const matches = schoolsMatchesFileSchema.parse(matchesRaw)
  return { official, osm: osmGeojson, matches }
}
