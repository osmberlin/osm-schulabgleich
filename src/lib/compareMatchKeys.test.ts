import {
  addressCompareTargetsFromOsmParts,
  normalizeAddressMatchKey,
  normalizeSchoolNameForMatch,
  normalizeWebsiteMatchKey,
} from './compareMatchKeys'
import { describe, expect, it } from 'vitest'

describe('normalizeSchoolNameForMatch', () => {
  it('normalizes casing, umlauts, diacritics and parenthetical text', () => {
    expect(normalizeSchoolNameForMatch('Schule Grün (Altbau)')).toBe('schule gruen')
    expect(normalizeSchoolNameForMatch('café')).toBe('cafe')
  })
})

describe('normalizeWebsiteMatchKey', () => {
  it('normalizes scheme/input variants and trailing slash noise', () => {
    expect(normalizeWebsiteMatchKey('example.org')).toBe('example.org/')
    expect(normalizeWebsiteMatchKey('https://EXAMPLE.org/')).toBe('example.org/')
    expect(normalizeWebsiteMatchKey('http://example.org:80')).toBe('example.org/')
    expect(normalizeWebsiteMatchKey('https://example.org/schule')).toBe('example.org/schule')
    expect(normalizeWebsiteMatchKey('https://example.org/schule/')).toBe('example.org/schule')
  })
})

describe('address compare keys', () => {
  it('treats strasse abbreviations as equivalent', () => {
    expect(normalizeAddressMatchKey('Hauptstraße 5')).toBe(normalizeAddressMatchKey('Hauptstr. 5'))
    expect(normalizeAddressMatchKey('Hauptstraße 5')).toBe(normalizeAddressMatchKey('Hauptstr 5'))
  })

  it('provides compare targets that are equivalent by key', () => {
    const targets = addressCompareTargetsFromOsmParts('Musterstraße', '9')
    expect(targets).toEqual(expect.arrayContaining(['Musterstraße 9', 'Musterstr. 9']))
    const keys = targets.map((x) => normalizeAddressMatchKey(x))
    expect(keys).toContain(normalizeAddressMatchKey('Musterstr. 9'))
  })
})
