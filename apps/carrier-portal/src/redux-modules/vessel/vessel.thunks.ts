import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import { stringify } from 'qs'
import { AppState } from 'types/redux.types'
import { getVesselId, getDateRange, getDataset } from 'redux-modules/router/route.selectors'
import { fetchAPI } from 'data/api'
import { getDatasetLoaded } from 'redux-modules/app/app.selectors'
import { Event, Vessel } from 'types/api/models'
import { parseEvent } from 'utils/events'
import { getVesselEvents, getVesselDetails } from './vessel.selectors'
import {
  fetchVesselEventsInit,
  fetchVesselEventsComplete,
  fetchVesselEventsError,
  fetchVesselDetailsInit,
  fetchVesselDetailsError,
  fetchVesselDetailsComplete,
} from './vessel.actions'

export const vesselDetailsThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const vesselId = getVesselId(state)
  const vesselDetails = getVesselDetails(state)
  const dataset = getDataset(state)
  const isDatasetLoaded = getDatasetLoaded(state)

  if (dataset && isDatasetLoaded && vesselId) {
    const isVesselLoaded = vesselDetails !== null
    const isDetailsLoading = vesselDetails && vesselDetails.loading === true
    if (!isVesselLoaded && !isDetailsLoading) {
      dispatch(fetchVesselDetailsInit(vesselId))
      try {
        const data = await fetchAPI<Vessel>(`/datasets/${dataset}/vessels/${vesselId}`, dispatch)
        if (data) {
          const vessel = {
            ...data,
            ...(data.flags && {
              flags: data.flags.map((f) => ({ ...f, value: f.value === 'TWN' ? 'TAI' : f.value })),
            }),
          }
          dispatch(fetchVesselDetailsComplete({ id: vesselId, data: vessel }))
        } else {
          throw new Error('No vessel info data')
        }
      } catch (e) {
        dispatch(fetchVesselDetailsError({ id: vesselId, error: e.msg || 'Something went wrong' }))
      }
    }
  }
}

export const vesselEventsThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const vesselId = getVesselId(state)
  if (vesselId) {
    const { start, end } = getDateRange(state)
    const vesselEvents = getVesselEvents(state)

    const isVesselLoaded = vesselEvents !== null
    const isEventsLoading = vesselEvents && vesselEvents.loading === true
    const hasDateRangeChanged = vesselEvents
      ? vesselEvents.startDate !== start || vesselEvents.endDate !== end
      : false

    const dataset = getDataset(state)
    const isDatasetLoaded = getDatasetLoaded(state)
    if (
      (dataset && isDatasetLoaded && !isVesselLoaded && !isEventsLoading) ||
      hasDateRangeChanged
    ) {
      dispatch(fetchVesselEventsInit({ id: vesselId, startDate: start, endDate: end }))
      try {
        const params = stringify(
          {
            vessels: vesselId,
            startDate: start,
            endDate: end,
            timeFormat: 'timestamp',
            sortOrder: 'desc',
          },
          { arrayFormat: 'comma' }
        )
        const data = await fetchAPI<Event[]>(`/datasets/${dataset}/events?${params}`, dispatch)
        if (data) {
          const events = data.map((event) => parseEvent(event, false))
          dispatch(fetchVesselEventsComplete({ id: vesselId, data: events }))
        } else {
          throw new Error('No vessel events data')
        }
      } catch (e) {
        dispatch(fetchVesselEventsError({ id: vesselId, error: e.msg || 'Something went wrong' }))
      }
    }
  }
}
