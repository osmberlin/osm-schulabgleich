import { de } from '../../i18n/de'
import { cn } from '../../lib/cn'
import { formatDeInteger } from '../../lib/formatNumber'
import {
  LAND_FACET_MATCH_MODES,
  LAND_MATCH_FACET_MATCH_MODE_NONE,
  LAND_MATCH_FACET_SCHOOL_KIND_NONE,
  type LandFacetMatchMode,
} from '../../lib/landOverviewItemsSearch'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useEffect, useId, useState } from 'react'

type Bucket = { key: string | number; doc_count: number }

type Aggregations = Record<string, { buckets: Bucket[] } | undefined>

function sortBuckets(b: Bucket[]): Bucket[] {
  return [...b].sort(
    (a, b) => b.doc_count - a.doc_count || String(a.key).localeCompare(String(b.key)),
  )
}

function matchModeLabel(key: string): string {
  if (key === LAND_MATCH_FACET_MATCH_MODE_NONE) return de.land.explorer.matchModeNone
  const k = key as keyof typeof de.detail.matchModeLabel
  return de.detail.matchModeLabel[k] ?? key
}

function schoolKindLabel(key: string): string {
  return key === LAND_MATCH_FACET_SCHOOL_KIND_NONE ? de.land.explorer.schoolKindNone : key
}

