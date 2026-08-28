import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import type {
  ContextPickingObject,
  DeckLayerPickingObject,
  FourwingsClusterPickingObject,
  FourwingsPositionsPickingObject,
  VesselEventPickingObject,
  VesselTrackPickingObject,
} from '@globalfishingwatch/deck-layers'

import { getContextValue } from 'features/_map/map/popups/map-popups.utils'
import { TrackCategory } from 'features/app/analytics.hooks'

import type {
  SliceExtendedFeature,
  SliceExtendedFourwingsPickingObject,
  SliceInteractionEvent,
} from './map.slice'

export const getSliceInteractionEvent = (deckEvent: InteractionEvent): SliceInteractionEvent =>
  ({
    features: deckEvent.features?.map((feature: any) => {
      if (feature.tile) {
        const { x, y, z } = feature.tile
        return { ...feature, tile: { x, y, z } }
      }
      return feature
    }),
    latitude: deckEvent.latitude,
    longitude: deckEvent.longitude,
    zoom: deckEvent.viewport?.zoom,
    point: { x: deckEvent.point.x, y: deckEvent.point.y },
  }) as SliceInteractionEvent

const getClickedFeatureKey = (feature: SliceExtendedFeature) =>
  `${feature.layerId}-${feature.id}-${
    (feature as SliceExtendedFourwingsPickingObject).sublayers?.map(({ id }) => id).join(',') || ''
  }`

export const getNewClickedFeatures = (
  features: SliceExtendedFeature[] = [],
  previousFeatures: SliceExtendedFeature[] = []
) => {
  const previousKeys = previousFeatures.map(getClickedFeatureKey)
  return features.filter((feature) => !previousKeys.includes(getClickedFeatureKey(feature)))
}

export const getUpdatedClickedFeatures = (
  features: SliceExtendedFeature[] = [],
  previousFeatures: SliceExtendedFeature[] = []
) =>
  features.map((feature) => {
    const key = getClickedFeatureKey(feature)
    return previousFeatures.find((previous) => getClickedFeatureKey(previous) === key) || feature
  })

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
