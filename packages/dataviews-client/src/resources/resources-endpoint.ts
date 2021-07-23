import { DatasetTypes, Resource } from '@globalfishingwatch/api-types'
import { Generators } from '@globalfishingwatch/layer-composer'
import {
  resolveDataviewDatasetResource,
  resolveDataviewEventsResources,
  UrlDataviewInstance,
} from '../resolve-dataviews'

const getVesselResourceQuery = (
  dataview: UrlDataviewInstance<Generators.Type>,
  datasetType: DatasetTypes
): Resource | null => {
  const { url, dataset, datasetConfig } = resolveDataviewDatasetResource(dataview, datasetType)
  if (url && dataset && datasetConfig) {
    return {
      dataviewId: dataview.dataviewId as number,
      url: url,
      dataset: dataset,
      datasetConfig: datasetConfig,
    }
  }
  return null
}

const resolveResourceEndpoint = (
  dataviewInstances: UrlDataviewInstance<Generators.Type>[]
): Resource[] => {
  if (!dataviewInstances) return []
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

    return [trackResource, infoResource, ...eventsResources].filter((r) => r !== null) as Resource[]
  })

  return resourceQueries
}

export default resolveResourceEndpoint
