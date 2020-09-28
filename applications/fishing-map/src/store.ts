import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  getDefaultMiddleware,
} from '@reduxjs/toolkit'
import connectedRoutes, { routerQueryMiddleware } from './routes/routes'
import userReducer from './features/user/user.slice'
import mapReducer from './features/map/map.slice'
import timebarReducer from './features/timebar/timebar.slice'

const {
  reducer: location,
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
  // initialDispatch,
} = connectedRoutes

const rootReducer = combineReducers({
  user: userReducer,
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
