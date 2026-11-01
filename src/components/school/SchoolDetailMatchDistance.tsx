import { de } from '../../i18n/de'
import { formatDeDate } from '../../lib/formatDeDate'
import { formatDistanceDe } from '../../lib/formatNumber'
import { InlineMarkdown } from '../../lib/InlineMarkdown'
import type { StateSchoolsMatchRow } from '../../lib/stateDatasetQueries'
import { SchoolDetailDistanceAlert } from './SchoolDetailAlerts'

/** Why a distance above the hint threshold is not accepted (`ref` is the only unambiguous mode today). */
function distanceReason(row: StateSchoolsMatchRow, date: string | null): string {
  if (row.matchMode !== 'ref') {
    const modeLabel = row.matchMode ? de.detail.matchModeLabel[row.matchMode] : '—'
    return de.detail.distanceReasonNotRef.replace('{modeLabel}', modeLabel)
  }
  return date
    ? de.detail.distanceReasonRefOld.replace('{date}', date)
    : de.detail.distanceReasonRefUnknown
}

/** Distance official point ↔ OSM centroid with the pipeline's rating (`distanceCheck`) and its reason. */
export function SchoolDetailMatchDistance({ row }: { row: StateSchoolsMatchRow }) {
  if (row.category !== 'matched' || row.distanceMeters == null) return null

  const level = row.distanceCheck?.level ?? 'ok'
  const distance = formatDistanceDe(row.distanceMeters)
  const date = formatDeDate(row.osmLastEditedAt)
  const showAlert = level === 'hint' || level === 'error'

  return (
    <>
      <p
        className={`flex flex-wrap items-baseline gap-x-2 text-sm text-zinc-400 ${level === 'accepted' ? 'mb-2' : showAlert ? 'mb-4' : 'mb-6'}`}
      >
        <span>{de.detail.distanceLabel}</span>
        <span className="text-lg font-medium text-zinc-100 tabular-nums">{distance}</span>
      </p>
      {level === 'accepted' && (
        <p className="mb-6 text-sm text-zinc-400">
          <InlineMarkdown>
            {de.detail.distanceAcceptedNote.replace('{date}', date ?? '—')}
          </InlineMarkdown>
        </p>
      )}
      {showAlert && (
        <SchoolDetailDistanceAlert
          level={level}
          distanceLabel={distance}
          reason={distanceReason(row, date)}
        />
      )}
    </>
  )
}
