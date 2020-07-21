import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { Workspace } from '@globalfishingwatch/dataviews-client'
import {
  fetchWorkspacesThunk,
  deleteWorkspaceThunk,
  createWorkspaceThunk,
  selectAll,
} from './workspaces.slice'

export const useWorkspacesConnect = () => {
  const dispatch = useDispatch()
  const workspacesList = useSelector(selectAll)
  const fetchWorkspaces = useCallback(() => {
    dispatch(fetchWorkspacesThunk())
  }, [dispatch])
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
  return { workspacesList, fetchWorkspaces, deleteWorkspace, createWorkspace }
}
