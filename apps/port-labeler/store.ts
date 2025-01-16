import type { Action,ThunkAction} from '@reduxjs/toolkit';
import { combineReducers,configureStore } from '@reduxjs/toolkit'

import labelerReducer from 'features/labeler/labeler.slice'

import userReducer from './features/user/user.slice'
import connectedRoutes from './routes/routes'
import { routerQueryMiddleware } from './routes/routes.middlewares'
import titleReducer from './routes/title.reducer'

const {
  reducer: location,
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
  // initialDispatch,
} = connectedRoutes

const rootReducer = combineReducers({
  location: location,
  title: titleReducer,
  user: userReducer,
  labeler: labelerReducer,
})

// Can't type because GetDefaultMiddlewareOptions type is not exposed by RTK
const defaultMiddlewareOptions: any = {
  // Fix issue with Redux-first-router and RTK (https://stackoverflow.com/questions/59773345/react-toolkit-and-redux-first-router)
  serializableCheck: false,
}

const store = configureStore({
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
    getDefaultMiddleware(defaultMiddlewareOptions)
      .concat(routerQueryMiddleware)
      .concat(routerMiddleware),
  enhancers: (getDefaultEnhancers) => [routerEnhancer, ...getDefaultEnhancers()] as any,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export default store
