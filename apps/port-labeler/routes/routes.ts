import type { Dispatch } from 'redux'
import type { RoutesMap, Options } from 'redux-first-router';
import { NOT_FOUND, redirect, connectRoutes } from 'redux-first-router'

export const PATH_BASENAME =
  process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'production'
    ? '/map'
    : ''

export const HOME = 'HOME'
export type ROUTE_TYPES = typeof HOME

export const routesMap: RoutesMap = {
  [HOME]: {
    path: '/',
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }) as any)
    },
  },
}

const routesOptions: Options = {
  basename: PATH_BASENAME,
}

export default connectRoutes(routesMap, routesOptions)
