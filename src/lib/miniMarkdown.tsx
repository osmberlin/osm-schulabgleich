import type { ReactNode } from 'react'
import { Fragment } from 'react'

export type MiniSegment =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string }
  | { type: 'bold'; value: string }

/** Same styling as inline OSM tag hints in SchuleDetail match explanation. */
const inlineCodeClassName = 'rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-200'

function mergeAdjacentText(segments: MiniSegment[]): MiniSegment[] {
  const merged: MiniSegment[] = []
  for (const s of segments) {
    const last = merged[merged.length - 1]
    if (s.type === 'text' && last?.type === 'text') last.value += s.value
    else merged.push(s)
  }
  return merged
}

function splitBold(text: string): MiniSegment[] {
  const out: MiniSegment[] = []
  let i = 0
  while (i < text.length) {
    const open = text.indexOf('**', i)
    if (open === -1) {
      if (i < text.length) out.push({ type: 'text', value: text.slice(i) })
      break
    }
    if (open > i) out.push({ type: 'text', value: text.slice(i, open) })
    const close = text.indexOf('**', open + 2)
    if (close === -1) {
      out.push({ type: 'text', value: text.slice(open) })
      break
    }
    out.push({ type: 'bold', value: text.slice(open + 2, close) })
    i = close + 2
  }
  return out
}

/** Inline-only: `` `code` `` then `**bold**` in plain segments (not inside code). */
export function segmentMiniMarkdown(text: string): MiniSegment[] {
  const segments: MiniSegment[] = []
  let i = 0
  const n = text.length
  while (i < n) {
    if (text[i] === '`') {
      const close = text.indexOf('`', i + 1)
      if (close === -1) {
        segments.push({ type: 'text', value: text.slice(i) })
        break
      }
      segments.push({ type: 'code', value: text.slice(i + 1, close) })
      i = close + 1
    } else {
      const next = text.indexOf('`', i)
      const end = next === -1 ? n : next
      if (end > i) segments.push(...splitBold(text.slice(i, end)))
      if (next === -1) break
      i = next
    }
  }
  return mergeAdjacentText(segments)
}

export function miniMarkdownNodes(text: string): ReactNode {
  const segs = segmentMiniMarkdown(text)
  let stableKey = 0
  return (
    <Fragment>
      {segs.map((s) => {
        if (s.type === 'text') return s.value
        const key = stableKey++
        if (s.type === 'code')
          return (
            <code key={key} className={inlineCodeClassName}>
              {s.value}
            </code>
          )
        return (
          <strong key={key} className="font-semibold">
            {s.value}
          </strong>
        )
      })}
    </Fragment>
  )
}
