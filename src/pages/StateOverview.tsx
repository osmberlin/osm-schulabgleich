import { StateOverviewFiltersDisclosure } from '../components/state/StateOverviewFiltersDisclosure'
import { StateOverviewHistorySection } from '../components/state/StateOverviewHistorySection'
import { StateOverviewMapSection } from '../components/state/StateOverviewMapSection'
import { StateOverviewMatchList } from '../components/state/StateOverviewMatchList'
import { StateOverviewStats } from '../components/state/StateOverviewStats'
import { de } from '../i18n/de'
import { stateHistoryFromRuns } from '../lib/matchHistoryFromRuns'
import {
  buildOfficialSchoolLonLatIndex,
  matchesToOverviewMapPoints,
  matchRowIncludedWhenStateMapBboxActive,
} from '../lib/matchRowInBbox'
import { mergeSyntheticOfficialNoCoordRows } from '../lib/mergeSyntheticOfficialNoCoordRows'
import {
  stateBoundaryUrl,
  stateMatchesUrl,
  stateOfficialUrl,
  stateOsmMetaUrl,
  stateOsmUrl,
  runsJsonlUrl,
  summaryJsonUrl,
} from '../lib/paths'
import { runsPayloadFromHistoryText } from '../lib/runHistoryJsonl'
import { runsFileSchema, schoolsMatchesFileSchema, summaryFileSchema } from '../lib/schemas'
import {
  collectFilteredIdsFromSearchResult,
  createStateMatchItemsJsEngine,
  searchStateMatchesWithExplorer,
} from '../lib/stateOverviewItemsSearch'
import { useStateCategoryFilter } from '../lib/useStateCategoryFilter'
import { useStateOverviewExplorerFilter } from '../lib/useStateOverviewExplorerFilter'
import { useStateOverviewMapState } from '../lib/useStateOverviewMapState'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import { useId, useMemo } from 'react'

