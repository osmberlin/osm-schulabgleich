import type { OsmStyleMapTriple } from './osmStyleMapQueryParam'
import {
  parseOsmStyleMapSearchParam,
  serializeOsmStyleMapSearchParam,
} from './osmStyleMapQueryParam'

function firstSearchString(v: unknown): string | undefined {
  if (typeof v === 'string') return v
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0]
  return undefined
}

/** Shared `?map=` parse for `/` — used by `validateSearch` and `beforeLoad`. */
export function parseIndexRouteMapSearch(
  search: Record<string, unknown>,
): OsmStyleMapTriple | null {
  const raw = firstSearchString(search.map)
  if (raw === undefined) return null
  return parseOsmStyleMapSearchParam(raw)
}

export type OsmLocateErrKey = 'invalid' | 'outside' | 'fetch'

/**
 * Strict search merged for `/` (see TanStack Router `validateSearch`).
 * - **`map`** — same query key as Bundesland/detail routes.
 * - **`osm`** — OSM locate input; handled in `beforeLoad` like `map` (router redirect).
 * - **`osmLocateErr`** — short-lived after failed locate (banner on the start page).
 */
export type IndexRouteStrictSearch = {
  map?: string
  osm?: string
  osmLocateErr?: OsmLocateErrKey
}

export function validateIndexRouteSearch(search: Record<string, unknown>): IndexRouteStrictSearch {
  const triple = parseIndexRouteMapSearch(search)
  const osmRaw = firstSearchString(search.osm)
  const errRaw = firstSearchString(search.osmLocateErr)
  const out: IndexRouteStrictSearch = {}
  if (triple) out.map = serializeOsmStyleMapSearchParam(triple)
  if (osmRaw !== undefined && osmRaw.trim() !== '') out.osm = osmRaw.trim()
  if (errRaw === 'invalid' || errRaw === 'outside' || errRaw === 'fetch') {
    out.osmLocateErr = errRaw
  }
  return out
}
