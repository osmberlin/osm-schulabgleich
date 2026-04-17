import { fetchStateSchoolsBundle } from './fetchStateSchoolsBundle'
import { computeDetailMapFrameState } from './schoolDetailMapFrame'
import { deriveSchoolDetailMapFeatures } from './useSchoolDetailMapFeatures'
import type { Feature } from 'geojson'

type StateSchoolsBundle = Awaited<ReturnType<typeof fetchStateSchoolsBundle>>
type StateSchoolMatchRow = StateSchoolsBundle['matches'][number]

/** Bbox for JOSM / iD links — same geometry as map fit, without hover-only lines. */
export function computeSchoolDetailMapActionBounds(
  data: StateSchoolsBundle,
  matchRow: StateSchoolMatchRow,
  mapOsmCentroid: readonly [number, number] | null,
  osmAreasByKey: Record<string, Feature> | undefined,
): [number, number, number, number] | null {
  const { detailFeatures, compareRadiusRing, connectorLineFeatures } =
    deriveSchoolDetailMapFeatures(data, matchRow, mapOsmCentroid, null, osmAreasByKey)

  return computeDetailMapFrameState(detailFeatures, compareRadiusRing, connectorLineFeatures)
    .boundsWsen
}
