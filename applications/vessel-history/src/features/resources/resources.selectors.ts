import { createSelector } from 'reselect'
import { DatasetTypes, Resource } from '@globalfishingwatch/api-types'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.selectors'
// import { isGuestUser } from 'features/user/user.selectors'
// import { selectDebugOptions } from 'features/debug/debug.slice'

export const selectDataviewsResourceQueries = createSelector(
  [selectDataviewInstancesResolved],
  (dataviewInstances) => {
    if (!dataviewInstances) return

    const resourceQueries: Resource[] = dataviewInstances.flatMap((dataview) => {
      if (dataview.config?.type !== Generators.Type.Track || dataview.deleted) {
        return []
      }

      let trackQuery: any = [] // initialized as empty array to be filtered by flatMap if not used
      if (dataview.config.visible === true) {
        const trackResource = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
        if (trackResource.url && trackResource.dataset && trackResource.datasetConfig) {
          trackQuery = {
            dataviewId: dataview.dataviewId as number,
            url: trackResource.url,
            datasetType: trackResource.dataset.type,
            datasetConfig: trackResource.datasetConfig,
          }
        }
      }

      const infoResource = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
      if (!infoResource.url || !infoResource.dataset || !infoResource.datasetConfig) {
        return trackQuery as Resource
      }
      const infoQuery: Resource = {
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
