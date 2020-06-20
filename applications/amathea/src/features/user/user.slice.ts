import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import GFWAPI, {
  UserData,
  getAccessTokenFromUrl,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'
import { AppThunk, RootState } from 'store'

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
      state.data = action.payload
    },
    userError: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.resolved = true
      state.logged = false
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
        removeAccessTokenFromUrl()
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

export const isUserLogged = createSelector(
  [selectUserLogged, selectUserLoading],
  (logged, loading) => !loading && logged
)

export default counterSlice.reducer
