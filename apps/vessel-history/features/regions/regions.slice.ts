import { createAsyncThunk } from '@reduxjs/toolkit'
import { GFWApiClient } from 'http-client/http-client'
import type { RootState } from 'store'

import type {
  AsyncReducer} from 'utils/async-slice';
import {
  asyncInitialState,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'

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
      const promises = [
        GFWApiClient.fetch<Region[]>(`${apiUrl}/public-eez-areas/user-context-layer-v1`, options),
        GFWApiClient.fetch<Region[]>(`${apiUrl}/public-mpa-all/user-context-layer-v1`, options),
        GFWApiClient.fetch<Region[]>(`${apiUrl}/public-rfmo/user-context-layer-v1`, options),
      ]
      const regions = await Promise.allSettled(promises)
      const result: Regions[] = [
        {
          id: MarineRegionType.eez,
          data:
            regions[0]?.status === 'fulfilled'
              ? regions[0].value.sort(sortRegionAlphabetically)
              : [],
        },
        {
          id: MarineRegionType.mpa,
          data:
            regions[1]?.status === 'fulfilled'
              ? regions[1].value.sort(sortRegionAlphabetically)
              : [],
        },
        {
          id: MarineRegionType.rfmo,
          data:
            regions[2]?.status === 'fulfilled'
              ? regions[2].value.sort(sortRegionAlphabetically)
              : [],
        },
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
