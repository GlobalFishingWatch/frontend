import { createSelector, createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { RootState } from 'store'
import { AOIConfig } from 'types'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'

export const fetchAOIThunk = createAsyncThunk('aoi/fetch', async () => {
  const data = await GFWAPI.fetch<AOIConfig[]>('/aoi')
  return data
})

interface AOIState extends AsyncReducer<AOIConfig> {
  selected: string
}

const { slice: aoiSlice, entityAdapter } = createAsyncSlice<AOIState, AOIConfig>({
  name: 'aoi',
  reducers: {},
  thunk: fetchAOIThunk,
})

export const { selectAll } = entityAdapter.getSelectors<RootState>((state) => state.aoi)
export const selectAOISelected = (state: RootState) => state.aoi.selected

export const getCurrentAOI = createSelector(
  [selectAll, selectAOISelected],
  (aoiList, selectedId) => {
    if (!aoiList) return
    aoiList.find((aoi) => aoi.id === selectedId)
  }
)

export const getAOIGeneratorsConfig = createSelector([selectAll], (aoiList) => {
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
