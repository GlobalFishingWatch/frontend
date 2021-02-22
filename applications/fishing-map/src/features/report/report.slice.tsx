import { createAsyncThunk } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import GFWAPI from '@globalfishingwatch/api-client'
import { Report } from '@globalfishingwatch/api-types'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { AsyncError, AsyncReducer, createAsyncSlice } from 'utils/async-slice'
import { RootState } from 'store'

export type DateRange = {
  start: string
  end: string
}

export type CreateReport = {
  name: string
  dateRange: DateRange
  filters: Record<string, any>
  datasets: string[]
  geometry: GeoJSON.Polygon
}

export const createReportThunk = createAsyncThunk<
  Report,
  CreateReport,
  {
    rejectValue: AsyncError
  }
>('report/create', async (createReport: CreateReport, { rejectWithValue }) => {
  try {
    const { dateRange, filters, datasets } = createReport
    const fromDate = DateTime.fromISO(dateRange.start).toUTC().toISODate()
    const toDate = DateTime.fromISO(dateRange.end).toUTC().toISODate()

    const queryFiltersFields = [
      {
        value: filters.flags,
        field: 'flag',
        operator: 'IN',
        transformation: (value: any): string =>
          `(${(value as MultiSelectOption<string>[])?.map((f) => `'${f.id}'`).join(', ')})`,
      },
      {
        value: filters.fleets,
        field: 'fleet',
        operator: 'IN',
        transformation: (value: any): string =>
          `(${(value as MultiSelectOption<string>[])?.map((f) => `'${f.id}'`).join(', ')})`,
      },
      {
        value: filters.origins,
        field: 'origin',
        operator: 'IN',
        transformation: (value: any): string =>
          `(${(value as MultiSelectOption<string>[])?.map((f) => `'${f.id}'`).join(', ')})`,
      },
      {
        value: filters.geartype,
        field: 'geartype',
        operator: 'IN',
        transformation: (value: any): string =>
          `(${(value as MultiSelectOption<string>[])?.map((f) => `'${f.id}'`).join(', ')})`,
      },
      {
        value: filters.vessel_type,
        field: 'vessel_type',
        operator: 'IN',
        transformation: (value: any): string =>
          `(${(value as MultiSelectOption<string>[])?.map((f) => `'${f.id}'`).join(', ')})`,
      },
    ]

    const queryFilters = queryFiltersFields
      .filter(({ value }) => value !== undefined)
      .map(
        ({ field, operator, transformation, value }) =>
          `${field} ${operator} ${transformation ? transformation(value) : `'${value}'`}`
      )

    const payload = {
      ...createReport,
      type: 'detail',
      timeGroup: 'none',
      filters: queryFilters,
      datasets: datasets,
      dateRange: [fromDate, toDate],
    }
    const createdReport = await GFWAPI.fetch<Report>('/v1/reports', {
      method: 'POST',
      body: payload as any,
    })
    return createdReport
  } catch (e) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

export type ReportState = AsyncReducer<Report>
const { slice: reportsSlice, entityAdapter } = createAsyncSlice<ReportState, Report>({
  name: 'report',
  thunks: {
    createThunk: createReportThunk,
  },
})

export const selectReportStatus = (state: RootState) => state.report.status

export default reportsSlice.reducer
