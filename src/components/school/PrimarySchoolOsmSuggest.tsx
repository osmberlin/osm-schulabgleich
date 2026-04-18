import { de } from '../../i18n/de'
import { isOfficialGrundschule } from '../../lib/officialGrundschule'
import type { SchoolsMatchRow } from '../../lib/schemas'
import { SchoolOsmSuggestSection } from './SchoolOsmSuggestSection'

const TAG_SCHOOL = 'school'
const TAG_ISCED = 'isced:level'
const VAL_SCHOOL = 'primary'
const VAL_ISCED = '1'

const PRIMARY_SUGGEST_TAGS = [
  { key: TAG_SCHOOL, value: VAL_SCHOOL },
  { key: TAG_ISCED, value: VAL_ISCED },
] as const

type Props = {
  row: SchoolsMatchRow
  lon: number | null
  lat: number | null
}

export function PrimarySchoolOsmSuggest({ row, lon, lat }: Props) {
  if (
    !isOfficialGrundschule({
      officialName: row.officialName,
      officialProperties: row.officialProperties ?? null,
    })
  ) {
    return null
  }

  return (
    <SchoolOsmSuggestSection
      row={row}
      lon={lon}
      lat={lat}
      sectionHeadingId="primary-school-osm-suggest-title"
      sectionTitle={de.osm.grundschuleSectionTitle}
      sectionLead={de.osm.grundschuleSectionLead}
      suggestTags={PRIMARY_SUGGEST_TAGS}
    />
  )
}
