import { DeckLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { VALUE_MULTIPLIER } from '@globalfishingwatch/fourwings-aggregate'
// import { DeckLayerInteractionPickingInfo } from '../types'

// TODO: deck check if this is still needed
export const filterUniqueFeatureInteraction = (features: DeckLayerPickingObject[]) => {
  return features
  // const uniqueLayerIdFeatures: Record<string, string> = {}
  // const filtered = features?.filter(({ layerId, id, uniqueFeatureInteraction }) => {
  //   if (!uniqueFeatureInteraction) {
  //     return true
  //   }
  //   if (uniqueLayerIdFeatures[layerId] === undefined) {
  //     uniqueLayerIdFeatures[layerId] = id
  //     return true
  //   }
  //   return uniqueLayerIdFeatures[layerId] === id
  // })
  // return filtered
}
