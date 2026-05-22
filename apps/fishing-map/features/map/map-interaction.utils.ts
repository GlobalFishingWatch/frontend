import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type {
  ContextPickingObject,
  DeckLayerPickingObject,
  FourwingsClusterPickingObject,
  FourwingsPositionsPickingObject,
  VesselEventPickingObject,
  VesselTrackPickingObject,
} from '@globalfishingwatch/deck-layers'

import { TrackCategory } from 'features/app/analytics.hooks'
import { getContextValue } from 'features/map/popups/map-popups.utils'

import type { SliceExtendedFourwingsPickingObject } from './map.slice'

export const isTilesClusterLayer = (pickingObject: DeckLayerPickingObject) =>
  pickingObject.subcategory === DataviewType.FourwingsTileCluster

export const isTilesClusterLayerCluster = (pickingObject: FourwingsClusterPickingObject) =>
  pickingObject?.properties?.value > 1 && pickingObject?.properties?.cluster_id !== undefined

export const isRulerLayerPoint = (pickingObject: DeckLayerPickingObject) =>
  pickingObject.category === 'rulers'

export const isTrackSegment = (pickingObject: DeckLayerPickingObject) =>
  pickingObject.subcategory === DataviewType.Track &&
  (pickingObject as VesselTrackPickingObject).interactionType === 'segment'

export const getAnalyticsEvent = (feature: DeckLayerPickingObject) => {
  const category = feature.category
  let eventLabel = ''
  switch (category) {
    case DataviewCategory.Activity:
    case DataviewCategory.Detections:
      if ((feature as SliceExtendedFourwingsPickingObject).visualizationMode === 'positions') {
        eventLabel = `visualization_mode: positions | vessel_name: ${feature.title} | vessel_id: ${
          (feature as FourwingsPositionsPickingObject).properties.id
        }`
      } else {
        eventLabel = `visualization_mode: ${
          (feature as SliceExtendedFourwingsPickingObject).visualizationMode
        } | time_interval: ${(feature as SliceExtendedFourwingsPickingObject).interval}`
      }
      break
    case DataviewCategory.Vessels:
      eventLabel = `event_type: ${(feature as VesselEventPickingObject).type} | vessel_id: ${
        (feature as VesselEventPickingObject).vesselId
      }`
      break
    case DataviewCategory.Events:
      eventLabel = `event_type: ${(feature as FourwingsClusterPickingObject).eventType} | datasetId : ${(feature as FourwingsClusterPickingObject).datasetId}`
      break
    case DataviewCategory.Context:
    case DataviewCategory.User:
      eventLabel = `${getContextValue(feature as ContextPickingObject)}`
      break
    case DataviewCategory.Workspaces:
      eventLabel = `${(feature as ContextPickingObject).properties.category} | ${
        (feature as ContextPickingObject).properties.label
      }`
      break
    default:
      break
  }
  return {
    category: `Map click on ${feature.category}`,
    action: TrackCategory.MapInteraction,
    label: eventLabel,
  }
}
