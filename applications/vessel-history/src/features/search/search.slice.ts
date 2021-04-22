import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VesselSearch } from '@globalfishingwatch/api-types'
import { RootState } from 'store'

export type CachedVesselSearch = {
  offset: number
  searching: boolean
  total: number | null
  vessels: VesselSearch[]
}

export type SearchSlice = {
  [key: string]: CachedVesselSearch
}

const initialState: SearchSlice = {}

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setOffset: (state, action: PayloadAction<{ query: string; offset: number }>) => {
      console.log(action.payload)
      state[action.payload.query].offset = action.payload.offset
    },
    setSearching: (state, action: PayloadAction<{ query: string; searching: boolean }>) => {
      if (!state[action.payload.query]) {
        state[action.payload.query] = {
          vessels: [],
          offset: 0,
          total: 0,
          searching: action.payload.searching,
        }
      }
      state[action.payload.query].searching = action.payload.searching
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
      state[action.payload.query] = {
        vessels: action.payload.vessels,
        offset: action.payload.offset,
        total: action.payload.total,
        searching: action.payload.searching,
      }
    },
  },
})
export const { setVesselSearch, setOffset, setSearching } = slice.actions
export default slice.reducer

export const getVesselsFound = (state: RootState) => state.search
export const getLastQuery = (state: RootState) => state.search.query
export const isSearching = (state: RootState) => state.search.searching
