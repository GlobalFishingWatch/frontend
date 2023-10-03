import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { saveAs } from 'file-saver'
import { RootState } from 'reducers'
import { DownloadRateLimit, ThinningConfig } from '@globalfishingwatch/api-types'
import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { DateRange } from 'features/download/downloadActivity.slice'
import { getUTCDateTime } from 'utils/dates'
import { logoutUserThunk } from 'features/user/user.slice'
import { Format } from './downloadTrack.config'

type VesselParams = {
  name: string
  id: string
  datasets: string
}

export interface DownloadTrackState {
  name: string
  id: string
  datasets: string
  status: AsyncReducerStatus
  error: AsyncError | null
  rateLimit: DownloadRateLimit
}

const initialState: DownloadTrackState = {
  name: '',
  id: '',
  datasets: '',
  status: AsyncReducerStatus.Idle,
  error: null,
  rateLimit: {} as DownloadRateLimit,
}

export type DownloadTrackParams = {
  vesselId: string
  vesselName: string
  dateRange: DateRange
  datasets: string
  format: Format
  thinning?: ThinningConfig
}

const parseRateLimit = (response: Response) => {
  return {
    remaining: parseInt(response.headers.get('Ratelimit-Remaining') || ''),
    limit: parseInt(response.headers.get('Ratelimit-Limit') || '10'),
    retryAfter: parseInt(response.headers.get('Retry-After') || '0'),
    reset: response.headers.get('Ratelimit-Reset'),
  } as DownloadRateLimit
}

type RejectValueType = { error: AsyncError; rateLimit?: DownloadRateLimit }
export const downloadTrackThunk = createAsyncThunk<
  DownloadRateLimit,
  DownloadTrackParams,
  {
    rejectValue: RejectValueType
  }
>('downloadTrack/create', async (params: DownloadTrackParams, { rejectWithValue }) => {
  try {
    const { dateRange, datasets, format, vesselId, vesselName, thinning } = params
    const fromDate = getUTCDateTime(dateRange.start).toString()
    const toDate = getUTCDateTime(dateRange.end).toString()
    const downloadTrackParams = {
      'start-date': fromDate,
      'end-date': toDate,
      datasets,
      format,
      ...(thinning && { ...thinning }),
    }

    const fileName = `${vesselName || vesselId} - ${downloadTrackParams['start-date']},${
      downloadTrackParams['end-date']
    }.zip`
    const rateLimit = await GFWAPI.fetch<Response>(
      `/vessels/${vesselId}/tracks/download?${stringify(downloadTrackParams)}`,
      {
        method: 'GET',
        cache: 'reload',
        responseType: 'default',
      }
    ).then(async (response) => {
      const rateLimit = parseRateLimit(response)
      const blob = await response.blob()
      saveAs(blob as any, fileName)

      return rateLimit
    })
    return rateLimit
  } catch (e: any) {
    const rateLimit = parseRateLimit(e)
    return rejectWithValue({ error: parseAPIError(e), rateLimit })
  }
})

const downloadTrackSlice = createSlice({
  name: 'downloadTrack',
  initialState,
  reducers: {
    resetDownloadTrackStatus: (state) => {
      state.status = AsyncReducerStatus.Idle
      state.error = null
    },
    clearDownloadTrackVessel: (state) => {
      state.id = ''
      state.name = ''
      state.datasets = ''
      state.status = AsyncReducerStatus.Idle
    },
    setDownloadTrackVessel: (state, action: PayloadAction<VesselParams>) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.datasets = action.payload.datasets
    },
  },
  extraReducers: (builder) => {
    builder.addCase(downloadTrackThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
      state.error = null
    })
    builder.addCase(downloadTrackThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.rateLimit = action.payload
    })
    builder.addCase(downloadTrackThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.status = AsyncReducerStatus.Aborted
      } else {
        state.status = AsyncReducerStatus.Error
        const { error, rateLimit } = action.payload as RejectValueType
        state.error = error
        if (rateLimit) {
          state.rateLimit = rateLimit
        }
      }
    })
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.error = null
      state.rateLimit = {} as DownloadRateLimit
    })
  },
})

export const { resetDownloadTrackStatus, clearDownloadTrackVessel, setDownloadTrackVessel } =
  downloadTrackSlice.actions

export const selectDownloadTrackId = (state: RootState) => state.downloadTrack.id
export const selectDownloadTrackName = (state: RootState) => state.downloadTrack.name
export const selectDownloadTrackDataset = (state: RootState) => state.downloadTrack.datasets
export const selectDownloadTrackStatus = (state: RootState) => state.downloadTrack.status
export const selectDownloadTrackError = (state: RootState) => state.downloadTrack.error
export const selectDownloadTrackRateLimit = (state: RootState) => state.downloadTrack.rateLimit

export default downloadTrackSlice.reducer
