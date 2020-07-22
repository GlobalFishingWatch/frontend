import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { Workspace } from '@globalfishingwatch/dataviews-client'
import {
  fetchWorkspacesThunk,
  deleteWorkspaceThunk,
  createWorkspaceThunk,
  selectAll,
  selectShared,
  fetchWorkspaceByIdThunk,
  selectCurrentWorkspace,
} from './workspaces.slice'

export const useWorkspacesConnect = () => {
  const dispatch = useDispatch()
  const workspacesList = useSelector(selectAll)
  const workspace = useSelector(selectCurrentWorkspace)
  const workspacesSharedList = useSelector(selectShared)

  const fetchWorkspaces = useCallback(() => {
    dispatch(fetchWorkspacesThunk())
  }, [dispatch])

  const fetchWorkspaceById = useCallback(
    (id: number) => {
      dispatch(fetchWorkspaceByIdThunk(id))
    },
    [dispatch]
  )

  const deleteWorkspace = useCallback(
    (id: number) => {
      dispatch(deleteWorkspaceThunk(id))
    },
    [dispatch]
  )
  const createWorkspace = useCallback(
    (workspace: Partial<Workspace>) => {
      dispatch(createWorkspaceThunk(workspace))
    },
    [dispatch]
  )
  return {
    workspace,
    workspacesList,
    workspacesSharedList,
    fetchWorkspaces,
    fetchWorkspaceById,
    deleteWorkspace,
    createWorkspace,
  }
}
