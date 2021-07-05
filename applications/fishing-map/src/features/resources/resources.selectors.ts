import { createSelector } from 'reselect'
import { DatasetTypes, Resource } from '@globalfishingwatch/api-types'
import {
  resolveDataviewDatasetResource,
  resolveDataviewEventsResources,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.selectors'
import { isGuestUser } from 'features/user/user.selectors'
import { selectDebugOptions } from 'features/debug/debug.slice'

const getVesselResourceQuery = (
  dataview: UrlDataviewInstance<Generators.Type>,
  datasetType: DatasetTypes
): Resource | null => {
  const resource = resolveDataviewDatasetResource(dataview, datasetType)
  if (resource.url && resource.dataset && resource.datasetConfig) {
    return {
      dataviewId: dataview.dataviewId as number,
      url: resource.url,
      dataset: resource.dataset,
      datasetConfig: resource.datasetConfig,
    }
  }
  return null
}

export const selectDataviewsResourceQueries = createSelector(
  [selectDataviewInstancesResolved, isGuestUser, selectDebugOptions],
  (dataviewInstances, guestUser, { thinning }) => {
    if (!dataviewInstances) return
    const resourceQueries: Resource[] = dataviewInstances.flatMap((dataview) => {
      if (dataview.config?.type !== Generators.Type.Track || dataview.deleted) {
        return []
      }

      let trackResource: Resource | null = null
      let eventsResources: (Resource | null)[] = []

      if (dataview.config.visible === true) {
        const datasetType =
          dataview.datasets && dataview.datasets?.[0]?.type === DatasetTypes.UserTracks
            ? DatasetTypes.UserTracks
            : DatasetTypes.Tracks

        trackResource = getVesselResourceQuery(dataview, datasetType)
        eventsResources = resolveDataviewEventsResources(dataview)
      }

      const infoResource = getVesselResourceQuery(dataview, DatasetTypes.Vessels)

      return [trackResource, infoResource, ...eventsResources].filter(
        (r) => r !== null
      ) as Resource[]
    })

    return resourceQueries
  }
)
