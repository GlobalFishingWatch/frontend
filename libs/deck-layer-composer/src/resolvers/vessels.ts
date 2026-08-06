import { API_GATEWAY, GFWAPI } from '@globalfishingwatch/api-client'
import type { EventTypes } from '@globalfishingwatch/api-types'
import { DatasetTypes, EndpointId } from '@globalfishingwatch/api-types'
import {
  getDatasetConfigByDatasetType,
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
} from '@globalfishingwatch/dataviews-client'
import type { VesselLayerProps } from '@globalfishingwatch/deck-layers'
import { getUTCDateTime, hexToDeckColor } from '@globalfishingwatch/deck-layers/utils'

import type { DeckResolverFunction } from '../types/resolvers'

export const resolveDeckVesselLayerProps: DeckResolverFunction<VesselLayerProps> = (
  dataview,
  {
    start,
    end,
    bufferedStart,
    bufferedEnd,
    visibleEvents,
    timeMode,
    vesselTrackVisualizationMode,
    trackGraphExtent,
    vesselsColorBy,
  }
): VesselLayerProps => {
  const trackDatasetConfig = getDatasetConfigByDatasetType(dataview, {
    type: DatasetTypes.Tracks,
    endpoint: timeMode === 'realTime' ? EndpointId.TracksRealTime : EndpointId.Tracks,
  })
  const trackUrl = trackDatasetConfig
    ? resolveDataviewDatasetResource(dataview, trackDatasetConfig.datasetId)?.url
    : undefined
  const hasDataviewDatesConfig =
    dataview.config?.startDate != null &&
    dataview.config?.startDate != undefined &&
    dataview.config?.endDate != null &&
    dataview.config?.endDate != undefined
  const startTime = getUTCDateTime(
    hasDataviewDatesConfig ? (dataview.config?.startDate as string) : start
  ).toMillis()
  const endTime = getUTCDateTime(
    hasDataviewDatesConfig ? (dataview.config?.endDate as string) : end
  ).toMillis()

  const events = resolveDataviewDatasetResources(dataview, DatasetTypes.Events).map((resource) => {
    const eventType = resource.dataset?.subcategory as EventTypes
    return {
      type: eventType,
      url: `${API_GATEWAY}${resource.url}`,
    }
  })

  return {
    id: dataview.id,
    visible: dataview.config?.visible ?? true,
    category: dataview.category!,
    name: dataview.config?.name,
    endTime: endTime,
    startTime: startTime,
    ...(bufferedStart && { bufferedStartTime: getUTCDateTime(bufferedStart).toMillis() }),
    ...(bufferedEnd && { bufferedEndTime: getUTCDateTime(bufferedEnd).toMillis() }),
    showVesselIcon: dataview.config?.showVesselIcon ?? true,
    trackVisualizationMode: vesselTrackVisualizationMode || 'track',
    ...(dataview.config?.highlightEventStartTime && {
      highlightEventStartTime: getUTCDateTime(dataview.config.highlightEventStartTime).toMillis(),
    }),
    ...(dataview.config?.highlightEventEndTime && {
      highlightEventEndTime: getUTCDateTime(dataview.config.highlightEventEndTime).toMillis(),
    }),
    ...(trackUrl && {
      trackUrl: GFWAPI.generateUrl(trackUrl, { absolute: true }),
    }),
    singleTrack: dataview.config?.singleTrack,
    strictTimeRange: hasDataviewDatesConfig || timeMode === 'realTime',
    trackThinningZoomConfig: dataview.config?.trackThinningZoomConfig,
    trackGraphExtent: trackGraphExtent,
    color: hexToDeckColor(dataview.config?.color as string),
    colorBy: vesselsColorBy,
    gapSegmentThreshold: dataview.config?.gapSegmentThreshold,
    events,
    visibleEvents: visibleEvents,
    ...(dataview.config?.filters?.['speed']?.length && {
      minSpeedFilter: parseFloat(dataview.config?.filters?.['speed'][0]),
      maxSpeedFilter: parseFloat(dataview.config?.filters?.['speed'][1]),
    }),
    ...(dataview.config?.filters?.['elevation']?.length && {
      minElevationFilter: parseFloat(dataview.config?.filters?.['elevation'][0]),
      maxElevationFilter: parseFloat(dataview.config?.filters?.['elevation'][1]),
    }),
  }
}
