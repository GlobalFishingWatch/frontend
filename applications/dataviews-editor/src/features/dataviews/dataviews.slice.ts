import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import maxBy from 'lodash/maxBy'
import { Generators, trackSegments, TRACK_FIELDS } from '@globalfishingwatch/layer-composer'
import DataviewsClient, {
  Dataview,
  ViewParams,
  DatasetParams,
  Dataset,
  Endpoint,
} from '@globalfishingwatch/dataviews-client'
import { Type } from '@globalfishingwatch/layer-composer/dist/generators/types'
import GFWAPI from '@globalfishingwatch/api-client'
import { RootState } from 'store/store'
import { addResources, completeLoading as completeResourceLoading } from './resources.slice'
import { carrierEndpoints } from './data'

// const DATASET: Dataset = {
//   id: 'carriers:dev',
//   endpoints: [
//     {
//       type: 'track',
//       downloadable: true,
//       params: [
//         {
//           label: 'vessel id',
//           id: 'id',
//           type: 'string',
//         },
//       ],
//       query: [
//         {
//           label: 'start date',
//           id: 'startDate',
//           type: 'Date ISO',
//           required: false,
//         },
//         {
//           label: 'end date',
//           id: 'endDate',
//           type: 'Date ISO',
//           required: false,
//         },
//         {
//           label: 'binary',
//           id: 'binary',
//           type: 'boolean',
//           default: true,
//         },
//         {
//           label: 'format',
//           id: 'format',
//           type: 'string',
//           default: 'lines',
//           description:
//             'Specific encoding format to use for the track. Possible values lines, points or valueArray. valueArray: is a custom compact format, an array with all the fields serialized. The format is further explained in this issue: valueArray format. lines: Geojson with a single LineString feature containing all the points in the track points: Geojson with a FeatureCollection containing a Point feature for every point in the track',
//         },
//       ],
//       pathTemplate: `/datasets/{{dataset}}/vessels/{{id}}/tracks`,
//     },
//     {
//       type: 'vessel',
//       downloadable: true,
//       params: [
//         {
//           label: 'vessel id',
//           id: 'id',
//           type: 'string',
//         },
//       ],
//       query: [],
//       pathTemplate: `/datasets/{{dataset}}/vessels/{{id}}`,
//     },
//     {
//       type: 'events',
//       downloadable: true,
//       params: [],
//       query: [
//         {
//           label: 'event type',
//           id: 'type',
//           type: 'string',
//         },
//       ],
//       pathTemplate: `/datasets/{{dataset}}/events`,
//     },
//   ],
// }

// const MOCK: Record<string, Dataview[]> = {
//   // here toggle between API and mock
//   // '/dataviews?include=dataset%2Cdataset.endpoints': [
//   dummy: [
//     {
//       id: 0,
//       name: 'background',
//       description: 'background',
//       defaultView: {
//         type: Generators.Type.Background,
//       },
//     },
//     {
//       id: 1,
//       name: 'landmass',
//       description: 'landmass',
//       defaultView: {
//         type: Generators.Type.Basemap,
//         basemap: Generators.BasemapType.Landmass,
//       },
//     },
//     {
//       id: 2,
//       name: 'Carrier Track',
//       description: 'Carrier Track desc',
//       datasets: [DATASET],
//       defaultDatasetsParams: [
//         {
//           id: '46df37738-8057-e7d4-f3f3-a9b44d52fe03',
//           binary: true,
//           format: 'valueArray',
//           fields: 'lonlat,timestamp',
//           startDate: '2017-01-01T00:00:00.000Z',
//           endDate: '2020-01-01T00:00:00.000Z',
//         },
//       ],
//       defaultView: {
//         type: Generators.Type.Track,
//         color: '#ff00ff',
//       },
//     },
//     {
//       id: 3,
//       name: 'Fishing Track',
//       description: 'Carrier Track desc',
//       datasets: [DATASET],
//       defaultDatasetsParams: [
//         {
//           id: 'c723c1925-56f9-465c-bee8-bcc6d649c17c',
//           binary: true,
//           format: 'valueArray',
//           fields: 'lonlat,timestamp',
//           startDate: '2017-01-01T00:00:00.000Z',
//           endDate: '2020-01-01T00:00:00.000Z',
//         },
//       ],
//       defaultView: {
//         type: Generators.Type.Track,
//         color: '#0000ff',
//       },
//     },
//   ],
// }

