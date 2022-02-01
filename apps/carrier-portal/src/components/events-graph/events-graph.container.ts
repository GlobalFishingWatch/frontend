import { connect } from 'react-redux'
import { AppState } from 'types/redux.types'
import { getEventType } from 'redux-modules/router/route.selectors'
import { ENCOUNTER_TYPES } from 'data/constants'
import EventsGraph from './events-graph'

const mapStateToProps = (state: AppState) => ({
  encounterTypes: Object.values(ENCOUNTER_TYPES),
  eventType: getEventType(state),
})

export default connect(mapStateToProps)(EventsGraph)
