import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import { Generators } from '@globalfishingwatch/layer-composer'
import DataviewsClient, { Dataview } from '@globalfishingwatch/dataviews-client'
import { RootState } from 'store/store'

const MOCK: Record<string, Dataview[]> = {
  '/dataviews/': [
    {
      id: 0,
      name: 'background',
      description: 'background',
      viewParams: {
        id: 'background',
        type: Generators.Type.Background,
      },
    },
    {
      id: 1,
      name: 'basemap',
      description: 'basemap',
      viewParams: {
        id: 'landmass',
        type: Generators.Type.Basemap,
      },
    },
    {
      id: 2,
      name: 'Carrier Track',
      description: 'Carrier Track desc',
      datasetIds: ['carriers:dev'],
      datasetsParams: [
        {
          id: '123abc',
          binary: true,
          fields: 'latlon,fishing,speed',
        },
      ],
      viewParams: {
        id: 'some_track',
        type: Generators.Type.Track,
        color: '#ff00ff',
      },
    },
  ],
}

const mockFetch = (mockFetchUrl: string): Promise<Response> => {
  const mock = MOCK[mockFetchUrl]
  // if (!mock) {
  //   return GFWAPI.fetch(mockFetchUrl, { json: false })
  // }
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
}
