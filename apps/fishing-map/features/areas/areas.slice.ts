import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import bbox from '@turf/bbox'
import { memoize } from 'lodash'
import { ContextAreaGeometry, ContextAreaGeometryGeom } from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import { RootState } from 'store'
import { Bbox } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

export interface Area {
  id: string
  status: AsyncReducerStatus
  geometry: ContextAreaGeometryGeom | undefined
  bounds: Bbox | undefined
  name: string
}
export type AreasState = Record<string, Area>

const initialState: AreasState = {}

export const getAreaKey = ({ datasetId, areaId }: FetchAreaThunkParam) =>
  [datasetId, areaId].join('-')

export type FetchAreaThunkParam = { datasetId: string; areaId: string }
export const fetchAreaThunk = createAsyncThunk(
  'areas/fetch',
  async (
    { datasetId, areaId }: FetchAreaThunkParam = {} as FetchAreaThunkParam,
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
    const key = getAreaKey({ datasetId, areaId })
    return {
      key,
      id: area.id,
      name: area.properties.geoname,
      bounds: wrapBBoxLongitudes(bbox(area.geometry) as Bbox),
      geometry: area.geometry,
    }
  }
)

const areasSlice = createSlice({
  name: 'areas',
  initialState,
  reducers: {
    clearAreaGeometry: (state) => {
      state.area = initialState.area
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAreaThunk.pending, (state, action) => {
      const key = getAreaKey(action.meta.arg)
      state[key] = { ...state[key], status: AsyncReducerStatus.Loading }
    })
    builder.addCase(fetchAreaThunk.fulfilled, (state, action) => {
      const { key, ...rest } = action.payload
      state[key] = {
        status: AsyncReducerStatus.Finished,
        ...rest,
      }
    })
    builder.addCase(fetchAreaThunk.rejected, (state, action) => {
      const key = getAreaKey(action.meta.arg)
      state[key] = { ...state[key], status: AsyncReducerStatus.Error }
    })
  },
})

export const { clearAreaGeometry } = areasSlice.actions

export const selectAreas = (state) => state.areas
export const selectAreaById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => state.areas[id])
)

export default areasSlice.reducer