export function StateOverview() {
  const { code } = useParams({ strict: false }) as { code: string }
  const statsInputId = useId()
  const historyHeadingId = useId()
  const { enabledSet, enabledCategories, setCategoryEnabled, isCategoryEnabled } =
    useStateCategoryFilter()
  const { mapCamera, setMapCamera, bboxFilter, setBboxFilter, clearBboxFilter } =
    useStateOverviewMapState()
  const explorer = useStateOverviewExplorerFilter()

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
      const r = await fetch(runsJsonlUrl())
      if (!r.ok) throw new Error(String(r.status))
      return runsFileSchema.parse(runsPayloadFromHistoryText(await r.text()))
    },
  })

  const stateSummary = summaryQ.data?.states.find((l) => l.code === code)

  const stateHistoryPoints = useMemo(
    () => (runsQ.data ? stateHistoryFromRuns(runsQ.data.runs, code) : []),
    [runsQ.data, code],
  )

  const dataQ = useQuery({
    queryKey: ['state-data', code],
    queryFn: async () => {
      const [oRes, osmRes, mRes] = await Promise.all([
        fetch(stateOfficialUrl(code)),
        fetch(stateOsmUrl(code)),
        fetch(stateMatchesUrl(code)),
      ])
      if (!oRes.ok || !osmRes.ok || !mRes.ok) {
        throw new Error('land fetch')
      }
      const [official, osm, matchesRaw] = await Promise.all([
        oRes.json(),
        osmRes.json(),
        mRes.json(),
      ])
      const matchesParsed = schoolsMatchesFileSchema.parse(matchesRaw)
      const matches = mergeSyntheticOfficialNoCoordRows(
        matchesParsed,
        official as FeatureCollection,
      )
      return {
        official,
        osm,
        matches,
      }
    },
    enabled: !!code,
  })

  const metaQ = useQuery({
    queryKey: ['state-osm-meta', code],
    queryFn: async () => {
      const r = await fetch(stateOsmMetaUrl(code))
      if (!r.ok) return null
      return r.json() as Promise<Record<string, unknown>>
    },
    enabled: !!code,
  })

  const boundaryQ = useQuery({
    queryKey: ['state-boundary', code],
    queryFn: async () => {
      const r = await fetch(stateBoundaryUrl(code))
      if (!r.ok) return null
      return r.json() as Promise<Feature<Polygon | MultiPolygon>>
    },
    enabled: !!code,
    staleTime: Infinity,
  })

  const matches = dataQ.data?.matches ?? []

  const officialLonLatIndex = useMemo((): Map<string, [number, number]> | null => {
    const o = dataQ.data?.official as FeatureCollection | undefined
    if (!o?.features?.length) return null
    return buildOfficialSchoolLonLatIndex(o)
  }, [dataQ.data?.official])

  const matchesAfterBbox = useMemo(() => {
    if (!bboxFilter) return matches
    return matches.filter((r) =>
      matchRowIncludedWhenStateMapBboxActive(r, bboxFilter, officialLonLatIndex),
    )
  }, [matches, bboxFilter, officialLonLatIndex])

  const explorerKey = useMemo(
    () =>
      [
        explorer.exploreQ,
        explorer.nameScope,
        [...explorer.matchModes].sort().join('|'),
        [...explorer.iscedLevels].sort().join('|'),
        [...explorer.geoBoundaryIssues].sort().join('|'),
        JSON.stringify([...explorer.schoolKinds].sort()),
      ].join('\n'),
    [
      explorer.exploreQ,
      explorer.nameScope,
      explorer.matchModes,
      explorer.iscedLevels,
      explorer.geoBoundaryIssues,
      explorer.schoolKinds,
    ],
  )

  const itemsEngine = useMemo(
    () => createStateMatchItemsJsEngine(matchesAfterBbox),
    [matchesAfterBbox],
  )

  const exploreResult = useMemo(() => {
    if (matchesAfterBbox.length === 0) return null
    return searchStateMatchesWithExplorer(itemsEngine, {
      query: explorer.exploreQ,
      nameScope: explorer.nameScope,
      matchModes: explorer.matchModes,
      iscedLevels: explorer.iscedLevels,
      geoBoundaryIssues: explorer.geoBoundaryIssues,
      schoolKinds: explorer.schoolKinds,
    })
  }, [itemsEngine, matchesAfterBbox, explorerKey])

  const matchesAfterExplorer = useMemo(() => {
    if (matchesAfterBbox.length === 0) return []
    if (!exploreResult) return matchesAfterBbox
    const ids = collectFilteredIdsFromSearchResult(exploreResult)
    return matchesAfterBbox.filter((r) => ids.has(r.key))
  }, [matchesAfterBbox, exploreResult])

  const catCounts = useMemo(() => {
    const z = {
      matched: 0,
      official_only: 0,
      osm_only: 0,
      match_ambiguous: 0,
      official_no_coord: 0,
    }
    for (const r of matchesAfterExplorer) {
      z[r.category]++
    }
    return z
  }, [matchesAfterExplorer])

  const visibleMatches = useMemo(
    () => matchesAfterExplorer.filter((r) => enabledSet.has(r.category)),
    [matchesAfterExplorer, enabledSet],
  )

  const listMatches = visibleMatches

  const mapMatchPoints = useMemo(
    () => matchesToOverviewMapPoints(listMatches, officialLonLatIndex),
    [listMatches, officialLonLatIndex],
  )

  if (dataQ.isLoading || summaryQ.isLoading) {
    return <p className="text-zinc-400">{de.state.loading}</p>
  }
  if (dataQ.isError || !dataQ.data) {
    return <p className="text-red-400">{de.state.error}</p>
  }

  return (
    <div>
      {stateSummary?.osmSource === 'cached' && (
        <div
          className="mb-4 rounded-md border border-amber-800 bg-amber-950/40 p-3 text-sm text-amber-100"
          role="status"
        >
          {de.state.osmCachedBanner}
          {metaQ.data?.overpassQueriedAt != null && (
            <span className="mt-1 block text-xs opacity-90">
              Stand: {String(metaQ.data.overpassResponseTimestamp ?? metaQ.data.overpassQueriedAt)}
            </span>
          )}
        </div>
      )}

      <StateOverviewFiltersDisclosure
        exploreQ={explorer.exploreQ}
        setExploreQ={(q) => {
          void explorer.setExploreQ(q)
        }}
        nameScope={explorer.nameScope}
        setNameScope={(s) => {
          void explorer.setNameScope(s)
        }}
        matchModes={explorer.matchModes}
        toggleMatchMode={explorer.toggleMatchMode}
        iscedLevels={explorer.iscedLevels}
        toggleIscedLevel={explorer.toggleIscedLevel}
        geoBoundaryIssues={explorer.geoBoundaryIssues}
        toggleGeoBoundaryIssue={explorer.toggleGeoBoundaryIssue}
        schoolKinds={explorer.schoolKinds}
        toggleSchoolKind={explorer.toggleSchoolKind}
        resetExplorer={explorer.resetExplorer}
        aggregations={exploreResult?.data.aggregations}
        filteredCount={matchesAfterExplorer.length}
        bboxTotalCount={matchesAfterBbox.length}
      />

      <StateOverviewStats
        catCounts={catCounts}
        statsInputId={statsInputId}
        isCategoryEnabled={isCategoryEnabled}
        setCategoryEnabled={setCategoryEnabled}
      />

      <StateOverviewMapSection
        enabledCategories={enabledCategories}
        enabledSet={enabledSet}
        mapMatchPoints={mapMatchPoints}
        stateCode={code}
        boundary={boundaryQ.data ?? null}
        mapCamera={mapCamera}
        setMapCamera={setMapCamera}
        bboxFilter={bboxFilter}
        setBboxFilter={setBboxFilter}
        clearBboxFilter={clearBboxFilter}
      />

      <StateOverviewMatchList
        code={code}
        listMatches={listMatches}
        matchesLength={matches.length}
        enabledCategoriesLength={enabledCategories.length}
        visibleMatchesLength={visibleMatches.length}
        listBboxActive={bboxFilter != null}
        matchesAfterBboxCount={matchesAfterBbox.length}
        exploreFilteredCount={matchesAfterExplorer.length}
      />

      <StateOverviewHistorySection
        code={code}
        historyHeadingId={historyHeadingId}
        isLoading={runsQ.isLoading}
        isError={runsQ.isError}
        points={stateHistoryPoints}
      />
    </div>
  )
}
