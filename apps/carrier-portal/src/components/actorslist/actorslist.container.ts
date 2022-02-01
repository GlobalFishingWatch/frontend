import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { createSelector } from 'reselect'
import { AppState, AppActions } from 'types/redux.types'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { getTab, getEventType } from 'redux-modules/router/route.selectors'
import { QueryParams } from 'types/app.types'
import {
  getCurrentEventsFlags,
  getCurrentEventsPorts,
  getCurrentEventsCarriers,
} from 'redux-modules/events/events.selectors'
import { getSidebarSize } from 'redux-modules/app/app.selectors'
import ActorsList from './actorsList'

const getCurrentActorsCount = createSelector(
  [getCurrentEventsFlags, getCurrentEventsPorts, getCurrentEventsCarriers],
  (flags, ports, carriers) => {
    return {
      flags: flags !== null ? flags.length : '',
      ports: ports !== null ? ports.length : '',
      carriers: carriers !== null ? carriers.length : '',
    }
  }
)

const getCurrentActors = createSelector(
  [getTab, getCurrentEventsFlags, getCurrentEventsPorts, getCurrentEventsCarriers],
  (tab, flags, ports, carriers) => {
    const actors: { [key: string]: any } = { flags, ports, carriers }
    return actors[tab]
  }
)

const mapStateToProps = (state: AppState) => ({
  currentTab: getTab(state),
  eventType: getEventType(state),
  actors: getCurrentActors(state),
  actorsCount: getCurrentActorsCount(state),
  sidebarSize: getSidebarSize(state),
})

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  setCurrentTab: (tab: string) => dispatch(updateQueryParams({ tab })),
  setFlag: (flag: string[]) => dispatch(updateQueryParams({ flag })),
  setPort: (port: string[]) => dispatch(updateQueryParams({ port })),
  goToVesselDetail: (query: QueryParams) =>
    dispatch(updateQueryParams({ ...query, timestamp: undefined, eventType: undefined })),
})

export default connect(mapStateToProps, mapDispatchToProps)(ActorsList)
