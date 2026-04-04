/**
 * Normalize OSM `school=*` and `school:de=*` into a single German display bucket for analytics and UI.
 *
 * - Excludes ancillary `school=*` values (entrances, fragments, non-school uses) from “Schulart” stats.
 * - Maps common English preset values to German labels; keeps existing German `school:de` / free-text as-is when sensible.
 *
 * @see analysis/out/05-osm-school-schoolde.md (generated report)
 */

/** `school=*` values that are not an institutional school type for this project (OSM DE / Schul-Abgleich). */
export const OSM_SCHOOL_VALUE_EXCLUDE = new Set(
  [
    'entrance',
    'yes',
    'only',
    'dog',
    'shed',
    /** Schulgarten / Lernort — not a Schulform */
    'educational_garden',
    /** Hobby / Gewerbe / Einrichtung — not a deutsche Schulform (tagging noise on amenity=school) */
    'animal_training',
    'aviation',
    'barista',
    'bible',
    'coaching',
    'computer',
    'cooking',
    'farm',
    'hunting',
    'political',
    'recreational_diving',
    'sailing',
  ].map((s) => s.toLowerCase()),
)

/**
 * English (and wiki) `school=*` tokens → German Schulform label (single segment).
 * Keys are lowercased ASCII; values are UI-facing German strings.
 */
export const OSM_SCHOOL_EN_TO_DE: Record<string, string> = {
  primary: 'Grundschule',
  elementary: 'Grundschule',
  primary_school: 'Grundschule',
  secondary: 'Weiterführende Schule',
  secondary_school: 'Weiterführende Schule',
  middle_school: 'Mittelschule',
  high_school: 'Weiterführende Schule',
  grammar_school: 'Gymnasium',
  gymnasium: 'Gymnasium',
  comprehensive: 'Gesamtschule',
  sixth_form_college: 'Gymnasium (Oberstufe)',
  special_education_needs: 'Förderschule',
  special_needs: 'Förderschule',
  special_school: 'Förderschule',
  'special school': 'Förderschule',
  blind: 'Förderschule (Sehen)',
  deaf: 'Förderschule (Hören)',
  kindergarten: 'Kindergarten',
  preschool: 'Kindergarten',
  nursery: 'Kindergarten',
  childcare: 'Kindertagesstätte',
  music_school: 'Musikschule',
  music: 'Musikschule',
  language: 'Sprachschule',
  art: 'Kunstschule',
  sport: 'Sportschule',
  social: 'Schule für Erziehungshilfe',
  vocational: 'Berufsbildende Schule',
  vocational_school: 'Berufsschule',
  professional_education: 'Berufsbildende Schule',
  technical: 'Berufsbildende Schule',
  trade_school: 'Berufsschule',
  adult_education: 'Volkshochschule',
  college: 'Berufskolleg',
  /** Rare bare tag; often shorthand for special-education tagging */
  special: 'Förderschule',
  university: 'Universität',
  driving_school: 'Fahrschule',
  traffic_park: 'Verkehrsgarten',
  preparatory: 'Vorschule',
  boarding_school: 'Internatsschule',
  religious: 'Konfessionsschule',
  circus_school: 'Zirkusschule',
  sailing_school: 'Segelschule',
  ski_school: 'Skischule',
  surfing_school: 'Surfschule',
  swim_school: 'Schwimmschule',
  dance: 'Tanzschule',
  horse_riding: 'Reitschule',
}

export type OsmSchoolKindSource =
  | 'school:de'
  | 'mapped'
  | 'passthrough'
  | 'excluded'
  | 'none'
  | 'unmapped'

export type OsmSchoolKindResult = {
  /** Raw `school=*` or null */
  rawSchool: string | null
  /** Raw `school:de=*` or null */
  rawSchoolDe: string | null
  /** Best-effort German label for facets; null if excluded / empty / unmapped English snake_case */
  canonicalDe: string | null
  source: OsmSchoolKindSource
}

function trimOrNull(v: unknown): string | null {
  if (v == null) return null
  const s = String(v).trim()
  return s === '' ? null : s
}

/** Split composite `school` values (`;`, `,`, `/`). */
export function splitOsmSchoolRaw(raw: string): string[] {
  return raw
    .split(/[;/|]+|,\s*/g)
    .map((p) => p.trim())
    .filter(Boolean)
}

