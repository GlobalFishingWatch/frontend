import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { createSelector } from 'reselect'
import { getEventType, getLayers } from 'redux-modules/router/route.selectors'
import { AppState, AppActions } from 'types/redux.types'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { EventType, LayerTypes } from 'types/app.types'
import {
  getCurrentEventsInfo,
  getEventsError,
  getEventsLoaded,
} from 'redux-modules/events/events.selectors'
import { getDatasetSupportedEvents } from 'redux-modules/app/app.selectors'
import { EVENT_TYPES, EVENT_TYPES_CONFIG } from 'data/constants'
import { clearEventsError } from 'redux-modules/events/events.actions'
import SidebarHome from './sidebar-home'

const getNumberOfEvents = createSelector([getCurrentEventsInfo], ({ totalEvents }) => {
  if (!totalEvents) return 0
  return parseInt(totalEvents)
})

const getLoiteringActive = createSelector([getDatasetSupportedEvents], (dataset) => {
  return dataset !== null && dataset.includes(EVENT_TYPES.loitering)
})

const getEventsConfig = createSelector([getLoiteringActive], (loiteringActive) => {
  return EVENT_TYPES_CONFIG.map((eventTypeConfig) => {
    return {
      ...eventTypeConfig,
      active: eventTypeConfig.id === EVENT_TYPES.loitering ? loiteringActive : true,
    }
  })
})

const mapStateToProps = (state: AppState) => {
  return {
    layers: getLayers(state),
    eventType: getEventType(state),
    eventTypesConfig: getEventsConfig(state),
    eventsError: getEventsError(state),
    eventsLoaded: getEventsLoaded(state),
    numberOfEvents: getNumberOfEvents(state),
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  setEventType: (eventType: EventType, layers: LayerTypes[]) =>
    dispatch(updateQueryParams({ eventType, layer: [...layers, eventType], graph: undefined })),
  onRefreshClick: (eventType: EventType) => {
    dispatch(clearEventsError(eventType))
    dispatch(updateQueryParams({})) // force events thunk to run
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHome)
