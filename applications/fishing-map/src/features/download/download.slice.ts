import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { Feature, Polygon } from 'geojson'
import { stringify } from 'qs'
import fileSaver from 'file-saver'
import { DownloadActivity } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import { TooltipEventFeature } from 'features/map/map.hooks'
import { RootState } from 'store'
import {
  AsyncError,
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { transformFilters } from 'features/analysis/analysis.utils'
import { DateRange } from 'features/analysis/analysis.slice'
import { Bbox } from 'types'
import { Format, GroupBy, SpatialResolution, TemporalResolution } from './download.config'

export type DownloadArea = {
  feature: TooltipEventFeature
}

export type DownloadGeometry = Feature<Polygon>

export interface DownloadState extends AsyncReducer<DownloadActivity> {
  area: {
    geometry: DownloadGeometry | undefined
    bounds: Bbox | undefined
    name: string
    id: string
  }
}
// type DownloadState = {
//   area: DownloadArea | null
// }

const initialState: DownloadState = {
  ...asyncInitialState,
  area: {
    geometry: undefined,
    bounds: undefined,
    name: '',
    id: '',
  },
}

export type CreateDownload = {
  dateRange: DateRange
  dataviews: {
    filters: Record<string, any>
    datasets: string[]
  }[]
  geometry: DownloadGeometry
  format: Format
  spatialResolution: SpatialResolution
  temporalResolution: TemporalResolution
  groupBy: GroupBy
}

export const createDownloadThunk = createAsyncThunk<
  DownloadActivity,
  CreateDownload,
  {
    rejectValue: AsyncError
  }
>('download/create', async (createDownload: CreateDownload, { rejectWithValue }) => {
  try {
    const {
      dateRange,
      dataviews,
      geometry,
      format,
      spatialResolution,
      temporalResolution,
      groupBy,
    } = createDownload
    const fromDate = DateTime.fromISO(dateRange.start).toUTC().toISODate()
    const toDate = DateTime.fromISO(dateRange.end).toUTC().toISODate()

    const downloadParams = {
      datasets: dataviews.map(({ datasets }) => datasets.join(',')),
      filters: dataviews.map(({ filters }) => transformFilters(filters)),
      'date-range': [fromDate, toDate].join(','),
      format,
      spatialResolution,
      temporalResolution,
      groupBy,
      token: GFWAPI.getToken(),
    }

    const createdDownload = await GFWAPI.fetch<DownloadActivity>(
      `/v1/4wings/report?${stringify(downloadParams, { arrayFormat: 'indices' })}`,
      {
        method: 'POST',
        body: { geojson: geometry } as any,
      }
    )

    return createdDownload
  } catch (e: any) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

const { slice: downloadSlice } = createAsyncSlice<DownloadState, DownloadActivity>({
  name: 'download',
  initialState,
  reducers: {
    resetDownloadStatus: (state) => {
      state.status = AsyncReducerStatus.Idle
    },
    clearDownloadGeometry: (state) => {
      state.area.geometry = undefined
      state.area.name = ''
      state.area.bounds = undefined
      state.status = AsyncReducerStatus.Idle
    },
    setDownloadGeometry: (
      state,
      action: PayloadAction<{
        geometry: DownloadGeometry | undefined
        value: string
        bounds: [number, number, number, number]
      }>
    ) => {
      state.area.geometry = action.payload.geometry
      state.area.bounds = action.payload.bounds
      state.area.name = action.payload.value
    },
  },
  thunks: {
    createThunk: createDownloadThunk,
  },
})

export const { resetDownloadStatus, clearDownloadGeometry, setDownloadGeometry } =
  downloadSlice.actions

export const selectDownloadGeometry = (state: RootState) => state.download.area.geometry
export const selectDownloadBounds = (state: RootState) => state.download.area.bounds
export const selectDownloadAreaName = (state: RootState) => state.download.area.name
export const selectDownloadAreaId = (state: RootState) => state.download.area.id
export const selectDownloadStatus = (state: RootState) => state.download.status

export default downloadSlice.reducer
