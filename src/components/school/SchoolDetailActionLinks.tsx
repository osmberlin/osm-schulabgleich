import { de } from '../../i18n/de'
import { useSchoolDetailRoute } from '../../lib/useSchoolDetailRoute'
import {
  getSchuleDetailLicenceInfo,
  SchuleDetailLicenceCompatibleInline as SchoolDetailLicenceCompatibleInline,
} from '../schule/SchuleDetailLicence'

const EDIT_LINK_CLASS_NAME =
  'inline-flex items-center rounded-md bg-brand-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-900'

type ExternalLink = string | null

export function SchoolDetailActionLinks({
  idUrl,
  josmUrl,
  jedeschuleItemUrl,
  osmBrowseUrl,
}: {
  idUrl: ExternalLink
  josmUrl: ExternalLink
  jedeschuleItemUrl: ExternalLink
  osmBrowseUrl: ExternalLink
}) {
  const { code } = useSchoolDetailRoute()
  const { osmLicenceCompatible, licenceHash } = getSchuleDetailLicenceInfo(code)

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {idUrl && (
        <a href={idUrl} target="_blank" rel="noreferrer" className={EDIT_LINK_CLASS_NAME}>
          {de.detail.editId}
        </a>
      )}
      {josmUrl && (
        <a href={josmUrl} target="_blank" rel="noreferrer" className={EDIT_LINK_CLASS_NAME}>
          {de.detail.editJosm}
        </a>
      )}
      {(jedeschuleItemUrl || osmBrowseUrl || osmLicenceCompatible) && (
        <span className="inline-flex flex-wrap items-center gap-x-1.5 text-sm text-emerald-300">
          {jedeschuleItemUrl && (
            <a href={jedeschuleItemUrl} target="_blank" rel="noreferrer" className="underline">
              {de.detail.jedeschuleApi}
            </a>
          )}
          {jedeschuleItemUrl && osmBrowseUrl && <span aria-hidden>{'\u00B7'}</span>}
          {osmBrowseUrl && (
            <a href={osmBrowseUrl} target="_blank" rel="noreferrer" className="underline">
              {de.detail.openOsmBrowse}
            </a>
          )}
          <SchoolDetailLicenceCompatibleInline
            osmLicenceCompatible={osmLicenceCompatible}
            showLeadingSeparator={!!(osmLicenceCompatible && (jedeschuleItemUrl || osmBrowseUrl))}
            licenceHash={licenceHash}
          />
        </span>
      )}
    </div>
  )
}
