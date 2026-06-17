import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getIsTimeoutError, GFWAPI } from '@globalfishingwatch/api-client'
import type { UserData, UserGroupId } from '@globalfishingwatch/api-types'
import { Locale } from '@globalfishingwatch/api-types'
import type { FourwingsVisualizationMode } from '@globalfishingwatch/deck-layers'

import type { PREFERRED_FOURWINGS_VISUALISATION_MODE } from 'data/config'
import { USER_SETTINGS } from 'data/config'
import { USER_TOKEN_COOKIE_KEY } from 'features/app/app.config'
import type { LoginSource } from 'features/user/user.types'
import {
  cleanCurrentWorkspaceData,
  removeGFWStaffOnlyDataviews,
} from 'features/workspace/workspace.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { removeDocumentCookie, writeDocumentCookie } from 'utils/cookies'
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
      return await GFWAPI.fetchGuestUser()
    }
    try {
      const user = await GFWAPI.login({ accessToken })
      if (GFWAPI.token) {
        writeDocumentCookie(USER_TOKEN_COOKIE_KEY, GFWAPI.token)
      }
      return user
    } catch (e: any) {
      const cause = e?.cause ?? e
      const isTransient = getIsTimeoutError(cause) || (cause?.status as number) >= 500
      if (isTransient) {
        throw e
      }
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

export const logoutUserThunk = createAsyncThunk('user/logout', async (_, { dispatch }) => {
  try {
    await GFWAPI.logout()
    removeDocumentCookie(USER_TOKEN_COOKIE_KEY)
    dispatch(cleanCurrentWorkspaceData())
    dispatch(removeGFWStaffOnlyDataviews())
  } catch (e: any) {
    console.warn(e)
  }
})

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
