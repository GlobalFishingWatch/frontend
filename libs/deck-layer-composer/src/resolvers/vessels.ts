import { DatasetTypes, DataviewInstance, EventTypes } from '@globalfishingwatch/api-types'
import {
  VesselDeckLayersEvent,
  VesselLayerProps,
  getUTCDateTime,
  hexToDeckColor,
} from '@globalfishingwatch/deck-layers'
import { API_GATEWAY } from '@globalfishingwatch/api-client'
import {
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
} from '@globalfishingwatch/dataviews-client'
import { ResolverGlobalConfig } from './types'

export function resolveDeckVesselLayerProps(
  dataview: DataviewInstance,
  globalConfig: ResolverGlobalConfig
): VesselLayerProps {
  return {
    id: dataview.id,
    visible: dataview.config?.visible ?? true,
    name: dataview.config?.name,
    endTime: getUTCDateTime(globalConfig.end!).toMillis(),
    startTime: getUTCDateTime(globalConfig.start!).toMillis(),
    trackUrl: `${API_GATEWAY}${resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)?.url}`,
    color: hexToDeckColor(dataview.config?.color!),
    events: resolveDataviewDatasetResources(dataview, DatasetTypes.Events).map((resource) => {
      const eventType = resource.dataset?.subcategory as EventTypes
      return {
        type: eventType,
        url: `${API_GATEWAY}${resource.url}`,
      }
    }),
    // hoveredFeatures,
    // clickedFeatures,
    // highlightEndTime,
    // highlightStartTime,
    // highlightEventIds,
    // visibleEvents,
    // eventsResource: eventsData?.length ? parseEvents(eventsData) : [],
  }
}
