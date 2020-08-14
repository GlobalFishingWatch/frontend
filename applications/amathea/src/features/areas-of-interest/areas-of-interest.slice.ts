import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { AOIConfig } from 'types'
import GFWAPI from '@globalfishingwatch/api-client'
import { AsyncReducer, createAsyncSlice } from 'features/api/api.slice'

export const fetchAOIThunk = createAsyncThunk('aoi/fetch', async () => {
  const data = await GFWAPI.fetch<AOIConfig[]>('/v1/aoi')
  return data
})

type AOIState = AsyncReducer<AOIConfig>

const { slice: aoiSlice, entityAdapter } = createAsyncSlice<AOIState, AOIConfig>({
  name: 'aoi',
  reducers: {},
  thunks: { fetchThunk: fetchAOIThunk },
})

export const { selectAll: selectAllAOI, selectById: selectAOIById } = entityAdapter.getSelectors<
  RootState
>((state) => state.aoi)

export default aoiSlice.reducer
