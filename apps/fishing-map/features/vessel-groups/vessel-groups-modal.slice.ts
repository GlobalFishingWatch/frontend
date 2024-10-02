import { createAsyncThunk, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { uniq } from 'es-toolkit'
import { RootState } from 'reducers'
import {
  APIPagination,
  APIVesselSearchPagination,
  DatasetStatus,
  DataviewDatasetConfig,
  EndpointId,
  IdentityVessel,
  VesselGroup,
  VesselGroupVessel,
} from '@globalfishingwatch/api-types'
import { GFWAPI, parseAPIError, ParsedAPIError } from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { INCLUDES_RELATED_SELF_REPORTED_INFO_ID } from 'features/vessel/vessel.config'
import { IdField } from 'features/vessel-groups/vessel-groups.slice'
import { fetchDatasetByIdThunk, selectDatasetById } from '../datasets/datasets.slice'
import {
  flatVesselGroupSearchVessels,
  mergeVesselGroupVesselIdentities,
} from './vessel-groups.utils'

export const MAX_VESSEL_GROUP_VESSELS = 1000

export type VesselGroupConfirmationMode =
  | 'save'
  | 'update'
  | 'saveAndSeeInWorkspace'
  | 'saveAndDeleteVessels'

export type VesselGroupVesselIdentity = VesselGroupVessel & { identity?: IdentityVessel }

interface VesselGroupModalState {
  isModalOpen: boolean
  vesselGroupEditId: string | null
  confirmationMode: VesselGroupConfirmationMode
  vessels: VesselGroupVesselIdentity[] | null
  search: {
    idField: IdField
    ids: string[] | null
    status: AsyncReducerStatus
    error: ParsedAPIError | null
  }
}

type SearchVesselsBody = { datasets: string[]; where?: string; ids?: string[] }
type FetchSearchVessels = { url: string; body?: SearchVesselsBody; signal?: AbortSignal }

const fetchSearchVessels = async ({
  url,
  body,
  signal,
  token,
}: FetchSearchVessels & { token?: string }) => {
  const searchResponse = await GFWAPI.fetch<APIVesselSearchPagination<IdentityVessel>>(
    `${url}${token ? `&since=${token}` : ''}`,
    {
      signal,
      ...(body && {
        method: 'POST',
        body,
      }),
    }
  )
  return searchResponse
}

const SEARCH_PAGINATION = 25
const fetchAllSearchVessels = async (params: FetchSearchVessels) => {
  let searchResults = [] as IdentityVessel[]
  let pendingResults = true
  let paginationToken = ''
  while (pendingResults) {
    const searchResponse = await fetchSearchVessels({ ...params, token: paginationToken })
    searchResults = searchResults.concat(searchResponse.entries)
    if (searchResponse.since && searchResults!?.length < searchResponse.total) {
      paginationToken = searchResponse.since
    } else {
      pendingResults = false
    }
  }
  return searchResults
}

const initialState: VesselGroupModalState = {
  isModalOpen: false,
  vesselGroupEditId: null,
  confirmationMode: 'save',
  vessels: null,
  search: {
    idField: 'mmsi',
    ids: null,
    status: AsyncReducerStatus.Idle,
    error: null,
  },
}

export const searchVesselGroupsVesselsThunk = createAsyncThunk(
  'vessel-groups/searchVessels',
  async (
    { ids, idField, datasets = [] }: { ids: string[]; idField: IdField; datasets?: string[] },
    { signal, rejectWithValue, getState }
  ) => {
    const state = getState() as any
    const searchDatasets = (selectVesselsDatasets(state) || []).filter((d) => {
      const matchesDataset = datasets?.length ? datasets.includes(d.id) : true
      return (
        matchesDataset &&
        d.status !== DatasetStatus.Deleted &&
        d.configuration?.apiSupportedVersions?.includes('v3')
      )
      /*&& d.alias?.some((alias) => alias.includes(':latest'))*/
    })

    if (searchDatasets?.length) {
      const dataset = searchDatasets[0]
      const datasets = searchDatasets.map((d) => d.id)
      const uniqVesselIds = uniq(ids)
      const isVesselByIdSearch = idField === 'vesselId'
      const datasetConfig: DataviewDatasetConfig = {
        endpoint: isVesselByIdSearch ? EndpointId.VesselList : EndpointId.VesselSearch,
        datasetId: '',
        params: [],
        query: [
          { id: 'cache', value: false },
          {
            id: 'includes',
            value: [INCLUDES_RELATED_SELF_REPORTED_INFO_ID],
          },
        ],
      }
      if (isVesselByIdSearch) {
        datasetConfig.query?.push({ id: 'ids', value: uniqVesselIds })
        datasetConfig.query?.push({
          id: 'datasets',
          value: datasets,
        })
      } else {
        datasetConfig.query?.push({
          id: 'limit',
          value: SEARCH_PAGINATION,
        })
      }
      try {
        const url = resolveEndpoint(dataset, datasetConfig)
        if (!url) {
          console.warn('Missing search url')
          return rejectWithValue({
            code: 0,
            message: 'Missing search url',
          })
        }
        const fetchBody = isVesselByIdSearch
          ? undefined
          : {
              datasets,
              where: `${uniqVesselIds
                .map((id) => `${idField === 'mmsi' ? 'ssvid' : idField}='${id}'`)
                .join(' OR ')}`,
            }
        const searchResults = await fetchAllSearchVessels({
          url: `${url}`,
          body: fetchBody,
          signal,
        })

        const vesselGroupVessels = flatVesselGroupSearchVessels(searchResults)
        return vesselGroupVessels
      } catch (e: any) {
        console.warn(e)
        return rejectWithValue(parseAPIError(e))
      }
    } else {
      console.warn('No search datasets found')
      return rejectWithValue({
        code: 0,
        message: 'No search datasets found',
      })
    }
  },
  {
    condition: (_, { getState }) => {
      const workspaceVesselGroupsStatus = (getState() as RootState).vesselGroupModal.search.status
      // Fetched already in progress, don't need to re-fetch
      return workspaceVesselGroupsStatus !== AsyncReducerStatus.Loading
    },
  }
)

export const getVesselInVesselGroupThunk = createAsyncThunk(
  'vessel-groups/getVessels',
  async (
    { vesselGroup }: { vesselGroup: VesselGroup },
    { signal, rejectWithValue, getState, dispatch }
  ) => {
    const state = getState() as any
    const datasets = uniq(vesselGroup.vessels.flatMap((v) => v.dataset || []))
    const datasetId = datasets[0]
    let dataset = selectDatasetById(datasetId)(state)
    if (!dataset) {
      const action = await dispatch(fetchDatasetByIdThunk(datasetId))
      if (fetchDatasetByIdThunk.fulfilled.match(action)) {
        dataset = action.payload
      }
    }
    if (vesselGroup.id && dataset) {
      const datasetConfig: DataviewDatasetConfig = {
        endpoint: EndpointId.VesselList,
        datasetId: '',
        params: [],
        query: [
          {
            id: 'vessel-groups',
            value: vesselGroup.id,
          },
          {
            id: 'cache',
            value: false,
          },
          {
            id: 'includes',
            value: [INCLUDES_RELATED_SELF_REPORTED_INFO_ID],
          },
        ],
      }
      try {
        const url = resolveEndpoint(dataset, datasetConfig)
        if (!url) {
          console.warn('Missing search url')
          return rejectWithValue({
            code: 0,
            message: 'Missing search url',
          })
        }
        const vesselsIdentities = await GFWAPI.fetch<APIPagination<IdentityVessel>>(url, {
          signal,
          cache: 'reload',
        })
        const vesselGroupVessels = mergeVesselGroupVesselIdentities(
          vesselGroup.vessels,
          vesselsIdentities.entries
        )
        return vesselGroupVessels
      } catch (e: any) {
        console.warn(e)
        return rejectWithValue(parseAPIError(e))
      }
    } else {
      console.warn('No search datasets found')
      return rejectWithValue({
        code: 0,
        message: 'No search datasets found',
      })
    }
  },
  {
    condition: (_, { getState }) => {
      const workspaceVesselGroupsStatus = (getState() as RootState).vesselGroupModal.search.status
      // Fetched already in progress, don't need to re-fetch
      return workspaceVesselGroupsStatus !== AsyncReducerStatus.Loading
    },
  }
)

export const vesselGroupModalSlice = createSlice({
  name: 'vesselGroupModal',
  initialState,
  reducers: {
    setVesselGroupsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload
    },
    setVesselGroupSearchIdField: (state, action: PayloadAction<IdField>) => {
      state.search.idField = action.payload
    },
    resetVesselGroupModalSearchStatus: (state) => {
      state.search.status = AsyncReducerStatus.Idle
    },
    setVesselGroupModalVessels: (
      state,
      action: PayloadAction<VesselGroupVesselIdentity[] | null>
    ) => {
      state.vessels = action.payload
    },
    setVesselGroupModalSearchIds: (state, action: PayloadAction<string[] | null>) => {
      state.search.ids = action.payload
    },
    setVesselGroupEditId: (state, action: PayloadAction<string>) => {
      state.vesselGroupEditId = action.payload
    },
    setVesselGroupConfirmationMode: (state, action: PayloadAction<VesselGroupConfirmationMode>) => {
      state.confirmationMode = action.payload
    },
    resetVesselGroupModal: (state) => {
      return { ...initialState }
    },
  },
  extraReducers(builder) {
    builder.addCase(searchVesselGroupsVesselsThunk.pending, (state) => {
      state.search.status = AsyncReducerStatus.Loading
      state.vessels = null
    })
    builder.addCase(searchVesselGroupsVesselsThunk.fulfilled, (state, action) => {
      state.search.status = AsyncReducerStatus.Finished
      state.vessels = action.payload
    })
    builder.addCase(searchVesselGroupsVesselsThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.search.status = AsyncReducerStatus.Idle
      } else {
        state.search.status = AsyncReducerStatus.Error
        state.search.error = action.payload as ParsedAPIError
      }
    })
    builder.addCase(getVesselInVesselGroupThunk.pending, (state) => {
      state.search.status = AsyncReducerStatus.Loading
      state.vessels = null
    })
    builder.addCase(getVesselInVesselGroupThunk.fulfilled, (state, action) => {
      state.search.status = AsyncReducerStatus.Finished
      state.vessels = action.payload
    })
    builder.addCase(getVesselInVesselGroupThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.search.status = AsyncReducerStatus.Idle
      } else {
        state.search.status = AsyncReducerStatus.Error
        state.search.error = action.payload as ParsedAPIError
      }
    })
  },
})

export const {
  setVesselGroupsModalOpen,
  setVesselGroupSearchIdField,
  resetVesselGroupModalSearchStatus,
  setVesselGroupModalVessels,
  setVesselGroupModalSearchIds,
  setVesselGroupEditId,
  setVesselGroupConfirmationMode,
  resetVesselGroupModal,
} = vesselGroupModalSlice.actions

export const selectVesselGroupModalOpen = (state: RootState) => state.vesselGroupModal.isModalOpen
export const selectVesselGroupModalSearchIdField = (state: RootState) =>
  state.vesselGroupModal.search.idField
export const selectVesselGroupSearchStatus = (state: RootState) =>
  state.vesselGroupModal.search.status
export const selectVesselGroupModalVessels = (state: RootState) => state.vesselGroupModal.vessels
export const selectVesselGroupsModalSearchIds = (state: RootState) =>
  state.vesselGroupModal.search.ids
export const selectVesselGroupEditId = (state: RootState) =>
  state.vesselGroupModal.vesselGroupEditId
export const selectVesselGroupConfirmationMode = (state: RootState) =>
  state.vesselGroupModal.confirmationMode

export default vesselGroupModalSlice.reducer
