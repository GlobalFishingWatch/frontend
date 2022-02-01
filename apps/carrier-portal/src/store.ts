import { applyMiddleware, combineReducers, createStore, Middleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { connectRoutes, Options } from 'redux-first-router'
import { stringify, parse } from 'qs'
import { AppActions } from 'types/redux.types'
import {
  REPLACE_URL_PARAMS,
  BASE_URL,
  EVENT_TYPES,
  CONTEXT_LAYERS_IDS,
  DEFAULT_FILTERS,
} from 'data/constants'
import { GraphType, QueryParams, QueryParam } from 'types/app.types'
import { trunc } from 'utils'
import reducers from './redux-modules/reducers'
import routesMap from './routes'

export interface QueryTransformation {
  key: QueryParam
  transformation: (value: any) => any
}

const objectToUrlTransformations: QueryTransformation[] = [
  { key: 'start', transformation: (value: string) => value.split('T')[0] },
  { key: 'end', transformation: (value: string) => value.split('T')[0] },
  { key: 'latitude', transformation: (value: number) => trunc(value) },
  { key: 'longitude', transformation: (value: number) => trunc(value) },
  { key: 'zoom', transformation: (value: number) => trunc(value) },
]

const routesOptions: Options = {
  basename: BASE_URL,
  querySerializer: {
    stringify: (object: QueryParams) => {
      objectToUrlTransformations.forEach(({ key, transformation }) => {
        const value = object[key]
        if (value) {
          object[key] = transformation(value)
        }
      })
      return stringify({ ...object }, { encode: false })
    },
    parse: (string: string) => {
      // This only runs once at the beginning, so running transformations on queryParams selectors
      const { after, before, lat, lng, ...rest } = parse(string, { arrayLimit: 300 })
      // convert legacy params into new ones
      const params = {
        ...rest,
        ...(after && { start: after }),
        ...(before && { end: before }),
        ...(lat && { latitude: lat }),
        ...(lng && { longitude: lng }),
      }
      return params
    },
  },
}

// This middleware allows rewriting selectively URL params
// without having to know all of them or redirect by some params
const customRouterQueryMiddleware: Middleware = ({ getState }) => (next) => (
  action: AppActions
) => {
  const routesActions = Object.keys(routesMap)
  // check if action type matches a route type
  const isRouterAction = routesActions.includes(action.type)

  // replaceQuery allows full rewriting of URL params
  if (isRouterAction) {
    const newAction: any = { ...action }

    if (newAction.replaceQuery !== true) {
      const prevQuery = getState().location.query || {}
      newAction.query = {
        ...prevQuery,
        ...newAction.query,
      }
    }
    const { query = {} } = action as any
    const redirect = Object.keys(query)
      .filter((k) => query[k])
      .some((key) => REPLACE_URL_PARAMS.includes(key))
    if (redirect === true) {
      newAction.meta = {
        location: {
          kind: 'redirect',
        },
      }
    }

    // Auto select the graph option depending on the current selection
    let graphType: GraphType = newAction.query.graph
    const isGraphRelatedChange = query.rfmo !== undefined || query.flag !== undefined
    const notHasGraphParams =
      query.graph === undefined && query.start === undefined && query.end === undefined
    // Active the rfmo and eez layers if we any of the areas are selected
    const hasRfmoSelected = newAction.query.rfmo && newAction.query.rfmo.length > 0
    const layers = newAction.query.layer ? [...newAction.query.layer] : DEFAULT_FILTERS.layer
    if (hasRfmoSelected) {
      if (query.rfmo && !layers.includes(CONTEXT_LAYERS_IDS.rfmo)) {
        layers.push(CONTEXT_LAYERS_IDS.rfmo)
      }
    }
    const hasEezSelected = newAction.query.eez && newAction.query.eez.length > 0
    if (hasEezSelected) {
      if (query.eez && !layers.includes(CONTEXT_LAYERS_IDS.eez)) {
        layers.push(CONTEXT_LAYERS_IDS.eez)
      }
    }
    if (layers.length) {
      newAction.query.layer = layers
    }
    if (isGraphRelatedChange && notHasGraphParams && hasRfmoSelected) {
      if (newAction.query.flag && newAction.query.flag.length === 1) {
        graphType = 'time'
      } else {
        graphType =
          newAction.query.eventType === EVENT_TYPES.loitering ? 'loitering-flag' : 'flag-carrier'
      }
    }
    if (graphType) {
      newAction.query.graph = graphType
    }
    next(newAction)
  } else {
    next(action)
  }
}

const { reducer, middleware, enhancer } = connectRoutes(routesMap, routesOptions)
export const rootReducer = combineReducers({ ...reducers, location: reducer })

const middlewares = applyMiddleware(customRouterQueryMiddleware, middleware)
const enhancers = composeWithDevTools(enhancer, middlewares)
const store = createStore(rootReducer, {}, enhancers)

export default store
