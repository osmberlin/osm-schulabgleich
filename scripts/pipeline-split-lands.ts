#!/usr/bin/env bun
import { runStateFirstPipeline } from './lib/nationalPipeline'
import path from 'node:path'

const ROOT = path.join(import.meta.dirname, '..')

const { errors } = await runStateFirstPipeline(ROOT)
if (errors.length) console.warn(errors.join('\n'))
