import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  getDefaultMiddleware,
} from '@reduxjs/toolkit'
import vessels from 'features/vessels/vessels.slice'
import connectedRoutes, { routerQueryMiddleware } from './routes/routes'

const {
  reducer: location,
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
} = connectedRoutes

const rootReducer = combineReducers({
  vessels,
  location: location,
})

// Can't type because GetDefaultMiddlewareOptions type is not exposed by RTK
const defaultMiddlewareOptions: any = {
  // Fix issue with Redux-first-router and RTK (https://stackoverflow.com/questions/59773345/react-toolkit-and-redux-first-router)
  serializableCheck: false,
  immutableCheck: {
    ignoredPaths: [
      // Too big to check for immutability:
      'resources',
      'vessels',
    ],
  },
}

const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware(defaultMiddlewareOptions),
    routerQueryMiddleware,
    routerMiddleware,
  ],
  enhancers: (defaultEnhancers) => [routerEnhancer, ...defaultEnhancers],
})

export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export default store
