import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import memoize from 'lodash/memoize'
import { stringify } from 'qs'
import { Workspace } from '@globalfishingwatch/api-types'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  AsyncReducerStatus,
  asyncInitialState,
  AsyncReducer,
  createAsyncSlice,
  AsyncError,
} from 'utils/async-slice'
import { RootState } from 'store'
import { APP_NAME } from 'data/config'
import { WorkspaceState } from 'types'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategories } from 'data/workspaces'
import { getDefaultWorkspace } from 'features/workspace/workspace.slice'
import { loadSpreadsheetDoc } from 'utils/spreadsheet'

type AppWorkspace = Workspace<WorkspaceState, WorkspaceCategories>

type fetchWorkspacesThunkParams = {
  app?: string
  ids?: string[]
  userId?: number
}
export const fetchWorkspacesThunk = createAsyncThunk(
  'workspaces/fetch',
  async ({ app = APP_NAME, ids, userId }: fetchWorkspacesThunkParams) => {
    const workspacesParams = { app, ids, ownerId: userId }
    const workspaces = await GFWAPI.fetch<AppWorkspace[]>(
      `/v1/workspaces?${stringify(workspacesParams, { arrayFormat: 'comma' })}`
    )

    if (ids?.includes(DEFAULT_WORKSPACE_ID)) {
      const defaultWorkspace = await getDefaultWorkspace()
      return [...workspaces, defaultWorkspace]
    }
    return workspaces
  }
)

export type HighlightedWorkspace = {
  id: string
  name: string
  description: string
  img?: string
  cta?: string
}

const WORKSPACES_SPREADSHEET_ID = process.env.REACT_APP_WORKSPACES_SPREADSHEET_ID

export const fetchHighlightWorkspacesThunk = createAsyncThunk(
  'workspaces/fetchHighlighted',
  async (_, { dispatch }) => {
    const workspacesSpreadsheetDoc = await loadSpreadsheetDoc(WORKSPACES_SPREADSHEET_ID as string)
    const workspaces = await Promise.all(
      workspacesSpreadsheetDoc.sheetsByIndex
        .filter((sheet) =>
          Object.values(WorkspaceCategories).includes(sheet.title as WorkspaceCategories)
        )
        .map(async (sheet) => {
          const rows = await sheet.getRows()
          return {
            title: sheet.title as WorkspaceCategories,
            workspaces: rows.map((row) => ({
              name: row.name,
              description: row.description,
              img: row.img,
              cta: row.cta,
              id: row.id,
            })),
          }
        })
    )

    const workspacesIds = workspaces.flatMap(({ workspaces }) =>
      workspaces.flatMap(({ id }) => id || [])
    )

    dispatch(fetchWorkspacesThunk({ ids: workspacesIds }))
    return workspaces
  }
)

export const updateWorkspaceThunk = createAsyncThunk<
  Workspace,
  Partial<Workspace>,
  {
    rejectValue: AsyncError
  }
>(
  'workspaces/update',
  async (workspace, { rejectWithValue }) => {
    try {
      const updatedWorkspace = await GFWAPI.fetch<Workspace>(`/v1/workspaces/${workspace.id}`, {
        method: 'PATCH',
        body: { ...workspace } as any,
      })
      return updatedWorkspace
    } catch (e) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
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
    const workspace = await GFWAPI.fetch<Workspace>(`/v1/workspaces/${id}`, {
      method: 'DELETE',
    })
    return { ...workspace, id }
  } catch (e) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

export interface WorkspacesState extends AsyncReducer<AppWorkspace> {
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

const { slice: workspacesSlice, entityAdapter } = createAsyncSlice<WorkspacesState, AppWorkspace>({
  name: 'workspaces',
  initialState,
  thunks: {
    fetchThunk: fetchWorkspacesThunk,
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
    builder.addCase(fetchHighlightWorkspacesThunk.rejected, (state) => {
      state.highlighted.status = AsyncReducerStatus.Error
    })
  },
})

export const { selectAll: selectWorkspaces, selectById } = entityAdapter.getSelectors<RootState>(
  (state) => state.workspaces
)

export const selectWorkspaceListStatus = (state: RootState) => state.workspaces.status
export const selectWorkspaceListStatusId = (state: RootState) => state.workspaces.statusId
export const selectHighlightedWorkspaces = (state: RootState) => state.workspaces.highlighted.data
export const selectHighlightedWorkspacesStatus = (state: RootState) =>
  state.workspaces.highlighted.status

export const selectWorkspaceById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => selectById(state, id))
)

export default workspacesSlice.reducer
