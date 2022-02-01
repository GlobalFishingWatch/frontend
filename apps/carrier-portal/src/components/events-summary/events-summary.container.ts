import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { AppState } from 'types/redux.types'
import { getCurrentEventsInfo, getEventsLoaded } from 'redux-modules/events/events.selectors'
import { getEventType, hasVesselSelected } from 'redux-modules/router/route.selectors'
import { getVesselEventsLoaded } from 'redux-modules/vessel/vessel.selectors'
import EventsSummary from './events-summary'

export const getSummaryEventType = createSelector(
  [getEventType, hasVesselSelected],
  (eventType, vesselSelected) => {
    return vesselSelected ? 'events' : eventType
  }
)

const mapStateToProps = (state: AppState) => ({
  loading: !getVesselEventsLoaded(state) && !getEventsLoaded(state),
  eventType: getSummaryEventType(state),
  eventsInfo: getCurrentEventsInfo(state),
})

export default connect(mapStateToProps, null)(EventsSummary) as React.StatelessComponent<any>
