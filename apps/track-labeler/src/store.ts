import type {
  Action,
  AnyAction,  Middleware,
  ThunkAction,
  ThunkDispatch} from '@reduxjs/toolkit';
import {
  combineReducers,
  configureStore} from '@reduxjs/toolkit'

import dataviews from '././features/dataviews/dataviews.slice'
import resources from '././features/dataviews/resources.slice'
import mapReducer from '././features/map/map.slice'
import project from '././features/projects/projects.slice'
import rulers from '././features/rulers/rulers.slice'
import timebarReducer from '././features/timebar/timebar.slice'
import userReducer from '././features/user/user.slice'
import selectedtracks from '././features/vessels/selectedTracks.slice'
import vessels from '././features/vessels/vessels.slice'
import connectedRoutes from './routes/routes'
import { routerQueryMiddleware, routerRefreshTokenMiddleware } from './routes/routes.middlewares'

const {
  reducer: location,
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
  // initialDispatch,
} = connectedRoutes

const rootReducer = combineReducers({
  dataviews,
  selectedtracks,
  resources,
  rulers,
  user: userReducer,
  map: mapReducer,
  vessels,
  project,
  timebar: timebarReducer,
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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(defaultMiddlewareOptions).concat([
      routerQueryMiddleware,
      routerRefreshTokenMiddleware,
      routerMiddleware as Middleware,
    ]),
  enhancers: (getDefaultEnhancers) => [routerEnhancer, ...getDefaultEnhancers()] as any,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
type TypedDispatch<T> = ThunkDispatch<T, any, AnyAction>
export type AppDispatch = TypedDispatch<RootState>

export default store
