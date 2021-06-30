import { DatasetTypes, Resource } from '@globalfishingwatch/api-types'
import { Generators } from '@globalfishingwatch/layer-composer'
import { resolveDataviewDatasetResource, UrlDataviewInstance } from '../resolve-dataviews'

const getVesselResourceQuery = (
  dataview: UrlDataviewInstance<Generators.Type>,
  datasetType: DatasetTypes
): Resource | null => {
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

const resolveResourceEndpoint = (
  dataviewInstances: UrlDataviewInstance<Generators.Type>[]
): Resource[] => {
  if (!dataviewInstances) return []
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

    return [trackResource, infoResource, eventsResource].filter((r) => r !== null) as Resource[]
  })

  return resourceQueries
}

export default resolveResourceEndpoint
