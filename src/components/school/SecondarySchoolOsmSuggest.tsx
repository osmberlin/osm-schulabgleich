import { de } from '../../i18n/de'
import {
  resolveSecondarySchoolKindFromSchoolType,
  type SecondarySchoolKind,
} from '../../lib/officialSecondarySchool'
import type { SchoolsMatchRow } from '../../lib/schemas'
import { SchoolOsmSuggestSection, type OsmSuggestTagSpec } from './SchoolOsmSuggestSection'

const TAG_SCHOOL = 'school'
const TAG_ISCED = 'isced:level'

const SUGGEST_TAGS_BY_KIND: Record<SecondarySchoolKind, readonly OsmSuggestTagSpec[]> = {
  gymnasium: [
    { key: TAG_SCHOOL, value: 'secondary' },
    { key: TAG_ISCED, value: '2;3' },
  ],
  gesamtschule: [
    { key: TAG_SCHOOL, value: 'secondary' },
    { key: TAG_ISCED, value: '2;3' },
    { key: TAG_ISCED, value: '2' },
  ],
  hauptReal: [
    { key: TAG_SCHOOL, value: 'secondary' },
    { key: TAG_ISCED, value: '2' },
  ],
}

type VariantSuggestConfig = {
  title: string
  lead: string
  suggestTags: readonly OsmSuggestTagSpec[]
}

const CONFIG_BY_KIND: Record<SecondarySchoolKind, VariantSuggestConfig> = {
  gymnasium: {
    title: de.osm.gymnasiumSectionTitle,
    lead: de.osm.gymnasiumSectionLead,
    suggestTags: SUGGEST_TAGS_BY_KIND.gymnasium,
  },
  gesamtschule: {
    title: de.osm.gesamtschuleSectionTitle,
    lead: de.osm.gesamtschuleSectionLead,
    suggestTags: SUGGEST_TAGS_BY_KIND.gesamtschule,
  },
  hauptReal: {
    title: de.osm.hauptRealSectionTitle,
    lead: de.osm.hauptRealSectionLead,
    suggestTags: SUGGEST_TAGS_BY_KIND.hauptReal,
  },
}

function resolveSecondaryKind(row: SchoolsMatchRow): SecondarySchoolKind | null {
  const schoolTypeRaw = row.officialProperties?.school_type
  const schoolType =
    typeof schoolTypeRaw === 'string'
      ? schoolTypeRaw
      : Array.isArray(schoolTypeRaw)
        ? schoolTypeRaw.join('; ')
        : null
  return (
    resolveSecondarySchoolKindFromSchoolType(schoolType) ??
    resolveSecondarySchoolKindFromSchoolType(row.officialName)
  )
}

type Props = {
  row: SchoolsMatchRow
  lon: number | null
  lat: number | null
}

export function SecondarySchoolOsmSuggest({ row, lon, lat }: Props) {
  const kind = resolveSecondaryKind(row)
  if (kind == null) return null
  const config = CONFIG_BY_KIND[kind]

  return (
    <SchoolOsmSuggestSection
      row={row}
      lon={lon}
      lat={lat}
      sectionHeadingId="secondary-school-osm-suggest-title"
      sectionTitle={config.title}
      sectionLead={config.lead}
      suggestTags={config.suggestTags}
    />
  )
}