export function LandOverviewFiltersDisclosure({
  exploreQ,
  setExploreQ,
  nameScope,
  setNameScope,
  matchModes,
  toggleMatchMode,
  iscedLevels,
  toggleIscedLevel,
  schoolKinds,
  toggleSchoolKind,
  resetExplorer,
  aggregations,
  filteredCount,
  bboxTotalCount,
}: {
  exploreQ: string
  setExploreQ: (q: string) => void
  nameScope: 'both' | 'official' | 'osm'
  setNameScope: (s: 'both' | 'official' | 'osm') => void
  matchModes: string[]
  toggleMatchMode: (mode: LandFacetMatchMode, on: boolean) => void
  iscedLevels: string[]
  toggleIscedLevel: (level: 'yes' | 'no', on: boolean) => void
  schoolKinds: string[]
  toggleSchoolKind: (kind: string, on: boolean) => void
  resetExplorer: () => void
  aggregations: Aggregations | undefined
  filteredCount: number
  bboxTotalCount: number
}) {
  const baseId = useId()
  const [localQ, setLocalQ] = useState(exploreQ)
  useEffect(() => {
    setLocalQ(exploreQ)
  }, [exploreQ])

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (localQ !== exploreQ) setExploreQ(localQ)
    }, 320)
    return () => window.clearTimeout(t)
  }, [localQ, exploreQ, setExploreQ])

  const matchBuckets = sortBuckets(aggregations?.matchMode?.buckets ?? [])
  const iscedBuckets = aggregations?.iscedLevel?.buckets ?? []
  const schoolBuckets = sortBuckets(aggregations?.schoolKindDe?.buckets ?? [])

  const hasActiveExplorer =
    exploreQ.trim() !== '' ||
    nameScope !== 'both' ||
    matchModes.length > 0 ||
    iscedLevels.length > 0 ||
    schoolKinds.length > 0

  return (
    <details className="group mb-6 rounded-lg border border-zinc-700 bg-zinc-900/50 outline outline-zinc-100/10">
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-zinc-100',
          'marker:hidden [&::-webkit-details-marker]:hidden',
        )}
      >
        <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
          <span className="shrink-0">{de.land.explorer.summary}</span>
          <span className="truncate text-xs font-normal text-zinc-400 tabular-nums sm:text-sm">
            {de.land.explorer.summaryCounts
              .replace('{filtered}', formatDeInteger(filteredCount))
              .replace('{total}', formatDeInteger(bboxTotalCount))}
          </span>
        </span>
        <ChevronDownIcon
          aria-hidden
          className="size-5 shrink-0 text-zinc-400 transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-zinc-700 px-4 py-4 text-sm text-zinc-200">
        <p className="mb-4 text-xs text-zinc-400">{de.land.explorer.openHint}</p>

        <div className="mb-5">
          <label className="mb-1.5 block text-xs font-medium text-zinc-300" htmlFor={`${baseId}-q`}>
            {de.land.explorer.queryLabel}
          </label>
          <input
            id={`${baseId}-q`}
            type="search"
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            placeholder={de.land.explorer.queryPlaceholder}
            className="block w-full rounded-md border border-zinc-600 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            autoComplete="off"
          />
        </div>

        <fieldset className="mb-5">
          <legend className="mb-2 text-xs font-medium text-zinc-300">
            {de.land.explorer.nameScopeLabel}
          </legend>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {(
              [
                ['both', de.land.explorer.nameScopeBoth],
                ['official', de.land.explorer.nameScopeOfficial],
                ['osm', de.land.explorer.nameScopeOsm],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-zinc-700 bg-zinc-950/80 px-3 py-2 text-xs has-[:checked]:border-emerald-700 has-[:checked]:bg-emerald-950/40"
              >
                <input
                  type="radio"
                  name={`${baseId}-scope`}
                  checked={nameScope === value}
                  onChange={() => setNameScope(value)}
                  className="border-zinc-500 text-emerald-600 focus:ring-emerald-500"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-5">
          <legend className="mb-2 text-xs font-medium text-zinc-300">
            {de.land.explorer.matchModeHeading}
          </legend>
          <div className="flex max-h-40 flex-col gap-2 overflow-y-auto pr-1">
            {LAND_FACET_MATCH_MODES.map((mode) => {
              const bucket = matchBuckets.find((b) => String(b.key) === mode)
              const count = bucket?.doc_count ?? 0
              const checked = matchModes.includes(mode)
              return (
                <label
                  key={mode}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-zinc-700/80 bg-zinc-950/60 px-3 py-2 text-xs has-[:checked]:border-emerald-800"
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => toggleMatchMode(mode, e.target.checked)}
                      className="rounded border-zinc-500 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="truncate">{matchModeLabel(mode)}</span>
                  </span>
                  <span className="shrink-0 text-zinc-400 tabular-nums">
                    {formatDeInteger(count)}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="mb-5">
          <legend className="mb-2 text-xs font-medium text-zinc-300">
            {de.land.explorer.iscedHeading}
          </legend>
          <div className="flex flex-col gap-2 sm:flex-row">
            {(['yes', 'no'] as const).map((level) => {
              const bucket = iscedBuckets.find((b) => String(b.key) === level)
              const count = bucket?.doc_count ?? 0
              const checked = iscedLevels.includes(level)
              return (
                <label
                  key={level}
                  className="flex flex-1 cursor-pointer items-center justify-between gap-3 rounded-md border border-zinc-700/80 bg-zinc-950/60 px-3 py-2 text-xs has-[:checked]:border-emerald-800"
                >
                  <span className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => toggleIscedLevel(level, e.target.checked)}
                      className="rounded border-zinc-500 text-emerald-600 focus:ring-emerald-500"
                    />
                    {level === 'yes' ? de.land.explorer.iscedYes : de.land.explorer.iscedNo}
                  </span>
                  <span className="text-zinc-400 tabular-nums">{formatDeInteger(count)}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="mb-5">
          <legend className="mb-2 text-xs font-medium text-zinc-300">
            {de.land.explorer.schoolKindHeading}
          </legend>
          <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
            {schoolBuckets.map((b) => {
              const key = String(b.key)
              const checked = schoolKinds.includes(key)
              return (
                <label
                  key={key}
                  className="flex cursor-pointer items-start justify-between gap-3 rounded-md border border-zinc-700/80 bg-zinc-950/60 px-3 py-2 text-xs has-[:checked]:border-emerald-800"
                >
                  <span className="inline-flex min-w-0 items-start gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => toggleSchoolKind(key, e.target.checked)}
                      className="mt-0.5 rounded border-zinc-500 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="break-words text-zinc-200">{schoolKindLabel(key)}</span>
                  </span>
                  <span className="shrink-0 text-zinc-400 tabular-nums">
                    {formatDeInteger(b.doc_count)}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => resetExplorer()}
            disabled={!hasActiveExplorer}
            className="rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-100 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {de.land.explorer.reset}
          </button>
        </div>
      </div>
    </details>
  )
}
