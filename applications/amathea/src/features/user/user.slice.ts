import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { AppThunk, RootState } from 'store'
import GFWAPI, {
  UserData,
  getAccessTokenFromUrl,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'

interface UserState {
  logged: boolean
  loading: boolean
  resolved: boolean
  data: UserData | null
  error: string
}

const initialState: UserState = {
  logged: false,
  resolved: false,
  loading: false,
  data: null,
  error: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoading: (state) => {
      state.loading = true
      state.resolved = false
    },
    userLoaded: (state, action: PayloadAction<UserData>) => {
      state.loading = false
      state.resolved = true
      state.logged = true
      state.data = action.payload
    },
    userError: (state, action: PayloadAction<Error>) => {
      state.loading = false
      state.resolved = true
      state.logged = false
      state.error += action.payload
    },
  },
})

const { userLoading, userLoaded, userError } = userSlice.actions

export const fetchUser = (): AppThunk => (dispatch) => {
  dispatch(userLoading())
  const accessToken = getAccessTokenFromUrl()
  GFWAPI.login({ accessToken })
    .then((user: UserData) => {
      dispatch(userLoaded(user))
      if (accessToken) {
        removeAccessTokenFromUrl()
      }
    })
    .catch((e: Error) => {
      dispatch(userError(e))
    })
}

export const selectUserData = (state: RootState) => state.user.data
export const selectUserResolved = (state: RootState) => state.user.resolved
export const selectUserLogged = (state: RootState) => state.user.logged
export const selectUserLoading = (state: RootState) => state.user.loading

export const isUserLogged = createSelector(
  [selectUserLogged, selectUserLoading],
  (logged, loading) => !loading && logged
)

export default userSlice.reducer
