import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import {
  GFWAPI,
  getAdvancedSearchQuery,
  AdvancedSearchQueryField,
  AdvancedSearchQueryFieldKey,
  parseAPIError,
} from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import {
  Dataset,
  DatasetTypes,
  Vessel,
  APIPagination,
  VesselSearch,
  EndpointId,
} from '@globalfishingwatch/api-types'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { RootState } from 'store'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType, SupportedDatasetSchema } from 'features/datasets/datasets.utils'

export const RESULTS_PER_PAGE = 20

export type VesselWithDatasets = Omit<Vessel, 'dataset'> & {
  dataset: Dataset
  trackDatasetId?: string
}
export type SearchType = 'basic' | 'advanced'
export type SearchFilter = {
  last_transmission_date?: string
  first_transmission_date?: string
  sources?: MultiSelectOption<string>[]
} & Partial<Record<SupportedDatasetSchema, MultiSelectOption<string>[]>>

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
  gfwUser?: boolean
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
    { query, filters, datasets, offset, gfwUser = false }: VesselSearchThunk,
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

        const andCombinedFields: AdvancedSearchQueryFieldKey[] = [
          'geartype',
          'target_species',
          'flag',
          'fleet',
          'origin',
          'last_transmission_date',
          'first_transmission_date',
        ]
        const orCombinedFields: AdvancedSearchQueryFieldKey[] = [
          'shipname',
          'mmsi',
          'imo',
          'codMarinha',
        ]

        const fields: AdvancedSearchQueryField[] = [
          ...orCombinedFields.flatMap((field) => {
            if (fieldsAllowed.includes(field)) {
              return {
                key: field,
                value: query,
                combinedWithOR: true,
              }
            }
            return []
          }),
          ...andCombinedFields.flatMap((field) => {
            if (filters[field] && fieldsAllowed.includes(field)) {
              return {
                key: field,
                value: filters[field],
              }
            }
            return []
          }),
        ]
        advancedQuery = getAdvancedSearchQuery(fields)
      }

      const datasetConfig = {
        endpoint: advancedQuery ? EndpointId.VesselAdvancedSearch : EndpointId.VesselSearch,
        datasetId: dataset.id,
        params: [],
        query: [
          { id: 'datasets', value: datasets.map((d) => d.id) },
          // { id: 'limit', value: RESULTS_PER_PAGE },
          // { id: 'offset', value: offset },
          {
            id: advancedQuery ? 'where' : 'query',
            value: encodeURIComponent(advancedQuery || query),
          },
        ],
      }

      const url = resolveEndpoint(dataset, datasetConfig)
      if (url) {
        const searchResults = await GFWAPI.fetch<APIPagination<VesselSearch>>(url, {
          signal,
        })
        // Not removing duplicates for GFWStaff so they can compare other VS fishing vessels
        const uniqSearchResults = gfwUser
          ? searchResults.entries
          : uniqBy(searchResults.entries, 'id')

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
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
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
      const payload = action.payload as any
      if (payload) {
        state.data = payload.data
        state.suggestion = payload.suggestion
        state.pagination = payload.pagination
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
