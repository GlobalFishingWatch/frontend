import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { kebabCase, memoize, uniqBy } from 'lodash'
import { MultiPolygon } from 'geojson'
import {
  ContextAreaFeature,
  ContextAreaFeatureGeom,
  Dataset,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { wrapGeometryBbox } from '@globalfishingwatch/data-transforms'
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
  properties: Record<any, any>
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

export type AreaKeyId = string | number
export type AreaKeys = { datasetId: string; areaId: AreaKeyId }
export type FetchAreaDetailThunkParam = {
  dataset: Dataset
  areaId: AreaKeyId
  areaName?: string
  simplify?: number
}

export const fetchAreaDetailThunk = createAsyncThunk(
  'areas/fetch',
  async (
    {
      dataset = {} as Dataset,
      areaId,
      areaName,
      simplify,
    }: FetchAreaDetailThunkParam = {} as FetchAreaDetailThunkParam,
    { signal }
  ) => {
    const datasetConfig = {
      datasetId: dataset?.id,
      endpoint: EndpointId.ContextFeature,
      params: [{ id: 'id', value: areaId }],
    }
    const endpoint = resolveEndpoint(dataset, {
      ...datasetConfig,
      query: simplify ? [{ id: 'simplify', value: simplify }] : [],
    })
    if (!endpoint) {
      console.warn('No endpoint found for area detail fetch')
      return
    }
    let area = await GFWAPI.fetch<ContextAreaFeature>(endpoint, { signal })
    if (!area.geometry) {
      const endpointNoSimplified = resolveEndpoint(dataset, datasetConfig) as string
      area = await GFWAPI.fetch<ContextAreaFeature>(endpointNoSimplified, { signal })
      if (!area.geometry) {
        console.warn('Area has no geometry, even calling the endpoint without simplification')
      }
    }
    const bounds = wrapGeometryBbox(area.geometry as MultiPolygon)
    // Doing this once to avoid recomputing inside turf booleanPointInPolygon for each cell
    // https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-point-in-polygon/index.ts#L63
    if (area.geometry) {
      area.geometry.bbox = bounds
    }
    return {
      id: area.id,
      name: areaName || area.value || area.properties.value || area.properties.name || area.id,
      bounds,
      geometry: area.geometry,
      properties: area.properties,
    }
  },
  {
    condition: ({ dataset, areaId }: FetchAreaDetailThunkParam, { getState }) => {
      const { areas } = getState() as { areas: AreasState }
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
      const { areas } = getState() as { areas: AreasState }
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
  reducers: {
    resetAreaDetail: (state, action: PayloadAction<{ datasetId: string; areaId: number }>) => {
      const { datasetId, areaId } = action.payload
      if (state[datasetId]?.detail?.[areaId]) {
        state[datasetId].detail[areaId] = {
          status: AsyncReducerStatus.Idle,
          data: {} as Area,
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAreaDetailThunk.pending, (state, action) => {
      const { dataset, areaId, areaName } = action.meta.arg as FetchAreaDetailThunkParam
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
      const { dataset, areaId } = action.meta.arg as FetchAreaDetailThunkParam
      const datasetId = dataset?.id
      state[datasetId].detail[areaId] = {
        status: AsyncReducerStatus.Finished,
        data: { ...state[datasetId].detail[areaId].data, ...action.payload },
      }
    })
    builder.addCase(fetchAreaDetailThunk.rejected, (state, action) => {
      const { dataset, areaId } = action.meta.arg as FetchAreaDetailThunkParam
      const datasetId = dataset?.id
      state[datasetId].detail[areaId].status = AsyncReducerStatus.Error
    })
    builder.addCase(fetchDatasetAreasThunk.pending, (state, action) => {
      const list = {
        status: AsyncReducerStatus.Loading,
        data: [],
      }
      const { datasetId } = action.meta.arg as FetchDatasetAreasThunkParam
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
      const { datasetId } = action.meta.arg as FetchDatasetAreasThunkParam
      state[datasetId].list = {
        status: AsyncReducerStatus.Finished,
        data: action.payload,
      }
    })
    builder.addCase(fetchDatasetAreasThunk.rejected, (state, action) => {
      const { datasetId } = action.meta.arg as FetchDatasetAreasThunkParam
      state[datasetId].list.status = AsyncReducerStatus.Error
    })
  },
})

export const { resetAreaDetail } = areasSlice.actions

export const selectAreas = (state: { areas: AreasState }) => state.areas
export const selectDatasetAreaById = memoize((id: string) =>
  createSelector([selectAreas], (areas) => areas?.[id])
)

export const selectDatasetAreasById = memoize((id: string) =>
  createSelector([selectDatasetAreaById(id)], (area): DatasetAreaList => area?.list)
)

export const selectDatasetAreaStatus = memoize(
  ({ datasetId, areaId }: { datasetId: string; areaId: number }) =>
    createSelector([selectDatasetAreaById(datasetId)], (area): AsyncReducerStatus => {
      return area?.detail?.[areaId]?.status
    })
)
export const selectDatasetAreaDetail = memoize(
  ({ datasetId, areaId }: { datasetId: string; areaId: number }) =>
    createSelector([selectDatasetAreaById(datasetId)], (area): Area => {
      return area?.detail?.[areaId]?.data
    })
)

export default areasSlice.reducer
