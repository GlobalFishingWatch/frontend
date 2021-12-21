import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { fetchDatasetByIdThunk } from 'features/datasets/datasets.slice'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'utils/async-slice'

export type RunCostResponse = {
  totalBytes: number
  totalBytesPretty: string
}

export const fetchBigQueryRunCostThunk = createAsyncThunk(
  'bigQuery/fetchRunCost',
  async ({ query }: { query: string }) => {
    const response = await GFWAPI.fetch<RunCostResponse>(
      '/v1/4wings/bq/create-temporal-dataset?dryRun=true',
      {
        method: 'POST',
        body: {
          name: 'Calculating cost using dryRun',
          ttl: 1, // days
          query,
        } as any,
      }
    )
    return response
  }
)

export type CreateBigQueryDataset = {
  query: string
  name: string
  ttl?: number
  createAsPublic?: boolean
}

export type CreateBigQueryDatasetResponse = {
  id: string
  startDate: string
  endDate: string
  tableRows: number
}

export const createBigQueryDatasetThunk = createAsyncThunk(
  'bigQuery/createDataset',
  async ({ query, name, ttl = 30, createAsPublic = true }: CreateBigQueryDataset, { dispatch }) => {
    const { id } = await GFWAPI.fetch<CreateBigQueryDatasetResponse>(
      '/v1/4wings/bq/create-temporal-dataset',
      {
        method: 'POST',
        body: { query, name, ttl, public: createAsPublic } as any,
      }
    )
    const dataset = await dispatch(fetchDatasetByIdThunk(id))
    return dataset
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
      state.runCost = action.payload
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
