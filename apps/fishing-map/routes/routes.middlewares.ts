import { Middleware, Dispatch } from 'redux'
import { ACCESS_TOKEN_STRING } from '@globalfishingwatch/api-client'
import { REPLACE_URL_PARAMS } from 'data/config'
import { setLastWorkspaceVisited } from 'features/workspace/workspace.slice'
import { RootState } from 'store'
import { QueryParams } from 'types'
import { REPORT, routesMap, WORKSPACE, WORKSPACE_ROUTES } from './routes'
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

      const prevQuery = getState().location.query || {}
      if (newAction.replaceQuery !== true) {
        newAction.query = {
          ...prevQuery,
          ...newAction.query,
        }
        if (newAction.query[ACCESS_TOKEN_STRING]) {
          delete newAction.query[ACCESS_TOKEN_STRING]
        }
      }
      const { query } = action
      if (query) {
        const redirect = Object.keys(prevQuery)
          .filter((k) => query[k as keyof QueryParams])
          .some((key) => REPLACE_URL_PARAMS.includes(key))
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
  (action: UpdateQueryParamsAction) => {
    const { prev } = getState().location
    const { lastVisited } = getState().workspace
    const routesToSaveWorkspace = Object.keys(routesMap).filter(
      (key) => !WORKSPACE_ROUTES.includes(key)
    )
    const comesFromWorkspacesRoute = WORKSPACE_ROUTES.includes(prev.type)
    const isReportLocation = action.type === REPORT
    if (
      routesToSaveWorkspace.includes(action.type) &&
      (comesFromWorkspacesRoute || isReportLocation) &&
      !lastVisited
    ) {
      if (isReportLocation) {
        dispatch(
          setLastWorkspaceVisited({ type: WORKSPACE, query: action.query, payload: action.payload })
        )
      } else {
        const { type, query, payload } = prev
        dispatch(setLastWorkspaceVisited({ type, query, payload }))
      }
    } else if (WORKSPACE_ROUTES.includes(action.type) && lastVisited) {
      dispatch(setLastWorkspaceVisited(undefined))
    }
    next(action)
  }
