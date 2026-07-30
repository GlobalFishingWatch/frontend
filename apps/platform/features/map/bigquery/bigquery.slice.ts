import type { WithSlice } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { kebabCase } from 'es-toolkit'

import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import type { RelatedDataset } from '@globalfishingwatch/api-types'

import { fetchDatasetByIdThunk } from 'features/map/datasets/datasets.slice'
import {
  closeBigQueryModal,
  toggleBigQueryModal,
  toggleTurningTidesModal,
} from 'features/modals/modals.slice'
import { rootReducer } from 'reducers'
import { AsyncReducerStatus } from 'utils/async-slice'

export type BigQueryVisualisation = '4wings' | 'events'

type RunCostResponse = {
  totalBytes: number
  totalBytesPretty: string
}

export type CreateBigQueryDataset = {
  query: string
  description?: string
  visualisationMode: BigQueryVisualisation | null
  relatedDatasets?: RelatedDataset[]
  name: string
  unit?: string
  ttl?: number
  createAsPublic?: boolean
  subcategory?: 'user' | 'user-interactive'
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
      description,
      subcategory,
      relatedDatasets = [],
      visualisationMode,
    }: CreateBigQueryDataset,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const hasUserInteraction = query.includes('vessel_id')
      const subcategoryFallback = hasUserInteraction ? 'user-interactive' : 'user'
      const { id } = await GFWAPI.fetch<CreateBigQueryDatasetResponse>(
        `/4wings/bq/create-temporal-dataset`,
        {
          method: 'POST',
          body: {
            query,
            name: kebabCase(name),
            unit: unit || (visualisationMode === '4wings' ? '' : 'event'),
            category: visualisationMode === '4wings' ? 'activity' : 'event',
            subcategory: subcategory || subcategoryFallback,
            relatedDatasets,
            ...(ttl !== undefined && { ttl }),
            ...(description !== undefined && { description }),
            public: createAsPublic,
          } as any,
        }
      )
      const dataset = await dispatch(fetchDatasetByIdThunk({ id }))
      return dataset
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  }
)

interface BigQueryState {
  creationStatus: AsyncReducerStatus
  runCostStatus: AsyncReducerStatus
  runCost: RunCostResponse | null
}

const initialState: BigQueryState = {
  creationStatus: AsyncReducerStatus.Idle,
  runCostStatus: AsyncReducerStatus.Idle,
  runCost: null,
}

const bigQuerySlice = createSlice({
  name: 'bigQuery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /**
     * Whether the modal is open now lives in modals.slice, so this slice can no longer decide "was it
     * just closed?" itself. Resetting on every open/close is equivalent in practice: the status is
     * already Idle whenever the modal opens (the previous close set it), so only the close path can
     * observe a change — which is exactly what the old `if (!state.active)` guard did.
     */
    builder.addMatcher(
      isAnyOf(toggleBigQueryModal, toggleTurningTidesModal, closeBigQueryModal),
      (state) => {
        state.runCostStatus = AsyncReducerStatus.Idle
      }
    )
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

/**
 * Lazily registered — see features/map/map/controls/screenshot.slice.ts for the reference pattern.
 * Importing this module performs the injection, so the chunk that needs the slice registers it.
 *
 * `.selector()` wraps root state in a Proxy that yields `initialState` for a not-yet-registered slice,
 * so a read between inject() and the next dispatched action is safe.
 */
const injectedBigQuerySlice = rootReducer.inject(bigQuerySlice)

declare module 'reducers' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface LazyLoadedSlices extends WithSlice<typeof bigQuerySlice> {}
}

export const selectRunCost = injectedBigQuerySlice.selector((state) => state.bigQuery.runCost)
export const selectRunCostStatus = injectedBigQuerySlice.selector(
  (state) => state.bigQuery.runCostStatus
)
export const selectCreationStatus = injectedBigQuerySlice.selector(
  (state) => state.bigQuery.creationStatus
)

export default bigQuerySlice.reducer
