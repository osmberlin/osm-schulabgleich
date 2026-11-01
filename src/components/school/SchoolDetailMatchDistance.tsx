import { de } from '../../i18n/de'
import { formatDeDate } from '../../lib/formatDeDate'
import { formatDistanceDe } from '../../lib/formatNumber'
import { InlineMarkdown } from '../../lib/InlineMarkdown'
import { matchDistanceReason } from '../../lib/matchDistanceReason'
import type { StateSchoolsMatchRow } from '../../lib/stateDatasetQueries'
import { SchoolDetailDistanceAlert } from './SchoolDetailAlerts'

/** Distance official point ↔ OSM centroid with the pipeline's rating (`distanceCheck`) and its reason. */
export function SchoolDetailMatchDistance({ row }: { row: StateSchoolsMatchRow }) {
  if (row.category !== 'matched' || row.distanceMeters == null) return null

  const level = row.distanceCheck ?? 'ok'
  const distance = formatDistanceDe(row.distanceMeters)
  const date = formatDeDate(row.osmLastEditedAt)
  const showAlert = level === 'hint' || level === 'error'
  const reason = matchDistanceReason(row, date)

  return (
    <>
      <p
        className={`flex flex-wrap items-baseline gap-x-2 text-sm text-zinc-400 ${level === 'ok' ? 'mb-6' : 'mb-2'}`}
      >
        <span>{de.detail.distanceLabel}</span>
        <span className="text-lg font-medium text-zinc-100 tabular-nums">{distance}</span>
      </p>
      {level === 'accepted' && reason && (
        <p className="mb-6 text-sm text-zinc-400">
          <InlineMarkdown>{reason}</InlineMarkdown>
        </p>
      )}
      {showAlert && reason && (
        <SchoolDetailDistanceAlert level={level} distanceLabel={distance} reason={reason} />
      )}
    </>
  )
}
