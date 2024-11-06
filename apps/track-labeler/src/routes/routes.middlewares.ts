import { Middleware } from 'redux'
import { RootState } from '../store'
import { selectUserTokenExpirationTimestamp } from '../features/user/user.slice'
import { userLoginThunk } from '../features/user/user.thunks'
import { routesMap } from './routes'
import { UpdateQueryParamsAction } from './routes.actions'

export const routerQueryMiddleware: Middleware =
  ({ getState }: { getState: () => RootState }) =>
  (next) =>
  (action: UpdateQueryParamsAction) => {
    const routesActions = Object.keys(routesMap)
    // check if action type matches a route type
    const isRouterAction = routesActions.includes(action.type)
    if (!isRouterAction) {
      next(action)
    } else {
      const newAction: UpdateQueryParamsAction = { ...action }

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
  async (action: UpdateQueryParamsAction) => {
    const routesActions = Object.keys(routesMap)
    // check if action type matches a route type
    const isRouterAction = routesActions.includes(action.type)
    if (!isRouterAction) {
      next(action)
    } else {
      const tokenExpiration = selectUserTokenExpirationTimestamp(getState())
      if (tokenExpiration && tokenExpiration - new Date().getTime() < 0) {
        // when token is expired then refresh it
        await userLoginThunk(next, getState)
      }
      next(action)
    }
  }
