import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import bbox from '@turf/bbox'
import { memoize } from 'lodash'
import { ContextAreaFeature, ContextAreaFeatureGeom } from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import { RootState } from 'store'
import { Bbox } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'

export interface DatasetArea {
  id: string
  label: string
  bbox?: Bbox
}
export interface DatasetAreaList {
  status: AsyncReducerStatus
  data: DatasetArea[]
}

export interface Area {
  id: string
  geometry: ContextAreaFeatureGeom | undefined
  bounds: Bbox | undefined
  name: string
}
export interface DatasetAreaDetail {
  status: AsyncReducerStatus
  data: Area
}

export type DatasetAreas = {
  list: DatasetAreaList
  detail: Record<string, DatasetAreaDetail>
}
export type AreasState = Record<string, DatasetAreas>

const initialState: AreasState = {}

export type AreaKeys = { datasetId: string; areaId: string }
export type FetchAreaDetailThunkParam = AreaKeys & { areaName?: string }
export const fetchAreaDetailThunk = createAsyncThunk(
  'areas/fetch',
  async (
    { datasetId, areaId, areaName }: FetchAreaDetailThunkParam = {} as FetchAreaDetailThunkParam,
    { signal }
  ) => {
    const area = await GFWAPI.fetch<ContextAreaFeature>(
      `/datasets/${datasetId}/user-context-layer-v1/${areaId}`,
      {
        signal,
      }
    )
    const name = areaName || area.properties.value || area.properties.name || area.id
    return {
      name,
      id: area.id,
      bounds: wrapBBoxLongitudes(bbox(area.geometry) as Bbox),
      geometry: area.geometry,
    }
  },
  {
    condition: ({ datasetId, areaId }: FetchAreaDetailThunkParam, { getState }) => {
      const { areas } = getState() as RootState
      const fetchStatus = areas[datasetId]?.detail?.[areaId]?.status
      if (
        fetchStatus === AsyncReducerStatus.Finished ||
        fetchStatus === AsyncReducerStatus.Loading
      ) {
        return false
      }
      return true
    },
  }
)

export type FetchDatasetAreasThunkParam = { datasetId: string; include?: string[] }
export const fetchDatasetAreasThunk = createAsyncThunk(
  'areas/datasetFetch',
  async (
    {
      datasetId,
      include = ['bbox'],
    }: FetchDatasetAreasThunkParam = {} as FetchDatasetAreasThunkParam,
    { signal }
  ) => {
    const datasetAreas = await GFWAPI.fetch<DatasetArea[]>(
      `/datasets/${datasetId}/user-context-layer-v1${
        include?.length ? `?includes=${include.join(',')}` : ''
      }`,
      { signal }
    )
    return datasetAreas
  },
  {
    condition: ({ datasetId }: FetchDatasetAreasThunkParam, { getState }) => {
      const { areas } = getState() as RootState
      const fetchStatus = areas[datasetId]?.list?.status
      if (
        fetchStatus === AsyncReducerStatus.Finished ||
        fetchStatus === AsyncReducerStatus.Loading
      ) {
        return false
      }
      return true
    },
  }
)

const areasSlice = createSlice({
  name: 'areas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAreaDetailThunk.pending, (state, action) => {
      const { datasetId, areaId, areaName } = action.meta.arg
      const area = {
        status: AsyncReducerStatus.Loading,
        data: { ...(areaName && { name: areaName }) } as Area,
      }
      if (state[datasetId]?.detail?.[areaId]) {
        state[datasetId].detail[areaId] = area
      } else {
        state[datasetId] = {
          list: {} as DatasetAreaList,
          detail: {
            [areaId]: area,
          },
        }
      }
    })
    builder.addCase(fetchAreaDetailThunk.fulfilled, (state, action) => {
      const { datasetId, areaId } = action.meta.arg
      state[datasetId].detail[areaId] = {
        status: AsyncReducerStatus.Finished,
        data: { ...state[datasetId].detail[areaId].data, ...action.payload },
      }
    })
    builder.addCase(fetchAreaDetailThunk.rejected, (state, action) => {
      const { datasetId, areaId } = action.meta.arg
      state[datasetId].detail[areaId].status = AsyncReducerStatus.Error
    })
    builder.addCase(fetchDatasetAreasThunk.pending, (state, action) => {
      const list = {
        status: AsyncReducerStatus.Loading,
        data: [],
      }
      const { datasetId } = action.meta.arg
      if (state[datasetId]?.list) {
        state[datasetId].list = list
      } else {
        state[datasetId] = {
          list,
          detail: {},
        }
      }
    })
    builder.addCase(fetchDatasetAreasThunk.fulfilled, (state, action) => {
      state[action.meta.arg.datasetId].list = {
        status: AsyncReducerStatus.Finished,
        data: action.payload,
      }
    })
    builder.addCase(fetchDatasetAreasThunk.rejected, (state, action) => {
      state[action.meta.arg.datasetId].list.status = AsyncReducerStatus.Error
    })
  },
})

export const selectAreas = (state: RootState) => state.areas
export const selectAreaById = memoize((id: string) =>
  createSelector([selectAreas], (areas) => areas?.[id])
)

export const selectDatasetAreasById = memoize((id: string) =>
  createSelector([selectAreas], (areas) => areas?.[id])
)

export default areasSlice.reducer
