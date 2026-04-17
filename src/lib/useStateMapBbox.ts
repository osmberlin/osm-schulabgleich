import { stateMapBboxTupleSchema } from './zodGeo'
import { createParser, useQueryState } from 'nuqs'

/** Map viewport bbox in WGS84: west, south, east, north (URL `?bbox=`). */
export type StateMapBbox = readonly [west: number, south: number, east: number, north: number]

export const stateMapBboxParser = createParser({
  parse(value) {
    const parts = value.split(',').map((x) => Number.parseFloat(x.trim()))
    const r = stateMapBboxTupleSchema.safeParse(parts)
    return r.success ? (r.data as StateMapBbox) : null
  },
  serialize(value: StateMapBbox) {
    return value.map((n) => n.toFixed(4)).join(',')
  },
}).withOptions({ history: 'replace' })

/**
 * URL-synced map list filter for the Bundesland page (`?bbox=west,south,east,north`).
 */
export function useStateMapBbox() {
  const [bbox, setBbox] = useQueryState('bbox', stateMapBboxParser)

  return {
    bbox,
    setBbox,
    clearBbox: () => {
      void setBbox(null)
    },
  }
}
