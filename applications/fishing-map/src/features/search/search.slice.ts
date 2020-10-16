import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'
import GFWAPI from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { Dataset } from '@globalfishingwatch/api-types'

interface UserState {
  status: AsyncReducerStatus
  data: any // TODO type search api results
}

const initialState: UserState = {
  status: AsyncReducerStatus.Idle,
  data: null,
}

export const fetchVesselSearchThunk = createAsyncThunk(
  'search/fetch',
  async ({ query, datasets }: { query: string; datasets: Dataset[] }) => {
    const dataset = datasets[0]
    const datasetConfig = {
      endpoint: 'carriers-vessels',
      datasetId: dataset.id,
      params: [],
      query: [
        { id: 'datasets', value: datasets.map((d) => d.id) },
        { id: 'query', value: query },
      ],
    }
    const url = resolveEndpoint(dataset, datasetConfig)
    if (url) {
      const searchResults = await GFWAPI.fetch<any>(url)
      return searchResults
    }
  }
)

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
