import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'
import GFWAPI from '@globalfishingwatch/api-client'
import { VESSELS_DATASET_ID } from 'features/workspace/workspace.mock'

interface UserState {
  status: AsyncReducerStatus
  data: any // TODO type search api results
}

const initialState: UserState = {
  status: AsyncReducerStatus.Idle,
  data: null,
}

export const fetchVesselSearchThunk = createAsyncThunk('search/fetch', async (query: string) => {
  const searchResults = await GFWAPI.fetch<any>(
    `/v1/vessels?datasets=${VESSELS_DATASET_ID}&query=${query}`
  )
  return searchResults
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
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchVesselSearchThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.data = action.payload
    })
    builder.addCase(fetchVesselSearchThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Error
    })
  },
})

export const { cleanVesselSearchResults } = searchSlice.actions

export const selectSearchResults = (state: RootState) => state.search.data
export const selectSearchStatus = (state: RootState) => state.search.status

export default searchSlice.reducer
