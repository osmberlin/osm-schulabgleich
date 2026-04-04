/**
 * Tokenize school names for full-text search: keep likely content words, drop German/English function words.
 * Aligned with the heuristic in `analysis/scripts/jedeschule-official-analysis.ts` (not linguistic POS).
 */

const STOP_TOKENS = new Set(
  [
    'für',
    'und',
    'oder',
    'der',
    'die',
    'das',
    'den',
    'dem',
    'des',
    'ein',
    'eine',
    'einer',
    'eines',
    'einem',
    'von',
    'zu',
    'zur',
    'zum',
    'vom',
    'bei',
    'mit',
    'ohne',
    'über',
    'unter',
    'im',
    'am',
    'an',
    'auf',
    'aus',
    'in',
    'ist',
    'sind',
    'war',
    'waren',
    'nach',
    'wie',
    'als',
    'auch',
    'noch',
    'nur',
    'the',
    'a',
    'of',
    'at',
  ].map((s) => s.toLowerCase()),
)

function tokenizeSegment(name: string): string[] {
  const n = name.normalize('NFKC').toLowerCase()
  const cleaned = n.replace(/[-–—_,.;:!?'"()[\]{}]/g, ' ')
  const raw = cleaned.split(/[^\p{L}\p{N}]+/u)
  const out: string[] = []
  for (const t of raw) {
    const w = t.trim()
    if (w.length < 3) continue
    if (/^\d+$/.test(w)) continue
    if (STOP_TOKENS.has(w)) continue
    out.push(w)
  }
  return out
}

/** Space-separated unique tokens for itemsjs / Lunr (stable order not required). */
export function substantivesFromNames(parts: (string | null | undefined)[]): string {
  const bag = new Set<string>()
  for (const p of parts) {
    if (!p) continue
    const s = String(p).trim()
    if (!s) continue
    for (const t of tokenizeSegment(s)) bag.add(t)
  }
  return [...bag].join(' ')
}
