import { de } from '../i18n/de'
import type { SchoolsMatchRow } from './schemas'

/**
 * Why a matched row has the distance rating it has, as inline-Markdown text (`ref` in backticks).
 * `hint`/`error`: why the larger distance is not accepted (`ref` is the only unambiguous mode today).
 * `accepted`: why it is fine. `ok` and rows without a rating have no reason.
 * `date` is the already formatted last-edit date of the OSM object (`null` if unknown).
 */
export function matchDistanceReason(
  row: Pick<SchoolsMatchRow, 'matchMode' | 'distanceCheck'>,
  date: string | null,
): string | null {
  const level = row.distanceCheck
  if (level === 'accepted') return de.detail.distanceAcceptedNote.replace('{date}', date ?? '—')
  if (level !== 'hint' && level !== 'error') return null
  if (row.matchMode !== 'ref') {
    const modeLabel = row.matchMode ? de.detail.matchModeLabel[row.matchMode] : '—'
    return de.detail.distanceReasonNotRef.replace('{modeLabel}', modeLabel)
  }
  return date
    ? de.detail.distanceReasonRefOld.replace('{date}', date)
    : de.detail.distanceReasonRefUnknown
}
