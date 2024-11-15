import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit'
import vessels from '././features/vessels/vessels.slice'
import selectedtracks from '././features/vessels/selectedTracks.slice'
import project from '././features/projects/projects.slice'
import resources from '././features/dataviews/resources.slice'
import dataviews from '././features/dataviews/dataviews.slice'
import { routerQueryMiddleware, routerRefreshTokenMiddleware } from './routes/routes.middlewares'
import connectedRoutes from './routes/routes'
import userReducer from '././features/user/user.slice'
import mapReducer from '././features/map/map.slice'
import timebarReducer from '././features/timebar/timebar.slice'
import rulers from '././features/rulers/rulers.slice'

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
      routerMiddleware,
    ]) as any,
  // enhancers: (defaultEnhancers) => [routerEnhancer, ...defaultEnhancers],
})

export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export default store
