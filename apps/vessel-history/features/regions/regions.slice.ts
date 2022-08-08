import { createAsyncThunk } from '@reduxjs/toolkit'
import { GFWAPI } from '@globalfishingwatch/api-client'
import {
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { RootState } from 'store'
import { API_VERSION } from 'data/config'

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
export interface GroupRegions {
  id: RegionId
  type: MarineRegionType
}
export interface Regions {
  id: RegionId
  data: Region[]
}
export enum RegionStatus {
  AsyncReducerStatus,
}
export type RegionsState = AsyncReducer<Regions>

export const anyRegion: Region = {
  id: '0-any',
  label: 'any',
}

const initialState: RegionsState = {
  ...asyncInitialState,
}

const sortRegionAlphabetically = (a: Region, b: Region) => (a.label < b.label ? -1 : 1)

export const fetchRegionsThunk = createAsyncThunk(
  'regions/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const apiUrl = `/datasets`
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
        { id: MarineRegionType.eez, data: eezs.sort(sortRegionAlphabetically) },
        { id: MarineRegionType.mpa, data: mpas.sort(sortRegionAlphabetically) },
        { id: MarineRegionType.rfmo, data: rfmos.sort(sortRegionAlphabetically) },
      ]
      return result
    } catch (e: any) {
      return rejectWithValue({
        status: e.status || e.code,
        message: `Regions - ${e.message}`,
      })
    }
  },
  {
    condition: (_, { getState, extra }) => {
      const { regions } = getState() as RootState
      const fetchStatus = regions.status
      if (
        fetchStatus === AsyncReducerStatus.Finished ||
        fetchStatus === AsyncReducerStatus.Loading
      ) {
        // Already fetched or in progress, don't need to re-fetch
        return false
      }
      return true
    },
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
