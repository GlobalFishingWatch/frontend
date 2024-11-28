import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'store'

export type SettingsEvents = {
  eezs?: string[]
  rfmos?: string[]
  mpas?: string[]
  duration?: number
  distanceShoreLonger?: number
  distancePortLonger?: number
}
export type SettingsPortVisits = {
  flags?: string[]
  duration?: number
  distanceShoreLonger?: number
}

export type SettingEventSectionName =
  | 'fishingEvents'
  | 'encounters'
  | 'gapEvents'
  | 'loiteringEvents'
  | 'portVisits'

export type Settings = {
  enabled: boolean
  fishingEvents: SettingsEvents
  encounters: SettingsEvents
  gapEvents: SettingsEvents
  loiteringEvents: SettingsEvents
  portVisits: SettingsPortVisits
}

export type SettingsSlice = {
  settings: Settings
}
const initialState: SettingsSlice = {
  settings: {
    enabled: true,
    fishingEvents: {},
    encounters: {},
    loiteringEvents: {},
    portVisits: {},
    gapEvents: {},
    ...(typeof localStorage !== 'undefined' && localStorage.getItem('settings') !== null
      ? JSON.parse(localStorage.getItem('settings') as string)
      : {}),
  },
}

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload
      localStorage.setItem('settings', JSON.stringify(action.payload))
    },
  },
})
export default slice.reducer

export const { updateSettings } = slice.actions
export const selectSettings = (state: RootState) => state.settings.settings
