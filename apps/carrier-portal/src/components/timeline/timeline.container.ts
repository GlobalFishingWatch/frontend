import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { AppState, AppActions } from 'types/redux.types'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import {
  getEndDate,
  getStartDate,
  getTimestamp,
  isDefaultStartDate,
} from 'redux-modules/router/route.selectors'
import { Event } from 'types/api/models'
import {
  getVesselTimelineEvents,
  getVesselEventsLoaded,
} from 'redux-modules/vessel/vessel.selectors'
import Timeline from './timeline'

const mapStateToProps = (state: AppState) => {
  return {
    events: getVesselTimelineEvents(state),
    startDate: getStartDate(state),
    endDate: getEndDate(state),
    isDefaultStartDate: isDefaultStartDate(state),
    eventsLoaded: getVesselEventsLoaded(state),
    timestamp: getTimestamp(state),
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  onEventChange: (event: Event | null) => {
    if (!event) {
      dispatch(updateQueryParams({ timestamp: undefined }))
    } else {
      const { start: timestamp, position } = event
      if (timestamp && position) {
        dispatch(updateQueryParams({ timestamp, latitude: position.lat, longitude: position.lon }))
      }
    }
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Timeline)
