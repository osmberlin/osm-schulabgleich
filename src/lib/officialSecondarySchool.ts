function norm(s: string): string {
  return s.trim().toLowerCase()
}

export type SecondarySchoolKind = 'gymnasium' | 'gesamtschule' | 'hauptReal'

/**
 * Resolves secondary-school kind from Jedeschule `school_type`.
 * Priority: gesamtschule > gymnasium > haupt/realschule.
 */
export function resolveSecondarySchoolKindFromSchoolType(
  s: string | null | undefined,
): SecondarySchoolKind | null {
  if (typeof s !== 'string' || !s.trim()) return null
  const v = norm(s)
  if (v.includes('gesamtschule')) return 'gesamtschule'
  if (v.includes('gymnasium') || v.includes('gymnasien')) return 'gymnasium'
  if (v.includes('hauptschule') || v.includes('realschule')) return 'hauptReal'
  return null
}

/** True if official Jedeschule data indicates one of the supported secondary school kinds. */
export function isOfficialSecondarySchoolKind(input: {
  officialName: string | null
  officialProperties: Record<string, unknown> | null | undefined
}): boolean {
  const name = input.officialName?.trim() ?? ''
  if (resolveSecondarySchoolKindFromSchoolType(name)) return true

  const st = input.officialProperties?.school_type
  return resolveSecondarySchoolKindFromSchoolType(typeof st === 'string' ? st : null) != null
}
