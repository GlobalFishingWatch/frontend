import type { Middleware } from 'redux'
import type { RootState } from 'store'
import type { QueryParams } from 'types'

import { ACCESS_TOKEN_STRING } from '@globalfishingwatch/api-client'

import { REPLACE_URL_PARAMS } from 'data/config'

import { routesMap } from './routes'
import type { UpdateQueryParamsAction } from './routes.actions'

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
