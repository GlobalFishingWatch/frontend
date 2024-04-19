import { DatasetTypes, EventTypes } from '@globalfishingwatch/api-types'
import { VesselLayerProps, getUTCDateTime, hexToDeckColor } from '@globalfishingwatch/deck-layers'
import { API_GATEWAY, GFWAPI } from '@globalfishingwatch/api-client'
import {
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
} from '@globalfishingwatch/dataviews-client'
import { DeckResolverFunction } from './types'

export const resolveDeckVesselLayerProps: DeckResolverFunction<VesselLayerProps> = (
  dataview,
  globalConfig
) => {
  const trackUrl = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)?.url

  return {
    id: dataview.id,
    visible: dataview.config?.visible ?? true,
    category: dataview.category!,
    name: dataview.config?.name!,
    endTime: getUTCDateTime(globalConfig.end!).toMillis(),
    startTime: getUTCDateTime(globalConfig.start!).toMillis(),
    ...(trackUrl && {
      trackUrl: GFWAPI.generateUrl(trackUrl, { absolute: true }),
    }),
    singleTrack: dataview.config?.singleTrack,
    color: hexToDeckColor(dataview.config?.color!),
    events: resolveDataviewDatasetResources(dataview, DatasetTypes.Events).map((resource) => {
      const eventType = resource.dataset?.subcategory as EventTypes
      return {
        type: eventType,
        url: `${API_GATEWAY}${resource.url}`,
      }
    }),
    visibleEvents: globalConfig.visibleEvents,
    // clickedFeatures,
    ...(dataview.config?.filters?.['speed']?.length && {
      minSpeedFilter: parseFloat(dataview.config?.filters?.['speed'][0]),
      maxSpeedFilter: parseFloat(dataview.config?.filters?.['speed'][1]),
    }),
    ...(dataview.config?.filters?.['elevation']?.length && {
      minElevationFilter: parseFloat(dataview.config?.filters?.['elevation'][0]),
      maxElevationFilter: parseFloat(dataview.config?.filters?.['elevation'][1]),
    }),
    ...(globalConfig.highlightedTime?.start && {
      highlightStartTime: getUTCDateTime(globalConfig.highlightedTime?.start).toMillis(),
    }),
    ...(globalConfig.highlightedTime?.end && {
      highlightEndTime: getUTCDateTime(globalConfig.highlightedTime?.end).toMillis(),
    }),
  }
}
