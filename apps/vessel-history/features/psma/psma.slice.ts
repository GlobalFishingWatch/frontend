import { createAsyncThunk } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import { stringify } from 'qs'
import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import { APIPagination } from '@globalfishingwatch/api-types'
import {
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { RootState } from 'features/app/app.hooks'
import { Psma } from 'types/psma'
import { API_VERSION, DEFAULT_PAGINATION_PARAMS } from 'data/config'

export type PsmaState = AsyncReducer<Psma>

const initialState: PsmaState = {
  ...asyncInitialState,
}

export const fetchPsmaThunk = createAsyncThunk(
  'psma/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const queryParams = {
        ...DEFAULT_PAGINATION_PARAMS,
      }
      const psmaResult = await GFWAPI.fetch<APIPagination<Psma>>(
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
