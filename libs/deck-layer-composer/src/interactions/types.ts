import { DeckLayerPickingObject } from '@globalfishingwatch/deck-layers'

export type InteractionEvent = {
  type: 'click' | 'hover'
  features?: DeckLayerPickingObject[]
  latitude: number
  longitude: number
  point: { x: number; y: number }
}
