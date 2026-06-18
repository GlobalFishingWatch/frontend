import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getGuestUser, GFWAPI, isTransientError } from '@globalfishingwatch/api-client'
import type { UserData, UserGroupId } from '@globalfishingwatch/api-types'
import { Locale } from '@globalfishingwatch/api-types'
import type { FourwingsVisualizationMode } from '@globalfishingwatch/deck-layers'

import type { PREFERRED_FOURWINGS_VISUALISATION_MODE } from 'data/config'
import { USER_SETTINGS } from 'data/config'
import { broadcastLogout } from 'features/user/auth-channel'
import type { LoginSource } from 'features/user/user.types'
import {
  cleanCurrentWorkspaceData,
  removeGFWStaffOnlyDataviews,
} from 'features/workspace/workspace.slice'
import { loginServerFn, logoutServerFn } from 'server-functions/auth.functions'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getIsBrowser } from 'utils/dom'

export interface UserSettings {
  [PREFERRED_FOURWINGS_VISUALISATION_MODE]?: FourwingsVisualizationMode
}

interface UserState {
  logged: boolean
  expired: boolean
  language: Locale
  status: AsyncReducerStatus
  data: UserData | null
  settings: UserSettings
  loginSource: LoginSource | null
}

const initialState: UserState = {
  logged: false,
  expired: false,
  language: Locale.en,
  status: AsyncReducerStatus.Idle,
  data: null,
  settings: {},
  loginSource: null,
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
  async ({ guest, accessToken }: { guest?: boolean; accessToken?: string } = { guest: false }) => {
    if (guest) {
      return getGuestUser()
    }
    try {
      // With an SSO access token, exchange it server-side (sets the JS access cookie +
      // httpOnly refresh cookie). Without one, resolve the existing session — GFWAPI
      // reads the access cookie and silently refreshes via the server fn if expired.
      const user = accessToken
        ? await loginServerFn({ data: { accessToken } })
        : await GFWAPI.login({})
      if (!user) {
        return getGuestUser()
      }
      return user
    } catch (e: any) {
      // Only a transient server failure (timeout / 5xx) should be rethrown so the
      // session is retried. Any other failure (incl. "no session" with no status)
      // falls back to the guest user — never leave the app without a user.
      const cause = e?.cause ?? e
      const isTransient = isTransientError(cause)
      if (isTransient) {
        throw e
      }
      return getGuestUser()
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
  async ({ local }: { local?: boolean } = {}, { dispatch }) => {
    try {
      if (!local) {
        // Server fn invalidates the session on the gateway (using the httpOnly refresh
        // cookie) and clears both auth cookies.
        await logoutServerFn()
        broadcastLogout()
      }
      dispatch(cleanCurrentWorkspaceData())
      dispatch(removeGFWStaffOnlyDataviews())
    } catch (e: any) {
      console.warn(e)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: () => {
    if (!getIsBrowser()) return initialState
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
    setLoginSource: (state, action: PayloadAction<LoginSource | null>) => {
      state.loginSource = action.payload
    },
    setLoggedUser: (state, action: PayloadAction<UserData>) => {
      state.logged = true
      state.status = AsyncReducerStatus.Finished
      state.data = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchUserThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.logged = true
      state.expired = false
      state.data = action.payload
    })
    builder.addCase(fetchUserThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Error
    })
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.logged = false
      state.expired = false
      state.data = null
    })
  },
})

export const { setUserSetting, setLoginExpired, setUserLanguage, setLoginSource, setLoggedUser } =
  userSlice.actions

export default userSlice.reducer
