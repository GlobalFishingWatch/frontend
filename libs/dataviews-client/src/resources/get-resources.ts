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

export type GetDatasetConfigCallback = (
  datasetConfig: DataviewDatasetConfig[],
  dataview?: UrlDataviewInstance
) => DataviewDatasetConfig[]

export type GetDatasetConfigsCallbacks = {
  track?: GetDatasetConfigCallback
  info?: GetDatasetConfigCallback
  events?: GetDatasetConfigCallback
}
export const getResources = (
  dataviews: UrlDataviewInstance[],
  callbacks: GetDatasetConfigsCallbacks
): { resources: Resource[]; dataviews: UrlDataviewInstance[] } => {
  const { trackDataviews, otherDataviews } = dataviews.reduce(
    (acc, dataview) => {
      const isTrack = dataview.config?.type === GeneratorType.Track
      if (isTrack) {
        acc.trackDataviews.push(dataview)
      } else {
        acc.otherDataviews.push(dataview)
      }
      return acc
    },
    {
      trackDataviews: [] as UrlDataviewInstance[],
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

    const trackDatasetConfig = { ...getDatasetConfigByDatasetType(dataview, trackDatasetType) }
    const hasTrackData =
      trackDatasetType === DatasetTypes.Tracks
        ? trackDatasetConfig?.params?.find((p) => p.id === 'vesselId')?.value
        : trackDatasetConfig?.params?.find((p) => p.id === 'id')?.value
    // Cleaning track resources with no data as now now the track is hidden for guest users in VMS full- datasets
    const track = hasTrackData ? trackDatasetConfig : ({} as DataviewDatasetConfig)

    const events = getDatasetConfigsByDatasetType(dataview, DatasetTypes.Events).filter(
      (datasetConfig) => datasetConfig.query?.find((q) => q.id === 'vessels')?.value
    ) // Loitering

    let preparedInfoDatasetConfigs = [info]
    let preparedTrackDatasetConfigs = [track]
    let preparedEventsDatasetConfigs = events

    if (callbacks.info && preparedInfoDatasetConfigs?.length > 0) {
      preparedInfoDatasetConfigs = callbacks.info([info], dataview)
    }
    if (callbacks.track && preparedTrackDatasetConfigs?.length > 0) {
      preparedTrackDatasetConfigs = callbacks.track(preparedTrackDatasetConfigs, dataview)
    }
    if (callbacks.events && preparedEventsDatasetConfigs?.length > 0) {
      preparedEventsDatasetConfigs = callbacks.events(preparedEventsDatasetConfigs, dataview)
    }

    const preparedDataview = {
      ...dataview,
      datasetsConfig: [
        ...preparedInfoDatasetConfigs,
        ...preparedTrackDatasetConfigs,
        ...preparedEventsDatasetConfigs,
      ].filter(Boolean),
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
      return [{ dataset, datasetConfig, url, dataviewId: dataview.dataviewId as string }]
    })
  })

  return {
    resources: trackResources,
    dataviews: [...trackDataviewsWithDatasetConfigs, ...otherDataviews],
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
