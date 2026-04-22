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
import { EndpointId, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { resolveVesselPropertyColumn } from '@globalfishingwatch/data-transforms'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { runDatasetMigrations } from '@globalfishingwatch/dataviews-client'

import { selectVesselGroupCompatibleDatasets } from 'features/datasets/datasets.selectors'
import { INCLUDES_RELATED_SELF_REPORTED_INFO_ID } from 'features/vessel/vessel.config'
import { getVesselIdentities } from 'features/vessel/vessel.utils'
import type { IdField } from 'features/vessel-groups/vessel-groups.slice'
import { AsyncReducerStatus } from 'utils/async-slice'

import { getDatasetByIdsThunk } from '../datasets/datasets.slice'

import type { VesselPropertyApiSearch } from './vessel-groups.utils'
import {
  flatVesselGroupSearchVessels,
  mergeVesselGroupVesselIdentities,
  vesselPropertyToApiSearch,
} from './vessel-groups.utils'

export const MAX_VESSEL_GROUP_VESSELS = 1000

export type VesselGroupConfirmationMode = 'save' | 'update' | 'saveAndSeeInWorkspace'

export type VesselGroupVesselIdentity = VesselGroupVessel & { identity?: IdentityVessel }

export type VesselGroupCsvData = Record<string, string>
interface VesselGroupModalState {
  isModalOpen: boolean
  vesselGroupEditId: string | null
  confirmationMode: VesselGroupConfirmationMode
  sources: string[] | null
  name: string
  vessels: VesselGroupVesselIdentity[] | null
  search: {
    idField: IdField | ''
    text: string | ''
    status: AsyncReducerStatus
    error: ParsedAPIError | null
    csvColumns: string[] | null
    csvData: VesselGroupCsvData[] | null
    unmatchedIDs?: string[]
  }
}

type SearchVesselsBody = {
  datasets: string[]
  where?: string
  ids?: string[]
  activeAfter?: string
  activeBefore?: string
}
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
  ids?: string[]
  idField?: IdField
  csvData?: VesselGroupCsvData[]
  csvColumns?: string[]
  transmissionDateFrom?: string
  transmissionDateTo?: string
}

type ParsedSearchInput =
  | { type: 'ids'; property: VesselPropertyApiSearch; values: string[] }
  | { type: 'csv'; rows: { property: VesselPropertyApiSearch; value: string }[][] }

const searchVesselsInVesselGroup = async ({
  datasets,
  signal,
  ids,
  idField = 'vesselId',
  csvData,
  csvColumns,
  transmissionDateFrom,
  transmissionDateTo,
}: SearchVesselsInVGParams): Promise<{
  vessels: VesselGroupVesselIdentity[]
  input?: ParsedSearchInput
}> => {
  if (!datasets) {
    throw new Error('No datasets provided')
  } else if (!ids?.length && !csvData?.length) {
    throw new Error(!ids?.length ? 'No vessel ids provided' : 'No csv data provided')
  }

  const datasetIds = datasets.map((d) => d.id)
  const dataset = datasets[0]
  const url = getAllSearchVesselsUrl(dataset)
  if (!url) {
    throw new Error('Missing search url')
  }
  let whereClauses: string[] = []
  let input: ParsedSearchInput | undefined
  if (ids && idField) {
    const property = vesselPropertyToApiSearch(idField)
    const values = uniq(ids)
    input = { type: 'ids', property, values }
    whereClauses = [`(${values.map((id) => `${property} = "${id}"`).join(' OR ')})`]
  } else if (csvData && csvColumns) {
    const rows = csvData.flatMap((row) => {
      const rowValues = csvColumns.flatMap((column) => {
        const value = row[column]?.trim().replace(/[\\%_]/g, '') || ''
        if (!value) return []
        const resolved = resolveVesselPropertyColumn(column)
        if (!resolved) return []
        return [{ property: vesselPropertyToApiSearch(resolved), value }]
      })
      return rowValues.length ? [rowValues] : []
    })
    input = { type: 'csv', rows }
    whereClauses = [
      `(${rows
        .map((rowValues) =>
          rowValues.map(({ property, value }) => `${property} = "${value}"`).join(' AND ')
        )
        .join(' OR ')})`,
    ]
  }
  if (transmissionDateFrom) {
    whereClauses.push(`transmissionDateFrom < "${transmissionDateFrom}"`)
  } else if (transmissionDateTo) {
    whereClauses.push(`transmissionDateTo > "${transmissionDateTo}"`)
  }
  if (whereClauses.length) {
    const searchResults = await fetchAllSearchVessels({
      url: `${url}`,
      body: {
        datasets: datasetIds,
        where: whereClauses.join(' AND '),
      },
      signal,
    })
    return { vessels: flatVesselGroupSearchVessels(searchResults), input }
  }
  return { vessels: [], input }
}

