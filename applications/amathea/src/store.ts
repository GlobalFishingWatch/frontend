import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  getDefaultMiddleware,
} from '@reduxjs/toolkit'
import datasetsReducer from './features/datasets/datasets.slice'
import appReducer from './features/app/app.slice'
import aoiReducer from './features/areas-of-interest/areas-of-interest.slice'
import workspacesReducer from './features/workspaces/workspaces.slice'
import userReducer from './features/user/user.slice'
import mapReducer from './features/map/map.slice'
import timebarReducer from './features/timebar/timebar.slice'
import connectedRoutes, { routerQueryMiddleware } from './routes/routes'

const {
  reducer: location,
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
  // initialDispatch,
} = connectedRoutes

const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  aoi: aoiReducer,
  datasets: datasetsReducer,
  workspaces: workspacesReducer,
  map: mapReducer,
  timebar: timebarReducer,
  location: location,
})

// Can't type because GetDefaultMiddlewareOptions type is not exposed by RTK
const defaultMiddlewareOptions: any = {
  // Fix issue with Redux-first-router and RTK (https://stackoverflow.com/questions/59773345/react-toolkit-and-redux-first-router)
  serializableCheck: false,
  immutableCheck: {},
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