// const mockFetch: DataviewsClientFetch = (url, init) => {
//   const mock = MOCK[url]
//   if (!mock) {
//     return GFWAPI.fetch(url, init)
//   }
//   return new Promise<any>((resolve) => {
//     setTimeout(() => {
//       resolve(mock)
//     }, 1)
//   })
// }

const dataviewsClient = new DataviewsClient()

export interface EditorDataview extends Dataview {
  // every DV has a distinct editor ID
  editorId: number
  // is DV present in workspace (checkbox checked)
  added?: boolean
  // has DV been changed since last save
  dirty: boolean
  // is dv the one being edited in DV panel
  editing: boolean
  // whether DV has been savedOnce ?  already
  savedOnce?: boolean
  // which endpoint is selected to load and fill params and query
  selectedEndpoint?: string
}

const initialState: { dataviews: EditorDataview[]; loading: boolean } = {
  dataviews: [],
  loading: false,
}

const slice = createSlice({
  name: 'dataviews',
  initialState,
  reducers: {
    setDataviews: (state, action) => {
      const editorDataviews = action.payload.map((dataview: Dataview, index: number) => {
        return {
          editorId: index,
          dirty: false,
          editing: false,
          savedOnce: true,
          ...dataview,
        }
      })
      state.dataviews = editorDataviews
    },
    addDataview: (state) => {
      const currentId = maxBy(state.dataviews, (dv) => dv.editorId)?.editorId || 99
      const newDataview: EditorDataview = {
        editorId: currentId + 1,
        dirty: true,
        editing: false,
        savedOnce: false,
        id: -1,
        name: 'new dataview',
        description: '',
        defaultView: {
          type: Generators.Type.Background,
        },
      }
      state.dataviews.push(newDataview)
    },
    addDataset: (state, action: PayloadAction<number>) => {
      const dataview = state.dataviews.find((d) => d.editorId === action.payload)
      if (dataview) {
        dataview.datasets = [{ id: '' }]
        dataview.dirty = true
      }
    },
    setDatasetId: (state, action: PayloadAction<{ editorId: number; dataset: string }>) => {
      const dataview = state.dataviews.find((d) => d.editorId === action.payload.editorId)
      if (dataview && dataview.datasets && dataview.datasets[0]) {
        dataview.datasets[0].id = action.payload.dataset
        dataview.dirty = true
      }
    },
    setDataset: (
      state,
      action: PayloadAction<{
        editorId: number
        dataset: Dataset
        defaultParams: DatasetParams[]
      }>
    ) => {
      const dataview = state.dataviews.find((d) => d.editorId === action.payload.editorId)
      if (dataview && dataview.datasets && dataview.datasets[0]) {
        dataview.datasets[0] = action.payload.dataset
        // TODO move this to dataset ?
        dataview.defaultDatasetsParams = action.payload.defaultParams
      }
    },
    setEditing: (state, action: PayloadAction<number>) => {
      state.dataviews.forEach((d, index) => {
        d.editing = action.payload === d.editorId
      })
    },
    setMeta: (
      state,
      action: PayloadAction<{
        editorId: number
        field: 'name' | 'description'
        value: string
      }>
    ) => {
      const dataview = state.dataviews.find((d) => d.editorId === action.payload.editorId)
      if (dataview) {
        dataview[action.payload.field] = action.payload.value
        dataview.dirty = true
      }
    },
    setDatasetEndpoint: (
      state,
      action: PayloadAction<{
        editorId: number
        dataset: string
        endpoint: string
      }>
    ) => {
      const { editorId, endpoint, dataset } = action.payload
      const dataview = state.dataviews.find((d) => d.editorId === editorId)
      if (dataview) {
        dataview.selectedEndpoint = endpoint
        dataview.defaultDatasetsParams = dataview.defaultDatasetsParams
          ? dataview.defaultDatasetsParams.map((datasetParam) => {
              if (datasetParam.endpoint !== endpoint) return datasetParam
              return {
                dataset,
                endpoint,
                params: datasetParam.params || {},
                query: datasetParam.query || {},
              }
            })
          : []
      }
    },
    setDatasetParams: (
      state,
      action: PayloadAction<{ editorId: number; type: 'params' | 'query'; params: DatasetParams }>
    ) => {
      const { editorId, type, params } = action.payload
      const dataview = state.dataviews.find((d) => d.editorId === editorId)
      debugger
      if (
        dataview?.defaultDatasetsParams &&
        dataview?.defaultDatasetsParams[0] &&
        dataview.defaultDatasetsParams[0][type]
      ) {
        dataview.dirty = true
        const datasetParams = dataview.defaultDatasetsParams[0][type]
        dataview.defaultDatasetsParams[0][type] = {
          ...(datasetParams as DatasetParams),
          ...params,
        }
      }
    },
    setViewParams: (state, action: PayloadAction<{ editorId: number; params: ViewParams }>) => {
      const dataview = state.dataviews.find((d) => d.editorId === action.payload.editorId)
      if (dataview) {
        dataview.defaultView = {
          ...dataview.defaultView,
          ...action.payload.params,
        }
        dataview.dirty = true
      }
    },
    setType: (state, action: PayloadAction<{ editorId: number; type: Type }>) => {
      const dataview = state.dataviews.find((d) => d.editorId === action.payload.editorId)
      if (dataview) {
        dataview.defaultView = {
          type: action.payload.type,
        }
        dataview.dirty = true
      }
    },
    startLoading: (state) => {
      state.loading = true
    },
    completeLoading: (state) => {
      state.loading = false
    },
    replaceDataview: (state, action) => {
      const existingIndex = state.dataviews.findIndex((d) => d.editorId === action.payload.editorId)
      if (existingIndex > -1) {
        state.dataviews[existingIndex] = {
          editorId: action.payload.editorId,
          dirty: false,
          editing: true,
          savedOnce: true,
          ...action.payload.dataview,
        }
      }
    },
    deleteDataview: (state, action) => {
      const existingIndex = state.dataviews.findIndex((d) => d.editorId === action.payload.editorId)
      state.dataviews.splice(existingIndex, 1)
    },
  },
})
export const {
  setDataviews,
  addDataview,
  addDataset,
  setDatasetId,
  setEditing,
  setMeta,
  setDataset,
  setDatasetEndpoint,
  setDatasetParams,
  setViewParams,
  setType,
  startLoading,
  completeLoading,
  replaceDataview,
  deleteDataview,
} = slice.actions
export default slice.reducer

