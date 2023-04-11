import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { UserData } from '@globalfishingwatch/api-types'
import {
  GFWAPI,
  getAccessTokenFromUrl,
  removeAccessTokenFromUrl,
  GUEST_USER_TYPE,
} from '@globalfishingwatch/api-client'
import { AsyncReducerStatus } from 'utils/async-slice'
import { RootState } from 'features/app/app.hooks'

interface UserState {
  logged: boolean
  status: AsyncReducerStatus
  data: UserData | null
}

const initialState: UserState = {
  logged: false,
  status: AsyncReducerStatus.Idle,
  data: null,
}

export const fetchUserThunk = createAsyncThunk(
  'user/fetch',
  async () => {
    const accessToken = getAccessTokenFromUrl()
    if (accessToken) {
      removeAccessTokenFromUrl()
    }

    try {
      return await GFWAPI.login({ accessToken })
    } catch (e: any) {
      await logoutUserThunk({ redirectTo: 'gfw-login' })
      return undefined
    }
  },
  {
    condition: (_, { getState, extra }) => {
      const status = selectUserStatus(getState() as RootState)
      return status !== AsyncReducerStatus.Loading
    },
  }
)

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async ({ redirectTo }: { redirectTo?: 'gfw-login' | 'home' } = { redirectTo: undefined }) => {
    try {
      await GFWAPI.logout()
    } catch (e: any) {
      console.warn(e)
    }
    if (redirectTo === 'gfw-login') {
      window.location.href = GFWAPI.getLoginUrl(window.location.toString())
    }
    if (redirectTo === 'home') {
      window.location.href = window.location.toString()
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchUserThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.logged = true
      state.data = action.payload ?? null
    })
    builder.addCase(fetchUserThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Error
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

export const isGuestUser = createSelector([selectUserData], (userData) => {
  return userData?.type === GUEST_USER_TYPE
})
export default userSlice.reducer
