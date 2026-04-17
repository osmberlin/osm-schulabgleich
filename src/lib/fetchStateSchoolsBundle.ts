import { mergeSyntheticOfficialNoCoordRows } from './mergeSyntheticOfficialNoCoordRows'
import { stateBoundaryUrl, stateMatchesUrl, stateOfficialUrl, stateOsmUrl } from './paths'
import { schoolsMatchesFileSchema } from './schemas'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import type { z } from 'zod'

/**
 * Official + OSM + matches + optional Bundesland outline for one land (SchuleDetail / cache).
 *
 * `osm` is the pipeline-built **point** layer (`schools_osm.geojson`). User-visible campus polygons
 * are not read from it — only from `schools_osm_areas.json` when needed.
 */
export type StateSchoolsBundle = {
  official: FeatureCollection
  osm: FeatureCollection
  matches: z.infer<typeof schoolsMatchesFileSchema>
  boundary: Feature<Polygon | MultiPolygon> | null
}

export type StateSchoolsMatchRow = StateSchoolsBundle['matches'][number]

/** Fetch bundle for SchuleDetail / TanStack cache (see {@link StateSchoolsBundle}). */
export async function fetchStateSchoolsBundle(code: string): Promise<StateSchoolsBundle> {
  const [oRes, osmRes, mRes, bRes] = await Promise.all([
    fetch(stateOfficialUrl(code)),
    fetch(stateOsmUrl(code)),
    fetch(stateMatchesUrl(code)),
    fetch(stateBoundaryUrl(code)),
  ])
  if (!oRes.ok || !osmRes.ok || !mRes.ok) {
    throw new Error('land fetch')
  }
  const [officialRaw, osmRaw, matchesRaw] = await Promise.all([
    oRes.json(),
    osmRes.json(),
    mRes.json(),
  ])
  const official = officialRaw as FeatureCollection
  const osm = osmRaw as FeatureCollection
  const matchesParsed = schoolsMatchesFileSchema.parse(matchesRaw)
  const matches = mergeSyntheticOfficialNoCoordRows(matchesParsed, official)
  let boundary: Feature<Polygon | MultiPolygon> | null = null
  if (bRes.ok) {
    boundary = (await bRes.json()) as Feature<Polygon | MultiPolygon>
  }
  return { official, osm, matches, boundary }
}
