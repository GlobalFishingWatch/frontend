import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import memoize from 'lodash/memoize'
import type { RootState } from 'store'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { RegionType } from '@globalfishingwatch/api-types'

import type { AsyncReducer } from 'utils/async-slice'
import { asyncInitialState, AsyncReducerStatus, createAsyncSlice } from 'utils/async-slice'
import { sortFields } from 'utils/shared'

type RegionId = string | number
interface Region {
  id: RegionId
  label: string
}
interface Regions {
  id: RegionType
  data: Region[]
}
type RegionsState = AsyncReducer<Regions>

const initialState: RegionsState = {
  ...asyncInitialState,
}

type FetchRegionsThunkParams = Record<RegionType, string>
export const fetchRegionsThunk = createAsyncThunk(
  'regions/fetch',
  async (regionIds: Partial<FetchRegionsThunkParams>, { rejectWithValue }) => {
    try {
      const apiUrl = `/datasets`
      const options = {}
      const promises = [
        GFWAPI.fetch<Region[]>(`${apiUrl}/${regionIds.eez}/context-layers`, options),
        GFWAPI.fetch<Region[]>(`${apiUrl}/${regionIds.mpa}/context-layers`, options),
        GFWAPI.fetch<Region[]>(`${apiUrl}/${regionIds.rfmo}/context-layers`, options),
        GFWAPI.fetch<Region[]>(`${apiUrl}/${regionIds.fao}/context-layers`, options),
      ]
      const regions = await Promise.allSettled(promises)
      const result: Regions[] = [
        {
          id: RegionType.eez,
          data: regions[0]?.status === 'fulfilled' ? regions[0].value.sort(sortFields) : [],
        },
        {
          id: RegionType.mpa,
          data: regions[1]?.status === 'fulfilled' ? regions[1].value.sort(sortFields) : [],
        },
        {
          id: RegionType.rfmo,
          data: regions[2]?.status === 'fulfilled' ? regions[2].value.sort(sortFields) : [],
        },
        {
          id: RegionType.fao,
          data: regions[3]?.status === 'fulfilled' ? regions[3].value.sort(sortFields) : [],
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

const { selectById } = entityAdapter.getSelectors<RegionsState>((regions) => regions)

const selectRegions = (state: RootState) => {
  return state.regions
}

const selectRegionsById = memoize((id: RegionType) =>
  createSelector([selectRegions], (regions) => {
    const regionList = selectById(regions, id)
    return regionList?.data ?? []
  })
)

export const selectEEZs = selectRegionsById(RegionType.eez)
export const selectMPAs = selectRegionsById(RegionType.mpa)
export const selectRFMOs = selectRegionsById(RegionType.rfmo)
export const selectFAOs = selectRegionsById(RegionType.fao)

export default regionsSlice.reducer
