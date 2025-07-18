import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

export enum FeatureFlag {
  GlobalReports = 'globalReports',
  WorkspaceGenerator = 'workspaceGenerator',
}

export enum DebugOption {
  DatasetRelationship = 'datasetRelationship',
  Debug = 'debug',
  MapStats = 'mapStats',
  Thinning = 'thinning',
  DatasetIdHash = 'addDatasetIdHash',
  CurrentsLayer = 'currentsLayer',
  AreasOnScreen = 'areasOnScreen',
  DataTerminologyIframe = 'dataTerminologyIframe',
}

type DebugOptions = Record<DebugOption, boolean>

interface DebugState {
  active: boolean
  featureFlags: Record<FeatureFlag, boolean>
  options: DebugOptions
}

const initialState: DebugState = {
  active: false,
  featureFlags: {
    globalReports: false,
    workspaceGenerator: false,
  },
  options: {
    datasetRelationship: false,
    debug: false,
    mapStats: false,
    thinning: true,
    addDatasetIdHash: true,
    dataTerminologyIframe: false,
    currentsLayer: false,
    areasOnScreen: false,
  },
}

const debugSlice = createSlice({
  name: 'debug',
  initialState,
  reducers: {
    toggleDebugMenu: (state) => {
      state.active = !state.active
    },
    toggleOption: (state, action: PayloadAction<DebugOption>) => {
      state.options[action.payload] = !state.options[action.payload]
    },
    toggleFeatureFlag: (state, action: PayloadAction<FeatureFlag>) => {
      state.featureFlags[action.payload] = !state.featureFlags[action.payload]
    },
  },
})

export const { toggleDebugMenu, toggleOption, toggleFeatureFlag } = debugSlice.actions

export const selectDebugActive = (state: RootState) => state.debug.active
export const selectDebugOptions = (state: RootState) => state.debug.options
export const selectFeatureFlags = (state: RootState) => state.debug.featureFlags

export default debugSlice.reducer
