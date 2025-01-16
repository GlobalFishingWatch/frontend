import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { GFWApiClient } from 'http-client/http-client'
import { memoize } from 'lodash'
import type { RootState } from 'store'
import { v5 as uuidv5 } from 'uuid'

import { parseAPIError } from '@globalfishingwatch/api-client'

import { selectEventDatasetsConfigQueryParams } from 'features/dataviews/dataviews.selectors'
import { NOT_AVAILABLE } from 'features/vessels/vessels.utils'
import type { Indicator, IndicatorType } from 'types/risk-indicator'
import type {
  AsyncReducer} from 'utils/async-slice';
import {
  asyncInitialState,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'

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
    .map((v) => [v.datasetId, v.vesselId, v.tmtId].join('|'))
    .sort((a, b) => (a < b ? -1 : 1))
    .join(',')
}
export const parseMergedVesselsUniqueId = (id: string): FetchIds[] =>
  id.split(',').map((x) => {
    const [datasetId, vesselId, tmtId] = x.split('|')
    return { datasetId, vesselId, tmtId }
  })

type ThunkParameters = {
  idData: FetchIds[]
  indicator: IndicatorType
}
const indicatorsIdGenerator = (args: ThunkParameters) =>
  args.indicator + '-' + uuidv5(`${getMergedVesselsUniqueId(args.idData)}`, uuidv5.DNS)

const mapIndicatorToResponseKey = {
  coverage: 'coverage',
  encounter: 'encounters',
  fishing: 'fishing',
  gap: 'gaps',
  'port-visit': 'portVisits',
  'vessel-identity': 'vesselIdentity',
}

export const fetchIndicatorsByIdThunk = createAsyncThunk(
  'indicators/fetchById',
  async (params: ThunkParameters, { getState, rejectWithValue }) => {
    const { idData, indicator } = params
    try {
      const state = getState() as RootState
      const queryParams = selectEventDatasetsConfigQueryParams(state)
      const query = queryParams
        .map((query) => `${query.id}=${encodeURIComponent(query.value)}`)
        .join('&')

      const result = await GFWApiClient.fetch<Indicator>(
        `/prototype/vessels/indicators?includes=${indicator}&${query}`,
        {
          method: 'POST',
          body: idData.map(({ datasetId, vesselId, tmtId: vesselHistoryId }) => ({
            ...(datasetId !== NOT_AVAILABLE && { datasetId }),
            ...(vesselId !== NOT_AVAILABLE && { vesselId }),
            ...(vesselHistoryId !== NOT_AVAILABLE && { vesselHistoryId }),
          })) as any,
          version: '',
        }
      )

      result.id = getMergedVesselsUniqueId(idData)
      return result
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    idGenerator: indicatorsIdGenerator,
    condition: (params: ThunkParameters, { getState, extra }) => {
      const { idData, indicator } = params
      const state = getState() as RootState
      const mergedVesselsUniqueId = getMergedVesselsUniqueId(idData)
      const indicators = selectById(state, mergedVesselsUniqueId)
      const fetchStatus = selectIndicatorsStatus(state)
      const requestId = indicatorsIdGenerator(params)
      const sameRequestIsInProgress =
        fetchStatus === AsyncReducerStatus.LoadingItem &&
        state.indicators.currentRequestIds.includes(requestId)

      const responseKey = mapIndicatorToResponseKey[indicator]
      if (
        (indicators !== undefined && indicators[responseKey] !== undefined) ||
        sameRequestIsInProgress
      ) {
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
export const selectIndicatorsRequests = (state: RootState) => state.indicators.currentRequestIds
export const indicatorEntityAdapter = entityAdapter
export default indicatorSlice.reducer
