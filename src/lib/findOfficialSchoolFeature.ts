import type { Feature, FeatureCollection } from 'geojson'

/** Locate a school in the amtliche `official` GeoJSON by JedeSchule id (`properties.id` or Feature `id`). */
export function findOfficialSchoolFeature(fc: FeatureCollection, schoolId: string): Feature | null {
  for (const x of fc.features) {
    const pid = x.properties?.id as string | undefined
    if (pid === schoolId) return x
    if (typeof x.id === 'string' && x.id === schoolId) return x
  }
  return null
}
