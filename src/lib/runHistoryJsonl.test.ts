import {
  compareRunRecordsStable,
  parseRunHistoryFileText,
  parseRunHistoryJsonl,
  sortRunRecordsStable,
  stringifyRunHistoryJsonl,
} from './runHistoryJsonl'
import { describe, expect, it } from 'vitest'

function run(startedAt: string, finishedAt: string, tag: string) {
  return { startedAt, finishedAt, durationMs: 1, tag }
}

describe('runHistoryJsonl', () => {
  it('parseRunHistoryJsonl skips blank lines and sorts by startedAt', () => {
    const text = [
      JSON.stringify(run('2026-04-03T12:00:00Z', '2026-04-03T12:01:00Z', 'b')),
      '',
      JSON.stringify(run('2026-04-02T12:00:00Z', '2026-04-02T12:01:00Z', 'a')),
    ].join('\n')
    const rows = parseRunHistoryJsonl(text)
    expect(rows.map((r) => (r as { tag: string }).tag)).toEqual(['a', 'b'])
  })

  it('parseRunHistoryJsonl throws with 1-based line number', () => {
    const text = ['{"ok":true}', 'not-json'].join('\n')
    expect(() => parseRunHistoryJsonl(text)).toThrow(/line 2/)
  })

  it('parseRunHistoryFileText treats one JSON object line as JSONL, not legacy', () => {
    const row = run('2026-04-02T12:00:00Z', '2026-04-02T12:01:00Z', 'solo')
    const text = JSON.stringify(row)
    const rows = parseRunHistoryFileText(text)
    expect(rows).toHaveLength(1)
    expect((rows[0] as { tag: string }).tag).toBe('solo')
  })

  it('parseRunHistoryFileText handles legacy wrapper', () => {
    const inner = [
      run('2026-04-02T12:00:00Z', '2026-04-02T12:01:00Z', 'a'),
      run('2026-04-03T12:00:00Z', '2026-04-03T12:01:00Z', 'b'),
    ]
    const text = JSON.stringify({ runs: [inner[1], inner[0]] })
    const rows = parseRunHistoryFileText(text)
    expect(rows.map((r) => (r as { tag: string }).tag)).toEqual(['a', 'b'])
  })

  it('parseRunHistoryFileText returns [] for empty or whitespace', () => {
    expect(parseRunHistoryFileText('')).toEqual([])
    expect(parseRunHistoryFileText('  \n  \n')).toEqual([])
  })

  it('stringifyRunHistoryJsonl sorts and round-trips', () => {
    const a = run('2026-04-03T12:00:00Z', '2026-04-03T12:01:00Z', 'late')
    const b = run('2026-04-02T12:00:00Z', '2026-04-02T12:01:00Z', 'early')
    const text = stringifyRunHistoryJsonl([a, b])
    expect(text.endsWith('\n')).toBe(true)
    const lines = text.trimEnd().split('\n')
    expect(lines).toHaveLength(2)
    const back = parseRunHistoryJsonl(text)
    expect(back.map((r) => (r as { tag: string }).tag)).toEqual(['early', 'late'])
  })

  it('stringifyRunHistoryJsonl returns empty string for no runs', () => {
    expect(stringifyRunHistoryJsonl([])).toBe('')
  })

  it('compareRunRecordsStable breaks ties with finishedAt, gitSha, then JSON', () => {
    const x = { startedAt: 't', finishedAt: 'a', gitSha: '1' }
    const y = { startedAt: 't', finishedAt: 'b', gitSha: '1' }
    expect(compareRunRecordsStable(x, y)).toBeLessThan(0)
    const z = { startedAt: 't', finishedAt: 'b', gitSha: '2' }
    expect(compareRunRecordsStable(y, z)).toBeLessThan(0)
  })

  it('sortRunRecordsStable does not mutate input', () => {
    const input = [run('2026-04-03T00:00:00Z', '2026-04-03T00:00:00Z', 'x')]
    const copy = structuredClone(input)
    sortRunRecordsStable(input)
    expect(input).toEqual(copy)
  })

  it('normalizes CRLF in JSONL input', () => {
    const row = run('2026-04-02T00:00:00Z', '2026-04-02T00:01:00Z', 'x')
    const text = `${JSON.stringify(row)}\r\n`
    expect(parseRunHistoryJsonl(text)).toHaveLength(1)
  })
})
