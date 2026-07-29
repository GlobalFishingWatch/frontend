import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getGuestUser, GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData, UserGroupId } from '@globalfishingwatch/api-types'
import { Locale } from '@globalfishingwatch/api-types'
import type { FourwingsVisualizationMode } from '@globalfishingwatch/deck-layers'

import type { PREFERRED_FOURWINGS_VISUALISATION_MODE } from 'data/map/config'
import { USER_SETTINGS } from 'data/map/config'
import { broadcastLogout } from 'features/user/auth-channel'
import type { LoginSource } from 'features/user/user.types'
import { logoutServerFn } from 'server-functions/auth.functions'
import { getIsBrowser } from 'utils/dom'

export interface UserSettings {
  [PREFERRED_FOURWINGS_VISUALISATION_MODE]?: FourwingsVisualizationMode
}

interface UserState {
  logged: boolean
  expired: boolean
  language: Locale
  data: UserData | null
  settings: UserSettings
  loginSource: LoginSource | null
}

const initialState: UserState = {
  logged: false,
  expired: false,
  language: Locale.en,
  data: null,
  settings: {},
  loginSource: null,
}

export const USER_GROUP_WORKSPACE: Partial<Record<UserGroupId, string>> = {
  'costa rica': 'costa_rica',
  'papua new guinea': 'papua_new_guinea',
  'ssf-aruna': 'coastal_fisheries_indonesia',
  'ssf-rare': 'coastal_fisheries_indonesia',
  'ssf-ipnlf': 'coastal_fisheries_indonesia',
}

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async ({ logoutServer, broadcast }: { logoutServer?: boolean; broadcast?: boolean } = {}) => {
    try {
      if (logoutServer) {
        await logoutServerFn()
      }
      if (broadcast) {
        broadcastLogout()
      }
      // Workspace cleanup happens in workspace.slice's extraReducers, reacting to this thunk.
      // Dispatching workspace actions from here made user.slice import workspace.slice, which put
      // deck.gl and the timebar in the entry chunk of every page — see scripts/check-store-graph.mjs.
    } catch (e: any) {
      console.warn(e)
    }
  }
)

export const fetchUserThunk = createAsyncThunk('user/fetch', () => GFWAPI.fetchUser())

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
      state.expired = false
      state.data = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.logged = false
      state.expired = false
      state.data = getGuestUser()
    })
    builder.addCase(fetchUserThunk.fulfilled, (state, action) => {
      state.data = action.payload
    })
  },
})

export const { setUserSetting, setLoginExpired, setUserLanguage, setLoginSource, setLoggedUser } =
  userSlice.actions

export default userSlice.reducer
