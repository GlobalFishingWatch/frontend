import { createAsyncThunk } from '@reduxjs/toolkit'
import { GFWApiClient } from 'http-client/http-client'
import { uniqBy } from 'lodash'
import { stringify } from 'qs'
import type { RootState } from 'store'

import { parseAPIError } from '@globalfishingwatch/api-client'
import type { APIPagination } from '@globalfishingwatch/api-types'

import { DEFAULT_PAGINATION_PARAMS, IS_STANDALONE_APP } from 'data/config'
import type { Psma } from 'types/psma'
import type {
  AsyncReducer} from 'utils/async-slice';
import {
  asyncInitialState,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'

export type PsmaState = AsyncReducer<Psma>

const initialState: PsmaState = {
  ...asyncInitialState,
}

export const fetchPsmaThunk = createAsyncThunk(
  'psma/fetch',
  async (_, { rejectWithValue }) => {
    try {
      if (IS_STANDALONE_APP) {
        // TODO: we should add the psma to the available endpoints
        return []
      }
      const queryParams = {
        ...DEFAULT_PAGINATION_PARAMS,
      }
      const psmaResult = await GFWApiClient.fetch<APIPagination<Psma>>(
        `/psma-countries?${stringify(queryParams, { arrayFormat: 'comma' })}`
      )
      const psma = uniqBy(psmaResult.entries, 'iso3')
      return psma.map((item) => ({ ...item, id: item.iso3 })) as Psma[]
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (_, { getState, extra }) => {
      const { psma } = getState() as RootState
      const fetchStatus = psma.status
      if (
        fetchStatus === AsyncReducerStatus.Finished ||
        fetchStatus === AsyncReducerStatus.Loading
      ) {
        // Already fetched or in progress, don't need to re-fetch
        return false
      }
      return true
    },
  }
)

const { slice: psmaSlice, entityAdapter } = createAsyncSlice<PsmaState, Psma>({
  name: 'psma',
  initialState,
  thunks: {
    fetchThunk: fetchPsmaThunk,
  },
})

export const { selectById, selectIds } = entityAdapter.getSelectors<RootState>(
  (state) => state.psma
)

export const psmaEntityAdapter = entityAdapter
export default psmaSlice.reducer
