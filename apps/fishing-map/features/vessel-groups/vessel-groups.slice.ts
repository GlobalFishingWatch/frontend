import { createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { memoize, uniq, uniqBy } from 'lodash'
import {
  APIPagination,
  DatasetStatus,
  DataviewDatasetConfig,
  EndpointId,
  Vessel,
  VesselGroup,
  VesselGroupUpsert,
  VesselGroupVessel,
  VesselSearch,
} from '@globalfishingwatch/api-types'
import { GFWAPI, FetchOptions, parseAPIError, ParsedAPIError } from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import {
  AsyncError,
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { DEFAULT_PAGINATION_PARAMS } from 'data/config'
import { RootState } from 'store'
import { selectAllSearchDatasetsByType } from 'features/search/search.selectors'

export const MAX_VESSEL_GROUP_VESSELS = 1000

export type IdField = 'vesselId' | 'mmsi'

interface VesselGroupsSliceState extends AsyncReducer<VesselGroup> {
  isModalOpen: boolean
  vesselGroupEditId: string
  currentDataviewId: string
  groupVessels: VesselGroupVessel[]
  search: {
    id: IdField
    status: AsyncReducerStatus
    error: ParsedAPIError
    vessels: Vessel[]
  }
  newSearchVessels: Vessel[]
  workspace: {
    status: AsyncReducerStatus
    error: ParsedAPIError
    vesselGroups: VesselGroup[]
  }
}

const initialState: VesselGroupsSliceState = {
  ...asyncInitialState,
  isModalOpen: false,
  vesselGroupEditId: undefined,
  currentDataviewId: undefined,
  groupVessels: undefined,
  search: {
    id: 'mmsi',
    status: AsyncReducerStatus.Idle,
    vessels: undefined,
    error: undefined,
  },
  newSearchVessels: undefined,
  workspace: {
    status: AsyncReducerStatus.Idle,
    error: undefined,
    vesselGroups: undefined,
  },
}

export const searchVesselGroupsVesselsThunk = createAsyncThunk(
  'vessel-groups/searchVessels',
  async (
    { vessels, idField }: { vessels: VesselGroupVessel[]; idField: IdField },
    { signal, rejectWithValue, getState }
  ) => {
    const state = getState() as RootState
    const vesselGroupDatasets = uniq(vessels?.flatMap((v) => v.dataset || []))
    const allVesselDatasets = selectVesselsDatasets(state)
    const advancedSearchDatasets = (selectAllSearchDatasetsByType('advanced')(state) || []).filter(
      (d) =>
        d.status !== DatasetStatus.Deleted && d.alias?.some((alias) => alias.includes(':latest'))
    )
    const vesselDatasetsByType = idField === 'vesselId' ? allVesselDatasets : advancedSearchDatasets
    const searchDatasets = vesselGroupDatasets?.length
      ? vesselDatasetsByType.filter((dataset) => vesselGroupDatasets.includes(dataset.id))
      : vesselDatasetsByType

    if (searchDatasets?.length) {
      const dataset = searchDatasets[0]
      const datasets = searchDatasets.map((d) => d.id)
      const uniqVesselIds = uniq(vessels.map(({ vesselId }) => vesselId))
      const advancedSearchQuery = encodeURIComponent(
        `${idField} IN ('${uniqVesselIds.join("','")}')`
      )
      const datasetConfig: DataviewDatasetConfig = {
        endpoint: idField === 'vesselId' ? EndpointId.VesselList : EndpointId.VesselAdvancedSearch,
        datasetId: searchDatasets[0].id,
        params: [],
        query: [
          {
            id: 'datasets',
            value: datasets,
          },
          idField === 'vesselId'
            ? { id: 'ids', value: uniqVesselIds }
            : {
              id: 'query',
              value: advancedSearchQuery,
            },
          {
            id: 'limit',
            value: DEFAULT_PAGINATION_PARAMS.limit,
          },
          {
            id: 'offset',
            value: DEFAULT_PAGINATION_PARAMS.offset,
          },
        ],
      }
      try {
        const url = resolveEndpoint(dataset, datasetConfig)
        if (!url) {
          console.warn('Missing search url')
          return rejectWithValue({
            code: 0,
            message: 'Missing search url',
          })
        }
        const searchResults = await GFWAPI.fetch<APIPagination<VesselSearch>>(url, { signal })
        // API returns multiple instances of the same vessel with the same id and dataset
        const uniqSearchResults = uniqBy(searchResults.entries, (vessel) =>
          [vessel.id, vessel.dataset].join(',')
        )
        // Searching could return same vessel id from different datasets so we need to choose the original one
        const searchResultsFiltered =
          idField === 'vesselId'
            ? uniqSearchResults.filter((vessel) => {
              return (
                vessels.find((v) => v.vesselId === vessel.id && v.dataset === vessel.dataset) !==
                undefined
              )
            })
            : uniqSearchResults
        return searchResultsFiltered
      } catch (e: any) {
        console.warn(e)
        return rejectWithValue(parseAPIError(e))
      }
    } else {
      console.warn('No search datasets found')
      return rejectWithValue({
        code: 0,
        message: 'No search datasets found',
      })
    }
  },
  {
    condition: (_, { getState }) => {
      const workspaceVesselGroupsStatus = (getState() as RootState).vesselGroups.search.status
      // Fetched already in progress, don't need to re-fetch
      return workspaceVesselGroupsStatus !== AsyncReducerStatus.Loading
    },
  }
)

export const fetchWorkspaceVesselGroupsThunk = createAsyncThunk(
  'workspace-vessel-groups/fetch',
  async (ids: string[] = [], { signal, rejectWithValue }) => {
    try {
      const vesselGroupsParams = {
        ...(ids?.length && { ids }),
        cache: false,
        ...DEFAULT_PAGINATION_PARAMS,
      }
      const vesselGroups = await GFWAPI.fetch<APIPagination<VesselGroup>>(
        `/vessel-groups?${stringify(vesselGroupsParams, { arrayFormat: 'comma' })}`,
        { signal }
      )
      return vesselGroups.entries as VesselGroup[]
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (_, { getState }) => {
      const workspaceVesselGroupsStatus = (getState() as RootState).vesselGroups.workspace.status
      // Fetched already in progress, don't need to re-fetch
      return workspaceVesselGroupsStatus !== AsyncReducerStatus.Loading
    },
  }
)

export const fetchUserVesselGroupsThunk = createAsyncThunk(
  'vessel-groups/fetch',
  async () => {
    const url = `/vessel-groups?${stringify(DEFAULT_PAGINATION_PARAMS)}`
    const vesselGroups = await GFWAPI.fetch<APIPagination<VesselGroup>>(url)
    return vesselGroups.entries
  },
  {
    condition: (_, { getState }) => {
      const vesselGroupsStatus = (getState() as any).vesselGroups.status
      // Fetched already in progress, don't need to re-fetch
      return vesselGroupsStatus !== AsyncReducerStatus.Loading
    },
  }
)
const removeDuplicatedVesselGroupvessels = (vessels: VesselGroupVessel[]) => {
  return uniqBy(vessels, (vessel) => [vessel.vesselId, vessel.dataset].join(','))
}
export const createVesselGroupThunk = createAsyncThunk(
  'vessel-groups/create',
  async (vesselGroupCreate: VesselGroupUpsert, { dispatch, getState }) => {
    const url = `/vessel-groups/`
    const vesselGroup: VesselGroupUpsert = {
      ...vesselGroupCreate,
      vessels: removeDuplicatedVesselGroupvessels(vesselGroupCreate.vessels),
    }
    const vesselGroupUpdated = await GFWAPI.fetch<VesselGroup>(url, {
      method: 'POST',
      body: vesselGroup,
    } as FetchOptions<any>)
    return vesselGroupUpdated
  }
)

export const updateVesselGroupThunk = createAsyncThunk(
  'vessel-groups/update',
  async (vesselGroupUpsert: VesselGroupUpsert & { id: string }) => {
    const { id, ...rest } = vesselGroupUpsert
    const url = `/vessel-groups/${id}`
    const vesselGroup: VesselGroupUpsert = {
      ...rest,
      vessels: removeDuplicatedVesselGroupvessels(rest.vessels),
    }
    const vesselGroupUpdated = await GFWAPI.fetch<VesselGroup>(url, {
      method: 'PATCH',
      body: vesselGroup,
    } as FetchOptions<any>)
    return vesselGroupUpdated
  }
)

export const deleteVesselGroupThunk = createAsyncThunk<
  VesselGroup,
  string,
  {
    rejectValue: AsyncError
  }
>('vessel-groups/delete', async (id: any, { rejectWithValue }) => {
  try {
    const vesselGroup = await GFWAPI.fetch<VesselGroup>(`/vessel-groups/${id}`, {
      method: 'DELETE',
    })
    return { ...vesselGroup, id }
  } catch (e: any) {
    console.warn(e)
    return rejectWithValue(parseAPIError(e))
  }
})

export const { slice: vesselGroupsSlice, entityAdapter } = createAsyncSlice<
  VesselGroupsSliceState,
  VesselGroup
>({
  name: 'vesselGroups',
  initialState,
  reducers: {
    setVesselGroupsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload
    },
    setVesselGroupSearchId: (state, action: PayloadAction<IdField>) => {
      state.search.id = action.payload
    },
    resetVesselGroupStatus: (state) => {
      state.status = AsyncReducerStatus.Idle
      state.search.status = AsyncReducerStatus.Idle
    },
    setVesselGroupSearchVessels: (state, action: PayloadAction<Vessel[]>) => {
      state.search.vessels = action.payload
    },
    setNewVesselGroupSearchVessels: (state, action: PayloadAction<Vessel[]>) => {
      state.newSearchVessels = action.payload
    },
    setVesselGroupVessels: (state, action: PayloadAction<VesselGroupVessel[]>) => {
      state.groupVessels = action.payload
    },
    setVesselGroupEditId: (state, action: PayloadAction<string>) => {
      state.vesselGroupEditId = action.payload
    },
    setCurrentDataviewId: (state, action: PayloadAction<string>) => {
      state.currentDataviewId = action.payload
    },
    resetVesselGroup: (state) => {
      // Using initialState doesn't work so needs manual reset
      state.status = AsyncReducerStatus.Idle
      state.isModalOpen = false
      state.vesselGroupEditId = undefined
      state.currentDataviewId = undefined
      state.groupVessels = undefined
      state.search = {
        id: 'mmsi',
        status: AsyncReducerStatus.Idle,
        vessels: undefined,
        error: undefined,
      }
      state.newSearchVessels = undefined
      state.workspace = {
        status: AsyncReducerStatus.Idle,
        error: undefined,
        vesselGroups: undefined,
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(searchVesselGroupsVesselsThunk.pending, (state) => {
      state.search.status = AsyncReducerStatus.Loading
      state.search.vessels = undefined
    })
    builder.addCase(searchVesselGroupsVesselsThunk.fulfilled, (state, action) => {
      state.search.status = AsyncReducerStatus.Finished
      state.search.vessels = action.payload
    })
    builder.addCase(searchVesselGroupsVesselsThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.search.status = AsyncReducerStatus.Idle
      } else {
        state.search.status = AsyncReducerStatus.Error
        state.search.error = action.payload as ParsedAPIError
      }
    })
    builder.addCase(fetchWorkspaceVesselGroupsThunk.pending, (state) => {
      state.workspace.status = AsyncReducerStatus.Loading
      state.workspace.vesselGroups = undefined
    })
    builder.addCase(
      fetchWorkspaceVesselGroupsThunk.fulfilled,
      (state, action: PayloadAction<VesselGroup[]>) => {
        state.workspace.status = AsyncReducerStatus.Finished
        state.workspace.vesselGroups = action.payload
      }
    )
    builder.addCase(fetchWorkspaceVesselGroupsThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.workspace.status = AsyncReducerStatus.Idle
      } else {
        state.workspace.status = AsyncReducerStatus.Error
        state.workspace.error = action.payload as ParsedAPIError
      }
    })
  },
  thunks: {
    fetchThunk: fetchUserVesselGroupsThunk,
    updateThunk: updateVesselGroupThunk,
    createThunk: createVesselGroupThunk,
    deleteThunk: deleteVesselGroupThunk,
  },
})

