import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import { stringify } from 'qs'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { APIPagination, IdentityVessel, VesselGroup } from '@globalfishingwatch/api-types'

import { INCLUDES_RELATED_SELF_REPORTED_INFO_ID } from 'features/vessel/vessel.config'
import { mergeVesselGroupVesselIdentities } from 'features/vessel-groups/vessel-groups.utils'
import type { VesselGroupVesselIdentity } from 'features/vessel-groups/vessel-groups-modal.slice'
import type { AsyncError } from 'utils/async-slice'
import { AsyncReducerStatus } from 'utils/async-slice'

export type VesselGroupReport = Omit<VesselGroup, 'vessels'> & {
  vessels: VesselGroupVesselIdentity[]
}

interface ReportState {
  status: AsyncReducerStatus
  statusId: string
  error: AsyncError | null
  vesselGroup: VesselGroupReport | null
}

type VesselGroupReportSliceState = { vesselGroupReport: ReportState }

const initialState: ReportState = {
  status: AsyncReducerStatus.Idle,
  statusId: '',
  error: null,
  vesselGroup: null,
}

type FetchVesselGroupReportThunkParams = {
  vesselGroupId: string
}

export const fetchVesselGroupReportThunk = createAsyncThunk(
  'vessel-group-report/vessels',
  async ({ vesselGroupId }: FetchVesselGroupReportThunkParams, { rejectWithValue, signal }) => {
    try {
      const vesselGroup = await GFWAPI.fetch<VesselGroup>(`/vessel-groups/${vesselGroupId}`)
      const params = {
        'vessel-groups': [vesselGroupId],
        includes: [INCLUDES_RELATED_SELF_REPORTED_INFO_ID],
      }
      const vesselGroupVessels = await GFWAPI.fetch<APIPagination<IdentityVessel>>(
        `/vessels?${stringify(params)}`,
        { cache: 'reload', signal }
      )
      return {
        ...vesselGroup,
        vessels: mergeVesselGroupVesselIdentities(vesselGroup.vessels, vesselGroupVessels.entries),
      }
    } catch (e) {
      console.warn(e)
      return rejectWithValue(e)
    }
  },
  {
    condition: (params: FetchVesselGroupReportThunkParams, { getState }) => {
      const { status, statusId } =
        (getState() as VesselGroupReportSliceState)?.vesselGroupReport || {}
      if (
        status === AsyncReducerStatus.Error ||
        status === AsyncReducerStatus.Loading ||
        status === AsyncReducerStatus.Finished
      ) {
        return statusId !== params.vesselGroupId
      }
      return true
    },
  }
)

const vesselGroupReportSlice = createSlice({
  name: 'vesselGroupReport',
  initialState,
  reducers: {
    resetVesselGroupReportData: (state) => {
      state.status = AsyncReducerStatus.Idle
      state.vesselGroup = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVesselGroupReportThunk.pending, (state, action) => {
      state.status = AsyncReducerStatus.Loading
      state.statusId = action.meta.arg.vesselGroupId
    })
    builder.addCase(fetchVesselGroupReportThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.vesselGroup = action.payload
    })
    builder.addCase(fetchVesselGroupReportThunk.rejected, (state, action) => {
      state.status = AsyncReducerStatus.Error
      state.error = action.payload as AsyncError
    })
  },
})

export const { resetVesselGroupReportData } = vesselGroupReportSlice.actions

export const selectVGRStatus = (state: VesselGroupReportSliceState) =>
  state.vesselGroupReport.status
export const selectVGRError = (state: VesselGroupReportSliceState) => state.vesselGroupReport.error
export const selectVGRData = (state: VesselGroupReportSliceState) =>
  state.vesselGroupReport.vesselGroup
export const selectVGRVessels = (state: VesselGroupReportSliceState) =>
  state.vesselGroupReport.vesselGroup?.vessels

export default vesselGroupReportSlice.reducer
