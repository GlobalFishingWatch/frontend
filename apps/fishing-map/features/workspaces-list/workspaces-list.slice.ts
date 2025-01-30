import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import kebabCase from 'lodash/kebabCase'
import memoize from 'lodash/memoize'
import { stringify } from 'qs'

import {
  GFWAPI,
  parseAPIError,
  parseAPIErrorMessage,
  parseAPIErrorStatus,
} from '@globalfishingwatch/api-client'
import type { APIPagination, Workspace } from '@globalfishingwatch/api-types'
import { WORKSPACE_PUBLIC_ACCESS } from '@globalfishingwatch/api-types'

import { APP_NAME, DEFAULT_PAGINATION_PARAMS } from 'data/config'
import type { WorkspaceCategory } from 'data/workspaces'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { getDefaultWorkspace } from 'features/workspace/workspace.slice'
import type { WorkspaceState } from 'types'
import type { AsyncError,AsyncReducer } from 'utils/async-slice'
import { asyncInitialState, AsyncReducerStatus, createAsyncSlice } from 'utils/async-slice'

export type AppWorkspace = Workspace<WorkspaceState, WorkspaceCategory>

type FetchWorkspacesThunkParams = {
  app?: string
  ids?: string[]
  userId?: number
}
export const fetchWorkspacesThunk = createAsyncThunk<
  Workspace[],
  FetchWorkspacesThunkParams,
  {
    rejectValue: AsyncError
  }
>(
  'workspaces/fetch',
  async ({ app = APP_NAME, ids, userId } = {}, { getState, rejectWithValue }) => {
    const state = getState() as any
    const defaultWorkspaceLoaded = selectWorkspaceById(DEFAULT_WORKSPACE_ID)(state) !== undefined
    const workspacesParams = {
      app,
      ids,
      ...(!ids?.length && { 'logged-user-or-gfw': true }),
      ...DEFAULT_PAGINATION_PARAMS,
    }
    try {
      const workspaces = await GFWAPI.fetch<APIPagination<AppWorkspace>>(
        `/workspaces?${stringify(workspacesParams, { arrayFormat: 'comma' })}`
      )

      if (ids?.includes(DEFAULT_WORKSPACE_ID) && !defaultWorkspaceLoaded) {
        const defaultWorkspace = await getDefaultWorkspace()
        return [...workspaces.entries, defaultWorkspace]
      }
      return workspaces.entries
    } catch (e: any) {
      console.warn(e)
      return rejectWithValue({
        status: parseAPIErrorStatus(e),
        message: `${ids || userId} - ${parseAPIErrorMessage(e)}`,
      })
    }
  }
)

const fetchDefaultWorkspaceThunk = createAsyncThunk<Workspace>(
  'workspaces/fetchDefault',
  async () => {
    const defaultWorkspace = await getDefaultWorkspace()
    return defaultWorkspace
  }
)

export type HighlightedWorkspace = {
  id: string
  name: {
    en: string
    es?: string
    fr?: string
    id?: string
    pt?: string
  }
  description: {
    en: string
    es?: string
    fr?: string
    id?: string
    pt?: string
  }
  cta: {
    en: string
    es?: string
    fr?: string
    id?: string
    pt?: string
  }
  img?: string
  userGroup?: string
  reportUrl?: string
  visible?: 'visible' | 'hidden'
}

type HighlightedWorkspaces = {
  title: string
  workspaces: HighlightedWorkspace[]
}

const WORKSPACES_APP = 'fishing-map'

export const fetchHighlightWorkspacesThunk = createAsyncThunk(
  'workspaces/fetchHighlighted',
  async (_, { dispatch }) => {
    const workspaces = await GFWAPI.fetch<APIPagination<HighlightedWorkspaces>>(
      `/highlighted-workspaces/${WORKSPACES_APP}`
    )

    const workspacesIds = workspaces.entries.flatMap(({ workspaces }) => {
      return workspaces.flatMap(({ id, visible }) => (visible === 'visible' && id) || [])
    })

    dispatch(fetchWorkspacesThunk({ ids: workspacesIds }))
    return workspaces.entries
  }
)

export const createWorkspaceThunk = createAsyncThunk<
  Workspace,
  Partial<Workspace>,
  {
    rejectValue: AsyncError
  }
