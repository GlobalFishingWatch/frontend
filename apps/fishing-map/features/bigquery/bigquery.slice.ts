import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { kebabCase } from 'lodash'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { fetchDatasetByIdThunk } from 'features/datasets/datasets.slice'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'utils/async-slice'
import { API_VERSION } from 'data/config'

export type BigQueryVisualisation = '4wings' | 'events'

export type RunCostResponse = {
  totalBytes: number
  totalBytesPretty: string
}

export type CreateBigQueryDataset = {
  query: string
  visualisationMode: BigQueryVisualisation
  name: string
  ttl?: number
  createAsPublic?: boolean
}

export const fetchBigQueryRunCostThunk = createAsyncThunk(
  'bigQuery/fetchRunCost',
  async (
    { query, visualisationMode }: Omit<CreateBigQueryDataset, 'name'>,
    { rejectWithValue }
  ) => {
    try {
      const response = await GFWAPI.fetch<RunCostResponse>(
        `/${API_VERSION}/${visualisationMode}/bq/create-temporal-dataset?dryRun=true`,
        {
          method: 'POST',
          body: {
            name: 'Calculating cost using dryRun',
            public: true,
            // ttl: 1, // days
            query,
          } as any,
        }
      )
      return response
    } catch (e: any) {
      return rejectWithValue({
        status: e.status || e.code,
        message: e.message,
        messages: e.messages,
      })
    }
  }
)

export type CreateBigQueryDatasetResponse = {
  id: string
  startDate: string
  endDate: string
  tableRows: number
}

export const createBigQueryDatasetThunk = createAsyncThunk(
  'bigQuery/createDataset',
  async (
    { query, name, createAsPublic = true, visualisationMode }: CreateBigQueryDataset,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { id } = await GFWAPI.fetch<CreateBigQueryDatasetResponse>(
        `/${API_VERSION}/${visualisationMode}/bq/create-temporal-dataset`,
        {
          method: 'POST',
          body: { query, name: kebabCase(name), public: createAsPublic } as any,
        }
      )
      const dataset = await dispatch(fetchDatasetByIdThunk(id))
      return dataset
    } catch (e: any) {
      return rejectWithValue({
        status: e.status || e.code,
        message: e.message,
        messages: e.messages,
      })
    }
  }
)

interface BigQueryState {
  active: boolean
  creationStatus: AsyncReducerStatus
  runCostStatus: AsyncReducerStatus
  runCost: RunCostResponse | null
}

const initialState: BigQueryState = {
  active: false,
  creationStatus: AsyncReducerStatus.Idle,
  runCostStatus: AsyncReducerStatus.Idle,
  runCost: null,
}

const bigQuerySlice = createSlice({
  name: 'bigQuery',
  initialState,
  reducers: {
    toggleBigQueryMenu: (state) => {
      state.active = !state.active
      state.runCostStatus = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBigQueryRunCostThunk.pending, (state, action) => {
      state.runCostStatus = AsyncReducerStatus.Loading
      state.runCost = null
    })
    builder.addCase(fetchBigQueryRunCostThunk.fulfilled, (state, action) => {
      state.runCostStatus = AsyncReducerStatus.Finished
      state.runCost = action.payload as RunCostResponse
    })
    builder.addCase(fetchBigQueryRunCostThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.runCostStatus = AsyncReducerStatus.Idle
      } else {
        state.runCostStatus = AsyncReducerStatus.Error
      }
    })
    builder.addCase(createBigQueryDatasetThunk.pending, (state, action) => {
      state.creationStatus = AsyncReducerStatus.Loading
    })
    builder.addCase(createBigQueryDatasetThunk.fulfilled, (state, action) => {
      state.creationStatus = AsyncReducerStatus.Finished
    })
    builder.addCase(createBigQueryDatasetThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.creationStatus = AsyncReducerStatus.Idle
      } else {
        state.creationStatus = AsyncReducerStatus.Error
      }
    })
  },
})

export const { toggleBigQueryMenu } = bigQuerySlice.actions

export const selectBigQueryActive = (state: RootState) => state.bigQuery.active
export const selectRunCost = (state: RootState) => state.bigQuery.runCost
export const selectRunCostStatus = (state: RootState) => state.bigQuery.runCostStatus
export const selectCreationStatus = (state: RootState) => state.bigQuery.creationStatus

export default bigQuerySlice.reducer
