import {
  collectFilteredIdsFromSearchResult,
  createStateMatchItemsJsEngine,
  matchRowToItemsJsDoc,
  searchStateMatchesWithExplorer,
  type StateMatchRow,
} from './stateOverviewItemsSearch'
import { describe, expect, it } from 'vitest'

function matchedRow(input: {
  key: string
  officialId: string | null
  ref: string | null
}): StateMatchRow {
  return {
    key: input.key,
    category: 'matched',
    matchCategory: 'matched',
    officialId: input.officialId,
    officialName: 'Testschule',
    officialProperties: {},
    osmId: '1',
    osmType: 'way',
    distanceMeters: 12,
    osmName: 'Testschule',
    osmTags: input.ref == null ? { amenity: 'school' } : { amenity: 'school', ref: input.ref },
  }
}

describe('stateOverviewItemsSearch refStatus facet', () => {
  it('marks matched rows with usable official id and missing osm ref as missing_possible_ref', () => {
    const doc = matchRowToItemsJsDoc(matchedRow({ key: 'a', officialId: 'BE-03P11', ref: null }))
    expect(doc.refStatus).toBe('missing_possible_ref')
  })

  it('does not mark rows when ref exists or official id is not usable', () => {
    const withRef = matchRowToItemsJsDoc(
      matchedRow({ key: 'b', officialId: 'BE-03P11', ref: '03P11' }),
    )
    const unusable = matchRowToItemsJsDoc(
      matchedRow({ key: 'c', officialId: 'BW-FB-UNKNOWN', ref: null }),
    )
    expect(withRef.refStatus).toBe('other')
    expect(unusable.refStatus).toBe('other')
  })

  it('filters by missing_possible_ref', () => {
    const rows: StateMatchRow[] = [
      matchedRow({ key: 'missing', officialId: 'BE-03P11', ref: null }),
      matchedRow({ key: 'present', officialId: 'BE-03P11', ref: '03P11' }),
      matchedRow({ key: 'unusable', officialId: 'BW-FB-UNKNOWN', ref: null }),
    ]
    const engine = createStateMatchItemsJsEngine(rows)
    const result = searchStateMatchesWithExplorer(engine, {
      query: '',
      nameScope: 'both',
      matchModes: [],
      iscedLevels: [],
      geoBoundaryIssues: [],
      schoolKinds: [],
      osmAmenities: [],
      schoolFormFamilies: [],
      schoolFormCombos: [],
      refStatuses: ['missing_possible_ref'],
    })
    const ids = collectFilteredIdsFromSearchResult(result)
    expect(ids).toEqual(new Set(['missing']))
  })
})
