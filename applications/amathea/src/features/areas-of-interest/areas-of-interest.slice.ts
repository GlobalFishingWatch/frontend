import { createSelector, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { AOIConfig } from 'types'
import GFWAPI from '@globalfishingwatch/api-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'
import { selectCurrentWorkspace } from 'features/workspaces/workspaces.slice'

export const fetchAOIThunk = createAsyncThunk('aoi/fetch', async () => {
  const data = await GFWAPI.fetch<AOIConfig[]>('/aoi')
  return data
})

type AOIState = AsyncReducer<AOIConfig>

const { slice: aoiSlice, entityAdapter } = createAsyncSlice<AOIState, AOIConfig>({
  name: 'aoi',
  reducers: {},
  thunks: { fetchThunk: fetchAOIThunk },
})

export const { selectAll } = entityAdapter.getSelectors<RootState>((state) => state.aoi)

export const getAOIGeneratorsConfig = createSelector(
  [selectAll, selectCurrentWorkspace],
  (aoiList, workspace) => {
    if (!aoiList) return
    return aoiList
      .filter((aoi) => !workspace || workspace.aoiId === aoi.id)
      .map((aoi) => {
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
  }
)

export default aoiSlice.reducer