function segmentExcluded(seg: string): boolean {
  const sl = seg.trim().toLowerCase()
  return sl !== '' && OSM_SCHOOL_VALUE_EXCLUDE.has(sl)
}

/** Map one segment of `school=*` to German, or null if excluded / unknown English token. */
export function mapSchoolSegmentToDe(seg: string): {
  de: string | null
  excluded: boolean
  unmapped: boolean
  /** True when `OSM_SCHOOL_EN_TO_DE` was applied (not German passthrough). */
  usedEnglishMap: boolean
} {
  const s = seg.trim()
  if (!s) return { de: null, excluded: false, unmapped: false, usedEnglishMap: false }
  if (segmentExcluded(s))
    return { de: null, excluded: true, unmapped: false, usedEnglishMap: false }

  const sl = s.toLowerCase()
  const mapped = OSM_SCHOOL_EN_TO_DE[sl]
  if (mapped) {
    /** German Schulform written with initial capital — do not treat as English `gymnasium` etc. */
    const looksLikeGermanCapitalizedNoun = /^[A-ZÄÖÜ][a-zäöüß]+/.test(s)
    if (looksLikeGermanCapitalizedNoun && s !== sl) {
      return { de: s, excluded: false, unmapped: false, usedEnglishMap: false }
    }
    return { de: mapped, excluded: false, unmapped: false, usedEnglishMap: true }
  }

  // snake_case English left → unmapped (needs manual map / review)
  if (/^[a-z]+(_[a-z0-9]+)+$/i.test(s)) {
    return { de: null, excluded: false, unmapped: true, usedEnglishMap: false }
  }

  // Free text (often German, mixed labels, or DE Schulform strings)
  return { de: s, excluded: false, unmapped: false, usedEnglishMap: false }
}

function joinDeParts(parts: string[]): string {
  return parts.join('; ')
}

/**
 * Derive canonical German school kind from `school` + `school:de` tags on one OSM feature.
 *
 * Priority: if `school:de` is set, use it (after dropping excluded-only composites); else map `school=*` segments.
 */
export function canonicalSchoolKindDe(input: {
  school?: string | null
  schoolDe?: string | null
}): OsmSchoolKindResult {
  const rawSchool = trimOrNull(input.school)
  const rawSchoolDe = trimOrNull(input.schoolDe)

  if (!rawSchool && !rawSchoolDe) {
    return { rawSchool: null, rawSchoolDe: null, canonicalDe: null, source: 'none' }
  }

  if (rawSchoolDe) {
    const deSegs = splitOsmSchoolRaw(rawSchoolDe)
    const kept = deSegs.filter((s) => !segmentExcluded(s))
    if (kept.length === 0) {
      return { rawSchool, rawSchoolDe, canonicalDe: null, source: 'excluded' }
    }
    return {
      rawSchool,
      rawSchoolDe,
      canonicalDe: joinDeParts(kept),
      source: 'school:de',
    }
  }

  if (!rawSchool) {
    return { rawSchool: null, rawSchoolDe: null, canonicalDe: null, source: 'none' }
  }

  const segs = splitOsmSchoolRaw(rawSchool)
  const mappedParts: string[] = []
  let anyExcluded = false
  let anyUnmapped = false
  let anyEnMap = false
  for (const seg of segs) {
    const r = mapSchoolSegmentToDe(seg)
    if (r.excluded) {
      anyExcluded = true
      continue
    }
    if (r.unmapped) {
      anyUnmapped = true
      continue
    }
    if (r.de) {
      if (r.usedEnglishMap) anyEnMap = true
      mappedParts.push(r.de)
    }
  }

  if (mappedParts.length === 0) {
    const source: OsmSchoolKindSource = anyUnmapped ? 'unmapped' : anyExcluded ? 'excluded' : 'none'
    return { rawSchool, rawSchoolDe: null, canonicalDe: null, source }
  }

  const source: OsmSchoolKindSource = anyEnMap ? 'mapped' : 'passthrough'
  return {
    rawSchool,
    rawSchoolDe: null,
    canonicalDe: joinDeParts(mappedParts),
    source: anyUnmapped ? 'mapped' : source,
  }
}
