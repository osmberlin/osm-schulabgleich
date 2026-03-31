import { HeartIcon } from '@heroicons/react/20/solid'
import { de } from '../i18n/de'

const linkClass =
  'text-emerald-800 underline decoration-zinc-300 underline-offset-2 hover:decoration-emerald-700 dark:text-emerald-300 dark:decoration-zinc-600 dark:hover:decoration-emerald-400'

export function AppFooter() {
  const f = de.footer
  const jedeschule = de.home.links.jedeschule

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50/80 py-8 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
      <div className="mx-auto max-w-5xl space-y-5 px-4">
        <p className="flex gap-2">
          <HeartIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-inherit" />
          <span>
            {f.geoDataLine}
            <a href={f.osmLinkHref} className={linkClass} target="_blank" rel="noreferrer">
              {f.osmLinkLabel}
            </a>
            {f.geoDataBetween}
            <a href={jedeschule.href} className={linkClass} target="_blank" rel="noreferrer">
              {jedeschule.label}
            </a>
            .
          </span>
        </p>

        <p className="flex gap-2">
          <HeartIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-inherit" />
          <span>
            {f.openSourceComponentsLine}
            {f.openSourceThanks.map((item, i) => (
              <span key={item.href}>
                {i > 0 ? ', ' : null}
                <a href={item.href} className={linkClass} target="_blank" rel="noreferrer">
                  {item.name}
                </a>
              </span>
            ))}
            .
          </span>
        </p>

        <p>
          <a href={f.githubHref} className={linkClass} target="_blank" rel="noreferrer">
            {f.githubLabel}
          </a>
        </p>
      </div>
    </footer>
  )
}
