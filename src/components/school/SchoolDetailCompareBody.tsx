import { de } from '../../i18n/de'
import { JEDESCHULE_DUPLICATE_GROUP_SIZE_KEY } from '../../lib/jedeschuleDuplicateGroup'
import { comparePropertySections, normalizeAddressCompareString } from '../../lib/propertyCompare'
import type { ReactNode } from 'react'

function websiteHref(raw: string): string | null {
  const t = raw.trim()
  if (!t) return null
  if (/^https?:\/\//i.test(t)) return t
  if (t.startsWith('//')) return `https:${t}`
  return `https://${t}`
}

function renderTagValueForKey(key: string, value: string): ReactNode {
  if (key !== 'website') return value
  const href = websiteHref(value)
  if (!href) return value
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="break-all text-sky-400 underline underline-offset-2 hover:text-sky-300"
    >
      {value}
    </a>
  )
}

function officialPropsForCompare(
  official: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null | undefined {
  if (!official) return official
  const { [JEDESCHULE_DUPLICATE_GROUP_SIZE_KEY]: _dup, ...rest } = official
  return rest
}

export function SchoolDetailCompareBody({
  official,
  osm,
  officialIdForHeader,
  osmTypeForHeader,
  osmIdForHeader,
}: {
  official: Record<string, unknown> | null | undefined
  osm: Record<string, string> | null | undefined
  officialIdForHeader: string | null
  osmTypeForHeader: 'way' | 'relation' | 'node' | null
  osmIdForHeader: string | null
}) {
  const { both, onlyO, onlyS, compareGroups } = comparePropertySections(
    officialPropsForCompare(official),
    osm,
  )
  const bothRows = [...both]
    .filter(([k]) => k !== 'id')
    .sort(([a], [b]) => {
      const aName = a === 'name'
      const bName = b === 'name'
      if (aName && !bName) return -1
      if (!aName && bName) return 1
      return a.localeCompare(b, 'de')
    })
  const nameRows = bothRows.filter(([k]) => k === 'name')
  const nonNameBothRows = bothRows.filter(([k]) => k !== 'name')
  const osmRefLabel =
    osmTypeForHeader && osmIdForHeader ? `${osmTypeForHeader}/${osmIdForHeader}` : null
  const hasCommonRows = bothRows.length > 0 || compareGroups.length > 0

  return (
    <article aria-labelledby="school-detail-compare-both-heading">
      <section aria-labelledby="school-detail-compare-both-heading">
        <h2 id="school-detail-compare-both-heading" className="mb-3 font-semibold text-zinc-100">
          {de.detail.keysBoth}
        </h2>
        <div className="overflow-hidden rounded-lg border border-zinc-700">
          <header>
            <div className="border-b border-zinc-700 bg-zinc-900/50 px-2.5 py-1.5 text-xs md:hidden">
              <p className="leading-snug font-semibold tracking-wide">
                <span className="text-amber-200">
                  {de.detail.official}
                  {officialIdForHeader ? (
                    <>
                      {' \u00B7 '}
                      <span className="font-mono font-normal">{officialIdForHeader}</span>
                    </>
                  ) : null}
                </span>
                {officialIdForHeader && osmRefLabel ? (
                  <span aria-hidden className="text-zinc-400">
                    {' '}
                    {'\u00B7'}{' '}
                  </span>
                ) : null}
                <span className="text-blue-300">
                  {de.detail.osm}
                  {osmRefLabel ? (
                    <>
                      {' \u00B7 '}
                      <span className="font-mono font-normal">{osmRefLabel}</span>
                    </>
                  ) : null}
                </span>
              </p>
            </div>
            <div className="hidden grid-cols-2 gap-0 border-b border-zinc-700 bg-zinc-900/50 md:grid">
              <div className="border-r border-zinc-700 bg-amber-950/35 px-3 py-2 text-xs font-semibold tracking-wide text-amber-200">
                {de.detail.official}
                {officialIdForHeader ? (
                  <>
                    {' \u00B7 '}
                    <span className="font-mono font-normal">{officialIdForHeader}</span>
                  </>
                ) : null}
              </div>
              <div className="bg-blue-950/35 px-3 py-2 text-xs font-semibold tracking-wide text-blue-300">
                {de.detail.osm}
                {osmRefLabel ? (
                  <>
                    {' \u00B7 '}
                    <span className="font-mono font-normal">{osmRefLabel}</span>
                  </>
                ) : null}
              </div>
            </div>
          </header>
          {!hasCommonRows ? (
            <p className="p-2 text-sm text-zinc-400 sm:p-3">—</p>
          ) : (
            <div className="divide-y divide-zinc-800">
              {nameRows.map(([k, o, s]) => (
                <div key={k} className="grid gap-3 p-2 md:grid-cols-2 md:gap-0 md:p-0">
                  <dl className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2 md:border-r md:border-zinc-800 md:bg-amber-950/15 md:p-3">
                    <dt className="shrink-0 font-mono text-xs leading-normal text-amber-200">
                      {k}
                    </dt>
                    <dd className="min-w-0 text-sm leading-normal text-zinc-200">
                      {renderTagValueForKey(k, o)}
                    </dd>
                  </dl>
                  <dl className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2 md:bg-blue-950/15 md:p-3">
                    <dt className="shrink-0 font-mono text-xs leading-normal text-blue-300">{k}</dt>
                    <dd className="min-w-0 text-sm leading-normal text-zinc-200">
                      {renderTagValueForKey(k, s)}
                    </dd>
                  </dl>
                </div>
              ))}
              {compareGroups.map((group) => {
                if (group.kind !== 'address') return null
                const normalizedOfficial = group.officialValue
                  ? normalizeAddressCompareString(group.officialValue)
                  : null
                const isMatch =
                  normalizedOfficial != null && group.compareTargets.includes(normalizedOfficial)
                const rowTone = isMatch
                  ? 'ring-1 ring-emerald-500/30'
                  : normalizedOfficial != null && group.compareTargets.length > 0
                    ? 'ring-1 ring-amber-500/30'
                    : ''
                return (
                  <div
                    key={`${group.kind}-${group.officialKey}`}
                    className={`grid gap-3 p-2 md:grid-cols-2 md:gap-0 md:p-0 ${rowTone}`}
                  >
                    <dl className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2 md:border-r md:border-zinc-800 md:bg-amber-950/15 md:p-3">
                      <dt className="shrink-0 font-mono text-xs leading-normal text-amber-200">
                        {group.officialKey}
                      </dt>
                      <dd className="min-w-0 text-sm leading-normal text-zinc-200">
                        {group.officialValue ?? '—'}
                      </dd>
                    </dl>
                    <div className="space-y-1 md:bg-blue-950/15 md:p-3">
                      {group.osmKeys.map((k) => (
                        <dl
                          key={`${group.kind}-${k}`}
                          className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2"
                        >
                          <dt className="shrink-0 font-mono text-xs leading-normal text-blue-300">
                            {k}
                          </dt>
                          <dd className="min-w-0 text-sm leading-normal text-zinc-200">
                            {group.osmValues[k] ?? '—'}
                          </dd>
                        </dl>
                      ))}
                    </div>
                  </div>
                )
              })}
              {nonNameBothRows.map(([k, o, s]) => (
                <div key={k} className="grid gap-3 p-2 md:grid-cols-2 md:gap-0 md:p-0">
                  <dl className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2 md:border-r md:border-zinc-800 md:bg-amber-950/15 md:p-3">
                    <dt className="shrink-0 font-mono text-xs leading-normal text-amber-200">
                      {k}
                    </dt>
                    <dd className="min-w-0 text-sm leading-normal text-zinc-200">
                      {renderTagValueForKey(k, o)}
                    </dd>
                  </dl>
                  <dl className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2 md:bg-blue-950/15 md:p-3">
                    <dt className="shrink-0 font-mono text-xs leading-normal text-blue-300">{k}</dt>
                    <dd className="min-w-0 text-sm leading-normal text-zinc-200">
                      {renderTagValueForKey(k, s)}
                    </dd>
                  </dl>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <nav aria-label={de.detail.compareExclusiveSectionsNavAria} className="sr-only">
        <ul>
          <li>
            <a href="#school-detail-compare-official-only-heading">{de.detail.officialOnly}</a>
          </li>
          <li>
            <a href="#school-detail-compare-osm-only-heading">{de.detail.osmOnly}</a>
          </li>
        </ul>
      </nav>

      <section className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
        <section aria-labelledby="school-detail-compare-official-only-heading">
          <h2
            id="school-detail-compare-official-only-heading"
            className="mb-3 font-semibold text-zinc-100"
          >
            {de.detail.officialOnly}
          </h2>
          <dl className="text-sm">
            {onlyO.map(([k, v]) => (
              <div
                key={k}
                className="flex items-center gap-2 border-b border-zinc-800 py-1.5 sm:py-2"
              >
                <dt className="shrink-0 font-mono text-xs leading-normal text-amber-200">{k}</dt>
                <dd className="min-w-0 text-sm leading-normal text-zinc-200">
                  {renderTagValueForKey(k, v)}
                </dd>
              </div>
            ))}
            {onlyO.length === 0 && <p className="text-zinc-400">—</p>}
          </dl>
        </section>
        <section aria-labelledby="school-detail-compare-osm-only-heading">
          <h2
            id="school-detail-compare-osm-only-heading"
            className="mb-3 font-semibold text-zinc-100"
          >
            {de.detail.osmOnly}
          </h2>
          <dl className="text-sm">
            {onlyS.map(([k, v]) => (
              <div
                key={k}
                className="flex items-center gap-2 border-b border-zinc-800 py-1.5 sm:py-2"
              >
                <dt className="shrink-0 font-mono text-xs leading-normal text-blue-300">{k}</dt>
                <dd className="min-w-0 text-sm leading-normal text-zinc-200">
                  {renderTagValueForKey(k, v)}
                </dd>
              </div>
            ))}
            {onlyS.length === 0 && <p className="text-zinc-400">—</p>}
          </dl>
        </section>
      </section>
    </article>
  )
}
