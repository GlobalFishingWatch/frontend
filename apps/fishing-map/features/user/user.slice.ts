import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
  GFWAPI,
  getAccessTokenFromUrl,
  removeAccessTokenFromUrl,
  GUEST_USER_TYPE,
} from '@globalfishingwatch/api-client'
import { UserData } from '@globalfishingwatch/api-types'
import { redirectToLogin } from '@globalfishingwatch/react-hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  cleanCurrentWorkspaceData,
  removeGFWStaffOnlyDataviews,
} from 'features/workspace/workspace.slice'

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

type UserSliceState = { user: UserState }

export const GFW_GROUP_ID = 'GFW Staff'
export const JAC_GROUP_ID = 'Joint Analytical Cell (JAC)'
export const GFW_DEV_GROUP_ID = 'development-group'
export const ADMIN_GROUP_ID = 'admin-group'
export const DEFAULT_GROUP_ID = 'Default'
export const PRIVATE_SUPPORTED_GROUPS = [
  'Belize',
  'Brazil',
  'Chile',
  'Costa Rica',
  'Ecuador',
  'Indonesia',
  'Mexico',
  'Panama',
  'Papua New Guinea',
  'Peru',
  'SSF-Aruna',
  'SSF-Ipnlf',
  'SSF-Rare',
]
export const USER_GROUP_WORKSPACE = {
  'costa rica': 'costa_rica',
  'papua new guinea': 'papua_new_guinea',
  'ssf-aruna': 'coastal_fisheries_indonesia',
  'ssf-rare': 'coastal_fisheries_indonesia',
  'ssf-ipnlf': 'coastal_fisheries_indonesia',
}

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
  },
  {
    condition: (params, { getState }) => {
      const { user } = getState() as UserSliceState
      return user.status !== AsyncReducerStatus.Loading
    },
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
      dispatch(cleanCurrentWorkspaceData())
      dispatch(removeGFWStaffOnlyDataviews())
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

export const selectUserData = (state: UserSliceState) => state.user.data
export const selectUserStatus = (state: UserSliceState) => state.user.status
export const selectUserLogged = (state: UserSliceState) => state.user.logged
export const isGFWUser = (state: UserSliceState) => state.user.data?.groups.includes(GFW_GROUP_ID)
export const isJACUser = (state: UserSliceState) => state.user.data?.groups.includes(JAC_GROUP_ID)
export const isGFWAdminUser = (state: UserSliceState) =>
  state.user.data?.groups.includes(ADMIN_GROUP_ID)
export const isGFWDeveloper = (state: UserSliceState) =>
  state.user.data?.groups.includes(GFW_DEV_GROUP_ID)

export const isGuestUser = createSelector([selectUserData], (userData) => {
  return userData?.type === GUEST_USER_TYPE
})

export const isUserLogged = createSelector(
  [selectUserStatus, selectUserLogged],
  (status, logged) => {
    return status === AsyncReducerStatus.Finished && logged
  }
)
export default userSlice.reducer
