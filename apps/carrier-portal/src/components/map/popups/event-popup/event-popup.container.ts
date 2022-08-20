import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { createSelector } from 'reselect'
import { AppState, AppActions } from 'types/redux.types'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { getCurrentEventsListFiltered } from 'redux-modules/events/events.selectors'
import { QueryParams } from 'types/app.types'
import EventPopup from './event-popup'

const getEventById = (id: string) =>
  createSelector([getCurrentEventsListFiltered], (events) => {
    return events ? events.find((e) => e.id === id) : undefined
  })

const mapStateToProps = (state: AppState, ownProps: { id: string }) => {
  return {
    event: getEventById(ownProps.id)(state),
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  goToVesselDetail: (query: QueryParams) => dispatch(updateQueryParams(query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EventPopup) as React.FC<any>
