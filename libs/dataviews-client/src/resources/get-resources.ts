import type {
  DataviewDatasetConfig,
  DataviewDatasetConfigParam,
  Resource,
} from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewType, EndpointId } from '@globalfishingwatch/api-types'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'

import { CACHE_FALSE_PARAM } from '../config'
import { getDatasetConfigByDatasetType, getDatasetConfigsByDatasetType } from '../resolve-dataviews'
import type { UrlDataviewInstance } from '../types'

export const splitTrackDataviews = (dataviews: UrlDataviewInstance[]) => {
  return dataviews.reduce(
    (acc, dataview) => {
      const isTrack = dataview.config?.type === DataviewType.Track
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
}

const VESSEL_RESTRICTED_DATASET_TYPES = [DatasetTypes.Tracks, DatasetTypes.Events]

export const resolveTrackDataviewsDatasetsConfig = (
  dataviews: UrlDataviewInstance[],
  { vesselTracksAndEventsAllowed = true, infoCache = true } = {}
) => {
  const { trackDataviews, otherDataviews } = splitTrackDataviews(dataviews)
  // Create dataset configs needed to load all tracks related endpoints
  const trackDataviewsWithDatasetConfigs = trackDataviews.map((dataview) => {
    const infoDatasetConfig = getDatasetConfigByDatasetType(dataview, {
      type: DatasetTypes.Vessels,
    })
    // Cleaning info resources with no vessel to request
    const hasInfoData = Boolean(infoDatasetConfig?.params?.find((p) => p.id === 'vesselId')?.value)
    const info = hasInfoData
      ? {
          ...infoDatasetConfig,
          ...(!infoCache && {
            query: [...(infoDatasetConfig.query || []), CACHE_FALSE_PARAM],
          }),
        }
      : undefined

    const trackDatasetType =
      dataview.datasets && dataview.datasets?.[0]?.type === DatasetTypes.UserTracks
        ? DatasetTypes.UserTracks
        : DatasetTypes.Tracks
    // Only vessel tracks are restricted, user tracks are always allowed
    const vesselRestricted =
      !vesselTracksAndEventsAllowed && trackDatasetType === DatasetTypes.Tracks

    const trackDatasetConfig = {
      ...getDatasetConfigByDatasetType(dataview, { type: trackDatasetType }),
    }
    const trackRealTimeDatasetConfig = {
      ...getDatasetConfigByDatasetType(dataview, {
        type: DatasetTypes.Tracks,
        endpoint: EndpointId.TracksRealTime,
      }),
    }

    const hasTrackData =
      trackDatasetType === DatasetTypes.Tracks
        ? trackDatasetConfig?.params?.find((p) => p.id === 'vesselId')?.value !== undefined
        : trackDatasetConfig?.params?.find((p) => p.id === 'id')?.value !== undefined
    const hasTrackRealTimeData =
      trackRealTimeDatasetConfig?.params?.find((p) => p.id === 'ssvid')?.value !== undefined
    // Cleaning track resources with no vessel to request
    const track = hasTrackData && !vesselRestricted ? trackDatasetConfig : undefined
    const trackRealTime =
      hasTrackRealTimeData && !vesselRestricted ? trackRealTimeDatasetConfig : undefined

    const events = vesselRestricted
      ? []
      : getDatasetConfigsByDatasetType(dataview, { type: DatasetTypes.Events }).filter(
          (datasetConfig) => datasetConfig.query?.find((q) => q.id === 'vessels')?.value
        ) // Loitering

    return {
      ...dataview,
      datasetsConfig: [info, track, trackRealTime, ...events].filter(
        (datasetConfig): datasetConfig is DataviewDatasetConfig => Boolean(datasetConfig)
      ),
      ...(vesselRestricted && {
        datasets: dataview.datasets?.filter(
          ({ type }) => !VESSEL_RESTRICTED_DATASET_TYPES.includes(type)
        ),
      }),
    }
  })
  return [...trackDataviewsWithDatasetConfigs, ...otherDataviews]
}

export const getResources = (
  dataviews: UrlDataviewInstance[]
): { resources: Resource[]; dataviews: UrlDataviewInstance[] } => {
  const { trackDataviews } = splitTrackDataviews(dataviews)
  // resolve urls for vessels info (tracks and events are fetched within the Deck layers)
  const trackResources = trackDataviews.flatMap((dataview) => {
    if (!dataview.datasetsConfig) return []

    return dataview.datasetsConfig.flatMap((datasetConfig) => {
      if (datasetConfig.endpoint === EndpointId.Vessel) {
        const dataset = dataview.datasets?.find((dataset) => dataset.id === datasetConfig.datasetId)
        if (!dataset) return []
        const url = resolveEndpoint(dataset, datasetConfig)
        if (!url) return []
        return [{ dataset, datasetConfig, url, dataviewId: dataview.dataviewId as string }]
      }
      return []
    })
  })

  return {
    dataviews,
    resources: trackResources,
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
