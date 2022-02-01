import { createReducer } from 'typesafe-actions'
import { Event, Vessel } from 'types/api/models'
import {
  fetchVesselEventsInit,
  fetchVesselEventsComplete,
  fetchVesselEventsError,
  fetchVesselDetailsInit,
  fetchVesselDetailsComplete,
  fetchVesselDetailsError,
} from './vessel.actions'

interface VesselReducerItem {
  details: {
    loading: boolean
    error: string | null
    data: Vessel | null
  }
  events: {
    loading: boolean
    startDate: string | null
    endDate: string | null
    error: string | null
    data: Event[] | null
  }
}

interface VesselReducer {
  [key: string]: VesselReducerItem
}
const initialState: VesselReducer = {}

export default createReducer(initialState)
  .handleAction(fetchVesselDetailsInit, (state, action) => {
    const vessel = state[action.payload]

    const details = {
      loading: true,
      error: null,
      data: null,
    }
    return { ...state, [action.payload]: { ...vessel, details } }
  })
  .handleAction(fetchVesselDetailsComplete, (state, action) => {
    const { data, id } = action.payload
    const vessel = state[id]
    const details = {
      ...vessel.details,
      loading: false,
      data,
    }
    return { ...state, [id]: { ...vessel, details } }
  })
  .handleAction(fetchVesselDetailsError, (state, action) => {
    const { error, id } = action.payload
    const vessel = state[id]
    const details = {
      ...vessel.details,
      loading: false,
      details: null,
      error,
    }
    return { ...state, [id]: { ...vessel, details } }
  })
  .handleAction(fetchVesselEventsInit, (state, action) => {
    const { id, startDate, endDate } = action.payload
    const vessel = state[id]
    const events = {
      startDate,
      endDate,
      data: null,
      loading: true,
      error: null,
    }
    return { ...state, [id]: { ...vessel, events } }
  })
  .handleAction(fetchVesselEventsComplete, (state, action) => {
    const { data, id } = action.payload
    const vessel = state[id]
    const events = {
      ...vessel.events,
      loading: false,
      data,
    }
    return { ...state, [id]: { ...vessel, events } }
  })
  .handleAction(fetchVesselEventsError, (state, action) => {
    const { error, id } = action.payload
    const vessel = state[id]
    const events = {
      ...vessel.events,
      loading: false,
      error,
    }
    return { ...state, [id]: { ...vessel, events } }
  })
