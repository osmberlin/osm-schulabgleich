import type { PendingOsmEdit } from '../stores/osmAppStore'
import { jedeschuleSchoolJsonUrl } from './jedeschuleUrls'
import { OSM_APP_EDITOR } from './osmOAuthConfig'

export { OSM_APP_EDITOR }

/** Sent as `comment` when uploading from the review page (`uploadChangeset`). */
export const OSM_UPLOAD_CHANGESET_COMMENT =
  'Details zu Schulen ergänzt anhand amtlicher Daten. #schulabgleich'

/** Unique `jedeschule.codefor.de/schools/…` JSON URLs (per pending object with `officialId`). */
export function collectOsmUploadSourceUrls(pending: PendingOsmEdit[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  const push = (url: string) => {
    if (seen.has(url)) return
    seen.add(url)
    out.push(url)
  }
  for (const p of pending) {
    if (p.officialId) push(jedeschuleSchoolJsonUrl(p.officialId))
  }
  return out
}

/** Multiple sources as `source:1`, `source:2`, … (OSM changeset tags). */
export function numberedSourceTags(urls: string[]): Record<string, string> {
  const tags: Record<string, string> = {}
  urls.forEach((url, i) => {
    tags[`source:${i + 1}`] = url
  })
  return tags
}

/** Tags passed to `uploadChangeset` (editor, comment, numbered sources). */
export function buildOsmUploadChangesetTags(pending: PendingOsmEdit[]): Record<string, string> {
  return {
    created_by: OSM_APP_EDITOR,
    comment: OSM_UPLOAD_CHANGESET_COMMENT,
    ...numberedSourceTags(collectOsmUploadSourceUrls(pending)),
  }
}
