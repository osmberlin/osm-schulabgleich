import { stateMapBboxTupleSchema } from './zodGeo'

/** Map viewport bbox in WGS84: west, south, east, north (URL `?bbox=`). */
export type StateMapBbox = readonly [west: number, south: number, east: number, north: number]

export function parseStateMapBboxSearchParam(
  value: string | null | undefined,
): StateMapBbox | null {
  if (value == null || value === '') return null
  const parts = value.split(',').map((x) => Number.parseFloat(x.trim()))
  const r = stateMapBboxTupleSchema.safeParse(parts)
  return r.success ? (r.data as StateMapBbox) : null
}

export function serializeStateMapBboxSearchParam(value: StateMapBbox): string {
  return value.map((n) => n.toFixed(4)).join(',')
}
