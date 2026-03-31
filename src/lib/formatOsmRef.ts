/**
 * Compact OSM object reference for UI (cf. iD/JOSM: way/node/relation ids).
 * way → w123, node → n456, relation → r789
 */
function formatOsmElementRef(
  osmType: 'way' | 'relation' | 'node' | null | undefined,
  osmId: string | null | undefined,
): string | null {
  if (!osmType || !osmId) return null
  const prefix = osmType === 'way' ? 'w' : osmType === 'node' ? 'n' : 'r'
  return `${prefix}${osmId}`
}

/** List / subtitle: show OSM ref when the row is tied to an OSM object; else official school id. */
export function formatMatchRowListId(row: {
  officialId: string | null
  osmId: string | null
  osmType: 'way' | 'relation' | 'node' | null
}): string {
  const osm = formatOsmElementRef(row.osmType, row.osmId)
  if (osm) return osm
  if (row.officialId) return row.officialId
  if (row.osmId) return row.osmId
  return ''
}
