import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import {
  APIPagination,
  Vessel,
  VesselGroup,
  VesselGroupUpsert,
} from '@globalfishingwatch/api-types'
import { GFWAPI, FetchOptions, parseAPIError, ParsedAPIError } from '@globalfishingwatch/api-client'
import {
  AsyncError,
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { API_VERSION } from 'data/config'
import { RootState } from 'store'

interface VesselGroupsSliceState extends AsyncReducer<VesselGroup> {
  isModalOpen: boolean
  vessels: Vessel[]
  currentDataviewId: string
  workspace: {
    status: AsyncReducerStatus
    error: ParsedAPIError
    vesselGroups: VesselGroup[]
  }
}

const initialState: VesselGroupsSliceState = {
  ...asyncInitialState,
  isModalOpen: false,
  currentDataviewId: undefined,
  vessels: undefined,
  workspace: {
    status: AsyncReducerStatus.Idle,
    error: undefined,
    vesselGroups: undefined,
  },
}

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
    // const url = [`/${API_VERSION}/vessel-groups/`, vesselGroup.id ? vesselGroup.id : ''].join('')
    // const method = vesselGroup.id ? 'PATCH' : 'POST'
    const url = `/${API_VERSION}/vessel-groups/`
    const method = 'POST'

    const vesselGroupUpdated = await GFWAPI.fetch<VesselGroup>(url, {
      method,
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
    setVesselGroupVessels: (state, action: PayloadAction<Vessel[]>) => {
      state.vessels = action.payload
    },
    setCurrentDataviewId: (state, action: PayloadAction<string>) => {
      state.currentDataviewId = action.payload
    },
  },
  extraReducers(builder) {
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
    // updateThunk: updateDatasetThunk,
    createThunk: createVesselGroupThunk,
    deleteThunk: deleteVesselGroupThunk,
  },
})

export const { setVesselGroupsModalOpen, setVesselGroupVessels, setCurrentDataviewId } =
  vesselGroupsSlice.actions

export const { selectAll: selectAllVesselGroups } = entityAdapter.getSelectors<RootState>(
  (state) => state.vesselGroups
)

export const selectVesselGroupModalOpen = (state: RootState) => state.vesselGroups.isModalOpen
export const selectVesselGroupsStatus = (state: RootState) => state.vesselGroups.status
export const selectWorkspaceVesselGroupsStatus = (state: RootState) =>
  state.vesselGroups.workspace.status
export const selectWorkspaceVesselGroupsError = (state: RootState) =>
  state.vesselGroups.workspace.error
export const selectWorkspaceVesselGroups = (state: RootState) =>
  state.vesselGroups.workspace.vesselGroups
export const selectVesselGroupVessels = (state: RootState) => state.vesselGroups.vessels
export const selectVesselGroupsStatusId = (state: RootState) => state.vesselGroups.statusId
export const selectCurrentDataviewId = (state: RootState) => state.vesselGroups.currentDataviewId

export default vesselGroupsSlice.reducer
