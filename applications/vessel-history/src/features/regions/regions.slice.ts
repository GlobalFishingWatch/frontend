import { createAsyncThunk } from '@reduxjs/toolkit'
import { getEEZ, getMPA, getRFMO, MarineRegionType } from '@globalfishingwatch/marine-regions'
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

export const fetchRegionsThunk = createAsyncThunk('regions/fetch', (_, { rejectWithValue }) => {
  try {
    const result: Regions[] = [
      { id: MarineRegionType.eez, data: getEEZ() as Region[] },
      { id: MarineRegionType.mpa, data: getMPA() as Region[] },
      { id: MarineRegionType.rfmo, data: getRFMO() as Region[] },
    ]
    return result
  } catch (e) {
    return rejectWithValue({
      status: e.status || e.code,
      message: `Regions - ${e.message}`,
    })
  }
})

const { slice: regionsSlice, entityAdapter } = createAsyncSlice<RegionsState, Regions>({
  name: 'regions',
  initialState,
  thunks: {
    fetchThunk: fetchRegionsThunk,
  },
})

export const regionsEntityAdapter = entityAdapter
export default regionsSlice.reducer
