import { uniq } from 'es-toolkit'
import type { RootState } from 'reducers'
import type { Dispatch, Middleware } from 'redux'
import { NOT_FOUND } from 'redux-first-router'

import { ACCESS_TOKEN_STRING } from '@globalfishingwatch/api-client'

import type { LastWorkspaceVisited } from 'features/workspace/workspace.slice'
import { setWorkspaceHistoryNavigation } from 'features/workspace/workspace.slice'
import { REPLACE_URL_PARAMS } from 'routes/routes.config'
import type { QueryParam, QueryParams } from 'types'

import type { ROUTE_TYPES } from './routes'
import { routesMap } from './routes'
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
      } else {
        newAction.query = {
          ...newAction.query,
          featureFlags: uniq([
            ...(prevQuery.featureFlags || []),
            ...(newAction.query?.featureFlags || []),
          ]),
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
      const { type, query, payload } = state.location
      const isHistoryNavigation = routerAction.isHistoryNavigation

      if (routerAction.type !== NOT_FOUND && type !== NOT_FOUND) {
        const currentHistoryNavigation = state.workspace?.historyNavigation || []
        const lastHistoryNavigation = currentHistoryNavigation[currentHistoryNavigation.length - 1]
        if (!isHistoryNavigation && type) {
          if (
            routerAction.type !== type &&
            (!lastHistoryNavigation || lastHistoryNavigation.type !== type)
          ) {
            const newHistoryNavigation: LastWorkspaceVisited = {
              type: type as ROUTE_TYPES,
              query: query,
              payload: payload,
            }
            dispatch(
              setWorkspaceHistoryNavigation([...currentHistoryNavigation, newHistoryNavigation])
            )
          }
        }
      }
    }
    next(action)
  }
