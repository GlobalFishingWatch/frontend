import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { stringify } from 'qs'
import { GFWAPI, ParsedAPIError, parseAPIError } from '@globalfishingwatch/api-client'
import { Dataset, DatasetTypes, Vessel } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  fetchDatasetByIdThunk,
  fetchDatasetsByIdsThunk,
  selectDatasetById,
} from 'features/datasets/datasets.slice'
import { getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { VesselInstanceDatasets } from 'features/dataviews/dataviews.utils'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { TEMPLATE_VESSEL_DATAVIEW_SLUG } from 'data/workspaces'

export const DEFAULT_VESSEL_DATASET_ID = 'public-global-all-vessels:latest'

interface VesselState {
  info: {
    status: AsyncReducerStatus
    data: (Vessel & VesselInstanceDatasets) | null
    error: ParsedAPIError | null
  }
}

const initialState: VesselState = {
  info: {
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
    { dispatch, rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as any
      const action = await dispatch(fetchDatasetByIdThunk(datasetId))
      const dataset = action.payload as Dataset
      // Datasets and dataview needed to mock follow the structure of the map and resolve the generators
      dispatch(fetchDataviewsByIdsThunk([TEMPLATE_VESSEL_DATAVIEW_SLUG]))
      const trackDatasetId = getRelatedDatasetsByType(dataset, DatasetTypes.Tracks)?.[0]?.id || ''
      const eventsDatasetsId =
        getRelatedDatasetsByType(dataset, DatasetTypes.Events)?.map((d) => d.id) || []
      // When coming from workspace url datasets are already loaded so no need to fetch again
      const datasetsToFetch = [trackDatasetId, ...eventsDatasetsId].flatMap((id) => {
        return selectDatasetById(id)(state) ? [] : [id]
      })
      dispatch(fetchDatasetsByIdsThunk(datasetsToFetch))
      const vessel = await GFWAPI.fetch<Vessel>(
        `/vessels/${vesselId}?${stringify({ datasets: [datasetId] })}`
      )
      return {
        ...vessel,
        trackDatasetId,
        eventsDatasetsId,
        firstTransmissionDate: vessel?.firstTransmissionDate || '',
        // Make sure to have the lastest in the first position
        vesselRegistryInfo:
          vessel?.vesselRegistryInfo?.sort(
            (a, b) => Number(b.latestVesselInfo) - Number(a.latestVesselInfo)
          ) || [],
      }
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

export default vesselSlice.reducer
