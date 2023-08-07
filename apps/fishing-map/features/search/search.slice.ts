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
  APIVesselSearchPagination,
  IdentityVessel,
  EndpointId,
  SelfReportedInfo,
  VesselRegistryInfo,
} from '@globalfishingwatch/api-types'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { VesselInfoSourceEnum } from 'features/search/search.config'
import { VesselSearchState } from 'types'

export type VesselDatasetInfo = {
  dataset: Dataset
  trackDatasetId?: string
  infoSource?: VesselInfoSourceEnum
}
export type VesselWithDatasets = Omit<IdentityVessel, 'dataset'> & VesselDatasetInfo
export type VesselWithDatasetsMerged = {
  id: string
} & (SelfReportedInfo | VesselRegistryInfo) &
  VesselDatasetInfo

interface SearchState {
  selectedVessels: VesselWithDatasetsMerged[]
  status: AsyncReducerStatus
  statusCode: number | undefined
  data: VesselWithDatasets[]
  suggestion: string | null
  suggestionClicked: boolean
  pagination: {
    loading: boolean
    total: number
    since: string
  }
}
type SearchSliceState = { search: SearchState }

const paginationInitialState = { total: 0, since: '', loading: false }
const initialState: SearchState = {
  selectedVessels: [],
  status: AsyncReducerStatus.Idle,
  statusCode: undefined,
  pagination: paginationInitialState,
  data: [],
  suggestion: null,
  suggestionClicked: false,
}

export type VesselSearchThunk = {
  query: string
  since: string
  filters: VesselSearchState
  datasets: Dataset[]
  gfwUser?: boolean
}

export function checkAdvanceSearchFiltersEnabled(filters: VesselSearchState): boolean {
  const { sources, ...rest } = filters
  return Object.values(rest).filter((f) => f !== undefined).length > 0
}

export const fetchVesselSearchThunk = createAsyncThunk(
  'search/fetch',
  async (
    { query, filters, datasets, since, gfwUser = false }: VesselSearchThunk,
    { getState, signal, rejectWithValue }
  ) => {
    const state = getState() as SearchSliceState
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
          'targetSpecies',
          'flag',
          'fleet',
          'origin',
          'lastTransmissionDate',
          'firstTransmissionDate',
          'ssvid',
          'imo',
          'codMarinha',
        ]

        const fields: AdvancedSearchQueryField[] = andCombinedFields.flatMap((field) => {
          const isInFieldsAllowed =
            fieldsAllowed.includes(field) ||
            fieldsAllowed.includes(`${filters.infoSource}.${field}`)
          if (filters[field] && isInFieldsAllowed) {
            return {
              key: field,
              value: filters[field],
            }
          }
          return []
        })
        if (query) {
          fields.push({
            key: 'shipname',
            value: query,
          })
        }
        advancedQuery = getAdvancedSearchQuery(fields, { rootObject: filters.infoSource as any })
      }

      const datasetConfig = {
        endpoint: EndpointId.VesselSearch,
        datasetId: dataset.id,
        params: [],
        query: [
          // { id: 'includes', value: ['MATCH_CRITERIA'] },
          { id: 'datasets', value: datasets.map((d) => d.id) },
          {
            id: advancedQuery ? 'where' : 'query',
            value: encodeURIComponent(advancedQuery || query),
          },
          { id: 'since', value: since },
        ],
      }

      const url = resolveEndpoint(dataset, datasetConfig)
      if (url) {
        const searchResults = await GFWAPI.fetch<APIVesselSearchPagination<IdentityVessel>>(url, {
          signal,
        })
        // Not removing duplicates for GFWStaff so they can compare other VS fishing vessels
        const uniqSearchResults = gfwUser
          ? searchResults.entries
          : uniqBy(searchResults.entries, 'id')

        const vesselsWithDataset = uniqSearchResults.flatMap((vessel) => {
          if (!vessel) return []
          const infoDataset = selectDatasetById(vessel.dataset)(state as any)
          if (!infoDataset) return []

          const trackDatasetId = getRelatedDatasetByType(infoDataset, DatasetTypes.Tracks, {
            vesselType: vessel?.selfReportedInfo?.[0]?.shiptype,
          })?.id
          return {
            ...vessel,
            dataset: infoDataset,
            trackDatasetId,
          }
        })

        return {
          data:
            since && currentResults
              ? currentResults.concat(vesselsWithDataset)
              : vesselsWithDataset,
          // TO DO: switch suggestions with DID YOU MEAN from API
          // suggestion: searchResults.metadata?.suggestion,
          pagination: {
            loading: false,
            total: searchResults.total,
            since: searchResults.since,
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
    setSelectedVessels: (state, action: PayloadAction<VesselWithDatasetsMerged[]>) => {
      const selection = action.payload
      if (selection.length === 0) {
        state.selectedVessels = []
      }
      if (selection.length === 1) {
        const selectedIds = state.selectedVessels.map((vessel) => vessel?.id)
        const vessel = selection[0]
        if (selectedIds.includes(vessel?.id)) {
          state.selectedVessels = state.selectedVessels.filter((v) => v?.id !== vessel?.id)
        } else if (vessel && vessel.dataset && vessel.trackDatasetId) {
          state.selectedVessels = [...state.selectedVessels, vessel]
        }
      } else {
        state.selectedVessels = selection
      }
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
      state.selectedVessels = initialState.selectedVessels
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVesselSearchThunk.pending, (state, action) => {
      state.status = AsyncReducerStatus.Loading
      state.pagination.loading = action.meta.arg.since ? true : false
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

export const { setSelectedVessels, setSuggestionClicked, cleanVesselSearchResults } =
  searchSlice.actions

export const selectSearchResults = (state: SearchSliceState) => state.search.data
export const selectSearchStatus = (state: SearchSliceState) => state.search.status
export const selectSearchStatusCode = (state: SearchSliceState) => state.search.statusCode
export const selectSearchSuggestion = (state: SearchSliceState) => state.search.suggestion
export const selectSearchSuggestionClicked = (state: SearchSliceState) =>
  state.search.suggestionClicked
export const selectSearchPagination = (state: SearchSliceState) => state.search.pagination
export const selectSelectedVessels = (state: SearchSliceState) => state.search.selectedVessels

export default searchSlice.reducer
