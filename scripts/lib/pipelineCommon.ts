import path from 'node:path'
import { type LandCode, STATE_ORDER } from '../../src/lib/stateConfig'
import type { JedeschuleSchool } from './jedeschuleCsv'

export const PIPELINE_VERSION = 1 as const

export function datasetsDir(projectRoot: string) {
  return path.join(projectRoot, 'public', 'datasets')
}

export function statusDir(projectRoot: string) {
  return path.join(datasetsDir(projectRoot), 'status')
}

export function schoolToOfficialProps(s: Record<string, unknown>): Record<string, unknown> {
  const omit = new Set(['latitude', 'longitude'])
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(s)) {
    if (omit.has(k)) continue
    if (v === undefined) continue
    out[k] = v
  }
  return out
}

export function landCodeFromSchoolId(id: string): LandCode | null {
  const dash = id.indexOf('-')
  const state = dash > 0 ? id.slice(0, dash) : ''
  if (state.length === 2 && STATE_ORDER.includes(state as LandCode)) return state as LandCode
  return null
}

/** Nationwide FeatureCollection; `properties.land` from school id prefix when valid. */
export function officialGeojsonNational(schools: JedeschuleSchool[]) {
  return {
    type: 'FeatureCollection' as const,
    features: schools.map((s) => {
      const lat = s.latitude ?? null
      const lon = s.longitude ?? null
      const land = landCodeFromSchoolId(s.id)
      const has = typeof lat === 'number' && typeof lon === 'number' && Number.isFinite(lat + lon)
      return {
        type: 'Feature' as const,
        id: s.id,
        properties: { ...schoolToOfficialProps({ ...s }), ...(land ? { land } : {}) },
        geometry: has
          ? { type: 'Point' as const, coordinates: [lon as number, lat as number] }
          : null,
      }
    }),
  }
}

export async function readJsonFile<T>(filePath: string): Promise<T | null> {
  const f = Bun.file(filePath)
  if (!(await f.exists())) return null
  try {
    return (await f.json()) as T
  } catch {
    return null
  }
}

export async function writeJson(p: string, data: unknown) {
  await Bun.write(p, JSON.stringify(data, null, 2))
}
