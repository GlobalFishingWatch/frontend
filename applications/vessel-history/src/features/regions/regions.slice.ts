import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  getEEZ,
  getMPA,
  getRFMO,
  GetMarineRegionLocaleParam,
  MarineRegionType,
} from '@globalfishingwatch/marine-regions'
import { asyncInitialState, AsyncReducer, createAsyncSlice } from 'utils/async-slice'

export type RegionId = MarineRegionType

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

// Leave it as async so it's easier to migrate when regions
// were consumed from a service
export const fetchRegionsThunk = createAsyncThunk(
  'regions/fetch',
  (locale: GetMarineRegionLocaleParam | undefined, { rejectWithValue }) => {
    try {
      const result: Regions[] = [
        { id: MarineRegionType.eez, data: getEEZ(locale) as Region[] },
        { id: MarineRegionType.mpa, data: getMPA() as Region[] },
        { id: MarineRegionType.rfmo, data: getRFMO(locale) as Region[] },
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
