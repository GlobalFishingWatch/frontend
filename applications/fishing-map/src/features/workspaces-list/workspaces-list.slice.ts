import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import memoize from 'lodash/memoize'
import { stringify } from 'qs'
import kebabCase from 'lodash/kebabCase'
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
export const fetchWorkspacesThunk = createAsyncThunk<
  Workspace[],
  fetchWorkspacesThunkParams,
  {
    rejectValue: AsyncError
  }
>('workspaces/fetch', async ({ app = APP_NAME, ids, userId }, { getState, rejectWithValue }) => {
  const state = getState() as RootState
  const defaultWorkspaceLoaded = selectWorkspaceById(DEFAULT_WORKSPACE_ID)(state) !== undefined
  const workspacesParams = { app, ids, ownerId: userId }
  try {
    const workspaces = await GFWAPI.fetch<AppWorkspace[]>(
      `/v1/workspaces?${stringify(workspacesParams, { arrayFormat: 'comma' })}`
    )

    if (ids?.includes(DEFAULT_WORKSPACE_ID) && !defaultWorkspaceLoaded) {
      const defaultWorkspace = await getDefaultWorkspace()
      return [...workspaces, defaultWorkspace]
    }
    return workspaces
  } catch (e) {
    return rejectWithValue({
      status: e.status || e.code,
      message: `${ids || userId} - ${e.message}`,
    })
  }
})

export const fetchDefaultWorkspaceThunk = createAsyncThunk<Workspace>(
  'workspaces/fetchDefault',
  async () => {
    const defaultWorkspace = await getDefaultWorkspace()
    return defaultWorkspace
  }
)

export type HighlightedWorkspace = {
  id: string
  name: string
  name_es?: string
  name_fr?: string
  name_id?: string
  description: string
  description_es?: string
  description_fr?: string
  description_id?: string
  cta?: string
  cta_es?: string
  cta_fr?: string
  cta_id?: string
  img?: string
  userGroup?: string
  visible?: 'visible' | 'hidden'
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
              visible: row.visible,
              id: row.id,
              img: row.img,
              userGroup: row.userGroup,
              name: row.name,
              name_es: row.name_es,
              name_fr: row.name_fr,
              name_id: row.name_id,
              description: row.description,
              description_es: row.description_es,
              description_fr: row.description_fr,
              description_id: row.description_id,
              cta: row.cta,
              cta_es: row.cta_es,
              cta_fr: row.cta_fr,
              cta_id: row.cta_id,
            })),
          }
        })
    )

    const workspacesIds = workspaces.flatMap(({ workspaces }) =>
      workspaces.flatMap(({ id, visible }) => (visible === 'visible' && id) || [])
    )

    dispatch(fetchWorkspacesThunk({ ids: workspacesIds }))
    return workspaces
  }
)

export const createWorkspaceThunk = createAsyncThunk<
  Workspace,
  Partial<Workspace>,
  {
    rejectValue: AsyncError
  }
>(
  'workspaces/create',
  async (workspace, { rejectWithValue }) => {
    const parsedWorkspace = {
      ...workspace,
      id: kebabCase(workspace.name),
      public: true,
      dataviews: Array.isArray(workspace.dataviews)
        ? workspace.dataviews.map(({ id }) => id)
        : workspace.dataviews,
    }
    try {
      const newWorkspace = await GFWAPI.fetch<Workspace>(`/v1/workspaces`, {
        method: 'POST',
        body: parsedWorkspace as any,
      })
      return newWorkspace
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
