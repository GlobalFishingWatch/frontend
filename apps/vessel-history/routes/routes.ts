import { Dispatch } from 'redux'
import {
  NOT_FOUND,
  RoutesMap,
  redirect,
  connectRoutes,
  Options,
  StateGetter,
  NavigationAction,
} from 'redux-first-router'
import { stringify, parse } from 'qs'
import { Dictionary } from '@reduxjs/toolkit'
import { AppActions, AppState } from 'types/redux.types'
import { initializeDataviews } from 'features/dataviews/dataviews.utils'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import { fetchPsmaThunk } from 'features/psma/psma.slice'
import { BASE_URL } from 'data/constants'

export const PATH_BASENAME = BASE_URL

export const HOME = 'HOME'
export const LOGIN = 'LOGIN'
export const PROFILE = 'PROFILE'
export const REPORT = 'REPORT'
export const WORKSPACE_ROUTES = [HOME, PROFILE]
export const SETTINGS = 'SETTINGS'

export type ROUTE_TYPES = typeof HOME | typeof PROFILE | typeof SETTINGS

const thunk = async (
  dispatch: Dispatch<AppActions | NavigationAction>,
  getState: StateGetter<AppState>
) => {
  initializeDataviews(dispatch)
}

const thunkRegions = async (
  dispatch: Dispatch<AppActions | NavigationAction>,
  getState: StateGetter<AppState>
) => {
  thunk(dispatch, getState)
  dispatch(fetchRegionsThunk())
  dispatch(fetchPsmaThunk())
}

export const routesMap: RoutesMap = {
  [HOME]: {
    path: '/',
    thunk,
  },
  [SETTINGS]: {
    path: '/settings',
    thunk: thunkRegions,
  },
  [LOGIN]: {
    path: '/login',
    thunk,
  },
  [PROFILE]: {
    path: '/profile/:dataset/:vesselID/:tmtID',
    thunk: thunkRegions,
  },
  [REPORT]: {
    path: '/profile/report/:start/:end/:dataset/:vesselID/:tmtID',
    thunk: thunkRegions,
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }))
    },
  },
}

const encodeWorkspace = (object: Record<string, unknown>) => {
  return stringify(object, { encode: false })
}

const decodeWorkspace = (queryString: string) => {
  const parsed = parse(queryString, { arrayLimit: 300 })

  Object.keys(parsed).forEach((param: string) => {
    const value = parsed[param]
    const transformationFn = urlToObjectTransformation[param]
    if (value && transformationFn) {
      parsed[param] = transformationFn(value)
    }
  })
  return parsed
}

const routesOptions: Options = {
  basename: PATH_BASENAME,
  querySerializer: {
    stringify: encodeWorkspace,
    parse: decodeWorkspace,
  },
}

const urlToObjectTransformation: Dictionary<(value: any) => any> = {
  latitude: (s) => parseFloat(s),
  longitude: (s) => parseFloat(s),
  zoom: (s) => parseFloat(s),
}

export default connectRoutes(routesMap, routesOptions)
