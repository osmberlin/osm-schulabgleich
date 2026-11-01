import { featureCollection } from '@turf/helpers'
import type { Feature, FeatureCollection } from 'geojson'

/** Feature property that carries the OSM element `timestamp` (last edit). `_pipeline*` never becomes an OSM tag. */
export const OSM_TIMESTAMP_PIPELINE_PROP = '_pipelineOsmTimestamp'

/**
 * `out meta` makes osm2geojson-ultra emit these as `@…` properties. We only keep the timestamp (under
 * {@link OSM_TIMESTAMP_PIPELINE_PROP}); the contributor-related ones must not reach the GeoJSON.
 */
const OSM_META_PROPS_TO_DROP = ['@timestamp', '@version', '@changeset', '@user', '@uid'] as const

function elementTimestampsByFeatureId(raw: { elements?: unknown[] }): Map<string, string> {
  const out = new Map<string, string>()
  for (const el of Array.isArray(raw.elements) ? raw.elements : []) {
    const { type, id, timestamp } = (el ?? {}) as {
      type?: unknown
      id?: unknown
      timestamp?: unknown
    }
    if (typeof type !== 'string' || typeof id !== 'number') continue
    if (typeof timestamp !== 'string' || Number.isNaN(new Date(timestamp).getTime())) continue
    out.set(`${type}/${id}`, timestamp)
  }
  return out
}

/**
 * Overpass `out meta geom` → per feature: keep only the element timestamp as `_pipelineOsmTimestamp`,
 * drop `@timestamp`, `@version`, `@changeset`, `@user` and `@uid`. Features without a timestamp stay without it.
 */
export function attachOsmTimestampsFromOverpass(
  raw: { elements?: unknown[] },
  fc: FeatureCollection,
): FeatureCollection {
  const timestamps = elementTimestampsByFeatureId(raw)
  return featureCollection(
    fc.features.map((f): Feature => {
      const props: Record<string, unknown> = { ...f.properties }
      for (const k of OSM_META_PROPS_TO_DROP) delete props[k]
      const ts = typeof f.id === 'string' ? timestamps.get(f.id) : undefined
      if (ts) props[OSM_TIMESTAMP_PIPELINE_PROP] = ts
      return { ...f, properties: props }
    }),
  )
}
