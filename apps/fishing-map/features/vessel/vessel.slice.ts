import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { stringify } from 'qs'
import { GFWAPI, ParsedAPIError, parseAPIError } from '@globalfishingwatch/api-client'
import {
  APIPagination,
  ApiEvent,
  Dataset,
  DatasetTypes,
  EventType,
  Vessel,
} from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { fetchDatasetByIdThunk, selectDatasetById } from 'features/datasets/datasets.slice'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { DEFAULT_PAGINATION_PARAMS } from 'data/config'
import { EVENTS_CONFIG_BY_EVENT_TYPE } from 'features/vessel/vessel.config'

export const DEFAULT_VESSEL_DATASET_ID = 'public-global-all-vessels:latest'

interface VesselState {
  info: {
    status: AsyncReducerStatus
    data: Vessel | null
    error: ParsedAPIError | null
  }
  events: {
    status: AsyncReducerStatus
    data: ApiEvent[] | null
    error: ParsedAPIError | null
  }
}

const initialState: VesselState = {
  info: {
    status: AsyncReducerStatus.Idle,
    data: null,
    error: null,
  },
  events: {
    status: AsyncReducerStatus.Idle,
    data: null,
    error: null,
  },
}

type VesselSliceState = { vessel: VesselState }

type FetchVesselThunkParams = { vesselId: string; datasetId: string }
export const fetchVesselInfoThunk = createAsyncThunk(
  'vessel/fetchInfo',
  async (
    { vesselId, datasetId }: FetchVesselThunkParams = {} as FetchVesselThunkParams,
    { rejectWithValue }
  ) => {
    try {
      const vessel = await GFWAPI.fetch<Vessel>(
        `/vessels/${vesselId}?${stringify({ datasets: [datasetId] })}`
      )
      return vessel
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (params, { getState }) => {
      const { vessel } = getState() as VesselSliceState
      return vessel.info?.status !== AsyncReducerStatus.Loading
    },
  }
)

export async function getEventsBodyFromVesselDataset(dataset: Dataset, vesselId: string) {
  const eventsDatasetIds = getRelatedDatasetsByType(dataset, DatasetTypes.Events)?.map((e) => e.id)
  const eventDatasetsParams = {
    ids: eventsDatasetIds?.join(','),
    ...DEFAULT_PAGINATION_PARAMS,
  }
  const eventsDatasets = await GFWAPI.fetch<APIPagination<Dataset>>(
    `/datasets?${stringify(eventDatasetsParams)}`
  ).then((res) => res.entries)
  return eventsDatasets?.map((eventDataset) => {
    const { params, includes } =
      EVENTS_CONFIG_BY_EVENT_TYPE[eventDataset.subcategory as EventType] || {}
    const eventsParams = {
      vessels: [vesselId],
      datasets: [eventDataset.id],
      includes,
      ...params,
    }
    return eventsParams
  })
}

type FetchVesselEventsThunkParams = { vesselId: string; datasetId: string }
export const fetchVesselEventsThunk = createAsyncThunk(
  'vessel/fetchEvents',
  async (
    { datasetId, vesselId }: FetchVesselEventsThunkParams = {} as FetchVesselThunkParams,
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      let dataset = selectDatasetById(datasetId)(getState() as any)
      if (!dataset) {
        const action = await dispatch(fetchDatasetByIdThunk(datasetId))
        if (fetchDatasetByIdThunk.fulfilled.match(action)) {
          dataset = action.payload
        }
      }
      const eventsBody = await getEventsBodyFromVesselDataset(dataset, vesselId)
      const eventPromises = await Promise.allSettled(
        eventsBody?.map((body) => {
          return GFWAPI.fetch<APIPagination<ApiEvent>, typeof body>(
            `/events?${stringify(DEFAULT_PAGINATION_PARAMS)}`,
            {
              method: 'POST',
              body,
            }
          )
        })
      )
      return eventPromises.flatMap((res) => {
        return res.status === 'fulfilled' ? res.value.entries : []
      })
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (params, { getState }) => {
      const { vessel } = getState() as VesselSliceState
      return vessel.events?.status !== AsyncReducerStatus.Loading
    },
  }
)

const vesselSlice = createSlice({
  name: 'vessel',
  initialState,
  reducers: {
    resetVesselState: () => {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVesselInfoThunk.pending, (state) => {
      state.info.status = AsyncReducerStatus.Loading
      state.info.error = null
    })
    builder.addCase(fetchVesselInfoThunk.fulfilled, (state, action) => {
      state.info.status = AsyncReducerStatus.Finished
      state.info.data = action.payload
    })
    builder.addCase(fetchVesselInfoThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.info.status = AsyncReducerStatus.Idle
      } else {
        state.info.status = AsyncReducerStatus.Error
        state.info.error = action.payload as ParsedAPIError
      }
    })
    builder.addCase(fetchVesselEventsThunk.pending, (state) => {
      state.events.status = AsyncReducerStatus.Loading
      state.info.error = null
    })
    builder.addCase(fetchVesselEventsThunk.fulfilled, (state, action) => {
      state.events.status = AsyncReducerStatus.Finished
      state.events.data = action.payload
    })
    builder.addCase(fetchVesselEventsThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.events.status = AsyncReducerStatus.Idle
      } else {
        state.events.status = AsyncReducerStatus.Error
        state.events.error = action.payload as ParsedAPIError
      }
    })
    builder.addCase(HYDRATE, (state, action: any) => {
      return {
        ...state,
        ...action.payload.vessel,
      }
    })
  },
})

export const { resetVesselState } = vesselSlice.actions

export const selectVesselInfoData = (state: VesselSliceState) => state.vessel.info.data
export const selectVesselInfoDataId = (state: VesselSliceState) => state.vessel.info.data?.id
export const selectVesselInfoStatus = (state: VesselSliceState) => state.vessel.info.status
export const selectVesselInfoError = (state: VesselSliceState) => state.vessel.info.error
export const selectVesselEventsData = (state: VesselSliceState) => state.vessel.events?.data
export const selectVesselEventsStatus = (state: VesselSliceState) => state.vessel.events?.status
export const selectVesselEventsError = (state: VesselSliceState) => state.vessel.events?.error

export default vesselSlice.reducer
