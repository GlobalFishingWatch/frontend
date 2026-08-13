import { describe, expect, it } from 'vitest'

import type { Dataset } from '@globalfishingwatch/api-types'
import {
  DatasetCategory,
  DatasetStatus,
  DatasetTypes,
  DataviewCategory,
  DataviewType,
  EndpointId,
} from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { getFourwingsDataviewSublayers, getFourwingsDataviewsResolved } from './dataviews'

const createDataset = (overrides: Partial<Dataset> = {}): Dataset =>
  ({
    id: 'user-fourwings-1',
    type: DatasetTypes.UserFourwings,
    name: 'Azores',
    category: DatasetCategory.User,
    status: DatasetStatus.Done,
    ...overrides,
  }) as Dataset

const createDataview = (dataset: Dataset): UrlDataviewInstance =>
  ({
    id: 'user-4wings-azores',
    category: DataviewCategory.User,
    config: { type: DataviewType.HeatmapStatic, visible: true, datasets: [dataset.id] },
    datasets: [dataset],
    datasetsConfig: [
      {
        datasetId: dataset.id,
        endpoint: EndpointId.FourwingsTiles,
        params: [{ id: 'type', value: 'heatmap' }],
      },
    ],
  }) as UrlDataviewInstance

describe('getFourwingsDataviewSublayers', () => {
  it('skips datasets that are still importing', () => {
    const dataview = createDataview(createDataset({ status: DatasetStatus.Importing }))
    expect(getFourwingsDataviewSublayers(dataview)).toEqual([])
  })

  it('includes datasets once import is done', () => {
    const dataset = createDataset({ status: DatasetStatus.Done })
    const sublayers = getFourwingsDataviewSublayers(createDataview(dataset))
    expect(sublayers).toHaveLength(1)
    expect(sublayers[0].datasets).toEqual([dataset])
  })
})

describe('getFourwingsDataviewsResolved', () => {
  it('does not emit a fourwings layer while the dataset is importing', () => {
    const dataview = createDataview(createDataset({ status: DatasetStatus.Importing }))
    expect(getFourwingsDataviewsResolved(dataview)).toEqual([])
  })
})
