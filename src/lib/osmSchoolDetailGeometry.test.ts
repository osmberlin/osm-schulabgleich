import { resolveOsmSchoolAreaOutline } from './osmSchoolDetailGeometry'
import { describe, expect, it } from 'vitest'

describe('resolveOsmSchoolAreaOutline', () => {
  it('returns merged area when hasPolygonGeometry and areas key exists', () => {
    const main = {
      type: 'Feature' as const,
      id: 'way/2',
      properties: { hasPolygonGeometry: true },
      geometry: { type: 'Point' as const, coordinates: [9, 48] },
    }
    const areas = {
      'way/2': {
        type: 'Feature' as const,
        id: 'way/2',
        properties: null,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [
            [
              [9, 48],
              [9.02, 48],
              [9.02, 48.02],
              [9, 48],
            ],
          ],
        },
      },
    }
    const out = resolveOsmSchoolAreaOutline(main, 'way', '2', areas)
    expect(out?.geometry?.type).toBe('Polygon')
    expect(out?.id).toBe('way/2')
  })

  it('returns null when hasPolygonGeometry is not set', () => {
    const main = {
      type: 'Feature' as const,
      id: 'way/1',
      properties: null,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [9, 48],
            [9.01, 48],
            [9.01, 48.01],
            [9, 48],
          ],
        ],
      },
    }
    expect(resolveOsmSchoolAreaOutline(main, 'way', '1', {})).toBeNull()
  })

  it('returns null when areas map is missing the key', () => {
    const main = {
      type: 'Feature' as const,
      id: 'way/2',
      properties: { hasPolygonGeometry: true },
      geometry: { type: 'Point' as const, coordinates: [9, 48] },
    }
    expect(resolveOsmSchoolAreaOutline(main, 'way', '2', {})).toBeNull()
  })
})
