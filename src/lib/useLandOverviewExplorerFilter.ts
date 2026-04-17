import { LAND_FACET_MATCH_MODES } from './landOverviewItemsSearch'
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs'
import { useCallback } from 'react'

const nameScopeParser = parseAsStringLiteral(['both', 'official', 'osm'])
  .withDefault('both')
  .withOptions({ history: 'replace' })

const matchModeItemParser = parseAsStringLiteral(LAND_FACET_MATCH_MODES)

const matchModesParser = parseAsArrayOf(matchModeItemParser)
  .withDefault([])
  .withOptions({ history: 'replace' })

const iscedItemParser = parseAsStringLiteral(['yes', 'no'])

const iscedLevelsParser = parseAsArrayOf(iscedItemParser)
  .withDefault([])
  .withOptions({ history: 'replace' })

const geoBoundaryItemParser = parseAsStringLiteral(['yes', 'no'])

const geoBoundaryIssuesParser = parseAsArrayOf(geoBoundaryItemParser)
  .withDefault([])
  .withOptions({ history: 'replace' })

/** Free-form bucket keys (Schulart strings may contain `;`). */
const schoolKindsParser = parseAsArrayOf(parseAsString)
  .withDefault([])
  .withOptions({ history: 'replace' })

const exploreQueryParser = parseAsString.withDefault('').withOptions({ history: 'replace' })

/**
 * URL-backed explorer filters for Bundesland overview (itemsjs facets + name scope + full-text).
 */
export function useLandOverviewExplorerFilter() {
  const [exploreQ, setExploreQ] = useQueryState('lq', exploreQueryParser)
  const [nameScope, setNameScope] = useQueryState('lscope', nameScopeParser)
  const [matchModes, setMatchModes] = useQueryState('lmm', matchModesParser)
  const [iscedLevels, setIscedLevels] = useQueryState('lisc', iscedLevelsParser)
  const [geoBoundaryIssues, setGeoBoundaryIssues] = useQueryState('lgeo', geoBoundaryIssuesParser)
  const [schoolKinds, setSchoolKinds] = useQueryState('lsk', schoolKindsParser)

  const toggleMatchMode = useCallback(
    (mode: (typeof LAND_FACET_MATCH_MODES)[number], on: boolean) => {
      void setMatchModes((prev) => {
        const cur = prev ?? []
        const next = new Set(cur)
        if (on) next.add(mode)
        else next.delete(mode)
        const arr = [...next]
        return arr.length === 0 ? [] : arr
      })
    },
    [setMatchModes],
  )

  const toggleIscedLevel = useCallback(
    (level: 'yes' | 'no', on: boolean) => {
      void setIscedLevels((prev) => {
        const cur = prev ?? []
        const next = new Set(cur)
        if (on) next.add(level)
        else next.delete(level)
        const arr = [...next]
        return arr.length === 0 ? [] : arr
      })
    },
    [setIscedLevels],
  )

  const toggleGeoBoundaryIssue = useCallback(
    (v: 'yes' | 'no', on: boolean) => {
      void setGeoBoundaryIssues((prev) => {
        const cur = prev ?? []
        const next = new Set(cur)
        if (on) next.add(v)
        else next.delete(v)
        const arr = [...next]
        return arr.length === 0 ? [] : arr
      })
    },
    [setGeoBoundaryIssues],
  )

  const toggleSchoolKind = useCallback(
    (kind: string, on: boolean) => {
      void setSchoolKinds((prev) => {
        const cur = prev ?? []
        const next = new Set(cur)
        if (on) next.add(kind)
        else next.delete(kind)
        const arr = [...next]
        return arr.length === 0 ? [] : arr
      })
    },
    [setSchoolKinds],
  )

  const resetExplorer = useCallback(() => {
    void setExploreQ('')
    void setNameScope('both')
    void setMatchModes([])
    void setIscedLevels([])
    void setGeoBoundaryIssues([])
    void setSchoolKinds([])
  }, [
    setExploreQ,
    setNameScope,
    setMatchModes,
    setIscedLevels,
    setGeoBoundaryIssues,
    setSchoolKinds,
  ])

  return {
    exploreQ: exploreQ ?? '',
    setExploreQ,
    nameScope: nameScope ?? 'both',
    setNameScope,
    matchModes: matchModes ?? [],
    toggleMatchMode,
    iscedLevels: iscedLevels ?? [],
    toggleIscedLevel,
    geoBoundaryIssues: geoBoundaryIssues ?? [],
    toggleGeoBoundaryIssue,
    schoolKinds: schoolKinds ?? [],
    toggleSchoolKind,
    resetExplorer,
  }
}
