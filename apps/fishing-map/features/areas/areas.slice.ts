import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { circle } from '@turf/circle'
import { flatten } from '@turf/flatten'
import { featureCollection } from '@turf/helpers'
import union from '@turf/union'
import { uniqBy } from 'es-toolkit'
import type { FeatureCollection, GeometryCollection, MultiPolygon, Polygon } from 'geojson'
import kebabCase from 'lodash/kebabCase'
import memoize from 'lodash/memoize'

import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import type { Dataset, TileContextAreaFeature } from '@globalfishingwatch/api-types'
import { EndpointId } from '@globalfishingwatch/api-types'
import { wrapBBoxLongitudes, wrapGeometryBbox } from '@globalfishingwatch/data-transforms'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'

import { fetchDatasetByIdThunk, selectDatasetById } from 'features/datasets/datasets.slice'
import { t } from 'features/i18n/i18n'
import type { RootState } from 'store'
import type { Bbox } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { listAsSentence } from 'utils/shared'

export type DrawnDatasetGeometry = FeatureCollection<Polygon, { draw_id: number }>

interface DatasetArea {
  id: string
  label: string
  bbox?: Bbox
}

interface DatasetAreaList {
  status: AsyncReducerStatus
  data: DrawnDatasetGeometry | DatasetArea[]
}

export type AreaGeometry = Polygon | MultiPolygon
export interface Area<Geometry = AreaGeometry> {
  type: 'Feature'
  id: string
  geometry: Geometry | undefined
  bounds: Bbox | undefined
  name: string
  properties: Record<any, any>
}
export interface DatasetAreaDetail {
  status: AsyncReducerStatus
  data: Area
}

type DatasetAreas = {
  list: DatasetAreaList
  detail: Record<string, DatasetAreaDetail>
}
type AreasState = Record<string, DatasetAreas>

const initialState: AreasState = {}

export type AreaKeyId = string | number
export type AreaKeys = { datasetId: string; areaId: AreaKeyId; areaName: string | undefined }
type FetchAreaDetailThunkParam = {
  datasetId: string
  areaId: AreaKeyId
  areaName?: string
  simplify?: string
}

async function fetchAreaDetail({
  dataset,
  areaId,
  signal,
  simplify,
  areaName,
}: {
  dataset: Dataset
  areaId: AreaKeyId
  areaName?: string
  signal?: AbortSignal
  simplify?: string
}) {
  const datasetConfig = {
    datasetId: dataset?.id,
    endpoint: EndpointId.ContextFeature,
    params: [{ id: 'id', value: areaId }],
  }
  const endpoint = resolveEndpoint(dataset, {
    ...datasetConfig,
    query: simplify ? [{ id: 'simplify', value: parseFloat(simplify) }] : [],
  })
  if (!endpoint) {
    console.warn('No endpoint found for area detail fetch')
    return
  }
  let area = await GFWAPI.fetch<TileContextAreaFeature<AreaGeometry | GeometryCollection>>(
    endpoint,
    { signal }
  )
  if (!area.geometry) {
    const endpointNoSimplified = resolveEndpoint(dataset, datasetConfig) as string
    area = await GFWAPI.fetch<TileContextAreaFeature<AreaGeometry | GeometryCollection>>(
      endpointNoSimplified,
      {
        signal,
      }
    )
    if (!area.geometry) {
      console.warn('Area has no geometry, even calling the endpoint without simplification')
    }
  }
  const geometry =
    (area.geometry as GeometryCollection).type === 'GeometryCollection'
      ? (union(flatten(area.geometry))?.geometry as AreaGeometry)
      : (area.geometry as AreaGeometry)

  if (!geometry) {
    console.warn('No geometry found for area', area)
  }
  const bounds = area.bbox ? wrapBBoxLongitudes(area.bbox) : wrapGeometryBbox(geometry)
  // Doing this once to avoid recomputing inside turf booleanPointInPolygon for each cell
  // https://github.com/Turfjs/turf/blob/master/packages/turf-boolean-point-in-polygon/index.ts#L63
  if (area.geometry) {
    area.geometry.bbox = bounds
  }
  return {
    id: area.id,
    name: areaName || area.value || area.properties.value || area.properties.name || area.id,
    bounds,
    type: area.type as 'Feature',
    geometry,
    properties: area.properties,
  }
}

