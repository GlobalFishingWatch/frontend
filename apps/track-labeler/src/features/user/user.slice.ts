import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector,createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import { redirect } from 'redux-first-router'

import { getAccessTokenFromUrl,GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'

import { DEFAULT_TOKEN_EXPIRATION } from '../../data/config'
import { HOME } from '../../routes/routes'
import type { AppThunk, RootState } from '../../store'

interface UserState {
  logged: boolean
  tokenExpirationTimestamp: number | null
  loading: boolean
  resolved: boolean
  data: UserData | null
  error: string
}

const initialState: UserState = {
  logged: false,
  tokenExpirationTimestamp: null,
  resolved: false,
  loading: false,
  data: null,
  error: '',
}

interface UserToken {
  data: UserData
  iat: number
  exp: number
  aud: string
  iss: string
}

export const counterSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoading: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.loading = true
      state.resolved = false
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    userLoaded: (state, action: PayloadAction<UserData>) => {
      state.loading = false
      state.resolved = true
      state.logged = true
      const defaultExpiration = (new Date().getTime() + 1000 * 60 * DEFAULT_TOKEN_EXPIRATION) / 1000
      const { exp = defaultExpiration } = jwtDecode<UserToken>(GFWAPI.getToken())
      state.tokenExpirationTimestamp = exp * 1000
      state.data = action.payload
    },
    userError: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.resolved = true
      state.logged = false
      state.tokenExpirationTimestamp = null
      state.error += action.payload
    },
  },
})

export const { userLoading, userLoaded, userError } = counterSlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(fetchUser())`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const fetchUser = (): AppThunk => (dispatch) => {
  dispatch(userLoading())
  const accessToken = getAccessTokenFromUrl()

  GFWAPI.login({ accessToken })
    .then((user) => {
      dispatch(userLoaded(user))
      if (accessToken) {
        dispatch(
          redirect({
            type: HOME,
          })
        )
      }
    })
    .catch((e) => {
      dispatch(userError(e))
    })
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectUserData = (state: RootState) => state.user.data
export const selectUserResolved = (state: RootState) => state.user.resolved
export const selectUserLogged = (state: RootState) => state.user.logged
export const selectUserLoading = (state: RootState) => state.user.loading
export const selectUserTokenExpirationTimestamp = (state: RootState) =>
  state.user.tokenExpirationTimestamp

export const isUserLogged = createSelector(
  [selectUserLogged, selectUserLoading],
  (logged, loading) => {
    return !loading && logged
  }
)

export default counterSlice.reducer
