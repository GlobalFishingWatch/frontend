import { createAction } from 'typesafe-actions'

// Needed to set token expiren on any API 401 return
export const userLogout = createAction('USER_LOGOUT')()

export const fetchUserInit = createAction('FETCH_USER_INIT')()

export const fetchUserComplete = createAction('FETCH_USER_COMPLETE')<{
  data: any
}>()

export const fetchUserError = createAction('FETCH_USER_ERROR')<{
  error: string
}>()

export default {
  userLogout,
  fetchUserInit,
  fetchUserComplete,
  fetchUserError,
}
