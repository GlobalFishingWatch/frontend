import { uniq } from 'es-toolkit'
import type { RootState } from 'reducers'
import type { Dispatch, Middleware } from 'redux'
import { NOT_FOUND } from 'redux-first-router'

import { ACCESS_TOKEN_STRING } from '@globalfishingwatch/api-client'

import { selectVesselProfileDataviewIntance } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectHasVesselProfileInstancePinned } from 'features/dataviews/selectors/dataviews.selectors'
import { t } from 'features/i18n/i18n'
import type { LastWorkspaceVisited } from 'features/workspace/workspace.slice'
import { setWorkspaceHistoryNavigation } from 'features/workspace/workspace.slice'
import { REPLACE_URL_PARAMS } from 'routes/routes.config'
import { selectIsWorkspaceVesselLocation } from 'routes/routes.selectors'
import type { LinkToPayload } from 'routes/routes.types'
import type { QueryParam, QueryParams } from 'types'

import type { ROUTE_TYPES } from './routes'
import {
  ALL_WORKSPACE_ROUTES,
  REPORT_ROUTES,
  routesMap,
  VESSEL_ROUTES,
  WORKSPACE_ROUTES,
} from './routes'
import type { UpdateQueryParamsAction } from './routes.actions'

const ROUTES_ACTIONS = Object.keys(routesMap)

export const routerQueryMiddleware: Middleware =
  ({ getState }: { getState: () => RootState }) =>
  (next) =>
  (action) => {
    const routerAction = action as UpdateQueryParamsAction
    // check if action type matches a route type
    const isRouterAction = ROUTES_ACTIONS.includes(routerAction.type)
    if (isRouterAction) {
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
          ]) as any,
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
    } else {
      next(action)
    }
  }

// This middleware is going to save the state of the workspace to back
export const routerWorkspaceMiddleware: Middleware =
  ({ getState, dispatch }: { getState: () => RootState; dispatch: Dispatch }) =>
  (next) =>
  (action) => {
    const state = getState() as RootState
    const routerAction = action as UpdateQueryParamsAction
    const { type, query, payload, pathname } = state.location
    const isRouterAction = ROUTES_ACTIONS.includes(routerAction.type)
    const isNotInitialLoad = type && routerAction.type !== NOT_FOUND && type !== NOT_FOUND
    const newAction: UpdateQueryParamsAction = { ...routerAction }

    if (isRouterAction) {
      // Pin vessel profile instance when navigating to another page
      // Needs to happen here instead of other middleware to reuse the same query object
      const newQuery = { ...(query || {}) }

      const isWorkspaceVesselLocation = selectIsWorkspaceVesselLocation(state)
      const navigatesToWorkspaceRoute = ALL_WORKSPACE_ROUTES.includes(routerAction.type)
      const vesselProfileDataviewIntance = selectVesselProfileDataviewIntance(state)
      const hasVesselProfileInstancePinned = selectHasVesselProfileInstancePinned(state)
      const navigatesToDifferentLocation = routerAction.type !== state.location.type
      const navigatesToDifferentVessel =
        VESSEL_ROUTES.includes(routerAction.type) &&
        VESSEL_ROUTES.includes(state.location.type) &&
        routerAction.payload.vesselId !== state.location.payload.vesselId
      if (
        isWorkspaceVesselLocation &&
        navigatesToWorkspaceRoute &&
        (navigatesToDifferentLocation || navigatesToDifferentVessel) &&
        vesselProfileDataviewIntance &&
        !hasVesselProfileInstancePinned
      ) {
        if (
          window.confirm(
            t('vessel.confirmationClose', 'Do you want to keep this vessel in your workspace?')
          ) === true
        ) {
          const cleanVesselDataviewInstance = {
            ...vesselProfileDataviewIntance,
            config: {
              ...vesselProfileDataviewIntance?.config,
              highlightEventStartTime: undefined,
              highlightEventEndTime: undefined,
            },
            datasetsConfig: undefined,
          }
          newQuery.dataviewInstances = [
            ...(newQuery?.dataviewInstances || []),
            cleanVesselDataviewInstance,
          ]
          newAction.query = {
            ...newAction.query,
            dataviewInstances: [
              ...(newAction.query?.dataviewInstances || []),
              cleanVesselDataviewInstance,
            ],
          }
        }
      }
      // End of pin vessel profile instance middleware

      if (isNotInitialLoad && !routerAction.skipHistoryNavigation) {
        const currentHistoryNavigation = state.workspace?.historyNavigation || []
        const lastHistoryNavigation = currentHistoryNavigation[currentHistoryNavigation.length - 1]
        const isDifferentRoute =
          routerAction.type !== type ||
          Object.entries(routerAction.payload).some(([key, value]) => value !== payload[key])
        if (
          isDifferentRoute &&
          !routerAction.isHistoryNavigation &&
          (!lastHistoryNavigation || lastHistoryNavigation.pathname !== pathname)
        ) {
          const newHistoryNavigation: LastWorkspaceVisited = {
            pathname,
            type: type as ROUTE_TYPES,
            query: newQuery,
            payload: payload as LinkToPayload,
          }
          dispatch(
            setWorkspaceHistoryNavigation([...currentHistoryNavigation, newHistoryNavigation])
          )
        } else if (lastHistoryNavigation) {
          const historyNavigation = routerAction.isHistoryNavigation
            ? currentHistoryNavigation.slice(0, -1)
            : currentHistoryNavigation
          const updatedHistoryNavigation = historyNavigation.map((navigation) => {
            if ([...WORKSPACE_ROUTES, ...REPORT_ROUTES].includes(lastHistoryNavigation.type)) {
              return {
                ...navigation,
                query: newAction.query!,
              }
            }
            return navigation
          })
          dispatch(setWorkspaceHistoryNavigation(updatedHistoryNavigation))
        }
      }
    }
    next(newAction)
  }

export default [routerQueryMiddleware, routerWorkspaceMiddleware]
