import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import {
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { RootState } from 'store'
import { Indicator } from 'types/risk-indicator'
import { selectEventDatasetsConfigQueryParams } from 'features/dataviews/dataviews.selectors'
import { NOT_AVAILABLE } from 'features/vessels/vessels.utils'

export type IndicatorState = AsyncReducer<Indicator>

const initialState: IndicatorState = {
  ...asyncInitialState,
}

type FetchIds = {
  vesselId: string
  datasetId: string
  tmtId: string
}

export const getMergedVesselsUniqueId = (idData: FetchIds[]) => {
  return idData
    .map((v) => [v.datasetId, v.vesselId].join('|'))
    .sort((a, b) => (a < b ? -1 : 1))
    .join(',')
}
export const parseMergedVesselsUniqueId = (id: string): FetchIds[] =>
  id.split(',').map((x) => {
    const [datasetId, vesselId, tmtId] = x.split('|')
    return { datasetId, vesselId, tmtId }
  })
export const fetchIndicatorsByIdThunk = createAsyncThunk(
  'indicators/fetchById',
  async (idData: FetchIds[], { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const queryParams = selectEventDatasetsConfigQueryParams(state)
      const query = queryParams
        .map((query) => `${query.id}=${encodeURIComponent(query.value)}`)
        .join('&')
      const indicator = await GFWAPI.fetch<Indicator>(`/prototype/vessels/indicators?${query}`, {
        method: 'POST',
          body: idData.map(({ datasetId, vesselId, tmtId: vesselHistoryId }) => ({
              ...(datasetId !== NOT_AVAILABLE && { datasetId }),
              ...(vesselId !== NOT_AVAILABLE && { vesselId }),
              ...(vesselHistoryId !== NOT_AVAILABLE && { vesselHistoryId }),
          })) as any,
        version: '',
      })
      indicator.id = getMergedVesselsUniqueId(idData)
      return indicator
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (idData: FetchIds[], { getState, extra }) => {
      const state = getState() as RootState
      const indicators = selectById(state, getMergedVesselsUniqueId(idData))
      const fetchStatus = selectIndicatorsStatus(state)
      if (indicators !== undefined || fetchStatus === AsyncReducerStatus.LoadingItem) {
        // Already fetched or in progress, don't need to re-fetch
        return false
      }
      return true
    },
  }
)

const { slice: indicatorSlice, entityAdapter } = createAsyncSlice<IndicatorState, Indicator>({
  name: 'indicators',
  initialState,
  thunks: {
    fetchByIdThunk: fetchIndicatorsByIdThunk,
  },
})

export const { selectById, selectIds } = entityAdapter.getSelectors<RootState>(
  (state) => state.indicators
)

export const selectIndicatorById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => {
    return selectById(state, id)
  })
)
export const selectIndicatorsStatus = (state: RootState) => state.indicators.status
export const selectIndicators = (state: RootState) => state.indicators.entities
export const indicatorEntityAdapter = entityAdapter
export default indicatorSlice.reducer
