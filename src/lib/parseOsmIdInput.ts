export type OsmElementRef = { type: 'node' | 'way' | 'relation'; id: string }

/**
 * Parse OSM object references: `w123`, `way/123`, full openstreetmap.org URLs, etc.
 */
export function parseOsmIdInput(raw: string): OsmElementRef | null {
  const s = raw.trim()
  if (!s) return null

  const urlMatch = s.match(
    /(?:openstreetmap\.org|osm\.org)\/(?:[a-z-]+\/)?(node|way|relation)\/(\d+)/i,
  )
  if (urlMatch?.[1] && urlMatch[2]) {
    const t = urlMatch[1].toLowerCase()
    const type = t === 'node' || t === 'way' || t === 'relation' ? t : null
    if (type) return { type, id: urlMatch[2] }
  }

  const slashMatch = s.match(/^(node|way|relation)\/(\d+)$/i)
  if (slashMatch?.[1] && slashMatch[2]) {
    const t = slashMatch[1].toLowerCase()
    const type = t === 'node' || t === 'way' || t === 'relation' ? t : null
    if (type) return { type, id: slashMatch[2] }
  }

  const compact = s.match(/^([nwr])(\d+)$/i)
  if (compact?.[1] && compact[2]) {
    const prefix = compact[1].toLowerCase()
    const type: OsmElementRef['type'] =
      prefix === 'n' ? 'node' : prefix === 'w' ? 'way' : 'relation'
    return { type, id: compact[2] }
  }

  return null
}
