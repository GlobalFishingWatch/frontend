import { createSelector } from '@reduxjs/toolkit'
import { Generators } from '@globalfishingwatch/layer-composer'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { selectWorkspace } from 'features/workspace/workspace.slice'
import { ResourceQuery } from 'features/resources/resources.slice'

export const getDatasetsByDataview = (dataview: Dataview) =>
  Object.entries(dataview.datasetsConfig || {}).flatMap(([id, value]) => {
    const dataset = dataview.datasets?.find((dataset) => dataset.id === id)
    if (!dataset) return []
    return {
      id,
      label: dataset.name,
    }
  })

export const selectWorkspaceViewport = createSelector([selectWorkspace], (workspace) => {
  return workspace?.viewport
})

export const selectWorkspaceDataviews = createSelector([selectWorkspace], (workspace) => {
  if (!workspace) return
  // TODO resolve them here
  return workspace.dataviews
})

export const selectFishingDataviews = createSelector([selectWorkspaceDataviews], (dataviews) => {
  if (!dataviews) return

  return dataviews.filter((dataview) => dataview.config.type === Generators.Type.HeatmapAnimated)
})

export const selectFishingDatasets = createSelector([selectFishingDataviews], (dataviews) => {
  if (!dataviews) return

  return dataviews.flatMap((dataview) => getDatasetsByDataview(dataview))
})

export const selectDataviewsResourceQueries = createSelector(
  [selectWorkspaceDataviews],
  (dataviews) => {
    if (!dataviews) return []
    const resourceQueries: ResourceQuery[] = dataviews.flatMap((dataview) => {
      if (dataview.config.type !== Generators.Type.Track) return []

      // TODO should come from search or 4wings cell - not sure how to get that when set in a workspace?
      const DATASET_ID = 'carriers-tracks:v20200507'
      const dataset = dataview.datasets?.find((dataset) => dataset.id === DATASET_ID)
      const datasetConfig = dataview.datasetsConfig && dataview.datasetsConfig[DATASET_ID]
      if (!dataset || !datasetConfig) return []

      const endpoint = dataset.endpoints?.find((endpoint) => endpoint.id === datasetConfig.endpoint)

      if (!endpoint) return []

      const template = endpoint.pathTemplate

      // TODO SET PARAMS This is adhoc for tracks, we need something more generic
      const param = datasetConfig.params.find((param) => param.id === 'vesselId')
      let url = template.replace('{{id}}', param!.value as string)

      if (datasetConfig.query) {
        const resolvedQuery = new URLSearchParams()
        datasetConfig.query.forEach((query) => {
          resolvedQuery.set(query.id, query.value.toString())
        })
        // TODO Stop using hardcoded value
        url = `/datasets/fishing/vessels/00ba29183-3b86-9e36-cf20-ee340e409521/tracks?${decodeURI(
          resolvedQuery.toString()
        )}`
        // url = `${url}/${resolvedQuery.toString()}`
      }

      return {
        dataviewId: dataview.id,
        datasetType: dataset.type,
        datasetConfig,
        url,
      }
    })

    return resourceQueries
  }
)
