import { de } from '../../i18n/de'
import type { MatchHistoryStackPoint } from '../../lib/matchHistoryFromRuns'
import { type StateCode, STATE_LABEL_DE } from '../../lib/stateConfig'
import { MatchCountsHistoryChart } from '../MatchCountsHistoryChart'

export function StateOverviewHistorySection({
  code,
  historyHeadingId,
  isLoading,
  isError,
  points,
}: {
  code: string
  historyHeadingId: string
  isLoading: boolean
  isError: boolean
  points: MatchHistoryStackPoint[]
}) {
  return (
    <section className="mt-10" aria-labelledby={historyHeadingId}>
      <h2 id={historyHeadingId} className="mb-2 text-lg font-semibold text-zinc-100">
        {de.state.historyHeading}
      </h2>
      <p className="mb-4 text-sm text-zinc-400">{de.state.historyLead}</p>
      {isLoading && <p className="text-sm text-zinc-400">{de.state.historyLoading}</p>}
      {isError && <p className="text-sm text-amber-200">{de.state.historyError}</p>}
      {!isLoading && !isError && points.length === 0 && (
        <p className="text-sm text-zinc-400">{de.state.historyEmpty}</p>
      )}
      {!isLoading && !isError && points.length > 0 && (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900/40 p-4 shadow-none outline outline-zinc-100/10">
          <MatchCountsHistoryChart
            points={points}
            categoryLabels={de.state.categoryLabel}
            chartDescription={`${STATE_LABEL_DE[code as StateCode] ?? code} · ${de.state.historyHeading}`}
          />
        </div>
      )}
    </section>
  )
}
