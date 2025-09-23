import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { kebabCase } from 'es-toolkit'
import type { RootState } from 'reducers'

import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import type { RelatedDataset } from '@globalfishingwatch/api-types'

import { fetchDatasetByIdThunk } from 'features/datasets/datasets.slice'
import { AsyncReducerStatus } from 'utils/async-slice'

export type BigQueryVisualisation = '4wings' | 'events'

type RunCostResponse = {
  totalBytes: number
  totalBytesPretty: string
}

export type CreateBigQueryDataset = {
  query: string
  visualisationMode: BigQueryVisualisation | null
  relatedDatasets?: RelatedDataset[]
  name: string
  unit?: string
  ttl?: number
  createAsPublic?: boolean
}

export const fetchBigQueryRunCostThunk = createAsyncThunk(
  'bigQuery/fetchRunCost',
  async ({ query }: Pick<CreateBigQueryDataset, 'query'>, { rejectWithValue }) => {
    try {
      const response = await GFWAPI.fetch<RunCostResponse>(
        `/4wings/bq/create-temporal-dataset?dry-run=true`,
        {
          method: 'POST',
          body: {
            name: 'Calculating cost using dry-run',
            public: true,
            unit: 'dry-run',
            subcategory: 'bigquery',
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
    {
      query,
      name,
      unit,
      createAsPublic = true,
      ttl,
      relatedDatasets = [],
      visualisationMode,
    }: CreateBigQueryDataset,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const hasUserInteraction = query.includes('vessel_id')
      const subcategory = hasUserInteraction ? 'user-interactive' : 'user'
      const { id } = await GFWAPI.fetch<CreateBigQueryDatasetResponse>(
        `/4wings/bq/create-temporal-dataset`,
        {
          method: 'POST',
          body: {
            query,
            name: kebabCase(name),
            unit: unit || (visualisationMode === '4wings' ? '' : 'event'),
            category: visualisationMode === '4wings' ? 'activity' : 'event',
            subcategory,
            relatedDatasets,
            ...(ttl !== undefined && { ttl }),
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

export type BigQueryMode = 'default' | 'turning-tides'
interface BigQueryState {
  mode: BigQueryMode
  active: boolean
  creationStatus: AsyncReducerStatus
  runCostStatus: AsyncReducerStatus
  runCost: RunCostResponse | null
}

const initialState: BigQueryState = {
  mode: 'default',
  active: false,
  creationStatus: AsyncReducerStatus.Idle,
  runCostStatus: AsyncReducerStatus.Idle,
  runCost: null,
}

const bigQuerySlice = createSlice({
  name: 'bigQuery',
  initialState,
  reducers: {
    toggleBigQueryModal: (state) => {
      state.active = !state.active
      state.mode = 'default'
      if (!state.active) {
        state.runCostStatus = AsyncReducerStatus.Idle
      }
    },
    toggleTurningTidesModal: (state) => {
      state.active = !state.active
      state.mode = 'turning-tides'
      if (!state.active) {
        state.runCostStatus = AsyncReducerStatus.Idle
      }
    },
    setBigQueryMode: (state, action: PayloadAction<{ mode?: BigQueryMode; active?: boolean }>) => {
      state.mode = action.payload.mode ?? state.mode
      state.active = action.payload.active ?? state.active
      if (!state.active) {
        state.runCostStatus = AsyncReducerStatus.Idle
      }
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

export const { setBigQueryMode, toggleBigQueryModal, toggleTurningTidesModal } =
  bigQuerySlice.actions

export const selectBigQueryActive = (state: RootState) =>
  state.bigQuery.active && state.bigQuery.mode === 'default'
export const selectTurningTidesActive = (state: RootState) =>
  state.bigQuery.active && state.bigQuery.mode === 'turning-tides'
export const selectRunCost = (state: RootState) => state.bigQuery.runCost
export const selectRunCostStatus = (state: RootState) => state.bigQuery.runCostStatus
export const selectCreationStatus = (state: RootState) => state.bigQuery.creationStatus

export default bigQuerySlice.reducer