export const fetchAreaDetailThunk = createAsyncThunk(
  'areas/fetch',
  async (
    {
      datasetId,
      areaId,
      areaName,
      simplify,
    }: FetchAreaDetailThunkParam = {} as FetchAreaDetailThunkParam,
    { signal, getState, rejectWithValue, dispatch }
  ) => {
    try {
      const isMultipleDatasets = datasetId.includes(',')
      if (isMultipleDatasets) {
        const datasetIds = datasetId.split(',')
        const datasetsPromises = await Promise.all(
          datasetIds.map(async (datasetId) => {
            let dataset = selectDatasetById(datasetId)(getState() as RootState)
            if (!dataset) {
              // It needs to be request when it hasn't been loaded yet
              const action = await dispatch(fetchDatasetByIdThunk(datasetId))
              if (fetchDatasetByIdThunk.fulfilled.match(action)) {
                dataset = action.payload
              }
            }
            return dataset
          })
        )
        const datasets = datasetsPromises.flat()

        const simplifies = simplify?.split(',')
        const areaIds = areaId.toString().split(',')
        const areas = await Promise.all(
          datasets.map((dataset, index) =>
            fetchAreaDetail({
              dataset,
              areaName,
              areaId: areaIds[index],
              simplify: simplifies?.[index],
              signal,
            })
          )
        )
        try {
          const areaFeatures = featureCollection(
            areas.flatMap((area) => {
              if (!area) return []
              return (area?.geometry as any).type === 'Point' ? circle(area as any, 1) || [] : area
            })
          )
          const mergedFeature = union(areaFeatures)
          if (mergedFeature) {
            const bounds = mergedFeature.bbox
              ? wrapBBoxLongitudes(mergedFeature.bbox as Bbox)
              : wrapGeometryBbox(mergedFeature.geometry)
            const area = {
              id: areaId.toString(),
              name:
                areaName ||
                `${t('common.unionOf', 'Union of')} ${listAsSentence(
                  areas.flatMap((a) => a?.name || [])
                )}`,
              bounds: bounds,
              geometry: mergedFeature.geometry as AreaGeometry,
              properties: { areaIds, datasetIds },
            }
            return area
          }
        } catch (e) {
          console.error('Error merging areas', e)
        }
      }
      let dataset = selectDatasetById(datasetId)(getState() as RootState)
      if (!dataset) {
        const action = await dispatch(fetchDatasetByIdThunk(datasetId))
        if (fetchDatasetByIdThunk.fulfilled.match(action)) {
          dataset = action.payload
        }
      }
      const area = await fetchAreaDetail({ dataset, areaId, areaName, signal, simplify })
      return area
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: ({ datasetId, areaId }: FetchAreaDetailThunkParam, { getState }) => {
      const { areas } = getState() as { areas: AreasState }
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

type FetchDatasetAreasThunkParam = { datasetId: string; include?: string[] }
export const fetchDatasetAreasThunk = createAsyncThunk(
  'areas/datasetFetch',
  async (
    {
      datasetId,
      include = ['bbox'],
    }: FetchDatasetAreasThunkParam = {} as FetchDatasetAreasThunkParam,
    { signal, rejectWithValue }
  ) => {
    try {
      const datasetAreas = await GFWAPI.fetch<DatasetArea[] | DrawnDatasetGeometry>(
        `/datasets/${datasetId}/user-context-layers${
          include?.length ? `?includes=${include.join(',')}&cache=false` : ''
        }`,
        { signal, cache: 'no-cache' }
      )
      if ((datasetAreas as DrawnDatasetGeometry).type === 'FeatureCollection') {
        return datasetAreas
      }
      const areasWithSlug = (datasetAreas as DatasetArea[]).map((area) => ({
        ...area,
        slug: kebabCase(area.label),
      }))
      return uniqBy(areasWithSlug, (a) => a.slug)
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
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
    resetAreaList: (state, action: PayloadAction<{ datasetId: string }>) => {
      const { datasetId } = action.payload
      if (state[datasetId]?.list) {
        state[datasetId].list = {
          status: AsyncReducerStatus.Idle,
          data: [],
        }
      }
    },
    resetAreaDetail: (state, action: PayloadAction<{ datasetId: string; areaId: string }>) => {
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
      const { datasetId, areaId, areaName } = action.meta.arg as FetchAreaDetailThunkParam
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
      const { datasetId, areaId } = action.meta.arg as FetchAreaDetailThunkParam
      state[datasetId].detail[areaId] = {
        status: AsyncReducerStatus.Finished,
        data: { ...state[datasetId].detail[areaId].data, ...action.payload },
      }
    })
    builder.addCase(fetchAreaDetailThunk.rejected, (state, action) => {
      const { datasetId, areaId } = action.meta.arg as FetchAreaDetailThunkParam
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

export const { resetAreaList, resetAreaDetail } = areasSlice.actions

export const selectAreas = (state: { areas: AreasState }) => state.areas
const selectDatasetAreaById = memoize((id: string) =>
  createSelector([selectAreas], (areas) => areas?.[id])
)

export const selectDatasetAreasById = memoize((id: string) =>
  createSelector([selectDatasetAreaById(id)], (area): DatasetAreaList => area?.list)
)

export const selectDatasetAreaStatus = memoize(
  ({ datasetId, areaId }: { datasetId: string; areaId: string }) =>
    createSelector([selectDatasetAreaById(datasetId)], (area): AsyncReducerStatus => {
      return area?.detail?.[areaId]?.status
    })
)
export const selectDatasetAreaDetail = memoize(
  ({ datasetId, areaId }: { datasetId: string; areaId: string }) =>
    createSelector([selectDatasetAreaById(datasetId)], (area): Area => {
      return area?.detail?.[areaId]?.data
    })
)

export default areasSlice.reducer
