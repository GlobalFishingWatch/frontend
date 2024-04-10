import { DeckLayerInteractionFeature } from '@globalfishingwatch/deck-layers'
import { RulerPickingObject } from '@globalfishingwatch/deck-layers'

export const isRulerLayerPoint = (feature: DeckLayerInteractionFeature) =>
  feature.category === 'rulers' &&
  (feature as unknown as RulerPickingObject).geometry?.type === 'Point'
