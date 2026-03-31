import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/20/solid'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import type { Feature, MultiPolygon, Polygon } from 'geojson'
import { useId, useMemo } from 'react'
import { MapProvider } from 'react-map-gl/maplibre'
import {
  CategoryLegendSwatch,
  OfficialNoCoordLegendSwatch,
} from '../components/CategoryLegendSwatch'
import { LandMap } from '../components/LandMap'
import { MatchCountsHistoryChart } from '../components/MatchCountsHistoryChart'
import { LayerToggleStatBlock, ReadOnlyStatBlock, StatBlocksRow } from '../components/StatBlocks'
import { de } from '../i18n/de'
import { formatDeInteger } from '../lib/formatNumber'
import { formatMatchRowListId } from '../lib/formatOsmRef'
import { MATCH_CHART_LABELS } from '../lib/matchChartLabels'
import { landHistoryFromRuns } from '../lib/matchHistoryFromRuns'
import { matchesToOverviewMapPoints, matchRowInLandMapBbox } from '../lib/matchRowInBbox'
import {
  landBoundaryUrl,
  landMatchesUrl,
  landOfficialUrl,
  landOsmMetaUrl,
  landOsmUrl,
  runsJsonUrl,
  summaryJsonUrl,
} from '../lib/paths'
import { runsFileSchema, schoolsMatchesFileSchema, summaryFileSchema } from '../lib/schemas'
import { type LandCode, STATE_LABEL_DE } from '../lib/stateConfig'
import { LAND_MATCH_CATEGORIES, useLandCategoryFilter } from '../lib/useLandCategoryFilter'
import { useLandMapBbox } from '../lib/useLandMapBbox'

