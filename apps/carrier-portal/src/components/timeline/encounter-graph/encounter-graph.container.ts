import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { AppState, AppActions } from 'types/redux.types'
import { getEventFilters } from 'redux-modules/router/route.selectors'
import {
  getEncounterEventVesselId,
  getEncounterEventTimestamp,
} from 'redux-modules/vessel/vessel.selectors'
import { Event } from 'types/api/models'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import EncounterGraph from './encounter-graph'

const mapStateToProps = (state: AppState) => {
  return {
    encounterVesselId: getEncounterEventVesselId(state),
    timestamp: getEncounterEventTimestamp(state),
    filters: getEventFilters(state),
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  goToEncounteredVessel: (event: Event) => {
    if (event) {
      const { start, vessel } = event
      dispatch(updateQueryParams({ vessel: vessel.id, timestamp: start }))
    }
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(EncounterGraph)
