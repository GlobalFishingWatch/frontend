import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { VesselGroup, VesselGroupUpsert } from '@globalfishingwatch/api-types'
import { GFWAPI, FetchOptions, parseAPIError } from '@globalfishingwatch/api-client'
import { RootState } from 'store'
import {
  AsyncReducerStatus,
  AsyncError,
  asyncInitialState,
  AsyncReducer,
  createAsyncSlice,
} from 'utils/async-slice'
import { API_VERSION } from 'data/config'

interface VesselGroupsSliceState extends AsyncReducer<VesselGroup> {
  // status: AsyncReducerStatus
  // error: AsyncError
  // data: VesselGroup[]
  isModalOpen: boolean
}

const initialState: VesselGroupsSliceState = {
  ...asyncInitialState,
  // status: AsyncReducerStatus.Idle,
  // error: {},
  // data: [],
  isModalOpen: false,
  // isModalOpen: true,
}

const fetchVesselGroupsByIdsThunk = createAsyncThunk(
  'vessel-groups/fetch',
  async (ids: string[] = [], { signal, rejectWithValue, getState }) => {
    const url = `/${API_VERSION}/vessel-groups/`
    const vesselGroups = (await GFWAPI.fetch(url)) as any
    return vesselGroups.entries as VesselGroup[]
  }
)

export const fetchAllVesselGroupsThunk = createAsyncThunk(
  'vessel-groups/all',
  (_, { dispatch }) => {
    return dispatch(fetchVesselGroupsByIdsThunk([]))
  }
)

export const createVesselGroupThunk = createAsyncThunk(
  'vessel-groups/create',
  async (vesselGroup: VesselGroupUpsert, { dispatch, getState }) => {
    // const url = [`/${API_VERSION}/vessel-groups/`, vesselGroup.id ? vesselGroup.id : ''].join('')
    // const method = vesselGroup.id ? 'PATCH' : 'POST'
    const url = `/${API_VERSION}/vessel-groups/`
    const method = 'POST'

    // TODO type anys
    const vesselGroupUpdated = await GFWAPI.fetch<any>(url, {
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
    debugger
    const vesselGroup = await GFWAPI.fetch<VesselGroup>(`/${API_VERSION}/vessel-groups/${id}`, {
      method: 'DELETE',
    })
    return { ...vesselGroup, id }
  } catch (e: any) {
    console.warn(e)
    return rejectWithValue(parseAPIError(e))
  }
})

const { slice: vesselGroupsSlice, entityAdapter } = createAsyncSlice<
  VesselGroupsSliceState,
  VesselGroup
>({
  name: 'vesselGroups',
  initialState,
  reducers: {
    setModalOpen: (state) => {
      state.isModalOpen = true
    },
    setModalClosed: (state) => {
      state.isModalOpen = false
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(saveVesselGroupThunk.pending, (state) => {
    //   state.status = AsyncReducerStatus.Loading
    // })
    // builder.addCase(saveVesselGroupThunk.fulfilled, (state, action) => {
    //   state.status = AsyncReducerStatus.Finished
    //   const payload = action.payload as any
    // })
    // builder.addCase(saveVesselGroupThunk.rejected, (state, action) => {
    //   state.status = AsyncReducerStatus.Error
    //   console.log('rejected')
    // })
    // builder.addCase(fetchVesselGroupsThunk.pending, (state) => {
    //   state.status = AsyncReducerStatus.Loading
    // })
    // builder.addCase(fetchVesselGroupsThunk.fulfilled, (state, action) => {
    //   state.status = AsyncReducerStatus.Finished
    //   state.data = action.payload as VesselGroup[]
    // })
    // builder.addCase(fetchVesselGroupsThunk.rejected, (state, action) => {
    //   state.status = AsyncReducerStatus.Error
    //   console.log('rejected')
    // })
  },
  thunks: {
    fetchThunk: fetchVesselGroupsByIdsThunk,
    // updateThunk: updateDatasetThunk,
    createThunk: createVesselGroupThunk,
    deleteThunk: deleteVesselGroupThunk,
  },
})

export const { setModalOpen, setModalClosed } = vesselGroupsSlice.actions

const { selectAll } = entityAdapter.getSelectors<RootState>((state) => state.vesselGroups)

export function selectAllVesselGroups(state: RootState) {
  return selectAll(state)
}

export const selectVesselGroupModalOpen = (state: RootState) => state.vesselGroups.isModalOpen
export const selectVesselGroupsStatus = (state: RootState) => state.vesselGroups.status
export const selectVesselGroupsStatusId = (state: RootState) => state.vesselGroups.statusId

export default vesselGroupsSlice.reducer
