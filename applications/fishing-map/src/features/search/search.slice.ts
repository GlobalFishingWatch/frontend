import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import uniqBy from 'lodash/uniqBy'
import GFWAPI from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { Dataset, Vessel, APISearch } from '@globalfishingwatch/api-types'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/workspace/workspace.selectors'
import { GearType, TRACKS_DATASET_TYPE } from 'data/datasets'

export type VesselWithDatasets = Vessel & { dataset: Dataset; trackDatasetId?: string }

export type SearchFilterKey = 'flags' | 'gearType' | 'startDate' | 'endDate'
export type SearchFilter = {
  flags?: MultiSelectOption<string>[]
  gearTypes?: MultiSelectOption<GearType>[]
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
  datasets: Dataset[]
}

export const fetchVesselSearchThunk = createAsyncThunk(
  'search/fetch',
  async ({ query, datasets }: VesselSearchThunk, { getState }) => {
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
          if (!infoDataset) return []

          const trackDatasetId = getRelatedDatasetByType(infoDataset, TRACKS_DATASET_TYPE)?.id
          return {
            ...vessel,
            dataset: infoDataset,
            trackDatasetId,
          }
        })
      })
      return {
        data: uniqBy(resultsFlat, 'id'),
        suggestion: 'TODO: fix api', //searchResults[0].results.metadata.suggestion
        pagination: {
          total: searchResults[0].results.total.value,
          offset: searchResults[0].results.offset,
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
      state = initialState
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
    builder.addCase(fetchVesselSearchThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Error
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
