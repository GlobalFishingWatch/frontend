import { Dispatch } from 'redux'
import { NOT_FOUND, RoutesMap, redirect, connectRoutes, Options } from 'redux-first-router'

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
      dispatch(redirect({ type: HOME }))
    },
  },
}

const routesOptions: Options = {
  basename: PATH_BASENAME,
}

export default connectRoutes(routesMap, routesOptions)
