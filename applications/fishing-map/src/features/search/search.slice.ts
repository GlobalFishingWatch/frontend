import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import GFWAPI, {
  getAdvancedSearchQuery,
  AdvancedSearchQueryField,
  AdvancedSearchQueryFieldKey,
} from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import {
  Dataset,
  DatasetTypes,
  Vessel,
  APISearch,
  VesselSearch,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { MultiSelectOption } from '@globalfishingwatch/ui-components/dist/multi-select'
import { RootState } from 'store'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.selectors'

export const RESULTS_PER_PAGE = 20

export type VesselWithDatasets = Omit<Vessel, 'dataset'> & {
  dataset: Dataset
  trackDatasetId?: string
}
export type SearchType = 'basic' | 'advanced'
export type SearchFilterKey = 'flags' | 'gearType' | 'startDate' | 'endDate'
export type SearchFilter = {
  flags?: MultiSelectOption<string>[]
  sources?: MultiSelectOption<string>[]
  fleets?: MultiSelectOption<string>[]
  origins?: MultiSelectOption<string>[]
  activeAfterDate?: string
  activeBeforeDate?: string
}

interface SearchState {
  status: AsyncReducerStatus
  statusCode: number | undefined
  data: VesselWithDatasets[] | null
  suggestion: string | null
  suggestionClicked: boolean
  pagination: {
    loading: boolean
    total: number
    offset: number
  }
  filtersOpen: boolean
  filters: SearchFilter
}

const paginationInitialState = { total: 0, offset: 0, loading: false }
const initialState: SearchState = {
  status: AsyncReducerStatus.Idle,
  statusCode: undefined,
  pagination: paginationInitialState,
  data: null,
  suggestion: null,
  suggestionClicked: false,
  filtersOpen: false,
  filters: {},
}

export type VesselSearchThunk = {
  query: string
  offset: number
  filters: SearchFilter
  datasets: Dataset[]
}

export function checkSearchFiltersEnabled(filters: SearchFilter): boolean {
  return Object.values(filters).filter((f) => f !== undefined).length > 0
}

export function checkAdvanceSearchFiltersEnabled(filters: SearchFilter): boolean {
  const { sources, ...rest } = filters
  return Object.values(rest).filter((f) => f !== undefined).length > 0
}

export const fetchVesselSearchThunk = createAsyncThunk(
  'search/fetch',
  async (
    { query, filters, datasets, offset }: VesselSearchThunk,
    { getState, signal, rejectWithValue }
  ) => {
    const state = getState() as RootState
    const dataset = datasets[0]
    const currentResults = selectSearchResults(state)
    let advancedQuery
    try {
      if (checkAdvanceSearchFiltersEnabled(filters)) {
        const fieldsAllowed = Array.from(
          new Set(datasets.flatMap((dataset) => dataset.fieldsAllowed))
        )

        const fields: AdvancedSearchQueryField[] = [
          {
            key: 'shipname',
            value: query,
            combinedWithOR: true,
          },
          ...(fieldsAllowed.includes('mmsi')
            ? [
                {
                  key: 'mmsi' as AdvancedSearchQueryFieldKey,
                  value: query,
                  combinedWithOR: true,
                },
              ]
            : []),
          ...(fieldsAllowed.includes('imo')
            ? [
                {
                  key: 'imo' as AdvancedSearchQueryFieldKey,
                  value: query,
                  combinedWithOR: true,
                },
              ]
            : []),
          {
            key: 'flag',
            value: filters.flags,
          },
          {
            key: 'fleet',
            value: filters.fleets,
          },
          {
            key: 'origin',
            value: filters.origins,
          },
          {
            key: 'lastTransmissionDate',
            value: filters.activeAfterDate,
          },
          {
            key: 'firstTransmissionDate',
            value: filters.activeBeforeDate,
          },
        ]
        advancedQuery = getAdvancedSearchQuery(fields)
      }

      const datasetConfig = {
        endpoint: advancedQuery ? EndpointId.VesselAdvancedSearch : EndpointId.VesselSearch,
        datasetId: dataset.id,
        params: [],
        query: [
          { id: 'datasets', value: datasets.map((d) => d.id) },
          { id: 'limit', value: RESULTS_PER_PAGE },
          { id: 'offset', value: offset },
          { id: 'query', value: encodeURIComponent(advancedQuery || query) },
        ],
      }

      const url = resolveEndpoint(dataset, datasetConfig)
      if (url) {
        const searchResults = await GFWAPI.fetch<APISearch<VesselSearch>>(url, {
          signal,
        })
        const uniqSearchResults = uniqBy(searchResults.entries, 'id')
        const vesselsWithDataset = uniqSearchResults.flatMap((vessel) => {
          if (!vessel) return []

          const infoDataset = selectDatasetById(vessel.dataset)(state)
          if (!infoDataset) return []

          const trackDatasetId = getRelatedDatasetByType(infoDataset, DatasetTypes.Tracks)?.id
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
            loading: false,
            total: searchResults.total,
            offset: searchResults.nextOffset,
          },
        }
      }
    } catch (e) {
      return rejectWithValue({ status: e.status || e.code, message: e.message } as AsyncError)
    }
  }
)

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<SearchFilter>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setFiltersOpen: (state, action: PayloadAction<boolean>) => {
      state.filtersOpen = action.payload
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.filtersOpen = initialState.filtersOpen
    },
    setSuggestionClicked: (state, action: PayloadAction<boolean>) => {
      state.suggestionClicked = action.payload
    },
    cleanVesselSearchResults: (state) => {
      state.status = initialState.status
      state.suggestion = initialState.suggestion
      state.suggestionClicked = false
      state.data = initialState.data
      state.pagination = paginationInitialState
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVesselSearchThunk.pending, (state, action) => {
      state.status = AsyncReducerStatus.Loading
      state.pagination.loading = action.meta.arg.offset > 0
    })
    builder.addCase(fetchVesselSearchThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      if (action.payload) {
        state.data = action.payload.data
        state.suggestion = action.payload.suggestion
        state.pagination = action.payload.pagination
      }
    })
    builder.addCase(fetchVesselSearchThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.status = AsyncReducerStatus.Aborted
      } else {
        state.data = initialState.data
        state.pagination = paginationInitialState
        state.status = AsyncReducerStatus.Error
        state.statusCode = (action.payload as AsyncError)?.status
      }
    })
  },
})

export const {
  setFilters,
  setFiltersOpen,
  resetFilters,
  setSuggestionClicked,
  cleanVesselSearchResults,
} = searchSlice.actions

export const selectSearchResults = (state: RootState) => state.search.data
export const selectSearchStatus = (state: RootState) => state.search.status
export const selectSearchStatusCode = (state: RootState) => state.search.statusCode
export const selectSearchFiltersOpen = (state: RootState) => state.search.filtersOpen
export const selectSearchFilters = (state: RootState) => state.search.filters
export const selectSearchSuggestion = (state: RootState) => state.search.suggestion
export const selectSearchSuggestionClicked = (state: RootState) => state.search.suggestionClicked
export const selectSearchPagination = (state: RootState) => state.search.pagination

export default searchSlice.reducer
