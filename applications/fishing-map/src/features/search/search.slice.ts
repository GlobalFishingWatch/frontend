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
  filters: SearchFilter
  datasets: Dataset[]
}

export function checkSearchFiltersEnabled(filters: SearchFilter): boolean {
  return Object.values(filters).filter((f) => !!f).length > 0
}

export const fetchVesselSearchThunk = createAsyncThunk(
  'search/fetch',
  async ({ query, filters, datasets, offset }: VesselSearchThunk, { getState, signal }) => {
    const state = getState() as RootState
    const dataset = datasets[0]
    const currentResults = selectSearchResults(state)
    let advancedQuery
    if (checkSearchFiltersEnabled(filters)) {
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
      ].filter(({ field, condition }) => (condition ? condition(field) : true))

      const querySearch = querySearchFields
        .map(
          ({ field, operator, transformation }) =>
            `${field} ${operator} '${transformation ? transformation(query) : query}'`
        )
        .join(' OR ')

      const queryFiltersFields = [
        {
          field: 'flag',
          operator: 'IN',
          transformation: (): string => `(${filters.flags?.map((f) => `'${f.id}'`).join(', ')})`,
        },
        {
          field: 'firstTransmissionDate',
          operator: '>=',
          condition: () => filters?.firstTransmissionDate !== undefined,
        },
        {
          field: 'lastTransmissionDate',
          operator: '<=',
          condition: () => filters?.lastTransmissionDate !== undefined,
        },
      ].filter(({ condition }) => (condition ? condition() : true))

      const queryFilters = queryFiltersFields.map(
        ({ field, operator, transformation }) =>
          `${field} ${operator} '${transformation ? transformation() : query}'`
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
        state.suggestion = action.payload.suggestion
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
export const selectSearchSuggestion = (state: RootState) => state.search.suggestion
export const selectSearchPagination = (state: RootState) => state.search.pagination

export default searchSlice.reducer
