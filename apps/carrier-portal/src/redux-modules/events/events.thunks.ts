import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import { stringify } from 'qs'
import { AppState } from 'types/redux.types'
import {
  getEventType,
  getDateRange,
  getEventFilters,
  hasVesselSelected,
  getDataset,
} from 'redux-modules/router/route.selectors'
import { fetchAPI } from 'data/api'
import { EventTypes, Event } from 'types/api/models'
import { getDatasetLoaded } from 'redux-modules/app/app.selectors'
import { parseEvent } from 'utils/events'
import { getCurrentEvents, getCurrentEventsFilters } from './events.selectors'
import { fetchEventsInit, fetchEventsComplete, fetchEventsError } from './events.actions'
// import isEqual from 'lodash/isEqual'

export const eventsThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const eventType: EventTypes = getEventType(state)
  const hasVessel = hasVesselSelected(state)

  if (hasVessel) return null

  const events = getCurrentEvents(state)
  const eventFilters = getCurrentEventsFilters(state)

  const { rfmos, ports, flags, donorFlags } = getEventFilters(state)
  const { start, end } = getDateRange(state)

  const isEventLoaded = events !== null && events !== undefined && events.loaded === true
  const isEventsLoading = events !== null && events !== undefined && events.loading === true
  // only request again if the new dates range are bigger than actual one
  const hasDateRangeChanged =
    eventFilters !== null ? eventFilters.startDate > start || eventFilters.endDate < end : false

  // const hasRfmoChanged = eventFilters !== null ? !isEqual(eventFilters.rfmos, rfmos) : false
  // const hasFlagChanged = eventFilters !== null ? !isEqual(eventFilters.flags, flags) : false
  // const hasPortChanged = eventFilters !== null ? !isEqual(eventFilters.ports, ports) : false
  // const hasFilterChanged = hasDateRangeChanged || hasRfmoChanged || hasFlagChanged || hasPortChanged

  const dataset = getDataset(state)
  const datasetLoaded = getDatasetLoaded(state)
  if ((dataset && datasetLoaded && !isEventLoaded && !isEventsLoading) || hasDateRangeChanged) {
    const filters = { startDate: start, endDate: end, rfmos, ports, flags, donorFlags }
    dispatch(fetchEventsInit({ type: eventType, filters }))
    try {
      const params = stringify(
        {
          timeFormat: 'timestamp',
          types: eventType,
          startDate: start,
          endDate: end,
          // Done in the frontend for now
          // ...(rfmos && { rfmos }),
          // ...(flags && { flags }),
          // ...(ports && { ports }),
        },
        { arrayFormat: 'comma' }
      )

      const data = await fetchAPI<Event[]>(`/datasets/${dataset}/events?${params}`, dispatch)
      if (data) {
        const dataParsed = data.map((event) => parseEvent(event, true))
        dispatch(fetchEventsComplete({ eventType, data: dataParsed }))
      } else {
        throw new Error('No events data')
      }
    } catch (e) {
      dispatch(fetchEventsError({ eventType, error: (e && e.msg) || 'Error fetching events' }))
    }
  }
}
