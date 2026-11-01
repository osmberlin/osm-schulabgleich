/**
 * Distance between official point and OSM centroid above which a match gets a hint.
 * Above the size of a single school site: 99.9 % of OSM school ways reach at most 353 m from centroid to edge.
 */
export const MATCH_DISTANCE_HINT_M = 400
/** Distance above which a match is flagged as an error that needs checking. */
export const MATCH_DISTANCE_ERROR_M = 1000
/** A large distance is accepted for an unambiguous match if the OSM object was edited this recently. */
export const TRUSTED_OSM_EDIT_MAX_AGE_YEARS = 2

/** Match modes that identify one school without any distance (add `wikidata` here once it exists). */
const UNAMBIGUOUS_MATCH_MODES: readonly string[] = ['ref']

export const MATCH_DISTANCE_LEVELS = ['ok', 'accepted', 'hint', 'error'] as const
export type MatchDistanceLevel = (typeof MATCH_DISTANCE_LEVELS)[number]

/** `true` if `osmLastEditedAt` is at most {@link TRUSTED_OSM_EDIT_MAX_AGE_YEARS} before `referenceDate`. */
export function isOsmEditRecent(
  osmLastEditedAt: string | null | undefined,
  referenceDate: Date,
): boolean {
  if (!osmLastEditedAt) return false
  const edited = new Date(osmLastEditedAt).getTime()
  if (Number.isNaN(edited)) return false
  const cutoff = new Date(referenceDate)
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - TRUSTED_OSM_EDIT_MAX_AGE_YEARS)
  return edited >= cutoff.getTime()
}

/**
 * Rates the distance of a matched row. Pure: `referenceDate` is the OSM snapshot time, never the clock.
 * `accepted` = distance above the hint threshold, but the match is unambiguous and the OSM object is recently edited.
 */
export function classifyMatchDistance(opts: {
  distanceMeters: number | null | undefined
  matchMode: string | null | undefined
  osmLastEditedAt: string | null | undefined
  referenceDate: Date
}): MatchDistanceLevel {
  const { distanceMeters } = opts
  if (distanceMeters == null || !Number.isFinite(distanceMeters)) return 'ok'
  if (distanceMeters <= MATCH_DISTANCE_HINT_M) return 'ok'
  if (
    opts.matchMode != null &&
    UNAMBIGUOUS_MATCH_MODES.includes(opts.matchMode) &&
    isOsmEditRecent(opts.osmLastEditedAt, opts.referenceDate)
  ) {
    return 'accepted'
  }
  if (distanceMeters > MATCH_DISTANCE_ERROR_M) return 'error'
  return 'hint'
}
