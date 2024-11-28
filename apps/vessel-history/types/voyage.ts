import type { ActivityEvent } from 'types/activity'

export enum EventTypeVoyage {
  Voyage = 'voyage',
}

export interface Voyage {
  from?: ActivityEvent
  to?: ActivityEvent
  type: EventTypeVoyage
  start: number
  end: number
  timestamp: number
}

export interface RenderedVoyage extends Voyage {
  status: 'collapsed' | 'expanded'
  eventsQuantity: number
}
