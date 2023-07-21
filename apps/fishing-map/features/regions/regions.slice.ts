import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { RegionType } from '@globalfishingwatch/api-types'
import {
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { RootState } from 'store'
import { sortFields } from 'utils/shared'

export type RegionId = string | number
export interface Region {
  id: RegionId
  label: string
}
export interface Regions {
  id: RegionType
  data: Region[]
}
export type RegionsState = AsyncReducer<Regions>

const initialState: RegionsState = {
  ...asyncInitialState,
}

export type FetchRegionsThunkParams = Omit<Record<RegionType, string>, 'fao'>
export const fetchRegionsThunk = createAsyncThunk(
  'regions/fetch',
  async (regionIds: FetchRegionsThunkParams, { rejectWithValue }) => {
    try {
      const apiUrl = `/datasets`
      const options = {}
      const promises = [
        GFWAPI.fetch<Region[]>(`${apiUrl}/${regionIds.eez}/user-context-layer-v1`, options),
        GFWAPI.fetch<Region[]>(`${apiUrl}/${regionIds.mpa}/user-context-layer-v1`, options),
        GFWAPI.fetch<Region[]>(`${apiUrl}/${regionIds.rfmo}/user-context-layer-v1`, options),
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

export const selectRegions = (state: RootState) => {
  return state.regions
}

const selectRegionsById = memoize((id: RegionId) =>
  createSelector([selectRegions], (regions) => {
    const regionList = selectById(regions, id)
    return regionList?.data ?? []
  })
)

export const selectEEZs = selectRegionsById(RegionType.eez)
export const selectMPAs = selectRegionsById(RegionType.mpa)
export const selectRFMOs = selectRegionsById(RegionType.rfmo)

export const selectRegionsStatus = (state: RootState) => state.regions.status

export const selectEezById = memoize((id: RegionId) =>
  createSelector([selectEEZs], (eezs) => {
    if (!id || !eezs) {
      return null
    }
    return eezs.find((eez) => eez.id.toString() === id.toString())
  })
)

export const selectMPAById = memoize((id: RegionId) =>
  createSelector([selectMPAs], (mpas) => {
    if (!id || !mpas) {
      return null
    }
    return mpas.find((eez) => eez.id.toString() === id.toString())
  })
)

export const selectRfmoById = memoize((id: RegionId) =>
  createSelector([selectRFMOs], (rfmos) => {
    if (!id || !rfmos) {
      return null
    }
    return rfmos.find((rfmo) => rfmo.id.toString() === id.toString())
  })
)

export default regionsSlice.reducer
