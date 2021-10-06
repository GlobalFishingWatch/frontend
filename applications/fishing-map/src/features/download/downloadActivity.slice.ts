import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { Geometry } from 'geojson'
import { stringify } from 'qs'
import { saveAs } from 'file-saver'
import { DownloadActivity } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { RootState } from 'store'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { transformFilters } from 'features/analysis/analysis.utils'
import { DateRange } from 'features/analysis/analysis.slice'
import { Format, GroupBy, SpatialResolution, TemporalResolution } from './downloadActivity.config'

export interface DownloadActivityState {
  geometry: Geometry | undefined
  name: string
  id: string
  status: AsyncReducerStatus
}

const initialState: DownloadActivityState = {
  geometry: undefined,
  name: '',
  id: '',
  status: AsyncReducerStatus.Idle,
}

export type DownloadActivityParams = {
  dateRange: DateRange
  dataview: {
    datasets: string[]
    filters?: Record<string, any>
  }
  geometry: Geometry
  areaName: string
  format: Format
  spatialResolution: SpatialResolution
  temporalResolution: TemporalResolution
  groupBy: GroupBy
}

export const downloadActivityThunk = createAsyncThunk<
  DownloadActivity,
  DownloadActivityParams,
  {
    rejectValue: AsyncError
  }
>('downloadActivity/create', async (params: DownloadActivityParams, { rejectWithValue }) => {
  try {
    const {
      dateRange,
      dataview,
      geometry,
      areaName,
      format,
      spatialResolution,
      temporalResolution,
      groupBy,
    } = params
    const fromDate = DateTime.fromISO(dateRange.start).toUTC()
    const toDate = DateTime.fromISO(dateRange.end).toUTC()

    const downloadActivityParams = {
      datasets: [dataview.datasets.join(',')],
      filters: [dataview.filters && transformFilters(dataview.filters)],
      'date-range': [fromDate, toDate].join(','),
      format,
      spatialResolution,
      temporalResolution,
      groupBy,
    }

    const fileName = `${areaName} - ${downloadActivityParams['date-range']}.zip`

    const createdDownload: any = await GFWAPI.fetch<DownloadActivity>(
      `/v1/4wings/report?${stringify(downloadActivityParams, { arrayFormat: 'indices' })}`,
      {
        method: 'POST',
        body: { geojson: geometry } as any,
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${GFWAPI.getToken()}`,
        },
      }
    ).then((blob) => {
      saveAs(blob as any, fileName)
    })
    return createdDownload
  } catch (e: any) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

const downloadActivitySlice = createSlice({
  name: 'downloadActivity',
  initialState,
  reducers: {
    resetDownloadActivityStatus: (state) => {
      state.status = AsyncReducerStatus.Idle
    },
    clearDownloadActivityGeometry: (state) => {
      state.geometry = undefined
      state.name = ''
      state.status = AsyncReducerStatus.Idle
    },
    setDownloadActivityGeometry: (state, action: PayloadAction<TooltipEventFeature>) => {
      state.geometry = action.payload.geometry as Geometry
      state.name = action.payload.value
    },
  },
  extraReducers: (builder) => {
    builder.addCase(downloadActivityThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(downloadActivityThunk.fulfilled, (state) => {
      state.status = AsyncReducerStatus.Finished
    })
    builder.addCase(downloadActivityThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.status = AsyncReducerStatus.Aborted
      } else {
        state.status = AsyncReducerStatus.Error
      }
    })
  },
})

export const {
  resetDownloadActivityStatus,
  clearDownloadActivityGeometry,
  setDownloadActivityGeometry,
} = downloadActivitySlice.actions

export const selectDownloadActivityGeometry = (state: RootState) => state.downloadActivity.geometry
export const selectDownloadActivityAreaName = (state: RootState) => state.downloadActivity.name
export const selectDownloadActivityAreaId = (state: RootState) => state.downloadActivity.id
export const selectDownloadActivityStatus = (state: RootState) => state.downloadActivity.status

export default downloadActivitySlice.reducer
