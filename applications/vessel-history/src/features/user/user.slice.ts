import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI, {
  getAccessTokenFromUrl,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'
import { UserData } from '@globalfishingwatch/api-types'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'utils/async-slice'
import { redirectToLogin } from 'routes/routes.hook'

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
export const GFW_GROUP_ID = 'GFW'

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
    } catch (e) {
      return await fetchGuestUser()
    }
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
      state.data = action.payload
      state.logged = true
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

export default userSlice.reducer
