import { createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { asyncInitialState, AsyncReducer, createAsyncSlice } from 'utils/async-slice'

export type RegionId = string | number
export enum MarineRegionType {
  eez = 'eez',
  rfmo = 'rfmo',
  mpa = 'mpa',
}

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
      // const apiUrl = 'http://localhost:4500/v1/datasets'
      // const options = {
      //   headers: {
      //     'x-gateway-url': 'https://gateway.api.dev.globalfishingwatch.org',
      //     user: '{"id": 1}',
      //   },
      // }
      const apiUrl = '/v1/datasets'
      const options = {}
      const eezs = await GFWAPI.fetch<Region[]>(
        `${apiUrl}/public-eez-areas/user-context-layer-v1`,
        options
      )
      const mpas = await GFWAPI.fetch<Region[]>(
        `${apiUrl}/public-mpa-all/user-context-layer-v1`,
        options
      )
      const rfmos = await GFWAPI.fetch<Region[]>(
        `${apiUrl}/public-tuna-rfmo/user-context-layer-v1`,
        options
      )
      const result: Regions[] = [
        { id: MarineRegionType.eez, data: eezs },
        { id: MarineRegionType.mpa, data: mpas },
        { id: MarineRegionType.rfmo, data: rfmos },
      ]
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