>('workspaces/create', async (workspace, { rejectWithValue }) => {
  const id = kebabCase(workspace.name)
  const parsedWorkspace = {
    ...workspace,
    id: workspace.viewAccess === WORKSPACE_PUBLIC_ACCESS ? `${id}-public` : id,
  }
  try {
    const newWorkspace = await GFWAPI.fetch<Workspace>(`/workspaces`, {
      method: 'POST',
      body: parsedWorkspace as any,
    })
    return newWorkspace
  } catch (e: any) {
    return rejectWithValue(parseAPIError(e))
  }
})

export const updateWorkspaceThunk = createAsyncThunk<
  AppWorkspace,
  Partial<AppWorkspace> & { id: string; password?: string; newPassword?: string },
  {
    rejectValue: AsyncError
  }
>(
  'workspaces/update',
  async (workspace, { rejectWithValue }) => {
    try {
      const { id, password, newPassword, ...rest } = workspace
      const updatedWorkspace = await GFWAPI.fetch<AppWorkspace>(`/workspaces/${id}`, {
        method: 'PATCH',
        body: newPassword ? { ...rest, editAccess: workspace.editAccess, newPassword } : rest,
        ...(password && {
          headers: {
            'x-workspace-password': password,
          },
        }),
      })
      return updatedWorkspace
    } catch (e: any) {
      return rejectWithValue(parseAPIError(e))
    }
  },
  {
    condition: (partialWorkspace) => {
      if (!partialWorkspace || !partialWorkspace.id) {
        console.warn('To update the workspace you need the id')
        return false
      }
    },
  }
)

export const deleteWorkspaceThunk = createAsyncThunk<
  Workspace,
  string,
  {
    rejectValue: AsyncError
  }
>('workspaces/delete', async (id: string, { rejectWithValue }) => {
  try {
    const workspace = await GFWAPI.fetch<Workspace>(`/workspaces/${id}`, {
      method: 'DELETE',
    })
    return { ...workspace, id }
  } catch (e: any) {
    return rejectWithValue(parseAPIError(e))
  }
})

interface WorkspacesState extends AsyncReducer<AppWorkspace> {
  highlighted: {
    status: AsyncReducerStatus
    data: { title: string; workspaces: HighlightedWorkspace[] }[] | undefined
  }
}

const initialState: WorkspacesState = {
  ...asyncInitialState,
  highlighted: {
    status: AsyncReducerStatus.Idle,
    data: undefined,
  },
}

type WorkspaceSliceState = { workspaces: WorkspacesState }

const { slice: workspacesSlice, entityAdapter } = createAsyncSlice<WorkspacesState, AppWorkspace>({
  name: 'workspaces',
  initialState,
  thunks: {
    fetchThunk: fetchWorkspacesThunk,
    fetchByIdThunk: fetchDefaultWorkspaceThunk,
    createThunk: createWorkspaceThunk,
    updateThunk: updateWorkspaceThunk,
    deleteThunk: deleteWorkspaceThunk,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHighlightWorkspacesThunk.pending, (state) => {
      state.highlighted.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchHighlightWorkspacesThunk.fulfilled, (state, action) => {
      state.highlighted.status = AsyncReducerStatus.Finished
      state.highlighted.data = action.payload
    })
    builder.addCase(fetchHighlightWorkspacesThunk.rejected, (state, action) => {
      state.highlighted.status = AsyncReducerStatus.Error
    })
  },
})

export const { selectAll, selectById } = entityAdapter.getSelectors<WorkspaceSliceState>(
  (state) => state.workspaces
)

export function selectWorkspaces(state: WorkspaceSliceState) {
  return selectAll(state)
}
export const selectWorkspaceListStatus = (state: WorkspaceSliceState) => state.workspaces.status
export const selectWorkspaceListStatusId = (state: WorkspaceSliceState) => state.workspaces.statusId
export const selectHighlightedWorkspaces = (state: WorkspaceSliceState) =>
  state.workspaces.highlighted.data
export const selectHighlightedWorkspacesStatus = (state: WorkspaceSliceState) =>
  state.workspaces.highlighted.status

const selectWorkspaceById = memoize((id: string) =>
  createSelector([(state: WorkspaceSliceState) => state], (state) => selectById(state, id))
)

export default workspacesSlice.reducer
