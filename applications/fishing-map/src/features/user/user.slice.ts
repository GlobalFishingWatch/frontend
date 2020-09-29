import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'
import GFWAPI, {
  UserData,
  getAccessTokenFromUrl,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'

interface UserState {
  logged: boolean
  status: AsyncReducerStatus
  data: UserData | null
}

const initialState: UserState = {
  logged: false,
  status: 'idle',
  data: null,
}

export const fetchUserThunk = createAsyncThunk('user/fetch', async () => {
  const accessToken = getAccessTokenFromUrl()
  if (accessToken) {
    removeAccessTokenFromUrl()
  }
  const user = await GFWAPI.login({ accessToken })
  return user
})

export const logoutUserThunk = createAsyncThunk('user/logout', async () => {
  await GFWAPI.logout()
  return true
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserThunk.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(fetchUserThunk.fulfilled, (state, action) => {
      state.status = 'finished'
      state.logged = true
      state.data = action.payload
    })
    builder.addCase(fetchUserThunk.rejected, (state) => {
      state.status = 'error'
    })
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.logged = false
      state.data = null
    })
  },
})

export const selectUserData = (state: RootState) => state.user.data
export const selectUserStatus = (state: RootState) => state.user.status
export const selectUserLogged = (state: RootState) => state.user.logged

export const isUserLogged = createSelector(
  [selectUserStatus, selectUserLogged],
  (status, logged) => {
    return status === 'finished' && logged
  }
)

export default userSlice.reducer
