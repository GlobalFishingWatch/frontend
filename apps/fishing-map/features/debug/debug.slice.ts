import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

export enum DebugOption {
  DatasetRelationship = 'datasetRelationship',
  Debug = 'debug',
  MapStats = 'mapStats',
  Thinning = 'thinning',
  DatasetIdHash = 'addDatasetIdHash',
  CurrentsLayer = 'currentsLayer',
  GlobalReports = 'globalReports',
  ResponsiveVisualization = 'responsiveVisualization',
}

type DebugOptions = Record<DebugOption, boolean>

interface DebugState {
  active: boolean
  options: DebugOptions
}

const initialState: DebugState = {
  active: false,
  options: {
    datasetRelationship: false,
    debug: false,
    mapStats: false,
    thinning: true,
    addDatasetIdHash: true,
    globalReports: false,
    responsiveVisualization: false,
    currentsLayer: false,
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
  },
})

export const { toggleDebugMenu, toggleOption } = debugSlice.actions

export const selectDebugActive = (state: RootState) => state.debug.active
export const selectDebugOptions = (state: RootState) => state.debug.options

export default debugSlice.reducer
