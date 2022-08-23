import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
  GFWAPI,
  getAccessTokenFromUrl,
  removeAccessTokenFromUrl,
  GUEST_USER_TYPE,
} from '@globalfishingwatch/api-client'
import { UserData } from '@globalfishingwatch/api-types'
import { redirectToLogin } from '@globalfishingwatch/react-hooks'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'utils/async-slice'
import { removeLocationLabelsDataview } from 'features/workspace/workspace.slice'

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

export const GFW_GROUP_ID = 'GFW Staff'
export const GFW_DEV_GROUP_ID = 'development-group'
export const ADMIN_GROUP_ID = 'admin-group'
export const DEFAULT_GROUP_ID = 'Default'
export const PRIVATE_SUPPORTED_GROUPS = [
  'Indonesia',
  'Peru',
  'Panama',
  'Brazil',
  'Mexico',
  'Ecuador',
  'Costa_Rica',
  'Belize',
]

export const fetchUserThunk = createAsyncThunk(
  'user/fetch',
  async ({ guest }: { guest: boolean } = { guest: false }) => {
    if (guest) {
      return await GFWAPI.fetchGuestUser()
    }
    const accessToken = getAccessTokenFromUrl()
    if (accessToken) {
      removeAccessTokenFromUrl()
    }

    try {
      return await GFWAPI.login({ accessToken })
    } catch (e: any) {
      return await GFWAPI.fetchGuestUser()
    }
  }
)

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async (
    { loginRedirect }: { loginRedirect: boolean } = { loginRedirect: false },
    { dispatch }
  ) => {
    try {
      await GFWAPI.logout()
      dispatch(removeLocationLabelsDataview())
    } catch (e: any) {
      console.warn(e)
    }
    if (loginRedirect) {
      redirectToLogin()
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
      state.data = action.payload
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
export const isGFWUser = (state: RootState) => state.user.data?.groups.includes(GFW_GROUP_ID)
export const isGFWAdminUser = (state: RootState) => state.user.data?.groups.includes(ADMIN_GROUP_ID)
export const isGFWDeveloper = (state: RootState) =>
  state.user.data?.groups.includes(GFW_DEV_GROUP_ID)

export const isGuestUser = createSelector([selectUserData], (userData) => {
  return userData?.type === GUEST_USER_TYPE
})

export default userSlice.reducer
