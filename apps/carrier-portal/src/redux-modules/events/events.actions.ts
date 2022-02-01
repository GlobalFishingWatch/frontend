import { createAction } from 'typesafe-actions'
import { EventTypes, Event } from 'types/api/models'
import { EventType } from 'types/app.types'
import { EventsReducerFilters } from './events.reducer'

export const fetchEventsInit = createAction('FETCH_EVENTS_INIT')<{
  type: EventTypes
  filters: EventsReducerFilters
}>()

export const fetchEventsComplete = createAction('FETCH_EVENTS_COMPLETE')<{
  eventType: EventTypes
  data: Event[]
}>()

export const fetchEventsError = createAction('FETCH_EVENTS_ERROR')<{
  eventType: EventTypes
  error: string
}>()

export const clearEventsError = createAction('CLEAR_EVENTS_ERROR')<EventType>()

const eventActions = {
  fetchEventsInit,
  fetchEventsComplete,
  fetchEventsError,
  clearEventsError,
}

export default eventActions
