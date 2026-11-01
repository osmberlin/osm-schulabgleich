import type { FeatureCollection } from 'geojson'
import osm2geojson from 'osm2geojson-ultra'
import { describe, expect, it } from 'vitest'
import { buildOsmSchoolsFromGeoJson } from './match'
import { attachOsmTimestampsFromOverpass, OSM_TIMESTAMP_PIPELINE_PROP } from './osmOverpassMeta'
import { injectSchoolSiteRelationsFromOverpass } from './osmOverpassSchoolSites'

const meta = (ts: string) => ({
  timestamp: ts,
  version: 7,
  changeset: 123456,
  user: 'some_mapper',
  uid: 42,
})

const ringA = [
  { lat: 52.0, lon: 13.0 },
  { lat: 52.001, lon: 13.0 },
  { lat: 52.001, lon: 13.001 },
  { lat: 52.0, lon: 13.001 },
  { lat: 52.0, lon: 13.0 },
]

/** What Overpass `out meta geom` returns: node, way and a site relation, each with contributor metadata. */
const raw = {
  elements: [
    {
      type: 'node',
      id: 1,
      lat: 52.5,
      lon: 13.5,
      tags: { amenity: 'school', name: 'Node' },
      ...meta('2025-01-02T03:04:05Z'),
    },
    {
      type: 'way',
      id: 2,
      tags: { amenity: 'school', name: 'Way' },
      geometry: ringA,
      ...meta('2024-06-07T08:09:10Z'),
    },
    {
      type: 'relation',
      id: 9,
      bounds: { minlat: 52, maxlat: 52.001, minlon: 13, maxlon: 13.001 },
      members: [{ type: 'way', ref: 2, role: '', geometry: ringA }],
      tags: { amenity: 'school', type: 'site', name: 'Campus' },
      ...meta('2023-11-12T13:14:15Z'),
    },
  ],
}

function pipelineGeoJson() {
  const converted = osm2geojson(raw) as FeatureCollection
  const withTs = attachOsmTimestampsFromOverpass(raw, converted)
  return injectSchoolSiteRelationsFromOverpass(raw, withTs)
}

describe('attachOsmTimestampsFromOverpass', () => {
  it('shows what osm2geojson-ultra emits for out meta (guards the drop list)', () => {
    const converted = osm2geojson(raw) as FeatureCollection
    const keys = new Set(converted.features.flatMap((f) => Object.keys(f.properties ?? {})))
    for (const k of ['@timestamp', '@version', '@changeset', '@user', '@uid']) {
      expect(keys.has(k)).toBe(true)
    }
  })

  it('keeps only the timestamp as _pipelineOsmTimestamp, also on injected site relations', () => {
    const fc = pipelineGeoJson()
    expect(fc.features.map((f) => String(f.id)).sort()).toEqual(['node/1', 'relation/9'])
    const byId = Object.fromEntries(fc.features.map((f) => [String(f.id), f.properties ?? {}]))
    expect(byId['node/1']![OSM_TIMESTAMP_PIPELINE_PROP]).toBe('2025-01-02T03:04:05Z')
    expect(byId['relation/9']![OSM_TIMESTAMP_PIPELINE_PROP]).toBe('2023-11-12T13:14:15Z')
  })

  it('leaves no user, uid, changeset or version in the GeoJSON', () => {
    const json = JSON.stringify(pipelineGeoJson())
    expect(json).not.toContain('some_mapper')
    expect(json).not.toContain('123456')
    expect(json).not.toMatch(/"@(user|uid|changeset|version|timestamp)"/)
    expect(json).not.toMatch(/"(user|uid|changeset|version)"/)
  })

  it('does not put the timestamp or contributor data into osmTags', () => {
    const schools = buildOsmSchoolsFromGeoJson(pipelineGeoJson())
    expect(schools).toHaveLength(2)
    for (const s of schools) {
      expect(Object.keys(s.tags).sort()).not.toContain(OSM_TIMESTAMP_PIPELINE_PROP)
      expect(Object.keys(s.tags).some((k) => k.startsWith('@') || k.startsWith('_pipeline'))).toBe(
        false,
      )
      expect(JSON.stringify(s)).not.toContain('some_mapper')
    }
    expect(schools.find((s) => s.osmId === '9')?.lastEditedAt).toBe('2023-11-12T13:14:15Z')
    expect(schools.find((s) => s.osmId === '1')?.lastEditedAt).toBe('2025-01-02T03:04:05Z')
  })

  it('leaves features without a (valid) element timestamp without the property', () => {
    const noMeta = {
      elements: [
        { type: 'node', id: 3, lat: 52.5, lon: 13.5, tags: { amenity: 'school' } },
        { type: 'node', id: 4, lat: 52.6, lon: 13.6, tags: { amenity: 'school' }, timestamp: 'x' },
      ],
    }
    const fc = attachOsmTimestampsFromOverpass(noMeta, osm2geojson(noMeta) as FeatureCollection)
    expect(fc.features).toHaveLength(2)
    for (const f of fc.features) {
      expect(f.properties).not.toHaveProperty(OSM_TIMESTAMP_PIPELINE_PROP)
    }
  })
})
