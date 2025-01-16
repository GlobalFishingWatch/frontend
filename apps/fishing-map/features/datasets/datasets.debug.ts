import { uniq } from 'es-toolkit'

import type { Dataset, Dataview } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'

// Logic to debug where a dataset is loaded from a unkwown dataview
export const debugDatasetsInDataviews = (
  dataviews: (Dataview | UrlDataviewInstance)[],
  datasetId: string
) => {
  if (datasetId) {
    const datasetsIds = getDatasetsInDataviews(dataviews)
    const datasetToDebug = datasetsIds.filter((d) => d.includes(datasetId))
    // Logic to debug where a dataset is loaded from a unkwown dataview
    if (datasetToDebug?.length) {
      datasetToDebug.forEach((d) => {
        const dataview = dataviews.find((dv) => {
          return dv.datasetsConfig?.some((dc) => dc.datasetId.includes(d))
        })
        console.log(`${d} loaded because of is included in dataview: ${dataview?.id}`)
      })
    }
  }
}

// Logic to debug where a dataset is loaded from a unkwown source
export const debugRelatedDatasets = (datasets: Dataset[], datasetId: string) => {
  if (datasetId) {
    const relatedDatasetsIds = uniq(
      datasets.flatMap((dataset) => dataset.relatedDatasets?.flatMap(({ id }) => id || []) || [])
    )
    if (relatedDatasetsIds.some((d) => d.includes(datasetId))) {
      const originalDataset = datasets.find((d) =>
        d.relatedDatasets?.some((d) => d.id.includes(datasetId))
      )
      if (originalDataset) {
        console.log(
          `${datasetId} loaded because of is included as related dataset in: ${originalDataset.id}`
        )
      }
    }
  }
}
