import type { ReactNode } from 'react'

/** Inline OSM key=value (or id) — matches `<code>` styling in SchuleDetail compare sections. */
export function OsmTagSnippet({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-200">
      {children}
    </code>
  )
}
