import { de, formatOsmTagChangeConfirm } from '../../i18n/de'
import { isOfficialGrundschule, tagValueEqualsProposed } from '../../lib/officialGrundschule'
import type { SchoolsMatchRow } from '../../lib/schemas'
import type { OsmElementType } from '../../stores/osmAppStore'
import {
  useOsmAppActions,
  usePendingEditForOsmObject,
  type PendingOsmEdit,
} from '../../stores/osmAppStore'
import { OsmTagSnippet } from '../OsmTagSnippet'

const TAG_SCHOOL = 'school'
const TAG_ISCED = 'isced:level'
const VAL_SCHOOL = 'primary'
const VAL_ISCED = '1'

const BTN_ACTIVE =
  'flex w-full flex-wrap items-center gap-x-1.5 gap-y-1 rounded-md border border-zinc-600 bg-zinc-900/40 px-3 py-2 text-left text-sm text-zinc-100 hover:bg-zinc-800/60 sm:w-auto'

/** Compact, clearly inactive (already on OSM or already in upload queue). */
const BTN_INACTIVE =
  'flex w-fit max-w-full shrink-0 flex-wrap items-center gap-1 rounded-md border border-zinc-700/60 bg-zinc-950/70 px-2 py-1 text-left text-xs text-zinc-400'

function tryStageTag(
  osmType: OsmElementType,
  osmId: string,
  lon: number,
  lat: number,
  officialId: string | null | undefined,
  key: string,
  proposed: string,
  osmTags: Record<string, string> | null | undefined,
  addPendingTags: (p: Omit<PendingOsmEdit, 'tags'> & { tags: Record<string, string> }) => void,
) {
  const cur = osmTags?.[key]
  if (tagValueEqualsProposed(cur, proposed)) return
  if (cur != null && cur !== '' && !tagValueEqualsProposed(cur, proposed)) {
    if (!window.confirm(formatOsmTagChangeConfirm(key, cur, proposed))) return
  }
  addPendingTags({
    osmType,
    osmId,
    lon,
    lat,
    ...(officialId ? { officialId } : {}),
    tags: { [key]: proposed },
  })
}

type Props = {
  row: SchoolsMatchRow
  lon: number | null
  lat: number | null
}

export function PrimarySchoolOsmSuggest({ row, lon, lat }: Props) {
  const { addPendingTags } = useOsmAppActions()
  const pendingForObject = usePendingEditForOsmObject(row.osmType, row.osmId)

  if (lon == null || lat == null) return null
  if (!row.osmType || !row.osmId) return null
  if (
    !isOfficialGrundschule({
      officialName: row.officialName,
      officialProperties: row.officialProperties ?? null,
    })
  ) {
    return null
  }

  const t = row.osmType
  const id = row.osmId
  const tags = row.osmTags
  const officialId = row.officialId ?? undefined

  const schoolOnOsm = tagValueEqualsProposed(tags?.[TAG_SCHOOL], VAL_SCHOOL)
  const iscedOnOsm = tagValueEqualsProposed(tags?.[TAG_ISCED], VAL_ISCED)
  const schoolStaged = tagValueEqualsProposed(pendingForObject?.tags[TAG_SCHOOL], VAL_SCHOOL)
  const iscedStaged = tagValueEqualsProposed(pendingForObject?.tags[TAG_ISCED], VAL_ISCED)
  const schoolInactive = schoolOnOsm || schoolStaged
  const iscedInactive = iscedOnOsm || iscedStaged

  return (
    <section
      className="mb-6 rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-4"
      aria-labelledby="primary-school-osm-suggest-title"
    >
      <h2
        id="primary-school-osm-suggest-title"
        className="text-base font-semibold text-emerald-100"
      >
        {de.osm.grundschuleSectionTitle}
      </h2>
      <p className="mt-2 text-sm text-zinc-300">{de.osm.grundschuleSectionLead}</p>
      <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <li>
          <button
            type="button"
            disabled={schoolInactive}
            onClick={() =>
              tryStageTag(t, id, lon, lat, officialId, TAG_SCHOOL, VAL_SCHOOL, tags, addPendingTags)
            }
            className={
              schoolInactive
                ? `${BTN_INACTIVE} cursor-not-allowed`
                : `${BTN_ACTIVE} disabled:cursor-not-allowed`
            }
          >
            <OsmTagSnippet>
              {TAG_SCHOOL}={VAL_SCHOOL}
            </OsmTagSnippet>
            {schoolOnOsm ? (
              <span className="text-zinc-500">{de.osm.tagAlreadySet}</span>
            ) : schoolStaged ? (
              <span className="text-zinc-500">{de.osm.tagStaged}</span>
            ) : (
              <span>{de.osm.proposeOsmTagVerb}</span>
            )}
          </button>
        </li>
        <li>
          <button
            type="button"
            disabled={iscedInactive}
            onClick={() =>
              tryStageTag(t, id, lon, lat, officialId, TAG_ISCED, VAL_ISCED, tags, addPendingTags)
            }
            className={
              iscedInactive
                ? `${BTN_INACTIVE} cursor-not-allowed`
                : `${BTN_ACTIVE} disabled:cursor-not-allowed`
            }
          >
            <OsmTagSnippet>
              {TAG_ISCED}={VAL_ISCED}
            </OsmTagSnippet>
            {iscedOnOsm ? (
              <span className="text-zinc-500">{de.osm.tagAlreadySet}</span>
            ) : iscedStaged ? (
              <span className="text-zinc-500">{de.osm.tagStaged}</span>
            ) : (
              <span>{de.osm.proposeOsmTagVerb}</span>
            )}
          </button>
        </li>
      </ul>
    </section>
  )
}