export const selectDataviews = (state: RootState) => state.dataviews.dataviews
export const selectLoading = (state: RootState) => state.dataviews.loading

export const fetchDataviews = () => async (dispatch: Dispatch<PayloadAction>) => {
  const dataviews = await dataviewsClient.getDataviews()
  dispatch(setDataviews(dataviews))
}

export const startUpdatingDataview = (dataview: EditorDataview) => async (
  dispatch: Dispatch<PayloadAction>
) => {
  dispatch(startLoading())
  const editorId = dataview.editorId
  const dataviewResp: Dataview = await dataviewsClient.updateDataview(
    dataview,
    dataview.savedOnce || false
  )
  dispatch(replaceDataview({ editorId, dataview: dataviewResp }))
  dispatch(completeLoading())
}

export const startDeletingDataview = (dataview: EditorDataview) => async (
  dispatch: Dispatch<PayloadAction>
) => {
  dispatch(startLoading())
  const editorId = dataview.editorId
  await dataviewsClient.deleteDataview(dataview)
  dispatch(deleteDataview({ editorId }))
  dispatch(completeLoading())
}

export const fetchDataset = ({
  editorId,
  datasetId,
}: {
  editorId: number
  datasetId: string
}) => async (dispatch: any) => {
  try {
    const dataset = await GFWAPI.fetch<Dataset>(`/datasets/${datasetId}`)
    dataset.endpoints = carrierEndpoints as Endpoint[]
    const defaultParams = [
      {
        dataset: 'carriers:v20200507',
        endpoint: 'track',
        params: {
          id: '46df37738-8057-e7d4-f3f3-a9b44d52fe03',
        },
        query: {
          binary: 'true',
          fields: 'lonlat,timestamp',
          format: 'valueArray',
          endDate: '2020-01-01T00:00:00.000Z',
          startDate: '2017-01-01T00:00:00.000Z',
        },
      },
    ]
    dispatch(setDataset({ editorId, dataset, defaultParams }))
  } catch (e) {
    console.log(e)
  }
}

export const fetchResources = (dataviews: Dataview[]) => async (dispatch: any) => {
  const { resources, promises } = dataviewsClient.getResources(dataviews)
  dispatch(addResources(resources))
  promises.forEach((promise) => {
    promise.then((resource) => {
      if (resource.responseType === 'vessel') {
        resource.data = trackSegments(resource.data as number[], TRACK_FIELDS)
      }
      dispatch(completeResourceLoading(resource))
    })
  })
}
