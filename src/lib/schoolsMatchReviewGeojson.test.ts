import { describe, expect, it } from 'vitest'
import type { SchoolsMatchRow } from './schemas'
import { schoolsMatchRowSchema } from './schemas'
import { buildSchoolsMatchReviewGeojson } from './schoolsMatchReviewGeojson'

function row(overrides: Record<string, unknown>): SchoolsMatchRow {
  return schoolsMatchRowSchema.parse({
    key: 'match-BE-1',
    category: 'matched',
    matchMode: 'ref',
    officialId: 'BE-1',
    officialName: 'Grundschule Test',
    osmId: '123',
    osmType: 'way',
    osmName: 'GS Test',
    osmCentroidLon: 13.4001,
    osmCentroidLat: 52.5001,
    osmLastEditedAt: '2025-03-04T10:00:00Z',
    distanceMeters: 2400,
    distanceCheck: 'error',
    ...overrides,
  })
}

const officialPointsById = {
  'BE-1': [13.41234, 52.51234] as [number, number],
  'BE-2': [13.41234, 52.51234] as [number, number],
  'BE-3': [13.41234, 52.51234] as [number, number],
  'BE-4': [13.41234, 52.51234] as [number, number],
  'BE-5': [13.41234, 52.51234] as [number, number],
}

const batch = (rows: SchoolsMatchRow[]) => ({
  rows,
  options: { bundesland: 'BE', officialPointsById },
})

describe('buildSchoolsMatchReviewGeojson', () => {
  it('emits connection, official and OSM feature per row', () => {
    const { features } = buildSchoolsMatchReviewGeojson([batch([row({})])])
    expect(features.map((f) => f.id)).toEqual([
      'match-BE-1/connection',
      'match-BE-1/official',
      'match-BE-1/osm',
    ])
    expect(features.map((f) => f.geometry.type)).toEqual(['LineString', 'Point', 'Point'])
    expect(features.map((f) => f.properties['name'])).toEqual([
      '2,4 km: Grundschule Test',
      'Grundschule Test',
      'GS Test',
    ])
    expect(features[0]!.geometry).toEqual({
      type: 'LineString',
      coordinates: [
        [13.41234, 52.51234],
        [13.4001, 52.5001],
      ],
    })
    expect(features.map((f) => f.properties['schulabgleich:role'])).toEqual([
      'connection',
      'official',
      'osm',
    ])
  })

  it('falls back to the official name when the OSM name is missing', () => {
    const { features } = buildSchoolsMatchReviewGeojson([batch([row({ osmName: null })])])
    expect(features[2]!.properties['name']).toBe('Grundschule Test')
  })

  it('keeps only rated matched rows with both points and sorts error, hint, accepted by distance', () => {
    const rows = [
      row({
        key: 'hint-near',
        officialId: 'BE-2',
        distanceMeters: 500,
        distanceCheck: 'hint',
      }),
      row({
        key: 'accepted',
        officialId: 'BE-3',
        distanceMeters: 5000,
        distanceCheck: 'accepted',
      }),
      row({ key: 'error-near', officialId: 'BE-4', distanceMeters: 1200 }),
      row({ key: 'error-far', officialId: 'BE-5', distanceMeters: 3000 }),
      row({
        key: 'hint-far',
        officialId: 'BE-2',
        distanceMeters: 900,
        distanceCheck: 'hint',
      }),
      row({ key: 'ok', distanceMeters: 100, distanceCheck: 'ok' }),
      row({ key: 'unrated', distanceCheck: undefined }),
      row({ key: 'official-only', category: 'official_only' }),
      row({ key: 'no-osm-point', osmCentroidLon: null, osmCentroidLat: null }),
      row({ key: 'no-official-point', officialId: 'BE-9' }),
    ]
    const { features } = buildSchoolsMatchReviewGeojson([batch(rows)])
    const keys = features
      .filter((f) => f.properties['schulabgleich:role'] === 'official')
      .map((f) => String(f.id).split('/')[0])
    expect(keys).toEqual(['error-far', 'error-near', 'hint-far', 'hint-near', 'accepted'])
    expect(features).toHaveLength(15)
  })

  it('skips a row without an official point', () => {
    const noPoint = row({ key: 'x', officialId: 'BE-9' })
    expect(buildSchoolsMatchReviewGeojson([batch([noPoint])]).features).toEqual([])
  })

  it('uses the official properties as fallback for the official point', () => {
    const r = row({ officialId: 'BE-9', officialProperties: { longitude: 13.3, latitude: 52.4 } })
    const { features } = buildSchoolsMatchReviewGeojson([batch([r])])
    expect(features[1]!.geometry).toEqual({ type: 'Point', coordinates: [13.3, 52.4] })
  })

  it('prefixes every property except name, uses flat values and plain-text reasons', () => {
    const { features } = buildSchoolsMatchReviewGeojson([
      batch([row({ matchMode: 'name', distanceCheck: 'hint' })]),
    ])
    const entries = features.flatMap((f) => Object.entries(f.properties))
    const unprefixed = entries.filter(
      ([key]) => key !== 'name' && !key.startsWith('schulabgleich:'),
    )
    expect(unprefixed).toEqual([])
    expect(entries.every(([, v]) => typeof v === 'string' || typeof v === 'number')).toBe(true)
    const [connection, official, osm] = features.map((f) => f.properties)
    expect(Object.keys(connection!).toSorted()).toEqual(
      [
        'name',
        'schulabgleich:role',
        'schulabgleich:check',
        'schulabgleich:distance_m',
        'schulabgleich:match_mode',
        'schulabgleich:reason',
        'schulabgleich:official_name',
        'schulabgleich:official_id',
        'schulabgleich:osm_name',
        'schulabgleich:osm_id',
        'schulabgleich:osm_url',
        'schulabgleich:osm_last_edited_at',
        'schulabgleich:detail_url',
        'schulabgleich:bundesland',
        'schulabgleich:official_license',
        'schulabgleich:official_osm_compatible',
      ].toSorted(),
    )
    const { name: _a, 'schulabgleich:role': _b, ...sharedOfficial } = official!
    const { name: _c, 'schulabgleich:role': _d, ...sharedOsm } = osm!
    expect(sharedOfficial).toEqual(sharedOsm)
    expect(connection!['schulabgleich:check']).toBe('hint')
    expect(connection!['schulabgleich:distance_m']).toBe(2400)
    expect(connection!['schulabgleich:osm_id']).toBe('way/123')
    expect(connection!['schulabgleich:osm_url']).toBe('https://www.openstreetmap.org/way/123')
    expect(connection!['schulabgleich:reason']).toContain('Größere Abstände')
    expect(String(connection!['schulabgleich:reason'])).not.toContain('`')
  })

  it('strips backticks from the accepted reason', () => {
    const { features } = buildSchoolsMatchReviewGeojson([
      batch([row({ distanceCheck: 'accepted' })]),
    ])
    const reason = String(features[0]!.properties['schulabgleich:reason'])
    expect(reason).toContain('4.3.2025')
    expect(reason).not.toContain('`')
  })
})
