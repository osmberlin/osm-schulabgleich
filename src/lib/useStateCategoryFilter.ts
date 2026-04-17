import { STATE_MATCH_CATEGORIES, type StateMatchCategory } from './stateMatchCategories'
import { parseAsArrayOf, parseAsStringLiteral, useQueryState } from 'nuqs'
import { useMemo } from 'react'

/** Mutable full list + stable reference for nuqs default / “all categories” URL value. */
const DEFAULT_STATE_MATCH_CATEGORIES: StateMatchCategory[] = [...STATE_MATCH_CATEGORIES]

const categoryItemParser = parseAsStringLiteral(STATE_MATCH_CATEGORIES)

const catsParser = parseAsArrayOf(categoryItemParser)
  .withDefault(DEFAULT_STATE_MATCH_CATEGORIES)
  .withOptions({ history: 'replace' })

/**
 * URL-synced legend / filter for Bundesland map + Trefferliste (`?cats=matched&cats=osm_only` …).
 * Same idea as the OSM-Grenzabgleich `useAreaReportCategoryFilter`.
 */
export function useStateCategoryFilter() {
  const [cats, setCats] = useQueryState('cats', catsParser)

  const enabledSet = useMemo(() => new Set(cats), [cats])

  function setCategoryEnabled(c: StateMatchCategory, enabled: boolean) {
    void setCats((prev) => {
      const cur = prev ?? DEFAULT_STATE_MATCH_CATEGORIES
      const next = new Set(cur)
      if (enabled) next.add(c)
      else next.delete(c)
      const arr = DEFAULT_STATE_MATCH_CATEGORIES.filter((x) => next.has(x))
      return arr.length === DEFAULT_STATE_MATCH_CATEGORIES.length
        ? DEFAULT_STATE_MATCH_CATEGORIES
        : arr
    })
  }

  return {
    /** Categories currently enabled (drives list + map; synced with URL). */
    enabledCategories: cats,
    enabledSet,
    setCategoryEnabled,
    isCategoryEnabled: (c: StateMatchCategory) => enabledSet.has(c),
  }
}
