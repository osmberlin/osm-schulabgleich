import type { Feature, FeatureCollection, LineString, Point } from 'geojson'
import { buildOsmBrowseUrl } from './editorLinks'
import { formatDeDate } from './formatDeDate'
import { formatDistanceDe } from './formatNumber'
import type { MatchDistanceLevel } from './matchDistanceCheck'
import { matchDistanceReason } from './matchDistanceReason'
import type { SchoolsMatchRow } from './schemas'
import {
  mapSchoolsMatchRowToCsvRecord,
  schoolsMatchDetailUrl,
  type SchoolsMatchCsvBatch,
} from './schoolsMatchCsv'

/** Stable Germany-wide review filename under `public/datasets/`. */
export const SCHOOLS_MATCH_REVIEW_GEOJSON_FILE_NAME = 'schools_matches_review.geojson' as const

/** Suggested `download` attribute for the review file. */
export const SCHOOLS_MATCH_REVIEW_GEOJSON_DOWNLOAD_FILE_NAME =
  'schulabgleich_DE_schools_matches_review.geojson' as const

/** Output order; `ok` rows are not part of the file. */
const REVIEW_RANK: Record<MatchDistanceLevel, number> = { error: 0, hint: 1, accepted: 2, ok: 3 }

/** Prefix of every property except `name`, so they never collide with real OSM tags. */
const PROP = 'schulabgleich:'

type ReviewProperties = Record<string, string | number>

function parseCoord(value: string): number | null {
  if (value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

/** Reason as plain text: Markdown backticks around `ref` etc. are dropped. */
function plainText(markdown: string): string {
  return markdown.replaceAll('`', '')
}

function reviewFeatures(
  row: SchoolsMatchRow,
  batch: SchoolsMatchCsvBatch,
): Feature<LineString | Point, ReviewProperties>[] | null {
  const level = row.distanceCheck
  if (row.category !== 'matched' || row.distanceMeters == null) return null
  if (level == null || level === 'ok') return null
  if (row.osmCentroidLon == null || row.osmCentroidLat == null) return null

  const record = mapSchoolsMatchRowToCsvRecord(row, batch.options)
  const officialLon = parseCoord(record.official_lon)
  const officialLat = parseCoord(record.official_lat)
  if (officialLon == null || officialLat == null) return null

  const official: [number, number] = [officialLon, officialLat]
  const osm: [number, number] = [row.osmCentroidLon, row.osmCentroidLat]
  const officialName = row.officialName ?? row.key
  const reason = matchDistanceReason(row, formatDeDate(row.osmLastEditedAt))

  const all: ReviewProperties = {
    [`${PROP}check`]: level,
    [`${PROP}distance_m`]: row.distanceMeters,
    [`${PROP}match_mode`]: record.match_mode,
    [`${PROP}reason`]: reason ? plainText(reason) : '',
    [`${PROP}official_name`]: officialName,
    [`${PROP}official_id`]: record.official_id,
    [`${PROP}osm_name`]: record.osm_name,
    [`${PROP}osm_id`]: row.osmType && row.osmId ? `${row.osmType}/${row.osmId}` : '',
    [`${PROP}osm_url`]: buildOsmBrowseUrl(row.osmType, row.osmId) ?? '',
    [`${PROP}osm_last_edited_at`]: record.osm_last_edited_at,
    [`${PROP}detail_url`]: schoolsMatchDetailUrl(batch.options.bundesland, row.key),
    [`${PROP}bundesland`]: batch.options.bundesland,
    [`${PROP}official_license`]: record.official_license,
    [`${PROP}official_osm_compatible`]: record.official_osm_compatible,
  }
  // Unknown values are left out instead of becoming empty tags in the editor.
  const shared = Object.fromEntries(Object.entries(all).filter(([, v]) => v !== ''))
  const feature = <G extends LineString | Point>(
    role: 'connection' | 'official' | 'osm',
    name: string,
    geometry: G,
  ): Feature<G, ReviewProperties> => ({
    type: 'Feature',
    id: `${row.key}/${role}`,
    geometry,
    properties: { name, [`${PROP}role`]: role, ...shared },
  })

  return [
    feature('connection', `${formatDistanceDe(row.distanceMeters)}: ${officialName}`, {
      type: 'LineString',
      coordinates: [official, osm],
    }),
    feature('official', officialName, { type: 'Point', coordinates: official }),
    feature('osm', row.osmName ?? officialName, { type: 'Point', coordinates: osm }),
  ]
}

/**
 * Review file for JOSM and iD: every matched row whose distance needs a look
 * (`error`, `hint`, `accepted`) as official point, OSM point and a line between them.
 * Sorted error, hint, accepted; within a rating by descending distance.
 */
export function buildSchoolsMatchReviewGeojson(
  batches: readonly SchoolsMatchCsvBatch[],
): FeatureCollection<LineString | Point, ReviewProperties> {
  const groups = batches
    .flatMap((batch) =>
      batch.rows.flatMap((row) => {
        const features = reviewFeatures(row, batch)
        return features && row.distanceCheck
          ? [
              {
                rank: REVIEW_RANK[row.distanceCheck],
                distance: row.distanceMeters,
                key: row.key,
                features,
              },
            ]
          : []
      }),
    )
    .toSorted(
      (a, b) =>
        a.rank - b.rank || (b.distance ?? 0) - (a.distance ?? 0) || a.key.localeCompare(b.key),
    )
  return { type: 'FeatureCollection', features: groups.flatMap((g) => g.features) }
}
