import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import { Generators } from '@globalfishingwatch/layer-composer'
import DataviewsClient, { Dataview, Dataset } from '@globalfishingwatch/dataviews-client'
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
        id: 'background',
        type: Generators.Type.Background,
      },
    },
    {
      id: 1,
      name: 'basemap',
      description: 'basemap',
      defaultViewParams: {
        id: 'landmass',
        type: Generators.Type.Basemap,
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
        id: 'some_track',
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
        id: 'some_track',
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
      const editorDataviews = action.payload.map((dataview: Dataview) => {
        return {
          added: false,
          dirty: false,
          editing: false,
          ...dataview,
        }
      })
      state.dataviews = editorDataviews
    },
    setEditing: (state, action: PayloadAction<number>) => {
      state.dataviews.forEach((d) => {
        d.editing = action.payload === d.id
      })
    },
    setMeta: (
      state,
      action: PayloadAction<{ id: number; field: 'name' | 'description'; value: string }>
    ) => {
      const dataview = state.dataviews.find((d) => d.id === action.payload.id)
      if (dataview) {
        dataview[action.payload.field] = action.payload.value
        dataview.dirty = true
      }
    },
  },
})
export const { setDataviews, setEditing, setMeta } = slice.actions
export default slice.reducer
export const selectDataviews = (state: RootState) => state.dataviews.dataviews

export const fetchDataviews = () => async (dispatch: Dispatch<PayloadAction>) => {
  const dataviews = await dataviewsClient.getDataviews()
  dispatch(setDataviews(dataviews))
  // TODO trigger on button click OR add to workspace

  // dispatch(setData)
}

export const fetchResources = (dataviews: Dataview[]) => async (dispatch: any) => {
  const { resources, promises } = dataviewsClient.getResources(dataviews)
  dispatch(addResources(resources))
  promises.forEach((promise) => {
    promise.then((resource) => {
      console.log(resource)
      dispatch(completeLoading(resource))
    })
  })
}
