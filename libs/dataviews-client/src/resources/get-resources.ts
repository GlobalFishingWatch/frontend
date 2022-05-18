import {
  DatasetTypes,
  DataviewDatasetConfig,
  DataviewDatasetConfigParam,
  EndpointId,
  Resource,
} from '@globalfishingwatch/api-types'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import {
  getDatasetConfigByDatasetType,
  getDatasetConfigsByDatasetType,
  UrlDataviewInstance,
} from '../resolve-dataviews'
import { resolveEndpoint } from '../resolve-endpoint'

export type GetDatasetConfigsCallbacks = {
  tracks?: (datasetConfigs: DataviewDatasetConfig[]) => DataviewDatasetConfig[]
  activityContext?: (datasetConfigs: DataviewDatasetConfig) => DataviewDatasetConfig
}
export const getResources = (
  dataviews: UrlDataviewInstance[],
  callbacks: GetDatasetConfigsCallbacks
): { resources: Resource[]; dataviews: UrlDataviewInstance[] } => {
  const { trackDataviews, activityContextDataviews, otherDataviews } = dataviews.reduce(
    (acc, dataview) => {
      const isTrack = dataview.config?.type === GeneratorType.Track
      const isActivityWithContext =
        dataview.config?.type === GeneratorType.HeatmapAnimated &&
        dataview.datasetsConfig?.some((d) => d.endpoint === EndpointId.ContextGeojson)
      if (isTrack) {
        acc.trackDataviews.push(dataview)
      } else if (isActivityWithContext) {
        acc.activityContextDataviews.push(dataview)
      } else {
        acc.otherDataviews.push(dataview)
      }
      return acc
    },
    {
      trackDataviews: [] as UrlDataviewInstance[],
      activityContextDataviews: [] as UrlDataviewInstance[],
      otherDataviews: [] as UrlDataviewInstance[],
    }
  )

  // Create dataset configs needed to load all tracks related endpoints
  const trackDataviewsWithDatasetConfigs = trackDataviews.map((dataview) => {
    const info = getDatasetConfigByDatasetType(dataview, DatasetTypes.Vessels)

    const trackDatasetType =
      dataview.datasets && dataview.datasets?.[0]?.type === DatasetTypes.UserTracks
        ? DatasetTypes.UserTracks
        : DatasetTypes.Tracks
    const track = { ...getDatasetConfigByDatasetType(dataview, trackDatasetType) }

    const events = getDatasetConfigsByDatasetType(dataview, DatasetTypes.Events).filter(
      (datasetConfig) => datasetConfig.query?.find((q) => q.id === 'vessels')?.value
    ) // Loitering

    let preparedDatasetConfigs = [info, track, ...events]

    if (callbacks.tracks) {
      preparedDatasetConfigs = callbacks.tracks(preparedDatasetConfigs)
    }

    const preparedDataview = {
      ...dataview,
      datasetsConfig: preparedDatasetConfigs,
    }
    return preparedDataview
  })

  // resolve urls for info, track, events etc endpoints (only resolve info if dv not visible)
  const trackResources = trackDataviewsWithDatasetConfigs.flatMap((dataview) => {
    if (!dataview.datasetsConfig) return []

    return dataview.datasetsConfig.flatMap((datasetConfig) => {
      // Only load info endpoint when dataview visibility is set to false
      if (!dataview.config?.visible && datasetConfig.endpoint !== EndpointId.Vessel) return []
      const dataset = dataview.datasets?.find((dataset) => dataset.id === datasetConfig.datasetId)
      if (!dataset) return []
      const url = resolveEndpoint(dataset, datasetConfig)
      if (!url) return []
      return [{ dataset, datasetConfig, url, dataviewId: dataview.dataviewId as number }]
    })
  })

  const activityContextResources = activityContextDataviews.flatMap((dataview) => {
    if (!dataview.config?.subLayerActive) {
      return []
    }
    const dataviewDatasetConfig = dataview.datasetsConfig?.find(
      (d) => d.endpoint === EndpointId.ContextGeojson
    )
    if (!dataviewDatasetConfig) {
      return []
    }
    const datasetConfig = callbacks.activityContext
      ? callbacks.activityContext(dataviewDatasetConfig)
      : dataviewDatasetConfig

    const dataset = dataview.datasets?.find((d) => d.id === datasetConfig?.datasetId)
    if (!datasetConfig || !dataset) {
      return []
    }
    const url = resolveEndpoint(dataset, datasetConfig)

    if (!url) return []
    return [{ dataset, datasetConfig, url, dataviewId: dataview.dataviewId as number }]
  })

  return {
    resources: [...trackResources, ...activityContextResources],
    dataviews: [
      ...trackDataviewsWithDatasetConfigs,
      ...activityContextDataviews,
      ...otherDataviews,
    ],
  }
}

export const pickTrackResource = (
  dataview: UrlDataviewInstance,
  endpointType: EndpointId,
  resources?: Record<string, Resource>
) => {
  if (!resources) return undefined
  const datasetConfig = dataview.datasetsConfig?.find((dc) => dc.endpoint === endpointType)
  const vesselId = datasetConfig?.params?.find(
    (p: DataviewDatasetConfigParam) => p.id === 'vesselId'
  )?.value as string
  if (!vesselId) return undefined
  const loadedVesselResources = Object.values(resources).filter((resource) => {
    const vesselIdField = resource.datasetConfig.params.find((p) => p.id === 'vesselId')
    return resource.datasetConfig.endpoint === endpointType && vesselIdField?.value === vesselId
  })

  loadedVesselResources.sort((resA, resB) => {
    // TODO abstract this using a generic priority field?
    return resB.datasetConfig.metadata?.zoom - resA.datasetConfig.metadata?.zoom
  })

  const highestZoom = loadedVesselResources?.[0]?.datasetConfig.metadata?.zoom

  if (highestZoom === undefined) return undefined

  const loadedVesselResourcesAtHighestZoom = loadedVesselResources.filter(
    (r) => r.datasetConfig.metadata?.zoom === highestZoom
  )

  // Whole non chunked track has priority
  const wholeTrack = loadedVesselResourcesAtHighestZoom.find(
    (r) => !r.datasetConfig.metadata?.chunkSetId
  )

  if (wholeTrack) {
    return wholeTrack
  }

  // Else pick merged chunks track
  const mergedTrack = loadedVesselResourcesAtHighestZoom.find(
    (r) => r.datasetConfig.metadata?.chunkSetMerged
  )
  if (mergedTrack) {
    return mergedTrack
  }

  // Else no usable track for this vessel (we don't display a chunk alone)
  return undefined
}
