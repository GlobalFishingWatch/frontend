import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'
// import GFWAPI from '@globalfishingwatch/api-client'
import searchMock from './search.mock'

interface UserState {
  status: AsyncReducerStatus
  data: any // TODO type search api results
}

const initialState: UserState = {
  status: 'idle',
  data: null,
}

export const fetchVesselSearchThunk = createAsyncThunk('search/fetch', async (query: string) => {
  // const searchResults = await GFWAPI.fetch<any>(`/v1/vessels?datasets='carriers'&query=${query}`)
  // return searchResults
  return searchMock
})

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    cleanVesselSearchResults: (state) => {
      state.data = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVesselSearchThunk.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(fetchVesselSearchThunk.fulfilled, (state, action) => {
      state.status = 'finished'
      state.data = action.payload
    })
    builder.addCase(fetchVesselSearchThunk.rejected, (state) => {
      state.status = 'error'
    })
  },
})

export const { cleanVesselSearchResults } = searchSlice.actions

export const selectSearchResults = (state: RootState) => state.search.data
export const selectSearchStatus = (state: RootState) => state.search.status

export default searchSlice.reducer
