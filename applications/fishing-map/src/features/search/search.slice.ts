import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import {
  Dataset,
  DatasetTypes,
  Vessel,
  APISearch,
  VesselSearch,
} from '@globalfishingwatch/api-types'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/workspace/workspace.selectors'

export const RESULTS_PER_PAGE = 20

export type VesselWithDatasets = Vessel & { dataset: Dataset; trackDatasetId?: string }

export type SearchFilterKey = 'flags' | 'gearType' | 'startDate' | 'endDate'
export type SearchFilter = {
  flags?: MultiSelectOption<string>[]
  sources?: MultiSelectOption<string>[]
  fleets?: MultiSelectOption<string>[]
  origins?: MultiSelectOption<string>[]
  firstTransmissionDate?: string
  lastTransmissionDate?: string
}

interface SearchState {
  status: AsyncReducerStatus
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
  return Object.values(filters).filter((f) => !!f).length > 0
}

export function checkAdvanceSearchFiltersEnabled(filters: SearchFilter): boolean {
  const { sources, ...rest } = filters
  return Object.values(rest).filter((f) => !!f).length > 0
}

export const fetchVesselSearchThunk = createAsyncThunk(
  'search/fetch',
  async ({ query, filters, datasets, offset }: VesselSearchThunk, { getState, signal }) => {
    const state = getState() as RootState
    const dataset = datasets[0]
    const currentResults = selectSearchResults(state)
    let advancedQuery

    if (checkAdvanceSearchFiltersEnabled(filters)) {
      const fieldsAllowed = Array.from(
        new Set(datasets.flatMap((dataset) => dataset.fieldsAllowed))
      )

      const querySearchFields = [
        {
          field: 'shipname',
          operator: 'LIKE',
          transformation: (value: string) => `%${value.toUpperCase()}%`,
        },
        {
          field: 'mmsi',
          operator: '=',
          condition: (field: string) => fieldsAllowed.includes(field),
        },
        {
          field: 'imo',
          operator: '=',
          condition: (field: string) => fieldsAllowed.includes(field),
        },
      ]

      const querySearch = querySearchFields
        .filter(({ field, condition }) => (condition ? condition(field) : true))
        .map(
          ({ field, operator, transformation }) =>
            `${field} ${operator} '${transformation ? transformation(query) : query}'`
        )
        .join(' OR ')

      const queryFiltersFields = [
        {
          value: filters.flags,
          field: 'flag',
          operator: 'IN',
          transformation: (value: any): string =>
            `(${(value as MultiSelectOption<string>[])?.map((f) => `'${f.id}'`).join(', ')})`,
        },
        {
          value: filters.fleets,
          field: 'fleet',
          operator: 'IN',
          transformation: (value: any): string =>
            `(${(value as MultiSelectOption<string>[])?.map((f) => `'${f.id}'`).join(', ')})`,
        },
        {
          value: filters.origins,
          field: 'origin',
          operator: 'IN',
          transformation: (value: any): string =>
            `(${(value as MultiSelectOption<string>[])?.map((f) => `'${f.id}'`).join(', ')})`,
        },
        {
          value: filters?.firstTransmissionDate,
          field: 'firstTransmissionDate',
          operator: '>=',
        },
        {
          value: filters?.lastTransmissionDate,
          field: 'lastTransmissionDate',
          operator: '<=',
        },
      ]

      const queryFilters = queryFiltersFields
        .filter(({ value }) => value !== undefined)
        .map(
          ({ field, operator, transformation, value }) =>
            `${field} ${operator} ${transformation ? transformation(value) : `'${value}'`}`
        )

      advancedQuery = [`(${querySearch})`, ...queryFilters].join(' AND ')
    }

    const datasetConfig = {
      endpoint: advancedQuery ? 'carriers-advanced-search-vessels' : 'carriers-search-vessels',
      datasetId: dataset.id,
      params: [],
      query: [
        { id: 'datasets', value: datasets.map((d) => d.id) },
        { id: 'limit', value: RESULTS_PER_PAGE },
        { id: 'offset', value: offset },
        { id: 'query', value: advancedQuery || query },
      ],
    }

    const url = resolveEndpoint(dataset, datasetConfig)
    if (url) {
      const searchResults = await GFWAPI.fetch<APISearch<VesselSearch>>(url, {
        signal,
      })

      const vesselsWithDataset = searchResults.entries.flatMap((vessel) => {
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
          total: searchResults.total?.value,
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
        state.status = AsyncReducerStatus.Error
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
export const selectSearchFiltersOpen = (state: RootState) => state.search.filtersOpen
export const selectSearchFilters = (state: RootState) => state.search.filters
export const selectSearchSuggestion = (state: RootState) => state.search.suggestion
export const selectSearchSuggestionClicked = (state: RootState) => state.search.suggestionClicked
export const selectSearchPagination = (state: RootState) => state.search.pagination

export default searchSlice.reducer
