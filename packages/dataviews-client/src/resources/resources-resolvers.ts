import { DatasetTypes, Resource } from '@globalfishingwatch/api-types'
import { Generators } from '@globalfishingwatch/layer-composer'
import {
  resolveDataviewEventsResources,
  resolveDataviewResourceByDatasetType,
  UrlDataviewInstance,
} from '../resolve-dataviews'

// TODO Deprecate
const resolveDataviewsResourceQueries = (
  dataviewInstances: UrlDataviewInstance<Generators.Type>[]
): Resource[] => {
  if (!dataviewInstances) return []
  const resourceQueries: Resource[] = dataviewInstances.flatMap((dataview) => {
    if (dataview.config?.type !== Generators.Type.Track || dataview.deleted) {
      return []
    }

    let trackResource: Resource | undefined
    let eventsResources: Resource[] = []

    if (dataview.config.visible === true) {
      const datasetType =
        dataview.datasets && dataview.datasets?.[0]?.type === DatasetTypes.UserTracks
          ? DatasetTypes.UserTracks
          : DatasetTypes.Tracks

      trackResource = resolveDataviewResourceByDatasetType(dataview, datasetType)
      eventsResources = resolveDataviewEventsResources(dataview)
    }

    const infoResource = resolveDataviewResourceByDatasetType(dataview, DatasetTypes.Vessels)

    return [trackResource, infoResource, ...eventsResources].filter((r) => r) as Resource[]
  })

  return resourceQueries
}

export default resolveDataviewsResourceQueries
