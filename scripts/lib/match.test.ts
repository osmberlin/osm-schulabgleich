import { describe, expect, it } from 'vitest'
import { MATCH_RADIUS_KM, matchSchools, type OfficialInput, type OsmSchoolInput } from './match'

describe('matchSchools', () => {
  const officials: OfficialInput[] = [
    {
      id: 'BE-a',
      name: 'Test Schule Nord',
      lon: 13.4,
      lat: 52.52,
      properties: { id: 'BE-a' },
    },
    {
      id: 'BE-b',
      name: 'Far Away',
      lon: 14,
      lat: 52.52,
      properties: { id: 'BE-b' },
    },
  ]

  const osmNear: OsmSchoolInput = {
    osmType: 'way',
    osmId: '1',
    name: 'Test Schule Nord',
    tags: { amenity: 'school', name: 'Test Schule Nord' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [13.399, 52.519],
          [13.401, 52.519],
          [13.401, 52.521],
          [13.399, 52.521],
          [13.399, 52.519],
        ],
      ],
    },
    centroid: [13.4, 52.52],
  }

  it('matches within radius', () => {
    const { rows } = matchSchools(officials, [osmNear])
    const m = rows.filter((r) => r.category === 'matched')
    expect(m).toHaveLength(1)
    expect(m[0].officialId).toBe('BE-a')
    expect(m[0].osmCentroidLon).toBe(13.4)
    expect(m[0].osmCentroidLat).toBe(52.52)
    expect(rows.some((r) => r.category === 'official_only' && r.officialId === 'BE-b')).toBe(true)
  })

  it('respects MATCH_RADIUS_KM notionally', () => {
    const far: OsmSchoolInput = {
      ...osmNear,
      osmId: '2',
      centroid: [osmNear.centroid[0] + 0.5, osmNear.centroid[1]],
    }
    const { rows } = matchSchools(officials, [far])
    expect(rows.some((r) => r.category === 'osm_only')).toBe(true)
    expect(MATCH_RADIUS_KM).toBe(0.15)
  })

  it('marks ambiguous when several officials fall within radius (no name-based winner)', () => {
    const twoNear: OfficialInput[] = [
      {
        id: 'BE-x',
        name: 'Alpha Schule',
        lon: 13.3999,
        lat: 52.5199,
        properties: { id: 'BE-x', name: 'Alpha Schule' },
      },
      {
        id: 'BE-y',
        name: 'Beta Schule',
        lon: 13.4001,
        lat: 52.5201,
        properties: { id: 'BE-y', name: 'Beta Schule' },
      },
      ...officials.filter((o) => o.id === 'BE-b'),
    ]
    const { rows } = matchSchools(twoNear, [osmNear])
    const amb = rows.filter((r) => r.category === 'match_ambiguous')
    expect(amb).toHaveLength(1)
    expect(amb[0].officialId).toBeNull()
    expect(amb[0].ambiguousOfficialIds?.sort()).toEqual(['BE-x', 'BE-y'].sort())
    expect(amb[0].osmId).toBe('1')
  })
})
