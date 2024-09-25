import { createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { uniq, uniqBy } from 'es-toolkit'
import memoize from 'lodash/memoize'
import {
  APIPagination,
  APIVesselSearchPagination,
  DatasetStatus,
  DataviewDatasetConfig,
  EndpointId,
  IdentityVessel,
  VesselGroup,
  VesselGroupUpsert,
  VesselGroupVessel,
} from '@globalfishingwatch/api-types'
import { GFWAPI, FetchOptions, parseAPIError, ParsedAPIError } from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/datasets-client'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import {
  AsyncError,
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { DEFAULT_PAGINATION_PARAMS } from 'data/config'
import { getVesselId } from 'features/vessel/vessel.utils'
import { RootState } from 'store'
import { fetchDatasetByIdThunk, selectDatasetById } from '../datasets/datasets.slice'

export const MAX_VESSEL_GROUP_VESSELS = 1000

// Limitation of the API as we have a limitation of 2000 characters in GET requests
export const MAX_VESSEL_GROUP_SEARCH_VESSELS = 400

export type IdField = 'vesselId' | 'mmsi'
export type VesselGroupConfirmationMode = 'save' | 'saveAndSeeInWorkspace' | 'saveAndDeleteVessels'

interface VesselGroupsState extends AsyncReducer<VesselGroup> {
  isModalOpen: boolean
  vesselGroupEditId: string | null
  currentDataviewIds: string[] | null
  confirmationMode: VesselGroupConfirmationMode
  groupVessels: VesselGroupVessel[] | null
  search: {
    id: IdField
    status: AsyncReducerStatus
    error: ParsedAPIError | null
    vessels: IdentityVessel[] | null
  }
  newSearchVessels: IdentityVessel[] | null
  workspace: {
    status: AsyncReducerStatus
    error: ParsedAPIError | null
    vesselGroups: VesselGroup[] | null
  }
}

const fetchSearchVessels = async (
  url: string,
  { signal, token }: { signal?: AbortSignal; token?: string }
) => {
  const searchResponse = await GFWAPI.fetch<APIVesselSearchPagination<IdentityVessel>>(
    `${url}${token ? `&since=${token}` : ''}`,
    {
      signal,
    }
  )
  return searchResponse
}

const SEARCH_PAGINATION = 25
const fetchAllSearchVessels = async (url: string, signal: AbortSignal) => {
  let searchResults = [] as IdentityVessel[]
  let pendingResults = true
  let paginationToken = ''
  while (pendingResults) {
    const searchResponse = await fetchSearchVessels(url, { signal, token: paginationToken })
    searchResults = searchResults.concat(searchResponse.entries)
    if (searchResponse.since && searchResults!?.length < searchResponse.total) {
      paginationToken = searchResponse.since
    } else {
      pendingResults = false
    }
  }
  return searchResults
}

const initialState: VesselGroupsState = {
  ...asyncInitialState,
  isModalOpen: false,
  vesselGroupEditId: null,
  currentDataviewIds: null,
  confirmationMode: 'save',
  groupVessels: null,
  search: {
    id: 'mmsi',
    status: AsyncReducerStatus.Idle,
    vessels: null,
    error: null,
  },
  newSearchVessels: null,
  workspace: {
    status: AsyncReducerStatus.Idle,
    error: null,
    vesselGroups: null,
  },
}
type VesselGroupSliceState = { vesselGroups: VesselGroupsState }

export const searchVesselGroupsVesselsThunk = createAsyncThunk(
  'vessel-groups/searchVessels',
  async (
    { vessels, idField }: { vessels: VesselGroupVessel[]; idField: IdField },
    { signal, rejectWithValue, getState }
  ) => {
    const state = getState() as any
    const vesselGroupDatasets = uniq(vessels?.flatMap((v) => v.dataset || []))
    const allVesselDatasets = (selectVesselsDatasets(state) || []).filter(
      (d) =>
        d.status !== DatasetStatus.Deleted && d.configuration?.apiSupportedVersions?.includes('v3')
      /*&& d.alias?.some((alias) => alias.includes(':latest'))*/
    )

    const searchDatasets = vesselGroupDatasets?.length
      ? allVesselDatasets.filter((dataset) => vesselGroupDatasets.includes(dataset.id))
      : allVesselDatasets

    if (searchDatasets?.length) {
      const dataset = searchDatasets[0]
      const datasets = searchDatasets.map((d) => d.id)
      const uniqVesselIds = uniq(vessels.map(({ vesselId }) => vesselId))
      const isVesselByIdSearch = idField === 'vesselId'
      const datasetConfig: DataviewDatasetConfig = {
        endpoint: isVesselByIdSearch ? EndpointId.VesselList : EndpointId.VesselSearch,
        datasetId: searchDatasets[0].id,
        params: [],
        query: [
          {
            id: 'datasets',
            value: datasets,
          },
          isVesselByIdSearch
            ? { id: 'ids', value: uniqVesselIds }
            : {
                id: 'where',
                value: encodeURIComponent(
                  `${uniqVesselIds.map((ssvid) => `ssvid='${ssvid}'`).join(' OR ')}`
                ),
              },
        ],
      }
      if (!isVesselByIdSearch) {
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
        const searchResults = await fetchAllSearchVessels(`${url}&cache=false`, signal)
        // API returns multiple instances of the same vessel with the same id and dataset
        const uniqSearchResults = uniqBy(searchResults, (vessel) =>
          [getVesselId(vessel), vessel.dataset].join(',')
        )
        // Searching could return same vessel id from different datasets so we need to choose the original one
        const searchResultsFiltered = isVesselByIdSearch
          ? uniqSearchResults.filter((vessel) => {
              const vesselId = getVesselId(vessel)
              return (
                vessels.find((v) => {
                  const isSameVesselid = v.vesselId === vesselId
                  const isSameDataset = v.dataset ? v.dataset === vessel.dataset : true
                  return isSameVesselid && isSameDataset
                }) !== undefined
              )
            })
          : uniqSearchResults

        return searchResultsFiltered
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
      const workspaceVesselGroupsStatus = (getState() as VesselGroupSliceState).vesselGroups.search
        .status
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
        const vessels = await GFWAPI.fetch<APIPagination<IdentityVessel>>(url, {
          signal,
          cache: 'reload',
        })
        return vessels.entries
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
      const workspaceVesselGroupsStatus = (getState() as VesselGroupSliceState).vesselGroups.search
        .status
      // Fetched already in progress, don't need to re-fetch
      return workspaceVesselGroupsStatus !== AsyncReducerStatus.Loading
    },
  }
)

export const fetchWorkspaceVesselGroupsThunk = createAsyncThunk(
  'workspace-vessel-groups/fetch',
  async (ids: string[] = [], { signal, rejectWithValue, getState }) => {
    const vesselGroupsLoaded = (selectAllVesselGroups(getState() as RootState) || [])?.map(
      (vg) => vg.id
    )
    const vesselGroupsNotLoaded = Array.from(
      new Set(ids.filter((id) => !vesselGroupsLoaded.includes(id)))
    )
    if (!vesselGroupsNotLoaded.length) {
      return []
    }
    try {
      const vesselGroupsParams = {
        ids: vesselGroupsNotLoaded,
        cache: false,
        ...DEFAULT_PAGINATION_PARAMS,
      }
      const vesselGroups = await GFWAPI.fetch<APIPagination<VesselGroup>>(
        `/vessel-groups?${stringify(vesselGroupsParams, { arrayFormat: 'indices' })}`,
        { signal, cache: 'reload' }
      )
      return vesselGroups.entries as VesselGroup[]
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (_, { getState }) => {
      const workspaceVesselGroupsStatus = (getState() as VesselGroupSliceState).vesselGroups
        .workspace.status
      // Fetched already in progress, don't need to re-fetch
      return workspaceVesselGroupsStatus !== AsyncReducerStatus.Loading
    },
  }
)

export const fetchVesselGroupsThunk = createAsyncThunk<
  VesselGroup[],
  { ids: string[] } | undefined
>(
  'vessel-groups/fetch',
  async ({ ids = [] } = {} as { ids: string[] }) => {
    const vesselGroupsParams = {
      ...DEFAULT_PAGINATION_PARAMS,
      cache: false,
      'logged-user': true,
      ...(ids?.length && { ids }),
    }
    const url = `/vessel-groups?${stringify(vesselGroupsParams)}`
    const vesselGroups = await GFWAPI.fetch<APIPagination<VesselGroup>>(url, { cache: 'reload' })
    return vesselGroups.entries
  },
  {
    condition: (_, { getState }) => {
      const vesselGroupsStatus = (getState() as any).vesselGroups.status
      // Fetched already in progress, don't need to re-fetch
      return vesselGroupsStatus !== AsyncReducerStatus.Loading
    },
  }
)

const removeDuplicatedVesselGroupvessels = (vessels: VesselGroupVessel[]) => {
  return uniqBy(vessels, (vessel) => [vessel.vesselId, vessel.dataset].join(','))
}

export const fetchVesselGroupByIdThunk = createAsyncThunk(
  'vessel-groups/fetchById',
  async (vesselGroupId: string) => {
    if (vesselGroupId) {
      const vesselGroup = await GFWAPI.fetch<VesselGroup>(`/vessel-groups/${id}`)
      return vesselGroup
    }
  }
)

export const createVesselGroupThunk = createAsyncThunk(
  'vessel-groups/create',
  async (vesselGroupCreate: VesselGroupUpsert, { dispatch, getState }) => {
    const vesselGroupUpsert: VesselGroupUpsert = {
      ...vesselGroupCreate,
      vessels: removeDuplicatedVesselGroupvessels(vesselGroupCreate.vessels || []),
    }
    const saveVesselGroup: any = async (vesselGroup: VesselGroupUpsert, tries = 0) => {
      let vesselGroupUpdated: VesselGroup
      if (tries < 5) {
        try {
          const name = tries > 0 ? vesselGroupUpsert.name + `_${tries}` : vesselGroupUpsert.name
          vesselGroupUpdated = await GFWAPI.fetch<VesselGroup>('/vessel-groups', {
            method: 'POST',
            body: { ...vesselGroup, name },
          } as FetchOptions<any>)
        } catch (e: any) {
          // Means we already have a workspace with this name
          if (e.status === 422 && e.message.includes('Id') && e.message.includes('duplicated')) {
            return await saveVesselGroup(vesselGroup, tries + 1)
          }
          console.warn('Error creating vessel group', e)
          throw e
        }
        return vesselGroupUpdated
      }
    }
    return await saveVesselGroup(vesselGroupUpsert)
  }
)

export type UpdateVesselGroupThunkParams = VesselGroupUpsert & {
  id: string
}
export const updateVesselGroupThunk = createAsyncThunk(
  'vessel-groups/update',
  async (vesselGroupUpsert: UpdateVesselGroupThunkParams) => {
    const { id, ...rest } = vesselGroupUpsert
    const vesselGroup: VesselGroupUpsert = {
      ...rest,
      vessels: removeDuplicatedVesselGroupvessels(rest.vessels || []),
    }
    const vesselGroupUpdated = await GFWAPI.fetch<VesselGroup>(`/vessel-groups/${id}`, {
      method: 'PATCH',
      body: vesselGroup,
    } as FetchOptions<any>)
    return vesselGroupUpdated
  }
)

export const updateVesselGroupVesselsThunk = createAsyncThunk(
  'vessel-groups/update-vessels',
  async ({ id, vessels = [] }: UpdateVesselGroupThunkParams, { getState, dispatch }) => {
    let vesselGroup = selectVesselGroupById(id)(getState() as any)
    if (!vesselGroup) {
      const action = await dispatch(fetchVesselGroupByIdThunk(id))
      if (fetchVesselGroupByIdThunk.fulfilled.match(action) && action.payload) {
        vesselGroup = action.payload
      }
    }
    if (vesselGroup) {
      return dispatch(
        updateVesselGroupThunk({
          id: vesselGroup.id,
          vessels: [...vesselGroup.vessels, ...vessels],
        })
      )
    }
  }
)

export const deleteVesselGroupThunk = createAsyncThunk<
  VesselGroup,
  string,
  {
    rejectValue: AsyncError
  }
>('vessel-groups/delete', async (id: any, { rejectWithValue }) => {
  try {
    const vesselGroup = await GFWAPI.fetch<VesselGroup>(`/vessel-groups/${id}`, {
      method: 'DELETE',
    })
    return { ...vesselGroup, id }
  } catch (e: any) {
    console.warn(e)
    return rejectWithValue(parseAPIError(e))
  }
})

export const { slice: vesselGroupsSlice, entityAdapter } = createAsyncSlice<
  VesselGroupsState,
  VesselGroup
>({
  name: 'vesselGroups',
  initialState,
  reducers: {
    setVesselGroupsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload
    },
    setVesselGroupSearchId: (state, action: PayloadAction<IdField>) => {
      state.search.id = action.payload
    },
    resetVesselGroupStatus: (state) => {
      state.status = AsyncReducerStatus.Idle
      state.search.status = AsyncReducerStatus.Idle
    },
    setVesselGroupSearchVessels: (state, action: PayloadAction<IdentityVessel[]>) => {
      state.search.vessels = action.payload
    },
    setNewVesselGroupSearchVessels: (state, action: PayloadAction<IdentityVessel[]>) => {
      state.newSearchVessels = action.payload
    },
    setVesselGroupVessels: (state, action: PayloadAction<VesselGroupVessel[]>) => {
      state.groupVessels = action.payload
    },
    setVesselGroupEditId: (state, action: PayloadAction<string>) => {
      state.vesselGroupEditId = action.payload
    },
    setVesselGroupConfirmationMode: (state, action: PayloadAction<VesselGroupConfirmationMode>) => {
      state.confirmationMode = action.payload
    },
    setVesselGroupCurrentDataviewIds: (state, action: PayloadAction<string[]>) => {
      state.currentDataviewIds = action.payload
    },
    resetVesselGroup: (state) => {
      // Dont reset async reducer properties as it contains the list of existing vessel gruops
      const { status, statusId, error, ids, currentRequestIds, entities } = state
      return { ...initialState, ids, entities, status, statusId, error, currentRequestIds }
    },
  },
  extraReducers(builder) {
    builder.addCase(searchVesselGroupsVesselsThunk.pending, (state) => {
      state.search.status = AsyncReducerStatus.Loading
      state.search.vessels = null
    })
    builder.addCase(searchVesselGroupsVesselsThunk.fulfilled, (state, action) => {
      state.search.status = AsyncReducerStatus.Finished
      state.search.vessels = action.payload
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
      state.search.vessels = null
    })
    builder.addCase(getVesselInVesselGroupThunk.fulfilled, (state, action) => {
      state.search.status = AsyncReducerStatus.Finished
      state.search.vessels = action.payload
    })
    builder.addCase(getVesselInVesselGroupThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.search.status = AsyncReducerStatus.Idle
      } else {
        state.search.status = AsyncReducerStatus.Error
        state.search.error = action.payload as ParsedAPIError
      }
    })
    builder.addCase(fetchWorkspaceVesselGroupsThunk.pending, (state) => {
      state.workspace.status = AsyncReducerStatus.Loading
      state.workspace.vesselGroups = null
    })
    builder.addCase(
      fetchWorkspaceVesselGroupsThunk.fulfilled,
      (state, action: PayloadAction<VesselGroup[]>) => {
        state.workspace.status = AsyncReducerStatus.Finished
        state.workspace.vesselGroups = action.payload
      }
    )
    builder.addCase(fetchWorkspaceVesselGroupsThunk.rejected, (state, action) => {
      if (action.error.message === 'Aborted') {
        state.workspace.status = AsyncReducerStatus.Idle
      } else {
        state.workspace.status = AsyncReducerStatus.Error
        state.workspace.error = action.payload as ParsedAPIError
      }
    })
  },
  thunks: {
    fetchThunk: fetchVesselGroupsThunk,
    fetchByIdThunk: fetchVesselGroupByIdThunk,
    updateThunk: updateVesselGroupThunk,
    createThunk: createVesselGroupThunk,
    deleteThunk: deleteVesselGroupThunk,
  },
})

