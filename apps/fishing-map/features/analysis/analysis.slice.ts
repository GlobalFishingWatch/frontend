import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { Feature, Polygon } from 'geojson'
import GFWAPI from '@globalfishingwatch/api-client'
import { Report } from '@globalfishingwatch/api-types'
import {
  AsyncError,
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { RootState } from 'store'
import { Bbox } from 'types'
import { transformFilters } from './analysis.utils'

export type DateRange = {
  start: string
  end: string
}

export type ReportGeometry = Feature<Polygon>

export type CreateReport = {
  name: string
  dateRange: DateRange
  dataviews: {
    filters: Record<string, any>
    datasets: string[]
  }[]
  geometry: ReportGeometry
}

export const createReportThunk = createAsyncThunk<
  Report,
  CreateReport,
  {
    rejectValue: AsyncError
  }
>('report/create', async (createReport: CreateReport, { rejectWithValue }) => {
  try {
    const { name, dateRange, dataviews, geometry } = createReport
    const fromDate = DateTime.fromISO(dateRange.start).toUTC().toISODate()
    const toDate = DateTime.fromISO(dateRange.end).toUTC().toISODate()

    const payload = {
      name,
      geometry,
      type: 'detail',
      timeGroup: 'none',
      filters: dataviews.map(({ filters }) => transformFilters(filters)),
      datasets: dataviews.map(({ datasets }) => datasets.join(',')),
      dateRange: [fromDate, toDate],
    }

    const createdReport = await GFWAPI.fetch<Report>('/v1/reports', {
      method: 'POST',
      body: payload as any,
    })
    return createdReport
  } catch (e: any) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

export interface ReportState extends AsyncReducer<Report> {
  area: {
    geometry: ReportGeometry | undefined
    bounds: Bbox | undefined
    name: string
    id: string
  }
}

const initialState: ReportState = {
  ...asyncInitialState,
  area: {
    geometry: undefined,
    bounds: undefined,
    name: '',
    id: '',
  },
}

const { slice: analysisSlice } = createAsyncSlice<ReportState, Report>({
  name: 'report',
  initialState,
  reducers: {
    resetReportStatus: (state) => {
      state.status = AsyncReducerStatus.Idle
    },
    clearAnalysisGeometry: (state) => {
      state.area.geometry = undefined
      state.area.name = ''
      state.area.bounds = undefined
      state.status = AsyncReducerStatus.Idle
    },
    setAnalysisGeometry: (
      state,
      action: PayloadAction<{
        geometry: ReportGeometry | undefined
        name: string
        bounds: [number, number, number, number]
      }>
    ) => {
      state.area.geometry = action.payload.geometry
      state.area.bounds = action.payload.bounds
      state.area.name = action.payload.name
    },
  },
  thunks: {
    createThunk: createReportThunk,
  },
})

export const { resetReportStatus, clearAnalysisGeometry, setAnalysisGeometry } =
  analysisSlice.actions

export const selectAnalysisGeometry = (state: RootState) => state.analysis.area.geometry
export const selectAnalysisBounds = (state: RootState) => state.analysis.area.bounds
export const selectAnalysisAreaName = (state: RootState) => state.analysis.area.name
export const selectAnalysisAreaId = (state: RootState) => state.analysis.area.id
export const selectReportStatus = (state: RootState) => state.analysis.status

export default analysisSlice.reducer
