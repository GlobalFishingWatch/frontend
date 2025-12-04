import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { DateTimeFormatOptions } from 'luxon'
import type { RootState } from 'reducers'

export enum FeatureFlag {
  WorkspaceGenerator = 'workspaceGenerator',
  OthersReport = 'othersReport',
}

export enum DebugOption {
  DatasetRelationship = 'datasetRelationship',
  DebugTiles = 'debugTiles',
  MapStats = 'mapStats',
  Thinning = 'thinning',
  DatasetIdHash = 'addDatasetIdHash',
  ExperimentalLayers = 'experimentalLayers',
  AreasOnScreen = 'areasOnScreen',
  DataTerminologyIframe = 'dataTerminologyIframe',
  VesselsAsPositions = 'vesselsAsPositions',
  BluePlanetMode = 'bluePlanetMode',
  VesselsMaxTimeGapHours = 'vesselsMaxTimeGapHours',
}

export const FAKE_VESSEL_NAME = 'vessel:387609'

type DebugOptions = Record<DebugOption, boolean>

interface DebugState {
  active: boolean
  featureFlags: Record<FeatureFlag, boolean>
  options: DebugOptions
}

export const BLUE_PLANET_MODE_DATE_FORMAT: DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}

const initialState: DebugState = {
  active: false,
  featureFlags: {
    workspaceGenerator: false,
    othersReport: false,
  },
  options: {
    datasetRelationship: false,
    debugTiles: false,
    mapStats: false,
    thinning: true,
    addDatasetIdHash: true,
    dataTerminologyIframe: false,
    experimentalLayers: false,
    areasOnScreen: false,
    vesselsAsPositions: false,
    vesselsMaxTimeGapHours: false,
    bluePlanetMode: false,
  },
}

const debugSlice = createSlice({
  name: 'debug',
  initialState,
  reducers: {
    toggleDebugMenu: (state) => {
      state.active = !state.active
    },
    toggleDebugOption: (state, action: PayloadAction<DebugOption>) => {
      state.options[action.payload] = !state.options[action.payload]
    },
    setDebugOption: (state, action: PayloadAction<{ option: DebugOption; value: boolean }>) => {
      if (action.payload.option) {
        state.options[action.payload.option] = action.payload.value
      }
    },
    toggleFeatureFlag: (state, action: PayloadAction<FeatureFlag>) => {
      state.featureFlags[action.payload] = !state.featureFlags[action.payload]
    },
  },
})

export const { toggleDebugMenu, toggleDebugOption, setDebugOption, toggleFeatureFlag } =
  debugSlice.actions

export const selectDebugActive = (state: RootState) => state.debug.active
export const selectDebugOptions = (state: RootState) => state.debug.options
export const selectFeatureFlags = (state: RootState) => state.debug.featureFlags

export default debugSlice.reducer
