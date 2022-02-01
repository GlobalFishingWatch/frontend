import { createReducer } from 'typesafe-actions'
import { UserData } from '@globalfishingwatch/api-types'
import { fetchUserInit, fetchUserComplete, fetchUserError, userLogout } from './user.actions'

interface EventsReducer {
  loading: boolean
  logged: boolean
  error: string
  data: UserData | null
  groups?: any
}

export const initialState: EventsReducer = {
  loading: false,
  logged: false,
  error: '',
  data: null,
}

export default createReducer(initialState)
  .handleAction(fetchUserInit, (state) => {
    return { ...state, loading: true }
  })
  .handleAction(fetchUserComplete, (state, action) => {
    return { ...state, loading: false, data: action.payload.data, logged: true }
  })
  .handleAction(fetchUserError, (state, action) => {
    return { ...state, loading: false, error: action.payload.error }
  })
  .handleAction(userLogout, (state) => {
    return { ...state, logged: false }
  })
