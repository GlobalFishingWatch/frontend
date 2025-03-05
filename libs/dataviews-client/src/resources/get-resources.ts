import type {
  DataviewDatasetConfig,
  DataviewDatasetConfigParam,
  Resource} from '@globalfishingwatch/api-types';
import {
  DatasetTypes,
  DataviewType,
  EndpointId
} from '@globalfishingwatch/api-types'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'

import type {
  UrlDataviewInstance} from '../resolve-dataviews';
import {
  getDatasetConfigByDatasetType,
  getDatasetConfigsByDatasetType
} from '../resolve-dataviews'

export type GetDatasetConfigCallback = (
  datasetConfig: DataviewDatasetConfig[],
  dataview?: UrlDataviewInstance
) => DataviewDatasetConfig[]

export type GetDatasetConfigsCallbacks = {
  track?: GetDatasetConfigCallback
  info?: GetDatasetConfigCallback
  events?: GetDatasetConfigCallback
}

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

export const extendDataviewDatasetConfig = (
  dataviews: UrlDataviewInstance[],
  callbacks: GetDatasetConfigsCallbacks
) => {
  const { trackDataviews, otherDataviews } = splitTrackDataviews(dataviews)
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
        ? trackDatasetConfig?.params?.find((p) => p.id === 'vesselId')?.value !== undefined
        : trackDatasetConfig?.params?.find((p) => p.id === 'id')?.value !== undefined
    // Cleaning track resources with no data as now now the track is hidden for guest users in VMS full- datasets
    const track = hasTrackData ? trackDatasetConfig : ({} as DataviewDatasetConfig)

    const events = getDatasetConfigsByDatasetType(dataview, DatasetTypes.Events).filter(
      (datasetConfig) => datasetConfig.query?.find((q) => q.id === 'vessels')?.value
    ) // Loitering

    let preparedInfoDatasetConfigs = [info]
    let preparedTrackDatasetConfigs = [track]
    let preparedEventsDatasetConfigs = events

    if (callbacks.info && preparedInfoDatasetConfigs?.length > 0) {
      preparedInfoDatasetConfigs = callbacks.info(preparedInfoDatasetConfigs, dataview)
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

export const _getLegacyResources = (
  dataviews: UrlDataviewInstance[],
  callbacks: GetDatasetConfigsCallbacks
): { resources: Resource[]; dataviews: UrlDataviewInstance[] } => {
  const { trackDataviews, otherDataviews } = dataviews.reduce(
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
        ? trackDatasetConfig?.params?.find((p) => p.id === 'vesselId')?.value !== undefined
        : trackDatasetConfig?.params?.find((p) => p.id === 'id')?.value !== undefined
    // Cleaning track resources with no data as now now the track is hidden for guest users in VMS full- datasets
    const track = hasTrackData ? trackDatasetConfig : ({} as DataviewDatasetConfig)

    const events = getDatasetConfigsByDatasetType(dataview, DatasetTypes.Events).filter(
      (datasetConfig) => datasetConfig.query?.find((q) => q.id === 'vessels')?.value
    ) // Loitering

    let preparedInfoDatasetConfigs = [info]
    let preparedTrackDatasetConfigs = [track]
    let preparedEventsDatasetConfigs = events

    if (callbacks.info && preparedInfoDatasetConfigs?.length > 0) {
      preparedInfoDatasetConfigs = callbacks.info(preparedInfoDatasetConfigs, dataview)
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

  // resolve urls for vessels info (tracks and events are fetched within the Deck layers)
  const trackResources = trackDataviewsWithDatasetConfigs.flatMap((dataview) => {
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
