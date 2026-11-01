import { describe, expect, it } from 'vitest'
import { de } from '../i18n/de'
import { matchDistanceReason } from './matchDistanceReason'

describe('matchDistanceReason', () => {
  it('has no reason for ok or unrated rows', () => {
    expect(matchDistanceReason({ matchMode: 'ref', distanceCheck: 'ok' }, null)).toBeNull()
    expect(matchDistanceReason({ matchMode: 'ref' }, null)).toBeNull()
  })

  it('returns the accepted note with the edit date', () => {
    expect(matchDistanceReason({ matchMode: 'ref', distanceCheck: 'accepted' }, '4.3.2025')).toBe(
      de.detail.distanceAcceptedNote.replace('{date}', '4.3.2025'),
    )
  })

  it('names the match mode when it is not ref', () => {
    expect(matchDistanceReason({ matchMode: 'name', distanceCheck: 'hint' }, null)).toBe(
      de.detail.distanceReasonNotRef.replace('{modeLabel}', de.detail.matchModeLabel.name),
    )
    expect(matchDistanceReason({ distanceCheck: 'error' }, null)).toContain('—')
  })

  it('explains an old or unknown edit date for ref matches', () => {
    expect(matchDistanceReason({ matchMode: 'ref', distanceCheck: 'error' }, '1.1.2020')).toBe(
      de.detail.distanceReasonRefOld.replace('{date}', '1.1.2020'),
    )
    expect(matchDistanceReason({ matchMode: 'ref', distanceCheck: 'hint' }, null)).toBe(
      de.detail.distanceReasonRefUnknown,
    )
  })
})
