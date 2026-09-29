#!/usr/bin/env bun
import { readFile } from 'node:fs/promises'
import { appendFile } from 'node:fs/promises'
import path from 'node:path'
import { NATIONAL, nationalPath } from './lib/nationalDatasetPaths'

const ROOT = path.join(import.meta.dirname, '..')
const outputPath = process.env.GITHUB_OUTPUT

async function metaOk(fileName: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(await readFile(nationalPath(ROOT, fileName), 'utf8')) as {
      ok?: unknown
    }
    return parsed.ok === true
  } catch {
    return false
  }
}

const osmOk = await metaOk(NATIONAL.schoolsOsmMeta)
const officialOk = await metaOk(NATIONAL.schoolsOfficialMeta)

if (outputPath) {
  await appendFile(outputPath, `osm_ok=${osmOk}\nofficial_ok=${officialOk}\n`)
}

console.info(`[pipeline:ci] source meta precheck: osm_ok=${osmOk} official_ok=${officialOk}`)
