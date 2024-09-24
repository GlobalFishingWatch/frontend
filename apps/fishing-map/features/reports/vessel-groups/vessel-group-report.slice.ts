import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { APIPagination, IdentityVessel, VesselGroup } from '@globalfishingwatch/api-types'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { getVesselProperty } from 'features/vessel/vessel.utils'

export type VesselGroupReport = Omit<VesselGroup, 'vessels'> & { vessels: IdentityVessel[] }

interface ReportState {
  status: AsyncReducerStatus
  error: AsyncError | null
  vesselGroup: VesselGroupReport | null
}

type VesselGroupReportSliceState = { vesselGroupReport: ReportState }

const initialState: ReportState = {
  status: AsyncReducerStatus.Idle,
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
      const vesselGroupVessels = await GFWAPI.fetch<APIPagination<IdentityVessel>>(
        `/vessels?${stringify({ 'vessel-groups': [vesselGroupId] })}`,
        { cache: 'reload', signal }
      )
      return {
        ...vesselGroup,
        vessels: vesselGroupVessels.entries.toSorted((a, b) => {
          const aValue = getVesselProperty(a, 'shipname')
          const bValue = getVesselProperty(b, 'shipname')
          if (aValue === bValue) {
            return 0
          }
          return aValue > bValue ? 1 : -1
        }),
      }
    } catch (e) {
      console.warn(e)
      return rejectWithValue(e)
    }
  },
  {
    condition: (params: FetchVesselGroupReportThunkParams, { getState }) => {
      const { status, vesselGroup } = (getState() as VesselGroupReportSliceState)?.vesselGroupReport
      if (
        vesselGroup?.id === params.vesselGroupId &&
        (status === AsyncReducerStatus.Loading || status === AsyncReducerStatus.Finished)
      ) {
        return false
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
    builder.addCase(fetchVesselGroupReportThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
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