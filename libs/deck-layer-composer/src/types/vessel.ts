import { EventTypes } from '@globalfishingwatch/api-types'
import { VesselDeckLayersEvent } from '@globalfishingwatch/deck-layers'
import { BaseDeckLayerGenerator } from './base'

export interface VesselDeckLayersGenerator extends BaseDeckLayerGenerator {
  name: string
  color: string
  trackUrl: string
  events: VesselDeckLayersEvent[]
  visibleEvents?: EventTypes[]
}
