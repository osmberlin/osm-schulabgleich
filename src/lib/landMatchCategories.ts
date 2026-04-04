/**
 * Match categories for table + URL filter (`?cats=`).
 * Map points exist only for the first four; `official_no_coord` rows have no coordinates and stay off the map.
 */
export const LAND_MATCH_CATEGORIES = [
  'matched',
  'official_only',
  'osm_only',
  'match_ambiguous',
  'official_no_coord',
] as const

export type LandMatchCategory = (typeof LAND_MATCH_CATEGORIES)[number]
