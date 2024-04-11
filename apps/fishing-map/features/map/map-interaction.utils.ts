import { DeckLayerInteractionFeature } from '@globalfishingwatch/deck-layer-composer'
import { RulerPickingObject } from '@globalfishingwatch/deck-layers'

export const isRulerLayerPoint = (feature: DeckLayerInteractionFeature) =>
  feature.category === 'rulers' &&
  (feature as unknown as RulerPickingObject).geometry?.type === 'Point'
