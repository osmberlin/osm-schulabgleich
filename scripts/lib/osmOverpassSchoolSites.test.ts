import {
  dedupeOsmGeoJsonFeaturesById,
  injectSchoolSiteRelationsFromOverpass,
} from './osmOverpassSchoolSites'
import type { FeatureCollection } from 'geojson'
import { describe, expect, it } from 'vitest'

describe('dedupeOsmGeoJsonFeaturesById', () => {
  it('keeps Polygon over LineString for the same way id', () => {
    const fc = dedupeOsmGeoJsonFeaturesById({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'way/1',
          properties: { amenity: 'school' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [0, 0],
              [1, 1],
            ],
          },
        },
        {
          type: 'Feature',
          id: 'way/1',
          properties: { amenity: 'school' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
                [0, 0],
              ],
            ],
          },
        },
      ],
    })
    expect(fc.features).toHaveLength(1)
    expect(fc.features[0]?.geometry?.type).toBe('Polygon')
  })
})

describe('injectSchoolSiteRelationsFromOverpass', () => {
  it('adds relation Point and drops member school ways for type=site', () => {
    /** Mimics osmtogeojson output for relation+ways with `out geom`: duplicate way ids (Polygon + LineString), no `relation/` feature. */
    const gjRaw: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'way/1',
          properties: { amenity: 'school', name: 'Wing A' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [13.34, 52.47],
                [13.341, 52.47],
                [13.341, 52.471],
                [13.34, 52.47],
              ],
            ],
          },
        },
        {
          type: 'Feature',
          id: 'way/2',
          properties: { amenity: 'school', name: 'Wing B' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [13.345, 52.468],
                [13.346, 52.468],
                [13.346, 52.469],
                [13.345, 52.468],
              ],
            ],
          },
        },
        {
          type: 'Feature',
          id: 'way/1',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [13.34, 52.47],
              [13.341, 52.471],
            ],
          },
        },
        {
          type: 'Feature',
          id: 'way/2',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [13.345, 52.468],
              [13.346, 52.469],
            ],
          },
        },
      ],
    }
    const raw = {
      elements: [
        {
          type: 'relation',
          id: 17475927,
          bounds: { minlat: 52.4675, maxlat: 52.471, minlon: 13.34, maxlon: 13.346 },
          members: [
            { type: 'way', ref: 1 },
            { type: 'way', ref: 2 },
          ],
          tags: {
            amenity: 'school',
            type: 'site',
            name: 'Friedenauer Gemeinschaftsschule',
            ref: '07K12',
          },
        },
      ],
    }
    const out = injectSchoolSiteRelationsFromOverpass(raw, gjRaw)
    const ids = new Set(out.features.map((f) => String(f.id)))
    expect(ids.has('relation/17475927')).toBe(true)
    expect(ids.has('way/1')).toBe(false)
    expect(ids.has('way/2')).toBe(false)
    const rel = out.features.find((f) => f.id === 'relation/17475927')
    expect(rel).toBeDefined()
    expect(rel!.geometry?.type).toBe('Point')
    const p = (rel!.geometry as { type: 'Point'; coordinates: [number, number] }).coordinates
    expect(p[0]).toBeCloseTo((13.34 + 13.346) / 2, 5)
    expect(p[1]).toBeCloseTo((52.4675 + 52.471) / 2, 5)
  })
})
