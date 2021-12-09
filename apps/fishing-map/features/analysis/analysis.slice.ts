import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Feature, Polygon } from 'geojson'
import { RootState } from 'store'
import { Bbox } from 'types'

export type ReportGeometry = Feature<Polygon>

export interface ReportState {
  area: {
    geometry: ReportGeometry | undefined
    bounds: Bbox | undefined
    name: string
    id: string
  }
}

const initialState: ReportState = {
  area: {
    geometry: undefined,
    bounds: undefined,
    name: '',
    id: '',
  },
}

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    clearAnalysisGeometry: (state) => {
      state.area.geometry = undefined
      state.area.name = ''
      state.area.bounds = undefined
    },
    setAnalysisGeometry: (
      state,
      action: PayloadAction<{
        geometry: ReportGeometry | undefined
        name: string
        bounds: [number, number, number, number]
      }>
    ) => {
      state.area.geometry = action.payload.geometry
      state.area.bounds = action.payload.bounds
      state.area.name = action.payload.name
    },
  },
})

export const { clearAnalysisGeometry, setAnalysisGeometry } = analysisSlice.actions

export const selectAnalysisGeometry = (state: RootState) => state.analysis.area.geometry
export const selectAnalysisBounds = (state: RootState) => state.analysis.area.bounds
export const selectAnalysisAreaName = (state: RootState) => state.analysis.area.name
export const selectAnalysisAreaId = (state: RootState) => state.analysis.area.id

export default analysisSlice.reducer
