import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk,createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import type { RootState } from 'reducers'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import type {
  ApiEvent,
  Dataset,
  GearType,
  IdentityVessel,
  RegistryExtraFields,
  Resource,
  SelfReportedInfo,
  VesselCombinedSourcesInfo,
  VesselRegistryInfo,
  VesselType,
} from '@globalfishingwatch/api-types'
import { DatasetTypes, ResourceStatus , VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { setResource } from '@globalfishingwatch/dataviews-client'

import { PROFILE_DATAVIEW_SLUGS } from 'data/workspaces'
import {
  fetchDatasetByIdThunk,
  fetchDatasetsByIdsThunk,
  selectDatasetById,
} from 'features/datasets/datasets.slice'
import type { VesselInstanceDatasets } from 'features/datasets/datasets.utils'
import { getRelatedDatasetByType, getRelatedDatasetsByType } from 'features/datasets/datasets.utils'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import {
  getVesselDataviewInstance,
  getVesselInfoDataviewInstanceDatasetConfig,
} from 'features/dataviews/dataviews.utils'
import { selectResources } from 'features/resources/resources.slice'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { CACHE_FALSE_PARAM } from 'features/vessel/vessel.config'
import { getVesselIdentities, getVesselProperty } from 'features/vessel/vessel.utils'
import { AsyncReducerStatus } from 'utils/async-slice'

export type VesselDataIdentity = (SelfReportedInfo | VesselRegistryInfo) & {
  identitySource: VesselIdentitySourceEnum
  combinedSourcesInfo?: VesselCombinedSourcesInfo
  positionsCounter?: number
  dataset?: string
  geartypes?: GearType[]
  shiptypes?: VesselType[]
  registrySource?: string
  hasComplianceInfo?: boolean
  iuuStatus?: string
  extraFields?: RegistryExtraFields[]
}
// Merges and plain all the identities of a vessel
export type IdentityVesselData = {
  id: string
  identities: VesselDataIdentity[]
  dataset: Dataset
  datasetId: string
} & VesselInstanceDatasets &
  Pick<
    IdentityVessel,
    | 'registryOwners'
    | 'registryPublicAuthorizations'
    | 'matchCriteria'
    | 'combinedSourcesInfo'
    | 'operator'
  >

type VesselInfoEntry = {
  status: AsyncReducerStatus
  info: IdentityVesselData | null
  events: ApiEvent[] | null
  error: ParsedAPIError | null
}

type VesselInfoState = Record<string, VesselInfoEntry>

type VesselState = {
  fitBoundsOnLoad: boolean
  printMode: boolean
  data: VesselInfoState
}

const initialState: VesselState = {
  fitBoundsOnLoad: true,
  printMode: false,
  data: {},
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
      // TODO: skip dataset fetch if already loaded in the
      // const dataset = selectAllDatasets(state).find((d: Dataset) => d.id === datasetId)
      const action = await dispatch(fetchDatasetByIdThunk(datasetId))
      const guestUser = selectIsGuestUser(state)
      const resources = selectResources(state)
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
        dispatch(fetchDatasetsByIdsThunk({ ids: datasetsToFetch }))

        const datasetConfig = getVesselInfoDataviewInstanceDatasetConfig(vesselId, {
          info: dataset.id,
        })
        if (guestUser) {
          // This changes the order of the query params to avoid the cache
          datasetConfig.query?.push(CACHE_FALSE_PARAM)
        }
        const url = resolveEndpoint(dataset, datasetConfig)

        if (!url) {
          return rejectWithValue({ message: 'Error resolving endpoint' })
        }

        const vessel = resources[url]?.data
          ? (resources[url].data as IdentityVessel)
          : await GFWAPI.fetch<IdentityVessel>(url, {
              cache: 'reload',
            })

        const resource: Resource = {
          url: resolveEndpoint(dataset, datasetConfig) as string,
          dataset: dataset,
          datasetConfig,
          dataviewId: getVesselDataviewInstance({ id: vesselId }, {})?.id,
          data: vessel,
          status: ResourceStatus.Finished,
        }
        dispatch(setResource(resource))

        const allIdentities = getVesselIdentities(vessel)
        const filteredIdentities = allIdentities.filter(
          // TODO remove once the match-fields works in the API
          (i) =>
            i.identitySource === VesselIdentitySourceEnum.SelfReported
              ? i.matchFields === 'SEVERAL_FIELDS'
              : true
        )
        const identities = filteredIdentities.length ? filteredIdentities : allIdentities
        return {
          id: getVesselProperty(vessel, 'id'),
          dataset: dataset,
          datasetId: dataset?.id,
          combinedSourcesInfo: vessel?.combinedSourcesInfo,
          registryOwners: vessel?.registryOwners,
          registryPublicAuthorizations: vessel?.registryPublicAuthorizations,
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
      return vessel.data?.[params?.vesselId as string]?.status !== AsyncReducerStatus.Loading
    },
  }
)

const vesselSlice = createSlice({
  name: 'vessel',
  initialState,
  reducers: {
    setVesselFitBoundsOnLoad: (state, action: PayloadAction<boolean>) => {
      state.fitBoundsOnLoad = action.payload
    },
    setVesselEvents: (state, action: PayloadAction<{ vesselId: string; events: ApiEvent[] }>) => {
      const { vesselId, events } = action.payload || {}
      if (!state.data[vesselId]) {
        state.data[vesselId] = {} as VesselInfoEntry
      }
      state.data[vesselId].events = events
    },
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
      state.data[vesselId] = {
        status: AsyncReducerStatus.Loading,
        info: null,
        error: null,
        events: state.data?.[vesselId]?.events || [],
      }
    })
    builder.addCase(fetchVesselInfoThunk.fulfilled, (state, action) => {
      const vesselId = action.meta?.arg?.vesselId as string
      state.data[vesselId].status = AsyncReducerStatus.Finished
      state.data[vesselId].info = {
        ...action.payload,
        id: vesselId,
      }
    })
    builder.addCase(fetchVesselInfoThunk.rejected, (state, action) => {
      const vesselId = action.meta?.arg?.vesselId as string
      if (state.data[vesselId]) {
        if (action.error.message === 'Aborted') {
          state.data[vesselId].status = AsyncReducerStatus.Idle
        } else {
          state.data[vesselId].status = AsyncReducerStatus.Error
          state.data[vesselId].error = action.payload as ParsedAPIError
        }
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

export const { setVesselFitBoundsOnLoad, setVesselPrintMode, resetVesselState, setVesselEvents } =
  vesselSlice.actions

export const selectVesselSlice = (state: RootState) => state.vessel

export default vesselSlice.reducer
