import type { Action, AnyAction, Middleware, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { logoutUserMiddleware } from 'middlewares'
import { createWrapper } from 'next-redux-wrapper'
import { queriesApiMiddlewares } from 'queries'

import connectedRoutes from 'routes/routes'
import { routerQueryMiddleware, routerWorkspaceMiddleware } from 'routes/routes.middlewares'

import { rootReducer } from './reducers'

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

const makeStore = () => {
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
          resources: Object.fromEntries(serializedResources),
        }
      },
    },
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(defaultMiddlewareOptions).concat(
        ...queriesApiMiddlewares,
        routerQueryMiddleware,
        routerWorkspaceMiddleware,
        routerMiddleware as Middleware,
        logoutUserMiddleware
      ),
    enhancers: (getDefaultEnhancers) => [routerEnhancer, ...getDefaultEnhancers()] as any,
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
      location: { payload: state.location.payload },
    }
  },
  // deserializeState: (state) => JSON.parse(state),
})
