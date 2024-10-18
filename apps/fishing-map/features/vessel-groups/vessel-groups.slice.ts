import { createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { uniqBy } from 'es-toolkit'
import memoize from 'lodash/memoize'
import { APIPagination, VesselGroup, VesselGroupUpsert } from '@globalfishingwatch/api-types'
import { GFWAPI, FetchOptions, parseAPIError, ParsedAPIError } from '@globalfishingwatch/api-client'
import {
  AsyncError,
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { DEFAULT_PAGINATION_PARAMS } from 'data/config'
import { RootState } from 'store'
import { prepareVesselGroupVesselsUpdate } from './vessel-groups.utils'

export type IdField = 'vesselId' | 'mmsi' | 'imo'
export type VesselGroupConfirmationMode = 'save' | 'saveAndSeeInWorkspace' | 'saveAndDeleteVessels'

interface VesselGroupsState extends AsyncReducer<VesselGroup> {
  workspace: {
    status: AsyncReducerStatus
    error: ParsedAPIError | null
  }
}

const initialState: VesselGroupsState = {
  ...asyncInitialState,
  workspace: {
    status: AsyncReducerStatus.Idle,
    error: null,
  },
}
type VesselGroupSliceState = { vesselGroups: VesselGroupsState }

export const fetchWorkspaceVesselGroupsThunk = createAsyncThunk(
  'workspace-vessel-groups/fetch',
  async (ids: string[] = [], { signal, rejectWithValue, getState }) => {
    const vesselGroupsLoaded = (selectAllVesselGroups(getState() as RootState) || [])?.map(
      (vg) => vg.id
    )
    const vesselGroupsNotLoaded = Array.from(
      new Set(ids.filter((id) => !vesselGroupsLoaded.includes(id)))
    )
    if (!vesselGroupsNotLoaded.length) {
      return []
    }
    try {
      const vesselGroupsParams = {
        ids: vesselGroupsNotLoaded,
        cache: false,
        ...DEFAULT_PAGINATION_PARAMS,
      }
      const vesselGroups = await GFWAPI.fetch<APIPagination<VesselGroup>>(
        `/vessel-groups?${stringify(vesselGroupsParams, { arrayFormat: 'indices' })}`,
        { signal, cache: 'reload' }
      )
      return vesselGroups.entries as VesselGroup[]
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (_, { getState }) => {
      const workspaceVesselGroupsStatus = (getState() as VesselGroupSliceState).vesselGroups.status
      // Fetched already in progress, don't need to re-fetch
      return workspaceVesselGroupsStatus !== AsyncReducerStatus.Loading
    },
  }
)

export const fetchVesselGroupsThunk = createAsyncThunk<
  VesselGroup[],
  { ids: string[] } | undefined
>(
  'vessel-groups/fetch',
  async ({ ids = [] } = {} as { ids: string[] }) => {
    const vesselGroupsParams = {
      ...DEFAULT_PAGINATION_PARAMS,
      cache: false,
      // 'logged-user': true,
      ...(ids?.length && { ids }),
    }
    const url = `/vessel-groups?${stringify(vesselGroupsParams)}`
    const vesselGroups = await GFWAPI.fetch<APIPagination<VesselGroup>>(url, { cache: 'reload' })
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

export const fetchVesselGroupByIdThunk = createAsyncThunk(
  'vessel-groups/fetchById',
  async (vesselGroupId: string) => {
    if (vesselGroupId) {
      const vesselGroup = await GFWAPI.fetch<VesselGroup>(`/vessel-groups/${id}`)
      return vesselGroup
    }
  }
)

export const createVesselGroupThunk = createAsyncThunk(
  'vessel-groups/create',
  async (vesselGroupCreate: VesselGroupUpsert, { dispatch, getState }) => {
    const vesselGroupUpsert: VesselGroupUpsert = {
      ...vesselGroupCreate,
      vessels: prepareVesselGroupVesselsUpdate(vesselGroupCreate.vessels || []),
    }
    const saveVesselGroup: any = async (vesselGroup: VesselGroupUpsert, tries = 0) => {
      let vesselGroupUpdated: VesselGroup
      if (tries < 5) {
        try {
          const name = tries > 0 ? vesselGroupUpsert.name + `_${tries}` : vesselGroupUpsert.name
          vesselGroupUpdated = await GFWAPI.fetch<VesselGroup>('/vessel-groups', {
            method: 'POST',
            body: { ...vesselGroup, name },
          } as FetchOptions<any>)
        } catch (e: any) {
          // Means we already have a workspace with this name
          if (e.status === 422 && e.message.includes('Id') && e.message.includes('duplicated')) {
            return await saveVesselGroup(vesselGroup, tries + 1)
          }
          console.warn('Error creating vessel group', e)
          throw e
        }
        return vesselGroupUpdated
      }
    }
    return await saveVesselGroup(vesselGroupUpsert)
  }
)

export type UpdateVesselGroupThunkParams = VesselGroupUpsert & {
  id: string
  override?: boolean
}
export const updateVesselGroupThunk = createAsyncThunk(
  'vessel-groups/update',
  async (vesselGroupUpsert: UpdateVesselGroupThunkParams) => {
    const { id, ...rest } = vesselGroupUpsert
    const vesselGroup: VesselGroupUpsert = {
      ...rest,
      vessels: prepareVesselGroupVesselsUpdate(rest.vessels || []),
    }
    const vesselGroupUpdated = await GFWAPI.fetch<VesselGroup>(`/vessel-groups/${id}`, {
      method: 'PATCH',
      body: vesselGroup,
    } as FetchOptions<any>)
    return vesselGroupUpdated
  }
)

export const updateVesselGroupVesselsThunk = createAsyncThunk(
  'vessel-groups/update-vessels',
  async (
    { id, name, vessels = [], override = false }: UpdateVesselGroupThunkParams,
    { getState, dispatch }
  ) => {
    let vesselGroup = selectVesselGroupById(id)(getState() as any)
    if (!override && !vesselGroup) {
      const action = await dispatch(fetchVesselGroupByIdThunk(id))
      if (fetchVesselGroupByIdThunk.fulfilled.match(action) && action.payload) {
        vesselGroup = action.payload
      }
    }
    if (vesselGroup) {
      return dispatch(
        updateVesselGroupThunk({
          id: vesselGroup.id,
          name: name || vesselGroup.name,
          vessels: override
            ? vessels
            : uniqBy([...vesselGroup.vessels, ...vessels], (v) => v.vesselId),
        })
      )
    }
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
  VesselGroupsState,
  VesselGroup
>({
  name: 'vesselGroups',
  initialState,
  reducers: {
    resetVesselGroup: () => {
      return { ...initialState }
    },
  },

  extraReducers(builder) {
    builder.addCase(fetchWorkspaceVesselGroupsThunk.pending, (state) => {
      state.workspace.status = AsyncReducerStatus.Loading
    })
    builder.addCase(
      fetchWorkspaceVesselGroupsThunk.fulfilled,
      (state, action: PayloadAction<VesselGroup[]>) => {
        state.workspace.status = AsyncReducerStatus.Finished
        entityAdapter.addMany(state, action.payload)
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
    fetchThunk: fetchVesselGroupsThunk,
    fetchByIdThunk: fetchVesselGroupByIdThunk,
    updateThunk: updateVesselGroupThunk,
    createThunk: createVesselGroupThunk,
    deleteThunk: deleteVesselGroupThunk,
  },
})

export const { selectAll: selectAllVesselGroups, selectById } =
  entityAdapter.getSelectors<VesselGroupSliceState>((state) => state.vesselGroups)

export const selectVesselGroupById = memoize((id: string) =>
  createSelector([(state: VesselGroupSliceState) => state], (state) => selectById(state, id))
)

export const selectVesselGroupsStatus = (state: VesselGroupSliceState) => state.vesselGroups.status
export const selectWorkspaceVesselGroupsStatus = (state: VesselGroupSliceState) =>
  state.vesselGroups.workspace.status

export const selectWorkspaceVesselGroupsError = (state: VesselGroupSliceState) =>
  state.vesselGroups.workspace.error
export const selectVesselGroupsStatusId = (state: VesselGroupSliceState) =>
  state.vesselGroups.statusId

export default vesselGroupsSlice.reducer
