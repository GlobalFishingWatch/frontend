import { Action, AnyAction, ThunkAction, ThunkDispatch, configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import { dataviewStatsApi } from 'queries/stats-api'
import { rootReducer } from 'reducers'
import connectedRoutes from 'routes/routes'
import { routerQueryMiddleware, routerWorkspaceMiddleware } from 'routes/routes.middlewares'

const {
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
  // initialDispatch,
} = connectedRoutes

// Can't type because GetDefaultMiddlewareOptions type is not exposed by RTK
const defaultMiddlewareOptions: any = {
  // Fix issue with Redux-first-router and RTK (https://stackoverflow.com/questions/59773345/react-toolkit-and-redux-first-router)
  serializableCheck: false,
  immutableCheck: {
    ignoredPaths: [
      // Too big to check for immutability:
      'resources',
      'datasets',
      'dataviews',
    ],
  },
}

export const makeStore = () => {
  return configureStore({
    devTools: {
      stateSanitizer: (state: any) => {
        if (!state.resources) return state
        const serializedResources = Object.entries(state.resources).map(([key, value]: any) => [
          key,
          { ...value, data: 'NOT_SERIALIZED' },
        ])

        return {
          ...state,
          vessel: {
            info: { ...state.vessel.info, data: 'NOT_SERIALIZED' },
          },
          resources: Object.fromEntries(serializedResources),
        }
      },
    },
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(defaultMiddlewareOptions).concat(
        dataviewStatsApi.middleware,
        routerQueryMiddleware,
        routerWorkspaceMiddleware,
        routerMiddleware
      ),
    enhancers: (defaultEnhancers) => [routerEnhancer, ...defaultEnhancers] as any,
    // preloadedState,
  })
}

export type AppStore = ReturnType<typeof makeStore>
type TypedDispatch<T> = ThunkDispatch<T, any, AnyAction>

export type AppDispatch = TypedDispatch<RootState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

// export function useStore(initialState) {
//   const store = useMemo(() => initializeStore(initialState), [initialState])
//   return store
// }
export type RootState = ReturnType<typeof rootReducer>

export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: false,
  serializeState: (state) => {
    return {
      vessel: state.vessel,
      // location: { ...state.location, history: state.location.history || null },
    }
  },
  // deserializeState: (state) => JSON.parse(state),
})
