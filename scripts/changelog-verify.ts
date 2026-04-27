import {
  isChangelogOnlyCommit,
  listFirstParentHeadHistory,
  readCommitInfo,
  readRegistry,
  resolveCommitRef,
  shortHash,
  sliceCommitsSinceAnchor,
} from './lib/changelogRegistry'

type ResolvedRefRow = {
  entryIndex: number
  inputRef: string
  resolvedHash: string | null
}

async function main() {
  const projectRoot = process.cwd()
  const registry = await readRegistry(projectRoot)

  const resolvedRows: ResolvedRefRow[] = []
  for (let entryIndex = 0; entryIndex < registry.entries.length; entryIndex += 1) {
    const entry = registry.entries[entryIndex]
    for (const ref of entry.refs) {
      const resolved = await resolveCommitRef(projectRoot, ref)
      resolvedRows.push({
        entryIndex,
        inputRef: ref,
        resolvedHash: resolved.hash,
      })
    }
  }

  const invalidRefs = resolvedRows.filter((row) => row.resolvedHash === null)
  if (invalidRefs.length > 0) {
    console.error('[changelog:verify] Invalid refs found in changelog registry:')
    for (const row of invalidRefs) {
      console.error(`  - entry #${row.entryIndex + 1}: ${row.inputRef}`)
    }
    process.exit(1)
  }

  const byHash = new Map<string, ResolvedRefRow[]>()
  for (const row of resolvedRows) {
    const hash = row.resolvedHash
    if (!hash) continue
    const list = byHash.get(hash) ?? []
    list.push(row)
    byHash.set(hash, list)
  }
  const duplicateHashes = Array.from(byHash.entries()).filter(([, rows]) => rows.length > 1)
  if (duplicateHashes.length > 0) {
    console.error('[changelog:verify] Duplicate commit coverage found:')
    for (const [hash, rows] of duplicateHashes) {
      const locations = rows
        .map((row) => `entry #${row.entryIndex + 1} (${row.inputRef})`)
        .join(', ')
      console.error(`  - ${shortHash(hash)} appears multiple times: ${locations}`)
    }
    process.exit(1)
  }

  const registeredHashes = new Set(Array.from(byHash.keys()))
  const firstParentHistory = await listFirstParentHeadHistory(projectRoot)
  const { anchorHash, commitsSinceAnchor } = sliceCommitsSinceAnchor(
    firstParentHistory,
    registeredHashes,
  )

  const missingCommits = commitsSinceAnchor.filter((hash) => !registeredHashes.has(hash))
  const missingNonChangelogCommits: string[] = []
  let skippedChangelogOnlyCount = 0
  for (const hash of missingCommits) {
    if (await isChangelogOnlyCommit(projectRoot, hash)) {
      skippedChangelogOnlyCount += 1
      continue
    }
    missingNonChangelogCommits.push(hash)
  }

  if (missingNonChangelogCommits.length > 0) {
    console.error('[changelog:verify] Missing commits in changelog registry:')
    for (const hash of missingNonChangelogCommits) {
      const commit = await readCommitInfo(projectRoot, hash)
      console.error(`  - ${shortHash(hash)} ${commit.subject}`)
    }
    if (anchorHash) {
      console.error(`[changelog:verify] Anchor commit: ${shortHash(anchorHash)}.`)
    } else {
      console.error(
        '[changelog:verify] No anchor commit found in registry; checked from HEAD back.',
      )
    }
    console.error('[changelog:verify] Run: bun run changelog:prefill')
    process.exit(1)
  }

  const checkedCount = commitsSinceAnchor.length
  const checkedNonChangelogCount = checkedCount - skippedChangelogOnlyCount
  if (anchorHash) {
    console.info(
      `[changelog:verify] OK. Checked ${checkedNonChangelogCount} commits since ${shortHash(anchorHash)} (${skippedChangelogOnlyCount} changelog-only commits skipped).`,
    )
  } else {
    console.info(
      `[changelog:verify] OK. Checked ${checkedNonChangelogCount} commits from HEAD (${skippedChangelogOnlyCount} changelog-only commits skipped).`,
    )
  }
}

void main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
