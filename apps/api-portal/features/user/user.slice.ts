import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { AsyncReducerStatus } from 'lib/async-slice'
import {
  GFWAPI,
  getAccessTokenFromUrl,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'
import { UserData } from '@globalfishingwatch/api-types'
import { redirectToLogin } from '@globalfishingwatch/react-hooks'
import { AppState } from '../../app/store'

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

export const GUEST_USER_TYPE = 'guest'
export const GFW_GROUP_ID = 'GFW Staff'
export const GFW_DEV_GROUP_ID = 'development-group'

export const fetchGuestUser = async () => {
  const permissions = await fetch(`${GFWAPI.getBaseUrl()}/auth/acl/permissions/anonymous`).then(
    (r) => r.json()
  )
  const user: UserData = { id: 0, type: GUEST_USER_TYPE, permissions, groups: [] }
  return user
}

export const fetchUserThunk = createAsyncThunk(
  'user/fetch',
  async ({ guest }: { guest: boolean } = { guest: false }) => {
    if (guest) {
      return await fetchGuestUser()
    }
    const accessToken = getAccessTokenFromUrl()
    if (accessToken) {
      removeAccessTokenFromUrl()
    }

    try {
      return await GFWAPI.login({ accessToken })
    } catch (e: any) {
      return await fetchGuestUser()
    }
  }
)

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async ({ loginRedirect }: { loginRedirect: boolean } = { loginRedirect: false }) => {
    try {
      await GFWAPI.logout()
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

export const selectUserData = (state: AppState) => state.user.data
export const selectUserStatus = (state: AppState) => state.user.status
export const selectUserLogged = (state: AppState) => state.user.logged
export const isGFWUser = (state: AppState) => state.user.data?.groups.includes(GFW_GROUP_ID)

export const isGuestUser = createSelector([selectUserData], (userData) => {
  return userData?.type === GUEST_USER_TYPE
})

export default userSlice.reducer
