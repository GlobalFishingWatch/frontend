import { createSelector, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { AOIConfig } from 'types'
import GFWAPI from '@globalfishingwatch/api-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const fetchAOI = createAsyncThunk('aoi/fetchList', async () => {
  // const data = await GFWAPI.fetch<AOIConfig[]>('http://localhost:3001/aoi')
  // return data
  await timeout(100)
  return [
    {
      id: 1,
      label: 'Caribe',
      bbox: [-82, 21, -45, 2],
      geometry: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-82.42414360599997, 21.551266906000023],
                  [-82.42414360599997, 1.7392250490000265],
                  [-46.15867214299993, 1.4002702140000451],
                  [-45.962434851999944, 21.475000831000045],
                  [-82.42414360599997, 21.551266906000023],
                ],
              ],
            },
          },
        ],
      },
    },
  ]
})

interface AOIState extends AsyncReducer<AOIConfig[]> {
  selected: string
}

const initialState: AOIState = {
  selected: '',
}

const aoiSlice = createAsyncSlice({
  name: 'aoi',
  initialState,
  reducers: {},
  thunk: fetchAOI,
})

export const selectAOIList = (state: RootState) => state.aoi.data
export const selectAOISelected = (state: RootState) => state.aoi.selected

export const getCurrentAOI = createSelector(
  [selectAOIList, selectAOISelected],
  (aoiList, selectedId) => {
    if (!aoiList) return
    aoiList.find((aoi) => aoi.id === selectedId)
  }
)

export const getAOIGeneratorsConfig = createSelector([selectAOIList], (aoiList) => {
  if (!aoiList) return
  return aoiList.map((aoi) => {
    return {
      type: Generators.Type.GL,
      id: `aoi-${aoi.id}`,
      sources: [
        {
          type: 'geojson',
          data: aoi.geometry,
        },
      ],
      layers: [
        {
          type: 'line',
          paint: {
            'line-color': 'red',
          },
        },
      ],
    }
  }) as Generators.GlGeneratorConfig[]
})

export default aoiSlice.reducer
