import { DeckLayerInteractionFeature } from '../types'

export type InteractionEvent = {
  type: 'click' | 'hover'
  features?: DeckLayerInteractionFeature[]
  latitude: number
  longitude: number
  point: { x: number; y: number }
}
