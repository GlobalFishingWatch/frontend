import { parse,stringify } from 'qs'
import type { Dispatch } from 'redux'
import type {
  NavigationAction,  Options,
  RoutesMap,
  StateGetter} from 'redux-first-router';
import {
  connectRoutes,
  NOT_FOUND,
  redirect} from 'redux-first-router'

import { BASE_URL } from 'data/constants'
import { fetchPsmaThunk } from 'features/psma/psma.slice'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import type { AppActions, AppState } from 'types/redux.types'

export const PATH_BASENAME = BASE_URL

type Dictionary<T> = Record<string, T>

export const HOME = 'HOME'
export const LOGIN = 'LOGIN'
export const PROFILE = 'PROFILE'
export const WORKSPACE_ROUTES = [HOME, PROFILE]
export const SETTINGS = 'SETTINGS'

export type ROUTE_TYPES = typeof HOME | typeof PROFILE | typeof SETTINGS

const thunk = async (
  dispatch: Dispatch<AppActions | NavigationAction>,
  getState: StateGetter<AppState>
) => {}

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
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }) as any)
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
