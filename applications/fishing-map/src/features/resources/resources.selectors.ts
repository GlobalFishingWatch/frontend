import { createSelector } from 'reselect'
import { DatasetTypes, Resource } from '@globalfishingwatch/api-types'
import { resolveDataviewDatasetResource, UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.selectors'
import { isGuestUser } from 'features/user/user.selectors'
import { selectDebugOptions } from 'features/debug/debug.slice'

const getVesselResourceQuery = (dataview: UrlDataviewInstance<Generators.Type>, datasetType: DatasetTypes): Resource | null => {
  const resource = resolveDataviewDatasetResource(dataview, datasetType)
  if (resource.url && resource.dataset && resource.datasetConfig) {
    return {
      dataviewId: dataview.dataviewId as number,
      url: resource.url,
      datasetType: resource.dataset.type,
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

      if (dataview.config.visible === true) {
        const datasetType =
          dataview.datasets && dataview.datasets?.[0]?.type === DatasetTypes.UserTracks
            ? DatasetTypes.UserTracks
            : DatasetTypes.Tracks

        trackResource = getVesselResourceQuery(dataview, datasetType)
      }

      const infoResource = getVesselResourceQuery(dataview, DatasetTypes.Vessels)
      const eventsResource = getVesselResourceQuery(dataview, DatasetTypes.Events)

      return [trackResource, infoResource, eventsResource].filter(r => r !== null) as Resource[]
    })

    return resourceQueries
  }
)
