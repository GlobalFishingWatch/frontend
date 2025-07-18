import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { difference, uniq } from 'es-toolkit'
import type { RootState } from 'reducers'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { GFWAPI, parseAPIError } from '@globalfishingwatch/api-client'
import type {
  APIPagination,
  APIVesselSearchPagination,
  Dataset,
  DataviewDatasetConfig,
  IdentityVessel,
  VesselGroup,
  VesselGroupVessel,
} from '@globalfishingwatch/api-types'
import { EndpointId } from '@globalfishingwatch/api-types'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { runDatasetMigrations } from '@globalfishingwatch/dataviews-client'

import { selectVesselGroupCompatibleDatasets } from 'features/datasets/datasets.selectors'
import { INCLUDES_RELATED_SELF_REPORTED_INFO_ID } from 'features/vessel/vessel.config'
import type { IdField } from 'features/vessel-groups/vessel-groups.slice'
import { AsyncReducerStatus } from 'utils/async-slice'

import { getDatasetByIdsThunk } from '../datasets/datasets.slice'

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
    idField: IdField | ''
    text: string | ''
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

export const SEARCH_PAGINATION = 50
export const getAllSearchVesselsUrl = (dataset: Dataset) => {
  const datasetConfig: DataviewDatasetConfig = {
    endpoint: EndpointId.VesselSearch,
    datasetId: '',
    params: [],
    query: [
      { id: 'cache', value: false },
      {
        id: 'includes',
        value: [INCLUDES_RELATED_SELF_REPORTED_INFO_ID],
      },
      {
        id: 'limit',
        value: SEARCH_PAGINATION,
      },
    ],
  }
  return resolveEndpoint(dataset, datasetConfig)
}
export const fetchAllSearchVessels = async (params: FetchSearchVessels) => {
  let searchResults = [] as IdentityVessel[]
  let pendingResults = true
  let paginationToken = ''
  while (pendingResults) {
    const searchResponse = await fetchSearchVessels({ ...params, token: paginationToken })
    searchResults = searchResults.concat(searchResponse.entries)
    if (searchResponse.since && searchResults?.length < searchResponse.total) {
      paginationToken = searchResponse.since
    } else {
      pendingResults = false
    }
  }
  return searchResults
}

type SearchVesselsInVGParams = {
  datasets: Dataset[]
  signal: AbortSignal
  ids: string[]
  idField?: IdField
}
const searchVesselsInVesselGroup = async ({
  datasets,
  signal,
  ids,
  idField = 'vesselId',
}: SearchVesselsInVGParams) => {
  if (!datasets || !ids?.length) {
    throw new Error(ids ? 'No vessel ids provided' : 'No datasets provided')
  }

  const datasetIds = datasets.map((d) => d.id)
  const dataset = datasets[0]
  const url = getAllSearchVesselsUrl(dataset)
  if (!url) {
    throw new Error('Missing search url')
  }

  const searchKey = idField === 'vesselId' ? 'ids' : idField === 'mmsi' ? 'ssvids' : 'imos'
  const searchResults = await fetchAllSearchVessels({
    url: `${url}`,
    body: { datasets: datasetIds, [searchKey]: uniq(ids) },
    signal,
  })

  const vesselGroupVessels = flatVesselGroupSearchVessels(searchResults)
  return vesselGroupVessels
}

type GetVesselsInVGParams = {
  datasets: Dataset[]
  signal: AbortSignal
  vesselGroup: VesselGroup
}
const getVesselsInVesselGroup = async ({ datasets, signal, vesselGroup }: GetVesselsInVGParams) => {
  if (!datasets || !vesselGroup) {
    throw new Error(vesselGroup ? 'No vessel group provided' : 'No datasets provided')
  }
  const dataset = datasets[0]
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
  const url = resolveEndpoint(dataset, datasetConfig)
  if (!url) {
    throw new Error('Missing search url')
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
}

const initialState: VesselGroupModalState = {
  isModalOpen: false,
  vesselGroupEditId: null,
  confirmationMode: 'save',
  vessels: null,
  search: {
    idField: '',
    text: '',
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
    try {
      const state = getState() as any
      const searchDatasets = (selectVesselGroupCompatibleDatasets(state) || []).filter((d) => {
        return datasets?.length ? datasets.includes(d.id) : true
        /*&& d.alias?.some((alias) => alias.includes(':latest'))*/
      })
      const vesselGroupVessels = await searchVesselsInVesselGroup({
        datasets: searchDatasets,
        signal,
        ids,
        idField,
      })
      return vesselGroupVessels
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
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
  async ({ vesselGroup }: { vesselGroup: VesselGroup }, { signal, rejectWithValue, dispatch }) => {
    const datasetIds = uniq(vesselGroup.vessels.flatMap((v) => v.dataset || []))
    const updatedDatasetsIds = datasetIds.map(runDatasetMigrations)
    const hasOutdatedDatasets = difference(datasetIds, updatedDatasetsIds)?.length > 0
    const getDatasetsAction = await dispatch(
      getDatasetByIdsThunk({ ids: updatedDatasetsIds, includeRelated: false })
    )
    if (!getDatasetByIdsThunk.fulfilled.match(getDatasetsAction)) {
      return rejectWithValue(getDatasetsAction.error)
    }
    const datasets = getDatasetsAction.payload
    if (!datasets?.length) {
      return rejectWithValue({ message: 'No datasets found' })
    }
    try {
      // Vessel groups with outdated datasets doesn't support get by vesselGroupId so need to search by its ids
      const vessels = hasOutdatedDatasets
        ? await searchVesselsInVesselGroup({
            datasets,
            signal,
            ids: vesselGroup.vessels.map((v) => v.vesselId),
          })
        : await getVesselsInVesselGroup({
            datasets,
            signal,
            vesselGroup,
          })
      return vessels
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
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
    setVesselGroupModalSearchText: (state, action: PayloadAction<string>) => {
      state.search.text = action.payload
    },
    setVesselGroupEditId: (state, action: PayloadAction<string>) => {
      state.vesselGroupEditId = action.payload
    },
    setVesselGroupConfirmationMode: (state, action: PayloadAction<VesselGroupConfirmationMode>) => {
      state.confirmationMode = action.payload
    },
    resetVesselGroupModal: () => {
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
  setVesselGroupModalSearchText,
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
export const selectVesselGroupsModalSearchText = (state: RootState) =>
  state.vesselGroupModal.search.text
export const selectVesselGroupEditId = (state: RootState) =>
  state.vesselGroupModal.vesselGroupEditId
export const selectVesselGroupConfirmationMode = (state: RootState) =>
  state.vesselGroupModal.confirmationMode

export default vesselGroupModalSlice.reducer
