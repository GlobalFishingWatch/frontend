import {
  ContextLayer,
  ContextPickingObject,
  FourwingsLayer,
  FourwingsPickingObject,
} from '@globalfishingwatch/deck-layers'
import { VALUE_MULTIPLIER } from '@globalfishingwatch/fourwings-aggregate'
import { DeckLayerInteractionFeature, DeckLayerInteractionPickingInfo } from '../types'

export const filterUniqueFeatureInteraction = (features: DeckLayerInteractionFeature[]) => {
  const uniqueLayerIdFeatures: Record<string, string> = {}
  const filtered = features?.filter(({ layerId, id, uniqueFeatureInteraction }) => {
    if (!uniqueFeatureInteraction) {
      return true
    }
    if (uniqueLayerIdFeatures[layerId] === undefined) {
      uniqueLayerIdFeatures[layerId] = id
      return true
    }
    return uniqueLayerIdFeatures[layerId] === id
  })
  return filtered
}
