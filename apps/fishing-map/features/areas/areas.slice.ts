import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import bbox from '@turf/bbox'
import { kebabCase, memoize, uniqBy } from 'lodash'
import {
  ContextAreaFeature,
  ContextAreaFeatureGeom,
  Dataset,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
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
export type FetchAreaDetailThunkParam = { dataset: Dataset; areaId: string; areaName?: string }
export const fetchAreaDetailThunk = createAsyncThunk(
  'areas/fetch',
  async (
    {
      dataset = {} as Dataset,
      areaId,
      areaName,
    }: FetchAreaDetailThunkParam = {} as FetchAreaDetailThunkParam,
    { signal }
  ) => {
    const endpoint = resolveEndpoint(dataset, {
      datasetId: dataset?.id,
      endpoint: EndpointId.ContextFeature,
      params: [{ id: 'id', value: areaId }],
    })
    const area = await GFWAPI.fetch<ContextAreaFeature>(endpoint, { signal })
    const name = areaName || area.properties.value || area.properties.name || area.id

    return {
      name,
      id: area.id,
      bounds: wrapBBoxLongitudes(bbox(area.geometry) as Bbox),
      geometry: area.geometry,
    }
  },
  {
    condition: ({ dataset, areaId }: FetchAreaDetailThunkParam, { getState }) => {
      const { areas } = getState() as RootState
      const fetchStatus = areas[dataset?.id]?.detail?.[areaId]?.status
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
    const areasWithSlug = datasetAreas.map((area) => ({ ...area, slug: kebabCase(area.label) }))
    return uniqBy(areasWithSlug, 'slug')
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
      const { dataset, areaId, areaName } = action.meta.arg
      const datasetId = dataset?.id
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
      const { dataset, areaId } = action.meta.arg
      const datasetId = dataset?.id
      state[datasetId].detail[areaId] = {
        status: AsyncReducerStatus.Finished,
        data: { ...state[datasetId].detail[areaId].data, ...action.payload },
      }
    })
    builder.addCase(fetchAreaDetailThunk.rejected, (state, action) => {
      const { dataset, areaId } = action.meta.arg
      const datasetId = dataset?.id
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
  createSelector([selectAreaById(id)], (area): DatasetAreaList => area?.list)
)

export default areasSlice.reducer
