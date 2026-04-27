import {
  CHANGELOG_JSON_PATH,
  CHANGELOG_MARKDOWN_PATH,
  monthKeyFromIsoDate,
  readCommitInfo,
  readRegistry,
  resolveCommitRef,
  shortHash,
} from './lib/changelogRegistry'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

type RenderableEntry = {
  refs: string[]
  descriptionMd: string
  committedAtIso: string
  month: string
}

function normalizeMarkdownBody(markdown: string): string {
  return markdown.trim().replace(/\n{3,}/g, '\n\n')
}

function renderMarkdown(entriesByMonth: Map<string, RenderableEntry[]>): string {
  const monthKeys = Array.from(entriesByMonth.keys()).sort((a, b) => b.localeCompare(a))
  const lines: string[] = []
  lines.push('# Changelog')
  lines.push('')
  lines.push('Automatisch aus `changelog/registry.yaml` erzeugt.')
  lines.push('')

  for (const month of monthKeys) {
    lines.push(`## ${month}`)
    lines.push('')
    const monthEntries = entriesByMonth.get(month) ?? []
    const sortedEntries = [...monthEntries].sort((a, b) =>
      b.committedAtIso.localeCompare(a.committedAtIso),
    )
    for (const entry of sortedEntries) {
      const refsText = entry.refs.map((ref) => `\`${ref}\``).join(', ')
      lines.push(`### ${refsText}`)
      lines.push('')
      lines.push(normalizeMarkdownBody(entry.descriptionMd))
      lines.push('')
    }
  }

  return lines.join('\n').trimEnd() + '\n'
}

async function main() {
  const projectRoot = process.cwd()
  const registry = await readRegistry(projectRoot)

  const renderable: RenderableEntry[] = []
  for (const entry of registry.entries) {
    if (entry.hide) continue
    const firstRef = entry.refs[0]
    const resolved = await resolveCommitRef(projectRoot, firstRef)
    if (!resolved.hash) {
      throw new Error(`Could not resolve first ref "${firstRef}" for visible changelog entry.`)
    }
    const commitInfo = await readCommitInfo(projectRoot, resolved.hash)
    renderable.push({
      refs: entry.refs,
      descriptionMd: entry.descriptionMd,
      committedAtIso: commitInfo.committedAtIso,
      month: monthKeyFromIsoDate(commitInfo.committedAtIso),
    })
  }

  const byMonth = new Map<string, RenderableEntry[]>()
  for (const entry of renderable) {
    const rows = byMonth.get(entry.month) ?? []
    rows.push(entry)
    byMonth.set(entry.month, rows)
  }

  const markdown = renderMarkdown(byMonth)
  const changelogMdAbs = path.join(projectRoot, CHANGELOG_MARKDOWN_PATH)
  await writeFile(changelogMdAbs, markdown, 'utf8')

  const jsonAbs = path.join(projectRoot, CHANGELOG_JSON_PATH)
  await mkdir(path.dirname(jsonAbs), { recursive: true })
  const monthKeys = Array.from(byMonth.keys()).sort((a, b) => b.localeCompare(a))
  const payload = {
    generatedAt: new Date().toISOString(),
    months: monthKeys.map((month) => {
      const entries = (byMonth.get(month) ?? [])
        .sort((a, b) => b.committedAtIso.localeCompare(a.committedAtIso))
        .map((entry) => ({
          refs: entry.refs,
          descriptionMd: normalizeMarkdownBody(entry.descriptionMd),
          committedAtIso: entry.committedAtIso,
          committedAtShort: entry.committedAtIso.slice(0, 10),
          refsDisplay: entry.refs.map((ref) => shortHash(ref)),
        }))
      return { month, entries }
    }),
  }
  await writeFile(jsonAbs, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  console.info(`[changelog:build] Wrote ${CHANGELOG_MARKDOWN_PATH} and ${CHANGELOG_JSON_PATH}.`)
}

void main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
