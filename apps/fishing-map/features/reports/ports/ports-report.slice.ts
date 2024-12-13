import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getQueryParamsResolved } from 'queries/base'
import type {
  ReportEventsVesselsResponse,
  ReportEventsVesselsResponseItem,
} from 'queries/report-events-stats-api'
import { EVENTS_TIME_FILTER_MODE } from 'queries/report-events-stats-api'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { GFWAPI } from '@globalfishingwatch/api-client'
import type { AsyncError } from 'utils/async-slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  DEFAULT_VESSEL_IDENTITY_ID,
  INCLUDES_RELATED_SELF_REPORTED_INFO_ID,
} from 'features/vessel/vessel.config'
import {
  fetchAllSearchVessels,
  SEARCH_PAGINATION,
} from 'features/vessel-groups/vessel-groups-modal.slice'
import { getSearchIdentityResolved, getVesselIdentities } from 'features/vessel/vessel.utils'
import type { VesselLastIdentity } from 'features/search/search.slice'
import { t } from 'features/i18n/i18n'
import { formatInfoField } from 'utils/info'
import { OTHER_CATEGORY_LABEL } from '../vessel-groups/vessel-group-report.config'
import { getDateRangeHash } from '../shared/activity/reports-activity.slice'

export type EventsStatsVessel = ReportEventsVesselsResponseItem &
  VesselLastIdentity & {
    shipName: string
    geartype: string
    flagTranslated: string
  }

type PortReportData = {
  portId: string
  portName: string
  portCountry: string
  vessels: EventsStatsVessel[] | null
}
interface PortReportState {
  status: AsyncReducerStatus
  statusId: string
  error: AsyncError | null
  data: PortReportData
  dateRangeHash: string
}

type PortsReportSliceState = { portsReport: PortReportState }

const dataInitialState: PortReportData = {
  portId: '',
  portName: '',
  portCountry: '',
  vessels: null,
}
const initialState: PortReportState = {
  status: AsyncReducerStatus.Idle,
  statusId: '',
  error: null,
  data: dataInitialState,
  dateRangeHash: '',
}

type FetchPortsReportThunkParams = {
  portId: string
  datasetId: string
  start: string
  end: string
  confidences?: number[]
}

export const fetchPortsReportThunk = createAsyncThunk(
  'ports-report/vessels',
  async (
    { portId, datasetId, start, end, confidences = [4] }: FetchPortsReportThunkParams,
    { rejectWithValue, signal }
  ) => {
    try {
      const vesselEventsParams = {
        'start-date': start,
        'end-date': end,
        'port-ids': [portId],
        'time-filter-mode': EVENTS_TIME_FILTER_MODE,
        dataset: datasetId,
        ...(confidences.length && { confidences }),
      }
      const portEventsVesselStats = await GFWAPI.fetch<ReportEventsVesselsResponse>(
        `/events/stats-by-vessel${getQueryParamsResolved(vesselEventsParams)}`,
        { signal }
      )
      const portsReportVessels = await fetchAllSearchVessels({
        url: `/vessels/search${getQueryParamsResolved({
          limit: SEARCH_PAGINATION,
          includes: [INCLUDES_RELATED_SELF_REPORTED_INFO_ID],
        })}`,
        body: {
          datasets: [DEFAULT_VESSEL_IDENTITY_ID],
          ids: portEventsVesselStats.map((v) => v.vesselId),
        },
        signal,
      })
      const vesselsIncluded = new Set()
      const portReportVesselsWithEvents = portsReportVessels.flatMap((vessel) => {
        const identity = getSearchIdentityResolved(vessel)
        const identities = getVesselIdentities(vessel, {
          identitySource: VesselIdentitySourceEnum.SelfReported,
        })
        if (!identities.length) {
          return []
        }
        const ids = identities.map((i) => i.id)
        if (ids.some((id) => vesselsIncluded.has(id))) {
          return []
        }

        const eventsVessel = identities.reduce(
          (acc, identity) => {
            const vesselEvents = portEventsVesselStats.find((v) => v.vesselId === identity.id)
            if (!vesselEvents || vesselsIncluded.has(vesselEvents.vesselId)) {
              return acc
            }
            vesselsIncluded.add(vesselEvents.vesselId)
            acc.numEvents += vesselEvents.numEvents
            return acc
          },
          { numEvents: 0 } as ReportEventsVesselsResponseItem
        )

        return {
          ...identity,
          ...eventsVessel,
          vesselId: identity.id,
          shipName: formatInfoField(identity.shipname, 'shipname') as string,
          geartype:
            (identity.geartypes || [])
              .sort()
              .map((g) => formatInfoField(g, 'geartypes'))
              .join(', ') || OTHER_CATEGORY_LABEL,
          flagTranslated: t(`flags:${identity.flag as string}` as any),
        } as EventsStatsVessel
      })
      return {
        portId,
        portName: portEventsVesselStats[0].portName,
        portCountry: portEventsVesselStats[0].portCountry,
        vessels: portReportVesselsWithEvents.sort((a, b) => b.numEvents - a.numEvents),
      } as PortReportData
    } catch (e) {
      console.warn(e)
      return rejectWithValue(e)
    }
  },
  {
    condition: (params: FetchPortsReportThunkParams, { getState }) => {
      const { status, statusId } = (getState() as PortsReportSliceState)?.portsReport || {}
      if (
        status === AsyncReducerStatus.Error ||
        status === AsyncReducerStatus.Loading ||
        status === AsyncReducerStatus.Finished
      ) {
        return statusId !== params.portId
      }
      return true
    },
  }
)

const portsReportSlice = createSlice({
  name: 'portsReport',
  initialState,
  reducers: {
    resetPortsReportData: (state) => {
      state.status = AsyncReducerStatus.Idle
      state.data = { ...dataInitialState }
      state.dateRangeHash = ''
      state.error = null
    },
    setPortReportDateRangeHash: (state, action: PayloadAction<string>) => {
      state.dateRangeHash = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPortsReportThunk.pending, (state, action) => {
      state.status = AsyncReducerStatus.Loading
      state.statusId = action.meta.arg.portId
    })
    builder.addCase(fetchPortsReportThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.data = action.payload
      const { start, end } = action.meta.arg
      state.dateRangeHash = getDateRangeHash({ start, end })
    })
    builder.addCase(fetchPortsReportThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.status = AsyncReducerStatus.Idle
      } else {
        state.status = AsyncReducerStatus.Error
        state.error = action.payload as AsyncError
      }
    })
  },
})

export const { resetPortsReportData, setPortReportDateRangeHash } = portsReportSlice.actions

export const selectPortsReportStatus = (state: PortsReportSliceState) => state.portsReport.status
export const selectPortsReportError = (state: PortsReportSliceState) => state.portsReport.error
export const selectPortsReportData = (state: PortsReportSliceState) => state.portsReport.data
export const selectPortsReportVessels = (state: PortsReportSliceState) =>
  state.portsReport.data.vessels
export const selectPortsReportDateRangeHash = (state: PortsReportSliceState) =>
  state.portsReport.dateRangeHash

export default portsReportSlice.reducer
