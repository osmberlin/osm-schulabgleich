import { describe, expect, it } from 'vitest'
import {
  classifyMatchDistance,
  isOsmEditRecent,
  MATCH_DISTANCE_HINT_M,
  MATCH_DISTANCE_ERROR_M,
} from './matchDistanceCheck'

const REF = new Date('2026-10-21T12:00:00Z')
const RECENT = '2025-01-01T00:00:00Z'
const OLD = '2020-01-01T00:00:00Z'

function level(
  distanceMeters: number | null,
  matchMode: string | undefined,
  osmLastEditedAt: string | null | undefined,
) {
  return classifyMatchDistance({
    distanceMeters,
    matchMode,
    osmLastEditedAt,
    referenceDate: REF,
  })
}

describe('classifyMatchDistance', () => {
  it('uses the documented thresholds', () => {
    expect(MATCH_DISTANCE_HINT_M).toBe(400)
    expect(MATCH_DISTANCE_ERROR_M).toBe(1000)
  })

  it('is ok without a distance', () => {
    expect(level(null, 'ref', null)).toBe('ok')
  })

  it('is ok up to and including 400 m', () => {
    expect(level(0, 'name', null)).toBe('ok')
    expect(level(400, 'name', null)).toBe('ok')
    expect(level(400, 'ref', OLD)).toBe('ok')
  })

  it('is hint above 400 m up to and including 1000 m', () => {
    expect(level(401, 'name', null)).toBe('hint')
    expect(level(1000, 'name', null)).toBe('hint')
  })

  it('is error above 1000 m', () => {
    expect(level(1001, 'name', null)).toBe('error')
    expect(level(50_000, 'distance', RECENT)).toBe('error')
  })

  it('accepts ref matches with a recent OSM edit, also beyond 1000 m', () => {
    expect(level(401, 'ref', RECENT)).toBe('accepted')
    expect(level(1001, 'ref', RECENT)).toBe('accepted')
  })

  it('does not accept ref matches with an old or unknown edit date', () => {
    expect(level(800, 'ref', OLD)).toBe('hint')
    expect(level(2500, 'ref', OLD)).toBe('error')
    expect(level(2500, 'ref', null)).toBe('error')
    expect(level(800, 'ref', undefined)).toBe('hint')
    expect(level(2500, 'ref', 'not a date')).toBe('error')
  })

  it('never accepts non-ref modes, even with a recent edit', () => {
    for (const mode of [
      'distance',
      'distance_and_name',
      'distance_and_name_prefix',
      'name',
      'name_prefix',
      'website',
      'address',
      undefined,
    ]) {
      expect(level(800, mode, RECENT)).toBe('hint')
      expect(level(2500, mode, RECENT)).toBe('error')
    }
  })
})

describe('isOsmEditRecent', () => {
  it('includes exactly 2 years before the reference date', () => {
    expect(isOsmEditRecent('2024-10-21T12:00:00Z', REF)).toBe(true)
  })

  it('excludes anything older than 2 years', () => {
    expect(isOsmEditRecent('2024-10-21T11:59:59Z', REF)).toBe(false)
  })

  it('treats edits after the reference date as recent', () => {
    expect(isOsmEditRecent('2026-10-22T00:00:00Z', REF)).toBe(true)
  })

  it('treats missing or invalid dates as unknown', () => {
    expect(isOsmEditRecent(null, REF)).toBe(false)
    expect(isOsmEditRecent(undefined, REF)).toBe(false)
    expect(isOsmEditRecent('', REF)).toBe(false)
    expect(isOsmEditRecent('garbage', REF)).toBe(false)
  })
})
