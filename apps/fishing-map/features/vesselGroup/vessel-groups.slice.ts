import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { VesselGroup } from '@globalfishingwatch/api-types'
import { GFWAPI, FetchOptions } from '@globalfishingwatch/api-client'
import { WorkspaceState } from 'types'
import { RootState } from 'store'
import { HOME, WORKSPACE } from 'routes/routes'
import { AsyncReducerStatus, AsyncError } from 'utils/async-slice'
import { isGFWUser, isGuestUser } from 'features/user/user.slice'
import { selectVersion } from 'routes/routes.selectors'
import { API_VERSION } from 'data/config'

interface VesselGroupsSliceState {
  status: AsyncReducerStatus
  error: AsyncError
  data: VesselGroup[]
  isModalOpen: boolean
}

const initialState: VesselGroupsSliceState = {
  status: AsyncReducerStatus.Idle,
  error: {},
  data: [],
  // data: VESSEL_GROUP_MOCK,
  isModalOpen: false,
  // isModalOpen: true,
}

export const fetchVesselGroupsThunk = createAsyncThunk<VesselGroup[], undefined>(
  'vessel-groups/fetch',
  async (_, { getState }) => {
    const state = getState() as RootState
    if (state.vesselGroups.data.length) return state.vesselGroups.data
    const url = `/${API_VERSION}/vessel-groups/`
    const vesselGroups = (await GFWAPI.fetch(url)) as any
    return vesselGroups.entries as VesselGroup[]
  }
)

export const saveVesselGroupThunk = createAsyncThunk(
  'vessel-groups/save',
  async (vesselGroup: VesselGroup, { dispatch, getState }) => {
    const state = getState() as RootState
    // const version = selectVersion(state)

    const url = [`/${API_VERSION}/vessel-groups/`, vesselGroup.id ? vesselGroup.id : ''].join('')
    const method = vesselGroup.id ? 'PATCH' : 'POST'

    // TODO type anys
    const vesselGroupUpdated = await GFWAPI.fetch<any>(url, {
      method,
      body: vesselGroup,
    } as FetchOptions<any>)
    console.log(vesselGroupUpdated)
  }
)

const vesselGroupsSlice = createSlice({
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
    builder.addCase(saveVesselGroupThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(saveVesselGroupThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      const payload = action.payload as any
    })
    builder.addCase(saveVesselGroupThunk.rejected, (state, action) => {
      state.status = AsyncReducerStatus.Error
      console.log('rejected')
    })
    builder.addCase(fetchVesselGroupsThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchVesselGroupsThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.data = action.payload as VesselGroup[]
    })
    builder.addCase(fetchVesselGroupsThunk.rejected, (state, action) => {
      state.status = AsyncReducerStatus.Error
      console.log('rejected')
    })
  },
})

export const { setModalOpen, setModalClosed } = vesselGroupsSlice.actions

export default vesselGroupsSlice.reducer
