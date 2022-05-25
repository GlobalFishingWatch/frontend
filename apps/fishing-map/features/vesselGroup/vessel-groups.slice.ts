import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { VesselGroup } from '@globalfishingwatch/api-types'
import { GFWAPI, FetchOptions } from '@globalfishingwatch/api-client'
import { WorkspaceState } from 'types'
import { RootState } from 'store'
import { HOME, WORKSPACE } from 'routes/routes'
import { AsyncReducerStatus, AsyncError } from 'utils/async-slice'
import { isGFWUser, isGuestUser } from 'features/user/user.slice'
import { selectVersion } from 'routes/routes.selectors'

interface VesselGroupsSliceState {
  status: AsyncReducerStatus
  error: AsyncError
  data: VesselGroup[]
  isModalOpen: boolean
}

// const VESSEL_GROUP_MOCK = [
//   { id: 'vesselGroup1', vesselIDs: ['1', '2', '3', '4', '5', '6'], name: 'Long Xing' },
//   {
//     id: 'vesselGroup2',
//     vesselIDs: ['1', '2', '3', '4', '5', '6', '11', '12', '13', '14', '15', '16'],
//     name: 'My Custom vessel group 1',
//   },
// ]

const initialState: VesselGroupsSliceState = {
  status: AsyncReducerStatus.Idle,
  error: {},
  data: [],
  isModalOpen: true,
}

export const saveVesselGroupThunk = createAsyncThunk(
  'vessel-groups/save',
  async (vesselGroup: VesselGroup, { dispatch, getState }) => {
    const state = getState() as RootState
    const version = 'v2'
    // const version = selectVersion(state)

    const url = [`/${version}/vessel-groups/`, vesselGroup.id ? vesselGroup.id : ''].join('')
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
      console.log(payload)
    })
    builder.addCase(saveVesselGroupThunk.rejected, (state, action) => {
      state.status = AsyncReducerStatus.Error
      console.log('rejected')
    })
  },
})

export const { setModalOpen, setModalClosed } = vesselGroupsSlice.actions

export default vesselGroupsSlice.reducer
