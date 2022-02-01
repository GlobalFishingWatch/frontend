import { createReducer } from 'typesafe-actions'
import { EventTypes, Event } from 'types/api/models'
import {
  fetchEventsInit,
  fetchEventsComplete,
  fetchEventsError,
  clearEventsError,
} from './events.actions'

export interface EventsReducerFilters {
  startDate: string
  endDate: string
  rfmos?: string[] | null
  flags?: string[] | null
  ports?: string[] | null
}

type EventsReducer = {
  [key in EventTypes]?: {
    loading: boolean
    loaded: boolean
    filters: EventsReducerFilters
    error: string
    events: Event[]
  }
}
const initialState: EventsReducer = {}

export default createReducer(initialState)
  .handleAction(fetchEventsInit, (state, action) => {
    const { type, filters } = action.payload
    const event = {
      ...state[type],
      filters: {
        ...(state[type] && (state as any)[type].filters),
        ...filters,
      },
      loaded: false,
      loading: true,
      events: null,
    }
    return { ...state, [type]: event }
  })
  .handleAction(fetchEventsComplete, (state, action) => {
    const { eventType, data } = action.payload
    const event = {
      ...state[eventType],
      loading: false,
      loaded: true,
      events: data,
    }
    return { ...state, [eventType]: event }
  })
  .handleAction(fetchEventsError, (state, action) => {
    const { eventType, error } = action.payload
    const event = {
      ...state[eventType],
      loading: false,
      loaded: true,
      events: null,
      error,
    }
    return { ...state, [eventType]: event }
  })
  .handleAction(clearEventsError, (state, action) => {
    const event = {
      ...state[action.payload],
      loading: false,
      loaded: false,
      error: '',
    }
    return { ...state, [action.payload]: event }
  })
