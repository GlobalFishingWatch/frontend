import { createSelector } from 'reselect'
import {
  Dataset,
  DatasetTypes,
  DataviewDatasetConfig,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { resolveEndpoint, UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { ResourceQuery } from 'features/resources/resources.slice'
import { selectDataviewInstancesResolved } from 'features/workspace/workspace.selectors'
import { isGuestUser } from 'features/user/user.selectors'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { ThinningLevels, THINNING_LEVELS } from 'data/config'

export const resolveDataviewDatasetResource = (
  dataview: UrlDataviewInstance,
  { type, id }: { type?: DatasetTypes; id?: string }
): {
  dataset?: Dataset
  datasetConfig?: DataviewDatasetConfig
  url?: string
} => {
  if (!type && !id) return {}

  const dataset = type
    ? dataview.datasets?.find((dataset) => dataset.type === type)
    : dataview.datasets?.find((dataset) => dataset.id === id)
  if (!dataset) return {}
  const datasetConfig = dataview?.datasetsConfig?.find(
    (datasetConfig) => datasetConfig.datasetId === dataset.id
  )
  if (!datasetConfig) return {}
  const url = resolveEndpoint(dataset, datasetConfig)
  if (!url) return {}

  return { dataset, datasetConfig, url }
}

export const selectDataviewsResourceQueries = createSelector(
  [selectDataviewInstancesResolved, isGuestUser, selectDebugOptions],
  (dataviewInstances, guestUser, { thinning }) => {
    if (!dataviewInstances) return

    const resourceQueries: ResourceQuery[] = dataviewInstances.flatMap((dataview) => {
      if (dataview.config?.type !== Generators.Type.Track || dataview.deleted) {
        return []
      }

      let trackQuery: any = [] // initialized as empty array to be filtered by flatMap if not used
      if (dataview.config.visible === true) {
        if (thinning) {
          // Insert thinning queryParams depending on the user type
          const thinningConfig = guestUser
            ? THINNING_LEVELS[ThinningLevels.Aggressive]
            : THINNING_LEVELS[ThinningLevels.Default]
          const thinningQuery = Object.entries(thinningConfig).map(([id, value]) => ({
            id,
            value,
          }))
          dataview.datasetsConfig = dataview.datasetsConfig?.map((datasetConfig) => {
            if (datasetConfig.endpoint !== EndpointId.Tracks) return datasetConfig
            return { ...datasetConfig, query: [...(datasetConfig.query || []), ...thinningQuery] }
          })
        }
        const trackResource = resolveDataviewDatasetResource(dataview, {
          type: DatasetTypes.Tracks,
        })
        if (trackResource.url && trackResource.dataset && trackResource.datasetConfig) {
          trackQuery = {
            dataviewId: dataview.dataviewId as number,
            url: trackResource.url,
            datasetType: trackResource.dataset.type,
            datasetConfig: trackResource.datasetConfig,
          }
        }
      }

      const infoResource = resolveDataviewDatasetResource(dataview, { type: DatasetTypes.Vessels })
      if (!infoResource.url || !infoResource.dataset || !infoResource.datasetConfig) {
        return trackQuery as ResourceQuery
      }
      const infoQuery: ResourceQuery = {
        dataviewId: dataview.dataviewId as number,
        url: infoResource.url,
        datasetType: infoResource.dataset.type,
        datasetConfig: infoResource.datasetConfig,
      }
      return [trackQuery, infoQuery]
    })

    return resourceQueries
  }
)
