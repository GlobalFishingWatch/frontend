import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { RootState } from 'store'

export type SearchSlice = {
  query: string
  offset: number
  searching: boolean
  total: number | null
  vessels: VesselSearch[]
}

const initialState: SearchSlice = {
  query: '',
  offset: 0,
  searching: false,
  total: null,
  vessels: [],
}

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload
    },
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.searching = action.payload
    },
    setVesselSearch: (
      state,
      action: PayloadAction<{
        query: string
        vessels: Array<VesselSearch>
        offset: number
        total: number
        searching: boolean
      }>
    ) => {
      state.query = action.payload.query
      state.offset = action.payload.offset
      state.total = action.payload.total
      state.vessels = action.payload.vessels
      state.searching = action.payload.searching
    },
  },
})
export const { setVesselSearch, setOffset, setSearching } = slice.actions
export default slice.reducer

export const getVesselsFound = (state: RootState) => state.search.vessels
export const getLastQuery = (state: RootState) => state.search.query
export const getOffset = (state: RootState) => state.search.offset
export const getTotalResults = (state: RootState) => state.search.total
export const isSearching = (state: RootState) => state.search.searching
