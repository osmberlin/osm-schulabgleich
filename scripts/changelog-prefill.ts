import {
  isChangelogOnlyCommit,
  listFirstParentHeadHistory,
  readCommitInfo,
  readRegistry,
  resolveCommitRef,
  shortHash,
  sliceCommitsSinceAnchor,
  writeRegistry,
} from './lib/changelogRegistry'

type ExistingRefResolution = {
  inputRef: string
  resolvedHash: string | null
}

const HIDE_TERMS = ['chore', 'lint', 'autoformat']
const VISIBLE_HINT_TERMS = ['feature', 'improve']

function shouldHideFromSubject(subject: string): boolean {
  const lower = subject.toLowerCase()
  const hasHiddenTerm = HIDE_TERMS.some((term) => lower.includes(term))
  const hasVisibleHint = VISIBLE_HINT_TERMS.some((term) => lower.includes(term))
  return hasHiddenTerm && !hasVisibleHint
}

function draftDescription(subject: string, body: string): string {
  const cleanSubject = subject.trim()
  const bodyParagraph = body
    .split('\n\n')
    .map((part) => part.trim())
    .find(Boolean)
  if (!bodyParagraph) return cleanSubject
  const firstLine = bodyParagraph
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean)
  if (!firstLine) return cleanSubject
  if (firstLine.toLowerCase() === cleanSubject.toLowerCase()) return cleanSubject
  return `${cleanSubject}\n${firstLine}`
}

async function resolveExistingRefs(
  projectRoot: string,
  refs: string[],
): Promise<ExistingRefResolution[]> {
  const out: ExistingRefResolution[] = []
  for (const ref of refs) {
    const resolved = await resolveCommitRef(projectRoot, ref)
    out.push({
      inputRef: ref,
      resolvedHash: resolved.hash,
    })
  }
  return out
}

async function main() {
  const projectRoot = process.cwd()
  const registry = await readRegistry(projectRoot)
  const existingRefs = registry.entries.flatMap((entry) => entry.refs)
  const resolved = await resolveExistingRefs(projectRoot, existingRefs)
  const registeredHashes = new Set(
    resolved.flatMap((row) => (row.resolvedHash ? [row.resolvedHash] : [])),
  )

  const history = await listFirstParentHeadHistory(projectRoot)
  const { anchorHash, commitsSinceAnchor } = sliceCommitsSinceAnchor(history, registeredHashes)
  const missingCommits = commitsSinceAnchor.filter((hash) => !registeredHashes.has(hash))
  const orderedMissing = [...missingCommits].reverse()
  const missingNonChangelogCommits: string[] = []
  let skippedChangelogOnlyCount = 0
  for (const hash of orderedMissing) {
    if (await isChangelogOnlyCommit(projectRoot, hash)) {
      skippedChangelogOnlyCount += 1
      continue
    }
    missingNonChangelogCommits.push(hash)
  }

  if (missingNonChangelogCommits.length === 0) {
    console.info('[changelog:prefill] No missing commits. Registry already covers this range.')
    if (anchorHash) {
      console.info(`[changelog:prefill] Anchor ref found at ${shortHash(anchorHash)}.`)
    }
    if (skippedChangelogOnlyCount > 0) {
      console.info(
        `[changelog:prefill] Skipped ${skippedChangelogOnlyCount} changelog-only commits.`,
      )
    }
    return
  }

  let added = 0
  for (const hash of missingNonChangelogCommits) {
    const commit = await readCommitInfo(projectRoot, hash)
    const hide = shouldHideFromSubject(commit.subject)
    if (hide) {
      registry.entries.push({
        refs: [shortHash(commit.hash)],
        hide: true,
      })
      console.info(
        `[changelog:prefill] Added hidden entry ${shortHash(commit.hash)} (${commit.subject})`,
      )
      added += 1
      continue
    }
    registry.entries.push({
      refs: [shortHash(commit.hash)],
      hide: false,
      descriptionMd: draftDescription(commit.subject, commit.body),
    })
    console.info(
      `[changelog:prefill] Added visible entry ${shortHash(commit.hash)} (${commit.subject})`,
    )
    added += 1
  }

  await writeRegistry(projectRoot, registry)
  console.info(`[changelog:prefill] Added ${added} entries.`)
  if (skippedChangelogOnlyCount > 0) {
    console.info(`[changelog:prefill] Skipped ${skippedChangelogOnlyCount} changelog-only commits.`)
  }
}

void main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
