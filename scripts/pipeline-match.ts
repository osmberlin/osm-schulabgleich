#!/usr/bin/env bun
import { runStateFirstPipeline } from './lib/nationalPipeline'
import path from 'node:path'

const ROOT = path.join(import.meta.dirname, '..')

const r = await runStateFirstPipeline(ROOT)
if (r.errors.length) console.warn(r.errors.join('\n'))
