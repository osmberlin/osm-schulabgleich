#!/usr/bin/env bun
import path from 'node:path'
import { runSplitLands } from './lib/nationalPipeline'

const ROOT = path.join(import.meta.dirname, '..')

const { errors } = await runSplitLands(ROOT)
if (errors.length) console.warn(errors.join('\n'))
