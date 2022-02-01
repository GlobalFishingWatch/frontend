import { NOT_FOUND, RoutesMap, StateGetter, redirect, NavigationAction } from 'redux-first-router'
import { Dispatch } from 'redux'
import { parse } from 'qs'
import { AppState, AppActions } from 'types/redux.types'
import { trackThunk, encounterTrackThunk } from 'redux-modules/tracks/tracks.thunks'
import { eventsThunk } from 'redux-modules/events/events.thunks'
import { vesselEventsThunk, vesselDetailsThunk } from 'redux-modules/vessel/vessel.thunks'
import { datasetThunk, configThunk } from 'redux-modules/app/app.thunks'
import { checkuserLoggedThunk } from 'redux-modules/user/user.thunks'
import { getLocationType, getLocationQuery } from 'redux-modules/router/route.selectors'

export const HOME = 'HOME'
export const LOGIN = 'LOGIN'

export type PageTypes = typeof HOME | typeof LOGIN

const preFetchThunks = [
  datasetThunk,
  configThunk,
  trackThunk,
  encounterTrackThunk,
  eventsThunk,
  vesselDetailsThunk,
  vesselEventsThunk,
]

const thunk = async (
  dispatch: Dispatch<AppActions | NavigationAction>,
  getState: StateGetter<AppState>
) => {
  const locationType = getLocationType(getState())
  const logged = await checkuserLoggedThunk(dispatch, getState)
  if (logged) {
    const query = getLocationQuery(getState())
    if (locationType === LOGIN || (query && (query.state || query['access-token']))) {
      const prevQueryState: any = query && query.state ? parse(window.atob(query.state)) : {}
      dispatch(
        redirect({
          type: HOME,
          query: { ...prevQueryState, 'access-token': undefined, state: undefined },
        })
      )
    }
    preFetchThunks.forEach((thunk) => thunk(dispatch, getState))
  } else {
    if (locationType !== LOGIN) {
      dispatch(redirect({ type: LOGIN }))
    }
  }
}

const routesMap: RoutesMap = {
  [HOME]: {
    path: '/',
    thunk,
  },
  [LOGIN]: {
    path: '/login',
    thunk,
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }))
    },
  },
}

export default routesMap
