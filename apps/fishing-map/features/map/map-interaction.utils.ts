import { DeckLayerPickingObject, DrawPickingObject } from '@globalfishingwatch/deck-layers'

export const isRulerLayerPoint = (pickingObject: DeckLayerPickingObject) =>
  pickingObject.category === 'rulers'

export const isDrawFeature = (feature: DeckLayerPickingObject) =>
  feature.category === 'draw' && (feature as DrawPickingObject).geometry?.type === 'Polygon'
