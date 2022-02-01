import { createSelector } from 'reselect'
import { AppState } from 'types/redux.types'
import { getEventFilters, getTimestamp, getVesselId } from 'redux-modules/router/route.selectors'
import { isEventActive, calculateEventsStats } from 'utils/events'
import { EVENT_TYPES } from 'data/constants'
import { Vessel, EventVessel } from 'types/api/models'

export const getVessels = (state: AppState) => state.vessel

export const getVesselDetails = createSelector([getVessels, getVesselId], (vessels, vesselId) => {
  if (!vesselId || !vessels) return null
  return vessels[vesselId] && vessels[vesselId].details !== undefined
    ? vessels[vesselId].details
    : null
})

export const getVesselEvents = createSelector([getVessels, getVesselId], (vessels, vesselId) => {
  if (!vesselId || !vessels) return null
  return vessels[vesselId] && vessels[vesselId].events !== undefined
    ? vessels[vesselId].events
    : null
})

export const getVesselDetailsLoading = createSelector([getVesselDetails], (vesselDetails) => {
  return vesselDetails ? vesselDetails.loading : true
})

export const getVesselDetailsError = createSelector([getVesselDetails], (vesselDetails) => {
  return vesselDetails?.error
})

export const getVesselDetailsData = createSelector(
  [getVesselDetails],
  (vesselDetails): Vessel | null => {
    if (!vesselDetails) return null
    return vesselDetails.data || null
  }
)

export const getVesselDetailsLoaded = createSelector(
  [getVesselDetailsData, getVesselDetailsLoading],
  (data, loading) => {
    return data !== null && loading === false
  }
)

export const getVesselWithLabel = createSelector([getVesselDetailsData], (vessel) => {
  if (!vessel) return null
  return { id: vessel.id, label: vessel.name }
})

// needed to be able to use a selector in another selector which has been imported first
// https://github.com/reduxjs/reselect/issues/169#issuecomment-274690285
export function getVesselWithLabelFn(state: AppState) {
  return getVesselWithLabel(state)
}

export const getVesselEventsData = createSelector([getVesselEvents], (vesselEvents) => {
  if (!vesselEvents) return null
  return vesselEvents.data || null
})

export const getVesselEventsLoading = createSelector([getVesselEvents], (vesselEvents) => {
  return vesselEvents ? vesselEvents.loading : true
})

export const getVesselEventsLoaded = createSelector(
  [getVesselEventsData, getVesselEventsLoading],
  (data, loading) => {
    return data !== null && loading === false
  }
)

export const getVesselEventsDataFiltered = createSelector(
  [getVesselEventsData, getEventFilters],
  (events, filters) => {
    if (!events) return null
    return events.filter((event) => {
      return !!event.start && !!event.end && isEventActive(event, filters)
    })
  }
)

export const getVesselTimelineEvents = createSelector([getVesselEventsDataFiltered], (events) => {
  return events ? events : []
})

export const getVesselEventsStats = createSelector([getVesselTimelineEvents], (events) => {
  return events ? calculateEventsStats(events) : null
})

export const getCurrentEventByTimestamp = createSelector(
  [getVesselEventsDataFiltered, getTimestamp],
  (events, timestamp) => {
    if (!events || !timestamp) return null

    const event = events.find((e) => e.start === timestamp)

    return event || null
  }
)

// needed to be able to use a selector in another selector which has been imported first
// https://github.com/reduxjs/reselect/issues/169#issuecomment-274690285
export function getCurrentEventByTimestampFn(state: AppState) {
  return getCurrentEventByTimestamp(state)
}

export const getCurrentEventDates = createSelector([getCurrentEventByTimestamp], (currentEvent) => {
  if (!currentEvent) return null
  const { start, end } = currentEvent
  return start && end ? { start, end } : null
})

export const getEncounterEventVessel = createSelector(
  [getCurrentEventByTimestamp],
  (event): EventVessel | null => {
    if (!event || event.type !== EVENT_TYPES.encounter) return null
    return (event.encounter && event.encounter.vessel) || null
  }
)

export const getEncounterEventVesselId = createSelector(
  [getEncounterEventVessel],
  (encounterVessel) => {
    if (!encounterVessel) return null

    return encounterVessel.id || null
  }
)

export const getEncounterEventTimestamp = createSelector([getCurrentEventByTimestamp], (event) => {
  if (!event || event.type !== EVENT_TYPES.encounter) return null

  return event.start
})
