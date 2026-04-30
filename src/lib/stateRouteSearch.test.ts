import { validateStateRouteSearch } from './stateRouteSearch'
import { describe, expect, it } from 'vitest'

describe('validateStateRouteSearch ref facet parsing', () => {
  it('accepts lref=missing_possible_ref', () => {
    const out = validateStateRouteSearch({ lref: 'missing_possible_ref' })
    expect(out.lref).toEqual(['missing_possible_ref'])
  })

  it('drops invalid lref values', () => {
    const out = validateStateRouteSearch({ lref: ['missing_possible_ref', 'invalid_value'] })
    expect(out.lref).toEqual(['missing_possible_ref'])
  })
})
