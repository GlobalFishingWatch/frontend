import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { Dataset, Vessel, APISearch, VesselSearch } from '@globalfishingwatch/api-types'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/workspace/workspace.selectors'
import { TRACKS_DATASET_TYPE } from 'data/datasets'

export const RESULTS_PER_PAGE = 20

export type VesselWithDatasets = Vessel & { dataset: Dataset; trackDatasetId?: string }

export type SearchFilterKey = 'flags' | 'gearType' | 'startDate' | 'endDate'
export type SearchFilter = {
  flags?: MultiSelectOption<string>[]
  sources?: MultiSelectOption<string>[]
  firstTransmissionDate?: string
  lastTransmissionDate?: string
}

interface SearchState {
  status: AsyncReducerStatus
  data: VesselWithDatasets[] | null
  suggestion: string | null
  pagination: {
    total: number
    offset: number
  }
  filtersOpen: boolean
  filters: SearchFilter
}

const paginationInitialState = { total: 0, offset: 0 }
const initialState: SearchState = {
  status: AsyncReducerStatus.Idle,
  pagination: paginationInitialState,
  data: null,
  suggestion: null,
  filtersOpen: false,
  filters: {},
}

export type VesselSearchThunk = {
  query: string
  offset: number
  datasets: Dataset[]
}

export const fetchVesselSearchThunk = createAsyncThunk(
  'search/fetch',
  async ({ query, datasets, offset }: VesselSearchThunk, { getState, signal }) => {
    const state = getState() as RootState
    const dataset = datasets[0]
    const currentResults = selectSearchResults(state)
    const datasetConfig = {
      endpoint: 'carriers-advanced-search-vessels',
      datasetId: dataset.id,
      params: [],
      query: [
        { id: 'datasets', value: datasets.map((d) => d.id) },
        { id: 'limit', value: RESULTS_PER_PAGE },
        { id: 'offset', value: offset },
        { id: 'query', value: query },
      ],
    }

    const url = resolveEndpoint(dataset, datasetConfig)
    if (url) {
      // const searchResults = await GFWAPI.fetch<APISearch<Vessel>>(url)
      const searchResults = await GFWAPI.fetch<APISearch<VesselSearch>>(url, {
        signal,
      })
      const vesselsWithDataset = searchResults.entries.flatMap((vessel) => {
        if (!vessel) return []

        const infoDataset = selectDatasetById(vessel.dataset)(state)
        if (!infoDataset) return []

        const trackDatasetId = getRelatedDatasetByType(infoDataset, TRACKS_DATASET_TYPE)?.id
        return {
          ...vessel,
          dataset: infoDataset,
          trackDatasetId,
        }
      })
      return {
        data:
          offset > 0 && currentResults
            ? currentResults.concat(vesselsWithDataset)
            : vesselsWithDataset,
        suggestion: searchResults.metadata?.suggestion,
        pagination: {
          total: searchResults.total.value,
          offset: searchResults.offset + offset,
        },
      }
    }
  }
)

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFiltersOpen: (state, action: PayloadAction<boolean>) => {
      state.filtersOpen = action.payload
    },
    setFilters: (state, action: PayloadAction<SearchFilter>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    cleanVesselSearchResults: (state) => {
      state.status = initialState.status
      state.suggestion = initialState.suggestion
      state.data = initialState.data
      state.pagination = paginationInitialState
      state.filtersOpen = initialState.filtersOpen
      state.filters = initialState.filters
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVesselSearchThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchVesselSearchThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      if (action.payload) {
        state.data = action.payload.data
        state.pagination = action.payload.pagination
      }
    })
    builder.addCase(fetchVesselSearchThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.status = AsyncReducerStatus.Idle
      } else {
        state.status = AsyncReducerStatus.Error
      }
    })
  },
})

export const { setFiltersOpen, setFilters, cleanVesselSearchResults } = searchSlice.actions

export const selectSearchResults = (state: RootState) => state.search.data
export const selectSearchStatus = (state: RootState) => state.search.status
export const selectSearchFiltersOpen = (state: RootState) => state.search.filtersOpen
export const selectSearchFilters = (state: RootState) => state.search.filters
export const selectSearchPagination = (state: RootState) => state.search.pagination

export default searchSlice.reducer
