#!/usr/bin/env bun
import path from 'node:path'
import { runMatchNational } from './lib/nationalPipeline'

const ROOT = path.join(import.meta.dirname, '..')

const r = await runMatchNational(ROOT)
if (r.errors.length) console.warn(r.errors.join('\n'))
