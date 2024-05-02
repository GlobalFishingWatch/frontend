import { DeckLayerPickingObject, DrawPickingObject } from '@globalfishingwatch/deck-layers'
import { RulerPickingObject } from '@globalfishingwatch/deck-layers'

export const isRulerLayerPoint = (feature: DeckLayerPickingObject) =>
  feature.category === 'rulers' && (feature as RulerPickingObject).geometry?.type === 'Point'

export const isDrawFeature = (feature: DeckLayerPickingObject) =>
  feature.category === 'draw' && (feature as DrawPickingObject).geometry?.type === 'Polygon'

export const getDefaultCursor = ({
  features,
  isDragging,
}: {
  features: DeckLayerPickingObject[] | undefined
  isDragging: boolean
}) => {
  if (features?.length) {
    return 'pointer'
  }
  if (isDragging) {
    return 'grabbing'
  }
  return 'grab'
}
