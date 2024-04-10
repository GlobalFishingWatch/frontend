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
  globalConfig,
  interactions
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
    color: hexToDeckColor(dataview.config?.color!),
    events: resolveDataviewDatasetResources(dataview, DatasetTypes.Events).map((resource) => {
      const eventType = resource.dataset?.subcategory as EventTypes
      return {
        type: eventType,
        url: `${API_GATEWAY}${resource.url}`,
      }
    }),
    // hoveredFeatures: interactions,
    // clickedFeatures,
    // highlightEndTime,
    // highlightStartTime,
    // highlightEventIds,
    visibleEvents: globalConfig.visibleEvents,
    // eventsResource: eventsData?.length ? parseEvents(eventsData) : [],
  }
}
