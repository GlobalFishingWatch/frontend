import { createSelector } from 'reselect'
import { AppState } from 'types/redux.types'

const getLoading = (state: AppState) => state.user.loading
const getLogged = (state: AppState) => state.user.logged
const getData = (state: AppState) => state.user.data

export const isUserLogged = createSelector(
  [getLoading, getLogged],
  (loading, logged) => !loading && logged
)

export const getUserData = createSelector([getData], (data) => data)
