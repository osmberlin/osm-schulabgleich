import { describe, expect, it } from 'vitest'
import { formatDistanceDe } from './formatNumber'

describe('formatDistanceDe', () => {
  it('uses metres up to and including 1000', () => {
    expect(formatDistanceDe(36)).toBe('36 m')
    expect(formatDistanceDe(1000)).toBe('1.000 m')
  })

  it('uses kilometres with one decimal above 1000 m', () => {
    expect(formatDistanceDe(1001)).toBe('1,0 km')
    expect(formatDistanceDe(2400)).toBe('2,4 km')
    expect(formatDistanceDe(12_345)).toBe('12,3 km')
  })
})
