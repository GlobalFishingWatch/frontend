import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import bbox from '@turf/bbox'
import { ContextAreaGeometry, ContextAreaGeometryGeom } from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import { RootState } from 'store'
import { Bbox } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

export interface ReportState {
  area: {
    status: AsyncReducerStatus
    geometry: ContextAreaGeometryGeom | undefined
    bounds: Bbox | undefined
    name: string
    id: string
  }
}

const initialState: ReportState = {
  area: {
    status: AsyncReducerStatus.Idle,
    geometry: undefined,
    bounds: undefined,
    name: '',
    id: '',
  },
}

export type FetchAnalysisThunkParam = { datasetId: string; areaId: string }
export const fetchAnalysisAreaThunk = createAsyncThunk(
  'analysis/fetchArea',
  async (
    { datasetId, areaId }: FetchAnalysisThunkParam = {} as FetchAnalysisThunkParam,
    { signal, getState }
  ) => {
    // TODO review how to gran layerName
    // const state = getState() as RootState
    // const contextDataviews = selectContextAreasDataviews(state)
    // const layerName = contextDataviews.find(({ id }) => id === dataset)?.datasets?.[0].name
    const area = await GFWAPI.fetch<ContextAreaGeometry>(
      `/v1/datasets/${datasetId}/user-context-layer-v1/${areaId}`,
      {
        signal,
      }
    )
    return {
      id: area.id,
      name: area.properties.geoname,
      bounds: wrapBBoxLongitudes(bbox(area.geometry) as Bbox),
      geometry: area.geometry,
    }
  }
)

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    clearAnalysisGeometry: (state) => {
      state.area = initialState.area
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAnalysisAreaThunk.pending, (state) => {
      state.area.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchAnalysisAreaThunk.fulfilled, (state, action) => {
      state.area = {
        status: AsyncReducerStatus.Finished,
        ...action.payload,
      }
    })
    builder.addCase(fetchAnalysisAreaThunk.rejected, (state) => {
      state.area.status = AsyncReducerStatus.Error
    })
  },
})

export const { clearAnalysisGeometry } = analysisSlice.actions

export const selectAnalysisArea = (state: RootState) => state.analysis.area
export const selectAnalysisAreaStatus = (state: RootState) => state.analysis.area.status
export const selectAnalysisAreaGeometry = (state: RootState) => state.analysis.area.geometry
export const selectAnalysisAreaBounds = (state: RootState) => state.analysis.area.bounds
export const selectAnalysisAreaName = (state: RootState) => state.analysis.area.name
export const selectAnalysisAreaId = (state: RootState) => state.analysis.area.id

export default analysisSlice.reducer
