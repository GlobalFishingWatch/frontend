import { EventTypes } from '@globalfishingwatch/api-types'
import { BaseDeckLayerGenerator } from './base'

export interface VesselDeckLayersEvent {
  type: EventTypes
  url: string
}

export interface VesselDeckLayersGenerator extends BaseDeckLayerGenerator {
  name: string
  color: string
  trackUrl: string
  events: VesselDeckLayersEvent[]
  visibleEvents?: EventTypes[]
}