export const {
  resetVesselGroup,
  resetVesselGroupStatus,
  setVesselGroupEditId,
  setCurrentDataviewId,
  setVesselGroupVessels,
  setVesselGroupSearchId,
  setVesselGroupsModalOpen,
  setVesselGroupSearchVessels,
  setNewVesselGroupSearchVessels,
} = vesselGroupsSlice.actions

export const { selectAll: selectAllVesselGroups, selectById } =
  entityAdapter.getSelectors<RootState>((state) => state.vesselGroups)

export const selectVesselGroupById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export const selectVesselGroupModalOpen = (state: RootState) => state.vesselGroups.isModalOpen
export const selectVesselGroupsStatus = (state: RootState) => state.vesselGroups.status
export const selectWorkspaceVesselGroupsStatus = (state: RootState) =>
  state.vesselGroups.workspace.status
export const selectWorkspaceVesselGroupsError = (state: RootState) =>
  state.vesselGroups.workspace.error
export const selectVesselGroupsVessels = (state: RootState) => state.vesselGroups.groupVessels
export const selectWorkspaceVesselGroups = (state: RootState) =>
  state.vesselGroups.workspace.vesselGroups
export const selectVesselGroupSearchId = (state: RootState) => state.vesselGroups.search.id
export const selectVesselGroupSearchStatus = (state: RootState) => state.vesselGroups.search.status
export const selectVesselGroupSearchVessels = (state: RootState) =>
  state.vesselGroups.search.vessels
export const selectNewVesselGroupSearchVessels = (state: RootState) =>
  state.vesselGroups.newSearchVessels
export const selectVesselGroupsStatusId = (state: RootState) => state.vesselGroups.statusId
export const selectCurrentDataviewId = (state: RootState) => state.vesselGroups.currentDataviewId
export const selectVesselGroupEditId = (state: RootState) => state.vesselGroups.vesselGroupEditId

export default vesselGroupsSlice.reducer
