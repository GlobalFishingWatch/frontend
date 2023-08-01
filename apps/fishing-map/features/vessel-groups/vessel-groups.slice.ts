import { createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { stringify } from 'qs'
import { memoize, uniq, uniqBy } from 'lodash'
import {
  APIPagination,
  DatasetStatus,
  DataviewDatasetConfig,
  EndpointId,
  IdentityVessel,
  VesselGroup,
  VesselGroupUpsert,
  VesselGroupVessel,
} from '@globalfishingwatch/api-types'
import { GFWAPI, FetchOptions, parseAPIError, ParsedAPIError } from '@globalfishingwatch/api-client'
import { resolveEndpoint } from '@globalfishingwatch/dataviews-client'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import {
  AsyncError,
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'utils/async-slice'
import { DEFAULT_PAGINATION_PARAMS } from 'data/config'
import { selectAllSearchDatasetsByType } from 'features/search/search.selectors'
import { DEFAULT_VESSEL_IDENTITY_ID } from 'features/vessel/vessel.config'
import { selectDatasetById } from '../datasets/datasets.slice'

export const MAX_VESSEL_GROUP_VESSELS = 1000

export type IdField = 'vesselId' | 'mmsi'
export type VesselGroupConfirmationMode = 'save' | 'saveAndNavigate'

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
    // const vesselGroupDatasets = uniq(vessels?.flatMap((v) => v.dataset || []))
    // const allVesselDatasets = selectVesselsDatasets(state)
    // const advancedSearchDatasets = (selectAllSearchDatasetsByType('advanced')(state) || []).filter(
    //   (d) =>
    //     d.status !== DatasetStatus.Deleted && d.alias?.some((alias) => alias.includes(':latest'))
    // )
    // const vesselDatasetsByType = idField === 'vesselId' ? allVesselDatasets : advancedSearchDatasets
    // const searchDatasets = vesselGroupDatasets?.length
    //   ? vesselDatasetsByType.filter((dataset) => vesselGroupDatasets.includes(dataset.id))
    //   : vesselDatasetsByType
    const allVesselDatasets = selectVesselsDatasets(state)
    const searchDatasets = allVesselDatasets.filter((d) => d.id === DEFAULT_VESSEL_IDENTITY_ID)

    if (searchDatasets?.length) {
      const dataset = searchDatasets[0]
      const datasets = searchDatasets.map((d) => d.id)
      const uniqVesselIds = uniq(vessels.map(({ vesselId }) => vesselId))
      const advancedSearchQuery = encodeURIComponent(
        `${idField} IN ('${uniqVesselIds.join("','")}')`
      )
      const datasetConfig: DataviewDatasetConfig = {
        endpoint: idField === 'vesselId' ? EndpointId.VesselList : EndpointId.VesselAdvancedSearch,
        datasetId: searchDatasets[0].id,
        params: [],
        query: [
          {
            id: 'datasets',
            value: datasets,
          },
          idField === 'vesselId'
            ? { id: 'ids', value: uniqVesselIds }
            : {
                id: 'query',
                value: advancedSearchQuery,
              },
        ],
      }
      if (idField === 'mmsi') {
        datasetConfig.query?.push({
          id: 'limit',
          value: DEFAULT_PAGINATION_PARAMS.limit,
        })
        datasetConfig.query?.push({
          id: 'offset',
          value: DEFAULT_PAGINATION_PARAMS.offset,
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
        const searchResults = await GFWAPI.fetch<APIPagination<IdentityVessel>>(
          `${url}&cache=false`,
          { signal }
        )
        // API returns multiple instances of the same vessel with the same id and dataset
        const uniqSearchResults = uniqBy(searchResults.entries, (vessel) =>
          [vessel?.registryInfo?.[0]?.id, vessel.dataset].join(',')
        )
        // Searching could return same vessel id from different datasets so we need to choose the original one
        const searchResultsFiltered =
          idField === 'vesselId'
            ? uniqSearchResults.filter((vessel) => {
                const vesselId = vessel?.registryInfo?.[0]?.id
                return (
                  vessels.find((v) => v.vesselId === vesselId && v.dataset === vessel.dataset) !==
                  undefined
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
  async ({ vesselGroup }: { vesselGroup: VesselGroup }, { signal, rejectWithValue, getState }) => {
    const state = getState() as any
    // const datasets = uniq(vesselGroup.vessels.flatMap((v) => v.dataset || []))
    // TODO remove once the api replaces the lecagy old datasets
    const datasets = [DEFAULT_VESSEL_IDENTITY_ID]
    const dataset = selectDatasetById(DEFAULT_VESSEL_IDENTITY_ID)(state)

    if (vesselGroup.id && dataset) {
      const datasetConfig: DataviewDatasetConfig = {
        endpoint: EndpointId.VesselList,
        datasetId: dataset.id,
        params: [],
        query: [
          {
            id: 'datasets',
            value: datasets,
          },
          {
            id: 'vessel-groups',
            value: vesselGroup.id,
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
        const vessels = await GFWAPI.fetch<APIPagination<IdentityVessel>>(url, { signal })
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
  async (ids: string[] = [], { signal, rejectWithValue }) => {
    try {
      const vesselGroupsParams = {
        ...(ids?.length && { ids }),
        cache: false,
        ...DEFAULT_PAGINATION_PARAMS,
      }
      const vesselGroups = await GFWAPI.fetch<APIPagination<VesselGroup>>(
        `/vessel-groups?${stringify(vesselGroupsParams, { arrayFormat: 'comma' })}`,
        { signal }
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

export const fetchUserVesselGroupsThunk = createAsyncThunk(
  'vessel-groups/fetch',
  async () => {
    const vesselGroupsParams = {
      ...DEFAULT_PAGINATION_PARAMS,
      'logged-user': true,
    }
    const url = `/vessel-groups?${stringify(vesselGroupsParams)}`
    const vesselGroups = await GFWAPI.fetch<APIPagination<VesselGroup>>(url)
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

export const createVesselGroupThunk = createAsyncThunk(
  'vessel-groups/create',
  async (vesselGroupCreate: VesselGroupUpsert, { dispatch, getState }) => {
    const vesselGroupUpsert: VesselGroupUpsert = {
      ...vesselGroupCreate,
      vessels: removeDuplicatedVesselGroupvessels(vesselGroupCreate.vessels),
    }
    const saveVesselGroup = async (vesselGroup: VesselGroupUpsert, tries = 0) => {
      let vesselGroupUpdated
      if (tries < 2) {
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

export const updateVesselGroupThunk = createAsyncThunk(
  'vessel-groups/update',
  async (vesselGroupUpsert: VesselGroupUpsert & { id: string }) => {
    const { id, ...rest } = vesselGroupUpsert
    const url = `/vessel-groups/${id}`
    const vesselGroup: VesselGroupUpsert = {
      ...rest,
      vessels: removeDuplicatedVesselGroupvessels(rest.vessels),
    }
    const vesselGroupUpdated = await GFWAPI.fetch<VesselGroup>(url, {
      method: 'PATCH',
      body: vesselGroup,
    } as FetchOptions<any>)
    return vesselGroupUpdated
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
    resetVesselGroup: () => {
      return initialState
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
    fetchThunk: fetchUserVesselGroupsThunk,
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
