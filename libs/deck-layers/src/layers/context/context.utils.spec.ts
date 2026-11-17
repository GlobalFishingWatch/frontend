import { describe, expect, it } from 'vitest'

import { getEEZBoundaryHighlightIds, isEEZBoundaryHighlighted } from './context.utils'

describe('isEEZBoundaryHighlighted', () => {
  const ids = new Set(['8493'])

  it('matches any EEZ in the comma-separated list', () => {
    expect(isEEZBoundaryHighlighted({ MRGID_EEZ: '8493' }, ids)).toBe(true)
    expect(isEEZBoundaryHighlighted({ MRGID_EEZ: '8438,8493' }, ids)).toBe(true)
    expect(isEEZBoundaryHighlighted({ MRGID_EEZ: '8494,8456,8493' }, ids)).toBe(true)
  })

  it('does not match other EEZs or partial ids', () => {
    expect(isEEZBoundaryHighlighted({ MRGID_EEZ: '8438,8456' }, ids)).toBe(false)
    expect(isEEZBoundaryHighlighted({ MRGID_EEZ: '84930' }, ids)).toBe(false)
  })

  it('never matches lines without MRGID_EEZ (old tiles) or with nothing highlighted', () => {
    expect(isEEZBoundaryHighlighted({ LINE_TYPE: 'Treaty' }, ids)).toBe(false)
    expect(isEEZBoundaryHighlighted({ MRGID_EEZ: '8493' }, new Set())).toBe(false)
  })
})

describe('getEEZBoundaryHighlightIds', () => {
  it('reads the feature id and the areaIds of the areas dataset', () => {
    const features = [
      { id: 8493, properties: {} },
      {
        id: 'report',
        properties: {
          datasetIds: ['public-eez-areas', 'public-mpa-all'],
          areaIds: ['8438', '555'],
        },
      },
    ] as any
    expect(getEEZBoundaryHighlightIds(features, { datasetId: 'public-eez-areas' })).toEqual([
      '8493',
      'report',
      '8438',
    ])
  })
})
