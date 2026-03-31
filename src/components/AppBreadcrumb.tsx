import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'
import { Link } from '@tanstack/react-router'
import { de } from '../i18n/de'

export type AppBreadcrumbCrumb = { name: string; to: string } | { name: string; current: true }

type Props = {
  /** When true, home is the current page (not a link). */
  homeCurrent: boolean
  /** Segments after home; last entry must be `{ current: true }`. */
  items: AppBreadcrumbCrumb[]
}

export function AppBreadcrumb({ homeCurrent, items }: Props) {
  return (
    <nav aria-label={de.breadcrumb.navLabel} className="flex min-w-0 flex-1">
      <ol className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <li className="shrink-0">
          <div>
            {homeCurrent ? (
              <span className="text-zinc-400 dark:text-zinc-500" aria-current="page">
                <HomeIcon aria-hidden className="size-5 shrink-0" />
                <span className="sr-only">{de.breadcrumb.home}</span>
              </span>
            ) : (
              <Link
                to="/"
                className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
              >
                <HomeIcon aria-hidden className="size-5 shrink-0" />
                <span className="sr-only">{de.breadcrumb.home}</span>
              </Link>
            )}
          </div>
        </li>
        {items.map((page, index) => {
          const key = `${index}-${page.name}`
          if ('current' in page && page.current) {
            return (
              <li key={key} className="min-w-0">
                <div className="flex min-w-0 items-center">
                  <ChevronRightIcon
                    aria-hidden
                    className="size-5 shrink-0 text-zinc-400 dark:text-zinc-500"
                  />
                  <span
                    aria-current="page"
                    className="ml-4 truncate text-sm font-medium text-zinc-600 dark:text-zinc-400"
                  >
                    {page.name}
                  </span>
                </div>
              </li>
            )
          }
          const link = page as { name: string; to: string }
          return (
            <li key={key} className="min-w-0">
              <div className="flex min-w-0 items-center">
                <ChevronRightIcon
                  aria-hidden
                  className="size-5 shrink-0 text-zinc-400 dark:text-zinc-500"
                />
                <Link
                  to={link.to}
                  className="ml-4 truncate text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  {link.name}
                </Link>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
