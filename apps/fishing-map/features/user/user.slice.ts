import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'

import {
  getAccessTokenFromUrl,
  GFWAPI,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'
import type { UserData } from '@globalfishingwatch/api-types'
import type { FourwingsVisualizationMode } from '@globalfishingwatch/deck-layers'
import { redirectToLogin } from '@globalfishingwatch/react-hooks'

import type { PREFERRED_FOURWINGS_VISUALISATION_MODE } from 'data/config'
import { USER_SETTINGS } from 'data/config'
import {
  cleanCurrentWorkspaceData,
  removeGFWStaffOnlyDataviews,
} from 'features/workspace/workspace.slice'
import { AsyncReducerStatus } from 'utils/async-slice'

export interface UserSettings {
  [PREFERRED_FOURWINGS_VISUALISATION_MODE]?: FourwingsVisualizationMode
}

interface UserState {
  logged: boolean
  expired: boolean
  status: AsyncReducerStatus
  data: UserData | null
  settings: UserSettings
}

const initialState: UserState = {
  logged: false,
  expired: false,
  status: AsyncReducerStatus.Idle,
  data: null,
  settings: {},
}

type UserSliceState = { user: UserState }

export type UserGroup =
  | 'belize'
  | 'brazil'
  | 'costa rica'
  | 'ecuador'
  | 'panama'
  | 'papua new guinea'
  | 'peru'
  | 'ssf-aruna'
  | 'ssf-rare'
  | 'ssf-ipnlf'
export const USER_GROUP_WORKSPACE: Partial<Record<UserGroup, string>> = {
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
    { loginRedirect }: { loginRedirect: boolean } | undefined = { loginRedirect: false },
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
  initialState: () => {
    if (typeof window === 'undefined') return initialState
    const settings = JSON.parse(localStorage.getItem(USER_SETTINGS) || '{}') as UserSettings
    return { ...initialState, settings }
  },
  reducers: {
    setLoginExpired: (state, action: PayloadAction<boolean>) => {
      state.expired = action.payload
    },
    setUserSetting: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = { ...state.settings, ...action.payload }
      localStorage.setItem(USER_SETTINGS, JSON.stringify(state.settings))
    },
  },
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

export const { setUserSetting, setLoginExpired } = userSlice.actions

export default userSlice.reducer
