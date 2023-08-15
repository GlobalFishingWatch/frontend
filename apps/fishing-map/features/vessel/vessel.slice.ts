import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { GFWAPI, ParsedAPIError, parseAPIError } from '@globalfishingwatch/api-client'
import {
  Dataset,
  DatasetTypes,
  EndpointId,
  IdentityVessel,
  SelfReportedInfo,
  VesselRegistryInfo,
} from '@globalfishingwatch/api-types'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  fetchDatasetByIdThunk,
  fetchDatasetsByIdsThunk,
  selectDatasetById,
} from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType, getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { VesselInstanceDatasets } from 'features/dataviews/dataviews.utils'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { PROFILE_DATAVIEW_SLUGS } from 'data/workspaces'
import { VesselIdentitySourceEnum } from 'features/search/search.config'
import { getVesselIdentities, getVesselProperty } from 'features/vessel/vessel.utils'
import { selectVesselId } from 'routes/routes.selectors'
// import { TEMPLATE_VESSEL_DATAVIEW_SLUG } from 'data/workspaces'

export type VesselDataIdentity = (SelfReportedInfo | VesselRegistryInfo) & {
  identitySource: VesselIdentitySourceEnum
  messagesCounter?: number
}
// Merges and plain all the identities of a vessel
export type IdentityVesselData = {
  id: string
  identities: VesselDataIdentity[]
  dataset: Dataset
} & VesselInstanceDatasets &
  Pick<IdentityVessel, 'registryOwners' | 'registryAuthorizations'>

type VesselInfoEntry = {
  status: AsyncReducerStatus
  data: IdentityVesselData | null
  error: ParsedAPIError | null
}
type VesselInfoState = Record<string, VesselInfoEntry>

type VesselState = { printMode: boolean } | VesselInfoState

const initialState: VesselState = {
  printMode: false,
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
      if (fetchDatasetByIdThunk.fulfilled.match(action)) {
        const dataset = action.payload as Dataset
        // Datasets and dataview needed to mock follow the structure of the map and resolve the generators
        dispatch(fetchDataviewsByIdsThunk(PROFILE_DATAVIEW_SLUGS))
        const trackDatasetId = getRelatedDatasetByType(dataset, DatasetTypes.Tracks)?.id || ''
        const eventsDatasetsId =
          getRelatedDatasetsByType(dataset, DatasetTypes.Events)?.map((d) => d.id) || []
        // When coming from workspace url datasets are already loaded so no need to fetch again
        const datasetsToFetch = [trackDatasetId, ...eventsDatasetsId].flatMap((id) => {
          return selectDatasetById(id)(state) ? [] : [id]
        })
        dispatch(fetchDatasetsByIdsThunk(datasetsToFetch))

        const datasetConfig = {
          endpoint: EndpointId.Vessel,
          datasetId: dataset.id,
          params: [{ id: 'vesselId', value: vesselId }],
          query: [
            // { id: 'match-fields', value: 'SEVERAL_FIELDS' },
            {
              id: 'includes',
              value: ['POTENTIAL_RELATED_SELF_REPORTED_INFO'],
            },
            {
              id: 'datasets',
              value: [datasetId],
            },
          ],
        }
        const url = resolveEndpoint(dataset, datasetConfig)
        if (!url) {
          return rejectWithValue({ message: 'Error resolving endpoint' })
        }
        const vessel = await GFWAPI.fetch<IdentityVessel>(url)
        const identities = getVesselIdentities(vessel).filter(
          // TODO remove once the match-fields works in the API
          (i) =>
            i.identitySource === VesselIdentitySourceEnum.SelfReported
              ? i.matchFields === 'SEVERAL_FIELDS'
              : true
        )
        return {
          id: getVesselProperty(vessel, 'id'),
          dataset: dataset,
          registryOwners: vessel.registryOwners,
          registryAuthorizations: vessel.registryAuthorizations,
          info: datasetId,
          track: trackDatasetId,
          events: eventsDatasetsId,
          identities,
        } as IdentityVesselData
      } else {
        return rejectWithValue(action.payload)
      }
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (params, { getState }) => {
      const { vessel } = getState() as VesselSliceState
      return vessel?.[params?.vesselId as string]?.status !== AsyncReducerStatus.Loading
    },
  }
)

const vesselSlice = createSlice({
  name: 'vessel',
  initialState,
  reducers: {
    setVesselPrintMode: (state, action: PayloadAction<boolean>) => {
      state.printMode = action.payload
    },
    resetVesselState: () => {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVesselInfoThunk.pending, (state, action) => {
      const vesselId = action.meta?.arg?.vesselId as string
      state[vesselId] = {
        status: AsyncReducerStatus.Loading,
        data: null,
        error: null,
      }
    })
    builder.addCase(fetchVesselInfoThunk.fulfilled, (state, action) => {
      const vesselId = action.meta?.arg?.vesselId as string
      state[vesselId].status = AsyncReducerStatus.Finished
      state[vesselId].data = {
        ...action.payload,
        id: vesselId,
      }
    })
    builder.addCase(fetchVesselInfoThunk.rejected, (state, action) => {
      const vesselId = action.meta?.arg?.vesselId as string
      if (action.error.message === 'Aborted') {
        state[vesselId].status = AsyncReducerStatus.Idle
      } else {
        state[vesselId].status = AsyncReducerStatus.Error
        state[vesselId].error = action.payload as ParsedAPIError
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

export const { setVesselPrintMode, resetVesselState } = vesselSlice.actions

export const selectVessel = (state: VesselSliceState) => {
  const vesselId = selectVesselId(state as any) as string
  return state.vessel[vesselId] as VesselInfoEntry
}
export const selectVesselInfoData = createSelector(
  [selectVessel],
  (vessel) => vessel?.data as IdentityVesselData
)
export const selectVesselInfoDataId = createSelector([selectVessel], (vessel) => vessel?.data?.id)
export const selectSelfReportedVesselIds = createSelector([selectVessel], (vessel) =>
  vessel?.data?.identities
    ?.filter((i) => i.identitySource === VesselIdentitySourceEnum.SelfReported)
    .map((i) => i.id)
)
export const selectVesselInfoStatus = createSelector([selectVessel], (vessel) => vessel?.status)
export const selectVesselInfoError = createSelector([selectVessel], (vessel) => vessel?.error)
export const selectVesselPrintMode = (state: VesselSliceState) => state.vessel.printMode

export default vesselSlice.reducer
