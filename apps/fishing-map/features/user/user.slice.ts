import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  GFWAPI,
  getAccessTokenFromUrl,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'
import { UserData } from '@globalfishingwatch/api-types'
import { redirectToLogin } from '@globalfishingwatch/react-hooks'
import { FourwingsVisualizationMode } from '@globalfishingwatch/deck-layers'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  cleanCurrentWorkspaceData,
  removeGFWStaffOnlyDataviews,
} from 'features/workspace/workspace.slice'
import { PREFERRED_FOURWINGS_VISUALISATION_MODE, USER_SETTINGS } from 'data/config'

export interface UserSettings {
  [PREFERRED_FOURWINGS_VISUALISATION_MODE]?: FourwingsVisualizationMode
}

interface UserState {
  logged: boolean
  status: AsyncReducerStatus
  data: UserData | null
  settings: UserSettings
}

const initialState: UserState = {
  logged: false,
  status: AsyncReducerStatus.Idle,
  data: null,
  settings: {},
}

type UserSliceState = { user: UserState }

export type UserGroup = 'costa rica' | 'papua new guinea' | 'ssf-aruna' | 'ssf-rare' | 'ssf-ipnlf'
export const USER_GROUP_WORKSPACE: Record<UserGroup, string> = {
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
  initialState: () => {
    if (typeof window === 'undefined') return initialState
    const settings = JSON.parse(localStorage.getItem(USER_SETTINGS) || '{}') as UserSettings
    return { ...initialState, settings }
  },
  reducers: {
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

export const { setUserSetting } = userSlice.actions

export default userSlice.reducer
