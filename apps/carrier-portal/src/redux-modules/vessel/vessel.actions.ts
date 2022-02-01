import { createAction } from 'typesafe-actions'
import { Event, Vessel } from 'types/api/models'

export const fetchVesselDetailsInit = createAction('FETCH_VESSEL_DETAILS_INIT')<string>()
export const fetchVesselDetailsComplete = createAction('FETCH_VESSEL_DETAILS_COMPLETE')<{
  data: Vessel
  id: string
}>()

export const fetchVesselDetailsError = createAction('FETCH_VESSEL_DETAILS_ERROR')<{
  id: string
  error: string
}>()

export const fetchVesselEventsInit = createAction('FETCH_VESSEL_EVENTS_INIT')<{
  id: string
  startDate: string
  endDate: string
}>()

export const fetchVesselEventsComplete = createAction('FETCH_VESSEL_EVENTS_COMPLETE')<{
  data: Event[]
  id: string
}>()

export const fetchVesselEventsError = createAction('FETCH_VESSEL_EVENTS_ERROR')<{
  id: string
  error: string
}>()

const vesselActions = {
  fetchVesselDetailsInit,
  fetchVesselDetailsComplete,
  fetchVesselDetailsError,
  fetchVesselEventsInit,
  fetchVesselEventsComplete,
  fetchVesselEventsError,
}

export default vesselActions
