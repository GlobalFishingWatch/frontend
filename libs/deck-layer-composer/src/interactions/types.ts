import { Viewport } from '@deck.gl/core'
import { DeckLayerPickingObject } from '@globalfishingwatch/deck-layers'

export type InteractionEventType = 'click' | 'hover' | 'dragstart'
export type InteractionEvent = {
  type: InteractionEventType
  features?: DeckLayerPickingObject[]
  latitude: number
  longitude: number
  viewport?: Viewport
  point: { x: number; y: number }
}
