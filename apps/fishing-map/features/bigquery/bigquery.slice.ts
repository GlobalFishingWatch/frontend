import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import kebabCase from 'lodash/kebabCase'
import type { RootState } from 'reducers'

import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'

import { fetchDatasetByIdThunk } from 'features/datasets/datasets.slice'
import { AsyncReducerStatus } from 'utils/async-slice'

export type BigQueryVisualisation = '4wings' | 'events'

type RunCostResponse = {
  totalBytes: number
  totalBytesPretty: string
}

type CreateBigQueryDataset = {
  query: string
  visualisationMode: BigQueryVisualisation | null
  name: string
  unit?: string
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
        `/${visualisationMode}/bq/create-temporal-dataset?dry-run=true`,
        {
          method: 'POST',
          body: {
            name: 'Calculating cost using dry-run',
            public: true,
            // ttl: 1, // days
            query,
          } as any,
        }
      )
      return response
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  }
)

type CreateBigQueryDatasetResponse = {
  id: string
  startDate: string
  endDate: string
  tableRows: number
}

export const createBigQueryDatasetThunk = createAsyncThunk(
  'bigQuery/createDataset',
  async (
    { query, name, unit, createAsPublic = true, visualisationMode }: CreateBigQueryDataset,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { id } = await GFWAPI.fetch<CreateBigQueryDatasetResponse>(
        `/${visualisationMode}/bq/create-temporal-dataset`,
        {
          method: 'POST',
          body: {
            query,
            name: kebabCase(name),
            ...(unit && { unit }),
            public: createAsPublic,
          } as any,
        }
      )
      const dataset = await dispatch(fetchDatasetByIdThunk(id))
      return dataset
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
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
      state.runCostStatus = AsyncReducerStatus.Idle
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
