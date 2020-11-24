import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { Dataset, Vessel, APISearch } from '@globalfishingwatch/api-types'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/workspace/workspace.selectors'
import { TRACKS_DATASET_TYPE } from 'data/datasets'

export type VesselWithDatasets = Vessel & { dataset: string; trackDatasetId?: string }

interface SearchState {
  status: AsyncReducerStatus
  data: VesselWithDatasets[] | null
}

const initialState: SearchState = {
  status: AsyncReducerStatus.Idle,
  data: null,
}

export const fetchVesselSearchThunk = createAsyncThunk(
  'search/fetch',
  async ({ query, datasets }: { query: string; datasets: Dataset[] }, { getState }) => {
    const state = getState() as RootState
    const dataset = datasets[0]
    const datasetConfig = {
      endpoint: 'carriers-search-vessels',
      datasetId: dataset.id,
      params: [],
      query: [
        { id: 'datasets', value: datasets.map((d) => d.id) },
        { id: 'query', value: query },
      ],
    }
    const url = resolveEndpoint(dataset, datasetConfig)
    if (url) {
      const searchResults = await GFWAPI.fetch<APISearch<Vessel>>(url)
      const largerResult = Math.max(...searchResults.map(({ results }) => results.limit))
      const resultsFlat = Array.from(Array(largerResult).keys()).flatMap((index) => {
        // Flat them in order of results so for examplen when requesting 3 datasets the list will be
        // dataset1[0], dataset2[0], dataset3[0], dataset1[1], dataset2[1], dataset3[1]
        return searchResults.flatMap(({ dataset, results }) => {
          const vessel = results.entries[index]
          if (!vessel) return []

          const infoDataset = selectDatasetById(dataset)(state)
          const trackDatasetId = getRelatedDatasetByType(infoDataset, TRACKS_DATASET_TYPE)?.id
          return {
            ...vessel,
            dataset,
            trackDatasetId,
          }
        })
      })
      return resultsFlat
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
      if (action.payload) {
        state.data = action.payload
      }
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
