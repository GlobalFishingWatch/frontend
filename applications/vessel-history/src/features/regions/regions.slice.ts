import { createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { API_REGIONS_ENDPOINT } from 'data/constants'
import { asyncInitialState, AsyncReducer, createAsyncSlice } from 'utils/async-slice'

export type RegionId = 'eezs' | 'rfmos' | 'ports' | 'flagStates' | 'flagStateGroups'

export interface Region {
  id: string
  label: string
}
export interface Regions {
  id: RegionId
  data: Region[]
}
export enum RegionStatus {
  AsyncReducerStatus,
}
export type RegionsState = AsyncReducer<Regions>

const initialState: RegionsState = {
  ...asyncInitialState,
}

export const fetchRegionsThunk = createAsyncThunk(
  'regions/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const responseType = 'json'
      const data = await GFWAPI.fetch<Regions>(API_REGIONS_ENDPOINT, { responseType })
      const result = Object.entries(data).map(([key, value]) => ({ id: key, data: value }))
      return result
    } catch (e) {
      return rejectWithValue({
        status: e.status || e.code,
        message: `Regions - ${e.message}`,
      })
    }
  }
)

const { slice: regionsSlice, entityAdapter } = createAsyncSlice<RegionsState, Regions>({
  name: 'regions',
  initialState,
  thunks: {
    fetchThunk: fetchRegionsThunk,
  },
})

export const regionsEntityAdapter = entityAdapter
export default regionsSlice.reducer
