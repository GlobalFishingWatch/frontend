import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import maxBy from 'lodash/maxBy'
import { Generators } from '@globalfishingwatch/layer-composer'
import DataviewsClient, {
  Dataview,
  Dataset,
  ViewParams,
} from '@globalfishingwatch/dataviews-client'
import GFWAPI, { FetchOptions } from '@globalfishingwatch/api-client'
import { Type } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { RootState } from 'store/store'
import { addResources, completeLoading as completeResourceLoading } from './resources.slice'

const DATASET: Dataset = {
  id: 'carriers:dev',
  endpoints: [
    {
      type: 'track',
      downloadable: true,
      urlTemplate: `/datasets/{{dataset}}/vessels/{{id}}/tracks?startDate={{startDate}}&endDate={{endDate}}&binary={{binary}}&fields={{fields}}&format={{format}}&wrapLongitudes=false`,
    },
  ],
}

const MOCK: Record<string, Dataview[]> = {
  // here toggle between API and mock
  // 'dummy': [
  '/dataviews?include=dataset%2Cdataset.endpoints': [
    {
      id: 0,
      name: 'background',
      description: 'background',
      defaultView: {
        type: Generators.Type.Background,
      },
    },
    {
      id: 1,
      name: 'landmass',
      description: 'landmass',
      defaultView: {
        type: Generators.Type.Basemap,
        basemap: Generators.BasemapType.Landmass,
      },
    },
    {
      id: 2,
      name: 'Carrier Track',
      description: 'Carrier Track desc',
      datasets: [DATASET],
      defaultDatasetsParams: [
        {
          id: '46df37738-8057-e7d4-f3f3-a9b44d52fe03',
          binary: false,
          format: 'lines',
          fields: 'lonlat,timestamp',
          startDate: '2017-01-01T00:00:00.000Z',
          endDate: '2020-01-01T00:00:00.000Z',
        },
      ],
      defaultView: {
        type: Generators.Type.Track,
        color: '#ff00ff',
      },
    },
    {
      id: 3,
      name: 'Fishing Track',
      description: 'Carrier Track desc',
      datasets: [DATASET],
      defaultDatasetsParams: [
        {
          id: 'c723c1925-56f9-465c-bee8-bcc6d649c17c',
          binary: false,
          format: 'lines',
          fields: 'lonlat,timestamp',
          startDate: '2017-01-01T00:00:00.000Z',
          endDate: '2020-01-01T00:00:00.000Z',
        },
      ],
      defaultView: {
        type: Generators.Type.Track,
        color: '#0000ff',
      },
    },
  ],
}

const mockFetch = (url: string, init?: FetchOptions): Promise<Response> => {
  const mock = MOCK[url]
  if (!mock) {
    return GFWAPI.fetch(url as string, init as any)
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        new Response(JSON.stringify(mock), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    }, 1)
  })
}

const dataviewsClient = new DataviewsClient(mockFetch)

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
  allEndpointsLoaded?: boolean
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
        defaultDatasetsParams: [{}],
        defaultView: {
          type: Generators.Type.Background,
        },
      }
      state.dataviews.push(newDataview)
    },
    setEditing: (state, action: PayloadAction<number>) => {
      state.dataviews.forEach((d, index) => {
        d.editing = action.payload === d.editorId
      })
    },
    setMeta: (
      state,
      action: PayloadAction<{ editorId: number; field: 'name' | 'description'; value: string }>
    ) => {
      const dataview = state.dataviews.find((d) => d.editorId === action.payload.editorId)
      if (dataview) {
        dataview[action.payload.field] = action.payload.value
        dataview.dirty = true
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
  setEditing,
  setMeta,
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

export const fetchResources = (dataviews: Dataview[]) => async (dispatch: any) => {
  const { resources, promises } = dataviewsClient.getResources(dataviews)
  dispatch(addResources(resources))
  promises.forEach((promise) => {
    promise.then((resource) => {
      dispatch(completeResourceLoading(resource))
    })
  })
}
