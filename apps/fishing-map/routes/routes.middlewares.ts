import type { RootState } from 'reducers'
import type { Dispatch,Middleware } from 'redux'
import type { QueryParam, QueryParams } from 'types'

import { ACCESS_TOKEN_STRING } from '@globalfishingwatch/api-client'

import { setLastWorkspaceVisited } from 'features/workspace/workspace.slice'
import { REPLACE_URL_PARAMS } from 'routes/routes.config'

import type { ROUTE_TYPES } from './routes'
import { routesMap, WORKSPACE_ROUTES } from './routes'
import type { UpdateQueryParamsAction } from './routes.actions'

export const routerQueryMiddleware: Middleware =
  ({ getState }: { getState: () => RootState }) =>
  (next) =>
  (action) => {
    const routerAction = action as UpdateQueryParamsAction
    const routesActions = Object.keys(routesMap)
    // check if action type matches a route type
    const isRouterAction = routesActions.includes(routerAction.type)
    if (!isRouterAction) {
      next(action)
    } else {
      const newAction: UpdateQueryParamsAction = { ...routerAction }

      const prevQuery = getState().location.query || {}
      if (newAction.replaceQuery !== true) {
        newAction.query = {
          ...prevQuery,
          ...newAction.query,
        }
        if (newAction?.query?.[ACCESS_TOKEN_STRING]) {
          delete newAction.query[ACCESS_TOKEN_STRING]
        }
      }
      const { query, replaceUrl } = routerAction
      if (query || replaceUrl) {
        const redirect =
          replaceUrl ||
          Object.keys(prevQuery)
            .filter((k) => query?.[k as keyof QueryParams])
            .some((key) => REPLACE_URL_PARAMS.includes(key as QueryParam))
        if (redirect === true) {
          newAction.meta = {
            location: {
              kind: 'redirect',
            },
          }
        }
      }
      next(newAction)
    }
  }

// This middleware is going to save the state of the workspace to back
export const routerWorkspaceMiddleware: Middleware =
  ({ getState, dispatch }: { getState: () => RootState; dispatch: Dispatch }) =>
  (next) =>
  (action) => {
    const routerAction = action as UpdateQueryParamsAction
    const routesActions = Object.keys(routesMap)
    // check if action type matches a route type
    const isRouterAction = routesActions.includes(routerAction.type)
    if (isRouterAction) {
      const state = getState() as RootState
      const { prev } = state.location
      const { lastVisited } = state.workspace || {}
      const routesToSaveWorkspace = Object.keys(routesMap).filter(
        (key) => !WORKSPACE_ROUTES.includes(key)
      )
      const comesFromWorkspacesRoute = WORKSPACE_ROUTES.includes(prev.type)
      if (
        routesToSaveWorkspace.includes(routerAction.type) &&
        comesFromWorkspacesRoute &&
        !lastVisited
      ) {
        dispatch(
          setLastWorkspaceVisited({
            type: prev.type as ROUTE_TYPES,
            query: prev.query,
            payload: prev.payload,
            replaceQuery: true,
          })
        )
      } else if (WORKSPACE_ROUTES.includes(routerAction.type) && lastVisited) {
        dispatch(setLastWorkspaceVisited(undefined))
      }
    }
    next(action)
  }
