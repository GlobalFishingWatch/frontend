import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { createSelector } from 'reselect'
import { AppState, AppActions } from 'types/redux.types'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { getCurrentGraph, getEventType } from 'redux-modules/router/route.selectors'
import { GraphType } from 'types/app.types'
import { EVENT_TYPES, GRAPH_OPTIONS_ENCOUNTER, GRAPH_OPTIONS_LOITERING } from 'data/constants'
import GraphSelect from './graph-select'

const getOptions = createSelector([getEventType], (eventType) => {
  return eventType === EVENT_TYPES.encounter ? GRAPH_OPTIONS_ENCOUNTER : GRAPH_OPTIONS_LOITERING
})

const getselectedIndex = createSelector([getCurrentGraph, getOptions], (graph, options) => {
  const index = options.findIndex((option) => option.value === graph)
  return index > -1 ? index : 0
})

const mapStateToProps = (state: AppState) => ({
  options: getOptions(state),
  selectedIndex: getselectedIndex(state),
})

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  setGraph: (graph: GraphType) => dispatch(updateQueryParams({ graph })),
})

export default connect(mapStateToProps, mapDispatchToProps)(GraphSelect)