const getUnmatchedInputs = (
  vessels: VesselGroupVesselIdentity[],
  input: ParsedSearchInput
): string[] => {
  const identities = vessels.flatMap((v) =>
    v.identity
      ? getVesselIdentities(v.identity, { identitySource: VesselIdentitySourceEnum.SelfReported })
      : []
  )
  if (input.type === 'ids') {
    const matched = new Set(identities.map((i) => (i as any)[input.property]).filter(Boolean))
    return input.values.filter((v) => !matched.has(v))
  }
  return input.rows.flatMap((row) => {
    const matched = identities.some((i) =>
      row.every(({ property, value }) => (i as any)[property] === value)
    )
    return matched ? [] : row[0].value
  })
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
  sources: [],
  name: '',
  vessels: null,
  search: {
    idField: 'mmsi',
    text: '',
    status: AsyncReducerStatus.Idle,
    error: null,
    csvColumns: null,
    csvData: null,
  },
}

export const searchVesselGroupsVesselsThunk = createAsyncThunk(
  'vessel-groups/searchVessels',
  async (
    {
      ids,
      idField,
      csvData,
      csvColumns,
      datasets = [],
      transmissionDateFrom,
      transmissionDateTo,
    }: {
      ids?: string[]
      idField?: IdField
      csvData?: VesselGroupCsvData[]
      csvColumns?: string[]
      datasets?: string[]
      transmissionDateFrom?: string
      transmissionDateTo?: string
    },
    { signal, rejectWithValue, getState, dispatch }
  ) => {
    try {
      const state = getState() as any
      const searchDatasets = (selectVesselGroupCompatibleDatasets(state) || []).filter((d) => {
        return datasets?.length ? datasets.includes(d.id) : true
        /*&& d.alias?.some((alias) => alias.includes(':latest'))*/
      })
      let vesselGroupVessels: VesselGroupVesselIdentity[] | undefined
      if ((ids && idField) || (csvData && csvColumns)) {
        const { vessels, input } = await searchVesselsInVesselGroup({
          datasets: searchDatasets,
          signal,
          ids,
          idField,
          csvData,
          csvColumns,
          transmissionDateFrom,
          transmissionDateTo,
        })
        vesselGroupVessels = vessels
        if (input) {
          const unmatchedIDs = getUnmatchedInputs(vessels, input)
          dispatch(setVesselGroupModalUnmatchedIDs(unmatchedIDs))
        }
      }

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
      if (hasOutdatedDatasets) {
        const { vessels } = await searchVesselsInVesselGroup({
          datasets,
          signal,
          ids: vesselGroup.vessels.map((v) => v.vesselId),
        })
        return vessels
      }
      return await getVesselsInVesselGroup({ datasets, signal, vesselGroup })
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
    setVesselGroupModalName: (state, action: PayloadAction<string>) => {
      state.name = action.payload
    },
    setVesselGroupModalSources: (state, action: PayloadAction<string[]>) => {
      state.sources = action.payload
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
    setVesselGroupModalCsvColumns: (state, action: PayloadAction<VesselPropertyApiSearch[]>) => {
      state.search.csvColumns = action.payload
    },
    setVesselGroupModalCsvData: (state, action: PayloadAction<VesselGroupCsvData[]>) => {
      state.search.csvData = action.payload
    },
    setVesselGroupModalUnmatchedIDs: (state, action: PayloadAction<string[]>) => {
      state.search.unmatchedIDs = action.payload
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
      state.vessels = action.payload ? action.payload : null
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
  setVesselGroupModalSources,
  setVesselGroupModalName,
  setVesselGroupModalVessels,
  setVesselGroupModalSearchText,
  setVesselGroupModalCsvColumns,
  setVesselGroupModalCsvData,
  setVesselGroupModalUnmatchedIDs,
  setVesselGroupEditId,
  setVesselGroupConfirmationMode,
  resetVesselGroupModal,
} = vesselGroupModalSlice.actions

export const selectVesselGroupModalOpen = (state: RootState) => state.vesselGroupModal.isModalOpen
export const selectVesselGroupModalSearchIdField = (state: RootState) =>
  state.vesselGroupModal.search.idField
export const selectVesselGroupModalCsvColumns = (state: RootState) =>
  state.vesselGroupModal.search.csvColumns
export const selectVesselGroupModalCsvData = (state: RootState) =>
  state.vesselGroupModal.search.csvData
export const selectVesselGroupModalUnmatchedIDs = (state: RootState) =>
  state.vesselGroupModal.search.unmatchedIDs
export const selectVesselGroupSearchStatus = (state: RootState) =>
  state.vesselGroupModal.search.status
export const selectVesselGroupModalSources = (state: RootState) => state.vesselGroupModal.sources
export const selectVesselGroupModalName = (state: RootState) => state.vesselGroupModal.name
export const selectVesselGroupModalVessels = (state: RootState) => state.vesselGroupModal.vessels
export const selectVesselGroupsModalSearchText = (state: RootState) =>
  state.vesselGroupModal.search.text
export const selectVesselGroupEditId = (state: RootState) =>
  state.vesselGroupModal.vesselGroupEditId
export const selectVesselGroupConfirmationMode = (state: RootState) =>
  state.vesselGroupModal.confirmationMode

export default vesselGroupModalSlice.reducer
