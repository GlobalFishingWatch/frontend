import { createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { memoize, uniq } from 'lodash'
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
import { API_VERSION } from 'data/config'
import { RootState } from 'store'
import { selectAllSearchDatasetsByType } from 'features/search/search.selectors'

export type IdColumn = 'id' | 'mmsi' | 'ssvid'

interface VesselGroupsSliceState extends AsyncReducer<VesselGroup> {
  isModalOpen: boolean
  vesselsIds: VesselGroupVessel[]
  vesselGroupEditId: string
  currentDataviewId: string
  search: {
    status: AsyncReducerStatus
    error: ParsedAPIError
    vessels: Vessel[]
  }
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
  vesselsIds: undefined,
  search: {
    status: AsyncReducerStatus.Idle,
    vessels: undefined,
    error: undefined,
  },
  workspace: {
    status: AsyncReducerStatus.Idle,
    error: undefined,
    vesselGroups: undefined,
  },
}

export const searchVesselGroupsThunk = createAsyncThunk(
  'vessel-groups/search',
  async (
    { vessels, columnId }: { vessels: VesselGroupVessel[]; columnId: IdColumn },
    { signal, rejectWithValue, getState }
  ) => {
    const state = getState() as RootState
    const vesselGroupDatasets = uniq(vessels?.flatMap((v) => v.dataset || []))
    const allVesselDatasets = selectVesselsDatasets(state)
    const advancedSearchDatasets = (selectAllSearchDatasetsByType('advanced')(state) || []).filter(
      (d) => d.status !== DatasetStatus.Deleted
    )
    const vesselDatasetsByType = columnId === 'id' ? allVesselDatasets : advancedSearchDatasets
    const searchDatasets = vesselGroupDatasets?.length
      ? vesselDatasetsByType.filter((dataset) => vesselGroupDatasets.includes(dataset.id))
      : vesselDatasetsByType
    if (searchDatasets?.length) {
      const dataset = searchDatasets[0]
      const datasets = searchDatasets.map((d) => d.id)
      const datasetConfig: DataviewDatasetConfig = {
        endpoint: columnId === 'id' ? EndpointId.VesselList : EndpointId.VesselAdvancedSearch,
        datasetId: searchDatasets[0].id,
        params: [],
        query: [
          {
            id: 'datasets',
            value: datasets,
          },
          columnId === 'id'
            ? { id: 'ids', value: vessels.map(({ vesselId }) => vesselId) }
            : {
                id: 'query',
                value: encodeURIComponent(
                  vessels.map(({ vesselId }) => `${columnId} = '${vesselId}'`).join(' OR ')
                ),
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
        return searchResults.entries
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
      const workspaceVesselGroupsStatus = (getState() as RootState).vesselGroups.workspace.status
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
      }
      const vesselGroups = await GFWAPI.fetch<APIPagination<VesselGroup>>(
        `/${API_VERSION}/vessel-groups?${stringify(vesselGroupsParams, { arrayFormat: 'comma' })}`,
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
    const url = `/${API_VERSION}/vessel-groups`
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

export const createVesselGroupThunk = createAsyncThunk(
  'vessel-groups/create',
  async (vesselGroup: VesselGroupUpsert, { dispatch, getState }) => {
    const url = `/${API_VERSION}/vessel-groups/`

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
    const url = `/${API_VERSION}/vessel-groups/${id}`
    await GFWAPI.fetch<VesselGroup>(url, {
      method: 'PATCH',
      body: rest,
    } as FetchOptions<any>)
    // TODO: discuss with API team why we need to do an extra request
    const vesselGroup = await GFWAPI.fetch<VesselGroup>(url)
    return vesselGroup
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
    const vesselGroup = await GFWAPI.fetch<VesselGroup>(`/${API_VERSION}/vessel-groups/${id}`, {
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
    setVesselGroupSearchVessels: (state, action: PayloadAction<Vessel[]>) => {
      state.search.vessels = action.payload
    },
    setVesselGroupEditId: (state, action: PayloadAction<string>) => {
      state.vesselGroupEditId = action.payload
    },
    setCurrentDataviewId: (state, action: PayloadAction<string>) => {
      state.currentDataviewId = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(searchVesselGroupsThunk.pending, (state) => {
      state.search.status = AsyncReducerStatus.Loading
      state.search.vessels = undefined
    })
    builder.addCase(searchVesselGroupsThunk.fulfilled, (state, action) => {
      state.search.status = AsyncReducerStatus.Finished
      state.search.vessels = action.payload
    })
    builder.addCase(searchVesselGroupsThunk.rejected, (state, action) => {
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
  setVesselGroupEditId,
  setCurrentDataviewId,
  setVesselGroupsModalOpen,
  setVesselGroupSearchVessels,
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
export const selectWorkspaceVesselGroups = (state: RootState) =>
  state.vesselGroups.workspace.vesselGroups
export const selectVesselGroupVesselIds = (state: RootState) => state.vesselGroups.vesselsIds
export const selectVesselGroupSearchStatus = (state: RootState) => state.vesselGroups.search.status
export const selectVesselGroupSearchVessels = (state: RootState) =>
  state.vesselGroups.search.vessels
export const selectVesselGroupsStatusId = (state: RootState) => state.vesselGroups.statusId
export const selectCurrentDataviewId = (state: RootState) => state.vesselGroups.currentDataviewId
export const selectVesselGroupEditId = (state: RootState) => state.vesselGroups.vesselGroupEditId

export default vesselGroupsSlice.reducer
