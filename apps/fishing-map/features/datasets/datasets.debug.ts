import { Dataset, Dataview } from '@globalfishingwatch/api-types'

export const DATASET_LOADED_TO_DEBUG = ''

// Logic to debug where a dataset is loaded from a unkwown dataview
export const debugDatasetsInDataviews = (dataviews: Dataview[], datasetsIds: string[]) => {
  const datasetToDebug = datasetsIds.filter((d) => d.includes(DATASET_LOADED_TO_DEBUG))
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

// Logic to debug where a dataset is loaded from a unkwown source
export const debugRelatedDatasets = (datasets: Dataset[], relatedDatasetsIds: string[]) => {
  if (relatedDatasetsIds.some((d) => d.includes(DATASET_LOADED_TO_DEBUG))) {
    const originalDataset = datasets.find(
      (d) => d.relatedDatasets?.some((d) => d.id.includes(DATASET_LOADED_TO_DEBUG))
    )
    if (originalDataset) {
      console.log(
        `${DATASET_LOADED_TO_DEBUG} loaded because of is included as related dataset in: ${originalDataset.id}`
      )
    }
  }
}
