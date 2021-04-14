import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { RootState } from 'store'

export type SearchSlice = {
  query: string
  vessels: VesselSearch[]
}

const initialState: SearchSlice = {
  query: '',
  vessels: [],
}

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setVesselSeach: (
      state,
      action: PayloadAction<{ query: string; vessels: Array<VesselSearch> }>
    ) => {
      state.query = action.payload.query
      state.vessels = action.payload.vessels
    },
  },
})
export const { setVesselSeach } = slice.actions
export default slice.reducer

export const getVesselsFound = (state: RootState) => state.search.vessels
export const getLastQuery = (state: RootState) => state.search.query
