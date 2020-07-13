import { createSlice, PayloadAction, Dispatch, createSelector } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { Workspace } from '@globalfishingwatch/dataviews-client'
import { RootState } from 'store/store'

type WorkspaceDataview = { id: number }
type WorkspaceSlice = {
  loading: boolean
  loaded: boolean
  error: string
  current: {
    id: number
    dataviews: WorkspaceDataview[]
  }
  list: Workspace[]
}

const initialState: WorkspaceSlice = {
  loading: false,
  loaded: false,
  error: '',
  current: {
    id: 1,
    dataviews: [] as WorkspaceDataview[],
  },
  list: [] as Workspace[],
}

const slice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspaceLoading: (state) => {
      state.loading = true
      state.loaded = false
    },
    setWorkspaceLoaded: (state) => {
      state.loading = false
      state.loaded = true
      state.error = ''
    },
    setWorkspaceError: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.loaded = false
      state.error = action.payload
    },
    setWorkspaceId: (state, action: PayloadAction<{ id: number }>) => {
      state.current.id = action.payload.id
    },
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.list = action.payload
    },
    toggleDataview: (state, action: PayloadAction<{ editorId: number; added: boolean }>) => {
      const editorId = action.payload.editorId
      if (action.payload.added) {
        state.current.dataviews.push({
          id: editorId,
        })
      } else {
        state.current.dataviews.splice(
          state.current.dataviews.findIndex((d) => d.id === editorId),
          1
        )
      }
    },
  },
})
export const {
  setWorkspaceLoading,
  setWorkspaceLoaded,
  setWorkspaceId,
  setWorkspaces,
  toggleDataview,
} = slice.actions
export default slice.reducer

export const fetchWorkspaces = () => async (dispatch: Dispatch) => {
  const workspaces = await GFWAPI.fetch<Workspace[]>(`/workspaces?include=dataview`)
  dispatch(setWorkspaces(workspaces))
}

// export const fetchWorkspace = ({ id }: { id: string }) => async (dispatch: Dispatch) => {
//   dispatch(setWorkspaceLoading())
//   const workspace = await GFWAPI.fetch<Workspace>(`/workspaces/${id}`)
//   dispatch(setWorkspace(workspace))
//   dispatch(setWorkspaceLoaded())
// }

export const selectWorkspaces = (state: RootState) => state.workspace.list
export const selectWorkspaceId = (state: RootState) => state.workspace.current.id
export const selectWorkspaceDataviews = (state: RootState) => state.workspace.current.dataviews
export const selectCurrentWorkspace = createSelector(
  [selectWorkspaces, selectWorkspaceId],
  (workspaces, currentWorkspaceId) =>
    workspaces.find((workspace) => workspace.id === currentWorkspaceId)
)
export const selectCurrentWorkspaceDataviews = createSelector(
  [selectCurrentWorkspace, selectWorkspaceDataviews],
  (currentWorkspace, dataviews) => {
    if (!currentWorkspace) {
      return dataviews
    }
    return [...currentWorkspace?.dataviewWorkspaces, ...dataviews]
  }
)
