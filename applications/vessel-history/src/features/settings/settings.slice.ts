import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'

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
  | 'loiteringEvents'
  | 'portVisits'

export type Settings = {
  fishingEvents: SettingsEvents
  encounters: SettingsEvents
  loiteringEvents: SettingsEvents
  portVisits: SettingsPortVisits
}

export type SettingsSlice = {
  settings: Settings
}
const initialState: SettingsSlice = {
  settings: {
    fishingEvents: {},
    encounters: {},
    loiteringEvents: {},
    portVisits: {},
    ...(localStorage.getItem('settings') !== null
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
