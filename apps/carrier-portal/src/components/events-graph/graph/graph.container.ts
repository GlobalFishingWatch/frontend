import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { AppState, AppActions } from 'types/redux.types'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { getStartDate, getEndDate, getEventType } from 'redux-modules/router/route.selectors'
import { GraphType, QueryParams } from 'types/app.types'
import { getDatasetDates, getRfmosConfigIds } from 'redux-modules/app/app.selectors'
import {
  getGraphDataByType,
  getGraphType,
  getTimeBaseUnit,
  getGraphNoDataMsg,
  getFlagType,
} from './graph.selectors'
import Graph from './graph'

const mapStateToProps = (state: AppState) => ({
  end: getEndDate(state),
  start: getStartDate(state),
  type: getGraphType(state),
  eventType: getEventType(state),
  flagType: getFlagType(state),
  data: getGraphDataByType(state),
  baseTimeUnit: getTimeBaseUnit(state),
  datasetDates: getDatasetDates(state),
  noDataMsg: getGraphNoDataMsg(state),
  allRfmos: getRfmosConfigIds(state),
})

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  setGraph: (graph: GraphType) => dispatch(updateQueryParams({ graph })),
  setFilters: (query: QueryParams) => dispatch(updateQueryParams(query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Graph)
