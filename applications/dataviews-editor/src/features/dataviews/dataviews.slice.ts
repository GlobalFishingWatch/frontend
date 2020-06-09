import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import { Generators } from '@globalfishingwatch/layer-composer'
import DataviewsClient, {
  Dataview,
  Dataset,
  ViewParams,
} from '@globalfishingwatch/dataviews-client'
import GFWAPI from '@globalfishingwatch/api-client'
import { RootState } from 'store/store'
import { addResources, completeLoading } from './resources.slice'

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
  '/dataviews/': [
    {
      id: 0,
      name: 'background',
      description: 'background',
      defaultViewParams: {
        type: Generators.Type.Background,
      },
    },
    {
      id: 1,
      name: 'landmass',
      description: 'landmass',
      defaultViewParams: {
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
      defaultViewParams: {
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
      defaultViewParams: {
        type: Generators.Type.Track,
        color: '#0000ff',
      },
    },
  ],
}

const mockFetch = (mockFetchUrl: string): Promise<Response> => {
  const mock = MOCK[mockFetchUrl]
  if (!mock) {
    return GFWAPI.fetch(mockFetchUrl, { json: false })
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
  editorId: number
  added: boolean
  dirty: boolean
  editing: boolean
  allEndpointsLoaded?: boolean
}

const initialState: { dataviews: EditorDataview[] } = {
  dataviews: [],
}

const slice = createSlice({
  name: 'dataviews',
  initialState,
  reducers: {
    setDataviews: (state, action) => {
      const editorDataviews = action.payload.map((dataview: Dataview, index: number) => {
        return {
          editorId: index,
          added: false,
          dirty: false,
          editing: false,
          ...dataview,
        }
      })
      state.dataviews = editorDataviews
    },
    setEditing: (state, action: PayloadAction<number>) => {
      state.dataviews.forEach((d, index) => {
        d.editing = action.payload === index
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
        dataview.defaultViewParams = action.payload.params
        dataview.dirty = true
      }
    },
    addViewParam: (state, action: PayloadAction<number>) => {
      const dataview = state.dataviews.find((d) => d.editorId === action.payload)
      if (dataview) {
        let paramName
        let i = 0
        while (!paramName) {
          const newParamName = `param${i}`
          if (!dataview.defaultViewParams![newParamName]) {
            paramName = newParamName
          }
          i++
        }
        dataview.defaultViewParams![paramName] = 'value'
        dataview.dirty = true
      }
    },
  },
})
export const { setDataviews, setEditing, setMeta, setViewParams, addViewParam } = slice.actions
export default slice.reducer
export const selectDataviews = (state: RootState) => state.dataviews.dataviews

export const fetchDataviews = () => async (dispatch: Dispatch<PayloadAction>) => {
  const dataviews = await dataviewsClient.getDataviews()
  dispatch(setDataviews(dataviews))
}

export const fetchResources = (dataviews: Dataview[]) => async (dispatch: any) => {
  const { resources, promises } = dataviewsClient.getResources(dataviews)
  dispatch(addResources(resources))
  promises.forEach((promise) => {
    promise.then((resource) => {
      dispatch(completeLoading(resource))
    })
  })
}
