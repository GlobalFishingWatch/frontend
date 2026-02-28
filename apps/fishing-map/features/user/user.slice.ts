import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'

import {
  getAccessTokenFromUrl,
  GFWAPI,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'
import type { UserData, UserGroupId } from '@globalfishingwatch/api-types'
import { Locale } from '@globalfishingwatch/api-types'
import type { FourwingsVisualizationMode } from '@globalfishingwatch/deck-layers'
import { redirectToLogin, setHistoryNavigation } from '@globalfishingwatch/react-hooks'

import type { PREFERRED_FOURWINGS_VISUALISATION_MODE } from 'data/config'
import { USER_SETTINGS } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
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
  tokenExpirationTimestamp: number | null
  language: Locale
  status: AsyncReducerStatus
  data: UserData | null
  settings: UserSettings
}

const initialState: UserState = {
  logged: false,
  expired: false,
  tokenExpirationTimestamp: null,
  language: Locale.en,
  status: AsyncReducerStatus.Idle,
  data: null,
  settings: {},
}

type UserSliceState = { user: UserState }

export const USER_GROUP_WORKSPACE: Partial<Record<UserGroupId, string>> = {
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
    try {
      const user = await GFWAPI.login({ accessToken })
      if (accessToken) {
        trackEvent({
          category: TrackCategory.User,
          action: 'login',
          other: {
            user_id: user.id,
            // email: user.email,
          },
        })
      }

      if (accessToken) {
        removeAccessTokenFromUrl()
      }

      return user
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
    { dispatch, getState }
  ) => {
    try {
      await GFWAPI.logout()
      dispatch(cleanCurrentWorkspaceData())
      dispatch(removeGFWStaffOnlyDataviews())
    } catch (e: any) {
      console.warn(e)
    }
    if (loginRedirect) {
      const state = getState() as any
      const historyNavigation = state.workspace?.historyNavigation || []
      setHistoryNavigation(historyNavigation)
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
    setUserLanguage: (state, action: PayloadAction<Locale>) => {
      state.language = action.payload
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
      if (GFWAPI.token && action.payload.type !== 'guest') {
        try {
          const { exp } = jwtDecode<{ exp: number }>(GFWAPI.token)
          state.tokenExpirationTimestamp = exp * 1000
          state.expired = false
        } catch (e: any) {
          console.warn('Failed to decode JWT token', e)
          state.tokenExpirationTimestamp = null
        }
      } else {
        state.tokenExpirationTimestamp = null
      }
    })
    builder.addCase(fetchUserThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Error
    })
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.logged = false
      state.expired = false
      state.tokenExpirationTimestamp = null
      state.data = null
    })
  },
})

export const { setUserSetting, setLoginExpired, setUserLanguage } = userSlice.actions

export default userSlice.reducer
