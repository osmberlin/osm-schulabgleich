#!/usr/bin/env bun
/**
 * pipeline:download — parallel downloads; always exit 0 (stale data OK for CI).
 */
import path from 'node:path'

const ROOT = path.join(import.meta.dirname, '..')

const a = Bun.spawn(['bun', 'run', 'pipeline:download:jedeschule'], {
  cwd: ROOT,
  stdout: 'inherit',
  stderr: 'inherit',
})
const b = Bun.spawn(['bun', 'run', 'pipeline:download:osm'], {
  cwd: ROOT,
  stdout: 'inherit',
  stderr: 'inherit',
})

const [ea, eb] = await Promise.all([a.exited, b.exited])
console.info(`[pipeline:download] jedeschule exit=${ea} osm exit=${eb}`)
process.exit(0)