export function LandOverview() {
  const { code } = useParams({ strict: false }) as { code: string }
  const statsInputId = useId()
  const historyHeadingId = useId()
  const { enabledSet, enabledCategories, setCategoryEnabled, isCategoryEnabled } =
    useLandCategoryFilter()
  const { bbox: listBbox, setBbox: setListBbox, clearBbox: clearListBbox } = useLandMapBbox()
  const showNoCoordInfo = () => {
    window.alert(de.land.officialNoCoordKpiInfoAlert)
  }

  const summaryQ = useQuery({
    queryKey: ['summary'],
    queryFn: async () => {
      const r = await fetch(summaryJsonUrl())
      if (!r.ok) throw new Error(String(r.status))
      return summaryFileSchema.parse(await r.json())
    },
  })

  const runsQ = useQuery({
    queryKey: ['runs'],
    queryFn: async () => {
      const r = await fetch(runsJsonUrl())
      if (!r.ok) throw new Error(String(r.status))
      return runsFileSchema.parse(await r.json())
    },
  })

  const landSummary = summaryQ.data?.lands.find((l) => l.code === code)

  const landHistoryPoints = useMemo(
    () => (runsQ.data ? landHistoryFromRuns(runsQ.data.runs, code) : []),
    [runsQ.data, code],
  )

  const dataQ = useQuery({
    queryKey: ['land-data', code],
    queryFn: async () => {
      const [oRes, osmRes, mRes] = await Promise.all([
        fetch(landOfficialUrl(code)),
        fetch(landOsmUrl(code)),
        fetch(landMatchesUrl(code)),
      ])
      if (!oRes.ok || !osmRes.ok || !mRes.ok) {
        throw new Error('land fetch')
      }
      const [official, osm, matchesRaw] = await Promise.all([
        oRes.json(),
        osmRes.json(),
        mRes.json(),
      ])
      const matches = schoolsMatchesFileSchema.parse(matchesRaw)
      return {
        official,
        osm,
        matches,
      }
    },
    enabled: !!code,
  })

  const metaQ = useQuery({
    queryKey: ['land-osm-meta', code],
    queryFn: async () => {
      const r = await fetch(landOsmMetaUrl(code))
      if (!r.ok) return null
      return r.json() as Promise<Record<string, unknown>>
    },
    enabled: !!code,
  })

  const boundaryQ = useQuery({
    queryKey: ['land-boundary', code],
    queryFn: async () => {
      const r = await fetch(landBoundaryUrl(code))
      if (!r.ok) return null
      return r.json() as Promise<Feature<Polygon | MultiPolygon>>
    },
    enabled: !!code,
    staleTime: Infinity,
  })

  const matches = dataQ.data?.matches ?? []

  const catCounts = useMemo(() => {
    const z = {
      matched: 0,
      official_only: 0,
      osm_only: 0,
      match_ambiguous: 0,
    }
    for (const r of matches) {
      z[r.category]++
    }
    return z
  }, [matches])

  const visibleMatches = useMemo(
    () => matches.filter((r) => enabledSet.has(r.category)),
    [matches, enabledSet],
  )

  const listMatches = useMemo(() => {
    if (!listBbox) return visibleMatches
    return visibleMatches.filter((r) => matchRowInLandMapBbox(r, listBbox))
  }, [visibleMatches, listBbox])

  const mapMatchPoints = useMemo(() => matchesToOverviewMapPoints(listMatches), [listMatches])

  if (dataQ.isLoading || summaryQ.isLoading) {
    return <p className="text-zinc-400">{de.land.loading}</p>
  }
  if (dataQ.isError || !dataQ.data) {
    return <p className="text-red-400">{de.land.error}</p>
  }

  return (
    <div>
      {landSummary?.osmSource === 'cached' && (
        <div
          className="mb-4 rounded-md border border-amber-800 bg-amber-950/40 p-3 text-sm text-amber-100"
          role="status"
        >
          {de.land.osmCachedBanner}
          {metaQ.data?.overpassQueriedAt != null && (
            <span className="mt-1 block text-xs opacity-90">
              Stand: {String(metaQ.data.overpassResponseTimestamp ?? metaQ.data.overpassQueriedAt)}
            </span>
          )}
        </div>
      )}

      <StatBlocksRow aria-label={de.land.legendRowAria} className="mb-6">
        {LAND_MATCH_CATEGORIES.map((cat) => {
          const count = catCounts[cat]
          const disabled = count === 0
          return (
            <LayerToggleStatBlock
              key={cat}
              inputId={`${statsInputId}-${cat}`}
              checked={disabled ? false : isCategoryEnabled(cat)}
              disabled={disabled}
              onChange={(on) => setCategoryEnabled(cat, on)}
              label={de.land.categoryLabel[cat]}
              value={formatDeInteger(count)}
              swatch={<CategoryLegendSwatch category={cat} />}
            />
          )
        })}
        <ReadOnlyStatBlock
          swatch={<OfficialNoCoordLegendSwatch />}
          label={de.land.officialNoCoordKpi}
          labelAddon={
            <button
              type="button"
              className="inline-flex rounded text-zinc-400 hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              aria-label={de.land.officialNoCoordKpiInfoButton}
              onClick={showNoCoordInfo}
            >
              <InformationCircleIcon className="size-4" aria-hidden />
            </button>
          }
          value={formatDeInteger(landSummary?.counts.official_no_coord ?? 0)}
        />
      </StatBlocksRow>

      {enabledCategories.length === 0 ? (
        <div
          className="flex h-[440px] items-center justify-center rounded-lg border border-zinc-700 px-4 text-center"
          role="status"
        >
          <p className="text-sm text-zinc-400">{de.land.mapNoVisibleCategories}</p>
        </div>
      ) : (
        <MapProvider>
          <div>
            <LandMap
              matchPoints={mapMatchPoints}
              height={440}
              enabledCategories={enabledSet}
              landCode={code}
              landBoundary={boundaryQ.data ?? null}
              urlBbox={listBbox}
              onApplyUrlBbox={(b) => void setListBbox(b)}
              onClearUrlBbox={clearListBbox}
            />
            {mapMatchPoints.features.length > 0 && (
              <p className="mt-2 text-xs text-zinc-400">{de.land.mapLegendPoints}</p>
            )}
          </div>
        </MapProvider>
      )}

      <h2 className="mt-10 mb-2 flex flex-row flex-wrap items-baseline gap-x-2 text-lg font-semibold text-zinc-100">
        <span>{de.land.table}</span>
        <span className="font-semibold tabular-nums text-zinc-400">
          ({formatDeInteger(listMatches.length)})
        </span>
      </h2>
      <div className="overflow-hidden border-y border-zinc-700 bg-zinc-900/40 shadow-none outline outline-zinc-100/10 max-sm:-mx-4 max-sm:rounded-none max-sm:border-x-0 sm:rounded-lg sm:border sm:border-zinc-700">
        {listMatches.length === 0 ? (
          <p className="px-3 py-3 text-center text-sm text-zinc-400 sm:p-4">
            {matches.length === 0
              ? '—'
              : enabledCategories.length === 0
                ? de.land.mapNoVisibleCategories
                : visibleMatches.length === 0
                  ? de.land.tableFilteredEmpty
                  : de.land.tableBboxEmpty}
          </p>
        ) : (
          <ul className="divide-y divide-zinc-700">
            {listMatches.slice(0, 500).map((row) => {
              const title = row.officialName ?? row.osmName ?? '—'
              const subId = formatMatchRowListId(row)
              return (
                <li key={row.key}>
                  <Link
                    to="/bundesland/$code/schule/$matchKey"
                    params={{ code, matchKey: row.key }}
                    className="relative flex justify-between gap-x-3 px-3 py-2.5 hover:bg-zinc-800/50 sm:gap-x-6 sm:px-5 sm:py-3.5"
                    aria-label={`${de.land.detail}: ${title}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm/5 font-semibold text-zinc-100">{title}</p>
                      <div className="mt-1 flex min-w-0 items-center gap-2">
                        <CategoryLegendSwatch category={row.category} />
                        <span className="min-w-0 text-xs font-medium text-zinc-300">
                          {de.land.categoryLabel[row.category]}
                        </span>
                        {row.category === 'matched' && row.matchMode && (
                          <span className="min-w-0 text-xs text-zinc-400">
                            · {de.detail.matchModeLabel[row.matchMode]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-x-3">
                      {(subId !== '' || row.distanceMeters != null) && (
                        <div className="flex max-w-[min(100%,12rem)] flex-col items-end gap-y-0.5">
                          {subId !== '' && (
                            <p className="text-right font-mono text-xs/5 text-zinc-400">{subId}</p>
                          )}
                          {row.distanceMeters != null && (
                            <p className="text-xs/5 text-right text-zinc-400 tabular-nums">
                              {de.land.tableDistanceAway.replace(
                                '{meters}',
                                formatDeInteger(row.distanceMeters),
                              )}
                            </p>
                          )}
                        </div>
                      )}
                      <ChevronRightIcon aria-hidden className="size-5 flex-none text-zinc-500" />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
        {listMatches.length > 500 && (
          <p className="border-t border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 sm:px-4">
            … erste 500 von {formatDeInteger(listMatches.length)}
          </p>
        )}
      </div>

      <section className="mt-10" aria-labelledby={historyHeadingId}>
        <h2 id={historyHeadingId} className="mb-2 text-lg font-semibold text-zinc-100">
          {de.land.historyHeading}
        </h2>
        <p className="mb-4 text-sm text-zinc-400">{de.land.historyLead}</p>
        {runsQ.isLoading && <p className="text-sm text-zinc-400">{de.land.historyLoading}</p>}
        {runsQ.isError && <p className="text-sm text-amber-200">{de.land.historyError}</p>}
        {runsQ.isSuccess && landHistoryPoints.length === 0 && (
          <p className="text-sm text-zinc-400">{de.land.historyEmpty}</p>
        )}
        {runsQ.isSuccess && landHistoryPoints.length > 0 && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-900/40 p-4 shadow-none outline outline-zinc-100/10">
            <MatchCountsHistoryChart
              points={landHistoryPoints}
              categoryLabels={MATCH_CHART_LABELS}
              chartDescription={`${STATE_LABEL_DE[code as LandCode] ?? code} · ${de.land.historyHeading}`}
            />
          </div>
        )}
      </section>
    </div>
  )
}
