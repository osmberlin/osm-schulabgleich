import { parseAsArrayOf, parseAsStringLiteral, useQueryState } from 'nuqs'
import { useCallback, useMemo } from 'react'

/** Match categories used for map paint, table, and URL filter (nuqs `cats`). */
export const LAND_MATCH_CATEGORIES = [
  'matched',
  'official_only',
  'osm_only',
  'match_ambiguous',
] as const

export type LandMatchCategory = (typeof LAND_MATCH_CATEGORIES)[number]

export const ALL_LAND_MATCH_CATEGORIES: LandMatchCategory[] = [...LAND_MATCH_CATEGORIES]

const categoryItemParser = parseAsStringLiteral(LAND_MATCH_CATEGORIES)

const catsParser = parseAsArrayOf(categoryItemParser)
  .withDefault(ALL_LAND_MATCH_CATEGORIES)
  .withOptions({ history: 'replace' })

/**
 * URL-synced legend / filter for Bundesland map + Trefferliste (`?cats=matched&cats=osm_only` …).
 * Same idea as the OSM-Grenzabgleich `useAreaReportCategoryFilter`.
 */
export function useLandCategoryFilter() {
  const [cats, setCats] = useQueryState('cats', catsParser)

  const enabledSet = useMemo(() => new Set(cats), [cats])

  const setCategoryEnabled = useCallback(
    (c: LandMatchCategory, enabled: boolean) => {
      void setCats((prev) => {
        const cur = prev ?? ALL_LAND_MATCH_CATEGORIES
        const next = new Set(cur)
        if (enabled) next.add(c)
        else next.delete(c)
        const arr = ALL_LAND_MATCH_CATEGORIES.filter((x) => next.has(x))
        return arr.length === ALL_LAND_MATCH_CATEGORIES.length ? ALL_LAND_MATCH_CATEGORIES : arr
      })
    },
    [setCats],
  )

  return {
    /** Categories currently enabled (drives list + map; synced with URL). */
    enabledCategories: cats,
    enabledSet,
    setCategoryEnabled,
    isCategoryEnabled: (c: LandMatchCategory) => enabledSet.has(c),
  }
}
