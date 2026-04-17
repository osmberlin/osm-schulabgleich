#!/usr/bin/env bun
import { type LandCode, STATE_LABEL_DE, STATE_ORDER } from '../src/lib/stateConfig'
import { type RunSplitLandsOptions, runStateFirstPipeline } from './lib/nationalPipeline'
import { cancel, intro, isCancel, outro, select } from '@clack/prompts'
import path from 'node:path'

const ALL_LANDS = '__all__' as const

const ROOT = path.join(import.meta.dirname, '..')

intro('Match erzwingen + Split nach Bundesland')

const choice = await select({
  message: 'Alle oder ein Bundesland',
  options: [
    { value: ALL_LANDS, label: 'Alle Bundesländer' },
    ...STATE_ORDER.map((c) => ({
      value: c,
      label: `${STATE_LABEL_DE[c]} (${c})`,
    })),
  ],
})

if (isCancel(choice)) {
  cancel('Abgebrochen.')
  process.exit(0)
}

const splitOpts: RunSplitLandsOptions | undefined =
  choice === ALL_LANDS ? undefined : { onlyLands: [choice as LandCode] }

process.env.PIPELINE_FORCE_MATCH = '1'

const m = await runStateFirstPipeline(ROOT, splitOpts)
if (m.errors.length) console.warn(m.errors.join('\n'))

if (m.matchSkipped) {
  outro('Match übersprungen – keine Ausgabe.')
  process.exit(0)
}
outro('Fertig.')
