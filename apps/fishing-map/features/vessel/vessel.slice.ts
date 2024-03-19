import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { GFWAPI, ParsedAPIError, parseAPIError } from '@globalfishingwatch/api-client'
import {
  Dataset,
  DatasetTypes,
  IdentityVessel,
  Resource,
  ResourceStatus,
  SelfReportedInfo,
  VesselCombinedSourcesInfo,
  VesselRegistryInfo,
} from '@globalfishingwatch/api-types'
import { resolveEndpoint, setResource } from '@globalfishingwatch/dataviews-client'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectResources } from 'features/resources/resources.slice'
import {
  fetchDatasetByIdThunk,
  fetchDatasetsByIdsThunk,
  selectDatasetById,
} from 'features/datasets/datasets.slice'
import {
  VesselInstanceDatasets,
  getRelatedDatasetByType,
  getRelatedDatasetsByType,
} from 'features/datasets/datasets.utils'
import {
  getVesselDataviewInstance,
  getVesselInfoDataviewInstanceDatasetConfig,
} from 'features/dataviews/dataviews.utils'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { PROFILE_DATAVIEW_SLUGS } from 'data/workspaces'
import { getVesselIdentities, getVesselProperty } from 'features/vessel/vessel.utils'
import { selectVesselId } from 'routes/routes.selectors'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'

export const CACHE_FALSE_PARAM = { id: 'cache', value: 'false' }

export type VesselDataIdentity = (SelfReportedInfo | VesselRegistryInfo) & {
  identitySource: VesselIdentitySourceEnum
  combinedSourcesInfo?: VesselCombinedSourcesInfo
  positionsCounter?: number
}
// Merges and plain all the identities of a vessel
export type IdentityVesselData = {
  id: string
  identities: VesselDataIdentity[]
  dataset: Dataset
} & VesselInstanceDatasets &
  Pick<
    IdentityVessel,
    'registryOwners' | 'registryPublicAuthorizations' | 'matchCriteria' | 'combinedSourcesInfo'
  >

type VesselInfoEntry = {
  status: AsyncReducerStatus
  data: IdentityVesselData | null
  error: ParsedAPIError | null
}
type VesselInfoState = Record<string, VesselInfoEntry>

type VesselState =
  | {
      fitBoundsOnLoad: boolean
      printMode: boolean
    }
  | VesselInfoState

const initialState: VesselState = {
  fitBoundsOnLoad: false,
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

        const vessel = resources[url]
          ? (resources[url].data as IdentityVessel)
          : await GFWAPI.fetch<IdentityVessel>(url)

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
          combinedSourcesInfo: vessel.combinedSourcesInfo,
          registryOwners: vessel.registryOwners,
          registryPublicAuthorizations: vessel.registryPublicAuthorizations,
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
      return (vessel as any)?.[params?.vesselId as string]?.status !== AsyncReducerStatus.Loading
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
      ;(state as any)[vesselId] = {
        status: AsyncReducerStatus.Loading,
        data: null,
        error: null,
      }
    })
    builder.addCase(fetchVesselInfoThunk.fulfilled, (state, action) => {
      const vesselId = action.meta?.arg?.vesselId as string
      ;(state as any)[vesselId].status = AsyncReducerStatus.Finished
      ;(state as any)[vesselId].data = {
        ...action.payload,
        id: vesselId,
      }
    })
    builder.addCase(fetchVesselInfoThunk.rejected, (state, action) => {
      const vesselId = action.meta?.arg?.vesselId as string
      if ((state as any)[vesselId]) {
        if (action.error.message === 'Aborted') {
          ;(state as any)[vesselId].status = AsyncReducerStatus.Idle
        } else {
          ;(state as any)[vesselId].status = AsyncReducerStatus.Error
          ;(state as any)[vesselId].error = action.payload as ParsedAPIError
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

export const { setVesselFitBoundsOnLoad, setVesselPrintMode, resetVesselState } =
  vesselSlice.actions

export const selectVessel = (state: VesselSliceState) => {
  const vesselId = selectVesselId(state as any) as string
  return (state as any).vessel[vesselId] as VesselInfoEntry
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
export const selectVesselPrintMode = (state: VesselSliceState) => state.vessel.printMode as boolean
export const selectVesselFitBoundsOnLoad = (state: VesselSliceState) =>
  state.vessel.fitBoundsOnLoad as boolean

export default vesselSlice.reducer
