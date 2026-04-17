import { de } from '../../i18n/de'
import { fetchStateSchoolsBundle } from '../../lib/fetchStateSchoolsBundle'

type StateSchoolMatchRow = Awaited<ReturnType<typeof fetchStateSchoolsBundle>>['matches'][number]

export function SchoolDetailMatchExplanation({ row }: { row: StateSchoolMatchRow }) {
  if (row.category !== 'matched') return null

  return (
    <p className="mb-6 text-sm leading-relaxed text-zinc-400">
      {row.matchMode === 'distance' ? (
        de.detail.matchExplanationDistance
      ) : row.matchMode === 'distance_and_name' || row.matchMode === 'name' ? (
        <>
          {row.matchMode === 'distance_and_name'
            ? de.detail.matchExplanationDistanceAndName
            : de.detail.matchExplanationName}
          {row.matchedByOsmNameNormalized ? ' ' : ''}
          {row.matchedByOsmNameNormalized ? (
            <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-200">
              {row.matchedByOsmNameNormalized}
            </code>
          ) : null}
          {row.matchedByOsmNameTag != null && (
            <> {de.detail.matchMatchedByOsmTag[row.matchedByOsmNameTag]}</>
          )}
        </>
      ) : row.matchMode === 'website' ? (
        <>
          {de.detail.matchExplanationWebsite}{' '}
          <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-200">
            {row.matchedByWebsiteNormalized ?? '—'}
          </code>
        </>
      ) : row.matchMode === 'address' ? (
        <>
          {de.detail.matchExplanationAddress}{' '}
          <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-200">
            {row.matchedByAddressNormalized ?? '—'}
          </code>
        </>
      ) : row.matchMode === 'ref' ? (
        <>
          {de.detail.matchExplanationRef}{' '}
          <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-200">
            {row.matchedByRefNormalized ?? '—'}
          </code>
        </>
      ) : (
        de.detail.matchExplanationDistance
      )}
    </p>
  )
}
