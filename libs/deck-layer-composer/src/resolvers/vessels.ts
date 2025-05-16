import { API_GATEWAY, GFWAPI } from '@globalfishingwatch/api-client'
import type { EventTypes } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import {
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
} from '@globalfishingwatch/dataviews-client'
import type { VesselLayerProps } from '@globalfishingwatch/deck-layers'
import { getUTCDateTime, hexToDeckColor } from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction } from './types'

export const resolveDeckVesselLayerProps: DeckResolverFunction<VesselLayerProps> = (
  dataview,
  globalConfig
): VesselLayerProps => {
  const trackUrl = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)?.url
  const { start, end, highlightedFeatures, visibleEvents, highlightedTime } = globalConfig
  const highlightEventIds = [
    ...(globalConfig.highlightEventIds || []),
    ...(highlightedFeatures || []).map((feature) => feature.id),
  ]
  const strictTimeRange =
    dataview.config?.startDate !== undefined && dataview.config?.endDate !== undefined
  const startTime = getUTCDateTime(
    strictTimeRange ? (dataview.config?.startDate as string) : start
  ).toMillis()
  const endTime = getUTCDateTime(
    strictTimeRange ? (dataview.config?.endDate as string) : end
  ).toMillis()
  return {
    id: dataview.id,
    visible: dataview.config?.visible ?? true,
    category: dataview.category!,
    name: dataview.config?.name,
    endTime: endTime,
    startTime: startTime,
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
    strictTimeRange,
    trackThinningZoomConfig: dataview.config?.trackThinningZoomConfig,
    trackGraphExtent: globalConfig.trackGraphExtent,
    color: hexToDeckColor(dataview.config?.color as string),
    colorBy: globalConfig.vesselsColorBy,
    events: resolveDataviewDatasetResources(dataview, DatasetTypes.Events).map((resource) => {
      const eventType = resource.dataset?.subcategory as EventTypes
      return {
        type: eventType,
        url: `${API_GATEWAY}${resource.url}`,
      }
    }),
    visibleEvents: visibleEvents,
    highlightEventIds,
    ...(dataview.config?.filters?.['speed']?.length && {
      minSpeedFilter: parseFloat(dataview.config?.filters?.['speed'][0]),
      maxSpeedFilter: parseFloat(dataview.config?.filters?.['speed'][1]),
    }),
    ...(dataview.config?.filters?.['elevation']?.length && {
      minElevationFilter: parseFloat(dataview.config?.filters?.['elevation'][0]),
      maxElevationFilter: parseFloat(dataview.config?.filters?.['elevation'][1]),
    }),
    ...(highlightedTime?.start && {
      highlightStartTime: getUTCDateTime(highlightedTime?.start).toMillis(),
    }),
    ...(highlightedTime?.end && {
      highlightEndTime: getUTCDateTime(highlightedTime?.end).toMillis(),
    }),
  }
}
