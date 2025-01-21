import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type {
  ContextPickingObject,
  DeckLayerPickingObject,
  FourwingsClusterFeature,
  FourwingsClusterPickingObject,
  FourwingsPositionsPickingObject,
  VesselEventPickingObject,
} from '@globalfishingwatch/deck-layers'

import { TrackCategory } from 'features/app/analytics.hooks'

import type { SliceExtendedFourwingsPickingObject } from './map.slice'

export const isTilesClusterLayer = (pickingObject: DeckLayerPickingObject) =>
  pickingObject.subcategory === DataviewType.TileCluster ||
  pickingObject.subcategory === DataviewType.FourwingsTileCluster

export const isTilesClusterLayerCluster = (pickingObject: FourwingsClusterPickingObject) =>
  pickingObject?.properties?.value > 1 && pickingObject?.properties?.cluster_id !== undefined

export const isRulerLayerPoint = (pickingObject: DeckLayerPickingObject) =>
  pickingObject.category === 'rulers'

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
      eventLabel = `event_id: ${(feature as FourwingsClusterFeature).properties.id}`
      break
    case DataviewCategory.Context:
    case DataviewCategory.User:
      eventLabel = `${(feature as ContextPickingObject).value}`
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