export const {
  resetVesselGroup,
  resetVesselGroupStatus,
  setVesselGroupEditId,
  setVesselGroupVessels,
  setVesselGroupSearchId,
  setVesselGroupsModalOpen,
  setVesselGroupSearchVessels,
  setNewVesselGroupSearchVessels,
  setVesselGroupCurrentDataviewIds,
  setVesselGroupConfirmationMode,
} = vesselGroupsSlice.actions

export const { selectAll: selectAllVesselGroups, selectById } =
  entityAdapter.getSelectors<VesselGroupSliceState>((state) => state.vesselGroups)

export const selectVesselGroupById = memoize((id: string) =>
  createSelector([(state: VesselGroupSliceState) => state], (state) => selectById(state, id))
)

export const selectVesselGroupModalOpen = (state: VesselGroupSliceState) =>
  state.vesselGroups.isModalOpen
export const selectVesselGroupsStatus = (state: VesselGroupSliceState) => state.vesselGroups.status
export const selectWorkspaceVesselGroupsStatus = (state: VesselGroupSliceState) =>
  state.vesselGroups.workspace.status
export const selectWorkspaceVesselGroupsError = (state: VesselGroupSliceState) =>
  state.vesselGroups.workspace.error
export const selectVesselGroupsVessels = (state: VesselGroupSliceState) =>
  state.vesselGroups.groupVessels
export const selectWorkspaceVesselGroups = (state: VesselGroupSliceState) =>
  state.vesselGroups.workspace.vesselGroups
export const selectVesselGroupSearchId = (state: VesselGroupSliceState) =>
  state.vesselGroups.search.id
export const selectVesselGroupSearchStatus = (state: VesselGroupSliceState) =>
  state.vesselGroups.search.status
export const selectVesselGroupSearchVessels = (state: VesselGroupSliceState) =>
  state.vesselGroups.search.vessels
export const selectNewVesselGroupSearchVessels = (state: VesselGroupSliceState) =>
  state.vesselGroups.newSearchVessels
export const selectVesselGroupsStatusId = (state: VesselGroupSliceState) =>
  state.vesselGroups.statusId
export const selectCurrentDataviewIds = (state: VesselGroupSliceState) =>
  state.vesselGroups.currentDataviewIds
export const selectVesselGroupEditId = (state: VesselGroupSliceState) =>
  state.vesselGroups.vesselGroupEditId
export const selectVesselGroupConfirmationMode = (state: VesselGroupSliceState) =>
  state.vesselGroups.confirmationMode

export default vesselGroupsSlice.reducer
