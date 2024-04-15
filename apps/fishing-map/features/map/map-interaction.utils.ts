import { DeckLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { RulerPickingObject } from '@globalfishingwatch/deck-layers'

export const isRulerLayerPoint = (feature: DeckLayerPickingObject) =>
  feature.category === 'rulers' && (feature as RulerPickingObject).geometry?.type === 'Point'
