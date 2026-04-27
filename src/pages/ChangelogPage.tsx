import { de } from '../i18n/de'
import { githubCommitUrlOnDefaultBranch } from '../lib/githubRepo'
import { changelogQueryOptions } from '../lib/sharedDatasetQueries'
import { useQuery } from '@tanstack/react-query'

export function ChangelogPage() {
  const q = useQuery({
    ...changelogQueryOptions(),
    retry: 1,
  })
  const rows =
    q.data?.months.flatMap((monthBlock) =>
      monthBlock.entries.map((entry, index) => ({
        month: monthBlock.month,
        showMonth: index === 0,
        entry,
      })),
    ) ?? []

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-16">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-100">
          {de.changelog.heading}
        </h1>
      </header>

      {q.isLoading && <p className="text-zinc-400">{de.changelog.loading}</p>}
      {q.isError && <p className="text-amber-200">{de.changelog.error}</p>}
      {q.isSuccess && rows.length === 0 && <p className="text-zinc-400">{de.changelog.empty}</p>}

      {q.isSuccess && rows.length > 0 && (
        <div className="mt-4 border-t border-zinc-800">
          <dl className="divide-y divide-zinc-800">
            {rows.map(({ month, showMonth, entry }) => (
              <div
                key={`${month}-${entry.refs.join(',')}`}
                className="py-6 sm:grid sm:grid-cols-3 sm:gap-4"
              >
                <dt className="text-sm/6 font-medium text-zinc-100">
                  {showMonth ? month : <span className="sr-only">{month}</span>}
                </dt>
                <dd className="mt-1 text-sm/6 text-zinc-300 sm:col-span-2 sm:mt-0">
                  <div className="space-y-2 text-sm text-zinc-200">
                    {entry.descriptionMd
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line, index) => (
                        <p key={`${entry.refs.join(',')}-${index}`}>{line}</p>
                      ))}
                  </div>
                  <p className="mt-1 text-xs text-emerald-300">
                    {entry.refsDisplay.map((ref, index) => (
                      <span key={`${entry.refs.join(',')}-${ref}`}>
                        {index > 0 ? ', ' : null}
                        <a
                          href={githubCommitUrlOnDefaultBranch(entry.refs[index])}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-emerald-400/40 underline-offset-2 hover:decoration-emerald-300"
                        >
                          {`\`${ref}\``}
                        </a>
                      </span>
                    ))}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}
