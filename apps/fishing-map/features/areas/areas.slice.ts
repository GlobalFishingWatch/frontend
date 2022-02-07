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

export const AREA_KEY_SEPARATOR = '-'
export const getAreaKey = ({ datasetId, areaId }: FetchAreaThunkParam) =>
  [datasetId, areaId].join(AREA_KEY_SEPARATOR)

export type FetchAreaThunkParam = { datasetId: string; areaId: string; areaName?: string }
export const fetchAreaThunk = createAsyncThunk(
  'areas/fetch',
  async (
    { datasetId, areaId, areaName }: FetchAreaThunkParam = {} as FetchAreaThunkParam,
    { signal }
  ) => {
    const area = await GFWAPI.fetch<ContextAreaGeometry>(
      `/v1/datasets/${datasetId}/user-context-layer-v1/${areaId}`,
      {
        signal,
      }
    )
    const key = getAreaKey({ datasetId, areaId })
    const name = areaName || area.properties.value || area.properties.name || area.id
    return {
      key,
      name,
      id: area.id,
      bounds: wrapBBoxLongitudes(bbox(area.geometry) as Bbox),
      geometry: area.geometry,
    }
  }
)

const areasSlice = createSlice({
  name: 'areas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAreaThunk.pending, (state, action) => {
      const key = getAreaKey(action.meta.arg)
      const name = action.meta.arg.areaName
      state[key] = {
        ...state[key],
        ...(name && { name }),
        status: AsyncReducerStatus.Loading,
      }
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

export const selectAreas = (state) => state.areas
export const selectAreaById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => state.areas[id])
)

export default areasSlice.reducer
