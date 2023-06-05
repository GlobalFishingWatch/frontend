import { ApiEvent, EventTypes } from '@globalfishingwatch/api-types'
import { BaseDeckLayerGenerator } from './base'

export interface VesselDeckLayersGenerator extends BaseDeckLayerGenerator {
  color: string
  trackUrl: string
  eventsUrls: string[]
  eventsData: ApiEvent[] | []
  visibleEvents?: EventTypes[]
}
