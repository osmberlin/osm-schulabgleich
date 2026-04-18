import { matchRowDisplayName } from './matchRowInBbox'
import type { StateMatchCategory } from './stateMatchCategories'

export function detailMapReferenceName(row: {
  category: StateMatchCategory
  matchCategory?: StateMatchCategory | null
  officialName: string | null
  osmName: string | null
  officialProperties?: Record<string, unknown> | null
}): string {
  const currentSchoolCategory = row.matchCategory ?? row.category
  if (currentSchoolCategory === 'official_only') {
    return matchRowDisplayName(row)
  }
  const osmName = row.osmName?.trim()
  if (osmName) return osmName
  return matchRowDisplayName(row)
}
