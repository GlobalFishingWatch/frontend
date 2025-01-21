import type { Middleware } from 'redux'

import { selectUserTokenExpirationTimestamp } from '../features/user/user.slice'
import { userLoginThunk } from '../features/user/user.thunks'
import type { RootState } from '../store'

import { routesMap } from './routes'
import type { UpdateQueryParamsAction } from './routes.actions'

export const routerQueryMiddleware: Middleware =
  ({ getState }: { getState: () => RootState }) =>
  (next) =>
  (action) => {
    const routesActions = Object.keys(routesMap)
    // check if action type matches a route type
    const isRouterAction = routesActions.includes((action as UpdateQueryParamsAction).type)
    if (!isRouterAction) {
      next(action)
    } else {
      const newAction: UpdateQueryParamsAction = { ...(action as UpdateQueryParamsAction) }

      const prevQuery = getState()?.location?.query || {}
      if (newAction.replaceQuery !== true) {
        newAction.query = {
          ...prevQuery,
          ...newAction.query,
        }
      }
      next(newAction)
    }
  }

export const routerRefreshTokenMiddleware: Middleware =
  ({ getState }: { getState: () => RootState }) =>
  (next) =>
  async (action) => {
    const routesActions = Object.keys(routesMap)
    // check if action type matches a route type
    const isRouterAction = routesActions.includes((action as UpdateQueryParamsAction).type)
    if (!isRouterAction) {
      next(action)
    } else {
      const tokenExpiration = selectUserTokenExpirationTimestamp(getState())
      if (tokenExpiration && tokenExpiration - new Date().getTime() < 0) {
        // when token is expired then refresh it
        await userLoginThunk(next as any, getState)
      }
      next(action)
    }
  }
