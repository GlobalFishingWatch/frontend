import { describe, expect, it } from 'vitest'

import { getIsDatasetVersionDowngrade } from './datasets.utils'

describe('getIsDatasetVersionDowngrade', () => {
  it('detects a pre-released dataset reported as deprecated by an older version', () => {
    expect(
      getIsDatasetVersionDowngrade(
        'public-global-fishing-effort:v5.0',
        'public-global-fishing-effort:v4.0'
      )
    ).toBe(true)
  })

  it('detects downgrades on date-based versions', () => {
    expect(
      getIsDatasetVersionDowngrade('public-global-eez:v20231213', 'public-global-eez:v20231026')
    ).toBe(true)
  })

  it('allows real deprecations', () => {
    expect(
      getIsDatasetVersionDowngrade(
        'public-global-fishing-effort:v4.0',
        'public-global-fishing-effort:v5.0'
      )
    ).toBe(false)
    expect(
      getIsDatasetVersionDowngrade(
        'public-global-fishing-effort:v4.0',
        'public-global-fishing-effort:v4.1'
      )
    ).toBe(false)
  })

  it('ignores pairs of different datasets', () => {
    expect(
      getIsDatasetVersionDowngrade(
        'public-global-fishing-effort:v5.0',
        'public-global-presence:v4.0'
      )
    ).toBe(false)
  })

  it('keeps current behaviour on same or unparseable versions', () => {
    expect(getIsDatasetVersionDowngrade('a:v4.0', 'a:v4.0')).toBe(false)
    expect(getIsDatasetVersionDowngrade('a:vlatest', 'a:v4.0')).toBe(false)
    expect(getIsDatasetVersionDowngrade('a', 'a:v4.0')).toBe(false)
    expect(getIsDatasetVersionDowngrade('', 'a:v4.0')).toBe(false)
  })
})
