import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { kebabCase, memoize, uniqBy } from 'lodash'
import { Polygon, MultiPolygon, FeatureCollection } from 'geojson'
import union from '@turf/union'
import { featureCollection } from '@turf/helpers'
import { TileContextAreaFeature, Dataset, EndpointId } from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { wrapGeometryBbox, wrapBBoxLongitudes } from '@globalfishingwatch/data-transforms'
import { Bbox } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { RootState } from 'store'
import { listAsSentence } from 'utils/shared'
import { t } from 'features/i18n/i18n'

type DrawnDatasetGeometry = FeatureCollection<Polygon, { draw_id: number }>

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
  let area = await GFWAPI.fetch<TileContextAreaFeature<AreaGeometry>>(endpoint, { signal })
  if (!area.geometry) {
    const endpointNoSimplified = resolveEndpoint(dataset, datasetConfig) as string
    area = await GFWAPI.fetch<TileContextAreaFeature<AreaGeometry>>(endpointNoSimplified, {
      signal,
    })
    if (!area.geometry) {
      console.warn('Area has no geometry, even calling the endpoint without simplification')
    }
  }
  const bounds = area.bbox ? wrapBBoxLongitudes(area.bbox) : wrapGeometryBbox(area.geometry)
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
    geometry: area.geometry,
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
    { signal, getState }
  ) => {
    const isMultipleDatasets = datasetId.includes(',')
    if (isMultipleDatasets) {
      const datasetIds = datasetId.split(',')
      const datasets = datasetIds.flatMap(
        (id) => selectDatasetById(id)(getState() as RootState) || []
      )

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
      const mergedFeature = union(featureCollection(areas.flatMap((area) => area || [])))
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
    }
    const dataset = selectDatasetById(datasetId)(getState() as RootState)
    const area = await fetchAreaDetail({ dataset, areaId, areaName, signal, simplify })
    return area
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
    { signal }
  ) => {
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
