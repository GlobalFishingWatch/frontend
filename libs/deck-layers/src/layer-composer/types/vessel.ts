import { EventTypes } from '@globalfishingwatch/api-types'
import { VesselDeckLayersEventData } from '../../loaders/vessels/eventsLoader'
import { BaseDeckLayerGenerator } from './base'

export interface VesselDeckLayersEvent {
  url?: string
  data?: VesselDeckLayersEventData[] | []
}

export interface VesselDeckLayersGenerator extends BaseDeckLayerGenerator {
  color: string
  trackUrl: string
  events: VesselDeckLayersEvent[]
  visibleEvents?: EventTypes[]
}
