import { createAsyncThunk } from '@reduxjs/toolkit'
import { FeatureCollection } from 'geojson'
import GFWAPI from '@globalfishingwatch/api-client'
import { Dataset } from '@globalfishingwatch/api-types/dist'
import { SearchFilter } from 'features/search/search.slice'
import { AsyncError } from 'utils/async-slice'

type Report = {
  id: string
  name: string
  userId: number
  userType: string
  completedDate?: string
  startedDate: string
  downloaded: boolean
  createdAt: string
  status: 'not-started'
}

export type DateRange = {
  start: string
  end: string
}

export type ReportThunk = {
  name: string
  type: 'detail'
  timeGroup: 'none'
  dateRange: DateRange
  filters: SearchFilter
  datasets: Dataset[]
  geometry: FeatureCollection
}

export const createReportThunk = createAsyncThunk<
  Report,
  ReportThunk,
  {
    rejectValue: AsyncError
  }
>('report/create', async (reportArguments: ReportThunk, { rejectWithValue }) => {
  try {
    const fromDate = reportArguments.dateRange.start
    const toDate = reportArguments.dateRange.end
    const payload = {
      ...reportArguments,
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
