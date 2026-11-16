import { describe, expect, test } from 'vitest'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'

import { getDataviewSqlFiltersResolved } from './resolve-dataviews'
import type { UrlDataviewInstance } from './types'

const eventsDataset = {
  id: 'public-global-loitering-events',
  type: DatasetTypes.Events,
  filters: { events: [{ id: 'duration', type: 'range', enum: [2, 48] }] },
} as unknown as Dataset

const getDataview = (filters?: Record<string, any>, datasets = [eventsDataset]) =>
  ({ id: 'loitering', datasets, config: { filters } }) as UrlDataviewInstance

describe('getDataviewSqlFiltersResolved', () => {
  test('sends the duration schema minimum when no duration filter is selected', () => {
    expect(getDataviewSqlFiltersResolved(getDataview())).toBe('duration >= 2')
  })

  test('keeps the floor next to a selected duration range', () => {
    expect(getDataviewSqlFiltersResolved(getDataview({ duration: ['5', '10'] }))).toBe(
      'duration >= 5 AND duration <= 10 AND duration >= 2'
    )
  })

  test('sends only the floor when the full range is selected', () => {
    expect(getDataviewSqlFiltersResolved(getDataview({ duration: ['2', '48'] }))).toBe(
      'duration >= 2'
    )
  })

  test('adds nothing for datasets that are not events', () => {
    const fourwings = { ...eventsDataset, type: DatasetTypes.Fourwings } as Dataset
    expect(getDataviewSqlFiltersResolved(getDataview(undefined, [fourwings]))).toBe('')
  })
})
